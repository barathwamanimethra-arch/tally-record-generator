/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { StudentDetails, ExperimentData } from './types';
import { INITIAL_STUDENT, generateDynamicExperiments } from './data/templateData';
import { DocumentMasterView } from './components/DocumentMasterView';
import { StudentDetailsForm } from './components/StudentDetailsForm';
import { ExperimentImageEditor } from './components/ExperimentImageEditor';
import { downloadDocumentPdf, printDocument } from './utils/pdfExport';
import {
  FileText,
  Image as ImageIcon,
  Printer,
  Download,
  RefreshCw,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  CheckCircle2,
  Users,
  Eye,
  Settings2,
  Sparkles,
  Share2,
  Copy,
  ExternalLink,
  QrCode,
} from 'lucide-react';
import { StudentRecordQRModal } from './components/StudentRecordQRModal';

export default function App() {
  const [showShareModal, setShowShareModal] = useState<boolean>(false);
  const [showQrModal, setShowQrModal] = useState<boolean>(false);
  const [qrMode, setQrMode] = useState<'text' | 'url'>('text');
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // Auto-Save State
  const [autoSaveEnabled, setAutoSaveEnabled] = useState<boolean>(() => {
    return localStorage.getItem('tally_autosave_enabled') !== 'false';
  });
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('saved');
  const [lastSavedTime, setLastSavedTime] = useState<string>(() => {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  });

  // Student Details State
  const [student, setStudent] = useState<StudentDetails>(() => {
    const saved = localStorage.getItem('tally_student_details');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_STUDENT;
  });

  // Variation Index State
  const [variationIndex, setVariationIndex] = useState<number>(0);

  // Experiments List State (dynamically computed from student & variation seed)
  const [experiments, setExperiments] = useState<ExperimentData[]>(() => {
    const saved = localStorage.getItem('tally_experiments_custom');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length === 7) {
          return parsed;
        }
      } catch (e) {
        console.error(e);
      }
    }
    return generateDynamicExperiments(INITIAL_STUDENT, 0);
  });

  // View & UI Navigation State
  const [activeTab, setActiveTab] = useState<'preview' | 'images' | 'batch'>('preview');
  const [selectedExpId, setSelectedExpId] = useState<number | 'all'>('all');
  const [zoomLevel, setZoomLevel] = useState<number>(1.0);

  // PDF Export State
  const [isGeneratingPdf, setIsGeneratingPdf] = useState<boolean>(false);
  const [pdfProgress, setPdfProgress] = useState<{ current: number; total: number } | null>(null);

  // Notification Toast State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  }, []);

  // Auto-Save Effect: whenever student or experiments change, save to localStorage
  useEffect(() => {
    if (!autoSaveEnabled) return;

    setSaveStatus('saving');
    const timer = setTimeout(() => {
      try {
        localStorage.setItem('tally_student_details', JSON.stringify(student));
        localStorage.setItem('tally_experiments_custom', JSON.stringify(experiments));
        setSaveStatus('saved');
        setLastSavedTime(
          new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
        );
      } catch (e) {
        console.error('Auto-save error:', e);
        setSaveStatus('idle');
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [student, experiments, autoSaveEnabled]);

  // Toggle Auto-Save
  const handleToggleAutoSave = () => {
    const nextVal = !autoSaveEnabled;
    setAutoSaveEnabled(nextVal);
    localStorage.setItem('tally_autosave_enabled', nextVal ? 'true' : 'false');
    showToast(nextVal ? 'Auto-Save enabled: All changes will save to browser storage.' : 'Auto-Save paused.');
  };

  // Reset to Defaults
  const handleResetDefaults = () => {
    if (window.confirm('Reset student credentials and experiments back to standard template defaults?')) {
      setStudent(INITIAL_STUDENT);
      const fresh = generateDynamicExperiments(INITIAL_STUDENT, 0);
      setExperiments(fresh);
      setVariationIndex(0);
      localStorage.removeItem('tally_student_details');
      localStorage.removeItem('tally_experiments_custom');
      setLastSavedTime(
        new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      );
      showToast('Reset all details back to template defaults.');
    }
  };

  // Regenerate experiments when student or variationIndex changes
  // Preserving any user-uploaded custom screenshots!
  const handleStudentChange = (updatedStudent: StudentDetails) => {
    setStudent(updatedStudent);
    setExperiments((prevExps) => {
      const fresh = generateDynamicExperiments(updatedStudent, variationIndex);
      // Preserve any uploaded screenshots
      return fresh.map((fExp, i) => {
        const existing = prevExps[i];
        if (!existing) return fExp;
        return {
          ...fExp,
          inlineScreenshots: fExp.inlineScreenshots?.map((sc, scIdx) => ({
            ...sc,
            imageUrl: existing.inlineScreenshots?.[scIdx]?.imageUrl || sc.imageUrl,
          })),
          outputImages: fExp.outputImages?.map((out, oIdx) => ({
            ...out,
            imageUrl: existing.outputImages?.[oIdx]?.imageUrl || out.imageUrl,
          })),
        };
      });
    });
  };

  // Shuffle variation
  const handleShuffleVariation = () => {
    const nextIdx = (variationIndex + 1) % 4;
    setVariationIndex(nextIdx);
    setExperiments((prevExps) => {
      const fresh = generateDynamicExperiments(student, nextIdx);
      return fresh.map((fExp, i) => {
        const existing = prevExps[i];
        if (!existing) return fExp;
        return {
          ...fExp,
          inlineScreenshots: fExp.inlineScreenshots?.map((sc, scIdx) => ({
            ...sc,
            imageUrl: existing.inlineScreenshots?.[scIdx]?.imageUrl || sc.imageUrl,
          })),
          outputImages: fExp.outputImages?.map((out, oIdx) => ({
            ...out,
            imageUrl: existing.outputImages?.[oIdx]?.imageUrl || out.imageUrl,
          })),
        };
      });
    });
    showToast(`Loaded content variation #${nextIdx + 1} with unique figures & transactions!`);
  };

  // Update a single experiment (e.g. from Image Editor)
  const handleUpdateExperiment = (updatedExp: ExperimentData) => {
    setExperiments((prev) =>
      prev.map((e) => (e.id === updatedExp.id ? updatedExp : e))
    );
  };

  // Direct PDF Download Handler
  const handleDownloadPdf = async () => {
    setIsGeneratingPdf(true);
    setPdfProgress({ current: 0, total: 10 });
    try {
      const filename = `Tally_ERP9_Record_${student.registerNumber.trim() || 'Book'}.pdf`;
      await downloadDocumentPdf('document-printable-area', filename, (current, total) => {
        setPdfProgress({ current, total });
      });
      showToast('Document PDF downloaded successfully!');
    } catch (error) {
      console.error('PDF export failed:', error);
      alert('PDF generation encountered a browser canvas limitation. You can use the "Print / Save as PDF" button for an instant vector PDF.');
    } finally {
      setIsGeneratingPdf(false);
      setPdfProgress(null);
    }
  };

  // Batch Generation helper
  const [batchPrefix, setBatchPrefix] = useState('2513101040');
  const [batchFrom, setBatchFrom] = useState('136');
  const [batchTo, setBatchTo] = useState('140');
  const [isBatchRunning, setIsBatchRunning] = useState(false);

  const handleRunBatch = async () => {
    const start = parseInt(batchFrom, 10);
    const end = parseInt(batchTo, 10);
    if (isNaN(start) || isNaN(end) || start > end) {
      alert('Please enter a valid range');
      return;
    }
    if (end - start > 10) {
      alert('Batch limited to 10 at a time to ensure browser stability.');
      return;
    }

    setIsBatchRunning(true);
    for (let i = start; i <= end; i++) {
      const reg = `${batchPrefix}${String(i).padStart(3, '0')}`;
      const updated: StudentDetails = {
        ...student,
        registerNumber: reg,
        rollNumber: `23UAC0${i % 100}`,
      };
      setStudent(updated);
      const dynamicExps = generateDynamicExperiments(updated, i % 4);
      setExperiments(dynamicExps);
      // Brief pause to allow rendering
      await new Promise((r) => setTimeout(r, 600));
      await downloadDocumentPdf('document-printable-area', `Tally_Record_${reg}.pdf`);
    }
    setIsBatchRunning(false);
    showToast(`Batch completed for ${end - start + 1} students!`);
  };

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col selection:bg-emerald-200">
      {/* ================= TOP NAVBAR ================= */}
      <nav id="app-navbar" className="no-print sticky top-0 z-40 bg-[#163826] text-white shadow-md border-b border-emerald-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-600 flex items-center justify-center font-serif font-black text-white text-sm shadow-inner shrink-0">
              T9
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold tracking-tight text-white font-serif">
                  Tally ERP. 9 Record Generator
                </h1>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-emerald-800 text-emerald-200 border border-emerald-700">
                  {student.registerNumber || '2513101040136'}
                </span>
              </div>
              <p className="text-[11px] text-emerald-300 font-sans">
                Tally ERP. 9 Record Generator • 7 Curriculum Experiments
              </p>
            </div>
          </div>

          {/* Navigation Tab Pills */}
          <div className="hidden md:flex items-center bg-emerald-950/70 p-1 rounded-lg border border-emerald-800/80 text-xs">
            <button
              type="button"
              id="tab-btn-preview"
              onClick={() => setActiveTab('preview')}
              className={`px-3 py-1.5 rounded-md font-medium flex items-center gap-1.5 transition-all ${
                activeTab === 'preview'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-emerald-200 hover:text-white'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              Document View
            </button>

            <button
              type="button"
              id="tab-btn-images"
              onClick={() => setActiveTab('images')}
              className={`px-3 py-1.5 rounded-md font-medium flex items-center gap-1.5 transition-all ${
                activeTab === 'images'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-emerald-200 hover:text-white'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              Upload &amp; Change Screenshots
            </button>

            <button
              type="button"
              id="tab-btn-batch"
              onClick={() => setActiveTab('batch')}
              className={`px-3 py-1.5 rounded-md font-medium flex items-center gap-1.5 transition-all ${
                activeTab === 'batch'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-emerald-200 hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              Batch Generator
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              id="header-btn-share"
              onClick={() => setShowShareModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-100 hover:text-white bg-emerald-900/90 hover:bg-emerald-800 border border-emerald-700/80 rounded-lg transition-colors shadow-xs"
              title="Share Website link"
            >
              <Share2 className="w-3.5 h-3.5 text-emerald-300" />
              <span className="hidden sm:inline">Share</span>
            </button>

            <button
              type="button"
              id="header-btn-print"
              onClick={printDocument}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-100 hover:text-white bg-emerald-900/90 hover:bg-emerald-800 border border-emerald-700/80 rounded-lg transition-colors shadow-xs"
              title="Print document or Save as Vector PDF"
            >
              <Printer className="w-3.5 h-3.5 text-emerald-300" />
              <span className="hidden sm:inline">Print / Save</span>
            </button>

            <button
              type="button"
              id="header-btn-download"
              onClick={handleDownloadPdf}
              disabled={isGeneratingPdf}
              className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 text-xs font-bold text-stone-900 bg-amber-400 hover:bg-amber-300 active:scale-95 disabled:opacity-50 rounded-lg transition-transform shadow-md"
              title="Download high-resolution multi-page PDF"
            >
              {isGeneratingPdf ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>{pdfProgress ? `${pdfProgress.current}/${pdfProgress.total}` : 'Exporting...'}</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* PDF Rendering Progress Bar */}
        {isGeneratingPdf && (
          <div className="w-full bg-emerald-950 px-4 py-1 text-xs text-emerald-200 border-t border-emerald-800/60 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <RefreshCw className="w-3 h-3 animate-spin text-amber-400" />
              <span>Rendering master pages to PDF canvas (Page {pdfProgress?.current} of {pdfProgress?.total})...</span>
            </div>
            <span className="font-mono text-amber-300 font-bold">
              {pdfProgress ? Math.round((pdfProgress.current / pdfProgress.total) * 100) : 0}%
            </span>
          </div>
        )}
      </nav>

      {/* ================= SHARE WEBSITE MODAL ================= */}
      {showShareModal && (
        <div className="no-print fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold">
                  <Share2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-stone-900 font-serif">How to Share with Friends</h3>
                  <p className="text-[11px] text-stone-500">Fix the "403 Not Authorized" error</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowShareModal(false)}
                className="text-stone-400 hover:text-stone-700 p-1 text-base font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-900 space-y-1">
              <p className="font-bold flex items-center gap-1.5 text-red-800">
                ⚠️ Why your friends get the "403 Error":
              </p>
              <p className="text-[11px] text-red-700 leading-relaxed">
                Development links (<code className="bg-red-100 px-1 rounded font-mono">ais-dev-...</code> or <code className="bg-red-100 px-1 rounded font-mono">aistudio.google.com</code>) are protected by Google so only your account can edit them.
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-800">
                To create a public link your friends can open:
              </h4>

              <div className="space-y-2.5 text-xs text-stone-700">
                <div className="flex items-start gap-2.5 p-2.5 bg-stone-50 rounded-lg border border-stone-200">
                  <span className="w-5 h-5 rounded-full bg-emerald-700 text-white text-[11px] font-bold flex items-center justify-center shrink-0">1</span>
                  <div>
                    <span className="font-bold text-stone-900">Look at the top-right corner of Google AI Studio</span>
                    <p className="text-[11px] text-stone-500 mt-0.5">
                      On your desktop or mobile screen at the very top bar (next to the settings menu).
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-2.5 bg-stone-50 rounded-lg border border-stone-200">
                  <span className="w-5 h-5 rounded-full bg-emerald-700 text-white text-[11px] font-bold flex items-center justify-center shrink-0">2</span>
                  <div>
                    <span className="font-bold text-stone-900">Click the "Share" button</span>
                    <p className="text-[11px] text-stone-500 mt-0.5">
                      Select <strong>"Anyone with the link can view"</strong> and click <strong>Create Link</strong>.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-2.5 bg-stone-50 rounded-lg border border-stone-200">
                  <span className="w-5 h-5 rounded-full bg-emerald-700 text-white text-[11px] font-bold flex items-center justify-center shrink-0">3</span>
                  <div>
                    <span className="font-bold text-stone-900">Or Click "Deploy"</span>
                    <p className="text-[11px] text-stone-500 mt-0.5">
                      Clicking <strong>Deploy to Cloud Run</strong> gives you a permanent, 100% public web address.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-stone-100">
              <button
                type="button"
                onClick={() => setShowShareModal(false)}
                className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold rounded-lg transition-colors"
              >
                Got It, Thanks!
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= TOAST NOTIFICATION ================= */}
      {toastMessage && (
        <div className="no-print fixed bottom-6 right-6 z-50 bg-stone-900 text-white text-xs px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 border border-stone-700 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ================= MAIN CONTAINER ================= */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        
        {/* Student Details Form (Always prominent) */}
        <StudentDetailsForm
          student={student}
          onChange={handleStudentChange}
          onShuffleVariation={handleShuffleVariation}
          variationIndex={variationIndex}
          onPrint={printDocument}
          onDownloadPdf={handleDownloadPdf}
          isGeneratingPdf={isGeneratingPdf}
          autoSaveEnabled={autoSaveEnabled}
          onToggleAutoSave={handleToggleAutoSave}
          saveStatus={saveStatus}
          lastSavedTime={lastSavedTime}
          onOpenQrModal={() => setShowQrModal(true)}
          onResetDefaults={handleResetDefaults}
        />

        {/* Tab 2: Image & Screenshot Replacement Panel */}
        {activeTab === 'images' && (
          <div className="no-print space-y-4">
            <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
              <div>
                <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-emerald-700" />
                  Custom Screenshot &amp; Image Replacement
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Upload your own lab screenshots, paste from clipboard, or regenerate authentic Tally ERP.9 interface mockups with your Register Number.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setActiveTab('preview')}
                className="px-3 py-1.5 bg-emerald-800 text-white text-xs font-semibold rounded-lg hover:bg-emerald-900 transition-colors"
              >
                Back to Document View
              </button>
            </div>

            <ExperimentImageEditor
              experiments={experiments}
              selectedExpId={typeof selectedExpId === 'number' ? selectedExpId : 1}
              onSelectExp={(id) => setSelectedExpId(id)}
              onUpdateExperiment={handleUpdateExperiment}
              student={student}
            />
          </div>
        )}

        {/* Tab 3: Batch Generator Tool */}
        {activeTab === 'batch' && (
          <div className="no-print bg-white p-6 rounded-xl border border-stone-200 shadow-sm space-y-4">
            <div className="border-b border-stone-200 pb-3">
              <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-700" />
                Class Batch Record Generator
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Automatically generate individual, unique Tally ERP.9 practical record books for an entire roster of students with sequential register numbers.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Register Number Prefix
                </label>
                <input
                  type="text"
                  value={batchPrefix}
                  onChange={(e) => setBatchPrefix(e.target.value)}
                  placeholder="2513101040"
                  className="w-full text-xs font-mono px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Start Suffix
                </label>
                <input
                  type="number"
                  value={batchFrom}
                  onChange={(e) => setBatchFrom(e.target.value)}
                  placeholder="136"
                  className="w-full text-xs font-mono px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  End Suffix
                </label>
                <input
                  type="number"
                  value={batchTo}
                  onChange={(e) => setBatchTo(e.target.value)}
                  placeholder="140"
                  className="w-full text-xs font-mono px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-stone-600">
                Will generate documents for <span className="font-mono font-bold text-emerald-900">{batchPrefix}{batchFrom}</span> through{' '}
                <span className="font-mono font-bold text-emerald-900">{batchPrefix}{batchTo}</span>
              </span>

              <button
                type="button"
                onClick={handleRunBatch}
                disabled={isBatchRunning}
                className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors shadow-xs disabled:opacity-50"
              >
                {isBatchRunning ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    Generating Batch...
                  </>
                ) : (
                  <>
                    <Download className="w-3.5 h-3.5" />
                    Start Batch Export
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Document Preview Controls Toolbar (Only when preview is active) */}
        {activeTab === 'preview' && (
          <div id="controls-toolbar" className="no-print flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-stone-200 shadow-xs">
            
            {/* Filter by Experiment / Page */}
            <div className="flex items-center gap-2">
              <label htmlFor="select-exp-filter" className="text-xs font-semibold text-stone-700">
                Display:
              </label>
              <select
                id="select-exp-filter"
                value={selectedExpId}
                onChange={(e) =>
                  setSelectedExpId(e.target.value === 'all' ? 'all' : Number(e.target.value))
                }
                className="text-xs bg-stone-50 text-stone-800 border border-stone-300 px-3 py-1.5 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-emerald-700/20"
              >
                <option value="all">Full Record Book (All 7 Experiments + Cover + Index)</option>
                <option value={1}>Ex 1: Creation of company in Tally ERP.9 with control setup</option>
                <option value={2}>Ex 2: Creation of single and multiple ledgers</option>
                <option value={3}>Ex 3: Creation of default vouchers-payment, reciept, contra, journal</option>
                <option value={4}>Ex 4: Creation of inventory with stock group and stock items</option>
                <option value={5}>Ex 5: Creation of purchase order and sales order voucher</option>
                <option value={6}>Ex 6: Creation of payroll, pay heads, attendance and reports</option>
                <option value={7}>Ex 7: Job costing in tally</option>
              </select>
            </div>

            {/* Zoom Controls */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-stone-500 hidden sm:inline">Zoom:</span>
              <div className="flex items-center bg-stone-100 rounded-lg p-0.5 border border-stone-200">
                <button
                  type="button"
                  id="btn-zoom-out"
                  onClick={() => setZoomLevel((z) => Math.max(0.6, z - 0.1))}
                  className="p-1.5 text-stone-600 hover:text-black rounded"
                  title="Zoom out"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="px-2 text-xs font-mono text-stone-700 min-w-12 text-center">
                  {Math.round(zoomLevel * 100)}%
                </span>
                <button
                  type="button"
                  id="btn-zoom-in"
                  onClick={() => setZoomLevel((z) => Math.min(1.4, z + 0.1))}
                  className="p-1.5 text-stone-600 hover:text-black rounded"
                  title="Zoom in"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  id="btn-zoom-reset"
                  onClick={() => setZoomLevel(1.0)}
                  className="p-1.5 text-stone-400 hover:text-black rounded ml-0.5"
                  title="Reset zoom to 100%"
                >
                  <RotateCcw className="w-3 h-3" />
                </button>
              </div>

              <button
                type="button"
                id="btn-switch-to-image-editor"
                onClick={() => setActiveTab('images')}
                className="ml-2 text-xs font-medium text-emerald-800 hover:text-emerald-950 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg border border-emerald-300 flex items-center gap-1.5 transition-colors"
              >
                <ImageIcon className="w-3.5 h-3.5" />
                Change Screenshots
              </button>
            </div>
          </div>
        )}

        {/* Master Document Live Printable View */}
        <div
          className="w-full flex justify-center origin-top transition-transform"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          <DocumentMasterView
            student={student}
            experiments={experiments}
            selectedExpId={selectedExpId}
            qrMode={qrMode}
          />
        </div>
      </main>

      {/* ================= QR CODE VERIFICATION MODAL ================= */}
      <StudentRecordQRModal
        isOpen={showQrModal}
        onClose={() => setShowQrModal(false)}
        student={student}
        qrMode={qrMode}
        onChangeQrMode={setQrMode}
      />
    </div>
  );
}
