"use client";

import { useEffect, useRef, useState } from "react";

const COUNTRIES = [
  { name: "Indonesia", flag: "🇮🇩", tz: "Asia/Jakarta" },
  { name: "Brasil", flag: "🇧🇷", tz: "America/Sao_Paulo" },
  { name: "Amerika Serikat", flag: "🇺🇸", tz: "America/New_York" },
  { name: "Inggris", flag: "🇬🇧", tz: "Europe/London" },
  { name: "Jepang", flag: "🇯🇵", tz: "Asia/Tokyo" },
  { name: "Korea Selatan", flag: "🇰🇷", tz: "Asia/Seoul" },
  { name: "Tiongkok", flag: "🇨🇳", tz: "Asia/Shanghai" },
  { name: "India", flag: "🇮🇳", tz: "Asia/Kolkata" },
  { name: "Australia", flag: "🇦🇺", tz: "Australia/Sydney" },
  { name: "Jerman", flag: "🇩🇪", tz: "Europe/Berlin" },
  { name: "Prancis", flag: "🇫🇷", tz: "Europe/Paris" },
  { name: "Rusia", flag: "🇷🇺", tz: "Europe/Moscow" },
  { name: "Arab Saudi", flag: "🇸🇦", tz: "Asia/Riyadh" },
  { name: "Uni Emirat Arab", flag: "🇦🇪", tz: "Asia/Dubai" },
  { name: "Mesir", flag: "🇪🇬", tz: "Africa/Cairo" },
  { name: "Afrika Selatan", flag: "🇿🇦", tz: "Africa/Johannesburg" },
  { name: "Meksiko", flag: "🇲🇽", tz: "America/Mexico_City" },
  { name: "Argentina", flag: "🇦🇷", tz: "America/Argentina/Buenos_Aires" },
  { name: "Kanada", flag: "🇨🇦", tz: "America/Toronto" },
  { name: "Singapura", flag: "🇸🇬", tz: "Asia/Singapore" },
];

type Alarm = {
  id: number;
  name: string;
  time: string; // HH:MM:SS
  tz: string;
  label: string;
  type: string;
  on: boolean;
  fired: string;
};

type AlarmType = {
  id: string;
  name: string;
  icon: string;
  every: number;
  tag: string;
  ink: string;
  bg: string;
  flash: string;
  text: string;
  btn: string;
  range: string;
  hero: string;
  crowd: string[];
  stripes?: boolean;
};

const TYPES: AlarmType[] = [
  { id: "zombie", name: "Zombi", icon: "🧟", every: 1600, tag: "Zombi datang! Bangun!", ink: "text-white", bg: "from-black via-green-950 to-lime-900", flash: "bg-red-700/30", text: "text-lime-300", btn: "bg-lime-400 text-black", range: "accent-lime-400", hero: "animate-bounce", crowd: ["🧟", "🧟‍♀️", "🧟‍♂️", "🧟", "🧟‍♀️"] },
  { id: "radioactive", name: "Radioaktif", icon: "☢️", every: 1300, tag: "Peringatan radiasi! Bangun!", ink: "text-white", bg: "from-neutral-950 via-neutral-900 to-yellow-900", flash: "bg-yellow-400/20", text: "text-yellow-300", btn: "bg-yellow-400 text-black", range: "accent-yellow-400", hero: "animate-spin", crowd: ["☢️", "⚠️", "☣️", "⚠️", "☢️"], stripes: true },
  { id: "classic", name: "Klasik", icon: "⏰", every: 800, tag: "Waktunya bangun!", ink: "text-white", bg: "from-red-700 via-red-600 to-red-800", flash: "bg-white/10", text: "text-white", btn: "bg-white text-red-600", range: "accent-white", hero: "animate-bounce", crowd: ["⏰", "⏰", "⏰", "⏰", "⏰"] },
  { id: "siren", name: "Sirene", icon: "🚨", every: 1600, tag: "Darurat! Bangun!", ink: "text-white", bg: "from-blue-950 via-slate-900 to-red-950", flash: "bg-red-600/30", text: "text-red-300", btn: "bg-red-500 text-white", range: "accent-red-500", hero: "animate-pulse", crowd: ["🚓", "🚨", "🚒", "🚨", "🚑"] },
  { id: "robot", name: "Robot", icon: "🤖", every: 900, tag: "Sistem aktif. Bangun, manusia.", ink: "text-white", bg: "from-slate-950 via-cyan-950 to-slate-900", flash: "bg-cyan-400/10", text: "text-cyan-300", btn: "bg-cyan-400 text-black", range: "accent-cyan-400", hero: "animate-bounce", crowd: ["🤖", "⚙️", "🔧", "⚙️", "🤖"] },
  { id: "rooster", name: "Ayam jago", icon: "🐓", every: 2000, tag: "Kukuruyuk! Pagi tiba!", ink: "text-orange-950", bg: "from-orange-400 via-amber-300 to-yellow-200", flash: "bg-white/20", text: "text-orange-900", btn: "bg-orange-700 text-white", range: "accent-orange-700", hero: "animate-bounce", crowd: ["🐓", "🐔", "🌅", "🐔", "🐓"] },
  { id: "sonar", name: "Sonar", icon: "🌊", every: 2000, tag: "Ping! Ada kontak. Bangun!", ink: "text-white", bg: "from-sky-950 via-blue-900 to-teal-900", flash: "bg-teal-400/10", text: "text-teal-300", btn: "bg-teal-300 text-black", range: "accent-teal-300", hero: "animate-pulse", crowd: ["🐠", "🐙", "🐳", "🐙", "🐠"] },
  { id: "ufo", name: "UFO", icon: "👽", every: 1800, tag: "Kamu diculik! Bangun!", ink: "text-white", bg: "from-indigo-950 via-purple-900 to-fuchsia-950", flash: "bg-fuchsia-500/20", text: "text-fuchsia-300", btn: "bg-fuchsia-400 text-black", range: "accent-fuchsia-400", hero: "animate-bounce", crowd: ["🛸", "👽", "🛸", "👽", "🛸"] },
  { id: "fire", name: "Kebakaran", icon: "🔥", every: 600, tag: "Ada api! Bangun!", ink: "text-white", bg: "from-red-950 via-orange-700 to-yellow-500", flash: "bg-orange-500/30", text: "text-yellow-200", btn: "bg-yellow-300 text-black", range: "accent-yellow-300", hero: "animate-pulse", crowd: ["🔥", "🧯", "🔥", "🚒", "🔥"] },
  { id: "bell", name: "Lonceng", icon: "🔔", every: 2200, tag: "Lonceng berbunyi. Bangun!", ink: "text-white", bg: "from-amber-950 via-stone-900 to-yellow-900", flash: "bg-amber-300/10", text: "text-amber-300", btn: "bg-amber-300 text-black", range: "accent-amber-300", hero: "animate-bounce", crowd: ["🔔", "⛪", "🔔", "⛪", "🔔"] },
];

const typeOf = (id?: string) => TYPES.find((x) => x.id === id) ?? TYPES[0];

const pad = (n: number) => String(n).padStart(2, "0");

function getTime(date: Date, tz: string) {
  const p = new Intl.DateTimeFormat("en-GB", {
    timeZone: tz,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(date);
  const get = (t: string) => Number(p.find((x) => x.type === t)?.value ?? 0) % 24;
  return { h: get("hour"), m: get("minute"), s: get("second") };
}

export default function Page() {
  const [now, setNow] = useState<Date | null>(null);
  const [tz, setTz] = useState(COUNTRIES[0].tz);
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const [ringing, setRinging] = useState<Alarm | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [duration, setDuration] = useState(30);
  const [volume, setVolume] = useState(70);
  const [notifOn, setNotifOn] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [type, setType] = useState("zombie");
  const [pickerOpen, setPickerOpen] = useState(false);
  const [notifPerm, setNotifPerm] = useState<string>("default");

  const [name, setName] = useState("");
  const [h, setH] = useState(7);
  const [m, setM] = useState(0);
  const [s, setS] = useState(0);

  const ctx = useRef<AudioContext | null>(null);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const autoStop = useRef<ReturnType<typeof setTimeout> | null>(null);
  const volumeRef = useRef(70);
  const formRef = useRef<HTMLElement | null>(null);

  const country = COUNTRIES.find((c) => c.tz === tz)!;
  const t = now ? getTime(now, tz) : null;

  useEffect(() => {
    setNow(new Date());
    const i = setInterval(() => setNow(new Date()), 250);
    return () => clearInterval(i);
  }, []);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("alarm-app");
      if (saved) {
        const data = JSON.parse(saved);
        if (Array.isArray(data.alarms)) setAlarms(data.alarms);
        if (COUNTRIES.some((c) => c.tz === data.tz)) setTz(data.tz);
        if (typeof data.duration === "number") setDuration(data.duration);
        if (typeof data.volume === "number") setVolume(data.volume);
        if (typeof data.notifOn === "boolean") setNotifOn(data.notifOn);
      }
    } catch {}
    if ("Notification" in window) setNotifPerm(Notification.permission);
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem("alarm-app", JSON.stringify({ alarms, tz, duration, volume, notifOn }));
    } catch {}
  }, [alarms, tz, duration, volume, notifOn, loaded]);

  useEffect(() => {
    volumeRef.current = volume;
  }, [volume]);

  const play = (id: string) => {
    const c = ctx.current;
    const vol = volumeRef.current / 100;
    if (!c || vol <= 0) return;
    const t0 = c.currentTime;

    const tone = (f: number, d: number, at = 0, w: OscillatorType = "sine", f2?: number, g = 0.4) => {
      const o = c.createOscillator();
      const gn = c.createGain();
      o.type = w;
      o.frequency.setValueAtTime(f, t0 + at);
      if (f2) o.frequency.exponentialRampToValueAtTime(f2, t0 + at + d);
      gn.gain.setValueAtTime(0.001, t0 + at);
      gn.gain.linearRampToValueAtTime(Math.max(0.002, vol * g), t0 + at + 0.02);
      gn.gain.exponentialRampToValueAtTime(0.001, t0 + at + d);
      o.connect(gn);
      gn.connect(c.destination);
      o.start(t0 + at);
      o.stop(t0 + at + d + 0.05);
    };

    const click = (at: number, g = 0.8) => {
      const len = Math.floor(c.sampleRate * 0.02);
      const buf = c.createBuffer(1, len, c.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
      const src = c.createBufferSource();
      const gn = c.createGain();
      src.buffer = buf;
      gn.gain.value = Math.max(0.002, vol * g);
      src.connect(gn);
      gn.connect(c.destination);
      src.start(t0 + at);
    };

    switch (id) {
      case "radioactive":
        tone(500, 1, 0, "sawtooth", 1100, 0.25);
        for (let i = 0; i < 16; i++) click(Math.random() * 1.2);
        break;
      case "classic":
        tone(880, 0.15, 0, "square", undefined, 0.3);
        tone(880, 0.15, 0.22, "square", undefined, 0.3);
        break;
      case "siren":
        tone(600, 0.8, 0, "sawtooth", 1200, 0.3);
        tone(1200, 0.7, 0.8, "sawtooth", 600, 0.3);
        break;
      case "robot":
        tone(400, 0.12, 0, "square", undefined, 0.3);
        tone(800, 0.12, 0.15, "square", undefined, 0.3);
        tone(300, 0.12, 0.3, "square", undefined, 0.3);
        tone(1000, 0.15, 0.45, "square", undefined, 0.3);
        break;
      case "rooster":
        tone(450, 0.2, 0, "sawtooth", 650, 0.3);
        tone(650, 0.25, 0.25, "sawtooth", 900, 0.3);
        tone(900, 0.9, 0.55, "sawtooth", 600, 0.3);
        break;
      case "sonar":
        tone(1000, 1.2, 0, "sine", undefined, 0.5);
        tone(1000, 1, 0.5, "sine", undefined, 0.15);
        break;
      case "ufo":
        for (let i = 0; i < 8; i++) {
          const up = i % 2 === 0;
          tone(up ? 700 : 1000, 0.18, i * 0.2, "sine", up ? 1000 : 700, 0.35);
        }
        break;
      case "fire":
        for (let i = 0; i < 4; i++) tone(1600, 0.07, i * 0.1, "square", undefined, 0.25);
        break;
      case "bell":
        tone(660, 2, 0, "sine", undefined, 0.5);
        tone(1320, 1.5, 0, "sine", undefined, 0.2);
        tone(990, 1.2, 0, "sine", undefined, 0.2);
        break;
      default: {
        const dur = 1.4;
        const o = c.createOscillator();
        o.type = "sawtooth";
        o.frequency.setValueAtTime(130, t0);
        o.frequency.exponentialRampToValueAtTime(55, t0 + dur);
        const lfo = c.createOscillator();
        const lfoGain = c.createGain();
        lfo.frequency.value = 7;
        lfoGain.gain.value = 8;
        lfo.connect(lfoGain);
        lfoGain.connect(o.frequency);
        const f = c.createBiquadFilter();
        f.type = "lowpass";
        f.Q.value = 8;
        f.frequency.setValueAtTime(300, t0);
        f.frequency.linearRampToValueAtTime(900, t0 + 0.5);
        f.frequency.linearRampToValueAtTime(250, t0 + dur);
        const g = c.createGain();
        g.gain.setValueAtTime(0.001, t0);
        g.gain.linearRampToValueAtTime(Math.max(0.002, vol * 0.6), t0 + 0.2);
        g.gain.linearRampToValueAtTime(0.001, t0 + dur);
        o.connect(f);
        f.connect(g);
        g.connect(c.destination);
        o.start(t0);
        lfo.start(t0);
        o.stop(t0 + dur);
        lfo.stop(t0 + dur);
      }
    }
  };

  const ring = (a: Alarm) => {
    if (!ctx.current) ctx.current = new AudioContext();
    ctx.current.resume();
    setRinging(a);
    play(a.type);
    if (timer.current) clearInterval(timer.current);
    timer.current = setInterval(() => play(a.type), typeOf(a.type).every);
    if (autoStop.current) clearTimeout(autoStop.current);
    autoStop.current = setTimeout(stop, duration * 1000);
    if (notifOn && "Notification" in window && Notification.permission === "granted") {
      try {
        new Notification(`${typeOf(a.type).icon} ${a.name}`, { body: `${a.time} · ${a.label}`, requireInteraction: true });
      } catch {}
    }
  };

  const previewVolume = (id: string = type) => {
    if (!ctx.current) ctx.current = new AudioContext();
    ctx.current.resume();
    play(id);
  };

  const stop = () => {
    if (timer.current) clearInterval(timer.current);
    if (autoStop.current) clearTimeout(autoStop.current);
    setRinging(null);
  };

  const askNotif = async () => {
    if (!("Notification" in window)) return;
    const result = await Notification.requestPermission();
    setNotifPerm(result);
    if (result === "granted") setNotifOn(true);
  };

  useEffect(() => {
    if (!now || ringing) return;
    for (const a of alarms) {
      if (!a.on) continue;
      const x = getTime(now, a.tz);
      const key = `${now.toDateString()} ${a.time}`;
      if (`${pad(x.h)}:${pad(x.m)}:${pad(x.s)}` === a.time && a.fired !== key) {
        setAlarms((list) => list.map((i) => (i.id === a.id ? { ...i, fired: key } : i)));
        ring(a);
        break;
      }
    }
  }, [now]);

  const saveAlarm = () => {
    if (!ctx.current) ctx.current = new AudioContext();
    ctx.current.resume();
    const data = {
      name: name.trim() || "Alarm",
      time: `${pad(h)}:${pad(m)}:${pad(s)}`,
      tz,
      label: `${country.flag} ${country.name}`,
      type,
      fired: "",
    };
    if (editingId !== null) {
      setAlarms(alarms.map((a) => (a.id === editingId ? { ...a, ...data } : a)));
    } else {
      setAlarms([...alarms, { id: Date.now(), on: true, ...data }]);
    }
    resetForm();
  };

  const startEdit = (a: Alarm) => {
    const [hh, mm, ss] = a.time.split(":").map(Number);
    setEditingId(a.id);
    setName(a.name);
    setH(hh);
    setM(mm);
    setS(ss);
    setTz(a.tz);
    setType(a.type ?? "zombie");
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const resetForm = () => {
    setEditingId(null);
    setName("");
  };

  useEffect(() => {
    if (!pickerOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setPickerOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [pickerOpen]);

  const T = typeOf(ringing?.type);
  const box = "w-full rounded-lg border border-slate-600 bg-slate-900 p-2.5 text-white";
  const nums = (n: number) => Array.from({ length: n }, (_, i) => i);

  return (
    <main className="min-h-screen bg-slate-900 p-4 text-white lg:h-screen lg:overflow-y-auto">
      {ringing && (
        <div
          className={`fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b ${T.bg} ${T.ink} text-center`}
        >
          {T.stripes && (
            <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,#facc15_0_24px,#111_24px_48px)] opacity-20" />
          )}
          <span className={`absolute h-72 w-72 animate-ping rounded-full ${T.flash}`} />
          <div className={`absolute inset-0 animate-pulse ${T.flash}`} />
          <div className="absolute inset-x-0 bottom-0 flex justify-around text-6xl sm:text-7xl">
            {T.crowd.map((z, i) => (
              <span key={i} className="animate-bounce" style={{ animationDelay: `${i * 0.2}s` }}>
                {z}
              </span>
            ))}
          </div>
          <div className="relative flex flex-col items-center">
            <div className={`${T.hero} text-8xl`}>{T.icon}</div>
            <p className={`mt-2 text-xl font-bold ${T.text}`}>{T.tag}</p>
            <h2 className="mt-4 text-4xl font-bold">{ringing.name}</h2>
            <p className="mt-2 font-mono text-5xl">{ringing.time}</p>
            <p className="mt-2">{ringing.label}</p>
            <div className="mt-8 flex flex-col items-center gap-4">
              <label className="flex items-center gap-3">
                <span>{volume === 0 ? "🔇" : "🔊"}</span>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={volume}
                  onChange={(e) => setVolume(+e.target.value)}
                  className={`w-40 ${T.range}`}
                />
                <span className="w-10 text-right font-mono">{volume}%</span>
              </label>
              <button onClick={stop} className={`rounded-full px-8 py-4 text-lg font-bold ${T.btn}`}>
                Matikan alarm
              </button>
            </div>
          </div>
        </div>
      )}

      {pickerOpen && (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 p-4"
          onClick={() => setPickerOpen(false)}
        >
          <div
            role="dialog"
            aria-label="Pilih negara"
            onClick={(e) => e.stopPropagation()}
            className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-slate-800 p-4"
          >
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-bold">Pilih negara</h2>
              <button onClick={() => setPickerOpen(false)} className="rounded-lg border border-slate-600 px-3 py-1">
                Tutup
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
              {COUNTRIES.map((c) => (
                <button
                  key={c.tz}
                  onClick={() => {
                    setTz(c.tz);
                    setPickerOpen(false);
                  }}
                  className={`rounded-lg border p-3 text-left ${c.tz === tz ? "border-amber-400 bg-slate-700" : "border-slate-600 hover:bg-slate-700"}`}
                >
                  {c.flag} {c.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-xl space-y-4 lg:grid lg:h-full lg:min-h-[620px] lg:max-w-6xl lg:grid-cols-12 lg:grid-rows-[auto_minmax(0,1fr)] lg:gap-4 lg:space-y-0">
        <section className="rounded-2xl bg-slate-800 p-4 text-center lg:col-span-12 lg:flex lg:items-center lg:justify-between lg:gap-6 lg:text-left">
          <div className="lg:w-72">
            <button
              onClick={() => setPickerOpen(true)}
              aria-haspopup="dialog"
              className={`${box} flex items-center justify-between text-left`}
            >
              <span>
                {country.flag} {country.name}
              </span>
              <span className="text-slate-400">▾</span>
            </button>
          </div>

          <div className="mt-4 flex items-start justify-center gap-2 font-mono lg:mt-0">
            {(
              [
                ["jam", t?.h],
                ["menit", t?.m],
                ["detik", t?.s],
              ] as const
            ).map(([label, v], i) => (
              <div key={label} className="flex items-start gap-2">
                {i > 0 && <span className="text-5xl text-amber-400 lg:text-7xl">:</span>}
                <div className="text-center">
                  <div className={`text-5xl font-bold sm:text-7xl lg:text-8xl ${i === 2 ? "text-amber-400" : ""}`}>
                    {v === undefined ? "--" : pad(v)}
                  </div>
                  <div className="text-sm text-slate-400">{label}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="space-y-4 lg:col-span-5 lg:min-h-0 lg:space-y-3">
          <section ref={formRef} className="space-y-2 rounded-2xl bg-slate-800 p-4">
            <h2 className="text-lg font-bold">{editingId !== null ? "Edit alarm" : "Buat alarm"}</h2>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nama alarm"
              className={box}
            />
            <select
              value={type}
              onChange={(e) => {
                setType(e.target.value);
                previewVolume(e.target.value);
              }}
              className={box}
              aria-label="Jenis alarm"
            >
              {TYPES.map((x) => (
                <option key={x.id} value={x.id}>
                  {x.icon} {x.name}
                </option>
              ))}
            </select>
            <div className="grid grid-cols-3 gap-2">
              <select value={h} onChange={(e) => setH(+e.target.value)} className={box}>
                {nums(24).map((n) => (
                  <option key={n} value={n}>{pad(n)} jam</option>
                ))}
              </select>
              <select value={m} onChange={(e) => setM(+e.target.value)} className={box}>
                {nums(60).map((n) => (
                  <option key={n} value={n}>{pad(n)} menit</option>
                ))}
              </select>
              <select value={s} onChange={(e) => setS(+e.target.value)} className={box}>
                {nums(60).map((n) => (
                  <option key={n} value={n}>{pad(n)} detik</option>
                ))}
              </select>
            </div>
            <div className="flex gap-2">
              <button
                onClick={saveAlarm}
                className="flex-1 rounded-lg bg-amber-400 p-2.5 font-bold text-black"
              >
                {editingId !== null ? "Simpan perubahan" : "Tambah alarm"}
              </button>
              {editingId !== null && (
                <button onClick={resetForm} className="rounded-lg border border-slate-600 px-4">
                  Batal
                </button>
              )}
              <button
                onClick={() => ring({ id: 0, name: "Tes alarm", time: "00:00:00", tz, label: `${country.flag} ${country.name}`, on: true, fired: "", type })}
                className="rounded-lg border border-slate-600 px-4"
              >
                Tes
              </button>
            </div>
          </section>

          <section className="space-y-2 rounded-2xl bg-slate-800 p-4">
            <h2 className="font-bold">Pengaturan</h2>
            <div className="flex items-center justify-between gap-3">
              <label htmlFor="dur">Lama alarm menyala</label>
              <select
                id="dur"
                value={duration}
                onChange={(e) => setDuration(+e.target.value)}
                className="rounded-lg border border-slate-600 bg-slate-900 p-1.5"
              >
                {[10, 20, 30, 60, 120, 300].map((n) => (
                  <option key={n} value={n}>
                    {n >= 60 ? `${n / 60} menit` : `${n} detik`}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center justify-between gap-3">
              <label htmlFor="vol">Volume suara</label>
              <div className="flex items-center gap-3">
                <input
                  id="vol"
                  type="range"
                  min={0}
                  max={100}
                  value={volume}
                  onChange={(e) => setVolume(+e.target.value)}
                  onPointerUp={() => previewVolume()}
                  className="w-36 accent-amber-400"
                />
                <span className="w-12 text-right font-mono">{volume === 0 ? "Mati" : `${volume}%`}</span>
              </div>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span>Notifikasi</span>
              {notifPerm === "granted" ? (
                <button
                  onClick={() => setNotifOn(!notifOn)}
                  aria-label={notifOn ? "Nonaktifkan notifikasi" : "Aktifkan notifikasi"}
                  className={`relative h-6 w-11 rounded-full ${notifOn ? "bg-amber-400" : "bg-slate-600"}`}
                >
                  <span
                    className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${notifOn ? "left-5" : "left-0.5"}`}
                  />
                </button>
              ) : notifPerm === "denied" ? (
                <span className="text-red-400">Diblokir di browser</span>
              ) : (
                <button onClick={askNotif} className="rounded-lg bg-amber-400 px-4 py-1.5 font-bold text-black">
                  Aktifkan
                </button>
              )}
            </div>
          </section>
        </div>

        <section className="rounded-2xl bg-slate-800 p-4 lg:col-span-7 lg:min-h-0 lg:overflow-y-auto">
          <h2 className="mb-3 text-lg font-bold">Daftar alarm ({alarms.length})</h2>
          {alarms.length === 0 && <p className="text-slate-400">Belum ada alarm. Buat alarm baru di formulir.</p>}
          <ul className="grid gap-2 lg:grid-cols-2 lg:content-start">
            {alarms.map((a) => (
              <li
                key={a.id}
                className={`flex items-center justify-between rounded-lg border p-3 lg:flex-col lg:items-stretch lg:gap-2 ${editingId === a.id ? "border-amber-400" : "border-slate-600"} ${a.on ? "" : "opacity-50"}`}
              >
                <div className="min-w-0">
                  <p className="truncate font-bold">{a.name}</p>
                  <p className="font-mono text-2xl text-amber-400">{a.time}</p>
                  <p className="truncate text-sm text-slate-400">
                    {typeOf(a.type).icon} {typeOf(a.type).name} · {a.label}
                  </p>
                </div>
                <div className="flex items-center gap-3 lg:justify-between">
                  <button
                    onClick={() => setAlarms(alarms.map((i) => (i.id === a.id ? { ...i, on: !i.on } : i)))}
                    aria-label={a.on ? "Matikan alarm" : "Aktifkan alarm"}
                    className={`relative h-6 w-11 rounded-full ${a.on ? "bg-amber-400" : "bg-slate-600"}`}
                  >
                    <span
                      className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${a.on ? "left-5" : "left-0.5"}`}
                    />
                  </button>
                  <div className="flex gap-3">
                    <button onClick={() => startEdit(a)} className="text-amber-400">
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        setAlarms(alarms.filter((i) => i.id !== a.id));
                        if (editingId === a.id) resetForm();
                      }}
                      className="text-red-400"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}