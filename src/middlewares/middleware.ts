import { NextFunction, Request, Response} from "express";
import { User } from "..";
import jwt from 'jsonwebtoken'
import { IJwtInfo } from "../router/auth";

export const middleware = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.replace('Bearer ', '')
    if(token){
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET!) as IJwtInfo
            if(decoded){
                req.userId = decoded.userId
                next();
            }
            else {
                res.status(401).json({error: 'token non valide'})
            }
        }
        catch(e){
            res.status(401).json({error: 'token non valide'})
        }
        
    }
    else {
        res.status(401).json({error: 'pas de token'})
    }
}