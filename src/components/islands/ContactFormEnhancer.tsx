import { createSignal, onCleanup, onMount, Show } from "solid-js";

/**
 * Progressively enhances the server-rendered contact form. Without JS the form
 * posts natively to /api/contact and the server redirects to /thanks. With JS,
 * this island intercepts the submit, posts via fetch, and shows inline
 * success / error states without a full navigation.
 *
 * Mounts as a single island; the form itself is plain server-rendered HTML
 * (queried via [data-contact-form]).
 */
export default function ContactFormEnhancer() {
  const [status, setStatus] = createSignal<
    "idle" | "sending" | "success" | "error"
  >("idle");
  const [error, setError] = createSignal("");

  let form: HTMLFormElement | null = null;
  let button: HTMLButtonElement | null = null;
  let defaultLabel = "Send message →";

  onMount(() => {
    form = document.querySelector<HTMLFormElement>("[data-contact-form]");
    if (!form) return;
    button = form.querySelector<HTMLButtonElement>('[type="submit"]');
    if (button?.textContent) defaultLabel = button.textContent;

    const onSubmit = async (e: SubmitEvent) => {
      e.preventDefault();
      if (status() === "sending") return;

      setError("");
      setStatus("sending");
      if (button) {
        button.disabled = true;
        button.textContent = "Sending…";
      }

      try {
        const res = await fetch(form!.action, {
          method: "POST",
          headers: { accept: "application/json" },
          body: new FormData(form!),
        });
        const data = (await res.json().catch(() => ({}))) as {
          ok?: boolean;
          error?: string;
        };

        if (res.ok && data.ok) {
          setStatus("success");
          form!.reset();
          form!.style.display = "none";
        } else {
          setStatus("error");
          setError(data.error || "Something went wrong. Please try again.");
          resetButton();
        }
      } catch {
        setStatus("error");
        setError(
          "Network error — please try again, or email us directly.",
        );
        resetButton();
      }
    };

    function resetButton() {
      if (button) {
        button.disabled = false;
        button.textContent = defaultLabel;
      }
    }

    form.addEventListener("submit", onSubmit);
    onCleanup(() => form?.removeEventListener("submit", onSubmit));
  });

  return (
    <div data-contact-status>
      <Show when={status() === "success"}>
        <div
          role="status"
          class="rounded-lg border border-line bg-bg p-5 text-center"
        >
          <span aria-hidden="true" class="text-lg text-accent">
            ✦
          </span>
          <p class="mt-1 font-medium">Message sent — thanks!</p>
          <p class="mt-1 text-sm text-fg-muted">
            We typically reply within 24 hours.
          </p>
        </div>
      </Show>
      <Show when={status() === "error"}>
        <p role="alert" class="mt-4 text-sm text-accent">
          {error()}
        </p>
      </Show>
    </div>
  );
}
