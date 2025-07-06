//   import { getEnrichedMovies } from "../services/geminiService";
// import { client } from "../utils/client.prisma";


// async function discoverAndSaveMovies() {
//   const movies = await getEnrichedMovies();
//   if (!Array.isArray(movies) || movies.length === 0) return;

//   for (const movie of movies) {
//     try {
//       const exists = await client.movies.findFirst({
//         where: {
//           title: movie.title,
//           duration: movie.duration,
//           directors: {
//             some: {
//               first_name: { in: movie.directors }
//             }
//           }
//         }
//       });

//       if (exists) {
//         console.log(`Movie ${movie.title} already exists in database`);
//         continue;
//       }

//       await client.movies.create({
//         data: {
//           title: movie.title,
//           duration: movie.duration,
//           country: movie.country || '',
//           release_date: movie.release_date || '',
//           poster: movie.poster || '',
//           directors: movie.directors || [],
//           genres: {
//             create: (movie.genre || []).map(name => ({ name }))
//           },
//           movie_actors: {
//             create: (movie.movie_actors || []).map(name => ({
//               actors: { create: { first_name: name } }
//             }))
//           },
//           trailer: movie.trailer || '',
//           description: movie.description || '',
//           language: movie.language || '',
//           rating_review: movie.rating_review
//             ? {
//                 create: {
//                   rating: movie.rating || 0,
//                   review: movie.rating_review,
//                   created_at: new Date(),
//                   updated_at: new Date(),
//                 }
//               }
//             : undefined,
//           rating_rel: {
//             create: {
//               rating: movie.rating || 0,
//               created_at: new Date(),
//               updated_at: new Date(movie.release_date || Date.now()),
//             }
//           },
//           created_at: new Date(),
//           updated_at: new Date(),
//         }
//       });

//       console.log(`Movie ${movie.title} added to database`);
//     } catch (err) {
//       console.error(`Error processing movie ${movie.title}:`, err);
//     }
//   }
// }

// module.exports = discoverAndSaveMovies;
