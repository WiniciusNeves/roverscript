import { useState, useEffect, KeyboardEvent } from "react";
import { 
  Sidebar as Container, 
  SidebarAction, 
  IconButton, 
  FileList, 
  FileItem,
  ContextMenu,
  ContextMenuItem,
  RenameInput
} from "../theme/styles";

interface File {
  id: string;
  name: string;
  content: string;
}

interface Props {
  activeTab: string;
  files: File[];
  activeFileId: string;
  setActiveFileId: (id: string) => void;
  onNewFile: () => void;
  onRenameFile: (id: string, newName: string) => void;
  onDeleteFile: (id: string) => void;
}

export function Sidebar({ 
  activeTab, 
  files, 
  activeFileId, 
  setActiveFileId, 
  onNewFile,
  onRenameFile,
  onDeleteFile
}: Props) {
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; fileId: string } | null>(null);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");

  useEffect(() => {
    const handleClickOutside = () => setContextMenu(null);
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  const handleRightClick = (e: React.MouseEvent, fileId: string) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, fileId });
  };

  const startRenaming = (fileId: string, currentName: string) => {
    setRenamingId(fileId);
    setRenameValue(currentName);
  };

  const handleRenameKeyDown = (e: KeyboardEvent<HTMLInputElement>, fileId: string) => {
    if (e.key === "Enter") {
      commitRename(fileId);
    } else if (e.key === "Escape") {
      setRenamingId(null);
    }
  };

  const commitRename = (fileId: string) => {
    if (renameValue.trim()) {
      onRenameFile(fileId, renameValue.trim());
    }
    setRenamingId(null);
  };

  if (activeTab !== "explorer" && activeTab !== "file") {
    return (
      <Container>
        <SidebarAction>
          <span>{activeTab === "search" ? "Pesquisar" : "Documentação"}</span>
        </SidebarAction>
      </Container>
    );
  }

  return (
    <Container>
      <SidebarAction>
        <span>EXPLORER: PROJETO</span>
        <IconButton onClick={onNewFile} title="Novo Arquivo">📄+</IconButton>
      </SidebarAction>

      <FileList>
        {files.map(file => (
          <FileItem 
            key={file.id} 
            $active={activeFileId === file.id}
            onClick={() => setActiveFileId(file.id)}
            onContextMenu={(e) => handleRightClick(e, file.id)}
          >
            <span style={{ color: '#519aba' }}>📄</span>
            
            {renamingId === file.id ? (
              <RenameInput 
                autoFocus
                value={renameValue}
                onChange={(e) => setRenameValue(e.target.value)}
                onKeyDown={(e) => handleRenameKeyDown(e, file.id)}
                onBlur={() => commitRename(file.id)}
              />
            ) : (
              file.name
            )}
          </FileItem>
        ))}
      </FileList>

      {contextMenu && (
        <ContextMenu $x={contextMenu.x} $y={contextMenu.y}>
          <ContextMenuItem onClick={() => {
            const file = files.find(f => f.id === contextMenu.fileId);
            if (file) startRenaming(file.id, file.name);
          }}>
            ✎ Renomear
          </ContextMenuItem>
          <ContextMenuItem onClick={() => onDeleteFile(contextMenu.fileId)}>
            🗑 Excluir
          </ContextMenuItem>
        </ContextMenu>
      )}
    </Container>
  );
}