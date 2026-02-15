# Floofballs

A fun coding learning project where you practice real web development by editing actual project files.

## What is this?

Floofballs is a fictional product — giant, squishy, colourful foam balls that serve absolutely no purpose. This project gives you a fully designed landing page and a series of 8 tasks to complete. Each task teaches you a real HTML, CSS, or JavaScript skill.

There are two parts:

1. **The Landing Page** (`http://localhost:3002`) — A fun, professional-looking product page for Floofballs. Your job is to improve and customise it.
2. **The Task Guide** (`http://localhost:3002/guide`) — A companion app that lists all 8 tasks, gives you instructions, and checks your work.

## Getting Started

### Install dependencies

```bash
npm install
```

### Start the server

```bash
npm start
```

### Open in your browser

- **Landing page:** http://localhost:3002
- **Task guide:** http://localhost:3002/guide

## How it works

1. Open the Task Guide at http://localhost:3002/guide
2. Pick a task from the sidebar
3. Read the instructions — they tell you which file to open and what to change
4. Open the file in your editor, make the change, and save
5. Go back to the guide and click **Check** to verify your work
6. The guide will tell you if you got it right!

## The 8 Tasks

| # | Task | File | Type |
|---|------|------|------|
| 1 | Add a second CTA button | `public/index.html` | Auto-check |
| 2 | Add an image to the hero section | `public/index.html` | Auto-check |
| 3 | Make the hero section taller | `public/style.css` | Auto-check |
| 4 | Change the features background colour | `public/style.css` | Auto-check |
| 5 | Make the feature cards bigger | `public/style.css` | Auto-check |
| 6 | Add a fourth feature card | `public/index.html` | Auto-check |
| 7 | Make the CTA button show an alert | `public/app.js` | Self-check |
| 8 | Make the counter count up | `public/app.js` | Self-check |

## Project Structure

```
floofballs/
├── server.js          ← Express server (serves both apps + check API)
├── package.json
├── README.md
├── public/            ← The Floofballs landing page
│   ├── index.html
│   ├── style.css
│   └── app.js
└── guide/             ← The task guide app
    ├── index.html
    ├── style.css
    └── guide.js
```

## Tech Stack

- Node.js + Express
- Plain HTML, CSS, and vanilla JavaScript
- No database, no build tools, no frameworks
