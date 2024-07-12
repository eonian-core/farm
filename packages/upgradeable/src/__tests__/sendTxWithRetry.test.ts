import { retryOnFailure } from '../sendTxWithRetry';

describe('retryOnFailure', () => {
  it('should retry the action and eventually throw an error', async () => {
    const mockAction = jest.fn();
    mockAction.mockImplementation(() => {
      throw new Error('Test error');
    });

    await expect(retryOnFailure(3, 1000, mockAction)).rejects.toThrow('Test error');
    expect(mockAction).toHaveBeenCalledTimes(3);
  });

  it('should return the result of the action if it succeeds', async () => {
    const mockAction = jest.fn();
    mockAction.mockImplementation(() => 'Test result');

    const result = await retryOnFailure(3, 1000, mockAction);
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

    const result = await retryOnFailure(3, 1000, mockAction);
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

    const result = await retryOnFailure(5, 1000, mockAction);
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

    await expect(retryOnFailure(4, 1000, mockAction)).rejects.toThrow('Test error');
    expect(mockAction).toHaveBeenCalledTimes(4);
  });
});