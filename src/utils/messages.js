const generatemessage=(username,text)=>{
    return{
        username,
        text:text,
    createdat: new Date().getTime()}
}



const generatelocmessage=(username,url)=>{
    return{
        username,
        url:url,
    createdat: new Date().getTime()}
}
module.exports={generatemessage,generatelocmessage}