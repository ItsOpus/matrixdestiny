
import { LucideIcon } from 'lucide-react';

export type LanguageKey = 'vi';

export interface MatrixData {
  a: number;
  b: number;
  c: number;
  d: number;
  e: number;
  f: number;
  g: number;
  h: number;
  i: number;
  center: number;
  lifePathNumber: number;
}

export interface CompatibilityMatrix {
  center: number;
  purpose: number;
  harmony: number;
}

export interface PersonInputData {
  name: string;
  dob: string; // Date of birth as string e.g., "dd/mm/yyyy"
}

export interface PersonProcessedData {
  name: string;
  date: Date;
}

export interface PersonWithMatrix extends PersonProcessedData {
  matrix: MatrixData;
}

export interface PersonalGuideResponse {
  personality: string;
  destiny: string;
  talents: string;
  career: string;
  relationships: string;
  health: string;
}

export interface CompatibilityGuideResponse {
  overview: string;
  harmony: string;
  purpose: string;
}

export interface Topic {
  title: string;
  icon: LucideIcon;
}

export interface InterpretationMap {
  [key: number]: string;
}

export interface Translations {
  appName: string;
  welcome: string;
  personalDescription: string;
  compatDescription: string;
  nameLabel: string;
  dobLabel: string;
  p1NameLabel: string;
  p2NameLabel: string;
  p1DobLabel: string;
  p2DobLabel: string;
  calculate: string;
  calculateCompat: string;
  error: string;
  loadingGuide: string;
  loadingCompat: string;
  apiError: string;
  diagram: string;
  analysisTopics: string;
  compatTopics: string;
  personalTab: string;
  compatTab: string;
  topics: {
    [key: string]: Topic;
  };
  compatAnalysisTopics: {
    [key: string]: Topic;
  };
  interpretations: InterpretationMap;
  lifePathInterpretations: InterpretationMap;
}
