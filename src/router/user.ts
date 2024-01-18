import { Router } from "express";
import jwt from 'jsonwebtoken'
import { IJwtInfo } from "./auth";
import { middleware } from "../middlewares/middleware";
import { User } from "..";

export const userRouter = Router();

export interface IUser{
    id:string,
    time:number
}

userRouter.get("/check-auth", middleware,async (req, res) => {
    const user = await User.findOne({ where: { id: req.userId } });
    if (user) {
        res.json({
            user
        });
    } else {
        res.status(404).json({ error: "Utilisateur non trouvé" });
    }
});
