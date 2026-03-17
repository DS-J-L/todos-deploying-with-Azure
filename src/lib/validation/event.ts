import { z } from "zod";

import { compareIsoDate } from "@/lib/date/range";

const isoDateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "날짜는 YYYY-MM-DD 형식이어야 합니다.");

export const calendarViewSchema = z.enum(["day", "week", "month"]);
export const recurrenceTypeSchema = z.enum(["none", "daily", "weekly", "monthly"]);

export const eventIdSchema = z.string().uuid("유효한 이벤트 ID가 아닙니다.");
export const occurrenceDateSchema = isoDateSchema;

export const eventMutationSchema = z
  .object({
    title: z.string().trim().min(1, "제목은 필수입니다.").max(120, "제목은 120자 이하여야 합니다."),
    description: z
      .string()
      .trim()
      .max(1000, "설명은 1000자 이하여야 합니다.")
      .optional()
      .transform((value) => (value && value.length > 0 ? value : null))
      .default(null),
    startDate: isoDateSchema,
    recurrenceType: recurrenceTypeSchema,
    recurrenceInterval: z.coerce.number().int().min(1, "반복 간격은 1 이상이어야 합니다.").default(1),
    recurrenceDaysOfWeek: z
      .array(z.coerce.number().int().min(0).max(6))
      .max(7, "요일 선택은 최대 7개까지 가능합니다.")
      .default([]),
    recurrenceUntil: isoDateSchema.nullable().optional().default(null)
  })
  .superRefine((value, context) => {
    if (value.recurrenceType === "weekly" && value.recurrenceDaysOfWeek.length === 0) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "매주 반복은 최소 1개 이상의 요일이 필요합니다.",
        path: ["recurrenceDaysOfWeek"]
      });
    }

    if (value.recurrenceType !== "weekly" && value.recurrenceDaysOfWeek.length > 0) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "요일 선택은 매주 반복에서만 사용할 수 있습니다.",
        path: ["recurrenceDaysOfWeek"]
      });
    }

    if (value.recurrenceUntil && compareIsoDate(value.recurrenceUntil, value.startDate) < 0) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "반복 종료일은 시작일보다 빠를 수 없습니다.",
        path: ["recurrenceUntil"]
      });
    }
  });

export const rangeQuerySchema = z.object({
  view: calendarViewSchema,
  anchor: isoDateSchema
});

export const completionMutationSchema = z.object({
  isCompleted: z.boolean()
});
