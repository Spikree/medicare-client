import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useAuthStore } from "@/store/useAuthStore";
import { Menu, User, LogIn, UserPlus, X, LogOut, Plus } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "./ui/card";
import { defaultProfileImage } from "@/assets/assets";
import { useUiStore } from "@/store/UiStore";

export default function Header() {
  const { authUser, logout } = useAuthStore();
  const { toggleAddHealthInfoModal } = useUiStore();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleItemClick = (): void => {
    setIsOpen(false);
  };

  const handleLinkClick = (href: string): void => {
    if (href.startsWith("#")) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      window.location.href = href;
    }
    handleItemClick();
  };

  const logoutUser = () => {
    logout();
  };

  return (
    <header className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-emerald-600 hover:text-emerald-700 transition-colors duration-200 cursor-pointer">
                MedCare Pro
              </h1>
            </div>
          </div>

          {authUser ? (
            <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="relative p-2 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 transition-colors duration-200"
                  aria-label="Open navigation menu"
                >
                  {isOpen ? (
                    <X className="h-5 w-5" />
                  ) : (
                    <Menu className="h-5 w-5" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-56 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 divide-y divide-gray-100"
                sideOffset={8}
              >
                <div className="py-1">
                  <DropdownMenuItem
                    className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 cursor-pointer transition-colors duration-200"
                    onClick={() => navigate("/profile")}
                  >
                    <Card className="h-10 w-10 rounded-full">
                      <img
                        src={authUser?.profilePicture || defaultProfileImage}
                        alt=""
                        className="h-10 w-10 rounded-full"
                      />
                    </Card>
                    <div>
                      <p>{authUser.name}</p>
                      <p className="text-xs">{authUser.email}</p>
                    </div>
                  </DropdownMenuItem>
                  {authUser?.role === "patient" && (
                    <DropdownMenuItem
                      onClick={toggleAddHealthInfoModal}
                      className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 cursor-pointer transition-colors duration-200"
                    >
                      <Plus className="h-4 w-4 mr-3 text-gray-400" />
                      Add health info
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem
                    className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 cursor-pointer transition-colors duration-200"
                    onClick={() => logoutUser()}
                  >
                    <LogOut className="h-4 w-4 mr-3 text-gray-400" />
                    Log out
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <nav className="hidden md:block">
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-4">
                  <Button
                    variant="ghost"
                    className="text-gray-600 hover:text-emerald-600 hover:bg-emerald-50"
                    onClick={() => handleLinkClick("#features")}
                  >
                    Features
                  </Button>
                  <Button
                    variant="ghost"
                    className="text-gray-600 hover:text-emerald-600 hover:bg-emerald-50"
                    onClick={() => handleLinkClick("#testimonials")}
                  >
                    Testimonials
                  </Button>
                </div>

                <div className="flex items-center space-x-3 border-l border-gray-200 pl-6">
                  <Button
                    variant="ghost"
                    className="text-gray-600 hover:text-emerald-600 hover:bg-emerald-50"
                    onClick={() => handleLinkClick("/auth")}
                  >
                    <LogIn className="h-4 w-4 mr-2" />
                    Sign In
                  </Button>
                  <Button
                    className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm hover:shadow-md transition-all duration-200"
                    onClick={() => handleLinkClick("/auth")}
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Get Started
                  </Button>
                </div>
              </div>
            </nav>
          )}

          {authUser ? null : (
            <div className="md:hidden">
              <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="relative p-2 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 transition-colors duration-200"
                    aria-label="Open navigation menu"
                  >
                    {isOpen ? (
                      <X className="h-5 w-5" />
                    ) : (
                      <Menu className="h-5 w-5" />
                    )}
                  </Button>
                </DropdownMenuTrigger>

                {authUser ? (
                  ""
                ) : (
                  <DropdownMenuContent
                    align="end"
                    className="w-56 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 divide-y divide-gray-100"
                    sideOffset={8}
                  >
                    <div className="py-1">
                      <DropdownMenuItem
                        className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 cursor-pointer transition-colors duration-200"
                        onClick={() => handleLinkClick("#features")}
                      >
                        <User className="h-4 w-4 mr-3 text-gray-400" />
                        Features
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 cursor-pointer transition-colors duration-200"
                        onClick={() => handleLinkClick("#testimonials")}
                      >
                        <User className="h-4 w-4 mr-3 text-gray-400" />
                        Testimonials
                      </DropdownMenuItem>
                    </div>

                    <DropdownMenuSeparator className="h-px bg-gray-200" />

                    <div className="py-1">
                      <DropdownMenuItem
                        className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 cursor-pointer transition-colors duration-200"
                        onClick={() => handleLinkClick("/auth")}
                      >
                        <LogIn className="h-4 w-4 mr-3 text-gray-400" />
                        Sign In
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        className="flex items-center px-4 py-3 text-sm font-medium text-emerald-600 hover:bg-emerald-50 cursor-pointer transition-colors duration-200"
                        onClick={() => handleLinkClick("/auth")}
                      >
                        <UserPlus className="h-4 w-4 mr-3 text-emerald-500" />
                        Get Started
                      </DropdownMenuItem>
                    </div>
                  </DropdownMenuContent>
                )}
              </DropdownMenu>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
