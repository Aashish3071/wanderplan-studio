import Link from "next/link";
import { useRouter } from "next/router";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { signOut } from "next-auth/react";

const navigationItems = [
  {
    title: "Home",
    href: "/",
    icon: Icons.home,
  },
  {
    title: "Trips",
    href: "/trips",
    icon: Icons.map,
  },
  {
    title: "Discover",
    href: "/discover",
    icon: Icons.search,
  },
  {
    title: "Map",
    href: "/map",
    icon: Icons.globe,
  },
  {
    title: "Collaboration",
    href: "/collaboration",
    icon: Icons.users,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Icons.settings,
  },
];

export function MainNav() {
  const router = useRouter();
  // Make authentication optional for testing
  const auth = useAuth();
  const isAuthenticated = auth?.isAuthenticated || false;
  const session = auth?.session || null;

  return (
    <nav className="flex items-center space-x-4 lg:space-x-6">
      {navigationItems.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary",
              router.pathname === item.href
                ? "text-primary"
                : "text-muted-foreground"
            )}
          >
            <Icon className="h-4 w-4" />
            <span>{item.title}</span>
          </Link>
        );
      })}
      <div className="ml-auto flex items-center space-x-4">
        <ThemeToggle />
        {isAuthenticated ? (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => signOut({ redirect: true, callbackUrl: '/' })}
            aria-label="Sign out"
          >
            <Icons.logout className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/auth/login")}
          >
            Sign In
          </Button>
        )}
      </div>
    </nav>
  );
}
