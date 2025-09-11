import { io } from "socket.io-client";

const URL = import.meta.env.VITE_BASE_URL;

const socket = io(URL,{autoConnect: false});

export default socket;

// testing if the new mac has git configured properly