import { DataTypes, Sequelize } from "sequelize";

export const UserModel  = (sequelize: Sequelize) => {
    return sequelize.define('users', {
        login: DataTypes.STRING,
        password: DataTypes.STRING
    }, { timestamps: false});
}