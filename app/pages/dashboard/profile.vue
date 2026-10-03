<script setup>
import { 
  UserCheck, 
  ShieldCheck, 
  Mail, 
  Key, 
  LogOut, 
  Sparkles, 
  Clock, 
  Building2 
} from 'lucide-vue-next';
import { confirmDialog } from '~/utils/Confirm';

useHead({
  title: 'Profil Pengguna',
});

const auth = useAuth();
const config = useRuntimeConfig();

const userName = computed(() => auth.user.value?.name || 'Administrator');
const userEmail = computed(() => auth.user.value?.email || 'admin@template.id');
const userRole = computed(() => auth.user.value?.role || 'Super Admin');
const userInitial = computed(() => (userName.value ? userName.value.charAt(0).toUpperCase() : 'A'));

const handleLogout = async () => {
  const isConfirmed = await confirmDialog({
    title: 'Keluar dari Sesi?',
    message: 'Apakah Anda yakin ingin keluar dari akun ini? Anda akan diarahkan ke halaman login Central SSO.',
    confirmText: 'Ya, Keluar',
    cancelText: 'Batal',
    type: 'warning',
  });

  if (isConfirmed) {
    const ssoLoginUrl = config.public.ssoLoginUrl || 'http://localhost:3000';
    const appUrl = config.public.appUrl || 'http://localhost:3001';

    await auth.logout();
    if (process.client) {
      window.location.href = `${ssoLoginUrl}?redirect=${encodeURIComponent(appUrl)}`;
    }
  }
};
</script>

<template>
  <div class="space-y-6 max-w-4xl mx-auto">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div>
        <h1 class="text-2xl sm:text-3xl font-extrabold text-base-content tracking-tight flex items-center gap-2.5">
          <UserCheck class="size-7 text-primary" />
          <span>Profil Pengguna</span>
        </h1>
        <p class="text-xs sm:text-sm text-base-content/60 mt-1">
          Informasi kredensial akun, perizinan, dan sesi otentikasi Central SSO Hub
        </p>
      </div>

      <button @click="handleLogout" class="btn btn-error btn-outline btn-sm rounded-xl gap-2 font-semibold">
        <LogOut class="size-3.5" />
        <span>Logout Sesi</span>
      </button>
    </div>

    <!-- Profile Overview Card -->
    <div class="card bg-base-100 border border-base-300/80 p-6 rounded-3xl shadow-xs">
      <div class="flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <!-- Big Avatar -->
        <div class="w-24 h-24 rounded-3xl bg-primary/20 text-primary font-black text-3xl flex items-center justify-center shadow-inner shrink-0">
          {{ userInitial }}
        </div>

        <!-- Info Column -->
        <div class="flex-1 text-center sm:text-left space-y-2">
          <div class="flex flex-col sm:flex-row sm:items-center gap-2 justify-center sm:justify-start">
            <h2 class="text-2xl font-black text-base-content tracking-tight">{{ userName }}</h2>
            <span class="badge badge-primary badge-sm font-semibold rounded-lg">{{ userRole }}</span>
          </div>

          <div class="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-base-content/70 pt-1">
            <span class="flex items-center gap-1.5">
              <Mail class="size-3.5 text-primary" />
              <span>{{ userEmail }}</span>
            </span>
            <span class="flex items-center gap-1.5">
              <ShieldCheck class="size-3.5 text-success" />
              <span>Otentikasi SSO Aktif</span>
            </span>
          </div>

          <p class="text-xs text-base-content/60 pt-2 leading-relaxed max-w-xl">
            Akun ini terhubung secara terpusat dengan layanan otentikasi BPSDM SSO Hub. Seluruh perubahan profil dan password dikelola secara terpusat.
          </p>
        </div>
      </div>
    </div>

    <!-- Credentials & Security Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="card bg-base-100 border border-base-300/80 p-5 rounded-2xl shadow-xs space-y-3">
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-xl bg-info/10 text-info flex items-center justify-center">
            <Key class="size-4" />
          </div>
          <div>
            <h4 class="font-bold text-sm text-base-content">Informasi Sesi JWT</h4>
            <span class="text-[11px] text-base-content/50">Status token tersimpan di browser</span>
          </div>
        </div>

        <div class="space-y-2 pt-1 text-xs">
          <div class="flex justify-between py-1.5 border-b border-base-200">
            <span class="text-base-content/60">Tipe Token:</span>
            <span class="font-mono font-semibold">Bearer JWT</span>
          </div>
          <div class="flex justify-between py-1.5 border-b border-base-200">
            <span class="text-base-content/60">Masa Berlaku Cookie:</span>
            <span class="font-semibold text-success">7 Hari (Lax)</span>
          </div>
          <div class="flex justify-between py-1.5">
            <span class="text-base-content/60">Auto-Refresh Sesi:</span>
            <span class="font-semibold text-primary">Aktif</span>
          </div>
        </div>
      </div>

      <div class="card bg-base-100 border border-base-300/80 p-5 rounded-2xl shadow-xs space-y-3">
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-xl bg-success/10 text-success flex items-center justify-center">
            <Building2 class="size-4" />
          </div>
          <div>
            <h4 class="font-bold text-sm text-base-content">Pusat Layanan SSO</h4>
            <span class="text-[11px] text-base-content/50">Gerbang autentikasi terpusat</span>
          </div>
        </div>

        <div class="space-y-2 pt-1 text-xs">
          <div class="flex justify-between py-1.5 border-b border-base-200">
            <span class="text-base-content/60">Gateway URL:</span>
            <span class="font-mono text-[11px] truncate max-w-[160px]">{{ config.public.ssoLoginUrl || 'http://localhost:3000' }}</span>
          </div>
          <div class="flex justify-between py-1.5 border-b border-base-200">
            <span class="text-base-content/60">Callback Client:</span>
            <span class="font-mono text-[11px] truncate max-w-[160px]">{{ config.public.appUrl || 'http://localhost:3001' }}</span>
          </div>
          <div class="flex justify-between py-1.5">
            <span class="text-base-content/60">Protokol Keamanan:</span>
            <span class="font-semibold text-success">JWT HttpOnly Sync</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
