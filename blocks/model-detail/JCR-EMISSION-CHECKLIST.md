# Why JCR Properties May Not Be Emitted in HTML

When the model-detail block has values stored in AEM JCR (e.g. in CRXDE) but the delivered HTML only shows some of them (e.g. only `description` and `color`), the cause is on the **AEM / delivery side**: the Franklin block component turns JCR properties into the block’s table markup. If it doesn’t output a property, that property never appears in the HTML source.

Below are the most likely reasons and what to check.

---

## 1. Block was created with an older model (most common)

**Cause:** The block instance was added to the page when the block model had fewer fields (or different field names). AEM does **not** re-apply the latest `component-models.json` to existing block instances.

**What to do:**

- In the Universal Editor, **delete the existing model-detail block** from the page and **add a new Model Detail block**.
- Fill in the properties again (or rely on your client-side fallback that fetches from `.model.json` / script if you use it).
- Re-publish/sync the page.

**Reference:** [Updating the block component model and definition](https://experienceleaguecommunities.adobe.com/t5/edge-delivery-services/updating-the-block-component-model-and-definition/m-p/683601) – existing content does not automatically get the updated model; you must re-add the block.

---

## 2. `component-models.json` / `component-definition.json` not deployed or not in sync

**Cause:** The author/publish instance is using an older or different version of the block definition and model. Only the fields known to that version are persisted and rendered.

**What to check:**

- Ensure the **latest** `component-models.json` and `component-definition.json` (with all 9 model-detail fields) are on the branch that your pipeline deploys (e.g. `main`).
- Run `npm run build:json` if your project merges from block JSON into these files, then commit and deploy the built files.
- After deployment, **hard refresh** the Universal Editor (Ctrl+Shift+R / Cmd+Shift+R) or use an incognito window so it loads the new definitions.

---

## 3. `modelFields` in JCR out of date or wrong

**Cause:** The block’s JCR node has a multi-value property `modelFields` that can drive which properties are rendered. If it was set when the model had only two fields, the renderer might only emit those.

**What to check (CRXDE):**

- Open the block node, e.g.  
  `.../root/section/model_detail`
- Check the **`modelFields`** property (or similar). It should list all 9 names:  
  `product_id`, `model_name`, `body_type`, `fuel_type`, `comfort_level`, `price_range_tag`, `image_url`, `description`, `color`
- If it only lists two (e.g. `description`, `color`), that can explain only two rows in HTML. Fix by re-adding the block (see §1) or by correcting `modelFields` and re-publishing if your setup allows.

---

## 4. Publish / EDS pipeline not getting full content

**Cause:** The HTML is produced by a publish step or by EDS (e.g. helix-html2md or a proxy). If that step runs against a snapshot or branch that doesn’t have the full JCR state, or if cache serves old HTML, the emitted HTML will be incomplete.

**What to check:**

- Re-publish the page from AEM after ensuring the block has all 9 properties in JCR.
- If you use a proxy (e.g. `hlx:proxyUrl`), hit the **author** URL in the editor and the **publish/delivery** URL in another tab; compare whether both show the same block content.
- Check any caches (CDN, EDS cache) and invalidate or bypass cache for that page when testing.

---

## 5. Definition missing `model` or `key-value`

**Cause:** The block must have a `model` and, for key-value behavior, `"key-value": true` in the template so AEM renders it as a key-value table. If either is wrong, rendering can be incomplete or wrong.

**What to check:**

- In `component-definition.json` (or your block’s `_model-detail.json` definition), the block should have:
  - `"model": "model-detail"`
  - In `plugins.xwalk.page.template`: `"key-value": true`
- Your repo already has these; just ensure the **deployed** `component-definition.json` matches.

---

## 6. Resource type or block name mismatch

**Cause:** If the block’s `sling:resourceType` or the block name (e.g. class) doesn’t match what the Franklin block component expects, the component might not apply the key-value model correctly and only part of the properties may be emitted.

**What to check:**

- In JCR, the block node should have:
  - `sling:resourceType`: `core/franklin/components/block/v1/block`
  - Block name in markup: `model-detail` (so the div has `class="model-detail"`).
- Your definition uses `resourceType: "core/franklin/components/block/v1/block"` and id `model-detail`; ensure the deployed definition and the page markup match.

---

## Summary checklist

| Check | Action |
|-------|--------|
| Block created with old model | Delete block on page, add new Model Detail block, re-enter data, re-publish. |
| Definitions not deployed | Deploy latest `component-models.json` and `component-definition.json` (from correct branch), hard refresh UE. |
| `modelFields` in JCR | In CRXDE, ensure `modelFields` lists all 9 field names; if not, re-add block or fix and re-publish. |
| Publish/cache | Re-publish page; check author vs publish/delivery URL; clear caches if needed. |
| Definition correctness | Confirm deployed definition has `model` and `key-value: true` and correct `resourceType`. |

The client-side fallback in `model-detail.js` (fetching from `.model.json` or from script / `data-block-data`) can still show all details even when only some properties are emitted in the HTML, but to get **all properties in the HTML source**, the fix has to be on the AEM/delivery side (model sync, re-add block, deploy, publish).
