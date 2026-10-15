/**
 * Vault SSE Web Server Launcher
 * Starts the untrusted cloud microservice and serves the interactive web dashboard.
 */

import { VaultServerApp } from "./server_app.ts";

const port = parseInt(process.env.PORT || "3000", 10);
const app = new VaultServerApp();

const boundPort = await app.listen(port);
console.log(`================================================================`);
console.log(`  VAULT // Verifiable Searchable Symmetric Encryption Engine   `);
console.log(`================================================================`);
console.log(`  Cloud Server Active:   http://localhost:${boundPort}`);
console.log(`  Interactive Dashboard: http://localhost:${boundPort}/`);
console.log(`  REST Endpoints:        http://localhost:${boundPort}/api/v1/health`);
console.log(`================================================================`);
