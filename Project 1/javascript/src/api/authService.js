import apiCall from './apiService';

const MOCK_USERS_DATA = [
    { id: 1, firstName: "Alice", lastName: "Smith", email: "alice@example.com", password: "password123", age: 25 },
    { id: 2, firstName: "Bob", lastName: "Johnson", email: "bob@example.com", password: "password123", age: 30 },
    { id: 3, firstName: "Charlie", lastName: "Brown", email: "charlie@example.com", password: "password123", age: 12 } // Charlie is under 13
];

// Helper to generate a mock token
const generateMockToken = (user) => {
    return `mock-jwt-for-${user.email}-${Date.now()}`;
};

/**
 * Simulates user login.
 * In a real app, this would involve sending credentials to the backend
 * and receiving a JWT.
 * @param {string} email - The user's email.
 * @param {string} password - The user's password.
 * @returns {Promise<{token: string, user: object}>} - The authentication token and user data.
 * @throws {Error} If login fails.
 */
export const login = async (email, password) => {
    // Simulate API call for login
    const user = MOCK_USERS_DATA.find(u => u.email === email && u.password === password);

    if (user) {
        const token = generateMockToken(user);
        // Store token and user data in local storage
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        return { token, user };
    } else {
        throw new Error('Invalid email or password');
    }
};

/**
 * Simulates user registration.
 * In a real app, this would involve sending new user details to the backend.
 * @param {string} first - User's first name.
 * @param {string} last - User's last name.
 * @param {string} email - User's email.
 * @param {string} pass - User's password.
 * @returns {Promise<{token: string, user: object}>} - The authentication token and new user data.
 * @throws {Error} If registration fails.
 */
export const register = async (first, last, email, pass) => {
    // In a real app, you would send this to the backend:
    // const newUserFromBackend = await apiCall('/register', 'POST', { firstName: first, lastName: last, email, password: pass });

    // Simulate adding a new user to our mock data
    const newUser = {
        id: MOCK_USERS_DATA.length + 1, // Simple ID generation
        firstName: first,
        lastName: last,
        email: email,
        password: pass, // In a real app, NEVER store plain passwords!
        age: 20 // Default age for new registrations, can be adjusted
    };
    MOCK_USERS_DATA.push(newUser); // Add to mock users array

    const token = generateMockToken(newUser);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(newUser));
    return { token, user: newUser };
};

/**
 * Logs out the current user by removing data from local storage.
 */
export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
};

/**
 * Retrieves the current logged-in user's data from local storage.
 * @returns {object|null} The user object if logged in, otherwise null.
 */
export const getCurrentUser = () => {
    try {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    } catch (error) {
        console.error("Error parsing user from local storage:", error);
        return null;
    }
};
