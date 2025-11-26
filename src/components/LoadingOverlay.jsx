import { Loader2 } from "lucide-react"
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'

export default function LoadingOverlay({ progress, message, warningMessage, onCancel }) {
  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="text-center p-8 rounded-2xl bg-card border shadow-xl max-w-md mx-4 space-y-4">
        <div className="relative">
          <div className="w-16 h-16 mx-auto mb-4 relative">
            <div className="absolute inset-0 rounded-full border-4 border-primary/20"></div>
            <div 
              className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"
              style={{ animationDuration: '1s' }}
            ></div>
          </div>
        </div>
        
        {message && (
          <p className="text-sm text-muted-foreground mb-2 whitespace-pre-wrap">{message}</p>
        )}
        
        <Progress value={progress} className="w-full" />
        <p className="text-sm text-muted-foreground">{progress}%</p>

        {warningMessage && (
          <div className="mt-4 pt-4 border-t border-border/50 animate-in fade-in slide-in-from-top-2">
            <p className="text-sm text-muted-foreground mb-3 whitespace-pre-wrap">{warningMessage}</p>
            {onCancel && (
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={onCancel}
                className="w-full"
              >
                Cancel
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
