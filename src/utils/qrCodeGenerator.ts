import QRCode from 'qrcode';
import { StudentDetails } from '../types';

export interface RecordVerificationPayload {
  recordTitle: string;
  registerNumber: string;
  studentName: string;
  rollNumber: string;
  className: string;
  section: string;
  subject: string;
  institution: string;
  academicYear: string;
  verificationCode: string;
  timestamp: string;
}

/**
 * Generate verification payload for a student's practical record book
 */
export function generateVerificationPayload(student: StudentDetails): RecordVerificationPayload {
  const reg = (student.registerNumber || '2513101040136').trim();
  const roll = (student.rollNumber || '23UAC045').trim();
  const year = (student.academicYear || '2025-2026').replace(/\s+/g, '');
  
  return {
    recordTitle: 'TALLY ERP. 9 PRACTICAL RECORD BOOK',
    registerNumber: reg,
    studentName: (student.name || 'BARATHWAMANIMETHRA S').trim().toUpperCase(),
    rollNumber: roll,
    className: student.className || 'III B.Com (CA)',
    section: student.section || 'Sec A',
    subject: student.subjectName || 'Computerized Accounting (Tally.ERP 9)',
    institution: student.institutionName || 'Department of Commerce & Computer Applications',
    academicYear: student.academicYear || '2025 - 2026',
    verificationCode: `VER-T9-${reg.slice(-4)}-${roll.slice(-3)}`,
    timestamp: new Date().toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }),
  };
}

/**
 * Generate human-readable text encoded into the QR code
 * When scanned by any smartphone camera, it formats as a clean verification sheet.
 */
export function formatQRText(payload: RecordVerificationPayload): string {
  return [
    `🎓 TALLY ERP.9 PRACTICAL RECORD BOOK`,
    `------------------------------------`,
    `Student: ${payload.studentName}`,
    `Reg. No: ${payload.registerNumber}`,
    `Roll No: ${payload.rollNumber}`,
    `Class: ${payload.className} (${payload.section})`,
    `Subject: ${payload.subject}`,
    `Academic Year: ${payload.academicYear}`,
    `Institution: ${payload.institution}`,
    `Security Code: ${payload.verificationCode}`,
    `Date Verified: ${payload.timestamp}`,
    `Status: OFFICIALLY CERTIFIED LAB RECORD`,
  ].join('\n');
}

/**
 * Generate QR Code data URL (PNG) for printing on document cover page
 */
export async function generateQRCodeDataUrl(
  student: StudentDetails,
  mode: 'text' | 'url' | string = 'text'
): Promise<string> {
  const payload = generateVerificationPayload(student);
  
  let encodedContent = '';
  if (mode === 'url') {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://ais-dev-5g7sqe6l27pcyxwv6eeouc-810160081928.asia-southeast1.run.app';
    encodedContent = `${origin}/?verify=1&reg=${encodeURIComponent(payload.registerNumber)}&name=${encodeURIComponent(payload.studentName)}&code=${encodeURIComponent(payload.verificationCode)}`;
  } else {
    encodedContent = formatQRText(payload);
  }

  try {
    const dataUrl = await QRCode.toDataURL(encodedContent, {
      errorCorrectionLevel: 'M',
      margin: 1,
      width: 260,
      color: {
        dark: '#142a1e', // Dark forest emerald green for classical record book theme
        light: '#ffffff',
      },
    });
    return dataUrl;
  } catch (err) {
    console.error('Failed to generate QR Code:', err);
    return '';
  }
}
