export default {
  "56": [
    {
      "name": "bsc_mainnet_dev",
      "chainId": "56",
      "contracts": {
        "ApeLendingStrategy": {
          "address": "0xDD6356D8d474BF3ab92c165d2b6b2b4DB589c7D0",
          "abi": [
            {
              "anonymous": false,
              "inputs": [
                {
                  "indexed": false,
                  "internalType": "address",
                  "name": "previousAdmin",
                  "type": "address"
                },
                {
                  "indexed": false,
                  "internalType": "address",
                  "name": "newAdmin",
                  "type": "address"
                }
              ],
              "name": "AdminChanged",
              "type": "event"
            },
            {
              "anonymous": false,
              "inputs": [
                {
                  "indexed": true,
                  "internalType": "address",
                  "name": "beacon",
                  "type": "address"
                }
              ],
              "name": "BeaconUpgraded",
              "type": "event"
            },
            {
              "anonymous": false,
              "inputs": [
                {
                  "indexed": true,
                  "internalType": "address",
                  "name": "implementation",
                  "type": "address"
                }
              ],
              "name": "Upgraded",
              "type": "event"
            },
            {
              "stateMutability": "payable",
              "type": "fallback"
            },
            {
              "stateMutability": "payable",
              "type": "receive"
            },
            {
              "inputs": [],
              "name": "CallerIsNotAVault",
              "type": "error"
            },
            {
              "inputs": [],
              "name": "CannotWorkNow",
              "type": "error"
            },
            {
              "inputs": [],
              "name": "HealthCheckFailed",
              "type": "error"
            },
            {
              "inputs": [],
              "name": "IncompatibleCTokenContract",
              "type": "error"
            },
            {
              "inputs": [],
              "name": "IncompatiblePriceFeeds",
              "type": "error"
            },
            {
              "inputs": [
                {
                  "internalType": "uint256",
                  "name": "code",
                  "type": "uint256"
                }
              ],
              "name": "MintError",
              "type": "error"
            },
            {
              "inputs": [],
              "name": "PayableWorkNotAllowed",
              "type": "error"
            },
            {
              "inputs": [
                {
                  "internalType": "uint256",
                  "name": "code",
                  "type": "uint256"
                }
              ],
              "name": "RedeemError",
              "type": "error"
            },
            {
              "inputs": [
                {
                  "internalType": "uint256",
                  "name": "_givenTime",
                  "type": "uint256"
                }
              ],
              "name": "TimeMinimumBetweenExecutionsIncorrect",
              "type": "error"
            },
            {
              "inputs": [],
              "name": "UnsupportedDecimals",
              "type": "error"
            },
            {
              "anonymous": false,
              "inputs": [
                {
                  "indexed": false,
                  "internalType": "uint256",
                  "name": "debtThreshold",
                  "type": "uint256"
                }
              ],
              "name": "DebtThresholdUpdated",
              "type": "event"
            },
            {
              "anonymous": false,
              "inputs": [
                {
                  "indexed": false,
                  "internalType": "uint256",
                  "name": "estimatedWorkGas",
                  "type": "uint256"
                }
              ],
              "name": "EstimatedWorkGasUpdated",
              "type": "event"
            },
            {
              "anonymous": false,
              "inputs": [
                {
                  "indexed": false,
                  "internalType": "uint256",
                  "name": "profit",
                  "type": "uint256"
                },
                {
                  "indexed": false,
                  "internalType": "uint256",
                  "name": "loss",
                  "type": "uint256"
                },
                {
                  "indexed": false,
                  "internalType": "uint256",
                  "name": "debtPayment",
                  "type": "uint256"
                },
                {
                  "indexed": false,
                  "internalType": "uint256",
                  "name": "outstandingDebt",
                  "type": "uint256"
                }
              ],
              "name": "Harvested",
              "type": "event"
            },
            {
              "anonymous": false,
              "inputs": [
                {
                  "indexed": false,
                  "internalType": "address",
                  "name": "",
                  "type": "address"
                }
              ],
              "name": "HealthCheckChanged",
              "type": "event"
            },
            {
              "anonymous": false,
              "inputs": [
                {
                  "indexed": false,
                  "internalType": "bool",
                  "name": "",
                  "type": "bool"
                }
              ],
              "name": "HealthCheckEnabledChanged",
              "type": "event"
            },
            {
              "anonymous": false,
              "inputs": [
                {
                  "indexed": false,
                  "internalType": "uint8",
                  "name": "version",
                  "type": "uint8"
                }
              ],
              "name": "Initialized",
              "type": "event"
            },
            {
              "anonymous": false,
              "inputs": [
                {
                  "indexed": true,
                  "internalType": "address",
                  "name": "previousOwner",
                  "type": "address"
                },
                {
                  "indexed": true,
                  "internalType": "address",
                  "name": "newOwner",
                  "type": "address"
                }
              ],
              "name": "OwnershipTransferred",
              "type": "event"
            },
            {
              "anonymous": false,
              "inputs": [
                {
                  "indexed": false,
                  "internalType": "address",
                  "name": "account",
                  "type": "address"
                }
              ],
              "name": "Paused",
              "type": "event"
            },
            {
              "anonymous": false,
              "inputs": [
                {
                  "indexed": false,
                  "internalType": "address",
                  "name": "account",
                  "type": "address"
                }
              ],
              "name": "Unpaused",
              "type": "event"
            },
            {
              "anonymous": false,
              "inputs": [
                {
                  "indexed": false,
                  "internalType": "uint256",
                  "name": "profitFactor",
                  "type": "uint256"
                }
              ],
              "name": "UpdatedProfitFactor",
              "type": "event"
            },
            {
              "anonymous": false,
              "inputs": [
                {
                  "indexed": true,
                  "internalType": "address",
                  "name": "worker",
                  "type": "address"
                }
              ],
              "name": "Worked",
              "type": "event"
            },
            {
              "inputs": [],
              "name": "BANANA",
              "outputs": [
                {
                  "internalType": "address",
                  "name": "",
                  "type": "address"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "PANCAKE_ROUTER",
              "outputs": [
                {
                  "internalType": "address",
                  "name": "",
                  "type": "address"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "RAIN_MAKER",
              "outputs": [
                {
                  "internalType": "address",
                  "name": "",
                  "type": "address"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "WBNB",
              "outputs": [
                {
                  "internalType": "address",
                  "name": "",
                  "type": "address"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "asset",
              "outputs": [
                {
                  "internalType": "contract IERC20Upgradeable",
                  "name": "",
                  "type": "address"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "cToken",
              "outputs": [
                {
                  "internalType": "contract ICToken",
                  "name": "",
                  "type": "address"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "canWork",
              "outputs": [
                {
                  "internalType": "bool",
                  "name": "",
                  "type": "bool"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "checker",
              "outputs": [
                {
                  "internalType": "bool",
                  "name": "canExec",
                  "type": "bool"
                },
                {
                  "internalType": "bytes",
                  "name": "execPayload",
                  "type": "bytes"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "debtThreshold",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "depositedBalance",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "depositedBalanceSnapshot",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "estimatedTotalAssets",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "estimatedWorkGas",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "gelato",
              "outputs": [
                {
                  "internalType": "address payable",
                  "name": "",
                  "type": "address"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "healthCheck",
              "outputs": [
                {
                  "internalType": "contract IHealthCheck",
                  "name": "",
                  "type": "address"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "healthCheckEnabled",
              "outputs": [
                {
                  "internalType": "bool",
                  "name": "",
                  "type": "bool"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "_vault",
                  "type": "address"
                },
                {
                  "internalType": "address",
                  "name": "_cToken",
                  "type": "address"
                },
                {
                  "internalType": "address",
                  "name": "_ops",
                  "type": "address"
                },
                {
                  "internalType": "address",
                  "name": "_nativeTokenPriceFeed",
                  "type": "address"
                },
                {
                  "internalType": "address",
                  "name": "_assetPriceFeed",
                  "type": "address"
                },
                {
                  "internalType": "uint256",
                  "name": "_minReportInterval",
                  "type": "uint256"
                },
                {
                  "internalType": "bool",
                  "name": "_isPrepaid",
                  "type": "bool"
                }
              ],
              "name": "initialize",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "isPrepaid",
              "outputs": [
                {
                  "internalType": "bool",
                  "name": "",
                  "type": "bool"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "lastWorkTime",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "minBananaToSell",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "minimumBetweenExecutions",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "name",
              "outputs": [
                {
                  "internalType": "string",
                  "name": "",
                  "type": "string"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "ops",
              "outputs": [
                {
                  "internalType": "contract IOps",
                  "name": "",
                  "type": "address"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "owner",
              "outputs": [
                {
                  "internalType": "address",
                  "name": "",
                  "type": "address"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "pancakeRouter",
              "outputs": [
                {
                  "internalType": "contract IPancakeRouter",
                  "name": "",
                  "type": "address"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "paused",
              "outputs": [
                {
                  "internalType": "bool",
                  "name": "",
                  "type": "bool"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "payableWork",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "profitFactor",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "proxiableUUID",
              "outputs": [
                {
                  "internalType": "bytes32",
                  "name": "",
                  "type": "bytes32"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "rainMaker",
              "outputs": [
                {
                  "internalType": "contract IRainMaker",
                  "name": "",
                  "type": "address"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "renounceOwnership",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "uint256",
                  "name": "_debtThreshold",
                  "type": "uint256"
                }
              ],
              "name": "setDebtThreshold",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "uint256",
                  "name": "_estimatedWorkGas",
                  "type": "uint256"
                }
              ],
              "name": "setEstimatedWorkGas",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "_healthCheck",
                  "type": "address"
                }
              ],
              "name": "setHealthCheck",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "bool",
                  "name": "_healthCheckEnabled",
                  "type": "bool"
                }
              ],
              "name": "setHealthCheckEnabled",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "uint256",
                  "name": "_minBananaToSell",
                  "type": "uint256"
                }
              ],
              "name": "setMinBananaToSell",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "uint256",
                  "name": "_profitFactor",
                  "type": "uint256"
                }
              ],
              "name": "setProfitFactor",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "shutdown",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "timeFromLastExecution",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "newOwner",
                  "type": "address"
                }
              ],
              "name": "transferOwnership",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "newImplementation",
                  "type": "address"
                }
              ],
              "name": "upgradeTo",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "newImplementation",
                  "type": "address"
                },
                {
                  "internalType": "bytes",
                  "name": "data",
                  "type": "bytes"
                }
              ],
              "name": "upgradeToAndCall",
              "outputs": [],
              "stateMutability": "payable",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "vault",
              "outputs": [
                {
                  "internalType": "contract IVault",
                  "name": "",
                  "type": "address"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "version",
              "outputs": [
                {
                  "internalType": "string",
                  "name": "",
                  "type": "string"
                }
              ],
              "stateMutability": "pure",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "uint256",
                  "name": "assets",
                  "type": "uint256"
                }
              ],
              "name": "withdraw",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "loss",
                  "type": "uint256"
                }
              ],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "work",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "_logic",
                  "type": "address"
                },
                {
                  "internalType": "bytes",
                  "name": "_data",
                  "type": "bytes"
                }
              ],
              "stateMutability": "payable",
              "type": "constructor"
            }
          ]
        },
        "ApeLendingStrategy_Implementation": {
          "address": "0x2536d530221B5383e2E6AA1C0F05F84A79FD7579",
          "abi": [
            {
              "inputs": [
                {
                  "internalType": "bool",
                  "name": "needDisableInitializers",
                  "type": "bool"
                }
              ],
              "stateMutability": "nonpayable",
              "type": "constructor"
            },
            {
              "inputs": [],
              "name": "CallerIsNotAVault",
              "type": "error"
            },
            {
              "inputs": [],
              "name": "CannotWorkNow",
              "type": "error"
            },
            {
              "inputs": [],
              "name": "HealthCheckFailed",
              "type": "error"
            },
            {
              "inputs": [],
              "name": "IncompatibleCTokenContract",
              "type": "error"
            },
            {
              "inputs": [],
              "name": "IncompatiblePriceFeeds",
              "type": "error"
            },
            {
              "inputs": [
                {
                  "internalType": "uint256",
                  "name": "code",
                  "type": "uint256"
                }
              ],
              "name": "MintError",
              "type": "error"
            },
            {
              "inputs": [],
              "name": "PayableWorkNotAllowed",
              "type": "error"
            },
            {
              "inputs": [
                {
                  "internalType": "uint256",
                  "name": "code",
                  "type": "uint256"
                }
              ],
              "name": "RedeemError",
              "type": "error"
            },
            {
              "inputs": [
                {
                  "internalType": "uint256",
                  "name": "_givenTime",
                  "type": "uint256"
                }
              ],
              "name": "TimeMinimumBetweenExecutionsIncorrect",
              "type": "error"
            },
            {
              "inputs": [],
              "name": "UnsupportedDecimals",
              "type": "error"
            },
            {
              "anonymous": false,
              "inputs": [
                {
                  "indexed": false,
                  "internalType": "address",
                  "name": "previousAdmin",
                  "type": "address"
                },
                {
                  "indexed": false,
                  "internalType": "address",
                  "name": "newAdmin",
                  "type": "address"
                }
              ],
              "name": "AdminChanged",
              "type": "event"
            },
            {
              "anonymous": false,
              "inputs": [
                {
                  "indexed": true,
                  "internalType": "address",
                  "name": "beacon",
                  "type": "address"
                }
              ],
              "name": "BeaconUpgraded",
              "type": "event"
            },
            {
              "anonymous": false,
              "inputs": [
                {
                  "indexed": false,
                  "internalType": "uint256",
                  "name": "debtThreshold",
                  "type": "uint256"
                }
              ],
              "name": "DebtThresholdUpdated",
              "type": "event"
            },
            {
              "anonymous": false,
              "inputs": [
                {
                  "indexed": false,
                  "internalType": "uint256",
                  "name": "estimatedWorkGas",
                  "type": "uint256"
                }
              ],
              "name": "EstimatedWorkGasUpdated",
              "type": "event"
            },
            {
              "anonymous": false,
              "inputs": [
                {
                  "indexed": false,
                  "internalType": "uint256",
                  "name": "profit",
                  "type": "uint256"
                },
                {
                  "indexed": false,
                  "internalType": "uint256",
                  "name": "loss",
                  "type": "uint256"
                },
                {
                  "indexed": false,
                  "internalType": "uint256",
                  "name": "debtPayment",
                  "type": "uint256"
                },
                {
                  "indexed": false,
                  "internalType": "uint256",
                  "name": "outstandingDebt",
                  "type": "uint256"
                }
              ],
              "name": "Harvested",
              "type": "event"
            },
            {
              "anonymous": false,
              "inputs": [
                {
                  "indexed": false,
                  "internalType": "address",
                  "name": "",
                  "type": "address"
                }
              ],
              "name": "HealthCheckChanged",
              "type": "event"
            },
            {
              "anonymous": false,
              "inputs": [
                {
                  "indexed": false,
                  "internalType": "bool",
                  "name": "",
                  "type": "bool"
                }
              ],
              "name": "HealthCheckEnabledChanged",
              "type": "event"
            },
            {
              "anonymous": false,
              "inputs": [
                {
                  "indexed": false,
                  "internalType": "uint8",
                  "name": "version",
                  "type": "uint8"
                }
              ],
              "name": "Initialized",
              "type": "event"
            },
            {
              "anonymous": false,
              "inputs": [
                {
                  "indexed": true,
                  "internalType": "address",
                  "name": "previousOwner",
                  "type": "address"
                },
                {
                  "indexed": true,
                  "internalType": "address",
                  "name": "newOwner",
                  "type": "address"
                }
              ],
              "name": "OwnershipTransferred",
              "type": "event"
            },
            {
              "anonymous": false,
              "inputs": [
                {
                  "indexed": false,
                  "internalType": "address",
                  "name": "account",
                  "type": "address"
                }
              ],
              "name": "Paused",
              "type": "event"
            },
            {
              "anonymous": false,
              "inputs": [
                {
                  "indexed": false,
                  "internalType": "address",
                  "name": "account",
                  "type": "address"
                }
              ],
              "name": "Unpaused",
              "type": "event"
            },
            {
              "anonymous": false,
              "inputs": [
                {
                  "indexed": false,
                  "internalType": "uint256",
                  "name": "profitFactor",
                  "type": "uint256"
                }
              ],
              "name": "UpdatedProfitFactor",
              "type": "event"
            },
            {
              "anonymous": false,
              "inputs": [
                {
                  "indexed": true,
                  "internalType": "address",
                  "name": "implementation",
                  "type": "address"
                }
              ],
              "name": "Upgraded",
              "type": "event"
            },
            {
              "anonymous": false,
              "inputs": [
                {
                  "indexed": true,
                  "internalType": "address",
                  "name": "worker",
                  "type": "address"
                }
              ],
              "name": "Worked",
              "type": "event"
            },
            {
              "inputs": [],
              "name": "BANANA",
              "outputs": [
                {
                  "internalType": "address",
                  "name": "",
                  "type": "address"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "PANCAKE_ROUTER",
              "outputs": [
                {
                  "internalType": "address",
                  "name": "",
                  "type": "address"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "RAIN_MAKER",
              "outputs": [
                {
                  "internalType": "address",
                  "name": "",
                  "type": "address"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "WBNB",
              "outputs": [
                {
                  "internalType": "address",
                  "name": "",
                  "type": "address"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "asset",
              "outputs": [
                {
                  "internalType": "contract IERC20Upgradeable",
                  "name": "",
                  "type": "address"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "cToken",
              "outputs": [
                {
                  "internalType": "contract ICToken",
                  "name": "",
                  "type": "address"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "canWork",
              "outputs": [
                {
                  "internalType": "bool",
                  "name": "",
                  "type": "bool"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "checker",
              "outputs": [
                {
                  "internalType": "bool",
                  "name": "canExec",
                  "type": "bool"
                },
                {
                  "internalType": "bytes",
                  "name": "execPayload",
                  "type": "bytes"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "debtThreshold",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "depositedBalance",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "depositedBalanceSnapshot",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "estimatedTotalAssets",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "estimatedWorkGas",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "gelato",
              "outputs": [
                {
                  "internalType": "address payable",
                  "name": "",
                  "type": "address"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "healthCheck",
              "outputs": [
                {
                  "internalType": "contract IHealthCheck",
                  "name": "",
                  "type": "address"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "healthCheckEnabled",
              "outputs": [
                {
                  "internalType": "bool",
                  "name": "",
                  "type": "bool"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "_vault",
                  "type": "address"
                },
                {
                  "internalType": "address",
                  "name": "_cToken",
                  "type": "address"
                },
                {
                  "internalType": "address",
                  "name": "_ops",
                  "type": "address"
                },
                {
                  "internalType": "address",
                  "name": "_nativeTokenPriceFeed",
                  "type": "address"
                },
                {
                  "internalType": "address",
                  "name": "_assetPriceFeed",
                  "type": "address"
                },
                {
                  "internalType": "uint256",
                  "name": "_minReportInterval",
                  "type": "uint256"
                },
                {
                  "internalType": "bool",
                  "name": "_isPrepaid",
                  "type": "bool"
                }
              ],
              "name": "initialize",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "isPrepaid",
              "outputs": [
                {
                  "internalType": "bool",
                  "name": "",
                  "type": "bool"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "lastWorkTime",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "minBananaToSell",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "minimumBetweenExecutions",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "name",
              "outputs": [
                {
                  "internalType": "string",
                  "name": "",
                  "type": "string"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "ops",
              "outputs": [
                {
                  "internalType": "contract IOps",
                  "name": "",
                  "type": "address"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "owner",
              "outputs": [
                {
                  "internalType": "address",
                  "name": "",
                  "type": "address"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "pancakeRouter",
              "outputs": [
                {
                  "internalType": "contract IPancakeRouter",
                  "name": "",
                  "type": "address"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "paused",
              "outputs": [
                {
                  "internalType": "bool",
                  "name": "",
                  "type": "bool"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "payableWork",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "profitFactor",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "proxiableUUID",
              "outputs": [
                {
                  "internalType": "bytes32",
                  "name": "",
                  "type": "bytes32"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "rainMaker",
              "outputs": [
                {
                  "internalType": "contract IRainMaker",
                  "name": "",
                  "type": "address"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "renounceOwnership",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "uint256",
                  "name": "_debtThreshold",
                  "type": "uint256"
                }
              ],
              "name": "setDebtThreshold",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "uint256",
                  "name": "_estimatedWorkGas",
                  "type": "uint256"
                }
              ],
              "name": "setEstimatedWorkGas",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "_healthCheck",
                  "type": "address"
                }
              ],
              "name": "setHealthCheck",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "bool",
                  "name": "_healthCheckEnabled",
                  "type": "bool"
                }
              ],
              "name": "setHealthCheckEnabled",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "uint256",
                  "name": "_minBananaToSell",
                  "type": "uint256"
                }
              ],
              "name": "setMinBananaToSell",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "uint256",
                  "name": "_profitFactor",
                  "type": "uint256"
                }
              ],
              "name": "setProfitFactor",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "shutdown",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "timeFromLastExecution",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "newOwner",
                  "type": "address"
                }
              ],
              "name": "transferOwnership",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "newImplementation",
                  "type": "address"
                }
              ],
              "name": "upgradeTo",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "newImplementation",
                  "type": "address"
                },
                {
                  "internalType": "bytes",
                  "name": "data",
                  "type": "bytes"
                }
              ],
              "name": "upgradeToAndCall",
              "outputs": [],
              "stateMutability": "payable",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "vault",
              "outputs": [
                {
                  "internalType": "contract IVault",
                  "name": "",
                  "type": "address"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "version",
              "outputs": [
                {
                  "internalType": "string",
                  "name": "",
                  "type": "string"
                }
              ],
              "stateMutability": "pure",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "uint256",
                  "name": "assets",
                  "type": "uint256"
                }
              ],
              "name": "withdraw",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "loss",
                  "type": "uint256"
                }
              ],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "work",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function"
            }
          ]
        },
        "ApeLendingStrategy_Proxy": {
          "address": "0xDD6356D8d474BF3ab92c165d2b6b2b4DB589c7D0",
          "abi": [
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "_logic",
                  "type": "address"
                },
                {
                  "internalType": "bytes",
                  "name": "_data",
                  "type": "bytes"
                }
              ],
              "stateMutability": "payable",
              "type": "constructor"
            },
            {
              "anonymous": false,
              "inputs": [
                {
                  "indexed": false,
                  "internalType": "address",
                  "name": "previousAdmin",
                  "type": "address"
                },
                {
                  "indexed": false,
                  "internalType": "address",
                  "name": "newAdmin",
                  "type": "address"
                }
              ],
              "name": "AdminChanged",
              "type": "event"
            },
            {
              "anonymous": false,
              "inputs": [
                {
                  "indexed": true,
                  "internalType": "address",
                  "name": "beacon",
                  "type": "address"
                }
              ],
              "name": "BeaconUpgraded",
              "type": "event"
            },
            {
              "anonymous": false,
              "inputs": [
                {
                  "indexed": true,
                  "internalType": "address",
                  "name": "implementation",
                  "type": "address"
                }
              ],
              "name": "Upgraded",
              "type": "event"
            },
            {
              "stateMutability": "payable",
              "type": "fallback"
            },
            {
              "stateMutability": "payable",
              "type": "receive"
            }
          ]
        },
        "Vault": {
          "address": "0xa3923Fa94c7332e2561E88290B884419dca9E23C",
          "abi": [
            {
              "anonymous": false,
              "inputs": [
                {
                  "indexed": false,
                  "internalType": "address",
                  "name": "previousAdmin",
                  "type": "address"
                },
                {
                  "indexed": false,
                  "internalType": "address",
                  "name": "newAdmin",
                  "type": "address"
                }
              ],
              "name": "AdminChanged",
              "type": "event"
            },
            {
              "anonymous": false,
              "inputs": [
                {
                  "indexed": true,
                  "internalType": "address",
                  "name": "beacon",
                  "type": "address"
                }
              ],
              "name": "BeaconUpgraded",
              "type": "event"
            },
            {
              "anonymous": false,
              "inputs": [
                {
                  "indexed": true,
                  "internalType": "address",
                  "name": "implementation",
                  "type": "address"
                }
              ],
              "name": "Upgraded",
              "type": "event"
            },
            {
              "stateMutability": "payable",
              "type": "fallback"
            },
            {
              "stateMutability": "payable",
              "type": "receive"
            },
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "caller",
                  "type": "address"
                }
              ],
              "name": "AccessDeniedForCaller",
              "type": "error"
            },
            {
              "inputs": [],
              "name": "BorrowerAlreadyExists",
              "type": "error"
            },
            {
              "inputs": [],
              "name": "BorrowerDoesNotExist",
              "type": "error"
            },
            {
              "inputs": [],
              "name": "BorrowerHasDebt",
              "type": "error"
            },
            {
              "inputs": [],
              "name": "CallerIsNotABorrower",
              "type": "error"
            },
            {
              "inputs": [],
              "name": "ExceededMaximumFeeValue",
              "type": "error"
            },
            {
              "inputs": [],
              "name": "FalsePositiveReport",
              "type": "error"
            },
            {
              "inputs": [],
              "name": "InappropriateStrategy",
              "type": "error"
            },
            {
              "inputs": [
                {
                  "internalType": "uint256",
                  "name": "assets",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "shares",
                  "type": "uint256"
                }
              ],
              "name": "InsufficientVaultBalance",
              "type": "error"
            },
            {
              "inputs": [
                {
                  "internalType": "uint256",
                  "name": "durationInSeconds",
                  "type": "uint256"
                }
              ],
              "name": "InvalidLockedProfitReleaseRate",
              "type": "error"
            },
            {
              "inputs": [
                {
                  "internalType": "uint256",
                  "name": "freeRatio",
                  "type": "uint256"
                }
              ],
              "name": "LenderRatioExceeded",
              "type": "error"
            },
            {
              "inputs": [],
              "name": "ListsDoNotMatch",
              "type": "error"
            },
            {
              "inputs": [],
              "name": "StrategyAlreadyExists",
              "type": "error"
            },
            {
              "inputs": [],
              "name": "StrategyNotFound",
              "type": "error"
            },
            {
              "inputs": [],
              "name": "UnexpectedZeroAddress",
              "type": "error"
            },
            {
              "anonymous": false,
              "inputs": [
                {
                  "indexed": true,
                  "internalType": "address",
                  "name": "owner",
                  "type": "address"
                },
                {
                  "indexed": true,
                  "internalType": "address",
                  "name": "spender",
                  "type": "address"
                },
                {
                  "indexed": false,
                  "internalType": "uint256",
                  "name": "value",
                  "type": "uint256"
                }
              ],
              "name": "Approval",
              "type": "event"
            },
            {
              "anonymous": false,
              "inputs": [
                {
                  "indexed": true,
                  "internalType": "address",
                  "name": "operator",
                  "type": "address"
                },
                {
                  "indexed": true,
                  "internalType": "address",
                  "name": "tokenHolder",
                  "type": "address"
                }
              ],
              "name": "AuthorizedOperator",
              "type": "event"
            },
            {
              "anonymous": false,
              "inputs": [
                {
                  "indexed": true,
                  "internalType": "address",
                  "name": "borrower",
                  "type": "address"
                },
                {
                  "indexed": false,
                  "internalType": "uint256",
                  "name": "debtPayment",
                  "type": "uint256"
                },
                {
                  "indexed": false,
                  "internalType": "uint256",
                  "name": "freeFunds",
                  "type": "uint256"
                },
                {
                  "indexed": false,
                  "internalType": "uint256",
                  "name": "fundsGiven",
                  "type": "uint256"
                },
                {
                  "indexed": false,
                  "internalType": "uint256",
                  "name": "fundsTaken",
                  "type": "uint256"
                },
                {
                  "indexed": false,
                  "internalType": "uint256",
                  "name": "loss",
                  "type": "uint256"
                }
              ],
              "name": "BorrowerDebtManagementReported",
              "type": "event"
            },
            {
              "anonymous": false,
              "inputs": [
                {
                  "indexed": true,
                  "internalType": "address",
                  "name": "operator",
                  "type": "address"
                },
                {
                  "indexed": true,
                  "internalType": "address",
                  "name": "from",
                  "type": "address"
                },
                {
                  "indexed": false,
                  "internalType": "uint256",
                  "name": "amount",
                  "type": "uint256"
                },
                {
                  "indexed": false,
                  "internalType": "bytes",
                  "name": "data",
                  "type": "bytes"
                },
                {
                  "indexed": false,
                  "internalType": "bytes",
                  "name": "operatorData",
                  "type": "bytes"
                }
              ],
              "name": "Burned",
              "type": "event"
            },
            {
              "anonymous": false,
              "inputs": [
                {
                  "indexed": true,
                  "internalType": "address",
                  "name": "caller",
                  "type": "address"
                },
                {
                  "indexed": true,
                  "internalType": "address",
                  "name": "owner",
                  "type": "address"
                },
                {
                  "indexed": false,
                  "internalType": "uint256",
                  "name": "assets",
                  "type": "uint256"
                },
                {
                  "indexed": false,
                  "internalType": "uint256",
                  "name": "shares",
                  "type": "uint256"
                }
              ],
              "name": "Deposit",
              "type": "event"
            },
            {
              "anonymous": false,
              "inputs": [
                {
                  "indexed": false,
                  "internalType": "uint8",
                  "name": "version",
                  "type": "uint8"
                }
              ],
              "name": "Initialized",
              "type": "event"
            },
            {
              "anonymous": false,
              "inputs": [
                {
                  "indexed": false,
                  "internalType": "uint256",
                  "name": "rate",
                  "type": "uint256"
                }
              ],
              "name": "LockedProfitReleaseRateChanged",
              "type": "event"
            },
            {
              "anonymous": false,
              "inputs": [
                {
                  "indexed": true,
                  "internalType": "address",
                  "name": "operator",
                  "type": "address"
                },
                {
                  "indexed": true,
                  "internalType": "address",
                  "name": "to",
                  "type": "address"
                },
                {
                  "indexed": false,
                  "internalType": "uint256",
                  "name": "amount",
                  "type": "uint256"
                },
                {
                  "indexed": false,
                  "internalType": "bytes",
                  "name": "data",
                  "type": "bytes"
                },
                {
                  "indexed": false,
                  "internalType": "bytes",
                  "name": "operatorData",
                  "type": "bytes"
                }
              ],
              "name": "Minted",
              "type": "event"
            },
            {
              "anonymous": false,
              "inputs": [
                {
                  "indexed": true,
                  "internalType": "address",
                  "name": "previousOwner",
                  "type": "address"
                },
                {
                  "indexed": true,
                  "internalType": "address",
                  "name": "newOwner",
                  "type": "address"
                }
              ],
              "name": "OwnershipTransferred",
              "type": "event"
            },
            {
              "anonymous": false,
              "inputs": [
                {
                  "indexed": false,
                  "internalType": "address",
                  "name": "account",
                  "type": "address"
                }
              ],
              "name": "Paused",
              "type": "event"
            },
            {
              "anonymous": false,
              "inputs": [
                {
                  "indexed": true,
                  "internalType": "address",
                  "name": "operator",
                  "type": "address"
                },
                {
                  "indexed": true,
                  "internalType": "address",
                  "name": "tokenHolder",
                  "type": "address"
                }
              ],
              "name": "RevokedOperator",
              "type": "event"
            },
            {
              "anonymous": false,
              "inputs": [
                {
                  "indexed": true,
                  "internalType": "address",
                  "name": "operator",
                  "type": "address"
                },
                {
                  "indexed": true,
                  "internalType": "address",
                  "name": "from",
                  "type": "address"
                },
                {
                  "indexed": true,
                  "internalType": "address",
                  "name": "to",
                  "type": "address"
                },
                {
                  "indexed": false,
                  "internalType": "uint256",
                  "name": "amount",
                  "type": "uint256"
                },
                {
                  "indexed": false,
                  "internalType": "bytes",
                  "name": "data",
                  "type": "bytes"
                },
                {
                  "indexed": false,
                  "internalType": "bytes",
                  "name": "operatorData",
                  "type": "bytes"
                }
              ],
              "name": "Sent",
              "type": "event"
            },
            {
              "anonymous": false,
              "inputs": [
                {
                  "indexed": true,
                  "internalType": "address",
                  "name": "strategy",
                  "type": "address"
                },
                {
                  "indexed": false,
                  "internalType": "uint256",
                  "name": "debtRatio",
                  "type": "uint256"
                }
              ],
              "name": "StrategyAdded",
              "type": "event"
            },
            {
              "anonymous": false,
              "inputs": [
                {
                  "indexed": true,
                  "internalType": "address",
                  "name": "strategy",
                  "type": "address"
                },
                {
                  "indexed": false,
                  "internalType": "bool",
                  "name": "fromQueueOnly",
                  "type": "bool"
                }
              ],
              "name": "StrategyRemoved",
              "type": "event"
            },
            {
              "anonymous": false,
              "inputs": [
                {
                  "indexed": true,
                  "internalType": "address",
                  "name": "strategy",
                  "type": "address"
                }
              ],
              "name": "StrategyReturnedToQueue",
              "type": "event"
            },
            {
              "anonymous": false,
              "inputs": [
                {
                  "indexed": true,
                  "internalType": "address",
                  "name": "strategy",
                  "type": "address"
                }
              ],
              "name": "StrategyRevoked",
              "type": "event"
            },
            {
              "anonymous": false,
              "inputs": [
                {
                  "indexed": true,
                  "internalType": "address",
                  "name": "from",
                  "type": "address"
                },
                {
                  "indexed": true,
                  "internalType": "address",
                  "name": "to",
                  "type": "address"
                },
                {
                  "indexed": false,
                  "internalType": "uint256",
                  "name": "value",
                  "type": "uint256"
                }
              ],
              "name": "Transfer",
              "type": "event"
            },
            {
              "anonymous": false,
              "inputs": [
                {
                  "indexed": false,
                  "internalType": "address",
                  "name": "account",
                  "type": "address"
                }
              ],
              "name": "Unpaused",
              "type": "event"
            },
            {
              "anonymous": false,
              "inputs": [
                {
                  "indexed": true,
                  "internalType": "address",
                  "name": "caller",
                  "type": "address"
                },
                {
                  "indexed": true,
                  "internalType": "address",
                  "name": "receiver",
                  "type": "address"
                },
                {
                  "indexed": true,
                  "internalType": "address",
                  "name": "owner",
                  "type": "address"
                },
                {
                  "indexed": false,
                  "internalType": "uint256",
                  "name": "assets",
                  "type": "uint256"
                },
                {
                  "indexed": false,
                  "internalType": "uint256",
                  "name": "shares",
                  "type": "uint256"
                }
              ],
              "name": "Withdraw",
              "type": "event"
            },
            {
              "inputs": [],
              "name": "LOCKED_PROFIT_RELEASE_SCALE",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "MAX_BPS",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "strategy",
                  "type": "address"
                },
                {
                  "internalType": "uint256",
                  "name": "debtRatio",
                  "type": "uint256"
                }
              ],
              "name": "addStrategy",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "strategy",
                  "type": "address"
                }
              ],
              "name": "addStrategyToQueue",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "holder",
                  "type": "address"
                },
                {
                  "internalType": "address",
                  "name": "spender",
                  "type": "address"
                }
              ],
              "name": "allowance",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "spender",
                  "type": "address"
                },
                {
                  "internalType": "uint256",
                  "name": "value",
                  "type": "uint256"
                }
              ],
              "name": "approve",
              "outputs": [
                {
                  "internalType": "bool",
                  "name": "",
                  "type": "bool"
                }
              ],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "asset",
              "outputs": [
                {
                  "internalType": "contract IERC20Upgradeable",
                  "name": "",
                  "type": "address"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "operator",
                  "type": "address"
                }
              ],
              "name": "authorizeOperator",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "availableCredit",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "tokenHolder",
                  "type": "address"
                }
              ],
              "name": "balanceOf",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "",
                  "type": "address"
                }
              ],
              "name": "borrowersData",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "activationTimestamp",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "lastReportTimestamp",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "debt",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "debtRatio",
                  "type": "uint256"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "uint256",
                  "name": "amount",
                  "type": "uint256"
                },
                {
                  "internalType": "bytes",
                  "name": "data",
                  "type": "bytes"
                }
              ],
              "name": "burn",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "uint256",
                  "name": "shares",
                  "type": "uint256"
                }
              ],
              "name": "convertToAssets",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "uint256",
                  "name": "assets",
                  "type": "uint256"
                }
              ],
              "name": "convertToShares",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "currentDebt",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "borrower",
                  "type": "address"
                }
              ],
              "name": "currentDebt",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "currentDebtRatio",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "debtRatio",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "decimals",
              "outputs": [
                {
                  "internalType": "uint8",
                  "name": "",
                  "type": "uint8"
                }
              ],
              "stateMutability": "pure",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "defaultOperators",
              "outputs": [
                {
                  "internalType": "address[]",
                  "name": "",
                  "type": "address[]"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "uint256",
                  "name": "assets",
                  "type": "uint256"
                },
                {
                  "internalType": "address",
                  "name": "",
                  "type": "address"
                }
              ],
              "name": "deposit",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "shares",
                  "type": "uint256"
                }
              ],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "uint256",
                  "name": "assets",
                  "type": "uint256"
                }
              ],
              "name": "deposit",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "shares",
                  "type": "uint256"
                }
              ],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "getQueueSize",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "granularity",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "_asset",
                  "type": "address"
                },
                {
                  "internalType": "address",
                  "name": "_rewards",
                  "type": "address"
                },
                {
                  "internalType": "uint256",
                  "name": "_managementFee",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "_lockedProfitReleaseRate",
                  "type": "uint256"
                },
                {
                  "internalType": "string",
                  "name": "_name",
                  "type": "string"
                },
                {
                  "internalType": "string",
                  "name": "_symbol",
                  "type": "string"
                },
                {
                  "internalType": "address[]",
                  "name": "_defaultOperators",
                  "type": "address[]"
                }
              ],
              "name": "initialize",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "isActivated",
              "outputs": [
                {
                  "internalType": "bool",
                  "name": "",
                  "type": "bool"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "borrower",
                  "type": "address"
                }
              ],
              "name": "isActivated",
              "outputs": [
                {
                  "internalType": "bool",
                  "name": "",
                  "type": "bool"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "operator",
                  "type": "address"
                },
                {
                  "internalType": "address",
                  "name": "tokenHolder",
                  "type": "address"
                }
              ],
              "name": "isOperatorFor",
              "outputs": [
                {
                  "internalType": "bool",
                  "name": "",
                  "type": "bool"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "borrower",
                  "type": "address"
                }
              ],
              "name": "lastReport",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "lastReport",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "lastReportTimestamp",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "lendingAssets",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "lockedProfitBaseline",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "lockedProfitReleaseRate",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "managementFee",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "",
                  "type": "address"
                }
              ],
              "name": "maxDeposit",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "",
                  "type": "address"
                }
              ],
              "name": "maxMint",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "owner",
                  "type": "address"
                }
              ],
              "name": "maxRedeem",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "owner",
                  "type": "address"
                }
              ],
              "name": "maxWithdraw",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "uint256",
                  "name": "shares",
                  "type": "uint256"
                },
                {
                  "internalType": "address",
                  "name": "",
                  "type": "address"
                }
              ],
              "name": "mint",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "assets",
                  "type": "uint256"
                }
              ],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "uint256",
                  "name": "shares",
                  "type": "uint256"
                }
              ],
              "name": "mint",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "assets",
                  "type": "uint256"
                }
              ],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "name",
              "outputs": [
                {
                  "internalType": "string",
                  "name": "",
                  "type": "string"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "account",
                  "type": "address"
                },
                {
                  "internalType": "uint256",
                  "name": "amount",
                  "type": "uint256"
                },
                {
                  "internalType": "bytes",
                  "name": "data",
                  "type": "bytes"
                },
                {
                  "internalType": "bytes",
                  "name": "operatorData",
                  "type": "bytes"
                }
              ],
              "name": "operatorBurn",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "sender",
                  "type": "address"
                },
                {
                  "internalType": "address",
                  "name": "recipient",
                  "type": "address"
                },
                {
                  "internalType": "uint256",
                  "name": "amount",
                  "type": "uint256"
                },
                {
                  "internalType": "bytes",
                  "name": "data",
                  "type": "bytes"
                },
                {
                  "internalType": "bytes",
                  "name": "operatorData",
                  "type": "bytes"
                }
              ],
              "name": "operatorSend",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "outstandingDebt",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "owner",
              "outputs": [
                {
                  "internalType": "address",
                  "name": "",
                  "type": "address"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "paused",
              "outputs": [
                {
                  "internalType": "bool",
                  "name": "",
                  "type": "bool"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "uint256",
                  "name": "assets",
                  "type": "uint256"
                }
              ],
              "name": "previewDeposit",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "uint256",
                  "name": "shares",
                  "type": "uint256"
                }
              ],
              "name": "previewMint",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "uint256",
                  "name": "shares",
                  "type": "uint256"
                }
              ],
              "name": "previewRedeem",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "uint256",
                  "name": "assets",
                  "type": "uint256"
                }
              ],
              "name": "previewWithdraw",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "proxiableUUID",
              "outputs": [
                {
                  "internalType": "bytes32",
                  "name": "",
                  "type": "bytes32"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "uint256",
                  "name": "shares",
                  "type": "uint256"
                },
                {
                  "internalType": "address",
                  "name": "",
                  "type": "address"
                },
                {
                  "internalType": "address",
                  "name": "",
                  "type": "address"
                }
              ],
              "name": "redeem",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "assets",
                  "type": "uint256"
                }
              ],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "uint256",
                  "name": "shares",
                  "type": "uint256"
                }
              ],
              "name": "redeem",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "assets",
                  "type": "uint256"
                }
              ],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "strategy",
                  "type": "address"
                },
                {
                  "internalType": "bool",
                  "name": "fromQueueOnly",
                  "type": "bool"
                }
              ],
              "name": "removeStrategy",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "renounceOwnership",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "address[]",
                  "name": "queue",
                  "type": "address[]"
                }
              ],
              "name": "reorderWithdrawalQueue",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "uint256",
                  "name": "loss",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "debtPayment",
                  "type": "uint256"
                }
              ],
              "name": "reportNegativeDebtManagement",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "uint256",
                  "name": "extraFreeFunds",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "debtPayment",
                  "type": "uint256"
                }
              ],
              "name": "reportPositiveDebtManagement",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "operator",
                  "type": "address"
                }
              ],
              "name": "revokeOperator",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "strategy",
                  "type": "address"
                }
              ],
              "name": "revokeStrategy",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "rewards",
              "outputs": [
                {
                  "internalType": "address",
                  "name": "",
                  "type": "address"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "recipient",
                  "type": "address"
                },
                {
                  "internalType": "uint256",
                  "name": "amount",
                  "type": "uint256"
                },
                {
                  "internalType": "bytes",
                  "name": "data",
                  "type": "bytes"
                }
              ],
              "name": "send",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "bool",
                  "name": "shutdown",
                  "type": "bool"
                }
              ],
              "name": "setEmergencyShutdown",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "uint256",
                  "name": "rate",
                  "type": "uint256"
                }
              ],
              "name": "setLockedProfitReleaseRate",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "uint256",
                  "name": "_managementFee",
                  "type": "uint256"
                }
              ],
              "name": "setManagementFee",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "_rewards",
                  "type": "address"
                }
              ],
              "name": "setRewards",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "strategy",
                  "type": "address"
                }
              ],
              "name": "strategyDebt",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "strategy",
                  "type": "address"
                }
              ],
              "name": "strategyRatio",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "symbol",
              "outputs": [
                {
                  "internalType": "string",
                  "name": "",
                  "type": "string"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "totalAssets",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "totalDebt",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "totalSupply",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "recipient",
                  "type": "address"
                },
                {
                  "internalType": "uint256",
                  "name": "amount",
                  "type": "uint256"
                }
              ],
              "name": "transfer",
              "outputs": [
                {
                  "internalType": "bool",
                  "name": "",
                  "type": "bool"
                }
              ],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "holder",
                  "type": "address"
                },
                {
                  "internalType": "address",
                  "name": "recipient",
                  "type": "address"
                },
                {
                  "internalType": "uint256",
                  "name": "amount",
                  "type": "uint256"
                }
              ],
              "name": "transferFrom",
              "outputs": [
                {
                  "internalType": "bool",
                  "name": "",
                  "type": "bool"
                }
              ],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "newOwner",
                  "type": "address"
                }
              ],
              "name": "transferOwnership",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "newImplementation",
                  "type": "address"
                }
              ],
              "name": "upgradeTo",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "newImplementation",
                  "type": "address"
                },
                {
                  "internalType": "bytes",
                  "name": "data",
                  "type": "bytes"
                }
              ],
              "name": "upgradeToAndCall",
              "outputs": [],
              "stateMutability": "payable",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "version",
              "outputs": [
                {
                  "internalType": "string",
                  "name": "",
                  "type": "string"
                }
              ],
              "stateMutability": "pure",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "uint256",
                  "name": "assets",
                  "type": "uint256"
                }
              ],
              "name": "withdraw",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "shares",
                  "type": "uint256"
                }
              ],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "uint256",
                  "name": "assets",
                  "type": "uint256"
                },
                {
                  "internalType": "address",
                  "name": "",
                  "type": "address"
                },
                {
                  "internalType": "address",
                  "name": "",
                  "type": "address"
                }
              ],
              "name": "withdraw",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "shares",
                  "type": "uint256"
                }
              ],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "name": "withdrawalQueue",
              "outputs": [
                {
                  "internalType": "address",
                  "name": "",
                  "type": "address"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "_logic",
                  "type": "address"
                },
                {
                  "internalType": "bytes",
                  "name": "_data",
                  "type": "bytes"
                }
              ],
              "stateMutability": "payable",
              "type": "constructor"
            }
          ]
        },
        "Vault_Implementation": {
          "address": "0x36dB1FB7E3BC72282E4B82e56fB4797ba3DED8cc",
          "abi": [
            {
              "inputs": [
                {
                  "internalType": "bool",
                  "name": "needDisableInitializers",
                  "type": "bool"
                }
              ],
              "stateMutability": "nonpayable",
              "type": "constructor"
            },
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "caller",
                  "type": "address"
                }
              ],
              "name": "AccessDeniedForCaller",
              "type": "error"
            },
            {
              "inputs": [],
              "name": "BorrowerAlreadyExists",
              "type": "error"
            },
            {
              "inputs": [],
              "name": "BorrowerDoesNotExist",
              "type": "error"
            },
            {
              "inputs": [],
              "name": "BorrowerHasDebt",
              "type": "error"
            },
            {
              "inputs": [],
              "name": "CallerIsNotABorrower",
              "type": "error"
            },
            {
              "inputs": [],
              "name": "ExceededMaximumFeeValue",
              "type": "error"
            },
            {
              "inputs": [],
              "name": "FalsePositiveReport",
              "type": "error"
            },
            {
              "inputs": [],
              "name": "InappropriateStrategy",
              "type": "error"
            },
            {
              "inputs": [
                {
                  "internalType": "uint256",
                  "name": "assets",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "shares",
                  "type": "uint256"
                }
              ],
              "name": "InsufficientVaultBalance",
              "type": "error"
            },
            {
              "inputs": [
                {
                  "internalType": "uint256",
                  "name": "durationInSeconds",
                  "type": "uint256"
                }
              ],
              "name": "InvalidLockedProfitReleaseRate",
              "type": "error"
            },
            {
              "inputs": [
                {
                  "internalType": "uint256",
                  "name": "freeRatio",
                  "type": "uint256"
                }
              ],
              "name": "LenderRatioExceeded",
              "type": "error"
            },
            {
              "inputs": [],
              "name": "ListsDoNotMatch",
              "type": "error"
            },
            {
              "inputs": [],
              "name": "StrategyAlreadyExists",
              "type": "error"
            },
            {
              "inputs": [],
              "name": "StrategyNotFound",
              "type": "error"
            },
            {
              "inputs": [],
              "name": "UnexpectedZeroAddress",
              "type": "error"
            },
            {
              "anonymous": false,
              "inputs": [
                {
                  "indexed": false,
                  "internalType": "address",
                  "name": "previousAdmin",
                  "type": "address"
                },
                {
                  "indexed": false,
                  "internalType": "address",
                  "name": "newAdmin",
                  "type": "address"
                }
              ],
              "name": "AdminChanged",
              "type": "event"
            },
            {
              "anonymous": false,
              "inputs": [
                {
                  "indexed": true,
                  "internalType": "address",
                  "name": "owner",
                  "type": "address"
                },
                {
                  "indexed": true,
                  "internalType": "address",
                  "name": "spender",
                  "type": "address"
                },
                {
                  "indexed": false,
                  "internalType": "uint256",
                  "name": "value",
                  "type": "uint256"
                }
              ],
              "name": "Approval",
              "type": "event"
            },
            {
              "anonymous": false,
              "inputs": [
                {
                  "indexed": true,
                  "internalType": "address",
                  "name": "operator",
                  "type": "address"
                },
                {
                  "indexed": true,
                  "internalType": "address",
                  "name": "tokenHolder",
                  "type": "address"
                }
              ],
              "name": "AuthorizedOperator",
              "type": "event"
            },
            {
              "anonymous": false,
              "inputs": [
                {
                  "indexed": true,
                  "internalType": "address",
                  "name": "beacon",
                  "type": "address"
                }
              ],
              "name": "BeaconUpgraded",
              "type": "event"
            },
            {
              "anonymous": false,
              "inputs": [
                {
                  "indexed": true,
                  "internalType": "address",
                  "name": "borrower",
                  "type": "address"
                },
                {
                  "indexed": false,
                  "internalType": "uint256",
                  "name": "debtPayment",
                  "type": "uint256"
                },
                {
                  "indexed": false,
                  "internalType": "uint256",
                  "name": "freeFunds",
                  "type": "uint256"
                },
                {
                  "indexed": false,
                  "internalType": "uint256",
                  "name": "fundsGiven",
                  "type": "uint256"
                },
                {
                  "indexed": false,
                  "internalType": "uint256",
                  "name": "fundsTaken",
                  "type": "uint256"
                },
                {
                  "indexed": false,
                  "internalType": "uint256",
                  "name": "loss",
                  "type": "uint256"
                }
              ],
              "name": "BorrowerDebtManagementReported",
              "type": "event"
            },
            {
              "anonymous": false,
              "inputs": [
                {
                  "indexed": true,
                  "internalType": "address",
                  "name": "operator",
                  "type": "address"
                },
                {
                  "indexed": true,
                  "internalType": "address",
                  "name": "from",
                  "type": "address"
                },
                {
                  "indexed": false,
                  "internalType": "uint256",
                  "name": "amount",
                  "type": "uint256"
                },
                {
                  "indexed": false,
                  "internalType": "bytes",
                  "name": "data",
                  "type": "bytes"
                },
                {
                  "indexed": false,
                  "internalType": "bytes",
                  "name": "operatorData",
                  "type": "bytes"
                }
              ],
              "name": "Burned",
              "type": "event"
            },
            {
              "anonymous": false,
              "inputs": [
                {
                  "indexed": true,
                  "internalType": "address",
                  "name": "caller",
                  "type": "address"
                },
                {
                  "indexed": true,
                  "internalType": "address",
                  "name": "owner",
                  "type": "address"
                },
                {
                  "indexed": false,
                  "internalType": "uint256",
                  "name": "assets",
                  "type": "uint256"
                },
                {
                  "indexed": false,
                  "internalType": "uint256",
                  "name": "shares",
                  "type": "uint256"
                }
              ],
              "name": "Deposit",
              "type": "event"
            },
            {
              "anonymous": false,
              "inputs": [
                {
                  "indexed": false,
                  "internalType": "uint8",
                  "name": "version",
                  "type": "uint8"
                }
              ],
              "name": "Initialized",
              "type": "event"
            },
            {
              "anonymous": false,
              "inputs": [
                {
                  "indexed": false,
                  "internalType": "uint256",
                  "name": "rate",
                  "type": "uint256"
                }
              ],
              "name": "LockedProfitReleaseRateChanged",
              "type": "event"
            },
            {
              "anonymous": false,
              "inputs": [
                {
                  "indexed": true,
                  "internalType": "address",
                  "name": "operator",
                  "type": "address"
                },
                {
                  "indexed": true,
                  "internalType": "address",
                  "name": "to",
                  "type": "address"
                },
                {
                  "indexed": false,
                  "internalType": "uint256",
                  "name": "amount",
                  "type": "uint256"
                },
                {
                  "indexed": false,
                  "internalType": "bytes",
                  "name": "data",
                  "type": "bytes"
                },
                {
                  "indexed": false,
                  "internalType": "bytes",
                  "name": "operatorData",
                  "type": "bytes"
                }
              ],
              "name": "Minted",
              "type": "event"
            },
            {
              "anonymous": false,
              "inputs": [
                {
                  "indexed": true,
                  "internalType": "address",
                  "name": "previousOwner",
                  "type": "address"
                },
                {
                  "indexed": true,
                  "internalType": "address",
                  "name": "newOwner",
                  "type": "address"
                }
              ],
              "name": "OwnershipTransferred",
              "type": "event"
            },
            {
              "anonymous": false,
              "inputs": [
                {
                  "indexed": false,
                  "internalType": "address",
                  "name": "account",
                  "type": "address"
                }
              ],
              "name": "Paused",
              "type": "event"
            },
            {
              "anonymous": false,
              "inputs": [
                {
                  "indexed": true,
                  "internalType": "address",
                  "name": "operator",
                  "type": "address"
                },
                {
                  "indexed": true,
                  "internalType": "address",
                  "name": "tokenHolder",
                  "type": "address"
                }
              ],
              "name": "RevokedOperator",
              "type": "event"
            },
            {
              "anonymous": false,
              "inputs": [
                {
                  "indexed": true,
                  "internalType": "address",
                  "name": "operator",
                  "type": "address"
                },
                {
                  "indexed": true,
                  "internalType": "address",
                  "name": "from",
                  "type": "address"
                },
                {
                  "indexed": true,
                  "internalType": "address",
                  "name": "to",
                  "type": "address"
                },
                {
                  "indexed": false,
                  "internalType": "uint256",
                  "name": "amount",
                  "type": "uint256"
                },
                {
                  "indexed": false,
                  "internalType": "bytes",
                  "name": "data",
                  "type": "bytes"
                },
                {
                  "indexed": false,
                  "internalType": "bytes",
                  "name": "operatorData",
                  "type": "bytes"
                }
              ],
              "name": "Sent",
              "type": "event"
            },
            {
              "anonymous": false,
              "inputs": [
                {
                  "indexed": true,
                  "internalType": "address",
                  "name": "strategy",
                  "type": "address"
                },
                {
                  "indexed": false,
                  "internalType": "uint256",
                  "name": "debtRatio",
                  "type": "uint256"
                }
              ],
              "name": "StrategyAdded",
              "type": "event"
            },
            {
              "anonymous": false,
              "inputs": [
                {
                  "indexed": true,
                  "internalType": "address",
                  "name": "strategy",
                  "type": "address"
                },
                {
                  "indexed": false,
                  "internalType": "bool",
                  "name": "fromQueueOnly",
                  "type": "bool"
                }
              ],
              "name": "StrategyRemoved",
              "type": "event"
            },
            {
              "anonymous": false,
              "inputs": [
                {
                  "indexed": true,
                  "internalType": "address",
                  "name": "strategy",
                  "type": "address"
                }
              ],
              "name": "StrategyReturnedToQueue",
              "type": "event"
            },
            {
              "anonymous": false,
              "inputs": [
                {
                  "indexed": true,
                  "internalType": "address",
                  "name": "strategy",
                  "type": "address"
                }
              ],
              "name": "StrategyRevoked",
              "type": "event"
            },
            {
              "anonymous": false,
              "inputs": [
                {
                  "indexed": true,
                  "internalType": "address",
                  "name": "from",
                  "type": "address"
                },
                {
                  "indexed": true,
                  "internalType": "address",
                  "name": "to",
                  "type": "address"
                },
                {
                  "indexed": false,
                  "internalType": "uint256",
                  "name": "value",
                  "type": "uint256"
                }
              ],
              "name": "Transfer",
              "type": "event"
            },
            {
              "anonymous": false,
              "inputs": [
                {
                  "indexed": false,
                  "internalType": "address",
                  "name": "account",
                  "type": "address"
                }
              ],
              "name": "Unpaused",
              "type": "event"
            },
            {
              "anonymous": false,
              "inputs": [
                {
                  "indexed": true,
                  "internalType": "address",
                  "name": "implementation",
                  "type": "address"
                }
              ],
              "name": "Upgraded",
              "type": "event"
            },
            {
              "anonymous": false,
              "inputs": [
                {
                  "indexed": true,
                  "internalType": "address",
                  "name": "caller",
                  "type": "address"
                },
                {
                  "indexed": true,
                  "internalType": "address",
                  "name": "receiver",
                  "type": "address"
                },
                {
                  "indexed": true,
                  "internalType": "address",
                  "name": "owner",
                  "type": "address"
                },
                {
                  "indexed": false,
                  "internalType": "uint256",
                  "name": "assets",
                  "type": "uint256"
                },
                {
                  "indexed": false,
                  "internalType": "uint256",
                  "name": "shares",
                  "type": "uint256"
                }
              ],
              "name": "Withdraw",
              "type": "event"
            },
            {
              "inputs": [],
              "name": "LOCKED_PROFIT_RELEASE_SCALE",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "MAX_BPS",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "strategy",
                  "type": "address"
                },
                {
                  "internalType": "uint256",
                  "name": "debtRatio",
                  "type": "uint256"
                }
              ],
              "name": "addStrategy",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "strategy",
                  "type": "address"
                }
              ],
              "name": "addStrategyToQueue",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "holder",
                  "type": "address"
                },
                {
                  "internalType": "address",
                  "name": "spender",
                  "type": "address"
                }
              ],
              "name": "allowance",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "spender",
                  "type": "address"
                },
                {
                  "internalType": "uint256",
                  "name": "value",
                  "type": "uint256"
                }
              ],
              "name": "approve",
              "outputs": [
                {
                  "internalType": "bool",
                  "name": "",
                  "type": "bool"
                }
              ],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "asset",
              "outputs": [
                {
                  "internalType": "contract IERC20Upgradeable",
                  "name": "",
                  "type": "address"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "operator",
                  "type": "address"
                }
              ],
              "name": "authorizeOperator",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "availableCredit",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "tokenHolder",
                  "type": "address"
                }
              ],
              "name": "balanceOf",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "",
                  "type": "address"
                }
              ],
              "name": "borrowersData",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "activationTimestamp",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "lastReportTimestamp",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "debt",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "debtRatio",
                  "type": "uint256"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "uint256",
                  "name": "amount",
                  "type": "uint256"
                },
                {
                  "internalType": "bytes",
                  "name": "data",
                  "type": "bytes"
                }
              ],
              "name": "burn",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "uint256",
                  "name": "shares",
                  "type": "uint256"
                }
              ],
              "name": "convertToAssets",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "uint256",
                  "name": "assets",
                  "type": "uint256"
                }
              ],
              "name": "convertToShares",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "currentDebt",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "borrower",
                  "type": "address"
                }
              ],
              "name": "currentDebt",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "currentDebtRatio",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "debtRatio",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "decimals",
              "outputs": [
                {
                  "internalType": "uint8",
                  "name": "",
                  "type": "uint8"
                }
              ],
              "stateMutability": "pure",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "defaultOperators",
              "outputs": [
                {
                  "internalType": "address[]",
                  "name": "",
                  "type": "address[]"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "uint256",
                  "name": "assets",
                  "type": "uint256"
                },
                {
                  "internalType": "address",
                  "name": "",
                  "type": "address"
                }
              ],
              "name": "deposit",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "shares",
                  "type": "uint256"
                }
              ],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "uint256",
                  "name": "assets",
                  "type": "uint256"
                }
              ],
              "name": "deposit",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "shares",
                  "type": "uint256"
                }
              ],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "getQueueSize",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "granularity",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "_asset",
                  "type": "address"
                },
                {
                  "internalType": "address",
                  "name": "_rewards",
                  "type": "address"
                },
                {
                  "internalType": "uint256",
                  "name": "_managementFee",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "_lockedProfitReleaseRate",
                  "type": "uint256"
                },
                {
                  "internalType": "string",
                  "name": "_name",
                  "type": "string"
                },
                {
                  "internalType": "string",
                  "name": "_symbol",
                  "type": "string"
                },
                {
                  "internalType": "address[]",
                  "name": "_defaultOperators",
                  "type": "address[]"
                }
              ],
              "name": "initialize",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "isActivated",
              "outputs": [
                {
                  "internalType": "bool",
                  "name": "",
                  "type": "bool"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "borrower",
                  "type": "address"
                }
              ],
              "name": "isActivated",
              "outputs": [
                {
                  "internalType": "bool",
                  "name": "",
                  "type": "bool"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "operator",
                  "type": "address"
                },
                {
                  "internalType": "address",
                  "name": "tokenHolder",
                  "type": "address"
                }
              ],
              "name": "isOperatorFor",
              "outputs": [
                {
                  "internalType": "bool",
                  "name": "",
                  "type": "bool"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "borrower",
                  "type": "address"
                }
              ],
              "name": "lastReport",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "lastReport",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "lastReportTimestamp",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "lendingAssets",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "lockedProfitBaseline",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "lockedProfitReleaseRate",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "managementFee",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "",
                  "type": "address"
                }
              ],
              "name": "maxDeposit",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "",
                  "type": "address"
                }
              ],
              "name": "maxMint",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "owner",
                  "type": "address"
                }
              ],
              "name": "maxRedeem",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "owner",
                  "type": "address"
                }
              ],
              "name": "maxWithdraw",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "uint256",
                  "name": "shares",
                  "type": "uint256"
                },
                {
                  "internalType": "address",
                  "name": "",
                  "type": "address"
                }
              ],
              "name": "mint",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "assets",
                  "type": "uint256"
                }
              ],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "uint256",
                  "name": "shares",
                  "type": "uint256"
                }
              ],
              "name": "mint",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "assets",
                  "type": "uint256"
                }
              ],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "name",
              "outputs": [
                {
                  "internalType": "string",
                  "name": "",
                  "type": "string"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "account",
                  "type": "address"
                },
                {
                  "internalType": "uint256",
                  "name": "amount",
                  "type": "uint256"
                },
                {
                  "internalType": "bytes",
                  "name": "data",
                  "type": "bytes"
                },
                {
                  "internalType": "bytes",
                  "name": "operatorData",
                  "type": "bytes"
                }
              ],
              "name": "operatorBurn",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "sender",
                  "type": "address"
                },
                {
                  "internalType": "address",
                  "name": "recipient",
                  "type": "address"
                },
                {
                  "internalType": "uint256",
                  "name": "amount",
                  "type": "uint256"
                },
                {
                  "internalType": "bytes",
                  "name": "data",
                  "type": "bytes"
                },
                {
                  "internalType": "bytes",
                  "name": "operatorData",
                  "type": "bytes"
                }
              ],
              "name": "operatorSend",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "outstandingDebt",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "owner",
              "outputs": [
                {
                  "internalType": "address",
                  "name": "",
                  "type": "address"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "paused",
              "outputs": [
                {
                  "internalType": "bool",
                  "name": "",
                  "type": "bool"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "uint256",
                  "name": "assets",
                  "type": "uint256"
                }
              ],
              "name": "previewDeposit",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "uint256",
                  "name": "shares",
                  "type": "uint256"
                }
              ],
              "name": "previewMint",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "uint256",
                  "name": "shares",
                  "type": "uint256"
                }
              ],
              "name": "previewRedeem",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "uint256",
                  "name": "assets",
                  "type": "uint256"
                }
              ],
              "name": "previewWithdraw",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "proxiableUUID",
              "outputs": [
                {
                  "internalType": "bytes32",
                  "name": "",
                  "type": "bytes32"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "uint256",
                  "name": "shares",
                  "type": "uint256"
                },
                {
                  "internalType": "address",
                  "name": "",
                  "type": "address"
                },
                {
                  "internalType": "address",
                  "name": "",
                  "type": "address"
                }
              ],
              "name": "redeem",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "assets",
                  "type": "uint256"
                }
              ],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "uint256",
                  "name": "shares",
                  "type": "uint256"
                }
              ],
              "name": "redeem",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "assets",
                  "type": "uint256"
                }
              ],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "strategy",
                  "type": "address"
                },
                {
                  "internalType": "bool",
                  "name": "fromQueueOnly",
                  "type": "bool"
                }
              ],
              "name": "removeStrategy",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "renounceOwnership",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "address[]",
                  "name": "queue",
                  "type": "address[]"
                }
              ],
              "name": "reorderWithdrawalQueue",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "uint256",
                  "name": "loss",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "debtPayment",
                  "type": "uint256"
                }
              ],
              "name": "reportNegativeDebtManagement",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "uint256",
                  "name": "extraFreeFunds",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "debtPayment",
                  "type": "uint256"
                }
              ],
              "name": "reportPositiveDebtManagement",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "operator",
                  "type": "address"
                }
              ],
              "name": "revokeOperator",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "strategy",
                  "type": "address"
                }
              ],
              "name": "revokeStrategy",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "rewards",
              "outputs": [
                {
                  "internalType": "address",
                  "name": "",
                  "type": "address"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "recipient",
                  "type": "address"
                },
                {
                  "internalType": "uint256",
                  "name": "amount",
                  "type": "uint256"
                },
                {
                  "internalType": "bytes",
                  "name": "data",
                  "type": "bytes"
                }
              ],
              "name": "send",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "bool",
                  "name": "shutdown",
                  "type": "bool"
                }
              ],
              "name": "setEmergencyShutdown",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "uint256",
                  "name": "rate",
                  "type": "uint256"
                }
              ],
              "name": "setLockedProfitReleaseRate",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "uint256",
                  "name": "_managementFee",
                  "type": "uint256"
                }
              ],
              "name": "setManagementFee",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "_rewards",
                  "type": "address"
                }
              ],
              "name": "setRewards",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "strategy",
                  "type": "address"
                }
              ],
              "name": "strategyDebt",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "strategy",
                  "type": "address"
                }
              ],
              "name": "strategyRatio",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "symbol",
              "outputs": [
                {
                  "internalType": "string",
                  "name": "",
                  "type": "string"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "totalAssets",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "totalDebt",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "totalSupply",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "recipient",
                  "type": "address"
                },
                {
                  "internalType": "uint256",
                  "name": "amount",
                  "type": "uint256"
                }
              ],
              "name": "transfer",
              "outputs": [
                {
                  "internalType": "bool",
                  "name": "",
                  "type": "bool"
                }
              ],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "holder",
                  "type": "address"
                },
                {
                  "internalType": "address",
                  "name": "recipient",
                  "type": "address"
                },
                {
                  "internalType": "uint256",
                  "name": "amount",
                  "type": "uint256"
                }
              ],
              "name": "transferFrom",
              "outputs": [
                {
                  "internalType": "bool",
                  "name": "",
                  "type": "bool"
                }
              ],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "newOwner",
                  "type": "address"
                }
              ],
              "name": "transferOwnership",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "newImplementation",
                  "type": "address"
                }
              ],
              "name": "upgradeTo",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "newImplementation",
                  "type": "address"
                },
                {
                  "internalType": "bytes",
                  "name": "data",
                  "type": "bytes"
                }
              ],
              "name": "upgradeToAndCall",
              "outputs": [],
              "stateMutability": "payable",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "version",
              "outputs": [
                {
                  "internalType": "string",
                  "name": "",
                  "type": "string"
                }
              ],
              "stateMutability": "pure",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "uint256",
                  "name": "assets",
                  "type": "uint256"
                }
              ],
              "name": "withdraw",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "shares",
                  "type": "uint256"
                }
              ],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "uint256",
                  "name": "assets",
                  "type": "uint256"
                },
                {
                  "internalType": "address",
                  "name": "",
                  "type": "address"
                },
                {
                  "internalType": "address",
                  "name": "",
                  "type": "address"
                }
              ],
              "name": "withdraw",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "shares",
                  "type": "uint256"
                }
              ],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "name": "withdrawalQueue",
              "outputs": [
                {
                  "internalType": "address",
                  "name": "",
                  "type": "address"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            }
          ]
        },
        "Vault_Proxy": {
          "address": "0xa3923Fa94c7332e2561E88290B884419dca9E23C",
          "abi": [
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "_logic",
                  "type": "address"
                },
                {
                  "internalType": "bytes",
                  "name": "_data",
                  "type": "bytes"
                }
              ],
              "stateMutability": "payable",
              "type": "constructor"
            },
            {
              "anonymous": false,
              "inputs": [
                {
                  "indexed": false,
                  "internalType": "address",
                  "name": "previousAdmin",
                  "type": "address"
                },
                {
                  "indexed": false,
                  "internalType": "address",
                  "name": "newAdmin",
                  "type": "address"
                }
              ],
              "name": "AdminChanged",
              "type": "event"
            },
            {
              "anonymous": false,
              "inputs": [
                {
                  "indexed": true,
                  "internalType": "address",
                  "name": "beacon",
                  "type": "address"
                }
              ],
              "name": "BeaconUpgraded",
              "type": "event"
            },
            {
              "anonymous": false,
              "inputs": [
                {
                  "indexed": true,
                  "internalType": "address",
                  "name": "implementation",
                  "type": "address"
                }
              ],
              "name": "Upgraded",
              "type": "event"
            },
            {
              "stateMutability": "payable",
              "type": "fallback"
            },
            {
              "stateMutability": "payable",
              "type": "receive"
            }
          ]
        }
      }
    }
  ],
  "11155111": [
    {
      "name": "sepolia",
      "chainId": "11155111",
      "contracts": {
        "Vault": {
          "address": "0x035dfF040fF12a727f95D7059Eaf41204D2330d5",
          "abi": [
            {
              "anonymous": false,
              "inputs": [
                {
                  "indexed": false,
                  "internalType": "address",
                  "name": "previousAdmin",
                  "type": "address"
                },
                {
                  "indexed": false,
                  "internalType": "address",
                  "name": "newAdmin",
                  "type": "address"
                }
              ],
              "name": "AdminChanged",
              "type": "event"
            },
            {
              "anonymous": false,
              "inputs": [
                {
                  "indexed": true,
                  "internalType": "address",
                  "name": "beacon",
                  "type": "address"
                }
              ],
              "name": "BeaconUpgraded",
              "type": "event"
            },
            {
              "anonymous": false,
              "inputs": [
                {
                  "indexed": true,
                  "internalType": "address",
                  "name": "implementation",
                  "type": "address"
                }
              ],
              "name": "Upgraded",
              "type": "event"
            },
            {
              "stateMutability": "payable",
              "type": "fallback"
            },
            {
              "stateMutability": "payable",
              "type": "receive"
            },
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "caller",
                  "type": "address"
                }
              ],
              "name": "AccessDeniedForCaller",
              "type": "error"
            },
            {
              "inputs": [],
              "name": "BorrowerAlreadyExists",
              "type": "error"
            },
            {
              "inputs": [],
              "name": "BorrowerDoesNotExist",
              "type": "error"
            },
            {
              "inputs": [],
              "name": "BorrowerHasDebt",
              "type": "error"
            },
            {
              "inputs": [],
              "name": "CallerIsNotABorrower",
              "type": "error"
            },
            {
              "inputs": [],
              "name": "ExceededMaximumFeeValue",
              "type": "error"
            },
            {
              "inputs": [],
              "name": "FalsePositiveReport",
              "type": "error"
            },
            {
              "inputs": [],
              "name": "InappropriateStrategy",
              "type": "error"
            },
            {
              "inputs": [
                {
                  "internalType": "uint256",
                  "name": "assets",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "shares",
                  "type": "uint256"
                }
              ],
              "name": "InsufficientVaultBalance",
              "type": "error"
            },
            {
              "inputs": [
                {
                  "internalType": "uint256",
                  "name": "durationInSeconds",
                  "type": "uint256"
                }
              ],
              "name": "InvalidLockedProfitReleaseRate",
              "type": "error"
            },
            {
              "inputs": [
                {
                  "internalType": "uint256",
                  "name": "freeRatio",
                  "type": "uint256"
                }
              ],
              "name": "LenderRatioExceeded",
              "type": "error"
            },
            {
              "inputs": [],
              "name": "ListsDoNotMatch",
              "type": "error"
            },
            {
              "inputs": [],
              "name": "StrategyAlreadyExists",
              "type": "error"
            },
            {
              "inputs": [],
              "name": "StrategyNotFound",
              "type": "error"
            },
            {
              "inputs": [],
              "name": "UnexpectedZeroAddress",
              "type": "error"
            },
            {
              "anonymous": false,
              "inputs": [
                {
                  "indexed": true,
                  "internalType": "address",
                  "name": "owner",
                  "type": "address"
                },
                {
                  "indexed": true,
                  "internalType": "address",
                  "name": "spender",
                  "type": "address"
                },
                {
                  "indexed": false,
                  "internalType": "uint256",
                  "name": "value",
                  "type": "uint256"
                }
              ],
              "name": "Approval",
              "type": "event"
            },
            {
              "anonymous": false,
              "inputs": [
                {
                  "indexed": true,
                  "internalType": "address",
                  "name": "operator",
                  "type": "address"
                },
                {
                  "indexed": true,
                  "internalType": "address",
                  "name": "tokenHolder",
                  "type": "address"
                }
              ],
              "name": "AuthorizedOperator",
              "type": "event"
            },
            {
              "anonymous": false,
              "inputs": [
                {
                  "indexed": true,
                  "internalType": "address",
                  "name": "borrower",
                  "type": "address"
                },
                {
                  "indexed": false,
                  "internalType": "uint256",
                  "name": "debtPayment",
                  "type": "uint256"
                },
                {
                  "indexed": false,
                  "internalType": "uint256",
                  "name": "freeFunds",
                  "type": "uint256"
                },
                {
                  "indexed": false,
                  "internalType": "uint256",
                  "name": "fundsGiven",
                  "type": "uint256"
                },
                {
                  "indexed": false,
                  "internalType": "uint256",
                  "name": "fundsTaken",
                  "type": "uint256"
                },
                {
                  "indexed": false,
                  "internalType": "uint256",
                  "name": "loss",
                  "type": "uint256"
                }
              ],
              "name": "BorrowerDebtManagementReported",
              "type": "event"
            },
            {
              "anonymous": false,
              "inputs": [
                {
                  "indexed": true,
                  "internalType": "address",
                  "name": "operator",
                  "type": "address"
                },
                {
                  "indexed": true,
                  "internalType": "address",
                  "name": "from",
                  "type": "address"
                },
                {
                  "indexed": false,
                  "internalType": "uint256",
                  "name": "amount",
                  "type": "uint256"
                },
                {
                  "indexed": false,
                  "internalType": "bytes",
                  "name": "data",
                  "type": "bytes"
                },
                {
                  "indexed": false,
                  "internalType": "bytes",
                  "name": "operatorData",
                  "type": "bytes"
                }
              ],
              "name": "Burned",
              "type": "event"
            },
            {
              "anonymous": false,
              "inputs": [
                {
                  "indexed": true,
                  "internalType": "address",
                  "name": "caller",
                  "type": "address"
                },
                {
                  "indexed": true,
                  "internalType": "address",
                  "name": "owner",
                  "type": "address"
                },
                {
                  "indexed": false,
                  "internalType": "uint256",
                  "name": "assets",
                  "type": "uint256"
                },
                {
                  "indexed": false,
                  "internalType": "uint256",
                  "name": "shares",
                  "type": "uint256"
                }
              ],
              "name": "Deposit",
              "type": "event"
            },
            {
              "anonymous": false,
              "inputs": [
                {
                  "indexed": false,
                  "internalType": "uint8",
                  "name": "version",
                  "type": "uint8"
                }
              ],
              "name": "Initialized",
              "type": "event"
            },
            {
              "anonymous": false,
              "inputs": [
                {
                  "indexed": false,
                  "internalType": "uint256",
                  "name": "rate",
                  "type": "uint256"
                }
              ],
              "name": "LockedProfitReleaseRateChanged",
              "type": "event"
            },
            {
              "anonymous": false,
              "inputs": [
                {
                  "indexed": true,
                  "internalType": "address",
                  "name": "operator",
                  "type": "address"
                },
                {
                  "indexed": true,
                  "internalType": "address",
                  "name": "to",
                  "type": "address"
                },
                {
                  "indexed": false,
                  "internalType": "uint256",
                  "name": "amount",
                  "type": "uint256"
                },
                {
                  "indexed": false,
                  "internalType": "bytes",
                  "name": "data",
                  "type": "bytes"
                },
                {
                  "indexed": false,
                  "internalType": "bytes",
                  "name": "operatorData",
                  "type": "bytes"
                }
              ],
              "name": "Minted",
              "type": "event"
            },
            {
              "anonymous": false,
              "inputs": [
                {
                  "indexed": true,
                  "internalType": "address",
                  "name": "previousOwner",
                  "type": "address"
                },
                {
                  "indexed": true,
                  "internalType": "address",
                  "name": "newOwner",
                  "type": "address"
                }
              ],
              "name": "OwnershipTransferred",
              "type": "event"
            },
            {
              "anonymous": false,
              "inputs": [
                {
                  "indexed": false,
                  "internalType": "address",
                  "name": "account",
                  "type": "address"
                }
              ],
              "name": "Paused",
              "type": "event"
            },
            {
              "anonymous": false,
              "inputs": [
                {
                  "indexed": true,
                  "internalType": "address",
                  "name": "operator",
                  "type": "address"
                },
                {
                  "indexed": true,
                  "internalType": "address",
                  "name": "tokenHolder",
                  "type": "address"
                }
              ],
              "name": "RevokedOperator",
              "type": "event"
            },
            {
              "anonymous": false,
              "inputs": [
                {
                  "indexed": true,
                  "internalType": "address",
                  "name": "operator",
                  "type": "address"
                },
                {
                  "indexed": true,
                  "internalType": "address",
                  "name": "from",
                  "type": "address"
                },
                {
                  "indexed": true,
                  "internalType": "address",
                  "name": "to",
                  "type": "address"
                },
                {
                  "indexed": false,
                  "internalType": "uint256",
                  "name": "amount",
                  "type": "uint256"
                },
                {
                  "indexed": false,
                  "internalType": "bytes",
                  "name": "data",
                  "type": "bytes"
                },
                {
                  "indexed": false,
                  "internalType": "bytes",
                  "name": "operatorData",
                  "type": "bytes"
                }
              ],
              "name": "Sent",
              "type": "event"
            },
            {
              "anonymous": false,
              "inputs": [
                {
                  "indexed": true,
                  "internalType": "address",
                  "name": "strategy",
                  "type": "address"
                },
                {
                  "indexed": false,
                  "internalType": "uint256",
                  "name": "debtRatio",
                  "type": "uint256"
                }
              ],
              "name": "StrategyAdded",
              "type": "event"
            },
            {
              "anonymous": false,
              "inputs": [
                {
                  "indexed": true,
                  "internalType": "address",
                  "name": "strategy",
                  "type": "address"
                },
                {
                  "indexed": false,
                  "internalType": "bool",
                  "name": "fromQueueOnly",
                  "type": "bool"
                }
              ],
              "name": "StrategyRemoved",
              "type": "event"
            },
            {
              "anonymous": false,
              "inputs": [
                {
                  "indexed": true,
                  "internalType": "address",
                  "name": "strategy",
                  "type": "address"
                }
              ],
              "name": "StrategyReturnedToQueue",
              "type": "event"
            },
            {
              "anonymous": false,
              "inputs": [
                {
                  "indexed": true,
                  "internalType": "address",
                  "name": "strategy",
                  "type": "address"
                }
              ],
              "name": "StrategyRevoked",
              "type": "event"
            },
            {
              "anonymous": false,
              "inputs": [
                {
                  "indexed": true,
                  "internalType": "address",
                  "name": "from",
                  "type": "address"
                },
                {
                  "indexed": true,
                  "internalType": "address",
                  "name": "to",
                  "type": "address"
                },
                {
                  "indexed": false,
                  "internalType": "uint256",
                  "name": "value",
                  "type": "uint256"
                }
              ],
              "name": "Transfer",
              "type": "event"
            },
            {
              "anonymous": false,
              "inputs": [
                {
                  "indexed": false,
                  "internalType": "address",
                  "name": "account",
                  "type": "address"
                }
              ],
              "name": "Unpaused",
              "type": "event"
            },
            {
              "anonymous": false,
              "inputs": [
                {
                  "indexed": true,
                  "internalType": "address",
                  "name": "caller",
                  "type": "address"
                },
                {
                  "indexed": true,
                  "internalType": "address",
                  "name": "receiver",
                  "type": "address"
                },
                {
                  "indexed": true,
                  "internalType": "address",
                  "name": "owner",
                  "type": "address"
                },
                {
                  "indexed": false,
                  "internalType": "uint256",
                  "name": "assets",
                  "type": "uint256"
                },
                {
                  "indexed": false,
                  "internalType": "uint256",
                  "name": "shares",
                  "type": "uint256"
                }
              ],
              "name": "Withdraw",
              "type": "event"
            },
            {
              "inputs": [],
              "name": "LOCKED_PROFIT_RELEASE_SCALE",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "MAX_BPS",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "strategy",
                  "type": "address"
                },
                {
                  "internalType": "uint256",
                  "name": "debtRatio",
                  "type": "uint256"
                }
              ],
              "name": "addStrategy",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "strategy",
                  "type": "address"
                }
              ],
              "name": "addStrategyToQueue",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "holder",
                  "type": "address"
                },
                {
                  "internalType": "address",
                  "name": "spender",
                  "type": "address"
                }
              ],
              "name": "allowance",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "spender",
                  "type": "address"
                },
                {
                  "internalType": "uint256",
                  "name": "value",
                  "type": "uint256"
                }
              ],
              "name": "approve",
              "outputs": [
                {
                  "internalType": "bool",
                  "name": "",
                  "type": "bool"
                }
              ],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "asset",
              "outputs": [
                {
                  "internalType": "contract IERC20Upgradeable",
                  "name": "",
                  "type": "address"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "operator",
                  "type": "address"
                }
              ],
              "name": "authorizeOperator",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "availableCredit",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "tokenHolder",
                  "type": "address"
                }
              ],
              "name": "balanceOf",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "",
                  "type": "address"
                }
              ],
              "name": "borrowersData",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "activationTimestamp",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "lastReportTimestamp",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "debt",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "debtRatio",
                  "type": "uint256"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "uint256",
                  "name": "amount",
                  "type": "uint256"
                },
                {
                  "internalType": "bytes",
                  "name": "data",
                  "type": "bytes"
                }
              ],
              "name": "burn",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "uint256",
                  "name": "shares",
                  "type": "uint256"
                }
              ],
              "name": "convertToAssets",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "uint256",
                  "name": "assets",
                  "type": "uint256"
                }
              ],
              "name": "convertToShares",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "currentDebt",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "borrower",
                  "type": "address"
                }
              ],
              "name": "currentDebt",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "currentDebtRatio",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "debtRatio",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "decimals",
              "outputs": [
                {
                  "internalType": "uint8",
                  "name": "",
                  "type": "uint8"
                }
              ],
              "stateMutability": "pure",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "defaultOperators",
              "outputs": [
                {
                  "internalType": "address[]",
                  "name": "",
                  "type": "address[]"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "uint256",
                  "name": "assets",
                  "type": "uint256"
                },
                {
                  "internalType": "address",
                  "name": "",
                  "type": "address"
                }
              ],
              "name": "deposit",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "shares",
                  "type": "uint256"
                }
              ],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "uint256",
                  "name": "assets",
                  "type": "uint256"
                }
              ],
              "name": "deposit",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "shares",
                  "type": "uint256"
                }
              ],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "getQueueSize",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "granularity",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "_asset",
                  "type": "address"
                },
                {
                  "internalType": "address",
                  "name": "_rewards",
                  "type": "address"
                },
                {
                  "internalType": "uint256",
                  "name": "_managementFee",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "_lockedProfitReleaseRate",
                  "type": "uint256"
                },
                {
                  "internalType": "string",
                  "name": "_name",
                  "type": "string"
                },
                {
                  "internalType": "string",
                  "name": "_symbol",
                  "type": "string"
                },
                {
                  "internalType": "address[]",
                  "name": "_defaultOperators",
                  "type": "address[]"
                }
              ],
              "name": "initialize",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "isActivated",
              "outputs": [
                {
                  "internalType": "bool",
                  "name": "",
                  "type": "bool"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "borrower",
                  "type": "address"
                }
              ],
              "name": "isActivated",
              "outputs": [
                {
                  "internalType": "bool",
                  "name": "",
                  "type": "bool"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "operator",
                  "type": "address"
                },
                {
                  "internalType": "address",
                  "name": "tokenHolder",
                  "type": "address"
                }
              ],
              "name": "isOperatorFor",
              "outputs": [
                {
                  "internalType": "bool",
                  "name": "",
                  "type": "bool"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "borrower",
                  "type": "address"
                }
              ],
              "name": "lastReport",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "lastReport",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "lastReportTimestamp",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "lendingAssets",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "lockedProfitBaseline",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "lockedProfitReleaseRate",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "managementFee",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "",
                  "type": "address"
                }
              ],
              "name": "maxDeposit",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "",
                  "type": "address"
                }
              ],
              "name": "maxMint",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "owner",
                  "type": "address"
                }
              ],
              "name": "maxRedeem",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "owner",
                  "type": "address"
                }
              ],
              "name": "maxWithdraw",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "uint256",
                  "name": "shares",
                  "type": "uint256"
                },
                {
                  "internalType": "address",
                  "name": "",
                  "type": "address"
                }
              ],
              "name": "mint",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "assets",
                  "type": "uint256"
                }
              ],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "uint256",
                  "name": "shares",
                  "type": "uint256"
                }
              ],
              "name": "mint",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "assets",
                  "type": "uint256"
                }
              ],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "name",
              "outputs": [
                {
                  "internalType": "string",
                  "name": "",
                  "type": "string"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "account",
                  "type": "address"
                },
                {
                  "internalType": "uint256",
                  "name": "amount",
                  "type": "uint256"
                },
                {
                  "internalType": "bytes",
                  "name": "data",
                  "type": "bytes"
                },
                {
                  "internalType": "bytes",
                  "name": "operatorData",
                  "type": "bytes"
                }
              ],
              "name": "operatorBurn",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "sender",
                  "type": "address"
                },
                {
                  "internalType": "address",
                  "name": "recipient",
                  "type": "address"
                },
                {
                  "internalType": "uint256",
                  "name": "amount",
                  "type": "uint256"
                },
                {
                  "internalType": "bytes",
                  "name": "data",
                  "type": "bytes"
                },
                {
                  "internalType": "bytes",
                  "name": "operatorData",
                  "type": "bytes"
                }
              ],
              "name": "operatorSend",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "outstandingDebt",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "owner",
              "outputs": [
                {
                  "internalType": "address",
                  "name": "",
                  "type": "address"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "paused",
              "outputs": [
                {
                  "internalType": "bool",
                  "name": "",
                  "type": "bool"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "uint256",
                  "name": "assets",
                  "type": "uint256"
                }
              ],
              "name": "previewDeposit",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "uint256",
                  "name": "shares",
                  "type": "uint256"
                }
              ],
              "name": "previewMint",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "uint256",
                  "name": "shares",
                  "type": "uint256"
                }
              ],
              "name": "previewRedeem",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "uint256",
                  "name": "assets",
                  "type": "uint256"
                }
              ],
              "name": "previewWithdraw",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "proxiableUUID",
              "outputs": [
                {
                  "internalType": "bytes32",
                  "name": "",
                  "type": "bytes32"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "uint256",
                  "name": "shares",
                  "type": "uint256"
                },
                {
                  "internalType": "address",
                  "name": "",
                  "type": "address"
                },
                {
                  "internalType": "address",
                  "name": "",
                  "type": "address"
                }
              ],
              "name": "redeem",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "assets",
                  "type": "uint256"
                }
              ],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "uint256",
                  "name": "shares",
                  "type": "uint256"
                }
              ],
              "name": "redeem",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "assets",
                  "type": "uint256"
                }
              ],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "strategy",
                  "type": "address"
                },
                {
                  "internalType": "bool",
                  "name": "fromQueueOnly",
                  "type": "bool"
                }
              ],
              "name": "removeStrategy",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "renounceOwnership",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "address[]",
                  "name": "queue",
                  "type": "address[]"
                }
              ],
              "name": "reorderWithdrawalQueue",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "uint256",
                  "name": "loss",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "debtPayment",
                  "type": "uint256"
                }
              ],
              "name": "reportNegativeDebtManagement",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "uint256",
                  "name": "extraFreeFunds",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "debtPayment",
                  "type": "uint256"
                }
              ],
              "name": "reportPositiveDebtManagement",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "operator",
                  "type": "address"
                }
              ],
              "name": "revokeOperator",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "strategy",
                  "type": "address"
                }
              ],
              "name": "revokeStrategy",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "rewards",
              "outputs": [
                {
                  "internalType": "address",
                  "name": "",
                  "type": "address"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "recipient",
                  "type": "address"
                },
                {
                  "internalType": "uint256",
                  "name": "amount",
                  "type": "uint256"
                },
                {
                  "internalType": "bytes",
                  "name": "data",
                  "type": "bytes"
                }
              ],
              "name": "send",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "bool",
                  "name": "shutdown",
                  "type": "bool"
                }
              ],
              "name": "setEmergencyShutdown",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "uint256",
                  "name": "rate",
                  "type": "uint256"
                }
              ],
              "name": "setLockedProfitReleaseRate",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "uint256",
                  "name": "_managementFee",
                  "type": "uint256"
                }
              ],
              "name": "setManagementFee",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "_rewards",
                  "type": "address"
                }
              ],
              "name": "setRewards",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "strategy",
                  "type": "address"
                }
              ],
              "name": "strategyDebt",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "strategy",
                  "type": "address"
                }
              ],
              "name": "strategyRatio",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "symbol",
              "outputs": [
                {
                  "internalType": "string",
                  "name": "",
                  "type": "string"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "totalAssets",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "totalDebt",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "totalSupply",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "recipient",
                  "type": "address"
                },
                {
                  "internalType": "uint256",
                  "name": "amount",
                  "type": "uint256"
                }
              ],
              "name": "transfer",
              "outputs": [
                {
                  "internalType": "bool",
                  "name": "",
                  "type": "bool"
                }
              ],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "holder",
                  "type": "address"
                },
                {
                  "internalType": "address",
                  "name": "recipient",
                  "type": "address"
                },
                {
                  "internalType": "uint256",
                  "name": "amount",
                  "type": "uint256"
                }
              ],
              "name": "transferFrom",
              "outputs": [
                {
                  "internalType": "bool",
                  "name": "",
                  "type": "bool"
                }
              ],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "newOwner",
                  "type": "address"
                }
              ],
              "name": "transferOwnership",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "newImplementation",
                  "type": "address"
                }
              ],
              "name": "upgradeTo",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "newImplementation",
                  "type": "address"
                },
                {
                  "internalType": "bytes",
                  "name": "data",
                  "type": "bytes"
                }
              ],
              "name": "upgradeToAndCall",
              "outputs": [],
              "stateMutability": "payable",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "version",
              "outputs": [
                {
                  "internalType": "string",
                  "name": "",
                  "type": "string"
                }
              ],
              "stateMutability": "pure",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "uint256",
                  "name": "assets",
                  "type": "uint256"
                }
              ],
              "name": "withdraw",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "shares",
                  "type": "uint256"
                }
              ],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "uint256",
                  "name": "assets",
                  "type": "uint256"
                },
                {
                  "internalType": "address",
                  "name": "",
                  "type": "address"
                },
                {
                  "internalType": "address",
                  "name": "",
                  "type": "address"
                }
              ],
              "name": "withdraw",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "shares",
                  "type": "uint256"
                }
              ],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "name": "withdrawalQueue",
              "outputs": [
                {
                  "internalType": "address",
                  "name": "",
                  "type": "address"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "_logic",
                  "type": "address"
                },
                {
                  "internalType": "bytes",
                  "name": "_data",
                  "type": "bytes"
                }
              ],
              "stateMutability": "payable",
              "type": "constructor"
            }
          ]
        },
        "Vault_Implementation": {
          "address": "0xe3564AbdDaEfEdF9EDFfB5056c2C3d451eD9f6Ea",
          "abi": [
            {
              "inputs": [
                {
                  "internalType": "bool",
                  "name": "needDisableInitializers",
                  "type": "bool"
                }
              ],
              "stateMutability": "nonpayable",
              "type": "constructor"
            },
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "caller",
                  "type": "address"
                }
              ],
              "name": "AccessDeniedForCaller",
              "type": "error"
            },
            {
              "inputs": [],
              "name": "BorrowerAlreadyExists",
              "type": "error"
            },
            {
              "inputs": [],
              "name": "BorrowerDoesNotExist",
              "type": "error"
            },
            {
              "inputs": [],
              "name": "BorrowerHasDebt",
              "type": "error"
            },
            {
              "inputs": [],
              "name": "CallerIsNotABorrower",
              "type": "error"
            },
            {
              "inputs": [],
              "name": "ExceededMaximumFeeValue",
              "type": "error"
            },
            {
              "inputs": [],
              "name": "FalsePositiveReport",
              "type": "error"
            },
            {
              "inputs": [],
              "name": "InappropriateStrategy",
              "type": "error"
            },
            {
              "inputs": [
                {
                  "internalType": "uint256",
                  "name": "assets",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "shares",
                  "type": "uint256"
                }
              ],
              "name": "InsufficientVaultBalance",
              "type": "error"
            },
            {
              "inputs": [
                {
                  "internalType": "uint256",
                  "name": "durationInSeconds",
                  "type": "uint256"
                }
              ],
              "name": "InvalidLockedProfitReleaseRate",
              "type": "error"
            },
            {
              "inputs": [
                {
                  "internalType": "uint256",
                  "name": "freeRatio",
                  "type": "uint256"
                }
              ],
              "name": "LenderRatioExceeded",
              "type": "error"
            },
            {
              "inputs": [],
              "name": "ListsDoNotMatch",
              "type": "error"
            },
            {
              "inputs": [],
              "name": "StrategyAlreadyExists",
              "type": "error"
            },
            {
              "inputs": [],
              "name": "StrategyNotFound",
              "type": "error"
            },
            {
              "inputs": [],
              "name": "UnexpectedZeroAddress",
              "type": "error"
            },
            {
              "anonymous": false,
              "inputs": [
                {
                  "indexed": false,
                  "internalType": "address",
                  "name": "previousAdmin",
                  "type": "address"
                },
                {
                  "indexed": false,
                  "internalType": "address",
                  "name": "newAdmin",
                  "type": "address"
                }
              ],
              "name": "AdminChanged",
              "type": "event"
            },
            {
              "anonymous": false,
              "inputs": [
                {
                  "indexed": true,
                  "internalType": "address",
                  "name": "owner",
                  "type": "address"
                },
                {
                  "indexed": true,
                  "internalType": "address",
                  "name": "spender",
                  "type": "address"
                },
                {
                  "indexed": false,
                  "internalType": "uint256",
                  "name": "value",
                  "type": "uint256"
                }
              ],
              "name": "Approval",
              "type": "event"
            },
            {
              "anonymous": false,
              "inputs": [
                {
                  "indexed": true,
                  "internalType": "address",
                  "name": "operator",
                  "type": "address"
                },
                {
                  "indexed": true,
                  "internalType": "address",
                  "name": "tokenHolder",
                  "type": "address"
                }
              ],
              "name": "AuthorizedOperator",
              "type": "event"
            },
            {
              "anonymous": false,
              "inputs": [
                {
                  "indexed": true,
                  "internalType": "address",
                  "name": "beacon",
                  "type": "address"
                }
              ],
              "name": "BeaconUpgraded",
              "type": "event"
            },
            {
              "anonymous": false,
              "inputs": [
                {
                  "indexed": true,
                  "internalType": "address",
                  "name": "borrower",
                  "type": "address"
                },
                {
                  "indexed": false,
                  "internalType": "uint256",
                  "name": "debtPayment",
                  "type": "uint256"
                },
                {
                  "indexed": false,
                  "internalType": "uint256",
                  "name": "freeFunds",
                  "type": "uint256"
                },
                {
                  "indexed": false,
                  "internalType": "uint256",
                  "name": "fundsGiven",
                  "type": "uint256"
                },
                {
                  "indexed": false,
                  "internalType": "uint256",
                  "name": "fundsTaken",
                  "type": "uint256"
                },
                {
                  "indexed": false,
                  "internalType": "uint256",
                  "name": "loss",
                  "type": "uint256"
                }
              ],
              "name": "BorrowerDebtManagementReported",
              "type": "event"
            },
            {
              "anonymous": false,
              "inputs": [
                {
                  "indexed": true,
                  "internalType": "address",
                  "name": "operator",
                  "type": "address"
                },
                {
                  "indexed": true,
                  "internalType": "address",
                  "name": "from",
                  "type": "address"
                },
                {
                  "indexed": false,
                  "internalType": "uint256",
                  "name": "amount",
                  "type": "uint256"
                },
                {
                  "indexed": false,
                  "internalType": "bytes",
                  "name": "data",
                  "type": "bytes"
                },
                {
                  "indexed": false,
                  "internalType": "bytes",
                  "name": "operatorData",
                  "type": "bytes"
                }
              ],
              "name": "Burned",
              "type": "event"
            },
            {
              "anonymous": false,
              "inputs": [
                {
                  "indexed": true,
                  "internalType": "address",
                  "name": "caller",
                  "type": "address"
                },
                {
                  "indexed": true,
                  "internalType": "address",
                  "name": "owner",
                  "type": "address"
                },
                {
                  "indexed": false,
                  "internalType": "uint256",
                  "name": "assets",
                  "type": "uint256"
                },
                {
                  "indexed": false,
                  "internalType": "uint256",
                  "name": "shares",
                  "type": "uint256"
                }
              ],
              "name": "Deposit",
              "type": "event"
            },
            {
              "anonymous": false,
              "inputs": [
                {
                  "indexed": false,
                  "internalType": "uint8",
                  "name": "version",
                  "type": "uint8"
                }
              ],
              "name": "Initialized",
              "type": "event"
            },
            {
              "anonymous": false,
              "inputs": [
                {
                  "indexed": false,
                  "internalType": "uint256",
                  "name": "rate",
                  "type": "uint256"
                }
              ],
              "name": "LockedProfitReleaseRateChanged",
              "type": "event"
            },
            {
              "anonymous": false,
              "inputs": [
                {
                  "indexed": true,
                  "internalType": "address",
                  "name": "operator",
                  "type": "address"
                },
                {
                  "indexed": true,
                  "internalType": "address",
                  "name": "to",
                  "type": "address"
                },
                {
                  "indexed": false,
                  "internalType": "uint256",
                  "name": "amount",
                  "type": "uint256"
                },
                {
                  "indexed": false,
                  "internalType": "bytes",
                  "name": "data",
                  "type": "bytes"
                },
                {
                  "indexed": false,
                  "internalType": "bytes",
                  "name": "operatorData",
                  "type": "bytes"
                }
              ],
              "name": "Minted",
              "type": "event"
            },
            {
              "anonymous": false,
              "inputs": [
                {
                  "indexed": true,
                  "internalType": "address",
                  "name": "previousOwner",
                  "type": "address"
                },
                {
                  "indexed": true,
                  "internalType": "address",
                  "name": "newOwner",
                  "type": "address"
                }
              ],
              "name": "OwnershipTransferred",
              "type": "event"
            },
            {
              "anonymous": false,
              "inputs": [
                {
                  "indexed": false,
                  "internalType": "address",
                  "name": "account",
                  "type": "address"
                }
              ],
              "name": "Paused",
              "type": "event"
            },
            {
              "anonymous": false,
              "inputs": [
                {
                  "indexed": true,
                  "internalType": "address",
                  "name": "operator",
                  "type": "address"
                },
                {
                  "indexed": true,
                  "internalType": "address",
                  "name": "tokenHolder",
                  "type": "address"
                }
              ],
              "name": "RevokedOperator",
              "type": "event"
            },
            {
              "anonymous": false,
              "inputs": [
                {
                  "indexed": true,
                  "internalType": "address",
                  "name": "operator",
                  "type": "address"
                },
                {
                  "indexed": true,
                  "internalType": "address",
                  "name": "from",
                  "type": "address"
                },
                {
                  "indexed": true,
                  "internalType": "address",
                  "name": "to",
                  "type": "address"
                },
                {
                  "indexed": false,
                  "internalType": "uint256",
                  "name": "amount",
                  "type": "uint256"
                },
                {
                  "indexed": false,
                  "internalType": "bytes",
                  "name": "data",
                  "type": "bytes"
                },
                {
                  "indexed": false,
                  "internalType": "bytes",
                  "name": "operatorData",
                  "type": "bytes"
                }
              ],
              "name": "Sent",
              "type": "event"
            },
            {
              "anonymous": false,
              "inputs": [
                {
                  "indexed": true,
                  "internalType": "address",
                  "name": "strategy",
                  "type": "address"
                },
                {
                  "indexed": false,
                  "internalType": "uint256",
                  "name": "debtRatio",
                  "type": "uint256"
                }
              ],
              "name": "StrategyAdded",
              "type": "event"
            },
            {
              "anonymous": false,
              "inputs": [
                {
                  "indexed": true,
                  "internalType": "address",
                  "name": "strategy",
                  "type": "address"
                },
                {
                  "indexed": false,
                  "internalType": "bool",
                  "name": "fromQueueOnly",
                  "type": "bool"
                }
              ],
              "name": "StrategyRemoved",
              "type": "event"
            },
            {
              "anonymous": false,
              "inputs": [
                {
                  "indexed": true,
                  "internalType": "address",
                  "name": "strategy",
                  "type": "address"
                }
              ],
              "name": "StrategyReturnedToQueue",
              "type": "event"
            },
            {
              "anonymous": false,
              "inputs": [
                {
                  "indexed": true,
                  "internalType": "address",
                  "name": "strategy",
                  "type": "address"
                }
              ],
              "name": "StrategyRevoked",
              "type": "event"
            },
            {
              "anonymous": false,
              "inputs": [
                {
                  "indexed": true,
                  "internalType": "address",
                  "name": "from",
                  "type": "address"
                },
                {
                  "indexed": true,
                  "internalType": "address",
                  "name": "to",
                  "type": "address"
                },
                {
                  "indexed": false,
                  "internalType": "uint256",
                  "name": "value",
                  "type": "uint256"
                }
              ],
              "name": "Transfer",
              "type": "event"
            },
            {
              "anonymous": false,
              "inputs": [
                {
                  "indexed": false,
                  "internalType": "address",
                  "name": "account",
                  "type": "address"
                }
              ],
              "name": "Unpaused",
              "type": "event"
            },
            {
              "anonymous": false,
              "inputs": [
                {
                  "indexed": true,
                  "internalType": "address",
                  "name": "implementation",
                  "type": "address"
                }
              ],
              "name": "Upgraded",
              "type": "event"
            },
            {
              "anonymous": false,
              "inputs": [
                {
                  "indexed": true,
                  "internalType": "address",
                  "name": "caller",
                  "type": "address"
                },
                {
                  "indexed": true,
                  "internalType": "address",
                  "name": "receiver",
                  "type": "address"
                },
                {
                  "indexed": true,
                  "internalType": "address",
                  "name": "owner",
                  "type": "address"
                },
                {
                  "indexed": false,
                  "internalType": "uint256",
                  "name": "assets",
                  "type": "uint256"
                },
                {
                  "indexed": false,
                  "internalType": "uint256",
                  "name": "shares",
                  "type": "uint256"
                }
              ],
              "name": "Withdraw",
              "type": "event"
            },
            {
              "inputs": [],
              "name": "LOCKED_PROFIT_RELEASE_SCALE",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "MAX_BPS",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "strategy",
                  "type": "address"
                },
                {
                  "internalType": "uint256",
                  "name": "debtRatio",
                  "type": "uint256"
                }
              ],
              "name": "addStrategy",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "strategy",
                  "type": "address"
                }
              ],
              "name": "addStrategyToQueue",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "holder",
                  "type": "address"
                },
                {
                  "internalType": "address",
                  "name": "spender",
                  "type": "address"
                }
              ],
              "name": "allowance",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "spender",
                  "type": "address"
                },
                {
                  "internalType": "uint256",
                  "name": "value",
                  "type": "uint256"
                }
              ],
              "name": "approve",
              "outputs": [
                {
                  "internalType": "bool",
                  "name": "",
                  "type": "bool"
                }
              ],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "asset",
              "outputs": [
                {
                  "internalType": "contract IERC20Upgradeable",
                  "name": "",
                  "type": "address"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "operator",
                  "type": "address"
                }
              ],
              "name": "authorizeOperator",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "availableCredit",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "tokenHolder",
                  "type": "address"
                }
              ],
              "name": "balanceOf",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "",
                  "type": "address"
                }
              ],
              "name": "borrowersData",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "activationTimestamp",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "lastReportTimestamp",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "debt",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "debtRatio",
                  "type": "uint256"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "uint256",
                  "name": "amount",
                  "type": "uint256"
                },
                {
                  "internalType": "bytes",
                  "name": "data",
                  "type": "bytes"
                }
              ],
              "name": "burn",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "uint256",
                  "name": "shares",
                  "type": "uint256"
                }
              ],
              "name": "convertToAssets",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "uint256",
                  "name": "assets",
                  "type": "uint256"
                }
              ],
              "name": "convertToShares",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "currentDebt",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "borrower",
                  "type": "address"
                }
              ],
              "name": "currentDebt",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "currentDebtRatio",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "debtRatio",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "decimals",
              "outputs": [
                {
                  "internalType": "uint8",
                  "name": "",
                  "type": "uint8"
                }
              ],
              "stateMutability": "pure",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "defaultOperators",
              "outputs": [
                {
                  "internalType": "address[]",
                  "name": "",
                  "type": "address[]"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "uint256",
                  "name": "assets",
                  "type": "uint256"
                },
                {
                  "internalType": "address",
                  "name": "",
                  "type": "address"
                }
              ],
              "name": "deposit",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "shares",
                  "type": "uint256"
                }
              ],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "uint256",
                  "name": "assets",
                  "type": "uint256"
                }
              ],
              "name": "deposit",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "shares",
                  "type": "uint256"
                }
              ],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "getQueueSize",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "granularity",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "_asset",
                  "type": "address"
                },
                {
                  "internalType": "address",
                  "name": "_rewards",
                  "type": "address"
                },
                {
                  "internalType": "uint256",
                  "name": "_managementFee",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "_lockedProfitReleaseRate",
                  "type": "uint256"
                },
                {
                  "internalType": "string",
                  "name": "_name",
                  "type": "string"
                },
                {
                  "internalType": "string",
                  "name": "_symbol",
                  "type": "string"
                },
                {
                  "internalType": "address[]",
                  "name": "_defaultOperators",
                  "type": "address[]"
                }
              ],
              "name": "initialize",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "isActivated",
              "outputs": [
                {
                  "internalType": "bool",
                  "name": "",
                  "type": "bool"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "borrower",
                  "type": "address"
                }
              ],
              "name": "isActivated",
              "outputs": [
                {
                  "internalType": "bool",
                  "name": "",
                  "type": "bool"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "operator",
                  "type": "address"
                },
                {
                  "internalType": "address",
                  "name": "tokenHolder",
                  "type": "address"
                }
              ],
              "name": "isOperatorFor",
              "outputs": [
                {
                  "internalType": "bool",
                  "name": "",
                  "type": "bool"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "borrower",
                  "type": "address"
                }
              ],
              "name": "lastReport",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "lastReport",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "lastReportTimestamp",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "lendingAssets",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "lockedProfitBaseline",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "lockedProfitReleaseRate",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "managementFee",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "",
                  "type": "address"
                }
              ],
              "name": "maxDeposit",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "",
                  "type": "address"
                }
              ],
              "name": "maxMint",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "owner",
                  "type": "address"
                }
              ],
              "name": "maxRedeem",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "owner",
                  "type": "address"
                }
              ],
              "name": "maxWithdraw",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "uint256",
                  "name": "shares",
                  "type": "uint256"
                },
                {
                  "internalType": "address",
                  "name": "",
                  "type": "address"
                }
              ],
              "name": "mint",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "assets",
                  "type": "uint256"
                }
              ],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "uint256",
                  "name": "shares",
                  "type": "uint256"
                }
              ],
              "name": "mint",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "assets",
                  "type": "uint256"
                }
              ],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "name",
              "outputs": [
                {
                  "internalType": "string",
                  "name": "",
                  "type": "string"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "account",
                  "type": "address"
                },
                {
                  "internalType": "uint256",
                  "name": "amount",
                  "type": "uint256"
                },
                {
                  "internalType": "bytes",
                  "name": "data",
                  "type": "bytes"
                },
                {
                  "internalType": "bytes",
                  "name": "operatorData",
                  "type": "bytes"
                }
              ],
              "name": "operatorBurn",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "sender",
                  "type": "address"
                },
                {
                  "internalType": "address",
                  "name": "recipient",
                  "type": "address"
                },
                {
                  "internalType": "uint256",
                  "name": "amount",
                  "type": "uint256"
                },
                {
                  "internalType": "bytes",
                  "name": "data",
                  "type": "bytes"
                },
                {
                  "internalType": "bytes",
                  "name": "operatorData",
                  "type": "bytes"
                }
              ],
              "name": "operatorSend",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "outstandingDebt",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "owner",
              "outputs": [
                {
                  "internalType": "address",
                  "name": "",
                  "type": "address"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "paused",
              "outputs": [
                {
                  "internalType": "bool",
                  "name": "",
                  "type": "bool"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "uint256",
                  "name": "assets",
                  "type": "uint256"
                }
              ],
              "name": "previewDeposit",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "uint256",
                  "name": "shares",
                  "type": "uint256"
                }
              ],
              "name": "previewMint",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "uint256",
                  "name": "shares",
                  "type": "uint256"
                }
              ],
              "name": "previewRedeem",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "uint256",
                  "name": "assets",
                  "type": "uint256"
                }
              ],
              "name": "previewWithdraw",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "proxiableUUID",
              "outputs": [
                {
                  "internalType": "bytes32",
                  "name": "",
                  "type": "bytes32"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "uint256",
                  "name": "shares",
                  "type": "uint256"
                },
                {
                  "internalType": "address",
                  "name": "",
                  "type": "address"
                },
                {
                  "internalType": "address",
                  "name": "",
                  "type": "address"
                }
              ],
              "name": "redeem",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "assets",
                  "type": "uint256"
                }
              ],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "uint256",
                  "name": "shares",
                  "type": "uint256"
                }
              ],
              "name": "redeem",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "assets",
                  "type": "uint256"
                }
              ],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "strategy",
                  "type": "address"
                },
                {
                  "internalType": "bool",
                  "name": "fromQueueOnly",
                  "type": "bool"
                }
              ],
              "name": "removeStrategy",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "renounceOwnership",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "address[]",
                  "name": "queue",
                  "type": "address[]"
                }
              ],
              "name": "reorderWithdrawalQueue",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "uint256",
                  "name": "loss",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "debtPayment",
                  "type": "uint256"
                }
              ],
              "name": "reportNegativeDebtManagement",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "uint256",
                  "name": "extraFreeFunds",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "debtPayment",
                  "type": "uint256"
                }
              ],
              "name": "reportPositiveDebtManagement",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "operator",
                  "type": "address"
                }
              ],
              "name": "revokeOperator",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "strategy",
                  "type": "address"
                }
              ],
              "name": "revokeStrategy",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "rewards",
              "outputs": [
                {
                  "internalType": "address",
                  "name": "",
                  "type": "address"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "recipient",
                  "type": "address"
                },
                {
                  "internalType": "uint256",
                  "name": "amount",
                  "type": "uint256"
                },
                {
                  "internalType": "bytes",
                  "name": "data",
                  "type": "bytes"
                }
              ],
              "name": "send",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "bool",
                  "name": "shutdown",
                  "type": "bool"
                }
              ],
              "name": "setEmergencyShutdown",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "uint256",
                  "name": "rate",
                  "type": "uint256"
                }
              ],
              "name": "setLockedProfitReleaseRate",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "uint256",
                  "name": "_managementFee",
                  "type": "uint256"
                }
              ],
              "name": "setManagementFee",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "_rewards",
                  "type": "address"
                }
              ],
              "name": "setRewards",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "strategy",
                  "type": "address"
                }
              ],
              "name": "strategyDebt",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "strategy",
                  "type": "address"
                }
              ],
              "name": "strategyRatio",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "symbol",
              "outputs": [
                {
                  "internalType": "string",
                  "name": "",
                  "type": "string"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "totalAssets",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "totalDebt",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "totalSupply",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "recipient",
                  "type": "address"
                },
                {
                  "internalType": "uint256",
                  "name": "amount",
                  "type": "uint256"
                }
              ],
              "name": "transfer",
              "outputs": [
                {
                  "internalType": "bool",
                  "name": "",
                  "type": "bool"
                }
              ],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "holder",
                  "type": "address"
                },
                {
                  "internalType": "address",
                  "name": "recipient",
                  "type": "address"
                },
                {
                  "internalType": "uint256",
                  "name": "amount",
                  "type": "uint256"
                }
              ],
              "name": "transferFrom",
              "outputs": [
                {
                  "internalType": "bool",
                  "name": "",
                  "type": "bool"
                }
              ],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "newOwner",
                  "type": "address"
                }
              ],
              "name": "transferOwnership",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "newImplementation",
                  "type": "address"
                }
              ],
              "name": "upgradeTo",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "newImplementation",
                  "type": "address"
                },
                {
                  "internalType": "bytes",
                  "name": "data",
                  "type": "bytes"
                }
              ],
              "name": "upgradeToAndCall",
              "outputs": [],
              "stateMutability": "payable",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "version",
              "outputs": [
                {
                  "internalType": "string",
                  "name": "",
                  "type": "string"
                }
              ],
              "stateMutability": "pure",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "uint256",
                  "name": "assets",
                  "type": "uint256"
                }
              ],
              "name": "withdraw",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "shares",
                  "type": "uint256"
                }
              ],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "uint256",
                  "name": "assets",
                  "type": "uint256"
                },
                {
                  "internalType": "address",
                  "name": "",
                  "type": "address"
                },
                {
                  "internalType": "address",
                  "name": "",
                  "type": "address"
                }
              ],
              "name": "withdraw",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "shares",
                  "type": "uint256"
                }
              ],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "name": "withdrawalQueue",
              "outputs": [
                {
                  "internalType": "address",
                  "name": "",
                  "type": "address"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            }
          ]
        },
        "Vault_Proxy": {
          "address": "0x035dfF040fF12a727f95D7059Eaf41204D2330d5",
          "abi": [
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "_logic",
                  "type": "address"
                },
                {
                  "internalType": "bytes",
                  "name": "_data",
                  "type": "bytes"
                }
              ],
              "stateMutability": "payable",
              "type": "constructor"
            },
            {
              "anonymous": false,
              "inputs": [
                {
                  "indexed": false,
                  "internalType": "address",
                  "name": "previousAdmin",
                  "type": "address"
                },
                {
                  "indexed": false,
                  "internalType": "address",
                  "name": "newAdmin",
                  "type": "address"
                }
              ],
              "name": "AdminChanged",
              "type": "event"
            },
            {
              "anonymous": false,
              "inputs": [
                {
                  "indexed": true,
                  "internalType": "address",
                  "name": "beacon",
                  "type": "address"
                }
              ],
              "name": "BeaconUpgraded",
              "type": "event"
            },
            {
              "anonymous": false,
              "inputs": [
                {
                  "indexed": true,
                  "internalType": "address",
                  "name": "implementation",
                  "type": "address"
                }
              ],
              "name": "Upgraded",
              "type": "event"
            },
            {
              "stateMutability": "payable",
              "type": "fallback"
            },
            {
              "stateMutability": "payable",
              "type": "receive"
            }
          ]
        }
      }
    }
  ]
} as const;