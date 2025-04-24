import sockets from '#sockets/addon.js';
import workers from '#workers/addon.js';

workers.ItemOn('add', function(item)
{
    const socket = sockets.Item({
        id: item.Get('id'),
        host: item.Get('host'),
        onConnect: (socket) => 
        {
            socket.emit('worker.connect', item.Get('id'));

            socket.on('worker.connect', () => 
            {
                item.Get('onConnect') && item.Get('onConnect')();
            });

            socket.on('worker.task', (data) => 
            {
                item.Fn('task', data);
            });

            socket.on('worker.error', (message) => 
            {
                item.Get('onError') && item.Get('onError')(message);
            });
        },
        onDisconnect: (socket, reason) => 
        {
            socket.off('worker.connect');
            socket.off('worker.task');
            socket.off('worker.error');
         
            item.Get('onDisconnect') && item.Get('onDisconnect')(reason);
        },
        onError: (socket, message) => 
        {
            item.Get('onError') && item.Get('onError')(message);
        }
    });

    item.Set('socket', socket);
});