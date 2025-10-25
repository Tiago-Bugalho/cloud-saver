import { useState } from "react";
import { File, Image, Video, Music, FileText, Download, Trash2, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDistance } from "date-fns";
import { ptBR } from "date-fns/locale";

interface FileItem {
  id: string;
  name: string;
  size: number;
  mimeType: string;
  uploadedAt: Date;
}

interface FileListProps {
  files: FileItem[];
  onDownload?: (file: FileItem) => void;
  onDelete?: (file: FileItem) => void;
}

export default function FileList({ files, onDownload, onDelete }: FileListProps) {
  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return Image;
    if (mimeType.startsWith('video/')) return Video;
    if (mimeType.startsWith('audio/')) return Music;
    if (mimeType.includes('text') || mimeType.includes('document')) return FileText;
    return File;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getFileType = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return 'Imagem';
    if (mimeType.startsWith('video/')) return 'Vídeo';
    if (mimeType.startsWith('audio/')) return 'Áudio';
    if (mimeType.includes('pdf')) return 'PDF';
    if (mimeType.includes('document') || mimeType.includes('word')) return 'Documento';
    if (mimeType.includes('sheet') || mimeType.includes('excel')) return 'Planilha';
    return 'Arquivo';
  };

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="text-left px-6 py-3 text-sm font-medium text-foreground">Nome</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-foreground hidden md:table-cell">Tamanho</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-foreground hidden lg:table-cell">Tipo</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-foreground hidden xl:table-cell">Enviado</th>
              <th className="text-right px-6 py-3 text-sm font-medium text-foreground">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {files.map((file) => {
              const IconComponent = getFileIcon(file.mimeType);
              return (
                <tr 
                  key={file.id} 
                  className="hover-elevate"
                  data-testid={`row-file-${file.id}`}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                        <IconComponent className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{file.name}</p>
                        <p className="text-xs text-muted-foreground md:hidden">
                          {formatFileSize(file.size)}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground hidden md:table-cell">
                    {formatFileSize(file.size)}
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground hidden lg:table-cell">
                    {getFileType(file.mimeType)}
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground hidden xl:table-cell">
                    {formatDistance(file.uploadedAt, new Date(), { addSuffix: true, locale: ptBR })}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        data-testid={`button-download-${file.id}`}
                        onClick={() => {
                          console.log('Download clicked:', file.name);
                          onDownload?.(file);
                        }}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            size="icon"
                            variant="ghost"
                            data-testid={`button-menu-${file.id}`}
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => {
                              console.log('Download clicked:', file.name);
                              onDownload?.(file);
                            }}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Baixar
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => {
                              console.log('Delete clicked:', file.name);
                              onDelete?.(file);
                            }}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
