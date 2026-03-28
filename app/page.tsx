"use client";

import { useState } from "react";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import Image from "next/image";

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

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    y: -16,
    transition: { duration: 0.3, ease: "easeInOut" },
  },
};

const staggerWrap: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};
export default function HomePage() {
  const promptChips = [
    "Feeling anxious",
    "Work stress",
    "Relationship struggles",
    "Loneliness",
  ];

  const partners = [
    { name: "Calm", src: "/partners/calm.png", className: "h-4" },
    { name: "BetterHelp", src: "/partners/betterhelp.png", className: "h-4" },
    { name: "Grow Therapy", src: "/partners/grow-therapy.png", className: "h-4" },
    { name: "Headspace", src: "/partners/headspace.png", className: "h-4" },
    { name: "Talkspace", src: "/partners/talkspace.png", className: "h-4" },
  ];

  const [mode, setMode] = useState<Mode>("find");
  const [hasEntered, setHasEntered] = useState(false);
  const [query, setQuery] = useState("");
  const [matches, setMatches] = useState<StoryMatch[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [expandedCards, setExpandedCards] = useState<Record<number, boolean>>({});
  const [hasSearched, setHasSearched] = useState(false);
  const [gentleStep, setGentleStep] = useState("");
  const [gentleStepLoading, setGentleStepLoading] = useState(false);
  const [isComposerCollapsed, setIsComposerCollapsed] = useState(false);
  const useCarouselLayout = matches.length > 2;

 async function handleSearch(customQuery?: string) {
  const finalQuery = (customQuery ?? query).trim();

  if (!finalQuery) {
    setError("Please share a little about what you're going through.");
    setMatches([]);
    return;
  }

  setHasSearched(true);
  setLoading(true);
  setError("");
  setSuccessMessage("");
  setMatches([]);
  setGentleStep("");
  setGentleStepLoading(false);

  try {
    const response = await fetch("http://127.0.0.1:8000/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: finalQuery,
        match_count: 8,
      }),
    });

    let data: any = null;

    try {
      data = await response.json();
    } catch {
      data = null;
    }

    if (!response.ok) {
      throw new Error(data?.error || "Request failed.");
    }

    if (!data || typeof data !== "object") {
      throw new Error("Invalid response from backend.");
    }

    const fetchedMatches = Array.isArray(data.matches) ? data.matches : [];

    setMatches(fetchedMatches);
    setError("");
    setIsComposerCollapsed(true);
    setLoading(false);
    setGentleStepLoading(true);

    try {
      const gentleStepResponse = await fetch("http://127.0.0.1:8000/gentle-step", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: finalQuery,
          matches: fetchedMatches,
        }),
      });

      const gentleStepData = await gentleStepResponse.json();

      if (
        gentleStepResponse.ok &&
        gentleStepData &&
        typeof gentleStepData.gentle_step === "string"
      ) {
        setGentleStep(gentleStepData.gentle_step);
      } else {
        setGentleStep("");
      }
    } catch (err) {
      console.error("Gentle step fetch error:", err);
      setGentleStep("");
    } finally {
      setGentleStepLoading(false);
    }

  } catch (err) {
    setError(err instanceof Error ? err.message : "Something went wrong.");
    setMatches([]);
    setGentleStep("");
    setGentleStepLoading(false);
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

  function enterApp(selectedMode: Mode) {
    setMode(selectedMode);
    setHasEntered(true);
    setError("");
    setSuccessMessage("");
    setMatches([]);
    setIsComposerCollapsed(false);
  }
 return (
  <main
    className="min-h-screen text-[#6b5242]"
    style={{
      backgroundImage:
        'linear-gradient(rgba(247, 239, 230, 0.45), rgba(245, 237, 228, 0.62)), url("/bg.png")',
      backgroundSize: "cover",
      backgroundPosition: "center top",
      backgroundRepeat: "no-repeat",
      backgroundAttachment: "fixed",
    }}
  >
    <AnimatePresence mode="wait">
  {!hasEntered ? (
    <motion.section
  key="welcome"
  variants={fadeUp}
  initial="hidden"
  animate="visible"
  exit="exit"
  className="flex min-h-screen items-center justify-center px-6 py-12"
>
  <motion.div
    variants={staggerWrap}
    initial="hidden"
    animate="visible"
    className="w-full max-w-5xl text-center"
  >
    <motion.div
      variants={fadeUp}
      className="mx-auto flex items-center justify-center gap-3"
    >
      <span className="text-3xl">♡</span>
      <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
        SameHere
      </h1>
    </motion.div>

    <motion.h2
      variants={fadeUp}
      className="mx-auto mt-8 max-w-4xl text-4xl font-semibold leading-tight md:text-6xl"
    >
      You don&apos;t have to carry it alone.
    </motion.h2>

    <motion.p
      variants={fadeUp}
      className="mx-auto mt-6 max-w-2xl text-base leading-8 text-[#7b6557] md:text-lg"
    >
      SameHere helps people feel understood through shared lived experiences,
      gentle reflection, and one small next step.
    </motion.p>
    <motion.div
      variants={fadeUp}
      className="mt-8"
    >
      <p className="text-sm uppercase tracking-[0.22em] text-[#b38a6d]">
        Supportive care spaces
      </p>

      <div className="relative mx-auto mt-5 max-w-4xl overflow-hidden">
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ repeat: Infinity, duration: 18, ease: "linear" }}
          className="flex w-max gap-4"
        >
          {[...partners, ...partners].map((partner, index) => (
             <div
                key={`${partner.name}-${index}`}
                className="flex items-center justify-center"
              >
                <Image 
                  src={partner.src}
                  alt={partner.name}
                  width={120}
                  height={40}
                  className="`${partner.className} w-auto object-contain opacity-90"
                />
              </div>
          ))}
        </motion.div>
      </div>
    </motion.div>
    <motion.div
      variants={fadeUp}
      className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
    >
      <motion.button
        whileHover={{ y: -3, scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        type="button"
        onClick={() => enterApp("find")}
        className="rounded-full bg-[#d8ae7f] px-8 py-4 text-base font-medium text-white shadow-md transition hover:opacity-95"
      >
        Get started
      </motion.button>

      <motion.button
        whileHover={{ y: -3, scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        type="button"
        onClick={() => enterApp("post")}
        className="rounded-full border border-[#dcc8b6] bg-white/70 px-8 py-4 text-base font-medium text-[#7a6455] shadow-sm transition hover:bg-white"
      >
        Share your story
      </motion.button>
    </motion.div>

    <motion.p
      variants={fadeUp}
      className="mx-auto mt-8 max-w-2xl text-sm leading-7 text-[#8a7466]"
    >
      A gentle support space - not therapy or crisis care. Please avoid sharing
      highly identifying details.
    </motion.p>
  </motion.div>
</motion.section>
  ) : (
    <motion.div
      key="app"
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="mx-auto max-w-8xl px-6 py-10 md:px-10"
    >
      <div className="mb-4 flex w-full justify-start">
        <motion.button
          whileHover={{ x: -2 }}
          whileTap={{ scale: 0.97 }}
          type="button"
          onClick={() => {
            setHasEntered(false);
            setError("");
            setSuccessMessage("");
            setMatches([]);
            setGentleStep("");
            setIsComposerCollapsed(false);
          }}
          className="rounded-full border border-[#dcc8b6] bg-[#f4eadf] px-4 py-2 text-sm text-[#7a6455] shadow-sm transition hover:bg-[#efe1d2]"
        >
          ← Back
        </motion.button>
      </div>

      <motion.section
        variants={staggerWrap}
        initial="hidden"
        animate="visible"
        className="flex w-full flex-col items-center text-center"
      >
        {/* <main
      className="min-h-screen text-[#6b5242]"
      style={{
        backgroundImage:
          'linear-gradient(rgba(247, 239, 230, 0.28), rgba(245, 237, 228, 0.88)), url("/bg.png")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="mx-auto max-w-5xl px-6 py-10 md:px-10"> */}
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
                setGentleStep("");
                setIsComposerCollapsed(false);
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
                setGentleStep("");
                setIsComposerCollapsed(false);
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

          

            <AnimatePresence mode="wait">
            {mode === "find" && isComposerCollapsed && query.trim() ? (
              <motion.button
                key="collapsed-composer"
                initial={{ opacity: 0, y: -8, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, y: -8, height: 0 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                type="button"
                onClick={() => setIsComposerCollapsed(false)}
                className="mt-6 w-full max-w-3xl overflow-hidden rounded-3xl border border-[#dcc8b6] bg-white/75 px-5 py-4 text-left shadow-sm backdrop-blur-sm transition hover:bg-white/90"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#b38a6d]">
                      Your story
                    </p>
                    <p className="mt-2 text-sm leading-6 text-[#6b5242]">
                      {truncateText(query, 140)}
                    </p>
                  </div>

                  <div className="shrink-0 rounded-full bg-[#f6ede4] px-3 py-1 text-xs font-medium text-[#9a7a63]">
                    Edit
                  </div>
                </div>
              </motion.button>
            ) : (
              <motion.div
                key="expanded-composer"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="mt-6 w-full max-w-3xl"
              >
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
              </motion.div>
            )}
          </AnimatePresence>
              {mode === "find" && !isComposerCollapsed ? (
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
            <motion.button
              whileHover={{ y: -2, scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
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
            </motion.button>

            {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}
            {successMessage ? (
              <p className="mt-4 text-sm text-green-700">{successMessage}</p>
            ) : null}
            {mode === "find" && (gentleStepLoading || gentleStep) ? (
              <div className="mx-auto mt-10 flex w-full justify-center">
                  {gentleStepLoading ? (
                    <motion.div
                      initial={{ opacity: 0, y: 14, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                      className="relative"
                    >
                      <div className="absolute inset-0 rounded-full bg-[#d9e6a8]/50 blur-2xl" />
                      <div className="absolute left-1/2 top-1/2 h-4 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#fff4bf]/70 blur-xl" />

                      <div className="relative flex items-center gap-3 rounded-full border border-[#93a468] bg-[linear-gradient(180deg,#a9bc78_0%,#8fa562_100%)] px-8 py-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_10px_24px_rgba(93,109,57,0.32)]">
                        <div className="relative flex h-6 w-6 items-center justify-center">
                          <motion.span
                            animate={{ opacity: [0.55, 1, 0.55], scale: [0.95, 1.12, 0.95] }}
                            transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
                            className="absolute text-[22px] text-[#fff9d9]"
                          >
                            ✦
                          </motion.span>
                          <motion.span
                            animate={{ opacity: [0.35, 0.9, 0.35], scale: [0.85, 1.05, 0.85] }}
                            transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut", delay: 0.25 }}
                            className="absolute left-0 top-1 text-[12px] text-[#fffef0]"
                          >
                            ✦
                          </motion.span>
                          <motion.span
                            animate={{ opacity: [0.3, 0.75, 0.3], scale: [0.85, 1, 0.85] }}
                            transition={{ repeat: Infinity, duration: 2.1, ease: "easeInOut", delay: 0.45 }}
                            className="absolute right-0 bottom-1 text-[10px] text-[#fffef0]"
                          >
                            ✦
                          </motion.span>
                        </div>

                        <p className="text-lg font-semibold tracking-tight text-white md:text-[1.35rem]">
                          Thinking of a gentle next step...
                        </p>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, y: 16, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.45, ease: "easeOut" }}
                      className="relative w-full max-w-4xl"
                    >
                      <div className="absolute inset-0 rounded-[2rem] bg-[#efe8c0]/50 blur-3xl" />
                      <div className="relative overflow-hidden rounded-[2rem] border border-[#d7c98d] bg-[linear-gradient(180deg,rgba(246,243,223,0.98),rgba(236,231,201,0.96))] px-7 py-8 text-center shadow-[0_18px_45px_rgba(135,125,72,0.18)] md:px-10 md:py-10">
                        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#d5c36d] to-transparent" />
                        <div className="absolute left-1/2 top-0 h-24 w-40 -translate-x-1/2 rounded-full bg-[#fff6bf]/60 blur-2xl" />

                        <div className="relative z-10">
                          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-[#d9c98d] bg-white/55 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#907f42]">
                            <span className="text-xs">✦</span>
                            Gentle next step
                          </div>

                          <h3 className="mt-5 text-2xl font-semibold tracking-tight text-[#5f5630] md:text-3xl">
                            One small thing to hold onto
                          </h3>

                          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-[#5f5630] md:text-[1.14rem]">
                            {gentleStep}
                          </p>

                          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-[#7b7450]">
                            Not a fix. Just a gentle place to begin.
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              ) : null}
            {mode === "find" ? (
              <section className="mt-14 w-full">
                <h3 className="text-center text-2xl font-semibold md:text-3xl">
                  Experiences that may feel similar
                </h3>
                {matches.length > 0 ? (
              <div
                className={
                  useCarouselLayout
                    ? "mt-8 flex w-full gap-6 overflow-x-auto px-2 pb-4"
                    : "mt-8 flex w-full flex-wrap justify-center gap-6 px-2 pb-4"
                }
              >
                {matches.map((match) => (
            <motion.div
              key={match.id}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className={`rounded-3xl border border-[#d8c7b7] bg-white/80 p-5 text-left shadow-sm ${
                useCarouselLayout
                  ? "w-[85vw] max-w-[460px] shrink-0 md:w-[420px]"
                  : "w-full max-w-[520px]"
              }`}            >
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

              {/* <p className="mt-4 text-xs text-[#9a8270]">
                Similarity: {match.similarity.toFixed(2)}
              </p> */}
            </motion.div>
          ))}
    </div>
  ) : hasSearched ? (
    <div className="mx-auto mt-8 max-w-3xl">
      <div className="rounded-3xl border border-[#d8c7b7] bg-white/80 p-8 text-center shadow-sm">
        <p className="text-xl font-semibold text-[#6b5242]">
          No close matches yet
        </p>
        <p className="mt-3 text-sm leading-7 text-[#7b6557]">
          We couldn&apos;t find a story that felt close enough to what you shared.
          Try describing how you&apos;re feeling in a little more detail.
        </p>
      </div>
    </div>
  ) : (
    <div className="mt-8 grid w-full gap-6 md:grid-cols-3">
      <div className="rounded-3xl border border-[#d8c7b7] bg-white/80 p-5 text-left shadow-sm">
        <p className="text-sm font-semibold text-[#8b6f5c]">Work stress</p>
        <p className="mt-3 text-sm leading-6 text-[#6b5242]">
          I felt like I had to keep everything together all the time. Seeing how
          overwhelmed I was helped me realize I needed one small pause, not a
          perfect solution.
        </p>
      </div>

      <div className="rounded-3xl border border-[#d8c7b7] bg-white/80 p-5 text-left shadow-sm">
        <p className="text-sm font-semibold text-[#8b6f5c]">Family pressure</p>
        <p className="mt-3 text-sm leading-6 text-[#6b5242]">
          I kept feeling guilty for not meeting everyone&apos;s expectations.
          What helped first was naming that I was exhausted, not weak.
        </p>
      </div>

      <div className="rounded-3xl border border-[#d8c7b7] bg-white/80 p-5 text-left shadow-sm">
        <p className="text-sm font-semibold text-[#8b6f5c]">Loneliness</p>
        <p className="mt-3 text-sm leading-6 text-[#6b5242]">
          I was surrounded by people but still felt alone. Reading stories from
          others who felt the same made it easier to admit I needed connection.
        </p>
      </div>
    </div>
  )}
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
      {/* </div>
    </main> */}
      </motion.section>
    </motion.div>
  )}
</AnimatePresence>
  </main>
);
}