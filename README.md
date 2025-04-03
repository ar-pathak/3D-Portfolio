# Enhanced 3D Portfolio

A modern, feature-rich 3D portfolio website built with React, Three.js, and various modern web technologies. This portfolio showcases interactive 3D elements, smooth animations, and a responsive design.

![3D Portfolio Screenshot](https://via.placeholder.com/1200x600/4338CA/FFFFFF?text=3D+Portfolio)

## ✨ Features

- **Interactive 3D Elements** - Engaging three-dimensional visuals using Three.js and React Three Fiber
- **Responsive Design** - Fully responsive layout that works on all devices
- **Dark/Light Mode** - Theme toggle with persistent preferences
- **Smooth Page Transitions** - Seamless animations between pages using Framer Motion
- **Custom Cursor** - Interactive cursor with hover effects
- **Particle Background** - Dynamic, interactive particle system that responds to user movement
- **Scroll Progress Indicator** - Visual feedback on scroll position
- **Loading Animations** - Engaging loading screens with progress indicators
- **Optimized Performance** - Build optimization for faster load times
- **PWA Support** - Progressive Web App capabilities for offline access

## 🚀 Technologies Used

- **React** - UI component library
- **Three.js** - 3D graphics library
- **React Three Fiber** - React renderer for Three.js
- **Framer Motion** - Animation library
- **Tailwind CSS** - Utility-first CSS framework
- **Redux Toolkit** - State management
- **React Router** - Navigation and routing
- **Vite** - Fast build tool and development server

## 🧰 Getting Started

### Prerequisites

- Node.js (v16.0.0 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/3d-portfolio.git
   cd 3d-portfolio
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## 🛠️ Build

### Standard Build

```bash
npm run build
# or
yarn build
```

### Optimized Build (recommended for production)

```bash
npm run build:optimized
# or
yarn build:optimized
```

The optimized build:
- Analyzes and reports bundle sizes
- Adds preload hints for critical resources
- Implements performance improvements
- Optimizes asset loading

## 🎨 Project Structure

```
3d-portfolio/
├── public/          # Static assets
├── scripts/         # Build and utility scripts
├── src/
│   ├── components/  # React components
│   │   ├── 3d/      # 3D-related components
│   │   ├── common/  # Shared UI components
│   │   ├── layout/  # Layout components
│   │   ├── projects/# Project-specific components
│   │   └── sections/# Page sections
│   ├── config/      # Configuration files
│   ├── constants/   # Constants and data
│   ├── context/     # React context providers
│   ├── hooks/       # Custom React hooks
│   ├── pages/       # Page components
│   ├── store/       # Redux store
│   ├── styles/      # Global styles
│   ├── types/       # TypeScript type definitions
│   ├── utils/       # Utility functions
│   ├── App.jsx      # Main application component
│   ├── index.css    # Global CSS
│   └── main.jsx     # Application entry point
└── ...
```

## 🔧 Key Enhancements

### Interactive 3D Elements

The portfolio features multiple interactive 3D elements including:
- Floating 3D text elements in the hero section
- Particle system that responds to mouse movement
- 3D project showcase with interactive models

### Animated Cursor

Custom cursor that:
- Changes style when hovering over interactive elements
- Scales based on element type (links, headings, etc.)
- Shows click states
- Applies blend modes for better visibility

### Smooth Page Transitions

Page transitions are animated using Framer Motion with:
- Enter/exit animations
- Page-specific transitions
- Preserved 3D context between routes

### Performance Optimizations

- Optimized 3D renders with proper cleanup
- Lazy loading of heavy components
- Resource hints for faster loading
- Deferred loading of non-critical resources

## 📱 Responsive Design

The portfolio is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones

On mobile devices, the 3D effects are simplified for better performance, and the custom cursor is disabled to provide a native experience.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Three.js and React Three Fiber community
- Inspiration from creative developers around the web
- All the open-source contributors whose libraries made this possible 