# Little Angel Choir App

Application for the Little Angel Choir - Naghamat Ajyal Concert.

## Updates

### Version 1.0.35
- **Video Player**: Refactored video section to have a separate list view and player view.
    - Browsing back from a video now returns to the list instead of the main menu.
    - Autoplay disabled by default.
- **Photo Gallery**: 
    - Full-screen photo view now fits the image to the screen without scrolling.
    - Browsing back from a photo now returns to the gallery grid.
- **Hymn Details**:
    - Top controls and navigation arrows now auto-hide when scrolling.
    - Clicking the hymn text reveals the controls.

### Version 1.0.34
- **Photo Gallery**: Added a new section "صور الكورال" containing 61 photos of the choir displayed in a grid with full-screen viewing capability.
- **Embedded Video Player**: Updated the Video list to include an embedded YouTube player at the top. Clicking a video in the list now plays it directly in the app.
- **Menu Update**: Added a new button for the photo gallery.

### Version 1.0.33
- **Video Section**: Added a new section "ترانيم الكورال" containing a list of YouTube videos from the choir.
- **UI Update**: Hidden the "Choir Members" button in the main menu for this release.
- **Navigation**: Added routing logic for the video list view.
- **Video Components**: Added `VideoList.tsx` to handle video display with thumbnail fetching and fallback to `logo.webp`.

### Version 1.0.32
- Initial Release features (Hymns, Members, Search).
