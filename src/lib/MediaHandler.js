
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
}
