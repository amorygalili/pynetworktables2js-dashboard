# FRC React Dashboard

A React-based dashboard for FRC robots using NetworkTables. This project uses Vite, React, TypeScript, and pynetworktables2js to create a modern, responsive dashboard for FRC robots.

## Prerequisites

- Node.js (v18 or higher)
- npm
- Python 3.x (if not using the included Windows executable)
- pynetworktables2js

## Installation

### 1. Install pynetworktables2js

#### Option 1: Python Installation (Cross-platform)
```bash
pip install pynetworktables2js
```

#### Option 2: Windows Executable
The `pynetworktables2js.exe` is already included in the project root directory. No additional installation needed.

### 2. Install Dashboard Dependencies

```bash
cd react-example
npm install
```

## Running the Dashboard

### 1. Start pynetworktables2js

First, start the pynetworktables2js server. This creates a WebSocket server that bridges NetworkTables to your web browser.

#### Option 1: Using Python Module (Cross-platform)
```bash
# Connect to localhost:
python -m pynetworktables2js

# To connect to a specific robot:
python -m pynetworktables2js --robot 10.XX.XX.2
```

#### Option 2: Using the Included Windows Executable
From the project root directory:
```bash
# Connect to localhost:
./pynetworktables2js.exe

# To connect to a specific robot:
./pynetworktables2js.exe --robot 10.XX.XX.2
```

The server will start on `http://localhost:8888` by default.

### 2. Start the Dashboard

In a new terminal:

```bash
cd react-example
npm run dev
```

The dashboard will be available at `http://localhost:5173` by default.

## NetworkTables API

The dashboard uses a TypeScript wrapper around the NetworkTables WebSocket API. Here are the key functions:

### Core NetworkTables Functions

```typescript
// Connect to a specific robot
NetworkTables.connect(address: string): boolean

// Get a value
NetworkTables.getValue<T>(key: string, defaultValue?: T): T | undefined

// Set a value
NetworkTables.putValue(key: string, value: any): boolean

// Check if a key exists
NetworkTables.containsKey(key: string): boolean

// Get all keys
NetworkTables.getKeys(): Set<string>

// Check connection status
NetworkTables.isWsConnected(): boolean
NetworkTables.isRobotConnected(): boolean
```

### Event Listeners

```typescript
// WebSocket connection status
NetworkTables.addWsConnectionListener(
  callback: (connected: boolean) => void,
  immediateNotify?: boolean
): () => void

// Robot connection status
NetworkTables.addRobotConnectionListener(
  callback: (connected: boolean) => void,
  immediateNotify?: boolean
): () => void

// Listen for specific key changes
NetworkTables.addKeyListener(
  key: string,
  callback: (key: string, value: any, isNew: boolean) => void,
  immediateNotify?: boolean
): () => void

// Listen for all changes
NetworkTables.addGlobalListener(
  callback: (key: string, value: any, isNew: boolean) => void,
  immediateNotify?: boolean
): () => void
```

## React Hooks

The dashboard provides React hooks for easy integration with NetworkTables:

### useNTConnection

Monitor WebSocket connection status:

```typescript
import { useNTConnection } from './nt3/useNetworktables';

function Component() {
  const isConnected = useNTConnection();
  return <div>Connected: {isConnected ? 'Yes' : 'No'}</div>;
}
```

### useRobotConnection

Monitor robot connection status:

```typescript
import { useRobotConnection } from './nt3/useNetworktables';

function Component() {
  const isRobotConnected = useRobotConnection();
  return <div>Robot Connected: {isRobotConnected ? 'Yes' : 'No'}</div>;
}
```

### useNTValue

Get and set NetworkTables values:

```typescript
import { useNTValue } from './nt3/useNetworktables';

function Component() {
  const [value, setValue] = useNTValue<number>('/SmartDashboard/MyNumber', 0);
  
  return (
    <div>
      Value: {value}
      <button onClick={() => setValue((value ?? 0) + 1)}>Increment</button>
    </div>
  );
}
```

### useNTGlobalListener

Listen to all NetworkTables changes:

```typescript
import { useNTGlobalListener } from './nt3/useNetworktables';

function Component() {
  useNTGlobalListener((key, value, isNew) => {
    console.log(`Key ${key} changed to ${value} (isNew: ${isNew})`);
  });
  
  return <div>Monitoring all NT changes...</div>;
}
```

### useNTKeys

Get all current NetworkTables keys:

```typescript
import { useNTKeys } from './nt3/useNetworktables';

function Component() {
  const keys = useNTKeys();
  
  return (
    <ul>
      {keys.map(key => (
        <li key={key}>{key}</li>
      ))}
    </ul>
  );
}
```

### useNTKeyExists

Check if a specific key exists:

```typescript
import { useNTKeyExists } from './nt3/useNetworktables';

function Component() {
  const exists = useNTKeyExists('/SmartDashboard/MyKey');
  
  return <div>Key exists: {exists ? 'Yes' : 'No'}</div>;
}
```

## Creating Custom Widgets

You can create custom widgets by combining the NetworkTables hooks with React components. Here's an example:

```typescript
import { useNTValue } from './nt3/useNetworktables';

interface MotorWidgetProps {
  ntKey: string;
  label: string;
}

function MotorWidget({ ntKey, label }: MotorWidgetProps) {
  const [speed, setSpeed] = useNTValue<number>(ntKey, 0);
  
  return (
    <div className="motor-widget">
      <h3>{label}</h3>
      <div>Speed: {speed}</div>
      <input 
        type="range" 
        min="-1" 
        max="1" 
        step="0.1"
        value={speed ?? 0}
        onChange={(e) => setSpeed(parseFloat(e.target.value))}
      />
    </div>
  );
}
```

