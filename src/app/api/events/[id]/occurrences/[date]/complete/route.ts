import { AppError, handleRouteError } from "@/lib/api/errors";
import { jsonSuccess } from "@/lib/api/response";
import { completeOccurrence, getEventDetail } from "@/services/event.service";
import {
  completionMutationSchema,
  eventIdSchema,
  occurrenceDateSchema
} from "@/lib/validation/event";

type RouteContext = {
  params: Promise<{
    id: string;
    date: string;
  }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { id, date } = await context.params;
    const eventId = eventIdSchema.parse(id);
    const occurrenceDate = occurrenceDateSchema.parse(date);
    const payload = completionMutationSchema.parse(await request.json());
    const event = await getEventDetail(eventId);

    if (!event) {
      throw new AppError("NOT_FOUND", "일정을 찾을 수 없습니다.", 404);
    }

    const result = await completeOccurrence(event, occurrenceDate, payload.isCompleted);
    return jsonSuccess(result);
  } catch (error) {
    return handleRouteError(error);
  }
}
