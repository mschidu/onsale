const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const asyncHandler = require("express-async-handler");
const { PrismaClient } = require("@prisma/client");

//Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" }); // expires in 7d (change it accordingly)
};

const prisma = new PrismaClient();

//@desc     POST method
//@endpoint /api/login
//@public route
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  //check for the necessary fields
  if (!email || !password) {
    res.status(400);
    throw new Error("Please fill in necessary fields");
  }
  //check if user exists or not
  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });
  if (user && (await bcrypt.compare(password, user.password))) {
    res
      .status(201)
      .json({
        _id: user.id,
        name: user.name,
        email: user.email,
        token: generateToken(user.id),
      });
  } else {
    throw new Error("Invalid credentials");
  }
});

//@desc     POST method
//@endpoint /api/register
//@public route
const register = asyncHandler(async (req, res) => {
  const { name, email, password, contact_no } = req.body;

  //check for the necessary fields
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please fill in necessary fields");
  }

  //hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  //check for the user if already exist
  const userExists = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });
  if (userExists) {
    res.status(400);
    throw new Error("User with email already exist");
  }

  //create the user
  if (userExists === null) {
    const user = await prisma.user.create({
      data: {
        name: name,
        email: email,
        password: hashedPassword,
        contact_no: contact_no,
      },
    });
    return res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      contact_no: user.contact_no,
      token: generateToken(user.id),
    });
  }
});

//@desc     GET method
//@endpoint /api/users/userprofile
//@private route
const userProfile = asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { 
      id: req.user.id 
    },
    select : {
      name : true,
      email : true,
      products : true
    }
  },);
  res.status(200).json(user);
});
module.exports = {
  login,
  register,
  userProfile,
};
