# Cache Flow Diagram

## How Caching Works in Frenzy

### Request Flow with Caching

```
┌─────────────────────────────────────────────────────────────────┐
│                         User Action                              │
│              (Search, View Details, Autocomplete)                │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    API Service Function                          │
│           (searchMovies, getMovieDetails, etc.)                  │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
                    ┌────────────────┐
                    │ Generate Cache │
                    │      Key       │
                    └────────┬───────┘
                             │
                             ▼
                    ┌────────────────┐
                    │  Check Cache   │
                    └────────┬───────┘
                             │
                ┌────────────┴────────────┐
                │                         │
                ▼                         ▼
        ┌──────────────┐         ┌──────────────┐
        │  Cache Hit?  │         │  Cache Miss  │
        │     YES      │         │      NO      │
        └──────┬───────┘         └──────┬───────┘
               │                        │
               │                        ▼
               │               ┌────────────────┐
               │               │  Rate Limiter  │
               │               └────────┬───────┘
               │                        │
               │                        ▼
               │               ┌────────────────┐
               │               │   Make API     │
               │               │     Call       │
               │               └────────┬───────┘
               │                        │
               │                        ▼
               │               ┌────────────────┐
               │               │   Response     │
               │               │   Received     │
               │               └────────┬───────┘
               │                        │
               │                        ▼
               │               ┌────────────────┐
               │               │   Success?     │
               │               └────────┬───────┘
               │                        │
               │                        ▼
               │               ┌────────────────┐
               │               │  Store in      │
               │               │    Cache       │
               │               └────────┬───────┘
               │                        │
               └────────────────────────┘
                             │
                             ▼
                    ┌────────────────┐
                    │ Return Data to │
                    │   Component    │
                    └────────┬───────┘
                             │
                             ▼
                    ┌────────────────┐
                    │  Render UI     │
                    └────────────────┘
```

## Cache Storage Structure

```
Cache Map
├── "search?page=1&s=batman"
│   ├── data: { Response: "True", Search: [...], totalResults: "537" }
│   ├── timestamp: 1696950000000
│   └── duration: 300000 (5 minutes)
│
├── "details?i=tt0372784"
│   ├── data: { Title: "Batman Begins", Year: "2005", ... }
│   ├── timestamp: 1696950100000
│   └── duration: 1800000 (30 minutes)
│
└── "autocomplete?s=bat"
    ├── data: { Response: "True", Search: [...] }
    ├── timestamp: 1696950200000
    └── duration: 120000 (2 minutes)
```

## Cache Lifecycle

```
┌─────────────────────────────────────────────────────────────────┐
│                        Cache Entry                               │
└─────────────────────────────────────────────────────────────────┘
                             │
                             ▼
                    ┌────────────────┐
                    │    Created     │
                    │  (timestamp)   │
                    └────────┬───────┘
                             │
                             ▼
                    ┌────────────────┐
                    │     Active     │
                    │  (being used)  │
                    └────────┬───────┘
                             │
                ┌────────────┴────────────┐
                │                         │
                ▼                         ▼
        ┌──────────────┐         ┌──────────────┐
        │   Expired    │         │   Manually   │
        │  (timeout)   │         │   Cleared    │
        └──────┬───────┘         └──────┬───────┘
               │                        │
               └────────────┬───────────┘
                            │
                            ▼
                   ┌────────────────┐
                   │    Removed     │
                   │  from Cache    │
                   └────────────────┘
```

## Example: User Journey with Caching

### Scenario: User searches for "Batman" twice

```
Time: 0:00
┌─────────────────────────────────────────────────────────────────┐
│ User searches "Batman"                                           │
└─────────────────────────────────────────────────────────────────┘
                             │
                             ▼
                    Cache: Empty
                             │
                             ▼
                    API Call Made (200ms)
                             │
                             ▼
                    Results Cached
                             │
                             ▼
                    Display Results
                    
Total Time: ~200ms

─────────────────────────────────────────────────────────────────

Time: 0:30 (30 seconds later)
┌─────────────────────────────────────────────────────────────────┐
│ User searches "Batman" again                                     │
└─────────────────────────────────────────────────────────────────┘
                             │
                             ▼
                    Cache: HIT! ✓
                             │
                             ▼
                    Return Cached Data (instant)
                             │
                             ▼
                    Display Results
                    
Total Time: ~5ms (40x faster!)

─────────────────────────────────────────────────────────────────

Time: 6:00 (6 minutes later)
┌─────────────────────────────────────────────────────────────────┐
│ User searches "Batman" again                                     │
└─────────────────────────────────────────────────────────────────┘
                             │
                             ▼
                    Cache: EXPIRED (>5 min)
                             │
                             ▼
                    API Call Made (200ms)
                             │
                             ▼
                    Results Cached Again
                             │
                             ▼
                    Display Results
                    
Total Time: ~200ms
```

## Cache Cleanup Process

```
Every 60 seconds:

┌─────────────────────────────────────────────────────────────────┐
│                    Cleanup Interval                              │
└─────────────────────────────────────────────────────────────────┘
                             │
                             ▼
                    ┌────────────────┐
                    │ Iterate Cache  │
                    │    Entries     │
                    └────────┬───────┘
                             │
                             ▼
                    ┌────────────────┐
                    │ Check Each     │
                    │   Timestamp    │
                    └────────┬───────┘
                             │
                ┌────────────┴────────────┐
                │                         │
                ▼                         ▼
        ┌──────────────┐         ┌──────────────┐
        │   Expired?   │         │  Still Valid │
        │     YES      │         │      NO      │
        └──────┬───────┘         └──────┬───────┘
               │                        │
               ▼                        ▼
        ┌──────────────┐         ┌──────────────┐
        │    Delete    │         │     Keep     │
        │    Entry     │         │    Entry     │
        └──────────────┘         └──────────────┘
```

## Performance Comparison

### Without Caching
```
Search "Batman" → API Call (200ms) → Display
Search "Batman" → API Call (200ms) → Display
Search "Batman" → API Call (200ms) → Display

Total: 600ms + 3 API calls
```

### With Caching
```
Search "Batman" → API Call (200ms) → Cache → Display
Search "Batman" → Cache Hit (5ms) → Display
Search "Batman" → Cache Hit (5ms) → Display

Total: 210ms + 1 API call
Savings: 65% time, 66% API calls
```

## Cache Indicator UI

```
┌─────────────────────────────────────────────────────────────────┐
│                    Bottom Right Corner                           │
└─────────────────────────────────────────────────────────────────┘
                             │
                             ▼
                    ┌────────────────┐
                    │   🗄️ 5 cached  │  ← Collapsed View
                    │      items     │
                    └────────┬───────┘
                             │
                             ▼ (Click to expand)
                    ┌────────────────┐
                    │ Cache Entries  │
                    │ ─────────────  │
                    │ search?s=bat.. │
                    │ details?i=tt.. │
                    │ autocomplete.. │
                    │                │
                    │   [🗑️ Clear]   │  ← Clear button
                    └────────────────┘
```

---

This visual guide helps understand how caching improves the Frenzy app's performance!
