const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
require('./config/db')
require('./models')
const port = process.env.port || 4444

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

const authRouter = require('./routes/authRouter')

app.use('/api/auth', authRouter)

app.all('*', (req, res) => {
  res.send('Page Not Found')
})

app.listen(port, () => {
  console.log(`server is runing on port ${port}`)
})