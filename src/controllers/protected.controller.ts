//save movies in database

import { number, string, z } from "zod";
import { enrichMovieWithGemini, Movie } from "../services/geminiService";
import { client } from "../utils/client.prisma";


export const movieSchema = z.object({
  title: z.string(),
  release_date: z.string(),
  duration: z.union([z.number(), z.string()]), // ✅ correct way to allow number or string
  description: z.string(),
  language: z.string(),
  country: z.string(),
  poster: z.string(),
  trailer: z.string(),
  streaming: z.string(),
  rating: z.number(),
  created_at: z.string(),
  updated_at: z.string(),
  genre: z.array(z.number()), // ✅ use z.array for arrays
  movie_actors: z.array(z.any()), // or define a separate schema
  directors: z.array(z.any()),     // or define a separate schema
}); 


export async function postMoviesInDatabase(data: Movie[]) {
    try {
        data.length > 0 && data?.map(async (item, index) => {
            // saving data that gives by gemini ai 
            let validate = movieSchema.safeParse(item);
            if(!validate){
                //use new serevice with another prompt that recognize what field are missing from the informateion and generate via gemini service
            }

            //make more informative by general prompt and tak eresponse from the gemini
            let response: Movie  = await enrichMovieWithGemini(item)
            console.log("movies: with gemini generated", response)


            //create a entry of the updated movie in the database
            const createdMovie = await client.movies.create({
                data:{
                    title: response.title,
                    duration: response.duration || 0,
                    rating: response.rating || 0,
                    streaming: response.streaming || "" ,
                    country: response.country,
                    created_at: response.created_at,
                    description: response.description,
                    directors: response.directors && Array.isArray(response.directors)
                        ? {
                            create: response.directors.map((director: any) => ({
                                first_name: director.first_name || "",
                                last_name: director.last_name || "",
                                bio: director.bio || ""
                            }))
                        }
                        : undefined,

                        // save genre by searching the name of it and save its id with genre id
                        
                        release_date: response.release_date,
                        updated_at: `${Date.now() }` ,
                        language: response.language,
                        trailer: response.trailer,
                        poster: response.poster,
                        // movie_actors -- save with the name and the id 
                }
            })

        })
    } catch (error) {

    }
}

//update movies from database

//delete movie from database

