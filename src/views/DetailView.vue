<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getApodByDate } from '../services/nasaApi';
import type { ApodItem } from '../types/apod';

const route = useRoute();
const router = useRouter();

const item = ref<ApodItem | null>(null);
const isLoading = ref<boolean>(false);
const errorMessage = ref<string>('');
const activeImageMode = ref<'standard' | 'hd'>('hd');

const currentImageUrl = computed(() => {
  if (!item.value) return '';
  if (activeImageMode.value === 'hd' && item.value.hdurl) {
    return item.value.hdurl;
  }
  return item.value.url;
});

onMounted(async () => {
  const dateParam = String(route.params.date);

  // ตรวจสอบรูปแบบวันที่ให้ถูกต้องตามมาตรฐาน YYYY-MM-DD (เช่น 2026-11-11)
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(dateParam) || isNaN(Date.parse(dateParam))) {
    errorMessage.value = `รูปแบบวันที่ไม่ถูกต้อง ("${dateParam}") กรุณาระบุในรูปแบบ YYYY-MM-DD เช่น 2026-11-11`;
    return;
  }

  // ตรวจสอบข้อมูลจาก Cache ก่อน
  const cached = sessionStorage.getItem(`apod_${dateParam}`);
  if (cached) {
    item.value = JSON.parse(cached) as ApodItem;
  } else {
    isLoading.value = true;
    try {
      item.value = await getApodByDate(dateParam);
    } catch (err) {
      errorMessage.value = err instanceof Error ? err.message : 'ไม่พบข้อมูลภาพถ่ายดาราศาสตร์ของวันที่ระบุ';
    } finally {
      isLoading.value = false;
    }
  }

  if (item.value && !item.value.hdurl) {
    activeImageMode.value = 'standard';
  }
});
</script>

<template>
  <div class="max-w-5xl mx-auto">
    <!-- Top Navigation Bar -->
    <div class="flex items-center justify-between mb-6">
      <button
        @click="router.push('/')"
        class="inline-flex items-center gap-2 bg-slate-900/80 hover:bg-slate-800 text-slate-200 font-medium px-4 py-2.5 rounded-xl border border-slate-700/80 transition-all cursor-pointer"
      >
        <span>←</span>
        <span>กลับไปหน้ารายการ</span>
      </button>

      <a
        v-if="item && item.media_type === 'image'"
        :href="currentImageUrl"
        target="_blank"
        rel="noopener"
        class="inline-flex items-center gap-2 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 text-sm font-semibold px-4 py-2.5 rounded-xl border border-cyan-500/30 transition-all"
      >
        <span>เปิดภาพต้นฉบับเต็มจอ</span>
        <span>↗</span>
      </a>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="text-center py-20 bg-slate-900/60 rounded-3xl border border-slate-800 text-cyan-400 animate-pulse">
      กำลังโหลดรายละเอียดจากฐานข้อมูล NASA... 🛰️
    </div>

    <!-- Error State (ดีไซน์หน้าแจ้งเตือนเมื่อ URL ผิดหรือหาข้อมูลไม่เจอ) -->
    <div
      v-else-if="errorMessage"
      class="bg-slate-900/70 backdrop-blur-xl rounded-3xl border border-red-500/30 p-10 sm:p-16 text-center max-w-2xl mx-auto shadow-2xl my-8"
    >
      <div class="w-20 h-20 mx-auto mb-6 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-4xl">
        🛸
      </div>
      <h2 class="text-2xl sm:text-3xl font-extrabold text-white mb-3">
        ไม่พบข้อมูลในระบบอวกาศ
      </h2>
      <p class="text-red-300/90 text-base mb-8 leading-relaxed">
        {{ errorMessage }}
      </p>
      <button
        @click="router.push('/')"
        class="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold px-6 py-3 rounded-xl shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
      >
        <span>🏠</span>
        <span>กลับสู่หน้าหลักเพื่อเลือกวันที่ใหม่</span>
      </button>
    </div>

    <!-- Main Detail Card -->
    <article v-else-if="item" class="bg-slate-900/70 backdrop-blur-xl rounded-3xl overflow-hidden border border-slate-800/90 shadow-2xl">
      <!-- Media Showcase Section -->
      <div class="bg-[#03050a] p-4 sm:p-8 border-b border-slate-800/80">
        <template v-if="item.media_type === 'image'">
          <div class="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div class="inline-flex p-1 bg-slate-900 rounded-xl border border-slate-800">
              <button
                type="button"
                @click="activeImageMode = 'standard'"
                :class="[
                  'px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer',
                  activeImageMode === 'standard'
                    ? 'bg-cyan-500 text-slate-950 shadow'
                    : 'text-slate-400 hover:text-white'
                ]"
              >
                🖼️ Standard Image (url)
              </button>
              <button
                v-if="item.hdurl"
                type="button"
                @click="activeImageMode = 'hd'"
                :class="[
                  'px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer',
                  activeImageMode === 'hd'
                    ? 'bg-cyan-500 text-slate-950 shadow'
                    : 'text-slate-400 hover:text-white'
                ]"
              >
                ✨ High Definition (hdurl)
              </button>
            </div>

            <span class="text-xs text-slate-500">
              กำลังแสดง: <strong class="text-slate-300">{{ activeImageMode === 'hd' ? 'ความละเอียดสูง (HD)' : 'ขนาดมาตรฐาน (Standard)' }}</strong>
            </span>
          </div>

          <div class="relative rounded-2xl overflow-hidden bg-black/60 border border-slate-800/60 flex items-center justify-center">
            <img
              :src="currentImageUrl"
              :alt="item.title"
              class="max-w-full max-h-[650px] object-contain"
            />
          </div>
        </template>

        <div v-else-if="item.media_type === 'video'" class="rounded-2xl overflow-hidden border border-slate-800">
          <iframe
            :src="item.url"
            frameborder="0"
            allowfullscreen
            class="w-full h-[480px]"
          ></iframe>
        </div>
      </div>

      <!-- Article & Metadata Section -->
      <div class="p-6 sm:p-10">
        <div class="flex flex-wrap items-center gap-3 mb-4">
          <span class="inline-flex items-center gap-1.5 bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 text-xs font-semibold px-3.5 py-1.5 rounded-full">
            📅 {{ item.date }}
          </span>
          <span class="inline-flex items-center gap-1.5 bg-slate-800/80 text-slate-300 text-xs font-medium px-3.5 py-1.5 rounded-full capitalize">
            📁 {{ item.media_type }}
          </span>
          <span v-if="item.copyright" class="inline-flex items-center gap-1.5 bg-slate-800/80 text-slate-300 text-xs font-medium px-3.5 py-1.5 rounded-full">
            © {{ item.copyright }}
          </span>
        </div>

        <h1 class="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mb-6 leading-tight">
          {{ item.title }}
        </h1>

        <div class="bg-slate-950/50 p-6 rounded-2xl border border-slate-800/60 mb-10">
          <h2 class="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
            คำอธิบายทางดาราศาสตร์ (Explanation)
          </h2>
          <p class="text-slate-200 text-base leading-8 whitespace-pre-line">
            {{ item.explanation }}
          </p>
        </div>

        <!-- All Received API Data Table -->
        <div>
          <h3 class="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span class="text-cyan-400">⚡</span>
            <span>ข้อมูลทั้งหมดที่ได้รับจาก API (All Received Data)</span>
          </h3>

          <div class="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/70">
            <table class="w-full text-left border-collapse text-sm">
              <tbody class="divide-y divide-slate-800/80">
                <tr
                  v-for="(value, key) in item"
                  :key="key"
                  class="hover:bg-slate-900/60 transition-colors"
                >
                  <th class="py-3.5 px-5 text-slate-400 font-semibold w-44 sm:w-52 align-top capitalize bg-slate-900/30">
                    {{ key }}
                  </th>
                  <td class="py-3.5 px-5 text-slate-200 break-all">
                    <a
                      v-if="String(value).startsWith('http')"
                      :href="String(value)"
                      target="_blank"
                      rel="noopener"
                      class="text-cyan-400 hover:text-cyan-300 hover:underline inline-flex items-center gap-1"
                    >
                      <span>{{ value }}</span>
                      <span>↗</span>
                    </a>
                    <span v-else>{{ value }}</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </article>
  </div>
</template>
