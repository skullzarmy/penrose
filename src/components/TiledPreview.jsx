import { useMemo } from 'react'

export default function TiledPreview({ file, scale, opacity, bgColor }) {
  const fileUrl = useMemo(() => {
    return URL.createObjectURL(file)
  }, [file])

  const size = `${2 * scale}px`

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
