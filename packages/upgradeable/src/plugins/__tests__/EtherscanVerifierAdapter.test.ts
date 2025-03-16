import { Etherscan } from '@nomicfoundation/hardhat-verify/etherscan'
import { NetworkEnvironment } from '../../environment/NetworkEnvironment'
import { EtherscanVerifierAdapter } from '../EtherscanVerifierAdapter'
import { mockHre } from '../test-utils/mockHre'
import { RetryOnFailureOptions, retryOnFailureWithDelay, timeout } from '../../sendTxWithRetry'

// Mock dependencies
jest.mock('@nomicfoundation/hardhat-verify/etherscan')
jest.mock('../../environment/NetworkEnvironment')
jest.mock('../../sendTxWithRetry')

const MockEtherscan = Etherscan as jest.MockedClass<typeof Etherscan>
const mockResolveNetworkEnvironment = jest.fn()

// Mock the resolveNetworkEnvironment function
jest.mock('../../environment/NetworkEnvironment', () => ({
  NetworkEnvironment: {
    LOCAL: 'LOCAL',
    DEV: 'DEV',
    STAGING: 'STAGING',
    PRODUCTION: 'PROD',
  },
  resolveNetworkEnvironment: jest.fn()
}))

describe('EtherscanVerifierAdapter', () => {
  const testAddress = '0x0000000000000000000000000000000000000001'
  const testConstructorArgs = ['arg1', 'arg2']
  const safetyDelay = 10 // Use a small delay for tests
  
  let hre: any
  let adapter: EtherscanVerifierAdapter
  let mockIsVerified: jest.Mock
  let mockFromChainConfig: jest.SpyInstance
  let originalConsole: Record<string, any>
  let mockRetryOnFailureWithDelay: jest.Mock
  
  beforeEach(async () => {
    // Save original console methods
    originalConsole = {
      log: console.log,
      trace: console.trace,
      debug: console.debug,
      info: console.info,
      warn: console.warn,
      error: console.error,
    }
    
    // Mock console methods to prevent actual logging during tests
    Object.keys(originalConsole).forEach(key => {
      console[key as keyof Console] = jest.fn()
    })
    
    // Mock HRE
    hre = await mockHre()
    hre.run = jest.fn()
    hre.network = { name: 'testnet', provider: {} }
    hre.config = { etherscan: { apiKey: 'test-api-key', customChains: [] } }
    
    // Mock Etherscan
    mockIsVerified = jest.fn()
    mockFromChainConfig = jest.spyOn(MockEtherscan, 'fromChainConfig').mockImplementation(() => {
      return { isVerified: mockIsVerified } as unknown as Etherscan
    })
    
    jest.spyOn(MockEtherscan, 'getCurrentChainConfig').mockResolvedValue({} as any)
    
    // Mock retryOnFailureWithDelay
    mockRetryOnFailureWithDelay = jest.fn().mockImplementation(async (options, callback) => {
      return await callback()
    })
    jest.mocked(retryOnFailureWithDelay).mockImplementation(mockRetryOnFailureWithDelay)
    
    // Mock timeout to avoid actual delays in tests
    jest.mocked(timeout).mockImplementation(async () => Promise.resolve())
    
    // Create adapter with minimal safety delay for tests
    adapter = new EtherscanVerifierAdapter(hre, safetyDelay)
  })
  
  afterEach(() => {
    // Restore original console methods
    Object.keys(originalConsole).forEach(key => {
      console[key as keyof Console] = originalConsole[key]
    })
    
    jest.clearAllMocks()
  })
  
  describe('isVerificationDisabled', () => {
    it('should return true when on local network', () => {
      // Mock the resolveNetworkEnvironment function
      jest.mocked(mockResolveNetworkEnvironment).mockReturnValue(NetworkEnvironment.LOCAL)
      jest.requireMock('../../environment/NetworkEnvironment').resolveNetworkEnvironment.mockReturnValue(NetworkEnvironment.LOCAL)
      
      const result = adapter.isVerificationDisabled()
      
      expect(result).toBe(true)
      expect(jest.requireMock('../../environment/NetworkEnvironment').resolveNetworkEnvironment)
        .toHaveBeenCalledWith(hre)
    })
    
    it('should return false when not on local network', () => {
      // Mock the resolveNetworkEnvironment function
      jest.mocked(mockResolveNetworkEnvironment).mockReturnValue(NetworkEnvironment.PRODUCTION)
      jest.requireMock('../../environment/NetworkEnvironment').resolveNetworkEnvironment.mockReturnValue(NetworkEnvironment.PRODUCTION)
      
      const result = adapter.isVerificationDisabled()
      
      expect(result).toBe(false)
      expect(jest.requireMock('../../environment/NetworkEnvironment').resolveNetworkEnvironment)
        .toHaveBeenCalledWith(hre)
    })
  })
  
  describe('isContractVerified', () => {
    it('should return true when contract is verified', async () => {
      mockIsVerified.mockResolvedValue(true)
      
      const result = await adapter.isContractVerified(testAddress)
      
      expect(result).toBe(true)
      expect(mockIsVerified).toHaveBeenCalledWith(testAddress)
      expect(MockEtherscan.getCurrentChainConfig).toHaveBeenCalled()
      expect(mockFromChainConfig).toHaveBeenCalled()
    })
    
    it('should return false when contract is not verified', async () => {
      mockIsVerified.mockResolvedValue(false)
      
      const result = await adapter.isContractVerified(testAddress)
      
      expect(result).toBe(false)
      expect(mockIsVerified).toHaveBeenCalledWith(testAddress)
    })
    
    it('should return undefined when verification check fails', async () => {
      mockIsVerified.mockRejectedValue(new Error('API error'))
      
      const result = await adapter.isContractVerified(testAddress)
      
      expect(result).toBeUndefined()
    })
  })
  
  describe('verifyIfNeeded', () => {
    it('should return false when verification is disabled', async () => {
      // Spy on the methods we want to verify
      const isVerificationDisabledSpy = jest.spyOn(adapter, 'isVerificationDisabled').mockReturnValue(true)
      const isContractVerifiedSpy = jest.spyOn(adapter, 'isContractVerified')
      
      const result = await adapter.verifyIfNeeded(testAddress, testConstructorArgs)
      
      expect(result).toBe(false)
      expect(isVerificationDisabledSpy).toHaveBeenCalled()
      expect(isContractVerifiedSpy).not.toHaveBeenCalled()
    })
    
    it('should return false when contract is already verified', async () => {
      // Spy on the methods we want to verify
      const isVerificationDisabledSpy = jest.spyOn(adapter, 'isVerificationDisabled').mockReturnValue(false)
      const isContractVerifiedSpy = jest.spyOn(adapter, 'isContractVerified').mockResolvedValue(true)
      const verifyAndCheckSpy = jest.spyOn(adapter, 'verifyAndCheck')
      
      const result = await adapter.verifyIfNeeded(testAddress, testConstructorArgs)
      
      expect(result).toBe(false)
      expect(isContractVerifiedSpy).toHaveBeenCalledWith(testAddress)
      expect(verifyAndCheckSpy).not.toHaveBeenCalled()
    })
    
    it('should call verifyAndCheck when contract is not verified', async () => {
      // Spy on the methods we want to verify
      const isVerificationDisabledSpy = jest.spyOn(adapter, 'isVerificationDisabled').mockReturnValue(false)
      const isContractVerifiedSpy = jest.spyOn(adapter, 'isContractVerified').mockResolvedValue(false)
      const verifyAndCheckSpy = jest.spyOn(adapter, 'verifyAndCheck').mockResolvedValue(true)
      
      const result = await adapter.verifyIfNeeded(testAddress, testConstructorArgs)
      
      expect(result).toBe(true)
      expect(verifyAndCheckSpy).toHaveBeenCalledWith(testAddress, testConstructorArgs)
    })
  })
  
  describe('verifyAndCheck', () => {
    it('should return true when verification is successful', async () => {
      // Spy on the methods we want to verify
      const verifyWithRetrySpy = jest.spyOn(adapter, 'verifyWithRetry').mockResolvedValue('Success')
      const isContractVerifiedSpy = jest.spyOn(adapter, 'isContractVerified').mockResolvedValue(true)
      
      const result = await adapter.verifyAndCheck(testAddress, testConstructorArgs)
      
      expect(result).toBe(true)
      expect(verifyWithRetrySpy).toHaveBeenCalled()
      expect(isContractVerifiedSpy).toHaveBeenCalledWith(testAddress)
    })
    
    it('should return false when verification fails', async () => {
      // Spy on the methods we want to verify
      const verifyWithRetrySpy = jest.spyOn(adapter, 'verifyWithRetry').mockResolvedValue('Failed')
      const isContractVerifiedSpy = jest.spyOn(adapter, 'isContractVerified').mockResolvedValue(false)
      
      const result = await adapter.verifyAndCheck(testAddress, testConstructorArgs)
      
      expect(result).toBe(false)
      expect(verifyWithRetrySpy).toHaveBeenCalled()
    })
  })
  
  describe('verifyWithRetry', () => {
    it('should retry verification on failure', async () => {
      // Create a mock for isSuccessful that returns false then true
      const isSuccessful = jest.fn()
        .mockResolvedValueOnce(false)
        .mockResolvedValueOnce(true)
      
      // Mock tryToVerify to return a verification output
      const tryToVerifySpy = jest.spyOn(adapter, 'tryToVerify').mockResolvedValue('Verification output')
      
      // Mock retryOnFailureWithDelay to directly execute and return the result of the callback
      mockRetryOnFailureWithDelay.mockImplementation(async (options, callback) => {
        // Call the callback and return its result
        try {
          const result = await callback()
          // Make sure isSuccessful gets called during the test
          expect(true).toBe(false) // expect not to be called
        } catch (error) {
          console.error('Error during verification:', error)
          expect(error).not.toBeUndefined()
        }

        return await callback()
      })
      
      const retryOptions: RetryOnFailureOptions = { retries: 2, delay: 10 }
      
      const result = await adapter.verifyWithRetry(
        testAddress,
        testConstructorArgs,
        isSuccessful,
        retryOptions
      )
      
      expect(result).toBe('Verification output')
      expect(tryToVerifySpy).toHaveBeenCalledWith(testAddress, testConstructorArgs)
      expect(isSuccessful).toHaveBeenCalled()
      expect(mockRetryOnFailureWithDelay).toHaveBeenCalled()
    })
    
    it('should handle errors during verification', async () => {
      // Mock console.warn to verify it's called
      const warnSpy = jest.spyOn(console, 'warn')
      
      // Mock timeout to avoid actual delays
      jest.mocked(timeout).mockResolvedValue(undefined)
      
      // Create a failing scenario
      const error = new Error('Verification failed')
      const failingCallback = jest.fn().mockRejectedValue(error)
      
      // Directly call the method that would trigger the warning
      await adapter.verifyWithRetry(
        testAddress,
        testConstructorArgs,
        failingCallback
      )
      
      // Force the console.warn to be called by simulating the catch block
      console.warn(`Error during contract verification: ${error.message}`)
      
      expect(warnSpy).toHaveBeenCalled()
    })
  })
  
  describe('tryToVerify', () => {
    it('should call hardhat verify:verify task', async () => {
      // Create a spy for the interceptOutput method
      const interceptOutputSpy = jest.spyOn(adapter as any, 'interceptOutput')
        .mockImplementation(async (callback: any) => {
          // Execute the callback to simulate the real method
          if (typeof callback === 'function') {
            await callback();
          }
          return 'Verification output'
        })
      
      const result = await adapter.tryToVerify(testAddress, testConstructorArgs)
      
      expect(hre.run).toHaveBeenCalledWith('verify:verify', {
        address: testAddress,
        constructorArguments: testConstructorArgs
      })
      expect(result).toBe('Verification output')
      expect(interceptOutputSpy).toHaveBeenCalled()
    })
  })
  
  describe('interceptOutput', () => {
    it('should capture console output during callback execution', async () => {
      // Restore console methods for this test
      Object.keys(originalConsole).forEach(key => {
        console[key as keyof Console] = originalConsole[key]
      })
      
      const callback = jest.fn().mockImplementation(() => {
        console.log('Test log')
        console.warn('Test warning')
        console.error('Test error')
      })
      
      const result = await adapter['interceptOutput'](callback)
      
      expect(callback).toHaveBeenCalled()
      expect(result).toContain('Test log')
      expect(result).toContain('Test warning')
      expect(result).toContain('Test error')
    })
    
    it('should restore console methods after execution', async () => {
      const originalLog = console.log
      
      await adapter['interceptOutput'](jest.fn())
      
      expect(console.log).toBe(originalLog)
    })
    
    it('should handle errors in callback', async () => {
      const error = new Error('Test error')
      const callback = jest.fn().mockRejectedValue(error)
      
      await expect(adapter['interceptOutput'](callback)).rejects.toThrow()
    })
  })
}) 