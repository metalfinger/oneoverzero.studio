# Social Media Content Hub - Documentation

## Project Overview
Created a dedicated social media content hub with customizable animation templates for the oneoverzero studio website. This allows the social media team to create branded content without technical knowledge.

## Directory Structure
```
/social/
├── index.html                    # Main hub page
├── README.md                     # Documentation for social team
├── video_exports/               # Animation templates
│   ├── hero_export.html         # Hero background particle animation
│   ├── button_export.html       # Animated button gradient
│   ├── philosophy_export.html   # Philosophy section fragment shader
│   ├── floating_dots_export.html # Original floating dots animation
│   ├── floating_dots_editor.html # Customizable floating dots editor
│   ├── glitch_editor.html       # Customizable glitch text animation
│   ├── glitch_text_export.html  # Redirect to glitch_editor.html
│   ├── hero_export.js           # Hero background JavaScript
│   ├── philosophy_export.js     # Philosophy shader JavaScript
│   └── start_server.bat         # Local server script (deprecated)
```

## Key Features Implemented

### 1. Main Navigation Integration
- Added "Social" link to main website navigation (`/index.html`)
- Links to `/social/` hub page
- Maintains consistent branding

### 2. Social Media Hub (`/social/index.html`)
- Central navigation point for all social content
- Card-based interface with clear descriptions
- Links to all animation templates
- Responsive design for all devices

### 3. Animation Templates

#### A. Hero Background (`hero_export.html`)
- Particle flow-field animation from hero section
- Full window responsive sizing
- Continuous looping animation

#### B. Button Gradient (`button_export.html`)
- Animated gradient background from buttons
- Smooth linear animation
- Full window responsive sizing

#### C. Philosophy Shader (`philosophy_export.html`)
- WebGL fragment shader from philosophy section
- Interactive noise effects
- Full window responsive sizing

#### D. Floating Dots (`floating_dots_export.html`)
- Original floating dots animation from WHO section
- 12 dots with staggered animations
- Fixed parameters matching website

#### E. Glitch Text (`glitch_editor.html`)
- Interactive glitch text animation
- Customizable text content
- Full page reset on preview

### 4. Customizable Editors

#### Floating Dots Editor (`floating_dots_editor.html`)
**Customizable Parameter:**
- Number of dots (1-200)

**Features:**
- Live preview as slider moves
- "Hide Editor & Record" button removes editor for full-screen recording
- "Reset to 12 Dots" button
- Random dot positioning on each update
- Staggered animation delays
- Preserved original visual styling

#### Glitch Text Editor (`glitch_editor.html`)
**Customizable Features:**
- Text content editing
- Preview with full page reset
- Back to hub navigation

**Features:**
- Text area for custom content
- "Preview Animation" triggers glitch effect with custom text
- Full background reset (particles, WebGL effects)
- Editor panel hides during preview
- "Reset Text" button

### Technical Implementation Details

### URL Structure
- Main Hub: `https://oneoverzero.studio/social/`
- Hero Background: `https://oneoverzero.studio/social/video_exports/hero_export.html`
- Button Gradient: `https://oneoverzero.studio/social/video_exports/button_export.html`
- Philosophy Shader: `https://oneoverzero.studio/social/video_exports/philosophy_export.html`
- Floating Dots: `https://oneoverzero.studio/social/video_exports/floating_dots_export.html`
- Floating Dots Editor: `https://oneoverzero.studio/social/video_exports/floating_dots_editor.html`
- Glitch Text Editor: `https://oneoverzero.studio/social/video_exports/glitch_editor.html`

### Consistent Branding
- All pages use the same favicon (`/assets/logo.svg`)
- Unified meta tags and descriptions
- Consistent color scheme and typography
- Shared header with navigation back to social hub

### SEO & Accessibility
- Created `sitemap.xml` with all new URLs
- Added sitemap reference to main website
- Created `robots.txt` for search engine indexing
- Proper meta tags and descriptions

## For Social Media Team

### Using the Floating Dots Editor:
1. Navigate to `/social/video_exports/floating_dots_editor.html`
2. Adjust the "Number of Dots" slider (1-200)
3. See live updates as you move the slider
4. Click "Hide Editor & Record" when ready
5. Screen record the full-screen animation
6. Refresh page to make changes

### Using the Glitch Text Editor:
1. Navigate to `/social/video_exports/glitch_editor.html`
2. Type custom text in the editor panel
3. Click "Preview Animation"
4. Editor disappears, full animation plays with custom text
5. Screen record the animation
6. Use "Back to Hub" to create more content

## File Modifications Made

### Updated Files:
- `/index.html` - Added Social navigation link
- `/sitemap.xml` - Added new URLs
- `/robots.txt` - Created for SEO
- `/social/index.html` - Created main hub
- `/social/README.md` - Created documentation
- `/social/video_exports/floating_dots_editor.html` - Created customizable editor
- `/social/video_exports/glitch_editor.html` - Enhanced glitch editor
- `/social/video_exports/glitch_text_export.html` - Redirect file

## Best Practices for Future Development

1. **Maintain Consistency**: Keep all editors with similar UI/UX patterns
2. **Performance**: Optimize for higher dot counts and complex animations
3. **Responsive Design**: Ensure all templates work at any resolution
4. **Documentation**: Keep README files updated with new features
5. **SEO**: Update sitemap.xml when adding new pages
6. **User Experience**: Provide clear labels and instructions

## Next Session Starting Points

### Potential Enhancements:
1. Add more customizable parameters to existing editors
2. Create editors for other website animations
3. Add export/download functionality for created animations
4. Implement preset templates for common social media use cases
5. Add recording tips/guidelines for social media team

### Maintenance Considerations:
1. Update sitemap when adding new pages
2. Ensure all editors maintain website visual consistency
3. Test performance with maximum parameter values
4. Keep documentation updated with new features