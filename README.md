# todos-deploying-with-Azure

Azure App Service + Azure SQL Database 배포를 목표로 하는 `PlanMate` 초기 프로젝트 골격입니다.

## 현재 반영한 내용

- `docs/` 문서를 기준으로 Next.js App Router 구조를 선반영
- API / service / repository / date util / type 레이어 분리
- 캘린더 UI, CRUD API, 범위 조회, 반복 일정 기본 흐름 구현
- Azure SQL 연결용 `.env.example` 추가
- Azure SQL 미연결 시 로컬 파일 저장소 fallback 지원
- DB 스키마 SQL 및 연결 확인용 health API 추가

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
3. Azure SQL을 사용할 경우 `database/schema.sql` 실행
4. 샘플 데이터가 필요하면 `database/seed.sql` 실행
5. 개발 서버 실행 후 `GET /api/health/db`로 현재 저장소 모드 확인

## 데이터 저장 모드

- `DB_SERVER`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`가 모두 있으면 Azure SQL 사용
- 하나라도 없으면 `data/local-store.json` 기반 로컬 저장소 사용

## DB 연결 확인

- 로컬 개발 서버 실행: `npm run dev`
- 상태 확인: `/api/health/db`

예시 응답

```json
{
  "success": true,
  "data": {
    "mode": "local-file",
    "status": "ok",
    "message": "DB 환경변수가 없어 로컬 파일 저장소를 사용 중입니다."
  }
}
```

## Azure App Service 배포

### 추가된 배포 파일

- `.github/workflows/deploy-azure-app-service.yml`
- `scripts/prepare-appservice.mjs`
- `deployment/app-service-settings.example.txt`
- `deployment/startup-command.txt`

### 동작 방식

1. GitHub Actions가 `npm ci`, `npm run typecheck`, `npm run build` 실행
2. `next.config.ts`의 `output: "standalone"` 기준으로 App Service용 패키지 생성
3. `deployment/package`를 Azure Web App에 배포

### GitHub 설정

- Repository Variable: `AZURE_WEBAPP_NAME`
- Repository Secret: `AZURE_WEBAPP_PUBLISH_PROFILE`

### Azure App Service 권장 설정

- OS: Linux App Service
- 런타임: Node 20
- Linux App Service Startup Command: `node server.js`
- 환경변수는 `deployment/app-service-settings.example.txt` 기준으로 등록
- GitHub Actions가 `ubuntu-latest`에서 standalone artifact를 만들기 때문에 Linux App Service와 맞추는 편이 안전

### 수동 확인 순서

1. Azure Portal에서 App Service 생성
2. App Service 환경변수 등록
3. Azure SQL에 `database/schema.sql` 실행
4. 필요하면 `database/seed.sql` 실행
5. GitHub Secret/Variable 등록
6. `main` 브랜치 푸시 또는 GitHub Actions 수동 실행

## 참고 문서

- `docs/Architecture.md`
- `docs/TechSpec.md`
- `docs/API.md`
- `docs/ComponentSpec.md`
