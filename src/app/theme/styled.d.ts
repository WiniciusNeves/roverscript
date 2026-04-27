import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    activityBar: string;
    sidebar: string;
    editorBg: string;
    panelBg: string;
    statusBar: string;
    text: string;
    textMuted: string;
    border: string;
    tabActive: string;
    tabInactive: string;
    accent: string;
  }
}