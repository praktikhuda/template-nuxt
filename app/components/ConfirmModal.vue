<script setup>
import { confirmState, handleConfirmChoice } from '~/utils/Confirm';
import { AlertTriangle, AlertCircle, Info, X } from 'lucide-vue-next';

const getIcon = (type) => {
  switch (type) {
    case 'danger':
      return AlertCircle;
    case 'warning':
      return AlertTriangle;
    case 'info':
    default:
      return Info;
  }
};

const getButtonClass = (type) => {
  switch (type) {
    case 'danger':
      return 'btn-error text-error-content shadow-error/20';
    case 'warning':
      return 'btn-warning text-warning-content shadow-warning/20';
    case 'info':
    default:
      return 'btn-primary text-primary-content shadow-primary/20';
  }
};

const getIconColorClass = (type) => {
  switch (type) {
    case 'danger':
      return 'bg-error/15 text-error';
    case 'warning':
      return 'bg-warning/15 text-warning';
    case 'info':
    default:
      return 'bg-primary/15 text-primary';
  }
};
</script>

<template>
  <dialog
    :class="['modal modal-bottom sm:modal-middle transition-all duration-200 z-[9999]', { 'modal-open': confirmState.isOpen }]"
  >
    <div class="modal-box bg-base-100 rounded-3xl border border-base-300 p-6 max-w-sm shadow-2xl relative">
      <button
        @click="handleConfirmChoice(false)"
        class="btn btn-sm btn-ghost btn-circle absolute right-4 top-4 opacity-70 hover:opacity-100"
      >
        <X class="size-4" />
      </button>

      <div class="flex flex-col items-center text-center pt-2">
        <div :class="['w-14 h-14 rounded-2xl flex items-center justify-center mb-4', getIconColorClass(confirmState.type)]">
          <component :is="getIcon(confirmState.type)" class="size-7" />
        </div>

        <h3 class="font-black text-lg text-base-content tracking-tight">
          {{ confirmState.title }}
        </h3>
        <p class="text-xs text-base-content/70 mt-1.5 leading-relaxed px-2">
          {{ confirmState.message }}
        </p>
      </div>

      <div class="modal-action grid grid-cols-2 gap-3 mt-6">
        <button
          @click="handleConfirmChoice(false)"
          class="btn btn-ghost border border-base-300 rounded-xl text-sm font-semibold"
        >
          {{ confirmState.cancelText }}
        </button>
        <button
          @click="handleConfirmChoice(true)"
          :class="['btn rounded-xl text-sm font-bold shadow-md', getButtonClass(confirmState.type)]"
        >
          {{ confirmState.confirmText }}
        </button>
      </div>
    </div>
    <form method="dialog" class="modal-backdrop bg-black/40 backdrop-blur-xs">
      <button @click="handleConfirmChoice(false)">close</button>
    </form>
  </dialog>
</template>
