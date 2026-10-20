// Deterministic configuration for every test file; runs before any module is imported.
process.env.APP_URL ??= 'http://localhost:3000';
process.env.LOG_LEVEL = 'silent';
