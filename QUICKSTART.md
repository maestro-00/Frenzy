# 🚀 Quick Start Guide

## Installation & Setup

### 1. Install Dependencies
```bash
npm install
```

This will install:
- React 18.3.1
- TailwindCSS 3.3.2
- Lucide React 0.263.1
- React Router DOM 6.24.1
- Axios 1.7.2

### 2. Start Development Server
```bash
npm start
```

The app will open at `http://localhost:3000`

### 3. Build for Production
```bash
npm run build
```

Creates an optimized production build in the `build/` folder.

## 🎯 Key Features to Try

### Search
1. Type in the search bar - autocomplete suggestions appear
2. Click a suggestion to view movie details
3. Or press Enter to see full search results

### Filters
1. Use the filter panel to narrow results by:
   - Type (Movie, Series, Episode)
   - Year (last 50 years)
   - Genre (client-side filtering)

### Favorites
1. Click the heart icon on any movie card
2. Navigate to "Favorites" in the header
3. View all your saved movies
4. Favorites persist across sessions

### Theme Toggle
1. Click the sun/moon icon in the header
2. Switch between light and dark themes
3. Preference is saved automatically

### Infinite Scroll
1. Scroll down on search results
2. More movies load automatically
3. Continue until all results are shown

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ErrorBoundary.js
│   ├── movies/
│   │   └── MovieCard.js
│   └── ui/
│       ├── FilterPanel.js
│       ├── LoadingSpinner.js
│       ├── ModernHeader.js
│       ├── SearchBar.js
│       └── ThemeToggle.js
├── context/            # React Context providers
│   ├── FavoritesContext.js
│   └── ThemeContext.js
├── pages/              # Page components
│   ├── Favorites.js
│   ├── Home.js
│   └── MovieDetailPage.js
├── services/           # API services
│   └── movieService.js
├── utils/              # Utility functions
│   ├── debounce.js
│   └── localStorage.js
├── constants/          # App constants
│   └── index.js
├── App.js             # Main app component
├── index.js           # Entry point
└── index.css          # Global styles + Tailwind
```

## 🛠️ Development Tips

### Adding New Features
1. Create components in appropriate folders
2. Use existing context for global state
3. Follow the established naming conventions
4. Keep components small and focused

### Styling
- Use TailwindCSS utility classes
- Dark mode: prefix with `dark:`
- Responsive: use `sm:`, `md:`, `lg:`, `xl:` prefixes
- Custom animations in `index.css`

### API Calls
- Use `movieService.js` for all API interactions
- Rate limiting is built-in (200ms between calls)
- Error handling is automatic

### State Management
- **Theme**: Use `useTheme()` hook
- **Favorites**: Use `useFavorites()` hook
- **Local state**: Use `useState()` for component-specific state

## 🎨 Customization

### Colors
Edit `tailwind.config.js` to change the primary color scheme:
```javascript
colors: {
  primary: {
    500: '#0ea5e9', // Change this
    600: '#0284c7', // And this
  }
}
```

### API Key
The OMDB API key is in `src/services/movieService.js`. For production, move it to environment variables.

### Default Search
Change the default search term in `src/pages/Home.js`:
```javascript
const [query, setQuery] = useState('Batman'); // Change 'Batman'
```

## 🐛 Troubleshooting

### Dependencies not installing
```bash
rm -rf node_modules package-lock.json
npm install
```

### Styles not applying
Make sure TailwindCSS is properly configured:
1. Check `tailwind.config.js` exists
2. Check `postcss.config.js` exists
3. Verify `index.css` has Tailwind directives

### API not working
- Check your internet connection
- Verify OMDB API is accessible
- Check browser console for errors

## 📚 Learn More

- [React Documentation](https://react.dev)
- [TailwindCSS Documentation](https://tailwindcss.com)
- [React Router Documentation](https://reactrouter.com)
- [OMDB API Documentation](https://www.omdbapi.com)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - see LICENSE.md for details
