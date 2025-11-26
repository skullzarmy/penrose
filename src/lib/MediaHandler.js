
import { 
  Conversion, 
  BlobSource, 
  BufferTarget, 
  Output, 
  WebMOutputFormat 
} from 'mediabunny'
import { GIFEncoder, quantize } from 'gifenc'

export class MediaHandler {
  static async readFile(file, onProgress) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()

      reader.onloadstart = () => {
        if (onProgress) onProgress(0)
      }

      reader.onprogress = (event) => {
        if (event.lengthComputable && onProgress) {
          const percent = (event.loaded / event.total) * 100
          onProgress(Math.round(percent))
        }
      }

      reader.onload = () => {
        if (onProgress) onProgress(100)
        resolve(file) // We resolve with the file object itself as we use createObjectURL
      }

      reader.onerror = () => {
        reject(new Error("Failed to read file"))
      }

      // We read as ArrayBuffer just to trigger the progress events
      // For the actual preview, we'll use URL.createObjectURL(file) which is instant
      // This seems redundant but it ensures we "load" the file into memory/cache 
      // and give the user the satisfaction of a progress bar for large files.
      // Alternatively, we could just use the file object directly, but the user complained about "no progress".
      reader.readAsArrayBuffer(file)
    })
  }

  static async validateMedia(file) {
    // Basic validation
    if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
      throw new Error('Invalid file type')
    }
    return true
  }

  static async convertToWebM(file, onProgress) {
    try {
      const input = new BlobSource(file)
      const target = new BufferTarget()
      
      const output = new Output({
        target,
        format: new WebMOutputFormat(),
      })

      const conversion = await Conversion.init({
        input,
        output,
        video: {
          codec: 'vp9', // VP9 is good for web
          // We can add more options here like resizing if needed, but for now keep original
        },
        audio: {
          discard: true // Tiled backgrounds usually don't need audio
        }
      })

      if (onProgress) {
        conversion.onProgress = onProgress
      }

      await conversion.execute()

      if (!target.buffer) {
        throw new Error("Conversion failed: No output buffer")
      }

      return new Blob([target.buffer], { type: 'video/webm' })
    } catch (error) {
      console.error("Conversion error:", error)
      throw error
    }
  }

  static async convertToGif(file, onProgress) {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video')
      video.muted = true
      video.src = URL.createObjectURL(file)
      
      video.onloadedmetadata = async () => {
        try {
          const width = 480 // Max width for reasonable file size
          const scale = width / video.videoWidth
          const height = Math.round(video.videoHeight * scale)
          
          const canvas = document.createElement('canvas')
          canvas.width = width
          canvas.height = height
          const ctx = canvas.getContext('2d')
          
          const gif = new GIFEncoder()
          
          const fps = 15 // Reduced FPS for GIF size
          const duration = video.duration
          const totalFrames = Math.floor(duration * fps)
          const interval = 1 / fps
          
          let currentTime = 0
          let frameCount = 0
          
          while (currentTime < duration) {
            // Seek to time
            video.currentTime = currentTime
            await new Promise(r => video.onseeked = r)
            
            // Draw frame
            ctx.drawImage(video, 0, 0, width, height)
            const { data } = ctx.getImageData(0, 0, width, height)
            
            // Quantize colors
            const palette = quantize(data, 256)
            const index = applyPalette(data, palette)
            
            // Add frame
            gif.writeFrame(index, width, height, {
              palette,
              delay: interval * 1000,
            })
            
            // Progress
            if (onProgress) {
              onProgress(Math.round((frameCount / totalFrames) * 100))
            }
            
            currentTime += interval
            frameCount++
          }
          
          gif.finish()
          const buffer = gif.bytes()
          
          URL.revokeObjectURL(video.src)
          resolve(new Blob([buffer], { type: 'image/gif' }))
          
        } catch (err) {
          URL.revokeObjectURL(video.src)
          reject(err)
        }
      }
      
      video.onerror = () => {
        URL.revokeObjectURL(video.src)
        reject(new Error("Failed to load video"))
      }
    })
  }
}

function applyPalette(data, palette) {
  const index = new Uint8Array(data.length / 4)
  for (let i = 0; i < data.length; i += 4) {
    index[i / 4] = nearestColorIndex(
      palette,
      data[i],
      data[i + 1],
      data[i + 2]
    )
  }
  return index
}

function nearestColorIndex(palette, r, g, b) {
  let minDist = Infinity
  let index = 0
  for (let i = 0; i < palette.length; i++) {
    const pr = palette[i][0]
    const pg = palette[i][1]
    const pb = palette[i][2]
    const dist = (r - pr) ** 2 + (g - pg) ** 2 + (b - pb) ** 2
    if (dist < minDist) {
      minDist = dist
      index = i
    }
  }
  return index
}
