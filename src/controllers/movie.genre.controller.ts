
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
