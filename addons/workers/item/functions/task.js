import divhunt from '#core/framework.js';
import workers from '#workers/addon.js';

workers.Fn('item.task', function(item, data)
{
    if(!data || typeof data !== 'object' || !data?.id || typeof data.id !== 'string' || !data?.properties || typeof data.properties !== 'object')
    {
        item.Get('onError') && item.Get('onError')('Invalid data format received. Missing required "id" (string) or "properties" (object). Got: ' + JSON.stringify(data));
        return;
    }
  
    const promise = new Promise((resolve, reject) => 
    {
        if(item.Get('onTask'))
        {
            const responseCallback = function(results, success = true)
            {
                if(typeof success === 'boolean')
                {
                    resolve({results, success});
                }
                else 
                {
                    reject('Worker has sent invalid status response.');
                }
            };

            item.Get('onTask')(data.properties, responseCallback, reject);
        }
        else 
        {
            item.Get('onError') && item.Get('onError')('Task handler not defined. Worker paused for approximately 15 minutes (depending on administrator). Reload to resume.');
            reject('Task handler not defined. Worker should be paused.');
        }
    });

    promise.then((response) => 
    {
        item.Get('socket').Get('connection').emit('worker.task.done', {
            id: data.id, 
            success: response.success, 
            results: response.results
        });
    })
    .catch((message) => 
    {
        item.Get('socket').Get('connection').emit('worker.task.fail', {
            id: data.id, 
            success: false, 
            results: (typeof message === 'string' ? message : 'Failed to perform task. Worker should be paused.')
        });
    })
});