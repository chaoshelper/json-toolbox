(() => {
  "use strict";

  const $ = (id) => document.getElementById(id);
  const input = $("input"), output = $("output"), message = $("message");
  const runBtn = $("runBtn"), modeHint = $("modeHint"), status = $("status");
  const inputCounter = $("inputCounter");
  let mode = "format";

  const samples = {
    format: {
      name: "Ada Lovelace",
      active: true,
      skills: ["JavaScript", "JSON", "Algorithms"],
      profile: { role: "Developer", location: "London" }
    },
    stringify: { user: "Ada", roles: ["developer", "pioneer"], active: true },
    simplify: {
      name: "Ada",
      empty: null,
      tags: [],
      profile: { bio: "", city: "London", preferences: {} },
      projects: [{ name: "Analytical Engine", notes: null }]
    }
  };

  const hints = {
    format: "Pretty-print & validate your JSON",
    stringify: "Turn JSON into an escaped JSON string",
    simplify: "Remove null, blank & empty values"
  };

  const labels = { format: "Format JSON", stringify: "Stringify", simplify: "Simplify" };

  function updateCount() {
    const n = input.value.length;
    inputCounter.textContent = `${n.toLocaleString()} char${n === 1 ? "" : "s"}`;
  }

  function setMessage(text, error = false) {
    message.textContent = text;
    message.classList.toggle("error", error);
  }

  function simplify(value) {
    if (Array.isArray(value)) {
      return value.map(simplify).filter(v =>
        v !== null &&
        v !== "" &&
        !(Array.isArray(v) && v.length === 0) &&
        !(isPlainObject(v) && Object.keys(v).length === 0)
      );
    }
    if (isPlainObject(value)) {
      const result = {};
      for (const [key, val] of Object.entries(value)) {
        const simplified = simplify(val);
        if (
          simplified !== null &&
          simplified !== "" &&
          !(Array.isArray(simplified) && simplified.length === 0) &&
          !(isPlainObject(simplified) && Object.keys(simplified).length === 0)
        ) {
          result[key] = simplified;
        }
      }
      return result;
    }
    return value;
  }

  function isPlainObject(value) {
    return value !== null && typeof value === "object" && !Array.isArray(value);
  }

  function parseInput() {
    try {
      return JSON.parse(input.value);
    } catch (err) {
      const match = /position (\d+)/i.exec(err.message);
      let detail = "Invalid JSON.";
      if (match) detail += ` Check around character ${match[1]}.`;
      setMessage(detail, true);
      status.textContent = "Invalid";
      status.style.color = "var(--danger)";
      return null;
    }
  }

  function run() {
    if (!input.value.trim()) {
      output.value = "";
      setMessage("Paste JSON to get started.");
      status.textContent = "Ready";
      status.style.color = "var(--accent2)";
      return;
    }

    const value = parseInput();
    if (value === null) return;

    if (mode === "format") {
      output.value = JSON.stringify(value, null, 2);
      setMessage("Valid JSON · formatted with 2-space indentation.");
    } else if (mode === "stringify") {
      output.value = JSON.stringify(JSON.stringify(value));
      setMessage("Stringified JSON string · quotes and control characters are escaped.");
    } else {
      output.value = JSON.stringify(simplify(value), null, 2);
      setMessage("Simplified · removed null, blank strings, empty arrays, and empty objects.");
    }

    status.textContent = "Valid";
    status.style.color = "var(--accent2)";
  }

  function switchMode(next) {
    mode = next;
    document.querySelectorAll(".tab").forEach(tab => {
      const active = tab.dataset.mode === mode;
      tab.classList.toggle("active", active);
      tab.setAttribute("aria-selected", active ? "true" : "false");
    });
    modeHint.textContent = hints[mode];
    runBtn.innerHTML = `${labels[mode]} <span>⌘↵</span>`;
    status.textContent = "Ready";
    status.style.color = "var(--accent2)";
    if (input.value.trim()) run();
  }

  document.querySelectorAll(".tab").forEach(tab =>
    tab.addEventListener("click", () => switchMode(tab.dataset.mode))
  );

  $("sampleBtn").addEventListener("click", () => {
    input.value = JSON.stringify(samples[mode], null, 2);
    updateCount();
    run();
    input.focus();
  });

  $("clearBtn").addEventListener("click", () => {
    input.value = "";
    output.value = "";
    updateCount();
    setMessage("Cleared. Paste JSON to get started.");
    status.textContent = "Ready";
  });

  $("copyBtn").addEventListener("click", async () => {
    if (!output.value) {
      setMessage("There is no output to copy.", true);
      return;
    }
    try {
      await navigator.clipboard.writeText(output.value);
      const old = $("copyBtn").textContent;
      $("copyBtn").textContent = "Copied ✓";
      setTimeout(() => $("copyBtn").textContent = old, 1200);
    } catch {
      output.select();
      document.execCommand("copy");
      setMessage("Output copied.");
    }
  });

  runBtn.addEventListener("click", run);
  input.addEventListener("input", updateCount);
  input.addEventListener("keydown", e => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      run();
    }
    if (e.key === "Tab") {
      e.preventDefault();
      const start = input.selectionStart, end = input.selectionEnd;
      input.setRangeText("  ", start, end, "end");
    }
  });

  updateCount();
})();
