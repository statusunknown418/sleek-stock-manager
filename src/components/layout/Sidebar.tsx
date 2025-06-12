
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import { 
  Package, 
  BarChart3, 
  Settings, 
  Users, 
  MapPin, 
  FolderOpen,
  Building2,
  LogOut
} from "lucide-react";
import { signOut, useSession, useActiveOrganization } from "../../lib/auth/client";
import { useLocation, useNavigate } from "react-router-dom";

const sidebarItems = [
  { icon: Package, label: "Products", href: "/products" },
  { icon: BarChart3, label: "Dashboard", href: "/dashboard" },
  { icon: MapPin, label: "Locations", href: "/locations" },
  { icon: FolderOpen, label: "Categories", href: "/categories" },
  { icon: Users, label: "Team", href: "/team" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { data: session } = useSession();
  const { data: activeOrg } = useActiveOrganization();

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  return (
    <div className="flex h-full w-64 flex-col border-r border-border bg-card">
      <div className="flex h-16 items-center justify-between px-6 border-b border-border">
        <div className="flex items-center space-x-2">
          <Package className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold">Inventory</span>
        </div>
      </div>

      {activeOrg && (
        <div className="px-6 py-4 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-medium text-sm">{activeOrg.name}</p>
              <p className="text-xs text-muted-foreground">Organization</p>
            </div>
          </div>
        </div>
      )}

      <nav className="flex-1 px-4 py-6 space-y-2">
        {sidebarItems.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Button
              key={item.href}
              variant={isActive ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start h-10",
                isActive && "bg-secondary/80"
              )}
              onClick={() => navigate(item.href)}
            >
              <item.icon className="w-4 h-4 mr-3" />
              {item.label}
            </Button>
          );
        })}
      </nav>

      <div className="px-4 py-4 border-t border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
              <span className="text-xs font-medium text-primary">
                {session?.user?.name?.charAt(0)?.toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{session?.user?.name}</p>
              <p className="text-xs text-muted-foreground truncate">{session?.user?.email}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSignOut}
            className="h-8 w-8 p-0"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
