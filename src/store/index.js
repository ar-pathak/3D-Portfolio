import { configureStore } from '@reduxjs/toolkit'

const initialState = {
  // Add initial state here if needed
}

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    default:
      return state
  }
}

export const store = configureStore({
  reducer: rootReducer
}) 