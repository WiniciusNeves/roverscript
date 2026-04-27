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
        {logs.map((log, index) => {
          let textColor = '#4af626';
          
          if (log.includes("[ERRO]")) textColor = '#ff5f56';
          else if (log.includes("[ALERTA]")) textColor = '#ffbd2e';
          else if (log.includes("[SISTEMA]")) textColor = '#519aba';

          return (
            <div key={index} style={{ marginBottom: '5px', color: textColor }}>
              {log}
            </div>
          );
        })}
      </ConsoleOutput>
    </ConsolePanel>
  );
}