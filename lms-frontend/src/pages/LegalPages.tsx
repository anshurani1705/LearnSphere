import React from 'react';

export const PrivacyPolicyPage: React.FC = () => (
  <div className="flex-1 bg-[#FAF8F5] py-16">
    <div className="max-w-3xl mx-auto px-4 sm:px-6 bg-white p-8 sm:p-12 rounded-[8px] border border-[#E7E2DA] shadow-[0_1px_2px_rgba(0,0,0,0.05)] space-y-6">
      <h1 className="font-serif font-semibold text-3xl text-[#1F2328]">Privacy policy</h1>
      <p className="text-xs text-[#5F6368]">Last updated: October 2026</p>
      <div className="space-y-4 text-sm leading-relaxed text-[#5F6368]">
        <p>
          SkillForge (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;) is dedicated to safeguarding the privacy and integrity of your personal information.
        </p>
        <h2 className="font-serif font-semibold text-lg text-[#1F2328] pt-2">1. Information we collect</h2>
        <p>
          We only collect essential information required to create accounts, process course enrollments via Razorpay, deliver notifications (via email and verification codes), and issue verifiable certificates.
        </p>
        <h2 className="font-serif font-semibold text-lg text-[#1F2328] pt-2">2. Public certificate verification</h2>
        <p>
          When you complete a course, an official certificate is generated with a unique verification code. Our public verification tool displays only your name, course title, issue date, and issuing academy to protect your sensitive personal data.
        </p>
        <h2 className="font-serif font-semibold text-lg text-[#1F2328] pt-2">3. Security</h2>
        <p>
          Passwords are cryptographically hashed using BCrypt. Authentication sessions are managed using secure HttpOnly cookies with CSRF defenses. Payment transactions are processed directly through Razorpay with HMAC-SHA256 signature verification.
        </p>
      </div>
    </div>
  </div>
);

export const TermsPage: React.FC = () => (
  <div className="flex-1 bg-[#FAF8F5] py-16">
    <div className="max-w-3xl mx-auto px-4 sm:px-6 bg-white p-8 sm:p-12 rounded-[8px] border border-[#E7E2DA] shadow-[0_1px_2px_rgba(0,0,0,0.05)] space-y-6">
      <h1 className="font-serif font-semibold text-3xl text-[#1F2328]">Terms and conditions</h1>
      <p className="text-xs text-[#5F6368]">Last updated: October 2026</p>
      <div className="space-y-4 text-sm leading-relaxed text-[#5F6368]">
        <h2 className="font-serif font-semibold text-lg text-[#1F2328] pt-2">1. Acceptance of terms</h2>
        <p>
          By creating an account or purchasing access to any SkillForge course, you agree to comply with and be bound by these Terms and Conditions.
        </p>
        <h2 className="font-serif font-semibold text-lg text-[#1F2328] pt-2">2. Course access & intellectual property</h2>
        <p>
          Enrollment grants a personal, non-transferable license to access the recorded lectures, resources, and assessments. Downloading, screen recording, or unauthorized redistribution of proprietary curriculum materials is strictly prohibited.
        </p>
        <h2 className="font-serif font-semibold text-lg text-[#1F2328] pt-2">3. Academic integrity & certificates</h2>
        <p>
          Certificates are earned through individual merit. Students must complete all mandatory lessons and achieve a passing score on course assessments. Any attempt to tamper with assessment evaluations will result in account suspension and revocation of credentials.
        </p>
      </div>
    </div>
  </div>
);

export const RefundPolicyPage: React.FC = () => (
  <div className="flex-1 bg-[#FAF8F5] py-16">
    <div className="max-w-3xl mx-auto px-4 sm:px-6 bg-white p-8 sm:p-12 rounded-[8px] border border-[#E7E2DA] shadow-[0_1px_2px_rgba(0,0,0,0.05)] space-y-6">
      <h1 className="font-serif font-semibold text-3xl text-[#1F2328]">Refund policy</h1>
      <p className="text-xs text-[#5F6368]">Last updated: October 2026</p>
      <div className="space-y-4 text-sm leading-relaxed text-[#5F6368]">
        <h2 className="font-serif font-semibold text-lg text-[#1F2328] pt-2">1. 7-day money-back guarantee</h2>
        <p>
          We want you to be fully satisfied with your learning experience. If you are not satisfied with a self-paced course, you may request a 100% refund within 7 days of initial purchase, provided you have watched less than 25% of the course lectures and have not completed any graded assessment.
        </p>
        <h2 className="font-serif font-semibold text-lg text-[#1F2328] pt-2">2. Refund processing</h2>
        <p>
          Approved refunds are processed back to the original payment source (card, UPI, or net banking) through Razorpay within 5 to 7 business days.
        </p>
      </div>
    </div>
  </div>
);
