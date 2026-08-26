import { deflateSync } from "node:zlib";

const WIDTH = 1200;
const HEIGHT = 630;

/** Minimal 5×7 glyphs for A–Z, 0–9, and a few punctuation marks. */
const GLYPHS: Record<string, number[]> = {
  " ": [0, 0, 0, 0, 0, 0, 0],
  "-": [0, 0, 0, 31, 0, 0, 0],
  ".": [0, 0, 0, 0, 0, 14, 14],
  ":": [0, 14, 14, 0, 14, 14, 0],
  "%": [25, 26, 4, 8, 16, 21, 19],
  "?": [14, 17, 1, 2, 4, 0, 4],
  "!": [4, 4, 4, 4, 4, 0, 4],
  "/": [1, 2, 4, 8, 16, 0, 0],
  "0": [14, 17, 19, 21, 25, 17, 14],
  "1": [4, 12, 4, 4, 4, 4, 14],
  "2": [14, 17, 1, 2, 4, 8, 31],
  "3": [14, 17, 1, 6, 1, 17, 14],
  "4": [2, 6, 10, 18, 31, 2, 2],
  "5": [31, 16, 30, 1, 1, 17, 14],
  "6": [6, 8, 16, 30, 17, 17, 14],
  "7": [31, 1, 2, 4, 8, 8, 8],
  "8": [14, 17, 17, 14, 17, 17, 14],
  "9": [14, 17, 17, 15, 1, 2, 12],
  A: [14, 17, 17, 31, 17, 17, 17],
  B: [30, 17, 17, 30, 17, 17, 30],
  C: [14, 17, 16, 16, 16, 17, 14],
  D: [30, 17, 17, 17, 17, 17, 30],
  E: [31, 16, 16, 30, 16, 16, 31],
  F: [31, 16, 16, 30, 16, 16, 16],
  G: [14, 17, 16, 19, 17, 17, 14],
  H: [17, 17, 17, 31, 17, 17, 17],
  I: [14, 4, 4, 4, 4, 4, 14],
  J: [1, 1, 1, 1, 17, 17, 14],
  K: [17, 18, 20, 24, 20, 18, 17],
  L: [16, 16, 16, 16, 16, 16, 31],
  M: [17, 27, 21, 21, 17, 17, 17],
  N: [17, 17, 25, 21, 19, 17, 17],
  O: [14, 17, 17, 17, 17, 17, 14],
  P: [30, 17, 17, 30, 16, 16, 16],
  Q: [14, 17, 17, 17, 21, 18, 13],
  R: [30, 17, 17, 30, 20, 18, 17],
  S: [14, 17, 16, 14, 1, 17, 14],
  T: [31, 4, 4, 4, 4, 4, 4],
  U: [17, 17, 17, 17, 17, 17, 14],
  V: [17, 17, 17, 17, 17, 10, 4],
  W: [17, 17, 17, 21, 21, 21, 10],
  X: [17, 17, 10, 4, 10, 17, 17],
  Y: [17, 17, 10, 4, 4, 4, 4],
  Z: [31, 1, 2, 4, 8, 16, 31],
};

type Rgb = [number, number, number];

function crc32(buf: Buffer): number {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc ^= buf[i]!;
    for (let j = 0; j < 8; j++) {
      const mask = -(crc & 1);
      crc = (crc >>> 1) ^ (0xedb88320 & mask);
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function pngChunk(type: string, data: Buffer): Buffer {
  const typeBuf = Buffer.from(type, "ascii");
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const crcBuf = Buffer.concat([typeBuf, data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(crcBuf), 0);
  return Buffer.concat([len, typeBuf, data, crc]);
}

function createCanvas(bg: Rgb): Uint8Array {
  const pixels = new Uint8Array(WIDTH * HEIGHT * 3);
  for (let i = 0; i < pixels.length; i += 3) {
    pixels[i] = bg[0];
    pixels[i + 1] = bg[1];
    pixels[i + 2] = bg[2];
  }
  return pixels;
}

function fillRect(
  pixels: Uint8Array,
  x: number,
  y: number,
  w: number,
  h: number,
  color: Rgb,
) {
  const x0 = Math.max(0, Math.floor(x));
  const y0 = Math.max(0, Math.floor(y));
  const x1 = Math.min(WIDTH, Math.ceil(x + w));
  const y1 = Math.min(HEIGHT, Math.ceil(y + h));
  for (let py = y0; py < y1; py++) {
    for (let px = x0; px < x1; px++) {
      const i = (py * WIDTH + px) * 3;
      pixels[i] = color[0];
      pixels[i + 1] = color[1];
      pixels[i + 2] = color[2];
    }
  }
}

function drawGlyph(
  pixels: Uint8Array,
  gx: number,
  gy: number,
  rows: number[],
  scale: number,
  color: Rgb,
) {
  for (let row = 0; row < 7; row++) {
    const bits = rows[row] ?? 0;
    for (let col = 0; col < 5; col++) {
      if (bits & (1 << (4 - col))) {
        fillRect(
          pixels,
          gx + col * scale,
          gy + row * scale,
          scale,
          scale,
          color,
        );
      }
    }
  }
}

function drawText(
  pixels: Uint8Array,
  text: string,
  x: number,
  y: number,
  scale: number,
  color: Rgb,
  maxWidth = WIDTH - 80,
) {
  let cx = x;
  const upper = text.toUpperCase();
  for (const ch of upper) {
    const glyph = GLYPHS[ch] ?? GLYPHS["?"]!;
    const advance = 6 * scale;
    if (cx + advance > x + maxWidth) break;
    drawGlyph(pixels, cx, y, glyph, scale, color);
    cx += advance;
  }
  return cx;
}

function encodePng(pixels: Uint8Array): Buffer {
  const stride = WIDTH * 3;
  const raw = Buffer.alloc((stride + 1) * HEIGHT);
  for (let y = 0; y < HEIGHT; y++) {
    const rowStart = y * (stride + 1);
    raw[rowStart] = 0;
    Buffer.from(pixels.buffer, pixels.byteOffset + y * stride, stride).copy(
      raw,
      rowStart + 1,
    );
  }
  const compressed = deflateSync(raw, { level: 9 });
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(WIDTH, 0);
  ihdr.writeUInt32BE(HEIGHT, 4);
  ihdr[8] = 8;
  ihdr[9] = 2;
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;
  return Buffer.concat([
    signature,
    pngChunk("IHDR", ihdr),
    pngChunk("IDAT", compressed),
    pngChunk("IEND", Buffer.alloc(0)),
  ]);
}

function drawGrid(pixels: Uint8Array) {
  const line: Rgb = [230, 224, 214];
  for (let x = 40; x < WIDTH; x += 40) fillRect(pixels, x, 0, 1, HEIGHT, line);
  for (let y = 40; y < HEIGHT; y += 40) fillRect(pixels, 0, y, WIDTH, 1, line);
}

function brandHeader(pixels: Uint8Array) {
  fillRect(pixels, 48, 48, 18, 18, [143, 92, 255]);
  drawText(pixels, "YC BATTLE", 78, 50, 3, [24, 21, 19]);
}

export function renderBattleOgPng(input: {
  nameA: string;
  nameB: string;
  pctA: number;
  pctB: number;
  category?: string;
}): Buffer {
  const pixels = createCanvas([246, 229, 210]);
  drawGrid(pixels);
  brandHeader(pixels);
  if (input.category) {
    drawText(pixels, input.category.slice(0, 28), 48, 100, 2, [98, 92, 85]);
  }
  drawText(pixels, input.nameA.slice(0, 18), 48, 180, 6, [24, 21, 19], 520);
  drawText(pixels, "VS", 560, 190, 4, [255, 80, 56]);
  drawText(pixels, input.nameB.slice(0, 18), 640, 180, 6, [24, 21, 19], 520);
  fillRect(pixels, 48, 320, 1104, 48, [24, 21, 19]);
  const aWidth = Math.max(8, Math.round((input.pctA / 100) * 1104));
  fillRect(pixels, 48, 320, aWidth, 48, [255, 80, 56]);
  fillRect(pixels, 48 + aWidth, 320, 1104 - aWidth, 48, [215, 255, 69]);
  drawText(pixels, `${Math.round(input.pctA)}%`, 60, 400, 5, [255, 80, 56]);
  drawText(pixels, `${Math.round(input.pctB)}%`, 980, 400, 5, [24, 21, 19]);
  drawText(pixels, "LIVE COMMUNITY SPLIT", 48, 520, 3, [98, 92, 85]);
  fillRect(pixels, 980, 480, 140, 90, [215, 255, 69]);
  fillRect(pixels, 1020, 520, 140, 90, [143, 92, 255]);
  return encodePng(pixels);
}

export function renderCompanyOgPng(input: {
  name: string;
  words: string[];
}): Buffer {
  const pixels = createCanvas([255, 248, 239]);
  drawGrid(pixels);
  brandHeader(pixels);
  drawText(pixels, "COMMUNITY PERCEPTION", 48, 110, 2, [98, 92, 85]);
  drawText(pixels, input.name.slice(0, 22), 48, 170, 7, [24, 21, 19], 900);
  const words = input.words.slice(0, 5);
  if (!words.length) {
    drawText(pixels, "NOT ENOUGH SIGNALS YET", 48, 320, 4, [98, 92, 85]);
  } else {
    let x = 48;
    let y = 300;
    words.forEach((word, index) => {
      const scale = Math.max(3, 7 - index);
      const label = word.slice(0, 14);
      const width = label.length * 6 * scale + 24;
      if (x + width > WIDTH - 48) {
        x = 48;
        y += 8 * scale + 24;
      }
      fillRect(
        pixels,
        x,
        y - 8,
        width,
        7 * scale + 16,
        index % 2 === 0 ? [255, 80, 56] : [215, 255, 69],
      );
      drawText(pixels, label, x + 12, y, scale, [24, 21, 19]);
      x += width + 16;
    });
  }
  drawText(pixels, "UNVERIFIED COMMUNITY WORDS", 48, 560, 2, [98, 92, 85]);
  return encodePng(pixels);
}

export function renderDnaOgPng(input: {
  archetype: string;
  headline: string;
  tendency?: string;
}): Buffer {
  const pixels = createCanvas([255, 248, 239]);
  drawGrid(pixels);
  brandHeader(pixels);

  fillRect(pixels, 930, 48, 222, 132, [24, 21, 19]);
  fillRect(pixels, 922, 40, 222, 132, [215, 255, 69]);
  drawText(pixels, "SHARE YOUR", 948, 68, 2, [24, 21, 19], 170);
  drawText(pixels, "TASTE", 948, 108, 4, [24, 21, 19], 170);

  drawText(pixels, "TASTE DNA", 48, 120, 2, [255, 80, 56]);
  drawText(pixels, input.archetype.slice(0, 36), 48, 170, 4, [24, 21, 19], 820);
  drawText(pixels, input.headline.slice(0, 52), 48, 270, 5, [24, 21, 19], 1080);

  fillRect(pixels, 48, 390, 1104, 3, [24, 21, 19]);
  if (input.tendency) {
    drawText(
      pixels,
      input.tendency.slice(0, 40),
      48,
      430,
      4,
      [255, 80, 56],
      900,
    );
  }
  drawText(pixels, "WHAT IS YOUR STARTUP TASTE?", 48, 520, 3, [98, 92, 85]);

  fillRect(pixels, 900, 500, 180, 54, [255, 80, 56]);
  fillRect(pixels, 1010, 530, 142, 54, [215, 255, 69]);
  return encodePng(pixels);
}

export function renderMapOgPng(input: {
  regions: Array<{ name: string; count: number }>;
  companyCount: number;
}): Buffer {
  const pixels = createCanvas([246, 229, 210]);
  drawGrid(pixels);
  brandHeader(pixels);
  drawText(pixels, "YC ECOSYSTEM TERRITORY", 48, 120, 3, [98, 92, 85]);
  drawText(pixels, "MAP OF SIGNAL", 48, 180, 7, [24, 21, 19]);
  drawText(
    pixels,
    `${input.companyCount} COMPANIES`,
    48,
    280,
    4,
    [255, 80, 56],
  );
  const regions = input.regions.slice(0, 5);
  regions.forEach((region, index) => {
    const y = 360 + index * 36;
    fillRect(
      pixels,
      48,
      y,
      18,
      18,
      index % 2 === 0 ? [255, 80, 56] : [215, 255, 69],
    );
    drawText(
      pixels,
      `${region.name.slice(0, 24)}  ${region.count}`,
      80,
      y,
      3,
      [24, 21, 19],
    );
  });
  if (!regions.length) {
    drawText(pixels, "COLLECTING TERRITORY SIGNALS", 48, 380, 3, [98, 92, 85]);
  }
  return encodePng(pixels);
}
