import divhunt from '#core/framework.js';
import sockets from '#sockets/addon.js';

import { io } from 'socket.io-client';

sockets.ItemOn('add', function(item)
{
    const socket = io(item.Get('host'));

    socket.on('connect', () => 
    {
        item.Get('onConnect') && item.Get('onConnect').call(item, socket);
    });
    
    socket.on('disconnect', (reason) => 
    {
        item.Get('onDisconnect') && item.Get('onDisconnect').call(item, socket, reason);
    });
    
    socket.on('connect_error', (error) => 
    {
        item.Get('onError') && item.Get('onError').call(item, socket, error.message);
    });

    item.Set('connection', socket);

    divhunt.MiddlewareIntercept('server.close', (middleware) =>
    {
        try 
        {
            socket.close();
        } 
        catch (error) 
        {
            divhunt.LogError('Error closing socket connection', {}, error);
        } 
        finally 
        {
            middleware.next();
        }
    })
});
