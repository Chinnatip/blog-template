// components/AuthLogin.test.tsx
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { create } from 'zustand';
import Login from '../Login';
import Register from '../Register';

// Create a mock for Zustand's store
jest.mock('@/lib/store', () => {
  const actualStore = jest.requireActual('zustand');
  return {
    ...actualStore,
    useAuthStore: jest.fn(),
  };
});

// MockUp function
const mockLogin = jest.fn();
const mockRegister = jest.fn();

beforeEach(() => {
  // Reset all mocks before each test
  jest.resetAllMocks(); 
  jest.mocked(require('@/lib/store').useAuthStore).mockImplementation(
    create(() => ({
      user: null,
      token: null,
      login: mockLogin, // use mock login to test each login case
      register: mockRegister, // use mock register to test each register case
    }))
  );
});

describe('Login Component', () => {
  it('renders login form correctly', () => {
    render(<Login />);
    expect(screen.getByRole('heading', { name: 'Login' })).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
  });

  it('shows error message for invalid credentials', async () => {
    mockLogin.mockRejectedValue(new Error('Invalid credentials'));

    render(<Login />);

    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'invalid@example.com' },
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'wrongpassword' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Login' }));
    expect(mockLogin).toHaveBeenCalledWith('invalid@example.com', 'wrongpassword');
    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument()
    });
  });

  it('calls login function with valid credentials', async () => {
    mockLogin.mockResolvedValue({});

    render(<Login />);

    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'testuser@example.com' },
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'password123' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Login' }));

    expect(mockLogin).toHaveBeenCalledWith('testuser@example.com', 'password123');
    await waitFor(() =>
      expect(screen.queryByText('Invalid credentials')).not.toBeInTheDocument()
    );
  });
});

describe('Register Component', () => {
  it('renders the registration form correctly', () => {
    render(<Register />);

    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Submit Registration' })).toBeInTheDocument();
  });

  it('calls the register function with correct parameters', async () => {
    mockRegister.mockResolvedValueOnce({}); // Mock successful registration

    render(<Register />);

    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: 'Submit Registration' }));

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith('Test User', 'test@example.com', 'password123');
    });
  });

  it('shows success message on successful registration', async () => {
    mockRegister.mockResolvedValueOnce({}); // Mock successful registration

    render(<Register />);

    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: 'Submit Registration' }));

    await waitFor(() =>
      expect(screen.getByRole('status')).toHaveTextContent('Registration successful!')
    );
  });

  it('shows error message on registration failure', async () => {
    mockRegister.mockRejectedValueOnce(new Error('Registration failed')); // Mock failure

    render(<Register />);

    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'wrongpassword' } });
    fireEvent.click(screen.getByRole('button', { name: 'Submit Registration' }));

    await waitFor(() =>
      expect(screen.getByRole('alert')).toHaveTextContent('Registration failed')
    );
  });
});