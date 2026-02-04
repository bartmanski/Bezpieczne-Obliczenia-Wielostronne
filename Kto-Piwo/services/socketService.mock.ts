import { Socket } from 'socket.io-client';

const SOCKET_URL = 'https://abcd-1234.ngrok-free.app';

let socket: Socket | null = null;

export function getSocket() {
    return {
        on: (event: string, callback: (...args: any[]) => void) => {
            console.log(`Mock socket listening to event: ${event}`);
        },
        off: (event: string, callback: (...args: any[]) => void) => {
            console.log(`Mock socket stopped listening to event: ${event}`);
        },
        emit: (event: string, payload: any) => {
            console.log(`Mock socket emitted event: ${event} with payload:`, payload);
        },
    };
}
