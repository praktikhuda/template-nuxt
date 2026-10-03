import { reactive } from 'vue';

export const confirmState = reactive({
  isOpen: false,
  title: 'Konfirmasi Tindakan',
  message: 'Apakah Anda yakin ingin melanjutkan tindakan ini?',
  confirmText: 'Ya, Lanjutkan',
  cancelText: 'Batal',
  type: 'danger', // 'danger' | 'warning' | 'info'
  resolve: null,
});

export const confirmDialog = (options = {}) => {
  return new Promise((resolve) => {
    confirmState.title = options.title || 'Konfirmasi Tindakan';
    confirmState.message = options.message || 'Apakah Anda yakin ingin melanjutkan tindakan ini?';
    confirmState.confirmText = options.confirmText || 'Ya, Lanjutkan';
    confirmState.cancelText = options.cancelText || 'Batal';
    confirmState.type = options.type || 'danger';
    confirmState.isOpen = true;
    confirmState.resolve = resolve;
  });
};

export const handleConfirmChoice = (isConfirmed) => {
  confirmState.isOpen = false;
  if (typeof confirmState.resolve === 'function') {
    confirmState.resolve(isConfirmed);
    confirmState.resolve = null;
  }
};
