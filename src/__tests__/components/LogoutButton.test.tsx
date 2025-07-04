import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { signOut } from 'next-auth/react';
import LogoutButton from '@/components/LogoutButton';

const { expect, describe, it, beforeEach } = require('@jest/globals');

// Mock next-auth/react
jest.mock('next-auth/react', () => ({
  signOut: jest.fn(),
}));

describe('LogoutButton', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the sign out button correctly', () => {
    render(<LogoutButton />);

    const button = screen.getByRole('button', { name: 'Sign Out' });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('absolute top-4 right-4');
  });

  it('calls signOut with correct callback URL when clicked', async () => {
    const user = userEvent.setup();
    render(<LogoutButton />);

    const button = screen.getByRole('button', { name: 'Sign Out' });
    await user.click(button);

    expect(signOut).toHaveBeenCalledTimes(1);
    expect(signOut).toHaveBeenCalledWith({ callbackUrl: '/login' });
  });

  it('has outline variant styling', () => {
    render(<LogoutButton />);

    const button = screen.getByRole('button', { name: 'Sign Out' });
    // The button should have classes applied by the variant='outline' prop
    expect(button.className).toMatch(/outline/);
  });

  it('maintains positioning classes', () => {
    render(<LogoutButton />);

    const button = screen.getByRole('button', { name: 'Sign Out' });
    expect(button).toHaveClass('absolute');
    expect(button).toHaveClass('top-4');
    expect(button).toHaveClass('right-4');
  });

  it('does not call signOut without user interaction', () => {
    render(<LogoutButton />);

    expect(signOut).not.toHaveBeenCalled();
  });

  it('handles multiple clicks correctly', async () => {
    const user = userEvent.setup();
    render(<LogoutButton />);

    const button = screen.getByRole('button', { name: 'Sign Out' });
    
    // Click multiple times
    await user.click(button);
    await user.click(button);
    await user.click(button);

    expect(signOut).toHaveBeenCalledTimes(3);
    expect(signOut).toHaveBeenCalledWith({ callbackUrl: '/login' });
  });
});