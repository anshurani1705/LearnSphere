import React, { useState } from 'react';
import { api } from '../api/client';
import { Mail, Phone, MapPin, CheckCircle, Send, Loader2 } from 'lucide-react';
import { Alert } from '../components/ui/Alert';
import { Badge } from '../components/ui/Badge';

export const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Course Inquiry');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await api.post('/v1/public/contact', {
        name,
        email,
        subject,
        message,
      });
      setSuccess(true);
      setName('');
      setEmail('');
      setMessage('');
    } catch (err: any) {
      setError(err.message || 'Failed to submit inquiry.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 bg-[#FAFAF8] py-12 sm:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <Badge variant="teal" size="sm" className="mb-3">
            <Mail className="w-3.5 h-3.5" />
            <span>Support & Inquiries</span>
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#20252B] tracking-tight">
            Get in Touch
          </h1>
          <p className="text-xs sm:text-sm text-[#697386] mt-1.5 leading-relaxed">
            Have questions about technical curricula, enrollment, or verified certificates? Our support team is here to assist.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Details */}
          <div className="bg-[#172B4D] text-white p-6 sm:p-8 rounded-lg border border-slate-800 space-y-6 flex flex-col justify-between">
            <div>
              <h2 className="text-lg font-bold mb-2">Contact Details</h2>
              <p className="text-slate-300 text-xs leading-relaxed mb-6">
                Our support team typically responds to inquiries within 24 business hours.
              </p>

              <div className="space-y-5 text-xs sm:text-sm">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-4 h-4 text-teal-300 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-white">SkillForge Academy</p>
                    <p className="text-xs text-slate-300 mt-0.5">Bangalore, Karnataka, India</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Mail className="w-4 h-4 text-teal-300 shrink-0" />
                  <div>
                    <p className="font-semibold text-white">Email Inquiries</p>
                    <p className="text-xs text-slate-300 mt-0.5">support@skillforge.com</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-3 bg-white/5 rounded-md border border-white/10 text-xs text-slate-300">
              Verified credential queries can be verified directly at <span className="text-teal-300">/verify-certificate</span>.
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2 bg-white p-6 sm:p-8 rounded-lg border border-[#E5E7EB] shadow-card">
            {success ? (
              <div className="p-8 text-center space-y-3">
                <CheckCircle className="w-10 h-10 text-emerald-600 mx-auto" />
                <h3 className="text-lg font-bold text-[#20252B]">Message Received</h3>
                <p className="text-xs sm:text-sm text-[#697386] max-w-md mx-auto">
                  Thank you for contacting SkillForge. Our academic support team has received your message and will reply via email shortly.
                </p>
                <button
                  onClick={() => setSuccess(false)}
                  className="bg-[#172B4D] text-white font-medium text-xs px-4 py-2 rounded-md hover:bg-[#0F1E36] transition-colors"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <Alert type="error" message={error} />
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#20252B] mb-1.5">
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Priya Sharma"
                      className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-[#E5E7EB] rounded-md focus:outline-none focus:ring-2 focus:ring-[#172B4D] focus:bg-white text-[#20252B] transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#20252B] mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="priya@example.com"
                      className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-[#E5E7EB] rounded-md focus:outline-none focus:ring-2 focus:ring-[#172B4D] focus:bg-white text-[#20252B] transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#20252B] mb-1.5">
                    Inquiry Topic
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-[#E5E7EB] rounded-md focus:outline-none focus:ring-2 focus:ring-[#172B4D] focus:bg-white text-[#20252B] transition"
                  >
                    <option value="Course Inquiry">Course Inquiry</option>
                    <option value="Payment / Invoice Question">Payment / Invoice Question</option>
                    <option value="Certificate Verification">Certificate Verification</option>
                    <option value="Enterprise / Team Training">Enterprise / Team Training</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#20252B] mb-1.5">
                    Your Message
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe your inquiry or question in detail..."
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-[#E5E7EB] rounded-md focus:outline-none focus:ring-2 focus:ring-[#172B4D] focus:bg-white text-[#20252B] transition"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center space-x-2 bg-[#172B4D] hover:bg-[#0F1E36] text-white font-medium text-xs sm:text-sm px-5 py-2.5 rounded-md shadow-sm transition-colors disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
