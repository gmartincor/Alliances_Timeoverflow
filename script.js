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
    
    initNavigation();
    initThemeToggle();
    initSmoothScroll();
    initScrollAnimations();
    initVideoFunctionality();
    initResponsiveAdjustments();
    
    function initNavigation() {
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
    }
    
    function initThemeToggle() {
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
    }
    
    function initSmoothScroll() {
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
    }
    
    function initScrollAnimations() {
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
    }
    
    function initVideoFunctionality() {
        const demoVideo = $('#demoVideo');
        const fullscreenBtn = $('#fullscreenBtn');
        const pipBtn = $('#pipBtn');
        const fullscreenError = $('#fullscreenError');
        const videoOverlay = $('#videoFullscreenOverlay');
        
        if (!demoVideo) return;
        
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
        const isFullscreenSupported = checkFullscreenSupport();
        const isPipSupported = checkPictureInPictureSupport();
        
        function checkFullscreenSupport() {
            return document.fullscreenEnabled || 
                   document.webkitFullscreenEnabled || 
                   document.mozFullScreenEnabled || 
                   document.msFullscreenEnabled || 
                   (isIOS && demoVideo.webkitSupportsFullscreen);
        }
        
        function checkPictureInPictureSupport() {
            return 'pictureInPictureEnabled' in document && document.pictureInPictureEnabled;
        }
        
        function requestFullscreen(element) {
            if (isIOS) {
                if (element.webkitEnterFullscreen) {
                    return element.webkitEnterFullscreen();
                }
            }
            
            const requestMethods = [
                'requestFullscreen',
                'webkitRequestFullscreen',
                'mozRequestFullScreen',
                'msRequestFullscreen'
            ];
            
            const method = requestMethods.find(method => element[method]);
            
            if (method) {
                return element[method]();
            } else {
                return Promise.reject(new Error('API de pantalla completa no soportada'));
            }
        }
        
        function handleFullscreenRequest(e) {
            e.preventDefault();
            if (e.type === 'touchend') e.stopPropagation();
            
            if (navigator.vibrate && e.type === 'touchend') {
                navigator.vibrate(50);
            }
            
            fullscreenBtn.classList.add('btn-active');
            
            if (fullscreenError) {
                fullscreenError.textContent = '';
                fullscreenError.classList.remove('show');
            }
            
            if (!isFullscreenSupported) {
                playVideoOnly();
                return;
            }
            
            requestFullscreen(demoVideo)
                .then(() => {
                    demoVideo.play().catch(playError => {
                        playVideoOnly();
                    });
                })
                .catch(error => {
                    playVideoOnly();
                    
                    if (fullscreenError) {
                        fullscreenError.textContent = 'No se pudo activar pantalla completa. Toca directamente el video.';
                        fullscreenError.classList.add('show');
                    }
                })
                .finally(() => {
                    setTimeout(() => {
                        fullscreenBtn.classList.remove('btn-active');
                    }, 300);
                });
        }
        
        function playVideoOnly() {
            demoVideo.play().catch(e => {
                console.warn('No se pudo reproducir el video automáticamente');
            });
            
            demoVideo.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
            });
        }
        
        function updateFullscreenButtonState(isFullscreen) {
            if (fullscreenBtn) {
                fullscreenBtn.setAttribute('aria-pressed', !!isFullscreen);
                const iconElement = fullscreenBtn.querySelector('i');
                if (iconElement) {
                    iconElement.className = isFullscreen ? 'fas fa-compress' : 'fas fa-expand';
                }
            }
            
            if (videoOverlay) {
                const overlayIcon = videoOverlay.querySelector('i');
                if (overlayIcon) {
                    overlayIcon.className = isFullscreen ? 'fas fa-compress' : 'fas fa-expand';
                }
            }
        }
        
        function handleFullscreenChange() {
            const isFullscreen = document.fullscreenElement || 
                                document.webkitFullscreenElement || 
                                document.mozFullScreenElement || 
                                document.msFullscreenElement;
            
            updateFullscreenButtonState(isFullscreen);
        }
        
        function initPictureInPicture() {
            if (!isPipSupported) {
                pipBtn.style.display = 'none';
                return;
            }
            
            pipBtn.addEventListener('click', function() {
                if (document.pictureInPictureElement !== demoVideo) {
                    demoVideo.requestPictureInPicture()
                        .then(() => {
                            demoVideo.play().catch(e => {});
                        })
                        .catch(error => {
                            console.warn('Error al activar Picture-in-Picture');
                        });
                } else {
                    document.exitPictureInPicture()
                        .catch(e => {});
                }
            });
            
            demoVideo.addEventListener('enterpictureinpicture', function() {
                pipBtn.innerHTML = '<i class="fas fa-compress-alt"></i> Salir de Picture-in-Picture';
            });
            
            demoVideo.addEventListener('leavepictureinpicture', function() {
                pipBtn.innerHTML = '<i class="fas fa-external-link-alt"></i> Picture-in-Picture';
            });
        }
        
        function initVideoGestures() {
            let lastTap = 0;
            let touchStartY = 0;
            let touchStartX = 0;
            
            demoVideo.addEventListener('touchend', function(e) {
                const currentTime = new Date().getTime();
                const tapLength = currentTime - lastTap;
                
                if (tapLength < 500 && tapLength > 0) {
                    requestFullscreen(this).catch(e => {});
                    e.preventDefault();
                }
                
                lastTap = currentTime;
            });
            
            demoVideo.addEventListener('touchstart', function(e) {
                touchStartY = e.touches[0].clientY;
                touchStartX = e.touches[0].clientX;
            });
            
            demoVideo.addEventListener('touchmove', function(e) {
                if (e.touches.length === 1) {
                    const touchY = e.touches[0].clientY;
                    const touchX = e.touches[0].clientX;
                    const diffY = touchStartY - touchY;
                    const diffX = touchStartX - touchX;
                    
                    if (Math.abs(diffY) > Math.abs(diffX) && Math.abs(diffY) > 30) {
                        this.volume = Math.max(0, Math.min(1, this.volume + (diffY > 0 ? 0.1 : -0.1)));
                        touchStartY = touchY;
                        e.preventDefault();
                    }
                }
            });
        }
        
        if (fullscreenBtn) {
            addEventToAll([fullscreenBtn], ['click', 'touchend'], handleFullscreenRequest);
        }
        
        if (videoOverlay) {
            addEventToAll([videoOverlay], ['click', 'touchend'], handleFullscreenRequest);
        }
        
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
        document.addEventListener('mozfullscreenchange', handleFullscreenChange);
        document.addEventListener('MSFullscreenChange', handleFullscreenChange);
        
        initPictureInPicture();
        initVideoGestures();
        
        if (!isFullscreenSupported) {
            if (fullscreenBtn) {
                fullscreenBtn.innerHTML = '<i class="fas fa-play"></i> Reproducir video';
            }
        }
    }
    
    function initResponsiveAdjustments() {
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
        };
        
        window.addEventListener('resize', adjustOrientations);
        adjustOrientations();
    }
});
