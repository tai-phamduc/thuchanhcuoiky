import { configureStore } from '@reduxjs/toolkit'
import bikeReducer from './bikeSlice'

const store = configureStore({
  reducer: {
    bikes: bikeReducer,
  },
})

export default store
