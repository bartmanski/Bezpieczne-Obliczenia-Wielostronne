import * as Crypto from 'expo-crypto';

export async function sha256(str: string): Promise<string> {
  return await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    str
  );
}

export function randomKey(): string {
  const rand = Math.random().toString(36).slice(2) + '-' + Date.now().toString(36)
  console.log('Generated random key:', rand);
  return rand;
}

export async function randomBigInt(): Promise<bigint> {
  const r = randomKey();
  const h = await sha256(r);
  return BigInt('0x' + h) % P;
}


export const P = BigInt(
  '6864797660130609714981900799081393217269435300143305409394463459185543183397656052122559640661454554977296311391480858037121987999716643812574028291115057151'
);

export function modPow(base: bigint, exp: bigint, mod: bigint): bigint {
  let result = 1n;
  base = base % mod;

  while (exp > 0n) {
    if (exp & 1n) result = (result * base) % mod;
    exp >>= 1n;
    base = (base * base) % mod;
  }

  return result;
}


export async function hashToBigInt(x: string): Promise<bigint> {
  const h = await sha256(x);
  return BigInt('0x' + h) % P;
}
