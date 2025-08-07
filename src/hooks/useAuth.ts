import { create } from 'zustand';
import { User } from '../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const mockUsers: User[] = [
  { id: '1', name: 'Admin User', email: 'admin@example.com', role: 'admin', createdAt: new Date().toISOString() },
  { id: '2', name: 'Editor User', email: 'editor@example.com', role: 'editor', createdAt: new Date().toISOString() },
  { id: '3', name: 'Viewer User', email: 'viewer@example.com', role: 'viewer', createdAt: new Date().toISOString() },
];

export const useAuth = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,

  login: async (email: string, password: string) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const user = mockUsers.find(u => u.email === email && password === 'password');
        if (user) {
          set({ user, isAuthenticated: true });
          resolve(true);
        } else {
          resolve(false);
        }
      }, 500);
    });
  },

  logout: () => {
    set({ user: null, isAuthenticated: false });
  },
}));

export default useAuth;