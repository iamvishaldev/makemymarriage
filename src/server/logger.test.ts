import { Writable } from 'node:stream';
import { createLogger } from '@/server/logger';

function captureLogger() {
  const lines: Record<string, unknown>[] = [];
  const destination = new Writable({
    write(chunk: Buffer, _encoding, callback) {
      lines.push(JSON.parse(chunk.toString()) as Record<string, unknown>);
      callback();
    },
  });
  return { log: createLogger('info', destination), lines };
}

describe('logger redaction', () => {
  it('redacts credentials and guest personal data at the top level', () => {
    // Arrange
    const { log, lines } = captureLogger();

    // Act
    log.info({ token: 'raw-token', email: 'a@b.com', phone: '+919999999999', guestId: 'g1' }, 'x');

    // Assert
    expect(lines[0]).toMatchObject({
      token: '[REDACTED]',
      email: '[REDACTED]',
      phone: '[REDACTED]',
      guestId: 'g1',
    });
  });

  it('redacts nested headers and guest fields', () => {
    // Arrange
    const { log, lines } = captureLogger();

    // Act
    log.info(
      {
        req: { headers: { authorization: 'Bearer abc', cookie: 'session=1', 'set-cookie': 'x' } },
        guest: { displayName: 'Asha', notes: 'allergies', dietaryNotes: 'vegan' },
      },
      'x',
    );

    // Assert
    const serialized = JSON.stringify(lines[0]);
    expect(serialized).not.toMatch(/Bearer abc|session=1|allergies|vegan/);
    expect(lines[0]).toMatchObject({
      req: { headers: { authorization: '[REDACTED]', 'set-cookie': '[REDACTED]' } },
      guest: { displayName: 'Asha', notes: '[REDACTED]' },
    });
  });

  it('includes the service name and an ISO timestamp', () => {
    // Arrange
    const { log, lines } = captureLogger();

    // Act
    log.info('hello');

    // Assert
    expect(lines[0]).toMatchObject({ service: 'make-my-marriage', msg: 'hello' });
    expect(lines[0]?.time).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });
});
