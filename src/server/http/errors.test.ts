import {
  AppError,
  ConflictError,
  ErrorCode,
  ForbiddenError,
  NotFoundError,
  UnauthenticatedError,
  ValidationError,
} from '@/server/http/errors';

describe('AppError subclasses', () => {
  it.each([
    [new ValidationError(), ErrorCode.VALIDATION_ERROR, 400],
    [new UnauthenticatedError(), ErrorCode.UNAUTHENTICATED, 401],
    [new ForbiddenError(), ErrorCode.FORBIDDEN, 403],
    [new NotFoundError(), ErrorCode.NOT_FOUND, 404],
    [new ConflictError(), ErrorCode.CONFLICT, 409],
  ])('%s maps to %s / %i with a default message', (error, code, status) => {
    // Arrange: error constructed in the table

    // Act
    const { code: actualCode, status: actualStatus, message } = error;

    // Assert
    expect(error).toBeInstanceOf(AppError);
    expect(actualCode).toBe(code);
    expect(actualStatus).toBe(status);
    expect(message.length).toBeGreaterThan(0);
  });

  it('keeps a custom message, details and the subclass name', () => {
    // Arrange
    const details = { fieldErrors: { name: ['Required'] } };

    // Act
    const error = new ValidationError('Name is required.', details);

    // Assert
    expect(error.message).toBe('Name is required.');
    expect(error.details).toBe(details);
    expect(error.name).toBe('ValidationError');
  });
});
