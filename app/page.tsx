export default function HomePage() {
  const promptChips = [
    "Feeling anxious",
    "Work stress",
    "Relationship struggles", 
    "Loneliness",
  ];

  return (
    <main className="min-h-screen bg-[#f7efe6] text-[#6b5242]" style={{
        backgroundImage:
          'linear-gradient(rgba(247, 239, 230, 0.78), rgba(245, 237, 228, 0.88)), url("/bg.png")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}>
       <div className="mx-auto flex min-h-screen max-w-5xl flex-col items-center px-6 py-12 md:px-10">
        <section className="flex w-full flex-1 flex-col items-center text-center">
          <div className="mt-8 flex items-center gap-3">
            <span className="text-3xl">♡</span>
            <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
              SameHere
            </h1>
          </div>
           <div className="mt-10 max-w-3xl">
            <h2 className="text-3xl font-semibold leading-snug md:text-4xl">
              You are not alone.
            </h2>
            <p className="mt-3 text-xl md:text-2xl">
              Feel connected through shared experiences.
            </p>

            <p className="mx-auto mt-8 max-w-2xl text-base leading-8 text-[#7b6557] md:text-lg">
              Share what you&apos;re going through. We&apos;ll show you stories
              from others who&apos;ve been there, so you know you&apos;re not
              alone, and offer one gentle next step to try.
            </p>
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
            {promptChips.map((chip) => (
              <button
                key={chip}
                type="button"
                className="rounded-full border border-[#dcc8b6] bg-[#f4eadf] px-4 py-2 text-sm text-[#7a6455] shadow-sm transition hover:bg-[#efe1d2]"
              >
                {chip}
              </button>
            ))}
          </div>

          <div className="mt-6 w-full max-w-3xl">
            <textarea
              rows={5}
              placeholder="e.g., I’m feeling overwhelmed with everything going on lately..."
              className="w-full rounded-3xl border border-[#dfd0c2] bg-[#fbf6f1] px-5 py-4 text-base text-[#6b5242] outline-none placeholder:text-[#aa9484] shadow-sm transition focus:border-[#cfae8f] focus:ring-2 focus:ring-[#ead7c5]"
            />
          </div>

          <button
            type="button"
            className="mt-6 rounded-full bg-[#d8ae7f] px-8 py-3 text-lg font-medium text-white shadow-md transition hover:opacity-95"
          >
            Share What&apos;s On Your Mind
          </button>

          <section className="mt-14 w-full">
            <h3 className="text-center text-2xl font-semibold md:text-3xl">
              Stories from people like you
            </h3>

            <div className="mt-8 grid gap-5 md:grid-cols-3">
              <div className="rounded-3xl border border-[#d8c7b7] bg-white/80 p-5 text-left shadow-sm">
                <p className="text-sm font-semibold text-[#8b6f5c]">Work stress</p>
                <p className="mt-3 text-sm leading-6 text-[#6b5242]">
                  I felt like I had to keep everything together all the time. Seeing how
                  overwhelmed I was helped me realize I needed one small pause, not a
                  perfect solution.
                </p>
                <div className="mt-5 rounded-full bg-[#f2e6da] px-4 py-2 text-sm text-[#7a6455]">
                  Gentle step: take one quiet 5-minute break
                </div>
              </div>

              <div className="rounded-3xl border border-[#d8c7b7] bg-white/80 p-5 text-left shadow-sm">
                <p className="text-sm font-semibold text-[#8b6f5c]">Family pressure</p>
                <p className="mt-3 text-sm leading-6 text-[#6b5242]">
                  I kept feeling guilty for not meeting everyone’s expectations. What
                  helped first was naming that I was exhausted, not weak.
                </p>
                <div className="mt-5 rounded-full bg-[#f2e6da] px-4 py-2 text-sm text-[#7a6455]">
                  Gentle step: write down one feeling honestly
                </div>
              </div>

              <div className="rounded-3xl border border-[#d8c7b7] bg-white/80 p-5 text-left shadow-sm">
                <p className="text-sm font-semibold text-[#8b6f5c]">Loneliness</p>
                <p className="mt-3 text-sm leading-6 text-[#6b5242]">
                  I was surrounded by people but still felt alone. Reading stories from
                  others who felt the same made it easier to admit I needed connection.
                </p>
                <div className="mt-5 rounded-full bg-[#f2e6da] px-4 py-2 text-sm text-[#7a6455]">
                  Gentle step: message one trusted person
                </div>
              </div>
            </div>
          </section>

          <section className="mt-16 max-w-3xl text-center">
            <p className="text-lg font-medium">
              Your privacy and safety are important to us.
            </p>
            <p className="mt-2 text-base leading-7 text-[#7b6557]">
              Please avoid sharing highly personal or identifying information in
              your message.
            </p>
          </section>
        </section>
       </div>

    </main>
  )
}