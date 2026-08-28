import { generateText, convertToModelMessages, type UIMessage } from 'ai';
import { createClient } from '@/lib/supabase/server';
import { randomUUID } from 'crypto';
import { groq } from '@ai-sdk/groq';
import { apiHandler } from '@/lib/api/handler';
import { success } from '@/lib/api/response';
import { http } from '@/lib/api/http';
import { json as parseJson } from '@/lib/api/request';

export const runtime = 'nodejs';

async function getFullContext() {
  const supabase = await createClient();

  const [
    { data: projects },
    { data: skills },
    { data: services },
    { data: experiences },
    { data: socials },
  ] = await Promise.all([
    supabase
      .from('projects')
      .select('title, category, year, description, technologies, github, demo, featured'),
    supabase.from('skills').select('name, category').order('sort_order'),
    supabase.from('services').select('title, description').order('sort_order'),
    supabase
      .from('experiences')
      .select('role, company, period, description')
      .order('sort_order'),
    supabase.from('socials').select('label, value, href').order('sort_order'),
  ]);

  const projectsText = (projects ?? [])
    .map((p) => `\nJudul: ${p.title}\nKategori: ${p.category}\nTahun: ${p.year}\nTeknologi: ${Array.isArray(p.technologies) ? p.technologies.join(', ') : p.technologies}\nDeskripsi: ${p.description}\nGitHub: ${p.github ?? 'tidak tersedia'}\nDemo: ${p.demo ?? 'tidak tersedia'}`)
    .join('\n---\n');

  const skillsText = (skills ?? []).map((s) => s.name).join(', ');

  const servicesText = (services ?? [])
    .map((s) => `- ${s.title}: ${s.description}`)
    .join('\n');

  const experiencesText = (experiences ?? [])
    .map((e) => `- ${e.role} di ${e.company} (${e.period}): ${e.description}`)
    .join('\n');

  const socialsText = (socials ?? [])
    .map((s) => `${s.label}: ${s.value} (${s.href})`)
    .join('\n');

  return `\n=== PROYEK ===\n${projectsText || 'Belum ada data proyek.'}\n\n=== SKILL / TEKNOLOGI YANG DIKUASAI ===\n${skillsText || 'Belum ada data skill.'}\n\n=== LAYANAN YANG DITAWARKAN ===\n${servicesText || 'Belum ada data layanan.'}\n\n=== PENGALAMAN KERJA ===\n${experiencesText || 'Belum ada data pengalaman.'}\n\n=== KONTAK ===\n${socialsText || 'Belum ada data kontak.'}\n`;
}

export const POST = apiHandler(async (request: Request) => {
  const requestId = randomUUID();
  console.log(`--- [${requestId}] Request masuk ke /api/v1/chat ---`);

  const body = await parseJson<{ messages?: UIMessage[] }>(request);

  if (!body.messages || !Array.isArray(body.messages)) {
    throw http.badRequest('Field "messages" wajib berupa array', 'VALIDATION_ERROR');
  }

  const messages: UIMessage[] = body.messages.map((m: UIMessage) => ({
    ...m,
    id: m.id || randomUUID(),
  }));

  const context = await getFullContext();

  const modelMessages = await convertToModelMessages(messages);

  const result = await generateText({
    model: groq('openai/gpt-oss-120b'),
    system: `
Kamu adalah asisten AI di website Profile Ade — anggap dirimu seperti teman Ade yang ngerti banget soal kerjaan dan proyek-proyeknya, dan siap cerita ke pengunjung yang mampir.

Yang bisa kamu bantu:
- Cerita soal proyek-proyek yang pernah Ade kerjakan, teknologi yang dipakai, dan hasilnya
- Jelasin skill dan tools yang dikuasai Ade
- Kasih tahu layanan apa aja yang bisa Ade bantu
- Cerita pengalaman kerja Ade — di mana pernah kerja, ngapain aja di sana, sejak kapan
- Arahin ke kontak yang pas kalau ada yang mau ngobrol langsung sama Ade

Cara ngomongnya:
- Santai tapi tetap sopan, kayak lagi chat biasa — bukan baca laporan resmi
- Jangan kaku atau terlalu formal, tapi juga jangan lebay
- Jawab singkat dan to the point, nggak perlu muter-muter
- Kalau ditanya sesuatu yang datanya nggak ada, jujur aja bilang belum tahu / belum ada infonya, terus arahin buat kontak langsung ke Ade
- Jangan ngarang-ngarang info yang nggak ada di data di bawah

DATA:
${context}
`,
    messages: modelMessages,
  });

  
    const text = result.text;


    return success(
    {
        reply: text,
    },
    "Chat berhasil"
    );
});
