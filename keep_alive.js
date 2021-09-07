const express = require('express');
const server = express();

server.all('/', (req, res)=>{
    res.send('The OS Wars Judge Bot is now listening for commands.')
})

function keepAlive(){
    server.listen(3000, ()=>{console.log("Booting...")});
}

module.exports = keepAlive;