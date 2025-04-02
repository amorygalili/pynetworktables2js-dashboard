import {
  useNTValue,
  useNTConnection,
  useRobotConnection,
} from "./nt3/useNetworktables";
import { BooleanBox } from "@frc-web-components/react";

function App() {
  // Monitor connection status
  const isConnected = useNTConnection();
  const isRobotConnected = useRobotConnection();

  // Get/Set a number value
  const [someNumber, setSomeNumber] = useNTValue<number>(
    "/SmartDashboard/someNumber",
    0
  );

  const [isRedAlliance] = useNTValue<boolean>("/FMSInfo/IsRedAlliance", false);

  return (
    <div>
      <div>WebSocket Connected: {isConnected ? "Yes" : "No"}</div>
      <div>Robot Connected: {isRobotConnected ? "Yes" : "No"}</div>
      <div>Alliance: {isRedAlliance ? "Red" : "Blue"}</div>
      <div>
        <BooleanBox
          label="Alliance"
          value={isRedAlliance}
          trueColor="red"
          falseColor="blue"
        />
      </div>
      <div>
        Some number: {someNumber}
        <button onClick={() => setSomeNumber((someNumber ?? 0) + 1)}>Increment</button>
        <button onClick={() => setSomeNumber((someNumber ?? 0) - 1)}>Decrement</button>
        <button onClick={() => setSomeNumber(0)}>Reset</button>
      </div>
    </div>
  );
}

export default App;
