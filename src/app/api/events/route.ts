import { handleRouteError } from "@/lib/api/errors";
import { jsonSuccess } from "@/lib/api/response";
import { createEvent } from "@/services/event.service";
import { eventMutationSchema } from "@/lib/validation/event";

export async function POST(request: Request) {
  try {
    const payload = eventMutationSchema.parse(await request.json());
    const result = await createEvent(payload);
    return jsonSuccess(result, { status: 201 });
  } catch (error) {
    return handleRouteError(error);
  }
}
