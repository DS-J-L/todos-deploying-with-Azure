# API

## 1. 목적

PlanMate API는 클라이언트가 일정 데이터를 조회하고 변경할 수 있도록 한다.  
모든 API는 JSON을 사용하며, 클라이언트는 DB에 직접 접근하지 않는다.

## 2. 공통 규칙

- Base Path: `/api`
- Content-Type: `application/json`
- 날짜 포맷: `YYYY-MM-DD`
- 응답 형식은 성공/실패 구조를 통일한다.

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
    "code": "ERROR_CODE",
    "message": "사용자에게 보여줄 메시지"
  }
}
```

## 3. 도메인 모델

## 3.1 Event (원본 일정)
```json
{
  "id": "uuid",
  "title": "운동",
  "description": "헬스장 가기",
  "startDate": "2026-03-01",
  "recurrenceType": "weekly",
  "recurrenceInterval": 1,
  "recurrenceDaysOfWeek": [1, 3, 5],
  "recurrenceUntil": "2026-06-30"
}
```

## 3.2 Occurrence (표시용 일정)
```json
{
  "eventId": "uuid",
  "title": "운동",
  "description": "헬스장 가기",
  "occurrenceDate": "2026-03-18",
  "isRecurring": true,
  "isCompleted": false
}
```

## 4. 엔드포인트 목록

### 4.1 범위 조회
**GET** `/api/events/range?view=month&anchor=2026-03-17`

#### 설명
- 기준 날짜(anchor)와 뷰(day/week/month)를 받아 해당 범위의 표시용 일정을 반환한다.

#### Query Params
- `view`: `day | week | month`
- `anchor`: 기준 날짜 (`YYYY-MM-DD`)

#### 성공 응답 예시
```json
{
  "success": true,
  "data": {
    "view": "month",
    "range": {
      "start": "2026-03-01",
      "end": "2026-03-31"
    },
    "occurrences": [
      {
        "eventId": "0d2a0d0e-1111-2222-3333-444444444444",
        "title": "운동",
        "description": "헬스장 가기",
        "occurrenceDate": "2026-03-18",
        "isRecurring": true,
        "isCompleted": false
      }
    ]
  }
}
```

#### 실패 케이스
- `view` 값이 잘못됨
- `anchor` 날짜 포맷이 잘못됨

---

### 4.2 단일 일정 조회
**GET** `/api/events/:id`

#### 설명
- 수정 모달 진입 시 원본 일정 정보를 가져온다.

#### 성공 응답 예시
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "알고리즘 과제",
    "description": "정렬 파트 정리",
    "startDate": "2026-03-17",
    "recurrenceType": "none",
    "recurrenceInterval": 1,
    "recurrenceDaysOfWeek": [],
    "recurrenceUntil": null
  }
}
```

---

### 4.3 일정 생성
**POST** `/api/events`

#### Request Body
```json
{
  "title": "운동",
  "description": "헬스장 가기",
  "startDate": "2026-03-01",
  "recurrenceType": "weekly",
  "recurrenceInterval": 1,
  "recurrenceDaysOfWeek": [1, 3, 5],
  "recurrenceUntil": "2026-06-30"
}
```

#### 필드 규칙
- `title`: 필수, 1~120자
- `startDate`: 필수
- `recurrenceType`: `none | daily | weekly | monthly`
- `recurrenceInterval`: 1 이상
- `recurrenceDaysOfWeek`: weekly일 때만 사용
- `recurrenceUntil`: 시작일보다 빠를 수 없음

#### 성공 응답 예시
```json
{
  "success": true,
  "data": {
    "id": "uuid"
  }
}
```

---

### 4.4 일정 수정
**PATCH** `/api/events/:id`

#### 설명
- 원본 일정(시리즈)을 수정한다.
- MVP에서는 반복 일정도 **시리즈 전체 수정**만 지원한다.

#### Request Body
```json
{
  "title": "운동",
  "description": "저녁 운동",
  "startDate": "2026-03-01",
  "recurrenceType": "weekly",
  "recurrenceInterval": 1,
  "recurrenceDaysOfWeek": [1, 3, 5],
  "recurrenceUntil": "2026-07-31"
}
```

#### 성공 응답 예시
```json
{
  "success": true,
  "data": {
    "updated": true
  }
}
```

---

### 4.5 일정 삭제
**DELETE** `/api/events/:id`

#### 설명
- 소프트 삭제를 수행한다.

#### 성공 응답 예시
```json
{
  "success": true,
  "data": {
    "deleted": true
  }
}
```

---

### 4.6 특정 발생일 완료 처리
**PATCH** `/api/events/:id/occurrences/:date/complete`

#### Path Params
- `id`: 이벤트 ID
- `date`: 발생일 (`YYYY-MM-DD`)

#### Request Body
```json
{
  "isCompleted": true
}
```

#### 설명
- 단일 일정 또는 반복 일정의 **특정 날짜 항목** 완료 상태를 저장한다.
- 내부적으로 `event_occurrences`에 upsert 한다.

#### 성공 응답 예시
```json
{
  "success": true,
  "data": {
    "eventId": "uuid",
    "occurrenceDate": "2026-03-18",
    "isCompleted": true
  }
}
```

---

### 4.7 선택 날짜 상세 조회 (선택 구현)
**GET** `/api/events/day?date=2026-03-17`

#### 설명
- 특정 날짜의 일정만 빠르게 가져오고 싶을 때 사용할 수 있다.
- `range` API로 대체 가능하므로 필수는 아님

## 5. 에러 코드 제안

- `VALIDATION_ERROR`
- `NOT_FOUND`
- `CONFLICT`
- `DB_ERROR`
- `INTERNAL_ERROR`

## 6. 상태 코드 규칙

- `200 OK`: 조회/수정 성공
- `201 Created`: 생성 성공
- `400 Bad Request`: 잘못된 요청
- `404 Not Found`: 대상 없음
- `409 Conflict`: 중복/충돌
- `500 Internal Server Error`: 서버 오류

## 7. 서버 내부 처리 규칙

### 범위 조회
1. `view`, `anchor` 검증
2. 범위 계산
3. 범위 내 표시 가능한 이벤트 시리즈 조회
4. 반복 일정 발생일 전개
5. 완료 상태 조합
6. occurrence DTO 반환

### 완료 처리
1. 발생일 유효성 검증
2. 해당 이벤트가 실제로 그 날짜에 발생 가능한지 검증
3. `event_occurrences` upsert
4. 최신 상태 반환

## 8. DTO 규칙

### 클라이언트에 전달할 occurrence DTO
반드시 아래 필드를 포함한다.

- `eventId`
- `title`
- `description`
- `occurrenceDate`
- `isRecurring`
- `isCompleted`

### 선택 필드
- `seriesId`
- `badgeText`
- `colorHex`

## 9. 버전 관리 원칙

MVP에서는 `/api/v1`를 도입하지 않아도 되지만,  
확장 가능성을 고려해 내부 코드 구조는 버전 분리가 가능하도록 둔다.

## 10. 보안 원칙

- API 요청에서 DB 연결 문자열을 절대 노출하지 않는다.
- 민감한 내부 오류 메시지는 클라이언트에 그대로 전달하지 않는다.
- SQL 쿼리는 반드시 파라미터 바인딩으로 실행한다.

## 11. 결론

PlanMate API의 핵심은 아래 두 가지다.

1. **원본 일정 CRUD**
2. **범위 조회 + 발생일 완료 상태 관리**

이 구조만 잘 지키면 캘린더형 일정 앱의 핵심 기능은 충분히 구현할 수 있다.
