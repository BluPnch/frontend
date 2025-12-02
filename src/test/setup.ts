import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';
import React from 'react';

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
    })),
});

// Mock localStorage
const localStorageMock = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
    length: 0,
    key: vi.fn(),
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock sessionStorage
const sessionStorageMock = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
    length: 0,
    key: vi.fn(),
};
Object.defineProperty(window, 'sessionStorage', { value: sessionStorageMock });

// Mock console methods to reduce test noise
global.console = {
    ...console,
    log: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
    info: vi.fn(),
    debug: vi.fn(),
};

// Mock React Suspense
vi.mock('react', async () => {
    const actual = await vi.importActual('react');
    return {
        ...actual as any,
        Suspense: ({ children }: any) => children,
        lazy: (factory: any) => {
            const Component = vi.fn(() => {
                const [result, setResult] = React.useState<any>(null);

                React.useEffect(() => {
                    factory().then((module: any) => {
                        setResult(module.default || module);
                    });
                }, []);

                return result ? React.createElement(result) : null;
            });

            Component.displayName = 'MockLazyComponent';
            return Component;
        },
    };
});

// Mock window.scrollTo
window.scrollTo = vi.fn();

// Reset mocks before each test
beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    sessionStorage.clear();

    // Reset localStorage mock implementation
    (localStorage.getItem as any).mockImplementation((key: string) => {
        return localStorageMock[key] || null;
    });

    (localStorage.setItem as any).mockImplementation((key: string, value: string) => {
        localStorageMock[key] = value;
    });

    (localStorage.removeItem as any).mockImplementation((key: string) => {
        delete localStorageMock[key];
    });

    (localStorage.clear as any).mockImplementation(() => {
        Object.keys(localStorageMock).forEach(key => {
            if (!['getItem', 'setItem', 'removeItem', 'clear', 'length', 'key'].includes(key)) {
                delete localStorageMock[key];
            }
        });
    });
});

// Clean up after all tests
afterAll(() => {
    vi.restoreAllMocks();
});