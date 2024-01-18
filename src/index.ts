import "dotenv/config";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { Sequelize, DataTypes} from "sequelize";
import { UserModel } from "./model/User";
import { GameModel } from "./model/Game";

import { authRouter } from "./router/auth";
import { IUser, userRouter } from "./router/user";
import { gameRouter } from "./router/game";
import { Server } from "socket.io";
import { createServer } from "http";

export const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'db/database.sqlite'
});

const app = express();
export const User = UserModel(sequelize);
export const Game = GameModel(sequelize);
const server = createServer(app);
const io = new Server(server);

sequelize.sync({ force: true });
//sequelize.sync();


app.use(cors());
app.use(bodyParser.json());

const apiRouter = express.Router();
apiRouter.use('/auth', authRouter);
apiRouter.use('/users',userRouter);
apiRouter.use('/games',gameRouter);

app.use("/", apiRouter);

let winner;
let tempsLePlusProche;
let joueurs:IUser[]=[];

io.on('connection', (socket) => {
  socket.on('ready', () => {

    let objectif = Math.floor(Math.random()*10);
    joueurs.push({id:socket.id, time:0});
    console.log('player ready',socket.id);

    if (joueurs.length>0){
      socket.emit('game-start', objectif);
    }

    const starttime = new Date().getTime();
    socket.on('play', async () => {


      const endtime = new Date().getTime();

      let convertionTime = (endtime-starttime)*1000;
      const joueurCourant = joueurs.find(joueur => joueur.id === socket.id);

      if (joueurCourant){
        joueurCourant.time= convertionTime;
      }
  
      if((objectif - joueurs[0].time) < (objectif - joueurs[1].time)){
        winner=joueurs[0].id;
        tempsLePlusProche = joueurs[0].time;
      }else{
        winner=joueurs[1].id;
        tempsLePlusProche = joueurs[1].time;
      }
      
      await Game.create({ joueur1:joueurs[0].id, 
                          joueur2:joueurs[1].id,
                          winner:winner,
                          bestTime:tempsLePlusProche,
                          objectif:objectif});
        
      socket.emit('game-end',winner, tempsLePlusProche);
      joueurs.splice(0, joueurs.length);
    });
  });
});



app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}!`)
});
