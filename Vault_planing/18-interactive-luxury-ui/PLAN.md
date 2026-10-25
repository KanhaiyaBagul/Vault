# Phase 18 Plan: Interactive Luxury Studio UI/UX, Burnished Gold Palette & Cryptographic Visualizers

## Objective
Elevate the Vault SSE application into an interactive luxury cryptographic studio by introducing **Burnished Amber Gold (`#C5A059`)** into the design system, implementing a glassmorphic floating studio bar with enclave pulse, building an interactive visual Merkle proof tree diagram, and creating a live 60 FPS ciphertext scramble decryption animation.

---

## Wave Breakdown

### Wave 1: Design System Expansion & Glassmorphic Studio Header
- **Task 1.1**: Define Burnished Amber Gold tokens in `src/ui/styles/theme.css` (`--accent-gold`, `--accent-gold-subtle`, `--accent-gold-border`, `--accent-gold-glow`, `--shadow-gold-halo`).
- **Task 1.2**: Upgrade `src/ui/components/layout/Header.tsx` to a glassmorphic floating studio bar:
  - Add translucent backdrop blur (`backdrop-filter: blur(16px)`).
  - Add animated golden pulse ring on the Hardware Enclave indicator.
  - Add global `Ctrl + K` / `Cmd + K` search launcher shortcut.
- **Task 1.3**: Update `src/ui/styles/components.css` with glassmorphic styles, gold button outlines, and interactive hover micro-transitions.

### Wave 2: Ciphertext-to-Plaintext Live Scramble Decryption Animation
- **Task 2.1**: Implement high-performance scramble text effect in `src/ui/components/workspace/DocumentViewer.tsx`:
  - Rapidly cycles cryptographic glyphs (`01#&%*§∅⬡`) over 240ms before resolving into decrypted plaintext.
  - Only animates visible preview characters to guarantee zero UI jank and 60 FPS performance.
- **Task 2.2**: Add gold verification badge and cryptographic lockbox icon to the document viewer toolbar.

### Wave 3: Interactive Visual Merkle Proof Tree Visualizer
- **Task 3.1**: Create `src/ui/components/workspace/MerkleProofVisualizer.tsx`:
  - Zero-dependency SVG vector diagram visualizing the cryptographic inclusion proof path.
  - Renders: Search Trapdoor → Document Leaf Node → Sibling Hashes → Golden Merkle Root (`#C5A059`).
  - Interactive hover state displaying truncated 64-character SHA-256 digests.
- **Task 3.2**: Embed `MerkleProofVisualizer` inside the cryptographic proof accordion in `DocumentViewer.tsx`.
- **Task 3.3**: Add visual illumination cascade when search query is cryptographically verified against the client accumulator.

### Wave 4: Integration, Verification & Automated Testing
- **Task 4.1**: Compile frontend bundle with `npm run build` (verify zero TypeScript and CSS errors).
- **Task 4.2**: Execute full automated test suite (`npm test`) ensuring all 158+ tests pass.
- **Task 4.3**: End-to-end browser walkthrough using browser subagent:
  - Verify glassmorphic header and golden enclave pulse.
  - Test `Ctrl + K` search focus shortcut.
  - Select document: verify live scramble decryption effect.
  - Expand cryptographic proof: verify visual Merkle proof tree renders and illuminates.
