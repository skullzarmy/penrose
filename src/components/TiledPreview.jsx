import { useMemo, useEffect, useRef } from 'react'

export default function TiledPreview({ file, scale, opacity, bgColor }) {
  // ALL refs must be declared at the top (React rules of hooks)
  const fileUrlRef = useRef(null)
  const fileIdentityRef = useRef(null)
  const masterVideoRef = useRef(null)
  const videoRefsRef = useRef([])
  
  // Create new URL only if file actually changed
  const currentIdentity = file ? `${file.name}-${file.size}-${file.lastModified}` : null
  
  if (!file && fileUrlRef.current) {
    // File was cleared - clean up
    console.log('File cleared, cleaning up URL:', fileUrlRef.current)
    URL.revokeObjectURL(fileUrlRef.current)
    fileUrlRef.current = null
    fileIdentityRef.current = null
  } else if (file && currentIdentity !== fileIdentityRef.current) {
    // File changed - clean up old and create new
    if (fileUrlRef.current) {
      console.log('File changed, cleaning up old URL:', fileUrlRef.current)
      URL.revokeObjectURL(fileUrlRef.current)
    }
    
    // Create new URL
    fileUrlRef.current = URL.createObjectURL(file)
    fileIdentityRef.current = currentIdentity
    console.log('Created object URL:', fileUrlRef.current, 'for file:', file.name)
  }
  
  const fileUrl = fileUrlRef.current

  const isVideo = file?.type.startsWith('video/')

  // Calculate size based on scale
  const size = `${2 * scale}px`

  if (!file || !fileUrl) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p className="text-muted-foreground">No file loaded</p>
      </div>
    )
  }

  if (!isVideo) {
    return (
      <div className="absolute inset-0" style={{ backgroundColor: bgColor }}>
        <div 
          className="absolute inset-0 transition-all duration-200 ease-out"
          style={{
            backgroundImage: `url("${fileUrl}")`,
            backgroundRepeat: 'repeat',
            backgroundSize: size,
            backgroundPosition: 'center',
            opacity: opacity / 100
          }}
        />
      </div>
    )
  }

  // For video - 4x4 grid with synchronized playback
  const tiles = Array.from({ length: 16 })
  const gridSize = 4

  // Sync all videos to master
  useEffect(() => {
    if (!isVideo || !masterVideoRef.current) return

    const syncVideos = () => {
      const masterTime = masterVideoRef.current?.currentTime
      if (masterTime !== undefined) {
        videoRefsRef.current.forEach((video, i) => {
          if (video && Math.abs(video.currentTime - masterTime) > 0.3) {
            video.currentTime = masterTime
          }
        })
      }
    }

    const interval = setInterval(syncVideos, 100)
    return () => clearInterval(interval)
  }, [isVideo])

  return (
    <div className="absolute inset-0 overflow-hidden flex items-center justify-center" style={{ backgroundColor: bgColor }}>
      <div 
        className="grid transition-all duration-200 ease-out"
        style={{
          gridTemplateColumns: `repeat(${gridSize}, ${size})`,
          gridTemplateRows: `repeat(${gridSize}, ${size})`,
          width: 'fit-content',
          height: 'fit-content',
          opacity: opacity / 100
        }}
      >
        {tiles.map((_, i) => (
          <video
            key={i}
            ref={i === 0 ? masterVideoRef : (el) => { videoRefsRef.current[i] = el }}
            src={fileUrl}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover pointer-events-none"
            style={{ width: size, height: size }}
          />
        ))}
      </div>
    </div>
  )
}
