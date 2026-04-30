import { VuiKvTable } from "../../../lib";

export const Simple = () => {
  return (
    <VuiKvTable
      label="Span details"
      items={{
        span_id: "b7ad6b7169203331",
        parent_span_id: "–",
        trace_id: "0af7651916cd43dd8448eb211c80319c",
        status: "ok",
        started_at: "Apr 22, 14:32:11 UTC",
        duration: "12.48s",
        step_name: "research",
        event_id: "evt_9a1f"
      }}
    />
  );
};
