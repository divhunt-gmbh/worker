import workers from '#core/autoload.js';

workers.Item({
    id: 'questioner',
    host: 'http://localhost:3000',
    onConnect: () => 
    { 
        console.log('Connected!'); 
    },
    onDisconnect: (reason) => 
    { 
        console.log(reason); 
    },
    onError: (message) => 
    { 
        console.log(message); 
    },
    onTask: (properties, resolve, reject) => 
    {
        
    }
});