import { useCallback, useState } from "react";
import { Upload, File, X } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

interface UploadingFile {
  name: string;
  size: number;
  progress: number;
}

interface FileUploadZoneProps {
  onFilesSelected?: (files: FileList) => void;
}

export default function FileUploadZone({ onFilesSelected }: FileUploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFiles(files);
    }
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFiles(files);
    }
  }, []);

  const handleFiles = (files: FileList) => {
    console.log('Files selected:', Array.from(files).map(f => f.name));
    onFilesSelected?.(files);
    
    const newFiles = Array.from(files).map(f => ({
      name: f.name,
      size: f.size,
      progress: 0
    }));
    setUploadingFiles(prev => [...prev, ...newFiles]);
    
    newFiles.forEach((file, index) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        if (progress > 100) {
          clearInterval(interval);
          setTimeout(() => {
            setUploadingFiles(prev => prev.filter(f => f.name !== file.name));
          }, 500);
        } else {
          setUploadingFiles(prev => prev.map(f => 
            f.name === file.name ? { ...f, progress } : f
          ));
        }
      }, 200);
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          border-2 border-dashed rounded-lg p-12 text-center transition-colors
          ${isDragging ? 'border-primary bg-primary/5' : 'border-border bg-card'}
        `}
      >
        <input
          type="file"
          multiple
          id="file-upload"
          data-testid="input-file-upload"
          className="hidden"
          onChange={handleFileInput}
        />
        <label htmlFor="file-upload" className="cursor-pointer">
          <div className="flex flex-col items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
              <Upload className="h-8 w-8 text-muted-foreground" />
            </div>
            <div>
              <p className="text-lg font-medium text-foreground">
                Clique para enviar ou arraste arquivos
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Suporta múltiplos arquivos
              </p>
            </div>
          </div>
        </label>
      </div>

      {uploadingFiles.length > 0 && (
        <div className="space-y-3">
          {uploadingFiles.map((file, index) => (
            <div key={`${file.name}-${index}`} className="bg-card border border-card-border rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                  <File className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <p className="text-sm font-medium text-foreground truncate">{file.name}</p>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-xs text-muted-foreground">{formatFileSize(file.size)}</span>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-6 w-6"
                        data-testid={`button-cancel-${index}`}
                        onClick={() => {
                          console.log('Upload cancelled:', file.name);
                          setUploadingFiles(prev => prev.filter(f => f.name !== file.name));
                        }}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={file.progress} className="h-2" />
                    <span className="text-xs text-muted-foreground w-10 text-right">{file.progress}%</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
