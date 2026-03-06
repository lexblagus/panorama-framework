# Mr. Robot **Jobs** definition

Update the `jobs.json` file located at `/Users/blagus/Gallery/Work/Blagus/Robot/repo-02/jobs.json`. Replace its current contents with the following:

1. **Master Image Job:**

   * Set the `saveAs` path to `/Users/blagus/Gallery/Photos/Panorama/05 Global Megacity Panorama/repo/outputs/generated/009-05-master.png`.
   * Use the prompt from `prompts/master.md`:
      
     * Include all lines that starts with `>` but do not include the `>  ` itself.
     * Replace the actual newlines in the prompt with `\n` (ensure proper escaping of special characters).
     * Add the block below the part **For Central Master Reference Image generation
   * Set `active` to `true`, `generateImage` to `true`, and `model` to `Thinking`.
   * Set `uploads` to an empty array (no files for the master image).
   * Set `name` to `Master`.

2. **Tile Jobs (5, 9, 1, 7, and 3 in that order):**

   * For each tile job:

     * Set `name` to `Tile XX`.
     * Set `active` to `true`, `generateImage` to `true`, and `model` to `Thinking`.
     * Use the prompt from the corresponding `prompts/tile-XX.md` file.

       * Include all lines that starts with `>` but do not include the `>  ` itself.
       * Replace actual newlines in the prompt with `\n` (ensure proper escaping).
       * Include the prompt lines from the sections `Header` and `Generator prompt (…)` but not temporary or optional blocks.
	   * Change the filenames referenced in the header upload references to the actual filenames provided in the uploads section bellow.
     * Add the `saveAs` path for each tile:

       * Tile 5: `/Users/blagus/Gallery/Photos/Panorama/05 Global Megacity Panorama/repo/outputs/generated/009-06a-tile5.png`
       * Tile 9: `/Users/blagus/Gallery/Photos/Panorama/05 Global Megacity Panorama/repo/outputs/generated/009-07a-tile9.png`
       * Tile 1: `/Users/blagus/Gallery/Photos/Panorama/05 Global Megacity Panorama/repo/outputs/generated/009-08a-tile1.png`
       * Tile 7: `/Users/blagus/Gallery/Photos/Panorama/05 Global Megacity Panorama/repo/outputs/generated/009-09a-tile7.png`
       * Tile 3: `/Users/blagus/Gallery/Photos/Panorama/05 Global Megacity Panorama/repo/outputs/generated/009-10a-tile3.png`
     * Add the appropriate **R1 reference image paths** under the `uploads` field for each tile:

       * Tile 5: `/Users/blagus/Gallery/Photos/Panorama/05 Global Megacity Panorama/repo/refs/R1/130-tile5.png`
       * Tile 9: `/Users/blagus/Gallery/Photos/Panorama/05 Global Megacity Panorama/repo/refs/R1/132-tile9.png`
       * Tile 1: `/Users/blagus/Gallery/Photos/Panorama/05 Global Megacity Panorama/repo/refs/R1/128-tile1.png`
       * Tile 7: `/Users/blagus/Gallery/Photos/Panorama/05 Global Megacity Panorama/repo/refs/R1/138-tile7-tarmak.png`
       * Tile 3: `/Users/blagus/Gallery/Photos/Panorama/05 Global Megacity Panorama/repo/refs/R1/129-tiles2to4.png`
     * For any **central master reference**, use `/Users/blagus/Gallery/Photos/Panorama/05 Global Megacity Panorama/repo/outputs/generated/009-05-master.png`.
     * Add the appropriate **Tile 5 ruler image** in the the `uploads` when required (not pressent in tile 5): `/Users/blagus/Gallery/Photos/Panorama/05 Global Megacity Panorama/repo/outputs/generated/009-06a-tile5.png` as the ruler image upload.
	 * Please respect the upload array order as the prompt states.

3. **Seam Bridge:**

   * If the seam bridge is needed, declare it as **not provided** in the job prompt filename and do **not** include it in the `uploads` list.

**Review:**

* The final `jobs.json` file should not include any headers or the `>` character, only the relevant content formatted correctly.
* All jobs must include the required fields:

  * `name`: the job name (e.g., tile number or master)
  * `active`: `true`
  * `model`: `"Thinking"`
  * `generateImage`: `true`
  * `uploads`: an array with the appropriate file paths (may be empty or absent if no files for master)
  * `prompt`: as compiled from the respective prompt files
  * `saveAs`: as specified above
  
* Please review if the referenced files in `/Users/blagus/Gallery/Photos/Panorama/05 Global Megacity Panorama/repo/refs/` actually exist and report missing files.
