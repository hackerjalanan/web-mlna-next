import type { Mark, Result, Sample } from "./types";

export const fmt = (value: number) =>
  value.toFixed(1).replace(".", ",");

export const escapeXml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

export function calcStats(
  correctChars: number,
  keys: number,
  wrong: number,
  seconds: number
) {
  const minutes = Math.max(seconds, 1) / 60;

  return {
    kpm: Math.round(correctChars / 5 / minutes),
    cpm: Math.round(correctChars / minutes),
    acc: keys
      ? Math.max(0, Math.round(((keys - wrong) / keys) * 100))
      : 100,
  };
}

function valueAt(samples: Sample[], t: number) {
  if (!samples.length) return 0;
  if (t <= samples[0].t) return samples[0].kpm;

  const last = samples[samples.length - 1];
  if (t >= last.t) return last.kpm;

  for (let i = 1; i < samples.length; i++) {
    const a = samples[i - 1];
    const b = samples[i];

    if (t <= b.t) {
      const span = b.t - a.t;
      if (!span) return b.kpm;
      return a.kpm + ((b.kpm - a.kpm) * (t - a.t)) / span;
    }
  }

  return last.kpm;
}

export function chartInner(
  samples: Sample[],
  marks: Mark[],
  duration: number,
  width: number,
  height: number,
  labels = false
) {
  const left = 46;
  const right = 46;
  const top = 16;
  const bottom = 28;
  const plotW = width - left - right;
  const plotH = height - top - bottom;

  const maxKpm = Math.max(
    20,
    Math.ceil(Math.max(...samples.map((s) => s.kpm), 0) / 20) * 20
  );

  const x = (t: number) =>
    left + (Math.min(Math.max(t, 0), duration) / duration) * plotW;

  const yKpm = (value: number) =>
    top + plotH - (value / maxKpm) * plotH;

  const yAcc = (value: number) =>
    top + plotH - (value / 100) * plotH;

  const line = (fn: (s: Sample) => number) =>
    samples
      .map(
        (sample, index) =>
          `${index ? "L" : "M"}${x(sample.t).toFixed(1)},${fn(sample).toFixed(1)}`
      )
      .join(" ");

  let svg = "";

  for (let i = 0; i <= 4; i++) {
    const y = top + (plotH * i) / 4;
    svg += `
      <line x1="${left}" x2="${width - right}" y1="${y}" y2="${y}" stroke="#334155"/>
      <text x="${left - 7}" y="${y + 4}" text-anchor="end" font-size="11" fill="#fbbf24">${Math.round((maxKpm * (4 - i)) / 4)}</text>
      <text x="${width - right + 7}" y="${y + 4}" font-size="11" fill="#4ade80">${25 * (4 - i)}%</text>
    `;
  }

  const step = duration <= 30 ? 5 : duration <= 60 ? 10 : 20;
  for (let t = 0; t <= duration; t += step) {
    svg += `<text x="${x(t)}" y="${height - 8}" text-anchor="middle" font-size="11" fill="#94a3b8">${t}s</text>`;
  }

  if (samples.length > 1) {
    svg += `
      <path d="${line((s) => yAcc(s.acc))}" fill="none" stroke="#4ade80" stroke-width="2" stroke-dasharray="6 4"/>
      <path d="${line((s) => yKpm(s.kpm))}" fill="none" stroke="#fbbf24" stroke-width="3" stroke-linejoin="round"/>
    `;
  } else {
    svg += `<text x="${width / 2}" y="${height / 2}" text-anchor="middle" font-size="14" fill="#94a3b8">Grafik akan muncul saat tes berjalan</text>`;
  }

  marks.forEach((mark, index) => {
    const cx = x(mark.t);
    const cy = yKpm(valueAt(samples, mark.t));
    const color = mark.ok ? "#fbbf24" : "#ef4444";

    svg += `
      <circle data-i="${index}" cx="${cx}" cy="${cy}" r="14" fill="transparent" style="cursor:pointer"/>
      <circle data-i="${index}" cx="${cx}" cy="${cy}" r="6" fill="${color}" stroke="#fff" stroke-width="2" style="cursor:pointer"/>
    `;

    if (labels) {
      svg += `<text x="${cx}" y="${cy - 11}" text-anchor="middle" font-size="10" fill="${color}">${escapeXml(mark.word)}</text>`;
    }
  });

  return svg;
}

export function makeChartSvg(
  samples: Sample[],
  marks: Mark[],
  duration: number
) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 190" width="100%" font-family="ui-sans-serif,system-ui,sans-serif">${chartInner(samples, marks, duration, 800, 190)}</svg>`;
}

export function makeReportSvg(result: Result) {
  const width = 1000;
  const marks = result.marks ?? [];
  const shown = marks.slice(0, 18);
  const height = 650 + Math.max(1, shown.length) * 30;
  const language = result.lang === "id" ? "Indonesia" : "Inggris";

  let svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" font-family="Arial,sans-serif">
      <rect width="100%" height="100%" fill="#0f172a"/>
      <text x="40" y="55" font-size="30" font-weight="bold" fill="#fff">Laporan Tes Mengetik</text>
      <text x="40" y="85" font-size="15" fill="#94a3b8">${language} · ${result.dur} detik · ${escapeXml(result.date)}</text>
      <text x="40" y="185" font-size="100" font-weight="bold" fill="#fbbf24">${result.kpm}</text>
      <text x="48" y="218" font-size="17" fill="#cbd5e1">KPM</text>
  `;

  const tiles = [
    [350, "CPM", String(result.cpm)],
    [550, "Akurasi", `${result.acc}%`],
    [750, "Benar / Salah", `${result.okWords} / ${result.badWords}`],
  ] as const;

  for (const [x, label, value] of tiles) {
    svg += `
      <rect x="${x}" y="125" width="180" height="82" rx="12" fill="#1e293b"/>
      <text x="${x + 90}" y="165" text-anchor="middle" font-size="28" font-weight="bold" fill="#fff">${escapeXml(value)}</text>
      <text x="${x + 90}" y="190" text-anchor="middle" font-size="13" fill="#94a3b8">${label}</text>
    `;
  }

  svg += `
    <g transform="translate(40,260)">${chartInner(result.samples ?? [], marks, result.dur, 920, 250, true)}</g>
    <text x="40" y="545" font-size="17" font-weight="bold" fill="#fff">Catatan kata yang mengalami kesalahan</text>
    <text x="40" y="580" font-size="13" fill="#94a3b8">KATA ASLI</text>
    <text x="300" y="580" font-size="13" fill="#94a3b8">DIKETIK</text>
    <text x="590" y="580" font-size="13" fill="#94a3b8">WAKTU</text>
    <text x="760" y="580" font-size="13" fill="#94a3b8">STATUS</text>
  `;

  if (!shown.length) {
    svg += `<text x="40" y="615" font-size="15" fill="#4ade80">Tidak ada kata yang salah. Bagus!</text>`;
  }

  shown.forEach((mark, index) => {
    const y = 615 + index * 30;
    const color = mark.ok ? "#fbbf24" : "#f87171";
    svg += `
      <text x="40" y="${y}" font-size="15" fill="#fff">${escapeXml(mark.word)}</text>
      <text x="300" y="${y}" font-size="15" fill="${color}">${escapeXml(mark.typed)}</text>
      <text x="590" y="${y}" font-size="15" fill="#cbd5e1">${fmt(mark.t)} detik</text>
      <text x="760" y="${y}" font-size="15" fill="${color}">${mark.ok ? "Terkoreksi" : "Salah"} (${mark.wrong}x)</text>
    `;
  });

  svg += `</svg>`;
  return { svg, width, height };
}

export function downloadResultPng(result: Result) {
  const { svg, width, height } = makeReportSvg(result);
  const image = new Image();

  image.onload = () => {
    const canvas = document.createElement("canvas");
    canvas.width = width * 2;
    canvas.height = height * 2;

    const context = canvas.getContext("2d");
    if (!context) return;

    context.scale(2, 2);
    context.drawImage(image, 0, 0, width, height);

    canvas.toBlob((blob) => {
      if (!blob) return;

      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `typing-kpm-${result.kpm}kpm.png`;
      anchor.click();

      setTimeout(() => URL.revokeObjectURL(url), 1000);
    }, "image/png");
  };

  image.onerror = () => {
    alert("Gagal membuat gambar laporan.");
  };

  image.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}
