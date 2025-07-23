# 🔥 Pokemon GraphQL Pokedex

A modern, comprehensive Pokemon Pokedex web application built with **Next.js 15**, **GraphQL**, **TypeScript**, and **Tailwind CSS**. Features advanced search, filtering, sorting, Pokemon comparison, detailed Pokemon pages, and a beautiful responsive UI.

![Pokemon Pokedex](https://img.shields.io/badge/Pokemon-Pokedex-blue?style=for-the-badge&logo=pokemon)
![Next.js](https://img.shields.io/badge/Next.js-15.4.1-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![GraphQL](https://img.shields.io/badge/GraphQL-16.11-pink?style=for-the-badge&logo=graphql)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)

## ✨ Features

### 🔍 **Search & Discovery**
- **Real-time Search**: Instant Pokemon search by name
- **Advanced Filtering**: Filter by type(s) and generation(s) with multi-select
- **Smart Sorting**: Sort by name, Pokedex number, HP, or Attack stats
- **Pagination**: Navigate through 1000+ Pokemon with responsive pagination
- **Skeleton Loading**: Professional loading states with skeleton placeholders

### 📊 **Pokemon Information**
- **Detailed Pokemon Pages**: Complete Pokemon information with stats, abilities, moves, and evolution chains
- **Pokemon Comparison**: Compare 2-4 Pokemon side-by-side with detailed stats
- **Evolution Chains**: Interactive evolution chain display with requirements
- **Move Lists**: Comprehensive move tables with level requirements and move details
- **Abilities**: Pokemon abilities with detailed effect descriptions
- **High-Quality Images**: Official Pokemon artwork with fallback handling

### 🎨 **User Experience**
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Type-Based Theming**: Dynamic colors based on Pokemon types
- **Modern UI**: Clean, professional interface with smooth animations
- **Error Handling**: Graceful error states and user feedback
- **Performance Optimized**: Server-side rendering, caching, and code splitting

### 🛠 **Technical Features**
- **GraphQL Integration**: Efficient data fetching with Apollo Client
- **State Management**: Zustand for global state with persistence
- **TypeScript**: Full type safety throughout the application
- **Testing**: Comprehensive test suite with Vitest
- **Code Quality**: ESLint, Biome, and automated formatting

## 🚀 Quick Start

### Prerequisites

Make sure you have the following installed:
- **Node.js** 18.0 or higher
- **Bun** (recommended) or npm/yarn/pnpm
- **Git**

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd pokedex-graphql
   ```

2. **Install dependencies**
   ```bash
   # Using Bun (recommended)
   bun install
   
   # Or using npm
   npm install
   
   # Or using yarn
   yarn install
   ```

3. **Start the development server**
   ```bash
   # Using Bun
   bun dev
   
   # Or using npm
   npm run dev
   
   # Or using yarn
   yarn dev
   ```

4. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## 📦 Available Scripts

| Script | Description |
|--------|-------------|
| `bun dev` | Start development server |
| `bun build` | Build for production |
| `bun start` | Start production server |
| `bun lint` | Run ESLint |
| `bun test` | Run tests |
| `bun test:watch` | Run tests in watch mode |
| `bun test:ui` | Run tests with UI |
| `bun test:coverage` | Run tests with coverage |
| `bun format` | Format code |

## 🏗 Project Structure

```
pokedex-graphql/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── page.tsx           # Home page
│   │   ├── compare/           # Pokemon comparison page
│   │   └── pokemon/[id]/      # Dynamic Pokemon detail pages
│   ├── components/            # React components
│   │   ├── pokemon/           # Pokemon-specific components
│   │   ├── search/            # Search and filtering components
│   │   └── ui/                # Reusable UI components
│   ├── lib/
│   │   ├── graphql/           # GraphQL queries and client setup
│   │   ├── types/             # TypeScript type definitions
│   │   └── utils/             # Utility functions
│   ├── stores/                # Zustand state management
│   └── data/                  # Static data and constants
├── public/                    # Static assets
├── tests/                     # Test files
└── docs/                      # Documentation
```

## 🔧 Technology Stack

### **Frontend Framework**
- **Next.js 15.4.1** - React framework with App Router
- **React 19.1.0** - UI library
- **TypeScript** - Type safety

### **Styling & UI**
- **Tailwind CSS 4.0** - Utility-first CSS framework
- **Lucide React** - Beautiful icons
- **Class Variance Authority** - Component variants
- **Tailwind Merge** - Conditional classes

### **Data & State**
- **Apollo Client 3.13.8** - GraphQL client
- **GraphQL 16.11.0** - Query language
- **Zustand 5.0.6** - State management
- **PokeAPI GraphQL** - Pokemon data source

### **Development & Testing**
- **Vitest** - Testing framework
- **Testing Library** - Component testing
- **Biome** - Linting and formatting
- **Husky** - Git hooks

## 🌐 API Integration

This application uses the **PokeAPI GraphQL endpoint** to fetch Pokemon data:

- **Endpoint**: `https://beta.pokeapi.co/graphql/v1beta`
- **Data**: Pokemon stats, abilities, moves, evolution chains, types, and more
- **Caching**: Apollo Client handles caching for optimal performance

## 🧪 Testing

Run the test suite:

```bash
# Run all tests
bun test

# Run tests in watch mode
bun test:watch

# Run tests with UI
bun test:ui

# Run tests with coverage
bun test:coverage
```

## 🚀 Deployment

### **Vercel (Recommended)**

1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Deploy automatically on every push

### **Manual Build**

```bash
# Build for production
bun build

# Start production server
bun start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [PokeAPI](https://pokeapi.co/) for providing comprehensive Pokemon data
- [Next.js](https://nextjs.org/) team for the amazing framework
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- Pokemon Company for creating these amazing creatures

---

**Built with ❤️ by [Your Name]**

*Gotta catch 'em all! 🔥*
