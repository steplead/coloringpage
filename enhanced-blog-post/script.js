/**
 * Enhanced Blog Post Interactivity
 */

document.addEventListener('DOMContentLoaded', () => {
  // Table of Contents Functionality
  const createTableOfContents = () => {
    const toc = document.createElement('div');
    toc.className = 'table-of-contents';
    toc.innerHTML = `
      <h3>Table of Contents</h3>
      <ol class="toc-list"></ol>
    `;

    const headings = document.querySelectorAll('h2');
    const tocList = toc.querySelector('.toc-list');

    headings.forEach((heading, index) => {
      const id = heading.id || `section-${index}`;
      heading.id = id;
      
      const listItem = document.createElement('li');
      const link = document.createElement('a');
      link.href = `#${id}`;
      link.textContent = heading.textContent;
      link.classList.add('toc-link');
      
      listItem.appendChild(link);
      tocList.appendChild(listItem);
      
      // Smooth scroll on TOC click
      link.addEventListener('click', (e) => {
        e.preventDefault();
        
        document.querySelector(link.getAttribute('href')).scrollIntoView({
          behavior: 'smooth'
        });
      });
    });
    
    // Insert TOC after the first section
    const firstSection = document.querySelector('.section');
    if (firstSection) {
      firstSection.parentNode.insertBefore(toc, firstSection.nextSibling);
    }
  };
  
  // FAQ Accordion Functionality
  const setupFaqAccordion = () => {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
      const question = item.querySelector('h3');
      const answer = item.querySelector('[itemprop="acceptedAnswer"]');
      
      // Hide answers initially
      answer.style.display = 'none';
      
      question.addEventListener('click', () => {
        // Toggle the current answer
        const isOpen = answer.style.display === 'block';
        
        // Close all answers
        document.querySelectorAll('.faq-item [itemprop="acceptedAnswer"]')
          .forEach(el => {
            el.style.display = 'none';
          });
        
        document.querySelectorAll('.faq-item')
          .forEach(el => {
            el.classList.remove('active');
          });
        
        // Open current answer if it was closed
        if (!isOpen) {
          answer.style.display = 'block';
          item.classList.add('active');
        }
      });
    });
  };
  
  // Back to Top Button
  const setupBackToTopButton = () => {
    const button = document.createElement('button');
    button.className = 'back-to-top';
    button.innerHTML = '↑';
    button.setAttribute('aria-label', 'Back to top');
    document.body.appendChild(button);
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 300) {
        button.classList.add('visible');
      } else {
        button.classList.remove('visible');
      }
    });
    
    // Scroll to top on click
    button.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  };
  
  // Progress Bar
  const setupProgressBar = () => {
    const progressBar = document.createElement('div');
    progressBar.className = 'reading-progress';
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const progress = (scrollTop / scrollHeight) * 100;
      
      progressBar.style.width = `${progress}%`;
    });
  };
  
  // Image Zoom Functionality
  const setupImageZoom = () => {
    const images = document.querySelectorAll('.section img:not(.no-zoom)');
    
    images.forEach(img => {
      img.style.cursor = 'zoom-in';
      
      img.addEventListener('click', () => {
        const overlay = document.createElement('div');
        overlay.className = 'image-zoom-overlay';
        
        const imgClone = img.cloneNode(true);
        imgClone.className = 'zoomed-image';
        
        overlay.appendChild(imgClone);
        document.body.appendChild(overlay);
        
        overlay.addEventListener('click', () => {
          document.body.removeChild(overlay);
        });
      });
    });
  };
  
  // Estimated Reading Time
  const calculateReadingTime = () => {
    const content = document.querySelector('article').textContent;
    const wordCount = content.split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / 200); // Assuming 200 words per minute
    
    const readingTimeElement = document.createElement('div');
    readingTimeElement.className = 'reading-time';
    readingTimeElement.innerHTML = `<span>${readingTime} min read</span>`;
    
    const title = document.querySelector('h1');
    if (title) {
      title.insertAdjacentElement('afterend', readingTimeElement);
    }
  };
  
  // Color Palette Interaction
  const setupColorPaletteInteraction = () => {
    const swatches = document.querySelectorAll('.color-swatch');
    
    swatches.forEach(swatch => {
      const colorName = swatch.querySelector('span').textContent;
      const color = swatch.style.backgroundColor;
      
      swatch.setAttribute('title', `${colorName} - Click to copy`);
      
      swatch.addEventListener('click', () => {
        const tempInput = document.createElement('input');
        tempInput.value = color;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
        
        // Show feedback
        const tooltip = document.createElement('div');
        tooltip.className = 'color-tooltip';
        tooltip.textContent = 'Color copied!';
        swatch.appendChild(tooltip);
        
        setTimeout(() => {
          swatch.removeChild(tooltip);
        }, 1500);
      });
    });
  };
  
  // Initialize all features
  createTableOfContents();
  setupFaqAccordion();
  setupBackToTopButton();
  setupProgressBar();
  setupImageZoom();
  calculateReadingTime();
  setupColorPaletteInteraction();
}); 