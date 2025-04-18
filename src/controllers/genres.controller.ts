
// # Genres Routes
// - path: /genres
//   method: GET
//   description: Retrieve a list of genres
//   query_params:
//     page: Integer
//     limit: Integer
//   response: Array of genre objects (genre_id, name)
//   notes: Cache genres as they rarely change.

// - path: /genres/:genre_id
//   method: GET
//   description: Retrieve a specific genre
//   params:
//     genre_id: Integer
//   response: Genre object
//   notes: Cache response.

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
