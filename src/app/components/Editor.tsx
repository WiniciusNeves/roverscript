"use client";

import { useRef, KeyboardEvent } from "react";
import { 
  EditorContainer, 
  EditorHeader, 
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

      <CustomTextArea
        ref={textAreaRef}
        value={code}
        onChange={(e) => setCode(e.target.value)}
        onKeyDown={handleKeyDown}
        spellCheck={false}
      />
    </EditorContainer>
  );
}