import type { ReactNode } from "react";

export interface MenuItem {
  name: string;
  href: string;
  icon: ReactNode;
}

export const menuItems: MenuItem[] = [
  {
    name: "Home",
    href: "/",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3.75 10.5L12 3.75l8.25 6.75v9a1.5 1.5 0 01-1.5 1.5h-4.5v-6h-4.5v6h-4.5a1.5 1.5 0 01-1.5-1.5v-9z"
        />
      </svg>
    ),
  },

  {
    name: "Project",
    href: "/projects",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3.75 7.5A2.25 2.25 0 016 5.25h3l2.25 2.25H18A2.25 2.25 0 0120.25 9.75v6A2.25 2.25 0 0118 18H6a2.25 2.25 0 01-2.25-2.25v-8.25z"
        />
      </svg>
    ),
  },

  {
    name: "About",
    href: "#about",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.25a7.5 7.5 0 0115 0"
        />
      </svg>
    ),
  },

  {
    name: "Contact",
    href: "/contact",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21.75 8.25v7.5a2.25 2.25 0 01-2.25 2.25H4.5a2.25 2.25 0 01-2.25-2.25v-7.5M3 8.25l9 6 9-6"
        />
      </svg>
    ),
  },
];