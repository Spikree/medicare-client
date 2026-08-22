import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthStore } from "@/store/useAuthStore";
import { LayoutGrid, LogIn, LogOut, Menu, Plus, User } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { defaultProfileImage } from "@/assets/assets";
import { useUiStore } from "@/store/UiStore";
import { Logo } from "@/components/Logo";

const marketingLinks = [
  { label: "Features", href: "#features" },
  { label: "Security", href: "#security" },
  { label: "Testimonials", href: "#testimonials" },
];

export default function Header() {
  const { authUser, logout } = useAuthStore();
  const { toggleAddHealthInfoModal } = useUiStore();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const navigate = useNavigate();

  const homePath = authUser?.role === "doctor" ? "/dashboard" : "/home";

  const handleLinkClick = (href: string): void => {
    if (href.startsWith("#")) {
      document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate(href);
    }
    setIsOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/70">
      <div className="container flex h-16 items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => navigate(authUser ? homePath : "/")}
          className="rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          aria-label="MedCare Pro home"
        >
          <Logo />
        </button>

        {authUser ? (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="hidden text-muted-foreground hover:text-foreground sm:inline-flex"
              onClick={() => navigate(homePath)}
            >
              <LayoutGrid />
              {authUser.role === "doctor" ? "Dashboard" : "My care"}
            </Button>

            <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="flex items-center gap-2 rounded-full border border-border bg-card p-1 pr-2.5 text-sm transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  aria-label="Open account menu"
                >
                  <img
                    src={authUser.profilePicture || defaultProfileImage}
                    alt=""
                    className="h-7 w-7 rounded-full object-cover"
                  />
                  <span className="hidden max-w-[10rem] truncate font-medium sm:block">
                    {authUser.name}
                  </span>
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" sideOffset={8} className="w-64">
                <DropdownMenuLabel className="flex items-center gap-3 px-2 py-2">
                  <img
                    src={authUser.profilePicture || defaultProfileImage}
                    alt=""
                    className="h-9 w-9 shrink-0 rounded-full object-cover"
                  />
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium">
                      {authUser.name}
                    </span>
                    <span className="block truncate text-xs font-normal text-muted-foreground">
                      {authUser.email}
                    </span>
                  </span>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={() => navigate("/profile")}>
                  <User className="mr-2 h-4 w-4 text-muted-foreground" />
                  Profile
                </DropdownMenuItem>

                {authUser.role === "patient" && (
                  <DropdownMenuItem onClick={toggleAddHealthInfoModal}>
                    <Plus className="mr-2 h-4 w-4 text-muted-foreground" />
                    Add health info
                  </DropdownMenuItem>
                )}

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={() => logout()}
                  className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <>
            <nav className="hidden items-center gap-1 md:flex">
              {marketingLinks.map((link) => (
                <button
                  key={link.href}
                  type="button"
                  onClick={() => handleLinkClick(link.href)}
                  className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {link.label}
                </button>
              ))}
            </nav>

            <div className="hidden items-center gap-2 md:flex">
              <Button variant="ghost" onClick={() => handleLinkClick("/auth")}>
                Sign in
              </Button>
              <Button onClick={() => handleLinkClick("/auth")}>
                Get started
              </Button>
            </div>

            <div className="md:hidden">
              <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    aria-label="Open navigation menu"
                  >
                    <Menu />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" sideOffset={8} className="w-56">
                  {marketingLinks.map((link) => (
                    <DropdownMenuItem
                      key={link.href}
                      onClick={() => handleLinkClick(link.href)}
                    >
                      {link.label}
                    </DropdownMenuItem>
                  ))}

                  <DropdownMenuSeparator />

                  <DropdownMenuItem onClick={() => handleLinkClick("/auth")}>
                    <LogIn className="mr-2 h-4 w-4 text-muted-foreground" />
                    Sign in
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleLinkClick("/auth")}
                    className="font-medium text-primary focus:text-primary"
                  >
                    Get started
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
