import * as Crypto from 'expo-crypto';

export async function sha256(str: string): Promise<string> {
  return await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    str
  );
}

export function randomKey(): string {
  return (
    Math.random().toString(36).slice(2) +
    '-' +
    Date.now().toString(36)
  );
}
