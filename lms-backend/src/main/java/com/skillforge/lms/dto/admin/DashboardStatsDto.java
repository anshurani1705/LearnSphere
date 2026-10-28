package com.skillforge.lms.dto.admin;

import lombok.*;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardStatsDto {
    private long totalCourses;
    private long publishedCourses;
    private long draftCourses;
    private long unpublishedCourses;
    private long archivedCourses;

    private long totalStudents;
    private long totalEnrollments;
    private long totalOrders;
    private long pendingPayments;
    private long capturedPayments;

    private BigDecimal totalRevenue;
    private BigDecimal mockRevenue;
    private long totalCertificatesIssued;

    @Builder.Default
    private List<RecentOrderDto> recentOrders = new ArrayList<>();

    @Builder.Default
    private List<CoursePerformanceDto> coursePerformance = new ArrayList<>();
}
