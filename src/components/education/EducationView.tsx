import React, { useState } from 'react';
import { EducationCourse, UserProfile } from '../../types';
import { callAnyworkAIStudy } from '../../services/supabaseClient';
import {
  BookOpen,
  Award,
  Users,
  Clock,
  CheckCircle2,
  Download,
  Sparkles,
  ArrowRight,
  Mic,
  Volume2,
  VolumeX,
  AlertTriangle,
  Send,
  Loader2,
} from 'lucide-react';

interface EducationViewProps {
  currentUser: UserProfile;
  courses: EducationCourse[];
  onNavigateToCrackExam: () => void;
}

export const EducationView: React.FC<EducationViewProps> = ({
  currentUser,
  courses,
  onNavigateToCrackExam,
}) => {
  const [enrolledCourseIds, setEnrolledCourseIds] = useState<string[]>([]);
  const [downloadSuccessMessage, setDownloadSuccessMessage] = useState<string | null>(null);

  // AI Study Assistant State
  const [aiTopic, setAiTopic] = useState('');
  const [aiLevel, setAiLevel] = useState('Class 9-10 (NCERT Foundation)');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleEnroll = (courseId: string, courseTitle: string) => {
    if (!enrolledCourseIds.includes(courseId)) {
      setEnrolledCourseIds((prev) => [...prev, courseId]);
      alert(`🎉 Congratulations! You have successfully enrolled in "${courseTitle}". Access details sent to your registered email.`);
    }
  };

  const handleDownloadNotes = (title: string) => {
    setDownloadSuccessMessage(`Downloading PDF study notes for "${title}"...`);
    setTimeout(() => {
      setDownloadSuccessMessage(null);
    }, 3500);
  };

  // AI Study handler
  const handleAskAIStudy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiTopic.trim()) return;

    setAiLoading(true);
    setAiError(null);
    setAiResponse(null);

    try {
      const response = await callAnyworkAIStudy('study_material', aiTopic.trim(), aiLevel);
      setAiResponse(response);
    } catch (err: any) {
      setAiError(err?.message || 'Failed to get answer from AI Study Edge function.');
    } finally {
      setAiLoading(false);
    }
  };

  // Voice Speech Synthesis
  const handleToggleVoice = () => {
    if (!('speechSynthesis' in window)) {
      alert('Voice synthesis is not supported on this browser.');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    if (!aiResponse) return;

    window.speechSynthesis.cancel();
    const cleanText = aiResponse.replace(/[*_#`]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'hi-IN';
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  return (
    <div className="space-y-8">
      {/* Hero Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="max-w-xl">
          <span className="text-xs font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded-full">
            ANY WORK VOCATIONAL & EXAM ACADEMY
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold mt-3">
            Learn In-Demand Technical Skills & Prepare for Govt. Exams
          </h1>
          <p className="text-emerald-100 text-sm mt-2">
            Industry certified electrician, HVAC and wireman masterclasses, plus complete study series for SSC, Railway, Police & Defense exams.
          </p>
        </div>

        <button
          onClick={onNavigateToCrackExam}
          className="px-6 py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-2xl font-black text-sm shadow-xl flex items-center gap-2 transition-transform active:scale-95 shrink-0"
        >
          <span>Open Crack Exam Tests</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {downloadSuccessMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{downloadSuccessMessage}</span>
        </div>
      )}

      {/* ================= AI STUDY ASSISTANT (EDGE FUNCTION INTEGRATED) ================= */}
      <section className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-700 flex items-center justify-center font-bold text-lg">
              🤖
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <span>ANY WORK AI STUDY • Personal Teacher Assistant</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold uppercase">
                  Edge Function Live
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                NCERT concepts, real-life examples, formulas, and competitive exam practice points in Hindi.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Mode:</span>
            <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg">
              Text + Teacher Voice
            </span>
          </div>
        </div>

        {/* Query Input Form */}
        <form onSubmit={handleAskAIStudy} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Topic or Question to Learn *
              </label>
              <input
                type="text"
                required
                value={aiTopic}
                onChange={(e) => setAiTopic(e.target.value)}
                placeholder="e.g. प्रकाश संश्लेषण क्या है? (What is Photosynthesis?) or Ohm's Law formula"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Target Exam / Academic Level
              </label>
              <select
                value={aiLevel}
                onChange={(e) => setAiLevel(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
              >
                <option value="Class 6-8 (Middle School)">Class 6-8 (Middle School)</option>
                <option value="Class 9-10 (NCERT Foundation)">Class 9-10 (NCERT Foundation)</option>
                <option value="Class 11-12 (Board / Advanced)">Class 11-12 (Board / Advanced)</option>
                <option value="SSC CGL / CHSL">SSC CGL / CHSL</option>
                <option value="Railway RRB NTPC & Group D">Railway RRB NTPC & Group D</option>
                <option value="State Police & Defense">State Police & Defense</option>
                <option value="ITI Electrician / Trade Theory">ITI Electrician / Trade Theory</option>
              </select>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="flex flex-wrap gap-2 text-xs text-slate-500">
              <span>Quick Prompts:</span>
              {[
                'कोशिका की संरचना (Cell Structure)',
                "Ohm's Law & Resistance",
                'भारतीय संविधान के मौलिक अधिकार',
              ].map((p, i) => (
                <button
                  type="button"
                  key={i}
                  onClick={() => setAiTopic(p)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-lg transition-colors text-[11px]"
                >
                  {p}
                </button>
              ))}
            </div>

            <button
              type="submit"
              disabled={aiLoading || !aiTopic.trim()}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-xl text-xs sm:text-sm font-bold shadow flex items-center gap-2 transition-transform active:scale-95 shrink-0"
            >
              {aiLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Teacher Thinking...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Ask AI Teacher</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Error State */}
        {aiError && (
          <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm rounded-2xl flex items-start gap-2.5">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <strong>AI Study Error:</strong>
              <p className="mt-0.5">{aiError}</p>
            </div>
          </div>
        )}

        {/* Formatted Teacher Output */}
        {aiResponse && (
          <div className="mt-4 p-5 sm:p-6 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 flex-wrap gap-2">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                📘 Teacher Explanation ({aiLevel}):
              </span>

              <button
                type="button"
                onClick={handleToggleVoice}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs ${
                  isSpeaking
                    ? 'bg-rose-600 text-white animate-pulse'
                    : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {isSpeaking ? (
                  <>
                    <VolumeX className="w-4 h-4" /> Stop Voice
                  </>
                ) : (
                  <>
                    <Volume2 className="w-4 h-4 text-emerald-600" /> Listen Voice (हिंदी)
                  </>
                )}
              </button>
            </div>

            <div className="text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-wrap font-sans">
              {aiResponse}
            </div>
          </div>
        )}
      </section>

      {/* Courses Grid */}
      <div className="space-y-4">
        <h2 className="text-xl font-extrabold text-slate-900">
          Featured Vocational & Competitive Batches
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => {
            const isEnrolled = enrolledCourseIds.includes(course.id);

            return (
              <div
                key={course.id}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-16/9 bg-slate-100 overflow-hidden">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-sm text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-white/20">
                      {course.category}
                    </span>
                    {course.is_free && (
                      <span className="absolute top-3 right-3 bg-emerald-600 text-white text-[11px] font-black px-2.5 py-0.5 rounded-full shadow">
                        FREE COURSE
                      </span>
                    )}
                  </div>

                  <div className="p-5">
                    <h3 className="text-base font-bold text-slate-900 line-clamp-2 mb-2">
                      {course.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 mb-4">
                      {course.description}
                    </p>

                    <div className="text-xs text-slate-600 space-y-1.5 mb-4 bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Instructor:</span>
                        <span className="font-semibold text-slate-800">{course.instructor}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Duration & Modules:</span>
                        <span className="font-semibold text-slate-800">
                          {course.duration} ({course.lessons_count} Lessons)
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Enrolled Students:</span>
                        <span className="font-semibold text-emerald-700">
                          {course.students_enrolled}+ Students
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="px-5 pb-5 pt-2 border-t border-slate-100 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-bold">COURSE FEE</span>
                    <span className="text-lg font-black text-slate-900">
                      {course.is_free ? '₹0 (Free)' : `₹${course.price}`}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDownloadNotes(course.title)}
                      title="Download Syllabus & Free Notes"
                      className="p-2.5 border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl transition-colors"
                    >
                      <Download className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleEnroll(course.id, course.title)}
                      disabled={isEnrolled}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow ${
                        isEnrolled
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-900 hover:bg-slate-800 text-white'
                      }`}
                    >
                      {isEnrolled ? 'Enrolled ✓' : 'Enroll Now'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

