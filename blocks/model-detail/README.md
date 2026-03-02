# Model Detail Block

Car model detail block with authoring fields: productId, modelName, bodyType, fuelType, comfortLevel, priceRangeTag, imageUrl, description, color.

## If authoring fields don’t show in Universal Editor

The editor loads `component-definition.json` and `component-models.json` from your **deployed** project. If you don’t see the 9 fields when you select the block and open the properties panel:

1. **Deploy/sync** – Push your repo (including updated `component-definition.json` and `component-models.json`) and ensure the AEM author instance is using this deployment (e.g. via your pipeline or “Sync with AEM”).
2. **Hard refresh** – In the author tab, use Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac), or try an incognito/private window.
3. **Open properties** – Click the Model Detail block, then open the **properties** (⋮ menu or properties icon) in the right rail; the form is there, not inline on the page.
4. **Rebuild JSON (optional)** – From project root run:  
   `npm run build:json`  
   Then commit and deploy the updated `component-models.json` and `component-definition.json` if your setup uses the built files.

The block reads values from both key-value config and row order (row 1 = productId, row 2 = modelName, …), so it works with different content structures.
