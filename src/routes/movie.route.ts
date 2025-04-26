import { Router } from "express";
import { deleteMovies, getAllMovies, getLimitedMovies, getMovieId, postMovie } from "../controllers/movie.controller";

const movie_router = Router();


movie_router.get("/getallmovie", getAllMovies)
movie_router.get("/getallmovie", getLimitedMovies)
movie_router.get("/getmovieid/:movie_id", getMovieId)
movie_router.delete("/deletemovie/:movie_id", deleteMovies)
movie_router.post("/postmovie", postMovie)


export default movie_router