import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { Logger } from './Logger';

describe('Logger', () => {
  let hreMock: HardhatRuntimeEnvironment;
  let logger: Logger;

  beforeEach(() => {
    hreMock = {
      deployments: {
        log: jest.fn(),
      },
    } as any;
    logger = new Logger(hreMock);
  });

  describe('log', () => {
    it('should call the deployments log method with the provided arguments', () => {
      logger.log('Log message', 'arg1', 'arg2');

      expect(hreMock.deployments.log).toHaveBeenCalledWith('Log message', 'arg1', 'arg2');
    });
  });

  describe('warn', () => {
    it('should call the deployments log method with [WARN] prefix and the provided arguments', () => {
      logger.warn('Warning message', 'arg1', 'arg2');

      expect(hreMock.deployments.log).toHaveBeenCalledWith('[WARN]', 'Warning message', 'arg1', 'arg2');
    });
  });
});
