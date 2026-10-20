import { ErrorCode } from '@/server/http/errors';
import { errorBody, successBody } from '@/server/http/response';

const ISO_TIMESTAMP = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;

describe('successBody', () => {
  it('wraps data in the standard envelope', () => {
    // Arrange
    const data = { id: 'w1' };

    // Act
    const body = successBody(data, 'Created.');

    // Assert
    expect(body).toEqual({
      success: true,
      data,
      message: 'Created.',
      errorCode: null,
      timestamp: expect.stringMatching(ISO_TIMESTAMP),
    });
  });

  it('defaults the message to null', () => {
    // Act
    const body = successBody([]);

    // Assert
    expect(body.message).toBeNull();
  });
});

describe('errorBody', () => {
  it('builds a failure envelope with null data by default', () => {
    // Act
    const body = errorBody(ErrorCode.NOT_FOUND, 'Not found.');

    // Assert
    expect(body).toEqual({
      success: false,
      data: null,
      message: 'Not found.',
      errorCode: 'NOT_FOUND',
      timestamp: expect.stringMatching(ISO_TIMESTAMP),
    });
  });

  it('carries details in data', () => {
    // Arrange
    const details = { fieldErrors: { name: ['Required'] } };

    // Act
    const body = errorBody(ErrorCode.VALIDATION_ERROR, 'Invalid.', details);

    // Assert
    expect(body.data).toBe(details);
  });
});
