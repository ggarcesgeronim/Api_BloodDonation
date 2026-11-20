import express from "express";
import { PORT } from "./const/const.ts";
import { errorHandler, notFoundHandler } from "./middleware/error.middleware.ts";
import bloodRoutes from "./module/blood/routes/index.ts";

const app = express()

app.use(express.json())

app.get('/', (req, res) => {
    res.status(200).json({
        status: 200,
        message: "Api workig correctly"
    })
})

app.use("/api", bloodRoutes)

app.use(notFoundHandler)
app.use(errorHandler)

app.listen(PORT, () => {
    console.log(`Aplication running in http://localhost:${PORT}`)
})
