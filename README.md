# todos-deploying-with-Azure

Azure App Service + Azure SQL Database 배포를 목표로 하는 `PlanMate` 초기 프로젝트 골격입니다.

## 현재 반영한 내용

- `docs/` 문서를 기준으로 Next.js App Router 구조를 선반영
- API / service / repository / date util / type 레이어 분리
- 캘린더 UI 개발 전에 필요한 컴포넌트 뼈대와 주석 추가
- Azure SQL 연결용 `.env.example` 추가

## 폴더 구조

```text
src/
  app/
    api/
      events/
        route.ts
        range/route.ts
        [id]/route.ts
        [id]/occurrences/[date]/complete/route.ts
    globals.css
    layout.tsx
    page.tsx
  components/
    calendar/
    common/
    events/
  features/
    calendar/
    event-form/
  lib/
    api/
    db/
    date/
  repositories/
  services/
  types/
```

## 시작 전 메모

1. `npm install`
2. `.env.example` 값을 기준으로 환경변수 설정
3. Azure SQL 스키마와 API 구현을 문서 순서대로 채우기

## 참고 문서

- `docs/Architecture.md`
- `docs/TechSpec.md`
- `docs/API.md`
- `docs/ComponentSpec.md`
