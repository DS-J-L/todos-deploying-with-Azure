import { randomUUID } from "crypto";

import sql from "mssql";

import { hasDatabaseConfig } from "@/lib/db/config";
import { getSqlPool } from "@/lib/db/sql";
import { readLocalStore, writeLocalStore } from "@/lib/server/localStore";
import type { OccurrenceStatusRecord } from "@/types/event";

export async function listCompletionStatesInRange(
  rangeStart: string,
  rangeEnd: string
): Promise<OccurrenceStatusRecord[]> {
  if (!hasDatabaseConfig()) {
    const store = await readLocalStore();
    return store.occurrences.filter(
      (item) => item.occurrenceDate >= rangeStart && item.occurrenceDate <= rangeEnd
    );
  }

  const pool = await getSqlPool();
  const result = await pool
    .request()
    .input("rangeStart", sql.Date, rangeStart)
    .input("rangeEnd", sql.Date, rangeEnd)
    .query(`
      SELECT event_id, occurrence_date, is_completed
      FROM dbo.event_occurrences
      WHERE occurrence_date BETWEEN @rangeStart AND @rangeEnd
    `);

  return result.recordset.map((row) => ({
    eventId: String(row.event_id),
    occurrenceDate:
      row.occurrence_date instanceof Date
        ? row.occurrence_date.toISOString().slice(0, 10)
        : String(row.occurrence_date).slice(0, 10),
    isCompleted: Boolean(row.is_completed)
  }));
}

export async function upsertOccurrenceCompletion(
  eventId: string,
  occurrenceDate: string,
  isCompleted: boolean
): Promise<OccurrenceStatusRecord> {
  if (!hasDatabaseConfig()) {
    const store = await readLocalStore();
    const existingIndex = store.occurrences.findIndex(
      (item) => item.eventId === eventId && item.occurrenceDate === occurrenceDate
    );

    const nextRecord = {
      eventId,
      occurrenceDate,
      isCompleted
    };

    if (existingIndex >= 0) {
      store.occurrences[existingIndex] = nextRecord;
    } else {
      store.occurrences.push(nextRecord);
    }

    await writeLocalStore(store);
    return nextRecord;
  }

  const pool = await getSqlPool();
  const result = await pool
    .request()
    .input("id", sql.UniqueIdentifier, randomUUID())
    .input("eventId", sql.UniqueIdentifier, eventId)
    .input("occurrenceDate", sql.Date, occurrenceDate)
    .input("isCompleted", sql.Bit, isCompleted)
    .query(`
      MERGE dbo.event_occurrences AS target
      USING (
        SELECT
          @eventId AS event_id,
          @occurrenceDate AS occurrence_date
      ) AS source
      ON target.event_id = source.event_id
        AND target.occurrence_date = source.occurrence_date
      WHEN MATCHED THEN
        UPDATE SET
          is_completed = @isCompleted,
          completed_at = CASE WHEN @isCompleted = 1 THEN SYSUTCDATETIME() ELSE NULL END,
          updated_at = SYSUTCDATETIME()
      WHEN NOT MATCHED THEN
        INSERT (id, event_id, occurrence_date, is_completed, completed_at)
        VALUES (
          @id,
          @eventId,
          @occurrenceDate,
          @isCompleted,
          CASE WHEN @isCompleted = 1 THEN SYSUTCDATETIME() ELSE NULL END
        )
      OUTPUT inserted.event_id, inserted.occurrence_date, inserted.is_completed;
    `);

  const row = result.recordset[0];

  return {
    eventId: String(row.event_id),
    occurrenceDate:
      row.occurrence_date instanceof Date
        ? row.occurrence_date.toISOString().slice(0, 10)
        : String(row.occurrence_date).slice(0, 10),
    isCompleted: Boolean(row.is_completed)
  };
}
