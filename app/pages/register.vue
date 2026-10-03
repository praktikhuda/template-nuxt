<script setup>
import { UserPlus, User, Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-vue-next";

definePageMeta({
  layout: "auth",
});

const config = useRuntimeConfig();
const auth = useAuth();

const authMode = computed(() => config.public.authMode || "sso");
const ssoLoginUrl = config.public.ssoLoginUrl || "http://localhost:3000";
const appUrl = config.public.appUrl || "http://localhost:3001";

useHead({
  title: authMode.value === "sso" ? "Mengalihkan ke Pendaftaran SSO..." : "Daftar Akun Baru",
});

// State Form untuk Standalone Mode
const form = reactive({
  name: "",
  email: "",
  password: "",
  password_confirmation: "",
});

const errors = reactive({
  name: "",
  email: "",
  password: "",
  password_confirmation: "",
});

const showPassword = ref(false);
const isSubmitting = ref(false);

const validateForm = () => {
  let valid = true;
  errors.name = "";
  errors.email = "";
  errors.password = "";
  errors.password_confirmation = "";

  if (!form.name || !form.name.trim()) {
    errors.name = "Nama lengkap wajib diisi.";
    valid = false;
  }

  if (!form.email || !form.email.trim()) {
    errors.email = "Alamat email wajib diisi.";
    valid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = "Format alamat email tidak valid.";
    valid = false;
  }

  if (!form.password) {
    errors.password = "Kata sandi wajib diisi.";
    valid = false;
  } else if (form.password.length < 6) {
    errors.password = "Kata sandi minimal 6 karakter.";
    valid = false;
  }

  if (form.password !== form.password_confirmation) {
    errors.password_confirmation = "Konfirmasi kata sandi tidak cocok.";
    valid = false;
  }

  return valid;
};

const handleRegister = async () => {
  if (!validateForm()) return;

  isSubmitting.value = true;
  try {
    const res = await auth.register({
      name: form.name.trim(),
      email: form.email.trim(),
      password: form.password,
      password_confirmation: form.password_confirmation,
    });

    if (res.success) {
      notify.success("Pendaftaran berhasil! Silakan masuk dengan akun Anda.");
      await navigateTo("/login");
    } else {
      notify.error(res.error || "Pendaftaran gagal. Silakan coba kembali.");
    }
  } catch (err) {
    notify.error("Terjadi kendala saat registrasi akun baru.");
  } finally {
    isSubmitting.value = false;
  }
};

onMounted(() => {
  if (authMode.value === "sso" && process.client) {
    window.location.href = `${ssoLoginUrl}/register?redirect=${encodeURIComponent(appUrl)}`;
  }
});
</script>

<template>
  <div class="w-full max-w-md mx-auto">
    <!-- 1. Kondisi Mode SSO: Indikator Pengalihan Terpusat -->
    <div
      v-if="authMode === 'sso'"
      class="card bg-base-100 border border-base-300 p-8 rounded-2xl shadow-xl text-center"
    >
      <span class="loading loading-spinner loading-lg text-primary mx-auto mb-4"></span>
      <h2 class="font-bold text-base text-base-content">Mengalihkan ke Pendaftaran SSO...</h2>
      <p class="text-xs text-base-content/60 mt-1">Anda akan diarahkan ke layanan pendaftaran terpusat.</p>
    </div>

    <!-- 2. Kondisi Mode Standalone: Form Registrasi Mandiri -->
    <div
      v-else
      class="card bg-base-100/90 backdrop-blur-md border border-base-300 shadow-xl rounded-2xl overflow-hidden transition-all duration-300"
    >
      <div class="card-body p-6 sm:p-8">
        <!-- Header Kartu -->
        <div class="text-center mb-6">
          <div class="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-3 shadow-inner">
            <UserPlus class="size-6" />
          </div>
          <h1 class="text-xl font-bold text-base-content tracking-tight">Buat Akun Baru</h1>
          <p class="text-xs text-base-content/60 mt-1">
            Daftarkan akun untuk mulai mengelola keuangan Anda.
          </p>
        </div>

        <!-- Form Registrasi -->
        <form @submit.prevent="handleRegister" class="space-y-4">
          <!-- Input Nama Lengkap -->
          <InputValidate
            label="Nama Lengkap"
            :required="true"
            :error="!!errors.name"
            :error-message="errors.name"
          >
            <div class="relative flex items-center">
              <span class="absolute left-3.5 text-base-content/40 pointer-events-none">
                <User class="size-4.5" />
              </span>
              <input
                v-model="form.name"
                type="text"
                autocomplete="name"
                placeholder="Nama lengkap Anda"
                class="input input-bordered w-full pl-10 text-sm rounded-xl focus:outline-primary transition-all duration-200"
                :class="{ 'input-error': !!errors.name }"
                :disabled="isSubmitting"
              />
            </div>
          </InputValidate>

          <!-- Input Email -->
          <InputValidate
            label="Alamat Email"
            :required="true"
            :error="!!errors.email"
            :error-message="errors.email"
          >
            <div class="relative flex items-center">
              <span class="absolute left-3.5 text-base-content/40 pointer-events-none">
                <Mail class="size-4.5" />
              </span>
              <input
                v-model="form.email"
                type="email"
                autocomplete="email"
                placeholder="nama@email.com"
                class="input input-bordered w-full pl-10 text-sm rounded-xl focus:outline-primary transition-all duration-200"
                :class="{ 'input-error': !!errors.email }"
                :disabled="isSubmitting"
              />
            </div>
          </InputValidate>

          <!-- Input Password -->
          <InputValidate
            label="Kata Sandi"
            :required="true"
            :error="!!errors.password"
            :error-message="errors.password"
          >
            <div class="relative flex items-center">
              <span class="absolute left-3.5 text-base-content/40 pointer-events-none">
                <Lock class="size-4.5" />
              </span>
              <input
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                autocomplete="new-password"
                placeholder="Minimal 6 karakter"
                class="input input-bordered w-full pl-10 pr-10 text-sm rounded-xl focus:outline-primary transition-all duration-200"
                :class="{ 'input-error': !!errors.password }"
                :disabled="isSubmitting"
              />
              <button
                type="button"
                tabindex="-1"
                @click="showPassword = !showPassword"
                class="absolute right-3 text-base-content/40 hover:text-base-content transition-colors"
              >
                <EyeOff v-if="showPassword" class="size-4" />
                <Eye v-else class="size-4" />
              </button>
            </div>
          </InputValidate>

          <!-- Input Konfirmasi Password -->
          <InputValidate
            label="Konfirmasi Kata Sandi"
            :required="true"
            :error="!!errors.password_confirmation"
            :error-message="errors.password_confirmation"
          >
            <div class="relative flex items-center">
              <span class="absolute left-3.5 text-base-content/40 pointer-events-none">
                <Lock class="size-4.5" />
              </span>
              <input
                v-model="form.password_confirmation"
                :type="showPassword ? 'text' : 'password'"
                autocomplete="new-password"
                placeholder="Ulangi kata sandi di atas"
                class="input input-bordered w-full pl-10 text-sm rounded-xl focus:outline-primary transition-all duration-200"
                :class="{ 'input-error': !!errors.password_confirmation }"
                :disabled="isSubmitting"
              />
            </div>
          </InputValidate>

          <!-- Tombol Submit (4-State Standard) -->
          <div class="pt-2">
            <button
              type="submit"
              class="btn btn-primary w-full rounded-xl gap-2 font-semibold shadow-md shadow-primary/20 transition-all duration-200"
              :disabled="isSubmitting"
            >
              <span v-if="isSubmitting" class="loading loading-spinner loading-sm"></span>
              <template v-else>
                <span>Daftar Sekarang</span>
                <ArrowRight class="size-4" />
              </template>
            </button>
          </div>
        </form>

        <!-- Footer Card: Link Login -->
        <div class="mt-6 pt-4 border-t border-base-200 text-center text-xs text-base-content/60">
          <span>Sudah memiliki akun?</span>
          <NuxtLink
            to="/login"
            class="text-primary font-semibold hover:underline ml-1"
          >
            Masuk Sekarang
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>