import { Router } from "express";
import { Game, User } from "..";
import { middleware } from "../middlewares/middleware";


export const gameRouter = Router();

gameRouter.get("/",middleware,async (req, res) => {
    const game = await Game.findAll();
    const user = await User.findOne({ where: { id: req.userId } });
    if (user) {
        res.status(200).json({
            data:game
        });
    }else {
        res.status(404).json({ error: "Merci de vous connecter" });
    }
});

gameRouter.get("/:id",middleware,async (req, res) => {
    const game = await Game.findOne({where: { id: req.params.id }});
    if (game) {
        res.status(200).json({
            game
        });
    }else {
        res.status(404).json({ error: "game not found" });
    }
});

gameRouter.post("/",middleware,async (req, res) => {
    const newgame = await Game.create({ joueur1:req.body.joueur1, 
                                        joueur2:req.body.joueur2,
                                        winner:req.body.winner,
                                        bestTime:req.body.bestTime,
                                        objectif:req.body.objectif});
    res.status(200).json({
        newgame
    })
});

gameRouter.put("/:id",async (req, res) => {
    const game = await Game.findOne({where: { id:req.params.id }});
    if (game){
        const upgame = await game.update(req.body);
        res.status(200).json({
            upgame
        })
    }else {
        res.status(404).json({ error: "game not found" });
    }
    
});

gameRouter.delete("/:id", middleware,async (req, res) => {
    const game = await Game.findOne({where: { id:req.params.id }});
    if(game){
        const delgame = await game.destroy();
        res.status(200).json(delgame)
    }
    else {
        res.status(400).json({ error: "game non trouve"})
    }
});