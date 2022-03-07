import crypto from 'crypto';

export const encryptSha512 = (pws: string) => {
    const hash = crypto.createHmac('sha512', pws)
    const hex = hash.digest('hex')
    return hex
}