import type { EventFormValues, RecurrenceType } from "@/types/event";

type RecurrenceFieldsProps = {
  recurrenceType: RecurrenceType;
  recurrenceInterval: number;
  recurrenceDaysOfWeek: number[];
  recurrenceUntil: string | null;
  onChange: (nextState: Partial<EventFormValues>) => void;
};

// This component stays stateless so the real form hook can own validation and normalization.
export function RecurrenceFields({
  recurrenceType,
  recurrenceInterval,
  recurrenceDaysOfWeek,
  recurrenceUntil,
  onChange
}: RecurrenceFieldsProps) {
  return (
    <div className="space-y-4 rounded-2xl border border-[var(--border)] bg-slate-50 p-4">
      <div>
        <label className="block text-sm font-medium text-slate-900" htmlFor="recurrence-type">
          반복 유형
        </label>
        <select
          className="mt-2 w-full rounded-2xl border border-[var(--border)] bg-white px-3 py-2"
          id="recurrence-type"
          onChange={(event) =>
            onChange({
              recurrenceDaysOfWeek: event.target.value === "weekly" ? recurrenceDaysOfWeek : [],
              recurrenceType: event.target.value as RecurrenceType
            })
          }
          value={recurrenceType}
        >
          <option value="none">없음</option>
          <option value="daily">매일</option>
          <option value="weekly">매주</option>
          <option value="monthly">매월</option>
        </select>
      </div>

      {recurrenceType !== "none" ? (
        <>
          <div>
            <label className="block text-sm font-medium text-slate-900" htmlFor="recurrence-interval">
              반복 간격
            </label>
            <input
              className="mt-2 w-full rounded-2xl border border-[var(--border)] bg-white px-3 py-2"
              id="recurrence-interval"
              min={1}
              onChange={(event) => onChange({ recurrenceInterval: Number(event.target.value) || 1 })}
              type="number"
              value={recurrenceInterval}
            />
          </div>

          {recurrenceType === "weekly" ? (
            <div>
              <p className="text-sm font-medium text-slate-900">요일 선택</p>
              <p className="mt-2 text-xs text-[var(--muted)]">
                실제 구현에서는 토글 버튼 그룹으로 교체하고, 값은 0~6 숫자 규칙으로 통일합니다.
              </p>
              <div className="mt-2 rounded-2xl border border-dashed border-[var(--border)] bg-white px-3 py-2 text-sm text-[var(--muted)]">
                선택됨: {recurrenceDaysOfWeek.length > 0 ? recurrenceDaysOfWeek.join(", ") : "없음"}
              </div>
            </div>
          ) : null}

          <div>
            <label className="block text-sm font-medium text-slate-900" htmlFor="recurrence-until">
              반복 종료일
            </label>
            <input
              className="mt-2 w-full rounded-2xl border border-[var(--border)] bg-white px-3 py-2"
              id="recurrence-until"
              onChange={(event) => onChange({ recurrenceUntil: event.target.value || null })}
              type="date"
              value={recurrenceUntil ?? ""}
            />
          </div>
        </>
      ) : null}
    </div>
  );
}

