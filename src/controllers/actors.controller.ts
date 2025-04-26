
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

import { Request, response, Response } from "express";
import { client, redis } from "../utils/client.prisma";
import { CalendarCheck } from "lucide-react";

export async function getActors(req: Request, res: Response) {
    try {

        const pageNum = Math.max(1, parseInt(req.query.page as string) || 1)
        const limitNum = Math.min(100, parseInt(req.query.limit as string) || 20);
        const skip = (pageNum - 1) * limitNum;

        const cacheKey = `actors_page_${pageNum}_limit_${limitNum}`;
        const cached = await redis.get(cacheKey)

        if (cached) {
            return res.status(200).json({
                message: "Actors fetched from cache",
                status: true,
                data: JSON.parse(cached)
            })
        }

        const response = await client.actors.findMany({
            skip,
            take: limitNum,
            orderBy: { id: 'asc' }
        })

        if (!response.length) {
            return res.status(404).json({
                message: "No actors found",
                status: false,
            });
        }

        await redis.set(cacheKey, JSON.stringify(response), 'EX', 60 * 60);

        return res.status(200).json({
            message: "Actors fetched successfully",
            data: response,
            status: true,
        });

    } catch (error) {
        res.status(500).json({
            message: "error in deleting movies",
            error: error
        })
    }
}


// - path: /actors/:actor_id
//   method: GET
//   description: Retrieve a specific actor
//   params:
//     actor_id: Integer
//   response: Actor object with related movies
//   notes: Join with movie_actors; cache response.

export async function getActorById(req: Request, res: Response) {
    try {

        const actor_id = req.params.movie_id;

        const cacheKey = `actors_${actor_id}`;
        const cached = await redis.get(cacheKey);

        if (cached) {
            return res.status(200).json({
                message: "Actors fetched successfully",
                data: JSON.parse(cached),
                status: true,
            })
        }

        const response = await client.actors.findUnique({
            where: {
                id: Number(actor_id)
            }
        })

        if (!response) {
            return res.status(404).json({
                message: "actor detail not found",
                status: false,
            })
        }

        await redis.set(cacheKey, JSON.stringify(response), 'EX', 60 * 60)

        res.status(200).json({
            message: "actor found successfully ",
            status: true,
            data: response
        })



    } catch (error) {
        res.status(500).json({
            message: "Error in fetching actors",
            error: error,
            status: false
        })
    }
}



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

export async function deleteActor(req: Request, res: Response) {
    try {

        const actor_id = req.params.actor_id;

        if (!actor_id) {
            return res.status(404).json({
                message: "actor id must be needed ",
                status: false,
            })
        }


        const cacheKey = `actors_${actor_id}`;
        const cached = await redis.get(cacheKey);

        if (cached) {
            const response = await redis.del(cacheKey)
            res.status(200).json({
                message: "actor deleted successfully ",
                status: false,
                data: response
            })
        }

        const response = await client.actors.delete({
            where: {
                id: Number(actor_id)
            }
        })

        if(!response){
            return res.status(403).json({
                message:"actor id is invalid or can't find actor ",
                status: false,
            })
        }

        res.status(200).json({
            message: "actor deleted successfully ",
            status : false,
            data: response
        })

    } catch (error) {
        res.status(500).json({
            message: "Error in fetching actors",
            error: error,
            status: false
        })
    }
}
