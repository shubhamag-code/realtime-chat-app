const path=require('path')
const http=require('http')
const express= require('express')
const socketio=require('socket.io')
const Filter=require('bad-words')
const { generatemessage}=require('./utils/messages')
const { generatelocmessage}=require('./utils/messages')
const {addUser,removeUser,getUser,getUsersinRoom}=require('./utils/users')

const app=express()
const server=http.createServer(app)
const io=socketio(server)

const port=process.env.PORT||3000

const publicDir=path.join(__dirname,'../public')

app.use(express.static(publicDir))
io.on('connection',(socket)=>{
    console.log('New Connection!')
    


    socket.on('join',({ username,room },callback)=> {
        const{error,user}=addUser({id:socket.id, username, room})
        if(error){
           return callback(error)
        }
        socket.join(user.room)
        socket.emit('message',generatemessage('Admin',`Welcome to room ${user.room}!`))
        socket.broadcast.to(user.room).emit('message',generatemessage('Admin',`${user.username} has joined!`))
        io.to(user.room).emit('roomdata',{
            room:user.room,
            users:getUsersinRoom(user.room)

        })
        callback()

})

    socket.on('sendmessage',(message,callback)=>{
        const filter= new Filter
        if(filter.isProfane(message)){callback("Profanity not allowed!")}
        const user=getUser(socket.id)
        

         io.to(user.room).emit('message',generatemessage(user.username,message))

        callback()
    })

    socket.on('disconnect',()=>{
        const user= removeUser(socket.id)
        if(user){
            io.to(user.room).emit('message',generatemessage('Admin',`${user.username} has left`))

        
            io.to(user.room).emit('roomdata',{
            room:user.room,
            users:getUsersinRoom(user.room)

            })
        }
    })

    socket.on('sendlocation',(coords,callback)=>{
        const user=getUser(socket.id)

        io.to(user.room).emit('locationmessage',generatelocmessage(user.username,`https://google.com/maps?q=${coords.latitude},${coords.longitude}`))
        callback()
        
    })

    // socket.on('increment',()=>{
    //     count++
    //     io.emit('countupdated',count)
    // })
})
server.listen(port,()=>{
    console.log(`Server is running on port ${port}!`)
})

