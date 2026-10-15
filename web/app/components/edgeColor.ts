export type Rgba = {
  r: number;
  g: number;
  b: number;
  a: number;
};

export function parseCssColor(input: string): Rgba | null {
  const value = input.trim().toLowerCase();
  if (!value) return null;
  if (value === "transparent") return { r: 0, g: 0, b: 0, a: 0 };

  const hex = /^#([0-9a-f]{3,8})$/.exec(value);
  if (hex) {
    const raw = hex[1];
    const channel = (pair: string) => Number.parseInt(pair, 16);
    if (raw.length === 3 || raw.length === 4) {
      return {
        r: channel(raw[0] + raw[0]),
        g: channel(raw[1] + raw[1]),
        b: channel(raw[2] + raw[2]),
        a: raw.length === 4 ? channel(raw[3] + raw[3]) / 255 : 1,
      };
    }
    if (raw.length === 6 || raw.length === 8) {
      return {
        r: channel(raw.slice(0, 2)),
        g: channel(raw.slice(2, 4)),
        b: channel(raw.slice(4, 6)),
        a: raw.length === 8 ? channel(raw.slice(6, 8)) / 255 : 1,
      };
    }
    return null;
  }

  const match =
    /^rgba?\(\s*([0-9.]+)\s*[,\s]\s*([0-9.]+)\s*[,\s]\s*([0-9.]+)\s*(?:[,/]\s*([0-9.]+%?))?\s*\)$/.exec(
      value,
    );
  if (!match) return null;

  const alphaRaw = match[4];
  let a = 1;
  if (alphaRaw) {
    a = alphaRaw.endsWith("%")
      ? Number.parseFloat(alphaRaw) / 100
      : Number.parseFloat(alphaRaw);
  }

  return {
    r: Number(match[1]),
    g: Number(match[2]),
    b: Number(match[3]),
    a,
  };
}

function composite(fg: Rgba, bg: Rgba): Rgba {
  const a = fg.a + bg.a * (1 - fg.a);
  if (a <= 0) return { r: bg.r, g: bg.g, b: bg.b, a: 0 };
  return {
    r: (fg.r * fg.a + bg.r * bg.a * (1 - fg.a)) / a,
    g: (fg.g * fg.a + bg.g * bg.a * (1 - fg.a)) / a,
    b: (fg.b * fg.a + bg.b * bg.a * (1 - fg.a)) / a,
    a,
  };
}

function channel(value: number): string {
  return Math.max(0, Math.min(255, Math.round(value)))
    .toString(16)
    .padStart(2, "0");
}

export function toHex(color: Rgba): string {
  return `#${channel(color.r)}${channel(color.g)}${channel(color.b)}`;
}

/** Normalize a declared CSS color to `#rrggbb`, or "" when it is empty. */
export function normalizeCssColor(input: string): string {
  const parsed = parseCssColor(input);
  if (!parsed || parsed.a <= 0) return "";
  return toHex(parsed);
}

/**
 * Collapse the backgrounds stacked at one edge into one opaque hex.
 * `frontToBack` is the hit-test order. Transparent layers are skipped.
 */
export function opaqueHex(frontToBack: readonly string[], fallback: string): string {
  const base = parseCssColor(fallback) ?? { r: 255, g: 255, b: 255, a: 1 };
  const layers: Rgba[] = [];

  for (const value of frontToBack) {
    const parsed = parseCssColor(value);
    if (!parsed || parsed.a <= 0) continue;
    layers.push(parsed);
    if (parsed.a >= 0.999) break;
  }

  let acc: Rgba = { r: base.r, g: base.g, b: base.b, a: 1 };
  for (let i = layers.length - 1; i >= 0; i -= 1) {
    acc = composite(layers[i], acc);
  }
  return toHex(acc);
}
