<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();
</script>

<template>
  <div class="min-h-[70vh] flex items-center justify-center">
    <div class="bg-slate-900/70 backdrop-blur-xl rounded-3xl border border-slate-800 p-10 sm:p-16 text-center max-w-xl mx-auto shadow-2xl">
      <div class="text-6xl mb-4">👨‍🚀</div>
      <div class="text-5xl font-black bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-2">
        404
      </div>
      <h1 class="text-2xl font-bold text-white mb-3">
        หลงทางในอวกาศ (Page Not Found)
      </h1>
      <p class="text-slate-400 mb-8">
        ไม่พบหน้าที่คุณกำลังค้นหา ลิงก์อาจไม่ถูกต้องหรือถูกย้ายไปแล้ว
      </p>
      <button
        @click="router.push('/')"
        class="inline-flex items-center gap-2 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white font-semibold px-6 py-3 rounded-xl shadow-lg shadow-red-600/20 transition-all cursor-pointer"
      >
        <span>🚀</span>
        <span>กลับสู่สถานีหลัก (Home)</span>
      </button>
    </div>
  </div>
</template>
