# Workers

A lightweight framework for distributed task processing using socket.io.

## Overview

Workers provides a simple way to create worker nodes that can connect to a socket.io server, register themselves, and process tasks. Each worker can:

- Connect to a central socket.io server
- Register with custom capabilities and configuration
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

// Create a worker instance
const worker = workers.Item({
    id: 'questioner',               // Worker identifier
    host: 'http://localhost:3000',  // Socket.io server address
    config: {                       // Worker capabilities/configuration
        name: ['string']
    },
    // Event handlers
    onConnect: ()       => { console.log('Connected to server'); },
    onDisconnect: ()    => { console.log('Disconnected from server'); },
    onJoin: ()          => { console.log('Joined worker pool, ready for tasks'); },
    onLeave: ()         => { console.log('Left worker pool'); },
    onError: (error)    => { console.log('Error:', error); }
});

// Define a task handler
worker.Fn('join', function(properties, resolve, reject) {
    try {
        // Process task with the given properties
        const result = 'Hello there ' + properties.name;
        
        // Return successful result
        resolve(result);
    } catch (error) {
        // Return failure
        reject(error.message);
    }
});
```

## Configuration System

The workers framework uses a type validation system for configuration. Each configuration property can be defined with a type specification array in the format `[type, defaultValue]`:

```javascript
// Type specifications
name: ['string'],          // String property, no default (required)
count: ['number', 10],     // Number property with default value 10
enabled: ['boolean', true], // Boolean property with default value true
items: ['array', []],      // Array property with empty array default
options: ['object', {}],   // Object property with empty object default
```

The type system supports:
- `string`: String values
- `number`: Numeric values
- `boolean`: Boolean values
- `array`: Array values
- `object`: Object values
- `function`: Function values

Benefits of this configuration approach:
- Type validation ensures properties match their expected types
- Default values are provided when properties are missing
- Nested configurations can be validated with the same pattern

## How It Works

### Connection Flow

1. **Create worker**: Define a worker with an ID, host, configuration, and event handlers
2. **Connect**: The worker connects to the socket.io server
3. **Join**: Upon successful connection, the worker registers itself with the server
4. **Process tasks**: The server sends tasks to the worker
5. **Respond**: The worker processes tasks and sends back results

### Worker Configuration

When creating a worker, you can specify:

```javascript
const worker = workers.Item({
    // Required fields
    id: 'worker-name',             // Unique identifier
    host: 'http://server:port',    // Socket.io server address
    
    // Worker configuration
    config: {
        // Define worker capabilities using type definitions
        // Each property can be defined with a type array: [type, defaultValue]
        name: ['string'],          // Requires a string value
        maxSize: ['number', 1000], // Number with default value 1000
        isActive: ['boolean', true], // Boolean with default value true
        supportedFormats: ['array', []], // Array with empty default
        settings: ['object', {}],  // Object with empty default
        
        // You can also use nested configuration objects
        advanced: {
            timeout: ['number', 30000],
            retries: ['number', 3]
        }
    },
    
    // Event handlers
    onConnect: (socket) => { /* Called when socket connects */ },
    onDisconnect: (error) => { /* Called when socket disconnects */ },
    onJoin: () => { /* Called when worker successfully joins the pool */ },
    onLeave: () => { /* Called when worker leaves the pool */ },
    onError: (error) => { /* Called when an error occurs */ }
});
```

### Worker Function

A worker can only have one task function named 'join', which handles all processing:

```javascript
worker.Fn('join', function(properties, resolve, reject) {
    // Process task using properties object sent from server
    
    if (successful) {
        resolve(result);  // Return success with data
    } else {
        reject(error);    // Return failure with error
    }
});
```

The 'join' function receives:
- `properties`: Data sent from the server for this task
- `resolve`: Function to call with the result when successful
- `reject`: Function to call with an error when processing fails

## Events

The worker system emits events during various lifecycle stages:

- `connect`: Socket connected to server
- `disconnect`: Socket disconnected from server
- `worker.join`: Worker successfully registered with server
- `worker.leave`: Worker unregistered from server
- `worker.task`: Worker received a task
- `worker.error`: An error occurred



## Error Handling

Errors are handled through the `onError` callback:

```javascript
onError: (error) => {
    console.error('Worker error:', error);
    // Log or handle the error
}
```

## License

[MIT License](LICENSE)
