export default {
    setupFilesAfterEnv: ['./jest.setup.js'],
    testEnvironment: 'node',
    testEnvironmentOptions: {
        nodeEnvironment: 'test'
    },
    restoreMocks: true,
    collectCoverage: true,
    collectCoverageFrom: ['src/**/*.js'],
    coverageDirectory: 'coverage',
    coveragePathIgnorePatterns: ['node_modules', 'src/config', 'src/app.js', 'tests'],
    coverageReporters: ['text', 'lcov', 'html'],
};
