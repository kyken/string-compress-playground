import * as zlib from 'zlib';
import { promisify } from 'util';
import * as fs from 'fs/promises';
import * as os from 'os';
import * as path from 'path';
// @ts-ignore
import * as zstd from 'zstd-napi';

// zstandardのネイティブアドオンをロード


// zlibの関数をPromise化
const deflateAsync = promisify(zlib.deflate);
const inflateAsync = promisify(zlib.inflate);
const brotliCompressAsync = promisify(zlib.brotliCompress);
const brotliDecompressAsync = promisify(zlib.brotliDecompress);

async function compressWithDeflate(input: string): Promise<Buffer> {
  try {
    return await deflateAsync(Buffer.from(input, 'utf-8'));
  } catch (error) {
    console.error('Deflate compression error:', error);
    throw error;
  }
}

async function decompressWithDeflate(input: Buffer): Promise<string> {
  try {
    const decompressed = await inflateAsync(input);
    return decompressed.toString('utf-8');
  } catch (error) {
    console.error('Deflate decompression error:', error);
    throw error;
  }
}

async function compressWithBrotli(input: string): Promise<Buffer> {
  try {
    return await brotliCompressAsync(Buffer.from(input, 'utf-8'));
  } catch (error) {
    console.error('Brotli compression error:', error);
    throw error;
  }
}

async function decompressWithBrotli(input: Buffer): Promise<string> {
  try {
    const decompressed = await brotliDecompressAsync(input);
    return decompressed.toString('utf-8');
  } catch (error) {
    console.error('Brotli decompression error:', error);
    throw error;
  }
}

async function compressWithZstd(input: string): Promise<Buffer> {
    return zstd.compress(Buffer.from(input), {compressionLevel: 22});
  }
  
// async function decompressWithZstd(input: Buffer): Promise<string> {
//   try {
//     const zstd = await zstdPromise
//     const decompressed = await zstd.decompress(input);
//     return decompressed.toString('utf-8');
//   } catch (error) {
//     console.error('Zstandard decompression error:', error);
//     throw error;
//   }
// }

async function main() {
  const originalString = "H4JLaLwzCEuRT8Xi36Y1El0sqAaoPMJAdFo7vkjBVw+iavEo9XOWexNaHwytH65rk4e5hUUrVeZ1P/tAgfBeFry151KqF5ibKLi23ksRL+1uFJcwFOab8uiifsWirrU5O/ugBKzDDJaTlMsgIWGmke7cJ85EdSYqLXMOBRM9BZcT/ddgBwOVlmIKjXNEbo/U5ZduhIPQvYJGAWsg46LM9dqaHSFgkDPDDq96AGslcMX68hfFezY/5h+DhjesOn9R7GUwgDA9e/9mqWA9hbx41faqTG43te1x/myr6OXNu9JYJC4Xos1Ko20ZwgfX3So5UMUe08J4d3kfGpGSmJhkzGtCxrl9jXbKyE00COZYRYj0zwSP+4jNEVeRDWacuhrsymE5hWmJzVwtP6GpSX6C6xvJk/tmqF6e/ezlgeALhFBYUTpZtNJK5qRXiwEDoa2OhINJP2FFQRpdqqKE11zWuZC1L/RzW9Jk36t2yVa0ITqXLR9UtpGfz77HQSV+yi9PKVGdF1DmcG4iEGIcrkrltUxp6U3gnt9IFEs7XBdPDHq+D1vlGq2iViFLfG8p9AsS1lTntBpyczI1d/jPZzSdjt/k1MsjgVKj2ap9TRpFvMNh+FPXahBTLVnNeS8OGH39cA9IgrQo0WXNDNokZUuKzuvV/qacPvEfTP2qa1pKPzNnEep0H+TRxks9CVV54Tp6PKC38SJA1Ro4Q72b77CQc968UFLR3KqBu3MAo7mPI5o7mpnvC0aI1i+mZvrO/9roDhJtUfg4Q/YQ43hhe5tuib1Ja075n6VgQqSNteouz+O3wcbP0W0VD5XWrOzzftBhQNtHkIcMwS4351CJ3fTUwKM5WGs+9DtkC+eBio9kNM9ngl0H/34kQpFKLDlLdPaT3Iz4jZyRahN6Z32RSoth43MMzf3yFfiZIsDNiFaDC52AYO9JtyJJFJ7VV0I+iU4QJXmzh6hq+/eo9s18B8J1/9G1Lzw39iURZ4dqTIvUZLG2zuwR599bAv0KFhOC2wl5GCjRm/acAj1NI7iwvbqpYV0d7R64kSPL2DKKD19Ojghi9sGtDEJqoAnFHkY8bYY5kNosAopiZpQyk9/L/0yW3vcPbX3G1c8i0GyOSY6vhMQ+tIpTG/4DZixaUCukKGrW6vQe7u/UhL5BQK37UsuiOuMUdAn4BOlQWq42cumBBWrngs7Jd8oBIVrhxP6pVSRygPbyM9PzIJbVB3exa58IS+5zq7tGhiYxfRefi4B16jX4QOO95H1n2JDKKVYyj+rsxDo/cVKJ3orMrjHBTH2amL9JujUhTpr+ji5K4TmiD5ZM0l8t64JtD4R4875VrnPT1/gLF4zufvdDnx9LRYHhRVsdGiUgA0HyaGWi0tZtz3XXlm5AdPSa+eHPG3lv4K8qPAUjL5oss0aKXBjhoAT2+Ea/7cCDyo/gXNnFAMONL9GUldQLWAqHWFsxD41MZv/aAqFAM28mp9oOVz83dGtn34d5dCNFq4U2VmHtICVVa8SFc5BkS5ZSvehJRGKAGBW+MxouHj/2e3lRinIA6jcrvjVb+SilBUtfopMwjeQLyH7OwpZSY3br52N0ixlDDsvXUxp1asMhjlcb1dgWITp4gStBvXxP53AVrFSJZVP9ScLnXPmUR/QwezEjT8dnt1eC7iWU7oOl4kW4mxJkPHn8hCrlktrh3eZdq1aNT76Sq8k=";
  console.log("Original string length:", originalString);
  console.log("Original string length:", originalString.length);

  try {
    // Deflate
    const deflateCompressed = await compressWithDeflate(originalString);
    console.log("Deflate compressed string:", deflateCompressed.toString('base64'));
    console.log("Deflate compressed length:", deflateCompressed.length);
    const deflateDecompressed = await decompressWithDeflate(deflateCompressed);
    console.log("Deflate decompressed success:", deflateDecompressed === originalString);
    console.log("Deflate compression ratio:", originalString.length / deflateCompressed.length);

    // Brotli
    const brotliCompressed = await compressWithBrotli(originalString);
    console.log("Brotli compressed string:", brotliCompressed.toString('base64'));
    console.log("Brotli compressed length:", brotliCompressed.length);
    // const brotliDecompressed = await decompressWithBrotli(brotliCompressed);
    // console.log("Brotli decompressed length:", brotliDecompressed.length);
    console.log("Brotli compression ratio:", originalString.length / brotliCompressed.length);

    // Zstandard
    const zstdCompressed = await compressWithZstd(originalString);
    console.log("Zstandard compressed string:", zstdCompressed.toString('base64'));
    console.log("Zstandard compressed length:", zstdCompressed.length);
    // const zstdDecompressed = await decompressWithZstd(zstdCompressed);
    // console.log("Zstandard decompressed length:", zstdDecompressed.length);
    console.log("Zstandard compression ratio:", originalString.length / zstdCompressed.length);

  } catch (error) {
    console.error("An error occurred:", error);
  }
}

main();