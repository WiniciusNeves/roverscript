import { FolderOpen, Search, BookOpen } from "lucide-react";
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
          <FolderOpen size={20} />
        </ActivityButton>
        <ActivityButton
          $active={activeTab === "search"}
          onClick={() => setActiveTab("search")}
        >
          <Search size={20} />
        </ActivityButton>
        <ActivityButton
          $active={activeTab === "docs"}
          onClick={() => setActiveTab("docs")}
        >
          <BookOpen size={20} />
        </ActivityButton>
    </Container>
  );
}