import { retryOnFailure } from '../sendTxWithRetry';

const mockLogger: Console = {
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
} as any

describe('retryOnFailure', () => {
  it('should retry the action and eventually throw an error', async () => {
    const mockAction = jest.fn();
    mockAction.mockImplementation(() => {
      throw new Error('Test error');
    });

    await expect(retryOnFailure({retries: 3, delay: 1000, logger: mockLogger}, mockAction)).rejects.toThrow('Test error');
    expect(mockAction).toHaveBeenCalledTimes(3);
  });

  it('should return the result of the action if it succeeds', async () => {
    const mockAction = jest.fn();
    mockAction.mockImplementation(() => 'Test result');

    const result = await retryOnFailure({retries: 3, delay: 1000, logger: mockLogger}, mockAction);
    expect(result).toBe('Test result');
    expect(mockAction).toHaveBeenCalledTimes(1);
  });

  it('should succeed on the third try', async () => {
    let callCount = 0;
    const mockAction = jest.fn().mockImplementation(() => {
      callCount++;
      if (callCount < 3) {
        throw new Error('Test error');
      } else {
        return 'Test result';
      }
    });

    const result = await retryOnFailure({retries: 3, delay: 1000, logger: mockLogger}, mockAction);
    expect(result).toBe('Test result');
    expect(mockAction).toHaveBeenCalledTimes(3);
  });

  it('should succeed on the third try with available 5 retries', async () => {
    let callCount = 0;
    const mockAction = jest.fn().mockImplementation(() => {
      callCount++;
      if (callCount < 3) {
        throw new Error('Test error');
      } else {
        return 'Test result';
      }
    });

    const result = await retryOnFailure({retries: 5, delay: 1000, logger: mockLogger}, mockAction);
    expect(result).toBe('Test result');
    expect(mockAction).toHaveBeenCalledTimes(3);
  });

  it('should fail on 4 retry before succseed on 5 try', async () => {
    let callCount = 0;
    const mockAction = jest.fn().mockImplementation(() => {
      callCount++;
      if (callCount < 5) {
        throw new Error('Test error');
      } else {
        return 'Test result';
      }
    });

    await expect(retryOnFailure({retries: 4, delay: 1000, logger: mockLogger}, mockAction)).rejects.toThrow('Test error');
    expect(mockAction).toHaveBeenCalledTimes(4);
  });
});