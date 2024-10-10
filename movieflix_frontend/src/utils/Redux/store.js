import { configureStore } from "@reduxjs/toolkit";
import moviesReducer from "./moviesSlice.js";
import tvReducer from "./tvSlice.js";
export const store = configureStore({
    reducer: {
        movies: moviesReducer,
        tv: tvReducer,
    },
});