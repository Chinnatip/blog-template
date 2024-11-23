import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { create } from 'zustand';
import UserPanel from '../UserPanel';
import { useAuthStore } from '@/lib/store';

// Mock Zustand store
jest.mock('@/lib/store', () => {
  const actualStore = jest.requireActual('zustand');
  return {
    ...actualStore,
    useAuthStore: jest.fn(),
  };
});

// Mock dependencies
const mockLogout = jest.fn();
const mockToggleParameter = jest.fn();
// const mockToggleUserMenu = jest.fn();

beforeEach(() => {
  jest.resetAllMocks();
  jest.mocked(require('@/lib/store').useAuthStore).mockImplementation(
    create(() => ({
      user: null,
      token: null,
      logout: mockLogout,
      toggleParameter: mockToggleParameter,
    }))
  );
});

describe('User Panel Component', () => {
    it('renders user information and user menu toggle when logged in', () => {
        jest.mocked(require('@/lib/store').useAuthStore).mockReturnValue({
          user: { id: 1, name: 'Test User', email: 'testuser@example.com' },
          token: 'mockToken',
          logout: mockLogout,
          toggleParameter: mockToggleParameter,
        });
    
        render(<UserPanel />);
    
        // Verify that the user's name is displayed
        expect(screen.getByText('Test User')).toBeInTheDocument();
    
        // Simulate user menu toggle
        fireEvent.click(screen.getByText('Test User'));
        expect(screen.getByRole('button', { name: /Logout/i })).toBeInTheDocument();
    
        // Click Logout in the user menu
        fireEvent.click(screen.getByRole('button', { name: /Logout/i }));
        expect(mockLogout).toHaveBeenCalledTimes(1);
    });

    it('renders nothing when no user is logged in', () => {
        jest.mocked(require('@/lib/store').useAuthStore).mockReturnValue({
        user: null,
        token: null,
        logout: jest.fn(),
        toggleParameter: jest.fn(),
        });

        render(<UserPanel />);

        // Ensure no user data or buttons are displayed
        expect(screen.queryByText(/T/)).not.toBeInTheDocument();
        expect(screen.queryByText(/Test User/)).not.toBeInTheDocument();
        expect(screen.queryByRole('button', { name: /Logout/i })).not.toBeInTheDocument();
    });

    // it('removes user information and displays "No user" after clicking logout', async () => {
    //     // Mock Zustand store
    // });
    
});