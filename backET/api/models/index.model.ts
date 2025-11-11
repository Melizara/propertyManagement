// models/index.ts
import type { Sequelize } from "sequelize";
import { initUser, User } from "./user.model.ts";
import { initStory, Story } from "./story.model.ts";
import { initTenant, Tenant } from "./tenant.model.ts";

export const initModels = (sequelize: Sequelize) => {
    // Initialiser les modèles
    initUser(sequelize);
    initStory(sequelize);
    initTenant(sequelize);

    // Définir les relations entre les modèles
    User.hasMany(Story, {
        foreignKey: "authorId",
        as: "stories",
    });

    Story.belongsTo(User, {
        foreignKey: "authorId",
        as: "author",
    });

    User.hasMany(Tenant, {
        foreignKey: "userMatricule",
        as: "tenants",
    });

    Tenant.belongsTo(User, {
        foreignKey: "userMatricule",
        as: "user"
    });

};

export { User, Story, Tenant };
