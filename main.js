const express = require('express')
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.set('views', './views')
//app.set('view engine', 'pug')
app.set('view engine', 'ejs')


app.get('', (req, res) => res.json({ status: 'ok'}))


const products = []

app.get('/home', (req, res) => {
    const data = {
        message: 'Welcome!'
    }
    return res.render('home', data)
})

app.get('/products', (req, res) => {
    const data = { products }
    return res.render('products', data)
})



app.post('/products', (req, res) => {
    const product = {
        name: req.body.name,
        price: req.body.price,
        img: req.body.img
    }

    products.push(product)
    

    return res.redirect('/products')
})



const PORT = 8080

const server = app.listen(PORT, () => {
    console.log(`Servidor HTTP corriendo en el puero ${PORT}`);
})

server.on('error', error => console.log(`Error en servidor: ${error}`))