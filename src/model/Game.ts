import { DataTypes, Sequelize } from "sequelize";

export const GameModel  = (sequelize: Sequelize) => {
    return sequelize.define('games', {
        joueur1: DataTypes.STRING,
        joueur2: DataTypes.STRING,
        winner: DataTypes.STRING,
        bestTime: DataTypes.INTEGER,
        objectif:DataTypes.INTEGER
    }, { timestamps: false});
}