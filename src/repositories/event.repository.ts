import { randomUUID } from "crypto";

import sql from "mssql";

import { hasDatabaseConfig } from "@/lib/db/config";
import { getSqlPool } from "@/lib/db/sql";
import { readLocalStore, writeLocalStore } from "@/lib/server/localStore";
import type { EventMutationInput, EventRecord } from "@/types/event";

function formatDateValue(value: unknown) {
  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }

  if (typeof value === "string") {
    return value.slice(0, 10);
  }

  return "";
}

function parseDaysOfWeek(value: unknown) {
  if (typeof value !== "string" || value.trim().length === 0) {
    return [];
  }

  return value
    .split(",")
    .map((item) => Number(item.trim()))
    .filter((item) => Number.isInteger(item) && item >= 0 && item <= 6);
}

function toDaysOfWeekString(days: number[]) {
  return days.join(",");
}

function mapEventRow(row: Record<string, unknown>): EventRecord {
  return {
    id: String(row.id),
    title: String(row.title),
    description: row.description ? String(row.description) : null,
    startDate: formatDateValue(row.start_date),
    recurrenceType: String(row.recurrence_type) as EventRecord["recurrenceType"],
    recurrenceInterval: Number(row.recurrence_interval),
    recurrenceDaysOfWeek: parseDaysOfWeek(row.recurrence_days_of_week),
    recurrenceUntil: row.recurrence_until ? formatDateValue(row.recurrence_until) : null,
    isArchived: Boolean(row.is_archived),
    deletedAt: row.deleted_at ? String(row.deleted_at) : null,
    createdAt: row.created_at ? String(row.created_at) : undefined,
    updatedAt: row.updated_at ? String(row.updated_at) : undefined
  };
}

export async function listEventsOverlappingRange(rangeStart: string, rangeEnd: string): Promise<EventRecord[]> {
  if (!hasDatabaseConfig()) {
    const store = await readLocalStore();

    return store.events.filter(
      (event) =>
        !event.deletedAt &&
        !event.isArchived &&
        event.startDate <= rangeEnd &&
        (event.recurrenceType === "none" || event.recurrenceUntil === null || event.recurrenceUntil >= rangeStart)
    );
  }

  const pool = await getSqlPool();
  const result = await pool
    .request()
    .input("rangeStart", sql.Date, rangeStart)
    .input("rangeEnd", sql.Date, rangeEnd)
    .query(`
      SELECT
        id,
        title,
        description,
        start_date,
        recurrence_type,
        recurrence_interval,
        recurrence_days_of_week,
        recurrence_until,
        is_archived,
        deleted_at,
        created_at,
        updated_at
      FROM dbo.events
      WHERE deleted_at IS NULL
        AND is_archived = 0
        AND start_date <= @rangeEnd
        AND (
          recurrence_type = 'none'
          OR recurrence_until IS NULL
          OR recurrence_until >= @rangeStart
        )
      ORDER BY start_date ASC, created_at ASC
    `);

  return result.recordset.map((row) => mapEventRow(row as Record<string, unknown>));
}

export async function getEventById(id: string): Promise<EventRecord | null> {
  if (!hasDatabaseConfig()) {
    const store = await readLocalStore();
    return store.events.find((event) => event.id === id && !event.deletedAt) ?? null;
  }

  const pool = await getSqlPool();
  const result = await pool
    .request()
    .input("id", sql.UniqueIdentifier, id)
    .query(`
      SELECT
        id,
        title,
        description,
        start_date,
        recurrence_type,
        recurrence_interval,
        recurrence_days_of_week,
        recurrence_until,
        is_archived,
        deleted_at,
        created_at,
        updated_at
      FROM dbo.events
      WHERE id = @id
        AND deleted_at IS NULL
    `);

  const row = result.recordset[0];
  return row ? mapEventRow(row as Record<string, unknown>) : null;
}

export async function createEvent(payload: EventMutationInput): Promise<{ id: string }> {
  if (!hasDatabaseConfig()) {
    const store = await readLocalStore();
    const id = randomUUID();

    store.events.push({
      id,
      ...payload,
      isArchived: false,
      deletedAt: null
    });

    await writeLocalStore(store);
    return { id };
  }

  const pool = await getSqlPool();
  const result = await pool
    .request()
    .input("title", sql.NVarChar(120), payload.title)
    .input("description", sql.NVarChar(1000), payload.description)
    .input("startDate", sql.Date, payload.startDate)
    .input("recurrenceType", sql.NVarChar(20), payload.recurrenceType)
    .input("recurrenceInterval", sql.Int, payload.recurrenceInterval)
    .input("recurrenceDaysOfWeek", sql.NVarChar(20), toDaysOfWeekString(payload.recurrenceDaysOfWeek) || null)
    .input("recurrenceUntil", sql.Date, payload.recurrenceUntil)
    .query(`
      INSERT INTO dbo.events (
        title,
        description,
        start_date,
        recurrence_type,
        recurrence_interval,
        recurrence_days_of_week,
        recurrence_until
      )
      OUTPUT inserted.id
      VALUES (
        @title,
        @description,
        @startDate,
        @recurrenceType,
        @recurrenceInterval,
        @recurrenceDaysOfWeek,
        @recurrenceUntil
      )
    `);

  return { id: String(result.recordset[0].id) };
}

export async function updateEvent(id: string, payload: EventMutationInput): Promise<{ updated: boolean }> {
  if (!hasDatabaseConfig()) {
    const store = await readLocalStore();
    const eventIndex = store.events.findIndex((event) => event.id === id && !event.deletedAt);

    if (eventIndex < 0) {
      return { updated: false };
    }

    store.events[eventIndex] = {
      ...store.events[eventIndex],
      ...payload
    };

    await writeLocalStore(store);
    return { updated: true };
  }

  const pool = await getSqlPool();
  const result = await pool
    .request()
    .input("id", sql.UniqueIdentifier, id)
    .input("title", sql.NVarChar(120), payload.title)
    .input("description", sql.NVarChar(1000), payload.description)
    .input("startDate", sql.Date, payload.startDate)
    .input("recurrenceType", sql.NVarChar(20), payload.recurrenceType)
    .input("recurrenceInterval", sql.Int, payload.recurrenceInterval)
    .input("recurrenceDaysOfWeek", sql.NVarChar(20), toDaysOfWeekString(payload.recurrenceDaysOfWeek) || null)
    .input("recurrenceUntil", sql.Date, payload.recurrenceUntil)
    .query(`
      UPDATE dbo.events
      SET
        title = @title,
        description = @description,
        start_date = @startDate,
        recurrence_type = @recurrenceType,
        recurrence_interval = @recurrenceInterval,
        recurrence_days_of_week = @recurrenceDaysOfWeek,
        recurrence_until = @recurrenceUntil,
        updated_at = SYSUTCDATETIME()
      WHERE id = @id
        AND deleted_at IS NULL
    `);

  return { updated: result.rowsAffected[0] > 0 };
}

export async function softDeleteEvent(id: string): Promise<{ deleted: boolean }> {
  if (!hasDatabaseConfig()) {
    const store = await readLocalStore();
    const eventIndex = store.events.findIndex((event) => event.id === id && !event.deletedAt);

    if (eventIndex < 0) {
      return { deleted: false };
    }

    store.events[eventIndex] = {
      ...store.events[eventIndex],
      deletedAt: new Date().toISOString()
    };

    await writeLocalStore(store);
    return { deleted: true };
  }

  const pool = await getSqlPool();
  const result = await pool
    .request()
    .input("id", sql.UniqueIdentifier, id)
    .query(`
      UPDATE dbo.events
      SET
        deleted_at = SYSUTCDATETIME(),
        updated_at = SYSUTCDATETIME()
      WHERE id = @id
        AND deleted_at IS NULL
    `);

  return { deleted: result.rowsAffected[0] > 0 };
}
