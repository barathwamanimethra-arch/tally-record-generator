import React, { useEffect, useState } from 'react';
import { StudentDetails } from '../types';
import { generateQRCodeDataUrl, generateVerificationPayload, formatQRText } from '../utils/qrCodeGenerator';
import { QrCode, CheckCircle, ShieldCheck, X, Copy, Download, ExternalLink } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  student: StudentDetails;
  qrMode: 'text' | 'url';
  onChangeQrMode: (mode: 'text' | 'url') => void;
}

export const StudentRecordQRModal: React.FC<Props> = ({
  isOpen,
  onClose,
  student,
  qrMode,
  onChangeQrMode,
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    if (!isOpen) return;
    let isMounted = true;
    generateQRCodeDataUrl(student, qrMode).then((url) => {
      if (isMounted) setQrDataUrl(url);
    });
    return () => {
      isMounted = false;
    };
  }, [student, qrMode, isOpen]);

  if (!isOpen) return null;

  const payload = generateVerificationPayload(student);
  const formattedText = formatQRText(payload);

  const handleCopyText = () => {
    navigator.clipboard.writeText(formattedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadQr = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `QR_Verification_${student.registerNumber || 'Record'}.png`;
    a.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-stone-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 px-6 border-b border-stone-100 bg-stone-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-800 text-white flex items-center justify-center">
              <QrCode className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900">Record Verification QR Code</h3>
              <p className="text-xs text-stone-500">Embedded automatically on the Document Cover Page</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* QR and Security ID */}
          <div className="flex flex-col sm:flex-row items-center gap-5 p-4 bg-stone-50 rounded-xl border border-stone-200">
            <div className="p-2 bg-white rounded-xl shadow-xs border border-stone-300 shrink-0">
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt="Student Record QR Code"
                  className="w-36 h-36 object-contain"
                />
              ) : (
                <div className="w-36 h-36 flex items-center justify-center text-xs text-stone-400">
                  Generating QR...
                </div>
              )}
            </div>

            <div className="space-y-2 text-center sm:text-left flex-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified Student Credential
              </div>
              <div>
                <h4 className="font-bold text-stone-900 text-sm">{payload.studentName}</h4>
                <p className="text-xs font-mono text-stone-600">Reg No: {payload.registerNumber}</p>
                <p className="text-xs text-stone-600">{payload.className} — {payload.section}</p>
              </div>
              <div className="pt-1">
                <span className="text-[10px] font-mono text-stone-500 bg-stone-200 px-2 py-0.5 rounded">
                  Security Code: {payload.verificationCode}
                </span>
              </div>
            </div>
          </div>

          {/* Mode Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-stone-700 block">QR Format Mode</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onChangeQrMode('text')}
                className={`px-3 py-2 text-xs font-semibold rounded-lg border text-left transition-all ${
                  qrMode === 'text'
                    ? 'border-emerald-700 bg-emerald-50/70 text-emerald-900 ring-1 ring-emerald-700'
                    : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                }`}
              >
                <div className="font-bold">Official Summary Text</div>
                <div className="text-[10px] text-stone-500 font-normal">Shows verified record details immediately when scanned</div>
              </button>

              <button
                type="button"
                onClick={() => onChangeQrMode('url')}
                className={`px-3 py-2 text-xs font-semibold rounded-lg border text-left transition-all ${
                  qrMode === 'url'
                    ? 'border-emerald-700 bg-emerald-50/70 text-emerald-900 ring-1 ring-emerald-700'
                    : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                }`}
              >
                <div className="font-bold">Web Verification Link</div>
                <div className="text-[10px] text-stone-500 font-normal">Opens online certificate viewer with digital seal</div>
              </button>
            </div>
          </div>

          {/* Verification Text Preview */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-stone-700">Encoded Verification Data:</span>
              <button
                type="button"
                onClick={handleCopyText}
                className="inline-flex items-center gap-1 text-[11px] text-emerald-800 font-medium hover:underline"
              >
                {copied ? (
                  <>
                    <CheckCircle className="w-3 h-3 text-emerald-600" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    Copy Payload
                  </>
                )}
              </button>
            </div>
            <pre className="text-[10px] font-mono bg-stone-900 text-stone-200 p-3 rounded-lg overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-32 border border-stone-800">
              {formattedText}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 px-6 border-t border-stone-100 bg-stone-50 flex items-center justify-between gap-3">
          <p className="text-[11px] text-stone-500">
            This QR code is already positioned on the cover page of your printout.
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDownloadQr}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-stone-800 bg-white border border-stone-300 rounded-lg hover:bg-stone-100 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Download PNG
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 text-xs font-semibold text-white bg-stone-800 hover:bg-stone-900 rounded-lg transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
