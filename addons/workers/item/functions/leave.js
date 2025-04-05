import workers from '#workers/addon.js';

workers.Fn('item.leave', function(item, callback)
{
    item.Set('onTask', null);
    
    const socket = item.Get('socket').Get('socket');

    socket.emit('worker.leave');
    socket.on('worker.leave', () => 
    {
        socket.off('worker.join');
        socket.off('worker.task');
        socket.off('worker.error');
        socket.off('worker.leave');

        item.Get('onLeave') && item.Get('onLeave')(socket);
    });
});