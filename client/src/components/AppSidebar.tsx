import { Cloud, Upload, Files, Clock, Trash2, LogOut } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import StorageQuotaWidget from "./StorageQuotaWidget";

interface AppSidebarProps {
  currentView?: string;
  onViewChange?: (view: string) => void;
  onLogout?: () => void;
  storageUsed?: number;
  storageTotal?: number;
}

export default function AppSidebar({ 
  currentView = 'files', 
  onViewChange,
  onLogout,
  storageUsed = 5.2 * 1024 * 1024 * 1024,
  storageTotal = 15 * 1024 * 1024 * 1024,
}: AppSidebarProps) {
  const items = [
    {
      id: 'upload',
      title: "Enviar arquivos",
      icon: Upload,
    },
    {
      id: 'files',
      title: "Meus arquivos",
      icon: Files,
    },
    {
      id: 'recent',
      title: "Recentes",
      icon: Clock,
    },
    {
      id: 'trash',
      title: "Lixeira",
      icon: Trash2,
    },
  ];

  return (
    <Sidebar>
      <SidebarHeader className="p-6">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <Cloud className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-semibold text-foreground">CloudDrive</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => {
                      console.log('View changed to:', item.id);
                      onViewChange?.(item.id);
                    }}
                    isActive={currentView === item.id}
                    data-testid={`nav-${item.id}`}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4 space-y-4">
        <StorageQuotaWidget used={storageUsed} total={storageTotal} />
        <Button
          variant="outline"
          className="w-full justify-start"
          data-testid="button-logout"
          onClick={() => {
            console.log('Logout clicked');
            onLogout?.();
          }}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sair
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
