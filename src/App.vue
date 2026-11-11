<template>
  <div class="min-h-screen bg-[#060812] text-slate-100 font-sans antialiased relative overflow-x-hidden selection:bg-cyan-500/30 selection:text-cyan-200">
    <!-- แสงบรรยากาศอวกาศด้านหลัง (Ambient Glow) -->
    <div class="fixed inset-0 pointer-events-none overflow-hidden">
      <div class="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/20 rounded-full blur-[128px]"></div>
      <div class="absolute top-1/3 -right-40 w-[500px] h-[500px] bg-indigo-600/15 rounded-full blur-[128px]"></div>
      <div class="absolute -bottom-40 left-1/3 w-96 h-96 bg-cyan-600/10 rounded-full blur-[128px]"></div>
    </div>

    <!-- เนื้อหาหลัก -->
    <main class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <RouterView />
    </main>
  </div>
</template>
