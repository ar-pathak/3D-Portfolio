import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  isDarkMode: window.matchMedia('(prefers-color-scheme: dark)').matches
}

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.isDarkMode = !state.isDarkMode
    },
    setTheme: (state, action) => {
      state.isDarkMode = action.payload
    }
  }
})

export const { toggleTheme, setTheme } = themeSlice.actions
export default themeSlice.reducer 