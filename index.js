/* Sigint */
import workers from '#core/autoload.js';

const worker = workers.Item({
    id: 'questioner',
    host: 'http://localhost:3000',
    config: {
        name: ['string']
    },
    onConnect: ()    => { console.log('connected'); },
    onDisconnect: () => { console.log('disconnected'); },
    onJoin: ()       => { console.log('Joined, ready to work!'); },
    onLeave: ()      => { console.log('leave');},
    onError: (error) => { console.log(error); }
});

worker.Fn('join', function(properties, resolve, reject)
{
    resolve('Hello there ' + properties.name);
});