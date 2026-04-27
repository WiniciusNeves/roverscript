"use client";

import { useState } from "react";
import { 
  IDEContainer, 
  Workspace, 
  MainContent, 
  EditorSplit, 
  LeftPane, 
  RightPane 
} from "./theme/styles"; // Ajuste o caminho (../ ou ./) se necessário
import { Header } from "./components/Header";
import { ActivityBar } from "./components/ActivityBar";
import { Sidebar } from "./components/Sidebar";
import { Editor } from "./components/Editor";
import { Console } from "./components/Console";
import { Simulator } from "./components/Simulator";

interface File {
  id: string;
  name: string;
  content: string;
}

export default function Home() {
  const [activeTab, setActiveTab] = useState("explorer");
  const [logs, setLogs] = useState<string[]>([
    "[SISTEMA] Motor customizado iniciado. Ocioso.",
  ]);
  const [isRunning, setIsRunning] = useState(false);
  const [isConsoleOpen, setIsConsoleOpen] = useState(true);
const [isSimulatorOpen, setIsSimulatorOpen] = useState(true);
  const [roverState, setRoverState] = useState({ position: { x: 0, y: 0 }, direction: 'N' });
  const [obstacles, setObstacles] = useState<string[]>([]);

  const [files, setFiles] = useState<File[]>([
    { id: "basic", name: "basic.rvx", content: 'move(2)\nturn("right")\nmove(1)' },
    { id: "if", name: "if.rvx", content: 'if (obstacle) {\n  turn("right")\n} else {\n  move(1)\n}' },
    { id: "loop", name: "loop.rvx", content: 'repeat(4) {\n  move(1)\n  turn("left")\n}' },
    { id: "mission", name: "mission.rvx", content: 'let steps = 5\nmove(steps)\nturn("right")\nmove(2)' },
    { id: "obstacle", name: "obstacle.rvx", content: 'placeObstacle(0, 2)\n\nmove(2)\n\nif (obstacle) {\n  turn("right")\n  move(1)\n} else {\n  move(1)\n}' }
  ]);
  const [activeFileId, setActiveFileId] = useState<string>("obstacle");

  const activeFile = files.find((f) => f.id === activeFileId) || files[0];

  const handleCodeChange = (newCode: string) => {
    setFiles((prevFiles) =>
      prevFiles.map((f) =>
        f.id === activeFileId ? { ...f, content: newCode } : f,
      ),
    );
  };

  const handleNewFile = () => {
    const newId = Date.now().toString();
    const newFile: File = {
      id: newId,
      name: `novo_${files.length + 1}.rvx`,
      content: "",
    };
    setFiles([...files, newFile]);
    setActiveFileId(newId);
  };

  const handleRenameFile = (id: string, newName: string) => {
    setFiles((prevFiles) =>
      prevFiles.map((f) => (f.id === id ? { ...f, name: newName } : f)),
    );
  };

  const handleDeleteFile = (id: string) => {
    if (files.length === 1) return;

    const newFiles = files.filter((f) => f.id !== id);
    setFiles(newFiles);

    if (activeFileId === id) {
      setActiveFileId(newFiles[0].id);
    }
  };

  const handleRun = async () => {
    if (isRunning) return;
    
    setIsRunning(true);
    setIsConsoleOpen(true);
    setObstacles([]); 
    setRoverState({ position: { x: 0, y: 0 }, direction: 'N' }); 
    setLogs(["[SISTEMA] Compilando código via motor proprietário..."]);

    try {
      const response = await fetch("/api/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: activeFile.content }),
      });

      const data = await response.json();

      if (data.success) {
        setLogs(data.logs);
        if (data.obstacles) setObstacles(data.obstacles);

        if (data.history && data.history.length > 0) {
          let currentFrame = 0;
          
          const playNextFrame = () => {
            setRoverState(data.history[currentFrame]);
            currentFrame++;
            
            if (currentFrame < data.history.length) {
              setTimeout(playNextFrame, 500); 
            } else {
              setIsRunning(false); 
            }
          };
          
          playNextFrame();
        } else {
          setIsRunning(false);
        }

      } else {
        setLogs(data.errors.map((err: string) => `[ERRO] ${err}`));
        setIsRunning(false);
      }
    } catch (error) {
      setLogs(["[ERRO FATAL] Falha de comunicação."]);
      setIsRunning(false);
    }
  };

  const toggleConsole = () => {
    setIsConsoleOpen(!isConsoleOpen);
  };

  return (
    <IDEContainer>
      <Header
        setActiveTab={setActiveTab}
        onRun={handleRun}
        onToggleConsole={toggleConsole}
      />
      
      <Workspace>
        <ActivityBar activeTab={activeTab} setActiveTab={setActiveTab} />

        <Sidebar
          activeTab={activeTab}
          files={files}
          activeFileId={activeFileId}
          setActiveFileId={setActiveFileId}
          onNewFile={handleNewFile}
          onRenameFile={handleRenameFile}
          onDeleteFile={handleDeleteFile}
        />

        <MainContent>
          <EditorSplit>
            
            <LeftPane>
              <Editor
                fileName={activeFile?.name || ""}
                code={activeFile?.content || ""}
                setCode={handleCodeChange}
                onRun={handleRun}
                isRunning={isRunning}
              />

              {isConsoleOpen && (
                <Console logs={logs} isRunning={isRunning} onRun={handleRun} />
              )}
            </LeftPane>

            {isSimulatorOpen && (
              <RightPane>
                <Simulator roverState={roverState} obstacles={obstacles} />
              </RightPane>
)}

          </EditorSplit>
        </MainContent>
      </Workspace>
    </IDEContainer>
  );
}