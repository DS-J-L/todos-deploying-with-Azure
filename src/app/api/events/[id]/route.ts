import { AppError, handleRouteError } from "@/lib/api/errors";
import { jsonSuccess } from "@/lib/api/response";
import { deleteEvent, getEventDetail, updateEvent } from "@/services/event.service";
import { eventIdSchema, eventMutationSchema } from "@/lib/validation/event";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const eventId = eventIdSchema.parse(id);
    const event = await getEventDetail(eventId);

    if (!event) {
      throw new AppError("NOT_FOUND", "일정을 찾을 수 없습니다.", 404);
    }

    return jsonSuccess(event);
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const eventId = eventIdSchema.parse(id);
    const payload = eventMutationSchema.parse(await request.json());
    const result = await updateEvent(eventId, payload);
    return jsonSuccess(result);
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const eventId = eventIdSchema.parse(id);
    const result = await deleteEvent(eventId);
    return jsonSuccess(result);
  } catch (error) {
    return handleRouteError(error);
  }
}
