import type { EventFormValues } from "@/types/event";

export function createEventFormDefaults(anchorDate: string): EventFormValues {
  return {
    title: "",
    description: null,
    startDate: anchorDate,
    recurrenceType: "none",
    recurrenceInterval: 1,
    recurrenceDaysOfWeek: [],
    recurrenceUntil: null
  };
}

