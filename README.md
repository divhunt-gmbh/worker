# Workers

A lightweight framework for distributed task processing using socket.io.

## Overview

Workers provides a simple way to create worker nodes that can connect to a socket.io server, register themselves, and process tasks. Each worker can:

- Connect to a central socket.io server
- Process assigned tasks and return results
- Handle connection events and errors gracefully

## Installation

```bash
npm install
```

## Quick Start

Here's a simple example of creating a worker:

```javascript
import workers from '#core/autoload.js';

const worker = workers.Item({
    id: 'questioner',               
    host: 'http://localhost:3000',  
    onConnect: () => { console.log('Connected to server'); },
    onDisconnect: (reason) => { console.log('Disconnected:', reason); },
    onError: (message) => { console.log('Error:', message); },
    onTask: (properties, resolve, reject) => {
        try {
            const result = 'Hello there ' + properties.name;
            resolve(result);
        } catch (error) {
            reject(error.message);
        }
    }
});
```

## How It Works

### Connection Flow

1. **Create worker**: Define a worker with an ID, host, and event handlers
2. **Connect**: The worker connects to the socket.io server using socket.io-client
3. **Register**: Upon successful connection, the worker registers itself with the server
4. **Process tasks**: The server sends tasks to the worker
5. **Respond**: The worker processes tasks and sends back results

### Worker Configuration

When creating a worker, you can specify:

```javascript
const worker = workers.Item({
    id: 'worker-name',             
    host: 'http://server:port',    
    
    onConnect: () => { /* Called when worker successfully connects */ },
    onDisconnect: (reason) => { /* Called when worker disconnects */ },
    onError: (message) => { /* Called when an error occurs */ },
    onTask: (properties, resolve, reject) => { /* Called when a task is received */ }
});
```

### Task Handler

The `onTask` handler processes incoming tasks:

```javascript
onTask: (properties, resolve, reject) => {
    try {
        const result = processData(properties);
        resolve(result, true);  // Return success with data and success status
    } catch (error) {
        reject(error.message);  // Return failure with error message
    }
}
```

The task handler receives:
- `properties`: Object sent from the central socket.io server (validated before delivery)
- `resolve`: Function that accepts two parameters:
  - `results`: The processed data to return
  - `success`: Boolean flag (defaults to true) indicating success status
- `reject`: Function to call with an error message when processing fails

**Important behavior difference:**
- Using `resolve()` allows the worker to continue receiving tasks
- Using `reject()` causes the central server to pause the worker for approximately 15 minutes

## Events

The worker system handles these events:

- `connect`: Socket connected to server
- `disconnect`: Socket disconnected from server
- `worker.connect`: Worker successfully registered with server
- `worker.task`: Worker received a task
- `worker.error`: An error occurred

## Error Handling

Errors are handled through the `onError` callback:

```javascript
onError: (message) => {
    console.error('Worker error:', message);
}
```

## Graceful Shutdown

The framework handles graceful shutdown through SIGINT signal handling:

- Closes all socket connections
- Runs any registered middleware
- Exits the process

## License

[MIT License](LICENSE)
