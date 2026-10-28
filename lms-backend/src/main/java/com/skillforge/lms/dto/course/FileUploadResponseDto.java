package com.skillforge.lms.dto.course;

import lombok.*;

@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FileUploadResponseDto {
    private String key;
    private String fileName;
    private String url;
    private String contentType;
    private long fileSize;
}
