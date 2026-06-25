// ==========================================================================
// DEBT FREE PRO - Database Interaction & Seeding
// ==========================================================================

const initDatabase = async () => {
    if (!window.supabaseClient) return;

    const { data: { session } } = await window.supabaseClient.auth.getSession();
    if (!session) return;

    const userId = session.user.id;

    try {
        // Check if loans exist to prevent double seeding
        const { data: loans, error: loansError } = await window.supabaseClient
            .from('loans')
            .select('id')
            .eq('user_id', userId)
            .limit(1);

        if (loansError) throw loansError;

        if (loans && loans.length === 0) {
            console.log('New account detected. Seeding initial data...');
            await seedInitialData(userId);
        }
    } catch (error) {
        console.error('Error checking database status:', error);
    }
};

const seedInitialData = async (userId) => {
    try {
        // 1. Upsert Profile
        await window.supabaseClient.from('profiles').upsert({
            id: userId,
            name: 'Srikanth',
            country: 'India',
            currency: 'INR',
            primary_goal: 'Become Debt Free',
            secondary_goal: 'Increase Monthly Cash Flow',
            status: 'Active',
            monthly_income: 0,
            monthly_available_profit: 0
        });

        // 2. Insert Loans
        const initialLoans = [
            { user_id: userId, name: 'Home Loan', type: 'monthly', category: 'Housing Loan', original_amount: 8000000, amount_paid: 1000000, outstanding_balance: 7000000, emi_amount: 0, priority: 'Very High', status: 'Active' },
            { user_id: userId, name: 'Gold Loan', type: 'monthly', category: 'Secured Loan', collateral: 'Gold Jewellery', original_amount: 900000, outstanding_balance: 900000, emi_amount: 0, priority: 'High', status: 'Active' },
            { user_id: userId, name: 'Father Finance Loan', type: 'monthly', original_amount: 140000, emi_amount: 14000, months_paid: 3, amount_paid: 42000, outstanding_balance: 98000, priority: 'High', status: 'Active' },
            { user_id: userId, name: 'Camera Loan', type: 'monthly', original_amount: 60000, down_payment: 16000, months_paid: 4, amount_paid: 24416, outstanding_balance: 30000, emi_amount: 6104, priority: 'Medium', status: 'Active' },
            { user_id: userId, name: 'Mother Personal Loan', type: 'monthly', original_amount: 180000, emi_amount: 6700, duration_months: 36, months_paid: 3, amount_paid: 20100, outstanding_balance: 159900, priority: 'Medium', status: 'Active' },
            { user_id: userId, name: 'BharatPe Daily Finance', type: 'daily', category: 'Daily Collection Loan', original_amount: 100000, amount_paid: 50000, outstanding_balance: 50000, emi_amount: 421, priority: 'High', status: 'Active' },
            { user_id: userId, name: 'Pandiyan Daily Finance', type: 'daily', category: 'Daily Collection Loan', original_amount: 276000, amount_paid: 72000, outstanding_balance: 204000, emi_amount: 1500, priority: 'Very High', status: 'Active' },
            { user_id: userId, name: 'Daily Finance ₹700', type: 'daily', category: 'Daily Collection Loan', original_amount: 70000, months_paid: 0, amount_paid: 2800, outstanding_balance: 67200, emi_amount: 700, priority: 'High', status: 'Active' },
            { user_id: userId, name: 'Daily Finance ₹1,000', type: 'daily', category: 'Daily Collection Loan', original_amount: 100000, amount_paid: 40000, outstanding_balance: 60000, emi_amount: 1000, priority: 'High', status: 'Active' }
        ];
        await window.supabaseClient.from('loans').insert(initialLoans);

        // 3. Insert Fixed Expenses (Bills)
        const initialExpenses = [
            { user_id: userId, category: 'Electricity', amount: 2000, notes: 'Monthly Bill', date: new Date().toISOString() },
            { user_id: userId, category: 'Mobile & Internet', amount: 2000, notes: 'Monthly Bill', date: new Date().toISOString() },
            { user_id: userId, category: 'Gas Cylinder', amount: 6500, notes: 'Monthly Bill', date: new Date().toISOString() },
            { user_id: userId, category: 'Daily Expenses', amount: 1750, notes: 'Average Daily Expense. Categories: Food, Fuel, Business, Travel, Personal', date: new Date().toISOString() }
        ];
        await window.supabaseClient.from('expenses').insert(initialExpenses);

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
