import { useState, useEffect, KeyboardEvent, useRef } from "react";
import {
  Sidebar as Container,
  SidebarAction,
  IconButton,
  FileList,
  FileItem,
  ContextMenu,
  ContextMenuItem,
  RenameInput,
  SidebarSearchInput,
  SearchResultGroup,
  SearchResultFileName,
  SearchResultLine,
  SearchLineNumber,
  SearchMatchText,
  SearchHighlight,
  SearchEmpty,
  FolderRow,
  DocFileItem,
} from "../theme/styles";

interface File {
  id: string;
  name: string;
  content: string;
}

interface LineMatch {
  lineNumber: number;
  text: string;
  matchStart: number;
  matchEnd: number;
}

interface SearchResult {
  file: File;
  lineMatches: LineMatch[];
}

interface Props {
  $width: number;
  $open: boolean;
  activeTab: string;
  files: File[];
  activeFileId: string;
  setActiveFileId: (id: string) => void;
  onNewFile: () => void;
  onRenameFile: (id: string, newName: string) => void;
  onDeleteFile: (id: string) => void;
  searchQuery: string;
  onSearch: (query: string) => void;
}

export function Sidebar({
  $width,
  $open,
  activeTab,
  files,
  activeFileId,
  setActiveFileId,
  onNewFile,
  onRenameFile,
  onDeleteFile,
  searchQuery,
  onSearch,
}: Props) {
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; fileId: string } | null>(null);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const sidebarInputRef = useRef<HTMLInputElement>(null);

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

  useEffect(() => {
    if (activeTab === "search") {
      sidebarInputRef.current?.focus();
    }
  }, [activeTab]);

  const searchResults: SearchResult[] = (() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];

    return files
      .map((file) => {
        const lines = file.content.split("\n");
        const lineMatches: LineMatch[] = [];

        lines.forEach((text, i) => {
          const idx = text.toLowerCase().indexOf(q);
          if (idx !== -1) {
            lineMatches.push({
              lineNumber: i + 1,
              text,
              matchStart: idx,
              matchEnd: idx + q.length,
            });
          }
        });

        const nameMatches = file.name.toLowerCase().includes(q);
        if (lineMatches.length === 0 && !nameMatches) return null;

        return { file, lineMatches };
      })
      .filter(Boolean) as SearchResult[];
  })();

  if (activeTab === "search") {
    const totalMatches = searchResults.reduce((acc, r) => acc + Math.max(r.lineMatches.length, 1), 0);

    return (
      <Container $width={$width} $open={$open}>
        <SidebarAction>
          <span>PESQUISAR</span>
          {searchQuery && <span style={{ color: '#555', fontSize: 11 }}>{totalMatches} resultado{totalMatches !== 1 ? "s" : ""}</span>}
        </SidebarAction>

        <SidebarSearchInput
          ref={sidebarInputRef}
          placeholder="Pesquisar..."
          value={searchQuery}
          onChange={(e) => onSearch(e.target.value)}
        />

        <FileList>
          {!searchQuery && (
            <SearchEmpty>Digite para pesquisar em todos os arquivos.</SearchEmpty>
          )}
          {searchQuery && searchResults.length === 0 && (
            <SearchEmpty>Nenhum resultado encontrado para "{searchQuery}".</SearchEmpty>
          )}
          {searchResults.map(({ file, lineMatches }) => (
            <SearchResultGroup key={file.id}>
              <SearchResultFileName onClick={() => setActiveFileId(file.id)}>
                <span style={{ color: '#519aba' }}>📄</span>
                <span>{file.name}</span>
                <span style={{ color: '#555', marginLeft: 'auto', fontSize: 11 }}>
                  {lineMatches.length > 0 ? `${lineMatches.length}` : ""}
                </span>
              </SearchResultFileName>

              {lineMatches.map((match, i) => (
                <SearchResultLine
                  key={i}
                  onClick={() => setActiveFileId(file.id)}
                  title={match.text.trim()}
                >
                  <SearchLineNumber>{match.lineNumber}</SearchLineNumber>
                  <SearchMatchText>
                    {match.text.slice(0, match.matchStart)}
                    <SearchHighlight>{match.text.slice(match.matchStart, match.matchEnd)}</SearchHighlight>
                    {match.text.slice(match.matchEnd)}
                  </SearchMatchText>
                </SearchResultLine>
              ))}
            </SearchResultGroup>
          ))}
        </FileList>
      </Container>
    );
  }

  if (activeTab === "docs") {
    const docFiles = files.filter(f => f.name.endsWith(".md"));
    return (
      <Container $width={$width} $open={$open}>
        <SidebarAction>
          <span>DOCUMENTAÇÃO</span>
        </SidebarAction>
        <FileList>
          <FolderRow>
            <span style={{ color: '#e8c97a' }}>▾</span>
            <span style={{ color: '#e8c97a' }}>📁</span>
            docs
          </FolderRow>
          {docFiles.map(file => (
            <DocFileItem
              key={file.id}
              $active={activeFileId === file.id}
              onClick={() => setActiveFileId(file.id)}
            >
              <span style={{ color: '#c8a4f8' }}>📖</span>
              {file.name}
            </DocFileItem>
          ))}
        </FileList>
      </Container>
    );
  }

  if (activeTab !== "explorer" && activeTab !== "file") {
    return (
      <Container $width={$width} $open={$open}>
        <SidebarAction>
          <span>{activeTab.toUpperCase()}</span>
        </SidebarAction>
      </Container>
    );
  }

  const rvxFiles = files.filter(f => !f.name.endsWith(".md"));

  return (
    <Container $width={$width} $open={$open}>
      <SidebarAction>
        <span>EXPLORER: PROJETO</span>
        <IconButton onClick={onNewFile} title="Novo Arquivo">📄+</IconButton>
      </SidebarAction>

      <FileList>
        {rvxFiles.map(file => (
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