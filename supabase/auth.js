// ==========================================================================
// DEBT FREE PRO - Authentication Logic
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const loginBtn = document.getElementById('loginBtn');
    const googleLoginBtn = document.getElementById('googleLoginBtn');
    const toggleAuthMode = document.getElementById('toggleAuthMode');
    const authMessage = document.getElementById('authMessage');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');

    let isLoginMode = true;

    // Toggle between Login and Sign Up
    if (toggleAuthMode) {
        toggleAuthMode.addEventListener('click', (e) => {
            e.preventDefault();
            isLoginMode = !isLoginMode;
            
            if (isLoginMode) {
                loginBtn.textContent = 'Sign In';
                toggleAuthMode.innerHTML = 'Sign Up';
                toggleAuthMode.previousSibling.textContent = "Don't have an account? ";
            } else {
                loginBtn.textContent = 'Create Account';
                toggleAuthMode.innerHTML = 'Sign In';
                toggleAuthMode.previousSibling.textContent = "Already have an account? ";
            }
            
            authMessage.style.display = 'none';
        });
    }

    // Show Message Helper
    const showMessage = (msg, isError = true) => {
        authMessage.textContent = msg;
        authMessage.style.color = isError ? 'var(--danger)' : 'var(--secondary)';
        authMessage.style.display = 'block';
    };

    // Handle Form Submit (Email / Password)
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            if (!window.supabaseClient) {
                showMessage('Supabase is not configured yet.');
                return;
            }

            const email = emailInput.value;
            const password = passwordInput.value;
            
            const originalBtnText = loginBtn.textContent;
            loginBtn.textContent = 'Processing...';
            loginBtn.disabled = true;

            try {
                if (isLoginMode) {
                    // Sign In
                    const { data, error } = await window.supabaseClient.auth.signInWithPassword({
                        email: email,
                        password: password,
                    });

                    if (error) throw error;
                    
                    window.location.href = 'dashboard.html';
                } else {
                    // Sign Up
                    const { data, error } = await window.supabaseClient.auth.signUp({
                        email: email,
                        password: password,
                    });

                    if (error) throw error;
                    
                    showMessage('Success! Please check your email to verify your account.', false);
                }
            } catch (error) {
                showMessage(error.message);
            } finally {
                loginBtn.textContent = originalBtnText;
                loginBtn.disabled = false;
            }
        });
    }

    // Handle Google Login
    if (googleLoginBtn) {
        googleLoginBtn.addEventListener('click', async () => {
            if (!window.supabaseClient) {
                showMessage('Supabase is not configured yet.');
                return;
            }

            try {
                const { data, error } = await window.supabaseClient.auth.signInWithOAuth({
                    provider: 'google',
                    options: {
                        redirectTo: window.location.origin + '/dashboard.html'
                    }
                });

                if (error) throw error;
            } catch (error) {
                showMessage(error.message);
            }
        });
    }

    // Check if user is already logged in
    const checkUserStatus = async () => {
        if (!window.supabaseClient) return;
        
        const { data: { session } } = await window.supabaseClient.auth.getSession();
        
        // If we are on the login page but already logged in, redirect to dashboard
        if (session && window.location.pathname.includes('login.html')) {
            window.location.href = 'dashboard.html';
        }
    };

    checkUserStatus();
});
