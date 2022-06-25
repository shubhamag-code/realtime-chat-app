const users=[]

const addUser=({id,username,room})=>{
    username=username.trim().toLowerCase()
    room=room.trim().toLowerCase()

    //validate
    if(!username||!room){
        return{
            error:'Invalid Entry'
        }
    }

    //Existing user check
    const ExistingUser=users.find((user)=>{
        return user.room===room && user.username===username
    })

    if(ExistingUser){
        return{
            error:'Existing user!'
        }
    }

    //Storing user
    const user={id,username,room}
    users.push(user)
    return{user}
}
const removeUser=(id)=>{
    const index=users.findIndex((user)=>{
        return user.id===id
    })
    if(index!=-1){
        return users.splice(index,1)[0]
    }
    

}


const getUser=(id)=>{
    return users.find((user)=>user.id===id)

}

const getUsersinRoom=(room)=>{
    room=room.trim().toLowerCase()
    return users.filter((user)=>user.room===room)
     
}



module.exports={
    addUser,
    removeUser,
    getUser,
    getUsersinRoom
}