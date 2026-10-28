package com.skillforge.lms.dto.course;

import com.skillforge.lms.entity.Category;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter @Setter
public class CategoryDto {
    private Long id;

    @NotBlank(message = "Category name is required")
    private String name;

    private String slug;
    private String description;
    private String icon;
    private int displayOrder;
    private long courseCount;

    public CategoryDto() {
    }

    @Builder
    public CategoryDto(Long id, String name, String slug, String description, String icon, int displayOrder, long courseCount) {
        this.id = id;
        this.name = name;
        this.slug = slug;
        this.description = description;
        this.icon = icon != null ? icon : "Folder";
        this.displayOrder = displayOrder;
        this.courseCount = courseCount;
    }

    public static CategoryDto fromEntity(Category category, long courseCount) {
        return CategoryDto.builder()
                .id(category.getId())
                .name(category.getName())
                .slug(category.getSlug())
                .description(category.getDescription())
                .icon(category.getIcon())
                .displayOrder(category.getDisplayOrder())
                .courseCount(courseCount)
                .build();
    }
}
