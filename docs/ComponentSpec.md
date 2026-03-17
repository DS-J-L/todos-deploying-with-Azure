# ComponentSpec

## 1. 목적

이 문서는 PlanMate 프론트엔드 컴포넌트의 책임과 인터페이스를 정의한다.  
MVP 기준으로 **캘린더 탐색, 일정 생성/수정, 일정 목록 확인**에 필요한 핵심 컴포넌트만 명세한다.

## 2. 컴포넌트 트리

```text
AppShell
 ├─ Header
 ├─ CalendarToolbar
 │   ├─ DateNavigator
 │   └─ ViewSwitcher
 ├─ CalendarBoard
 │   ├─ MonthCalendarView
 │   │   └─ CalendarDateCell
 │   ├─ WeekCalendarView
 │   │   └─ WeekDayColumn
 │   └─ DayCalendarView
 ├─ DayDetailPanel
 │   └─ EventCard
 ├─ EventModal
 │   └─ RecurrenceFields
 ├─ ConfirmDialog
 ├─ EmptyState
 └─ ToastProvider
```

## 3. 공통 규칙

- 프레젠테이션 중심 컴포넌트와 데이터/상태 관리 컴포넌트를 구분한다.
- 캘린더 셀 컴포넌트는 가능한 한 순수 렌더링에 가깝게 유지한다.
- 서버 요청은 페이지 레벨 혹은 훅에서 처리하고, 하위 컴포넌트는 콜백 기반으로 동작한다.

## 4. 컴포넌트 명세

## 4.1 AppShell
**역할**
- 전체 레이아웃 컨테이너
- 반응형 1단/2단 전환
- 공통 여백과 최대 폭 관리

**입력**
- `children`

**출력/동작**
- 없음

---

## 4.2 Header
**역할**
- 앱 이름, 배포 링크, 향후 사용자 메뉴 위치 제공

**입력**
- `title: string`

**출력/동작**
- 없음

---

## 4.3 CalendarToolbar
**역할**
- 날짜 이동, 오늘 이동, 뷰 전환, 일정 추가 액션 집약

**입력**
- `currentView: 'day' | 'week' | 'month'`
- `anchorDate: string`
- `onPrev(): void`
- `onNext(): void`
- `onToday(): void`
- `onViewChange(view): void`
- `onCreate(): void`

**출력/동작**
- 사용자의 탐색 액션을 상위 컨테이너로 전달

---

## 4.4 DateNavigator
**역할**
- 이전/다음/오늘 이동 UI 제공

**입력**
- `label: string`
- `onPrev()`
- `onNext()`
- `onToday()`

**출력/동작**
- 버튼 클릭 이벤트 전달

---

## 4.5 ViewSwitcher
**역할**
- `일 / 주 / 월` 탭 전환

**입력**
- `value: 'day' | 'week' | 'month'`
- `onChange(view)`

**출력/동작**
- 선택된 뷰 상태 변경 이벤트 전달

---

## 4.6 CalendarBoard
**역할**
- 현재 뷰에 맞는 하위 캘린더 컴포넌트 렌더링

**입력**
- `view`
- `anchorDate`
- `events`
- `selectedDate`
- `onDateSelect(date)`
- `onEventClick(event)`

**출력/동작**
- Month / Week / Day 뷰 중 하나를 렌더링

---

## 4.7 MonthCalendarView
**역할**
- 월별 달력 렌더링
- 각 날짜 셀에 일정 미리보기 제공

**입력**
- `monthMatrix`
- `eventsByDate`
- `selectedDate`
- `onDateSelect(date)`

**출력/동작**
- 날짜 클릭 이벤트 전달

---

## 4.8 CalendarDateCell
**역할**
- 월별 뷰의 단일 날짜 셀 표현
- 날짜 숫자, 오늘/선택 상태, 일정 요약 표시

**입력**
- `date`
- `isToday`
- `isSelected`
- `items`
- `onClick()`

**출력/동작**
- 클릭 시 날짜 선택

---

## 4.9 WeekCalendarView
**역할**
- 주별 7일 영역 렌더링

**입력**
- `weekDates`
- `eventsByDate`
- `selectedDate`
- `onDateSelect(date)`
- `onEventClick(event)`

**출력/동작**
- 날짜 또는 일정 선택

---

## 4.10 WeekDayColumn
**역할**
- 주별 뷰의 하루 컬럼 렌더링

**입력**
- `date`
- `items`
- `isSelected`
- `onDateSelect()`
- `onEventClick(event)`

**출력/동작**
- 컬럼 선택 및 일정 선택 이벤트 전달

---

## 4.11 DayCalendarView
**역할**
- 선택 날짜의 일정 목록 중심으로 렌더링

**입력**
- `date`
- `items`
- `onEventClick(event)`

**출력/동작**
- 상세 목록 표시

---

## 4.12 DayDetailPanel
**역할**
- 선택한 날짜의 모든 일정 카드 표시
- 완료/수정/삭제 액션 제공

**입력**
- `selectedDate`
- `items`
- `onToggleComplete(eventId, occurrenceDate)`
- `onEdit(event)`
- `onDelete(event)`

**출력/동작**
- 사용자의 일정 액션 전달

---

## 4.13 EventCard
**역할**
- 단일 일정 시각화
- 제목, 설명 일부, 반복 여부, 완료 상태 표시

**입력**
- `event`
- `occurrenceDate`
- `isCompleted`
- `onToggleComplete()`
- `onEdit()`
- `onDelete()`

**출력/동작**
- 체크/수정/삭제 이벤트 전달

---

## 4.14 EventModal
**역할**
- 일정 생성 및 수정 입력 UI
- 생성/수정 모드 공용 사용

**입력**
- `mode: 'create' | 'edit'`
- `initialValues`
- `open`
- `onClose()`
- `onSubmit(payload)`

**출력/동작**
- 저장 시 정규화된 폼 데이터 반환

---

## 4.15 RecurrenceFields
**역할**
- 반복 설정 전용 입력 UI

**입력**
- `recurrenceType`
- `recurrenceInterval`
- `recurrenceDaysOfWeek`
- `recurrenceUntil`
- `onChange(nextState)`

**출력/동작**
- 반복 관련 입력 변경 상태 전달

**비고**
- `none`일 때는 하위 옵션 숨김
- `weekly`일 때만 요일 선택 노출

---

## 4.16 ConfirmDialog
**역할**
- 삭제 전 확인
- 향후 반복 시리즈 관련 경고 메시지에 재사용

**입력**
- `open`
- `title`
- `description`
- `onConfirm()`
- `onCancel()`

**출력/동작**
- 확인/취소 이벤트 전달

---

## 4.17 EmptyState
**역할**
- 일정 없음, 조회 결과 없음 상황 표현

**입력**
- `title`
- `description`
- `actionLabel?`
- `onAction?`

**출력/동작**
- CTA 제공 가능

---

## 4.18 ToastProvider / Toast
**역할**
- 저장 성공/실패, 삭제 성공 등 피드백 메시지 출력

**입력**
- `type: success | error | info`
- `message`

**출력/동작**
- 일정 시간 후 자동 닫힘

## 5. 재사용 우선순위

재사용 우선순위가 높은 컴포넌트는 아래와 같다.

- `CalendarToolbar`
- `DateNavigator`
- `ViewSwitcher`
- `EventModal`
- `EventCard`
- `EmptyState`

## 6. MVP 구현 우선순위

1. `CalendarToolbar`
2. `MonthCalendarView`
3. `DayDetailPanel`
4. `EventModal`
5. `WeekCalendarView`
6. `DayCalendarView`
7. `ConfirmDialog`
8. `Toast`

## 7. 비고

MVP에서는 캘린더 드래그 앤 드롭, 리사이즈, 개별 반복 항목 수정 기능이 없다.  
따라서 컴포넌트 설계도 “생성/조회/간단 수정” 흐름에 최적화한다.
