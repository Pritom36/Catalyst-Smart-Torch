


// Theme styles
const themes = {
    1: `
        body {
            font-family: 'Times New Roman', Times, serif;
    margin: 15px;
    line-height: 1.6;
            color: #333;
        }
        h1 {
            text-align: center;
            font-size: 24px;
            text-transform: uppercase;
            border-bottom: 2px solid #000;
            padding-bottom: 10px;
        }
        h2 {
            font-size: 20px;
            margin-top: 20px;
            border-bottom: 1px solid #ccc;
            padding-bottom: 5px;
        }
        h3 {
            font-size: 18px;
            margin-top: 15px;
        }
        .question {
            margin-bottom: 20px;
        }
        .options {
            margin-left: 20px;
            list-style-type: lower-alpha;
        }
        .solution {
            margin-left: 20px;
            background-color: #f9f9f9;
            padding: 10px;
            border-left: 3px solid #3498db;
        }
        .answer {
            font-weight: bold;
            color: #d32f2f;
        }
        .summary {
            margin-top: 30px;
            border-top: 2px solid #000;
            padding-top: 10px;
        }
        .summary ul {
            list-style-type: none;
            padding-left: 0;
        }
        .summary li {
            margin-bottom: 5px;
        }
        .math {
            font-style: italic;
        }
    `,
    2: `
        :root {
            --primary-color: #8ab4f8;
            --secondary-color: #81c995;
            --accent-color: #f28b82;
            --text-color: #e8eaed;
            --light-bg: #202124;
            --card-shadow: 0 1px 2px 0 rgba(0,0,0,0.6), 0 2px 6px 2px rgba(0,0,0,0.3);
        }
        
        body {
            font-family: 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', sans-serif;
            background-color: #121212;
            color: var(--text-color);
            line-height: 1.7;
        }
        
        h1, h2, h3 {
            color: white;
            font-weight: 400;
        }
        
        .question {
            background: #1e1e1e;
            border-radius: 8px;
            box-shadow: var(--card-shadow);
            border-left: 3px solid var(--primary-color);
        }
        
        .options li {
            padding: 10px 15px;
            margin: 8px 0;
            background: #2d2d2d;
            border-radius: 4px;
            transition: all 0.2s;
        }
        
        .options li:hover {
            background: #3d3d3d;
            transform: translateX(4px);
        }
        
        .solution {
            background: #1e3a1e;
            border-left: 4px solid var(--secondary-color);
        }
        
        .answer {
            color: var(--accent-color);
            font-weight: bold;
        }
        
        .summary li {
            background: #1e1e1e;
        }
    `,
    3: `
        :root {
            --primary-color: #6d4c41;
            --secondary-color: #5d4037;
            --accent-color: #d84315;
            --text-color: #3e2723;
            --light-bg: #efebe9;
            --card-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
        }
        
        body {
            font-family: 'Palatino Linotype', 'Book Antiqua', Palatino, serif;
            background-color: #f5f5f5;
            color: var(--text-color);
            line-height: 1.7;
            background-image: linear-gradient(#efebe9 1px, transparent 1px);
            background-size: 100% 24px;
        }
        
        h1, h2, h3 {
            color: var(--secondary-color);
            font-weight: normal;
        }
        
        h1 {
            border-bottom: 2px solid #d7ccc8;
        }
        
        .question {
            background: white;
            border-radius: 2px;
            box-shadow: var(--card-shadow);
            border-left: 4px solid #bcaaa4;
        }
        
        .options li {
            padding: 8px 12px;
            margin: 6px 0;
            background: #f5f5f5;
            border-left: 3px solid #a1887f;
        }
        
        .solution {
            background: #e8f5e9;
            border-left: 4px solid #81c784;
            font-style: italic;
        }
        
        .answer {
            color: var(--accent-color);
            text-decoration: underline;
        }
    `,
    4: `
        body {
            font-family: Arial, sans-serif;
    margin: 15px;
    line-height: 1.6;
            background-color: #f4f4f4;
        }
    `
};

// Apply selected theme
function setTheme(themeNumber) {
    const styleTag = document.getElementById('theme-style') || document.createElement('style');
    styleTag.id = 'theme-style';
    styleTag.innerHTML = themes[themeNumber];
    document.head.appendChild(styleTag);
    
    // Save theme preference
    localStorage.setItem('selectedTheme', themeNumber);
}

// Load saved theme
document.addEventListener('DOMContentLoaded', function() {
    const savedTheme = localStorage.getItem('selectedTheme');
    if (savedTheme) {
        setTheme(parseInt(savedTheme));
    } else {
        // Set default theme if none saved
        setTheme(1);
    }
});

// Add this at the bottom of your existing theme.js (before the last closing brace)

// Font Size Control System
const FontSizeController = {
    currentSize: 1.0, // Scaling factor (1.0 = 100% of the primary sizes defined below)
    minSize: 0.8,     // Minimum scaling factor
    maxSize: 1.5,     // Maximum scaling factor
    step: 0.1,        // Size change step

    // --- Define Primary Custom Font Sizes in Pixels ---
    // Set the desired font size (in pixels) for each tag type
    // when the scaling factor (currentSize) is 1.0 (100%).
    // *** YOU SHOULD ADJUST THESE VALUES TO MATCH YOUR DESIGN ***
    primaryFontSizesPx: {
        'h1': 30,
        'h2': 25,
        'h3': 20,
        'h4': 18,
        'h5': 16,
        'h6': 14,
        'p': 18,
        'li': 20,
        'a': 16,     // Base size for links
        'td': 15,     // Table data
        'th': 16,     // Table header (often bold via CSS)
        'label': 16,
        'span': 16,  // Note: Applies to ALL spans. Use classes for more control.
        'em': 18,     // Emphasis tag (often italic via CSS)
        'strong': 18 // Strong tag (often bold via CSS)
    },
    // --- End Primary Sizes ---

    // List of tags we are controlling (should match keys in primaryFontSizesPx)
    tagsToControl: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'li', 'a', 'td', 'th', 'label', 'span', 'em', 'strong'],

    init: function() {
        // No need to get initial sizes from DOM anymore

        // --- Create font control UI (Same as before) ---
        const fontControl = document.createElement('div');
        fontControl.className = 'font-control';
        fontControl.style.position = 'fixed';
        fontControl.style.bottom = '20px';
        fontControl.style.left = '20px';
        fontControl.style.zIndex = '1000';
        fontControl.style.display = 'flex';
        fontControl.style.gap = '8px';
        fontControl.style.alignItems = 'center';
        fontControl.style.backgroundColor = 'rgba(255,255,255,0.9)';
        fontControl.style.padding = '8px 12px';
        fontControl.style.borderRadius = '20px';
        fontControl.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';

        const decreaseBtn = document.createElement('button');
        decreaseBtn.innerHTML = 'A-';
        decreaseBtn.setAttribute('aria-label', 'Decrease font size'); // Accessibility
        decreaseBtn.style.fontSize = '20px'; // Fixed UI size
        decreaseBtn.style.padding = '4px 8px';
        decreaseBtn.style.border = '1px solid #ccc';
        decreaseBtn.style.borderRadius = '4px';
        decreaseBtn.style.background = '#f0f0f0';
        decreaseBtn.style.cursor = 'pointer';
        decreaseBtn.addEventListener('click', () => this.adjustSize(-this.step));

        const sizeDisplay = document.createElement('span');
        sizeDisplay.id = 'font-size-display';
        sizeDisplay.style.minWidth = '45px';
        sizeDisplay.style.textAlign = 'center';
        sizeDisplay.style.fontSize = '14px'; // Fixed UI size

        const increaseBtn = document.createElement('button');
        increaseBtn.innerHTML = 'A+';
        increaseBtn.setAttribute('aria-label', 'Increase font size'); // Accessibility
        increaseBtn.style.fontSize = '20px'; // Fixed UI size
        increaseBtn.style.padding = '4px 8px';
        increaseBtn.style.border = '1px solid #ccc';
        increaseBtn.style.borderRadius = '4px';
        increaseBtn.style.background = '#f0f0f0';
        increaseBtn.style.cursor = 'pointer';
        increaseBtn.addEventListener('click', () => this.adjustSize(this.step));

        fontControl.appendChild(decreaseBtn);
        fontControl.appendChild(sizeDisplay);
        fontControl.appendChild(increaseBtn);
        document.body.appendChild(fontControl);
        // --- End UI Creation ---


        // --- Load and Apply Initial Scaling Factor ---
        const savedSize = localStorage.getItem('fontSize');
        let initialFactor = this.currentSize; // Default factor is 1.0
        if (savedSize) {
            initialFactor = parseFloat(savedSize);
            initialFactor = Math.max(this.minSize, Math.min(this.maxSize, initialFactor));
        }
        this.currentSize = initialFactor;
        this.applySize(); // Apply the initial scaling factor
        // --- End Load ---
    },

    adjustSize: function(step) {
        let newFactor = this.currentSize + step;
        newFactor = parseFloat(newFactor.toFixed(2)); // Avoid floating point issues
        this.currentSize = Math.max(this.minSize, Math.min(this.maxSize, newFactor));
        this.applySize();
        localStorage.setItem('fontSize', this.currentSize.toString());
    },

    applySize: function() {
        // Loop through all tag types we have defined a primary size for
        this.tagsToControl.forEach(tag => {
            // Get the primary pixel size defined for this tag
            const primaryPxSize = this.primaryFontSizesPx[tag];

            if (primaryPxSize !== undefined && primaryPxSize > 0) {
                // Calculate the NEW font size based on the primary size and current factor
                const newPxSize = primaryPxSize * this.currentSize;

                // Find ALL elements of this type currently on the page
                const elements = document.querySelectorAll(tag);

                // Apply the new calculated pixel size as an inline style
                // This directly sets the font size for each element
                elements.forEach(el => {
                    el.style.fontSize = `${newPxSize}px`;
                });
            }
        });

        // Update the display percentage (reflecting the scaling factor)
        const displayPercentage = Math.round(this.currentSize * 100);
        const sizeDisplayElement = document.getElementById('font-size-display');
        if (sizeDisplayElement) {
            sizeDisplayElement.textContent = `${displayPercentage}%`;
        }

        // Optional: Disable buttons at limits
        const decreaseBtn = document.querySelector('.font-control button[aria-label="Decrease font size"]');
        const increaseBtn = document.querySelector('.font-control button[aria-label="Increase font size"]');
         if(decreaseBtn) decreaseBtn.disabled = this.currentSize <= this.minSize;
         if(increaseBtn) increaseBtn.disabled = this.currentSize >= this.maxSize;
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Your theme initialization code...
    // const savedTheme = localStorage.getItem('selectedTheme');
    // ... etc ...

    // Initialize font controls
    FontSizeController.init();
});