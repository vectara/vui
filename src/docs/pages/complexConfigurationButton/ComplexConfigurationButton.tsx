import { BiCog } from "react-icons/bi";
import { VuiComplexConfigurationButton, VuiSpacer, VuiStatList } from "../../../lib";

export const ComplexConfigurationButton = () => {
  return (
    <>
      <VuiComplexConfigurationButton title="Title only" onClick={() => console.log("clicked")} />

      <VuiSpacer size="m" />

      <VuiComplexConfigurationButton
        title="Title with description"
        description="A secondary line of text describing the current selection."
        onClick={() => console.log("clicked")}
      />

      <VuiSpacer size="m" />

      <VuiComplexConfigurationButton
        title="With a footer"
        description="Pass any node into the footer slot."
        footer={
          <VuiStatList
            size="xs"
            stats={[
              { name: "Tokens", value: "4096" },
              { name: "Temperature", value: "0.7" }
            ]}
          />
        }
        onClick={() => console.log("clicked")}
      />

      <VuiSpacer size="m" />

      <VuiComplexConfigurationButton
        title="Custom icon"
        description="Override the default pencil with any icon."
        icon={<BiCog />}
        onClick={() => console.log("clicked")}
      />

      <VuiSpacer size="m" />

      <VuiComplexConfigurationButton
        title="Disabled"
        description="Click is suppressed and hover styling is disabled."
        isDisabled
        onClick={() => console.log("clicked")}
      />
    </>
  );
};
