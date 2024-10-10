"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.omdbInstance = exports.tmdbInstance = void 0;

var _axios = _interopRequireDefault(require("axios"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var tmdbInstance = _axios["default"].create({
  baseURL: "https://api.themoviedb.org/3"
});

exports.tmdbInstance = tmdbInstance;

var omdbInstance = _axios["default"].create({
  baseURL: "https://www.omdbapi.com"
});

exports.omdbInstance = omdbInstance;