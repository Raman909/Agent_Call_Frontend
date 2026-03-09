import { createContext, useContext, useState, useEffect, ReactNode, useMemo, useCallback } from 'react';

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (token: string, user: User) => void;
    logout: () => void;
    isAuthenticated: boolean;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    // 1. Initialize state directly from localStorage. 
    // Since this is synchronous, we can start with isLoading: false.
    const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
    const [user, setUser] = useState<User | null>(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            try {
                return JSON.parse(savedUser);
            } catch {
                localStorage.removeItem('user'); // Clean up corrupt data
                return null;
            }
        }
        return null;
    });
    
    // Set to false initially because our state initialization above is synchronous
    const [isLoading, setIsLoading] = useState(false);

    const login = useCallback((newToken: string, newUser: User) => {
        setToken(newToken);
        setUser(newUser);
        localStorage.setItem('token', newToken);
        localStorage.setItem('user', JSON.stringify(newUser));
    }, []);

    const logout = useCallback(() => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }, []);

    useEffect(() => {
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'token' && !e.newValue) {
                logout();
            }
        };

        window.addEventListener('storage', handleStorageChange);
        
        // If you ever add an ASYNC check (like an API call to verify token),
        // you would set setIsLoading(false) here. 
        // For now, it's already handled by the initial state.

        return () => window.removeEventListener('storage', handleStorageChange);
    }, [logout]);

    const value = useMemo(() => ({
        user,
        token,
        login,
        logout,
        isAuthenticated: !!token,
        isLoading
    }), [user, token, isLoading, login, logout]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};