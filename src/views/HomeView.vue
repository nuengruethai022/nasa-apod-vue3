<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getApodByDateRange } from '../services/nasaApi';
import type { ApodItem } from '../types/apod';

const router = useRouter();

const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const today = new Date();
const maxDate = formatDate(today);
const minDate = '1995-06-16';

const getPastDate = (days: number): string => {
  const past = new Date();
  past.setDate(today.getDate() - days);
  return formatDate(past);
};

const startDate = ref<string>(getPastDate(7));
const endDate = ref<string>(maxDate);

const apodList = ref<ApodItem[]>([]);
const isLoading = ref<boolean>(false);
const errorMessage = ref<string>('');

const setQuickRange = (days: number): void => {
  endDate.value = maxDate;
  startDate.value = getPastDate(days);
  fetchData();
};

const fetchData = async (): Promise<void> => {
  if (!startDate.value || !endDate.value) {
    errorMessage.value = 'กรุณาเลือกวันที่เริ่มต้นและวันที่สิ้นสุดให้ครบถ้วน';
    return;
  }

  if (startDate.value > endDate.value) {
    errorMessage.value = 'วันที่เริ่มต้น (Start Date) ต้องมาก่อนหรือเท่ากับวันที่สิ้นสุด (End Date)';
    return;
  }

  isLoading.value = true;
  errorMessage.value = '';
  apodList.value = [];

  try {
    const data = await getApodByDateRange(startDate.value, endDate.value);
    // เรียงจากวันล่าสุดขึ้นก่อน
    apodList.value = data.reverse();
  } catch (err) {
    errorMessage.value = err instanceof Error ? err.message : 'ไม่สามารถดึงข้อมูลจาก NASA ได้';
  } finally {
    isLoading.value = false;
  }
};

const goToDetail = (item: ApodItem): void => {
  sessionStorage.setItem(`apod_${item.date}`, JSON.stringify(item));
  router.push({ name: 'detail', params: { date: item.date } });
};

onMounted(() => {
  fetchData();
});
</script>

<template>
  <div>
    <!-- Hero Header -->
    <header class="text-center max-w-3xl mx-auto mb-10">
      <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-semibold tracking-wide uppercase mb-4">
        <span>🌌</span> NASA Open APIs Explorer
      </div>
      <h1 class="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-cyan-100 to-blue-400 bg-clip-text text-transparent mb-4">
        Astronomy Picture of the Day
      </h1>
      <p class="text-slate-400 text-base sm:text-lg">
        สำรวจภาพถ่ายและเรื่องราวดาราศาสตร์สุดมหัศจรรย์จากฐานข้อมูลของ NASA ตามช่วงเวลาที่คุณต้องการ
      </p>
    </header>

    <!-- Search & Filter Glass Card -->
    <section class="bg-slate-900/60 backdrop-blur-xl p-6 rounded-2xl border border-slate-800/80 shadow-2xl mb-10">
      <div class="flex flex-col lg:flex-row items-stretch lg:items-end justify-between gap-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-grow">
          <!-- Start Date -->
          <div class="flex flex-col gap-1.5">
            <label for="start-date" class="text-xs font-semibold uppercase tracking-wider text-slate-400">
              ตั้งแต่วันที่ (Start Date)
            </label>
            <input
              id="start-date"
              type="date"
              v-model="startDate"
              :min="minDate"
              :max="endDate || maxDate"
              class="w-full bg-slate-950/90 text-white border border-slate-700/80 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-400 transition-all [color-scheme:dark] cursor-pointer"
            />
          </div>

          <!-- End Date -->
          <div class="flex flex-col gap-1.5">
            <label for="end-date" class="text-xs font-semibold uppercase tracking-wider text-slate-400">
              ถึงวันที่ (End Date)
            </label>
            <input
              id="end-date"
              type="date"
              v-model="endDate"
              :min="startDate || minDate"
              :max="maxDate"
              class="w-full bg-slate-950/90 text-white border border-slate-700/80 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-400 transition-all [color-scheme:dark] cursor-pointer"
            />
          </div>
        </div>

        <!-- Search Button -->
        <button
          @click="fetchData"
          :disabled="isLoading"
          class="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold px-8 py-2.5 rounded-xl shadow-lg shadow-red-600/20 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
        >
          <span>🔍</span>
          <span>{{ isLoading ? 'กำลังค้นหา...' : 'ค้นหาภาพ' }}</span>
        </button>
      </div>

      <!-- Quick Filter Pills -->
      <div class="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-slate-800/80">
        <span class="text-xs text-slate-500 mr-1">เลือกช่วงเวลาด่วน:</span>
        <button
          type="button"
          @click="setQuickRange(7)"
          class="text-xs px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
        >
          7 วันล่าสุด
        </button>
        <button
          type="button"
          @click="setQuickRange(14)"
          class="text-xs px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
        >
          14 วันล่าสุด
        </button>
        <button
          type="button"
          @click="setQuickRange(30)"
          class="text-xs px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
        >
          30 วันล่าสุด
        </button>
      </div>
    </section>

    <!-- Skeleton Loading State -->
    <div v-if="isLoading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
      <div
        v-for="n in 6"
        :key="n"
        class="bg-slate-900/50 rounded-2xl overflow-hidden border border-slate-800/60 animate-pulse"
      >
        <div class="h-56 bg-slate-800/80"></div>
        <div class="p-6 space-y-3">
          <div class="h-4 w-24 bg-slate-800 rounded"></div>
          <div class="h-6 w-3/4 bg-slate-800 rounded"></div>
          <div class="space-y-2 pt-2">
            <div class="h-3 w-full bg-slate-800/70 rounded"></div>
            <div class="h-3 w-5/6 bg-slate-800/70 rounded"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div
      v-else-if="errorMessage"
      class="text-center py-10 px-6 bg-red-950/30 backdrop-blur-md rounded-2xl border border-red-500/40 text-red-200 max-w-xl mx-auto"
    >
      <div class="text-3xl mb-2">⚠️</div>
      <p class="font-medium">{{ errorMessage }}</p>
    </div>

    <!-- Results Grid -->
    <div v-else>
      <div class="flex items-center justify-between mb-6">
        <p class="text-slate-400 text-sm">
          พบข้อมูลทั้งหมด <span class="text-cyan-400 font-bold">{{ apodList.length }}</span> รายการ
        </p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
        <article
          v-for="item in apodList"
          :key="item.date"
          @click="goToDetail(item)"
          class="group bg-slate-900/60 backdrop-blur-md rounded-2xl overflow-hidden border border-slate-800/80 hover:border-cyan-500/50 hover:shadow-2xl hover:shadow-cyan-500/10 hover:-translate-y-1.5 transition-all duration-300 cursor-pointer flex flex-col"
        >
          <!-- Image / Video Thumbnail -->
          <div class="relative h-56 bg-slate-950 overflow-hidden flex items-center justify-center">
            <img
              v-if="item.media_type === 'image'"
              :src="item.url"
              :alt="item.title"
              loading="lazy"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div v-else class="flex flex-col items-center gap-2 text-cyan-400">
              <span class="text-3xl">🎬</span>
              <span class="text-sm font-semibold">วิดีโอ (คลิกเพื่อดูรายละเอียด)</span>
            </div>

            <!-- Date Badge Overlay -->
            <div class="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md text-cyan-300 text-xs font-semibold px-3 py-1 rounded-full border border-slate-700/60">
              📅 {{ item.date }}
            </div>
          </div>

          <!-- Card Body -->
          <div class="p-6 flex flex-col flex-grow">
            <h2 class="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors mb-2.5 line-clamp-2">
              {{ item.title }}
            </h2>
            <p class="text-sm text-slate-400 line-clamp-3 mb-5 leading-relaxed">
              {{ item.explanation }}
            </p>

            <div class="mt-auto pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-cyan-400">
              <span>ดูรายละเอียดทั้งหมด</span>
              <span class="group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </div>
        </article>
      </div>
    </div>
  </div>
</template>
