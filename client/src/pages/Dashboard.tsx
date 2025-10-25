import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";
import FileUploadZone from "@/components/FileUploadZone";
import FileList from "@/components/FileList";
import EmptyState from "@/components/EmptyState";
import ThemeToggle from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Upload, Grid3x3, List } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { filesAPI, authAPI, type User, type FileItem } from "@/lib/api";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

export default function Dashboard({ user: initialUser, onLogout }: DashboardProps) {
  const [currentView, setCurrentView] = useState('files');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const { toast } = useToast();

  const { data: files = [], isLoading } = useQuery<FileItem[]>({
    queryKey: ['/api/files'],
    queryFn: filesAPI.list,
  });

  const { data: user = initialUser } = useQuery<User>({
    queryKey: ['/api/auth/me'],
    queryFn: authAPI.me,
  });

  const uploadMutation = useMutation({
    mutationFn: filesAPI.upload,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/files'] });
      queryClient.invalidateQueries({ queryKey: ['/api/auth/me'] });
      toast({
        title: "Upload concluído!",
        description: "Arquivo enviado com sucesso.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro no upload",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: filesAPI.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/files'] });
      queryClient.invalidateQueries({ queryKey: ['/api/auth/me'] });
      toast({
        title: "Arquivo excluído",
        description: "Arquivo removido com sucesso.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao excluir",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleLogout = async () => {
    try {
      await authAPI.logout();
      onLogout();
    } catch (error) {
      console.error('Logout error:', error);
      onLogout();
    }
  };

  const handleFilesSelected = async (fileList: FileList) => {
    for (let i = 0; i < fileList.length; i++) {
      await uploadMutation.mutateAsync(fileList[i]);
    }
  };

  const style = {
    "--sidebar-width": "20rem",
    "--sidebar-width-icon": "4rem",
  };

  const renderContent = () => {
    if (currentView === 'upload') {
      return (
        <div className="max-w-4xl mx-auto">
          <FileUploadZone onFilesSelected={handleFilesSelected} />
        </div>
      );
    }

    if (currentView === 'files') {
      if (isLoading) {
        return <div className="text-center py-16 text-muted-foreground">Carregando...</div>;
      }
      
      if (files.length === 0) {
        return <EmptyState onUploadClick={() => setCurrentView('upload')} />;
      }
      
      return (
        <FileList 
          files={files.map(f => ({
            ...f,
            uploadedAt: new Date(f.uploadedAt),
          }))}
          onDownload={(file) => filesAPI.download(file.id)}
          onDelete={(file) => deleteMutation.mutate(file.id)}
        />
      );
    }

    if (currentView === 'recent') {
      const recentFiles = [...files]
        .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())
        .slice(0, 10);
      
      if (recentFiles.length === 0) {
        return <EmptyState onUploadClick={() => setCurrentView('upload')} />;
      }
      
      return (
        <FileList 
          files={recentFiles.map(f => ({
            ...f,
            uploadedAt: new Date(f.uploadedAt),
          }))}
          onDownload={(file) => filesAPI.download(file.id)}
          onDelete={(file) => deleteMutation.mutate(file.id)}
        />
      );
    }

    if (currentView === 'trash') {
      return <EmptyState onUploadClick={() => setCurrentView('upload')} />;
    }

    return null;
  };

  const getTitle = () => {
    switch (currentView) {
      case 'upload': return 'Enviar arquivos';
      case 'files': return 'Meus arquivos';
      case 'recent': return 'Recentes';
      case 'trash': return 'Lixeira';
      default: return 'CloudDrive';
    }
  };

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AppSidebar 
          currentView={currentView}
          onViewChange={setCurrentView}
          storageUsed={user.storageUsed}
          storageTotal={user.storageQuota}
          onLogout={handleLogout}
        />
        <div className="flex flex-col flex-1 overflow-hidden">
          <header className="flex items-center justify-between gap-4 px-6 py-4 border-b border-border bg-background">
            <div className="flex items-center gap-4">
              <SidebarTrigger data-testid="button-sidebar-toggle" />
              <h1 className="text-xl font-semibold text-foreground">{getTitle()}</h1>
            </div>
            <div className="flex items-center gap-2">
              {currentView === 'files' && files.length > 0 && (
                <div className="hidden sm:flex items-center gap-1 mr-2">
                  <Button
                    size="icon"
                    variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                    onClick={() => setViewMode('list')}
                    data-testid="button-view-list"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                    onClick={() => setViewMode('grid')}
                    data-testid="button-view-grid"
                  >
                    <Grid3x3 className="h-4 w-4" />
                  </Button>
                </div>
              )}
              {currentView !== 'upload' && (
                <Button
                  onClick={() => setCurrentView('upload')}
                  data-testid="button-upload-header"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Enviar</span>
                </Button>
              )}
              <ThemeToggle />
            </div>
          </header>
          <main className="flex-1 overflow-auto p-6">
            {renderContent()}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
