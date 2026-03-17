"use client";

import { startTransition, useEffect, useState } from "react";

import { CalendarBoard } from "@/components/calendar/CalendarBoard";
import { CalendarToolbar } from "@/components/calendar/CalendarToolbar";
import { AppShell } from "@/components/common/AppShell";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { EmptyState } from "@/components/common/EmptyState";
import { Header } from "@/components/common/Header";
import { DayDetailPanel } from "@/components/events/DayDetailPanel";
import { EventModal } from "@/components/events/EventModal";
import { DEFAULT_CALENDAR_VIEW } from "@/features/calendar/constants";
import { createEventFormDefaults } from "@/features/event-form/defaultValues";
import { groupOccurrencesByDate } from "@/features/calendar/viewModel";
import { buildMonthMatrix, getTodayDateKey, getToolbarLabel, shiftAnchorDate } from "@/lib/date/range";
import type { ApiResponse, EventDetailResponseData, RangeResponseData } from "@/types/api";
import type { CalendarView, EventMutationInput, OccurrenceItem } from "@/types/event";

type ModalState = {
  open: boolean;
  mode: "create" | "edit";
  eventId: string | null;
  initialValues: EventMutationInput;
};

async function requestApi<T>(input: string, init?: RequestInit) {
  const response = await fetch(input, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {})
    }
  });

  const payload = (await response.json()) as ApiResponse<T>;

  if (!payload.success) {
    throw new Error(payload.error.message);
  }

  return payload.data;
}

export default function HomePage() {
  const today = getTodayDateKey();

  const [view, setView] = useState<CalendarView>(DEFAULT_CALENDAR_VIEW);
  const [anchorDate, setAnchorDate] = useState(today);
  const [selectedDate, setSelectedDate] = useState(today);
  const [occurrences, setOccurrences] = useState<OccurrenceItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [isMutating, setIsMutating] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<OccurrenceItem | null>(null);
  const [modalState, setModalState] = useState<ModalState>({
    open: false,
    mode: "create",
    eventId: null,
    initialValues: createEventFormDefaults(today)
  });

  async function loadOccurrences(nextView = view, nextAnchorDate = anchorDate) {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const data = await requestApi<RangeResponseData>(
        `/api/events/range?view=${nextView}&anchor=${nextAnchorDate}`
      );
      setOccurrences(data.occurrences);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "일정을 불러오지 못했습니다.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadOccurrences(view, anchorDate);
  }, [anchorDate, view]);

  function moveAnchor(direction: -1 | 1) {
    const nextAnchorDate = shiftAnchorDate(view, anchorDate, direction);

    startTransition(() => {
      setAnchorDate(nextAnchorDate);
      setSelectedDate(nextAnchorDate);
    });
  }

  function handleToday() {
    const nextAnchorDate = getTodayDateKey();

    startTransition(() => {
      setAnchorDate(nextAnchorDate);
      setSelectedDate(nextAnchorDate);
    });
  }

  function handleViewChange(nextView: CalendarView) {
    startTransition(() => {
      setView(nextView);
      setAnchorDate(selectedDate);
    });
  }

  function openCreateModal() {
    setModalState({
      open: true,
      mode: "create",
      eventId: null,
      initialValues: createEventFormDefaults(selectedDate)
    });
  }

  function closeModal() {
    setModalState((current) => ({ ...current, open: false }));
  }

  async function openEditModal(item: OccurrenceItem) {
    setIsMutating(true);
    setFeedbackMessage(null);

    try {
      const event = await requestApi<EventDetailResponseData>(`/api/events/${item.eventId}`);

      setModalState({
        open: true,
        mode: "edit",
        eventId: item.eventId,
        initialValues: {
          title: event.title,
          description: event.description,
          startDate: event.startDate,
          recurrenceType: event.recurrenceType,
          recurrenceInterval: event.recurrenceInterval,
          recurrenceDaysOfWeek: event.recurrenceDaysOfWeek,
          recurrenceUntil: event.recurrenceUntil
        }
      });
    } catch (error) {
      setFeedbackMessage(error instanceof Error ? error.message : "일정 정보를 불러오지 못했습니다.");
    } finally {
      setIsMutating(false);
    }
  }

  async function handleSubmitEvent(payload: EventMutationInput) {
    setIsMutating(true);
    setFeedbackMessage(null);

    try {
      if (modalState.mode === "create") {
        await requestApi<{ id: string }>("/api/events", {
          method: "POST",
          body: JSON.stringify(payload)
        });

        setFeedbackMessage("일정을 추가했습니다.");
      } else if (modalState.eventId) {
        await requestApi<{ updated: boolean }>(`/api/events/${modalState.eventId}`, {
          method: "PATCH",
          body: JSON.stringify(payload)
        });

        setFeedbackMessage("일정을 수정했습니다.");
      }

      closeModal();
      await loadOccurrences();
    } catch (error) {
      setFeedbackMessage(error instanceof Error ? error.message : "일정을 저장하지 못했습니다.");
    } finally {
      setIsMutating(false);
    }
  }

  async function handleToggleComplete(eventId: string, occurrenceDate: string) {
    const target = occurrences.find(
      (item) => item.eventId === eventId && item.occurrenceDate === occurrenceDate
    );

    if (!target) {
      return;
    }

    setIsMutating(true);
    setFeedbackMessage(null);

    try {
      await requestApi(`/api/events/${eventId}/occurrences/${occurrenceDate}/complete`, {
        method: "PATCH",
        body: JSON.stringify({ isCompleted: !target.isCompleted })
      });

      setFeedbackMessage(!target.isCompleted ? "일정을 완료 처리했습니다." : "완료 상태를 해제했습니다.");
      await loadOccurrences();
    } catch (error) {
      setFeedbackMessage(error instanceof Error ? error.message : "완료 상태를 변경하지 못했습니다.");
    } finally {
      setIsMutating(false);
    }
  }

  async function handleDeleteConfirm() {
    if (!deleteTarget) {
      return;
    }

    setIsMutating(true);
    setFeedbackMessage(null);

    try {
      await requestApi<{ deleted: boolean }>(`/api/events/${deleteTarget.eventId}`, {
        method: "DELETE"
      });

      setDeleteTarget(null);
      setFeedbackMessage("일정을 삭제했습니다.");
      await loadOccurrences();
    } catch (error) {
      setFeedbackMessage(error instanceof Error ? error.message : "일정을 삭제하지 못했습니다.");
    } finally {
      setIsMutating(false);
    }
  }

  const eventsByDate = groupOccurrencesByDate(occurrences);
  const selectedItems = occurrences.filter((item) => item.occurrenceDate === selectedDate);
  const toolbarLabel = getToolbarLabel(view, anchorDate);

  return (
    <AppShell>
      <Header title="PlanMate" />

      <CalendarToolbar
        anchorDate={anchorDate}
        currentView={view}
        label={toolbarLabel}
        onCreate={openCreateModal}
        onNext={() => moveAnchor(1)}
        onPrev={() => moveAnchor(-1)}
        onToday={handleToday}
        onViewChange={handleViewChange}
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
        <CalendarBoard
          anchorDate={anchorDate}
          events={eventsByDate}
          monthMatrix={buildMonthMatrix(anchorDate)}
          onDateSelect={setSelectedDate}
          onEventClick={openEditModal}
          selectedDate={selectedDate}
          view={view}
        />

        <DayDetailPanel
          items={selectedItems}
          onDelete={setDeleteTarget}
          onEdit={openEditModal}
          onToggleComplete={handleToggleComplete}
          selectedDate={selectedDate}
        />
      </div>

      <section className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
        {isLoading ? (
          <EmptyState
            title="일정 불러오는 중"
            description="현재 선택한 범위의 일정을 불러오고 있습니다."
          />
        ) : errorMessage ? (
          <EmptyState title="조회 실패" description={errorMessage} actionLabel="다시 시도" onAction={() => void loadOccurrences()} />
        ) : feedbackMessage ? (
          <EmptyState
            title={isMutating ? "처리 중" : "작업 결과"}
            description={feedbackMessage}
          />
        ) : (
          <EmptyState
            title="다음 구현 범위"
            description="현재는 API와 캘린더 데이터 흐름이 연결되어 있습니다. 다음 단계에서는 토스트, 낙관적 갱신, Azure SQL 실연결을 다듬으면 됩니다."
          />
        )}
      </section>

      <EventModal
        initialValues={modalState.initialValues}
        mode={modalState.mode}
        onClose={closeModal}
        onSubmit={(payload) => void handleSubmitEvent(payload)}
        open={modalState.open}
      />

      <ConfirmDialog
        description={
          deleteTarget
            ? `'${deleteTarget.title}' 일정을 삭제하면 현재 시리즈가 더 이상 보이지 않습니다.`
            : ""
        }
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => void handleDeleteConfirm()}
        open={deleteTarget !== null}
        title="일정을 삭제할까요?"
      />
    </AppShell>
  );
}
