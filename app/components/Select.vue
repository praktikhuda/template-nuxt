<script setup>
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue';
import { Square, SquareCheck, ChevronDown, X } from 'lucide-vue-next';

const props = defineProps({
  modelValue: [String, Number, Array, Object],
  options: { type: Array, default: () => [] },
  labelKey: { type: String, default: 'name' },
  valueKey: { type: String, default: 'id' },
  placeholder: { type: String, default: 'Pilih data...' },
  multiple: { type: Boolean, default: false },
  searchable: { type: Boolean, default: true },
});

const emit = defineEmits(['update:modelValue', 'change']);

const isOpen = ref(false);
const search = ref('');
const container = ref(null);
const listContainer = ref(null);

watch(isOpen, async (newVal) => {
  if (newVal) {
    await nextTick();
    if (listContainer.value) {
      const selectedItem = listContainer.value.querySelector('.bg-primary/10');
      if (selectedItem) {
        selectedItem.scrollIntoView({ block: 'nearest' });
      }
    }
  }
});

// --- LOGIKA LABEL ---
const selectedLabel = computed(() => {
  if (props.multiple) {
    if (!Array.isArray(props.modelValue) || props.modelValue.length === 0) return '';
    return `${props.modelValue.length} terpilih`;
  }

  const found = props.options.find((opt) => opt[props.valueKey] == props.modelValue);
  return found ? found[props.labelKey] : '';
});

// --- LOGIKA FILTER ---
const filteredOptions = computed(() => {
  if (!props.searchable || !search.value) return props.options;
  const query = search.value.toLowerCase();
  return props.options.filter((opt) =>
    String(opt[props.labelKey]).toLowerCase().includes(query)
  );
});

// --- ACTIONS ---
const isSelected = (opt) => {
  const val = opt[props.valueKey];
  if (props.multiple) {
    return Array.isArray(props.modelValue) && props.modelValue.includes(val);
  }
  return props.modelValue == val;
};

const selectOption = (opt) => {
  const val = opt[props.valueKey];

  if (props.multiple) {
    let newValue = Array.isArray(props.modelValue) ? [...props.modelValue] : [];
    const index = newValue.indexOf(val);

    if (index > -1) {
      newValue.splice(index, 1);
    } else {
      newValue.push(val);
    }
    emit('update:modelValue', newValue);
  } else {
    if (props.modelValue == val) {
      emit('update:modelValue', '');
    } else {
      emit('update:modelValue', val);
    }
    isOpen.value = false;
    search.value = '';
  }
  emit('change', opt);
};

const removeTag = (val) => {
  if (props.multiple && Array.isArray(props.modelValue)) {
    const newValue = props.modelValue.filter((item) => item !== val);
    emit('update:modelValue', newValue);
  }
};

const close = (e) => {
  if (container.value && !container.value.contains(e.target)) {
    isOpen.value = false;
  }
};

onMounted(() => {
  if (typeof window !== 'undefined') {
    window.addEventListener('click', close);
  }
});

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('click', close);
  }
});
</script>

<template>
  <div ref="container" class="relative w-full">
    <!-- Trigger Button -->
    <div
      @click="isOpen = !isOpen"
      class="flex items-center justify-between w-full px-3 py-2 border rounded-xl cursor-pointer bg-base-100 min-h-[2.5rem] transition-all"
      :class="isOpen ? 'border-primary ring-2 ring-primary/20' : 'border-base-300 hover:border-base-content/30'"
    >
      <div class="flex flex-wrap gap-1.5 max-w-[90%] items-center">
        <!-- Display Tags if Multiple -->
        <template v-if="multiple && Array.isArray(modelValue) && modelValue.length > 0">
          <div
            v-for="val in modelValue"
            :key="val"
            class="badge badge-primary badge-sm gap-1 py-2 px-2.5 rounded-lg text-xs"
          >
            <span>{{ options.find((o) => o[valueKey] == val)?.[labelKey] || val }}</span>
            <span @click.stop="removeTag(val)" class="cursor-pointer hover:opacity-80">
              <X class="size-3" />
            </span>
          </div>
        </template>

        <!-- Display Placeholder / Single Label -->
        <span
          v-else
          :class="{ 'text-base-content/40': !selectedLabel, 'text-base-content': selectedLabel }"
          class="truncate text-sm font-normal"
        >
          {{ selectedLabel || placeholder }}
        </span>
      </div>

      <ChevronDown
        class="size-4 transition-transform duration-200 text-base-content/50 shrink-0"
        :class="{ 'rotate-180': isOpen }"
      />
    </div>

    <!-- Dropdown Content -->
    <div
      v-if="isOpen"
      class="absolute z-50 w-full mt-1.5 bg-base-100 border border-base-300 rounded-xl shadow-xl overflow-hidden"
    >
      <!-- Search Input (Only if searchable="true") -->
      <div v-if="searchable" class="p-2 border-b border-base-200">
        <input
          v-model="search"
          type="text"
          class="input input-sm input-bordered w-full rounded-lg text-xs focus:outline-none focus:border-primary"
          placeholder="Cari opsi..."
          @click.stop
        />
      </div>

      <ul ref="listContainer" class="max-h-56 overflow-y-auto py-1 text-sm">
        <li v-if="filteredOptions.length === 0" class="px-4 py-3 text-center text-xs text-base-content/50">
          Data tidak ditemukan
        </li>
        <li
          v-for="opt in filteredOptions"
          :key="opt[valueKey]"
          @click.stop="selectOption(opt)"
          class="px-3.5 py-2 cursor-pointer transition-colors hover:bg-base-200/60 flex items-center gap-2.5 text-base-content"
          :class="{ 'bg-primary/10 text-primary font-medium': isSelected(opt) }"
        >
          <component
            :is="isSelected(opt) ? SquareCheck : Square"
            class="size-4 shrink-0"
            :class="isSelected(opt) ? 'text-primary' : 'text-base-content/40'"
          />
          <span class="truncate">{{ opt[labelKey] }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>
