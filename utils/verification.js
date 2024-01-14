import jwt from "jsonwebtoken";
import { createError } from "./createError.js";
import User from "../models/user.js";
import bcrypt from 'bcryptjs';


export const verifyUser = async (req, res, next) => {
    const token = req.body.token;
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.body = decodedToken;

        const user = await User.findOne({ username: decodedToken.username });
        if (!user) return next(createError(404, 'Unauthorized'));

        if (!decodedToken.password) return next(createError(404, 'Unauthorized'));

        const isValidPassword = await bcrypt.compare(decodedToken.password, user.password);

        if (!isValidPassword) return next(createError(400, "Unauthorized"));

        next();
    } catch (error) {
        next(createError(403, "Unauthorized"));
    }
};