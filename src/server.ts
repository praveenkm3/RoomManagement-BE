import express from "express";
import "dotenv/config";
import { AppDataSource } from "./config/db.ts";
import authRoutes from "./routes/auth_routes.ts"; 
import adminRoutes from "./routes/admin_routes.ts"
import bookingRoutes from "./routes/booking_routes.ts"
import cookieParser from "cookie-parser";
import { authMiddleware } from "./middleware/auth_middleware.ts";
import {adminMiddleware} from "./middleware/admin_middleware.ts";
import { getProfile, refresh } from "./controllers/auth_controllers.ts";
import cors from "cors";

const app = express();
const PORT = process.env.PORT;

app.use(cors({
    origin:"http://localhost:5173",
    credentials:true,
}));

app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(cookieParser());


app.post('/api/refresh',refresh);
app.use('/api/',authRoutes);
app.use(authMiddleware);
app.get('/user/profile',getProfile)
app.use('/book/',bookingRoutes)
app.use('/admin/',adminMiddleware,adminRoutes);



try {
    await AppDataSource.initialize();
    console.log("database connected");

    app.listen(PORT, () => {
        console.log(`http://localhost:${PORT}`);
    });
} catch (error) {
    console.error("Connection failed:", error);
};