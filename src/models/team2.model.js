const { model, Schema } = require("mongoose");

const League2 = new Schema(
    {
        id: Number,
        name: String,
        country: String,
        image: String,
        slug: String,
        isGroup: {
            type: Boolean,
            default: false,
        },
        logo: String,
        list: String,
        list2: String,
        channelId: String,
    },
    {
        collection: "olds",
        timestamps: true,
    }
);

module.exports = model("olds", League2);
