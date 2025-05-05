
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Import the assets to ensure they're included in the bundle
import './assets/fox-logo.webp';
import './assets/fox-logo2.webp';
import './assets/fox-logo3.webp';
import './assets/fox-logo4.webp';

createRoot(document.getElementById("root")!).render(<App />);
