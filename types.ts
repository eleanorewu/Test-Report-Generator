
export enum DeviceEnvironment {
  IOS = 'iOS',
  ANDROID = 'Android',
  WEB = 'Web',
  OTHER = 'Other'
}

export interface MarkerBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ReportData {
  environment: string;
  testDate: string;
  screenshot: string | null;
  problemDescription: string;
  expectedResultType: 'text' | 'image';
  expectedText: string;
  expectedImage: string | null;
  markerBox: MarkerBox | null;
  tags: string[];
}
