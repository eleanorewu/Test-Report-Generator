
export enum DeviceEnvironment {
  IOS = 'iOS',
  ANDROID = 'Android',
  TABLET = 'Tablet',
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
  screenshotName: string | null;
  problemDescription: string;
  expectedImage: string | null;
  expectedImageName: string | null;
  actualMarkerBoxes: MarkerBox[];
  expectedMarkerBoxes: MarkerBox[];
  tags: string[];
}
