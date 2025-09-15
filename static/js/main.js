// 导航栏滚动效果
function initNavbarScroll() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('bg-white/90', 'backdrop-blur-sm', 'shadow-md');
            navbar.classList.remove('bg-transparent');
        } else {
            navbar.classList.remove('bg-white/90', 'backdrop-blur-sm', 'shadow-md');
            navbar.classList.add('bg-transparent');
        }
    });
}

// 移动端菜单
function initMobileMenu() {
    const menuBtn = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (!menuBtn || !mobileMenu) return;
    
    const mobileLinks = mobileMenu.querySelectorAll('a');
    
    menuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
        menuBtn.querySelector('i').classList.toggle('fa-bars');
        menuBtn.querySelector('i').classList.toggle('fa-times');
    });
    
    // 点击链接后关闭菜单
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
            menuBtn.querySelector('i').classList.add('fa-bars');
            menuBtn.querySelector('i').classList.remove('fa-times');
        });
    });
}

// 滚动动画
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('section-visible');
                entry.target.classList.remove('section-fade');
            }
        });
    }, {
        threshold: 0.1
    });
    
    document.querySelectorAll('.section-fade').forEach(element => {
        observer.observe(element);
    });
}

// 平滑滚动
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
}

// 初始化所有页面功能
function initPage() {
    initNavbarScroll();
    initMobileMenu();
    initScrollAnimations();
    initSmoothScroll();
    
    // 初始化所有Canvas
    window.addEventListener('load', () => {
        // 检查canvas元素是否存在，然后初始化对应的函数
        const canvasElements = {
            'introCanvas': initIntroCanvas,
            'derivativeCanvas': initDerivativeCanvas,
            'integralCanvas': initIntegralCanvas,
            'fundamentalTheoremCanvas': initFundamentalTheoremCanvas,
            'physicsCanvas': initPhysicsCanvas,
            'economicsCanvas': initEconomicsCanvas,
            'engineeringCanvas': initEngineeringCanvas,
            'televisionCanvas': initTelevisionCanvas
        };
        
        for (const [canvasId, initFunction] of Object.entries(canvasElements)) {
            const canvas = document.getElementById(canvasId);
            if (canvas && typeof initFunction === 'function') {
                initFunction();
            }
        }
    });
}

// 页面加载完成后初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPage);
} else {
    initPage();
}