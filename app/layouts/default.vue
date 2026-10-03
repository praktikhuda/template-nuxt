<script setup>
import {
  PanelLeft,
  PanelLeftClose,
  PanelRightClose,
  Settings,
  SunMoon,
  Check,
  ChevronRight,
  LogOut,
  Sparkles
} from "lucide-vue-next";

import { sidebarMenus } from "~/utils/Menus";

const route = useRoute();
const auth = useAuth();
const config = useRuntimeConfig();

const isDrawerClose = ref(false);
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

const isHovered = ref(false);
const isHoveredIcon = ref(false);

const handleResize = () => {
  isDrawerClose.value = window.innerWidth > 1024;
  if (window.innerWidth >= 1024 && settingsModal.value?.open) {
    settingsModal.value.close();
  }
};

onMounted(async () => {
  const savedTheme = localStorage.getItem('theme') || 'system';
  currentTheme.value = savedTheme;
  applyTheme(savedTheme);

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (currentTheme.value === 'system') {
      document.documentElement.setAttribute('data-theme', e.matches ? 'night' : 'light');
    }
  });

  handleResize();
  window.addEventListener('resize', handleResize);

  if (!auth.user.value && auth.token.value) {
    await auth.verify();
  }
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});

const settingsModal = ref(null);
const temaModal = ref(null);

const openSettings = () => {
  if (window.innerWidth < 1024) {
    isDrawerClose.value = false;
    settingsModal.value.showModal();
  }
};

const openTema = () => {
  settingsModal.value.close();
  temaModal.value.showModal();
};

const handleLogout = async () => {
  const ssoLoginUrl = config.public.ssoLoginUrl || 'http://localhost:3000';
  const appUrl = config.public.appUrl || 'http://localhost:3001';
  
  await auth.logout();
  if (process.client) {
    window.location.href = `${ssoLoginUrl}?redirect=${encodeURIComponent(appUrl)}`;
  }
};

const userName = computed(() => auth.user.value?.name || 'Administrator');
const userEmail = computed(() => auth.user.value?.email || 'admin@template.id');
const userInitial = computed(() => {
  const name = userName.value;
  return name ? name.charAt(0).toUpperCase() : 'A';
});
</script>

<template>
  <div 
    class="drawer lg:drawer-open min-h-screen bg-base-200/50"
    :class="isDrawerClose ? 'is-drawer-close' : 'is-drawer-open'"
  >
    <input id="my-drawer" type="checkbox" class="drawer-toggle" v-model="isDrawerClose"/>
    
    <div class="drawer-content flex flex-col justify-start">
      <!-- Top Navbar (Mobile / Tablet) -->
      <nav class="navbar bg-base-100 shadow-xs block lg:hidden border-b border-base-300">
        <div class="flex justify-between items-center px-2">
          <div class="flex items-center gap-2">
            <label 
              for="my-drawer" 
              class="btn btn-square btn-ghost text-base-content"
              @mouseenter="isHoveredIcon = true" 
              @mouseleave="isHoveredIcon = false"
              @click="isDrawerClose = !isDrawerClose"
            >
              <PanelRightClose v-if="isHoveredIcon" class="size-5" />
              <PanelLeft v-else class="size-5" />
            </label>
            <div class="flex items-center gap-2 font-bold text-base">
              <Sparkles class="size-5 text-primary" />
              <span>Nuxt Template</span>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <span class="w-8 h-8 bg-primary/20 text-primary font-bold text-xs flex items-center justify-center rounded-full">
              {{ userInitial }}
            </span>
          </div>
        </div>
      </nav>

      <!-- Main Slot Content -->
      <main class="grow p-4 md:p-6 lg:p-8">
        <slot />
      </main>
    </div>

    <!-- Drawer Side / Sidebar -->
    <div class="drawer-side z-40 overflow-visible">
      <label for="my-drawer" aria-label="close sidebar" class="drawer-overlay"></label>

      <div class="flex flex-col justify-between min-h-full bg-base-100 border-r border-base-300/80 is-drawer-open:w-64 is-drawer-close:w-16 transition-all duration-300 select-none">
        
        <!-- Header & Nav -->
        <div class="flex flex-col gap-1">
          <!-- App Brand & Toggle -->
          <div class="flex justify-between items-center p-3 border-b border-base-300/80">
            <NuxtLink to="/dashboard" class="flex items-center gap-2.5 overflow-hidden is-drawer-close:hidden">
              <div class="w-8 h-8 rounded-xl bg-primary/15 text-primary flex items-center justify-center shrink-0 font-bold shadow-xs">
                <Sparkles class="size-5" />
              </div>
              <div class="flex flex-col">
                <span class="font-bold text-sm leading-none">Nuxt Template</span>
                <span class="text-[10px] text-base-content/50 mt-0.5">Admin & Starter Kit</span>
              </div>
            </NuxtLink>

            <!-- Desktop Collapse Button -->
            <button 
              @click="isDrawerClose = !isDrawerClose"
              @mouseenter="isHovered = true" 
              @mouseleave="isHovered = false"
              class="hidden lg:flex btn btn-sm btn-ghost btn-square rounded-lg tooltip tooltip-right cursor-pointer"
              :data-tip="isDrawerClose ? 'Buka sidebar' : 'Tutup sidebar'"
            >
              <PanelLeftClose v-if="isHovered" class="size-4" stroke-width="1.7" />
              <PanelLeft v-else class="size-4" stroke-width="1.7" />
            </button>
          </div>

          <!-- Centralized Navigation Links from Menus.js -->
          <div class="w-full min-h-0 is-drawer-open:overflow-y-auto pt-2">
            <div v-for="(group, gIdx) in sidebarMenus" :key="gIdx" class="mb-3">
              <div class="px-4 py-1 text-[10px] font-bold uppercase tracking-wider text-base-content/40 is-drawer-close:hidden">
                {{ group.category }}
              </div>

              <ul class="menu w-full grow px-2 gap-1">
                <li 
                  v-for="(item, mIdx) in group.items"
                  :key="mIdx"
                  class="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                  :data-tip="item.title"
                >
                  <NuxtLink 
                    :to="item.path"
                    class="flex justify-start gap-3 is-drawer-close:justify-center items-center rounded-xl py-2.5 is-drawer-close:w-10 is-drawer-close:h-10 transition-colors"
                    :class="route.path === item.path ? 'active font-semibold shadow-xs' : ''"
                  >
                    <component :is="item.icon" class="size-5 shrink-0" stroke-width="1.7" />
                    <span class="is-drawer-close:hidden text-sm flex-1 truncate">{{ item.title }}</span>
                    <span v-if="item.badge" class="badge badge-xs badge-primary badge-outline is-drawer-close:hidden font-mono">
                      {{ item.badge }}
                    </span>
                  </NuxtLink>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Footer Sidebar (User Info & Settings) -->
        <div class="flex justify-between items-center px-3 is-drawer-close:flex-col is-drawer-close:gap-2 py-3 border-t border-base-300/80">
          <NuxtLink to="/dashboard/profile" class="flex justify-start items-center gap-2.5 overflow-hidden hover:opacity-80 transition-opacity">
            <span class="w-8 h-8 bg-primary/20 text-primary font-bold text-sm flex items-center justify-center rounded-full shrink-0">
              {{ userInitial }}
            </span>
            <div class="flex flex-col min-w-0 is-drawer-close:hidden">
              <span class="text-sm font-semibold truncate">{{ userName }}</span>
              <span class="text-xs text-base-content/60 truncate">{{ userEmail }}</span>
            </div>
          </NuxtLink>

          <!-- Desktop Settings Dropdown -->
          <div class="dropdown dropdown-top hidden lg:block">
            <button 
              tabindex="0" role="button" 
              class="flex gap-2 justify-center items-center hover:bg-base-200 w-8 h-8 rounded-lg tooltip tooltip-right cursor-pointer"
              data-tip="Pengaturan"
            >
              <Settings class="size-4 text-base-content/70" stroke-width="1.7" />
            </button>

            <ul tabindex="-1" class="dropdown-content menu bg-base-100 rounded-2xl z-50 w-52 p-2 shadow-xl border border-base-300/80 mb-2">
              <li class="dropdown dropdown-right dropdown-center">
                <div tabindex="0" role="button" class="flex justify-between items-center py-2">
                  <div class="flex items-center gap-2">
                    <SunMoon class="size-4" stroke-width="1.7" />
                    <span>Tema</span>
                  </div>
                  <ChevronRight class="size-4" stroke-width="1.7" />
                </div>
                <ul tabindex="-1" class="dropdown-content menu bg-base-100 rounded-xl z-50 w-48 p-2 shadow-xl border border-base-300/80">
                  <li>
                    <a class="flex justify-between items-center" @click="setTheme('system')">
                      <span>Sistem</span>
                      <Check v-if="currentTheme === 'system'" class="size-4 text-primary" stroke-width="1.7" />
                    </a>
                  </li>
                  <li>
                    <a class="flex justify-between items-center" @click="setTheme('light')">
                      <span>Terang</span>
                      <Check v-if="currentTheme === 'light'" class="size-4 text-primary" stroke-width="1.7" />
                    </a>
                  </li>
                  <li>
                    <a class="flex justify-between items-center" @click="setTheme('night')">
                      <span>Gelap</span>
                      <Check v-if="currentTheme === 'night'" class="size-4 text-primary" stroke-width="1.7" />
                    </a>
                  </li>
                </ul>
              </li>
              <li>
                <NuxtLink to="/dashboard/profile" class="py-2 flex items-center gap-2">
                  <UserCheck class="size-4" />
                  <span>Profil Akun</span>
                </NuxtLink>
              </li>
              <li>
                <a @click="handleLogout" class="text-error py-2 flex items-center gap-2 cursor-pointer">
                  <LogOut class="size-4" />
                  <span>Logout</span>
                </a>
              </li>
            </ul>
          </div>

          <!-- Mobile Settings Button -->
          <button 
            tabindex="0" role="button" 
            class="flex gap-2 justify-center items-center hover:bg-base-200 w-8 h-8 rounded-lg tooltip tooltip-right cursor-pointer block lg:hidden"
            data-tip="Pengaturan"
            @click="openSettings"
          >
            <Settings class="size-4 text-base-content/70" stroke-width="1.7" />
          </button>
        </div>
      </div>
    </div>

  <!-- Modal Pengaturan untuk Mobile -->
  <dialog ref="settingsModal" class="modal modal-bottom">
    <div class="modal-box rounded-t-3xl bg-base-100 max-h-[75vh] h-auto flex flex-col p-4">
      <div 
        role="button" 
        @click="openTema"
        class="flex justify-between items-center bg-base-200 hover:bg-base-300 py-3 px-4 mb-2 rounded-xl cursor-pointer" 
      >
        <div class="flex items-center gap-3">
          <SunMoon class="size-5" />
          <span>Atur Tema</span>
        </div>
        <ChevronRight class="size-4" />
      </div>

      <div 
        role="button" 
        @click="handleLogout"
        class="flex justify-between items-center bg-error/10 text-error py-3 px-4 rounded-xl cursor-pointer" 
      >
        <div class="flex items-center gap-3">
          <LogOut class="size-5" />
          <span>Logout</span>
        </div>
      </div>
    </div>
    <form method="dialog" class="modal-backdrop">
      <button>Tutup</button>
    </form>
  </dialog>

  <!-- Modal Pilihan Tema Mobile -->
  <dialog ref="temaModal" class="modal modal-bottom">
    <div class="modal-box rounded-t-3xl bg-base-100 max-h-[75vh] h-auto flex flex-col p-4">
      <span class="mb-3 px-1 font-bold text-md">Pilih Tema</span>
      <a class="flex justify-between items-center bg-base-200 hover:bg-base-300 py-3 px-4 mb-2 rounded-xl cursor-pointer" @click="setTheme('system')">
        <span>Sistem</span>
        <Check v-if="currentTheme === 'system'" class="size-5 text-primary" />
      </a>
      <a class="flex justify-between items-center bg-base-200 hover:bg-base-300 py-3 px-4 mb-2 rounded-xl cursor-pointer" @click="setTheme('light')">
        <span>Terang</span>
        <Check v-if="currentTheme === 'light'" class="size-5 text-primary" />
      </a>
      <a class="flex justify-between items-center bg-base-200 hover:bg-base-300 py-3 px-4 rounded-xl cursor-pointer" @click="setTheme('night')">
        <span>Gelap</span>
        <Check v-if="currentTheme === 'night'" class="size-5 text-primary" />
      </a>
    </div>
    <form method="dialog" class="modal-backdrop">
      <button>Tutup</button>
    </form>
  </dialog>
  </div>
</template>
