import { Request, Response, Router } from "express";
import { deleteMovies, getAllMovies, getEnrichedMoviesController, getLimitedMovies, getMovieId, getNewMoviesFromTMDBController, postMovie } from "../controllers/movie.controller";
import { getEnrichedMovies, getReviewsFromTMDB, getNewMoviesFromTMDB } from "../services/geminiService";
import { discoverAndSaveMovies } from "../services/movieService";

const movie_router = Router();


movie_router.get("/getallmovie", getAllMovies)
movie_router.get("/getallmovie", getLimitedMovies)
movie_router.get("/getmovieid/:movie_id", getMovieId)
movie_router.delete("/deletemovie/:movie_id", deleteMovies)
// movie_router.get("/postmovie", getNewMoviesFromTMDBController);
movie_router.get("/enrichedmovies", discoverAndSaveMovies)
// movie_router.post("/postmovie", );



export default movie_router