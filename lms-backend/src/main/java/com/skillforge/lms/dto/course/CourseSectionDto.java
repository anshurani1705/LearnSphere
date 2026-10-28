package com.skillforge.lms.dto.course;

import com.skillforge.lms.entity.CourseSection;
import com.skillforge.lms.entity.Lesson;
import lombok.*;
import java.util.ArrayList;
import java.util.List;

@Getter @Setter
public class CourseSectionDto {
    private Long id;
    private Long courseId;
    private String title;
    private String description;
    private int sortOrder;
    private List<LessonDto> lessons = new ArrayList<>();

    public CourseSectionDto() {
    }

    @Builder
    public CourseSectionDto(Long id, Long courseId, String title, String description, int sortOrder, List<LessonDto> lessons) {
        this.id = id;
        this.courseId = courseId;
        this.title = title;
        this.description = description;
        this.sortOrder = sortOrder;
        this.lessons = lessons != null ? lessons : new ArrayList<>();
    }

    public static CourseSectionDto fromEntity(CourseSection section, boolean hasAccess) {
        List<LessonDto> lessonDtos = new ArrayList<>();
        if (section.getLessons() != null) {
            for (Lesson lesson : section.getLessons()) {
                lessonDtos.add(LessonDto.fromEntity(lesson, hasAccess));
            }
        }
        return CourseSectionDto.builder()
                .id(section.getId())
                .courseId(section.getCourse() != null ? section.getCourse().getId() : null)
                .title(section.getTitle())
                .description(section.getDescription())
                .sortOrder(section.getSortOrder())
                .lessons(lessonDtos)
                .build();
    }
}
