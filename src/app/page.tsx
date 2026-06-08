"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import {
  IDEContainer,
  Workspace,
  MainContent,
  EditorSplit,
  LeftPane,
  RightPane,
  ResizeHandle,
} from "./theme/styles";
import { Header } from "./components/Header";
import { LANGUAGE_DOC, ARCHITECTURE_DOC } from "./docs/content";
import { ActivityBar } from "./components/ActivityBar";
import { Sidebar } from "./components/Sidebar";
import { Editor } from "./components/Editor";
import { Console } from "./components/Console";
import { Simulator } from "./components/Simulator";
import { QuickOpen } from "./components/QuickOpen";

interface File {
  id: string;
  name: string;
  content: string;
}

export default function Home() {
  const [activeTab, setActiveTab] = useState("explorer");
  const [searchQuery, setSearchQuery] = useState("");
  const [isQuickOpenOpen, setIsQuickOpenOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "p") {
        e.preventDefault();
        setIsQuickOpenOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);
  const [fileHistory, setFileHistory] = useState<string[]>(["obstacle"]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [logs, setLogs] = useState<string[]>([
    "[SISTEMA] Motor customizado iniciado. Ocioso.",
  ]);
  const [isRunning, setIsRunning] = useState(false);
  const [isConsoleOpen, setIsConsoleOpen] = useState(true);
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(true);
  const [roverState, setRoverState] = useState({
    position: { x: 0, y: 0 },
    direction: "N",
  });
  const [obstacles, setObstacles] = useState<string[]>([]);

  const [files, setFiles] = useState<File[]>([
    {
      id: "basic",
      name: "basic.rvx",
      content: 'move(2)\nturn("right")\nmove(1)',
    },
    {
      id: "if",
      name: "if.rvx",
      content: 'if (obstacle) {\n  turn("right")\n} else {\n  move(1)\n}',
    },
    {
      id: "loop",
      name: "loop.rvx",
      content: 'repeat(4) {\n  move(1)\n  turn("left")\n}',
    },
    {
      id: "mission",
      name: "mission.rvx",
      content: 'let steps = 5\nmove(steps)\nturn("right")\nmove(2)',
    },
    {
      id: "obstacle",
      name: "obstacle.rvx",
      content:
        'placeObstacle(0, 2)\n\nmove(2)\n\nif (obstacle) {\n  turn("right")\n  move(1)\n} else {\n  move(1)\n}',
    },
    {
      id: "doc-language",
      name: "language.md",
      content: LANGUAGE_DOC,
    },
    {
      id: "doc-architecture",
      name: "architecture.md",
      content: ARCHITECTURE_DOC,
    },
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

  const generateRandomWorld = () => {
    const newObstacles: string[] = [];
    const numObstacles = Math.floor(Math.random() * 4) + 1;

    while (newObstacles.length < numObstacles) {
      const rx = Math.floor(Math.random() * 5);
      const ry = Math.floor(Math.random() * 5);

      if (rx === 0 && ry === 0) continue;

      const obs = `${rx},${ry}`;
      if (!newObstacles.includes(obs)) newObstacles.push(obs);
    }

    setObstacles(newObstacles);
    setRoverState({ position: { x: 0, y: 0 }, direction: "N" });
    setLogs(["[SISTEMA] Novo terreno gerado. Pronto para exploração."]);
  };

  const runCode = async () => {
    const runId = ++runIdRef.current;
    setIsRunning(true);
    setIsConsoleOpen(true);
    setObstacles([]);
    setRoverState({ position: { x: 0, y: 0 }, direction: "N" });
    setLogs(["[SISTEMA] Compilando código via motor proprietário..."]);

    try {
      const response = await fetch("/api/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: activeFile.content,
          initialObstacles: [],
        }),
      });

      const data = await response.json();

      if (runIdRef.current !== runId) return;

      if (data.success) {
        setLogs(data.logs);
        if (data.obstacles) setObstacles(data.obstacles);

        if (data.history && data.history.length > 0) {
          let currentFrame = 0;

          const playNextFrame = () => {
            if (runIdRef.current !== runId) return;
            setRoverState(data.history[currentFrame]);
            currentFrame++;

            if (currentFrame < data.history.length) {
              setTimeout(playNextFrame, 500);
            } else {
              if (runIdRef.current === runId) setIsRunning(false);
            }
          };

          playNextFrame();
        } else {
          setIsRunning(false);
        }
      } else {
        const errorList = data.errors || ["Erro desconhecido na compilação."];
        setLogs(errorList.map((err: string) => `[ERRO] ${err}`));
        setIsRunning(false);
      }
    } catch (error) {
      if (runIdRef.current === runId) {
        setLogs(["[ERRO FATAL] Falha de comunicação."]);
        setIsRunning(false);
      }
    }
  };

  const handleRun = () => {
    if (isRunning) return;
    runCode();
  };

  const SIDEBAR_MIN = 150;
  const SIDEBAR_MAX = 500;
  const SIDEBAR_DEFAULT = 250;

  const [sidebarWidth, setSidebarWidth] = useState(SIDEBAR_DEFAULT);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const sidebarWidthRef = useRef(SIDEBAR_DEFAULT);
  const lastRvxFileIdRef = useRef("obstacle");
  const runIdRef = useRef(0);

  const handleResizeStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = sidebarWidthRef.current;

    const onMouseMove = (ev: MouseEvent) => {
      const newWidth = startWidth + (ev.clientX - startX);
      if (newWidth < SIDEBAR_MIN) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
        const clamped = Math.min(newWidth, SIDEBAR_MAX);
        setSidebarWidth(clamped);
        sidebarWidthRef.current = clamped;
      }
    };

    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };

    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  }, []);

  const handleActivityBarTab = (tab: string) => {
    if (tab === activeTab && isSidebarOpen) {
      setIsSidebarOpen(false);
    } else {
      setIsSidebarOpen(true);
      setActiveTab(tab);
      if (activeTab === "docs" && tab !== "docs") {
        const current = files.find(f => f.id === activeFileId);
        if (current?.name.endsWith(".md")) {
          setActiveFileId(lastRvxFileIdRef.current);
        }
      }
    }
  };

  const handleStop = () => {
    runIdRef.current++;
    setIsRunning(false);
  };

  const handleRestart = () => {
    runCode();
  };

  const toggleConsole = () => setIsConsoleOpen((v) => !v);
  const toggleSimulator = () => setIsSimulatorOpen((v) => !v);

  const navigateToFile = (id: string) => {
    const file = files.find(f => f.id === id);
    if (file && !file.name.endsWith(".md")) {
      lastRvxFileIdRef.current = id;
    }
    const newHistory = [...fileHistory.slice(0, historyIndex + 1), id];
    setFileHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setActiveFileId(id);
  };

  const handleBack = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setActiveFileId(fileHistory[newIndex]);
    }
  };

  const handleForward = () => {
    if (historyIndex < fileHistory.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setActiveFileId(fileHistory[newIndex]);
    }
  };

  return (
    <IDEContainer>
      <Header
        setActiveTab={setActiveTab}
        onRun={handleRun}
        onToggleConsole={toggleConsole}
        onToggleSimulator={toggleSimulator}
        onOpenQuickOpen={() => setIsQuickOpenOpen(true)}
        onBack={handleBack}
        onForward={handleForward}
        canGoBack={historyIndex > 0}
        canGoForward={historyIndex < fileHistory.length - 1}
      />

      {isQuickOpenOpen && (
        <QuickOpen
          files={files}
          onSelect={(id) => {
            navigateToFile(id);
            setIsQuickOpenOpen(false);
            const file = files.find(f => f.id === id);
            if (file?.name.endsWith(".md")) {
              setActiveTab("docs");
            } else {
              setActiveTab("explorer");
            }
          }}
          onClose={() => setIsQuickOpenOpen(false)}
        />
      )}

      <Workspace>
        <ActivityBar activeTab={activeTab} setActiveTab={handleActivityBarTab} />

        <Sidebar
          $width={sidebarWidth}
          $open={isSidebarOpen}
          activeTab={activeTab}
          files={files}
          activeFileId={activeFileId}
          setActiveFileId={(id) => {
            navigateToFile(id);
            if (activeTab !== "docs") setActiveTab("explorer");
          }}
          onNewFile={handleNewFile}
          onRenameFile={handleRenameFile}
          onDeleteFile={handleDeleteFile}
          searchQuery={searchQuery}
          onSearch={setSearchQuery}
        />

        {activeTab !== "docs" && (
          <ResizeHandle onMouseDown={handleResizeStart} />
        )}

        <MainContent>
          <EditorSplit>
            <LeftPane>
              <Editor
                fileName={activeFile?.name || ""}
                code={activeFile?.content || ""}
                setCode={handleCodeChange}
                onRun={handleRun}
                onStop={handleStop}
                onRestart={handleRestart}
                isRunning={isRunning}
              />

              {isConsoleOpen && activeTab !== "docs" && (
                <Console logs={logs} isRunning={isRunning} onRun={handleRun} />
              )}
            </LeftPane>

            {isSimulatorOpen && activeTab !== "docs" && (
              <RightPane>
                <Simulator
                  roverState={roverState}
                  obstacles={obstacles}
                  onRandomizeBoard={generateRandomWorld}
                />
              </RightPane>
            )}
          </EditorSplit>
        </MainContent>
      </Workspace>
    </IDEContainer>
  );
}
