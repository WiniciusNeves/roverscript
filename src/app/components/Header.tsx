import {
  TopBar,
  TopBarSection,
  MacControls,
  MacDot,
  MenuLinks,
  MenuItem,
  SearchInput,
  NavIconButton,
} from "../theme/styles";

interface Props {
  setActiveTab: (tab: string) => void;
  onRun: () => void;
  onToggleConsole: () => void;
  onToggleSimulator: () => void;
  onOpenQuickOpen: () => void;
  onBack: () => void;
  onForward: () => void;
  canGoBack: boolean;
  canGoForward: boolean;
}

export function Header({
  setActiveTab,
  onRun,
  onToggleConsole,
  onToggleSimulator,
  onOpenQuickOpen,
  onBack,
  onForward,
  canGoBack,
  canGoForward,
}: Props) {
  return (
    <TopBar>
      <TopBarSection>
        <MacControls>
          <MacDot $color="#ff5f56" />
          <MacDot $color="#ffbd2e" />
          <MacDot $color="#27c93f" />
        </MacControls>

        <MenuLinks>
          <MenuItem onClick={() => setActiveTab("file")}>Arquivo</MenuItem>
          <MenuItem onClick={() => setActiveTab("edit")}>Editar</MenuItem>
          <MenuItem onClick={() => setActiveTab("select")}>Seleção</MenuItem>
          <MenuItem onClick={() => setActiveTab("view")}>Ver</MenuItem>
          <MenuItem onClick={onRun}>Executar</MenuItem>
          <MenuItem onClick={onToggleConsole}>Terminal</MenuItem>
          <MenuItem onClick={() => setActiveTab("docs")}>Documentação</MenuItem>
        </MenuLinks>
      </TopBarSection>

      <TopBarSection style={{ flex: 1, justifyContent: 'center' }}>
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <svg
            style={{ position: 'absolute', left: 8, pointerEvents: 'none', color: '#858585' }}
            width="13" height="13" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <SearchInput
            placeholder="roverX / Buscar arquivo... (Ctrl+P)"
            readOnly
            onClick={onOpenQuickOpen}
            style={{ cursor: 'pointer' }}
          />
        </div>
      </TopBarSection>

      <TopBarSection style={{ gap: '4px', paddingRight: '10px' }}>
      
        <NavIconButton onClick={onBack} disabled={!canGoBack} title="Voltar">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </NavIconButton>

        
        <NavIconButton onClick={onForward} disabled={!canGoForward} title="Avançar">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </NavIconButton>

      
        <NavIconButton onClick={onToggleSimulator} title="Alternar Simulador">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <line x1="14" y1="3" x2="14" y2="21" />
          </svg>
        </NavIconButton>
      </TopBarSection>
    </TopBar>
  );
}