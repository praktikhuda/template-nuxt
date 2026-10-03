<script setup>
import { computed } from 'vue';

const props = defineProps({
  label: {
    type: String,
    required: true,
  },
  error: {
    type: [Boolean, String],
    default: false,
  },
  errorMessage: {
    type: String,
    default: '',
  },
  required: {
    type: Boolean,
    default: false,
  },
  hint: {
    type: String,
    default: '',
  },
});

const hasError = computed(() => !!props.error);

const displayError = computed(() => {
  if (typeof props.error === 'string') {
    return props.error;
  }
  return props.error ? props.errorMessage : '';
});
</script>

<template>
  <div class="space-y-1.5 w-full">
    <div class="flex items-center justify-between">
      <label class="block text-xs font-semibold text-base-content/80 text-left">
        {{ label }}
        <span v-if="required" class="text-error font-bold">*</span>
      </label>
      <span v-if="hint" class="text-[11px] text-base-content/50">{{ hint }}</span>
    </div>

    <!-- Kontainer Slot Input -->
    <div
      class="transition-all duration-200 rounded-xl"
      :class="{ 'ring-2 ring-error/40 border-error': hasError }"
    >
      <slot :has-error="hasError" />
    </div>

    <!-- Teks Pesan Error Animasi -->
    <transition
      enter-active-class="transition duration-150 ease-out"
      enter-from-class="transform -translate-y-1 opacity-0"
      enter-to-class="transform translate-y-0 opacity-100"
      leave-active-class="transition duration-100 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <p v-if="hasError && displayError" class="text-[11px] text-error font-medium text-left flex items-center gap-1 mt-1">
        <span>*</span>
        <span>{{ displayError }}</span>
      </p>
    </transition>
  </div>
</template>
