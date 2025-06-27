import { Request, Response, Router } from "express";
import { deleteMovies, getAllMovies, getLimitedMovies, getMovieId, getNewMoviesFromTMDBController, postMovie } from "../controllers/movie.controller";
import { getEnrichedMovies, getReviewsFromTMDB, getNewMoviesFromTMDB } from "../services/geminiService";

const movie_router = Router();


movie_router.get("/getallmovie", getAllMovies)
movie_router.get("/getallmovie", getLimitedMovies)
movie_router.get("/getmovieid/:movie_id", getMovieId)
movie_router.delete("/deletemovie/:movie_id", deleteMovies)
movie_router.get("/postmovie", getNewMoviesFromTMDBController);




export default movie_router