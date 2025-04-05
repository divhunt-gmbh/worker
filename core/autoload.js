import '#core/sigint.js';

/* Addon Hooks */
import '#workers/hook/load.js';
import '#sockets/hook/load.js';

/* Workers Addon */
import workers from '#workers/addon.js';

export default workers;