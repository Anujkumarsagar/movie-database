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



export const getAllMovies = async (req: Request, res: Response): Promise<any> => {
    try {
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
}



export async function getLimitedMovies(req: Request, res: Response): Promise<any> {
    try {
      const pageNum = Math.max(1, parseInt(req.query.page as string) || 1);
      const limitNum = Math.min(100, parseInt(req.query.limit as string) || 20);
      const skip = (pageNum - 1) * limitNum;
  
      const cacheKey = `movies_page_${pageNum}_limit_${limitNum}`;
      const cached = await redis.get(cacheKey);
  
      if (cached) {
        return res.status(200).json({
          message: "Movies fetched from cache",
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
  
      await redis.set(cacheKey, JSON.stringify(movies), 'EX', 60 * 60);
  
      return res.status(200).json({
        message: "Movies fetched successfully",
        data: movies,
        status: true,
      });

    } catch (error) {
      console.error(error);
      return res.status(500).json({
        status: false,
        message: "Error in fetching movies",
        error,
      });
    }
  }
  



// - path: /movies/:movie_id
// method: GET
// description: Retrieve details of a specific movie
// params:
//   movie_id: Integer
// response: Movie object with related genres, actors, directors
// notes: Join with movie_genres, movie_actors, movie_directors; cache response.

export async function getMovieId(req: Request, res: Response) : Promise<any> {
    try {
        const movie_id = req.params.movie_id
        if (!movie_id) {
            res.status(400).json({
                message: "movie id is required",
                status: false
            })
        }
        const cacheKey = `movie_${movie_id}`
        const cached = await redis.get(cacheKey)

        if (cached) {
            return res.status(200).json({
                message: "Movie fetched from cache",
                data: JSON.parse(cached),
                status: true,
            })
        }
        const response = client.movies.findUnique({
            where: {
                id: Number(movie_id)
            }
        })

        if (!response) {
            res.status(404).json({
                message: "Movie not found",
            })
        }
        await redis.set(cacheKey, JSON.stringify(response), 'EX', 60 * 60)
        return res.status(200).json({
            message: "Movie fetched successfully",
            data: response,
            status: true
        })

    } catch (error) {
        res.status(500).json({
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

export async function postMovie(req:Request, res: Response) : Promise<any> {
    try{

        const {title, release_date, duration, description, language, country, poster_url, trailer_url, streaming_url, rating } = req.body

        //validate inputs
        if (!title || !streaming_url) {
            return res.status(400).json({
                message: "Title and streaming URL are required",
                status: false
            });
        }


        const cacheKey = `movie_${title}`
        const cached = await redis.get(cacheKey)
        if (cached) {
            return res.status(200).json({
                message: "Movie fetched from cache",
                data: JSON.parse(cached),
                status: true,
            })
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
                rating
            }
        })
        if (!response) {
            return res.status(404).json({
                message: "Movie not found",
                status: false
            })
        }
        await redis.set(cacheKey, JSON.stringify(response), 'EX', 60 * 60)
        res.status(201).json({
            message: "Movie created successfully",
            data: response,
            status: true
        })

    }catch(error){
        return res.status(500).json({
            message: "server error while creating movie", // corrected spelling of "creating"
            error: error
        })
    }
}





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

export async function deleteMovies(req: Request, res: Response) : Promise<any>{
    try {
        const { movie_id } = req.params
        if (!movie_id) {
            res.status(400).json({
                message: "movie id is required",
                status: false
            })
        }

        const cacheKey = `movie_${movie_id}`
        const cached = await redis.get(cacheKey)

        if (cached) {
            await redis.del(cacheKey)
        }
        const response = await client.movies.delete({
            where: {
                id: Number(movie_id)
            }
        })
        
        if (!response) {
           return  res.status(404).json({
                message: "movie not found",
                status: false
            })
        }

        res.status(200).json({
            message: "movie deleted successfully",
            data: response,
            status: true
        })

    } catch (error) {
        res.status(500).json({
            message: "error in deleting movies",
            error: error
        })
    }
}