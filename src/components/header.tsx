import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

export default function Header() {
  return (
    <header className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-emerald-600">
                MedCare Pro
              </h1>
            </div>
          </div>

          <nav className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <a
                href="#features"
                className="text-gray-600 hover:text-emerald-600 px-3 py-2 text-sm font-medium"
              >
                Features
              </a>
              <a
                href="#pricing"
                className="text-gray-600 hover:text-emerald-600 px-3 py-2 text-sm font-medium"
              >
                Pricing
              </a>
              <a
                href="#testimonials"
                className="text-gray-600 hover:text-emerald-600 px-3 py-2 text-sm font-medium"
              >
                Testimonials
              </a>
              <a
                href="#contact"
                className="text-gray-600 hover:text-emerald-600 px-3 py-2 text-sm font-medium"
              >
                Contact
              </a>
            </div>
          </nav>

          <div className="hidden md:block">
            <div className="ml-4 flex items-center space-x-4">
              <Button variant="ghost" asChild>
                <a href="/login">Sign In</a>
              </Button>
              <Button className="bg-emerald-600 hover:bg-emerald-700" asChild>
                <a href="/signup">Get Started</a>
              </Button>
            </div>
          </div>

          <div className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
