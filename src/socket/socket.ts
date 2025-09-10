import { io } from "socket.io-client";

const URL = import.meta.env.VITE_BASE_URL;

export const socket = io(URL,{autoConnect: false});

// testing if the new mac has git configured properly