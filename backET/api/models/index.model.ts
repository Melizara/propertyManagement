// models/index.ts
import type { Sequelize } from "sequelize";
import { initUser, User } from "./user.model.ts";
import { initStory, Story } from "./story.model.ts";

export const initModels = (sequelize: Sequelize) => {
    // Initialiser les modèles
    initUser(sequelize);
    initStory(sequelize);

    // Définir les relations entre les modèles
    User.hasMany(Story, {
        foreignKey: "authorId",
        as: "stories",
    });

    Story.belongsTo(User, {
        foreignKey: "authorId",
        as: "author",
    });
};

export { User, Story };
