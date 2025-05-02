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

// Retrieve a list of genres
export async function getGenres(req: Request, res: Response) {
    try {
        const pageNum = Math.max(1, parseInt(req.query.page as string) || 1);
        const limitNum = Math.min(100, parseInt(req.query.limit as string) || 20);
        const skip = (pageNum - 1) * limitNum;

        const cacheKey = `genres_page_${pageNum}_limit_${limitNum}`;
        const cachedGenres = await redis.get(cacheKey);

        if (cachedGenres) {
            return res.status(200).json({
                message: "Genres fetched successfully (from cache)",
                data: JSON.parse(cachedGenres),
                status: true,
            });
        }

        const response = await client.genre.findMany({
            skip,
            take: limitNum,
            orderBy: { id: 'asc' },
        });

        if (!response.length) {
            return res.status(404).json({
                message: "No genres found",
                status: false,
            });
        }

        // Cache the result
        await redis.set(cacheKey, JSON.stringify(response), "EX", 60 * 60); // Cache for 1 hour

        return res.status(200).json({
            message: "Genres fetched successfully",
            data: response,
            status: true,
        });

    } catch (error) {
        console.error("Error in fetching genres:", error);
        return res.status(500).json({
            message: "Error in fetching genres",
            error: error,
            status: false,
        });
    }
}

// Retrieve a specific genre
export async function getGenreById(req: Request, res: Response): Promise<any> {
    try {
        const genre_id = req.params.genre_id;

        if (!genre_id) {
            return res.status(400).json({
                message: "Genre ID is required",
                status: false,
            });
        }

        const cacheKey = `genre_${genre_id}`;
        const cachedGenre = await redis.get(cacheKey);

        if (cachedGenre) {
            return res.status(200).json({
                message: "Genre fetched successfully (from cache)",
                data: JSON.parse(cachedGenre),
                status: true,
            });
        }

        const response = await client.genre.findUnique({
            where: {
                id: Number(genre_id),
            },
        });

        if (!response) {
            return res.status(404).json({
                message: "Genre not found",
                status: false,
            });
        }

        // Cache the result
        await redis.set(cacheKey, JSON.stringify(response), "EX", 60 * 60); // Cache for 1 hour

        return res.status(200).json({
            message: "Genre fetched successfully",
            data: response,
            status: true,
        });

    } catch (error) {
        console.error("Error in fetching genre:", error);
        return res.status(500).json({
            message: "Error in fetching genre",
            error: error,
            status: false,
        });
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

// Delete a genre
export async function deleteGenre(req: Request, res: Response): Promise<any> {
    try {
        const { genre_id } = req.params;

        if (!genre_id) {
            return res.status(400).json({
                message: "Genre ID is required",
                status: false,
            });
        }

        // Invalidate cache for this genre
        const cacheKey = `genre_${genre_id}`;
        await redis.del(cacheKey);

        const response = await client.genre.delete({
            where: {
                id: Number(genre_id),
            },
        });

        if (!response) {
            return res.status(404).json({
                message: "Genre not found",
                status: false,
            });
        }

        return res.status(200).json({
            message: "Genre deleted successfully",
            data: response,
            status: true,
        });

    } catch (error) {
        console.error("Error in deleting genre:", error);
        return res.status(500).json({
            message: "Error in deleting genre",
            error: error,
            status: false,
        });
    }
}