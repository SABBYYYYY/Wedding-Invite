# Wedding Invitation Website

A responsive wedding invitation website created for Sherly and Prajwal. The experience begins with an animated envelope and continues through the couple’s story, a live countdown, the celebration schedule, venue details and photographs.

## Live Website

**[Visit Sherly and Prajwal’s Wedding Website](https://sherlyandprajwal.online)**

## Features

- **Animated invitation:** Open a wax seal to reveal the invitation card.
- **Scroll and swipe transitions:** Move from the opening animation into the main content.
- **Our Story section:** Introduce the couple through a photograph and personal message.
- **Live countdown:** Display the days, hours, minutes and seconds until the wedding.
- **Event schedule:** Present wedding celebrations with dates, times and locations.
- **Venue directions:** Open the wedding venue in Google Maps.
- **Photo gallery:** Display photographs in a responsive grid.
- **Responsive styling:** Adapt the layout for desktop and mobile screens.
- **Keyboard interactions:** Support keyboard controls for opening the invitation and progressing through the introduction.
- **Reduced-motion styling:** Include CSS adjustments for visitors who prefer reduced animation.

## Tech Stack

- HTML5
- CSS3
- Vanilla JavaScript
- Google Fonts
- Cloudflare hosting with a custom domain

The website uses static files and does not require a backend, database or build step.

## Running Locally

### 1. Clone the repository

```bash
git clone https://github.com/SABBYYYYY/Wedding-Invite.git
cd Wedding-Invite
```

### 2. Open the website

Open `index.html` in your browser, or serve the project folder with a local development server such as VS Code Live Server.

An internet connection is needed to load Google Fonts and open the external map link.

## Project Structure

```text
Wedding-Invite/
├── index.html     # Invitation content and page sections
├── main.css       # Layout, typography, animations and responsive styles
├── landing.js     # Opening sequence, transitions and countdown
└── assets/        # Photographs and other image assets
```

## Customization

- **Names, invitation text and event details:** Edit `index.html`.
- **Wedding countdown:** Update `TARGET_DATE` in `landing.js`.
- **Colors, fonts and animations:** Edit `main.css`.
- **Photographs:** Replace the relevant files in `assets/` and update their references in `index.html`.
- **Venue directions:** Update the Google Maps link in `index.html`.

The countdown currently uses the visitor’s local timezone.

## Learning Focus

- Coordinating CSS animations with JavaScript events.
- Building layouts for different screen sizes.
- Creating scroll-triggered transitions with `IntersectionObserver`.
- Handling mouse, touch and keyboard interactions.
- Deploying a static website with a custom domain.

## Author

[Sabyasachi Sinha](https://github.com/SABBYYYYY)
