const express = require("express");
const socket = require("socket.io");
const exphbs = require('express-handlebars')
const path = require('path')

const app = express();

const hbs = exphbs.create({
    defaultLayout: 'index',
    extname: 'hbs'
})
app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')

app.use(express.urlencoded({extended: true}))
app.use(express.static(path.join(__dirname, 'public')))


app.get('/', (req, res) => {
    res.render('index')
})

server = app.listen(3000)

const io = socket(server);

const activeUsers = new Set();
const messages = new Set();

io.on('connection', (socket) => {
    console.log('New connection')
    socket.on("new user", function (data) {
        socket.userId = data;
        activeUsers.add(data);
        io.emit("new user", [...activeUsers]);
    });

    socket.on("disconnect", () => {
        activeUsers.delete(socket.userId);
        io.emit("user disconnected", socket.userId);
    });

    socket.on("new_message", (data) => {
        messages.add(data)
        console.log(messages);
        io.emit("new_message", {data: data,userId: socket.userId});
    })
})
