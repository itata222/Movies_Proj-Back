const express = require('express')
const cors = require('cors')

const app = express();
const port = process.env.PORT
const userRouter = require('./routers/userRouter')
const adminRouter = require('./routers/adminRouter')
require('./db/db')

app.use(cors());
app.use(express.json())
app.use(userRouter)
app.use(adminRouter)
app.listen(port, () => {
    console.log('server runs, port:', port)
})
