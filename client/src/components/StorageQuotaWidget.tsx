import { Progress } from "@/components/ui/progress";
import { HardDrive } from "lucide-react";

interface StorageQuotaWidgetProps {
  used: number;
  total: number;
}

export default function StorageQuotaWidget({ used, total }: StorageQuotaWidgetProps) {
  const percentage = (used / total) * 100;
  const isWarning = percentage > 90;

  const formatSize = (bytes: number) => {
    const gb = bytes / (1024 * 1024 * 1024);
    return gb.toFixed(1) + ' GB';
  };

  return (
    <div className="bg-card border border-card-border rounded-lg p-4">
      <div className="flex items-center gap-3 mb-3">
        <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center">
          <HardDrive className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-foreground">Armazenamento</p>
        </div>
      </div>
      <div className="space-y-2">
        <Progress 
          value={percentage} 
          className="h-2" 
          data-testid="progress-storage"
        />
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            {formatSize(used)} de {formatSize(total)}
          </p>
          <p className={`text-xs font-medium ${isWarning ? 'text-destructive' : 'text-muted-foreground'}`}>
            {percentage.toFixed(0)}%
          </p>
        </div>
      </div>
      {isWarning && (
        <p className="text-xs text-destructive mt-2">
          Espaço quase esgotado
        </p>
      )}
    </div>
  );
}
