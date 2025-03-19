import { Context } from '../Context';
import { SafeAdapter, SafeWalletContainer, makeSafeApiKit } from '../SafeAdapter';
import { mockHre } from '../test-utils/mockHre';

// Mock all required dependencies
jest.mock('debug', () => jest.fn(() => jest.fn()));
jest.mock('@safe-global/api-kit');
jest.mock('@safe-global/protocol-kit');

describe('SafeAdapter', () => {
  // Define test variables
  const SAFE_WALLET_ADDRESS = '0xSafeWalletAddress';
  const SIGNER_ADDRESS = '0xSignerAddress';
  const ENCODED_DATA = '0xEncodedFunctionData';
  const TX_HASH = '0xTxHash';
  const SIGNATURE_DATA = '0xMockSignatureData';
  const TARGET_ADDRESS = '0xTargetContractAddress';
  const NEXT_NONCE = 42;

  // Set up mocks
  let mockContext: Context;
  let mockSafeApiKit: any;
  let mockSafeWallet: any;
  let mockSigner: any;
  let mockContract: any;
  let mockTx: any;
  let mockSignature: any;
  let safeAdapter: SafeAdapter;
  let mockWalletContainer: SafeWalletContainer;
  
  beforeEach(async () => {
    // Reset all mocks
    jest.clearAllMocks();

    // Create mock context
    mockContext = new Context(await mockHre(), 'TestContract', 'test-deployment');

    // Set up mock safe api kit
    mockSafeApiKit = {
      getNextNonce: jest.fn().mockResolvedValue(NEXT_NONCE),
      proposeTransaction: jest.fn().mockResolvedValue({ safeTxHash: TX_HASH })
    };

    // Set up mock wallet
    mockSafeWallet = {
      getAddress: jest.fn().mockResolvedValue(SAFE_WALLET_ADDRESS),
      createTransaction: jest.fn(),
      getTransactionHash: jest.fn(),
      signTransaction: jest.fn()
    };

    // Set up mock wallet container
    mockWalletContainer = {
      address: SAFE_WALLET_ADDRESS,
      getWallet: jest.fn().mockResolvedValue(mockSafeWallet)
    };

    // Set up mock signer
    mockSigner = {
      getAddress: jest.fn().mockResolvedValue(SIGNER_ADDRESS)
    };

    // Set up mock contract
    mockContract = {
      interface: {
        encodeFunctionData: jest.fn().mockReturnValue(ENCODED_DATA)
      }
    };

    // Set up mock transaction
    mockTx = {
      data: {
        to: TARGET_ADDRESS,
        value: '0',
        data: ENCODED_DATA
      }
    };

    // Set up mock signature
    mockSignature = {
      getSignature: jest.fn()
    };

    // Create the SafeAdapter instance
    safeAdapter = new SafeAdapter(mockContext, mockSafeApiKit, mockWalletContainer);
  });

  describe('constructor', () => {
    it('should initialize with the correct properties', () => {
      expect(safeAdapter.walletAddress).toBe(SAFE_WALLET_ADDRESS);
    });
  });

  describe('getSafeWallet', () => {
    it('should return the signer address and wallet correctly', async () => {
      // Act
      const result = await safeAdapter.getSafeWallet(mockSigner);

      // Assert
      expect(mockSigner.getAddress).toHaveBeenCalled();
      expect(mockWalletContainer.getWallet).toHaveBeenCalled();
      expect(result).toEqual({
        signerAddress: SIGNER_ADDRESS,
        wallet: mockSafeWallet
      });
    });

    it('should handle errors when getting signer address fails', async () => {
      // Arrange
      mockSigner.getAddress.mockRejectedValue(new Error('Failed to get address'));

      // Act & Assert
      await expect(
        safeAdapter.getSafeWallet(mockSigner)
      ).rejects.toThrow('Failed to get address');
    });

    it('should handle errors when wallet generation fails', async () => {
      // Arrange - Get a fresh mockWalletContainer for this test
      const errorMockWalletContainer: SafeWalletContainer = {
        address: SAFE_WALLET_ADDRESS,
        getWallet: jest.fn().mockRejectedValue(new Error('Wallet generation failed'))
      };
      
      // Create a fresh adapter with the error-throwing wallet container
      const errorAdapter = new SafeAdapter(mockContext, mockSafeApiKit, errorMockWalletContainer);

      // Act & Assert
      await expect(
        errorAdapter.getSafeWallet(mockSigner)
      ).rejects.toThrow('Wallet generation failed');
    });
  });

  describe('proposeTransaction', () => {
    
    it('should successfully propose a transaction', async () => {
      // Arrange
      mockSafeWallet.createTransaction.mockResolvedValue(mockTx);
      mockSafeWallet.getTransactionHash.mockResolvedValue(TX_HASH);
      
      mockSignature.getSignature.mockImplementation((address: string) => {
        if (address === SIGNER_ADDRESS) {
          return { data: SIGNATURE_DATA };
        }
        return null;
      });
      mockSafeWallet.signTransaction.mockResolvedValue(mockSignature);

      // Act
      const result = await safeAdapter.proposeTransaction(
        TARGET_ADDRESS,
        mockContract,
        'testFunction(uint256)',
        [123],
        mockSigner
      );

      // Assert
      expect(mockContract.interface.encodeFunctionData).toHaveBeenCalledWith('testFunction(uint256)', [123]);
      expect(mockSafeApiKit.getNextNonce).toHaveBeenCalledWith(SAFE_WALLET_ADDRESS);
      
      expect(mockSafeWallet.createTransaction).toHaveBeenCalledWith({
        transactions: [{
          to: TARGET_ADDRESS,
          value: '0',
          data: ENCODED_DATA
        }],
        options: {
          nonce: NEXT_NONCE
        }
      });
      
      expect(mockSafeWallet.getTransactionHash).toHaveBeenCalledWith(mockTx);
      expect(mockSafeWallet.signTransaction).toHaveBeenCalled();
      
      expect(mockSafeApiKit.proposeTransaction).toHaveBeenCalledWith({
        safeAddress: SAFE_WALLET_ADDRESS,
        safeTransactionData: mockTx.data,
        safeTxHash: TX_HASH,
        senderAddress: SIGNER_ADDRESS,
        senderSignature: SIGNATURE_DATA,
      });
      
      expect(result).toEqual({
        tx: mockTx,
        txData: ENCODED_DATA,
        txHash: TX_HASH
      });
    });

    it('should throw an error if signature data is not available', async () => {
      // Arrange
      mockSafeWallet.createTransaction.mockResolvedValue(mockTx);
      mockSafeWallet.getTransactionHash.mockResolvedValue(TX_HASH);
      
      // Mock the signature to always return null
      mockSignature.getSignature.mockReturnValue(null);
      mockSafeWallet.signTransaction.mockResolvedValue(mockSignature);

      // Act & Assert
      await expect(
        safeAdapter.proposeTransaction(
          TARGET_ADDRESS,
          mockContract,
          'testFunction(uint256)',
          [123],
          mockSigner
        )
      ).rejects.toThrow(`Failed to get signature for address: "${SIGNER_ADDRESS}"`);
    });
  });
}); 