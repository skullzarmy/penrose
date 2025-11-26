import { useState, useCallback } from 'react'
import { Upload, FileImage, FileVideo, ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function DropZone({ onFileSelect, isLoading }) {
  const [isDragging, setIsDragging] = useState(false)

  const handleDragOver = useCallback((e) => {
    e.preventDefault()
    if (!isLoading) setIsDragging(true)
  }, [isLoading])

  const handleDragLeave = useCallback((e) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    setIsDragging(false)
    if (isLoading) return

    const file = e.dataTransfer.files[0]
    if (file && (file.type.startsWith('image/') || file.type.startsWith('video/'))) {
      onFileSelect(file)
    }
  }, [onFileSelect, isLoading])

  const handleFileInput = useCallback((e) => {
    const file = e.target.files[0]
    if (file) {
      onFileSelect(file)
    }
  }, [onFileSelect])

  return (
    <div
      className={cn(
        "w-full max-w-xl p-16 border border-dashed rounded-3xl transition-all duration-500 ease-out flex flex-col items-center justify-center gap-6 cursor-pointer group relative overflow-hidden",
        isDragging 
          ? "border-primary bg-primary/5 scale-105 shadow-2xl shadow-primary/20" 
          : "border-border/40 hover:border-primary/50 hover:bg-muted/30 hover:shadow-xl hover:shadow-primary/5",
        isLoading && "opacity-50 cursor-wait pointer-events-none"
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => !isLoading && document.getElementById('file-upload').click()}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <input
        id="file-upload"
        type="file"
        className="hidden"
        accept="image/*,video/*"
        onChange={handleFileInput}
      />
      
      <div className="relative p-6 rounded-full bg-background shadow-lg group-hover:scale-110 transition-transform duration-500 border border-border/50">
        <div className="absolute inset-0 rounded-full bg-primary/10 blur-xl group-hover:blur-2xl transition-all duration-500" />
        <Upload className="w-10 h-10 text-muted-foreground group-hover:text-primary transition-colors relative z-10" />
      </div>
      
      <div className="text-center space-y-3 relative z-10">
        <h3 className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-foreground to-muted-foreground">
          Drag & drop media
        </h3>
        <p className="text-sm text-muted-foreground max-w-xs mx-auto leading-relaxed">
          Upload an image or video to preview its tiling pattern in real-time.
        </p>
      </div>

      <div className="flex gap-6 mt-6 text-xs font-medium text-muted-foreground/60 relative z-10">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-background/50 border border-border/50">
          <FileImage className="w-3.5 h-3.5" /> 
          <span>Images</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-background/50 border border-border/50">
          <FileVideo className="w-3.5 h-3.5" /> 
          <span>Videos</span>
        </div>
      </div>

      <div className="relative z-10 mt-8 pt-6 border-t border-border/40 w-full max-w-sm text-center">
        <p className="text-sm text-muted-foreground mb-3">
          Need a pattern? Try our free online pixel editor:
        </p>
        <a 
          href="https://pixel.fafolab.xyz/" 
          target="_blank" 
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 hover:bg-primary/20 text-primary font-medium transition-colors text-sm group/cta"
        >
          <span>PixelPatterns</span>
          <ExternalLink className="w-3.5 h-3.5 group-hover/cta:translate-x-0.5 transition-transform" />
        </a>
        <p className="text-xs text-muted-foreground/60 mt-3">
          Create pixel art with real-time tiling previews!
        </p>
      </div>
    </div>
  )
}
