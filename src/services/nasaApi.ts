import type { ApodItem } from '../types/apod';

const BASE_URL = import.meta.env.VITE_BASE_URL || 'https://api.nasa.gov/planetary/apod';
const API_KEY = import.meta.env.VITE_NASA_API_KEY || 'DEMO_KEY';

// ดึงข้อมูลตามช่วงวันที่ start_date และ end_date
export async function getApodByDateRange(startDate: string, endDate: string): Promise<ApodItem[]> {
  const url = `${BASE_URL}?api_key=${API_KEY}&start_date=${startDate}&end_date=${endDate}`;
  const response = await fetch(url);

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.msg || `HTTP Error: ${response.status}`);
  }

  return (await response.json()) as ApodItem[];
}

// ดึงข้อมูลเฉพาะวันที่เจาะจง (สำหรับหน้า DetailView)
export async function getApodByDate(date: string): Promise<ApodItem> {
  const url = `${BASE_URL}?api_key=${API_KEY}&date=${date}`;
  const response = await fetch(url);

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.msg || `HTTP Error: ${response.status}`);
  }

  return (await response.json()) as ApodItem;
}
