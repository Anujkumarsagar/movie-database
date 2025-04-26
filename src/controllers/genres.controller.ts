
// # Genres Routes
// - path: /genres
//   method: GET
//   description: Retrieve a list of genres
//   query_params:
//     page: Integer
//     limit: Integer
//   response: Array of genre objects (genre_id, name)
//   notes: Cache genres as they rarely change.

import { Request, Response } from "express";
import { client, redis } from "../utils/client.prisma";


export async function getGenres(req: Request, res: Response) {
    try {

        const pageNum = Math.max(1, parseInt(req.query.page as string) || 1)
        const limitNum = Math.min(100, parseInt(req.query.limit as string) || 20);
        const skip = (pageNum - 1) * limitNum;

        const cacheKey = `genre_page_${pageNum}_limit_${limitNum}`;
        const cached = await redis.get(cacheKey)

        if (cached) {
            return res.status(200).json({
                message: "genres fetched from cache",
                status: true,
                data: JSON.parse(cached)
            })
        }

        const response = await client.genre.findMany({
            skip,
            take: limitNum,
            orderBy: { id: 'asc' }
        })

        if (!response.length) {
            return res.status(404).json({
                message: "No genres found",
                status: false,
            });
        }

        await redis.set(cacheKey, JSON.stringify(response), 'EX', 60 * 60);

        return res.status(200).json({
            message: "Geners fetched successfully",
            data: response,
            status: true,
        });

    } catch (error) {
        res.status(500).json({
            message: "error in get Genres",
            error: error
        })
    }
}

// - path: /genres/:genre_id
//   method: GET
//   description: Retrieve a specific genre
//   params:
//     genre_id: Integer
//   response: Genre object
//   notes: Cache response.

export async function getMovieId(req: Request, res: Response): Promise<any> {
    try {
        const genre_id = req.params.genre_id

        if (!genre_id) {
            res.status(400).json({
                message: "movie id is required",
                status: false
            })
        }
        const cacheKey = `genre_${genre_id}`
        const cached = await redis.get(cacheKey)

        if (cached) {
            return res.status(200).json({
                message: "genre fetched from cache",
                data: JSON.parse(cached),
                status: true,
            })
        }
        const response = client.genre.findUnique({
            where: {
                id: Number(genre_id)
            }
        })

        if (!response) {
            res.status(404).json({
                message: "genre not found",
            })
        }
        await redis.set(cacheKey, JSON.stringify(response), 'EX', 60 * 60)

        res.status(200).json({
            message: "Genre fetched successfully",
            data: response,
            status: true
        })

    } catch (error) {
        res.status(500).json({
            message: "Error in fetching Genre",
            error: error,
            status: false
        })

    }
}



// - path: /genres
//   method: POST
//   description: Create a new genre (admin only)
//   body:
//     name: String (required, unique)
//   response: Created genre object
//   notes: Validate uniqueness.

// - path: /genres/:genre_id
//   method: PUT
//   description: Update a genre (admin only)
//   params:
//     genre_id: Integer
//   body:
//     name: String
//   response: Updated genre object
//   notes: Invalidate cache.




// - path: /genres/:genre_id
//   method: DELETE
//   description: Delete a genre (admin only)
//   params:
//     genre_id: Integer
//   response: Success message
//   notes: Cascades to movie_genres.

export async function deleteGenre(req: Request, res: Response) : Promise<any>{
    try {
        const { genre_id } = req.params
        if (!genre_id) {
            res.status(400).json({
                message: "genre id is required",
                status: false
            })
        }

        const cacheKey = `genre_${genre_id}`
        const cached = await redis.get(cacheKey)

        if (cached) {
            await redis.del(cacheKey)
        }
        const response = await client.genre.delete({
            where: {
                id: Number(genre_id)
            }
        })
        
        if (!response) {
           return  res.status(404).json({
                message: "genre not found",
                status: false
            })
        }

        res.status(200).json({
            message: "genre deleted successfully",
            data: response,
            status: true
        })

    } catch (error) {
        res.status(500).json({
            message: "error in deleting genre",
            error: error
        })
    }
}