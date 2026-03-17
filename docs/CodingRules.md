# CodingRules

## 1. 목적

이 문서는 PlanMate 프로젝트의 코딩 규칙을 정의한다.  
목표는 아래 세 가지다.

- 일관성
- 유지보수성
- 날짜/반복 로직의 안정성

## 2. 공통 원칙

- 이해하기 쉬운 코드를 우선한다.
- 짧은 코드보다 **읽기 쉬운 코드**를 우선한다.
- 한 함수는 한 가지 책임만 갖도록 한다.
- 중복보다 우선해야 할 것은 **의도를 드러내는 이름**이다.
- 날짜 계산, 반복 규칙 계산은 임시로 컴포넌트 안에 작성하지 않는다.

## 3. 언어 / 타입 규칙

- TypeScript `strict` 사용
- `any` 사용 금지
- 가능한 경우 타입 별칭보다 명확한 인터페이스/타입 선언 사용
- API Request/Response 타입은 별도 파일로 분리
- nullable 값은 명시적으로 처리

### 금지
- 암묵적 `any`
- 타입 단언 남용
- `as unknown as ...` 형태의 우회

## 4. 네이밍 규칙

### 파일명
- 컴포넌트: PascalCase
  - 예: `EventModal.tsx`
- 유틸/서비스/레포지토리: camelCase 또는 도메인 단위 소문자
  - 예: `event.service.ts`, `range.ts`

### 변수명
- boolean: `is`, `has`, `should` 접두사 사용
  - 예: `isCompleted`, `hasRecurrence`
- 날짜 범위: `rangeStart`, `rangeEnd`
- 기준 날짜: `anchorDate`

### 함수명
- 동사로 시작
  - 예: `createEvent`, `updateEvent`, `expandRecurringEvents`

## 5. 폴더 규칙

```text
src/
  app/
  components/
  features/
  services/
  repositories/
  lib/
  types/
```

### 규칙
- UI와 비즈니스 로직을 분리한다.
- DB 접근 코드는 `repositories/`에만 둔다.
- 날짜 계산 로직은 `lib/date/`에 둔다.
- API 핸들러 안에 긴 비즈니스 로직을 작성하지 않는다.

## 6. React / Next.js 규칙

- 기본은 Server Component 우선
- 브라우저 상호작용이 필요한 경우만 Client Component 사용
- 상태는 가능한 한 가까운 곳에서 관리하되, 공통 상태는 상위로 올린다.
- 컴포넌트가 200줄 이상 커지면 분리 여부를 검토한다.

### 금지
- API 호출 로직과 복잡한 UI 로직을 한 컴포넌트에 몰아넣기
- 불필요한 전역 상태 도입

## 7. API 규칙

- 모든 API는 입력 검증을 반드시 수행한다.
- 응답 형식은 `success / data / error` 구조를 통일한다.
- 에러 메시지는 사용자용 메시지와 내부 로그용 메시지를 구분한다.
- 날짜 문자열은 항상 `YYYY-MM-DD` 포맷으로 주고받는다.

## 8. DB / SQL 규칙

- 문자열 결합으로 SQL 작성 금지
- 반드시 파라미터 바인딩 사용
- soft delete 사용 시 조회 조건에 `deleted_at IS NULL`을 누락하지 않는다.
- update 시 `updated_at` 갱신 책임을 명확히 한다.

### 권장
- 쿼리 함수 하나는 하나의 도메인 목적만 갖게 작성
- 복잡한 반복 조회는 서비스 레이어에서 처리

## 9. 날짜 / 반복 로직 규칙

이 프로젝트에서 가장 중요한 규칙이다.

- 날짜 계산은 반드시 공용 유틸 함수로 처리
- 주 시작 요일 규칙은 앱 전역에서 고정
- 요일 숫자 규칙도 앱 전역에서 고정
- 반복 일정 계산 로직은 UI 코드와 분리
- 범위 조회 시 경계 조건 포함 여부를 함수명/주석에 명확히 드러낼 것

### 예시
- `getMonthRange(anchorDate)`
- `getWeekRange(anchorDate)`
- `expandOccurrencesWithinRange(event, rangeStart, rangeEnd)`

## 10. 폼 처리 규칙

- 필수값은 클라이언트와 서버 양쪽에서 검증
- 폼 상태와 API payload 변환 로직을 분리
- 반복 설정 값은 저장 전 정규화(normalize)

## 11. 스타일 규칙

- Tailwind 클래스는 의미 단위로 정리
- 너무 긴 className은 상수/유틸/조합 함수로 분리
- 상태 스타일은 조건 분기 함수로 관리 가능

### 금지
- 한 줄에 지나치게 긴 className
- 재사용 가능한 UI를 페이지에서 직접 반복 작성

## 12. 에러 처리 규칙

- `try/catch`는 꼭 필요한 레이어에서만 사용
- 하위 레이어에서 에러를 삼키지 않는다.
- 사용자에게 보여줄 수 없는 내부 에러는 일반화된 메시지로 반환한다.

## 13. 테스트 규칙

### 반드시 테스트할 대상
- 월간 범위 계산
- 주간 범위 계산
- 반복 일정 전개 로직
- 완료 상태 조합 로직

### 이유
반복 일정과 날짜 계산은 시각적으로는 간단해 보여도 실제 버그가 가장 잘 나는 영역이기 때문이다.

## 14. Git / 브랜치 규칙

### 브랜치
- `main`
- `feat/<topic>`
- `fix/<topic>`
- `docs/<topic>`

### 커밋 예시
- `feat: add month range API`
- `fix: correct weekly recurrence expansion`
- `docs: update database design`

## 15. PR 규칙

- 하나의 PR은 하나의 목적만 담는다.
- 큰 UI 변경과 DB 변경을 한 PR에 같이 넣지 않는 것을 권장한다.
- PR 본문에 아래를 포함한다.
  - 무엇을 했는지
  - 왜 했는지
  - 어떻게 테스트했는지

## 16. 문서화 규칙

다음 변경이 생기면 문서도 같이 갱신한다.

- API 변경
- DB 스키마 변경
- 반복 일정 규칙 변경
- 사용자 흐름 변경

## 17. 결론

이 프로젝트에서 가장 중요한 코딩 규칙은 아래 세 가지다.

1. 날짜/반복 로직은 UI에서 분리한다.
2. DB 접근은 Repository로 모은다.
3. 입력/응답/에러 형식을 일관되게 유지한다.

이 세 가지만 지켜도 프로젝트 품질이 크게 올라간다.
