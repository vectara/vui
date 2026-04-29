## `main`

**Bug fixes**

...

**Non-breaking changes**

- `VuiToggle` now renders an indeterminate "unset" state when `checked` is `undefined` (knob centered, lighter background). Existing call sites that pass an explicit `boolean` are unaffected; sites that previously omitted `checked` and relied on it rendering as off will now render as indeterminate.

**Breaking changes**

...
