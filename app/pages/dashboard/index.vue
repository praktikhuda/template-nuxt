<script setup>
import { ref, onMounted } from 'vue';
import { 
  Layers, 
  Users, 
  Activity, 
  CheckCircle2, 
  ArrowUpRight, 
  Sparkles, 
  RefreshCw, 
  ShieldCheck, 
  Clock, 
  FileText,
  ChevronRight,
  TrendingUp,
  Cpu
} from 'lucide-vue-next';

useHead({
  title: 'Dashboard Executive Overview',
});

const isLoading = ref(true); // Mandatory skeleton protocol

const metrics = ref({
  totalServices: 18,
  activeUsers: 1420,
  apiUptime: 99.8,
  systemEfficiency: 94.2,
});

const recentActivities = ref([]);

const loadDashboard = async () => {
  isLoading.value = true;
  try {
    // Simulasi delay singkat agar skeleton tampak
    await new Promise((resolve) => setTimeout(resolve, 500));

    recentActivities.value = [
      { id: 1, title: 'Sinkronisasi SSO Pengguna', time: '5 menit yang lalu', status: 'Sukses', type: 'auth' },
      { id: 2, title: 'Pembaruan Modul Diklat Teknis', time: '24 menit yang lalu', status: 'Sukses', type: 'service' },
      { id: 3, title: 'Ekspor Data Layanan CSV', time: '1 jam yang lalu', status: 'Unduh', type: 'export' },
      { id: 4, title: 'Pemeriksaan Kesehatan Server API', time: '3 jam yang lalu', status: 'Normal', type: 'system' },
    ];
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  loadDashboard();
});
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div>
        <h1 class="text-2xl sm:text-3xl font-extrabold text-base-content tracking-tight flex items-center gap-2.5">
          <span>Ringkasan Dashboard</span>
          <span class="badge badge-primary badge-outline text-xs">Overview</span>
        </h1>
        <p class="text-xs sm:text-sm text-base-content/60 mt-1">
          Pemantauan performa sistem, aktivitas terbaru, dan pintasan modul aplikasi
        </p>
      </div>

      <button
        @click="loadDashboard"
        class="btn btn-ghost btn-sm rounded-xl border border-base-300 gap-1.5 self-start sm:self-auto"
        :disabled="isLoading"
      >
        <RefreshCw class="size-3.5" :class="{ 'animate-spin': isLoading }" />
        <span>Refresh</span>
      </button>
    </div>

    <!-- Stats Cards (With Skeleton on Initial Load) -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- Card 1 -->
      <div class="card bg-base-100 border border-base-300/80 p-5 rounded-3xl shadow-xs hover:border-primary/40 transition-all">
        <div class="flex items-center justify-between">
          <span class="text-xs font-semibold text-base-content/60 uppercase">Total Layanan</span>
          <div class="w-9 h-9 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
            <Layers class="size-5" />
          </div>
        </div>
        <div v-if="isLoading" class="skeleton h-8 w-20 rounded-lg mt-2"></div>
        <div v-else class="text-2xl font-black text-base-content mt-2">{{ metrics.totalServices }}</div>
        <div class="flex items-center gap-1 text-xs text-success font-medium mt-1">
          <TrendingUp class="size-3" />
          <span>+2 modul baru bulan ini</span>
        </div>
      </div>

      <!-- Card 2 -->
      <div class="card bg-base-100 border border-base-300/80 p-5 rounded-3xl shadow-xs hover:border-info/40 transition-all">
        <div class="flex items-center justify-between">
          <span class="text-xs font-semibold text-base-content/60 uppercase">Pengguna Aktif</span>
          <div class="w-9 h-9 rounded-2xl bg-info/10 text-info flex items-center justify-center">
            <Users class="size-5" />
          </div>
        </div>
        <div v-if="isLoading" class="skeleton h-8 w-24 rounded-lg mt-2"></div>
        <div v-else class="text-2xl font-black text-base-content mt-2">{{ metrics.activeUsers.toLocaleString('id-ID') }}</div>
        <div class="flex items-center gap-1 text-xs text-base-content/50 mt-1">
          <ShieldCheck class="size-3 text-success" />
          <span>Terverifikasi SSO Hub</span>
        </div>
      </div>

      <!-- Card 3 -->
      <div class="card bg-base-100 border border-base-300/80 p-5 rounded-3xl shadow-xs hover:border-success/40 transition-all">
        <div class="flex items-center justify-between">
          <span class="text-xs font-semibold text-base-content/60 uppercase">Performa Uptime</span>
          <div class="w-9 h-9 rounded-2xl bg-success/10 text-success flex items-center justify-center">
            <Activity class="size-5" />
          </div>
        </div>
        <div v-if="isLoading" class="skeleton h-8 w-20 rounded-lg mt-2"></div>
        <div v-else class="text-2xl font-black text-base-content mt-2">{{ metrics.apiUptime }}%</div>
        <div class="flex items-center gap-1 text-xs text-success font-medium mt-1">
          <CheckCircle2 class="size-3" />
          <span>Layanan stabil</span>
        </div>
      </div>

      <!-- Card 4 -->
      <div class="card bg-base-100 border border-base-300/80 p-5 rounded-3xl shadow-xs hover:border-warning/40 transition-all">
        <div class="flex items-center justify-between">
          <span class="text-xs font-semibold text-base-content/60 uppercase">Efisiensi Proses</span>
          <div class="w-9 h-9 rounded-2xl bg-warning/10 text-warning flex items-center justify-center">
            <Cpu class="size-5" />
          </div>
        </div>
        <div v-if="isLoading" class="skeleton h-8 w-20 rounded-lg mt-2"></div>
        <div v-else class="text-2xl font-black text-base-content mt-2">{{ metrics.systemEfficiency }}%</div>
        <div class="flex items-center gap-1 text-xs text-base-content/50 mt-1">
          <Sparkles class="size-3 text-warning" />
          <span>Kinerja optimal</span>
        </div>
      </div>
    </div>

    <!-- Quick Navigation Shortcuts -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <NuxtLink
        to="/dashboard/data"
        class="card bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 p-5 rounded-3xl hover:shadow-md transition-all group"
      >
        <div class="flex items-center justify-between">
          <div class="w-10 h-10 rounded-2xl bg-primary text-primary-content flex items-center justify-center shadow-md">
            <Layers class="size-5" />
          </div>
          <ArrowUpRight class="size-5 text-primary opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
        </div>
        <h3 class="font-bold text-base text-base-content mt-3">Manajemen Data Layanan</h3>
        <p class="text-xs text-base-content/60 mt-1">Buka modul CRUD dengan fitur pencarian, filter kategori, dan ekspor CSV.</p>
      </NuxtLink>

      <NuxtLink
        to="/dashboard/profile"
        class="card bg-gradient-to-br from-info/10 to-info/5 border border-info/20 p-5 rounded-3xl hover:shadow-md transition-all group"
      >
        <div class="flex items-center justify-between">
          <div class="w-10 h-10 rounded-2xl bg-info text-info-content flex items-center justify-center shadow-md">
            <Users class="size-5" />
          </div>
          <ArrowUpRight class="size-5 text-info opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
        </div>
        <h3 class="font-bold text-base text-base-content mt-3">Profil Pengguna & Sesi</h3>
        <p class="text-xs text-base-content/60 mt-1">Lihat identitas akun SSO, masa berlaku token, dan hak akses sistem.</p>
      </NuxtLink>

      <NuxtLink
        to="/"
        class="card bg-gradient-to-br from-secondary/10 to-secondary/5 border border-secondary/20 p-5 rounded-3xl hover:shadow-md transition-all group"
      >
        <div class="flex items-center justify-between">
          <div class="w-10 h-10 rounded-2xl bg-secondary text-secondary-content flex items-center justify-center shadow-md">
            <Sparkles class="size-5" />
          </div>
          <ArrowUpRight class="size-5 text-secondary opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
        </div>
        <h3 class="font-bold text-base text-base-content mt-3">Halaman Landing Publik</h3>
        <p class="text-xs text-base-content/60 mt-1">Pratinjau tampilan beranda publik dengan showcase fitur template.</p>
      </NuxtLink>
    </div>

    <!-- Recent Activity & Status Section -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Recent Activity Timeline -->
      <div class="lg:col-span-2 card bg-base-100 border border-base-300/80 p-6 rounded-3xl shadow-xs">
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-bold text-base text-base-content flex items-center gap-2">
            <Clock class="size-4 text-primary" />
            <span>Aktivitas Sistem Terakhir</span>
          </h3>
          <span class="text-xs text-base-content/50">Realtime logs</span>
        </div>

        <!-- Skeleton Activity -->
        <div v-if="isLoading" class="space-y-3">
          <div v-for="n in 4" :key="n" class="skeleton h-12 w-full rounded-2xl bg-base-200"></div>
        </div>

        <!-- Activity List -->
        <div v-else class="divide-y divide-base-200">
          <div
            v-for="item in recentActivities"
            :key="item.id"
            class="py-3 flex items-center justify-between gap-3 first:pt-0 last:pb-0"
          >
            <div class="flex items-center gap-3 min-w-0">
              <span class="w-2 h-2 rounded-full bg-primary shrink-0"></span>
              <div class="min-w-0">
                <h4 class="font-semibold text-xs text-base-content truncate">{{ item.title }}</h4>
                <span class="text-[11px] text-base-content/50">{{ item.time }}</span>
              </div>
            </div>
            <span class="badge badge-sm badge-ghost font-medium rounded-lg shrink-0 text-xs">
              {{ item.status }}
            </span>
          </div>
        </div>
      </div>

      <!-- Quick System Health -->
      <div class="card bg-base-100 border border-base-300/80 p-6 rounded-3xl shadow-xs space-y-4">
        <h3 class="font-bold text-base text-base-content flex items-center gap-2">
          <Sparkles class="size-4 text-primary" />
          <span>Status Lingkungan</span>
        </h3>

        <div class="space-y-3 text-xs">
          <div>
            <div class="flex justify-between text-base-content/70 mb-1">
              <span>Kapasitas Memori</span>
              <span class="font-semibold">38%</span>
            </div>
            <progress class="progress progress-primary w-full h-2 rounded-full" value="38" max="100"></progress>
          </div>

          <div>
            <div class="flex justify-between text-base-content/70 mb-1">
              <span>Beban CPU Server</span>
              <span class="font-semibold">22%</span>
            </div>
            <progress class="progress progress-info w-full h-2 rounded-full" value="22" max="100"></progress>
          </div>

          <div>
            <div class="flex justify-between text-base-content/70 mb-1">
              <span>Kecepatan Respons API</span>
              <span class="font-semibold">42 ms</span>
            </div>
            <progress class="progress progress-success w-full h-2 rounded-full" value="95" max="100"></progress>
          </div>
        </div>

        <div class="p-3 bg-base-200/50 rounded-2xl border border-base-200 text-[11px] text-base-content/60 leading-relaxed">
          Template Nuxt 4 ini siap dihubungkan dengan endpoint REST API backend pilihan Anda.
        </div>
      </div>
    </div>
  </div>
</template>
