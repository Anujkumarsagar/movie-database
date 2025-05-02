// path: /movies
// method: GET
// description: Retrieve a list of movies with pagination, filtering, and sorting
// query_params:
//   page: Integer (default: 1)
//   limit: Integer (default: 20, max: 100)
//   sort: String (e.g., "title", "release_date", "rating")
//   order: String (e.g., "asc", "desc")
//   title: String (partial match, uses idx_movies_title)
//   genre: String (filter by genre name)
//   language: String
//   country: String
//   min_rating: Float
//   release_year: Integer
// response: Array of movie objects (movie_id, title, release_date, rating, etc.)
// notes: Use indexed fields for filtering; cache results for popular queries.


import { Request, Response } from "express";
import { client, redis } from "../utils/client.prisma";

// Retrieve a list of movies with pagination, filtering, and sorting
export const getAllMovies = async (req: Request, res: Response): Promise<any> => {
    try {
        const cacheKey = "all_movies";
        const cachedMovies = await redis.get(cacheKey);

        if (cachedMovies) {
            return res.status(200).json({
                message: "Movies fetched successfully (from cache)",
                data: JSON.parse(cachedMovies),
                status: true,
            });
        }

        const response = await client.movies.findMany({
            orderBy: {
                id: 'asc',
            },
        });

        if (!response.length) {
            return res.status(404).json({
                message: "No movies found",
                status: false,
            });
        }

        // Cache the result
        await redis.set(cacheKey, JSON.stringify(response), "EX", 60 * 60); // Cache for 1 hour

        return res.status(200).json({
            message: "Movies fetched successfully",
            data: response,
            status: true,
        });

    } catch (error) {
        console.error("Error fetching all movies:", error);
        return res.status(500).json({
            message: "Error in fetching all movies",
            status: false,
        });
    }
};

// Retrieve a list of movies with pagination
export async function getLimitedMovies(req: Request, res: Response): Promise<any> {
    try {
        const pageNum = Math.max(1, parseInt(req.query.page as string) || 1);
        const limitNum = Math.min(100, parseInt(req.query.limit as string) || 20);
        const skip = (pageNum - 1) * limitNum;

        const cacheKey = `movies_page_${pageNum}_limit_${limitNum}`;
        const cached = await redis.get(cacheKey);

        if (cached) {
            return res.status(200).json({
                message: "Movies fetched successfully (from cache)",
                data: JSON.parse(cached),
                status: true,
            });
        }

        const movies = await client.movies.findMany({
            skip,
            take: limitNum,
            orderBy: { id: 'asc' },
        });

        if (!movies.length) {
            return res.status(404).json({
                message: "No movies found",
                status: false,
            });
        }

        // Cache the result
        await redis.set(cacheKey, JSON.stringify(movies), "EX", 60 * 60); // Cache for 1 hour

        return res.status(200).json({
            message: "Movies fetched successfully",
            data: movies,
            status: true,
        });

    } catch (error) {
        console.error("Error fetching limited movies:", error);
        return res.status(500).json({
            status: false,
            message: "Error in fetching movies",
            error,
        });
    }
}

// Retrieve details of a specific movie
export async function getMovieId(req: Request, res: Response): Promise<any> {
    try {
        const movie_id = req.params.movie_id;

        if (!movie_id) {
            return res.status(400).json({
                message: "movie_id is required",
                status: false,
            });
        }

        const cacheKey = `movie_${movie_id}`;
        const cachedMovie = await redis.get(cacheKey);

        if (cachedMovie) {
            return res.status(200).json({
                message: "Movie fetched successfully (from cache)",
                data: JSON.parse(cachedMovie),
                status: true,
            });
        }

        const response = await client.movies.findUnique({
            where: {
                id: Number(movie_id),
            },
        });

        if (!response) {
            return res.status(404).json({
                message: "Movie not found",
                status: false,
            });
        }

        // Cache the result
        await redis.set(cacheKey, JSON.stringify(response), "EX", 60 * 60); // Cache for 1 hour

        return res.status(200).json({
            message: "Movie fetched successfully",
            data: response,
            status: true,
        });

    } catch (error) {
        console.error("Error fetching movie:", error);
        return res.status(500).json({
            message: "Error in fetching movie",
            error,
            status: false,
        });
    }
}

// Create a new movie
export async function postMovie(req: Request, res: Response): Promise<any> {
    try {
        const { title, release_date, duration, description, language, country, poster_url, trailer_url, streaming_url, rating } = req.body;

        // Validate inputs
        if (!title || !streaming_url) {
            return res.status(400).json({
                message: "Title and streaming URL are required",
                status: false,
            });
        }

        const response = await client.movies.create({
            data: {
                title,
                release_date,
                duration,
                description,
                language,
                country,
                poster: poster_url,
                trailer: trailer_url,
                streaming: streaming_url,
                rating,
            },
        });

        // Invalidate cache for all movies
        await redis.del("all_movies");

        return res.status(201).json({
            message: "Movie created successfully",
            data: response,
            status: true,
        });

    } catch (error) {
        console.error("Error creating movie:", error);
        return res.status(500).json({
            message: "Server error while creating movie",
            error,
            status: false,
        });
    }
}

// Delete a movie
export async function deleteMovies(req: Request, res: Response): Promise<any> {
    try {
        const { movie_id } = req.params;

        if (!movie_id) {
            return res.status(400).json({
                message: "movie_id is required",
                status: false,
            });
        }

        const response = await client.movies.delete({
            where: {
                id: Number(movie_id),
            },
        });

        if (!response) {
            return res.status(404).json({
                message: "Movie not found",
                status: false,
            });
        }

        // Invalidate cache for the specific movie and all movies
        await redis.del(`movie_${movie_id}`);
        await redis.del("all_movies");

        return res.status(200).json({
            message: "Movie deleted successfully",
            data: response,
            status: true,
        });

    } catch (error) {
        console.error("Error deleting movie:", error);
        return res.status(500).json({
            message: "Error in deleting movie",
            error,
            status: false,
        });
    }
}