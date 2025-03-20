import {
  LucideProps,
  Moon,
  SunMedium,
  Laptop,
  Github,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Google,
  Home,
  Map,
  Globe,
  Users,
  Settings,
  LogOut,
  Calendar,
  Search,
  Menu,
  X,
  User,
  Bell,
  PlusCircle,
} from "lucide-react";

export type IconProps = LucideProps;

export const Icons = {
  sun: SunMedium,
  moon: Moon,
  laptop: Laptop,
  gitHub: Github,
  google: Google,
  loader: Loader2,
  chevronLeft: ChevronLeft,
  chevronRight: ChevronRight,
  home: Home,
  map: Map,
  globe: Globe,
  users: Users,
  settings: Settings,
  logout: LogOut,
  calendar: Calendar,
  search: Search,
  menu: Menu,
  close: X,
  user: User,
  bell: Bell,
  add: PlusCircle,
  logo: ({ ...props }: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 2L2 7l10 5 10-5-10-5z" />
      <path d="M2 17l10 5 10-5" />
      <path d="M2 12l10 5 10-5" />
    </svg>
  ),
};
