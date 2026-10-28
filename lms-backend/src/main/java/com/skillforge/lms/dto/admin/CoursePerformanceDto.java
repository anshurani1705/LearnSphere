package com.skillforge.lms.dto.admin;

import lombok.*;
import java.math.BigDecimal;

@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CoursePerformanceDto {
    private Long courseId;
    private String title;
    private BigDecimal price;
    private String status;
    private String category;
    private int enrollmentCount;
    private BigDecimal totalRevenue;
}
