import { For, Match, Show, Switch, createSignal, onMount } from "solid-js";
import { profile } from "~/content/profile";

/**
 * The contact form as a scripted chat: a fake "northway agent" asks for name,
 * email, and the reason for reaching out, one bubble at a time. Booking a
 * discovery call submits straight away with a canned message; "Something
 * else" opens a textarea first. Posts the same fields as the old form to
 * /api/contact (name, email, topic, message + honeypot).
 */

type Bubble = { role: "agent" | "user"; text: string };
type Step =
  | "boot"
  | "name"
  | "email"
  | "reason"
  | "message"
  | "sending"
  | "done";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const AUDIT_LABEL = "Book a discovery call / AI audit";
const AUDIT_MESSAGE =
  "I'd like to book a free discovery call / AI audit.";

export default function ContactChat() {
  const [bubbles, setBubbles] = createSignal<Bubble[]>([]);
  const [step, setStep] = createSignal<Step>("boot");
  const [typing, setTyping] = createSignal(false);
  const [draft, setDraft] = createSignal("");

  let name = "";
  let email = "";
  let scroller: HTMLDivElement | undefined;

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  const scrollDown = () => {
    requestAnimationFrame(() => {
      scroller?.scrollTo({
        top: scroller.scrollHeight,
        behavior: reduceMotion ? "auto" : "smooth",
      });
    });
  };

  /** Agent speaks after a short "typing…" beat, then advances the step. */
  const say = (text: string, next?: Step) => {
    setTyping(true);
    scrollDown();
    window.setTimeout(
      () => {
        setTyping(false);
        setBubbles((b) => [...b, { role: "agent", text }]);
        if (next) setStep(next);
        scrollDown();
      },
      reduceMotion ? 60 : 500 + Math.random() * 300,
    );
  };

  const you = (text: string) => {
    setBubbles((b) => [...b, { role: "user", text }]);
    scrollDown();
  };

  onMount(() => {
    say(
      "Hey — glad you're here. To send us a message, could I first please have your name?",
      "name",
    );
  });

  const submitName = () => {
    const value = draft().trim();
    if (!value) return;
    name = value;
    setDraft("");
    you(name);
    say(`Nice to meet you, ${name.split(" ")[0]}. What's your email?`, "email");
  };

  const submitEmail = () => {
    const value = draft().trim();
    if (!value) return;
    if (!EMAIL_RE.test(value)) {
      say("Hmm, that email doesn't look right — mind double-checking it?");
      return;
    }
    email = value;
    setDraft("");
    you(email);
    say("Got it. Why are you reaching out?", "reason");
  };

  const chooseAudit = () => {
    you(AUDIT_LABEL);
    send("audit", AUDIT_MESSAGE);
  };

  const chooseOther = () => {
    you("Something else");
    say("Sure — what can we help with?", "message");
  };

  const submitMessage = () => {
    const value = draft().trim();
    if (!value) return;
    setDraft("");
    you(value);
    send("other", value);
  };

  const send = async (topic: "audit" | "other", message: string) => {
    const returnTo: Step = topic === "other" ? "message" : "reason";
    setStep("sending");
    setTyping(true);
    scrollDown();

    const body = new FormData();
    body.set("name", name);
    body.set("email", email);
    body.set("topic", topic);
    body.set("message", message);
    body.set("_gotcha", "");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { accept: "application/json" },
        body,
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
      };
      if (res.ok && data.ok) {
        say(
          `Thanks, ${name.split(" ")[0]} — you're all set. We'll get back to you within the next business day!`,
          "done",
        );
      } else {
        say(
          data.error ||
            `Something went wrong sending that. Please try again, or email us at ${profile.email}.`,
        );
        setStep(returnTo);
        if (topic === "other") setDraft(message);
      }
    } catch {
      say(
        `Network error — please try again, or email us directly at ${profile.email}.`,
      );
      setStep(returnTo);
      if (topic === "other") setDraft(message);
    }
  };

  const onEnter = (e: KeyboardEvent, action: () => void) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      action();
    }
  };

  const inputClass =
    "w-full rounded-lg border border-line bg-bg px-3 py-2.5 text-sm outline-none transition-colors focus:border-fg";
  const sendClass =
    "shrink-0 bg-accent px-4 py-2.5 text-sm font-semibold text-accent-ink transition-shadow hover-hover:hover:shadow-[0_0_18px_rgba(48,209,88,0.45)] active:translate-y-px disabled:opacity-50";
  /* Input and send key share one bordered field so they read as a unit. */
  const fieldClass =
    "chat-composer-in flex items-stretch rounded-lg border border-line bg-bg transition-colors focus-within:border-fg";
  const fieldInputClass =
    "w-full bg-transparent px-3 py-2.5 text-sm outline-none";
  const fieldSendClass =
    "m-1 shrink-0 bg-accent px-3 text-sm font-semibold text-accent-ink transition-shadow hover-hover:hover:shadow-[0_0_18px_rgba(48,209,88,0.45)] active:translate-y-px disabled:opacity-50";

  return (
    <div class="flex h-[30rem] flex-col md:h-[32rem] lg:absolute lg:inset-8 lg:h-auto">
      {/* Title bar, in the voice of the home terminal */}
      <div
        class="flex items-center gap-1.5 border-b border-line pb-3"
        aria-hidden="true"
      >
        <i class="h-2.5 w-2.5 rounded-full bg-fg-faint" />
        <i class="h-2.5 w-2.5 rounded-full bg-fg-faint" />
        <i class="h-2.5 w-2.5 rounded-full bg-fg-faint" />
        <span class="ml-auto font-mono text-[0.65rem] text-fg-faint">
          northway-agent · contact
        </span>
      </div>

      {/* Transcript */}
      <div
        ref={scroller}
        role="log"
        aria-live="polite"
        class="flex-1 space-y-3 overflow-y-auto py-4 pr-1"
      >
        <For each={bubbles()}>
          {(bubble) => (
            <div
              class={`flex ${bubble.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                class={
                  bubble.role === "user"
                    ? "chat-bubble chat-bubble--you max-w-[85%] rounded-lg rounded-br-none bg-accent px-3.5 py-2.5 text-sm font-medium text-accent-ink"
                    : "chat-bubble chat-bubble--agent max-w-[85%] rounded-lg rounded-bl-none border border-line bg-bg px-3.5 py-2.5 text-sm leading-relaxed"
                }
              >
                {bubble.text}
              </div>
            </div>
          )}
        </For>

        <Show when={typing()}>
          <div class="flex justify-start">
            <div
              class="chat-bubble chat-bubble--agent flex items-center gap-1 rounded-lg rounded-bl-none border border-line bg-bg px-3.5 py-3"
              aria-label="Agent is typing"
            >
              <i class="chat-dot h-1.5 w-1.5 rounded-full bg-fg-muted" />
              <i class="chat-dot h-1.5 w-1.5 rounded-full bg-fg-muted" />
              <i class="chat-dot h-1.5 w-1.5 rounded-full bg-fg-muted" />
            </div>
          </div>
        </Show>
      </div>

      {/* Composer — changes shape with the current question */}
      <div class="border-t border-line pt-4">
        <Switch>
          <Match when={step() === "name"}>
            <div class={fieldClass}>
              <input
                type="text"
                autofocus
                aria-label="Your name"
                placeholder="Your name"
                autocomplete="name"
                value={draft()}
                onInput={(e) => setDraft(e.currentTarget.value)}
                onKeyDown={(e) => onEnter(e, submitName)}
                class={fieldInputClass}
              />
              <button
                type="button"
                aria-label="Send"
                onClick={submitName}
                class={fieldSendClass}
              >
                ↵
              </button>
            </div>
          </Match>

          <Match when={step() === "email"}>
            <div class={fieldClass}>
              <input
                type="email"
                autofocus
                aria-label="Your email"
                placeholder="you@company.com"
                autocomplete="email"
                value={draft()}
                onInput={(e) => setDraft(e.currentTarget.value)}
                onKeyDown={(e) => onEnter(e, submitEmail)}
                class={fieldInputClass}
              />
              <button
                type="button"
                aria-label="Send"
                onClick={submitEmail}
                class={fieldSendClass}
              >
                ↵
              </button>
            </div>
          </Match>

          <Match when={step() === "reason"}>
            <div class="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={chooseAudit}
                class="chat-composer-in border border-line px-4 py-2.5 text-sm font-semibold text-fg-muted transition-colors hover-hover:hover:border-accent hover-hover:hover:text-accent active:translate-y-px"
              >
                {AUDIT_LABEL}
              </button>
              <button
                type="button"
                onClick={chooseOther}
                class="chat-composer-in chat-composer-in--late border border-line px-4 py-2.5 text-sm font-semibold text-fg-muted transition-colors hover-hover:hover:border-accent hover-hover:hover:text-accent active:translate-y-px"
              >
                Something else
              </button>
            </div>
          </Match>

          <Match when={step() === "message"}>
            <div class="chat-composer-in space-y-2">
              <textarea
                autofocus
                rows="3"
                aria-label="What can we help with?"
                placeholder="Tell us a little about it…"
                value={draft()}
                onInput={(e) => setDraft(e.currentTarget.value)}
                onKeyDown={(e) => onEnter(e, submitMessage)}
                class={`${inputClass} resize-none`}
              />
              <button
                type="button"
                onClick={submitMessage}
                disabled={!draft().trim()}
                class={`${sendClass} w-full`}
              >
                Send message →
              </button>
            </div>
          </Match>

          <Match when={step() === "done"}>
            <p class="chat-composer-in text-center font-mono text-xs text-fg-faint">
              <span aria-hidden="true" class="text-accent">
                ✦
              </span>{" "}
              Message sent — we typically reply within 24 hours.
            </p>
          </Match>
        </Switch>
      </div>
    </div>
  );
}
