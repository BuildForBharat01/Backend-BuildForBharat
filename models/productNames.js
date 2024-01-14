import mongoose from "mongoose";

const ProductNamesSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
}, { timestamps: true });

export default mongoose.model('ProductNames', ProductNamesSchema, 'ProductNamesCollection');