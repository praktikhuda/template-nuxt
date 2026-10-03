import {
  LayoutDashboard,
  Layers,
  UserCheck,
  Globe,
  Settings,
  ShieldCheck,
  FileText
} from 'lucide-vue-next';

export const sidebarMenus = [
  {
    category: 'Menu Utama',
    items: [
      {
        title: 'Dashboard',
        path: '/dashboard',
        icon: LayoutDashboard,
        badge: null,
      },
      {
        title: 'Data Layanan',
        path: '/dashboard/data',
        icon: Layers,
        badge: 'CRUD',
      },
    ],
  },
  {
    category: 'Akun & Publik',
    items: [
      {
        title: 'Profil Pengguna',
        path: '/dashboard/profile',
        icon: UserCheck,
        badge: null,
      },
      {
        title: 'Landing Page',
        path: '/',
        icon: Globe,
        badge: 'Web',
      },
    ],
  },
];
