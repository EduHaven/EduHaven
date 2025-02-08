import {WebSocketServer, WebSocket} from "ws";
const clients=new Map();

export const startWebSocket=(server)=>{
    try{
        const wss=new WebSocketServer({server});
        
        wss.on('connection',async (socket)=>{
            try{
                // Handle incoming messages
                socket.on('message',(message)=>{
                    const data=JSON.parse(message);
                    if(data.type=='register')
                    {
                        clients.set(data.userId,socket);
                        console.log("registered successfully.");
                    }
                    else if(data.type=='friend-request')
                    {
                        console.log("friend-request");
                        let receiver=clients.get(data.friendId);
                        // if(!receiver)
                        // {
                        //     receiver=new WebSocket('ws://localhost:3000');
                        //     clients.set(data.friendId,receiver);
                        // }
                        if (receiver.readyState === WebSocket.OPEN) {
                            receiver.send(JSON.stringify(data));
                        } 
                        else 
                        {
                            receiver.on('open', () => {
                              receiver.send(JSON.stringify(data));
                            });
                          }
                    }
                    else if(data.type=='cancel-request')
                    {
                        let receiver=clients.get(data.friendId);
                        // if(!receiver)
                        // {
                        //     receiver=new WebSocket('ws://localhost:3000');
                        //     clients.set(data.friendId,receiver);
                        // }
                        if (receiver.readyState === WebSocket.OPEN) {
                            receiver.send(JSON.stringify(data));
                        } 
                        else 
                        {
                            receiver.on('open', () => {
                              receiver.send(JSON.stringify(data));
                            });
                          }
                    }
                });
            }
            catch(err)
            {
                console.error("error receiving requests");
            }
        })
        
    }catch(err)
    {
        console.error("Error connecting to WS: ",err);
    }

}

