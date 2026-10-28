package com.skillforge.lms.controller;

import com.skillforge.lms.dto.common.ApiResponse;
import com.skillforge.lms.dto.course.CourseSummaryDto;
import com.skillforge.lms.entity.Enrollment;
import com.skillforge.lms.entity.User;
import com.skillforge.lms.service.AuthService;
import com.skillforge.lms.service.EnrollmentService;
import com.skillforge.lms.service.ProgressService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/v1/student")
@Tag(name = "Student", description = "Student dashboard and learning activities")
public class EnrollmentController {

    private final EnrollmentService enrollmentService;
    private final ProgressService progressService;
    private final AuthService authService;
    private final com.skillforge.lms.service.CourseService courseService;

    public EnrollmentController(EnrollmentService enrollmentService, ProgressService progressService, AuthService authService, com.skillforge.lms.service.CourseService courseService) {
        this.enrollmentService = enrollmentService;
        this.progressService = progressService;
        this.authService = authService;
        this.courseService = courseService;
    }

    @PostMapping("/courses/{courseId}/enroll")
    @Operation(summary = "Instant enroll current student in a course (for free/demo access)")
    public ResponseEntity<ApiResponse<Map<String, Object>>> instantEnroll(@PathVariable Long courseId) {
        User user = authService.getCurrentUser();
        var course = courseService.getCourseEntity(courseId);
        Enrollment enrollment = enrollmentService.enrollStudent(user, course);
        return ResponseEntity.ok(ApiResponse.success("Enrolled successfully", Map.of(
                "enrollmentId", enrollment.getId(),
                "courseId", course.getId(),
                "status", enrollment.getStatus().name()
        )));
    }

    @GetMapping("/enrollments")
    @Operation(summary = "Get all active courses the student is enrolled in")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getEnrollments() {
        User user = authService.getCurrentUser();
        List<Enrollment> enrollments = enrollmentService.getStudentEnrollments(user.getId());

        List<Map<String, Object>> result = enrollments.stream().map(e -> Map.<String, Object>of(
                "enrollmentId", e.getId(),
                "course", CourseSummaryDto.fromEntity(e.getCourse()),
                "status", e.getStatus().name(),
                "progressPct", e.getProgressPct(),
                "enrolledAt", e.getEnrolledAt()
        )).collect(Collectors.toList());

        return ResponseEntity.ok(ApiResponse.success(result));
    }

    @GetMapping("/courses/{courseId}/progress")
    @Operation(summary = "Get detailed progress for a course (completed lesson IDs and percentage)")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getCourseProgress(@PathVariable Long courseId) {
        User user = authService.getCurrentUser();
        Map<String, Object> progress = progressService.getCourseProgress(courseId, user);
        return ResponseEntity.ok(ApiResponse.success(progress));
    }
}
