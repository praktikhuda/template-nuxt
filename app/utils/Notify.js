import { reactive } from 'vue';

export const notifications = reactive([]);

export const notify = {
  show(title, message = '', type = 'info', duration = 3500) {
    const id = Date.now() + Math.random().toString(36).substring(2, 7);
    const newNotify = { id, title, message, type };

    notifications.push(newNotify);

    if (duration > 0) {
      setTimeout(() => {
        this.remove(id);
      }, duration);
    }
  },

  success(title, message = '', duration = 3500) {
    this.show(title, message, 'success', duration);
  },

  error(title, message = '', duration = 4000) {
    this.show(title, message, 'error', duration);
  },

  warning(title, message = '', duration = 3500) {
    this.show(title, message, 'warning', duration);
  },

  info(title, message = '', duration = 3500) {
    this.show(title, message, 'info', duration);
  },

  remove(id) {
    const index = notifications.findIndex(n => n.id === id);
    if (index !== -1) {
      notifications.splice(index, 1);
    }
  },

  clear() {
    notifications.splice(0, notifications.length);
  }
};
