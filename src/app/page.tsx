"use client";

import { CalendarBoard } from "@/components/calendar/CalendarBoard";
import { CalendarToolbar } from "@/components/calendar/CalendarToolbar";
import { AppShell } from "@/components/common/AppShell";
import { EmptyState } from "@/components/common/EmptyState";
import { Header } from "@/components/common/Header";
import { DayDetailPanel } from "@/components/events/DayDetailPanel";
import { DEFAULT_CALENDAR_VIEW } from "@/features/calendar/constants";
import { groupOccurrencesByDate } from "@/features/calendar/viewModel";
import { buildMonthMatrix, getToolbarLabel, getTodayDateKey } from "@/lib/date/range";
import type { OccurrenceItem } from "@/types/event";

// This page is intentionally static for now so we can stabilize the app shell first.
export default function HomePage() {
  const anchorDate = getTodayDateKey();
  const selectedDate = anchorDate;
  const occurrences: OccurrenceItem[] = [];
  const eventsByDate = groupOccurrencesByDate(occurrences);

  return (
    <AppShell>
      <Header title="PlanMate" />

      <CalendarToolbar
        anchorDate={anchorDate}
        currentView={DEFAULT_CALENDAR_VIEW}
        label={getToolbarLabel(DEFAULT_CALENDAR_VIEW, anchorDate)}
        onCreate={() => undefined}
        onNext={() => undefined}
        onPrev={() => undefined}
        onToday={() => undefined}
        onViewChange={() => undefined}
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
        <CalendarBoard
          anchorDate={anchorDate}
          events={eventsByDate}
          monthMatrix={buildMonthMatrix(anchorDate)}
          onDateSelect={() => undefined}
          onEventClick={() => undefined}
          selectedDate={selectedDate}
          view={DEFAULT_CALENDAR_VIEW}
        />

        <DayDetailPanel
          items={occurrences}
          onDelete={() => undefined}
          onEdit={() => undefined}
          onToggleComplete={() => undefined}
          selectedDate={selectedDate}
        />
      </div>

      <section className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
        <EmptyState
          title="개발 시작 전 체크"
          description="이 영역은 API 연결, 모달 상태 관리, Azure SQL 연동이 채워질 자리입니다."
        />
      </section>
    </AppShell>
  );
}
