document.addEventListener('DOMContentLoaded', function() {
    // Menu toggle functionality for mobile
    const navToggle = document.getElementById('nav-toggle');
    const navLinks = document.getElementById('nav-links');
    
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
        });
    }
    
    // Close mobile menu when clicking a link
    const navItems = document.querySelectorAll('.nav-links a');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
            }
        });
    });
    
    // Theme toggle functionality
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle.querySelector('i');
    
    themeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-theme');
        
        if (document.body.classList.contains('dark-theme')) {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
            localStorage.setItem('theme', 'dark');
        } else {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
            localStorage.setItem('theme', 'light');
        }
    });
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    }
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Animate elements when they come into view
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.time-concept, .feature-card, .process-step, .impact-card');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight;
            
            if (elementPosition < screenPosition - 100) {
                element.classList.add('visible');
            }
        });
    };
    
    // Run animation check on scroll
    window.addEventListener('scroll', animateOnScroll);
    
    // Initial animation check
    setTimeout(animateOnScroll, 100);
    
    // Update YouTube video with actual demo video when available
    // Replace the placeholder URL with your actual demo video
    const demoVideo = document.querySelector('.video-container iframe');
    if (demoVideo) {
        // Update this URL with your actual demo video
        // demoVideo.setAttribute('src', 'https://www.youtube.com/embed/YOUR_VIDEO_ID');
    }
    
    // Adjust the barrier and connection orientations based on screen size
    const adjustOrientations = function() {
        const barrier = document.querySelector('.barrier');
        const connection = document.querySelector('.connection');
        
        if (window.innerWidth <= 768) {
            if (barrier) {
                barrier.style.width = '150px';
                barrier.style.height = '20px';
            }
            
            if (connection) {
                connection.style.width = '10px';
                connection.style.height = '100px';
            }
        } else {
            if (barrier) {
                barrier.style.width = '20px';
                barrier.style.height = '150px';
            }
            
            if (connection) {
                connection.style.width = '200px';
                connection.style.height = '10px';
            }
        }
    };
    
    // Run on load and resize
    window.addEventListener('resize', adjustOrientations);
    adjustOrientations();
});
