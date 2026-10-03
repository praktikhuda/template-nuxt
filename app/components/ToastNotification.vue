<script setup>
import { notifications, notify } from '~/utils/Notify';
import { 
  CheckCircle2, 
  AlertCircle, 
  AlertTriangle, 
  Info, 
  X 
} from 'lucide-vue-next';

const getAlertClass = (type) => {
  switch (type) {
    case 'success':
      return 'alert-success text-success-content';
    case 'error':
      return 'alert-error text-error-content';
    case 'warning':
      return 'alert-warning text-warning-content';
    case 'info':
    default:
      return 'alert-info text-info-content';
  }
};

const getIcon = (type) => {
  switch (type) {
    case 'success':
      return CheckCircle2;
    case 'error':
      return AlertCircle;
    case 'warning':
      return AlertTriangle;
    case 'info':
    default:
      return Info;
  }
};
</script>

<template>
  <div class="toast toast-top toast-end z-[9999] p-4 space-y-2 pointer-events-none">
    <transition-group
      enter-active-class="transform ease-out duration-300 transition"
      enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-4"
      enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-for="item in notifications"
        :key="item.id"
        class="alert shadow-xl pointer-events-auto flex items-start gap-3 rounded-2xl py-3 px-4 max-w-sm border border-base-content/10"
        :class="getAlertClass(item.type)"
      >
        <component :is="getIcon(item.type)" class="size-5 shrink-0 mt-0.5" />
        <div class="flex-1 min-w-0">
          <h4 class="font-bold text-sm tracking-tight leading-tight">{{ item.title }}</h4>
          <p v-if="item.message" class="text-xs opacity-90 mt-0.5 leading-snug break-words">
            {{ item.message }}
          </p>
        </div>
        <button
          @click="notify.remove(item.id)"
          class="btn btn-ghost btn-xs btn-circle opacity-70 hover:opacity-100 shrink-0"
        >
          <X class="size-3.5" />
        </button>
      </div>
    </transition-group>
  </div>
</template>
