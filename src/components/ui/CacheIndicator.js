import React, { useState, useEffect } from 'react';
import { Database, Trash2 } from 'lucide-react';
import { getCacheStats, clearCache } from '../../services/movieService';

const CacheIndicator = () => {
  const [stats, setStats] = useState({ size: 0, entries: [] });
  const [showDetails, setShowDetails] = useState(false);

  const updateStats = () => {
    setStats(getCacheStats());
  };

  useEffect(() => {
    updateStats();
    const interval = setInterval(updateStats, 5000); // Update every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const handleClearCache = () => {
    clearCache();
    updateStats();
  };

  if (stats.size === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="flex items-center gap-2 px-4 py-2 w-full hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <Database className="w-4 h-4 text-green-500" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {stats.size} cached {stats.size === 1 ? 'item' : 'items'}
          </span>
        </button>

        {showDetails && (
          <div className="border-t border-gray-200 dark:border-gray-700 p-3 max-h-64 overflow-y-auto">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
                Cache Entries
              </h3>
              <button
                onClick={handleClearCache}
                className="flex items-center gap-1 px-2 py-1 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
              >
                <Trash2 className="w-3 h-3" />
                Clear
              </button>
            </div>
            <div className="space-y-1">
              {stats.entries.map((entry, index) => (
                <div
                  key={index}
                  className="text-xs text-gray-600 dark:text-gray-400 truncate bg-gray-50 dark:bg-gray-700/50 px-2 py-1 rounded"
                  title={entry}
                >
                  {entry}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CacheIndicator;
