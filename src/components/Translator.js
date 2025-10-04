"use client";

import { useEffect, useState } from "react";

export default function Translator() {
  const [supported, setSupported] = useState(true);
  const [input, setInput] = useState("Hello, world!");
  const [detected, setDetected] = useState("not sure what language this is");
  const [translation, setTranslation] = useState("");
  const [targetLang, setTargetLang] = useState("es");

  useEffect(() => {
    if (!("LanguageDetector" in self)) {
      setSupported(false);
      return;
    }

    let detector;
    (async () => {
      detector = await LanguageDetector.create();

      if (input.trim()) {
        const { detectedLanguage, confidence } = (
          await detector.detect(input.trim())
        )[0];
        setDetected(
          `${(confidence * 100).toFixed(1)}% sure this is ${languageTagToHumanReadable(
            detectedLanguage,
            "en"
          )}`
        );
      }
    })();

    const languageTagToHumanReadable = (languageTag, targetLanguage) => {
      const displayNames = new Intl.DisplayNames([targetLanguage], {
        type: "language",
      });
      return displayNames.of(languageTag);
    };
  }, [input]);

  async function handleTranslate(e) {
    e.preventDefault();
    if (!("Translator" in self)) return;

    const detector = await LanguageDetector.create();
    const sourceLanguage = (await detector.detect(input.trim()))[0].detectedLanguage;

    const availability = await Translator.availability({
      sourceLanguage,
      targetLanguage: targetLang,
    });

    if (availability === "unavailable") {
      setTranslation("This language pair is not supported.");
      return;
    }

    const translator = await Translator.create({
      sourceLanguage,
      targetLanguage: targetLang,
    });

    setTranslation(await translator.translate(input.trim()));
  }

  if (!supported) {
    return <p>Your browser doesn’t support the Language Detector API.</p>;
  }

  return (
    <main>
      <h1>💬 Translator</h1>
      <form onSubmit={handleTranslate}>
        <textarea value={input} onChange={(e) => setInput(e.target.value)} />
        <p>I’m {detected}.</p>
        <select value={targetLang} onChange={(e) => setTargetLang(e.target.value)}>
          <option value="en">English</option>
          <option value="fr">French</option>
          <option value="ja">Japanese</option>
          <option value="pt">Portuguese</option>
          <option value="es">Spanish</option>
        </select>
        <button type="submit">Translate</button>
      </form>
      <output>{translation}</output>
    </main>
  );
}
