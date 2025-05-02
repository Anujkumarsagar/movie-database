import { Request, Response, Router } from "express";
import { deleteMovies, getAllMovies, getLimitedMovies, getMovieId, postMovie } from "../controllers/movie.controller";
import { getEnrichedMovies,getReviewsFromTMDB,getNewMoviesFromTMDB } from "../services/geminiService";

const movie_router = Router();


movie_router.get("/getallmovie", getAllMovies)
movie_router.get("/getallmovie", getLimitedMovies)
movie_router.get("/getmovieid/:movie_id", getMovieId)
movie_router.delete("/deletemovie/:movie_id", deleteMovies)
movie_router.get("/postmovie", (req: Request, res: Response) => {
    (
        async () => {


            try {

                const response = await getNewMoviesFromTMDB();

                if (!response) {
                    return res.status(404).json({
                        message: "No movies found",
                        status: false,
                    });
                }

                return res.status(200).json({
                    message: "Movies fetched successfully",
                    data: response,
                    status: true,
                });


            } catch (error) {
                console.error("Error in posting movie:", error);
                return res.status(500).json({
                    message: "Error in posting movie",
                    status: false,
                });
            }
        })().catch(error => {
            console.error("Error in posting movie:", error);
            res.status(500).json({
                message: "Error in posting movie",
                status: false,
            });
        });
});



export default movie_router