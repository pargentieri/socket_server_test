const
    {Server} = require("socket.io"),
    server = new Server(3000),
      fs  = require('fs'),
     readline=require ('readline');
     
    



let
    sequenceNumberByClient = new Map();

    function sleep(ms) {
        return new Promise((resolve) => {
          setTimeout(resolve, ms);
        });
      }

// event fired every time a new client connects:
server.on("connection", (socket) => {
    console.info(`Client connected [id=${socket.id}]`);
    
    // initialize this client's sequence number
    sequenceNumberByClient.set(socket, 1);

    // when socket disconnects, remove it from the list:
    socket.on("disconnect", () => {
        sequenceNumberByClient.delete(socket);
        console.info(`Client gone [id=${socket.id}]`);
    });
    socket.on("start", (data) => {
        console.log('----->start reading file and send text to client:'+data);

        const rl = readline.createInterface({
            input: fs.createReadStream('./testo.txt'),
            crlfDelay: Infinity
        });
        rl.on('line', (line) => {
            console.log(`Line: ${line}`);
            socket.emit("text", line);  
            //await sleep(5000);

        });
        
        rl.on('close', () => {
            console.log('Finished reading the file.');
            socket.emit("end", "");  
        });


    });  
   // fs.close( fileStream, ()=>{} )
});

// sends each client its current sequence number
setInterval(() => {
   /*for (const [client, sequenceNumber] of sequenceNumberByClient.entries()) {
      client.emit("hi", sequenceNumber);  
      //client.emit("seq-num", sequenceNumber);
        sequenceNumberByClient.set(client, sequenceNumber + 1);
    }*/
}, 3000);