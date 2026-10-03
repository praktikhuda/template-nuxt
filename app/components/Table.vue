<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { 
  Search, 
  ArrowUpNarrowWide, 
  ArrowDownWideNarrow, 
  ArrowDownUp, 
  ChevronLeft, 
  ChevronRight, 
  Inbox,
  Download
} from 'lucide-vue-next';

const props = defineProps({
  columns: { type: Array, required: true },
  apiFunction: { type: Function, default: null },
  items: { type: [Array, Object], default: () => [] },
  serverSide: { type: Boolean, default: false },
  additionalFilters: { type: Object, default: () => ({}) },
  syncUrl: { type: Boolean, default: true },
  searchable: { type: Boolean, default: true },
  showEntries: { type: Boolean, default: true },
  showPagination: { type: Boolean, default: true },
  exportable: { type: Boolean, default: true },
  idKey: { type: String, default: 'id' },
  activeId: { type: [String, Number], default: null },
});

const emit = defineEmits(['row-click']);

const route = useRoute();
const router = useRouter();

const sortConfig = ref({
  key: props.syncUrl ? (route?.query?.sort || '') : '',
  order: props.syncUrl ? (route?.query?.order || 'asc') : 'asc',
});

const listData = ref([]);
const totalRecords = ref(0);
const isLoading = ref(true); // Wajib true agar Skeleton langsung aktif saat initial load
const searchQuery = ref(props.syncUrl ? (route?.query?.search || '') : '');
const currentEntries = ref(props.syncUrl ? (Number(route?.query?.limit) || 10) : 10);
const currentPage = ref(props.syncUrl ? (Number(route?.query?.page) || 1) : 1);

let debounceTimer = null;

const loadData = async () => {
  isLoading.value = true;
  try {
    const sourceData = props.apiFunction ?? props.items;

    if (typeof sourceData === 'function') {
      const baseParams = {
        search: searchQuery.value,
        limit: currentEntries.value,
        page: currentPage.value,
        order_by: sortConfig.value.key,
        order_dir: sortConfig.value.order,
      };

      const finalParams = props.serverSide
        ? { ...baseParams, ...props.additionalFilters }
        : props.additionalFilters;

      const response = await sourceData(finalParams);

      listData.value =
        response?.data?.data ||
        response?.data ||
        (Array.isArray(response) ? response : []);

      totalRecords.value = props.serverSide
        ? (response?.data?.metadata?.total || response?.data?.meta?.total || response?.metadata?.total || response?.meta?.total || 0)
        : listData.value.length;
    } else if (Array.isArray(sourceData)) {
      listData.value = sourceData;
      totalRecords.value = listData.value.length;
    } else if (sourceData && typeof sourceData === 'object' && Array.isArray(sourceData.value)) {
      listData.value = sourceData.value;
      totalRecords.value = listData.value.length;
    } else {
      listData.value = [];
      totalRecords.value = 0;
    }
  } catch (error) {
    console.error('Table fetch error:', error);
  } finally {
    isLoading.value = false;
  }
};

const handleSort = (key) => {
  let order = 'asc';
  if (sortConfig.value.key === key && sortConfig.value.order === 'asc') {
    order = 'desc';
  }
  sortConfig.value = { key, order };
  if (props.serverSide) {
    loadData();
  }
};

// --- CLIENT-SIDE PROCESSING ---
const processedData = computed(() => {
  let items = [...listData.value];
  if (!props.serverSide) {
    // Additional filters
    if (Object.keys(props.additionalFilters).length > 0) {
      items = items.filter((row) => {
        return Object.entries(props.additionalFilters).every(([key, filterValue]) => {
          if (!filterValue) return true;
          if (row[key] === undefined || row[key] === null) return true;
          return String(row[key]).toLowerCase().includes(String(filterValue).toLowerCase());
        });
      });
    }

    // Client search
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase();
      items = items.filter((row) => {
        return Object.values(row).some((val) =>
          val !== null && val !== undefined && String(val).toLowerCase().includes(query)
        );
      });
    }

    // Client sort
    if (sortConfig.value.key) {
      items.sort((a, b) => {
        const valA = a[sortConfig.value.key];
        const valB = b[sortConfig.value.key];
        if (valA < valB) return sortConfig.value.order === 'asc' ? -1 : 1;
        if (valA > valB) return sortConfig.value.order === 'asc' ? 1 : -1;
        return 0;
      });
    }

    // Client pagination
    const start = (currentPage.value - 1) * currentEntries.value;
    return items.slice(start, start + Number(currentEntries.value));
  }
  return items;
});

const displayTotalRecords = computed(() => {
  if (props.serverSide) return totalRecords.value;
  let items = [...listData.value];
  if (Object.keys(props.additionalFilters).length > 0) {
    items = items.filter((row) => {
      return Object.entries(props.additionalFilters).every(([key, filterValue]) => {
        if (!filterValue) return true;
        if (row[key] === undefined || row[key] === null) return true;
        return String(row[key]).toLowerCase().includes(String(filterValue).toLowerCase());
      });
    });
  }
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    items = items.filter((row) =>
      Object.values(row).some((val) =>
        val !== null && val !== undefined && String(val).toLowerCase().includes(query)
      )
    );
  }
  return items.length;
});

// Ekspor ke CSV
const exportToCsv = () => {
  const dataToExport = props.serverSide ? listData.value : processedData.value;
  if (!dataToExport || dataToExport.length === 0) return;

  const validCols = props.columns.filter((c) => c.data !== 'aksi');
  const headers = validCols.map((c) => `"${c.label}"`).join(',');

  const rows = dataToExport.map((row, idx) => {
    return validCols
      .map((c) => {
        if (c.data === 'norut') return idx + 1;
        const val = row[c.data] ?? '';
        return `"${String(val).replace(/"/g, '""')}"`;
      })
      .join(',');
  });

  const csvContent = [headers, ...rows].join('\n');
  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `data_export_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

defineExpose({
  refresh: loadData,
  listData,
  exportToCsv,
});

// URL Query Sync
watch(
  [searchQuery, currentEntries, currentPage, sortConfig],
  ([newSearch, newLimit, newPage, newSort]) => {
    if (!props.syncUrl || !router || !route) return;

    const query = { ...route.query };

    if (newSearch) query.search = newSearch;
    else delete query.search;

    if (newLimit !== 10) query.limit = String(newLimit);
    else delete query.limit;

    if (newPage !== 1) query.page = String(newPage);
    else delete query.page;

    if (newSort.key) {
      query.sort = newSort.key;
      query.order = newSort.order;
    } else {
      delete query.sort;
      delete query.order;
    }

    router.replace({ query }).catch(() => {});
  },
  { deep: true }
);

// Server-side debounced reload
watch(
  [searchQuery, currentEntries, currentPage],
  () => {
    if (props.serverSide && typeof (props.apiFunction ?? props.items) === 'function') {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        loadData();
      }, 500);
    }
  },
  { deep: true }
);

watch(
  () => props.additionalFilters,
  () => {
    if (typeof (props.apiFunction ?? props.items) === 'function') {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        loadData();
      }, 500);
    }
  },
  { deep: true }
);

watch(
  [() => props.apiFunction, () => props.items],
  () => {
    if (typeof (props.apiFunction ?? props.items) !== 'function') {
      loadData();
    }
  },
  { deep: true }
);

onMounted(() => {
  loadData();
});

const totalPages = computed(() =>
  Math.ceil(displayTotalRecords.value / currentEntries.value) || 1
);

const visiblePages = computed(() => {
  const current = currentPage.value;
  const total = totalPages.value;
  const delta = 1;

  let pages = [];
  for (let i = 1; i <= total; i++) {
    if (i === 1 || i === total || (i >= current - delta && i <= current + delta)) {
      pages.push(i);
    }
  }

  const withDots = [];
  let l;
  for (let i of pages) {
    if (l) {
      if (i - l === 2) {
        withDots.push(l + 1);
      } else if (i - l !== 1) {
        withDots.push('...');
      }
    }
    withDots.push(i);
    l = i;
  }

  return withDots;
});

const changePage = (page) => {
  if (page !== '...' && page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

const handlePagination = (dir) => {
  if (dir === 'prev' && currentPage.value > 1) currentPage.value--;
  else if (dir === 'next' && currentPage.value < totalPages.value) currentPage.value++;
};
</script>

<template>
  <div class="space-y-4">
    <!-- Top Controls: Search, Limit, & Export -->
    <div
      v-if="searchable || showEntries || exportable"
      class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3"
    >
      <div v-if="searchable" class="relative w-full sm:max-w-xs">
        <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-base-content/40">
          <Search class="size-4" />
        </div>
        <input
          v-model="searchQuery"
          @input="currentPage = 1"
          placeholder="Cari data..."
          class="input input-sm border border-base-300 w-full pl-9 h-10 rounded-xl bg-base-100 text-sm focus:outline-none focus:border-primary/50"
        />
      </div>
      <div v-else></div>

      <div class="flex items-center gap-2 w-full sm:w-auto justify-end">
        <!-- Export CSV Button -->
        <button
          v-if="exportable"
          @click="exportToCsv"
          class="btn btn-ghost btn-sm h-10 rounded-xl border border-base-300 gap-1.5 text-xs text-base-content/80 tooltip tooltip-top"
          data-tip="Unduh format CSV"
        >
          <Download class="size-3.5" />
          <span>Export</span>
        </button>

        <!-- Rows Per Page Selector -->
        <div v-if="showEntries" class="flex items-center gap-1.5">
          <span class="text-xs text-base-content/60 hidden sm:inline">Baris:</span>
          <select
            v-model="currentEntries"
            @change="currentPage = 1"
            class="select select-bordered select-sm h-10 rounded-xl text-xs bg-base-100 font-medium"
          >
            <option :value="5">5</option>
            <option :value="10">10</option>
            <option :value="25">25</option>
            <option :value="50">50</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Table Container -->
    <div class="relative overflow-x-auto bg-base-100 rounded-2xl border border-base-300 shadow-xs">
      <table class="table w-full">
        <!-- Table Header -->
        <thead class="bg-base-200/50 text-base-content/70 text-xs uppercase tracking-wider font-semibold border-b border-base-300">
          <tr>
            <th
              v-for="col in columns"
              :key="col.data"
              class="py-3.5 px-4 select-none group"
              :class="[
                col.sorting !== false ? 'cursor-pointer hover:bg-base-200/80 transition-colors' : '',
                col.classHeader || ''
              ]"
              :style="col.width ? { width: col.width + '%' } : {}"
              @click="col.sorting !== false && handleSort(col.data)"
            >
              <div class="flex items-center gap-1.5" :class="col.classHeader">
                <template v-if="$slots[`header(${col.data})`]">
                  <slot :name="`header(${col.data})`" :column="col"></slot>
                </template>
                <template v-else>
                  <span>{{ col.label }}</span>
                  <span v-if="col.sorting !== false" class="text-primary/70">
                    <template v-if="sortConfig.key === col.data">
                      <component
                        :is="sortConfig.order === 'asc' ? ArrowUpNarrowWide : ArrowDownWideNarrow"
                        class="size-3.5 text-primary"
                      />
                    </template>
                    <template v-else>
                      <ArrowDownUp class="size-3.5 opacity-0 group-hover:opacity-40 transition-opacity" />
                    </template>
                  </span>
                </template>
              </div>
            </th>
          </tr>
        </thead>

        <!-- Table Body -->
        <tbody v-if="!isLoading">
          <template v-for="(row, index) in processedData" :key="row[idKey] || index">
            <tr
              class="hover:bg-base-200/40 transition-colors text-sm border-b border-base-200"
              :class="[
                $slots.expanded ? 'cursor-pointer' : '',
                activeId !== null && activeId === row[idKey] ? 'bg-primary/5' : ''
              ]"
              @click="emit('row-click', row)"
            >
              <td
                v-for="col in columns"
                :key="col.data"
                class="py-3 px-4"
                :class="col.classContent || ''"
              >
                <!-- Custom Slot for Column -->
                <slot
                  :name="col.data"
                  :row="row"
                  :index="index"
                  :value="row[col.data]"
                >
                  <!-- Default Rendering -->
                  <template v-if="col.data === 'norut'">
                    {{ (currentPage - 1) * currentEntries + index + 1 }}
                  </template>
                  <template v-else>
                    {{ row[col.data] ?? '-' }}
                  </template>
                </slot>
              </td>
            </tr>

            <!-- Expanded Slot -->
            <tr v-if="$slots.expanded && activeId === row[idKey]">
              <td :colspan="columns.length" class="p-4 bg-base-200/20 border-b border-base-200">
                <slot name="expanded" :row="row"></slot>
              </td>
            </tr>
          </template>

          <!-- Empty State -->
          <tr v-if="processedData.length === 0">
            <td :colspan="columns.length" class="py-12 text-center">
              <div class="flex flex-col items-center justify-center gap-2">
                <Inbox class="size-10 text-base-content/30" />
                <span class="text-sm font-medium text-base-content/60">Tidak ada data ditemukan</span>
              </div>
            </td>
          </tr>
        </tbody>

        <!-- Loading Skeleton -->
        <tbody v-else>
          <tr v-for="n in Math.min(currentEntries, 5)" :key="n" class="border-b border-base-200">
            <td v-for="col in columns" :key="col.data" class="py-3.5 px-4">
              <div class="skeleton h-4 w-full rounded-lg bg-base-300/60"></div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Bottom Controls: Record Info & Pagination -->
    <div
      v-if="showPagination && displayTotalRecords > 0"
      class="flex flex-col sm:flex-row justify-between items-center gap-3 pt-2 text-xs text-base-content/70"
    >
      <div>
        Menampilkan 
        <span class="font-semibold text-base-content">
          {{ Math.min((currentPage - 1) * currentEntries + 1, displayTotalRecords) }}
        </span> 
        sampai 
        <span class="font-semibold text-base-content">
          {{ Math.min(currentPage * currentEntries, displayTotalRecords) }}
        </span> 
        dari 
        <span class="font-semibold text-base-content">{{ displayTotalRecords }}</span> total data
      </div>

      <!-- Pagination Buttons -->
      <div class="join">
        <button
          @click="handlePagination('prev')"
          :disabled="currentPage === 1"
          class="join-item btn btn-xs h-8 px-2.5 rounded-l-xl btn-ghost border border-base-300 disabled:opacity-30"
        >
          <ChevronLeft class="size-4" />
        </button>

        <button
          v-for="(page, idx) in visiblePages"
          :key="idx"
          @click="changePage(page)"
          class="join-item btn btn-xs h-8 px-3 border border-base-300"
          :class="[
            page === currentPage ? 'btn-primary font-bold' : 'btn-ghost',
            page === '...' ? 'btn-disabled opacity-50' : ''
          ]"
        >
          {{ page }}
        </button>

        <button
          @click="handlePagination('next')"
          :disabled="currentPage >= totalPages"
          class="join-item btn btn-xs h-8 px-2.5 rounded-r-xl btn-ghost border border-base-300 disabled:opacity-30"
        >
          <ChevronRight class="size-4" />
        </button>
      </div>
    </div>
  </div>
</template>
