# OneOverZero Studio Website

An experimental studio crafting humane, immersive stories with AI, generative art, and interactive technology.

## Project Structure

```
oneoverzero.studio/
├── index.html                  # Main HTML file
├── style.css                   # Main stylesheet
├── helper.txt                  # Brand information and creative guidelines
├── README.md                   # This file
├── assets/                     # Static assets
│   ├── logo.svg               # Main logo in SVG format
│   ├── logo_text.svg          # Text version of logo
│   ├── logo.jpg               # Logo in JPG format
│   ├── services/              # Service icons (PNG and WebP)
│   │   ├── immersive-environments.png/webp
│   │   ├── web.png/webp
│   │   ├── generative.png/webp
│   │   ├── experimental.png/webp
│   │   ├── hybrid-system.png/webp
│   │   └── voice.png/webp
│   └── industry/              # Industry icons (PNG and WebP)
│       ├── music.png/webp
│       ├── film-screens.png/webp
│       ├── brand-marketing.png/webp
│       ├── culture-festivals.png/webp
│       ├── tech-expo.png/webp
│       └── luxuty-retail.png/webp
├── js/                         # JavaScript modules
│   ├── main.js                # Main entry point
│   ├── animations.js          # Reveal animations and glitch effects
│   ├── interactions.js        # Card tilt effects and user interactions
│   └── webgl.js               # WebGL canvas effects and shaders
└── Nohemi-Font/               # Custom font files
    ├── Nohemi-Black-BF6438cc565e67b.woff
    ├── Nohemi-Black-BF6438cc58744d4.ttf
    └── ...                    # Other Nohemi font variations
```

## File Descriptions

### Root Files

**`index.html`** - The main HTML file containing all the website content:
- Navigation bar with logo and menu items
- Hero section with animated canvas background
- "Who/Myth" section explaining the studio
- "Practice" section showcasing core capabilities
- "Philosophy" section with interactive WebGL panel
- "Industry" section showing target markets
- Contact/footer section with email and WhatsApp links

**`style.css`** - The main stylesheet containing all CSS:
- CSS variables for consistent theming
- Responsive design with mobile-first approach
- Animations and keyframes for interactive elements
- Component styling for cards, buttons, and navigation
- Accessibility improvements and focus states

**`helper.txt`** - Brand information and creative guidelines:
- Studio name explanation and meaning
- Brand story and visual language
- Color palette and typography guidelines
- Tagline options and brand comparisons

### Assets Directory

**`assets/logo.*`** - Various logo formats:
- `logo.svg` - Primary vector logo
- `logo_text.svg` - Text version of the logo
- `logo.jpg` - Raster version of the logo

**`assets/services/`** - Icons for service offerings:
- Immersive Environments
- Interactive Web Worlds
- Generative Art & Design
- Experiential Design
- Hybrid Systems
- AI & Voice Synthesis

**`assets/industry/`** - Icons for target industries:
- Music & Stages
- Film & Screens
- Brands & Marketing
- Culture & Festivals
- Tech & Expos
- Luxury & Retail

### JavaScript Modules

**`js/main.js`** - Main entry point:
- Imports all other JavaScript modules
- Uses ES6 module system for clean code organization

**`js/animations.js`** - Animation system:
- Reveal animations for content as it enters viewport
- Staggered animations for card grids
- Glitch text effects for the hero section
- Floating element animations in the "who" section

**`js/interactions.js`** - Interactive elements:
- 3D card tilt effects on hover
- Canvas cleanup for CTA elements
- Mouse tracking for interactive effects

**`js/webgl.js`** - WebGL canvas effects:
- Hero section particle animation ("aether" canvas)
- Philosophy section noise shader
- Glitch background effects for hero text
- Performance-optimized WebGL rendering

### Nohemi-Font Directory

Contains custom Nohemi font files in various weights and formats:
- Thin, ExtraLight, Light, Regular, Medium, SemiBold, Bold, ExtraBold, Black
- Both WOFF and TTF formats for cross-browser compatibility

## Technical Features

### Performance Optimizations
- **Image Optimization**: All images provided in both PNG and WebP formats with `<picture>` element fallbacks
- **Lazy Loading**: Images below the fold use `loading="lazy"` attribute
- **Resource Preloading**: Critical fonts and images preloaded in `<head>`
- **Code Splitting**: JavaScript modularized into separate files for better caching

### Accessibility
- **Skip Navigation**: "Skip to main content" link for keyboard users
- **ARIA Labels**: Proper labeling for screen readers
- **Semantic HTML**: Correct use of headings, sections, and roles
- **Focus Management**: Clear focus indicators and keyboard navigation

### Responsive Design
- **Mobile-First**: Base styles for mobile, enhanced for larger screens
- **Flexible Grids**: CSS Grid and Flexbox for adaptive layouts
- **Touch Optimization**: `touch-action` properties for better mobile experience

### Visual Effects
- **WebGL Shaders**: Custom shaders for unique visual experiences
- **Canvas Animations**: Particle systems and interactive backgrounds
- **CSS Animations**: Smooth transitions and micro-interactions
- **3D Effects**: Card tilt and perspective transforms

## Development Guidelines

### Adding New Content
1. Place new images in the appropriate subdirectory under `assets/`
2. Convert images to WebP format and provide PNG fallbacks
3. Use `<picture>` elements with proper `srcset` attributes
4. Add `loading="lazy"` for non-critical images

### JavaScript Development
1. Create new modules in the `js/` directory for specific functionality
2. Import modules in `main.js` using ES6 import syntax
3. Follow the existing pattern for Intersection Observer animations
4. Keep WebGL code in `webgl.js` for performance optimization

### CSS Development
1. Use CSS variables for consistent theming
2. Follow the existing naming conventions
3. Add responsive styles using media queries
4. Maintain accessibility with proper focus states

## Deployment
The website is a static site that can be deployed to any web server or CDN. No build process is required - simply upload all files to your web host.

## Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- WebGL support required for advanced visual effects
- Graceful degradation for browsers without WebGL support