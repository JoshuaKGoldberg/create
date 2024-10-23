---
title: Testing Presets
---

:::danger
The `create` engine is very early stage.
Don't rely on it yet.
:::

The separate `create-testers` package includes testing utilities that provide mock data to a block under test.
For [Presets](../concepts/presets), a `testPreset` function is exported that is analogous to [`produceBlock`](../api/produce-block).

## Return

As with [`producePreset`](../api/produce-preset), `testPreset` returns a Promise for the Preset's [`Creation`](../runtime/creations).
Both [direct creations](../runtime/creations#direct-creations) and [indirect creations](../runtime/creations#indirect-creations) will be present.
