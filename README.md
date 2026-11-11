# 🚀 NASA Astronomy Picture of the Day (APOD) Viewer

เว็บแอปพลิเคชันสำหรับค้นหาและแสดงรายการภาพถ่ายดาราศาสตร์ประจำวันของ NASA (Astronomy Picture of the Day) โดยใช้ข้อมูลจาก **NASA Open APIs** พัฒนาด้วย **Vue 3**, **TypeScript**, **Vue Router** และ **Tailwind CSS**

---

## ✨ ฟีเจอร์หลัก (Features)

1. **ค้นหาตามช่วงวันที่ (`start_date` และ `end_date`) และตัวเลือกด่วน:**
   - รองรับการเลือกช่วงวันที่เริ่มต้นและวันที่สิ้นสุด พร้อมระบบตรวจสอบความถูกต้องของวันที่ (Validation) ป้องกันการเลือกวันที่ในอนาคตหรือวันเริ่มต้นมากกว่าวันสิ้นสุด
   - มีปุ่ม **Quick Filter** สำหรับกดดูข้อมูลย้อนหลัง **7 วัน**, **14 วัน**, และ **30 วันล่าสุด** ได้ทันที
2. **หน้าแสดงรายการ (List View - `/`) :**
   - แสดงการ์ดรายการในรูปแบบ Responsive Grid (3 คอลัมน์บนหน้าจอใหญ่) สไตล์ Modern Dark Space & Glassmorphism
   - มี **Skeleton Loading** แสดงสถานะระหว่างรอข้อมูลจาก API และรองรับสื่อทั้งรูปภาพ (`image`) และวิดีโอ (`video`)
3. **หน้าแสดงรายละเอียดเชิงลึก (Detail View - `/detail/:date`) :**
   - สามารถคลิกที่การ์ดรายการใด ๆ เพื่อเข้าสู่หน้ารายละเอียดแบบเต็มหน้าจอ
   - มีปุ่มสลับดูรูปภาพระหว่าง **ความละเอียดมาตรฐาน (`url`)** และ **ความละเอียดสูง (`hdurl`)** พร้อมปุ่มเปิดดูภาพต้นฉบับเต็มจอในแท็บใหม่
   - แสดงข้อมูลทั้งหมด (Metadata) ที่ได้รับจาก API ในรูปแบบตารางอย่างครบถ้วน (`title`, `date`, `explanation`, `copyright`, `media_type`, `service_version`, `url`, `hdurl`)
   - ใช้ `sessionStorage` ช่วยแคชข้อมูลชั่วคราว ลดการยิง API ซ้ำเมื่อเปิดดูรายละเอียด

---

## 🛠️ เทคโนโลยีที่ใช้ (Tech Stack)

- **Framework:** Vue 3 (Composition API + `<script setup>`)
- **Language:** TypeScript
- **Routing:** Vue Router 4
- **Styling:** Tailwind CSS v4 (`@tailwindcss/vite`)
- **Build Tool:** Vite
- **API:** [NASA APOD API](https://nasa.gov)

---

## 📁 โครงสร้างโปรเจกต์ (Project Structure)

```text
src/
├── types/
│   └── apod.ts          # กำหนด Type และ Interface ของข้อมูลจาก NASA API
├── services/
│   └── nasaApi.ts       # จัดการการเชื่อมต่อและดึงข้อมูลจาก NASA APOD API
├── router/
│   └── index.ts         # ตั้งค่าเส้นทางการเปลี่ยนหน้า (Routes)
├── views/
│   ├── HomeView.vue     # หน้าหลัก: ฟอร์มเลือกช่วงวันที่ ปุ่มเลือกด่วน และแสดงการ์ดรายการ
│   └── DetailView.vue   # หน้ารายละเอียด: สลับดูภาพ Standard/HD และตารางข้อมูลทั้งหมด
├── App.vue              # โครงสร้างหลักและพื้นหลังของแอปพลิเคชัน
├── style.css            # ไฟล์นำเข้า Tailwind CSS
└── main.ts              # จุดเริ่มต้นการทำงานของ Vue 3
```

---

## 🚀 วิธีการติดตั้งและรันโปรเจกต์ (Getting Started)

### 1. โคลนโปรเจกต์และติดตั้ง Dependencies
```bash
git clone 
cd nasa-apod-vue3
npm install
```

### 2. ตั้งค่า Environment Variables
สร้างไฟล์ `.env` ไว้ที่ระดับนอกสุดของโปรเจกต์ (ระดับเดียวกับ `package.json`) และกำหนดค่าดังนี้:
```env
VITE_NASA_API_KEY=DEMO_KEY
VITE_BASE_URL=https://nasa.govplanetary/apod
```
> **หมายเหตุ:** สามารถสมัครรับ API Key ส่วนตัวได้ฟรีที่ [NASA Open APIs](https://nasa.gov) เพื่อนำมาแทนที่ `DEMO_KEY` และหลีกเลี่ยงข้อจำกัดโควต้าการเรียกใช้งานต่อชั่วโมง (Rate Limit)

### 3. รันเซิร์ฟเวอร์สำหรับพัฒนา (Development Server)
```bash
npm run dev
```
จากนั้นเปิดเบราว์เซอร์ไปที่ `http://localhost:5173`

### 4. Build สำหรับ Production
```bash
npm run build
```

---

## 📌 หมายเหตุเกี่ยวกับข้อมูลจากต้นทาง (Known API Behavior)

- ปัจจุบันฝั่งเซิร์ฟเวอร์ของ NASA APOD API (`api.nasa.gov`) มีการเปลี่ยนแปลงโครงสร้างหน้าเว็บต้นทาง (`science.nasa.gov`) ทำให้ในบางช่วงเวลาค่า `url`, `hdurl` และ `title` ที่ API ตอบกลับมาอาจเป็นภาพโลโก้ NASA และข้อความมาตรฐานของเว็บไซต์แทนภาพดาราศาสตร์จริงของวันนั้น ๆ
- แอปพลิเคชันนี้ถูกออกแบบให้แสดงผลตามข้อมูลจริงที่ได้รับจาก API ทุกประการ พร้อมรองรับการแสดงผลทั้ง `url` และ `hdurl` ตามโครงสร้าง JSON มาตรฐานของ NASA อย่างครบถ้วน
