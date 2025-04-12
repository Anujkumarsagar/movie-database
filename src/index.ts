import {PrismaClient} from "@prisma/client"
import  express  from "express"
import authRouter from "./routes/auth.route"
const prisma = new PrismaClient()

const app = express()
app.use(express.json())


app.use("/auth", authRouter)

app.listen(3000, () =>{
    console.log("Server is running on port 3000")
    console.log("Database is connected")
})