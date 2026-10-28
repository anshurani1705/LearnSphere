package com.skillforge.lms.service.impl;

import com.skillforge.lms.dto.admin.CoursePerformanceDto;
import com.skillforge.lms.dto.admin.DashboardStatsDto;
import com.skillforge.lms.dto.admin.RecentOrderDto;
import com.skillforge.lms.dto.certificate.CertificateDto;
import com.skillforge.lms.dto.quiz.QuizDto;
import com.skillforge.lms.entity.*;
import com.skillforge.lms.exception.ResourceNotFoundException;
import com.skillforge.lms.repository.*;
import com.skillforge.lms.service.AdminService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
public class AdminServiceImpl implements AdminService {

    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final OrderRepository orderRepository;
    private final CertificateRepository certificateRepository;
    private final NotificationLogRepository notificationLogRepository;
    private final AuditLogRepository auditLogRepository;
    private final QuizRepository quizRepository;

    public AdminServiceImpl(UserRepository userRepository,
                            CourseRepository courseRepository,
                            EnrollmentRepository enrollmentRepository,
                            OrderRepository orderRepository,
                            CertificateRepository certificateRepository,
                            NotificationLogRepository notificationLogRepository,
                            AuditLogRepository auditLogRepository,
                            QuizRepository quizRepository) {
        this.userRepository = userRepository;
        this.courseRepository = courseRepository;
        this.enrollmentRepository = enrollmentRepository;
        this.orderRepository = orderRepository;
        this.certificateRepository = certificateRepository;
        this.notificationLogRepository = notificationLogRepository;
        this.auditLogRepository = auditLogRepository;
        this.quizRepository = quizRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public DashboardStatsDto getDashboardStats() {
        long totalCourses = courseRepository.count();
        long publishedCourses = courseRepository.countByStatus(Course.CourseStatus.PUBLISHED);
        long draftCourses = courseRepository.countByStatus(Course.CourseStatus.DRAFT);
        long unpublishedCourses = courseRepository.countByStatus(Course.CourseStatus.UNPUBLISHED);
        long archivedCourses = courseRepository.countByStatus(Course.CourseStatus.ARCHIVED);

        long totalStudents = userRepository.countByRole(User.Role.STUDENT);
        long totalEnrollments = enrollmentRepository.count();
        long totalOrders = orderRepository.count();
        long pendingPayments = orderRepository.countByStatus(Order.OrderStatus.PENDING);
        long capturedPayments = orderRepository.countByStatus(Order.OrderStatus.PAID);
        long totalCerts = certificateRepository.count();

        // Calculate total real revenue from PAID orders (strictly excludes MOCK transactions)
        List<Order> allPaidOrders = orderRepository.findAll().stream()
                .filter(o -> o.getStatus() == Order.OrderStatus.PAID)
                .collect(Collectors.toList());

        BigDecimal totalRevenue = allPaidOrders.stream()
                .filter(o -> o.getProvider() != com.skillforge.lms.payment.PaymentProviderType.MOCK)
                .map(Order::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Calculate separate mock revenue for development visibility
        BigDecimal mockRevenue = allPaidOrders.stream()
                .filter(o -> o.getProvider() == com.skillforge.lms.payment.PaymentProviderType.MOCK)
                .map(Order::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Fetch recent orders directly from MySQL
        Pageable recentOrderPage = PageRequest.of(0, 8, Sort.by(Sort.Direction.DESC, "createdAt"));
        List<RecentOrderDto> recentOrders = orderRepository.findAll(recentOrderPage).getContent().stream()
                .map(o -> RecentOrderDto.builder()
                        .orderId(o.getId())
                        .orderNumber(o.getOrderNumber())
                        .studentName(o.getUser() != null ? o.getUser().getFullName() : "Unknown")
                        .studentEmail(o.getUser() != null ? o.getUser().getEmail() : "N/A")
                        .courseTitle(o.getCourse() != null ? o.getCourse().getTitle() : "Unknown Course")
                        .amount(o.getAmount())
                        .currency(o.getCurrency())
                        .status(o.getStatus().name())
                        .provider(o.getProvider() != null ? o.getProvider().name() : "RAZORPAY")
                        .paymentMode(o.getPaymentMode() != null ? o.getPaymentMode().name() : "TEST")
                        .createdAt(o.getCreatedAt())
                        .build())
                .collect(Collectors.toList());

        // Calculate real course performance statistics from MySQL
        List<CoursePerformanceDto> coursePerformance = courseRepository.findAll().stream()
                .map(c -> {
                    BigDecimal courseRevenue = allPaidOrders.stream()
                            .filter(o -> o.getCourse() != null && o.getCourse().getId().equals(c.getId()))
                            .map(Order::getAmount)
                            .reduce(BigDecimal.ZERO, BigDecimal::add);

                    return CoursePerformanceDto.builder()
                            .courseId(c.getId())
                            .title(c.getTitle())
                            .price(c.getPrice())
                            .status(c.getStatus().name())
                            .category(c.getCategory())
                            .enrollmentCount(c.getEnrollmentCount())
                            .totalRevenue(courseRevenue)
                            .build();
                })
                .sorted((a, b) -> Integer.compare(b.getEnrollmentCount(), a.getEnrollmentCount()))
                .collect(Collectors.toList());

        return DashboardStatsDto.builder()
                .totalCourses(totalCourses)
                .publishedCourses(publishedCourses)
                .draftCourses(draftCourses)
                .unpublishedCourses(unpublishedCourses)
                .archivedCourses(archivedCourses)
                .totalStudents(totalStudents)
                .totalEnrollments(totalEnrollments)
                .totalOrders(totalOrders)
                .pendingPayments(pendingPayments)
                .capturedPayments(capturedPayments)
                .totalRevenue(totalRevenue)
                .mockRevenue(mockRevenue)
                .totalCertificatesIssued(totalCerts)
                .recentOrders(recentOrders)
                .coursePerformance(coursePerformance)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public Page<User> getStudents(String query, Pageable pageable) {
        if (StringUtils.hasText(query)) {
            return userRepository.findByFullNameContainingIgnoreCaseOrEmailContainingIgnoreCase(
                    query.trim(), query.trim(), pageable);
        }
        return userRepository.findByRole(User.Role.STUDENT, pageable);
    }

    @Override
    @Transactional
    public void setUserEnabled(Long userId, boolean enabled) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        user.setEnabled(enabled);
        userRepository.save(user);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Order> getAllOrders(Pageable pageable) {
        return orderRepository.findAll(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<NotificationLog> getNotificationLogs(Pageable pageable) {
        return notificationLogRepository.findAll(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<AuditLog> getAuditLogs(Pageable pageable) {
        return auditLogRepository.findAll(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<CertificateDto> getAllCertificates(Pageable pageable) {
        return certificateRepository.findAll(pageable).map(CertificateDto::fromEntity);
    }

    @Override
    @Transactional(readOnly = true)
    public List<QuizDto> getAllQuizzes() {
        return quizRepository.findAll().stream()
                .map(q -> QuizDto.builder()
                        .id(q.getId())
                        .courseId(q.getCourse() != null ? q.getCourse().getId() : null)
                        .title(q.getTitle())
                        .description(q.getDescription())
                        .passingScore(q.getPassingScore())
                        .timeLimitMinutes(q.getTimeLimitMinutes())
                        .required(q.isRequired())
                        .questions(new java.util.ArrayList<>())
                        .build())
                .collect(Collectors.toList());
    }
}
