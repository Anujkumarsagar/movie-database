
// # Movie-Actors Routes
// - path: /movies/:movie_id/actors
//   method: POST
//   description: Associate actors with a movie (admin only)
//   params:
//     movie_id: Integer
//   body:
//     actors: Array of { actor_id: Integer, role: String }
//   response: Success message
//   notes: Bulk insert for efficiency.

import { Request, Response } from "express"
import { client, redis } from "../utils/client.prisma"

// - path: /movies/:movie_id/actors
//   method: DELETE
//   description: Remove actors from a movie (admin only)
//   params:
//     movie_id: Integer
//   body:
//     actor_ids: Array of Integers
//   response: Success message
//   notes: Bulk delete for efficiency.






// ------------------------------------------------------------------------



// # Movie-Directors Routes
// - path: /movies/:movie_id/directors
//   method: POST
//   description: Associate directors with a movie (admin only)
//   params:
//     movie_id: Integer
//   body:
//     director_ids: Array of Integers
//   response: Success message
//   notes: Bulk insert for efficiency.

// - path: /movies/:movie_id/directors
//   method: DELETE
//   description: Remove directors from a movie (admin only)
//   params:
//     movie_id: Integer
//   body:
//     director_ids: Array of Integers
//   response: Success message
//   notes: Bulk delete for efficiency.
