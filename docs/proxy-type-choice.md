# Choice of Smart Contract Proxy

There is currently no "best" proxy for smart contracts. Each proxy has specific problems, making them less tolerant for specific use cases. Additionally, there are many big hacks that were caused by bad proxy architecture or management. However, there are several options that are commonly used in the DeFi space. We have considered these options and have chosen to use the OpenZeppelin UUPS proxy.

## Considered Alternatives

We considered only practical alternatives that are possible to use at the current moment without significant development. There are more promising proxy types.

### EIP-173 Compliant Custom Proxy

[This custom proxy](https://github.com/wighawag/hardhat-deploy/blob/master/solc_0.8/proxy/EIP173Proxy.sol) was developed by the [hardhat-deploy](https://github.com/wighawag/hardhat-deploy) team. It is based on the EIP-173 ownership management model. It also has [an additional extension](https://github.com/wighawag/hardhat-deploy/blob/master/solc_0.8/proxy/EIP173ProxyWithReceive.sol) for receiving ether.

As the hardhat-deploy team developed it for their own plugin, it is not considered a production-ready, well-tested, and audited contract, which is critical for our project.

### Transparent Proxy

[OpenZepplin Transparent Proxy](https://docs.openzeppelin.com/contracts/4.x/api/proxy#TransparentUpgradeableProxy) is a good and widely used proxy. It is based on the EIP-1967 standard. It is well-tested, audited, and has great support from the OpenZeppelin team.

However, it has gas overhead for every call. Additionally, proxy logic, which makes upgrades, is not upgradeable, which breaks the point of the proxy pattern. There weren't known critical issues with this proxy, but fixing them will be hard or even impossible if they arise.

The Transparent proxy in the current situation can be used in hardhat-deploy only as a fork of official implementation, which makes the setup of this proxy is more simple but less secure.

### UUPS Proxy

[OpenZepplin UUPS Proxy](https://docs.openzeppelin.com/contracts/4.x/api/proxy#UUPSUpgradeable) is a  widely used proxy. It is based on the [ERC-1822 standard](https://eips.ethereum.org/EIPS/eip-1822). It is well-tested, audited, and has great support from the OpenZeppelin team. ERC itself didn't get many updates over 6 months, and it is still in draft status.

This type of proxy has a known "uninitialized implementation" vulnerability fixed by the OpenZepplin team and has best practices to avoid it. This proxy standard has the most efficient gas usage, as they basically redirect every call to the implementation contract directly.

The UUPS proxy deployment process is simpler, which makes them possible to use in hardhat-deploy directly from OpenZeppelin, but implementation does not have the same level of support from OpenZeppling and from hardhat-deploy, which requires additional development of proxy rights management and proper usage.

### Beacon Proxy

[OpenZepplin Beacon Proxy](https://docs.openzeppelin.com/contracts/4.x/api/proxy#BeaconProxy) is a widely used proxy, but it is less efficient than even Transparent proxy as it makes additional calls to the beacon contract on every call. This gas usage makes it not suitable for our project.

### Diamond Proxy

Diamond proxy based on [ERC-2535 standard](https://eips.ethereum.org/EIPS/eip-2535). This great proxy type has a big community but still lacks production-ready implementation, the same level as OpenZepplin. It is also less efficient than even a Transparent proxy, as it makes additional calls to the diamond contract on every call. Additionally, this proxy can be named as a framework, as it requires additional development of diamond cuttable contracts.

Only one important feature makes it interesting to use, as it allows us to overcome the 24KB contract size limit. But it is not critical for our project at the current moment. All minuses make it not suitable for our project, but it can be considered in the future.

## Final Choice

In general, UUPS architecture looks more promising and safe, as it allows to upgrade of proxy logic itself to fix possible vulnerabilities. Additionally, UUPS has a simpler implementation than a Transparent proxy. But in practice, Transparent proxies do not have known critical issues. So they both can be considered at the same security level.

On the other hand, the UUPS proxy is more gas efficient, as it doesn't have overhead for every call. So it can give some gas savings for users, which makes it most suitable for our project.
