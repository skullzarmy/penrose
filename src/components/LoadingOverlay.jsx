import { Loader2 } from "lucide-react"
import { Progress } from "@/components/ui/progress"

export default function LoadingOverlay({ progress }) {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center animate-in fade-in duration-300">
      <div className="flex flex-col items-center gap-6 p-8 rounded-2xl bg-card border shadow-xl w-full max-w-sm mx-4">
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse" />
          <Loader2 className="h-12 w-12 animate-spin text-primary relative z-10" />
        </div>
        
        <div className="space-y-2 w-full text-center">
          <h3 className="text-lg font-semibold tracking-tight">Processing Media</h3>
          <p className="text-sm text-muted-foreground">
            Preparing your preview... {progress}%
          </p>
        </div>

        <Progress value={progress} className="w-full h-2" />
      </div>
    </div>
  )
}
