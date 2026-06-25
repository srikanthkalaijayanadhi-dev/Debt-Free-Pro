// ==========================================================================
// DEBT FREE PRO - Common UI Logic
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
    // 1. Check Authentication on protected pages
    checkAuth();

    // 2. Initialize Sidebar Mobile Toggle
    initSidebar();

    // 3. Initialize Theme
    initTheme();
});

const checkAuth = async () => {
    // Only check auth if we are not on login page
    if (window.location.pathname.includes('login.html') || window.location.pathname.endsWith('/')) {
        return;
    }

    if (!window.supabaseClient) {
        console.warn('Supabase not configured. Bypassing auth for UI development.');
        return;
    }

    const { data: { session } } = await window.supabaseClient.auth.getSession();
    
    if (!session) {
        window.location.href = 'login.html';
    } else {
        // Load User Name into Header
        const userNameEl = document.getElementById('userName');
        if (userNameEl) {
            userNameEl.textContent = session.user.user_metadata?.full_name || session.user.email.split('@')[0];
        }
    }
};

const initSidebar = () => {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const sidebar = document.querySelector('.sidebar');
    
    if (mobileMenuBtn && sidebar) {
        mobileMenuBtn.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });
    }

    // Set Active State
    const currentPath = window.location.pathname.split('/').pop() || 'dashboard.html';
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        }
    });
};

const initTheme = () => {
    const themeToggle = document.getElementById('themeToggle');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Check local storage
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        document.documentElement.setAttribute('data-theme', 'dark');
        if (themeToggle) themeToggle.checked = true;
    }

    if (themeToggle) {
        themeToggle.addEventListener('change', (e) => {
            if (e.target.checked) {
                document.documentElement.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
            } else {
                document.documentElement.removeAttribute('data-theme');
                localStorage.setItem('theme', 'light');
            }
        });
    }
};

const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(amount);
};

// Logout Function
window.logout = async () => {
    if (window.supabaseClient) {
        await window.supabaseClient.auth.signOut();
    }
    window.location.href = 'login.html';
};
