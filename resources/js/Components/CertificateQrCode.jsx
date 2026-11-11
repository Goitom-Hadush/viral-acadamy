import React, { useMemo } from 'react';

/**
 * Robust, lightweight, zero-dependency SVG QR Code Generator for URLs & Strings.
 * Generates standards-compliant scannable QR Code matrices (Version 1-4 with Error Correction).
 */

// Galois Field Log/Exp tables for QR error correction
const GF_EXP = new Uint8Array(512);
const GF_LOG = new Uint8Array(256);
(function initGF() {
    let x = 1;
    for (let i = 0; i < 255; i++) {
        GF_EXP[i] = x;
        GF_EXP[i + 255] = x;
        GF_LOG[x] = i;
        x = (x << 1) ^ (x & 128 ? 0x11d : 0);
    }
})();

function gfMul(x, y) {
    if (x === 0 || y === 0) return 0;
    return GF_EXP[GF_LOG[x] + GF_LOG[y]];
}

function polyMul(p, q) {
    const r = new Uint8Array(p.length + q.length - 1);
    for (let i = 0; i < p.length; i++) {
        for (let j = 0; j < q.length; j++) {
            r[i + j] ^= gfMul(p[i], q[j]);
        }
    }
    return r;
}

function getGeneratorPoly(degree) {
    let g = new Uint8Array([1]);
    for (let i = 0; i < degree; i++) {
        g = polyMul(g, new Uint8Array([1, GF_EXP[i]]));
    }
    return g;
}

function calculateEcc(data, ecCount) {
    const gen = getGeneratorPoly(ecCount);
    const msg = new Uint8Array(data.length + ecCount);
    msg.set(data, 0);

    for (let i = 0; i < data.length; i++) {
        const coef = msg[i];
        if (coef !== 0) {
            for (let j = 0; j < gen.length; j++) {
                msg[i + j] ^= gfMul(gen[j], coef);
            }
        }
    }
    return msg.slice(data.length);
}

// Generate QR Code matrix for text (Version 1 - 4)
function generateQrMatrix(text) {
    const bytes = new TextEncoder().encode(text);
    const len = bytes.length;

    // Determine Version (1: up to 17 bytes, 2: 32 bytes, 3: 53 bytes, 4: 78 bytes with ECC L)
    let version = 1;
    let totalCodewords = 26;
    let ecCodewords = 7;
    let size = 21;

    if (len > 53) {
        version = 4;
        totalCodewords = 100;
        ecCodewords = 20;
        size = 33;
    } else if (len > 32) {
        version = 3;
        totalCodewords = 70;
        ecCodewords = 15;
        size = 29;
    } else if (len > 17) {
        version = 2;
        totalCodewords = 44;
        ecCodewords = 10;
        size = 25;
    }

    const dataCodewords = totalCodewords - ecCodewords;

    // Bit buffer: 4 bits mode (0100 for Byte) + 8 bits count + payload + padding
    const bitBuffer = [];
    const pushBits = (val, count) => {
        for (let i = count - 1; i >= 0; i--) {
            bitBuffer.push((val >> i) & 1);
        }
    };

    pushBits(0b0100, 4); // Byte mode
    pushBits(len, 8); // Character count indicator
    for (let i = 0; i < len; i++) {
        pushBits(bytes[i], 8);
    }
    // Terminator
    pushBits(0, Math.min(4, dataCodewords * 8 - bitBuffer.length));
    // Pad to byte boundary
    while (bitBuffer.length % 8 !== 0) {
        bitBuffer.push(0);
    }
    // Pad codewords (0xEC, 0x11)
    const padBytes = [0xec, 0x11];
    let padIdx = 0;
    while (bitBuffer.length < dataCodewords * 8) {
        pushBits(padBytes[padIdx % 2], 8);
        padIdx++;
    }

    // Convert bit buffer to data bytes
    const dataBytes = new Uint8Array(dataCodewords);
    for (let i = 0; i < dataCodewords; i++) {
        let b = 0;
        for (let j = 0; j < 8; j++) {
            b = (b << 1) | bitBuffer[i * 8 + j];
        }
        dataBytes[i] = b;
    }

    // Compute error correction codewords
    const eccBytes = calculateEcc(dataBytes, ecCodewords);

    // Final sequence of codewords
    const finalCodewords = new Uint8Array(totalCodewords);
    finalCodewords.set(dataBytes, 0);
    finalCodewords.set(eccBytes, dataCodewords);

    // Initialize matrix: -1 = unassigned, 0 = white, 1 = black
    const matrix = Array.from({ length: size }, () => Array(size).fill(-1));

    // Place finder patterns
    const placeFinder = (r, c) => {
        for (let y = -1; y <= 7; y++) {
            for (let x = -1; x <= 7; x++) {
                const py = r + y;
                const px = c + x;
                if (py >= 0 && py < size && px >= 0 && px < size) {
                    if (y >= 0 && y <= 6 && x >= 0 && x <= 6) {
                        const isBorder = y === 0 || y === 6 || x === 0 || x === 6;
                        const isCenter = y >= 2 && y <= 4 && x >= 2 && x <= 4;
                        matrix[py][px] = (isBorder || isCenter) ? 1 : 0;
                    } else {
                        matrix[py][px] = 0;
                    }
                }
            }
        }
    };

    placeFinder(0, 0);
    placeFinder(0, size - 7);
    placeFinder(size - 7, 0);

    // Place alignment pattern for version 2+
    if (version >= 2) {
        const alignCoords = [
            [],
            [],
            [6, 18],
            [6, 22],
            [6, 26],
        ];
        const coords = alignCoords[version] || [];
        for (const ar of coords) {
            for (const ac of coords) {
                if (matrix[ar][ac] !== -1) continue;
                for (let dy = -2; dy <= 2; dy++) {
                    for (let dx = -2; dx <= 2; dx++) {
                        const isEdge = Math.abs(dy) === 2 || Math.abs(dx) === 2;
                        const isMid = dy === 0 && dx === 0;
                        matrix[ar + dy][ac + dx] = (isEdge || isMid) ? 1 : 0;
                    }
                }
            }
        }
    }

    // Timing patterns
    for (let i = 8; i < size - 8; i++) {
        if (matrix[6][i] === -1) matrix[6][i] = (i % 2 === 0) ? 1 : 0;
        if (matrix[i][6] === -1) matrix[i][6] = (i % 2 === 0) ? 1 : 0;
    }

    // Dark module
    matrix[4 * version + 9][8] = 1;

    // Reserve format information areas
    for (let i = 0; i < 9; i++) {
        if (matrix[8][i] === -1) matrix[8][i] = 0;
        if (matrix[i][8] === -1) matrix[i][8] = 0;
    }
    for (let i = 0; i < 8; i++) {
        if (matrix[8][size - 1 - i] === -1) matrix[8][size - 1 - i] = 0;
        if (matrix[size - 1 - i][8] === -1) matrix[size - 1 - i][8] = 0;
    }

    // Convert codewords to stream of bits
    const dataBitStream = [];
    for (let i = 0; i < totalCodewords; i++) {
        for (let b = 7; b >= 0; b--) {
            dataBitStream.push((finalCodewords[i] >> b) & 1);
        }
    }

    // Place data bits with Mask 0 ((r + c) % 2 == 0)
    let bitIdx = 0;
    let upward = true;

    for (let col = size - 1; col > 0; col -= 2) {
        if (col === 6) col--; // Skip vertical timing line

        const rowRange = upward ? Array.from({ length: size }, (_, i) => size - 1 - i) : Array.from({ length: size }, (_, i) => i);

        for (const row of rowRange) {
            for (let c = 0; c < 2; c++) {
                const curCol = col - c;
                if (matrix[row][curCol] === -1) {
                    let bit = (bitIdx < dataBitStream.length) ? dataBitStream[bitIdx++] : 0;
                    // Apply Mask 0: flip if (row + curCol) % 2 == 0
                    if ((row + curCol) % 2 === 0) {
                        bit ^= 1;
                    }
                    matrix[row][curCol] = bit;
                }
            }
        }
        upward = !upward;
    }

    // Standard format information for ECC Level L and Mask 0: 0x77C4
    const formatInfo = [0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 0, 0, 1, 0];
    const formatPositions = [
        [8, 0], [8, 1], [8, 2], [8, 3], [8, 4], [8, 5], [8, 7], [8, 8], [7, 8], [5, 8], [4, 8], [3, 8], [2, 8], [1, 8], [0, 8]
    ];
    for (let i = 0; i < 15; i++) {
        const [r, c] = formatPositions[i];
        matrix[r][c] = formatInfo[i];
    }
    const formatPositions2 = [
        [size - 1, 8], [size - 2, 8], [size - 3, 8], [size - 4, 8], [size - 5, 8], [size - 6, 8], [size - 7, 8],
        [8, size - 8], [8, size - 7], [8, size - 6], [8, size - 5], [8, size - 4], [8, size - 3], [8, size - 2], [8, size - 1]
    ];
    for (let i = 0; i < 15; i++) {
        const [r, c] = formatPositions2[i];
        matrix[r][c] = formatInfo[i];
    }

    return matrix;
}

export default function CertificateQrCode({
    value,
    size = 110,
    className = '',
    fgColor = '#004101',
    bgColor = '#ffffff',
}) {
    const matrix = useMemo(() => {
        try {
            return generateQrMatrix(value);
        } catch (e) {
            console.error('QR code generation error:', e);
            return null;
        }
    }, [value]);

    if (!matrix) {
        return (
            <div
                style={{ width: size, height: size }}
                className={`flex items-center justify-center bg-slate-100 rounded-lg text-xs text-slate-400 ${className}`}
            >
                QR Error
            </div>
        );
    }

    const matrixSize = matrix.length;
    const padding = 2;
    const totalSize = matrixSize + padding * 2;

    return (
        <svg
            viewBox={`0 0 ${totalSize} ${totalSize}`}
            width={size}
            height={size}
            className={`block shrink-0 ${className}`}
            shapeRendering="crispEdges"
            aria-label={`QR Code for ${value}`}
        >
            <rect width={totalSize} height={totalSize} fill={bgColor} />
            {matrix.map((row, r) =>
                row.map((cell, c) =>
                    cell === 1 ? (
                        <rect
                            key={`${r}-${c}`}
                            x={c + padding}
                            y={r + padding}
                            width="1"
                            height="1"
                            fill={fgColor}
                        />
                    ) : null
                )
            )}
        </svg>
    );
}
