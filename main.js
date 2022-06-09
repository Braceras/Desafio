const express = require('express')
const { Server: HttpServer } = require('http')
const { Server: IOServer } = require('socket.io')


const app = express()
const httpServer = new HttpServer(app)
const io = new IOServer(httpServer)



app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.set('views', './views')
app.set('view engine', 'ejs')
app.use(express.static('./public'))

let users = []

app.get('/login', (req, res) => {
    return res.render('login')
})




const products = []

app.get('', (req, res) => {
    const data = {
        message: 'Welcome!'
    }
    return res.render('index', data)
})

app.get('/products', (req, res) => {
    const data = { 
        products
     }
    return res.render('products', data)
})

app.post('/products', (req, res) => {
    const product = {
        name: req.body.name,
        price: req.body.price,
        img: req.body.img,
        id:products.length+1
    }

    products.push(product)
    return res.send('products')
})




const PORT = 8080

httpServer.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
})