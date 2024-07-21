export enum DeployStatus {
    DEPLOYED = 'DEPLOYED',
    UPGRADED = 'UPGRADED',
    NONE = 'NONE',
}

/** Key is target state, array is allowed initial states */
const allowedTransitions: Record<DeployStatus, DeployStatus[]> = {
    [DeployStatus.DEPLOYED]: [DeployStatus.NONE],
    [DeployStatus.UPGRADED]: [DeployStatus.NONE, DeployStatus.DEPLOYED],
    [DeployStatus.NONE]: [],
}

export class DeployState {

    constructor(
        public status: DeployStatus = DeployStatus.NONE
    ) { }

    /**
     * Changes and validates the current deployment status.
     */
    public switchTo(newStatus: DeployStatus) {
        if (!allowedTransitions[newStatus].includes(this.status)) {
            throw new Error(`Illegal deploy status transition! \n from: ${this.status} -> to: ${newStatus}`)
        }
        this.status = newStatus
    }
}