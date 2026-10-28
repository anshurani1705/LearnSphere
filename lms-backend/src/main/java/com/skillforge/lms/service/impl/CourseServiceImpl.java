package com.skillforge.lms.service.impl;

import com.skillforge.lms.dto.course.*;
import com.skillforge.lms.entity.Category;
import com.skillforge.lms.entity.Course;
import com.skillforge.lms.entity.CourseSection;
import com.skillforge.lms.entity.Lesson;
import com.skillforge.lms.entity.User;
import com.skillforge.lms.exception.BadRequestException;
import com.skillforge.lms.exception.ResourceNotFoundException;
import com.skillforge.lms.repository.*;
import com.skillforge.lms.service.CourseService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.math.BigDecimal;
import java.text.Normalizer;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
@Slf4j
public class CourseServiceImpl implements CourseService {

    private final CourseRepository courseRepository;
    private final CourseSectionRepository sectionRepository;
    private final LessonRepository lessonRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final OrderRepository orderRepository;
    private final CategoryRepository categoryRepository;

    public CourseServiceImpl(CourseRepository courseRepository,
                             CourseSectionRepository sectionRepository,
                             LessonRepository lessonRepository,
                             EnrollmentRepository enrollmentRepository,
                             OrderRepository orderRepository,
                             CategoryRepository categoryRepository) {
        this.courseRepository = courseRepository;
        this.sectionRepository = sectionRepository;
        this.lessonRepository = lessonRepository;
        this.enrollmentRepository = enrollmentRepository;
        this.orderRepository = orderRepository;
        this.categoryRepository = categoryRepository;
    }

    private static final Pattern NONLATIN = Pattern.compile("[^\\w-]");
    private static final Pattern WHITESPACE = Pattern.compile("[\\s]");

    @Override
    @Transactional(readOnly = true)
    public Page<CourseSummaryDto> getPublishedCourses(String query, String level, Pageable pageable) {
        Page<Course> courses;
        if (StringUtils.hasText(query)) {
            courses = courseRepository.searchPublished(Course.CourseStatus.PUBLISHED, query.trim(), pageable);
        } else if (StringUtils.hasText(level)) {
            try {
                Course.CourseLevel lvl = Course.CourseLevel.valueOf(level.toUpperCase());
                courses = courseRepository.findByStatusAndLevel(Course.CourseStatus.PUBLISHED, lvl, pageable);
            } catch (IllegalArgumentException e) {
                courses = courseRepository.findByStatus(Course.CourseStatus.PUBLISHED, pageable);
            }
        } else {
            courses = courseRepository.findByStatus(Course.CourseStatus.PUBLISHED, pageable);
        }
        return courses.map(CourseSummaryDto::fromEntity);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CourseSummaryDto> getFeaturedCourses() {
        return courseRepository.findByStatusAndFeaturedTrue(Course.CourseStatus.PUBLISHED)
                .stream()
                .map(CourseSummaryDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public CourseDetailDto getCourseBySlug(String slug, User currentUser) {
        Course course = courseRepository.findBySlug(slug).orElse(null);
        if (course == null) {
            try {
                Long id = Long.parseLong(slug);
                course = courseRepository.findById(id).orElse(null);
            } catch (NumberFormatException ignored) {
            }
        }
        if (course == null) {
            throw new ResourceNotFoundException("Course", "slug or id", slug);
        }

        boolean hasAccess = hasEnrollmentAccess(currentUser != null ? currentUser.getId() : null, course.getId());
        if (currentUser != null && currentUser.getRole() == User.Role.ADMIN) {
            hasAccess = true;
        }

        return CourseDetailDto.fromEntity(course, hasAccess);
    }

    @Override
    @Transactional(readOnly = true)
    public CourseDetailDto getCourseById(Long id, User currentUser) {
        Course course = getCourseEntity(id);
        boolean hasAccess = hasEnrollmentAccess(currentUser != null ? currentUser.getId() : null, course.getId());
        if (currentUser != null && currentUser.getRole() == User.Role.ADMIN) {
            hasAccess = true;
        }
        return CourseDetailDto.fromEntity(course, hasAccess);
    }

    @Override
    @Transactional(readOnly = true)
    public Course getCourseEntity(Long id) {
        return courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course", "id", id));
    }

    @Override
    @Transactional(readOnly = true)
    public Page<CourseDetailDto> getAdminCourses(Course.CourseStatus status, String category, String query, Pageable pageable) {
        String cleanQuery = StringUtils.hasText(query) ? query.trim() : null;
        String cleanCategory = StringUtils.hasText(category) ? category.trim() : null;
        Page<Course> courses = courseRepository.searchAdminCourses(status, cleanCategory, cleanQuery, pageable);
        return courses.map(c -> CourseDetailDto.fromEntity(c, true));
    }

    @Override
    @Transactional
    public CourseDetailDto createCourse(CourseCreateRequest request, User admin) {
        validatePricing(request.getPrice(), request.getOriginalPrice());

        String slug = StringUtils.hasText(request.getSlug()) ? slugify(request.getSlug()) : slugify(request.getTitle());
        if (courseRepository.existsBySlug(slug)) {
            slug = slug + "-" + System.currentTimeMillis();
        }

        Course.CourseStatus initialStatus;
        try {
            initialStatus = Course.CourseStatus.valueOf(request.getStatus().toUpperCase());
        } catch (Exception e) {
            initialStatus = Course.CourseStatus.DRAFT;
        }

        Course course = Course.builder()
                .title(request.getTitle().trim())
                .slug(slug)
                .shortDescription(request.getShortDescription())
                .description(request.getDescription())
                .thumbnailUrl(request.getThumbnailUrl())
                .instructorName(StringUtils.hasText(request.getInstructorName()) ? request.getInstructorName() : "SkillForge Faculty")
                .instructorBio(request.getInstructorBio())
                .durationHours(request.getDurationHours())
                .price(request.getPrice())
                .originalPrice(request.getOriginalPrice())
                .currency(request.getCurrency() != null ? request.getCurrency() : "INR")
                .status(initialStatus)
                .category(StringUtils.hasText(request.getCategory()) ? request.getCategory() : "General")
                .featured(request.isFeatured())
                .learningOutcomes(request.getLearningOutcomes())
                .prerequisites(request.getPrerequisites())
                .targetAudience(request.getTargetAudience())
                .language(StringUtils.hasText(request.getLanguage()) ? request.getLanguage() : "English")
                .level(Course.CourseLevel.valueOf(request.getLevel()))
                .createdBy(admin != null ? admin.getId() : null)
                .build();

        if (initialStatus == Course.CourseStatus.PUBLISHED) {
            validatePublishable(course);
            course.setPublishedAt(LocalDateTime.now());
        }

        course = courseRepository.save(course);
        log.info("Created company course '{}' (ID: {}, Status: {}) by admin {}",
                course.getTitle(), course.getId(), course.getStatus(), admin != null ? admin.getEmail() : "system");
        return CourseDetailDto.fromEntity(course, true);
    }

    @Override
    @Transactional
    public CourseDetailDto updateCourse(Long id, CourseCreateRequest request) {
        validatePricing(request.getPrice(), request.getOriginalPrice());
        Course course = getCourseEntity(id);

        course.setTitle(request.getTitle().trim());
        if (StringUtils.hasText(request.getSlug())) {
            String newSlug = slugify(request.getSlug());
            if (!newSlug.equals(course.getSlug()) && courseRepository.existsBySlug(newSlug)) {
                throw new BadRequestException("Slug already in use by another course");
            }
            course.setSlug(newSlug);
        }
        course.setShortDescription(request.getShortDescription());
        course.setDescription(request.getDescription());
        course.setThumbnailUrl(request.getThumbnailUrl());
        course.setInstructorName(StringUtils.hasText(request.getInstructorName()) ? request.getInstructorName() : "SkillForge Faculty");
        course.setInstructorBio(request.getInstructorBio());
        course.setDurationHours(request.getDurationHours());
        course.setPrice(request.getPrice());
        course.setOriginalPrice(request.getOriginalPrice());
        course.setCategory(StringUtils.hasText(request.getCategory()) ? request.getCategory() : "General");
        course.setFeatured(request.isFeatured());
        course.setLearningOutcomes(request.getLearningOutcomes());
        course.setPrerequisites(request.getPrerequisites());
        course.setTargetAudience(request.getTargetAudience());
        course.setLanguage(StringUtils.hasText(request.getLanguage()) ? request.getLanguage() : "English");
        course.setLevel(Course.CourseLevel.valueOf(request.getLevel()));

        Course.CourseStatus targetStatus = Course.CourseStatus.valueOf(request.getStatus().toUpperCase());
        if (targetStatus == Course.CourseStatus.PUBLISHED && course.getStatus() != Course.CourseStatus.PUBLISHED) {
            validatePublishable(course);
            if (course.getPublishedAt() == null) {
                course.setPublishedAt(LocalDateTime.now());
            }
        }
        course.setStatus(targetStatus);

        course = courseRepository.save(course);
        log.info("Updated company course '{}' (ID: {}, Status: {})", course.getTitle(), course.getId(), course.getStatus());
        return CourseDetailDto.fromEntity(course, true);
    }

    @Override
    @Transactional
    public void setCourseStatus(Long id, Course.CourseStatus status) {
        Course course = getCourseEntity(id);
        if (status == Course.CourseStatus.PUBLISHED) {
            validatePublishable(course);
            if (course.getPublishedAt() == null) {
                course.setPublishedAt(LocalDateTime.now());
            }
        }
        course.setStatus(status);
        courseRepository.save(course);
        log.info("Set course status for ID {} to {}", id, status);
    }

    @Override
    @Transactional
    public void deleteCourse(Long id) {
        Course course = getCourseEntity(id);

        long enrollments = enrollmentRepository.countByCourseId(id);
        if (enrollments > 0) {
            throw new BadRequestException("Cannot delete course with " + enrollments + " active student enrollment(s). Please archive this course instead to preserve learner history.");
        }

        if (orderRepository.existsByCourseId(id)) {
            throw new BadRequestException("Cannot delete course with historical financial transactions or orders. Please archive the course instead.");
        }

        courseRepository.delete(course);
        log.info("Deleted company course ID {}", id);
    }

    @Override
    @Transactional
    public CourseSectionDto addSection(Long courseId, SectionCreateRequest request) {
        Course course = getCourseEntity(courseId);
        int nextOrder = sectionRepository.countByCourseId(courseId) + 1;

        CourseSection section = CourseSection.builder()
                .course(course)
                .title(request.getTitle().trim())
                .description(request.getDescription())
                .sortOrder(request.getSortOrder() > 0 ? request.getSortOrder() : nextOrder)
                .build();

        section = sectionRepository.save(section);
        return CourseSectionDto.fromEntity(section, true);
    }

    @Override
    @Transactional
    public CourseSectionDto updateSection(Long sectionId, SectionCreateRequest request) {
        CourseSection section = sectionRepository.findById(sectionId)
                .orElseThrow(() -> new ResourceNotFoundException("CourseSection", "id", sectionId));

        section.setTitle(request.getTitle().trim());
        section.setDescription(request.getDescription());
        if (request.getSortOrder() > 0) {
            section.setSortOrder(request.getSortOrder());
        }

        section = sectionRepository.save(section);
        return CourseSectionDto.fromEntity(section, true);
    }

    @Override
    @Transactional
    public void deleteSection(Long sectionId) {
        CourseSection section = sectionRepository.findById(sectionId)
                .orElseThrow(() -> new ResourceNotFoundException("CourseSection", "id", sectionId));
        sectionRepository.delete(section);
    }

    @Override
    @Transactional
    public LessonDto addLesson(Long sectionId, LessonCreateRequest request) {
        CourseSection section = sectionRepository.findById(sectionId)
                .orElseThrow(() -> new ResourceNotFoundException("CourseSection", "id", sectionId));

        int nextOrder = (int) lessonRepository.countByCourseId(section.getCourse().getId()) + 1;

        Lesson lesson = Lesson.builder()
                .section(section)
                .course(section.getCourse())
                .title(request.getTitle().trim())
                .description(request.getDescription())
                .contentType(Lesson.ContentType.valueOf(request.getContentType()))
                .videoUrl(request.getVideoUrl())
                .videoDurationSeconds(request.getVideoDurationSeconds())
                .contentText(request.getContentText())
                .sortOrder(request.getSortOrder() > 0 ? request.getSortOrder() : nextOrder)
                .preview(request.isPreview())
                .mandatory(request.isMandatory())
                .build();

        lesson = lessonRepository.save(lesson);
        return LessonDto.fromEntity(lesson, true);
    }

    @Override
    @Transactional
    public LessonDto updateLesson(Long lessonId, LessonCreateRequest request) {
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new ResourceNotFoundException("Lesson", "id", lessonId));

        lesson.setTitle(request.getTitle().trim());
        lesson.setDescription(request.getDescription());
        lesson.setContentType(Lesson.ContentType.valueOf(request.getContentType()));
        lesson.setVideoUrl(request.getVideoUrl());
        lesson.setVideoDurationSeconds(request.getVideoDurationSeconds());
        lesson.setContentText(request.getContentText());
        lesson.setSortOrder(request.getSortOrder());
        lesson.setPreview(request.isPreview());
        lesson.setMandatory(request.isMandatory());

        lesson = lessonRepository.save(lesson);
        return LessonDto.fromEntity(lesson, true);
    }

    @Override
    @Transactional
    public void deleteLesson(Long lessonId) {
        if (!lessonRepository.existsById(lessonId)) {
            throw new ResourceNotFoundException("Lesson", "id", lessonId);
        }
        lessonRepository.deleteById(lessonId);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean hasEnrollmentAccess(Long userId, Long courseId) {
        if (userId == null) return false;
        return enrollmentRepository.existsByUserIdAndCourseId(userId, courseId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CategoryDto> getCategories() {
        return categoryRepository.findAllByOrderByDisplayOrderAscNameAsc().stream()
                .map(cat -> CategoryDto.fromEntity(cat, courseRepository.countByCategory(cat.getName())))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public CategoryDto createCategory(CategoryDto request) {
        if (categoryRepository.existsByName(request.getName().trim())) {
            throw new BadRequestException("Category with name '" + request.getName() + "' already exists.");
        }
        String slug = StringUtils.hasText(request.getSlug()) ? slugify(request.getSlug()) : slugify(request.getName());
        if (categoryRepository.existsBySlug(slug)) {
            slug = slug + "-" + System.currentTimeMillis();
        }

        Category category = Category.builder()
                .name(request.getName().trim())
                .slug(slug)
                .description(request.getDescription())
                .icon(StringUtils.hasText(request.getIcon()) ? request.getIcon() : "Folder")
                .displayOrder(request.getDisplayOrder())
                .build();

        category = categoryRepository.save(category);
        return CategoryDto.fromEntity(category, 0);
    }

    @Override
    @Transactional
    public CategoryDto updateCategory(Long id, CategoryDto request) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", id));

        category.setName(request.getName().trim());
        if (StringUtils.hasText(request.getSlug())) {
            String slug = slugify(request.getSlug());
            if (!slug.equals(category.getSlug()) && categoryRepository.existsBySlug(slug)) {
                throw new BadRequestException("Slug already in use by another category");
            }
            category.setSlug(slug);
        }
        category.setDescription(request.getDescription());
        category.setIcon(request.getIcon());
        category.setDisplayOrder(request.getDisplayOrder());

        category = categoryRepository.save(category);
        long count = courseRepository.countByCategory(category.getName());
        return CategoryDto.fromEntity(category, count);
    }

    @Override
    @Transactional
    public void deleteCategory(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", id));
        long courseCount = courseRepository.countByCategory(category.getName());
        if (courseCount > 0) {
            throw new BadRequestException("Cannot delete category associated with " + courseCount + " existing courses.");
        }
        categoryRepository.delete(category);
    }

    private void validatePricing(BigDecimal price, BigDecimal originalPrice) {
        if (price == null || price.compareTo(BigDecimal.ZERO) < 0) {
            throw new BadRequestException("Course regular price must be non-negative.");
        }
        if (originalPrice != null) {
            if (originalPrice.compareTo(BigDecimal.ZERO) < 0) {
                throw new BadRequestException("Course original price cannot be negative.");
            }
            if (originalPrice.compareTo(BigDecimal.ZERO) > 0 && price.compareTo(originalPrice) > 0) {
                throw new BadRequestException("Discounted course price cannot exceed the original price.");
            }
        }
    }

    private void validatePublishable(Course course) {
        List<String> violations = new ArrayList<>();
        if (!StringUtils.hasText(course.getTitle())) {
            violations.add("Course title is missing.");
        }
        if (!StringUtils.hasText(course.getShortDescription()) && !StringUtils.hasText(course.getDescription())) {
            violations.add("Course description is required.");
        }
        if (course.getPrice() == null || course.getPrice().compareTo(BigDecimal.ZERO) < 0) {
            violations.add("Course price must be valid and non-negative.");
        }
        if (course.getId() != null) {
            List<CourseSection> sections = sectionRepository.findByCourseIdOrderBySortOrderAsc(course.getId());
            if (sections.isEmpty()) {
                violations.add("Course must have at least one curriculum section before publishing.");
            } else {
                long totalLessons = lessonRepository.countByCourseId(course.getId());
                if (totalLessons == 0) {
                    violations.add("Course must contain at least one lesson before publishing.");
                }
            }
        }
        if (!violations.isEmpty()) {
            throw new BadRequestException("Cannot publish course: " + String.join(" ", violations));
        }
    }

    private String slugify(String input) {
        String nowhitespace = WHITESPACE.matcher(input).replaceAll("-");
        String normalized = Normalizer.normalize(nowhitespace, Normalizer.Form.NFD);
        String slug = NONLATIN.matcher(normalized).replaceAll("");
        return slug.toLowerCase(Locale.ENGLISH).replaceAll("-+", "-");
    }
}
