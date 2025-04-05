import divhunt from '#core/framework.js';

const sockets = divhunt.Addon('sockets', (addon) =>
{
    addon.Field('id', ['number']);
    addon.Field('host', ['string']);
    addon.Field('socket', ['object']);
    addon.Field('onConnect', ['function']);
    addon.Field('onDisconnect', ['function']);
    addon.Field('onError', ['function']);
});

export default sockets;