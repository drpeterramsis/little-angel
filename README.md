# Little Angel Choir - كورال الملاك الصغير 🎵

**Little Angel** is a modern, bilingual (Arabic/English) digital songbook application designed for the Little Angel choral group. It provides a seamless reading experience for hymns and spiritual songs, optimized for use during services, practices, and personal devotion.

**الملاك الصغير** هو تطبيق كتاب ترانيم رقمي ثنائي اللغة (عربي/إنجليزي) مصمم لكورال الملاك الصغير. يوفر تجربة قراءة سلسة للترانيم والأغاني الروحية، ومصمم خصيصاً للاستخدام أثناء الخدمات والتدريبات.

---

## ✨ Features | المميزات

### 📖 Reading Experience | تجربة القراءة
-   **Bilingual Support**: Fully optimized for RTL (Arabic) and LTR (English) content.
-   **Focus Mode**: Clean interface with minimized distractions for reading lyrics.
-   **Font Resizing**: Adjustable text size (A+/A-) for better visibility on small screens or for elderly users.
-   **Smart Highlighting**: Search terms are highlighted within the lyrics to find specific verses quickly.

### 🎨 UI/UX | واجهة المستخدم
-   **Dark/Light Mode**: Fully supported themes. "Light Mode" provides a clean paper-like look, while "Dark Mode" saves battery and reduces eye strain in low-light environments.
-   **Responsive Design**: Works perfectly on mobile phones, tablets, and desktops.
-   **Smooth Animations**: Fluid transitions between lists and reading views.

### 🔍 Search & Navigation | البحث والتنقل
-   **Instant Search**: Filter hymns by title or specific lyrics content in real-time.
-   **Categories**: Hymns are tagged by category (e.g., Prayer, Choral, Feasts).
-   **Deep Linking**: (Architecture ready) for sharing specific hymns.

---

## 🛠️ Tech Stack | التقنيات المستخدمة

*   **Framework**: [React 19](https://react.dev/) - The library for web and native user interfaces.
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/) - For rapid, utility-first styling and robust Dark Mode support.
*   **Language**: [TypeScript](https://www.typescriptlang.org/) - For type-safe code and better maintainability.
*   **Icons**: SVG Icons (Heroicons style).
*   **Fonts**: [Tajawal](https://fonts.google.com/specimen/Tajawal) (Google Fonts) for modern Arabic typography.

---

## 🚀 Deployment | النشر

This project is a **Static Web Application** and can be deployed for free on various platforms.

### GitHub Pages
1.  Push the code to a GitHub repository.
2.  Go to **Settings** > **Pages**.
3.  Select the branch (e.g., `main`) and folder (usually `/` or `/dist` depending on build).
4.  Save.

### Cloudflare Pages
1.  Connect your GitHub account to Cloudflare Dashboard.
2.  Select the repository `Little-Angel`.
3.  Cloudflare will detect the framework.
4.  Click **Deploy**.

---

## 📝 Configuration | الإعدادات

### Adding Hymns
Edit the `hymns.json` file in the root directory to add new songs:

```json
{
  "id": "unique-id",
  "title": "Hymn Title",
  "category": "Category Name",
  "lyrics": [
    "Line 1 Arabic",
    "Line 2 English",
    ""
  ]
}
```

---

*Built with ❤️ for the Little Angel Choir.*
