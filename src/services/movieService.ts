import { client } from "../utils/client.prisma";
import { GENRE_ID_TO_NAME, getEnrichedMovies, Movie } from "./geminiService";

const saveOrUpdateMovieService = () => {
    // Logic to save or update movie in the database

}

export const createMovie = async (movie: Movie & { rating_review?: string }) => {
    return client.movies.create({
        data: {
            title: movie.title,
            duration: movie.duration || 0,
            country: movie.country || '',
            release_date: movie.release_date ? new Date(movie.release_date) : null,
            poster: movie.poster || '',
            streaming: movie.streaming || '',
            rating: movie.rating || 0,
            description: movie.description || '',
            language: movie.language || '',
            directors: {
                create: (movie.directors || []).map(name => ({
                    first_name: name,
                    last_name: '',
                    bio: ''
                }))
            },
            genre: {
                create: (movie.genres || [])
                    .map((id: string) => GENRE_ID_TO_NAME[parseInt(id)])
                    .filter(Boolean)
                    .map((name: string) => ({
                        Genre: {
                            connectOrCreate: {
                                where: { name },
                                create: { name }
                            }
                        }
                    }))
            },
            movie_actors: {
                create: (movie.movie_actors || []).map(name => ({
                    actors: {
                        create: {
                            first_name: name,
                            last_name: '',
                            bio: ''
                        }
                    }
                }))
            },
            trailer: movie.trailer || '',
            rating_rel: movie.rating_rel || undefined,
            created_at: new Date(),
            updated_at: new Date(),
        }
    });
};

export async function discoverAndSaveMovies() {
    const movies = await getEnrichedMovies();
    if (!Array.isArray(movies) || movies.length === 0) return;

    for (const movie of movies) {
        try {
            // Map genre IDs to strings if needed, or fetch genre names from your DB
            const genreNames = (movie.genre || []).map(String);

            await createMovie({
                ...movie,
                genre: genreNames,
                rating_review: movie?.audience_reaction || '', // Use audience_reaction as review
            });

            console.log(`Movie ${movie.title} added to database`);
        } catch (err) {
            console.error(`Error processing movie ${movie.title}:`, err);
        }
    }
}