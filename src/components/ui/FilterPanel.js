import React from 'react';
import { Filter } from 'lucide-react';
import SearchableSelect from './SearchableSelect';

const FilterPanel = ({ filters, onFilterChange }) => {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) => ({
    value: String(currentYear - i),
    label: String(currentYear - i)
  }));

  const types = [
    { value: '', label: 'All Types' },
    { value: 'movie', label: 'Movies' },
    { value: 'series', label: 'TV Series' },
    { value: 'episode', label: 'Episodes' }
  ];

  // Add "All Years" option at the beginning
  const yearOptions = [{ value: '', label: 'All Years' }, ...years];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-5 h-5 text-primary-500" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Filters</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Type Filter */}
        <SearchableSelect
          label="Type"
          value={filters.type}
          onChange={(value) => onFilterChange({ ...filters, type: value })}
          options={types}
          placeholder="All Types"
        />

        {/* Year Filter */}
        <SearchableSelect
          label="Year"
          value={filters.year}
          onChange={(value) => onFilterChange({ ...filters, year: value })}
          options={yearOptions}
          placeholder="All Years"
        />
      </div>
    </div>
  );
};

export default FilterPanel;
