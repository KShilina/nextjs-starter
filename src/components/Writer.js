"use client";

import { useEffect, useRef, useState } from "react";
import DOMPurify from "dompurify";

export default function WriterRewriter() {
  const [output, setOutput] = useState("");
  const [isSupported, setIsSupported] = useState(true);
  const [isWriting, setIsWriting] = useState(false);
  const [isRewriting, setIsRewriting] = useState(false);

  const promptRef = useRef(null);
  const contextRef = useRef(null);
  const writerRef = useRef(null);
  const rewriterRef = useRef(null);

  useEffect(() => {
    if (!("Writer" in window && "Rewriter" in window)) {
      setIsSupported(false);
    }
  }, []);

  const createWriter = async () => {
    const context = contextRef.current?.value.trim() || "";
    const options = {
      tone: "neutral",
      length: "short",
      format: "markdown",
      sharedContext: context,
    };
    writerRef.current = await window.Writer.create(options);
  };

  const createRewriter = async () => {
    const context = contextRef.current?.value.trim() || "";
    const options = {
      tone: "as-is",
      length: "as-is",
      format: "as-is",
      sharedContext: context,
    };
    rewriterRef.current = await window.Rewriter.create(options);
  };

  const handleWrite = async (e) => {
    e.preventDefault();
    const prompt = promptRef.current?.value.trim();
    if (!prompt) return;

    await createWriter();
    setIsWriting(true);
    setOutput("Writing…");

    const stream = writerRef.current.writeStreaming(prompt);
    let fullResponse = "";

    for await (const chunk of stream) {
      fullResponse = "Writer" in window ? fullResponse + chunk : chunk;
      setOutput(DOMPurify.sanitize(fullResponse));
    }

    setIsWriting(false);
  };

  const handleRewrite = async (e) => {
    e.preventDefault();
    if (!output) return;

    await createRewriter();
    setIsRewriting(true);
    setOutput("Rewriting…");

    const stream = rewriterRef.current.rewriteStreaming(output);
    let fullResponse = "";

    for await (const chunk of stream) {
      fullResponse = "Rewriter" in window ? fullResponse + chunk : chunk;
      setOutput(DOMPurify.sanitize(fullResponse));
    }

    setIsRewriting(false);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(output);
  };

  if (!isSupported) {
    return (
      <div className="border-2 border-red-500 p-3 my-4">
        Your browser doesn’t support the Writer / Rewriter API.
        <br />
        If you’re on Chrome, join the{" "}
        <a
          href="https://goo.gle/chrome-ai-dev-preview-join"
          className="text-blue-600 underline"
        >
          Early Preview Program
        </a>{" "}
        to enable it.
      </div>
    );
  }

  return (
    <>
      <form onSubmit={handleWrite} className="flex flex-col gap-3 mb-4">
        <label className="font-semibold">Prompt</label>
        <textarea
          ref={promptRef}
          defaultValue="Write an email to my bank asking them to raise my credit limit from $1,000 to $10,000."
          className="border p-2 rounded h-28"
        />
        <label className="font-semibold">Context</label>
        <input
          ref={contextRef}
          defaultValue="I'm a long-standing customer."
          className="border p-2 rounded"
        />
        <button
          type="submit"
          disabled={isWriting}
          className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          {isWriting ? "Writing..." : "📝 Write"}
        </button>
      </form>

      {output && (
        <>
          <div
            className="border p-3 mb-3 whitespace-pre-wrap"
            dangerouslySetInnerHTML={{ __html: output }}
          />
          <div className="flex gap-2">
            <button
              onClick={handleCopy}
              className="bg-gray-600 text-white px-3 py-1 rounded"
            >
              📋 Copy
            </button>
            <form onSubmit={handleRewrite}>
              <button
                type="submit"
                disabled={isRewriting}
                className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 disabled:bg-gray-400"
              >
                {isRewriting ? "Rewriting..." : "♻️ Rewrite"}
              </button>
            </form>
          </div>
        </>
      )}
    </>
  );
}
