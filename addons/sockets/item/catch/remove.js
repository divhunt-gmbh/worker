import sockets from '#sockets/addon.js';

sockets.ItemOn('remove', function(item)
{
    const socket = item.Get('connection');
  
    socket.close();
});
