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
        type: String,
        default:"No rating available",
    },
    reviews: [{
        type: String,
    }],
    product_specifications: [{
        key: {
            type: String,
        },
        value: {
            type: String,
        },
    }],
}, { timestamps: true });

export default mongoose.model('Product', ProductSchema, 'ProductCollection');
