import React, { useState, useRef } from 'react';
import { ExperimentData, StudentDetails } from '../types';
import { Upload, Image as ImageIcon, Trash2, RefreshCw, Edit3, Plus, Check, Eye } from 'lucide-react';
import { generateTallyScreenshot } from '../utils/tallyCanvasGenerator';

interface Props {
  experiments: ExperimentData[];
  selectedExpId: number;
  onSelectExp: (id: number) => void;
  onUpdateExperiment: (updated: ExperimentData) => void;
  student: StudentDetails;
}

export const ExperimentImageEditor: React.FC<Props> = ({
  experiments,
  selectedExpId,
  onSelectExp,
  onUpdateExperiment,
  student,
}) => {
  const currentExp = experiments.find((e) => e.id === selectedExpId) || experiments[0];
  const [activeTab, setActiveTab] = useState<'images' | 'text'>('images');
  const [editingAim, setEditingAim] = useState(false);
  const [aimText, setAimText] = useState(currentExp.aim);
  const [resultText, setResultText] = useState(currentExp.result);
  const [editingResult, setEditingResult] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadTarget, setUploadTarget] = useState<{ type: 'inline' | 'output'; index: number } | null>(null);

  // Synchronize when currentExp changes
  React.useEffect(() => {
    setAimText(currentExp.aim);
    setResultText(currentExp.result);
  }, [currentExp]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !uploadTarget) return;

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const resultDataUrl = uploadEvent.target?.result as string;
      if (!resultDataUrl) return;

      if (uploadTarget.type === 'inline') {
        const updatedInline = [...(currentExp.inlineScreenshots || [])];
        if (updatedInline[uploadTarget.index]) {
          updatedInline[uploadTarget.index] = {
            ...updatedInline[uploadTarget.index],
            imageUrl: resultDataUrl,
          };
          onUpdateExperiment({
            ...currentExp,
            inlineScreenshots: updatedInline,
          });
        }
      } else if (uploadTarget.type === 'output') {
        const updatedOutputs = [...(currentExp.outputImages || [])];
        if (updatedOutputs[uploadTarget.index]) {
          updatedOutputs[uploadTarget.index] = {
            ...updatedOutputs[uploadTarget.index],
            imageUrl: resultDataUrl,
          };
          onUpdateExperiment({
            ...currentExp,
            outputImages: updatedOutputs,
          });
        }
      }
      setUploadTarget(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    };
    reader.readAsDataURL(file);
  };

  const triggerUpload = (type: 'inline' | 'output', index: number) => {
    setUploadTarget({ type, index });
    fileInputRef.current?.click();
  };

  const handleSaveAim = () => {
    onUpdateExperiment({
      ...currentExp,
      aim: aimText,
    });
    setEditingAim(false);
  };

  const handleSaveResult = () => {
    onUpdateExperiment({
      ...currentExp,
      result: resultText,
    });
    setEditingResult(false);
  };

  const handleStepTextChange = (stepIdx: number, newText: string) => {
    const newSteps = [...currentExp.procedureSteps];
    newSteps[stepIdx] = newText;
    onUpdateExperiment({
      ...currentExp,
      procedureSteps: newSteps,
    });
  };

  const handleRegenerateTallyScreen = (type: 'inline' | 'output', index: number) => {
    const regNo = student.registerNumber.trim() || '2513101040136';
    const cmpName = `${regNo} EX:${currentExp.id}`;

    let newUrl = '';
    if (currentExp.id === 1) {
      newUrl = generateTallyScreenshot({ screenType: index === 0 ? 'startup' : 'company_create', regNo, companyName: cmpName });
    } else if (currentExp.id === 2) {
      newUrl = generateTallyScreenshot({ screenType: index === 0 ? 'single_ledger' : 'multi_ledger', regNo, companyName: cmpName });
    } else if (currentExp.id === 3) {
      newUrl = generateTallyScreenshot({ screenType: index === 0 ? 'voucher_payment' : index === 1 ? 'voucher_receipt' : 'voucher_contra', regNo, companyName: cmpName });
    } else if (currentExp.id === 4) {
      newUrl = generateTallyScreenshot({ screenType: index === 0 ? 'stock_group_create' : 'multi_stock_item', regNo, companyName: cmpName });
    } else if (currentExp.id === 5) {
      newUrl = generateTallyScreenshot({ screenType: index === 0 ? 'purchase_order' : 'sales_order', regNo, companyName: cmpName });
    } else if (currentExp.id === 6) {
      newUrl = generateTallyScreenshot({ screenType: index === 0 ? 'employee_create' : 'payroll_voucher', regNo, companyName: cmpName });
    } else {
      newUrl = generateTallyScreenshot({ screenType: index === 0 ? 'cost_centre' : 'job_work_analysis', regNo, companyName: cmpName });
    }

    if (type === 'inline') {
      const updatedInline = [...(currentExp.inlineScreenshots || [])];
      if (updatedInline[index]) {
        updatedInline[index] = { ...updatedInline[index], imageUrl: newUrl };
        onUpdateExperiment({ ...currentExp, inlineScreenshots: updatedInline });
      }
    } else {
      const updatedOut = [...(currentExp.outputImages || [])];
      if (updatedOut[index]) {
        updatedOut[index] = { ...updatedOut[index], imageUrl: newUrl };
        onUpdateExperiment({ ...currentExp, outputImages: updatedOut });
      }
    }
  };

  return (
    <div id="experiment-customizer-panel" className="bg-white border border-stone-200 rounded-xl p-5 shadow-sm space-y-4">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileUpload}
      />

      {/* Tabs Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 pb-3">
        <div>
          <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-emerald-700" />
            Customize Images & Content for Experiment
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            Select an exercise below to change screenshots, upload lab images, or modify steps.
          </p>
        </div>

        {/* Sub-tabs: Images vs Text */}
        <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-lg border border-stone-200 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('images')}
            className={`px-3 py-1.5 rounded-md transition-all ${
              activeTab === 'images'
                ? 'bg-white text-emerald-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Screenshots & Images
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('text')}
            className={`px-3 py-1.5 rounded-md transition-all ${
              activeTab === 'text'
                ? 'bg-white text-emerald-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Text & Steps
          </button>
        </div>
      </div>

      {/* Experiment Selector Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
        {experiments.map((exp) => {
          const isSelected = exp.id === selectedExpId;
          return (
            <button
              key={exp.id}
              type="button"
              onClick={() => onSelectExp(exp.id)}
              className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors flex items-center gap-1.5 shrink-0 ${
                isSelected
                  ? 'bg-emerald-800 text-white border-emerald-900 shadow-xs'
                  : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
              }`}
            >
              <span className={`w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-bold ${
                isSelected ? 'bg-emerald-900 text-white' : 'bg-stone-200 text-stone-700'
              }`}>
                {exp.id}
              </span>
              <span>Ex {exp.id}: {exp.title.split(' IN ')[0].split(' WITH ')[0]}</span>
            </button>
          );
        })}
      </div>

      {/* Selected Experiment Header Summary */}
      <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-lg p-3 text-xs flex items-center justify-between">
        <div>
          <span className="font-bold text-emerald-900">EX NO: {currentExp.exNo}</span>
          <span className="mx-2 text-emerald-400">|</span>
          <span className="font-semibold text-stone-800">{currentExp.title}</span>
        </div>
        <span className="text-[11px] text-emerald-800 font-mono">Date: {currentExp.date}</span>
      </div>

      {/* TAB CONTENT: IMAGES */}
      {activeTab === 'images' && (
        <div className="space-y-4">
          <div className="text-xs text-stone-600">
            Upload your own lab screenshot for any step, or regenerate it to instantly match Register Number{' '}
            <strong className="text-emerald-900 font-mono">{student.registerNumber}</strong>:
          </div>

          {/* Inline Step Screenshots */}
          <div>
            <h4 className="text-xs font-bold text-stone-800 mb-2 uppercase tracking-wide">
              Procedure & Step Screenshots ({currentExp.inlineScreenshots?.length || 0})
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {currentExp.inlineScreenshots?.map((sc, idx) => (
                <div
                  key={`inline-${idx}`}
                  className="border border-stone-200 rounded-lg overflow-hidden bg-stone-50 shadow-xs flex flex-col"
                >
                  <div className="relative aspect-video bg-stone-900 group">
                    <img
                      src={sc.imageUrl}
                      alt={sc.caption || `Step screenshot ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => triggerUpload('inline', idx)}
                        className="px-2.5 py-1.5 bg-white text-stone-900 rounded text-xs font-semibold shadow flex items-center gap-1 hover:bg-stone-100"
                      >
                        <Upload className="w-3 h-3" />
                        Replace Image
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRegenerateTallyScreen('inline', idx)}
                        className="px-2.5 py-1.5 bg-emerald-700 text-white rounded text-xs font-semibold shadow flex items-center gap-1 hover:bg-emerald-800"
                        title="Re-stamp Tally Screen with current Reg No"
                      >
                        <RefreshCw className="w-3 h-3" />
                        Re-stamp
                      </button>
                    </div>
                  </div>
                  <div className="p-2.5 bg-white flex-1 flex flex-col justify-between border-t border-stone-200">
                    <p className="text-xs font-medium text-stone-800 line-clamp-2">{sc.caption || `Step ${sc.stepIndex + 1} Screenshot`}</p>
                    <div className="mt-2 flex items-center justify-between pt-1 border-t border-stone-100 text-[11px]">
                      <span className="text-stone-500">Step #{sc.stepIndex + 1}</span>
                      <button
                        type="button"
                        onClick={() => triggerUpload('inline', idx)}
                        className="text-emerald-700 font-semibold hover:underline flex items-center gap-1"
                      >
                        <Upload className="w-3 h-3" />
                        Upload Custom
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Output Screenshots */}
          {currentExp.outputImages && currentExp.outputImages.length > 0 && (
            <div className="pt-3 border-t border-stone-200">
              <h4 className="text-xs font-bold text-stone-800 mb-2 uppercase tracking-wide">
                Output Screenshots ({currentExp.outputImages.length})
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {currentExp.outputImages.map((outImg, idx) => (
                  <div
                    key={`output-${idx}`}
                    className="border border-stone-200 rounded-lg overflow-hidden bg-stone-50 shadow-xs flex flex-col"
                  >
                    <div className="relative aspect-video bg-stone-900 group">
                      <img
                        src={outImg.imageUrl}
                        alt={outImg.caption || `Output screenshot`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => triggerUpload('output', idx)}
                          className="px-2.5 py-1.5 bg-white text-stone-900 rounded text-xs font-semibold shadow flex items-center gap-1 hover:bg-stone-100"
                        >
                          <Upload className="w-3 h-3" />
                          Replace Output
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRegenerateTallyScreen('output', idx)}
                          className="px-2.5 py-1.5 bg-emerald-700 text-white rounded text-xs font-semibold shadow flex items-center gap-1 hover:bg-emerald-800"
                        >
                          <RefreshCw className="w-3 h-3" />
                          Re-stamp
                        </button>
                      </div>
                    </div>
                    <div className="p-2.5 bg-white flex-1 flex flex-col justify-between border-t border-stone-200">
                      <p className="text-xs font-medium text-stone-800 line-clamp-2">{outImg.caption || outImg.title}</p>
                      <div className="mt-2 flex items-center justify-between pt-1 border-t border-stone-100 text-[11px]">
                        <span className="text-emerald-800 font-semibold">OUTPUT</span>
                        <button
                          type="button"
                          onClick={() => triggerUpload('output', idx)}
                          className="text-emerald-700 font-semibold hover:underline flex items-center gap-1"
                        >
                          <Upload className="w-3 h-3" />
                          Upload Custom
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: TEXT & STEPS */}
      {activeTab === 'text' && (
        <div className="space-y-4">
          {/* AIM */}
          <div className="p-3 bg-stone-50 border border-stone-200 rounded-lg">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-stone-800 uppercase tracking-wide">AIM</span>
              <button
                type="button"
                onClick={() => (editingAim ? handleSaveAim() : setEditingAim(true))}
                className="text-xs text-emerald-800 font-semibold hover:underline flex items-center gap-1"
              >
                {editingAim ? <Check className="w-3.5 h-3.5" /> : <Edit3 className="w-3.5 h-3.5" />}
                {editingAim ? 'Save Aim' : 'Edit Aim'}
              </button>
            </div>
            {editingAim ? (
              <textarea
                value={aimText}
                onChange={(e) => setAimText(e.target.value)}
                rows={2}
                className="w-full text-xs p-2 bg-white border border-stone-300 rounded focus:outline-none focus:ring-1 focus:ring-emerald-700 text-stone-900"
              />
            ) : (
              <p className="text-xs text-stone-700 leading-relaxed">{currentExp.aim}</p>
            )}
          </div>

          {/* PROCEDURE STEPS */}
          <div>
            <h4 className="text-xs font-bold text-stone-800 mb-2 uppercase tracking-wide">
              Procedure Steps ({currentExp.procedureSteps.length})
            </h4>
            <div className="space-y-2">
              {currentExp.procedureSteps.map((step, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs">
                  <span className="font-bold text-stone-500 w-12 shrink-0 pt-1.5 font-mono">
                    STEP {String(idx + 1).padStart(2, '0')}:
                  </span>
                  <input
                    type="text"
                    value={step}
                    onChange={(e) => handleStepTextChange(idx, e.target.value)}
                    className="flex-1 px-2.5 py-1.5 bg-stone-50 border border-stone-200 rounded text-xs text-stone-800 focus:bg-white focus:border-emerald-700 focus:outline-none"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* RESULT */}
          <div className="p-3 bg-stone-50 border border-stone-200 rounded-lg">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-stone-800 uppercase tracking-wide">RESULT</span>
              <button
                type="button"
                onClick={() => (editingResult ? handleSaveResult() : setEditingResult(true))}
                className="text-xs text-emerald-800 font-semibold hover:underline flex items-center gap-1"
              >
                {editingResult ? <Check className="w-3.5 h-3.5" /> : <Edit3 className="w-3.5 h-3.5" />}
                {editingResult ? 'Save Result' : 'Edit Result'}
              </button>
            </div>
            {editingResult ? (
              <textarea
                value={resultText}
                onChange={(e) => setResultText(e.target.value)}
                rows={2}
                className="w-full text-xs p-2 bg-white border border-stone-300 rounded focus:outline-none focus:ring-1 focus:ring-emerald-700 text-stone-900"
              />
            ) : (
              <p className="text-xs italic text-stone-700 leading-relaxed">{currentExp.result}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
