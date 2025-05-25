document.addEventListener('DOMContentLoaded', function() {
    const $ = selector => document.querySelector(selector);
    const $$ = selector => document.querySelectorAll(selector);
    
    function addEventToAll(elements, events, handler) {
        if (!Array.isArray(events)) events = [events];
        elements.forEach(element => {
            events.forEach(event => {
                element.addEventListener(event, handler);
            });
        });
    }
    
    function toggleClass(element, className) {
        if (element) element.classList.toggle(className);
    }
    
    const navToggle = $('#nav-toggle');
    const navLinks = $('#nav-links');
    
    if (navToggle) {
        navToggle.addEventListener('click', () => toggleClass(navLinks, 'active'));
    }
    
    const navItems = $$('.nav-links a');
    addEventToAll(navItems, 'click', function() {
        if (navLinks && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
        }
    });
    
    const themeToggle = $('#theme-toggle');
    if (themeToggle) {
        const themeIcon = themeToggle.querySelector('i');
        
        function updateTheme(isDark) {
            document.body.classList.toggle('dark-theme', isDark);
            themeIcon.classList.remove(isDark ? 'fa-moon' : 'fa-sun');
            themeIcon.classList.add(isDark ? 'fa-sun' : 'fa-moon');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        }
        
        themeToggle.addEventListener('click', function() {
            const isDark = !document.body.classList.contains('dark-theme');
            updateTheme(isDark);
        });
        
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            updateTheme(true);
        }
    }
    
    function smoothScroll(target, offset = 80) {
        const targetElement = $(target);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - offset,
                behavior: 'smooth'
            });
        }
    }
    
    addEventToAll($$('a[href^="#"]'), 'click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        smoothScroll(targetId);
    });
    
    const scrollLink = $('.scroll-link');
    if (scrollLink) {
        addEventToAll([scrollLink], ['click', 'touchend'], function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const targetId = this.getAttribute('href');
            setTimeout(() => smoothScroll(targetId), 10);
        });
    }
    
    const animateOnScroll = function() {
        const elements = $$('.time-concept, .feature-card, .process-step, .impact-card');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight;
            
            if (elementPosition < screenPosition - 100) {
                element.classList.add('visible');
            }
        });
    };
    
    window.addEventListener('scroll', animateOnScroll);
    setTimeout(animateOnScroll, 100);
    
    const demoVideo = $('#demoVideo');
    const fullscreenBtn = $('#fullscreenBtn');
    
    if (fullscreenBtn && demoVideo) {
        function requestFullscreen(element) {
            if (element.requestFullscreen) {
                element.requestFullscreen();
            } else if (element.webkitRequestFullscreen) {
                element.webkitRequestFullscreen();
            } else if (element.msRequestFullscreen) {
                element.msRequestFullscreen();
            }
        }
        
        addEventToAll([fullscreenBtn], ['click', 'touchend'], function(e) {
            e.preventDefault();
            if (e.type === 'touchend') e.stopPropagation();
            
            const delay = e.type === 'touchend' ? 10 : 0;
            setTimeout(() => requestFullscreen(demoVideo), delay);
        });
    }
    
    const adjustOrientations = function() {
        const barrier = $('.barrier');
        const connection = $('.connection');
        const isMobile = window.innerWidth <= 768;
        
        if (barrier) {
            barrier.style.width = isMobile ? '150px' : '20px';
            barrier.style.height = isMobile ? '20px' : '150px';
        }
        
        if (connection) {
            connection.style.width = isMobile ? '10px' : '200px';
            connection.style.height = isMobile ? '100px' : '10px';
        }
        
        if (barrier && isMobile) {
            barrier.querySelector('::before')?.style.left = '-10px';
            barrier.querySelector('::after')?.style.right = '-10px';
        }
    };
    
    window.addEventListener('resize', adjustOrientations);
    adjustOrientations();
});
