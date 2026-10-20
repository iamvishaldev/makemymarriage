import { parseServerEnv } from '@/server/env';

describe('parseServerEnv', () => {
  it('applies defaults when optional variables are absent', () => {
    // Arrange
    const source = { APP_URL: 'https://example.com' };

    // Act
    const env = parseServerEnv(source);

    // Assert
    expect(env).toEqual({
      NODE_ENV: 'development',
      APP_URL: 'https://example.com',
      LOG_LEVEL: 'info',
    });
  });

  it('rejects invalid configuration, naming the variables without echoing their values', () => {
    // Arrange
    const source = { APP_URL: 'not-a-url-with-secret-value', LOG_LEVEL: 'loud' };

    // Act
    const parse = () => parseServerEnv(source);

    // Assert
    expect(parse).toThrow('Invalid environment configuration: APP_URL, LOG_LEVEL');
    expect(parse).not.toThrow(/secret-value/);
  });
});
