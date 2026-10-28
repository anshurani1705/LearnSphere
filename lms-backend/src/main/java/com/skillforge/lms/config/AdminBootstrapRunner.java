package com.skillforge.lms.config;

import com.skillforge.lms.entity.User;
import com.skillforge.lms.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

@Component
@Slf4j
public class AdminBootstrapRunner implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AppProperties appProperties;

    public AdminBootstrapRunner(UserRepository userRepository, PasswordEncoder passwordEncoder, AppProperties appProperties) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.appProperties = appProperties;
    }

    @Override
    public void run(String... args) {
        String email = appProperties.getAdmin().getBootstrapEmail();
        String password = appProperties.getAdmin().getBootstrapPassword();

        if (StringUtils.hasText(email) && StringUtils.hasText(password)) {
            String cleanEmail = email.toLowerCase().trim();
            userRepository.findByEmail(cleanEmail).ifPresentOrElse(
                    existingAdmin -> {
                        existingAdmin.setPasswordHash(passwordEncoder.encode(password));
                        existingAdmin.setRole(User.Role.ADMIN);
                        existingAdmin.setEnabled(true);
                        existingAdmin.setEmailVerified(true);
                        userRepository.save(existingAdmin);
                        log.info("Ensured bootstrap administrator credentials for: '{}'", cleanEmail);
                    },
                    () -> {
                        User admin = User.builder()
                                .email(cleanEmail)
                                .passwordHash(passwordEncoder.encode(password))
                                .fullName("System Administrator")
                                .role(User.Role.ADMIN)
                                .enabled(true)
                                .emailVerified(true)
                                .build();
                        userRepository.save(admin);
                        log.info("Initialized bootstrap administrator account for: '{}'", cleanEmail);
                    }
            );
        }
    }
}
