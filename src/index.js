const express = require('express')

const routers = require('./Routes/route.js')
const app = express()
const port = process.env.PORT || 3001
const cors = require('cors')


app.use(cors())
app.use(express.json())
// to parce the upcomming json data 
app.use(routers)



app.listen(port,()=>{
    console.log('Connected Successfully to port '+port)
})