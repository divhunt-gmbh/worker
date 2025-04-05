import divhunt from '#core/framework.js';

let closing = false;

process.on('SIGINT', async () =>
{
    if(closing) { return; } else { closing = true; }

    console.log('Server closing.');

    divhunt.Emit('server.close');
    await divhunt.Middleware('server.close')

    process.exit(0);
});