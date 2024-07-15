import debug from "debug";
import { Manifest } from '@openzeppelin/upgrades-core'
import { Context, WithLogger } from "./Context";
import { ProxyCiService } from "./ProxyCiService";

/** Proxy implementation continus integration service, responsibe for deploy of implementation */
export class ImplementationService extends WithLogger {
    constructor(
        ctx: Context,
        public proxy: ProxyCiService
    ) {
        super(ctx, debug(ImplementationService.name))
    }

    /** 
     * Validates whether code of proxy implementation changed in codebase 
     * If changed, will deploy new implementation, save it in deploy manifest and return address of it
     * New implementation automaticaly will be used during next proxy upgrade call
     * */
    public async isImplementationlChanged(proxyAddress: string){
        const oldImplAddress = await this.proxy.getImplementation(proxyAddress)
        const newImplAddress = await this.proxy.deployImplementationIfNeeded(proxyAddress)
        this.log(`New implementation retrived: ${newImplAddress}`)
    
        const sameImplementationCode = await this.haveSameBytecode(oldImplAddress, newImplAddress)
        if (!sameImplementationCode) {
          this.log(`Implementation changed:\n new:${newImplAddress}\nold:${oldImplAddress}`)
        } else {
          this.log(`Implementation has not been changed, current implementation: ${newImplAddress}`)
        }    

        return {isChanged: !sameImplementationCode, implementationAddress: newImplAddress}
    }


    private async haveSameBytecode(implementationA: string, implementationB: string): Promise<boolean> {
        this.log(`Checking if implementation has been changed...\nnew:${implementationA}\nold:${implementationB}`)
        if (implementationA === implementationB) {
          return true
        }
        const manifest = await Manifest.forNetwork(this.hre.ethers.provider)
        const data = await manifest.read(3)
        const implementations = Object.values(data.impls)
        return implementations.some((implementationData) => {
          const addresses = [implementationData!.address, ...(implementationData!.allAddresses ?? [])]
          return addresses.includes(implementationA) && addresses.includes(implementationB)
        })
      }

}