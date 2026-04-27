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
  isRunning: boolean;
}

export function Editor({ fileName, code, setCode, onRun, isRunning }: Props) {
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
        <span style={{ color: '#519aba', marginRight: '10px' }}>📄</span>
        {fileName}
      </EditorHeader>

      <FloatingToolbar>
        <FloatingButton $primary onClick={onRun} disabled={isRunning}>
          {isRunning ? "⏳" : "▶"} {isRunning ? "Rodando..." : "Run"}
        </FloatingButton>
        <FloatingButton disabled={!isRunning}>
          ⏹ Stop
        </FloatingButton>
        <FloatingButton>
          ↻ Restart
        </FloatingButton>
      </FloatingToolbar>

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