import User from '../models/user.js';
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";
import { createError } from '../utils/createError.js';


export const login = async (req, res, next) => {
    try {
        let user = await User.findOne({ username: req.body.username });
        if (!user) return next(createError(404, 'User Not Found'));

        if (!req.body.password) return next(createError(404, 'Password Required'));

        const isValidPassword = await bcrypt.compare(req.body.password, user.password);

        if (!isValidPassword) return next(createError(400, "Incorrect Password"));

        const token = jwt.sign({ username: user.username, password: req.body.password },
            process.env.JWT_SECRET_KEY
        );
        return res.status(201).json({ message: 'Logged in successfully', token: token, success: true });

    } catch (error) {
        next(error);
    }
};


export const register = async (req, res, next) => {
    const { username, password, email, ...otherDetails } = req.body;
    if (!(username && password && email))
        return next(createError(404, 'Please fill all the fields properly'));
    const salt = bcrypt.genSaltSync(10);
    const hashed_password = bcrypt.hashSync(password);

    try {

        const existingUser = await User.findOne({ username });
        const userWithRegisteredEmail = await User.findOne({ email });

        if (existingUser)
            return next(createError(400, 'Username already in use'));

        if (userWithRegisteredEmail)
            return next(createError(400, 'Email already registered'));

        const user = new User({ username, password : hashed_password, email, ...otherDetails });
        await user.save();

        const token = jwt.sign({ username: user.username, password: password },
            process.env.JWT_SECRET_KEY
        );

        res.status(201).json({ message: 'User created successfully', token: token, success: true });
    } catch (error) {
        next(error);
    }
};


export const verifyToken = async (req, res, next) => {
    const token = req.body.token;
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.body = decodedToken;

        const user = await User.findOne({ username: decodedToken.username });
        if (!user) return next(createError(404, 'User Not Found'));

        if (!decodedToken.password) return next(createError(404, 'Password Required'));

        const isValidPassword = await bcrypt.compare(decodedToken.password, user.password);

        if (!isValidPassword) return next(createError(400, "Wrong Password"));

        return res.status(201).json({ message: 'Logged in successfully', success: true });

    } catch (error) {
        next(createError(403, "Token is not valid"));
    }
}
