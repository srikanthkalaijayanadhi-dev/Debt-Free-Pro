// ==========================================================================
// DEBT FREE PRO - Database Interaction & Seeding
// ==========================================================================

const initDatabase = async () => {
    if (!window.supabaseClient) return;

    const { data: { session } } = await window.supabaseClient.auth.getSession();
    if (!session) return;

    const userId = session.user.id;

    try {
        // Check if profile is already seeded
        const { data: profile, error: profileError } = await window.supabaseClient
            .from('profiles')
            .select('monthly_income')
            .eq('id', userId)
            .single();

        if (profileError) throw profileError;

        // If monthly_income is 0, we assume it's a new user and we need to seed
        if (profile && profile.monthly_income == 0) {
            console.log('New account detected. Seeding initial data...');
            await seedInitialData(userId);
        }
    } catch (error) {
        console.error('Error checking database status:', error);
    }
};

const seedInitialData = async (userId) => {
    try {
        // 1. Update Profile
        await window.supabaseClient.from('profiles').update({
            name: 'Srikanth',
            country: 'India',
            currency: 'INR',
            monthly_income: 250000,
            monthly_available_profit: 200000
        }).eq('id', userId);

        // 2. Insert Loans
        const initialLoans = [
            { user_id: userId, name: 'Home Loan', type: 'monthly', emi_amount: 135000, priority: 'High', status: 'Active' },
            { user_id: userId, name: 'Dad EMI', type: 'monthly', emi_amount: 14600, priority: 'High', status: 'Active' },
            { user_id: userId, name: 'Mom EMI', type: 'monthly', emi_amount: 6000, priority: 'Medium', status: 'Active' },
            { user_id: userId, name: 'My EMI', type: 'monthly', emi_amount: 6000, priority: 'Medium', status: 'Active' },
            { user_id: userId, name: 'Pandiyan Monthly Finance', type: 'monthly', emi_amount: 7500, priority: 'Medium', status: 'Active' },
            { user_id: userId, name: 'BharatPe', type: 'daily', emi_amount: 421, priority: 'High', status: 'Active' },
            { user_id: userId, name: 'Pandiyan Finance', type: 'daily', emi_amount: 1500, priority: 'High', status: 'Active' },
            { user_id: userId, name: 'Daily Finance 700', type: 'daily', emi_amount: 700, priority: 'Medium', status: 'Active' },
            { user_id: userId, name: 'Daily Finance 1000', type: 'daily', emi_amount: 1000, priority: 'Medium', status: 'Active' }
        ];
        await window.supabaseClient.from('loans').insert(initialLoans);

        // 3. Insert Fixed Expenses (Bills)
        const initialExpenses = [
            { user_id: userId, category: 'Electricity', amount: 2000, notes: 'Monthly Bill' },
            { user_id: userId, category: 'Gas', amount: 6500, notes: 'Monthly Bill' },
            { user_id: userId, category: 'Mobile & Internet', amount: 2000, notes: 'Monthly Bill' },
            { user_id: userId, category: 'Daily Expenses', amount: 1750, notes: 'Average Daily Expense' }
        ];
        await window.supabaseClient.from('expenses').insert(initialExpenses);

        // 4. Insert Goals
        const initialGoals = [
            { user_id: userId, name: 'Become Debt Free', status: 'In Progress' },
            { user_id: userId, name: 'Increase Savings', status: 'In Progress' },
            { user_id: userId, name: 'Emergency Fund', status: 'In Progress' },
            { user_id: userId, name: 'Business Growth', status: 'In Progress' }
        ];
        await window.supabaseClient.from('goals').insert(initialGoals);

        console.log('Seeding completed successfully!');
        
        // Refresh the page or update UI if on dashboard
        if (window.location.pathname.includes('dashboard.html')) {
            window.location.reload();
        }
        
    } catch (error) {
        console.error('Error seeding data:', error);
    }
};

// Run init when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Slight delay to ensure auth state is ready
    setTimeout(initDatabase, 1500);
});
