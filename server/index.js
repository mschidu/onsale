const express = require('express')
require('dotenv').config()
const { errHandler } = require('./middleware/errorMiddleware')

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())
app.use(express.urlencoded({extended : false}))

app.use('/',require('./routes/productRoutes'))
app.use('/',require('./routes/userRoutes'))

app.use(errHandler)

app.listen(PORT,()=>{
    console.log(`server started on port ${PORT}`)
})