/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '@/components/ui/button';

describe('Button', () => {
  it('renders a non-submitting button by default and handles clicks', async () => {
    // Arrange
    const onClick = jest.fn();
    render(<Button onClick={onClick}>Save</Button>);
    const button = screen.getByRole('button', { name: 'Save' });

    // Act
    await userEvent.click(button);

    // Assert
    expect(button).toHaveAttribute('type', 'button');
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('renders a submit button when requested', () => {
    // Act
    render(<Button submit>Send</Button>);

    // Assert
    expect(screen.getByRole('button', { name: 'Send' })).toHaveAttribute('type', 'submit');
  });

  it('merges custom classes with the variant classes', () => {
    // Act
    render(
      <Button variant="secondary" className="w-full">
        Cancel
      </Button>,
    );

    // Assert
    const button = screen.getByRole('button', { name: 'Cancel' });
    expect(button).toHaveClass('w-full');
    expect(button).toHaveClass('border');
  });
});
