# Vault — Verifiable Encrypted Search

## Overview

Verity is a privacy-focused search engine that lets users search documents while keeping their contents encrypted on the server. Documents are encrypted on the user's device before upload, and searchable indexes use protected keyword tokens instead of plain-text keywords.

## How It Works

1. **Encrypt documents:** The client encrypts each document before sending it to the server.
2. **Create a protected index:** Keywords are converted into cryptographic search tokens.
3. **Search privately:** The user searches with protected tokens, allowing the server to find matching documents without receiving the plain-text query.
4. **Verify results:** The client checks cryptographic proofs to detect incorrect or incomplete search results.
5. **Decrypt locally:** After verification and authorization, the client decrypts the selected document.

## Key Features

- Client-side document encryption
- Search over encrypted documents
- Protected keyword indexing
- Verification of search results
- Detection of tampered or incomplete responses
- Local document decryption

## Proposed Technology Stack

- **Frontend:** React
- **Backend:** Node.js and Express
- **Database:** PostgreSQL
- **Cryptography:** Web Crypto API
- **Integrity verification:** An authenticated index and cryptographic proofs

## Goal

The goal of Verity is to make searching encrypted documents more private and trustworthy. The server can perform supported searches without receiving document decryption keys, while the client verifies search results before trusting them.

> Note: Searchable encryption can reveal some information, such as repeated search patterns or result sizes. The system's actual privacy and verification guarantees depend on the cryptographic scheme implemented.
