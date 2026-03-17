/*
  PlanMate Azure SQL schema
  Apply this file once after creating the Azure SQL Database.
*/

IF OBJECT_ID(N'dbo.event_occurrences', N'U') IS NOT NULL
BEGIN
  DROP TABLE dbo.event_occurrences;
END;
GO

IF OBJECT_ID(N'dbo.events', N'U') IS NOT NULL
BEGIN
  DROP TABLE dbo.events;
END;
GO

CREATE TABLE dbo.events (
  id UNIQUEIDENTIFIER NOT NULL
    CONSTRAINT PK_events PRIMARY KEY
    DEFAULT NEWID(),

  title NVARCHAR(120) NOT NULL,
  description NVARCHAR(1000) NULL,

  start_date DATE NOT NULL,

  recurrence_type NVARCHAR(20) NOT NULL
    CONSTRAINT CK_events_recurrence_type
    CHECK (recurrence_type IN ('none', 'daily', 'weekly', 'monthly')),

  recurrence_interval INT NOT NULL
    CONSTRAINT DF_events_recurrence_interval DEFAULT 1
    CONSTRAINT CK_events_recurrence_interval CHECK (recurrence_interval >= 1),

  recurrence_days_of_week NVARCHAR(20) NULL,
  recurrence_until DATE NULL,

  is_archived BIT NOT NULL
    CONSTRAINT DF_events_is_archived DEFAULT 0,

  created_at DATETIME2(0) NOT NULL
    CONSTRAINT DF_events_created_at DEFAULT SYSUTCDATETIME(),

  updated_at DATETIME2(0) NOT NULL
    CONSTRAINT DF_events_updated_at DEFAULT SYSUTCDATETIME(),

  deleted_at DATETIME2(0) NULL
);
GO

CREATE TABLE dbo.event_occurrences (
  id UNIQUEIDENTIFIER NOT NULL
    CONSTRAINT PK_event_occurrences PRIMARY KEY
    DEFAULT NEWID(),

  event_id UNIQUEIDENTIFIER NOT NULL,
  occurrence_date DATE NOT NULL,

  is_completed BIT NOT NULL
    CONSTRAINT DF_event_occurrences_is_completed DEFAULT 0,

  completed_at DATETIME2(0) NULL,

  created_at DATETIME2(0) NOT NULL
    CONSTRAINT DF_event_occurrences_created_at DEFAULT SYSUTCDATETIME(),

  updated_at DATETIME2(0) NOT NULL
    CONSTRAINT DF_event_occurrences_updated_at DEFAULT SYSUTCDATETIME(),

  CONSTRAINT FK_event_occurrences_event_id
    FOREIGN KEY (event_id)
    REFERENCES dbo.events(id),

  CONSTRAINT UQ_event_occurrences_event_date
    UNIQUE (event_id, occurrence_date)
);
GO

CREATE INDEX IX_events_start_date
  ON dbo.events(start_date);
GO

CREATE INDEX IX_events_recurrence
  ON dbo.events(recurrence_type, recurrence_until);
GO

CREATE INDEX IX_events_deleted_archived
  ON dbo.events(deleted_at, is_archived);
GO

CREATE INDEX IX_event_occurrences_lookup
  ON dbo.event_occurrences(event_id, occurrence_date);
GO

