import { handleRouteError } from "@/lib/api/errors";
import { jsonSuccess } from "@/lib/api/response";
import { getOccurrencesForRange } from "@/services/event.service";
import { rangeQuerySchema } from "@/lib/validation/event";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const query = rangeQuerySchema.parse({
      view: url.searchParams.get("view"),
      anchor: url.searchParams.get("anchor")
    });

    const result = await getOccurrencesForRange(query.view, query.anchor);
    return jsonSuccess(result);
  } catch (error) {
    return handleRouteError(error);
  }
}
