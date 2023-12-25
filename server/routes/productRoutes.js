const express = require("express");
const router = express.Router();
const {
  getAllProducts,
  postProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productControllers");

const {protectRoute} = require('../middleware/authMiddleware')


router.get("/api/products", getAllProducts); // endpoint for getting all products
router.post("/api/products", protectRoute, postProduct);
router.put("/api/products/:id", updateProduct);
router.delete("/api/products/:id", deleteProduct);


module.exports = router;
