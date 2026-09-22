import type { Permission } from "@/domain/access";

interface SidebarContentProps {
  /** Closes the mobile sheet once a destination is picked. */
  onNavigate?: () => void;
}

interface NavItem {
  to: string;
  label: string;
  /** Matches the path exactly, so the index route does not stay always active. */
  end?: boolean;
  /** Hidden from members who cannot use the screen. */
  permission?: Permission;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

export type { SidebarContentProps, NavItem, NavGroup };
