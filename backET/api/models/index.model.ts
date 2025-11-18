import { Sequelize } from "sequelize"; // ✅ vrai import
import { initUser, User } from "./user.model.ts";
import { initStory, Story } from "./story.model.ts";
import { initTenant, Tenant } from "./tenant.model.ts";
import { initLand, Land } from "./land.model.ts";
import { initStation, Station } from "./station.model.ts";
import { initPrice, Price } from "./price.model.ts";
import { initLocation, Location } from "./location.model.ts";

export const initModels = (sequelize: Sequelize) => {
    // Initialiser les modèles
    initUser(sequelize);
    initStory(sequelize);
    initTenant(sequelize);
    initStation(sequelize);
    initLand(sequelize);
    initPrice(sequelize);
    initLocation(sequelize);

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
    User.hasMany(Price, {
        foreignKey: "userMatricule",
        as: "prices",
    });

    Price.belongsTo(User, {
        foreignKey: "userMatricule",
        as: "user"
    });
    User.hasMany(Location, {
        foreignKey: "userMatricule",
        as: "locations",
    });

    Location.belongsTo(User, {
        foreignKey: "userMatricule",
        as: "user"
    });

    //Relation entre Land et Station
    Station.hasMany(Land, { foreignKey: "codeStation" });
    Land.belongsTo(Station, { foreignKey: "codeStation", as: "station" });

    Tenant.hasMany(Location, { foreignKey: "cin", sourceKey: "cin", as: "locations" });
    Location.belongsTo(Tenant, { foreignKey: "cin", targetKey: "cin", as: "tenant" });

    Land.hasMany(Location, { foreignKey: "codeLand", sourceKey: "codeLand", as: "locations" });
    Location.belongsTo(Land, { foreignKey: "codeLand", targetKey: "codeLand", as: "land" });


};

export { User, Story, Tenant, Land, Station, Location };
