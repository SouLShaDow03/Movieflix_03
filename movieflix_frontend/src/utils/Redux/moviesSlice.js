import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  nowPlayingMovies: [],
  trendingMovies: [],
  indianMovies: [],
  marathiMovies: [],
  trendingTvShows: [],
    actionMovies: [],
    adventureMovies: [],
    animationMovies: [],
    comedyMovies: [],
    crimeMovies: [],
    documentaryMovies: [],
    dramaMovies : [],
    familyMovies: [],
    fantasyMovies: [],
    historyMovies: [],
    horrorMovies: [],
    musicMovies: [],
    mysteryMovies: [],
    romanceMovies: [],
    scienceFictionMovies: [],
    tvMovies: [],
    warMovies: [],
    westernMovies: [],
};

const moviesSlice = createSlice({
  name: "movies",
  initialState,
  reducers: {
    setNowPlayingMovies(state, action) {
      state.nowPlayingMovies = action.payload;
    },
    setTrendingMovies(state, action) {
      state.trendingMovies = action.payload;
    },
    setIndianMovies(state, action) {
      state.indianMovies = action.payload;
    },
    setMarathiMovies(state, action) {
      state.marathiMovies = action.payload;
    },
    setTrendingTvShows(state, action) {
      state.trendingTvShows = action.payload;
    },
    setActionMovies(state, action) {
      state.actionMovies = action.payload;
      },
    setAdventureMovies(state, action) { 
      state.adventureMovies = action.payload;
      },
    setAnimationMovies(state, action) {
      state.animationMovies = action.payload;
      },
    setComedyMovies(state, action) {
      state.comedyMovies = action.payload;
      },
    setCrimeMovies(state, action) {
      state.crimeMovies = action.payload;
      },
    setDocumentaryMovies(state, action) {
      state.documentaryMovies = action.payload;
      },
    setDramaMovies(state, action) {
      state.dramaMovies = action.payload;
      },
    setFamilyMovies(state, action) {
      state.familyMovies = action.payload;
      },
    setFantasyMovies(state, action) {
      state.fantasyMovies = action.payload;
      },
    setHistoryMovies(state, action) {
      state.historyMovies = action.payload;
      },
    setHorrorMovies(state, action) {
      state.horrorMovies = action.payload;
      },
    setMusicMovies(state, action) {
      state.musicMovies = action.payload;
      },
    setMysteryMovies(state, action) {
      state.mysteryMovies = action.payload;
      },
    setRomanceMovies(state, action) {
      state.romanceMovies = action.payload;
      },
    setScienceFictionMovies(state, action) {
        state.scienceFictionMovies = action.payload;
      },
      setTvMovies(state, action) {
        state.tvMovies = action.payload;
      },
      setWarMovies(state, action) {
        state.warMovies = action.payload;
      },
      setWesternMovies(state, action) {
        state.westernMovies = action.payload;
      },
  },
});

export const {
  setNowPlayingMovies,
  setTrendingMovies,
  setIndianMovies,
  setMarathiMovies,
  setTrendingTvShows,
    setActionMovies,
    setAdventureMovies,
    setAnimationMovies,
    setComedyMovies,
    setCrimeMovies,
    setDocumentaryMovies,
    setDramaMovies,
    setFamilyMovies,
    setFantasyMovies,
    setHistoryMovies,
    setHorrorMovies,
    setMusicMovies,
    setMysteryMovies,
    setRomanceMovies,
    setScienceFictionMovies,
    setTvMovies,
    setWarMovies,
    setWesternMovies,
} = moviesSlice.actions;

export default moviesSlice.reducer;
