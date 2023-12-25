const asyncHandler = require("express-async-handler");
const { PrismaClient } = require("@prisma/client");
const { addDays } = require("date-fns");
const prisma = new PrismaClient();

//@desc     GET method
//@endpoint /api/products
//@public route
const getAllProducts = asyncHandler(async (req, res) => {
  const products = await prisma.product.findMany()
  res.status(200).json({ products : products})
});


//@desc     POST method
//@endpoint /api/products
//@private route
const postProduct = asyncHandler(async (req, res) => {
  const { title, description, category, price, isFeatured } =
    req.body;
  //check for input fields
  if (!title || !description || !category || !price || !isFeatured) {
    res.status(400)
    throw new Error("Please fill in all the necessary fields")
  }
  //create a new product
  const product = await prisma.product.create({
    data: {
      title: title,
      description: description,
      category: category,
      price: parseInt(price),
      expires_In : addDays(new Date(),1),
      isFeatured: JSON.parse(isFeatured),
      sellerId: req.user.id,
    },
  });
  res
    .status(201)
    .json({
      id: product.id,
      title: product.title,
      description: product.description,
      category: product.category,
      price:product.price,
      isFeatured : product.isFeatured,
      created_At:product.created_At,
      expires_In:product.expires_In,
      sellerId:product.sellerId
     });
});

//@desc     PUT method
//@endpoint /api/products/:id
//@private route
const updateProduct = asyncHandler(async (req, res) => {
  res.json({ message: `updating product ${req.params.id}` });
});

//@desc     DELETE method
//@endpoint /api/products/:id
//@private route
const deleteProduct = asyncHandler(async (req, res) => {
  res.json({ message: `deleting product ${req.params.id}` });
});

module.exports = {
  getAllProducts,
  postProduct,
  updateProduct,
  deleteProduct,
};
