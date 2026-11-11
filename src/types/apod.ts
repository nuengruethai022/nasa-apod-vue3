export interface ApodItem {
  date: string;
  title: string;
  explanation: string;
  media_type: 'image' | 'video' | string;
  url: string;
  hdurl?: string;
  copyright?: string;
  service_version?: string;
  [key: string]: string | undefined; 
}

export interface MonthOption {
  value: number;
  label: string;
}
