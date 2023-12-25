const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const protectRoute = asyncHandler(async (req,res,next) => {
    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try {
            //get Token from headers
            token = req.headers.authorization.split(' ')[1]
            
            // verify token
            const decodedToken = jwt.verify(token,process.env.JWT_SECRET)

            //get user from token
            const user = await prisma.user.findUnique({where : { id : decodedToken.id}})
            
            //exclude password from user above(since there is no way to exclude in prisma.... WHAAAAAAATTTTTT!!!)
            function exclude(user, keys) {
                return Object.fromEntries(
                  Object.entries(user).filter(([key]) => !keys.includes(key))
                );
              }
            req.user = exclude(user,['password'])

            next()
        } catch (error) {
            console.log(error)
            res.status(401)
            throw new Error("Not authorized")
        }
    }
    if(!token){
        res.status(401)
        throw new Error("Not authorized, No token")
    }
})

module.exports = { protectRoute }