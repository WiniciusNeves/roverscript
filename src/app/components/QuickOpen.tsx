"use client";

import { useState, useEffect, useRef, KeyboardEvent } from "react";
import {
  QuickOpenOverlay,
  QuickOpenModal,
  QuickOpenInput,
  QuickOpenList,
  QuickOpenItem,
  QuickOpenEmpty,
} from "../theme/styles";

interface File {
  id: string;
  name: string;
  content: string;
}

interface Props {
  files: File[];
  onSelect: (id: string) => void;
  onClose: () => void;
}

function FileIcon({ name }: { name: string }) {
  if (name.endsWith(".md")) {
    return (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#c8a4f8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
      </svg>
    );
  }
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#519aba" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
    </svg>
  );
}

export function QuickOpen({ files, onSelect, onClose }: Props) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = query.trim()
    ? files.filter(f => f.name.toLowerCase().includes(query.trim().toLowerCase()))
    : files;

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex(i => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex(i => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      if (filtered[selectedIndex]) {
        onSelect(filtered[selectedIndex].id);
      }
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  return (
    <>
      <QuickOpenOverlay onClick={onClose} />
      <QuickOpenModal>
        <div style={{ position: "relative" }}>
          <svg
            style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#858585", pointerEvents: "none" }}
            width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <QuickOpenInput
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Buscar arquivo por nome..."
          />
        </div>
        <QuickOpenList>
          {filtered.length === 0 && (
            <QuickOpenEmpty>Nenhum arquivo encontrado para "{query}"</QuickOpenEmpty>
          )}
          {filtered.map((file, i) => (
            <QuickOpenItem
              key={file.id}
              $active={i === selectedIndex}
              onClick={() => onSelect(file.id)}
              onMouseEnter={() => setSelectedIndex(i)}
            >
              <FileIcon name={file.name} />
              {file.name}
            </QuickOpenItem>
          ))}
        </QuickOpenList>
      </QuickOpenModal>
    </>
  );
}
