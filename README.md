# PenRose

**A Tiled Background Tool**

PenRose is a modern, open-source web application designed to help developers and designers preview and generate tiled backgrounds. Whether you're working with seamless patterns, textures, or even video loops, PenRose gives you a real-time, full-screen preview with powerful customization controls.

[**Live Demo**](https://penrose.fafolab.xyz)

![PenRose Preview](public/logo.png)

## Features

-   **Real-time Tiling Preview**: Instantly see how your image or video looks when tiled across the entire screen.
-   **Video Support**: Seamlessly tiles video backgrounds with synchronized playback across the grid.
-   **Advanced Controls**:
    -   **Zoom**: Adjust the tile scale from 10% to 300% to find the perfect density.
    -   **Opacity**: Control the transparency of your pattern layer.
    -   **Background Color**: Set a solid background color behind your tiles—perfect for transparent PNGs or creating tint effects.
-   **One-Click Export**: Generate and copy the exact HTML, CSS, and JavaScript needed to implement your tiled background on any website.
-   **Theme Support**: Fully responsive with Dark, Light, and System theme modes.
-   **Privacy Focused**: All processing happens client-side. Your files are never uploaded to a server.

## Getting Started

### Prerequisites

-   Node.js (v18 or higher)
-   npm or bun

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/skullzarmy/penrose.git
    cd penrose
    ```

2.  Install dependencies:
    ```bash
    npm install
    # or
    bun install
    ```

3.  Start the development server:
    ```bash
    npm run dev
    # or
    bun dev
    ```

4.  Open your browser and navigate to `http://localhost:5173`.

## Usage

1.  **Upload**: Drag and drop an image (PNG, JPG, GIF, SVG) or video (MP4, WEBM) onto the drop zone.
2.  **Customize**: Use the floating controls at the bottom of the screen to adjust:
    -   **Zoom**: Scale the pattern up or down.
    -   **Opacity**: Fade the pattern to blend with the background color.
    -   **Background Color**: Choose a color to sit behind the pattern.
3.  **Export**: Click the `< >` Code button to copy the implementation code to your clipboard.
4.  **Paste**: Paste the code into your project's HTML file.

## Technologies Used

-   [React](https://react.dev/)
-   [Vite](https://vitejs.dev/)
-   [Tailwind CSS](https://tailwindcss.com/)
-   [Shadcn UI](https://ui.shadcn.com/)
-   [Lucide React](https://lucide.dev/)

## Related Tools

-   [**PixelPatterns**](https://pixel.fafolab.xyz/): A free online pixel art editor that pairs perfectly with PenRose. Create your own seamless pixel patterns and test them here instantly.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Credits

Built with ❤️ by [FAFO Lab](https://fafolab.xyz).

-   Follow us on X: [@fafo_lab](https://x.com/fafo_lab)
-   Support us: [Tezos Commons](https://tezoscommons.typeform.com/to/cBeP4RnI?typeform-source=penrose)
