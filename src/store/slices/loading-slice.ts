import { createSlice } from '@reduxjs/toolkit'



type LoadingState = {
    isLoading: boolean
}
const initialState: LoadingState = {
    isLoading: false
}

const LoadingSlicer = createSlice({
  name: 'loading',
  initialState,
  reducers: {
    _loadingStart: (state: LoadingState) => {
        state.isLoading = true;
    }, 
    _loadingFinish: (state: LoadingState) => {
        state.isLoading = false;
    }, 
  }
});

export const { _loadingStart, _loadingFinish } = LoadingSlicer.actions
export default LoadingSlicer.reducer