import workers from '#workers/addon.js';
import sockets from '#sockets/addon.js';

workers.Fn('item.join', function(item, callback)
{
    item.Set('onTask', async (data) => 
    {
        const promise = new Promise((resolve, reject) => 
        {
            callback(data.properties, resolve, reject)
        });

        promise.then((response) => 
        {
            item.Get('socket').Get('socket').emit('worker.task.done', {id: data.id, response});
        })
        .catch((response) => 
        {
            item.Get('socket').Get('socket').emit('worker.task.fail', {id: data.id, response});
        })
    });

    const socket = sockets.Item({
        id: item.Get('id'),
        host: item.Get('host'),
        onConnect: (socket) => 
        {
            item.Get('onConnect') && item.Get('onConnect')(socket);

            socket.emit('worker.join', {name: item.Get('id'), config: item.Get('config')});

            socket.on('worker.join', () => 
            {
                item.Get('onJoin') && item.Get('onJoin')();
            });

            socket.on('worker.task', (data) => 
            {
                item.Get('onTask') && item.Get('onTask')(data);
            });
        },
        onDisconnect: (socket, error) => 
        {
            socket.off('worker.join');
            socket.off('worker.task');
            socket.off('worker.error');
            socket.off('worker.leave');
            
            item.Get('onDisconnect') && item.Get('onDisconnect')(error);
            item.Get('onLeave') && item.Get('onLeave')(error);
        },
        onError: (socket, error) => 
        {
            item.Get('onError') && item.Get('onError')(error);
        }
    });

    item.Set('socket', socket);
});