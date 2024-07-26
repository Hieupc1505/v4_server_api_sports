"use-strict";
const { env } = require("#configs/constants.config");

const mongoose = require("mongoose");

class Database {
    constructor() {
        this.connect();
    }

    //connect
    connect(type = "mongodb") {
        if (env.isDevelopment || env.isTest) {
            mongoose.set("debug", true);
            mongoose.set("debug", { color: true });
        }
        mongoose
            .connect(env.db.host)
            .then((_) => console.log(`DB connected successfully`))
            .catch((err) => {
                console.log(`Error Connected::${err}`);
            });
    }

    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database();
        }

        return Database.instance;
    }
}

const instanceMongodb = Database.getInstance();
module.exports = instanceMongodb;
