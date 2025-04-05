import divhunt from '#core/framework.js';

const workers = divhunt.Addon('workers', (addon) =>
{
    addon.Field('id', ['string']);
    addon.Field('host', ['string']);
    addon.Field('config', ['object']);
    addon.Field('socket', ['object']);

    addon.Field('onConnect', ['function']);
    addon.Field('onDisconnect', ['function']);
    addon.Field('onError', ['function']);
    addon.Field('onJoin', ['function']);
    addon.Field('onLeave', ['function']);
    addon.Field('onFail', ['function']);
    addon.Field('onTask', ['function']);
});

export default workers;