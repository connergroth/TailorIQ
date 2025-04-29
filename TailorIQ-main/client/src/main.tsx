import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";    // Tailwind CSS

// Make sure the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const rootElement = document.getElementById("root");
  
  if (rootElement) {
    createRoot(rootElement).render(<App />);
  } else {
    console.error("Root element not found!");
  }
});