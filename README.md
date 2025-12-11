# Wingman

Wingman is a browser extension that helps you find the cheapest and most convenient flights by searching across multiple aggregators in one click.

## Features

- **Multi-Search**: Open search results on Wego, Skyscanner, Kayak, Google Flights, and more simultaneously.
- **Smart Inputs**: Auto-complete for airports (focused on India + major international hubs).
- **History**: Quickly access your recent searches.
- **Simple UI**: Clean, elegant interface built with React and Tailwind CSS.

## Development

### Setup

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run development server (for UI testing):
   ```bash
   npm run dev
   ```

### Build for Production

1. Run build command:
   ```bash
   npm run build
   ```
2. The output will be in the `dist` folder.

### Load Extension in Chrome

1. Open `chrome://extensions/`.
2. Enable "Developer mode" (top right).
3. Click "Load unpacked".
4. Select the `dist` folder.

## Tech Stack

- React
- TypeScript
- Tailwind CSS v4
- shadcn/ui
- Vite

## License

MIT
