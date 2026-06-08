"use client";

import { useState } from "react";
import { LANGUAGE_DOC, ARCHITECTURE_DOC } from "../docs/content";
import styled from "styled-components";

const ScrollArea = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 12px 14px;
  font-size: 12px;
  color: #cccccc;
  line-height: 1.6;
`;

const TabBar = styled.div`
  display: flex;
  border-bottom: 1px solid #2b2b2b;
  flex-shrink: 0;
`;

const Tab = styled.button<{ $active: boolean }>`
  flex: 1;
  background: ${({ $active }) => ($active ? "#1e1e1e" : "transparent")};
  border: none;
  border-bottom: 2px solid ${({ $active }) => ($active ? "#007acc" : "transparent")};
  color: ${({ $active }) => ($active ? "#ffffff" : "#858585")};
  font-size: 11px;
  padding: 7px 4px;
  cursor: pointer;
  font-family: inherit;

  &:hover {
    color: #ffffff;
    background: #1e1e1e;
  }
`;

const H1 = styled.h1`
  font-size: 14px;
  font-weight: 600;
  color: #e7e7e7;
  margin: 0 0 10px;
  padding-bottom: 6px;
  border-bottom: 1px solid #2b2b2b;
  font-family: inherit;
`;

const H2 = styled.h2`
  font-size: 12px;
  font-weight: 600;
  color: #c8a4f8;
  margin: 16px 0 6px;
  font-family: inherit;
`;

const H3 = styled.h3`
  font-size: 12px;
  font-weight: 600;
  color: #9cdcfe;
  margin: 12px 0 4px;
  font-family: inherit;
`;

const Hr = styled.hr`
  border: none;
  border-top: 1px solid #2b2b2b;
  margin: 12px 0;
`;

const CodeBlock = styled.pre`
  background: #141414;
  border: 1px solid #2b2b2b;
  border-radius: 4px;
  padding: 8px 10px;
  font-family: 'Consolas', 'Courier New', monospace;
  font-size: 11px;
  color: #4af626;
  overflow-x: auto;
  margin: 6px 0;
  white-space: pre;
`;

const Table = styled.table`
  border-collapse: collapse;
  width: 100%;
  font-size: 11px;
  margin: 6px 0;
`;

const Th = styled.th`
  text-align: left;
  padding: 4px 8px;
  border-bottom: 1px solid #2b2b2b;
  color: #858585;
  font-weight: 600;
`;

const Td = styled.td`
  padding: 3px 8px;
  border-bottom: 1px solid #1e1e1e;
  vertical-align: top;
`;

const P = styled.p`
  margin: 4px 0;
  color: #cccccc;
`;

const Li = styled.li`
  margin: 2px 0;
  color: #cccccc;
`;

const Ul = styled.ul`
  margin: 4px 0 4px 16px;
  padding: 0;
`;

const InlineCode = styled.code`
  background: #2b2b2b;
  padding: 1px 4px;
  border-radius: 3px;
  font-family: 'Consolas', 'Courier New', monospace;
  font-size: 11px;
  color: #ce9178;
`;

function renderInline(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  const regex = /(`[^`]+`|\*\*[^*]+\*\*)/g;
  let last = 0;
  let match;
  let key = 0;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > last) {
      parts.push(text.slice(last, match.index));
    }
    const token = match[0];
    if (token.startsWith("`")) {
      parts.push(<InlineCode key={key++}>{token.slice(1, -1)}</InlineCode>);
    } else {
      parts.push(<strong key={key++} style={{ color: "#e7e7e7" }}>{token.slice(2, -2)}</strong>);
    }
    last = match.index + token.length;
  }

  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

function MarkdownView({ content }: { content: string }) {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let i = 0;
  let key = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith("```")) {
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      elements.push(<CodeBlock key={key++}>{codeLines.join("\n")}</CodeBlock>);
      i++;
      continue;
    }

    if (line.startsWith("| ")) {
      const rows: string[][] = [];
      while (i < lines.length && lines[i].startsWith("|")) {
        if (/^\|[-| ]+\|$/.test(lines[i])) { i++; continue; }
        const cells = lines[i].split("|").slice(1, -1).map(c => c.trim());
        rows.push(cells);
        i++;
      }
      if (rows.length > 0) {
        elements.push(
          <Table key={key++}>
            <thead>
              <tr>{rows[0].map((c, j) => <Th key={j}>{renderInline(c)}</Th>)}</tr>
            </thead>
            <tbody>
              {rows.slice(1).map((row, ri) => (
                <tr key={ri}>{row.map((c, j) => <Td key={j}>{renderInline(c)}</Td>)}</tr>
              ))}
            </tbody>
          </Table>
        );
      }
      continue;
    }

    if (line.startsWith("### ")) {
      elements.push(<H3 key={key++}>{renderInline(line.slice(4))}</H3>);
    } else if (line.startsWith("## ")) {
      elements.push(<H2 key={key++}>{renderInline(line.slice(3))}</H2>);
    } else if (line.startsWith("# ")) {
      elements.push(<H1 key={key++}>{renderInline(line.slice(2))}</H1>);
    } else if (line.startsWith("---")) {
      elements.push(<Hr key={key++} />);
    } else if (line.startsWith("- ") || line.startsWith("* ")) {
      const listItems: React.ReactNode[] = [];
      while (i < lines.length && (lines[i].startsWith("- ") || lines[i].startsWith("* "))) {
        listItems.push(<Li key={i}>{renderInline(lines[i].slice(2))}</Li>);
        i++;
      }
      elements.push(<Ul key={key++}>{listItems}</Ul>);
      continue;
    } else if (line.trim() !== "") {
      elements.push(<P key={key++}>{renderInline(line)}</P>);
    }

    i++;
  }

  return <>{elements}</>;
}

export function DocsPanel() {
  const [activeDoc, setActiveDoc] = useState<"language" | "architecture">("language");

  return (
    <>
      <TabBar>
        <Tab $active={activeDoc === "language"} onClick={() => setActiveDoc("language")}>
          Linguagem RVX
        </Tab>
        <Tab $active={activeDoc === "architecture"} onClick={() => setActiveDoc("architecture")}>
          Arquitetura
        </Tab>
      </TabBar>
      <ScrollArea>
        <MarkdownView content={activeDoc === "language" ? LANGUAGE_DOC : ARCHITECTURE_DOC} />
      </ScrollArea>
    </>
  );
}
