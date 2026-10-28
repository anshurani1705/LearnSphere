package com.skillforge.lms.service;

import com.skillforge.lms.dto.admin.DashboardStatsDto;
import com.skillforge.lms.dto.certificate.CertificateDto;
import com.skillforge.lms.dto.quiz.QuizDto;
import com.skillforge.lms.entity.AuditLog;
import com.skillforge.lms.entity.NotificationLog;
import com.skillforge.lms.entity.Order;
import com.skillforge.lms.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface AdminService {
    DashboardStatsDto getDashboardStats();
    Page<User> getStudents(String query, Pageable pageable);
    void setUserEnabled(Long userId, boolean enabled);
    Page<Order> getAllOrders(Pageable pageable);
    Page<NotificationLog> getNotificationLogs(Pageable pageable);
    Page<AuditLog> getAuditLogs(Pageable pageable);
    Page<CertificateDto> getAllCertificates(Pageable pageable);
    List<QuizDto> getAllQuizzes();
}
