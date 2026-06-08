"use client";

import styled from 'styled-components';

export const IDEContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  background-color: #181818;
  color: #cccccc;
  font-family: 'Consolas', 'Courier New', monospace;
  overflow: hidden;
`;

export const ActivityBar = styled.nav`
  width: 50px;
  background-color: #1e1e1e;
  border-right: 1px solid #2b2b2b;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 10px;
  gap: 20px;
`;

export const ActivityButton = styled.button<{ $active?: boolean }>`
  background: none;
  border: none;
  color: ${({ $active }) => ($active ? '#ffffff' : '#858585')};
  font-size: 20px;
  cursor: pointer;
  border-left: 2px solid ${({ $active }) => ($active ? '#ffffff' : 'transparent')};
  padding: 5px 0;
  width: 100%;

  &:hover {
    color: #ffffff;
  }
`;

export const Sidebar = styled.aside<{ $width: number; $open: boolean }>`
  width: ${({ $width, $open }) => ($open ? `${$width}px` : '0')};
  min-width: 0;
  overflow: hidden;
  flex-shrink: 0;
  background-color: #252526;
  border-right: ${({ $open }) => ($open ? '1px solid #2b2b2b' : 'none')};
  display: flex;
  flex-direction: column;
  transition: width 0.15s ease;
`;

export const ResizeHandle = styled.div`
  width: 4px;
  flex-shrink: 0;
  cursor: col-resize;
  background: transparent;
  position: relative;
  z-index: 5;

  &:hover {
    background: #007acc55;
  }
  &:active {
    background: #007acc;
  }
`;

export const SidebarHeader = styled.div`
  padding: 15px;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #858585;
`;

export const MainContent = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
`;

export const EditorHeader = styled.div`
  height: 40px;
  background-color: #1e1e1e;
  display: flex;
  align-items: center;
  padding: 0 15px;
  border-bottom: 1px solid #2b2b2b;
`;

export const CustomTextArea = styled.textarea`
  flex: 1;
  background-color: transparent;
  color: #d4d4d4;
  border: none;
  padding: 20px;
  font-family: 'Consolas', 'Courier New', monospace;
  font-size: 14px;
  resize: none;
  outline: none;
  white-space: pre;
  overflow-wrap: normal;
  overflow-x: auto;
  line-height: 1.5;
  scrollbar-width: thin;
  scrollbar-color: #3c3c3c transparent;

  &::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: #3c3c3c;
    border-radius: 3px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
`;

export const ConsolePanel = styled.footer`
  height: 250px;
  background-color: #1e1e1e;
  border-top: 1px solid #2b2b2b;
  display: flex;
  flex-direction: column;
`;

export const ConsoleHeader = styled.div`
  padding: 10px 15px;
  font-size: 12px;
  color: #e7e7e7;
  text-transform: uppercase;
  border-bottom: 1px solid #2b2b2b;
  display: flex;
  justify-content: space-between;
`;

export const ConsoleOutput = styled.div`
  flex: 1;
  padding: 15px;
  overflow-y: auto;
  font-size: 13px;
  color: #4af626;
  scrollbar-width: thin;
  scrollbar-color: #3c3c3c transparent;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: #3c3c3c;
    border-radius: 3px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
`;


export const Workspace = styled.div`
  display: flex;
  flex: 1;
  min-height: 0;
`;

export const TopBar = styled.header`
  height: 35px;
  background-color: #181818;
  border-bottom: 1px solid #2b2b2b;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 10px;
  user-select: none;
`;

export const TopBarSection = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
`;

export const MacControls = styled.div`
  display: flex;
  gap: 8px;
  margin-right: 20px;
  padding-left: 5px;
`;

export const MacDot = styled.div<{ $color: string }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${({ $color }) => $color};
  cursor: pointer;

  &:hover {
    filter: brightness(0.8);
  }
`;

export const MenuLinks = styled.nav`
  display: flex;
  gap: 15px;
`;

export const MenuItem = styled.div`
  font-size: 13px;
  color: #cccccc;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;

  &:hover {
    background-color: #2b2b2b;
    color: #ffffff;
  }
`;

export const SearchInput = styled.input`
  width: 400px;
  height: 24px;
  background-color: #2b2b2b;
  border: 1px solid #3c3c3c;
  border-radius: 6px;
  color: #cccccc;
  padding: 0 30px;
  font-size: 12px;
  text-align: center;
  outline: none;

  &:focus {
    border-color: #007acc;
    background-color: #1e1e1e;
    text-align: left;
  }
`;

export const SidebarSearchInput = styled.input`
  width: calc(100% - 24px);
  margin: 8px 12px;
  height: 26px;
  background-color: #2b2b2b;
  border: 1px solid #3c3c3c;
  border-radius: 4px;
  color: #cccccc;
  padding: 0 8px;
  font-size: 12px;
  outline: none;
  font-family: 'Consolas', 'Courier New', monospace;

  &:focus {
    border-color: #007acc;
  }
`;

export const SearchResultGroup = styled.div`
  margin-bottom: 4px;
`;

export const SearchResultFileName = styled.div`
  padding: 4px 12px;
  font-size: 12px;
  color: #cccccc;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;

  &:hover {
    background-color: #2a2d2e;
  }
`;

export const SearchResultLine = styled.div`
  padding: 2px 12px;
  padding-left: 24px;
  font-size: 12px;
  color: #858585;
  cursor: pointer;
  display: flex;
  align-items: baseline;
  gap: 8px;
  font-family: 'Consolas', 'Courier New', monospace;
  white-space: nowrap;
  overflow: hidden;

  &:hover {
    background-color: #2a2d2e;
    color: #cccccc;
  }
`;

export const SearchLineNumber = styled.span`
  color: #555;
  min-width: 20px;
  text-align: right;
  flex-shrink: 0;
  user-select: none;
`;

export const SearchMatchText = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
  min-width: 0;
`;

export const SearchHighlight = styled.mark`
  background-color: #613315;
  color: #f0a070;
  border-radius: 2px;
`;

export const SearchEmpty = styled.div`
  padding: 20px 12px;
  font-size: 12px;
  color: #555;
  text-align: center;
`;

export const QuickOpenOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 999;
`;

export const QuickOpenModal = styled.div`
  position: fixed;
  top: 50px;
  left: 50%;
  transform: translateX(-50%);
  width: 520px;
  max-width: 90vw;
  background: #252526;
  border: 1px solid #3c3c3c;
  border-radius: 6px;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.7);
  z-index: 1000;
  overflow: hidden;
`;

export const QuickOpenInput = styled.input`
  width: 100%;
  height: 38px;
  background: #2b2b2b;
  border: none;
  border-bottom: 1px solid #3c3c3c;
  color: #cccccc;
  font-size: 13px;
  padding: 0 12px 0 38px;
  outline: none;
  font-family: 'Consolas', 'Courier New', monospace;
  box-sizing: border-box;

  &::placeholder {
    color: #555;
  }
`;

export const QuickOpenList = styled.div`
  max-height: 380px;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #3c3c3c transparent;

  &::-webkit-scrollbar { width: 4px; }
  &::-webkit-scrollbar-track { background: transparent; }
  &::-webkit-scrollbar-thumb { background: #3c3c3c; border-radius: 2px; }
`;

export const QuickOpenItem = styled.div<{ $active?: boolean }>`
  padding: 7px 14px;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  font-size: 13px;
  background: ${({ $active }) => ($active ? '#094771' : 'transparent')};
  color: ${({ $active }) => ($active ? '#ffffff' : '#cccccc')};

  &:hover {
    background: ${({ $active }) => ($active ? '#094771' : '#2a2d2e')};
  }
`;

export const QuickOpenEmpty = styled.div`
  padding: 16px;
  color: #555;
  font-size: 12px;
  text-align: center;
`;

export const FolderRow = styled.div`
  padding: 4px 12px;
  font-size: 12px;
  color: #cccccc;
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: default;
  user-select: none;
  font-weight: 600;
`;

export const DocFileItem = styled.div<{ $active?: boolean }>`
  padding: 4px 12px 4px 32px;
  font-size: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: ${({ $active }) => ($active ? '#37373d' : 'transparent')};
  color: ${({ $active }) => ($active ? '#ffffff' : '#cccccc')};

  &:hover {
    background-color: #2a2d2e;
  }
`;

export const EditorContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
  min-height: 0;
`;

export const FloatingToolbar = styled.div`
  position: absolute;
  top: 55px;
  right: 25px;
  display: flex;
  gap: 5px;
  background-color: #252526;
  border: 1px solid #3c3c3c;
  border-radius: 6px;
  padding: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
  z-index: 10;
`;

export const FloatingButton = styled.button<{ $primary?: boolean }>`
  background: none;
  border: none;
  color: ${({ $primary }) => ($primary ? '#4af626' : '#cccccc')};
  font-size: 13px;
  cursor: pointer;
  padding: 6px 12px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 6px;

  &:hover {
    background-color: #333333;
    color: #ffffff;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const FileList = styled.div`
  flex: 1;
  overflow-y: auto;
`;

export const FileItem = styled.div<{ $active?: boolean }>`
  padding: 6px 15px 6px 30px;
  font-size: 13px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: ${({ $active }) => ($active ? '#37373d' : 'transparent')};
  color: ${({ $active }) => ($active ? '#ffffff' : '#cccccc')};

  &:hover {
    background-color: #2a2d2e;
  }
`;

export const SidebarAction = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #858585;
`;

export const IconButton = styled.button`
  background: none;
  border: none;
  color: #858585;
  cursor: pointer;
  font-size: 13px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: #ffffff;
  }
`;

export const NavIconButton = styled.button`
  background: none;
  border: none;
  color: #858585;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  border-radius: 4px;

  &:hover:not(:disabled) {
    color: #ffffff;
    background-color: #2b2b2b;
  }

  &:disabled {
    color: #3c3c3c;
    cursor: default;
  }
`;

export const ContextMenu = styled.div<{ $x: number; $y: number }>`
  position: absolute;
  top: ${({ $y }) => $y}px;
  left: ${({ $x }) => $x}px;
  background-color: #252526;
  border: 1px solid #3c3c3c;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  min-width: 160px;
  border-radius: 4px;
  overflow: hidden;
`;

export const ContextMenuItem = styled.div`
  padding: 8px 15px;
  font-size: 12px;
  cursor: pointer;
  color: #cccccc;

  &:hover {
    background-color: #007acc;
    color: #ffffff;
  }
`;

export const RenameInput = styled.input`
  background-color: #3c3c3c;
  border: 1px solid #007acc;
  color: #ffffff;
  font-size: 13px;
  padding: 2px 4px;
  width: 100%;
  outline: none;
  font-family: inherit;
`;

export const EditorSplit = styled.div`
  display: flex;
  flex: 1;
  min-height: 0;
`;

export const LeftPane = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  border-right: 1px solid #2b2b2b;
`;

export const RightPane = styled.div`
  width: 40%;
  background-color: #1e1e1e;
  display: flex;
  flex-direction: column;
`;

export const SimulatorHeader = styled.div`
  height: 40px;
  background-color: #1e1e1e;
  display: flex;
  align-items: center;
  padding: 0 15px;
  border-bottom: 1px solid #2b2b2b;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #858585;
`;

export const SimulatorBody = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #181818;
  overflow: hidden;
`;

export const GridBoard = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 50px);
  grid-template-rows: repeat(5, 50px);
  gap: 1px;
  background-color: #3c3c3c;
  border: 1px solid #3c3c3c;
  position: relative;
`;

export const GridCell = styled.div`
  background-color: #1e1e1e;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  position: relative;
`;

export const CellCoordinate = styled.span`
  position: absolute;
  bottom: 2px;
  right: 2px;
  font-size: 9px;
  color: #444444;
`;

export const RoverEntity = styled.div<{ $x: number; $y: number; $rotation: string }>`
  position: absolute;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  z-index: 10;

  left: ${({ $x }) => $x * 51}px;
  top: ${({ $y }) => (4 - $y) * 51}px;
  
  transform: rotate(${({ $rotation }) => $rotation});
  transition: left 0.4s ease-in-out, top 0.4s ease-in-out, transform 0.3s ease;
`;

export const EditorLayout = styled.div`
  display: flex;
  flex: 1;
  background-color: #1e1e1e;
  min-height: 0;
  position: relative;
`;

export const LineNumbersColumn = styled.div`
  padding: 20px 10px 20px 15px;
  background-color: #1e1e1e;
  color: #858585;
  font-family: 'Consolas', 'Courier New', monospace;
  font-size: 14px;
  text-align: right;
  border-right: 1px solid #2b2b2b;
  user-select: none;
  overflow: hidden;
  line-height: 1.5;
`;

