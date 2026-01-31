# Little Angel Choir App

Application for the Little Angel Choir - Naghamat Ajyal Concert.

## Updates

### Version 1.0.38
- **Photo Gallery Navigation**: 
    - Closing an enlarged photo (via button or browser back) now reliably returns to the gallery grid without exiting the gallery section.
    - Swiping between photos now replaces history state instead of pushing, keeping history clean.
- **Hymn List Highlight**: 
    - Returning to the hymn list from a hymn detail page now highlights the last viewed hymn.
    - The highlighted hymn is automatically scrolled into view.
    - The highlight is reset when navigating back to the main menu.

### Version 1.0.37
- **Hymn Details UI**: 
    - Implemented dynamic header title: The main header now displays the current hymn's title when the hymn controls are hidden during scroll, effectively maximizing screen real estate while keeping context.
- **Photo Gallery UX**: 
    - Redesigned photo viewing experience. Instead of a popup modal, the gallery now transitions to a dedicated "Detail View" page.
    - Detail View features a large, fit-to-screen main image area and a scrollable timeline strip of thumbnails at the bottom for easy navigation.
    - Fixed scrolling issues ensuring the image is always fully visible.

### Version 1.0.36
- **Photo Gallery**: 
    - Added swipe gesture support (Right-to-Left for Next, consistent with Arabic flow).
    - Added navigation arrows for desktop/helper.
    - Added photo index counter.
- **Hymn Details**:
    - Added Hymn Number badge to the sticky header.
    - Reversed swipe logic: Swipe Right to go Next, Swipe Left to go Previous (Arabic Book style).
- **Video Player**: 
    - Optimized resolution preference to 480p to save data.

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
