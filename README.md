# Melody Quest - Scrolly Game Jam Edition

A rhythm-based music game built for the #NoCodeJam, featuring falling notes, combo systems, and progressive difficulty. Tap notes in sequence to build combos and achieve high scores!

<p align="center">
  <img src="https://github.com/user-attachments/assets/25e7a7ec-668f-4fb1-8cb4-0664817fa5c6" alt="Responsive View" width="295" height="756" />
  <img src="https://github.com/user-attachments/assets/27b0e8ba-c78e-4bc7-a484-0c96852e31f9" alt="Desktop View" width="732" height="420" />
</p>

<p align="center">
  <em>Responsive (Mobile) View &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Desktop View</em>
</p>

## 🎮 Game Features

- **Progressive Difficulty**: 9 levels with increasing speed and complexity
- **Combo System**: Build combos for score multipliers (every 5 combo = 2x points)
- **Life System**: Start with 3 hearts, lives restore every 4th level
- **Dynamic Music**: Adventure-style background music with chord progressions
- **Visual Feedback**: Real-time feedback for correct/wrong notes
- **Score Tracking**: High score persistence across sessions

## 🛠️ Technologies Used

### Core Framework & Language
- **Next.js** (v13.1.5) - React framework for production
- **React** (v18.2.0) - UI library
- **TypeScript** (v4.9.4) - Type-safe JavaScript

### Styling
- **Tailwind CSS** (v3.2.4) - Utility-first CSS framework
- **DaisyUI** (v1.24.3) - Component library
- **PostCSS** & **Autoprefixer** - CSS processing

### Audio
- **Web Audio API** - Native browser audio synthesis for music and sound effects

### Blockchain Integration (Scaffold Base)
- **@solana/web3.js** (v1.73.0) - Solana JavaScript SDK
- **@solana/wallet-adapter-react** - Wallet integration
- **@solana/wallet-adapter-wallets** - Wallet implementations

### State Management
- **Zustand** (v3.6.9) - Lightweight state management
- **Immer** (v9.0.12) - Immutable state updates

### Other Dependencies
- **@heroicons/react** - Icon library
- **date-fns** - Date utility library

## 🚀 Getting Started

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

### Installation

```bash
npm install
# or
yarn install
```

### Build and Run

Run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the game by modifying `src/views/home/index.tsx`. The page auto-updates as you edit the file.

## 🎯 How to Play

1. **Start Quest**: Click to begin the game
2. **Tap Notes**: Falling notes will appear - tap the ones that match your sequence
3. **Build Combos**: Hit consecutive correct notes to build combos
   - Every 5 combo grants 2x score multiplier
   - Higher combos = higher multipliers!
4. **Watch Your Hearts**: Missing correct notes costs lives
5. **Level Progression**: Complete sequences to advance
   - Lives restore every 4th level
   - Speed increases with each level
6. **Win Condition**: Complete all 9 levels to win!

## 📁 Project Structure

```
├── public : publically hosted files
├── src : primary code folders and files 
│   ├── components : reusable UI components (AppBar, Footer, etc.)
│   ├── contexts : context providers for state management
│   ├── hooks : custom React hooks
│   ├── models : data structure definitions
│   ├── pages : Next.js pages with meta data
│   ├── stores : Zustand stores for state management
│   ├── styles : global and reusable styles
│   ├── utils : reusable utility functions
│   ├── views : main content views (HomeView with GameSandbox)
├── package.json : project dependencies
├── tsconfig.json : TypeScript configuration
└── tailwind.config.js : Tailwind CSS configuration
```

### Game Logic Location

The main game component is located at: `src/views/home/index.tsx`

- **GameSandbox**: Core game logic and UI (lines 73-615)
- Only edit the `GameSandbox` component for game modifications
- Keep the `HomeView` wrapper unchanged for proper scaffolding

### Build Configuration

Vercel automatically detects:
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`

Check out the [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## 🎨 Customization

### Modifying Game Logic

Edit the `GameSandbox` component in `src/views/home/index.tsx`:

```typescript
const GameSandbox: FC = () => {
  // Your game logic here
  // Modify notes, levels, scoring, etc.
}
```

### Styling Changes

Update Tailwind classes directly in the component or modify:
- `tailwind.config.js` - Theme configuration
- `src/styles/globals.css` - Global styles

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repo on GitHub
2. Clone the project to your own machine
3. Create a new branch for your feature
4. Commit changes to your branch
5. Push your work back to your fork
6. Submit a Pull Request

**NOTE**: Be sure to merge the latest from "upstream" before making a pull request!

## 📚 Learn More

### Next.js Resources
- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial
- [Next.js GitHub repository](https://github.com/vercel/next.js/)

### Game Development Resources
- [Web Audio API Documentation](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
- [React Hooks Documentation](https://react.dev/reference/react)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## 📄 License

This project is based on the Solana dApp Scaffold and is open source.

## 🏆 Credits

Built for the #NoCodeJam using the Solana dApp Scaffold Next template.

---

Made with ❤️ for the Scrolly Game Jam
