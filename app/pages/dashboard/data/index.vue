<script setup>
import { ref, reactive, onMounted } from 'vue';
import { 
  Plus, 
  RefreshCw, 
  Edit3, 
  Trash2, 
  Layers, 
  CheckCircle2, 
  Download,
  Filter
} from 'lucide-vue-next';

import Table from '~/components/Table.vue';
import Select from '~/components/Select.vue';
import InputValidate from '~/components/InputValidate.vue';
import { notify } from '~/utils/Notify';
import { confirmDialog } from '~/utils/Confirm';

useHead({
  title: 'Manajemen Data Layanan',
});

const tableRef = ref(null);

const categoryOptions = [
  { id: 'diklat', name: 'Pelatihan & Diklat' },
  { id: 'sertifikasi', name: 'Uji Kompetensi & Sertifikasi' },
  { id: 'konsultasi', name: 'Layanan Konsultasi' },
  { id: 'integrasi', name: 'Integrasi Sistem API' },
];

const selectedCategory = ref('');

const tableColumns = [
  { data: 'norut', label: 'No', width: 5, classHeader: 'justify-center', classContent: 'text-center font-medium', sorting: false },
  { data: 'code', label: 'Kode', width: 15, classHeader: 'justify-start', classContent: 'font-mono text-xs font-semibold text-primary', sorting: true },
  { data: 'name', label: 'Nama Layanan', width: 35, classHeader: 'justify-start', classContent: 'text-left font-medium', sorting: true },
  { data: 'category', label: 'Kategori', width: 20, classHeader: 'justify-center', classContent: 'text-center', sorting: true },
  { data: 'status', label: 'Status', width: 10, classHeader: 'justify-center', classContent: 'text-center', sorting: true },
  { data: 'aksi', label: 'Aksi', width: 15, classHeader: 'justify-center', classContent: 'text-center flex justify-center gap-1.5', sorting: false },
];

const sampleData = ref([]);
const isDataLoading = ref(true); // Mandatory skeleton protocol

const loadInitialData = async () => {
  isDataLoading.value = true;
  try {
    // Simulasi penundaan network agar Skeleton terlihat anggun
    await new Promise((resolve) => setTimeout(resolve, 600));

    sampleData.value = [
      { id: 1, code: 'SRV-001', name: 'Manajemen Diklat Kepemimpinan', category: 'Pelatihan & Diklat', category_id: 'diklat', status: 'Aktif' },
      { id: 2, code: 'SRV-002', name: 'Sertifikasi Keahlian Pengadaan Barang & Jasa', category: 'Uji Kompetensi & Sertifikasi', category_id: 'sertifikasi', status: 'Aktif' },
      { id: 3, code: 'SRV-003', name: 'Konsultasi Perencanaan Anggaran SKPD', category: 'Layanan Konsultasi', category_id: 'konsultasi', status: 'Review' },
      { id: 4, code: 'SRV-004', name: 'Sinkronisasi Data SSO & Kepegawaian', category: 'Integrasi Sistem API', category_id: 'integrasi', status: 'Aktif' },
      { id: 5, code: 'SRV-005', name: 'Bimbingan Teknis Standar Pelayanan Minimal', category: 'Pelatihan & Diklat', category_id: 'diklat', status: 'Non-Aktif' },
      { id: 6, code: 'SRV-006', name: 'Uji Kompetensi Asesor Aparatur Sipil', category: 'Uji Kompetensi & Sertifikasi', category_id: 'sertifikasi', status: 'Aktif' },
      { id: 7, code: 'SRV-007', name: 'Workshop Transformasi Digital Pemerintahan', category: 'Pelatihan & Diklat', category_id: 'diklat', status: 'Aktif' },
      { id: 8, code: 'SRV-008', name: 'Audit Keamanan Informasi Sistem Layanan', category: 'Integrasi Sistem API', category_id: 'integrasi', status: 'Review' },
    ];
  } finally {
    isDataLoading.value = false;
  }
};

onMounted(() => {
  loadInitialData();
});

// Modal State & Validations
const isModalOpen = ref(false);
const isEditing = ref(false);

const form = reactive({
  id: null,
  code: '',
  name: '',
  category_id: 'diklat',
  status: 'Aktif',
});

const errors = reactive({
  name: '',
});

const openCreateModal = () => {
  isEditing.value = false;
  form.id = null;
  form.code = `SRV-00${sampleData.value.length + 1}`;
  form.name = '';
  form.category_id = 'diklat';
  form.status = 'Aktif';
  errors.name = '';
  isModalOpen.value = true;
};

const handleEdit = (row) => {
  isEditing.value = true;
  form.id = row.id;
  form.code = row.code;
  form.name = row.name;
  form.category_id = row.category_id || 'diklat';
  form.status = row.status;
  errors.name = '';
  isModalOpen.value = true;
};

const handleSave = () => {
  errors.name = '';
  if (!form.name.trim()) {
    errors.name = 'Nama layanan wajib diisi tidak boleh kosong.';
    return;
  }

  const categoryName = categoryOptions.find((c) => c.id === form.category_id)?.name || 'Umum';

  if (isEditing.value) {
    const idx = sampleData.value.findIndex((item) => item.id === form.id);
    if (idx !== -1) {
      sampleData.value[idx] = {
        ...sampleData.value[idx],
        name: form.name,
        category: categoryName,
        category_id: form.category_id,
        status: form.status,
      };
      notify.success('Berhasil Diperbarui', `Layanan ${form.code} berhasil disimpan.`);
    }
  } else {
    sampleData.value.unshift({
      id: Date.now(),
      code: form.code,
      name: form.name,
      category: categoryName,
      category_id: form.category_id,
      status: form.status,
    });
    notify.success('Berhasil Ditambahkan', `Layanan baru ${form.name} berhasil dibuat.`);
  }

  isModalOpen.value = false;
  tableRef.value?.refresh();
};

const handleDelete = async (row) => {
  const isConfirmed = await confirmDialog({
    title: 'Hapus Layanan?',
    message: `Apakah Anda yakin ingin menghapus "${row.name}" (${row.code})? Data yang dihapus tidak dapat dipulihkan kembali.`,
    confirmText: 'Ya, Hapus Data',
    cancelText: 'Batal',
    type: 'danger',
  });

  if (isConfirmed) {
    sampleData.value = sampleData.value.filter((item) => item.id !== row.id);
    notify.error('Data Dihapus', `Layanan ${row.code} telah dihapus.`);
    tableRef.value?.refresh();
  }
};

const handleRefresh = async () => {
  await loadInitialData();
  tableRef.value?.refresh();
  notify.info('Data Disegarkan', 'Tabel data layanan berhasil dimuat ulang.');
};
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div>
        <h1 class="text-2xl sm:text-3xl font-extrabold text-base-content tracking-tight flex items-center gap-2.5">
          <Layers class="size-7 text-primary" />
          <span>Kelola Data Layanan</span>
        </h1>
        <p class="text-xs sm:text-sm text-base-content/60 mt-1">
          Pusat manajemen master data layanan, dilengkapi pencarian, ekspor CSV, dan validasi input.
        </p>
      </div>

      <div class="flex items-center gap-2">
        <button
          @click="handleRefresh"
          class="btn btn-ghost btn-sm rounded-xl border border-base-300 gap-1.5"
          :disabled="isDataLoading"
        >
          <RefreshCw class="size-3.5" :class="{ 'animate-spin': isDataLoading }" />
          <span>Refresh</span>
        </button>
        <button @click="openCreateModal" class="btn btn-primary btn-sm rounded-xl gap-1.5 shadow-sm font-semibold">
          <Plus class="size-3.5" />
          <span>Tambah Layanan</span>
        </button>
      </div>
    </div>

    <!-- Filter Card -->
    <div class="card bg-base-100 border border-base-300/80 p-4 rounded-2xl">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div class="flex items-center gap-2 text-xs font-semibold text-base-content/70">
          <Filter class="size-4 text-primary" />
          <span>Filter Berdasarkan Kategori:</span>
        </div>
        <div class="w-full sm:w-64">
          <Select
            v-model="selectedCategory"
            :options="categoryOptions"
            label-key="name"
            value-key="id"
            placeholder="Semua Kategori"
            :searchable="true"
          />
        </div>
      </div>
    </div>

    <!-- Table Component -->
    <Table
      ref="tableRef"
      :columns="tableColumns"
      :items="sampleData"
      :server-side="false"
      :sync-url="true"
      :exportable="true"
      :additional-filters="selectedCategory ? { category_id: selectedCategory } : {}"
    >
      <!-- Slot Status -->
      <template #status="{ value }">
        <span
          class="badge badge-sm font-semibold rounded-lg"
          :class="{
            'badge-success text-success-content': value === 'Aktif',
            'badge-warning text-warning-content': value === 'Review',
            'badge-ghost text-base-content/50': value === 'Non-Aktif',
          }"
        >
          {{ value }}
        </span>
      </template>

      <!-- Slot Aksi -->
      <template #aksi="{ row }">
        <button
          @click="handleEdit(row)"
          class="btn btn-xs btn-ghost btn-square text-base-content/70 hover:text-primary rounded-lg tooltip"
          data-tip="Edit"
        >
          <Edit3 class="size-3.5" />
        </button>
        <button
          @click="handleDelete(row)"
          class="btn btn-xs btn-ghost btn-square text-error hover:bg-error/10 rounded-lg tooltip"
          data-tip="Hapus"
        >
          <Trash2 class="size-3.5" />
        </button>
      </template>
    </Table>

    <!-- Modal Form Tambah / Edit -->
    <dialog :class="['modal modal-bottom sm:modal-middle', { 'modal-open': isModalOpen }]">
      <div class="modal-box bg-base-100 rounded-3xl border border-base-300 p-6 max-w-md shadow-2xl">
        <h3 class="font-bold text-lg text-base-content">
          {{ isEditing ? 'Edit Layanan' : 'Tambah Layanan Baru' }}
        </h3>
        <p class="text-xs text-base-content/60 mt-0.5">
          Lengkapi formulir di bawah ini dengan validasi terstandarisasi.
        </p>

        <div class="space-y-4 mt-5">
          <InputValidate label="Kode Layanan" hint="Auto-generated">
            <input
              v-model="form.code"
              type="text"
              class="input input-bordered w-full rounded-xl text-sm font-mono bg-base-200/50"
              readonly
            />
          </InputValidate>

          <InputValidate
            label="Nama Layanan"
            :required="true"
            :error="errors.name"
            errorMessage="Nama layanan wajib diisi"
          >
            <input
              v-model="form.name"
              type="text"
              class="input input-bordered w-full rounded-xl text-sm focus:border-primary"
              placeholder="Contoh: Bimtek Perencanaan..."
            />
          </InputValidate>

          <InputValidate label="Kategori" :required="true">
            <Select
              v-model="form.category_id"
              :options="categoryOptions"
              label-key="name"
              value-key="id"
            />
          </InputValidate>

          <InputValidate label="Status Operasional">
            <select v-model="form.status" class="select select-bordered w-full rounded-xl text-sm">
              <option value="Aktif">Aktif</option>
              <option value="Review">Review</option>
              <option value="Non-Aktif">Non-Aktif</option>
            </select>
          </InputValidate>
        </div>

        <div class="modal-action mt-6 gap-2">
          <button @click="isModalOpen = false" class="btn btn-ghost rounded-xl">Batal</button>
          <button @click="handleSave" class="btn btn-primary rounded-xl px-5 font-semibold">
            {{ isEditing ? 'Simpan Perubahan' : 'Tambah Layanan' }}
          </button>
        </div>
      </div>
      <form method="dialog" class="modal-backdrop bg-black/40">
        <button @click="isModalOpen = false">close</button>
      </form>
    </dialog>
  </div>
</template>
