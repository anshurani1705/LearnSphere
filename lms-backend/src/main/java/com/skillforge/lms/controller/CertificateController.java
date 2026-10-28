package com.skillforge.lms.controller;

import com.skillforge.lms.dto.certificate.CertificateDto;
import com.skillforge.lms.dto.certificate.CertificateVerifyResponseDto;
import com.skillforge.lms.dto.common.ApiResponse;
import com.skillforge.lms.entity.Certificate;
import com.skillforge.lms.entity.User;
import com.skillforge.lms.service.AuthService;
import com.skillforge.lms.service.CertificateService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/v1")
@Tag(name = "Certificates", description = "Certificate download and public authenticity verification")
public class CertificateController {

    private final CertificateService certificateService;
    private final AuthService authService;
    private final com.skillforge.lms.service.ProgressService progressService;

    public CertificateController(CertificateService certificateService, AuthService authService, com.skillforge.lms.service.ProgressService progressService) {
        this.certificateService = certificateService;
        this.authService = authService;
        this.progressService = progressService;
    }

    @PostMapping("/student/courses/{courseId}/claim-certificate")
    @Operation(summary = "Check course completion and claim certificate")
    public ResponseEntity<ApiResponse<CertificateDto>> claimCertificate(@PathVariable Long courseId) {
        User user = authService.getCurrentUser();
        progressService.checkAndCompleteCourse(user, courseId);
        Certificate cert = certificateService.getCertificateByCourseAndUser(courseId, user.getId());
        if (cert != null) {
            return ResponseEntity.ok(ApiResponse.success("Certificate issued successfully", CertificateDto.fromEntity(cert)));
        }
        return ResponseEntity.badRequest().body(ApiResponse.error(
                "Course requirements not satisfied yet. Please complete all lessons and pass the required assessment."
        ));
    }

    @GetMapping("/certificates/verify/{certificateId}")
    @Operation(summary = "Publicly verify certificate authenticity by unique ID without leaking private PII")
    public ResponseEntity<ApiResponse<CertificateVerifyResponseDto>> verifyCertificate(
            @PathVariable String certificateId) {
        CertificateVerifyResponseDto result = certificateService.verifyCertificate(certificateId);
        return ResponseEntity.ok(ApiResponse.success(result));
    }

    @GetMapping("/student/certificates")
    @Operation(summary = "Get list of certificates earned by authenticated student")
    public ResponseEntity<ApiResponse<List<CertificateDto>>> getStudentCertificates() {
        User user = authService.getCurrentUser();
        List<CertificateDto> certificates = certificateService.getUserCertificates(user);
        return ResponseEntity.ok(ApiResponse.success(certificates));
    }

    @GetMapping("/certificates/{certificateId}/download")
    @Operation(summary = "Download official PDF certificate")
    public ResponseEntity<byte[]> downloadCertificate(@PathVariable String certificateId) {
        User user = authService.getCurrentUser();
        byte[] pdfBytes = certificateService.downloadCertificatePdf(certificateId, user);

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .contentLength(pdfBytes.length)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + certificateId + ".pdf\"")
                .header(HttpHeaders.ACCESS_CONTROL_EXPOSE_HEADERS, HttpHeaders.CONTENT_DISPOSITION)
                .header(HttpHeaders.CACHE_CONTROL, "no-cache, no-store, must-revalidate")
                .header(HttpHeaders.PRAGMA, "no-cache")
                .header(HttpHeaders.EXPIRES, "0")
                .body(pdfBytes);
    }
}
