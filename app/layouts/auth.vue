<script setup>
import { SunMoon, Check, LayoutDashboard } from "lucide-vue-next";

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
</script>

<template>
  <div class="min-h-screen bg-base-200/60 flex flex-col justify-between relative overflow-x-hidden">
    <!-- Floating Header / Theme Switcher -->
    <header class="w-full px-6 py-4 flex justify-between items-center z-10">
      <div class="flex items-center gap-2.5">
        <div class="w-9 h-9 rounded-xl bg-primary/15 text-primary flex items-center justify-center font-bold shadow-sm">
          <LayoutDashboard class="size-5" />
        </div>
        <div class="flex flex-col">
          <span class="font-bold text-base-content text-lg tracking-tight">Template Nuxt</span>
          <span class="text-xs text-base-content/60">Modern Starter Kit & Dashboard Template</span>
        </div>
      </div>

      <!-- Theme Selector Dropdown -->
      <div class="dropdown dropdown-end">
        <div tabindex="0" role="button" class="btn btn-sm btn-ghost rounded-full flex items-center gap-2">
          <SunMoon class="size-4.5" />
          <span class="hidden sm:inline capitalize">{{ currentTheme === 'system' ? 'Sistem' : currentTheme === 'night' ? 'Gelap' : 'Terang' }}</span>
        </div>
        <ul tabindex="0" class="dropdown-content menu p-2 shadow-xl bg-base-100 border border-base-300/60 rounded-box w-40 z-50">
          <li>
            <a @click="setTheme('system')" class="flex justify-between">
              <span>Sistem</span>
              <Check v-if="currentTheme === 'system'" class="size-4 text-primary" />
            </a>
          </li>
          <li>
            <a @click="setTheme('light')" class="flex justify-between">
              <span>Terang</span>
              <Check v-if="currentTheme === 'light'" class="size-4 text-primary" />
            </a>
          </li>
          <li>
            <a @click="setTheme('night')" class="flex justify-between">
              <span>Gelap</span>
              <Check v-if="currentTheme === 'night'" class="size-4 text-primary" />
            </a>
          </li>
        </ul>
      </div>
    </header>

    <!-- Main Content (login / register form) -->
    <main class="flex-1 flex items-center justify-center p-4 z-10">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="w-full px-6 py-4 text-center text-xs text-base-content/50 z-10">
      <p>&copy; 2026 Template Nuxt. Powered by Nuxt 4 & DaisyUI.</p>
    </footer>
  </div>
</template>