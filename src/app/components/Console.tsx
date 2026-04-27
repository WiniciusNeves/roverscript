import { ConsolePanel, ConsoleHeader, ConsoleOutput } from "../theme/styles";

interface Props {
  logs: string[];
  isRunning: boolean;
  onRun: () => void;
}

export function Console({ logs, isRunning, onRun }: Props) {
  return (
    <ConsolePanel>
      <ConsoleHeader>
        <span>Console</span>
      </ConsoleHeader>
      <ConsoleOutput>
        {logs.map((log, index) => (
          <div key={index} style={{ marginBottom: '5px' }}>{log}</div>
        ))}
      </ConsoleOutput>
    </ConsolePanel>
  );
}