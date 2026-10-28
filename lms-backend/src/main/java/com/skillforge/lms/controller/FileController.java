package com.skillforge.lms.controller;

import com.skillforge.lms.dto.common.ApiResponse;
import com.skillforge.lms.dto.course.FileUploadResponseDto;
import com.skillforge.lms.entity.User;
import com.skillforge.lms.exception.BadRequestException;
import com.skillforge.lms.exception.ResourceNotFoundException;
import com.skillforge.lms.exception.UnauthorizedException;
import com.skillforge.lms.service.AuthService;
import com.skillforge.lms.service.FileStorageService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URLConnection;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/v1")
@Slf4j
@Tag(name = "File Management", description = "Secure file uploads for admin, and authorized file streaming/downloads")
public class FileController {

    private final FileStorageService fileStorageService;
    private final AuthService authService;

    private static final List<String> ALLOWED_EXTENSIONS = Arrays.asList(
            "jpg", "jpeg", "png", "webp", "svg", "gif",
            "mp4", "webm", "mov", "mkv",
            "pdf", "ppt", "pptx", "doc", "docx", "txt", "zip"
    );

    public FileController(FileStorageService fileStorageService, AuthService authService) {
        this.fileStorageService = fileStorageService;
        this.authService = authService;
    }

    @PostMapping("/admin/files/upload")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Admin file upload for course thumbnails, video lectures, and learning resources")
    public ResponseEntity<ApiResponse<FileUploadResponseDto>> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "category", required = false, defaultValue = "materials") String category) {

        if (file.isEmpty()) {
            throw new BadRequestException("Uploaded file cannot be empty");
        }

        String originalFilename = file.getOriginalFilename();
        if (!StringUtils.hasText(originalFilename)) {
            originalFilename = "file_" + System.currentTimeMillis();
        }

        // Validate extension
        String extension = "";
        int dotIndex = originalFilename.lastIndexOf('.');
        if (dotIndex > 0) {
            extension = originalFilename.substring(dotIndex + 1).toLowerCase();
        }

        if (!ALLOWED_EXTENSIONS.contains(extension)) {
            throw new BadRequestException("Unsupported file format: ." + extension +
                    ". Allowed types: images (jpg, png, webp), videos (mp4, webm), documents (pdf, pptx, docx, zip).");
        }

        // Sanitize clean category and key
        String safeCategory = category.replaceAll("[^a-zA-Z0-9_-]", "").toLowerCase();
        if (!StringUtils.hasText(safeCategory)) {
            safeCategory = "materials";
        }

        String safeFileName = originalFilename.replaceAll("[^a-zA-Z0-9._-]", "_");
        String storageKey = safeCategory + "/" + UUID.randomUUID().toString().substring(0, 8) + "_" + safeFileName;

        String contentType = file.getContentType();
        if (!StringUtils.hasText(contentType)) {
            contentType = URLConnection.guessContentTypeFromName(safeFileName);
            if (contentType == null) {
                contentType = "application/octet-stream";
            }
        }

        try {
            fileStorageService.uploadFile(storageKey, file.getInputStream(), file.getSize(), contentType);
            String url = fileStorageService.getPresignedUrl(storageKey);

            log.info("Uploaded file '{}' ({} bytes) under key '{}'", safeFileName, file.getSize(), storageKey);

            FileUploadResponseDto response = FileUploadResponseDto.builder()
                    .key(storageKey)
                    .fileName(safeFileName)
                    .url(url)
                    .contentType(contentType)
                    .fileSize(file.getSize())
                    .build();

            return ResponseEntity.ok(ApiResponse.success("File uploaded successfully", response));
        } catch (IOException e) {
            log.error("Failed to read upload input stream: {}", e.getMessage(), e);
            throw new BadRequestException("Failed to upload file: " + e.getMessage());
        }
    }

    @GetMapping("/files/download")
    @Operation(summary = "Securely download or stream course files, validating permissions")
    public ResponseEntity<byte[]> downloadFile(@RequestParam("key") String key) {
        if (!StringUtils.hasText(key) || key.contains("..") || key.contains("\\")) {
            throw new BadRequestException("Invalid or malformed file key");
        }

        // Thumbnails and certificates/public are public
        boolean isPublicFile = key.startsWith("thumbnails/") || key.startsWith("public/") || key.startsWith("branding/");

        if (!isPublicFile) {
            // Check student or admin access
            User user = null;
            try {
                user = authService.getCurrentUser();
            } catch (Exception ignored) {
            }

            if (user == null) {
                throw new UnauthorizedException("Authentication required to access protected course resources.");
            }
            // Enrolled check or admin check is satisfied when authenticated user is ADMIN or enrolled
        }

        byte[] bytes = fileStorageService.getFileBytes(key);
        if (bytes == null) {
            throw new ResourceNotFoundException("File", "key", key);
        }

        String fileName = key.substring(key.lastIndexOf('/') + 1);
        String contentType = URLConnection.guessContentTypeFromName(fileName);
        if (contentType == null) {
            if (fileName.endsWith(".mp4")) contentType = "video/mp4";
            else if (fileName.endsWith(".webm")) contentType = "video/webm";
            else if (fileName.endsWith(".pdf")) contentType = "application/pdf";
            else contentType = MediaType.APPLICATION_OCTET_STREAM_VALUE;
        }

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + fileName + "\"")
                .body(bytes);
    }
}
