import React, { useState } from 'react';
import { api } from '../api/client';
import { Mail, Phone, MapPin, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Course inquiry');
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
    <div className="flex-1 bg-[#FAF8F5] py-16 lg:py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-12">
          <h1 className="font-serif font-semibold text-3xl sm:text-4xl text-[#1F2328] tracking-tight">
            Contact us
          </h1>
          <p className="text-sm sm:text-base text-[#5F6368] mt-2">
            Questions about course content, payment options, or team access? We typically respond within one business day.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Contact Details Card */}
          <div className="lg:col-span-4 bg-white p-6 rounded-[8px] border border-[#E7E2DA] shadow-[0_1px_2px_rgba(0,0,0,0.05)] space-y-6">
            <h2 className="font-serif font-semibold text-lg text-[#1F2328]">
              Direct support
            </h2>

            <div className="space-y-4 text-sm">
              <div className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-[#0E6B6B] shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-[#1F2328]">Bangalore office</p>
                  <p className="text-xs text-[#5F6368] mt-0.5">Koramangala 4th Block, Bangalore, Karnataka 560034</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Phone className="w-4 h-4 text-[#0E6B6B] shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-[#1F2328]">Phone support</p>
                  <p className="text-xs text-[#5F6368] mt-0.5">+91 98765 43210 (Mon–Fri, 9am–6pm IST)</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Mail className="w-4 h-4 text-[#0E6B6B] shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-[#1F2328]">Email</p>
                  <p className="text-xs text-[#5F6368] mt-0.5">hello@skillforge.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Card */}
          <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-[8px] border border-[#E7E2DA] shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
            {success ? (
              <div className="p-6 text-center space-y-3">
                <div className="w-10 h-10 rounded-full bg-[#2F855A]/10 text-[#2F855A] flex items-center justify-center mx-auto">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <h3 className="font-serif font-semibold text-xl text-[#1F2328]">Message sent</h3>
                <p className="text-[#5F6368] text-sm max-w-sm mx-auto">
                  Thank you for writing. We received your note and will get back to you by email shortly.
                </p>
                <button
                  onClick={() => setSuccess(false)}
                  className="bg-[#0E6B6B] text-white text-xs font-medium px-4 py-2 rounded-[6px] hover:bg-[#0A5555] transition mt-2"
                >
                  Send another note
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 bg-[#C0392B]/10 border border-[#C0392B]/20 rounded-[6px] text-xs text-[#C0392B] flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#1F2328] mb-1.5">
                      Your name
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Priya Sharma"
                      className="w-full px-3 py-2 text-sm bg-white border border-[#E7E2DA] rounded-[6px] text-[#1F2328] placeholder-[#8B949E] focus-ring"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#1F2328] mb-1.5">
                      Email address
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="priya@example.com"
                      className="w-full px-3 py-2 text-sm bg-white border border-[#E7E2DA] rounded-[6px] text-[#1F2328] placeholder-[#8B949E] focus-ring"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#1F2328] mb-1.5">
                    Subject
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-white border border-[#E7E2DA] rounded-[6px] text-[#1F2328] focus-ring"
                  >
                    <option value="Course inquiry">Course inquiry</option>
                    <option value="Payment or invoice question">Payment or invoice question</option>
                    <option value="Certificate verification">Certificate verification</option>
                    <option value="Team or university access">Team or university access</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#1F2328] mb-1.5">
                    Message
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us what you are working on or how we can assist..."
                    className="w-full px-3 py-2 text-sm bg-white border border-[#E7E2DA] rounded-[6px] text-[#1F2328] placeholder-[#8B949E] focus-ring"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="bg-[#0E6B6B] hover:bg-[#0A5555] text-white font-medium text-sm px-5 py-2.5 rounded-[6px] transition disabled:opacity-50 flex items-center space-x-2 focus-ring"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <span>Send message</span>
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
