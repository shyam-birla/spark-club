module.exports = {
  createClient: jest.fn(() => ({
    fetch: jest.fn(),
  })),
};