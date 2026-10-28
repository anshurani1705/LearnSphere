import React, { useEffect, useState } from 'react';
import { api } from '../../api/client';
import { Certificate } from '../../types';
import { AdminNav } from '../../components/AdminNav';
import { Award, Download, CheckCircle, ExternalLink, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { downloadCertificatePdf } from '../../utils/fileDownload';

export const AdminCertificatesPage: React.FC = () => {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloadingCertId, setDownloadingCertId] = useState<string | null>(null);

  useEffect(() => {
    const fetchCerts = async () => {
      try {
        const res = await api.get('/v1/admin/certificates', { params: { size: 50 } });
        if (res.data?.success) {
          setCertificates(res.data.data.content);
        }
      } catch (err) {
        console.error('Failed to load certificates', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCerts();
  }, []);

  const handleDownload = async (certId: string) => {
    setDownloadingCertId(certId);
    try {
      await downloadCertificatePdf(certId, `certificate-${certId}.pdf`);
    } catch (err: any) {
      alert(err.message || 'Failed to download certificate PDF.');
    } finally {
      setDownloadingCertId(null);
    }
  };

  return (
    <div className="flex-1 bg-slate-50 min-h-screen pb-16">
      <AdminNav />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Issued Certificates</h1>
          <p className="text-slate-500 text-sm mt-1">
            Audit verifiable, cryptographically authenticated PDF completion certificates awarded to students.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
          ) : certificates.length === 0 ? (
            <div className="p-12 text-center">
              <Award className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-800">No Certificates Awarded Yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
                Certificates are automatically generated and awarded when students complete 100% of mandatory lessons and pass required course quizzes.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 text-xs uppercase font-bold text-slate-500 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4">Certificate ID</th>
                    <th className="px-6 py-4">Student Name</th>
                    <th className="px-6 py-4">Course Title</th>
                    <th className="px-6 py-4">Issue Date</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {certificates.map((cert) => (
                    <tr key={cert.id} className="hover:bg-slate-50 transition">
                      <td className="px-6 py-4 font-mono font-bold text-xs text-indigo-700">
                        {cert.certificateId}
                      </td>
                      <td className="px-6 py-4 font-semibold text-slate-900">{cert.studentName}</td>
                      <td className="px-6 py-4 text-slate-800">{cert.courseTitle}</td>
                      <td className="px-6 py-4 text-xs text-slate-500">{cert.issueDate}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Link
                            to={`/verify-certificate/${cert.certificateId}`}
                            target="_blank"
                            className="inline-flex items-center space-x-1 px-2.5 py-1 text-xs font-bold text-slate-600 hover:text-indigo-600 bg-slate-100 rounded-lg"
                          >
                            <span>Verify</span>
                            <ExternalLink className="w-3 h-3" />
                          </Link>
                          <button
                            onClick={() => handleDownload(cert.certificateId)}
                            disabled={downloadingCertId === cert.certificateId}
                            className="inline-flex items-center space-x-1 px-2.5 py-1 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm disabled:opacity-60"
                          >
                            {downloadingCertId === cert.certificateId ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <Download className="w-3 h-3" />
                            )}
                            <span>{downloadingCertId === cert.certificateId ? '...' : 'PDF'}</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
