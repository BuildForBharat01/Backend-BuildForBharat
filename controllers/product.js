import Product from "../models/product.js";
import { createError } from "../utils/createError.js"

export const getProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.query.productID);
        if (!product) next(createError(404, "Not Found"));
        return res.status(200).json({ product: product });
    } catch (error) {
        next(createError(404, "Not Found"));
    }
}
export const searchSuggestions = async (req, res, next) => {
    try {
        const searchString = req.params.searchString;
        if (!searchString || searchString.trim() === "") {
            return next(createError(400, "Search string is required"));
        }
        const products = await Product.find({
            name: { $regex: new RegExp(`^${searchString}`, "i") }
        }).limit(10);

        const productNames = products.map((product) => product.name)

        if (!productNames || productNames.length === 0) {
            return next(createError(404, "Products Not Found"));
        }
        return res.status(200).json(productNames);
    } catch (error) {
        return next(createError(500, "Internal Server Error"));
    }
};



export const searchProducts = async (req, res, next) => {
    try {
        const searchString = req.query.searchString;
        const page = req.query.page || 1;
        const pageSize = req.query.pageSize || 10;
        const skip = (page - 1) * pageSize;
        const limit = pageSize;
        const products = await Product.find({
            name: { $regex: new RegExp(`^${searchString}`, "i") }
        }).skip(skip).limit(limit);
        return res.status(200).json({ products });
    } catch (error) {
        next(createError(404, "Not Found"));
    }
}
export const createProduct = async (req, res, next) => {
    try {
        const product = new Product(req.body);
        product.save();
        return res.status(201).json({ success: true, product: product });
    } catch (error) {
        next(createError(400, "Failed to save in DB"));
    }
}
export const addProductsToDB = async (req, res, next) => {
    try {
        const products = req.body.products;

        if (!products || products.length === 0) {
            return next(createError(403, "No product to add in DB"));
        }

        for (const product of products) {
            try {
                const newProduct = new Product(product);
                await newProduct.save();

                const isExistingName = await ProductNames.findOne({ name: newProduct.name });

                if (!isExistingName) {
                    const name = new ProductNames({ name: newProduct.name });
                    await name.save();
                    console.log(name);
                }
            } catch (error) {
                return next(createError(400, `Failed to add product ${product.name}`));
            }
        }

        res.status(201).json({ success: true, message: "Added all products to DB" });
    } catch (error) {
        next(createError(400, "Failed To Process"));
    }
};