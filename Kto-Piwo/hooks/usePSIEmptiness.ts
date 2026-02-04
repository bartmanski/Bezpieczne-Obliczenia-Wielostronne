import { useEffect, useRef, useState } from 'react';
import { getSocket } from '../services/socketService.mock'; //Bartek połącz ze swoim socketem
import { randomKey, sha256 } from '../utils/cryptoUtils';

type PsiStep2Payload = {
    doubleFromB: string[];
    singleFromB: string[];
};

/**
 * EDUCATIONAL PSI (emptiness only).
 * Returns true if intersection is empty.
 */
export function usePSIEmptiness(mySet: string[]) {
    const socket = getSocket();

    const kARef = useRef<string>(randomKey());
    const [isIntersectionEmpty, setIsIntersectionEmpty] =
        useState<boolean | null>(null);

    const hashWithKA = async (x: string): Promise<string> => {
        return sha256(`${kARef.current}|${x}`);
    };

    useEffect(() => {
        const onStep2 = async (payload: PsiStep2Payload) => {
            const { doubleFromB, singleFromB } = payload;

            // compute E_kA(E_kB(y))
            const myDoubleOnB: string[] = [];
            for (const h of singleFromB) {
                const hh = await sha256(`${kARef.current}|${h}`);
                myDoubleOnB.push(hh);
            }

            // check intersection
            const setFromB = new Set<string>(doubleFromB);
            const intersects = myDoubleOnB.some((x) =>
                setFromB.has(x)
            );

            setIsIntersectionEmpty(!intersects);
        };

        socket.on('psi-step2', onStep2);

        return () => {
            socket.off('psi-step2', onStep2);
        };
    }, [socket]);

    const startPSI = async (): Promise<void> => {
        const hashedByA: string[] = [];

        for (const x of mySet) {
            const hx = await hashWithKA(x);
            hashedByA.push(hx);
        }

        socket.emit('psi-step1', {
            fromA: hashedByA,
        });
    };

    return {
        startPSI,
        isIntersectionEmpty,
    };
}
