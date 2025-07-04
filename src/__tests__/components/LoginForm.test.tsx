import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { getCsrfToken, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import LoginForm from '@/components/LoginForm';

const { expect, describe, it, beforeEach } = require('@jest/globals');

// Mock next-auth/react
jest.mock('next-auth/react', () => ({
  getCsrfToken: jest.fn(),
  signIn: jest.fn(),
}));

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('LoginForm', () => {
  const mockPush = jest.fn();
  const mockRefresh = jest.fn();
  const mockRouter = {
    push: mockPush,
    refresh: mockRefresh,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (getCsrfToken as jest.Mock).mockResolvedValue('test-csrf-token');
  });

  it('renders form fields correctly', () => {
    render(<LoginForm />);

    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign In' })).toBeInTheDocument();
  });

  it('fetches CSRF token on mount', async () => {
    render(<LoginForm />);

    await waitFor(() => {
      expect(getCsrfToken).toHaveBeenCalled();
    });
  });

  it('handles successful login', async () => {
    const user = userEvent.setup();
    (signIn as jest.Mock).mockResolvedValue({ error: null });

    render(<LoginForm />);

    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: 'Sign In' });

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);

    await waitFor(() => {
      expect(signIn).toHaveBeenCalledWith('credentials', {
        username: 'test@example.com',
        password: 'password123',
        csrfToken: 'test-csrf-token',
        redirect: false,
        callbackUrl: '/',
      });
      expect(mockPush).toHaveBeenCalledWith('/');
      expect(mockRefresh).toHaveBeenCalled();
    });
  });

  it('displays error message on invalid credentials', async () => {
    const user = userEvent.setup();
    (signIn as jest.Mock).mockResolvedValue({ error: 'CredentialsSignin' });

    render(<LoginForm />);

    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: 'Sign In' });

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'wrongpassword');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });

    expect(mockPush).not.toHaveBeenCalled();
    expect(mockRefresh).not.toHaveBeenCalled();
  });

  it('displays loading state during submission', async () => {
    const user = userEvent.setup();
    let resolveSignIn: (value: any) => void;
    const signInPromise = new Promise((resolve) => {
      resolveSignIn = resolve;
    });
    (signIn as jest.Mock).mockReturnValue(signInPromise);

    render(<LoginForm />);

    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: 'Sign In' });

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);

    expect(screen.getByRole('button', { name: 'Signing in...' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Signing in...' })).toBeDisabled();

    resolveSignIn!({ error: null });

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Sign In' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Sign In' })).not.toBeDisabled();
    });
  });

  it('handles network errors gracefully', async () => {
    const user = userEvent.setup();
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    (signIn as jest.Mock).mockRejectedValue(new Error('Network error'));

    render(<LoginForm />);

    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: 'Sign In' });

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('An error occurred')).toBeInTheDocument();
      expect(consoleErrorSpy).toHaveBeenCalledWith(expect.any(Error));
    });

    consoleErrorSpy.mockRestore();
  });

  it('includes CSRF token in form submission', async () => {
    const user = userEvent.setup();
    (getCsrfToken as jest.Mock).mockResolvedValue('unique-csrf-token');
    (signIn as jest.Mock).mockResolvedValue({ error: null });

    render(<LoginForm />);

    await waitFor(() => {
      const csrfInput = document.querySelector('input[name="csrfToken"]') as HTMLInputElement;
      expect(csrfInput.value).toBe('unique-csrf-token');
    });

    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: 'Sign In' });

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);

    await waitFor(() => {
      expect(signIn).toHaveBeenCalledWith('credentials', {
        username: 'test@example.com',
        password: 'password123',
        csrfToken: 'unique-csrf-token',
        redirect: false,
        callbackUrl: '/',
      });
    });
  });

  it('clears error message when resubmitting', async () => {
    const user = userEvent.setup();
    (signIn as jest.Mock)
      .mockResolvedValueOnce({ error: 'CredentialsSignin' })
      .mockResolvedValueOnce({ error: null });

    render(<LoginForm />);

    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: 'Sign In' });

    // First submission - should show error
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'wrongpassword');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });

    // Second submission - error should be cleared
    await user.clear(passwordInput);
    await user.type(passwordInput, 'correctpassword');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.queryByText('Invalid credentials')).not.toBeInTheDocument();
    });
  });

  it('handles missing CSRF token gracefully', async () => {
    const user = userEvent.setup();
    (getCsrfToken as jest.Mock).mockResolvedValue(null);
    (signIn as jest.Mock).mockResolvedValue({ error: null });

    render(<LoginForm />);

    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: 'Sign In' });

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);

    await waitFor(() => {
      expect(signIn).toHaveBeenCalledWith('credentials', {
        username: 'test@example.com',
        password: 'password123',
        csrfToken: '',
        redirect: false,
        callbackUrl: '/',
      });
    });
  });
});