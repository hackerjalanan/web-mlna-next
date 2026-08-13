import type { ReactNode } from "react";
import {
  Home,
  FolderKanban,
  Images,
  FileText,
  User,
} from "lucide-react";

export interface MenuItem {
  name: string;
  href: string;
  icon: ReactNode;
}

const iconProps = {
  size: 24,
  strokeWidth: 1.5,
};

export const menuItems: MenuItem[] = [
  {
    name: "Home",
    href: "/",
    icon: <Home {...iconProps} />,
  },
  {
    name: "Project",
    href: "/projects",
    icon: <FolderKanban {...iconProps} />,
  },
  {
    name: "Gallery",
    href: "/gallery",
    icon: <Images {...iconProps} />,
  },
  {
    name: "Guide",
    href: "/guide",
    icon: <FileText {...iconProps} />,
  },
  {
    name: "About",
    href: "/about",
    icon: <User {...iconProps} />,
  },
];