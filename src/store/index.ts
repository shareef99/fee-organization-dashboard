import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";
import { localStoreKeys } from "../constants";
import { User } from "@/types/user";

interface State {
  user: User | null;
  userActions: {
    login: (user: User) => void;
    logout: () => void;
  };
}

const useStore = create<State>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        userActions: {
          login: (user: User) => set({ user: user }),
          logout: () => set({ user: null }),
        },
      }),
      {
        name: localStoreKeys.store,
        merge: (persistedState, currentState) => ({
          ...currentState,
          ...(persistedState ?? {}),
          userActions: currentState.userActions,
        }),
      }
    )
  )
);

export const useUser = () => useStore((state) => state.user);
export const useUserActions = () => useStore((state) => state.userActions);
