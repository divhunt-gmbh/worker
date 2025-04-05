import divhunt from '#core/framework.js';
import sockets from '#sockets/addon.js';

import { io } from 'socket.io-client';

sockets.ItemOn('add', function(item)
{
    const socket = io(item.Get('host'));

    socket.on('connect', () => 
    {
        item.Set('socket', socket);

        item.Get('onConnect') && item.Get('onConnect').call(item, socket);
        divhunt.Emit('socket.connect', item, socket);
    });
    
    socket.on('disconnect', (reason) => 
    {
        item.Get('onDisconnect') && item.Get('onDisconnect').call(item, socket, reason);
        divhunt.Emit('socket.disconnect', item, socket, reason);
    });

    socket.on('error', (error) => 
    {
        item.Get('onError') && item.Get('onError').call(item, socket, error);
        divhunt.Emit('socket.error', item, socket, error);
    });
    
    socket.on('connect_error', (error) => 
    {
        item.Get('onError') && item.Get('onError').call(item, socket, 'Could not connect on socket.io server.');
        divhunt.Emit('socket.error', item, socket, error);
    });
        
    socket.on('connect_timeout', (timeout) => 
    {
        item.Get('onError') && item.Get('onError').call(item, socket, 'Timeout on connection to socket.io server: ' + timeout);
        divhunt.Emit('socket.error', item, socket, error);
    });

    divhunt.MiddlewareIntercept('server.close', (middleware) =>
    {
        divhunt.LogInfo('Closing socket connection.', {id: item.Get('id')});
    
        try 
        {
            socket.close();
        } 
        catch (error) 
        {
            divhunt.LogError('Error closing socket connection:', error);
        } 
        finally 
        {
            middleware.next();
        }
    })
});
