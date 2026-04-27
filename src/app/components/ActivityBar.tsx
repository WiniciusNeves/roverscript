import { ActivityBar as Container, ActivityButton } from "../theme/styles";

interface Props {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function ActivityBar({ activeTab, setActiveTab }: Props) {
  return (
    <Container>
        <ActivityButton 
          $active={activeTab === "explorer" || activeTab === "file"} 
          onClick={() => setActiveTab("explorer")}
        >
          📁
        </ActivityButton>
        <ActivityButton 
          $active={activeTab === "search"} 
          onClick={() => setActiveTab("search")}
        >
          🔍
        </ActivityButton>
        <ActivityButton 
          $active={activeTab === "docs"} 
          onClick={() => setActiveTab("docs")}
        >
          📚
        </ActivityButton>
    </Container>
  );
}