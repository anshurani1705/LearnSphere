import React, { useState } from 'react';
import { api } from '../api/client';
import { Mail, Phone, MapPin, CheckCircle, AlertCircle, Send } from 'lucide-react';

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
    <div className="flex-1 bg-slate-50 py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">Get in Touch</h1>
          <p className="text-slate-600 text-sm mt-2">
            Have questions about curricula, enterprise team training, or payment plans? Our team is here to assist.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Contact Details */}
          <div className="bg-slate-900 text-white p-8 rounded-2xl border border-slate-800 space-y-8 flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-bold mb-4">Contact Information</h2>
              <p className="text-slate-400 text-xs leading-relaxed mb-6">
                Our support and admissions counselors respond within 24 business hours.
              </p>

              <div className="space-y-6 text-sm">
                <div className="flex items-start space-x-4">
                  <MapPin className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-white">SkillForge Headquarters</p>
                    <p className="text-xs text-slate-400 mt-0.5">Koramangala 4th Block, Bangalore, Karnataka 560034</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <Phone className="w-5 h-5 text-indigo-400 shrink-0" />
                  <div>
                    <p className="font-semibold text-white">Admissions Hotline</p>
                    <p className="text-xs text-slate-400 mt-0.5">+91 98765 43210</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <Mail className="w-5 h-5 text-indigo-400 shrink-0" />
                  <div>
                    <p className="font-semibold text-white">General Inquiries</p>
                    <p className="text-xs text-slate-400 mt-0.5">hello@skillforge.com</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-800/80 rounded-xl border border-slate-700/60 text-xs text-slate-400">
              WhatsApp notification support available for enrolled students 7 days a week.
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2 bg-white p-8 sm:p-10 rounded-2xl border border-slate-200 shadow-sm">
            {success ? (
              <div className="p-8 text-center space-y-4">
                <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto" />
                <h3 className="text-xl font-bold text-slate-900">Message Dispatched!</h3>
                <p className="text-slate-600 text-sm max-w-md mx-auto">
                  Thank you for reaching out. An academic advisor has received your message and will reply to your email shortly.
                </p>
                <button
                  onClick={() => setSuccess(false)}
                  className="bg-indigo-600 text-white font-semibold text-xs px-5 py-2.5 rounded-lg hover:bg-indigo-700 transition"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Priya Sharma"
                      className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="priya@example.com"
                      className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Subject
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900"
                  >
                    <option value="Course Inquiry">Course Inquiry</option>
                    <option value="Payment / Invoice Question">Payment / Invoice Question</option>
                    <option value="Certificate Verification">Certificate Verification</option>
                    <option value="Corporate / Team Training">Corporate / Team Training</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Your Message
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us how we can help you..."
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm px-6 py-3 rounded-xl shadow transition disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{loading ? 'Sending Message...' : 'Dispatch Message'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
