// src/cron/checkNewMovies.js
const { getNewMoviesFromGemini } = require('../services/geminiService');
const { saveOrUpdateMovie } = require('../services/movieService');

async function discoverAndSaveMovies() {
  const movies = await getNewMoviesFromGemini(); // Gemini checks for new releases


  await saveOrUpdateMovie(); // DB logic to insert or update
}
module.exports = discoverAndSaveMovies;
