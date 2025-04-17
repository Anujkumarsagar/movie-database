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

import { PrismaClient } from "@prisma/client";
import { RequiredExtensionArgs } from "@prisma/client/runtime/library";
import { Request, Response } from "express";
const client = new PrismaClient()


export function getAllMovies(req: Request, res: Response) {
    try {

        const response = client.movies.findMany({
            orderBy: {
                id: 'asc',
            },
        })

        console.log(response)

        if (response.length <= 0) {
            return res.status(404).json({
                message: " movies are less than 0"
            })
        }

        return res.status(200).json({
            message: " movies fetched successfully",
            data: response
        })

    } catch (error) {
        return res.status(500).json({
            message: "error in fetching all movies" // corrected the typo here
        })
    }
}


export function getLimitedMovies(req: Request, res: Response) {
    try {
        const { page = 1, limit = 20 } = req.query; // default values

        const movies = client.movies.findMany({
            skip: (Number(page) - 1) * Number(limit),
            take: Number(limit),
            orderBy: {
                id: 'asc',
            },
        });

        if (movies.length <= 0) {
            return res.status(404).json({
                message: "No movies found",
                status: false
            })
        }

        return res.status(200).json({
            message: "Movies fetched successfully",
            data: movies,
            status: true
        });

    } catch (error) {

        return res.status(500).json({
            status: false,
            message: "Error in fetching movies"
            error: error
        })
    }
}




// - path: /movies/:movie_id
// method: GET
// description: Retrieve details of a specific movie
// params:
//   movie_id: Integer
// response: Movie object with related genres, actors, directors
// notes: Join with movie_genres, movie_actors, movie_directors; cache response.

export function getMovieId(req: Request, res: Response) {
    try {
        const { movie_id } = req.params

        const response = client.movies.findUnique({
            where: {
                id: Number(movie_id)
            }
        })

        if (!response) {
            return res.status(404).json({
                message: "Movie not found",
            })
        }

        return res.status(200).json({
            message: "Movie fetched successfully",
            data: response,
            status: true
        })

    } catch (error) {
        return res.status(500).json({
            message: "Error in fetching movie",
            error: error,
            status: false
        })

    }
}

// - path: /movies
// method: POST
// description: Create a new movie (admin only)
// body:
//   title: String (required)
//   release_date: Date
//   duration: Integer
//   description: String
//   language: String
//   country: String
//   poster_url: String
//   trailer_url: String
//   streaming_url: String (required)
//   rating: Float
// response: Created movie object
// notes: Validate input; update genres and actors via separate endpoints.

// - path: /movies/:movie_id
// method: PUT
// description: Update a movie (admin only)
// params:
//   movie_id: Integer
// body: Same as POST, partial updates allowed
// response: Updated movie object
// notes: Invalidate cache on update.

// - path: /movies/:movie_id
// method: DELETE
// description: Delete a movie (admin only)
// params:
//   movie_id: Integer
// response: Success message
// notes: Cascades to movie_genres, movie_actors, movie_directors, ratings, watchlist.