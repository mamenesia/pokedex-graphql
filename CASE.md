# NextJS Pokedex Case Study - Frontend Developer Assessment

## Project Overview
Create a comprehensive Pokedex web application using NextJS that showcases your frontend development skills, GraphQL integration, and modern React patterns.

## Reference Implementation
- *Inspiration*: [Pokedex React Native App](https://jordanwhunter.github.io/pokedex/#/)
- *API*: [Pokemon GraphQL API](https://beta.pokeapi.co/graphql/console/)

## Technical Requirements

### Core Technologies
- *Framework*: NextJS 14+ (App Router)
- *Styling*: Tailwind CSS
- *Data Fetching*: GraphQL with Apollo Client or similar
- *TypeScript*: Strongly recommended
- *State Management*: Zustand

### Must-Have Features

#### 1. Pokemon Listing & Display
- Grid/list view of Pokemon with pagination or infinite scroll
- Display Pokemon image, name, type(s), and basic stats
- Responsive design that works on desktop, tablet, and mobile
- Lazy loading for images and data

#### 2. Search Functionality
- Real-time search by Pokemon name
- Search results should update as user types
- Clear search functionality
- Handle empty states and loading states

#### 3. Filtering System
- Filter by Pokemon type (Fire, Water, Grass, etc.)
- Filter by generation
- Multiple filter selection capability
- Clear all filters option

#### 4. Sorting Options
- Sort by name (A-Z, Z-A)
- Sort by Pokedex number
- Sort by stats (HP, Attack, Defense, etc.)
- Maintain sort preference during navigation

#### 5. Pokemon Comparison
- Select multiple Pokemon (2-4) for comparison
- Side-by-side comparison view
- Compare stats, types, abilities, and basic info
- Visual representation of stat differences

#### 6. Pokemon Detail Page
- Individual Pokemon detail page with comprehensive information
- Stats visualization (charts/progress bars)
- Evolution chain display
- Moves and abilities
- Type effectiveness chart

### Technical Implementation Requirements

#### 1. NextJS Specific Features
- Use App Router (not Pages Router)
- Implement proper SEO with metadata
- Server-side rendering for Pokemon detail pages
- Client-side navigation between routes
- Dynamic routing for individual Pokemon

#### 2. GraphQL Integration
- Use Apollo Client or similar GraphQL client
- Implement proper error handling
- Use GraphQL fragments for reusable queries
- Implement query optimization (avoid overfetching)
- Cache management for better performance

#### 3. Performance Optimization
- Implement lazy loading for images
- Use NextJS Image component for optimization
- Implement virtual scrolling or pagination for large lists
- Code splitting for better bundle size
- Loading states and skeleton screens

#### 4. Component Architecture
- Create reusable components (Pokemon Card, Filter Component, etc.)
- Implement proper component composition
- Use custom hooks for business logic
- Props typing (if using TypeScript)
- Component testing (optional but preferred)

#### 5. State Management
- Use Zustand for global state management
- Store filters, search, and comparison state
- Persistent state for comparison selections and user preferences
- Loading and error states

## Bonus Features (Optional)
- Dark/Light theme toggle
- Favorite Pokemon functionality 
- Advanced search with multiple criteria
- Responsive animations and transitions
