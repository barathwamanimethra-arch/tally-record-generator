import React from 'react';
import { StudentDetails } from '../types';
import {
  User,
  Hash,
  GraduationCap,
  School,
  RefreshCw,
  Printer,
  Download,
  QrCode,
  CheckCircle2,
  Save,
  RotateCcw,
} from 'lucide-react';

interface Props {
  student: StudentDetails;
  onChange: (updated: StudentDetails) => void;
  onShuffleVariation: () => void;
  variationIndex: number;
  onPrint: () => void;
  onDownloadPdf: () => void;
  isGeneratingPdf: boolean;
  autoSaveEnabled: boolean;
  onToggleAutoSave: () => void;
  saveStatus: 'idle' | 'saving' | 'saved';
  lastSavedTime: string;
  onOpenQrModal: () => void;
  onResetDefaults: () => void;
}

export const StudentDetailsForm: React.FC<Props> = ({
  student,
  onChange,
  onShuffleVariation,
  variationIndex,
  onPrint,
  onDownloadPdf,
  isGeneratingPdf,
  autoSaveEnabled,
  onToggleAutoSave,
  saveStatus,
  lastSavedTime,
  onOpenQrModal,
  onResetDefaults,
}) => {
  const handleChange = (field: keyof StudentDetails, value: string) => {
    onChange({
      ...student,
      [field]: value,
    });
  };

  return (
    <div id="student-credentials-panel" className="bg-white border border-stone-200 rounded-xl p-5 shadow-sm space-y-4">
      {/* Header bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-stone-200 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-emerald-700 text-white font-bold text-xs">
              T9
            </span>
            <h2 className="text-lg font-bold text-stone-900 tracking-tight">Student Credentials &amp; Document Control</h2>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Cover page, table headers, and Tally screens automatically update with your credentials.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* QR Code Modal Trigger */}
          <button
            type="button"
            id="btn-view-qr-code"
            onClick={onOpenQrModal}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-stone-800 bg-stone-100 hover:bg-stone-200 border border-stone-300 rounded-lg transition-colors shadow-xs"
            title="Inspect or download the unique verification QR code on the cover page"
          >
            <QrCode className="w-3.5 h-3.5 text-emerald-700" />
            Cover QR Code
          </button>

          <button
            type="button"
            id="btn-shuffle-variation"
            onClick={onShuffleVariation}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-lg transition-colors shadow-xs"
            title="Generate unique data and problem values for this student"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Vary Content (#{variationIndex + 1})
          </button>

          <button
            type="button"
            id="btn-print-document"
            onClick={onPrint}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-stone-800 bg-stone-100 hover:bg-stone-200 border border-stone-300 rounded-lg transition-colors shadow-xs"
          >
            <Printer className="w-3.5 h-3.5 text-stone-600" />
            Print / Save PDF
          </button>

          <button
            type="button"
            id="btn-download-pdf"
            onClick={onDownloadPdf}
            disabled={isGeneratingPdf}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 border border-emerald-900 rounded-lg transition-colors shadow-xs disabled:opacity-60"
          >
            {isGeneratingPdf ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                Preparing PDF...
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                Download PDF
              </>
            )}
          </button>
        </div>
      </div>

      {/* Auto-Save & System Status Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 px-3.5 py-2 bg-stone-50 border border-stone-200/80 rounded-lg text-xs">
        <div className="flex items-center gap-2">
          {/* Status icon */}
          {autoSaveEnabled ? (
            <div className="flex items-center gap-1.5 text-emerald-800 font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
              </span>
              <span>Auto-Save Enabled</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 ml-0.5" />
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-stone-500 font-medium">
              <span className="h-2 w-2 rounded-full bg-stone-400"></span>
              <span>Auto-Save Paused</span>
            </div>
          )}

          <span className="text-stone-300">|</span>

          <span className="text-stone-600 text-[11px]">
            {saveStatus === 'saving' ? (
              <span className="text-amber-700 font-semibold animate-pulse">Saving changes...</span>
            ) : (
              <span>Last saved to browser: <strong className="font-mono text-stone-800">{lastSavedTime || 'Just now'}</strong></span>
            )}
          </span>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            type="button"
            onClick={onToggleAutoSave}
            className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors border ${
              autoSaveEnabled
                ? 'bg-emerald-100/70 text-emerald-800 border-emerald-300 hover:bg-emerald-200/70'
                : 'bg-stone-200 text-stone-700 border-stone-300 hover:bg-stone-300'
            }`}
          >
            {autoSaveEnabled ? 'Auto-Save: ON' : 'Auto-Save: OFF'}
          </button>

          <button
            type="button"
            onClick={onResetDefaults}
            className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-medium text-stone-600 hover:text-rose-700 hover:bg-rose-50 rounded transition-colors"
            title="Reset student fields back to standard template defaults"
          >
            <RotateCcw className="w-3 h-3" />
            Reset Defaults
          </button>
        </div>
      </div>

      {/* Grid of Student Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {/* Register Number */}
        <div>
          <label htmlFor="input-reg-number" className="block text-xs font-semibold text-stone-700 mb-1 flex items-center gap-1">
            <Hash className="w-3 h-3 text-emerald-700" />
            Register Number *
          </label>
          <input
            type="text"
            id="input-reg-number"
            value={student.registerNumber}
            onChange={(e) => handleChange('registerNumber', e.target.value)}
            placeholder="e.g., 2513101040136"
            className="w-full text-xs font-mono px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 font-bold text-stone-900"
          />
        </div>

        {/* Student Name */}
        <div>
          <label htmlFor="input-student-name" className="block text-xs font-semibold text-stone-700 mb-1 flex items-center gap-1">
            <User className="w-3 h-3 text-emerald-700" />
            Student Name *
          </label>
          <input
            type="text"
            id="input-student-name"
            value={student.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="e.g., Barathwamanimethra S"
            className="w-full text-xs px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 text-stone-900 font-medium"
          />
        </div>

        {/* Roll Number */}
        <div>
          <label htmlFor="input-roll-number" className="block text-xs font-semibold text-stone-700 mb-1 flex items-center gap-1">
            <Hash className="w-3 h-3 text-emerald-700" />
            Roll Number *
          </label>
          <input
            type="text"
            id="input-roll-number"
            value={student.rollNumber}
            onChange={(e) => handleChange('rollNumber', e.target.value)}
            placeholder="e.g., 23UAC045"
            className="w-full text-xs px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 text-stone-900"
          />
        </div>

        {/* Class */}
        <div>
          <label htmlFor="input-class-name" className="block text-xs font-semibold text-stone-700 mb-1 flex items-center gap-1">
            <GraduationCap className="w-3 h-3 text-emerald-700" />
            Class *
          </label>
          <input
            type="text"
            id="input-class-name"
            value={student.className}
            onChange={(e) => handleChange('className', e.target.value)}
            placeholder="e.g., III B.Com (CA)"
            className="w-full text-xs px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 text-stone-900"
          />
        </div>

        {/* Section */}
        <div>
          <label htmlFor="input-section-name" className="block text-xs font-semibold text-stone-700 mb-1 flex items-center gap-1">
            <School className="w-3 h-3 text-emerald-700" />
            Section *
          </label>
          <input
            type="text"
            id="input-section-name"
            value={student.section}
            onChange={(e) => handleChange('section', e.target.value)}
            placeholder="e.g., Section A"
            className="w-full text-xs px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 text-stone-900"
          />
        </div>
      </div>

      {/* Secondary Meta row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-stone-100 text-xs">
        <div>
          <label htmlFor="input-subject" className="block text-[11px] font-medium text-stone-500 mb-0.5">Subject</label>
          <input
            type="text"
            id="input-subject"
            value={student.subjectName}
            onChange={(e) => handleChange('subjectName', e.target.value)}
            className="w-full text-xs px-2.5 py-1.5 bg-stone-50 border border-stone-200 rounded text-stone-800"
          />
        </div>
        <div>
          <label htmlFor="input-dept" className="block text-[11px] font-medium text-stone-500 mb-0.5">Department / College</label>
          <input
            type="text"
            id="input-dept"
            value={student.institutionName || ''}
            onChange={(e) => handleChange('institutionName', e.target.value)}
            className="w-full text-xs px-2.5 py-1.5 bg-stone-50 border border-stone-200 rounded text-stone-800"
          />
        </div>
        <div>
          <label htmlFor="input-default-date" className="block text-[11px] font-medium text-stone-500 mb-0.5">Default Lab Date</label>
          <input
            type="text"
            id="input-default-date"
            value={student.defaultDate || ''}
            onChange={(e) => handleChange('defaultDate', e.target.value)}
            placeholder="DD / MM / YYYY"
            className="w-full text-xs px-2.5 py-1.5 bg-stone-50 border border-stone-200 rounded text-stone-800 font-mono"
          />
        </div>
      </div>
    </div>
  );
};

