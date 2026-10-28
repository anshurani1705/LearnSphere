package com.skillforge.lms.dto.course;

import com.skillforge.lms.entity.Course;
import com.skillforge.lms.entity.CourseSection;
import lombok.*;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class CourseDetailDto {
    private Long id;
    private String title;
    private String slug;
    private String shortDescription;
    private String description;
    private String thumbnailUrl;
    private String instructorName;
    private String instructorBio;
    private String instructorAvatar;
    private Integer durationHours;
    private BigDecimal price;
    private BigDecimal originalPrice;
    private String currency;
    private String status;
    private String category;
    private boolean featured;
    private String[] learningOutcomes;
    private String[] prerequisites;
    private String[] targetAudience;
    private String language;
    private String level;
    private int enrollmentCount;
    @com.fasterxml.jackson.annotation.JsonProperty("isEnrolled")
    private boolean isEnrolled;
    private BigDecimal progressPct;
    private List<CourseSectionDto> sections = new ArrayList<>();

    @com.fasterxml.jackson.annotation.JsonProperty("isEnrolled")
    public boolean getIsEnrolled() {
        return isEnrolled;
    }

    @com.fasterxml.jackson.annotation.JsonProperty("enrolled")
    public boolean isEnrolled() {
        return isEnrolled;
    }

    public CourseDetailDto() {
    }

    @Builder
    public CourseDetailDto(Long id, String title, String slug, String shortDescription, String description,
                           String thumbnailUrl, String instructorName, String instructorBio, String instructorAvatar,
                           Integer durationHours, BigDecimal price, BigDecimal originalPrice, String currency,
                           String status, String category, boolean featured, String[] learningOutcomes,
                           String[] prerequisites, String[] targetAudience, String language, String level,
                           int enrollmentCount, boolean isEnrolled, BigDecimal progressPct, List<CourseSectionDto> sections) {
        this.id = id;
        this.title = title;
        this.slug = slug;
        this.shortDescription = shortDescription;
        this.description = description;
        this.thumbnailUrl = thumbnailUrl;
        this.instructorName = instructorName;
        this.instructorBio = instructorBio;
        this.instructorAvatar = instructorAvatar;
        this.durationHours = durationHours;
        this.price = price;
        this.originalPrice = originalPrice;
        this.currency = currency;
        this.status = status;
        this.category = category != null ? category : "General";
        this.featured = featured;
        this.learningOutcomes = learningOutcomes;
        this.prerequisites = prerequisites;
        this.targetAudience = targetAudience;
        this.language = language;
        this.level = level;
        this.enrollmentCount = enrollmentCount;
        this.isEnrolled = isEnrolled;
        this.progressPct = progressPct;
        this.sections = sections != null ? sections : new ArrayList<>();
    }

    public static CourseDetailDto fromEntity(Course course, boolean hasAccess) {
        List<CourseSectionDto> sectionDtos = new ArrayList<>();
        if (course.getSections() != null) {
            for (CourseSection section : course.getSections()) {
                sectionDtos.add(CourseSectionDto.fromEntity(section, hasAccess));
            }
        }

        return CourseDetailDto.builder()
                .id(course.getId())
                .title(course.getTitle())
                .slug(course.getSlug())
                .shortDescription(course.getShortDescription())
                .description(course.getDescription())
                .thumbnailUrl(course.getThumbnailUrl())
                .instructorName(course.getInstructorName())
                .instructorBio(course.getInstructorBio())
                .instructorAvatar(course.getInstructorAvatar())
                .durationHours(course.getDurationHours())
                .price(course.getPrice())
                .originalPrice(course.getOriginalPrice())
                .currency(course.getCurrency())
                .status(course.getStatus().name())
                .category(course.getCategory())
                .featured(course.isFeatured())
                .learningOutcomes(course.getLearningOutcomes())
                .prerequisites(course.getPrerequisites())
                .targetAudience(course.getTargetAudience())
                .language(course.getLanguage())
                .level(course.getLevel().name())
                .enrollmentCount(course.getEnrollmentCount())
                .isEnrolled(hasAccess)
                .sections(sectionDtos)
                .build();
    }
}
