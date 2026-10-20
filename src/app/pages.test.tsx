/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ErrorPage from '@/app/error';
import NotFoundPage from '@/app/not-found';
import HomePage from '@/app/page';

describe('HomePage', () => {
  it('shows the product promise as the main heading', () => {
    // Act
    render(<HomePage />);

    // Assert
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'One wedding. One shared plan. Everyone coordinated.',
    );
  });
});

describe('ErrorPage', () => {
  it('shows a generic message and the reference digest, never the error message', () => {
    // Arrange
    const error = Object.assign(new Error('secret internal detail'), { digest: 'abc123' });

    // Act
    render(<ErrorPage error={error} reset={jest.fn()} />);

    // Assert
    expect(screen.getByRole('heading', { name: 'Something went wrong' })).toBeInTheDocument();
    expect(screen.getByText('Reference: abc123')).toBeInTheDocument();
    expect(screen.queryByText(/secret internal detail/)).not.toBeInTheDocument();
  });

  it('omits the reference line when there is no digest and retries on click', async () => {
    // Arrange
    const reset = jest.fn();
    render(<ErrorPage error={new Error('boom')} reset={reset} />);

    // Act
    await userEvent.click(screen.getByRole('button', { name: 'Try again' }));

    // Assert
    expect(screen.queryByText(/Reference:/)).not.toBeInTheDocument();
    expect(reset).toHaveBeenCalledTimes(1);
  });
});

describe('NotFoundPage', () => {
  it('links back to the home page', () => {
    // Act
    render(<NotFoundPage />);

    // Assert
    expect(screen.getByRole('link', { name: 'Go to the home page' })).toHaveAttribute('href', '/');
  });
});
