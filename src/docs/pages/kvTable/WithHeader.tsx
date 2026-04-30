import { VuiBadge, VuiKvTable } from "../../../lib";

export const WithHeader = () => {
  return (
    <VuiKvTable
      label="LLM call attributes"
      keyHeader="Attribute"
      valueHeader="Value"
      items={[
        { key: "model", value: "claude-sonnet-4-5" },
        { key: "provider_name", value: "anthropic" },
        { key: "input_tokens", value: "18432" },
        { key: "output_tokens", value: "2104" },
        { key: "cache_read_input_tokens", value: "12000" },
        { key: "temperature", value: "0.2" },
        { key: "max_tokens", value: "4096" },
        {
          key: "status",
          value: (
            <VuiBadge color="success">ok</VuiBadge>
          )
        }
      ]}
    />
  );
};
