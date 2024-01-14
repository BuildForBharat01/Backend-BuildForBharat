import Express from "express";
import { verifyUser } from "../utils/verification";
import { addProductsToDB, getProduct, searchProducts, searchSuggestions } from "../controllers/product";
import { addProductReview } from "../controllers/review";
const router = Express.Router();


router.get('/getProduct/:productID', getProduct);
router.get('/searchProducts/:searchString', searchProducts);
router.get('/searchSuggestions/:searchString', searchSuggestions);
router.patch('/addProductReview/:productID', verifyUser, addProductReview);

router.post('/addProductsToDB', addProductsToDB);
export default router;