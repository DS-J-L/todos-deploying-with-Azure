import { EmptyState } from "@/components/common/EmptyState";
import { EventCard } from "@/components/events/EventCard";
import type { OccurrenceItem } from "@/types/event";

type DayDetailPanelProps = {
  selectedDate: string;
  items: OccurrenceItem[];
  onToggleComplete: (eventId: string, occurrenceDate: string) => void;
  onEdit: (event: OccurrenceItem) => void;
  onDelete: (event: OccurrenceItem) => void;
};

export function DayDetailPanel({
  selectedDate,
  items,
  onToggleComplete,
  onEdit,
  onDelete
}: DayDetailPanelProps) {
  return (
    <aside className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm">
      <div className="mb-4">
        <p className="text-xs font-medium uppercase tracking-[0.22em] text-[var(--muted)]">Day Detail</p>
        <h2 className="mt-2 text-xl font-semibold text-slate-900">{selectedDate}</h2>
      </div>

      <div className="space-y-3">
        {items.length === 0 ? (
          <EmptyState
            description="선택한 날짜에는 아직 일정이 없습니다. EventModal과 API가 연결되면 이 패널이 실제 목록을 렌더링합니다."
            title="일정 없음"
          />
        ) : (
          items.map((item) => (
            <EventCard
              event={item}
              isCompleted={item.isCompleted}
              key={`${item.eventId}-${item.occurrenceDate}`}
              occurrenceDate={item.occurrenceDate}
              onDelete={() => onDelete(item)}
              onEdit={() => onEdit(item)}
              onToggleComplete={() => onToggleComplete(item.eventId, item.occurrenceDate)}
            />
          ))
        )}
      </div>
    </aside>
  );
}

