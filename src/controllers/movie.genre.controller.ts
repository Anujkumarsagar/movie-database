import { Request, Response } from "express";
import { client, redis } from "../utils/client.prisma";

// # Movie-Genres Routes
// - path: /movies/:movie_id/genres
//   method: POST
//   description: Associate genres with a movie (admin only)
//   params:
//     movie_id: Integer
//   body:
//     genre_ids: Array of Integers
//   response: Success message
//   notes: Bulk insert for efficiency.

// - path: /movies/:movie_id/genres
//   method: DELETE
//   description: Remove genres from a movie (admin only)
//   params:
//     movie_id: Integer
//   body:
//     genre_ids: Array of Integers
//   response: Success message
//   notes: Bulk delete for efficiency.

export async function movieGenre(req: Request, res: Response) {
    try {
        const movie_id = req.params.movie_id;

        if (!movie_id) {
            return res.status(400).json({
                message: "movie_id is required",
                status: false,
            });
        }

        // Invalidate Redis cache for the movie
        const cacheKey = `movie_${movie_id}_genres`;
        const cachedData = await redis.get(cacheKey);

        if (cachedData) {
            await redis.del(cacheKey);
            console.log(`Cache invalidated for key: ${cacheKey}`);
        }

        // Delete associated genres for the movie
        const movieGenre = await client.movie_genre.deleteMany({
            where: {
                movie_id: Number(movie_id),
            },
        });

        if (!movieGenre.count) {
            return res.status(404).json({
                message: "No genres found for the specified movie",
                status: false,
            });
        }

        return res.status(200).json({
            message: "Movie genres deleted successfully",
            status: true,
            data: movieGenre,
        });

    } catch (error) {
        console.error("Error in deleting movie genres:", error);
        return res.status(500).json({
            message: "An error occurred while deleting movie genres",
            status: false,
            error: error,
        });
    }
}


