# Choice of License

There are several license types available that can provide good protection for protocol. However, choosing the right license type requires a trade-off between project protection and ease of modification.

For our project, we want to enable the development of new protocols on top of our existing one. Therefore, it is critical to ensure that every new protocol is open source and available to everyone.

## Common Licenses

The DeFi space commonly uses a few license types. There part of licenses which we have considered for our project:

| License Name                                | Projects Using the License                         |
|---------------------------------------------|----------------------------------------------------|
| GNU General Public License v3.0             | Balancer v2                                        |
| Business Source License 1.1                 | Aave v3, Carbon (Bancor child company), Uniswap v3 |
| Custom license                              | Bancor v3 (Bprotocol Foundation (Bancor) LICENSE)  |
| BSD 3-Clause "New" or "Revised" License     | Compound                                           |
| GNU Affero General Public License v3.0      | Yearn                                              |
| The MIT License                             | OpenZeppelin                                       |


## Final Choice

After considering several license types, we have decided to use the GNU GPL family licenses for our project. It provides the important requirement to make the modified version code freely available. However, the GNU Affero General Public License v3.0 requires that the code be open source, even if it is used as a service.

The quote on the GNU Affero General Public License v3.0 from [choosealicense.com](https://choosealicense.com/licenses/agpl-3.0/#):

> When a modified version is used to provide a service over a network, the complete source code of the modified version must be made available.

So final choice is **GNU Affero General Public License v3.0**.