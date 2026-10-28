import { api } from '../api/client';

/**
 * Downloads a certificate PDF file by unique certificate ID.
 * 
 * Prevents 0-byte blank file downloads by:
 * 1. Ensuring response.data is a valid non-empty Blob.
 * 2. Appending the download anchor tag to document.body.
 * 3. Keeping the object URL alive for 60 seconds so browser download manager
 *    asynchronously reads the full stream before revoking the blob URL.
 */
export async function downloadCertificatePdf(certificateId: string, customFilename?: string): Promise<void> {
  if (!certificateId) {
    throw new Error('Certificate ID is required.');
  }

  const response = await api.get(`/v1/certificates/${certificateId}/download`, {
    responseType: 'blob',
  });

  if (!response.data) {
    throw new Error('No data received from certificate download endpoint.');
  }

  const blob = response.data instanceof Blob
    ? response.data
    : new Blob([response.data], { type: 'application/pdf' });

  if (blob.size === 0) {
    throw new Error('Certificate PDF content is empty (0 bytes).');
  }

  const filename = customFilename || `${certificateId}.pdf`;
  const blobUrl = window.URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.style.display = 'none';
  link.href = blobUrl;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();

  // Keep object URL active for 60 seconds so browser download manager streams entire file
  setTimeout(() => {
    try {
      if (document.body.contains(link)) {
        document.body.removeChild(link);
      }
      window.URL.revokeObjectURL(blobUrl);
    } catch {
      // Ignored if already cleaned up
    }
  }, 60000);
}
