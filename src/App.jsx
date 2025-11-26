import { useState, useRef } from 'react'
import DropZone from '@/components/DropZone'
import TiledPreview from '@/components/TiledPreview'
import Controls from '@/components/Controls'
import { ThemeProvider } from '@/components/ThemeProvider'
import { ThemeToggle } from '@/components/ThemeToggle'
import LoadingOverlay from '@/components/LoadingOverlay'
import { MediaHandler } from '@/lib/MediaHandler'

function App() {
  const [file, setFile] = useState(null)
  const [scale, setScale] = useState(100)
  const [opacity, setOpacity] = useState(100)
  const [bgColor, setBgColor] = useState('#000000')
  const [isLoading, setIsLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [loadingMessage, setLoadingMessage] = useState('')
  const [warningMessage, setWarningMessage] = useState('')
  const [error, setError] = useState(null)
  const abortControllerRef = useRef(null)

  const handleFileSelect = async (selectedFile) => {
    console.log('File selected:', selectedFile.name, selectedFile.type, selectedFile.size)
    setError(null)
    setIsLoading(true)
    setProgress(0)
    setLoadingMessage('')
    setWarningMessage('')
    
    // Create a new abort controller for this operation
    const abortController = new AbortController()
    abortControllerRef.current = abortController
    
    try {
      // Validate file type
      if (!selectedFile.type.startsWith('image/') && !selectedFile.type.startsWith('video/')) {
        throw new Error('Please select an image or video file')
      }

      let finalFile = selectedFile

      // Convert video to GIF
      if (selectedFile.type.startsWith('video/')) {
        console.log('Converting video to GIF...')
        setLoadingMessage('To optimize for use in tiled backgrounds, we are converting your video to GIF format.\nPlease wait, this may take a few seconds...')
        
        // Show warning for large files (> 1MB)
        if (selectedFile.size > 1024 * 1024) {
          setWarningMessage("Whoa! This video is gonna take a while... If you change your mind")
        }
        
        const gifBlob = await MediaHandler.convertToGif(selectedFile, (progress) => {
          if (abortController.signal.aborted) return
          setProgress(progress)
        })
        
        if (abortController.signal.aborted) return

        // Create a new File object from the Blob
        const nameParts = selectedFile.name.split('.')
        nameParts.pop()
        const newName = nameParts.join('.') + '.gif'
        
        finalFile = new File([gifBlob], newName, { type: 'image/gif' })
        console.log('Conversion complete:', finalFile.name)
      } else {
        // For images, just simulate a quick progress
        const steps = 20
        for (let i = 0; i <= steps; i++) {
          if (abortController.signal.aborted) return
          setProgress(Math.round((i / steps) * 100))
          await new Promise(resolve => setTimeout(resolve, 20))
        }
      }

      if (abortController.signal.aborted) return

      console.log('Setting file:', finalFile.name)
      setFile(finalFile)
    } catch (err) {
      if (abortControllerRef.current?.signal.aborted) return
      console.error("Error loading file:", err)
      setError(err.message || 'Failed to load file')
    } finally {
      if (!abortControllerRef.current?.signal.aborted) {
        setIsLoading(false)
        setProgress(0)
        setWarningMessage('')
      }
    }
  }

  const handleCancel = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    setIsLoading(false)
    setProgress(0)
    setWarningMessage('')
    setLoadingMessage('')
  }

  return (
    <ThemeProvider defaultTheme="system" storageKey="penrose-theme">
      <div className="min-h-screen bg-background text-foreground flex flex-col relative selection:bg-primary/20 transition-colors duration-300">
        <div className="fixed inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
        <div className="fixed inset-0 bg-gradient-to-tr from-background via-transparent to-background/80 pointer-events-none" />
        
        <header className="p-4 border-b flex justify-between items-center bg-card/50 backdrop-blur-sm fixed top-0 w-full z-50 transition-colors duration-300">
          <div className="flex items-center gap-3">
            <img 
              src="/logo.png" 
              alt="PenRose" 
              className="h-8 w-auto transition-all duration-300"
              style={{ filter: 'var(--logo-filter, none)' }}
            />
            <h1 className="text-2xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">PenRose</h1>
            <div className="h-4 w-px bg-border/50" />
            <div className="text-sm text-muted-foreground hidden sm:block">Tiled Background Tool</div>
          </div>
          <ThemeToggle />
        </header>

        <main className="flex-1 relative overflow-hidden pt-16">
          {isLoading && (
            <LoadingOverlay 
              progress={progress} 
              message={loadingMessage} 
              warningMessage={warningMessage}
              onCancel={warningMessage ? handleCancel : undefined}
            />
          )}
          
          {error && (
            <div className="absolute inset-0 z-40 flex items-center justify-center bg-background/80 backdrop-blur-sm">
              <div className="text-center p-8 rounded-2xl bg-card border shadow-xl max-w-md mx-4">
                <p className="text-destructive font-bold text-lg mb-2">Error</p>
                <p className="text-muted-foreground">{error}</p>
                <button 
                  onClick={() => setError(null)}
                  className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Dismiss
                </button>
              </div>
            </div>
          )}
          
          {file ? (
            <TiledPreview file={file} scale={scale} opacity={opacity} bgColor={bgColor} />
          ) : (
            <div className="flex items-center justify-center h-full p-4">
              <DropZone onFileSelect={handleFileSelect} isLoading={isLoading} />
            </div>
          )}
        </main>

        {file && (
          <Controls 
            scale={scale} 
            setScale={setScale} 
            opacity={opacity}
            setOpacity={setOpacity}
            bgColor={bgColor}
            setBgColor={setBgColor}
            onClear={() => setFile(null)} 
            file={file} 
          />
        )}

        <footer className="fixed bottom-0 left-0 right-0 p-3 text-center text-xs text-muted-foreground/60 bg-background/50 backdrop-blur-sm border-t border-border/30 z-40">
          © {new Date().getFullYear() > 2025 ? `2025 - ${new Date().getFullYear()}` : '2025'} PenRose. All rights reserved. a{' '}
          <a 
            href="https://fafolab.xyz" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors"
          >
            FAFO <span className="line-through">lab</span>
          </a>{' '}
          joint.
        </footer>
      </div>
    </ThemeProvider>
  )
}

export default App
