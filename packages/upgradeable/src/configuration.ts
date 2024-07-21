
/** Check if environmetn variable defined, or throw exception othervise */
export const requiredEnv = (name: string): string =>
    required(process.env[name], `Environment variable "${name}" is not defined`)

/** Check if variable defined, or throw exception othervise */
export const required = <T>(value: T | undefined | null, failMessage: string): T => {
    if (value === undefined || value === null) {
        throw new Error(failMessage)
    }
    return value
}
