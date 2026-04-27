import { 
  TopBar, 
  TopBarSection, 
  MacControls, 
  MacDot, 
  MenuLinks, 
  MenuItem, 
  SearchInput 
} from "../theme/styles";

interface Props {
  setActiveTab: (tab: string) => void;
  onRun: () => void;
  onToggleConsole: () => void;
}

export function Header({ setActiveTab, onRun, onToggleConsole }: Props) {
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
        <SearchInput 
          placeholder="🔍 roverX / Pesquisar arquivos ou comandos..." 
          onClick={() => setActiveTab("search")}
        />
      </TopBarSection>

      <TopBarSection style={{ gap: '10px', paddingRight: '10px' }}>
        <MenuItem>◁</MenuItem>
        <MenuItem>▷</MenuItem>
        <MenuItem>◫</MenuItem>
      </TopBarSection>
    </TopBar>
  );
}