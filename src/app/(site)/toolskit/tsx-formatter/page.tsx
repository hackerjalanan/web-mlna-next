'use client';

import { useState } from 'react';
import prettier from 'prettier/standalone';
import parserTypescript from 'prettier/plugins/typescript';
import parserEstree from 'prettier/plugins/estree';
import parserBabel from 'prettier/plugins/babel';
import { parse } from '@babel/parser';
import generate from '@babel/generator';
import Editor from '@monaco-editor/react';
export default function TSXFormatterPage() {
  const [code, setCode] = useState('');
  const [formatted, setFormatted] = useState('');
  const [error, setError] = useState('');
  async function formatTSX(source: string) {
    const ast = parse(source, {
      sourceType: 'module',
      plugins: ['typescript', 'jsx'],
    });
    const generated = generate(ast, {
      comments: true,
      retainLines: false,
    }).code;
    const formattedCode = await prettier.format(generated, {
      parser: 'typescript',
      plugins: [parserTypescript, parserEstree, parserBabel],
      printWidth: 400,
      tabWidth: 2,
      semi: true,
      singleQuote: true,
      trailingComma: 'all',
      bracketSpacing: true,
    });
    return formattedCode;
  }
  async function formatCode() {
    try {
      setError('');
      const result = await formatTSX(code);
      setFormatted(result);
    } catch (err) {
      console.error(err);
      setFormatted('');
      setError('Syntax TSX error. Periksa kembali kode Anda.');
    }
  }
  async function copyCode() {
    await navigator.clipboard.writeText(formatted);
  }
  return (
    <main className="mx-auto max-w-7xl space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">TSX Code Formatter</h1>

        <p className="text-muted-foreground">Rapikan kode React / Next.js yang berantakan otomatis.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* INPUT */}

        <div>
          <label className="mb-2 block font-semibold">Input Code</label>

          <Editor
            height="600px"
            language="typescript"
            theme="vs-dark"
            value={code}
            onChange={(value) => setCode(value || '')}
            options={{
              minimap: {
                enabled: false,
              },
              fontSize: 14,
              wordWrap: 'off',
              scrollBeyondLastLine: false,
            }}
          />
        </div>

        {/* OUTPUT */}

        <div>
          <div
            className="
            mb-2
            flex
            items-center
            justify-between
          "
          >
            <label className="font-semibold">Formatted TSX</label>

            <button
              onClick={copyCode}
              disabled={!formatted}
              className="
                rounded-lg
                bg-gray-900
                px-3
                py-2
                text-sm
                text-white
                disabled:opacity-50
              "
            >
              Copy
            </button>
          </div>

          <Editor
            height="600px"
            language="typescript"
            theme="vs-dark"
            value={formatted}
            options={{
              readOnly: true,
              minimap: {
                enabled: false,
              },
              fontSize: 14,
              wordWrap: 'off',
              scrollBeyondLastLine: false,
              automaticLayout: true,
            }}
          />
        </div>
      </div>

      <button
        onClick={formatCode}
        disabled={!code}
        className="
          rounded-xl
          bg-blue-600
          px-6
          py-3
          font-semibold
          text-white
          disabled:opacity-50
        "
      >
        Format Code
      </button>

      {error && (
        <div
          className="
              rounded-lg
              bg-red-100
              p-4
              text-red-600
            "
        >
          {error}
        </div>
      )}
    </main>
  );
}
