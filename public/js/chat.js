const socket=io()


//Elements
const $messageform=document.querySelector('#message-form')
const $messageinput=document.querySelector('input')
const $messagebutton=document.querySelector('button')
const $locationbutton=document.querySelector('#sendloc')
const $messages=document.querySelector('#messages')

//Templates
const messageTemplate=document.querySelector('#message-template').innerHTML
const locationmessageTemplate=document.querySelector('#location-message-template').innerHTML
const sidebartemplate=document.querySelector('#sidebar-template').innerHTML


//Options
const {username,room}= Qs.parse(location.search,{ignoreQueryPrefix:true})

const autoscroll=()=>{
    const $newmessage=$messages.lastElementChild

    const newmessagestyles=getComputedStyle($newmessage)
    const newmessagemargin=parseInt(newmessagestyles.marginBottom)
    const newmessageheight=$newmessage.offsetHeight+newmessagemargin

    const visibleheight=$messages.offsetHeight

    const containerheight=$messages.scrollHeight

    const scrolloffset=$messages.scrollTop+ visibleheight

    if(containerheight-newmessageheight<=scrolloffset){
        $messages.scrollTop=$messages.scrollHeight
    }

}

socket.on('locationmessage',(url)=>{
    console.log(url)
    const html=Mustache.render(locationmessageTemplate,{
        username:url.username,
        url:url.url,
        createdat:moment(url.createdat).format('h:mm a')
    })
    $messages.insertAdjacentHTML("beforeend",html)
    autoscroll()
})

socket.on('message',(message)=>{
    console.log(message)
    const html= Mustache.render(messageTemplate,{
        username:message.username,
        message:message.text,
        createdat:moment(message.createdat).format('h:mm a')
    })
    $messages.insertAdjacentHTML("beforeend",html)
    autoscroll()
    })

socket.on('roomdata',({room,users})=>{
    const html=Mustache.render(sidebartemplate,{
        room,
        users
    })
    document.querySelector('#sidebar').innerHTML=html

})

$messageform.addEventListener('submit',(e)=>{
e.preventDefault()


const message=e.target.elements.message.value
$messagebutton.setAttribute('disabled','disabled')


socket.emit('sendmessage',message,(error)=>{
    $messagebutton.removeAttribute('disabled')
    $messageinput.value=''
    $messageinput.focus()
if(error){
    return console.log(error)
}
else return console.log("Delivered!")
})
})
// document.querySelector('#increment').addEventListener('click',()=>{
//     console.log('clicked!')
//     socket.emit('increment')
// })

document.querySelector('#sendloc').addEventListener('click',()=>{
   if (!navigator.geolocation){
       return alert('Geolocation not supported')
    }
    $locationbutton.setAttribute('disabled','disabled')

   navigator.geolocation.getCurrentPosition((position)=>{
       console.log(position)

       socket.emit('sendlocation',{
           latitude:position.coords.latitude,
           longitude:position.coords.longitude
       },()=>{
        $locationbutton.removeAttribute('disabled')
          console.log("Location Delivered!")
        

       })
   })
})

socket.emit('join',{username, room},(error)=>{
    if(error){
        alert(error)
        location.href='/'
    }
})