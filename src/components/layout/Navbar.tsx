
import { Link, useLocation } from "react-router-dom";
import { BellIcon, CalendarIcon, CreditCardIcon, HomeIcon, LayoutDashboardIcon, LineChartIcon, Menu, UsersIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";

const navItems = [
  { name: "Dashboard", href: "/", icon: HomeIcon },
  { name: "Reminders", href: "/reminders", icon: BellIcon },
  { name: "Expenses", href: "/expenses", icon: LineChartIcon },
  { name: "Subscriptions", href: "/subscriptions", icon: CreditCardIcon },
];

export default function Navbar() {
  const location = useLocation();
  const isMobile = useIsMobile();
  
  const NavLinks = () => (
    <>
      {navItems.map((item) => (
        <Link 
          key={item.name} 
          to={item.href}
          className={cn(
            "flex items-center gap-2 px-3 py-2 rounded-lg transition-all",
            "hover:bg-secondary",
            location.pathname === item.href 
              ? "bg-primary/5 text-primary font-medium" 
              : "text-foreground/70"
          )}
        >
          <item.icon className="w-5 h-5" />
          <span>{item.name}</span>
        </Link>
      ))}
    </>
  );
  
  if (isMobile) {
    return (
      <header className="sticky top-0 z-10 w-full backdrop-blur-md bg-background/80 border-b">
        <div className="flex items-center justify-between h-16 px-4">
          <Link to="/" className="flex items-center gap-2">
            <CreditCardIcon className="w-6 h-6 text-primary" />
            <span className="text-lg font-semibold">Finance Tracker</span>
          </Link>
          
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[250px] flex flex-col gap-1 pt-8">
              <NavLinks />
            </SheetContent>
          </Sheet>
        </div>
      </header>
    );
  }
  
  return (
    <header className="sticky top-0 z-10 w-full backdrop-blur-md bg-background/80 border-b">
      <div className="flex items-center justify-between h-16 px-4 md:px-8">
        <Link to="/" className="flex items-center gap-2">
          <CreditCardIcon className="w-6 h-6 text-primary" />
          <span className="text-lg font-semibold">Finance Tracker</span>
        </Link>
        
        <nav className="flex items-center space-x-1">
          <NavLinks />
        </nav>
      </div>
    </header>
  );
}
