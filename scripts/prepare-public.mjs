import {copyFile} from 'node:fs/promises';
await copyFile(new URL('../CREDITS.md',import.meta.url),new URL('../public/CREDITS.md',import.meta.url));
