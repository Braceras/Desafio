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
const messages = []



app.get('/login', (req, res) => {
    return res.render('login')
})

app.post('/login', (req, res) => {
    const { username } = req.body
    users.push(username)

    return res.redirect(`/home?username=${username}`)
})

app.get('/chat', (req, res) => res.render('chat'))




const products = []

app.get('/home', (req, res) => {
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

io.on('connection', socket => {
    console.log('Nuevo usuario conectado');

    socket.on('joinChat', (data) => {
        const username = data.username
        users.push({
            id: socket.id,
            username,
            avatarId: Math.ceil(Math.random() * 6)
        })

        socket.emit('notification', `Bienvenido ${username}`)

        socket.broadcast.emit('notification', `${username} se ha unido al chat`)

        io.sockets.emit('users', users)
    })


    socket.on('messageInput', data => {
        const now = new Date()
        const user = users.find(user => user.id === socket.id)

        const message = {
            text: data,
            time: `${now.getHours()}:${now.getMinutes()}`,
            user

        }

        messages.push(message)

        socket.emit('myMessage', message)
        socket.broadcast.emit('message', message)
         
    })

    socket.on('disconnect', reason => {
        const user = users.find(user => user.id === socket.id)

        users = users.filter(user => user.id !== socket.id)
        
        if(user) {
            socket.broadcast.emit('notification', `${user.username} se ha ido del chat`)
        }

        io.sockets.emit('users', users)
    })
})