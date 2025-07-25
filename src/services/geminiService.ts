import { GoogleGenerativeAI } from '@google/generative-ai';
import axios, { AxiosHeaders } from 'axios';
import dotenv from 'dotenv';
import { redis } from '../utils/client.prisma';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

export const GENRE_ID_TO_NAME: Record<number, string> = {
  28: "Action",
  12: "Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  99: "Documentary",
  18: "Drama",
  10751: "Family",
  14: "Fantasy",
  36: "History",
  27: "Horror",
  10402: "Music",
  9648: "Mystery",
  10749: "Romance",
  878: "Science Fiction",
  10770: "TV Movie",
  53: "Thriller",
  10752: "War",
  37: "Western"
  // Add more as needed
};

export interface Movie {
    title: string;
    release_date: string;
    duration: number | undefined;
    description: string;
    language: string;
    country: string;
    poster: string;
    trailer: string;
    streaming: string | null;
    rating: number | undefined;
    created_at: Date;
    updated_at: Date;
    genre: string[] | null;
    movie_actors: string[];
    directors: string[];
    audience_reaction: string;
    rating_review: string;
    rating_rel: any | undefined;
    genres: string[];
}

interface Review {
    author: string;
    content: string;
    created_at: string;
    rating: number | null;
}

const getNewMoviesFromTMDB = async (): Promise<Movie[]> => {
    try {
        const tmdbBaseUrl = 'https://api.themoviedb.org/3';
        const response = await axios.get(`${tmdbBaseUrl}/movie/now_playing`,
            {
                headers: {
                    accept: 'application/json',
                    Authorization: `Bearer ${process.env.TMDB_API_KEY}`
                },
                params: {
                    language: 'en-US',
                    region: 'US',
                    page: 1,
                },
            });


        console.log("The Response  Is: ", response)

        const movies = response.data.results.map((movie: any) => ({
            title: movie.title,
            release_date: movie.release_date,
            duration: null,
            description: movie.overview,
            language: movie.original_language,
            country: null,
            poster: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
            trailer: null,
            streaming: null,
            rating: movie.vote_average,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            genres: movie.genre_ids,
            movie_actors: [],
            directors: [],

        }));

        if (!movies || movies.length <= 0) {
            await getNewMoviesFromTMDB();
        }

        return movies;
    } catch (err: any) {
        console.error("Error fetching new movies from TMDB:", err.message);
        return [];
    }
};

const getReviewsFromTMDB = async (movieId: number): Promise<Review[]> => {
    try {
        const tmdbApiKey = process.env.TMDB_API_KEY;
        const tmdbBaseUrl = 'https://api.themoviedb.org/3';
        const response = await axios.get(`${tmdbBaseUrl}/movie/${movieId}/reviews`, {
            params: {
                api_key: tmdbApiKey,
                language: 'en-US',
            },
        });

        const reviews = response.data.results.map((review: any) => ({
            author: review.author,
            content: review.content,
            created_at: review.created_at,
            rating: review.author_details.rating || null,
        }));

        return reviews;
    } catch (err: any) {
        console.error(`Error fetching reviews for movie ID ${movieId} from TMDB:`, err.message);
        return [];
    }
};

const enrichMoviesWithGemini = async (movies: Movie[]): Promise<Movie[]> => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const prompt = `
        You are a movie data enrichment assistant.
        Enhance the following movie data with additional insights, such as potential streaming platforms, audience reactions, and any missing details.
        Input:
        ${JSON.stringify(movies, null, 2)}
        Output:
        Return the enriched movie data in the same format as the input.
        `;

        const result = await model.generateContent(prompt);
        const response = result.response;
        console.log("Gemini response:", response);

        const text = response.text();
        console.log("Gemini response text:", text);

        if (!text) {
            console.error("Gemini response is empty or invalid.");
            return movies;
        }

        const cleanedText = text.replace(/```json|```/g, "").trim();
        const enrichedMovies: Movie[] = JSON.parse(cleanedText);
        return enrichedMovies;
    } catch (err: any) {
        console.error("Error enriching movies with Gemini:", err.message);
        return movies;
    }
};

const enrichMovieWithGemini = async (movies: Movie): Promise<Movie> => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const prompt = `
        You are a movie data enrichment assistant.
        Enhance the following movie data with additional insights, such as potential streaming platforms, audience reactions, and any missing details.
        Input:
        ${JSON.stringify(movies, null, 2)}
        Output:
        Return the enriched movie data in the same format as the input.
        `;

        const result = await model.generateContent(prompt);
        const response = result.response;
        console.log("Gemini response:", response);

        const text = response.text();
        console.log("Gemini response text:", text);

        if (!text) {
            console.error("Gemini response is empty or invalid.");
            return movies;
        }

        const cleanedText = text.replace(/```json|```/g, "").trim();
        const enrichedMovies: Movie = JSON.parse(cleanedText);
        return enrichedMovies;
    } catch (err: any) {
        console.error("Error enriching movies with Gemini:", err.message);
        return movies;
    }
};

const getEnrichedMovies = async (): Promise<Movie[]> => {
    try {
        const tmdbMovies = await getNewMoviesFromTMDB();
        console.log("The tmdb movies is : ", tmdbMovies)
        const enrichedMovies = await enrichMoviesWithGemini(tmdbMovies);
        return enrichedMovies;
    } catch (err: any) {
        console.error("Error combining TMDB and Gemini AI:", err.message);
        return [];
    }
};

export {
    getNewMoviesFromTMDB,
    getReviewsFromTMDB,
    enrichMovieWithGemini,
    getEnrichedMovies,
};
