import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../../api/client';
import { AdminNav } from '../../components/AdminNav';
import { CourseDetail, Category, CourseSection, Lesson } from '../../types';
import {
  ArrowLeft,
  Save,
  CheckCircle,
  AlertCircle,
  Upload,
  Plus,
  Trash2,
  Edit2,
  Video,
  FileText,
  File,
  Layers,
  Clock,
  Eye,
  IndianRupee,
} from 'lucide-react';

export const AdminCourseEditorPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();

  // Categories
  const [categories, setCategories] = useState<Category[]>([]);

  // Form State
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [shortDesc, setShortDesc] = useState('');
  const [description, setDescription] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [category, setCategory] = useState('Web Development');
  const [instructorName, setInstructorName] = useState('SkillForge Faculty');
  const [instructorBio, setInstructorBio] = useState('');
  const [durationHours, setDurationHours] = useState('40');
  const [price, setPrice] = useState('2999');
  const [originalPrice, setOriginalPrice] = useState('5999');
  const [level, setLevel] = useState<'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'>('BEGINNER');
  const [language, setLanguage] = useState('English');
  const [featured, setFeatured] = useState(false);
  const [status, setStatus] = useState<'DRAFT' | 'PUBLISHED' | 'UNPUBLISHED' | 'ARCHIVED'>('DRAFT');

  // List fields
  const [outcomes, setOutcomes] = useState<string[]>(['']);
  const [prereqs, setPrereqs] = useState<string[]>(['']);
  const [targetAudience, setTargetAudience] = useState<string[]>(['']);

  // Curriculum State (for edit mode)
  const [sections, setSections] = useState<CourseSection[]>([]);
  const [activeTab, setActiveTab] = useState<'details' | 'curriculum'>('details');

  // Section modal state
  const [showSectionModal, setShowSectionModal] = useState(false);
  const [editingSectionId, setEditingSectionId] = useState<number | null>(null);
  const [sectionTitle, setSectionTitle] = useState('');
  const [sectionDesc, setSectionDesc] = useState('');

  // Lesson modal state
  const [showLessonModal, setShowLessonModal] = useState(false);
  const [lessonSectionId, setLessonSectionId] = useState<number | null>(null);
  const [editingLessonId, setEditingLessonId] = useState<number | null>(null);
  const [lessonTitle, setLessonTitle] = useState('');
  const [lessonDesc, setLessonDesc] = useState('');
  const [lessonType, setLessonType] = useState<'VIDEO' | 'TEXT' | 'PDF' | 'RESOURCE'>('VIDEO');
  const [lessonVideoUrl, setLessonVideoUrl] = useState('');
  const [lessonDuration, setLessonDuration] = useState('600');
  const [lessonContentText, setLessonContentText] = useState('');
  const [lessonPreview, setLessonPreview] = useState(false);
  const [lessonMandatory, setLessonMandatory] = useState(true);

  // Upload progress states
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);
  const [thumbnailProgress, setThumbnailProgress] = useState(0);
  const [uploadingLessonFile, setUploadingLessonFile] = useState(false);
  const [lessonFileProgress, setLessonFileProgress] = useState(0);

  // Submission / Loading states
  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch initial data
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/v1/admin/categories');
        if (res.data?.success) {
          setCategories(res.data.data);
          if (!isEditMode && res.data.data.length > 0) {
            setCategory(res.data.data[0].name);
          }
        }
      } catch (err) {
        console.error('Failed to load categories', err);
      }
    };
    fetchCategories();

    if (isEditMode) {
      const fetchCourse = async () => {
        try {
          const res = await api.get(`/v1/admin/courses/${id}`);
          if (res.data?.success) {
            const c: CourseDetail = res.data.data;
            setTitle(c.title || '');
            setSlug(c.slug || '');
            setShortDesc(c.shortDescription || '');
            setDescription(c.description || '');
            setThumbnailUrl(c.thumbnailUrl || '');
            setCategory(c.category || 'General');
            setInstructorName(c.instructorName || 'SkillForge Faculty');
            setInstructorBio(c.instructorBio || '');
            setDurationHours(c.durationHours ? String(c.durationHours) : '40');
            setPrice(c.price !== undefined ? String(c.price) : '0');
            setOriginalPrice(c.originalPrice !== undefined ? String(c.originalPrice) : '');
            setLevel(c.level || 'BEGINNER');
            setLanguage(c.language || 'English');
            setFeatured(c.featured || false);
            setStatus(c.status || 'DRAFT');

            setOutcomes(c.learningOutcomes && c.learningOutcomes.length > 0 ? c.learningOutcomes : ['']);
            setPrereqs(c.prerequisites && c.prerequisites.length > 0 ? c.prerequisites : ['']);
            setTargetAudience(c.targetAudience && c.targetAudience.length > 0 ? c.targetAudience : ['']);
            setSections(c.sections || []);
          }
        } catch (err: any) {
          setErrorMessage(err.response?.data?.message || 'Failed to load course details');
        } finally {
          setLoading(false);
        }
      };
      fetchCourse();
    }
  }, [id, isEditMode]);

  // Upload Thumbnail Handler
  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingThumbnail(true);
    setThumbnailProgress(10);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', 'thumbnails');

    try {
      const res = await api.post('/v1/admin/files/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setThumbnailProgress(percent);
          }
        },
      });

      if (res.data?.success) {
        setThumbnailUrl(res.data.data.url);
        setSuccessMessage('Thumbnail uploaded successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to upload thumbnail');
    } finally {
      setUploadingThumbnail(false);
      setThumbnailProgress(0);
    }
  };

  // Upload Lesson Video / Document File Handler
  const handleLessonFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingLessonFile(true);
    setLessonFileProgress(10);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', lessonType === 'VIDEO' ? 'videos' : 'materials');

    try {
      const res = await api.post('/v1/admin/files/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setLessonFileProgress(percent);
          }
        },
      });

      if (res.data?.success) {
        setLessonVideoUrl(res.data.data.url);
        alert('File uploaded successfully!');
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to upload lesson file');
    } finally {
      setUploadingLessonFile(false);
      setLessonFileProgress(0);
    }
  };

  // Save / Submit Course
  const handleSaveCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    // Front-end Price Rule Validations
    const numPrice = parseFloat(price);
    const numOriginal = originalPrice ? parseFloat(originalPrice) : undefined;

    if (isNaN(numPrice) || numPrice < 0) {
      setErrorMessage('Price must be a valid non-negative number.');
      return;
    }

    if (numOriginal !== undefined && !isNaN(numOriginal)) {
      if (numOriginal < 0) {
        setErrorMessage('Original price cannot be negative.');
        return;
      }
      if (numOriginal > 0 && numPrice > numOriginal) {
        setErrorMessage('Regular price cannot exceed the original discounted price.');
        return;
      }
    }

    setSaving(true);
    const payload = {
      title,
      slug: slug || undefined,
      shortDescription: shortDesc,
      description,
      thumbnailUrl,
      category,
      instructorName,
      instructorBio,
      durationHours: durationHours ? parseInt(durationHours, 10) : 40,
      price: numPrice,
      originalPrice: numOriginal,
      level,
      language,
      featured,
      status,
      learningOutcomes: outcomes.filter((o) => o.trim().length > 0),
      prerequisites: prereqs.filter((p) => p.trim().length > 0),
      targetAudience: targetAudience.filter((t) => t.trim().length > 0),
    };

    try {
      if (isEditMode) {
        const res = await api.put(`/v1/admin/courses/${id}`, payload);
        if (res.data?.success) {
          setSuccessMessage('Course updated successfully!');
          setTimeout(() => setSuccessMessage(''), 3000);
        }
      } else {
        const res = await api.post('/v1/admin/courses', payload);
        if (res.data?.success) {
          const newCourseId = res.data.data.id;
          navigate(`/admin/courses/${newCourseId}/edit`);
        }
      }
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || 'Failed to save course. Please verify required fields.');
    } finally {
      setSaving(false);
    }
  };

  // Section Management
  const handleSaveSection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sectionTitle.trim()) return;

    try {
      if (editingSectionId) {
        await api.put(`/v1/admin/sections/${editingSectionId}`, {
          title: sectionTitle,
          description: sectionDesc,
        });
      } else {
        await api.post(`/v1/admin/courses/${id}/sections`, {
          title: sectionTitle,
          description: sectionDesc,
        });
      }
      setShowSectionModal(false);
      setSectionTitle('');
      setSectionDesc('');
      setEditingSectionId(null);
      // Reload course
      const res = await api.get(`/v1/admin/courses/${id}`);
      if (res.data?.success) setSections(res.data.data.sections || []);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to save section');
    }
  };

  const handleDeleteSection = async (secId: number) => {
    if (!window.confirm('Are you sure you want to delete this section and all its lessons?')) return;
    try {
      await api.delete(`/v1/admin/sections/${secId}`);
      setSections(sections.filter((s) => s.id !== secId));
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete section');
    }
  };

  // Lesson Management
  const handleSaveLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lessonTitle.trim() || !lessonSectionId) return;

    const payload = {
      title: lessonTitle,
      description: lessonDesc,
      contentType: lessonType,
      videoUrl: lessonVideoUrl,
      videoDurationSeconds: lessonDuration ? parseInt(lessonDuration, 10) : 600,
      contentText: lessonContentText,
      preview: lessonPreview,
      mandatory: lessonMandatory,
    };

    try {
      if (editingLessonId) {
        await api.put(`/v1/admin/lessons/${editingLessonId}`, payload);
      } else {
        await api.post(`/v1/admin/sections/${lessonSectionId}/lessons`, payload);
      }
      setShowLessonModal(false);
      setLessonTitle('');
      setLessonDesc('');
      setLessonVideoUrl('');
      setLessonContentText('');
      setEditingLessonId(null);
      // Reload course
      const res = await api.get(`/v1/admin/courses/${id}`);
      if (res.data?.success) setSections(res.data.data.sections || []);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to save lesson');
    }
  };

  const handleDeleteLesson = async (lessonId: number) => {
    if (!window.confirm('Are you sure you want to delete this lesson?')) return;
    try {
      await api.delete(`/v1/admin/lessons/${lessonId}`);
      // Reload course
      const res = await api.get(`/v1/admin/courses/${id}`);
      if (res.data?.success) setSections(res.data.data.sections || []);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete lesson');
    }
  };

  if (loading) {
    return (
      <div className="flex-1 bg-slate-50 min-h-screen">
        <AdminNav />
        <div className="flex items-center justify-center py-24">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-slate-50 min-h-screen pb-16">
      <AdminNav />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Bar */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Link
              to="/admin/courses"
              className="p-2 bg-white rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 shadow-sm"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900">
                {isEditMode ? `Edit Course: ${title || 'Untitled'}` : 'Create New Company Course'}
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                {isEditMode
                  ? 'Update curriculum structure, pricing rules, and publication status.'
                  : 'Configure company course attributes, outcomes, and initial pricing.'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {isEditMode && slug && (
              <a
                href={`/courses/${slug}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center space-x-1.5 px-3 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-xl shadow-sm hover:bg-slate-50 transition"
              >
                <Eye className="w-4 h-4 text-slate-500" />
                <span>Public Preview</span>
              </a>
            )}
            <button
              onClick={handleSaveCourse}
              disabled={saving}
              className="inline-flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm px-5 py-2.5 rounded-xl shadow transition disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Save Course'}</span>
            </button>
          </div>
        </div>

        {/* Alerts */}
        {errorMessage && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start space-x-3 text-rose-800 text-sm">
            <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Cannot Save Course</p>
              <p className="mt-0.5">{errorMessage}</p>
            </div>
          </div>
        )}

        {successMessage && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start space-x-3 text-emerald-800 text-sm">
            <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <p className="font-semibold">{successMessage}</p>
          </div>
        )}

        {/* Tab switcher for edit mode */}
        {isEditMode && (
          <div className="flex border-b border-slate-200 mb-6 space-x-6">
            <button
              type="button"
              onClick={() => setActiveTab('details')}
              className={`pb-3 text-sm font-bold border-b-2 transition ${
                activeTab === 'details'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              Course Information & Settings
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('curriculum')}
              className={`pb-3 text-sm font-bold border-b-2 transition flex items-center space-x-2 ${
                activeTab === 'curriculum'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              <span>Curriculum & Lessons</span>
              <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full text-xs font-mono">
                {sections.reduce((acc, s) => acc + (s.lessons?.length || 0), 0)} lessons
              </span>
            </button>
          </div>
        )}

        {/* Tab 1: Course Information */}
        {activeTab === 'details' && (
          <form onSubmit={handleSaveCourse} className="space-y-6">
            {/* Primary Details Card */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
              <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">Primary Metadata</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Course Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Full-Stack Web Development Bootcamp"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Unique URL Slug
                  </label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="auto-generated-from-title"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 text-sm font-mono text-slate-600"
                  />
                  <p className="text-xs text-slate-400 mt-1">Leave empty to automatically generate from title.</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 text-sm bg-white"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                    {categories.length === 0 && <option value="General">General</option>}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Difficulty Level
                  </label>
                  <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value as any)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 text-sm bg-white"
                  >
                    <option value="BEGINNER">Beginner</option>
                    <option value="INTERMEDIATE">Intermediate</option>
                    <option value="ADVANCED">Advanced</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Estimated Duration (Hours)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={durationHours}
                    onChange={(e) => setDurationHours(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Presenter / Instructor Name
                  </label>
                  <input
                    type="text"
                    value={instructorName}
                    onChange={(e) => setInstructorName(e.target.value)}
                    placeholder="SkillForge Faculty or Instructor"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Instruction Language
                  </label>
                  <input
                    type="text"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Short Catalog Description (Max 500 characters)
                </label>
                <textarea
                  rows={2}
                  maxLength={500}
                  value={shortDesc}
                  onChange={(e) => setShortDesc(e.target.value)}
                  placeholder="A concise summary displayed on cards and course previews..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Full Syllabus & Course Description (Markdown Supported)
                </label>
                <textarea
                  rows={6}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detailed curriculum overview, tools covered, hands-on projects, and prerequisites..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 text-sm font-mono"
                />
              </div>
            </div>

            {/* Pricing & Publication Status Card */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
              <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
                Pricing Rules & Publication State
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Regular Enrolled Price (₹ INR) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-slate-400 font-bold text-sm">₹</span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      required
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 text-sm font-bold"
                    />
                  </div>
                  <p className="text-xs text-slate-400 mt-1">Authoritative fee charged at checkout.</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Original Strike-through Price (₹ INR)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-slate-400 font-bold text-sm">₹</span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={originalPrice}
                      onChange={(e) => setOriginalPrice(e.target.value)}
                      className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 text-sm"
                    />
                  </div>
                  <p className="text-xs text-slate-400 mt-1">Must be ≥ regular price.</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Publication Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 text-sm font-bold bg-white"
                  >
                    <option value="DRAFT">DRAFT (Unpublished preview)</option>
                    <option value="PUBLISHED">PUBLISHED (Live in catalog)</option>
                    <option value="UNPUBLISHED">UNPUBLISHED (Hidden from catalog)</option>
                    <option value="ARCHIVED">ARCHIVED (Discontinued)</option>
                  </select>
                  <p className="text-xs text-slate-400 mt-1">
                    Published courses require a title, description, and at least 1 lesson.
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3 pt-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                />
                <label htmlFor="featured" className="text-sm font-semibold text-slate-800">
                  Highlight as Featured Course on Home Page Carousel
                </label>
              </div>
            </div>

            {/* Thumbnail Upload Card */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">Course Thumbnail</h2>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                {thumbnailUrl ? (
                  <img
                    src={thumbnailUrl}
                    alt="Course Preview"
                    className="w-44 h-28 object-cover rounded-xl border border-slate-200 shadow-sm"
                  />
                ) : (
                  <div className="w-44 h-28 bg-slate-100 rounded-xl border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400 text-xs text-center p-2">
                    No image uploaded
                  </div>
                )}

                <div className="flex-1 space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Upload Image (PNG, JPG, WebP)
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleThumbnailUpload}
                      disabled={uploadingThumbnail}
                      className="text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                    />
                  </div>

                  {uploadingThumbnail && (
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${thumbnailProgress}%` }}
                      ></div>
                    </div>
                  )}

                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-slate-400">or paste direct image URL:</span>
                    <input
                      type="url"
                      value={thumbnailUrl}
                      onChange={(e) => setThumbnailUrl(e.target.value)}
                      placeholder="https://..."
                      className="flex-1 px-3 py-1.5 rounded-lg border border-slate-300 text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Structured Learning Lists Card */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
                Learning Objectives, Prerequisites & Audience
              </h2>

              {/* Outcomes */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    What Students Will Learn
                  </label>
                  <button
                    type="button"
                    onClick={() => setOutcomes([...outcomes, ''])}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center space-x-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Item</span>
                  </button>
                </div>
                {outcomes.map((item, idx) => (
                  <div key={idx} className="flex items-center space-x-2 mb-2">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => {
                        const next = [...outcomes];
                        next[idx] = e.target.value;
                        setOutcomes(next);
                      }}
                      placeholder={`e.g. Master React hooks, state management, and modern routing`}
                      className="flex-1 px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
                    />
                    {outcomes.length > 1 && (
                      <button
                        type="button"
                        onClick={() => setOutcomes(outcomes.filter((_, i) => i !== idx))}
                        className="p-2 text-slate-400 hover:text-rose-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Prerequisites */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Course Prerequisites</label>
                  <button
                    type="button"
                    onClick={() => setPrereqs([...prereqs, ''])}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center space-x-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Item</span>
                  </button>
                </div>
                {prereqs.map((item, idx) => (
                  <div key={idx} className="flex items-center space-x-2 mb-2">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => {
                        const next = [...prereqs];
                        next[idx] = e.target.value;
                        setPrereqs(next);
                      }}
                      placeholder={`e.g. Basic computer skills and knowledge of high school mathematics`}
                      className="flex-1 px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
                    />
                    {prereqs.length > 1 && (
                      <button
                        type="button"
                        onClick={() => setPrereqs(prereqs.filter((_, i) => i !== idx))}
                        className="p-2 text-slate-400 hover:text-rose-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Target Audience */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Target Audience</label>
                  <button
                    type="button"
                    onClick={() => setTargetAudience([...targetAudience, ''])}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center space-x-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Item</span>
                  </button>
                </div>
                {targetAudience.map((item, idx) => (
                  <div key={idx} className="flex items-center space-x-2 mb-2">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => {
                        const next = [...targetAudience];
                        next[idx] = e.target.value;
                        setTargetAudience(next);
                      }}
                      placeholder={`e.g. Aspiring software engineers and career switchers`}
                      className="flex-1 px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
                    />
                    {targetAudience.length > 1 && (
                      <button
                        type="button"
                        onClick={() => setTargetAudience(targetAudience.filter((_, i) => i !== idx))}
                        className="p-2 text-slate-400 hover:text-rose-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex justify-end space-x-4 pt-4">
              <Link
                to="/admin/courses"
                className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 text-sm font-bold rounded-xl shadow-sm hover:bg-slate-50 transition"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm px-6 py-2.5 rounded-xl shadow transition disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Saving...' : 'Save Course'}</span>
              </button>
            </div>
          </form>
        )}

        {/* Tab 2: Curriculum & Lessons Builder (for edit mode) */}
        {activeTab === 'curriculum' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Curriculum Sections & Video Lessons</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Organize modules, upload lecture videos, PDF handouts, and configure preview lessons.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEditingSectionId(null);
                  setSectionTitle('');
                  setSectionDesc('');
                  setShowSectionModal(true);
                }}
                className="inline-flex items-center space-x-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow transition"
              >
                <Plus className="w-4 h-4" />
                <span>Add Section</span>
              </button>
            </div>

            {sections.length === 0 ? (
              <div className="bg-white p-12 rounded-2xl border-2 border-dashed border-slate-200 text-center">
                <Layers className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-800">No Curriculum Sections Yet</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
                  Add your first curriculum module or section to start creating video and text lessons.
                </p>
                <button
                  type="button"
                  onClick={() => setShowSectionModal(true)}
                  className="bg-indigo-600 text-white text-xs font-bold px-4 py-2 rounded-xl"
                >
                  Create First Section
                </button>
              </div>
            ) : (
              sections.map((section, sIdx) => (
                <div key={section.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                        Section {sIdx + 1}
                      </span>
                      <h3 className="text-base font-extrabold text-slate-900">{section.title}</h3>
                      {section.description && <p className="text-xs text-slate-500 mt-0.5">{section.description}</p>}
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => {
                          setLessonSectionId(section.id);
                          setEditingLessonId(null);
                          setLessonTitle('');
                          setLessonDesc('');
                          setLessonVideoUrl('');
                          setLessonContentText('');
                          setLessonPreview(false);
                          setShowLessonModal(true);
                        }}
                        className="inline-flex items-center space-x-1 px-3 py-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 text-xs font-bold rounded-lg transition"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Lesson</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingSectionId(section.id);
                          setSectionTitle(section.title);
                          setSectionDesc(section.description || '');
                          setShowSectionModal(true);
                        }}
                        className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteSection(section.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Lessons list in this section */}
                  <div className="divide-y divide-slate-100">
                    {section.lessons && section.lessons.length > 0 ? (
                      section.lessons.map((lesson, lIdx) => (
                        <div
                          key={lesson.id}
                          className="p-4 flex items-center justify-between hover:bg-slate-50 transition"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                              {lesson.contentType === 'VIDEO' ? (
                                <Video className="w-4 h-4" />
                              ) : lesson.contentType === 'PDF' ? (
                                <File className="w-4 h-4" />
                              ) : (
                                <FileText className="w-4 h-4" />
                              )}
                            </div>
                            <div>
                              <div className="flex items-center space-x-2">
                                <span className="font-bold text-slate-900 text-sm">{lesson.title}</span>
                                {lesson.preview && (
                                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                                    Free Preview
                                  </span>
                                )}
                                {!lesson.mandatory && (
                                  <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
                                    Optional
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center space-x-3 text-xs text-slate-400 mt-0.5">
                                <span>{lesson.contentType}</span>
                                {lesson.videoDurationSeconds && (
                                  <span>{Math.round(lesson.videoDurationSeconds / 60)} mins</span>
                                )}
                                {lesson.videoUrl && (
                                  <span className="text-slate-500 truncate max-w-xs">{lesson.videoUrl}</span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            <button
                              type="button"
                              onClick={() => {
                                setLessonSectionId(section.id);
                                setEditingLessonId(lesson.id);
                                setLessonTitle(lesson.title);
                                setLessonDesc(lesson.description || '');
                                setLessonType(lesson.contentType);
                                setLessonVideoUrl(lesson.videoUrl || '');
                                setLessonDuration(String(lesson.videoDurationSeconds || 600));
                                setLessonContentText(lesson.contentText || '');
                                setLessonPreview(lesson.preview);
                                setLessonMandatory(lesson.mandatory);
                                setShowLessonModal(true);
                              }}
                              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteLesson(lesson.id)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-xs text-slate-400 italic">
                        No lessons in this section yet. Click "+ Add Lesson" to upload a video or create lecture notes.
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Section Modal */}
        {showSectionModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4">
              <h3 className="text-lg font-bold text-slate-900">
                {editingSectionId ? 'Edit Section' : 'Add Curriculum Section'}
              </h3>
              <form onSubmit={handleSaveSection} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Section Title *</label>
                  <input
                    type="text"
                    required
                    value={sectionTitle}
                    onChange={(e) => setSectionTitle(e.target.value)}
                    placeholder="e.g. Module 1: Core Fundamentals"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Section Overview</label>
                  <textarea
                    rows={3}
                    value={sectionDesc}
                    onChange={(e) => setSectionDesc(e.target.value)}
                    placeholder="Brief description of skills covered in this module..."
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="flex justify-end space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowSectionModal(false)}
                    className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow"
                  >
                    Save Section
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Lesson Modal with Video/File Upload */}
        {showLessonModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl space-y-4 my-8">
              <h3 className="text-lg font-bold text-slate-900">
                {editingLessonId ? 'Edit Lesson' : 'Add Lesson to Section'}
              </h3>
              <form onSubmit={handleSaveLesson} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Lesson Title *</label>
                  <input
                    type="text"
                    required
                    value={lessonTitle}
                    onChange={(e) => setLessonTitle(e.target.value)}
                    placeholder="e.g. 1.1 Introduction to Node.js Runtime"
                    className="w-full px-4 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Content Type</label>
                    <select
                      value={lessonType}
                      onChange={(e) => setLessonType(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm bg-white"
                    >
                      <option value="VIDEO">Video Lecture</option>
                      <option value="TEXT">Text / Article</option>
                      <option value="PDF">PDF Presentation / Notes</option>
                      <option value="RESOURCE">Supplementary Resource</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Duration (Seconds)</label>
                    <input
                      type="number"
                      value={lessonDuration}
                      onChange={(e) => setLessonDuration(e.target.value)}
                      placeholder="600"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
                    />
                  </div>
                </div>

                {/* Video / File Upload Section */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                  <label className="block text-xs font-bold text-slate-700 uppercase">
                    {lessonType === 'VIDEO' ? 'Upload Video Lecture (MP4, WebM)' : 'Upload Lesson Document (PDF, ZIP, PPT)'}
                  </label>
                  <input
                    type="file"
                    accept={lessonType === 'VIDEO' ? 'video/mp4,video/webm' : '.pdf,.ppt,.pptx,.docx,.zip'}
                    onChange={handleLessonFileUpload}
                    disabled={uploadingLessonFile}
                    className="text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-indigo-600 file:text-white"
                  />
                  {uploadingLessonFile && (
                    <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${lessonFileProgress}%` }}
                      ></div>
                    </div>
                  )}
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">or provide existing URL / Storage Key:</label>
                    <input
                      type="text"
                      value={lessonVideoUrl}
                      onChange={(e) => setLessonVideoUrl(e.target.value)}
                      placeholder="https://... or /api/v1/files/download?key=..."
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Lesson Description or Text Content
                  </label>
                  <textarea
                    rows={3}
                    value={lessonContentText}
                    onChange={(e) => setLessonContentText(e.target.value)}
                    placeholder="Lesson notes, code snippets, or reference links..."
                    className="w-full px-4 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="flex items-center space-x-6 pt-1">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="lessonPreview"
                      checked={lessonPreview}
                      onChange={(e) => setLessonPreview(e.target.checked)}
                      className="w-4 h-4 text-indigo-600 rounded"
                    />
                    <label htmlFor="lessonPreview" className="text-xs font-bold text-slate-800">
                      Free Preview (Public)
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="lessonMandatory"
                      checked={lessonMandatory}
                      onChange={(e) => setLessonMandatory(e.target.checked)}
                      className="w-4 h-4 text-indigo-600 rounded"
                    />
                    <label htmlFor="lessonMandatory" className="text-xs font-bold text-slate-800">
                      Mandatory for Certificate
                    </label>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowLessonModal(false)}
                    className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow"
                  >
                    Save Lesson
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
