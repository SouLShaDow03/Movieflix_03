import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  ActionAndAdventure: [],
  Animation: [],
  Comedy: [],
  Crime: [],
  Kids:[],
};
const tvSlice = createSlice({
    name: "tv",
    initialState,
    reducers: {
        setActionAndAdventure(state, action) {
            state.ActionAndAdventure = action.payload;
        },
        setAnimation(state, action) {
            state.Animation = action.payload;
        },
        setComedy(state, action) {
            state.Comedy = action.payload;
        },
        setCrime(state, action) {
            state.Crime = action.payload;
        },
        setFamily(state, action) {
            state.Kids = action.payload;
        },
    },
});
export const {setActionAndAdventure,setAnimation,setComedy,setCrime,setFamily } = tvSlice.actions;
export default tvSlice.reducer;