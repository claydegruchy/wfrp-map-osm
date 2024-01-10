import { writable } from 'svelte/store';

export const app = writable(null);
export const firestore = writable(null);
export const auth = writable(null);