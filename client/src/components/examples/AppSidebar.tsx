import AppSidebar from '../AppSidebar';
import { SidebarProvider } from "@/components/ui/sidebar";

export default function AppSidebarExample() {
  const style = {
    "--sidebar-width": "20rem",
    "--sidebar-width-icon": "4rem",
  };

  const GB = 1024 * 1024 * 1024;

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AppSidebar 
          currentView="files"
          storageUsed={5.2 * GB}
          storageTotal={15 * GB}
          onViewChange={(view) => console.log('View:', view)}
          onLogout={() => console.log('Logout')}
        />
      </div>
    </SidebarProvider>
  );
}
