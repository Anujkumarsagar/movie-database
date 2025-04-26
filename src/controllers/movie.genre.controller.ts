
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

        const movie_id = req.params.movie_id

        if (!movie_id) {
            return res.status(404).json({
                message: "movie_id is not found",
                status: false
            })
        }
        const cacheKey = `movie_${movie_id}`
        const cached = await redis.get(cacheKey)
        

        if (cached) {
            await redis.del(cacheKey)
        }

        const Movie_genre = await client.movie_genre.delete(
            {
                where: {
                    id: Number(movie_id)
                }
            }
        )

        if (!Movie_genre) {
            return res.status(403).json({
                message: "something happend while deleting",
                status: false,
            })
        }

        res.status(200).json({
            message: "movie_genere deleted successfully ",
            status: true,
            data: Movie_genre
        })

    } catch (error) {
        return res.status(500).json({
            message: "somthing error i movie genre deletion ",
            status: false,
            error: error
        })
    }
}


