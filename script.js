 // Mobile menu toggle
    document.getElementById('mobile-menu-button').addEventListener('click', function () {
      let menu = document.getElementById('mobile-menu');
      let menuIcon = document.getElementById('icon-menu');
      let closeIcon = document.getElementById('icon-close');

      let isExpanded = menu.classList.toggle('hidden');
      menuIcon.classList.toggle('hidden', !isExpanded);
      closeIcon.classList.toggle('hidden', isExpanded);

      this.setAttribute('aria-expanded', !isExpanded);
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          const offsetTop = target.offsetTop - 64; // Account for fixed navbar
          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
          });
          
          // Close mobile menu if open
          const mobileMenu = document.getElementById('mobile-menu');
          if (!mobileMenu.classList.contains('hidden')) {
            mobileMenu.classList.add('hidden');
            document.getElementById('icon-menu').classList.remove('hidden');
            document.getElementById('icon-close').classList.add('hidden');
          }
        }
      });
    });

  // Update the form submission script
document.getElementById('contact-form').addEventListener('submit', async function(e) {
  e.preventDefault();
  
  const submitBtn = document.getElementById('submit-btn');
  const successMessage = document.getElementById('success-message');
  const errorMessage = document.getElementById('error-message');
  
  // Hide previous messages
  successMessage.style.display = 'none';
  errorMessage.style.display = 'none';
  
  // Show loading state
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<div class="loading-spinner"></div>Sending...';
  
  // Get form data
  const formData = new FormData(this);
  const data = {
    name: formData.get('name'),
    email: formData.get('email'),
    subject: formData.get('subject'),
    message: formData.get('message')
  };
  
  try {
    // Use your Vercel function endpoint
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });
    
    const result = await response.json();
    
    if (response.ok) {
      successMessage.style.display = 'block';
      this.reset();
    } else {
      throw new Error(result.message || 'Failed to send message');
    }
  } catch (error) {
    console.error('Error:', error);
    errorMessage.style.display = 'block';
  } finally {
    // Reset button state
    submitBtn.disabled = false;
    submitBtn.innerHTML = 'Send Message';
  }
});

    // Add scroll effect to navbar
    window.addEventListener('scroll', function() {
      const navbar = document.querySelector('nav');
      if (window.scrollY > 50) {
        navbar.classList.add('bg-opacity-95');
      } else {
        navbar.classList.remove('bg-opacity-95');
      }
    });
