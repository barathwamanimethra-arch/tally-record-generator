import React, { useEffect, useState } from 'react';
import { ExperimentData, StudentDetails } from '../types';
import { generateQRCodeDataUrl } from '../utils/qrCodeGenerator';

interface Props {
  student: StudentDetails;
  experiments: ExperimentData[];
  selectedExpId?: number | 'all';
  qrMode?: 'text' | 'url';
}

export const DocumentMasterView: React.FC<Props> = ({
  student,
  experiments,
  selectedExpId = 'all',
  qrMode = 'text',
}) => {
  const regNo = student.registerNumber.trim() || '2513101040136';
  const [coverQrCodeUrl, setCoverQrCodeUrl] = useState<string>('');

  useEffect(() => {
    let isMounted = true;
    generateQRCodeDataUrl(student, qrMode).then((url) => {
      if (isMounted) setCoverQrCodeUrl(url);
    });
    return () => {
      isMounted = false;
    };
  }, [student, qrMode]);

  const displayedExperiments =
    selectedExpId === 'all'
      ? experiments
      : experiments.filter((e) => e.id === selectedExpId);

  // Total pages in complete book: Cover (1) + Index (1) + (7 * 3 = 21) = 23 pages
  const totalBookPages = 23;
  const singleExpTotalPages = 3;

  return (
    <div id="document-printable-area" className="w-full flex flex-col items-center space-y-8 print:space-y-0">
      {/* ----------------------------------------------------
          COVER PAGE (Shown if viewing all)
          ---------------------------------------------------- */}
      {selectedExpId === 'all' && (
        <div className="a4-page-container bg-white text-black shadow-xl print:shadow-none print:m-0 print:border-none w-[210mm] min-h-[297mm] p-[10mm] box-border relative flex flex-col justify-between break-after-page">
          {/* Classic Double Border Box */}
          <div className="w-full h-full min-h-[277mm] border-[3px] border-black p-1 flex flex-col justify-between box-border">
            <div className="w-full h-full min-h-[273mm] border border-black p-6 flex flex-col justify-between box-border relative">
              
              {/* Top Header Register Number */}
              <div className="w-full flex justify-between items-center text-xs font-mono border-b border-stone-200 pb-1.5">
                <span className="font-serif text-stone-500 italic">Practical Record Verification System</span>
                <span className="font-bold tracking-wider text-black">REG NO: {regNo}</span>
              </div>

              {/* Center Main Titles */}
              <div className="text-center my-auto space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl sm:text-4xl font-extrabold tracking-wide font-serif text-black uppercase">
                    TALLY.ERP 9
                  </h1>
                  <h2 className="text-xl sm:text-2xl font-bold tracking-widest font-serif text-stone-800 uppercase">
                    PRACTICAL RECORD BOOK
                  </h2>
                </div>

                {/* Decorative rule */}
                <div className="w-24 h-0.5 bg-black mx-auto my-2" />

                {/* Student Credentials Badge Box */}
                <div className="max-w-md mx-auto p-4 sm:p-5 border-2 border-stone-800 bg-stone-50/50 rounded-lg text-left space-y-2.5 font-serif">
                  <div className="text-center pb-2 border-b border-stone-300">
                    <span className="text-[10px] uppercase tracking-widest text-stone-500 font-sans block">
                      Student Register Number
                    </span>
                    <span className="text-xl font-bold font-mono text-black">
                      {regNo}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-1.5 text-xs pt-1">
                    <span className="font-bold text-stone-700">Student Name:</span>
                    <span className="col-span-2 font-semibold text-black uppercase">{student.name || 'BARATHWAMANIMETHRA S'}</span>

                    <span className="font-bold text-stone-700">Roll Number:</span>
                    <span className="col-span-2 font-mono text-black">{student.rollNumber || '23UAC045'}</span>

                    <span className="font-bold text-stone-700">Class & Sec:</span>
                    <span className="col-span-2 text-black">{student.className || 'III B.Com (CA)'} — {student.section || 'Sec A'}</span>

                    <span className="font-bold text-stone-700">Department:</span>
                    <span className="col-span-2 text-black">{student.institutionName || 'Commerce & Computer Applications'}</span>

                    <span className="font-bold text-stone-700">Academic Year:</span>
                    <span className="col-span-2 text-black">{student.academicYear || '2025 - 2026'}</span>
                  </div>
                </div>

                {/* Unique Record Verification QR Code Box on Cover Page */}
                <div className="max-w-md mx-auto p-3.5 border-2 border-stone-800 bg-white rounded-lg flex items-center gap-4 text-left shadow-xs">
                  <div className="p-1 bg-white border border-stone-300 rounded shrink-0">
                    {coverQrCodeUrl ? (
                      <img
                        src={coverQrCodeUrl}
                        alt="Record Verification QR Code"
                        className="w-20 h-20 sm:w-22 sm:h-22 object-contain"
                      />
                    ) : (
                      <div className="w-20 h-20 bg-stone-100 flex items-center justify-center text-[10px] text-stone-400 font-mono">
                        Generating QR...
                      </div>
                    )}
                  </div>
                  <div className="space-y-1 font-serif flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="inline-block w-2 h-2 rounded-full bg-emerald-700"></span>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-black font-sans">
                        Record Verification QR
                      </span>
                    </div>
                    <p className="text-[10px] text-stone-600 font-sans leading-tight">
                      Scan with any smartphone camera to verify student credentials, roll number, and certified lab submission.
                    </p>
                    <div className="pt-0.5 flex items-center gap-2">
                      <span className="text-[9px] font-mono font-bold text-stone-900 bg-stone-100 px-1.5 py-0.5 rounded border border-stone-300">
                        ID: VER-T9-{regNo.slice(-4) || '1040'}-{(student.rollNumber || '045').slice(-3)}
                      </span>
                      <span className="text-[9px] font-sans text-emerald-800 font-semibold">
                        Certified Lab Copy
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-3">
                  <p className="text-xs sm:text-sm font-serif font-medium text-stone-800 uppercase tracking-wider">
                    Subject: {student.subjectName || 'Computerized Accounting (Tally.ERP 9)'}
                  </p>
                </div>
              </div>

              {/* Bottom Running Footer with Page Number */}
              <div className="w-full flex items-center justify-between text-xs font-serif text-stone-600 border-t border-stone-300 pt-2">
                <span className="text-[10px] uppercase tracking-wider text-stone-500 font-sans">
                  Tally ERP. 9 Practical Record Book
                </span>
                <span className="font-mono text-[11px] font-bold text-stone-700">
                  Reg No: {regNo}
                </span>
                <span className="font-serif font-bold text-stone-900">
                  Page 1 of {totalBookPages}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ----------------------------------------------------
          INDEX PAGE (Shown if viewing all)
          ---------------------------------------------------- */}
      {selectedExpId === 'all' && (
        <div className="a4-page-container bg-white text-black shadow-xl print:shadow-none print:m-0 print:border-none w-[210mm] min-h-[297mm] p-[10mm] box-border relative flex flex-col justify-between break-after-page">
          <div className="w-full h-full min-h-[277mm] border-[3px] border-black p-1 flex flex-col justify-between box-border">
            <div className="w-full h-full min-h-[273mm] border border-black p-6 sm:p-8 flex flex-col justify-between box-border relative">
              
              {/* Top Header Register Number */}
              <div className="w-full flex justify-between items-center text-xs font-mono border-b border-stone-200 pb-1.5">
                <span className="font-serif text-stone-500 italic">Practical Record Index Sheet</span>
                <span className="font-bold tracking-wider text-black">REG NO: {regNo}</span>
              </div>

              <div className="space-y-5 my-auto">
                <h2 className="text-center text-2xl font-bold font-serif tracking-widest uppercase mt-2">
                  INDEX
                </h2>

                {/* Master Index Table with Dark Forest Green Header matching PDF */}
                <table className="w-full border-collapse border border-stone-800 text-xs sm:text-sm font-serif">
                  <thead>
                    <tr className="bg-[#1e422f] text-white">
                      <th className="border border-stone-800 py-2.5 px-3 text-center w-16 font-bold">
                        Ex. No.
                      </th>
                      <th className="border border-stone-800 py-2.5 px-4 text-left font-bold">
                        Title of the Experiment
                      </th>
                      <th className="border border-stone-800 py-2.5 px-3 text-center w-24 font-bold">
                        Date
                      </th>
                      <th className="border border-stone-800 py-2.5 px-3 text-center w-20 font-bold">
                        Page No.
                      </th>
                      <th className="border border-stone-800 py-2.5 px-3 text-center w-24 font-bold">
                        Staff Sign
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {experiments.map((exp, idx) => (
                      <tr key={exp.id} className="border-b border-stone-800 hover:bg-stone-50">
                        <td className="border border-stone-800 py-3.5 px-3 text-center font-bold font-mono">
                          {exp.id}
                        </td>
                        <td className="border border-stone-800 py-3.5 px-4 text-left font-medium">
                          {exp.title
                            .toLowerCase()
                            .split(' ')
                            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                            .join(' ')}
                        </td>
                        <td className="border border-stone-800 py-3.5 px-3 text-center text-xs font-mono text-stone-600">
                          {exp.date}
                        </td>
                        <td className="border border-stone-800 py-3.5 px-3 text-center font-mono font-bold text-stone-900">
                          {idx * 3 + 3}
                        </td>
                        <td className="border border-stone-800 py-3.5 px-3 text-center"></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Bottom Running Footer with Page Number */}
              <div className="w-full flex items-center justify-between text-xs font-serif text-stone-600 border-t border-stone-300 pt-2">
                <span className="text-[10px] uppercase tracking-wider text-stone-500 font-sans">
                  Tally ERP. 9 Practical Record Book
                </span>
                <span className="font-mono text-[11px] font-bold text-stone-700">
                  Reg No: {regNo}
                </span>
                <span className="font-serif font-bold text-stone-900">
                  Page 2 of {totalBookPages}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ----------------------------------------------------
          EXPERIMENTS 1 TO 7 (Detailed Pages)
          ---------------------------------------------------- */}
      {displayedExperiments.map((exp) => {
        // Correct 3-page sequential sequence starting after Cover (1) and Index (2)
        const isAll = selectedExpId === 'all';
        const startPage = isAll ? (exp.id - 1) * 3 + 3 : 1;
        const totalExpPages = isAll ? totalBookPages : singleExpTotalPages;

        return (
          <React.Fragment key={exp.id}>
            {/* ----------------- PAGE 1 OF EXPERIMENT: AIM, QUESTION & PROCEDURE ----------------- */}
            <div className="a4-page-container bg-white text-black shadow-xl print:shadow-none print:m-0 print:border-none w-[210mm] min-h-[297mm] p-[10mm] box-border relative flex flex-col justify-between break-after-page">
              <div className="w-full h-full min-h-[277mm] border-[3px] border-black p-1 flex flex-col justify-between box-border">
                <div className="w-full h-full min-h-[273mm] border border-black p-6 sm:p-8 flex flex-col justify-between box-border relative space-y-3">
                  
                  {/* Header: Register Number */}
                  <div className="w-full flex justify-between items-center text-xs font-mono border-b border-stone-200 pb-1.5">
                    <span className="font-serif text-stone-500 italic">Department of Computer Applications</span>
                    <span className="font-bold tracking-wider text-black">REG NO: {regNo}</span>
                  </div>

                  <div className="space-y-3.5 flex-1">
                    {/* Experiment Meta Header */}
                    <div className="flex justify-between items-center text-xs sm:text-sm font-bold font-serif border-b border-black pb-1">
                      <span>EX NO: {exp.exNo}</span>
                      <span>DATE: {exp.date}</span>
                    </div>

                    {/* Experiment Title */}
                    <h2 className="text-center text-base sm:text-lg font-extrabold font-serif tracking-wider uppercase pt-0.5 text-black">
                      {exp.title}
                    </h2>

                    {/* AIM */}
                    <div className="space-y-0.5 pt-0.5">
                      <span className="font-bold font-serif text-xs sm:text-sm block">AIM:</span>
                      <p className="text-xs sm:text-sm font-serif leading-relaxed text-stone-900 pl-2">
                        {exp.aim}
                      </p>
                    </div>

                    {/* QUESTION / PROBLEM STATEMENT (if present) */}
                    {exp.question && (
                      <div className="space-y-0.5">
                        <span className="font-bold font-serif text-xs sm:text-sm block">QUESTION:</span>
                        <div className="text-[11px] sm:text-xs font-serif leading-relaxed text-stone-900 pl-2 whitespace-pre-line bg-stone-50 p-2 border border-stone-200 rounded">
                          {exp.question}
                        </div>
                      </div>
                    )}

                    {/* TABLES (e.g. Ledgers, Stock Items, Vouchers, Payroll) */}
                    {exp.tables && exp.tables.length > 0 && (
                      <div className="space-y-2 pt-0.5">
                        {exp.tables.map((table, tIdx) => (
                          <div key={tIdx} className="space-y-1">
                            {table.title && (
                              <span className="font-semibold font-serif text-[11px] text-stone-800 block">
                                {table.title}:
                              </span>
                            )}
                            <table className="w-full border-collapse border border-stone-800 text-[11px] font-serif">
                              <thead>
                                <tr className="bg-[#1e422f] text-white">
                                  {table.columns.map((col, cIdx) => (
                                    <th key={cIdx} className="border border-stone-800 py-1 px-2 text-left font-bold">
                                      {col}
                                    </th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {table.rows.map((row, rIdx) => (
                                  <tr key={rIdx} className="border-b border-stone-800">
                                    {row.map((cell, cIdx) => (
                                      <td key={cIdx} className="border border-stone-800 py-1 px-2">
                                        {cell}
                                      </td>
                                    ))}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* PROCEDURE STEPS */}
                    <div className="space-y-1 pt-0.5">
                      <span className="font-bold font-serif text-xs sm:text-sm block">PROCEDURE:</span>
                      <div className="space-y-1 pl-2 text-[11px] sm:text-xs font-serif leading-relaxed">
                        {exp.procedureSteps.slice(0, 4).map((step, sIdx) => (
                          <p key={sIdx}>
                            <strong className="font-bold">STEP {String(sIdx + 1).padStart(2, '0')}:</strong> {step}
                          </p>
                        ))}
                      </div>
                    </div>

                    {/* First inline screenshot */}
                    {exp.inlineScreenshots && exp.inlineScreenshots[0] && (
                      <div className="mt-2 border border-stone-700 rounded overflow-hidden shadow-xs">
                        <img
                          src={exp.inlineScreenshots[0].imageUrl}
                          alt={exp.inlineScreenshots[0].caption || 'Step screenshot'}
                          className="w-full h-auto max-h-[70mm] object-contain mx-auto bg-stone-900"
                        />
                      </div>
                    )}
                  </div>

                  {/* Bottom Running Footer with Page Number */}
                  <div className="w-full flex items-center justify-between text-xs font-serif text-stone-600 border-t border-stone-300 pt-2">
                    <span className="text-[10px] uppercase tracking-wider text-stone-500 font-sans">
                      Computerized Accounting (Tally.ERP 9)
                    </span>
                    <span className="font-mono text-[11px] font-bold text-stone-700">
                      Reg No: {regNo}
                    </span>
                    <span className="font-serif font-bold text-stone-900">
                      Page {startPage} of {totalExpPages}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* ----------------- PAGE 2 OF EXPERIMENT: REMAINING STEPS & SCREENSHOTS ----------------- */}
            <div className="a4-page-container bg-white text-black shadow-xl print:shadow-none print:m-0 print:border-none w-[210mm] min-h-[297mm] p-[10mm] box-border relative flex flex-col justify-between break-after-page">
              <div className="w-full h-full min-h-[277mm] border-[3px] border-black p-1 flex flex-col justify-between box-border">
                <div className="w-full h-full min-h-[273mm] border border-black p-6 sm:p-8 flex flex-col justify-between box-border relative space-y-3">
                  
                  {/* Header: Register Number */}
                  <div className="w-full flex justify-between items-center text-xs font-mono border-b border-stone-200 pb-1.5">
                    <span className="font-serif text-stone-500 italic">Department of Computer Applications</span>
                    <span className="font-bold tracking-wider text-black">REG NO: {regNo}</span>
                  </div>

                  <div className="space-y-3 flex-1">
                    <div className="flex justify-between items-center text-xs font-bold font-serif border-b border-stone-300 pb-1">
                      <span>EX NO: {exp.exNo} (Continued)</span>
                      <span className="text-stone-600 font-normal">Procedure &amp; Verification</span>
                    </div>

                    {/* Remaining procedure steps */}
                    {exp.procedureSteps.length > 4 && (
                      <div className="space-y-1 text-[11px] sm:text-xs font-serif leading-relaxed">
                        {exp.procedureSteps.slice(4).map((step, sIdx) => (
                          <p key={sIdx + 4}>
                            <strong className="font-bold">STEP {String(sIdx + 5).padStart(2, '0')}:</strong> {step}
                          </p>
                        ))}
                      </div>
                    )}

                    {/* Secondary inline screenshots */}
                    {exp.inlineScreenshots && exp.inlineScreenshots.slice(1).map((sc, scIdx) => (
                      <div key={scIdx} className="space-y-1">
                        <div className="border border-stone-700 rounded overflow-hidden shadow-xs">
                          <img
                            src={sc.imageUrl}
                            alt={sc.caption || `Screenshot ${scIdx + 2}`}
                            className="w-full h-auto max-h-[72mm] object-contain mx-auto bg-stone-900"
                          />
                        </div>
                        {sc.caption && (
                          <p className="text-[10px] text-stone-600 font-serif italic text-center">
                            {sc.caption}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Bottom Running Footer with Page Number */}
                  <div className="w-full flex items-center justify-between text-xs font-serif text-stone-600 border-t border-stone-300 pt-2">
                    <span className="text-[10px] uppercase tracking-wider text-stone-500 font-sans">
                      Computerized Accounting (Tally.ERP 9)
                    </span>
                    <span className="font-mono text-[11px] font-bold text-stone-700">
                      Reg No: {regNo}
                    </span>
                    <span className="font-serif font-bold text-stone-900">
                      Page {startPage + 1} of {totalExpPages}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* ----------------- PAGE 3 OF EXPERIMENT: OUTPUT & RESULT ----------------- */}
            <div className="a4-page-container bg-white text-black shadow-xl print:shadow-none print:m-0 print:border-none w-[210mm] min-h-[297mm] p-[10mm] box-border relative flex flex-col justify-between break-after-page">
              <div className="w-full h-full min-h-[277mm] border-[3px] border-black p-1 flex flex-col justify-between box-border">
                <div className="w-full h-full min-h-[273mm] border border-black p-6 sm:p-8 flex flex-col justify-between box-border relative space-y-3">
                  
                  {/* Header: Register Number */}
                  <div className="w-full flex justify-between items-center text-xs font-mono border-b border-stone-200 pb-1.5">
                    <span className="font-serif text-stone-500 italic">Department of Computer Applications</span>
                    <span className="font-bold tracking-wider text-black">REG NO: {regNo}</span>
                  </div>

                  <div className="space-y-3 flex-1">
                    <div className="flex justify-between items-center text-xs font-bold font-serif border-b border-stone-300 pb-1">
                      <span>EX NO: {exp.exNo}</span>
                      <span className="uppercase text-stone-800 font-bold">OUTPUT &amp; RESULT</span>
                    </div>

                    <h3 className="text-xs sm:text-sm font-bold font-serif tracking-wider uppercase text-black">
                      OUTPUT:
                    </h3>

                    {/* Output Screenshots */}
                    {exp.outputImages && exp.outputImages.length > 0 ? (
                      exp.outputImages.map((out, oIdx) => (
                        <div key={oIdx} className="space-y-1">
                          <div className="border border-stone-800 rounded overflow-hidden shadow-sm">
                            <img
                              src={out.imageUrl}
                              alt={out.caption || 'Output'}
                              className="w-full h-auto max-h-[90mm] object-contain mx-auto bg-stone-900"
                            />
                          </div>
                          {out.caption && (
                            <p className="text-[11px] text-stone-700 font-serif italic text-center">
                              {out.caption}
                            </p>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="border border-dashed border-stone-400 p-8 text-center text-xs font-serif text-stone-500">
                        Screenshot output verified in Tally ERP.9
                      </div>
                    )}

                    {/* RESULT BOX */}
                    <div className="pt-2 space-y-1">
                      <span className="font-bold font-serif text-xs sm:text-sm block uppercase tracking-wide">
                        RESULT:
                      </span>
                      <div className="p-3 border border-stone-800 bg-stone-50 text-[11px] sm:text-xs font-serif italic leading-relaxed text-stone-900 rounded">
                        {exp.result}
                      </div>
                    </div>
                  </div>

                  {/* Bottom Running Footer with Page Number */}
                  <div className="w-full flex items-center justify-between text-xs font-serif text-stone-600 border-t border-stone-300 pt-2">
                    <span className="text-[10px] uppercase tracking-wider text-stone-500 font-sans">
                      Computerized Accounting (Tally.ERP 9)
                    </span>
                    <span className="font-mono text-[11px] font-bold text-stone-700">
                      Reg No: {regNo}
                    </span>
                    <span className="font-serif font-bold text-stone-900">
                      Page {startPage + 2} of {totalExpPages}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
};

