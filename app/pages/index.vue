<script setup>
import { ref, onMounted } from 'vue';
import { 
  Sparkles, 
  ArrowRight, 
  LayoutDashboard, 
  Layers, 
  Zap, 
  ShieldCheck, 
  SunMoon, 
  Check, 
  ChevronRight, 
  Code2, 
  Cpu, 
  ExternalLink,
  Laptop
} from 'lucide-vue-next';

definePageMeta({
  layout: false,
});

useHead({
  title: 'Nuxt 4 Starter Template - Modern, Fast, and Modular',
});

const currentTheme = ref('system');

const applyTheme = (theme) => {
  if (theme === 'system') {
    const isSystemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.setAttribute('data-theme', isSystemDark ? 'night' : 'light');
  } else {
    document.documentElement.setAttribute('data-theme', theme);
  }
};

const setTheme = (theme) => {
  currentTheme.value = theme;
  localStorage.setItem('theme', theme);
  applyTheme(theme);
};

onMounted(() => {
  const savedTheme = localStorage.getItem('theme') || 'system';
  currentTheme.value = savedTheme;
  applyTheme(savedTheme);

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (currentTheme.value === 'system') {
      document.documentElement.setAttribute('data-theme', e.matches ? 'night' : 'light');
    }
  });
});

const features = [
  {
    icon: LayoutDashboard,
    title: 'Collapsible Drawer Sidebar',
    description: 'Sidebar responsif dengan toggle ciut-lebar desktop, mobile drawer native, dan deteksi rute aktif.',
    color: 'text-primary bg-primary/10',
  },
  {
    icon: Layers,
    title: 'Dual-Mode Table (Datatable)',
    description: 'Dukungan paginasi server-side dan client-side, sorting dinamis, debounce pencarian, dan sinkronisasi URL query.',
    color: 'text-info bg-info/10',
  },
  {
    icon: Code2,
    title: 'Smart Select & Tagging',
    description: 'Komponen dropdown searchable, multi-select tags, fleksibilitas labelKey/valueKey, dan click-outside listener.',
    color: 'text-success bg-success/10',
  },
  {
    icon: ShieldCheck,
    title: 'SSO Hub Client Ready',
    description: 'Terintegrasi global auth middleware, interseptor token URL, sinkronisasi cookie, dan penanganan auto logout 401.',
    color: 'text-warning bg-warning/10',
  },
  {
    icon: SunMoon,
    title: '3-State Theme Engine',
    description: 'Dukungan tema Terang (Light), Gelap (Night), dan Otomatis (System OS) dengan persistensi local storage.',
    color: 'text-secondary bg-secondary/10',
  },
  {
    icon: Zap,
    title: 'Modern Nuxt 4 Architecture',
    description: 'Dibangun dengan Nuxt 4, Vue 3 Composition API murni, Tailwind CSS v4, DaisyUI v5, dan Lucide Icons.',
    color: 'text-accent bg-accent/10',
  },
];
</script>

<template>
  <div class="min-h-screen bg-base-100 text-base-content flex flex-col selection:bg-primary/20 selection:text-primary">
    <!-- Top Sticky Navbar -->
    <header class="sticky top-0 z-50 backdrop-blur-md bg-base-100/80 border-b border-base-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <!-- Brand Logo -->
        <NuxtLink to="/" class="flex items-center gap-2.5">
          <div class="w-9 h-9 rounded-xl bg-primary text-primary-content flex items-center justify-center font-black shadow-md shadow-primary/20">
            <Sparkles class="size-5" />
          </div>
          <div class="flex flex-col">
            <span class="font-black text-base tracking-tight leading-none">Nuxt Template</span>
            <span class="text-[10px] text-base-content/50 font-medium">Starter Kit & Design System</span>
          </div>
        </NuxtLink>

        <!-- Nav Actions -->
        <div class="flex items-center gap-2 sm:gap-3">
          <!-- Theme Switcher Dropdown -->
          <div class="dropdown dropdown-end">
            <button tabindex="0" class="btn btn-ghost btn-sm btn-square rounded-xl">
              <SunMoon class="size-4 text-base-content/70" />
            </button>
            <ul tabindex="-1" class="dropdown-content menu bg-base-100 rounded-2xl z-50 w-44 p-2 shadow-xl border border-base-200 mt-2">
              <li>
                <a @click="setTheme('system')" class="flex justify-between items-center py-2 text-xs font-medium">
                  <span>Sistem</span>
                  <Check v-if="currentTheme === 'system'" class="size-3.5 text-primary" />
                </a>
              </li>
              <li>
                <a @click="setTheme('light')" class="flex justify-between items-center py-2 text-xs font-medium">
                  <span>Terang</span>
                  <Check v-if="currentTheme === 'light'" class="size-3.5 text-primary" />
                </a>
              </li>
              <li>
                <a @click="setTheme('night')" class="flex justify-between items-center py-2 text-xs font-medium">
                  <span>Gelap</span>
                  <Check v-if="currentTheme === 'night'" class="size-3.5 text-primary" />
                </a>
              </li>
            </ul>
          </div>

          <NuxtLink to="/dashboard" class="btn btn-primary btn-sm rounded-xl gap-1.5 px-4 shadow-sm shadow-primary/20 font-semibold">
            <span>Buka Dashboard</span>
            <ArrowRight class="size-3.5" />
          </NuxtLink>
        </div>
      </div>
    </header>

    <!-- Hero Section -->
    <section class="relative pt-16 pb-20 md:pt-24 md:pb-28 overflow-hidden">
      <!-- Glow ambient background -->
      <div class="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-primary/10 blur-[130px] rounded-full pointer-events-none"></div>

      <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <!-- Badge -->
        <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-base-200 border border-base-300 text-xs font-semibold text-base-content/80 mb-6 shadow-xs animate-in fade-in slide-in-from-bottom-2 duration-500">
          <Sparkles class="size-3.5 text-primary" />
          <span>Nuxt 4 + Tailwind v4 + DaisyUI v5</span>
        </div>

        <!-- Headline -->
        <h1 class="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-base-content leading-tight">
          Fondasi Cepat untuk Aplikasi Web &
          <span class="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            Dashboard Modern
          </span>
        </h1>

        <!-- Subheadline -->
        <p class="mt-6 text-base sm:text-lg text-base-content/70 max-w-2xl mx-auto leading-relaxed">
          Template starter lengkap dengan sidebar drawer responsif, dual-mode table (server-side & client-side), komponen select cerdas, dan integrasi SSO.
        </p>

        <!-- CTA Buttons -->
        <div class="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
          <NuxtLink to="/dashboard" class="btn btn-primary btn-md rounded-2xl gap-2 px-7 font-bold shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all w-full sm:w-auto">
            <LayoutDashboard class="size-4" />
            <span>Jelajahi Dashboard</span>
          </NuxtLink>
          <a href="#fitur" class="btn btn-ghost border border-base-300 btn-md rounded-2xl gap-2 px-6 font-semibold w-full sm:w-auto">
            <span>Lihat Komponen Fitur</span>
            <ChevronRight class="size-4" />
          </a>
        </div>
      </div>

      <!-- Dashboard Preview Card -->
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-14">
        <div class="rounded-3xl border border-base-300/80 bg-base-100 shadow-2xl p-2 sm:p-4 backdrop-blur-xl relative overflow-hidden group">
          <div class="flex items-center justify-between pb-3 px-2 border-b border-base-200">
            <div class="flex items-center gap-1.5">
              <span class="w-3 h-3 rounded-full bg-error/70 inline-block"></span>
              <span class="w-3 h-3 rounded-full bg-warning/70 inline-block"></span>
              <span class="w-3 h-3 rounded-full bg-success/70 inline-block"></span>
              <span class="text-xs text-base-content/40 ml-2 font-mono">dashboard/index.vue</span>
            </div>
            <NuxtLink to="/dashboard" class="text-xs font-semibold text-primary hover:underline flex items-center gap-1">
              <span>Buka Langsung</span>
              <ExternalLink class="size-3" />
            </NuxtLink>
          </div>

          <!-- Preview Content Snippet -->
          <div class="p-4 sm:p-6 bg-base-200/40 rounded-2xl mt-3 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="card bg-base-100 p-4 rounded-xl border border-base-300">
              <span class="text-xs font-semibold text-base-content/50 uppercase">Modular Sidebar</span>
              <span class="text-lg font-bold text-base-content mt-1">Drawer & Mini Mode</span>
              <p class="text-xs text-base-content/60 mt-1">Collapsible 64px to 256px toggle</p>
            </div>
            <div class="card bg-base-100 p-4 rounded-xl border border-base-300">
              <span class="text-xs font-semibold text-base-content/50 uppercase">Smart Table</span>
              <span class="text-lg font-bold text-base-content mt-1">Server & Client Side</span>
              <p class="text-xs text-base-content/60 mt-1">URL Query sync, Debounce search</p>
            </div>
            <div class="card bg-base-100 p-4 rounded-xl border border-base-300">
              <span class="text-xs font-semibold text-base-content/50 uppercase">Central Auth</span>
              <span class="text-lg font-bold text-base-content mt-1">SSO Hub Ready</span>
              <p class="text-xs text-base-content/60 mt-1">JWT Bearer Cookie & 401 Guard</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Grid -->
    <section id="fitur" class="py-20 bg-base-200/40 border-t border-base-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center max-w-2xl mx-auto mb-16">
          <h2 class="text-3xl font-black tracking-tight text-base-content">
            Dirancang Lengkap untuk Efisiensi Pengembangan
          </h2>
          <p class="mt-3 text-sm text-base-content/60">
            Setiap komponen telah diuji dan disiapkan untuk kebutuhan pembuatan aplikasi skala kecil hingga enterprise.
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="(item, idx) in features"
            :key="idx"
            class="card bg-base-100 border border-base-300/80 p-6 rounded-3xl shadow-xs hover:border-primary/50 hover:shadow-lg transition-all"
          >
            <div :class="['w-11 h-11 rounded-2xl flex items-center justify-center mb-4', item.color]">
              <component :is="item.icon" class="size-5" />
            </div>
            <h3 class="font-bold text-base text-base-content mb-1.5">{{ item.title }}</h3>
            <p class="text-xs text-base-content/70 leading-relaxed">{{ item.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="mt-auto border-t border-base-200 py-8 bg-base-100 text-xs text-base-content/60">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div class="flex items-center gap-2">
          <Sparkles class="size-4 text-primary" />
          <span class="font-bold text-base-content">Nuxt 4 Starter Template</span>
        </div>
        <p>© 2026. Siap disesuaikan untuk berbagai kebutuhan proyek.</p>
        <NuxtLink to="/dashboard" class="text-primary hover:underline font-medium">
          Masuk ke Dashboard →
        </NuxtLink>
      </div>
    </footer>
  </div>
</template>
