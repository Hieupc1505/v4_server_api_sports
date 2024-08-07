/* eslint-disable import/no-mutable-exports */

import { Schema, model } from "mongoose";
import slugify from "slugify";

const DOCUMENT_NAME = "Post";
const COLLECTION_NAME = "Posts";

const PostSchema = new Schema(
    {
        title: {
            type: String,
            trim: true,
            required: [true, "Title is required!"],
            minlength: [3, "Title must be longer!"],
            unique: true,
        },
        text: {
            type: String,
            required: [true, "Some text are required!"],
        },
        slug: {
            type: String,
            trim: true,
            lowercase: true,
            unique: true,
        },
        author: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Author is required!"],
        },
        favoriteCount: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true, collection: COLLECTION_NAME }
);

/**
 * Slugify the text on validation hook
 */
PostSchema.pre("validate", function (next) {
    this.slugify();
    next();
});

PostSchema.statics = {
    /**
     * Create a post
     *
     * @public
     * @param {Object} args - Object contains title and text
     * @param {String} authorId - the author id
     * @returns {Post} Post Object - new post create
     */
    createPost(args, authorId) {
        return this.create({
            ...args,
            author: authorId,
        });
    },

    /**
     * If you call list() with zero arguments, the destructuring fails,
     * because you can’t match an object pattern against undefined.
     * That can be fixed via a default value. In the following code,
     * the object pattern is matched against {} if there isn’t at least one argument.
     */
    list({ skip = 0, limit = 10 } = {}) {
        return this.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate("author");
    },

    incFavoriteCount(postId) {
        return this.findByIdAndUpdate(postId, { $inc: { favoriteCount: 1 } });
    },

    decFavoriteCount(postId) {
        return this.findByIdAndUpdate(postId, { $inc: { favoriteCount: -1 } });
    },
};

PostSchema.methods = {
    /**
     * Slug the title and add this to the slug prop
     */
    slugify() {
        this.slug = slugify(this.title);
    },
    /**
     * Parse the post in format we want to send.
     *
     * @public
     * @returns {Post} Post Object
     */
    toJSON() {
        return {
            _id: this._id,
            title: this.title,
            text: this.text,
            author: this.author,
            createdAt: this.createdAt,
            favoriteCount: this.favoriteCount,
        };
    },
};

module.exports = model(PostSchema, DOCUMENT_NAME);
