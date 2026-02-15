// ============================================
// server.js — Floofballs Learning Project
// ============================================
// This is the main Express server that powers two things:
//   1. The Floofballs landing page at http://localhost:3002
//   2. The task guide app at http://localhost:3002/guide
//   3. A /check/:taskId API for verifying completed tasks
// ============================================

const express = require('express');
const path = require('path');
const http = require('http');
const fs = require('fs');

const app = express();
const PORT = 3002;

// --------------------------------------------
// Static file serving
// --------------------------------------------
// Serve the guide app files under the /guide path.
// This must come BEFORE the public static middleware
// so that /guide routes are handled correctly.
app.use('/guide', express.static(path.join(__dirname, 'guide')));

// Serve the landing page files from the public/ directory.
// Express will automatically serve public/index.html for GET /
app.use(express.static(path.join(__dirname, 'public')));

// --------------------------------------------
// GET /guide — serve the guide app
// --------------------------------------------
// When the user visits /guide (with no trailing filename),
// send back the guide's index.html explicitly.
app.get('/guide', (req, res) => {
  res.sendFile(path.join(__dirname, 'guide', 'index.html'));
});

// --------------------------------------------
// Helper: fetch the live landing page HTML
// --------------------------------------------
// Uses Node's built-in http module to request our own
// landing page. Returns a Promise that resolves with the
// full HTML string.
function fetchLandingPage() {
  return new Promise((resolve, reject) => {
    http.get(`http://localhost:${PORT}/`, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

// --------------------------------------------
// Helper: read a file from the public/ directory
// --------------------------------------------
// Some tasks (like CSS checks) need to inspect the
// actual source files on disk rather than the rendered HTML.
function readPublicFile(filename) {
  return fs.readFileSync(path.join(__dirname, 'public', filename), 'utf-8');
}

// --------------------------------------------
// GET /check/:taskId — task verification endpoint
// --------------------------------------------
// The guide app calls this endpoint when the user clicks
// the "Check" button. It inspects either the live HTML or
// the source files on disk, depending on the task.
// Returns JSON: { success: boolean, message: string }
app.get('/check/:taskId', async (req, res) => {
  const taskId = parseInt(req.params.taskId, 10);

  try {
    // For tasks that check the live HTML (1, 2, 6):
    let html = '';
    if ([1, 2, 6].includes(taskId)) {
      html = await fetchLandingPage();
    }

    // For tasks that check the CSS file on disk (3, 4, 5):
    let css = '';
    if ([3, 4, 5].includes(taskId)) {
      css = readPublicFile('style.css');
    }

    switch (taskId) {

      // ----------------------------------------
      // TASK 1: Add a second CTA button
      // Checks if a .btn-secondary element exists
      // ----------------------------------------
      case 1: {
        const hasBtnSecondary = html.includes('btn-secondary');
        if (hasBtnSecondary) {
          return res.json({
            success: true,
            message: 'Nice one! The secondary button is there. You nailed it!'
          });
        }
        return res.json({
          success: false,
          message: 'Hmm, I can\'t find a .btn-secondary element yet. Make sure your button has class="btn btn-secondary".'
        });
      }

      // ----------------------------------------
      // TASK 2: Add an image to the hero section
      // Checks if an element with id="hero-image" exists
      // ----------------------------------------
      case 2: {
        const hasHeroImage = html.includes('id="hero-image"');
        if (hasHeroImage) {
          return res.json({
            success: true,
            message: 'Looking good! The hero image is showing up perfectly.'
          });
        }
        return res.json({
          success: false,
          message: 'I can\'t find an element with id="hero-image". Add an <img> tag with that id inside the hero section.'
        });
      }

      // ----------------------------------------
      // TASK 3: Make the hero section taller
      // Reads style.css and checks that .hero has
      // padding-top of at least 120px
      // ----------------------------------------
      case 3: {
        // Extract the .hero rule block from CSS
        const heroMatch = css.match(/\.hero\s*\{([^}]*)\}/s);
        if (!heroMatch) {
          return res.json({
            success: false,
            message: 'I can\'t find a .hero rule in style.css. Make sure it exists!'
          });
        }
        const heroBlock = heroMatch[1];

        // Check for padding shorthand or padding-top
        // Look for values >= 120px or >= 8rem (approx)
        let passed = false;

        // Check padding shorthand (e.g. "padding: 120px 2rem")
        const paddingShorthand = heroBlock.match(/padding\s*:\s*(\d+)(px|rem)/);
        if (paddingShorthand) {
          const value = parseFloat(paddingShorthand[1]);
          const unit = paddingShorthand[2];
          if (unit === 'px' && value >= 120) passed = true;
          if (unit === 'rem' && value >= 7.5) passed = true;
        }

        // Check padding-top explicitly
        const paddingTop = heroBlock.match(/padding-top\s*:\s*(\d+)(px|rem)/);
        if (paddingTop) {
          const value = parseFloat(paddingTop[1]);
          const unit = paddingTop[2];
          if (unit === 'px' && value >= 120) passed = true;
          if (unit === 'rem' && value >= 7.5) passed = true;
        }

        if (passed) {
          return res.json({
            success: true,
            message: 'The hero section is looking spacious now! Great job.'
          });
        }
        return res.json({
          success: false,
          message: 'The hero padding isn\'t quite big enough yet. Try padding: 120px 2rem or higher.'
        });
      }

      // ----------------------------------------
      // TASK 4: Change the features background colour
      // Reads style.css to confirm .features background
      // is no longer the default #f3f0ff
      // ----------------------------------------
      case 4: {
        const featuresMatch = css.match(/\.features\s*\{([^}]*)\}/s);
        if (!featuresMatch) {
          return res.json({
            success: false,
            message: 'I can\'t find a .features rule in style.css.'
          });
        }
        const featuresBlock = featuresMatch[1];
        const bgMatch = featuresBlock.match(/background-color\s*:\s*([^;]+)/);

        if (!bgMatch) {
          return res.json({
            success: false,
            message: 'There\'s no background-color property in the .features rule.'
          });
        }

        const bgValue = bgMatch[1].trim().toLowerCase();
        // Check if it's still the default value
        if (bgValue === '#f3f0ff' || bgValue === 'rgb(243, 240, 255)') {
          return res.json({
            success: false,
            message: 'The background colour is still the default #f3f0ff. Change it to something new!'
          });
        }

        return res.json({
          success: true,
          message: 'Love the new background colour! The features section looks fresh.'
        });
      }

      // ----------------------------------------
      // TASK 5: Make the feature cards bigger
      // Reads style.css to check .feature-card padding
      // is at least 2rem / 32px
      // ----------------------------------------
      case 5: {
        const cardMatch = css.match(/\.feature-card\s*\{([^}]*)\}/s);
        if (!cardMatch) {
          return res.json({
            success: false,
            message: 'I can\'t find a .feature-card rule in style.css.'
          });
        }
        const cardBlock = cardMatch[1];
        const padMatch = cardBlock.match(/padding\s*:\s*([\d.]+)(px|rem)/);

        if (!padMatch) {
          return res.json({
            success: false,
            message: 'There\'s no padding property in the .feature-card rule.'
          });
        }

        const value = parseFloat(padMatch[1]);
        const unit = padMatch[2];
        let passed = false;
        if (unit === 'px' && value >= 32) passed = true;
        if (unit === 'rem' && value >= 2) passed = true;

        if (passed) {
          return res.json({
            success: true,
            message: 'Those cards are looking chunky and beautiful! Well done.'
          });
        }
        return res.json({
          success: false,
          message: 'The padding isn\'t big enough yet. Try at least 2rem or 32px.'
        });
      }

      // ----------------------------------------
      // TASK 6: Add a fourth feature card
      // Counts occurrences of feature-card in the HTML
      // ----------------------------------------
      case 6: {
        const matches = html.match(/class="feature-card"/g);
        const count = matches ? matches.length : 0;
        if (count >= 4) {
          return res.json({
            success: true,
            message: `Found ${count} feature cards — awesome! The more the merrier.`
          });
        }
        return res.json({
          success: false,
          message: `I found ${count} feature card(s) but I need at least 4. Add another <div class="feature-card"> inside the .features-grid.`
        });
      }

      // Tasks 7 and 8 are manual self-check tasks
      // They shouldn't hit this endpoint, but handle gracefully
      case 7:
      case 8:
        return res.json({
          success: true,
          message: 'This is a self-check task — nice work marking it done!'
        });

      default:
        return res.json({
          success: false,
          message: `Unknown task ID: ${taskId}`
        });
    }
  } catch (error) {
    console.error('Check error:', error);
    res.json({
      success: false,
      message: 'Something went wrong while checking. Is the server running?'
    });
  }
});

// --------------------------------------------
// Start the server
// --------------------------------------------
app.listen(PORT, () => {
  console.log('');
  console.log('  🟠 Floofballs Learning Project is running!');
  console.log('');
  console.log(`  Landing page:  http://localhost:${PORT}`);
  console.log(`  Task guide:    http://localhost:${PORT}/guide`);
  console.log('');
  console.log('  Edit the files in public/ and check your progress in the guide.');
  console.log('');
});
