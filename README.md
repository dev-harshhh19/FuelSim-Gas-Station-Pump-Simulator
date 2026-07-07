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
