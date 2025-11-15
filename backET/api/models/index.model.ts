// models/index.ts
import type { Sequelize } from "sequelize";
import { initUser, User } from "./user.model.ts";
import { initStory, Story } from "./story.model.ts";
import { initTenant, Tenant } from "./tenant.model.ts";
import { initLand, Land } from "./land.model.ts";
import { initStation, Station } from "./station.model.ts";

export const initModels = (sequelize: Sequelize) => {
    // Initialiser les modèles
    initUser(sequelize);
    initStory(sequelize);
    initTenant(sequelize);
    initLand(sequelize);
    initStation(sequelize);

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

    User.hasMany(Land, {
        foreignKey: "userMatricule",
        as: "lands",
    });

    Land.belongsTo(User, {
        foreignKey: "userMatricule",
        as: "user"
    });
    
    User.hasMany(Station, {
        foreignKey: "userMatricule",
        as: "stations",
    });

    Station.belongsTo(User, {
        foreignKey: "userMatricule",
        as: "user"
    });

};

export { User, Story, Tenant, Land, Station };
