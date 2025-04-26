import {PrismaClient} from "@prisma/client"
import  express  from "express"
import authRouter from "./routes/auth.route"
import movie_router from "./routes/movie.route"
const prisma = new PrismaClient()

const app = express()
app.use(express.json())


app.use("/auth", authRouter)
app.use("/v1/api", movie_router)

app.listen(3000, () =>{
    console.log("Server is running on port 3000")
    console.log("Database is connected")
})