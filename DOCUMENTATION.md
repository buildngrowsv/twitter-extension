# Twitter Extension Component Documentation

## Core Components Overview

### MainScreen.tsx
**Simple Explanation:**
The main dashboard of the extension where users can view and manage their tweet ideas, toggle website monitoring, and generate new ideas.

**Technical Details:**
- **State Management:**
  - Manages tweet ideas, monitoring status, and selection states
  - Uses Chrome storage for persistence
  - Handles bulk operations with keyboard shortcuts
- **Key Features:**
  - Website monitoring toggle
  - Tweet idea generation
  - Starred items filtering
  - Bulk selection/deletion
  - Real-time storage synchronization

### KnowledgeBase.tsx
**Simple Explanation:**
A searchable database where users can store and organize different types of content (websites, files, notes) for future tweet generation.

**Technical Details:**
- **Entry Types:**
  - Website references
  - File uploads (.txt, .md)
  - Manual notes
- **Key Features:**
  - Type-based filtering
  - File upload handling
  - Persistent storage
  - Entry categorization
  - Real-time updates

### SettingsScreen.tsx
**Simple Explanation:**
Configuration center for the extension where users can customize prompt templates, data retention, and snippet type descriptions.

**Technical Details:**
- **Configuration Areas:**
  - Data retention period
  - Prompt version management
  - Snippet type descriptions
  - Storage management
- **Key Features:**
  - Multiple prompt version support
  - Template customization
  - Storage clearing
  - Snippet type configuration

### TweetIdea.tsx
**Simple Explanation:**
Individual tweet card component that displays and manages a single tweet idea or thread.

**Technical Details:**
- **Interaction Modes:**
  - View mode
  - Edit mode
  - Thread view
- **Key Features:**
  - One-click copy
  - In-place editing
  - Star/favorite
  - Thread expansion
  - Bulk selection support

## Component Relationships
- MainScreen uses TweetIdea for rendering individual tweets
- All components integrate with Chrome storage
- Components share common UI elements from shadcn
- All components use the toast hook for notifications

## Common Dependencies
- @/components/ui/* (shadcn components)
- Chrome Storage API
- useToast hook
- generate-service for API interactions 

## Services

### generate-service.ts
**Simple Explanation:**
Handles the generation of tweet ideas by processing recent web pages and knowledge base entries using OpenAI's API.

**Technical Details:**
- **Core Functionality:**
  - Processes recent pages and knowledge base entries
  - Manages prompt templates and snippet types
  - Converts API responses into tweet/thread format
- **Key Features:**
  - Template-based generation
  - Thread detection and formatting
  - Dynamic snippet type handling
  - Error handling and logging

### openai-service.ts
**Simple Explanation:**
Manages all interactions with OpenAI's API, specifically handling the assistant-based generation of tweets.

**Technical Details:**
- **API Integration:**
  - Uses OpenAI's Assistant API
  - Manages thread creation and monitoring
  - Handles asynchronous response processing
- **Key Features:**
  - Thread-based conversation management
  - Status polling and completion checking
  - Comprehensive error logging
  - Response formatting

### utils.ts
**Simple Explanation:**
Utility functions for handling CSS class names and styling throughout the application.

**Technical Details:**
- Combines Tailwind classes efficiently
- Merges class names using clsx and tailwind-merge
- Provides type-safe class name concatenation

## Hooks

### use-toast.ts
**Simple Explanation:**
Custom hook for managing toast notifications throughout the application.

**Technical Details:**
- **State Management:**
  - Manages toast queue
  - Handles toast lifecycle
  - Controls toast limits
- **Key Features:**
  - Toast creation and updates
  - Automatic dismissal
  - Queue management
  - Custom styling support

## Background Services

### background.js
**Simple Explanation:**
Chrome extension background script that monitors tab activity and manages data collection.

**Technical Details:**
- **Core Functions:**
  - Tab monitoring
  - Content capture
  - Data retention management
- **Key Features:**
  - Automatic page content capture
  - Storage cleanup
  - Retention period management
  - Error handling

### content.js
**Simple Explanation:**
Content script that runs in web pages to capture content when requested.

**Technical Details:**
- **Functionality:**
  - Page content extraction
  - Message handling
  - Response formatting
- **Integration:**
  - Communicates with background script
  - Handles content capture requests
  - Provides page text content

## Data Flow
1. background.js monitors tabs and triggers content capture
2. content.js extracts page content when requested
3. generate-service.ts processes captured content
4. openai-service.ts generates tweet ideas
5. Components display and manage the generated content

## Storage Structure
- knowledgeBaseEntries: Array of captured content
- visitedPages: Recent page history
- promptVersions: Custom prompt templates
- snippetTypes: Content type definitions

## Application Core

### App.tsx
**Simple Explanation:**
The main application component that provides the tab-based navigation structure for the extension popup.

**Technical Details:**
- **Layout:**
  - Fixed width (600px) popup window
  - Three-tab navigation system
  - Responsive content areas
- **Key Features:**
  - Tab-based navigation
  - State management for active tab
  - Component mounting/unmounting
- **Integrated Components:**
  - MainScreen
  - KnowledgeBase
  - SettingsScreen

### main.tsx
**Simple Explanation:**
The application entry point that initializes React and mounts the main App component.

**Technical Details:**
- Uses React 18 createRoot API
- Implements StrictMode for development
- Handles initial CSS imports

## Build Configuration

### vite.config.ts
**Simple Explanation:**
Vite configuration file that sets up the build process for the Chrome extension.

**Technical Details:**
- **Build Features:**
  - React plugin integration
  - Environment variable handling
  - Path aliases (@/ for src)
  - Custom file copying for extension assets
- **Output Configuration:**
  - Generates extension-compatible bundle
  - Handles manifest and background scripts
  - Manages environment variables

### tsconfig.json
**Simple Explanation:**
TypeScript configuration that sets up the compilation rules and module resolution.

**Technical Details:**
- Split configuration approach
- Path aliases configuration
- Reference-based project structure
- Base URL configuration

### tailwind.config.js
**Simple Explanation:**
Tailwind CSS configuration that defines the design system and theme customization.

**Technical Details:**
- **Theme Configuration:**
  - Custom color system with CSS variables
  - Extended border radius system
  - Custom animation keyframes
  - Chart color definitions
- **Plugin Integration:**
  - tailwindcss-animate for animations
  - Content path configuration
  - Dark mode support

### postcss.config.js
**Simple Explanation:**
PostCSS configuration for processing CSS with Tailwind and autoprefixer.

**Technical Details:**
- Tailwind CSS processing
- Autoprefixer integration
- CSS transformation pipeline

## Extension Configuration

### manifest.json
**Simple Explanation:**
Chrome extension manifest file that defines the extension's permissions and behavior.

**Technical Details:**
- **Permissions:**
  - Storage access
  - Tab management
  - Script injection
  - Alarm system
- **Components:**
  - Background service worker
  - Content scripts
  - Host permissions
  - Action popup
- **Version:** 1.0
- **Manifest Version:** 3

## Styling

### App.css
**Simple Explanation:**
Core application styles that define the root layout and basic styling.

**Technical Details:**
- Root element constraints
- Centered layout
- Padding configuration
- Text alignment defaults