export function strKey(input) {
    const base64 = input.toString('base64');

    return base64ToBase64Url(base64);
}

function base64ToBase64Url(input) {
    return input.replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');
}

export function bufferKey(key) {
    const segmentLength = 4;
    const string = key.toString();
    const newLength = Math.ceil(string.length / segmentLength) * segmentLength;
    const base64Buffer = string.padEnd(newLength, '=')
        .replace(/-/g, '+')
        .replace(/_/g, '/');

    const base64 = Buffer.from(base64Buffer, 'base64');

    return new Uint8Array(base64);
}
