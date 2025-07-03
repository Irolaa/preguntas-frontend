export interface SidebarProps {
  collapsed: boolean;
  role: string | null;
  toggleCollapsed: () => void;
}