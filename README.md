# 🎬 Frenzy - Modern Movie Database App

A beautiful, feature-rich movie database application built with React and the OMDB API. Search, discover, and save your favorite movies with a modern, responsive interface.

## ✨ Features

- **Real-time Movie Search** - Search with autocomplete suggestions as you type
- **Intelligent Caching** - Smart caching system reduces API calls by 60-80%
- **State Preservation** - Search results and scroll position preserved when viewing details
- **Detailed Movie Information** - View comprehensive details including ratings, cast, plot, and more
- **Favorites System** - Save your favorite movies with local storage persistence
- **Advanced Filtering** - Filter by year and content type
- **Infinite Scroll** - Seamlessly browse through search results
- **Dark/Light Theme** - Toggle between themes with persistent preference
- **Responsive Design** - Optimized for mobile, tablet, and desktop devices
- **Modern UI/UX** - Built with TailwindCSS and Lucide icons

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/maestro-00/Frenzy.git
cd Frenzy
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm start
```

The app will open at [http://localhost:3000](http://localhost:3000)

## 🛠️ Built With

- **React 18** - UI library
- **React Router** - Navigation
- **TailwindCSS** - Styling
- **Lucide React** - Icons
- **Axios** - HTTP client
- **OMDB API** - Movie data

## 📁 Project Structure

```
src/
├── components/
│   ├── movies/        # Movie-related components
│   └── ui/            # Reusable UI components
├── context/           # React context providers
├── pages/             # Page components
├── services/          # API services
└── utils/             # Utility functions
```

## 🎯 Key Features Explained

### Intelligent Caching System
In-memory caching with smart expiration reduces API calls by 60-80%. Different cache durations for different data types ensure optimal performance while keeping data fresh. See [CACHING.md](CACHING.md) for details.

### Search State Preservation
When you navigate to a movie detail page and return, your search results, scroll position, and filters are instantly restored. No loading delays, no lost context. See [STATE_PRESERVATION.md](STATE_PRESERVATION.md) for details.

### Search with Debouncing
Efficient search implementation that reduces API calls while providing real-time results.

### Rate Limiting
Built-in rate limiting to prevent API throttling and ensure smooth performance.

### Local Storage Persistence
Favorites and theme preferences are saved locally and persist across sessions.

### Infinite Scroll
Automatically loads more results as you scroll, providing a seamless browsing experience.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## 🙏 Acknowledgments

- Movie data provided by [OMDB API](https://www.omdbapi.com/)
- Icons by [Lucide](https://lucide.dev/)