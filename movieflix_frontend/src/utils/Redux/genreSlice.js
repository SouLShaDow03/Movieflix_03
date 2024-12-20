import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  genresName: [],
};
const genreSlice = createSlice({
  name: "genre",
  initialState,
  reducers: {
    setGenresName(state, action) {
      state.genresName = action.payload;
    },
  },
});
export const { setGenresName } = genreSlice.actions;
export default genreSlice.reducer;
