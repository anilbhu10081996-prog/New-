import React, { useState, useEffect } from 'react';
import {
  ExamTest,
  ExamFolder,
  ExamQuestion,
  UserExamAttempt,
  UserProfile,
} from '../../types';
import {
  BookOpen,
  Clock,
  Award,
  AlertCircle,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ChevronRight,
  ChevronLeft,
  RotateCcw,
  Plus,
  Trash2,
  Edit,
  Eye,
  EyeOff,
  FolderPlus,
  Folder,
  FolderOpen,
  Upload,
  Search,
  Check,
  Share2,
  ShieldCheck,
  Filter,
  Layers,
  ArrowLeft,
} from 'lucide-react';

interface CrackExamViewProps {
  currentUser: UserProfile;
  tests: ExamTest[];
  folders: ExamFolder[];
  userAttempts: UserExamAttempt[];
  onSaveTest: (test: ExamTest) => void;
  onDeleteTest: (testId: string) => void;
  onTogglePublish: (testId: string) => void;
  onAddFolder: (folder: ExamFolder) => void;
  onEditFolder?: (folder: ExamFolder) => void;
  onDeleteFolder?: (folderId: string) => void;
  onRecordAttempt: (attempt: UserExamAttempt) => void;
  onShare: (title: string, text: string, url: string) => void;
}

export const CrackExamView: React.FC<CrackExamViewProps> = ({
  currentUser,
  tests,
  folders,
  userAttempts,
  onSaveTest,
  onDeleteTest,
  onTogglePublish,
  onAddFolder,
  onRecordAttempt,
  onShare,
}) => {
  const isAdmin = currentUser.role === 'admin' || currentUser.email === 'anyworkservice24@gmail.com';

  // Navigation State
  // selectedFolderId: 'all' or specific folder ID
  const [activeFolderId, setActiveFolderId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [adminViewFilter, setAdminViewFilter] = useState<'all' | 'published' | 'drafts'>('all');

  // Active Test State
  const [activeTest, setActiveTest] = useState<ExamTest | null>(null);
  const [testMode, setTestMode] = useState<'instructions' | 'taking' | 'result' | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, 'A' | 'B' | 'C' | 'D' | ''>>({});
  const [markedForReview, setMarkedForReview] = useState<Record<string, boolean>>({});
  const [timeRemainingSeconds, setTimeRemainingSeconds] = useState<number>(0);
  const [currentAttemptResult, setCurrentAttemptResult] = useState<UserExamAttempt | null>(null);
  const [showSubmitModal, setShowSubmitModal] = useState<boolean>(false);

  // Single Canonical Folder Manager State
  const [showFolderManagerModal, setShowFolderManagerModal] = useState<boolean>(false);
  const [editingFolder, setEditingFolder] = useState<ExamFolder | null>(null);
  const [folderFormName, setFolderFormName] = useState<string>('');
  const [folderFormParentId, setFolderFormParentId] = useState<string>('');
  const [folderFormDesc, setFolderFormDesc] = useState<string>('');
  const [folderFormStatus, setFolderFormStatus] = useState<'active' | 'inactive'>('active');

  // Test Builder Modal State
  const [showTestBuilderModal, setShowTestBuilderModal] = useState<boolean>(false);
  const [editingTest, setEditingTest] = useState<ExamTest | null>(null);
  const [builderTitle, setBuilderTitle] = useState<string>('');
  const [builderFolderId, setBuilderFolderId] = useState<string>(folders[0]?.id || '');
  const [builderDuration, setBuilderDuration] = useState<number>(30);
  const [builderPositiveMarks, setBuilderPositiveMarks] = useState<number>(2);
  const [builderNegativeMarks, setBuilderNegativeMarks] = useState<number>(0.5);
  const [builderIsPublished, setBuilderIsPublished] = useState<boolean>(false); // default to false (draft) for verification flow!
  const [builderInstructions, setBuilderInstructions] = useState<string>(
    'Read each question carefully. Negative marking applies for wrong answers. The exam will automatically submit when the timer ends.'
  );
  const [builderQuestions, setBuilderQuestions] = useState<ExamQuestion[]>([]);
  const [bulkText, setBulkText] = useState<string>('');
  const [bulkError, setBulkError] = useState<string>('');
  const [builderTab, setBuilderTab] = useState<'manual' | 'bulk'>('manual');

  // Active folder object and breadcrumb resolution
  const currentFolder = folders.find((f) => f.id === activeFolderId);
  const parentFolder = currentFolder?.parent_folder_id
    ? folders.find((f) => f.id === currentFolder.parent_folder_id)
    : null;

  // Subfolders belonging to current active folder
  const subFolders = folders.filter((f) => {
    if (activeFolderId === 'all') {
      return !f.parent_folder_id; // Top level folders
    }
    return f.parent_folder_id === activeFolderId;
  });

  // Filtered Tests
  const displayableTests = tests.filter((t) => {
    // 1. Strict security: Normal users can NEVER see unpublished/draft tests
    if (!isAdmin && !t.is_published) {
      return false;
    }

    // 2. Admin filter tab (All, Published, Drafts)
    if (isAdmin) {
      if (adminViewFilter === 'published' && !t.is_published) return false;
      if (adminViewFilter === 'drafts' && t.is_published) return false;
    }

    // 3. Folder Filter: If inside a folder, show tests for this folder (or child subfolders if top-level)
    if (activeFolderId !== 'all') {
      const matchesDirect = t.folder_id === activeFolderId;
      const childFolderIds = folders
        .filter((f) => f.parent_folder_id === activeFolderId)
        .map((f) => f.id);
      const matchesChild = childFolderIds.includes(t.folder_id);
      if (!matchesDirect && !matchesChild) return false;
    }

    // 4. Search Filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = t.title.toLowerCase().includes(q);
      const matchFolder = (t.folder_name || '').toLowerCase().includes(q);
      return matchTitle || matchFolder;
    }

    return true;
  });

  // Timer Effect
  useEffect(() => {
    if (testMode !== 'taking' || timeRemainingSeconds <= 0) return;

    const interval = setInterval(() => {
      setTimeRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmitTestAuto();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [testMode, timeRemainingSeconds]);

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Test Taking Handlers
  const handleStartTestFlow = (test: ExamTest) => {
    setActiveTest(test);
    setTestMode('instructions');
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setMarkedForReview({});
    setTimeRemainingSeconds(test.duration_minutes * 60);
    setCurrentAttemptResult(null);
  };

  const handleBeginTakingTest = () => {
    if (!activeTest) return;
    setTestMode('taking');
  };

  const handleSelectOption = (questionId: string, option: 'A' | 'B' | 'C' | 'D') => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: option,
    }));
  };

  const handleClearResponse = (questionId: string) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: '',
    }));
  };

  const handleToggleMarkReview = (questionId: string) => {
    setMarkedForReview((prev) => ({
      ...prev,
      [questionId]: !prev[questionId],
    }));
  };

  const calculateResult = (): UserExamAttempt => {
    if (!activeTest) throw new Error('No active test');

    let correctCount = 0;
    let incorrectCount = 0;
    let unattemptedCount = 0;
    let earnedMarks = 0;
    let deductedMarks = 0;

    activeTest.questions.forEach((q) => {
      const ans = userAnswers[q.id];
      if (!ans) {
        unattemptedCount++;
      } else if (ans === q.correct_option) {
        correctCount++;
        earnedMarks += q.marks || activeTest.positive_marks;
      } else {
        incorrectCount++;
        deductedMarks += q.negative_marks !== undefined ? q.negative_marks : activeTest.negative_marks;
      }
    });

    const netScore = Math.max(0, Number((earnedMarks - deductedMarks).toFixed(2)));
    const attemptedCount = correctCount + incorrectCount;
    const accuracy = attemptedCount > 0 ? Math.round((correctCount / attemptedCount) * 100) : 0;
    const timeTaken = activeTest.duration_minutes * 60 - timeRemainingSeconds;

    const attempt: UserExamAttempt = {
      id: 'att_' + Date.now(),
      test_id: activeTest.id,
      test_title: activeTest.title,
      folder_name: activeTest.folder_name || 'General',
      user_id: currentUser.id,
      user_name: currentUser.full_name,
      user_email: currentUser.email,
      score: netScore,
      total_marks: activeTest.total_marks,
      accuracy_percentage: accuracy,
      time_taken_seconds: Math.max(1, timeTaken),
      attempted_at: new Date().toISOString(),
      answers: userAnswers,
      marks_breakdown: {
        correct: correctCount,
        incorrect: incorrectCount,
        unattempted: unattemptedCount,
        negative_deducted: Number(deductedMarks.toFixed(2)),
      },
    };

    return attempt;
  };

  const handleSubmitTestAuto = () => {
    if (!activeTest) return;
    const attempt = calculateResult();
    setCurrentAttemptResult(attempt);
    onRecordAttempt(attempt);
    setTestMode('result');
    setShowSubmitModal(false);
  };

  // Test Builder Handlers
  const handleOpenNewTestModal = () => {
    setEditingTest(null);
    setBuilderTitle('');
    setBuilderFolderId(activeFolderId !== 'all' ? activeFolderId : folders[0]?.id || '');
    setBuilderDuration(20);
    setBuilderPositiveMarks(2);
    setBuilderNegativeMarks(0.5);
    setBuilderIsPublished(false); // default to Draft for safety!
    setBuilderInstructions(
      'Read each question carefully. Negative marking applies for wrong answers. The exam will automatically submit when the timer ends.'
    );
    setBuilderQuestions([
      {
        id: 'q_' + Date.now() + '_1',
        question_text: '',
        option_a: '',
        option_b: '',
        option_c: '',
        option_d: '',
        correct_option: 'A',
        solution_explanation: '',
        marks: 2,
        negative_marks: 0.5,
      },
    ]);
    setBulkText('');
    setBulkError('');
    setBuilderTab('manual');
    setShowTestBuilderModal(true);
  };

  const handleOpenEditTestModal = (test: ExamTest) => {
    setEditingTest(test);
    setBuilderTitle(test.title);
    setBuilderFolderId(test.folder_id);
    setBuilderDuration(test.duration_minutes);
    setBuilderPositiveMarks(test.positive_marks);
    setBuilderNegativeMarks(test.negative_marks);
    setBuilderIsPublished(test.is_published);
    setBuilderInstructions(test.instructions);
    setBuilderQuestions([...test.questions]);
    setBulkText('');
    setBulkError('');
    setBuilderTab('manual');
    setShowTestBuilderModal(true);
  };

  // Bulk Question Processor (supports 100+ questions without truncation)
  const handleProcessBulkQuestions = () => {
    setBulkError('');
    if (!bulkText.trim()) {
      setBulkError('Please paste structured questions or JSON array');
      return;
    }

    try {
      if (bulkText.trim().startsWith('[') || bulkText.trim().startsWith('{')) {
        const parsed = JSON.parse(bulkText.trim());
        const list = Array.isArray(parsed) ? parsed : [parsed];
        const newQs: ExamQuestion[] = list.map((item, idx) => ({
          id: 'q_bulk_' + Date.now() + '_' + idx,
          question_text: item.question || item.question_text || `Question ${idx + 1}`,
          option_a: item.a || item.option_a || 'Option A',
          option_b: item.b || item.option_b || 'Option B',
          option_c: item.c || item.option_c || 'Option C',
          option_d: item.d || item.option_d || 'Option D',
          correct_option: (item.answer || item.correct_option || 'A').toUpperCase() as 'A' | 'B' | 'C' | 'D',
          solution_explanation: item.solution || item.explanation || item.solution_explanation || '',
          marks: Number(item.marks) || builderPositiveMarks,
          negative_marks: Number(item.negative_marks) || builderNegativeMarks,
        }));

        setBuilderQuestions((prev) => [...prev, ...newQs]);
        setBuilderTab('manual');
        return;
      }

      const blocks = bulkText.split(/(?=\n\s*(?:Q\d+|Question\s*\d+|\d+\.)\s*[:.-])/i);
      const parsedQuestions: ExamQuestion[] = [];

      for (let i = 0; i < blocks.length; i++) {
        const block = blocks[i].trim();
        if (!block) continue;

        const lines = block.split('\n').map((l) => l.trim()).filter(Boolean);
        if (lines.length < 2) continue;

        let questionText = lines[0].replace(/^(?:Q\d+|Question\s*\d+|\d+)\s*[:.-]\s*/i, '');
        let optA = '';
        let optB = '';
        let optC = '';
        let optD = '';
        let correctOpt: 'A' | 'B' | 'C' | 'D' = 'A';
        let solution = '';

        for (let j = 1; j < lines.length; j++) {
          const line = lines[j];
          if (/^A[\)\.\:\-]/i.test(line)) {
            optA = line.replace(/^A[\)\.\:\-]\s*/i, '');
          } else if (/^B[\)\.\:\-]/i.test(line)) {
            optB = line.replace(/^B[\)\.\:\-]\s*/i, '');
          } else if (/^C[\)\.\:\-]/i.test(line)) {
            optC = line.replace(/^C[\)\.\:\-]\s*/i, '');
          } else if (/^D[\)\.\:\-]/i.test(line)) {
            optD = line.replace(/^D[\)\.\:\-]\s*/i, '');
          } else if (/^(?:Answer|Ans|Correct)\s*[\:\-]/i.test(line)) {
            const rawAns = line.replace(/^(?:Answer|Ans|Correct)\s*[\:\-]\s*/i, '').trim().toUpperCase();
            if (['A', 'B', 'C', 'D'].includes(rawAns[0])) {
              correctOpt = rawAns[0] as 'A' | 'B' | 'C' | 'D';
            }
          } else if (/^(?:Solution|Explanation|Exp)\s*[\:\-]/i.test(line)) {
            solution = line.replace(/^(?:Solution|Explanation|Exp)\s*[\:\-]\s*/i, '');
          }
        }

        if (questionText && (optA || optB)) {
          parsedQuestions.push({
            id: 'q_txt_' + Date.now() + '_' + i,
            question_text: questionText,
            option_a: optA || 'Option A',
            option_b: optB || 'Option B',
            option_c: optC || 'Option C',
            option_d: optD || 'Option D',
            correct_option: correctOpt,
            solution_explanation: solution || 'Correct Answer is ' + correctOpt,
            marks: builderPositiveMarks,
            negative_marks: builderNegativeMarks,
          });
        }
      }

      if (parsedQuestions.length === 0) {
        setBulkError('Could not automatically parse question format. Please check the sample format.');
        return;
      }

      setBuilderQuestions((prev) => [...prev, ...parsedQuestions]);
      setBuilderTab('manual');
    } catch (e: any) {
      setBulkError('Parse error: ' + (e?.message || 'Check syntax'));
    }
  };

  const handleSaveExamTest = () => {
    if (!builderTitle.trim()) {
      alert('Please enter a test title');
      return;
    }
    if (builderQuestions.length === 0) {
      alert('Please add at least one question to the test');
      return;
    }

    const folderObj = folders.find((f) => f.id === builderFolderId);
    const folderName = folderObj ? folderObj.name : 'General';

    const calculatedTotalMarks = builderQuestions.reduce(
      (sum, q) => sum + (q.marks || builderPositiveMarks),
      0
    );

    const newOrUpdatedTest: ExamTest = {
      id: editingTest ? editingTest.id : 'test_' + Date.now(),
      title: builderTitle.trim(),
      folder_id: builderFolderId,
      folder_name: folderName,
      duration_minutes: Number(builderDuration) || 20,
      total_marks: calculatedTotalMarks || 50,
      passing_percentage: 40,
      positive_marks: Number(builderPositiveMarks) || 2,
      negative_marks: Number(builderNegativeMarks) || 0.5,
      is_published: builderIsPublished,
      status: builderIsPublished ? 'published' : 'draft',
      created_at: editingTest ? editingTest.created_at : new Date().toISOString(),
      attempts_count: editingTest ? editingTest.attempts_count : 0,
      instructions: builderInstructions,
      questions: builderQuestions,
    };

    onSaveTest(newOrUpdatedTest);
    setShowTestBuilderModal(false);
  };

  // Canonical Folder Manager Handlers
  const handleOpenFolderManager = (folderToEdit?: ExamFolder) => {
    if (folderToEdit) {
      setEditingFolder(folderToEdit);
      setFolderFormName(folderToEdit.name);
      setFolderFormParentId(folderToEdit.parent_folder_id || '');
      setFolderFormDesc(folderToEdit.description || '');
      setFolderFormStatus(folderToEdit.status || 'active');
    } else {
      setEditingFolder(null);
      setFolderFormName('');
      setFolderFormParentId(activeFolderId !== 'all' ? activeFolderId : '');
      setFolderFormDesc('');
      setFolderFormStatus('active');
    }
    setShowFolderManagerModal(true);
  };

  const handleSaveCanonicalFolder = () => {
    if (!folderFormName.trim()) {
      alert('Folder name is required');
      return;
    }

    const newFld: ExamFolder = {
      id: editingFolder ? editingFolder.id : 'fld_' + Date.now(),
      name: folderFormName.trim(),
      parent_folder_id: folderFormParentId || null,
      description: folderFormDesc.trim() || 'Custom Exam Folder',
      icon: 'Folder',
      is_published: true,
      status: folderFormStatus,
      tests_count: editingFolder ? editingFolder.tests_count : 0,
    };

    onAddFolder(newFld);
    setShowFolderManagerModal(false);
  };

  // ===================== TEST TAKING SCREEN =====================
  if (testMode === 'taking' && activeTest) {
    const currentQ = activeTest.questions[currentQuestionIndex];
    const answeredCount = Object.values(userAnswers).filter(Boolean).length;
    const reviewCount = Object.values(markedForReview).filter(Boolean).length;
    const totalQ = activeTest.questions.length;

    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
        {/* Test Header */}
        <header className="bg-slate-950 border-b border-slate-800 px-4 py-3 sticky top-0 z-30 flex items-center justify-between flex-wrap gap-2">
          <div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
              {activeTest.folder_name}
            </span>
            <h1 className="text-base sm:text-lg font-bold text-white truncate max-w-md">
              {activeTest.title}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border font-mono text-sm sm:text-base font-bold shadow-sm ${
                timeRemainingSeconds < 180
                  ? 'bg-rose-950/70 border-rose-600 text-rose-300 animate-pulse'
                  : 'bg-slate-800 border-slate-700 text-amber-400'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>{formatTimer(timeRemainingSeconds)}</span>
            </div>

            <button
              onClick={() => setShowSubmitModal(true)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-semibold text-sm transition-colors shadow-md flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Submit Exam</span>
            </button>
          </div>
        </header>

        {/* Test Body */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          <main className="flex-1 p-4 sm:p-6 overflow-y-auto max-w-4xl mx-auto w-full">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800 text-xs sm:text-sm">
              <span className="font-semibold text-slate-300">
                Question {currentQuestionIndex + 1} of {totalQ}
              </span>
              <div className="flex items-center gap-3 text-xs">
                <span className="text-emerald-400 font-medium">
                  +{currentQ?.marks || activeTest.positive_marks} Marks
                </span>
                <span className="text-rose-400 font-medium">
                  -{currentQ?.negative_marks || activeTest.negative_marks} Neg.
                </span>
              </div>
            </div>

            <div className="bg-slate-800/60 border border-slate-700/80 rounded-xl p-5 mb-6 shadow-sm">
              <h2 className="text-base sm:text-lg font-medium text-slate-100 leading-relaxed whitespace-pre-wrap">
                {currentQ?.question_text}
              </h2>
              {currentQ?.image_url && (
                <div className="mt-4 max-w-md">
                  <img
                    src={currentQ.image_url}
                    alt="Diagram"
                    className="rounded-lg border border-slate-700 max-h-60 object-contain"
                  />
                </div>
              )}
            </div>

            <div className="space-y-3 mb-8">
              {(['A', 'B', 'C', 'D'] as const).map((optKey) => {
                const optText =
                  optKey === 'A'
                    ? currentQ?.option_a
                    : optKey === 'B'
                    ? currentQ?.option_b
                    : optKey === 'C'
                    ? currentQ?.option_c
                    : currentQ?.option_d;

                const isSelected = userAnswers[currentQ?.id] === optKey;

                return (
                  <button
                    key={optKey}
                    type="button"
                    onClick={() => handleSelectOption(currentQ.id, optKey)}
                    className={`w-full text-left p-4 rounded-xl border transition-all flex items-start gap-3 ${
                      isSelected
                        ? 'bg-amber-500/20 border-amber-500 text-white shadow-md'
                        : 'bg-slate-800/40 border-slate-700/70 text-slate-200 hover:bg-slate-800 hover:border-slate-600'
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 border ${
                        isSelected
                          ? 'bg-amber-500 text-slate-950 border-amber-400'
                          : 'bg-slate-700 text-slate-300 border-slate-600'
                      }`}
                    >
                      {optKey}
                    </div>
                    <div className="text-sm sm:text-base leading-relaxed break-words flex-1">
                      {optText}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-800">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleToggleMarkReview(currentQ.id)}
                  className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-medium border transition-colors ${
                    markedForReview[currentQ.id]
                      ? 'bg-purple-900/60 border-purple-500 text-purple-200'
                      : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {markedForReview[currentQ.id] ? 'Marked for Review ✓' : 'Mark for Review'}
                </button>
                {userAnswers[currentQ.id] && (
                  <button
                    type="button"
                    onClick={() => handleClearResponse(currentQ.id)}
                    className="px-3 py-2 rounded-lg text-xs sm:text-sm font-medium text-slate-400 hover:text-rose-400 transition-colors"
                  >
                    Clear Choice
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2 ml-auto">
                <button
                  type="button"
                  disabled={currentQuestionIndex === 0}
                  onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
                  className="px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:pointer-events-none text-slate-200 border border-slate-700 flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (currentQuestionIndex < totalQ - 1) {
                      setCurrentQuestionIndex((prev) => prev + 1);
                    } else {
                      setShowSubmitModal(true);
                    }
                  }}
                  className="px-5 py-2 rounded-lg text-xs sm:text-sm font-semibold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors flex items-center gap-1 shadow"
                >
                  <span>{currentQuestionIndex < totalQ - 1 ? 'Save & Next' : 'Finish Test'}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </main>

          <aside className="w-full lg:w-80 bg-slate-950 border-t lg:border-t-0 lg:border-l border-slate-800 p-4 overflow-y-auto">
            <h3 className="font-semibold text-sm text-slate-200 mb-3">Question Palette</h3>

            <div className="grid grid-cols-2 gap-2 text-xs mb-4 p-2.5 rounded-lg bg-slate-900 border border-slate-800">
              <div className="flex items-center gap-1.5">
                <div className="w-3.5 h-3.5 rounded bg-emerald-600"></div>
                <span className="text-slate-300">Answered ({answeredCount})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3.5 h-3.5 rounded bg-purple-600"></div>
                <span className="text-slate-300">Review ({reviewCount})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3.5 h-3.5 rounded bg-slate-700"></div>
                <span className="text-slate-300">Left ({totalQ - answeredCount})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3.5 h-3.5 rounded border border-amber-400 bg-amber-500/20"></div>
                <span className="text-slate-300">Current</span>
              </div>
            </div>

            <div className="grid grid-cols-5 gap-2 max-h-80 overflow-y-auto p-1">
              {activeTest.questions.map((q, idx) => {
                const isCurrent = idx === currentQuestionIndex;
                const isAnswered = Boolean(userAnswers[q.id]);
                const isReview = Boolean(markedForReview[q.id]);

                let btnClass = 'bg-slate-800 text-slate-400 border-slate-700';
                if (isReview) {
                  btnClass = 'bg-purple-600 text-white border-purple-500';
                } else if (isAnswered) {
                  btnClass = 'bg-emerald-600 text-white border-emerald-500';
                }

                if (isCurrent) {
                  btnClass += ' ring-2 ring-amber-400';
                }

                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentQuestionIndex(idx)}
                    className={`h-9 rounded-lg font-bold text-xs border transition-all flex items-center justify-center ${btnClass}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </aside>
        </div>

        {showSubmitModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 text-slate-100 shadow-2xl">
              <h3 className="text-lg font-bold text-white mb-2">Confirm Test Submission</h3>
              <p className="text-sm text-slate-400 mb-4">
                Are you ready to submit your exam? Once submitted, your final marks and detailed solution key will be generated.
              </p>

              <div className="bg-slate-800/80 rounded-xl p-4 mb-6 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Total Questions:</span>
                  <span className="font-semibold text-white">{totalQ}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Answered:</span>
                  <span className="font-semibold text-emerald-400">{answeredCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Marked for Review:</span>
                  <span className="font-semibold text-purple-400">{reviewCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Unanswered / Left:</span>
                  <span className="font-semibold text-rose-400">{totalQ - answeredCount}</span>
                </div>
              </div>

              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setShowSubmitModal(false)}
                  className="px-4 py-2 rounded-xl text-sm font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300"
                >
                  Resume Exam
                </button>
                <button
                  type="button"
                  onClick={handleSubmitTestAuto}
                  className="px-5 py-2 rounded-xl text-sm font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow"
                >
                  Yes, Submit
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ===================== TEST RESULT & SOLUTIONS =====================
  if (testMode === 'result' && activeTest && currentAttemptResult) {
    const totalQ = activeTest.questions.length;
    const isPassed = currentAttemptResult.score >= (activeTest.total_marks * (activeTest.passing_percentage / 100));

    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 py-8 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {activeTest.folder_name}
                </span>
                <h1 className="text-xl sm:text-2xl font-extrabold text-white mt-2">
                  {activeTest.title}
                </h1>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Completed on {new Date(currentAttemptResult.attempted_at).toLocaleString()}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleStartTestFlow(activeTest)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Re-attempt</span>
                </button>
                <button
                  onClick={() => {
                    setTestMode(null);
                    setActiveTest(null);
                  }}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-sm font-semibold transition-colors shadow"
                >
                  Back to Tests
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-center">
                <span className="text-xs text-slate-400 uppercase font-semibold">Your Score</span>
                <div className="text-2xl sm:text-3xl font-black text-amber-400 mt-1">
                  {currentAttemptResult.score} / {currentAttemptResult.total_marks}
                </div>
                <span className={`text-xs font-bold ${isPassed ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {isPassed ? 'PASSED ✓' : 'NEEDS PRACTICE'}
                </span>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-center">
                <span className="text-xs text-slate-400 uppercase font-semibold">Accuracy</span>
                <div className="text-2xl sm:text-3xl font-black text-blue-400 mt-1">
                  {currentAttemptResult.accuracy_percentage}%
                </div>
                <span className="text-xs text-slate-400">
                  {currentAttemptResult.marks_breakdown.correct} of {currentAttemptResult.marks_breakdown.correct + currentAttemptResult.marks_breakdown.incorrect} attempted
                </span>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-center">
                <span className="text-xs text-slate-400 uppercase font-semibold">Time Taken</span>
                <div className="text-2xl sm:text-3xl font-black text-purple-400 mt-1">
                  {Math.floor(currentAttemptResult.time_taken_seconds / 60)}m {currentAttemptResult.time_taken_seconds % 60}s
                </div>
                <span className="text-xs text-slate-400">of {activeTest.duration_minutes} mins</span>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-center">
                <span className="text-xs text-slate-400 uppercase font-semibold">Negative Marks</span>
                <div className="text-2xl sm:text-3xl font-black text-rose-400 mt-1">
                  -{currentAttemptResult.marks_breakdown.negative_deducted}
                </div>
                <span className="text-xs text-rose-300">
                  {currentAttemptResult.marks_breakdown.incorrect} incorrect answers
                </span>
              </div>
            </div>
          </div>

          {/* Detailed Question Explanations */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-amber-400" />
              <span>Answer Key & Detailed Explanations</span>
            </h2>

            {activeTest.questions.map((q, idx) => {
              const userAns = currentAttemptResult.answers[q.id];
              const isCorrect = userAns === q.correct_option;
              const isUnattempted = !userAns;

              return (
                <div
                  key={q.id}
                  className={`bg-slate-950 border rounded-2xl p-5 transition-all shadow-sm ${
                    isCorrect
                      ? 'border-emerald-500/40 bg-emerald-950/10'
                      : isUnattempted
                      ? 'border-slate-800'
                      : 'border-rose-500/40 bg-rose-950/10'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-lg bg-slate-800 text-slate-200 text-xs font-bold flex items-center justify-center border border-slate-700">
                        Q{idx + 1}
                      </span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        {q.marks || activeTest.positive_marks} Marks
                      </span>
                    </div>

                    <div>
                      {isCorrect ? (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/40 px-2.5 py-1 rounded-full">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Correct (+{q.marks || activeTest.positive_marks})
                        </span>
                      ) : isUnattempted ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-400 bg-slate-800 px-2.5 py-1 rounded-full">
                          <HelpCircle className="w-3.5 h-3.5" /> Unattempted (0)
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-400 bg-rose-950/60 border border-rose-500/40 px-2.5 py-1 rounded-full">
                          <XCircle className="w-3.5 h-3.5" /> Incorrect (-{q.negative_marks || activeTest.negative_marks})
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-sm sm:text-base font-medium text-slate-100 mb-4 whitespace-pre-wrap">
                    {q.question_text}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                    {(['A', 'B', 'C', 'D'] as const).map((opt) => {
                      const optText =
                        opt === 'A'
                          ? q.option_a
                          : opt === 'B'
                          ? q.option_b
                          : opt === 'C'
                          ? q.option_c
                          : q.option_d;

                      const isUserChoice = userAns === opt;
                      const isCorrectChoice = q.correct_option === opt;

                      let optStyle = 'bg-slate-900 border-slate-800 text-slate-300';
                      if (isCorrectChoice) {
                        optStyle = 'bg-emerald-950/60 border-emerald-500 text-emerald-200 font-semibold';
                      } else if (isUserChoice && !isCorrect) {
                        optStyle = 'bg-rose-950/60 border-rose-500 text-rose-200 font-semibold';
                      }

                      return (
                        <div
                          key={opt}
                          className={`p-3 rounded-xl border text-xs sm:text-sm flex items-center justify-between ${optStyle}`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-200 flex items-center justify-center font-bold text-xs shrink-0">
                              {opt}
                            </span>
                            <span>{optText}</span>
                          </div>
                          {isCorrectChoice && <span className="text-xs text-emerald-400 font-bold">Correct Ans</span>}
                          {isUserChoice && !isCorrectChoice && (
                            <span className="text-xs text-rose-400 font-bold">Your Choice</span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <div className="bg-slate-900/90 border border-slate-800/80 rounded-xl p-3.5 text-xs sm:text-sm text-slate-300">
                    <span className="font-bold text-amber-400 block mb-1">
                      💡 Solution / Explanation:
                    </span>
                    <p className="leading-relaxed whitespace-pre-wrap">
                      {q.solution_explanation || `Correct answer is option (${q.correct_option}).`}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // ===================== TEST INSTRUCTIONS SCREEN =====================
  if (testMode === 'instructions' && activeTest) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-slate-950 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl">
          <div className="text-center mb-6">
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
              {activeTest.folder_name}
            </span>
            <h1 className="text-2xl font-bold text-white mt-3">{activeTest.title}</h1>
            <p className="text-sm text-slate-400 mt-1">Official Mock Test Instructions</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6 bg-slate-900 p-4 rounded-xl border border-slate-800 text-center">
            <div>
              <span className="text-xs text-slate-400 block">Questions</span>
              <span className="text-lg font-bold text-white">{activeTest.questions.length}</span>
            </div>
            <div>
              <span className="text-xs text-slate-400 block">Time</span>
              <span className="text-lg font-bold text-amber-400">{activeTest.duration_minutes} Mins</span>
            </div>
            <div>
              <span className="text-xs text-slate-400 block">Total Marks</span>
              <span className="text-lg font-bold text-emerald-400">{activeTest.total_marks}</span>
            </div>
            <div>
              <span className="text-xs text-slate-400 block">Neg. Mark</span>
              <span className="text-lg font-bold text-rose-400">-{activeTest.negative_marks}</span>
            </div>
          </div>

          <div className="space-y-3 mb-8 text-xs sm:text-sm text-slate-300 bg-slate-900/50 p-4 rounded-xl border border-slate-800/80">
            <h4 className="font-semibold text-white">General Instructions:</h4>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-300">
              <li>{activeTest.instructions}</li>
              <li>Each question has 4 options with only ONE correct answer.</li>
              <li>You can navigate to any question anytime using the Question Palette on the right.</li>
              <li>The test will auto-submit as soon as the countdown timer reaches 00:00.</li>
            </ul>
          </div>

          <div className="flex items-center justify-between gap-4">
            <button
              onClick={() => {
                setTestMode(null);
                setActiveTest(null);
              }}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleBeginTakingTest}
              className="px-7 py-2.5 rounded-xl text-sm font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg transition-transform active:scale-95"
            >
              I am Ready, Start Test →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ===================== CRACK EXAM MAIN VIEW (FOLDER & TESTS) =====================
  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 text-white p-6 sm:p-8 shadow-xl">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold mb-3">
            <Award className="w-3.5 h-3.5" />
            <span>CRACK EXAM 2026 TEST SERIES</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Official Exam Pattern Mock Tests & Folders
          </h1>
          <p className="text-slate-300 text-sm sm:text-base mt-2">
            SSC CGL, Railway NTPC, State Police, ITI Wireman, Banking & General Studies tests with countdown timer, negative marks, and comprehensive Hindi & English solutions.
          </p>

          {/* Admin Controls Bar */}
          {isAdmin && (
            <div className="mt-5 flex flex-wrap items-center gap-2.5 pt-4 border-t border-slate-800">
              <button
                onClick={handleOpenNewTestModal}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs sm:text-sm font-bold shadow flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>+ Create Test (Draft)</span>
              </button>

              {/* Single Canonical Folder Manager Button */}
              <button
                onClick={() => handleOpenFolderManager()}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs sm:text-sm font-semibold border border-slate-700 flex items-center gap-1.5 transition-colors"
              >
                <FolderPlus className="w-4 h-4 text-amber-400" />
                <span>Manage Folders</span>
              </button>

              {/* Admin Filter Tabs for 5-Step Private -> Verify -> Publish Flow */}
              <div className="flex items-center gap-1 ml-auto bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
                <button
                  onClick={() => setAdminViewFilter('all')}
                  className={`px-3 py-1 rounded-lg font-bold transition-colors ${
                    adminViewFilter === 'all'
                      ? 'bg-slate-800 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  All ({tests.length})
                </button>
                <button
                  onClick={() => setAdminViewFilter('published')}
                  className={`px-3 py-1 rounded-lg font-bold transition-colors ${
                    adminViewFilter === 'published'
                      ? 'bg-emerald-600 text-white'
                      : 'text-slate-400 hover:text-emerald-400'
                  }`}
                >
                  Published ({tests.filter((t) => t.is_published).length})
                </button>
                <button
                  onClick={() => setAdminViewFilter('drafts')}
                  className={`px-3 py-1 rounded-lg font-bold transition-colors ${
                    adminViewFilter === 'drafts'
                      ? 'bg-amber-500 text-slate-950'
                      : 'text-slate-400 hover:text-amber-400'
                  }`}
                >
                  Private / Review ({tests.filter((t) => !t.is_published).length})
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ================= BREADCRUMBS & FOLDER OPEN BAR ================= */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <nav className="flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-600">
          <button
            onClick={() => setActiveFolderId('all')}
            className={`hover:text-amber-600 flex items-center gap-1 transition-colors ${
              activeFolderId === 'all' ? 'text-amber-600 font-extrabold' : ''
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>All Exam Categories</span>
          </button>

          {parentFolder && (
            <>
              <ChevronRight className="w-4 h-4 text-slate-400" />
              <button
                onClick={() => setActiveFolderId(parentFolder.id)}
                className="hover:text-amber-600 transition-colors"
              >
                {parentFolder.name}
              </button>
            </>
          )}

          {currentFolder && (
            <>
              <ChevronRight className="w-4 h-4 text-slate-400" />
              <span className="text-slate-900 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-lg font-extrabold flex items-center gap-1.5">
                <FolderOpen className="w-4 h-4 text-amber-500" />
                {currentFolder.name}
              </span>
            </>
          )}
        </nav>

        {activeFolderId !== 'all' && (
          <button
            onClick={() => {
              if (currentFolder?.parent_folder_id) {
                setActiveFolderId(currentFolder.parent_folder_id);
              } else {
                setActiveFolderId('all');
              }
            }}
            className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Previous Folder</span>
          </button>
        )}
      </div>

      {/* ================= FOLDER CARDS GRID (FOLDER OPENING SYSTEM) ================= */}
      {subFolders.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            {activeFolderId === 'all' ? 'Exam Folders' : `Sub-Folders in "${currentFolder?.name}"`}
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5">
            {subFolders.map((fld) => {
              const testsInFld = tests.filter(
                (t) =>
                  (t.folder_id === fld.id || t.folder_id === fld.name) &&
                  (isAdmin || t.is_published)
              ).length;

              const directChildCount = folders.filter((child) => child.parent_folder_id === fld.id).length;

              return (
                <div
                  key={fld.id}
                  onClick={() => setActiveFolderId(fld.id)}
                  className="bg-white border border-slate-200 hover:border-amber-500 rounded-2xl p-4 shadow-2xs hover:shadow-md cursor-pointer transition-all duration-200 flex flex-col justify-between group"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Folder className="w-5 h-5 fill-amber-500/20" />
                    </div>
                    {isAdmin && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenFolderManager(fld);
                        }}
                        className="text-slate-400 hover:text-slate-700 p-1"
                        title="Edit Folder"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div>
                    <h4 className="font-bold text-sm text-slate-900 group-hover:text-amber-600 transition-colors line-clamp-1">
                      {fld.name}
                    </h4>
                    <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                      {fld.description}
                    </p>
                  </div>

                  <div className="pt-2.5 mt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-semibold">
                    <span>{testsInFld} Tests</span>
                    {directChildCount > 0 && <span>{directChildCount} Subfolders</span>}
                    <span className="text-amber-600 font-bold group-hover:translate-x-1 transition-transform">
                      Open →
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ================= SEARCH & SHARE BAR ================= */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between pt-2">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tests in this folder by title..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 shadow-2xs"
          />
        </div>

        <button
          onClick={() =>
            onShare(
              'Crack Exam Series - ANY WORK SERVICE',
              'Practice free competitive exam mock tests with real timer and detailed solutions on ANY WORK SERVICE!',
              window.location.href
            )
          }
          className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold border border-slate-200 flex items-center justify-center gap-2 transition-colors shrink-0"
        >
          <Share2 className="w-4 h-4" />
          <span>Share Exam Series</span>
        </button>
      </div>

      {/* ================= TESTS LISTING ================= */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800">
            Available Tests ({displayableTests.length})
          </h3>
          {activeFolderId !== 'all' && (
            <span className="text-xs text-slate-500 font-medium">
              Filtered by: <strong>{currentFolder?.name}</strong>
            </span>
          )}
        </div>

        {displayableTests.length === 0 ? (
          <div className="text-center py-16 bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h4 className="text-base font-bold text-slate-800">No Tests Found in this Folder</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              {isAdmin
                ? 'Click "+ Create Test (Draft)" to add mock tests directly to this folder.'
                : 'No published tests currently available under this folder. Check back soon!'}
            </p>
            {isAdmin && (
              <button
                onClick={handleOpenNewTestModal}
                className="mt-4 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow"
              >
                + Add Test to this Folder
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {displayableTests.map((test) => {
              const hasAttempted = userAttempts.some((att) => att.test_id === test.id);
              const latestAttempt = userAttempts.find((att) => att.test_id === test.id);

              return (
                <div
                  key={test.id}
                  className="bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-lg transition-all duration-200 flex flex-col justify-between relative group"
                >
                  <div>
                    {/* Top Badges */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                        {test.folder_name}
                      </span>

                      {/* 5-Step Verification / Publish Status Badge */}
                      {isAdmin && (
                        <button
                          onClick={() => onTogglePublish(test.id)}
                          title={test.is_published ? 'Click to make private/draft' : 'Click to verify and publish'}
                          className={`text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                            test.is_published
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                              : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                          }`}
                        >
                          {test.is_published ? (
                            <>
                              <Eye className="w-3 h-3 text-emerald-600" /> Published
                            </>
                          ) : (
                            <>
                              <EyeOff className="w-3 h-3 text-amber-600" /> Private Draft
                            </>
                          )}
                        </button>
                      )}
                    </div>

                    <h3 className="text-base font-bold text-slate-900 group-hover:text-amber-600 transition-colors line-clamp-2 mb-2">
                      {test.title}
                    </h3>

                    <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-100 text-center my-3">
                      <div>
                        <span className="text-[10px] text-slate-400 block font-medium">QUESTIONS</span>
                        <span className="text-xs font-bold text-slate-800">{test.questions.length} Qs</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block font-medium">DURATION</span>
                        <span className="text-xs font-bold text-slate-800">{test.duration_minutes} Mins</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block font-medium">TOTAL MARKS</span>
                        <span className="text-xs font-bold text-slate-800">{test.total_marks}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-500 mb-4">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>-{test.negative_marks} Neg.</span>
                      </span>
                      <span>{test.attempts_count} Attempts</span>
                    </div>

                    {hasAttempted && latestAttempt && (
                      <div className="mb-4 p-2 bg-emerald-50 border border-emerald-100 rounded-xl text-xs flex items-center justify-between text-emerald-800 font-medium">
                        <span>Last Score: {latestAttempt.score}/{latestAttempt.total_marks}</span>
                        <span className="font-bold">{latestAttempt.accuracy_percentage}% Acc.</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() => handleStartTestFlow(test)}
                      className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-sm transition-all shadow flex items-center justify-center gap-2"
                    >
                      <span>{hasAttempted ? 'Re-attempt Test' : 'Start Test'}</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>

                    {isAdmin && (
                      <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-100 text-xs">
                        <button
                          onClick={() => onTogglePublish(test.id)}
                          className={`font-semibold flex items-center gap-1 ${
                            test.is_published
                              ? 'text-slate-500 hover:text-slate-700'
                              : 'text-emerald-700 hover:text-emerald-800 font-bold'
                          }`}
                        >
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>{test.is_published ? 'Unpublish' : 'Verify & Publish'}</span>
                        </button>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleOpenEditTestModal(test)}
                            className="text-slate-600 hover:text-amber-600 flex items-center gap-1 font-semibold"
                          >
                            <Edit className="w-3.5 h-3.5" /> Edit
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Are you sure you want to delete "${test.title}"?`)) {
                                onDeleteTest(test.id);
                              }
                            }}
                            className="text-slate-400 hover:text-rose-600 flex items-center gap-1 font-semibold ml-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ===================== CANONICAL FOLDER MANAGER MODAL (ADMIN ONLY) ===================== */}
      {showFolderManagerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowFolderManagerModal(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center text-sm font-bold"
            >
              ✕
            </button>

            <h3 className="text-lg font-bold text-slate-900 mb-1">
              {editingFolder ? 'Edit Exam Folder' : 'Canonical Folder Manager'}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Configure folder hierarchy (parent folder) and published status in `crack_exam_folders`.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Folder Name *
                </label>
                <input
                  type="text"
                  required
                  value={folderFormName}
                  onChange={(e) => setFolderFormName(e.target.value)}
                  placeholder="e.g. SSC CGL Tier 1"
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Parent Folder (For Hierarchy)
                </label>
                <select
                  value={folderFormParentId}
                  onChange={(e) => setFolderFormParentId(e.target.value)}
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="">None (Top-Level Root Folder)</option>
                  {folders
                    .filter((f) => !editingFolder || f.id !== editingFolder.id)
                    .map((f) => (
                      <option key={f.id} value={f.id}>
                        📁 {f.name}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={folderFormDesc}
                  onChange={(e) => setFolderFormDesc(e.target.value)}
                  placeholder="Brief description of tests included..."
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Status
                </label>
                <select
                  value={folderFormStatus}
                  onChange={(e) => setFolderFormStatus(e.target.value as any)}
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="active">Active (Visible to Students)</option>
                  <option value="inactive">Inactive / Hidden</option>
                </select>
              </div>
            </div>

            <div className="pt-5 mt-4 border-t border-slate-200 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowFolderManagerModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveCanonicalFolder}
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold rounded-xl shadow"
              >
                Save Folder
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================== ADMIN TEST BUILDER MODAL ===================== */}
      {showTestBuilderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto">
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold">
                  {editingTest ? 'Edit Crack Exam Test' : 'Build New Crack Exam Test'}
                </h2>
                <p className="text-xs text-slate-400">
                  Full question architecture with zero truncation (supports 100+ questions)
                </p>
              </div>
              <button
                onClick={() => setShowTestBuilderModal(false)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Test Title *
                  </label>
                  <input
                    type="text"
                    value={builderTitle}
                    onChange={(e) => setBuilderTitle(e.target.value)}
                    placeholder="e.g. SSC CGL Full Mock Test Paper - 05"
                    className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Exam Category / Folder *
                  </label>
                  <select
                    value={builderFolderId}
                    onChange={(e) => setBuilderFolderId(e.target.value)}
                    className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                  >
                    {folders.map((fld) => (
                      <option key={fld.id} value={fld.id}>
                        {fld.parent_folder_id ? `↳ ${fld.name}` : fld.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Duration (Minutes)
                  </label>
                  <input
                    type="number"
                    value={builderDuration}
                    onChange={(e) => setBuilderDuration(Number(e.target.value))}
                    min={1}
                    max={300}
                    className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Positive Marks / Question
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={builderPositiveMarks}
                    onChange={(e) => setBuilderPositiveMarks(Number(e.target.value))}
                    className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Negative Mark / Question
                  </label>
                  <input
                    type="number"
                    step="0.25"
                    value={builderNegativeMarks}
                    onChange={(e) => setBuilderNegativeMarks(Number(e.target.value))}
                    className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div className="sm:col-span-2 lg:col-span-3">
                  <div className="flex items-center gap-3 mt-1">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={builderIsPublished}
                        onChange={(e) => setBuilderIsPublished(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                    </label>
                    <span className="text-xs font-bold text-slate-700">
                      {builderIsPublished
                        ? 'Publish Immediately (Visible to all students)'
                        : 'Save as Private Draft (Requires Admin Review before publishing)'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Questions Input Tabs */}
              <div className="flex items-center gap-3 border-b border-slate-200 pb-3">
                <button
                  type="button"
                  onClick={() => setBuilderTab('manual')}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                    builderTab === 'manual'
                      ? 'bg-slate-900 text-white shadow'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Questions List ({builderQuestions.length})
                </button>
                <button
                  type="button"
                  onClick={() => setBuilderTab('bulk')}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all ${
                    builderTab === 'bulk'
                      ? 'bg-slate-900 text-white shadow'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <Upload className="w-4 h-4" />
                  <span>Bulk Text / JSON Importer (100+ Questions)</span>
                </button>
              </div>

              {builderTab === 'bulk' && (
                <div className="space-y-4">
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-800">
                    <p className="font-bold mb-1">Bulk Question Importer Rules:</p>
                    <p>Paste any number of questions (1 to 100+). We will NOT truncate or limit your questions.</p>
                  </div>

                  <textarea
                    rows={10}
                    value={bulkText}
                    onChange={(e) => setBulkText(e.target.value)}
                    placeholder="Paste structured questions or JSON array here..."
                    className="w-full p-4 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-mono focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />

                  {bulkError && <p className="text-xs text-rose-600 font-semibold">{bulkError}</p>}

                  <button
                    type="button"
                    onClick={handleProcessBulkQuestions}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-xl shadow"
                  >
                    Process & Append Questions
                  </button>
                </div>
              )}

              {builderTab === 'manual' && (
                <div className="space-y-6">
                  {builderQuestions.map((q, idx) => (
                    <div
                      key={q.id || idx}
                      className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 relative"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-extrabold text-sm text-slate-800 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                          Question #{idx + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setBuilderQuestions((prev) => prev.filter((_, i) => i !== idx));
                          }}
                          className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Remove
                        </button>
                      </div>

                      <div className="mb-4">
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                          Question Content *
                        </label>
                        <textarea
                          rows={2}
                          value={q.question_text}
                          onChange={(e) => {
                            const val = e.target.value;
                            setBuilderQuestions((prev) =>
                              prev.map((item, i) => (i === idx ? { ...item, question_text: val } : item))
                            );
                          }}
                          placeholder="Type or paste question in Hindi or English..."
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                        {(['A', 'B', 'C', 'D'] as const).map((opt) => {
                          const field =
                            opt === 'A'
                              ? 'option_a'
                              : opt === 'B'
                              ? 'option_b'
                              : opt === 'C'
                              ? 'option_c'
                              : 'option_d';
                          const isCorrect = q.correct_option === opt;

                          return (
                            <div key={opt} className="relative">
                              <div className="flex items-center gap-2 mb-1">
                                <label className="text-xs font-bold text-slate-600">Option {opt}</label>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setBuilderQuestions((prev) =>
                                      prev.map((item, i) =>
                                        i === idx ? { ...item, correct_option: opt } : item
                                      )
                                    );
                                  }}
                                  className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                                    isCorrect
                                      ? 'bg-emerald-600 text-white'
                                      : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                                  }`}
                                >
                                  {isCorrect ? '✓ Correct Answer' : 'Set as Correct'}
                                </button>
                              </div>
                              <input
                                type="text"
                                value={q[field]}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setBuilderQuestions((prev) =>
                                    prev.map((item, i) =>
                                      i === idx ? { ...item, [field]: val } : item
                                    )
                                  );
                                }}
                                placeholder={`Option ${opt} text`}
                                className={`w-full px-3 py-2 bg-white border rounded-xl text-xs sm:text-sm focus:outline-none ${
                                  isCorrect
                                    ? 'border-emerald-500 ring-1 ring-emerald-500'
                                    : 'border-slate-300 focus:ring-2 focus:ring-amber-500'
                                }`}
                              />
                            </div>
                          );
                        })}
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                          Solution Explanation / Answer Key Notes
                        </label>
                        <input
                          type="text"
                          value={q.solution_explanation}
                          onChange={(e) => {
                            const val = e.target.value;
                            setBuilderQuestions((prev) =>
                              prev.map((item, i) =>
                                i === idx ? { ...item, solution_explanation: val } : item
                              )
                            );
                          }}
                          placeholder="Detailed explanation shown after submission..."
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() => {
                      setBuilderQuestions((prev) => [
                        ...prev,
                        {
                          id: 'q_' + Date.now() + '_' + (prev.length + 1),
                          question_text: '',
                          option_a: '',
                          option_b: '',
                          option_c: '',
                          option_d: '',
                          correct_option: 'A',
                          solution_explanation: '',
                          marks: builderPositiveMarks,
                          negative_marks: builderNegativeMarks,
                        },
                      ]);
                    }}
                    className="w-full py-3 border-2 border-dashed border-slate-300 hover:border-amber-500 hover:bg-amber-50/50 rounded-2xl text-xs sm:text-sm font-bold text-slate-600 hover:text-amber-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>+ Add Another Question</span>
                  </button>
                </div>
              )}
            </div>

            <div className="bg-slate-100 border-t border-slate-200 px-6 py-4 flex items-center justify-between">
              <span className="text-xs font-medium text-slate-600">
                Total Questions: <strong className="text-slate-900">{builderQuestions.length}</strong>
              </span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowTestBuilderModal(false)}
                  className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveExamTest}
                  className="px-6 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm rounded-xl shadow"
                >
                  {builderIsPublished ? 'Save & Publish Immediately' : 'Save as Private Draft'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
