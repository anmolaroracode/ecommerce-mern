const mongoose = require('mongoose');

const Products = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },

    description: {
        type: String,
        required: true,
    },

    price: {
        type: Number,
        required: true,
    },

    discountedPrice: {
        type: Number,
        default: null,
    },

    countInStock: {
        type: Number,
        required: true,
    },

    sku: {
        type: String,
        default: "",
    },

    category: {
        type: String,
        default: "",
    },

    brand: {
        type: String,
        default: "",
    },

    size: {
        type: [String],
        default: [],
    },

    colour: {
        type: [String],
        default: [],
    },

    collections: {
        type: String,
        default: "",
    },

    material: {
        type: String,
        default: "",
    },

    gender: {
        type: String,
        enum: ["Men", "Women", "Unisex"],
        default: "Unisex",
    },

    images: [
        {
            url: {
                type: String,
                default: "",
            },
            altText: {
                type: String,
                default: "",
            },
        },
    ],

    isFeatured: {
        type: Boolean,
        default: false,
    },

    isPublished: {
        type: Boolean,
        default: false,
    },

    rating: {
        type: Number,
        default: 0,
    },

    numReviews: {
        type: Number,
        default: 0,
    },

    tags: {
        type: [String],
        default: [],
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null, // Admin user will be added later
    },

    metaTitle: {
        type: String,
        default: "",
    },

    metaDescription: {
        type: String,
        default: "",
    },

    metaKeywords: {
        type: String,
        default: "",
    },

    dimensions: {
        length: { type: Number, default: 0 },
        width: { type: Number, default: 0 },
        height: { type: Number, default: 0 },
    },

    weight: {
        type: Number,
        default: 0,
    },
},
{ timestamps: true }
);

module.exports = mongoose.model("Products", Products);
