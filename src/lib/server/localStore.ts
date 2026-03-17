import { randomUUID } from "crypto";
import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";

import { addDays, getTodayDateKey, formatLocalDateKey } from "@/lib/date/range";
import type { EventRecord, OccurrenceStatusRecord } from "@/types/event";

type LocalStore = {
  events: EventRecord[];
  occurrences: OccurrenceStatusRecord[];
};

const localStorePath = path.join(process.cwd(), "data", "local-store.json");

function createSeedEvents(): EventRecord[] {
  const todayDate = new Date();
  const today = getTodayDateKey(todayDate);
  const recurringUntil = formatLocalDateKey(addDays(todayDate, 30));

  return [
    {
      id: randomUUID(),
      title: "알고리즘 과제",
      description: "정렬 파트 복습 후 제출",
      startDate: today,
      recurrenceType: "none",
      recurrenceInterval: 1,
      recurrenceDaysOfWeek: [],
      recurrenceUntil: null,
      isArchived: false,
      deletedAt: null
    },
    {
      id: randomUUID(),
      title: "운동",
      description: "주 3회 루틴 유지",
      startDate: today,
      recurrenceType: "weekly",
      recurrenceInterval: 1,
      recurrenceDaysOfWeek: [1, 3, 5],
      recurrenceUntil: recurringUntil,
      isArchived: false,
      deletedAt: null
    }
  ];
}

async function ensureLocalStoreFile() {
  await mkdir(path.dirname(localStorePath), { recursive: true });

  try {
    await readFile(localStorePath, "utf8");
  } catch {
    const initialStore: LocalStore = {
      events: createSeedEvents(),
      occurrences: [],
    };

    await writeFile(localStorePath, JSON.stringify(initialStore, null, 2), "utf8");
  }
}

export async function readLocalStore(): Promise<LocalStore> {
  await ensureLocalStoreFile();
  const raw = await readFile(localStorePath, "utf8");
  return JSON.parse(raw) as LocalStore;
}

export async function writeLocalStore(store: LocalStore) {
  await ensureLocalStoreFile();
  await writeFile(localStorePath, JSON.stringify(store, null, 2), "utf8");
}
