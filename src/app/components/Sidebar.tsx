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
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#519aba" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                </svg>
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
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#e8c97a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#e8c97a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
            </svg>
            docs
          </FolderRow>
          {docFiles.map(file => (
            <DocFileItem
              key={file.id}
              $active={activeFileId === file.id}
              onClick={() => setActiveFileId(file.id)}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#c8a4f8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
              </svg>
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
        <IconButton onClick={onNewFile} title="Novo Arquivo">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="12" y1="18" x2="12" y2="12"/>
            <line x1="9" y1="15" x2="15" y2="15"/>
          </svg>
        </IconButton>
      </SidebarAction>

      <FileList>
        {rvxFiles.map(file => (
          <FileItem
            key={file.id}
            $active={activeFileId === file.id}
            onClick={() => setActiveFileId(file.id)}
            onContextMenu={(e) => handleRightClick(e, file.id)}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#519aba" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
            </svg>

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