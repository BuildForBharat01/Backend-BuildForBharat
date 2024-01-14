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
    ratings: {
        type: Number,
        default: 0,
    },
    reviews: [{
        type: String,
    }],
}, { timestamps: true });

export default mongoose.model('Product', ProductSchema, 'ProductCollection');