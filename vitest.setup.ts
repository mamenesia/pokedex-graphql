import "@testing-library/jest-dom";
import { afterAll, beforeAll, beforeEach, vi } from "vitest";

// Mock localStorage for Zustand persistence tests
const localStorageMock = {
	getItem: vi.fn(),
	setItem: vi.fn(),
	removeItem: vi.fn(),
	clear: vi.fn(),
	length: 0,
	key: vi.fn(),
};

Object.defineProperty(window, "localStorage", {
	value: localStorageMock,
});

// Mock sessionStorage if needed
Object.defineProperty(window, "sessionStorage", {
	value: localStorageMock,
});

// Suppress React warnings during tests
const originalError = console.error;
beforeAll(() => {
	console.error = (...args: unknown[]) => {
		if (
			typeof args[0] === "string" &&
			(args[0].includes("Warning: ReactDOM.render is deprecated") ||
				args[0].includes("Warning: An invalid form control"))
		) {
			return;
		}
		originalError.call(console, ...args);
	};
});

afterAll(() => {
	console.error = originalError;
});

// Reset mocks before each test
beforeEach(() => {
	vi.clearAllMocks();
	localStorageMock.getItem.mockClear();
	localStorageMock.setItem.mockClear();
	localStorageMock.removeItem.mockClear();
	localStorageMock.clear.mockClear();
});
