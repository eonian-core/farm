import type { Artifact, HardhatRuntimeEnvironment } from 'hardhat/types'

export function manageArtifacts(hre: HardhatRuntimeEnvironment) {
  const replacedArtifacts: Artifact[] = []

  const resetArtifacts = async () => {
    for (const artifact of replacedArtifacts) {
      await save(artifact.contractName, artifact.sourceName, artifact, hre)
    }
  }

  // Restore replaced artifacts
  afterEach(resetArtifacts)

  return {
    replaceArtifacts: async (sourceName: string, targetName: string): Promise<Artifact> => {
      const sourceArtifact = await hre.artifacts.readArtifact(sourceName)
      const targetArtifact = await hre.artifacts.readArtifact(targetName)

      replacedArtifacts.push(targetArtifact)

      await save(targetArtifact.contractName, targetArtifact.sourceName, sourceArtifact, hre)

      hre.artifacts.clearCache?.()

      return await hre.artifacts.readArtifact(targetName)
    },
    resetArtifacts,
  }
}

async function save(contractName: string, sourceName: string, data: Artifact, hre: HardhatRuntimeEnvironment) {
  await hre.artifacts.saveArtifactAndDebugFile({
    ...data,
    contractName,
    sourceName,
  })
}