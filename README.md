# FuelSim

A professional, interactive web-based simulation of a gas station pump interface. Built to demonstrate clean front-end architecture, strict separation of concerns, and scalable styling practices in a modern web environment.

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen?style=for-the-badge)](https://dev-harshhh19.github.io/FuelSim-Gas-Station-Pump-Simulator/)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-blue?style=for-the-badge)](https://github.com/dev-harshhh19/FuelSim-Gas-Station-Pump-Simulator)

## Architecture & Technical Overview

This project was intentionally engineered with zero dependencies (no build pipelines, no CSS frameworks, no external libraries) to highlight fundamental web development principles.

- **Modular JavaScript (IIFE)**: State management, configuration, DOM caching, and event binding are strictly encapsulated within an Immediately Invoked Function Expression. UI updates are decoupled from core calculation logic.
- **Vanilla CSS Custom Properties**: The design system relies entirely on CSS variables for consistent typography, spacing, semantic colors, and state changes. This ensures high maintainability and trivial theming.
- **Semantic HTML5**: The markup uses structurally correct HTML elements (`<main>`, `<section>`, `<header>`, `<footer>`) to ensure accessibility and logical DOM hierarchy.
- **Responsive Dashboard Layout**: Styled using CSS Grid and Flexbox for a robust, mobile-first interface that adapts cleanly to any viewport.
- **Simulated Real-Time Data**: Implements asynchronous timeouts and intervals to mimic live market price fluctuations and inactivity timeouts (120s auto-reset).

## Project Structure

```text
FuelSim/
├── index.html          # Core markup and structural layout
├── styles.css          # CSS variable definitions and scoped component styling
├── script.js           # Encapsulated application state and operational logic
├── logo.png            # Application asset
├── privacy.html        # Legal documentation
├── terms.html          # Legal documentation
└── README.md           # Project documentation
```

## Getting Started

Because the project utilizes a zero-dependency architecture, execution is trivial.

1. Clone the repository:
   ```bash
   git clone https://github.com/dev-harshhh19/FuelSim-Gas-Station-Pump-Simulator.git
   ```
2. Navigate to the directory and open `index.html` in any modern web browser.
3. No local server, package manager, or compilation step is required.

## Core Functionality

- **Volume vs. Price Calculation**: The engine dynamically supports cross-calculation depending on user preference (target liters vs. target currency).
- **Idle State Management**: Continuous event listeners monitor for interaction; prolonged inactivity automatically purges local state to simulate real-world kiosk behavior.
- **State-Dependent Resets**: Transitioning between fuel types actively resets the pump transaction state to prevent calculation overlaps.
- **Receipt Generation**: Formats transaction state into a printable ledger component, triggering the native browser print dialogue.

## Developer

**Harshad Nikam**
- Email: [harshadnikam7516@gmail.com](mailto:harshadnikam7516@gmail.com)
- LinkedIn: [Harshad Nikam](https://in.linkedin.com/in/harshad-nikam-311734281)
- GitHub: [@dev-harshhh19](https://github.com/dev-harshhh19)

### Sponsorship

If you found this architecture demonstration useful, consider supporting future open-source efforts:

- [Buy Me A Coffee](https://buymeacoffee.com/dev.harshhh)
- [GitHub Sponsors](https://github.com/sponsors/dev-harshhh19)
- **USDT (TRC20)**: `0xCd47D300a28E18443D19759D9957c347B86C2E27`

## License

This software is provided for educational and demonstrative purposes. Review `terms.html` for specific usage constraints.
