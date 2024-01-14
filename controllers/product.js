import Review from "../models/review";
import Product from "../models/product";
import ProductNames from "../models/productNames";
import { createError } from "../utils/createError"
import ProductNames from "../models/productNames";

export const getProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.productID);
        if (!product) next(createError(404, "Not Found"));
        return res.status(200).json({ product });
    } catch (error) {
        next(createError(404, "Not Found"));
    }
}

export const searchSuggestions = async (req, res, next) => {
    try {
        const searchString = req.params.searchString;
        if (!searchString) {
            next(createError(400, "Search string is required"))
        }

        // Perform partial text search
        const productNames = await ProductNames.find({ $text: { $search: searchString } });

        if (!productNames || productNames.length === 0) {
            return next(createError(404, "Products Not Found"));
        }
        return res.status(200).json({ productNames });
    } catch (error) {
        next(createError(404, "Not Found"));
    }
}

export const searchProducts = async (req, res, next) => {
    try {
        const products = await Product.find({ name: req.params.searchString });
        if (!products || products.length === 0) next(createError(404, "Not Found"));
        return res.status(200).json({ products });
    } catch (error) {
        next(createError(404, "Not Found"));
    }
}

export const addProductsToDB = async (req, res, next) => {
    try {
        const products = req.body.products;
        if (!products || products.length === 0) next(createError(403, "No product to add in DB"));
        let count = 0;
        products.forEach(async (product) => {
            try {
                const newProduct = new Product(product);
                await newProduct.save();
                const isExistingName = ProductNames.find(product.name);
                if (!isExistingName) {
                    const name = new ProductNames(product.name);
                    await name.save();
                }
            } catch (error) {
                next(createError(400, `Added ${count} products, Failed for ${product.name}`));
            }
        });
        res.status(201).json({ success: true, message: "Added all to DB" });
    } catch (error) {
        next(createError(400, "Failed To Process"));
    }
}