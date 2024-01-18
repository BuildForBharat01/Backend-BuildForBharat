import Express from "express";
import { verifyUser } from "../utils/verification.js";
import { addProductsToDB, createProduct, getProduct, searchProducts, searchSuggestions } from "../controllers/product.js";
// import { addProductReview } from "../controllers/review.js";
const router = Express.Router();


router.get('/getProduct', getProduct);
router.get('/searchProducts', searchProducts);
router.get('/searchSuggestions/:searchString', searchSuggestions);
// router.patch('/addProductReview/:productID', verifyUser, addProductReview);

router.post('/addProductsToDB', addProductsToDB);
router.post('/createProduct', createProduct);
export default router;