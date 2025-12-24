import { create } from "zustand";
import { persist } from "zustand/middleware";
import { supabase } from "../lib/supabase";
import api from "../lib/api";

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      profile: null,
      isAuthenticated: false,
      isLoading: true,
      error: null,

      // Initialize auth state
      initialize: async () => {
        try {
          set({ isLoading: true });

          const {
            data: { session },
          } = await supabase.auth.getSession();

          if (session) {
            const user = session.user;
            localStorage.setItem("access_token", session.access_token);

            // Fetch profile
            const { data } = await api.get("/auth/me");

            set({
              user: data.data.user,
              profile: data.data.user.profile,
              isAuthenticated: true,
              isLoading: false,
            });
          } else {
            set({
              user: null,
              profile: null,
              isAuthenticated: false,
              isLoading: false,
            });
          }
        } catch (error) {
          console.error("Auth initialization error:", error);
          set({
            user: null,
            profile: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      },

      // Sign up
      signup: async (email, password, username) => {
        try {
          set({ isLoading: true, error: null });

          const { data, error } = await supabase.auth.signUp({
            email,
            password,
          });

          if (error) throw error;

          // Create profile via API
          if (data.session) {
            localStorage.setItem("access_token", data.session.access_token);
          }

          set({
            user: data.user,
            isLoading: false,
          });

          return { success: true, data };
        } catch (error) {
          set({ error: error.message, isLoading: false });
          return { success: false, error: error.message };
        }
      },

      // Login
      login: async (email, password) => {
        try {
          set({ isLoading: true, error: null });

          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (error) throw error;

          localStorage.setItem("access_token", data.session.access_token);

          // Fetch profile
          const profileRes = await api.get("/auth/me");

          set({
            user: profileRes.data.data.user,
            profile: profileRes.data.data.user.profile,
            isAuthenticated: true,
            isLoading: false,
          });

          return { success: true };
        } catch (error) {
          set({ error: error.message, isLoading: false });
          return { success: false, error: error.message };
        }
      },

      // Logout
      logout: async () => {
        try {
          await supabase.auth.signOut();
          localStorage.removeItem("access_token");

          set({
            user: null,
            profile: null,
            isAuthenticated: false,
            error: null,
          });
        } catch (error) {
          console.error("Logout error:", error);
        }
      },

      // Update profile
      updateProfile: async (profileData) => {
        try {
          const { data } = await api.put("/auth/profile", profileData);

          set((state) => ({
            profile: data.data.profile,
          }));

          return { success: true };
        } catch (error) {
          return { success: false, error: error.message };
        }
      },

      // Clear error
      clearError: () => set({ error: null }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        profile: state.profile,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;
