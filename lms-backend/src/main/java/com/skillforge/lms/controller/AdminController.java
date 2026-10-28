package com.skillforge.lms.controller;

import com.skillforge.lms.dto.admin.DashboardStatsDto;
import com.skillforge.lms.dto.certificate.CertificateDto;
import com.skillforge.lms.dto.common.ApiResponse;
import com.skillforge.lms.dto.common.PageResponse;
import com.skillforge.lms.dto.course.*;
import com.skillforge.lms.dto.quiz.QuizDto;
import com.skillforge.lms.entity.*;
import com.skillforge.lms.service.AdminService;
import com.skillforge.lms.service.AuthService;
import com.skillforge.lms.service.CourseService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/v1/admin")
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Administration", description = "Admin dashboard, course management, student control, and logs")
public class AdminController {

    private final AdminService adminService;
    private final CourseService courseService;
    private final AuthService authService;

    public AdminController(AdminService adminService, CourseService courseService, AuthService authService) {
        this.adminService = adminService;
        this.courseService = courseService;
        this.authService = authService;
    }

    @GetMapping("/dashboard")
    @Operation(summary = "Get overview metrics: students, courses, enrollments, revenue, certificates")
    public ResponseEntity<ApiResponse<DashboardStatsDto>> getDashboardStats() {
        return ResponseEntity.ok(ApiResponse.success(adminService.getDashboardStats()));
    }

    @GetMapping("/courses")
    @Operation(summary = "List and search all company courses across all statuses")
    public ResponseEntity<ApiResponse<PageResponse<CourseDetailDto>>> getAdminCourses(
            @RequestParam(required = false) Course.CourseStatus status,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String q,
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        var page = courseService.getAdminCourses(status, category, q, pageable);
        return ResponseEntity.ok(ApiResponse.success(PageResponse.of(page)));
    }

    @GetMapping("/courses/{id}")
    @Operation(summary = "Get full course details for admin editor")
    public ResponseEntity<ApiResponse<CourseDetailDto>> getCourseById(@PathVariable Long id) {
        User admin = authService.getCurrentUser();
        CourseDetailDto course = courseService.getCourseById(id, admin);
        return ResponseEntity.ok(ApiResponse.success(course));
    }

    @PostMapping("/courses")
    @Operation(summary = "Create a new course")
    public ResponseEntity<ApiResponse<CourseDetailDto>> createCourse(
            @Valid @RequestBody CourseCreateRequest request) {
        User admin = authService.getCurrentUser();
        CourseDetailDto course = courseService.createCourse(request, admin);
        return ResponseEntity.ok(ApiResponse.success("Course created successfully", course));
    }

    @PutMapping("/courses/{id}")
    @Operation(summary = "Update an existing course")
    public ResponseEntity<ApiResponse<CourseDetailDto>> updateCourse(
            @PathVariable Long id,
            @Valid @RequestBody CourseCreateRequest request) {
        CourseDetailDto course = courseService.updateCourse(id, request);
        return ResponseEntity.ok(ApiResponse.success("Course updated successfully", course));
    }

    @PatchMapping("/courses/{id}/status")
    @Operation(summary = "Change course status (DRAFT, PUBLISHED, UNPUBLISHED, ARCHIVED)")
    public ResponseEntity<ApiResponse<Void>> setCourseStatus(
            @PathVariable Long id,
            @RequestParam Course.CourseStatus status) {
        courseService.setCourseStatus(id, status);
        return ResponseEntity.ok(ApiResponse.success("Course status updated to " + status, null));
    }

    @DeleteMapping("/courses/{id}")
    @Operation(summary = "Delete course if no active enrollments or transactions")
    public ResponseEntity<ApiResponse<Void>> deleteCourse(@PathVariable Long id) {
        courseService.deleteCourse(id);
        return ResponseEntity.ok(ApiResponse.success("Course deleted successfully", null));
    }

    // Curriculum Section Management
    @PostMapping("/courses/{courseId}/sections")
    @Operation(summary = "Add a curriculum section to a course")
    public ResponseEntity<ApiResponse<CourseSectionDto>> addSection(
            @PathVariable Long courseId,
            @Valid @RequestBody SectionCreateRequest request) {
        CourseSectionDto section = courseService.addSection(courseId, request);
        return ResponseEntity.ok(ApiResponse.success("Section added successfully", section));
    }

    @PutMapping("/sections/{sectionId}")
    @Operation(summary = "Update a curriculum section")
    public ResponseEntity<ApiResponse<CourseSectionDto>> updateSection(
            @PathVariable Long sectionId,
            @Valid @RequestBody SectionCreateRequest request) {
        CourseSectionDto section = courseService.updateSection(sectionId, request);
        return ResponseEntity.ok(ApiResponse.success("Section updated successfully", section));
    }

    @DeleteMapping("/sections/{sectionId}")
    @Operation(summary = "Delete a curriculum section")
    public ResponseEntity<ApiResponse<Void>> deleteSection(@PathVariable Long sectionId) {
        courseService.deleteSection(sectionId);
        return ResponseEntity.ok(ApiResponse.success("Section deleted successfully", null));
    }

    // Curriculum Lesson Management
    @PostMapping("/sections/{sectionId}/lessons")
    @Operation(summary = "Add a lesson to a course section")
    public ResponseEntity<ApiResponse<LessonDto>> addLesson(
            @PathVariable Long sectionId,
            @Valid @RequestBody LessonCreateRequest request) {
        LessonDto lesson = courseService.addLesson(sectionId, request);
        return ResponseEntity.ok(ApiResponse.success("Lesson added successfully", lesson));
    }

    @PutMapping("/lessons/{lessonId}")
    @Operation(summary = "Update a lesson")
    public ResponseEntity<ApiResponse<LessonDto>> updateLesson(
            @PathVariable Long lessonId,
            @Valid @RequestBody LessonCreateRequest request) {
        LessonDto lesson = courseService.updateLesson(lessonId, request);
        return ResponseEntity.ok(ApiResponse.success("Lesson updated successfully", lesson));
    }

    @DeleteMapping("/lessons/{lessonId}")
    @Operation(summary = "Delete a lesson")
    public ResponseEntity<ApiResponse<Void>> deleteLesson(@PathVariable Long lessonId) {
        courseService.deleteLesson(lessonId);
        return ResponseEntity.ok(ApiResponse.success("Lesson deleted successfully", null));
    }

    // Category Management
    @GetMapping("/categories")
    @Operation(summary = "List all course categories with counts")
    public ResponseEntity<ApiResponse<List<CategoryDto>>> getCategories() {
        return ResponseEntity.ok(ApiResponse.success(courseService.getCategories()));
    }

    @PostMapping("/categories")
    @Operation(summary = "Create a new course category")
    public ResponseEntity<ApiResponse<CategoryDto>> createCategory(@Valid @RequestBody CategoryDto request) {
        CategoryDto category = courseService.createCategory(request);
        return ResponseEntity.ok(ApiResponse.success("Category created successfully", category));
    }

    @PutMapping("/categories/{id}")
    @Operation(summary = "Update a course category")
    public ResponseEntity<ApiResponse<CategoryDto>> updateCategory(
            @PathVariable Long id,
            @Valid @RequestBody CategoryDto request) {
        CategoryDto category = courseService.updateCategory(id, request);
        return ResponseEntity.ok(ApiResponse.success("Category updated successfully", category));
    }

    @DeleteMapping("/categories/{id}")
    @Operation(summary = "Delete a course category")
    public ResponseEntity<ApiResponse<Void>> deleteCategory(@PathVariable Long id) {
        courseService.deleteCategory(id);
        return ResponseEntity.ok(ApiResponse.success("Category deleted successfully", null));
    }

    // Student Management
    @GetMapping("/students")
    @Operation(summary = "List and search students")
    public ResponseEntity<ApiResponse<PageResponse<User>>> getStudents(
            @RequestParam(required = false) String q,
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        var page = adminService.getStudents(q, pageable);
        return ResponseEntity.ok(ApiResponse.success(PageResponse.of(page)));
    }

    @PatchMapping("/students/{id}/status")
    @Operation(summary = "Enable or disable a student account")
    public ResponseEntity<ApiResponse<Void>> updateStudentStatus(
            @PathVariable Long id,
            @RequestBody Map<String, Boolean> body) {
        boolean enabled = body.getOrDefault("enabled", true);
        adminService.setUserEnabled(id, enabled);
        return ResponseEntity.ok(ApiResponse.success("Student status updated", null));
    }

    // Order & Transaction Management
    @GetMapping("/orders")
    @Operation(summary = "View all orders and payments")
    public ResponseEntity<ApiResponse<PageResponse<Order>>> getAllOrders(
            @PageableDefault(size = 15, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        var page = adminService.getAllOrders(pageable);
        return ResponseEntity.ok(ApiResponse.success(PageResponse.of(page)));
    }

    // Quizzes & Certificates Overview
    @GetMapping("/quizzes")
    @Operation(summary = "List all course quizzes for administrative review")
    public ResponseEntity<ApiResponse<List<QuizDto>>> getAllQuizzes() {
        return ResponseEntity.ok(ApiResponse.success(adminService.getAllQuizzes()));
    }

    @GetMapping("/certificates")
    @Operation(summary = "List all issued certificates")
    public ResponseEntity<ApiResponse<PageResponse<CertificateDto>>> getAllCertificates(
            @PageableDefault(size = 15, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        var page = adminService.getAllCertificates(pageable);
        return ResponseEntity.ok(ApiResponse.success(PageResponse.of(page)));
    }

    // Notification Logs & Audits
    @GetMapping("/notifications")
    @Operation(summary = "Inspect multi-channel notification logs and delivery statuses")
    public ResponseEntity<ApiResponse<PageResponse<NotificationLog>>> getNotificationLogs(
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        var page = adminService.getNotificationLogs(pageable);
        return ResponseEntity.ok(ApiResponse.success(PageResponse.of(page)));
    }

    @GetMapping("/audit-logs")
    @Operation(summary = "View administrative audit log history")
    public ResponseEntity<ApiResponse<PageResponse<AuditLog>>> getAuditLogs(
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        var page = adminService.getAuditLogs(pageable);
        return ResponseEntity.ok(ApiResponse.success(PageResponse.of(page)));
    }
}
