import { hashToBigInt, modPow, P, randomBigInt } from '@/utils/cryptoUtils';
import { useCallback, useEffect, useState } from 'react';


export function useDhSet() {
    const [secret, setSecret] = useState<bigint | null>(null);

    useEffect(() => {
        randomBigInt().then(setSecret);
    }, []);

    /**
     * Lokalny zbiór -> { H(x)^a mod p }
     * TO wysyłasz do peer
     */
    const encodeSet = useCallback(
        async (set: Set<string>): Promise<Set<string>> => {
            if (!secret) throw new Error('Secret not initialized');
            const result = new Set<string>();

            for (const x of set) {
                const h = await hashToBigInt(x);
                const hx_a = modPow(h, secret, P);
                result.add(hx_a.toString());
            }

            return result;
        },
        [secret]
    );

    /**
     * Dostajesz { H(y)^b } od peer
     * -> liczysz { H(y)^(ab) }
     */
    const exponentiateReceived = useCallback(
        async (received: Set<string>): Promise<Set<string>> => {
            if (!secret) throw new Error('Secret not initialized');
            const result = new Set<string>();

            for (const v of received) {
                const val = BigInt(v);
                const val_a = modPow(val, secret, P);
                result.add(val_a.toString());
            }

            return result;
        },
        [secret]
    );

    return {
        secret,                 // lokalny sekret a
        encodeSet,              // Set<string> -> Set<H(x)^a>
        exponentiateReceived,   // Set<H(y)^b> -> Set<H(y)^(ab)>
    };
}

