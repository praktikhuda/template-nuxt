<script setup>
import { 
  AlertTriangle, 
  Home, 
  LayoutDashboard, 
  RotateCcw,
  Sparkles 
} from 'lucide-vue-next';

const props = defineProps({
  error: {
    type: Object,
    default: () => ({}),
  },
});

const statusCode = computed(() => props.error?.statusCode || 404);
const statusMessage = computed(() => {
  if (statusCode.value === 404) {
    return 'Halaman yang Anda cari tidak ditemukan atau telah dipindahkan.';
  }
  return props.error?.message || 'Terjadi kesalahan sistem yang tidak terduga.';
});

const handleClearError = (targetPath = '/dashboard') => {
  clearError({ redirect: targetPath });
};
</script>

<template>
  <div class="min-h-screen bg-base-200/50 flex flex-col items-center justify-center p-4 selection:bg-primary/20 selection:text-primary">
    <!-- Ambient Glow -->
    <div class="absolute w-[450px] h-[300px] bg-primary/10 blur-[120px] rounded-full pointer-events-none"></div>

    <div class="card bg-base-100 border border-base-300 shadow-2xl rounded-3xl p-8 sm:p-10 max-w-md w-full text-center relative z-10 backdrop-blur-xl">
      <!-- Status Icon -->
      <div class="w-16 h-16 rounded-3xl bg-error/15 text-error flex items-center justify-center mx-auto mb-5 shadow-inner">
        <AlertTriangle class="size-8" />
      </div>

      <!-- Code Badge -->
      <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-base-200 border border-base-300 text-xs font-mono font-bold text-base-content/80 mb-3 mx-auto">
        <span>ERROR {{ statusCode }}</span>
      </div>

      <h1 class="text-2xl sm:text-3xl font-black text-base-content tracking-tight">
        {{ statusCode === 404 ? 'Halaman Tidak Ditemukan' : 'Terjadi Kesalahan' }}
      </h1>

      <p class="text-xs sm:text-sm text-base-content/70 mt-2 leading-relaxed">
        {{ statusMessage }}
      </p>

      <!-- Action Buttons -->
      <div class="mt-8 flex flex-col gap-2.5">
        <button
          @click="handleClearError('/dashboard')"
          class="btn btn-primary rounded-2xl gap-2 font-bold shadow-md shadow-primary/20 w-full"
        >
          <LayoutDashboard class="size-4" />
          <span>Kembali ke Dashboard</span>
        </button>

        <button
          @click="handleClearError('/')"
          class="btn btn-ghost border border-base-300 rounded-2xl gap-2 font-semibold text-xs text-base-content/80 w-full"
        >
          <Home class="size-3.5" />
          <span>Ke Halaman Utama</span>
        </button>
      </div>

      <div class="mt-6 pt-4 border-t border-base-200 flex items-center justify-center gap-1.5 text-[11px] text-base-content/40">
        <Sparkles class="size-3 text-primary" />
        <span>Nuxt 4 Starter Template</span>
      </div>
    </div>
  </div>
</template>
