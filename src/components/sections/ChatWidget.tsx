'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

export default function ChatWidget({ onClose }: { onClose?: () => void }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);


  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: input,
    };


    setMessages((prev) => [
      ...prev,
      userMessage,
    ]);

    setInput('');
    setIsLoading(true);


    try {

      const response = await fetch('/api/v1/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            ...messages,
            userMessage,
          ].map((m) => ({
            id: m.id,
            role: m.role,
            parts: [
              {
                type: 'text',
                text: m.content,
              },
            ],
          })),
        }),
      });


      const result = await response.json();


      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: result.data.reply,
      };


      setMessages((prev) => [
        ...prev,
        assistantMessage,
      ]);


    } catch (error) {

      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: 'Terjadi kesalahan server.',
        },
      ]);

    } finally {

      setIsLoading(false);

    }
  };


  return (
    <div className="w-80 h-[28rem] bg-[#041025] border border-cyan-900 rounded-xl shadow-lg flex flex-col overflow-hidden">

      <div className="p-3 bg-gradient-to-r from-[#06102a] to-[#0a2a4a] text-cyan-200 font-semibold flex justify-between items-center">
        Tanya asisten AI Ade

        <button 
          onClick={onClose}
          className="text-cyan-300 hover:text-white"
        >
          <X size={18}/>
        </button>
      </div>


      <div className="flex-1 overflow-y-auto p-3 space-y-2 text-sm bg-[#031425]/70">


        {messages.length === 0 && (
          <div className="text-cyan-200 text-center mt-4">
            Ada yang bisa dibantu soal proyek saya? 👋
          </div>
        )}


        {messages.map((m)=>(
          <div
            key={m.id}
            className={
              m.role === 'user'
              ? 'text-right'
              : 'text-left'
            }
          >

            <div
              className={`inline-block px-3 py-2 rounded-lg max-w-[85%] ${
                m.role === 'user'
                  ? 'bg-gradient-to-r from-[#0066ff] to-[#00d4ff] text-[#02121a]'
                  : 'bg-[#07172a] text-cyan-100 border border-cyan-800'
              }`}
            >
              {m.role === 'assistant' ? (
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    strong: ({ children }) => (
                      <strong className="font-bold text-cyan-200">
                        {children}
                      </strong>
                    ),

                    a: ({ href, children }) => (
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-cyan-400 underline hover:text-cyan-300"
                      >
                        {children}
                      </a>
                    ),

                    ul: ({ children }) => (
                      <ul className="list-disc ml-5 space-y-1">
                        {children}
                      </ul>
                    ),

                    li: ({ children }) => (
                      <li>
                        {children}
                      </li>
                    ),

                    p: ({ children }) => (
                      <p className="mb-2 last:mb-0">
                        {children}
                      </p>
                    ),
                  }}
                >
                  {m.content}
                </ReactMarkdown>
              ) : (
                m.content
              )}
            </div>

          </div>
        ))}


        {isLoading && (
          <div className="text-left">
            <span className="inline-block px-3 py-2 rounded-lg bg-[#07172a] border border-cyan-800 text-cyan-400">
              Mengetik...
            </span>
          </div>
        )}


      </div>



      <form 
        onSubmit={onSubmit}
        className="p-2 border-t border-cyan-900 flex gap-2 bg-[#021826]"
      >

        <input
          value={input}
          onChange={(e)=>setInput(e.target.value)}
          placeholder="Tulis pertanyaan..."
          className="flex-1 border border-cyan-800 rounded px-2 py-1 text-sm outline-none bg-transparent text-cyan-100 placeholder-cyan-400"
          disabled={isLoading}
        />


        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="bg-[#00d4ff] text-[#012022] px-3 rounded text-sm disabled:opacity-50"
        >
          Kirim
        </button>


      </form>

    </div>
  );
}