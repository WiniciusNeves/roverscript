import { useRef, KeyboardEvent, UIEvent } from "react";
import { 
  EditorContainer, 
  EditorHeader, 
  EditorLayout,
  LineNumbersColumn,
  CustomTextArea, 
  FloatingToolbar, 
  FloatingButton 
} from "../theme/styles";

interface Props {
  fileName: string;
  code: string;
  setCode: (code: string) => void;
  onRun: () => void;
  onStop: () => void;
  onRestart: () => void;
  isRunning: boolean;
}

export function Editor({ fileName, code, setCode, onRun, onStop, onRestart, isRunning }: Props) {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const linesRef = useRef<HTMLDivElement>(null);

  const linesCount = code.split("\n").length;
  const lines = Array.from({ length: Math.max(1, linesCount) }, (_, i) => i + 1);

  const handleScroll = (e: UIEvent<HTMLTextAreaElement>) => {
    if (linesRef.current) {
      linesRef.current.scrollTop = e.currentTarget.scrollTop;
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      
      const target = e.target as HTMLTextAreaElement;
      const start = target.selectionStart;
      const end = target.selectionEnd;

      const newCode = code.substring(0, start) + "  " + code.substring(end);
      setCode(newCode);

      setTimeout(() => {
        if (textAreaRef.current) {
          textAreaRef.current.selectionStart = textAreaRef.current.selectionEnd = start + 2;
        }
      }, 0);
    }
  };

  return (
    <EditorContainer>
      <EditorHeader>
        <span style={{ color: '#519aba', marginRight: '8px', display: 'flex', alignItems: 'center' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
          </svg>
        </span>
        {fileName}
      </EditorHeader>

      {!fileName.endsWith('.md') && <FloatingToolbar>
        <FloatingButton $primary onClick={onRun} disabled={isRunning}>
          {isRunning ? (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
          ) : (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5 3 19 12 5 21 5 3"/>
            </svg>
          )}
          {isRunning ? "Rodando..." : "Run"}
        </FloatingButton>
        <FloatingButton onClick={onStop} disabled={!isRunning}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <rect x="3" y="3" width="18" height="18" rx="2"/>
          </svg>
          Stop
        </FloatingButton>
        <FloatingButton onClick={onRestart}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="1 4 1 10 7 10"/>
            <path d="M3.51 15a9 9 0 1 0 .49-3.72"/>
          </svg>
          Restart
        </FloatingButton>
      </FloatingToolbar>}

      <EditorLayout>
        <LineNumbersColumn ref={linesRef}>
          {lines.map(num => (
            <div key={num}>{num}</div>
          ))}
        </LineNumbersColumn>
        
        <CustomTextArea
          ref={textAreaRef}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={handleKeyDown}
          onScroll={handleScroll}
          spellCheck={false}
        />
      </EditorLayout>
    </EditorContainer>
  );
}