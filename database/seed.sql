/*
  Optional sample data for local Azure SQL verification.
  Run after database/schema.sql.
*/

INSERT INTO dbo.events (
  title,
  description,
  start_date,
  recurrence_type,
  recurrence_interval,
  recurrence_days_of_week,
  recurrence_until
)
VALUES
  (
    N'알고리즘 과제',
    N'정렬 파트 복습 후 제출',
    CAST(GETDATE() AS DATE),
    N'none',
    1,
    NULL,
    NULL
  ),
  (
    N'운동',
    N'주 3회 루틴 유지',
    CAST(GETDATE() AS DATE),
    N'weekly',
    1,
    N'1,3,5',
    DATEADD(DAY, 30, CAST(GETDATE() AS DATE))
  );
GO

