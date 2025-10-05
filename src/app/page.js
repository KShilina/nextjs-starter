"use client";

import WriterRewriter from "../components/Writer";




export default function Page() {

  // return <Translator />
  return (
    <main className="mx-auto max-w-3xl p-4">
      <h1 className="text-2xl font-bold mb-2">📝 Writer / Rewriter API Playground</h1>
      <p className="mb-4">
        This is a demo of Chrome’s{" "}
        <a
          href="https://developer.chrome.com/docs/ai/built-in"
          className="text-blue-600 underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          built-in Writer / Rewriter API
        </a>{" "}
        powered by Gemini Nano.
      </p>
      <WriterRewriter />
      <footer className="mt-6 text-sm text-gray-500">
        Made by{" "}
        <a href="https://github.com/tomayac/" className="underline">
          @tomayac
        </a>
        . Source code on{" "}
        <a
          href="https://github.com/GoogleChromeLabs/web-ai-demos"
          className="underline"
        >
          GitHub
        </a>
        .
      </footer>
    </main>
  );
  
}
