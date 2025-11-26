import { X, ZoomIn, ZoomOut, Code, Maximize2, Eye, Palette, Download, Loader2 } from 'lucide-react'
import { Slider } from '@/components/ui/slider'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useState, useEffect, useRef } from 'react'

import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import { MediaHandler } from '@/lib/MediaHandler'
import { SupportDialog } from './SupportDialog'

export default function Controls({ scale, setScale, opacity, setOpacity, bgColor, setBgColor, onClear, file }) {
  const [inputValue, setInputValue] = useState(scale.toString())
  const [opacityInputValue, setOpacityInputValue] = useState(opacity.toString())
  const [showZoomPopout, setShowZoomPopout] = useState(false)
  const [showOpacityPopout, setShowOpacityPopout] = useState(false)
  const [showBgColorPopout, setShowBgColorPopout] = useState(false)
  const [localBgColor, setLocalBgColor] = useState(bgColor)
  const zoomIntervalRef = useRef(null)
  const isDraggingRef = useRef(false)
  const colorDebounceRef = useRef(null)
  const [copied, setCopied] = useState(false)
  const [showSupportDialog, setShowSupportDialog] = useState(false)
  const [isZipping, setIsZipping] = useState(false)


  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Helper to check if click is inside a specific popout section
      const isInside = (elementId) => {
        const el = document.getElementById(elementId)
        return el && el.contains(event.target)
      }

      if (showZoomPopout && !isInside('zoom-controls')) {
        setShowZoomPopout(false)
      }
      if (showOpacityPopout && !isInside('opacity-controls')) {
        setShowOpacityPopout(false)
      }
      if (showBgColorPopout && !isInside('bgcolor-controls')) {
        setShowBgColorPopout(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showZoomPopout, showOpacityPopout, showBgColorPopout])

  const generateHTML = (fileName) => {
    const size = `${2 * scale}px`
    
    return `<!-- Tiled Background -->
<!-- Generated with PenRose - https://fafolab.xyz -->
<div style="
  position: fixed;
  inset: 0;
  background-color: ${bgColor};
">
  <div style="
    position: absolute;
    inset: 0;
    background-image: url('${fileName}');
    background-repeat: repeat;
    background-size: ${size};
    background-position: center;
    opacity: ${opacity / 100};
  "></div>
</div>`
  }

  const copyHTML = async () => {
    if (!file) return
    
    const fileName = file.name
    const html = generateHTML(fileName)
    
    try {
      await navigator.clipboard.writeText(html)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      setTimeout(() => setShowSupportDialog(true), 800)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleDownloadZip = async () => {
    if (!file) return
    setIsZipping(true)

    try {
      const zip = new JSZip()

      // Add media file (already converted to GIF if it was a video)
      zip.file(file.name, file)

      // Generate and add HTML
      const html = generateHTML(file.name)
      zip.file("index.html", html)

      // Generate ZIP
      const content = await zip.generateAsync({ type: "blob" })
      saveAs(content, "penrose-tiled-background.zip")
      
      // Show support dialog after download starts
      setTimeout(() => setShowSupportDialog(true), 1500)

    } catch (err) {
      console.error("Failed to generate ZIP:", err)
      alert("Failed to generate ZIP. See console for details.")
    } finally {
      setIsZipping(false)
    }
  }

  const handleSliderChange = (value) => {
    const newValue = value[0]
    setScale(newValue)
    setInputValue(newValue.toString())
  }

  const handleOpacitySliderChange = (value) => {
    const newValue = value[0]
    setOpacity(newValue)
    setOpacityInputValue(newValue.toString())
  }

  const handleInputChange = (e) => {
    const value = e.target.value
    setInputValue(value)
    const numValue = parseInt(value)
    if (!isNaN(numValue) && numValue >= 10 && numValue <= 300) {
      setScale(numValue)
    }
  }

  const handleOpacityInputChange = (e) => {
    const value = e.target.value
    setOpacityInputValue(value)
    const numValue = parseInt(value)
    if (!isNaN(numValue) && numValue >= 0 && numValue <= 100) {
      setOpacity(numValue)
    }
  }

  const handleInputBlur = () => {
    const numValue = parseInt(inputValue)
    if (isNaN(numValue) || numValue < 10) {
      setScale(10)
      setInputValue('10')
    } else if (numValue > 300) {
      setScale(300)
      setInputValue('300')
    }
  }

  const handleOpacityInputBlur = () => {
    const numValue = parseInt(opacityInputValue)
    if (isNaN(numValue) || numValue < 0) {
      setOpacity(0)
      setOpacityInputValue('0')
    } else if (numValue > 100) {
      setOpacity(100)
      setOpacityInputValue('100')
    }
  }

  const increaseZoom = () => {
    setScale(prev => {
      const newValue = Math.min(300, prev + 10)
      setInputValue(newValue.toString())
      return newValue
    })
  }

  const decreaseZoom = () => {
    setScale(prev => {
      const newValue = Math.max(10, prev - 10)
      setInputValue(newValue.toString())
      return newValue
    })
  }

  const increaseOpacity = () => {
    setOpacity(prev => {
      const newValue = Math.min(100, prev + 10)
      setOpacityInputValue(newValue.toString())
      return newValue
    })
  }

  const decreaseOpacity = () => {
    setOpacity(prev => {
      const newValue = Math.max(0, prev - 10)
      setOpacityInputValue(newValue.toString())
      return newValue
    })
  }

  const handleColorChange = (newColor) => {
    setLocalBgColor(newColor)
    
    if (colorDebounceRef.current) {
      clearTimeout(colorDebounceRef.current)
    }
    
    colorDebounceRef.current = setTimeout(() => {
      setBgColor(newColor)
    }, 150)
  }

  const startZoom = (direction) => {
    const zoomFn = direction === 'in' ? increaseZoom : decreaseZoom
    zoomFn()
    zoomIntervalRef.current = setInterval(zoomFn, 150)
  }

  const stopZoom = () => {
    if (zoomIntervalRef.current) {
      clearInterval(zoomIntervalRef.current)
      zoomIntervalRef.current = null
    }
  }

  useEffect(() => {
    return () => stopZoom()
  }, [])

  return (
    <TooltipProvider>
      <SupportDialog isOpen={showSupportDialog} onClose={() => setShowSupportDialog(false)} />
      <div className="fixed bottom-16 left-0 right-0 p-4 flex justify-center pointer-events-none z-40">
        <div className="flex items-center gap-3 bg-card/80 backdrop-blur-md px-4 py-3 rounded-2xl border shadow-2xl pointer-events-auto animate-in slide-in-from-bottom duration-300">
          {/* Zoom Popout */}
          <div className="relative" id="zoom-controls">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowZoomPopout(!showZoomPopout)}
                  className="h-9 w-9 rounded-full hover:bg-accent transition-colors"
                  aria-label="Toggle zoom controls"
                >
                  <Maximize2 className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Zoom ({scale}%)</TooltipContent>
            </Tooltip>

            {showZoomPopout && (
              <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-card border rounded-xl shadow-xl p-4 min-w-[280px] animate-in slide-in-from-bottom-2 fade-in duration-200">
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    onMouseDown={() => startZoom('out')}
                    onMouseUp={stopZoom}
                    onMouseLeave={stopZoom}
                    className="h-8 w-8 rounded-full shrink-0"
                  >
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                  
                  <div className="flex-1 flex items-center gap-2">
                    <Slider 
                      value={[scale]} 
                      onValueChange={handleSliderChange}
                      min={10} 
                      max={300} 
                      step={1}
                      className="flex-1"
                    />
                    <input
                      type="number"
                      value={inputValue}
                      onChange={handleInputChange}
                      onBlur={handleInputBlur}
                      min="10"
                      max="300"
                      className="w-14 text-center text-sm bg-muted rounded px-2 py-1 border focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <span className="text-sm text-muted-foreground">%</span>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    onMouseDown={() => startZoom('in')}
                    onMouseUp={stopZoom}
                    onMouseLeave={stopZoom}
                    className="h-8 w-8 rounded-full shrink-0"
                  >
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Opacity Popout */}
          <div className="relative" id="opacity-controls">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowOpacityPopout(!showOpacityPopout)}
                  className="h-9 w-9 rounded-full hover:bg-accent transition-colors"
                  aria-label="Toggle opacity controls"
                >
                  <Eye className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Opacity ({opacity}%)</TooltipContent>
            </Tooltip>

            {showOpacityPopout && (
              <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-card border rounded-xl shadow-xl p-4 min-w-[280px] animate-in slide-in-from-bottom-2 fade-in duration-200">
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={decreaseOpacity}
                    className="h-8 w-8 rounded-full shrink-0"
                  >
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                  
                  <div className="flex-1 flex items-center gap-2">
                    <Slider 
                      value={[opacity]} 
                      onValueChange={handleOpacitySliderChange}
                      min={0} 
                      max={100} 
                      step={1}
                      className="flex-1"
                    />
                    <input
                      type="number"
                      value={opacityInputValue}
                      onChange={handleOpacityInputChange}
                      onBlur={handleOpacityInputBlur}
                      min="0"
                      max="100"
                      className="w-14 text-center text-sm bg-muted rounded px-2 py-1 border focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <span className="text-sm text-muted-foreground">%</span>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={increaseOpacity}
                    className="h-8 w-8 rounded-full shrink-0"
                  >
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Background Color Popout */}
          <div className="relative" id="bgcolor-controls">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowBgColorPopout(!showBgColorPopout)}
                  className="h-9 w-9 rounded-full hover:bg-accent transition-colors flex items-center justify-center"
                  aria-label="Toggle background color picker"
                >
                  <div 
                    className="h-5 w-5 rounded-full border-2 border-border"
                    style={{ backgroundColor: localBgColor }}
                  />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Background Color</TooltipContent>
            </Tooltip>

            {showBgColorPopout && (
              <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-card border rounded-xl shadow-xl p-4 min-w-[200px] animate-in slide-in-from-bottom-2 fade-in duration-200">
                <div className="flex flex-col gap-3">
                  <label className="text-sm font-medium">Background Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={localBgColor}
                      onChange={(e) => handleColorChange(e.target.value)}
                      className="h-10 w-full rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={localBgColor}
                      onChange={(e) => handleColorChange(e.target.value)}
                      className="w-24 text-center text-sm bg-muted rounded px-2 py-1 border focus:outline-none focus:ring-2 focus:ring-primary font-mono"
                      placeholder="#000000"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="h-6 w-px bg-border/50" />

          {/* Copy HTML */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={copyHTML}
                className="h-9 w-9 rounded-full hover:bg-accent transition-colors relative"
                aria-label="Copy HTML code"
              >
                <Code className="h-5 w-5" />
                {copied && (
                  <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded whitespace-nowrap">
                    Copied!
                  </span>
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>Copy HTML Code</TooltipContent>
          </Tooltip>

          {/* Download ZIP */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleDownloadZip}
                disabled={isZipping}
                className="h-9 w-9 rounded-full hover:bg-accent transition-colors"
                aria-label="Download ZIP"
              >
                {isZipping ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Download className="h-5 w-5" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>Download ZIP (Optimized)</TooltipContent>
          </Tooltip>

          {/* Clear */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClear}
                className="h-9 w-9 rounded-full hover:bg-destructive hover:text-white transition-colors"
                aria-label="Clear and upload new file"
              >
                <X className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Clear & Upload New</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  )
}
