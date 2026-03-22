import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface UserState {
  firstName: string
  signOff: string
  setProfile: (firstName: string, signOff: string) => void
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      firstName: 'Justin', // Default value
      signOff: 'Best',     // Default value
      setProfile: (firstName, signOff) => set({ firstName, signOff }),
    }),
    { name: 'user-storage' } // This saves your info to localStorage automatically!
  )
)