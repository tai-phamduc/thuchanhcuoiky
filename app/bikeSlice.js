import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

// API endpoint
const API_URL = 'https://67319cf77aaf2a9aff11341c.mockapi.io/bike'

// Thunk to fetch bikes data
export const fetchBikes = createAsyncThunk('bikes/fetchBikes', async () => {
  const response = await axios.get(API_URL)
  return response.data
})

const bikeSlice = createSlice({
  name: 'bikes',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBikes.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchBikes.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(fetchBikes.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
  },
})

export default bikeSlice.reducer
