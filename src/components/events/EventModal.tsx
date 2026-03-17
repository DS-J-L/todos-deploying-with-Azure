import { RecurrenceFields } from "@/components/events/RecurrenceFields";
import type { EventFormValues, EventMutationInput } from "@/types/event";

type EventModalProps = {
  mode: "create" | "edit";
  initialValues: EventFormValues;
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: EventMutationInput) => void;
};

// This file captures the input surface agreed in docs before real form state and validation are added.
export function EventModal({ mode, initialValues, open, onClose, onSubmit }: EventModalProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="rounded-3xl border border-[var(--border)] bg-white p-6 shadow-lg">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xl font-semibold text-slate-900">{mode === "create" ? "일정 추가" : "일정 수정"}</h2>
        <button className="rounded-full border px-3 py-1.5 text-sm" onClick={onClose} type="button">
          닫기
        </button>
      </div>

      <form
        className="mt-6 space-y-4"
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit(initialValues);
        }}
      >
        <div>
          <label className="block text-sm font-medium text-slate-900" htmlFor="title">
            제목
          </label>
          <input
            className="mt-2 w-full rounded-2xl border border-[var(--border)] bg-white px-3 py-2"
            defaultValue={initialValues.title}
            id="title"
            name="title"
            placeholder="예: 알고리즘 과제"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-900" htmlFor="description">
            설명
          </label>
          <textarea
            className="mt-2 min-h-28 w-full rounded-2xl border border-[var(--border)] bg-white px-3 py-2"
            defaultValue={initialValues.description ?? ""}
            id="description"
            name="description"
            placeholder="예: 정렬 파트 복습"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-900" htmlFor="startDate">
            시작일
          </label>
          <input
            className="mt-2 w-full rounded-2xl border border-[var(--border)] bg-white px-3 py-2"
            defaultValue={initialValues.startDate}
            id="startDate"
            name="startDate"
            type="date"
          />
        </div>

        <RecurrenceFields
          onChange={() => undefined}
          recurrenceDaysOfWeek={initialValues.recurrenceDaysOfWeek}
          recurrenceInterval={initialValues.recurrenceInterval}
          recurrenceType={initialValues.recurrenceType}
          recurrenceUntil={initialValues.recurrenceUntil}
        />

        <div className="flex justify-end gap-3">
          <button className="rounded-full border px-4 py-2 text-sm" onClick={onClose} type="button">
            취소
          </button>
          <button className="rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white" type="submit">
            저장
          </button>
        </div>
      </form>
    </div>
  );
}
