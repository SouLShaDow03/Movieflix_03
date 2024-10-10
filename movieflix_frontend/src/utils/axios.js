import axios from "axios";

const tmdbInstance = axios.create({
  baseURL: "https://api.themoviedb.org/3",
});

const omdbInstance = axios.create({
  baseURL: "https://www.omdbapi.com",
});


export {tmdbInstance,omdbInstance};
