export interface StudentDetails {
  registerNumber: string;
  name: string;
  rollNumber: string;
  className: string;
  section: string;
  subjectName: string;
  institutionName?: string;
  academicYear?: string;
  defaultDate?: string;
}

export interface TableData {
  title?: string;
  columns: string[];
  rows: (string | number)[][];
}

export interface InlineScreenshot {
  stepIndex: number;
  imageUrl: string;
  caption?: string;
}

export interface OutputImage {
  id: string;
  title?: string;
  imageUrl: string;
  caption?: string;
}

export interface ExperimentData {
  id: number;
  exNo: string;
  date: string;
  title: string;
  aim: string;
  question?: string;
  tables?: TableData[];
  procedureSteps: string[];
  inlineScreenshots?: InlineScreenshot[];
  outputImages?: OutputImage[];
  result: string;
}

export interface DocumentState {
  student: StudentDetails;
  experiments: ExperimentData[];
  variationSeed: number;
}
