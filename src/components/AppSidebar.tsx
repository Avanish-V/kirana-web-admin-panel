import { LayoutDashboard, Package, Tags, ShoppingCart, Store, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { NavLink } from "@/components/NavLink";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

const menuItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Products", url: "/products", icon: Package },
  { title: "Categories", url: "/categories", icon: Tags },
  { title: "Orders", url: "/orders", icon: ShoppingCart },
  
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <Sidebar collapsible="icon" className="border-none">
      {/* Logo / Brand */}
      <div className="relative flex items-center gap-3 px-4 py-6">
        {/* Glow behind logo */}
        <div className="absolute left-4 top-6 h-10 w-10 rounded-xl bg-primary/30 blur-lg" />
        <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-[hsl(240,85%,50%)] text-primary-foreground font-extrabold text-lg shadow-lg shadow-primary/25 shrink-0">
          <Store className="h-5 w-5" />
        </div>
        {!collapsed && (
          <div className="flex flex-col animate-fade-in">
            <span className="text-sm font-extrabold tracking-tight text-sidebar-primary-foreground">
              Kirana Store
            </span>
            <span className="text-[10px] font-medium text-sidebar-foreground/50 uppercase tracking-wider">
              Admin Panel
            </span>
          </div>
        )}
      </div>

      {/* Separator line with gradient */}
      <div className="mx-4 h-px bg-gradient-to-r from-transparent via-sidebar-border to-transparent" />

      <SidebarContent className="pt-4 px-2">
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/30 text-[10px] font-bold uppercase tracking-[0.2em] px-3 mb-1">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <NavLink
                      to={item.url}
                      end={item.url === "/"}
                      className="group/nav relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sidebar-foreground/70 transition-all duration-200 hover:text-sidebar-foreground hover:bg-sidebar-accent"
                      activeClassName="!bg-primary/15 !text-primary font-semibold sidebar-active"
                    >
                      <item.icon className="h-4 w-4 shrink-0 transition-transform duration-200 group-hover/nav:scale-110" />
                      <span className="text-[13px]">{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="p-3">
        <div className="mx-1 h-px bg-gradient-to-r from-transparent via-sidebar-border to-transparent mb-2" />
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 w-full text-sidebar-foreground/70 transition-all duration-200 hover:text-destructive hover:bg-sidebar-accent"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {!collapsed && <span className="text-[13px] font-medium">Logout</span>}
        </button>
      </SidebarFooter>
    </Sidebar>
  );
}
