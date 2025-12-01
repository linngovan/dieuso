export type AppState = 'INTRO' | 'ANALYZING' | 'RESULT';

export enum LineType {
  Yin = 0,
  Yang = 1,
}

export interface NumerologyResponse {
  lifePathNumber: string; // Số chủ đạo
  rulingNumberMeaning: string; // Ý nghĩa số chủ đạo
  strengths: string;
  weaknesses: string;
  career: string;
  love: string;
  currentYearPrediction: string; // Dự báo năm hiện tại
  advice: string;
}

export interface DateOfBirth {
  day: string;
  month: string;
  year: string;
}