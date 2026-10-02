import { useState } from "react";
import { askSafetyAgent } from "../services/safetyAgentApi";

export default function SafetyAgent() {
  const [message, setMessage] = useState("");
  const [zone, setZone] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    const cleanMessage = message.trim();

    if (!cleanMessage || loading) return;

    setLoading(true);
    setError("");

    try {
      const response = await askSafetyAgent(
        cleanMessage,
        zone.trim()
      );

      setResult(response.data);
    } catch (err) {
      console.error(err);

      setError(
        "Safety Agent se connect nahi ho pa raha. Backend aur Ollama check karein."
      );
    } finally {
      setLoading(false);
    }
  };

  const getSeverityClass = (severity) => {
    switch (severity) {
      case "critical":
        return "border-[#f1caca] bg-[#fff1f1] text-[#ba1a1a]";

      case "high":
        return "border-[#f5d6b3] bg-[#fff6eb] text-[#a85b00]";

      case "medium":
        return "border-[#f3dfa6] bg-[#fff9e8] text-[#8a6500]";

      default:
        return "border-[#dfe5ed] bg-[#f2f5fa] text-[#536174]";
    }
  };

  const quickQuestions = [
    {
      label: "Transformer Smoke",
      question:
        "Transformer se smoke aa raha hai, kya karu?",
      zone: "Switchyard",
    },
    {
      label: "Work at Height",
      question:
        "Worker height par bina harness kaam kar raha hai",
      zone: "",
    },
    {
      label: "Electrical Spark",
      question:
        "Electrical panel me spark aa raha hai",
      zone: "",
    },
    {
      label: "Gas Leak",
      question:
        "Gas leak detect hui hai, kya karna chahiye?",
      zone: "",
    },
  ];

  const selectQuickQuestion = (item) => {
    setMessage(item.question);

    if (item.zone) {
      setZone(item.zone);
    }
  };

  return (
    <div className="min-h-full bg-[#f5f7fb] p-4 sm:p-5 lg:p-6">

      {/* ================= HEADER ================= */}
      <div className="mb-5 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <div className="mb-1 flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-[#00a36c]" />

            <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-[#00288e]">
              Industrial Safety Assistant
            </p>
          </div>

          <h1 className="text-[24px] font-bold tracking-tight text-[#10213a]">
            AI Safety Agent
          </h1>

          <p className="mt-1.5 max-w-3xl text-[11px] leading-5 text-[#68778c]">
            Ask about fire, electrical hazards, PPE,
            gas leaks, evacuation, work at height and
            other industrial safety situations.
          </p>
        </div>

        {/* LOCAL AI STATUS */}
        <div className="flex w-fit items-center gap-2 rounded-lg border border-[#ccebdd] bg-[#edf9f3] px-3 py-2">
          <span className="h-2 w-2 animate-pulse rounded-full bg-[#00a36c]" />

          <span className="text-[9px] font-bold text-[#087a52]">
            Local AI Online
          </span>
        </div>
      </div>

      {/* ================= NOTICE ================= */}
      <div className="mb-5 flex items-start gap-3 rounded-xl border border-[#f3d69b] bg-[#fff9eb] px-4 py-3">

        <div className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#fff0c7] text-[10px] font-bold text-[#a96500]">
          !
        </div>

        <p className="text-[10px] font-medium leading-5 text-[#79520a]">
          This agent provides general industrial safety guidance.
          Site-approved SOPs, emergency procedures and instructions
          from authorized personnel always take priority.
        </p>
      </div>

      {/* ================= MAIN GRID ================= */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[390px_minmax(0,1fr)]">

        {/* ================= LEFT PANEL ================= */}
        <section className="rounded-xl border border-[#e2e7ef] bg-white shadow-sm">

          {/* CARD HEADER */}
          <div className="border-b border-[#edf0f5] px-5 py-4">
            <p className="text-[8px] font-bold uppercase tracking-[0.12em] text-[#8b98aa]">
              Safety Query
            </p>

            <h2 className="mt-1 text-[15px] font-bold text-[#10213a]">
              Ask Safety Agent
            </h2>
          </div>

          <div className="p-5">
            <form
              className="space-y-5"
              onSubmit={handleSubmit}
            >

              {/* AREA / ZONE */}
              <div>
                <label
                  htmlFor="safety-zone"
                  className="mb-2 block text-[10px] font-bold text-[#25364d]"
                >
                  Area / Zone
                </label>

                <input
                  id="safety-zone"
                  type="text"
                  value={zone}
                  onChange={(event) =>
                    setZone(event.target.value)
                  }
                  placeholder="e.g. Switchyard, Boiler Area"
                  className="
                    w-full
                    rounded-lg
                    border border-[#dce2eb]
                    bg-[#f9fafc]
                    px-3.5 py-3
                    text-[10px]
                    text-[#25364d]
                    outline-none
                    transition
                    placeholder:text-[#a4afbd]
                    focus:border-[#00288e]
                    focus:bg-white
                    focus:ring-2
                    focus:ring-[#00288e]/10
                  "
                />
              </div>

              {/* SAFETY ISSUE */}
              <div>
                <label
                  htmlFor="safety-message"
                  className="mb-2 block text-[10px] font-bold text-[#25364d]"
                >
                  Describe the safety issue
                </label>

                <textarea
                  id="safety-message"
                  value={message}
                  onChange={(event) =>
                    setMessage(event.target.value)
                  }
                  placeholder="e.g. Transformer se smoke aa raha hai, kya karu?"
                  rows={6}
                  className="
                    w-full
                    resize-none
                    rounded-lg
                    border border-[#dce2eb]
                    bg-[#f9fafc]
                    px-3.5 py-3
                    text-[10px]
                    leading-5
                    text-[#25364d]
                    outline-none
                    transition
                    placeholder:text-[#a4afbd]
                    focus:border-[#00288e]
                    focus:bg-white
                    focus:ring-2
                    focus:ring-[#00288e]/10
                  "
                />
              </div>

              {/* ASK BUTTON */}
              <button
                type="submit"
                disabled={loading || !message.trim()}
                className="
                  flex w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-lg
                  bg-[#00288e]
                  px-4 py-3
                  text-[10px]
                  font-bold
                  text-white
                  shadow-sm
                  transition
                  hover:bg-[#001f70]
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                {loading && (
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                )}

                {loading
                  ? "Analyzing Safety Issue..."
                  : "Ask Safety Agent"}
              </button>
            </form>

            {/* ================= QUICK QUESTIONS ================= */}
            <div className="mt-6 border-t border-[#edf0f5] pt-5">

              <p className="mb-3 text-[8px] font-bold uppercase tracking-[0.1em] text-[#8b98aa]">
                Quick Questions
              </p>

              <div className="flex flex-wrap gap-2">

                {quickQuestions.map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() =>
                      selectQuickQuestion(item)
                    }
                    className="
                      rounded-lg
                      border border-[#dfe5ed]
                      bg-[#f6f8fb]
                      px-3 py-2
                      text-[8px]
                      font-semibold
                      text-[#536174]
                      transition
                      hover:border-[#b7c7ec]
                      hover:bg-[#eef3ff]
                      hover:text-[#00288e]
                    "
                  >
                    {item.label}
                  </button>
                ))}

              </div>
            </div>
          </div>
        </section>

        {/* ================= RIGHT RESPONSE PANEL ================= */}
        <section className="min-h-[520px] overflow-hidden rounded-xl border border-[#e2e7ef] bg-white shadow-sm">

          {/* ================= EMPTY STATE ================= */}
          {!result && !loading && !error && (
            <div className="flex min-h-[520px] flex-col items-center justify-center px-6 text-center">

              <div className="mb-4 grid h-14 w-14 place-items-center rounded-xl bg-[#eef3ff] text-[15px] font-bold text-[#00288e]">
                AI
              </div>

              <h2 className="text-[15px] font-bold text-[#10213a]">
                Safety guidance will appear here
              </h2>

              <p className="mt-2 max-w-md text-[10px] leading-5 text-[#7b899c]">
                Describe a safety situation. The agent will
                search the local safety knowledge base and
                generate a grounded response.
              </p>

              <div className="mt-5 flex flex-wrap justify-center gap-2">

                <span className="rounded-full bg-[#f2f5fa] px-3 py-1.5 text-[8px] font-semibold text-[#68778c]">
                  Local Ollama
                </span>

                <span className="rounded-full bg-[#f2f5fa] px-3 py-1.5 text-[8px] font-semibold text-[#68778c]">
                  RAG
                </span>

                <span className="rounded-full bg-[#f2f5fa] px-3 py-1.5 text-[8px] font-semibold text-[#68778c]">
                  Grounded Answers
                </span>

              </div>
            </div>
          )}

          {/* ================= LOADING ================= */}
          {loading && (
            <div className="flex min-h-[520px] flex-col items-center justify-center px-6 text-center">

              <div className="h-9 w-9 animate-spin rounded-full border-[3px] border-[#dfe5ef] border-t-[#00288e]" />

              <h3 className="mt-4 text-[13px] font-bold text-[#10213a]">
                Analyzing safety information...
              </h3>

              <p className="mt-2 max-w-sm text-[9px] leading-5 text-[#7b899c]">
                Searching the safety knowledge base and
                generating a grounded response using the
                local AI model.
              </p>

            </div>
          )}

          {/* ================= ERROR ================= */}
          {error && !loading && (
            <div className="m-5 rounded-lg border border-[#f1caca] bg-[#fff4f4] p-4">

              <div className="flex items-start gap-3">

                <div className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-[#ba1a1a] text-[10px] font-bold text-white">
                  !
                </div>

                <div>
                  <p className="text-[10px] font-bold text-[#ba1a1a]">
                    Connection Error
                  </p>

                  <p className="mt-1 text-[9px] leading-5 text-[#8b3333]">
                    {error}
                  </p>
                </div>

              </div>
            </div>
          )}

          {/* ================= RESULT ================= */}
          {result && !loading && (
            <div>

              {/* RESULT TOP HEADER */}
              <div className="flex flex-col justify-between gap-3 border-b border-[#edf0f5] px-5 py-4 sm:flex-row sm:items-center">

                {/* SEVERITY + CATEGORY */}
                <div className="flex flex-wrap gap-2">

                  <span
                    className={`
                      rounded-md
                      border
                      px-2.5 py-1
                      text-[8px]
                      font-bold
                      ${getSeverityClass(result.severity)}
                    `}
                  >
                    {result.severity?.toUpperCase()}
                  </span>

                  <span className="rounded-md border border-[#cfdafa] bg-[#eef3ff] px-2.5 py-1 text-[8px] font-bold text-[#00288e]">
                    {result.category
                      ?.replaceAll("_", " ")
                      .toUpperCase()}
                  </span>

                </div>

                {/* RESULT FLAGS */}
                <div className="flex flex-wrap gap-2">

                  {result.grounded && (
                    <span className="rounded-full bg-[#edf9f3] px-2.5 py-1 text-[7px] font-bold text-[#087a52]">
                      ✓ Grounded
                    </span>
                  )}

                  {result.ai_generated && (
                    <span className="rounded-full bg-[#eef3ff] px-2.5 py-1 text-[7px] font-bold text-[#00288e]">
                      AI Generated
                    </span>
                  )}

                </div>
              </div>

              <div className="p-5">

                {/* ================= ESCALATION ================= */}
                {result.escalation_required && (
                  <div className="mb-5 flex gap-3 rounded-lg border border-[#f1caca] bg-[#fff5f5] p-3.5">

                    <div className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-[#ba1a1a] text-[10px] font-bold text-white">
                      !
                    </div>

                    <div>
                      <p className="text-[10px] font-bold text-[#a31515]">
                        Emergency escalation may be required
                      </p>

                      <p className="mt-1 text-[9px] leading-4 text-[#805050]">
                        Follow applicable site-approved emergency
                        procedures and instructions from authorized
                        personnel.
                      </p>
                    </div>

                  </div>
                )}

                {/* ================= AI ANSWER ================= */}
                <div>

                  <div className="mb-3 flex items-center gap-2.5">

                    <div className="grid h-8 w-8 place-items-center rounded-lg bg-[#00288e] text-[9px] font-bold text-white">
                      AI
                    </div>

                    <div>
                      <h2 className="text-[11px] font-bold text-[#10213a]">
                        Safety Guidance
                      </h2>

                      <p className="text-[7.5px] text-[#8b98aa]">
                        Generated from retrieved safety knowledge
                      </p>
                    </div>

                  </div>

                  <div className="whitespace-pre-wrap rounded-lg border border-[#e4e8ef] bg-[#f8fafc] p-4 text-[10px] leading-6 text-[#34465e]">
                    {result.answer}
                  </div>

                </div>

                {/* ================= SOURCES ================= */}
                {result.sources?.length > 0 && (
                  <div className="mt-6">

                    <div className="mb-3 flex items-center justify-between">

                      <h3 className="text-[10px] font-bold text-[#25364d]">
                        Knowledge Sources
                      </h3>

                      <span className="text-[8px] text-[#8b98aa]">
                        {result.sources.length} source
                        {result.sources.length !== 1
                          ? "s"
                          : ""}
                      </span>

                    </div>

                    <div className="space-y-2">

                      {result.sources.map(
                        (source, index) => (
                          <div
                            key={`${source.document}-${index}`}
                            className="flex flex-col justify-between gap-2 rounded-lg border border-[#e5e9ef] bg-white px-3.5 py-3 sm:flex-row sm:items-center"
                          >

                            <div>
                              <p className="text-[9px] font-bold text-[#25364d]">
                                {source.document}
                              </p>

                              <p className="mt-0.5 text-[7px] font-bold uppercase tracking-wide text-[#9aa5b3]">
                                {source.category}
                              </p>
                            </div>

                            {source.page && (
                              <span className="w-fit rounded-md bg-[#f2f5fa] px-2 py-1 text-[7px] font-semibold text-[#68778c]">
                                Page {source.page}
                              </span>
                            )}

                          </div>
                        )
                      )}

                    </div>
                  </div>
                )}

                {/* ================= DISCLAIMER ================= */}
                <div className="mt-6 border-t border-[#edf0f5] pt-4">

                  <div className="flex items-start gap-2">

                    <div className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-[#eef3ff] text-[7px] font-bold text-[#00288e]">
                      i
                    </div>

                    <p className="text-[8px] leading-4 text-[#8b98aa]">
                      This system provides general industrial safety
                      guidance. It does not replace official
                      plant-specific SOPs, emergency procedures,
                      qualified safety personnel, or emergency
                      responders.
                    </p>

                  </div>
                </div>

              </div>
            </div>
          )}

        </section>
      </div>
    </div>
  );
}