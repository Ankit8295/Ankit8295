# 🎮 Tic Tac Toe - Online Multiplayer Game

A real-time multiplayer Tic Tac Toe game built with Next.js and Socket.io. Play with friends online in real-time!

## ✨ Features

- 🚀 Real-time multiplayer gameplay using Socket.io
- 🎯 Easy room creation and joining system
- 💻 Modern, responsive UI with Tailwind CSS
- 🔄 Automatic game reset and reconnection handling
- 📱 Mobile-friendly design
- 🎨 Beautiful animations and visual feedback

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS
- **Real-time**: Socket.io
- **Server**: Custom Node.js server with Socket.io integration

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed on your machine
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd tic-tac-toe-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

## 🎮 How to Play

1. **Enter your name** in the input field
2. **Create a new room** or **join an existing room** by entering a Room ID
3. **Share the Room ID** with a friend to play together
4. **Take turns** clicking on the board to place your symbol (❌ or ⭕)
5. **Win** by getting three in a row horizontally, vertically, or diagonally
6. **Play again** by clicking the "Play Again" button after a game ends

## 🏗️ Project Structure

```
src/
├── app/                 # Next.js app directory
│   ├── globals.css     # Global styles
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Main page
├── components/         # React components
│   ├── GameBoard.tsx   # Game board component
│   └── RoomSelector.tsx # Room selection component
├── context/           # React context
│   └── SocketContext.tsx # Socket.io context
├── types/             # TypeScript type definitions
│   └── game.ts        # Game-related types
└── lib/               # Utility functions
    └── socket.ts      # Socket configuration
```

## 🌐 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy with the default settings
4. Update the Socket.io connection URL in production

### Other Platforms

The app can be deployed to any platform that supports Node.js applications:

- Heroku
- Railway
- DigitalOcean App Platform
- AWS EC2

Make sure to set the `NODE_ENV=production` environment variable.

## 🔧 Available Scripts

- `npm run dev` - Start development server with Socket.io
- `npm run build` - Build the application for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🎯 Game Rules

- Players take turns placing their symbol (❌ or ⭕) on the board
- The first player to get three symbols in a row wins
- Rows can be horizontal, vertical, or diagonal
- If all 9 squares are filled without a winner, it's a draw
- Players can reset the game and play multiple rounds

## 🚀 Features in Detail

### Real-time Multiplayer
- Uses Socket.io for instant communication between players
- Automatic reconnection handling
- Room-based game sessions

### User Experience
- Clean, modern interface
- Visual feedback for all actions
- Connection status indicator
- Mobile-responsive design

### Game Management
- Automatic room creation with unique IDs
- Player turn management
- Win condition detection
- Game state synchronization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Built with Next.js and Socket.io
- Styled with Tailwind CSS
- Icons and emojis for visual appeal

---

Enjoy playing Tic Tac Toe with your friends! 🎉