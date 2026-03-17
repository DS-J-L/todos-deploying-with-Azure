import type { OccurrenceItem } from "@/types/event";

export function groupOccurrencesByDate(items: OccurrenceItem[]): Record<string, OccurrenceItem[]> {
  return items.reduce<Record<string, OccurrenceItem[]>>((accumulator, item) => {
    const currentItems = accumulator[item.occurrenceDate] ?? [];
    accumulator[item.occurrenceDate] = [...currentItems, item];
    return accumulator;
  }, {});
}

