<script setup>
import { LogIn, Mail, Lock, Eye, EyeOff, ShieldCheck, ArrowRight } from "lucide-vue-next";

definePageMeta({
  layout: "auth",
});

const config = useRuntimeConfig();
const auth = useAuth();

const authMode = computed(() => config.public.authMode || "sso");
const ssoLoginUrl = config.public.ssoLoginUrl || "http://localhost:3000";
const appUrl = config.public.appUrl || "http://localhost:3001";

useHead({
  title: authMode.value === "sso" ? "Mengalihkan ke SSO Central..." : "Masuk ke Akun",
});

// State Form untuk Standalone Mode
const form = reactive({
  identifier: "",
  password: "",
  remember: true,
});

const errors = reactive({
  identifier: "",
  password: "",
});

const showPassword = ref(false);
const isSubmitting = ref(false);

const validateForm = () => {
  let valid = true;
  errors.identifier = "";
  errors.password = "";

  if (!form.identifier || !form.identifier.trim()) {
    errors.identifier = "Email atau username wajib diisi.";
    valid = false;
  }

  if (!form.password) {
    errors.password = "Kata sandi wajib diisi.";
    valid = false;
  } else if (form.password.length < 4) {
    errors.password = "Kata sandi minimal 4 karakter.";
    valid = false;
  }

  return valid;
};

const handleLogin = async () => {
  if (!validateForm()) return;

  isSubmitting.value = true;
  try {
    const res = await auth.login({
      identifier: form.identifier.trim(),
      password: form.password,
    });

    if (res.success) {
      notify.success("Berhasil masuk! Mengalihkan ke dashboard...");
      await navigateTo("/dashboard", { replace: true });
    } else {
      notify.error(res.error || "Autentikasi gagal. Silakan periksa kembali kredensial Anda.");
    }
  } catch (err) {
    notify.error("Terjadi kendala saat menghubungi server autentikasi.");
  } finally {
    isSubmitting.value = false;
  }
};

onMounted(() => {
  if (authMode.value === "sso" && process.client) {
    window.location.href = `${ssoLoginUrl}?redirect=${encodeURIComponent(appUrl)}`;
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
      <h2 class="font-bold text-base text-base-content">Mengalihkan ke Central SSO Hub...</h2>
      <p class="text-xs text-base-content/60 mt-1">Anda akan diarahkan ke layanan autentikasi terpusat.</p>
    </div>

    <!-- 2. Kondisi Mode Standalone: Form Login Lokal Mandiri -->
    <div
      v-else
      class="card bg-base-100/90 backdrop-blur-md border border-base-300 shadow-xl rounded-2xl overflow-hidden transition-all duration-300"
    >
      <div class="card-body p-6 sm:p-8">
        <!-- Header Kartu -->
        <div class="text-center mb-6">
          <div class="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-3 shadow-inner">
            <ShieldCheck class="size-6" />
          </div>
          <h1 class="text-xl font-bold text-base-content tracking-tight">Selamat Datang Kembali</h1>
          <p class="text-xs text-base-content/60 mt-1">
            Masuk dengan kredensial akun Anda untuk mengakses dashboard.
          </p>
        </div>

        <!-- Form Autentikasi -->
        <form @submit.prevent="handleLogin" class="space-y-4">
          <!-- Input Identifier (Email / Username) -->
          <InputValidate
            label="Email atau Username"
            :required="true"
            :error="!!errors.identifier"
            :error-message="errors.identifier"
          >
            <div class="relative flex items-center">
              <span class="absolute left-3.5 text-base-content/40 pointer-events-none">
                <Mail class="size-4.5" />
              </span>
              <input
                v-model="form.identifier"
                type="text"
                autocomplete="username"
                placeholder="nama@email.com atau username"
                class="input input-bordered w-full pl-10 text-sm rounded-xl focus:outline-primary transition-all duration-200"
                :class="{ 'input-error': !!errors.identifier }"
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
                autocomplete="current-password"
                placeholder="Masukkan kata sandi akun"
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

          <!-- Opsi Ingat Saya & Lupa Sandi -->
          <div class="flex items-center justify-between pt-1">
            <label class="label cursor-pointer gap-2 p-0">
              <input
                v-model="form.remember"
                type="checkbox"
                class="checkbox checkbox-primary checkbox-xs rounded"
                :disabled="isSubmitting"
              />
              <span class="label-text text-xs text-base-content/70 select-none">Ingat saya</span>
            </label>
            <span class="text-xs text-primary/80 hover:text-primary cursor-pointer transition-colors">
              Lupa kata sandi?
            </span>
          </div>

          <!-- Tombol Submit (4-State Standard: Loading Spinner & Disabled) -->
          <div class="pt-2">
            <button
              type="submit"
              class="btn btn-primary w-full rounded-xl gap-2 font-semibold shadow-md shadow-primary/20 transition-all duration-200"
              :disabled="isSubmitting"
            >
              <span v-if="isSubmitting" class="loading loading-spinner loading-sm"></span>
              <template v-else>
                <span>Masuk Sekarang</span>
                <ArrowRight class="size-4" />
              </template>
            </button>
          </div>
        </form>

        <!-- Footer Card: Link Registrasi -->
        <div class="mt-6 pt-4 border-t border-base-200 text-center text-xs text-base-content/60">
          <span>Belum memiliki akun?</span>
          <NuxtLink
            to="/register"
            class="text-primary font-semibold hover:underline ml-1"
          >
            Daftar Akun Baru
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>