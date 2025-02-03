import { createSlice } from '@reduxjs/toolkit';

export interface userState {
   userName: string;
}

const initialState: userState = {
   userName: '',
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {

    setUserName: (state, action) => {
      state.userName = action.payload;
    }
  },
});

export const userAction = userSlice.actions;
export default userSlice.reducer;