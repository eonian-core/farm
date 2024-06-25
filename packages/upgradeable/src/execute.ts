import { DeployResult, DeployStatus } from "./plugins/Deployer"

export async function execute<R extends DeployResult, T extends (...args: any) => Promise<R>>(fn: T, ...args: Parameters<T>): Promise<R> {
    const fnArgs = Array.from(args).filter(arg => typeof arg !== 'object').join(', ').trim()
    const contractName = (fnArgs ? `${fnArgs} ` : '') + (fn.name.startsWith('deploy') ? fn.name.substring(6) : fn.name)
    console.log(`[${contractName}] Deploying contract via <${fn.name}>...`)
  
    // eslint-disable-next-line prefer-spread
    const result = await fn.apply(null, args)
    switch (result.status) {
      case DeployStatus.NONE:
        console.log(`[${contractName} - SKIP] Proxy ${result.proxyAddress} is up-to-date`)
        break
      case DeployStatus.DEPLOYED:
        console.log(`[${contractName} - NEW PROXY] Proxy ${result.proxyAddress} is deployed, verified: ${result.verified}.`)
        break
      case DeployStatus.UPGRADED:
        console.log(`[${contractName} - UPGRADED] Proxy ${result.proxyAddress} is upgraded, verified: ${result.verified}.`)
        break
    }
  
    return result
  }
  
  