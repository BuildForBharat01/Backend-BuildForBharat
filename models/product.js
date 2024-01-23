import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
    images: [{
        type: String,
        required: true,
    }],
    name: {
        type: String,
        required: true,
    },
    price: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    category_tree: {
        type: String,
    },
    ratings: {
        type: String,
        default: "No rating available",
    },
    reviews: [{
        type: String,
    }],
    specifications: [],
}, { timestamps: true });

export default mongoose.model('Product', ProductSchema, 'ProductCollection');
