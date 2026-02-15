// ============================================
// Floofballs Task Guide — JavaScript
// ============================================
// This file powers the guide app. It:
//   - Defines all 8 tasks with their details
//   - Renders the sidebar task list
//   - Shows task details when a task is selected
//   - Handles checking tasks (auto + manual)
//   - Persists progress in localStorage
//   - Updates the progress bar
//   - Refreshes the live preview iframe
// ============================================

// ============================================
// TASK DATA
// ============================================
// Each task object contains everything the guide
// needs to display and verify the task.
//   - id: unique identifier (1-8)
//   - title: short name shown in the sidebar
//   - file: which file the user should edit
//   - instructions: full description of what to do
//   - hint: helpful tip (hidden until revealed)
//   - type: "auto" (server-verified) or "manual" (self-check)
const tasks = [
  {
    id: 1,
    title: 'Add a second CTA button',
    file: 'public/index.html',
    instructions:
      'In the hero section, find the "Get Floofballed" button. Below it (still inside the <code>.hero-buttons</code> div), add a second button that says <strong>"Watch the Video 🎬"</strong>. Give it <code>class="btn btn-secondary"</code>.',
    hint: 'Look for the TASK 1 comment in public/index.html. Add this code right below it:<br><code>&lt;button class="btn btn-secondary"&gt;Watch the Video 🎬&lt;/button&gt;</code>',
    type: 'auto'
  },
  {
    id: 2,
    title: 'Add an image to the hero section',
    file: 'public/index.html',
    instructions:
      'Add an <code>&lt;img&gt;</code> tag somewhere inside the hero section. Give it <code>id="hero-image"</code>. Use any image URL you like — or try <code>https://picsum.photos/400/400</code> for a random photo.',
    hint: 'Look for the TASK 2 comment in public/index.html. Add something like:<br><code>&lt;img id="hero-image" src="https://picsum.photos/400/400" alt="Floofball"&gt;</code>',
    type: 'auto'
  },
  {
    id: 3,
    title: 'Make the hero section taller',
    file: 'public/style.css',
    instructions:
      'Open <code>style.css</code> and find the <code>.hero</code> rule. Increase the padding so the top padding is at least <strong>120px</strong>. Try changing it to something like <code>padding: 120px 2rem</code>.',
    hint: 'Find the TASK 3 comment in style.css. The current padding is <code>80px 2rem</code>. Change the first number to 120 or higher.',
    type: 'auto'
  },
  {
    id: 4,
    title: 'Change the features background colour',
    file: 'public/style.css',
    instructions:
      'In <code>style.css</code>, find the <code>.features</code> rule. It currently has <code>background-color: #f3f0ff</code>. Change it to any colour you like — get creative!',
    hint: 'Find the TASK 4 comment in style.css. Change <code>#f3f0ff</code> to any other colour, like <code>#ffe4d6</code> (warm peach) or <code>#d6f5e6</code> (mint green).',
    type: 'auto'
  },
  {
    id: 5,
    title: 'Make the feature cards bigger',
    file: 'public/style.css',
    instructions:
      'Find the <code>.feature-card</code> rule in <code>style.css</code>. The padding is currently <code>1.5rem</code>. Increase it to at least <strong>2rem</strong> (32px) to give the cards more breathing room.',
    hint: 'Find the TASK 5 comment in style.css. Change <code>padding: 1.5rem</code> to <code>padding: 2rem</code> or higher (like <code>2.5rem</code> or <code>40px</code>).',
    type: 'auto'
  },
  {
    id: 6,
    title: 'Add a fourth feature card',
    file: 'public/index.html',
    instructions:
      'In <code>index.html</code>, find the <code>.features-grid</code> div that contains three feature cards. Add a fourth <code>&lt;div class="feature-card"&gt;</code> with an emoji icon, a heading, and a description — make it fun!',
    hint: 'Look for the TASK 6 comment in index.html. Copy one of the existing cards and paste it after the third one. Change the emoji, heading, and paragraph text to something new.',
    type: 'auto'
  },
  {
    id: 7,
    title: 'Make the CTA button show an alert',
    file: 'public/app.js',
    instructions:
      'Open <code>app.js</code> and find the empty click handler for the "Get Floofballed" button. Add an <code>alert()</code> inside it with a funny message — something like <strong>"You\'ve been Floofballed! 🟠"</strong>.',
    hint: 'Find the TASK 7 comment in app.js. Inside the empty <code>function () { }</code>, add:<br><code>alert("You\'ve been Floofballed! 🟠");</code>',
    type: 'manual'
  },
  {
    id: 8,
    title: 'Make the counter count up',
    file: 'public/app.js',
    instructions:
      'In <code>app.js</code>, find the empty <code>setInterval</code> function. Make it increment the counter by a random number between 1 and 5 every 3 seconds, and update the text on the page.',
    hint: 'Find the TASK 8 comment in app.js. Inside the empty function, add:<br><code>floofCount += Math.floor(Math.random() * 5) + 1;<br>counterElement.textContent = floofCount + " Floofballs sold today";</code>',
    type: 'manual'
  }
];

// ============================================
// STATE
// ============================================
// Track which task is currently selected and
// which tasks have been completed.
// Completed task IDs are saved to localStorage
// so progress survives page refreshes.

let currentTaskId = null;

// Load completed tasks from localStorage, or start empty
function loadCompleted() {
  try {
    const saved = localStorage.getItem('floofballs-completed');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

// Save completed tasks to localStorage
function saveCompleted(completedIds) {
  localStorage.setItem('floofballs-completed', JSON.stringify(completedIds));
}

let completedTaskIds = loadCompleted();

// ============================================
// RENDER THE SIDEBAR TASK LIST
// ============================================
// Generates an <li> for each task and adds it
// to the sidebar. Each item shows a status icon
// and the task title. Clicking selects the task.
function renderSidebar() {
  const list = document.getElementById('task-list');
  list.innerHTML = '';

  tasks.forEach((task) => {
    const li = document.createElement('li');
    li.className = 'task-item';

    // Mark as completed or active
    if (completedTaskIds.includes(task.id)) {
      li.classList.add('completed');
    }
    if (task.id === currentTaskId) {
      li.classList.add('active');
    }

    // Status icon: green check if done, empty box if not
    const icon = completedTaskIds.includes(task.id) ? '\u2705' : '\uD83D\uDD32';

    li.innerHTML = `
      <span class="task-status">${icon}</span>
      <span>${task.id}. ${task.title}</span>
    `;

    // Click to select this task
    li.addEventListener('click', () => selectTask(task.id));

    list.appendChild(li);
  });
}

// ============================================
// SELECT A TASK
// ============================================
// When the user clicks a task in the sidebar,
// this function shows its full details in the
// main panel and updates the UI state.
function selectTask(taskId) {
  currentTaskId = taskId;
  const task = tasks.find((t) => t.id === taskId);
  if (!task) return;

  // Hide welcome message, show task detail
  document.getElementById('welcome-message').style.display = 'none';
  document.getElementById('task-detail').style.display = 'block';

  // Populate the task detail fields
  document.getElementById('task-number').textContent = `Task ${task.id}`;
  document.getElementById('task-title').textContent = task.title;
  document.getElementById('task-file').innerHTML = `Open: <strong>${task.file}</strong>`;
  document.getElementById('task-instructions').innerHTML = task.instructions;

  // Set up the hint section
  const hintContent = document.getElementById('hint-content');
  const hintToggle = document.getElementById('hint-toggle');
  hintContent.innerHTML = task.hint;
  hintContent.style.display = 'none';
  hintToggle.textContent = 'Show Hint';

  // Set up the check/done button
  const checkButton = document.getElementById('check-button');
  if (task.type === 'manual') {
    // Manual task: show "Mark as Done" button
    checkButton.textContent = 'Mark as Done \u2713';
    checkButton.className = 'btn-check btn-manual';
  } else {
    // Auto task: show "Check" button
    checkButton.textContent = 'Check';
    checkButton.className = 'btn-check';
  }

  // Clear any previous result message
  const resultEl = document.getElementById('result-message');
  resultEl.style.display = 'none';
  resultEl.className = 'result-message';

  // If already completed, show a success message
  if (completedTaskIds.includes(taskId)) {
    resultEl.style.display = 'block';
    resultEl.className = 'result-message success';
    resultEl.textContent = 'You\'ve already completed this task! Nice work.';
  }

  // Re-render sidebar to update active state
  renderSidebar();
}

// ============================================
// UPDATE PROGRESS BAR
// ============================================
// Recalculates the progress bar width and text
// based on how many tasks are completed.
function updateProgress() {
  const count = completedTaskIds.length;
  const total = tasks.length;
  const percent = (count / total) * 100;

  document.getElementById('progress-fill').style.width = percent + '%';

  let text = `${count} of ${total} tasks complete`;
  if (count === total) {
    text += ' \uD83C\uDF89 All done!';
  }
  document.getElementById('progress-text').textContent = text;
}

// ============================================
// REFRESH THE PREVIEW IFRAME
// ============================================
// Reloads the iframe to show the latest version
// of the landing page after a task passes.
function refreshPreview() {
  const iframe = document.getElementById('preview-iframe');
  iframe.src = iframe.src;
}

// ============================================
// CHECK A TASK
// ============================================
// For auto tasks: sends a GET request to the
// /check/:taskId endpoint on the server.
// For manual tasks: marks the task as done
// immediately (self-check — no server call).
async function checkTask() {
  if (currentTaskId === null) return;

  const task = tasks.find((t) => t.id === currentTaskId);
  if (!task) return;

  const resultEl = document.getElementById('result-message');

  // Manual tasks — mark as done immediately
  if (task.type === 'manual') {
    if (!completedTaskIds.includes(task.id)) {
      completedTaskIds.push(task.id);
      saveCompleted(completedTaskIds);
    }

    resultEl.style.display = 'block';
    resultEl.className = 'result-message success';
    resultEl.textContent = 'Marked as done! Make sure you actually tested it in the browser.';

    renderSidebar();
    updateProgress();
    refreshPreview();
    return;
  }

  // Auto tasks — call the server check endpoint
  try {
    resultEl.style.display = 'block';
    resultEl.className = 'result-message';
    resultEl.textContent = 'Checking...';

    const response = await fetch(`/check/${task.id}`);
    const data = await response.json();

    if (data.success) {
      // Task passed! Mark as completed
      if (!completedTaskIds.includes(task.id)) {
        completedTaskIds.push(task.id);
        saveCompleted(completedTaskIds);
      }

      resultEl.className = 'result-message success';
      resultEl.textContent = data.message;

      renderSidebar();
      updateProgress();
      refreshPreview();
    } else {
      // Task failed — show the error message
      resultEl.className = 'result-message failure';
      resultEl.textContent = data.message;
    }
  } catch (error) {
    resultEl.style.display = 'block';
    resultEl.className = 'result-message failure';
    resultEl.textContent = 'Could not connect to the server. Is it running?';
  }
}

// ============================================
// EVENT LISTENERS
// ============================================

// Hint toggle — show/hide the hint text
document.getElementById('hint-toggle').addEventListener('click', () => {
  const content = document.getElementById('hint-content');
  const toggle = document.getElementById('hint-toggle');

  if (content.style.display === 'none') {
    content.style.display = 'block';
    toggle.textContent = 'Hide Hint';
  } else {
    content.style.display = 'none';
    toggle.textContent = 'Show Hint';
  }
});

// Check button — verify the current task
document.getElementById('check-button').addEventListener('click', checkTask);

// ============================================
// INITIALISE
// ============================================
// Render the sidebar and set up the progress
// bar when the page first loads.
renderSidebar();
updateProgress();
