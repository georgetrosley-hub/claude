"use client";

import { useEffect, useMemo, useState } from "react";
import { useTerritoryData } from "@/app/context/territory-data-context";
import { SectionHeader } from "@/components/ui/section-header";

type Contact = {
  id: string;
  accountId: string;
  name: string;
  title: string;
  email: string;
  owner: string;
  lastTouch: string;
};

type Note = {
  id: string;
  accountId: string;
  text: string;
  source: "manual" | "call" | "email" | "meeting";
  createdAt: string;
};

type Task = {
  id: string;
  accountId: string;
  title: string;
  owner: string;
  dueDate: string;
  status: "open" | "in_progress" | "done";
};

type IntegrationStatusResponse = {
  generatedAt: string;
  integrations: Record<string, { configured: boolean; mode: string; required: string[] }>;
};

const CONTACTS_KEY = "ops-hub-contacts-v1";
const NOTES_KEY = "ops-hub-notes-v1";
const TASKS_KEY = "ops-hub-tasks-v1";

function readLocal<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeLocal(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // no-op
  }
}

function toIsoDate(value?: string): string {
  if (!value) return new Date().toISOString().slice(0, 10);
  return value;
}

export function OperationsHub({
  accountId,
  accountName,
}: {
  accountId: string;
  accountName: string;
}) {
  const { activities, signals } = useTerritoryData();

  const [contacts, setContacts] = useState<Contact[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [integrationStatus, setIntegrationStatus] = useState<IntegrationStatusResponse | null>(null);

  const [contactForm, setContactForm] = useState({
    name: "",
    title: "",
    email: "",
    owner: "AE",
  });
  const [noteInput, setNoteInput] = useState("");
  const [taskForm, setTaskForm] = useState({
    title: "",
    owner: "AE",
    dueDate: toIsoDate(),
  });

  useEffect(() => {
    setContacts(readLocal<Contact[]>(CONTACTS_KEY, []));
    setNotes(readLocal<Note[]>(NOTES_KEY, []));
    setTasks(readLocal<Task[]>(TASKS_KEY, []));
  }, []);

  useEffect(() => writeLocal(CONTACTS_KEY, contacts), [contacts]);
  useEffect(() => writeLocal(NOTES_KEY, notes), [notes]);
  useEffect(() => writeLocal(TASKS_KEY, tasks), [tasks]);

  useEffect(() => {
    let isMounted = true;
    fetch("/api/integrations/status")
      .then((r) => r.json())
      .then((data: IntegrationStatusResponse) => {
        if (isMounted) setIntegrationStatus(data);
      })
      .catch(() => {
        if (isMounted) setIntegrationStatus(null);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const accountContacts = useMemo(
    () => contacts.filter((c) => c.accountId === accountId),
    [contacts, accountId]
  );
  const accountNotes = useMemo(
    () => notes.filter((n) => n.accountId === accountId),
    [notes, accountId]
  );
  const accountTasks = useMemo(
    () => tasks.filter((t) => t.accountId === accountId),
    [tasks, accountId]
  );

  const feed = useMemo(() => {
    const signalItems = signals
      .filter((s) => s.account === accountId)
      .map((s) => ({ id: `sig-${s.timestamp}-${s.text}`, at: s.timestamp, type: "signal", text: s.text }));
    const activityItems = activities
      .filter((a) => a.account === accountId)
      .map((a) => ({ id: `act-${a.timestamp}-${a.text}`, at: a.timestamp, type: "activity", text: a.text }));
    const noteItems = accountNotes.map((n) => ({
      id: n.id,
      at: n.createdAt.slice(0, 10),
      type: "note",
      text: n.text,
    }));
    return [...signalItems, ...activityItems, ...noteItems]
      .sort((a, b) => b.at.localeCompare(a.at))
      .slice(0, 10);
  }, [accountId, accountNotes, activities, signals]);

  const addContact = () => {
    const name = contactForm.name.trim();
    if (!name) return;
    setContacts((prev) => [
      {
        id: `${accountId}-contact-${Date.now()}`,
        accountId,
        name,
        title: contactForm.title.trim(),
        email: contactForm.email.trim(),
        owner: contactForm.owner.trim() || "AE",
        lastTouch: toIsoDate(),
      },
      ...prev,
    ]);
    setContactForm({ name: "", title: "", email: "", owner: contactForm.owner || "AE" });
  };

  const addNote = () => {
    const text = noteInput.trim();
    if (!text) return;
    setNotes((prev) => [
      {
        id: `${accountId}-note-${Date.now()}`,
        accountId,
        text,
        source: "manual",
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ]);
    setNoteInput("");
  };

  const addTask = () => {
    const title = taskForm.title.trim();
    if (!title) return;
    setTasks((prev) => [
      {
        id: `${accountId}-task-${Date.now()}`,
        accountId,
        title,
        owner: taskForm.owner.trim() || "AE",
        dueDate: toIsoDate(taskForm.dueDate),
        status: "open",
      },
      ...prev,
    ]);
    setTaskForm((prev) => ({ ...prev, title: "" }));
  };

  const updateTaskStatus = (taskId: string, status: Task["status"]) => {
    setTasks((prev) => prev.map((task) => (task.id === taskId ? { ...task, status } : task)));
  };

  return (
    <section id="operations-hub" className="scroll-mt-24 rounded-2xl border border-surface-border/50 bg-surface-elevated/30 p-4 sm:p-6">
      <SectionHeader
        title="Operations Hub"
        subtitle={`Working system for ${accountName}: contacts, notes, tasks, and live execution feed.`}
      />

      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="rounded-xl border border-surface-border/50 bg-surface-muted/20 p-3">
          <p className="text-[11px] font-semibold uppercase text-text-faint">Contacts</p>
          <div className="mt-2 space-y-2">
            <input
              value={contactForm.name}
              onChange={(e) => setContactForm((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="Name"
              className="w-full rounded border border-surface-border/50 bg-surface px-2 py-1.5 text-[12px]"
            />
            <input
              value={contactForm.title}
              onChange={(e) => setContactForm((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="Title"
              className="w-full rounded border border-surface-border/50 bg-surface px-2 py-1.5 text-[12px]"
            />
            <input
              value={contactForm.email}
              onChange={(e) => setContactForm((prev) => ({ ...prev, email: e.target.value }))}
              placeholder="Email"
              className="w-full rounded border border-surface-border/50 bg-surface px-2 py-1.5 text-[12px]"
            />
            <button
              type="button"
              onClick={addContact}
              className="rounded bg-accent px-3 py-1.5 text-[11px] font-semibold text-white"
            >
              Add contact
            </button>
          </div>
          <ul className="mt-3 space-y-1.5 text-[12px] text-text-secondary">
            {accountContacts.slice(0, 6).map((c) => (
              <li key={c.id}>
                {c.name} — {c.title || "Role pending"}
              </li>
            ))}
            {!accountContacts.length && <li className="text-text-faint">No contacts yet.</li>}
          </ul>
        </div>

        <div className="rounded-xl border border-surface-border/50 bg-surface-muted/20 p-3">
          <p className="text-[11px] font-semibold uppercase text-text-faint">Notes</p>
          <div className="mt-2 space-y-2">
            <textarea
              value={noteInput}
              onChange={(e) => setNoteInput(e.target.value)}
              placeholder="Add a discovery note or risk signal..."
              className="min-h-20 w-full rounded border border-surface-border/50 bg-surface px-2 py-1.5 text-[12px]"
            />
            <button
              type="button"
              onClick={addNote}
              className="rounded bg-accent px-3 py-1.5 text-[11px] font-semibold text-white"
            >
              Save note
            </button>
          </div>
          <ul className="mt-3 space-y-1.5 text-[12px] text-text-secondary">
            {accountNotes.slice(0, 6).map((n) => (
              <li key={n.id}>• {n.text}</li>
            ))}
            {!accountNotes.length && <li className="text-text-faint">No notes yet.</li>}
          </ul>
        </div>

        <div className="rounded-xl border border-surface-border/50 bg-surface-muted/20 p-3">
          <p className="text-[11px] font-semibold uppercase text-text-faint">Tasks</p>
          <div className="mt-2 space-y-2">
            <input
              value={taskForm.title}
              onChange={(e) => setTaskForm((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="Task title"
              className="w-full rounded border border-surface-border/50 bg-surface px-2 py-1.5 text-[12px]"
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                value={taskForm.owner}
                onChange={(e) => setTaskForm((prev) => ({ ...prev, owner: e.target.value }))}
                placeholder="Owner"
                className="w-full rounded border border-surface-border/50 bg-surface px-2 py-1.5 text-[12px]"
              />
              <input
                type="date"
                value={taskForm.dueDate}
                onChange={(e) => setTaskForm((prev) => ({ ...prev, dueDate: e.target.value }))}
                className="w-full rounded border border-surface-border/50 bg-surface px-2 py-1.5 text-[12px]"
              />
            </div>
            <button
              type="button"
              onClick={addTask}
              className="rounded bg-accent px-3 py-1.5 text-[11px] font-semibold text-white"
            >
              Add task
            </button>
          </div>
          <ul className="mt-3 space-y-2 text-[12px] text-text-secondary">
            {accountTasks.slice(0, 6).map((t) => (
              <li key={t.id} className="rounded border border-surface-border/40 px-2 py-1.5">
                <div className="flex items-center justify-between gap-2">
                  <span>{t.title}</span>
                  <select
                    value={t.status}
                    onChange={(e) => updateTaskStatus(t.id, e.target.value as Task["status"])}
                    className="rounded border border-surface-border/40 bg-surface px-1.5 py-0.5 text-[11px]"
                  >
                    <option value="open">open</option>
                    <option value="in_progress">in progress</option>
                    <option value="done">done</option>
                  </select>
                </div>
                <p className="mt-1 text-[10px] text-text-faint">
                  {t.owner} · due {t.dueDate}
                </p>
              </li>
            ))}
            {!accountTasks.length && <li className="text-text-faint">No tasks yet.</li>}
          </ul>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-surface-border/50 bg-surface-muted/20 p-3">
          <p className="text-[11px] font-semibold uppercase text-text-faint">Unified execution feed</p>
          <ul className="mt-2 space-y-1.5 text-[12px] text-text-secondary">
            {feed.map((item) => (
              <li key={item.id} className="rounded border border-surface-border/30 px-2 py-1.5">
                <span className="text-[10px] uppercase text-text-faint">{item.type}</span> · {item.at}
                <p className="mt-1">{item.text}</p>
              </li>
            ))}
            {!feed.length && <li className="text-text-faint">No activity yet.</li>}
          </ul>
        </div>

        <div className="rounded-xl border border-surface-border/50 bg-surface-muted/20 p-3">
          <p className="text-[11px] font-semibold uppercase text-text-faint">Integration status</p>
          <p className="mt-1 text-[11px] text-text-faint">
            Connector APIs are live. Add credentials as env vars to activate.
          </p>
          <ul className="mt-2 space-y-1.5 text-[12px] text-text-secondary">
            {(integrationStatus ? Object.entries(integrationStatus.integrations) : []).map(
              ([name, config]) => (
                <li key={name} className="flex items-center justify-between rounded border border-surface-border/30 px-2 py-1.5">
                  <span>{name}</span>
                  <span className={config.configured ? "text-emerald-300" : "text-amber-300"}>
                    {config.configured ? "configured" : "not configured"}
                  </span>
                </li>
              )
            )}
            {!integrationStatus && <li className="text-text-faint">Status unavailable.</li>}
          </ul>
        </div>
      </div>
    </section>
  );
}

