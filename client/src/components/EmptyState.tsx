import { CloudOff } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  onUploadClick?: () => void;
}

export default function EmptyState({ onUploadClick }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-4">
        <CloudOff className="h-10 w-10 text-muted-foreground" />
      </div>
      <h3 className="text-xl font-semibold text-foreground mb-2">
        Nenhum arquivo ainda
      </h3>
      <p className="text-sm text-muted-foreground text-center max-w-sm mb-6">
        Comece enviando seus primeiros arquivos para a nuvem. Eles ficarão seguros e acessíveis de qualquer lugar.
      </p>
      <Button 
        onClick={() => {
          console.log('Upload clicked from empty state');
          onUploadClick?.();
        }}
        data-testid="button-upload-empty"
      >
        Enviar arquivos
      </Button>
    </div>
  );
}
