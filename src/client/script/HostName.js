const isProduction = window.location.hostname !== 'localhost';
export const HostName = isProduction ? 'https://getupeveryday.com' : 'http://localhost:3000';
