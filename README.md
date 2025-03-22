# Modern 3D Portfolio Website

A stunning, responsive portfolio website built with React, Three.js, and TailwindCSS. This portfolio showcases projects, skills, and experiences with beautiful 3D animations and modern UI design.

## 🌟 Features

- **3D Graphics & Animations**: Interactive 3D elements using Three.js and React Three Fiber
- **Responsive Design**: Fully responsive layout that works on all devices
- **Dark/Light Mode**: Theme switching with smooth transitions
- **Loading States**: Beautiful loading animations and skeleton screens
- **Modern UI**: Clean and intuitive user interface
- **Performance Optimized**: Optimized for fast loading and smooth animations

## 🛠️ Tech Stack

- **Frontend Framework**: React.js
- **3D Graphics**: Three.js, React Three Fiber, Drei
- **Styling**: TailwindCSS
- **Animations**: Framer Motion
- **State Management**: React Context API
- **Build Tool**: Vite

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/arsanpathak/portfolio.git
```

2. Navigate to the project directory:
```bash
cd portfolio
```

3. Install dependencies:
```bash
npm install
```

4. Start the development server:
```bash
npm run dev
```

## 🏗️ Project Structure

```
src/
├── components/
│   ├── 3d/           # Three.js components
│   ├── common/       # Reusable UI components
│   ├── layout/       # Layout components
│   ├── projects/     # Project components
│   └── sections/     # Page sections
├── context/          # React Context providers
├── hooks/            # Custom React hooks
├── assets/           # Static assets
├── styles/           # Global styles
└── constants/        # Constants
```

## 🎨 Customization

### Theme Configuration
Update colors in `tailwind.config.js`:
```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#your-primary-color',
        secondary: '#your-secondary-color',
        tertiary: '#your-tertiary-color',
      },
    },
  },
}
```

### Project Data
Update projects in `Projects.jsx`:
```javascript
const projects = [
  {
    title: "Your Project",
    description: "Description",
    tech: ["React", "Three.js"],
    image: "/project.jpg"
  }
]
```

## 📱 Responsive Design

Breakpoints:
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

## 🔧 Development

### Scripts
- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run preview`: Preview production build
- `npm run lint`: Run ESLint
- `npm run format`: Format code with Prettier

## 👤 Author

Arsan Pathak
- GitHub: [arsanpathak](https://github.com/arsanpathak)
- LinkedIn: [arsanpathak](https://linkedin.com/in/arsanpathak)
- Twitter: [arsanpathak](https://twitter.com/arsanpathak)

## 📄 License

This project is licensed under the MIT License. 