import { hashToBigInt, modPow, P } from '@/utils/cryptoUtils';
import { useCallback } from 'react';

export function usePrivateSetIntersection() {
    /**
     * @param mySet oryginalne elementy
     * @param mySecret lokalny sekret a
     * @param peerAbSet { H(x)^(ab) } od peer
     * @param peerBSet  { H(x)^b } które peer dostał wcześniej od Ciebie
     */
    const computeIntersection = useCallback(
        async (
            mySet: Set<string>,
            mySecret: bigint,
            peerAbSet: Set<string>,
            peerBSet: Set<string>
        ): Promise<Set<string>> => {
            // map: H(x)^(ab) -> x
            const myAbMap = new Map<string, string>();

            for (const x of mySet) {
                const h = await hashToBigInt(x);
                for (const hx_b of peerBSet) {
                    // UWAGA: peerBSet to H(x)^b dla MOICH x
                    const hx_b_big = BigInt(hx_b);
                    const hx_ab = modPow(hx_b_big, mySecret, P);
                    myAbMap.set(hx_ab.toString(), x);
                }
            }

            const intersection = new Set<string>();

            for (const v of peerAbSet) {
                const el = myAbMap.get(v);
                if (el) {
                    intersection.add(el);
                }
            }

            return intersection;
        },
        []
    );

    return { computeIntersection };
}
