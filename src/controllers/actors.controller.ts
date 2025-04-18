
// # Actors Routes
// - path: /actors
//   method: GET
//   description: Retrieve a list of actors
//   query_params:
//     page: Integer
//     limit: Integer
//     name: String (partial match on first_name or last_name)
//   response: Array of actor objects (actor_id, first_name, last_name, etc.)
//   notes: Consider full-text search for name filtering.

// - path: /actors/:actor_id
//   method: GET
//   description: Retrieve a specific actor
//   params:
//     actor_id: Integer
//   response: Actor object with related movies
//   notes: Join with movie_actors; cache response.

// - path: /actors
//   method: POST
//   description: Create a new actor (admin only)
//   body:
//     first_name: String (required)
//     last_name: String (required)
//     birth_date: Date
//     bio: String
//   response: Created actor object
//   notes: Validate input.

// - path: /actors/:actor_id
//   method: PUT
//   description: Update an actor (admin only)
//   params:
//     actor_id: Integer
//   body: Same as POST, partial updates allowed
//   response: Updated actor object
//   notes: Invalidate cache.

// - path: /actors/:actor_id
//   method: DELETE
//   description: Delete an actor (admin only)
//   params:
//     actor_id: Integer
//   response: Success message
//   notes: Cascades to movie_actors.
