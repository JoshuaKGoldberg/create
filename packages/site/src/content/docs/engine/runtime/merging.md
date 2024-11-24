---
description: "How the engine merges Block Addons at runtime."
title: Merging
---

[Blocks](../concepts/blocks) act as synchronous functions with optional metadata in the form of [Addons](../concepts/blocks#addons).
Blocks don't know what order they're run in or what other Blocks exist.
They only know to map inputs to output [Creations](./creations).

At runtime, the `create` engine will often need to re-run Blocks continuously as they receive Addons from other Blocks.
Blocks will be re-run whenever other Blocks signal new Addon data to them that they haven't yet seen.
This allows Blocks to not need any explicit indication of what order to run in.

The steps [`runPreset`](../apis/producers#producepreset) takes internally are:

1. Create a queue of Blocks to be run, starting with all defined in the Preset
2. For each Block in the queue:
   1. Get the Creation from the Block, passing any current known Args
   2. Store that Block's Creation
   3. If the Block specified new addons for any other Blocks:
      1. Add those Blocks to the queue of Blocks to re-run
3. Merge all Block Creations together
