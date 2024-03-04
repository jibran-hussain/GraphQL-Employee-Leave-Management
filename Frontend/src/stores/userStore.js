import {writable} from 'svelte/store';
import {decodeJwtToken} from '../utils/decodeJwtToken.js'
import { browser } from '$app/environment';

const authStateFromLocalStorage = browser && window.localStorage.getItem('jwt')
const initialAuthState = authStateFromLocalStorage ? decodeJwtToken(JSON.parse(authStateFromLocalStorage)) : null;

console.log(`The value in user store currently is :`,initialAuthState)


export const user=writable(initialAuthState)