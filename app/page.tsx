"use client";

import { useState } from "react";

type StoryMatch = {
  id: number;
  title: string | null;
  body: string;
  next_step: string | null;
  similarity: number;
};

type Mode = "find" | "post";

function truncateText(text: string, maxLength = 220) {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
}
export default function HomePage() {
  const promptChips = [
    "Feeling anxious",
    "Work stress",
    "Relationship struggles",
    "Loneliness",
  ];

  const [mode, setMode] = useState<Mode>("find");
  const [query, setQuery] = useState("");
  const [matches, setMatches] = useState<StoryMatch[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [expandedCards, setExpandedCards] = useState<Record<number, boolean>>({});

  async function handleSearch(customQuery?: string) {
    const finalQuery = (customQuery ?? query).trim();

    if (!finalQuery) {
      setError("Please share a little about what you're going through.");
      setMatches([]);
      return;
    }

    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const response = await fetch("http://127.0.0.1:8000/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: finalQuery,
          match_count: 3,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.ok) {
        throw new Error(data.error || "Something went wrong.");
      }

      setMatches(data.matches || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setMatches([]);
    } finally {
      setLoading(false);
    }
  }

  async function handlePostStory() {
    const finalQuery = query.trim();

    if (!finalQuery) {
      setError("Please write your story before posting.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccessMessage("");
    setMatches([]);

    try {
      const response = await fetch("http://127.0.0.1:8000/stories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          body: finalQuery,
          title: null,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.ok) {
        throw new Error(data.error || "Something went wrong.");
      }

      setSuccessMessage("Your story has been shared gently and saved.");
      setQuery("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  async function handlePrimaryAction() {
    if (mode === "find") {
      await handleSearch();
    } else {
      await handlePostStory();
    }
  }

  function handleChipClick(chip: string) {
    if (mode !== "find") return;
    setQuery(chip);
    handleSearch(chip);
  }
  function toggleCard(id: number) {
    setExpandedCards((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  }

  return (
    <main
      className="min-h-screen text-[#6b5242]"
      style={{
        backgroundImage:
          'linear-gradient(rgba(247, 239, 230, 0.28), rgba(245, 237, 228, 0.88)), url("/bg.png")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="mx-auto max-w-5xl px-6 py-10 md:px-10">
        <section className="flex w-full flex-col items-center text-center">
          <div className="mt-6 flex items-center gap-3">
            <span className="text-3xl">♡</span>
            <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
              SameHere
            </h1>
          </div>

          <div className="mt-8 max-w-3xl">
            <h2 className="text-3xl font-semibold leading-snug md:text-4xl">
              You are not alone.
            </h2>
            <p className="mt-3 text-xl md:text-2xl">
              Feel connected through shared experiences.
            </p>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-[#7b6557] md:text-lg">
              Share what you&apos;re going through. We&apos;ll show you stories
              from others who&apos;ve been there, so you know you&apos;re not
              alone, and offer one gentle next step to try.
            </p>
          </div>

          <div className="mt-10 inline-flex rounded-full border border-[#dcc8b6] bg-[#f4eadf] p-1 shadow-sm">
            <button
              type="button"
              onClick={() => {
                setMode("find");
                setError("");
                setSuccessMessage("");
              }}
              className={`rounded-full px-4 py-2 text-sm transition ${
                mode === "find"
                  ? "bg-[#d8ae7f] text-white"
                  : "text-[#7a6455] hover:bg-[#efe1d2]"
              }`}
            >
              Find stories like mine
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("post");
                setMatches([]);
                setError("");
                setSuccessMessage("");
              }}
              className={`rounded-full px-4 py-2 text-sm transition ${
                mode === "post"
                  ? "bg-[#d8ae7f] text-white"
                  : "text-[#7a6455] hover:bg-[#efe1d2]"
              }`}
            >
              Share my story
            </button>
          </div>

          {mode === "find" ? (
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              {promptChips.map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => handleChipClick(chip)}
                  className="rounded-full border border-[#dcc8b6] bg-[#f4eadf] px-4 py-2 text-sm text-[#7a6455] shadow-sm transition hover:bg-[#efe1d2]"
                >
                  {chip}
                </button>
              ))}
            </div>
          ) : null}

          <div className="mt-6 w-full max-w-3xl">
            <textarea
              rows={6}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={
                mode === "find"
                  ? "e.g., I’m feeling overwhelmed with everything going on lately..."
                  : "Write the story you want to share with others..."
              }
              className="w-full rounded-3xl border border-[#dfd0c2] bg-[#fbf6f1] px-5 py-4 text-base text-[#6b5242] outline-none placeholder:text-[#aa9484] shadow-sm transition focus:border-[#cfae8f] focus:ring-2 focus:ring-[#ead7c5]"
            />
          </div>

          <button
            type="button"
            onClick={handlePrimaryAction}
            disabled={loading}
            className="mt-6 rounded-full bg-[#d8ae7f] px-8 py-3 text-lg font-medium text-white shadow-md transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading
              ? mode === "find"
                ? "Finding similar stories..."
                : "Sharing your story..."
              : mode === "find"
              ? "Find Similar Stories"
              : "Post My Story"}
          </button>

          {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}
          {successMessage ? (
            <p className="mt-4 text-sm text-green-700">{successMessage}</p>
          ) : null}

          {mode === "find" ? (
            <section className="mt-14 w-full">
              <h3 className="text-center text-2xl font-semibold md:text-3xl">
                Stories from people like you
              </h3>

              <div className="mt-8 grid gap-5 md:grid-cols-3">
                {matches.length > 0 ? (
                  matches.map((match) => (
                    <div
                      key={match.id}
                      className="rounded-3xl border border-[#d8c7b7] bg-white/80 p-5 text-left shadow-sm"
                    >
                      <p className="text-sm font-semibold text-[#8b6f5c]">
                        {match.title || "Shared experience"}
                      </p>

                      <p className="mt-3 text-sm leading-6 text-[#6b5242]">
                        {expandedCards[match.id] ? match.body : truncateText(match.body)}
                      </p>
                      {match.body.length > 220 ? (
                        <button
                          type="button"
                          onClick={() => toggleCard(match.id)}
                          className="mt-2 text-sm font-medium text-[#b07f5a] transition hover:underline"
                        >
                          {expandedCards[match.id] ? "Show less" : "Read more"}
                        </button>
                      ) : null}

                      <div className="mt-5 rounded-full bg-[#f2e6da] px-4 py-2 text-sm text-[#7a6455]">
                        Gentle step: {match.next_step || "Take one small pause."}
                      </div>

                      <p className="mt-3 text-xs text-[#9a8270]">
                        Similarity: {match.similarity.toFixed(2)}
                      </p>
                    </div>
                  ))
                ) : (
                  <>
                    <div className="rounded-3xl border border-[#d8c7b7] bg-white/80 p-5 text-left shadow-sm">
                      <p className="text-sm font-semibold text-[#8b6f5c]">
                        Work stress
                      </p>
                      <p className="mt-3 text-sm leading-6 text-[#6b5242]">
                        I felt like I had to keep everything together all the time.
                        Seeing how overwhelmed I was helped me realize I needed one
                        small pause, not a perfect solution.
                      </p>
                      <div className="mt-5 rounded-full bg-[#f2e6da] px-4 py-2 text-sm text-[#7a6455]">
                        Gentle step: take one quiet 5-minute break
                      </div>
                    </div>

                    <div className="rounded-3xl border border-[#d8c7b7] bg-white/80 p-5 text-left shadow-sm">
                      <p className="text-sm font-semibold text-[#8b6f5c]">
                        Family pressure
                      </p>
                      <p className="mt-3 text-sm leading-6 text-[#6b5242]">
                        I kept feeling guilty for not meeting everyone&apos;s
                        expectations. What helped first was naming that I was
                        exhausted, not weak.
                      </p>
                      <div className="mt-5 rounded-full bg-[#f2e6da] px-4 py-2 text-sm text-[#7a6455]">
                        Gentle step: write down one feeling honestly
                      </div>
                    </div>

                    <div className="rounded-3xl border border-[#d8c7b7] bg-white/80 p-5 text-left shadow-sm">
                      <p className="text-sm font-semibold text-[#8b6f5c]">
                        Loneliness
                      </p>
                      <p className="mt-3 text-sm leading-6 text-[#6b5242]">
                        I was surrounded by people but still felt alone. Reading
                        stories from others who felt the same made it easier to
                        admit I needed connection.
                      </p>
                      <div className="mt-5 rounded-full bg-[#f2e6da] px-4 py-2 text-sm text-[#7a6455]">
                        Gentle step: message one trusted person
                      </div>
                    </div>
                  </>
                )}
              </div>
            </section>
          ) : (
            <section className="mt-14 max-w-2xl rounded-3xl border border-[#d8c7b7] bg-white/75 p-6 text-left shadow-sm">
              <h3 className="text-xl font-semibold text-[#6b5242]">
                Share your story
              </h3>
              <p className="mt-3 text-sm leading-7 text-[#7b6557]">
                Your story can help someone else feel less alone. Please avoid
                names, addresses, or highly identifying details.
              </p>
            </section>
          )}

          <section className="mt-14 max-w-3xl text-center">
            <p className="text-lg font-medium">Your privacy and safety matter.</p>
            <p className="mt-2 text-base leading-7 text-[#7b6557]">
              Please avoid sharing highly personal or identifying information in
              your message.
            </p>
          </section>
        </section>
      </div>
    </main>
  );
}