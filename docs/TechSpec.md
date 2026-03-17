# TechSpec

## 1. 기술 목표

PlanMate는 아래 조건을 만족하는 기술 스택을 사용한다.

- Azure App Service 배포 가능
- Azure SQL Database 연동 가능
- 캘린더형 UI 구현 가능
- 반복 일정/범위 조회를 서버에서 통제 가능
- 학생 프로젝트로 구현 가능한 난이도 유지

## 2. 기술 스택

## 2.1 Frontend
- **Next.js (App Router)**
- **TypeScript**
- **Tailwind CSS**
- **캘린더 UI 라이브러리 1개 선택**
  - 후보: FullCalendar React 또는 직접 구현한 캘린더 컴포넌트

### 권장
MVP 속도를 위해 검증된 캘린더 UI 라이브러리를 우선 사용한다.

## 2.2 Backend
- **Next.js Route Handlers**
- **Node.js LTS**
- **zod**(입력 검증 권장)
- **mssql**(Azure SQL 연결 라이브러리 권장)

## 2.3 Database
- **Azure SQL Database**

## 2.4 Deployment
- **Azure App Service**
- 소스 저장소: GitHub

## 3. 핵심 기술 선택 이유

### Next.js
- 프론트와 백엔드 API를 한 프로젝트에서 관리 가능
- Azure App Service 배포 흐름이 명확함
- App Router 기반 구조화가 쉬움

### Azure SQL
- 관계형 데이터 모델로 일정/발생 상태 관리에 적합
- Azure 배포 스토리와 일관성 있음

### Route Handlers
- 별도 Express 서버 없이 API 제공 가능
- 프로젝트 관리 복잡도를 낮춤

## 4. 런타임 구조

- 브라우저는 Next.js 페이지와 클라이언트 컴포넌트를 사용한다.
- 데이터 요청은 `/api/*` 엔드포인트로 보낸다.
- API는 서비스 레이어를 호출한다.
- 서비스는 저장소 레이어를 통해 Azure SQL에 접근한다.

## 5. 데이터 모델 요약

### events
- 일정 원본
- 반복 규칙 포함

### event_occurrences
- 특정 발생일 완료 상태 저장

### 설계 이유
반복 일정은 원본 데이터와 발생 상태를 분리해야 구현이 단순해지고, 특정 날짜 완료 상태를 저장할 수 있다.

## 6. 날짜 처리 전략

### 기본 전략
- MVP는 **날짜 중심 일정 관리**를 우선한다.
- 시간 단위 예약보다는 `YYYY-MM-DD` 기준의 all-day 일정으로 처리한다.

### 이유
- 구현 복잡도 감소
- 달력형 To-do 앱에 더 적합
- 반복 일정 계산이 단순해짐

### 규칙
- API 입력/출력 날짜 포맷은 ISO date string (`YYYY-MM-DD`)
- 주 시작 요일은 문서/코드/API 전역에서 동일하게 사용
- 요일 숫자 규칙도 전역 일치 필요

## 7. 반복 일정 처리 방식

### 저장 방식
- 반복 일정도 DB에는 원본 1건만 저장

### 조회 방식
- 클라이언트가 범위를 요청
- 서버가 해당 범위 내 발생일을 계산
- `event_occurrences` 상태를 합쳐 결과 반환

### 장점
- 중복 데이터 최소화
- 시리즈 단위 수정이 쉬움

### MVP 제한
- 특정 발생일만 수정/건너뛰는 예외 처리는 미지원
- 필요 시 V2에서 `event_exceptions` 추가

## 8. API 응답 형식

### 성공 응답
```json
{
  "success": true,
  "data": {}
}
```

### 실패 응답
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "제목은 필수입니다."
  }
}
```

## 9. 주요 환경변수

```env
DB_SERVER=
DB_PORT=1433
DB_NAME=
DB_USER=
DB_PASSWORD=
DB_ENCRYPT=true
APP_TIMEZONE=Asia/Seoul
NEXT_PUBLIC_APP_NAME=PlanMate
```

### 원칙
- `NEXT_PUBLIC_` 접두사는 클라이언트 노출 허용 값에만 사용
- DB 관련 값은 서버 전용

## 10. 폴더 구조 제안

```text
src/
  app/
    page.tsx
    api/
      events/
        route.ts
      events/[id]/
        route.ts
      events/[id]/occurrences/[date]/complete/
        route.ts
  components/
    common/
    calendar/
    events/
  services/
    event.service.ts
  repositories/
    event.repository.ts
    occurrence.repository.ts
  lib/
    db/
      sql.ts
    date/
      range.ts
      recurrence.ts
  types/
    event.ts
    api.ts
```

## 11. 검증 전략

### 클라이언트
- 필수 입력값 검증
- 입력 형식 검증
- 기본 UX 검증

### 서버
- zod 또는 동등한 스키마 검증 사용
- 잘못된 recurrence 값 차단
- 삭제된 일정 수정 불가 처리

## 12. 성능 고려사항

- 월별 조회는 필요한 범위만 요청
- 범위 조회는 페이지 단위가 아니라 날짜 범위 단위로 수행
- 불필요한 전체 데이터 로딩 금지
- `events`, `event_occurrences` 인덱스 사용

## 13. 로깅/모니터링

### 개발 환경
- 콘솔 로그 최소화
- 핵심 에러만 출력

### 운영 환경
- App Service 로그 활용
- API 에러는 request context와 함께 기록
- 민감정보(DB 비밀번호, 전체 연결 문자열)는 로그 금지

## 14. 테스트 전략

### 단위 테스트 우선 대상
- 주간 범위 계산
- 월간 범위 계산
- 반복 일정 전개 로직
- 완료 상태 조합 로직

### 통합 테스트 우선 대상
- 이벤트 생성 API
- 범위 조회 API
- 완료 처리 API

## 15. 배포 기술 메모

- App Service 환경변수에 DB 연결값 등록
- 운영 DB 스키마는 배포 전 준비
- production build 후 Azure에서 정상 실행 가능한지 확인
- 앱 시작 커맨드와 포트 처리 방식을 Azure 환경에 맞게 점검

## 16. 향후 기술 확장

- 인증 추가 시 NextAuth/Auth.js 또는 Azure 기반 인증 검토
- 알림 기능 추가 시 백그라운드 작업 또는 외부 서비스 연동 검토
- 다중 사용자 분리 시 `users`, `owner_id` 확장

## 17. 결론

PlanMate의 MVP 기술 선택은 아래 조합으로 고정한다.

- **Next.js + TypeScript**
- **Azure SQL Database**
- **Azure App Service**
- **Route Handlers + Service/Repository 구조**

이 조합은 구현 가능성, 문서화 용이성, Azure 포트폴리오 적합성 측면에서 가장 균형이 좋다.
