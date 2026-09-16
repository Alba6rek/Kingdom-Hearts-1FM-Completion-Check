/*
===============================================================================
KINGDOM HEARTS FINAL MIX COMPLETION ANALYZER - PAGE CONTROLLER
===============================================================================

The page is divided into:

    Game Status
        Always visible.

    Main
    Essentials
    Journal
    Synthesis
    Collectable
    Extra
        User-selectable analyzer tabs.

    Research Data
        Optional reverse-engineering panel.

Each list inside the analyzer is a <details> element, which means it can be
expanded or minimized independently.
*/

require("../css/style.css");

import "core-js";
import "regenerator-runtime/runtime.js";

import {
  ProcessKH1File
} from "./LoadSaveFile.js";

import {
  KH1CheckCompletion
} from "./KH1CheckCompletion.js";

import KH1_CONTENT from "./kh1-content.js";

import KH1_DICTIONARY from "./kh1-dictionary.js";

import {
  SetStatus,
  DownloadJSON
} from "./page-functions.js";

const fileInput =
  document.getElementById(
    "save-area-file"
  );

const fileLabel =
  document.getElementById(
    "file-input-label"
  );

const generated =
  document.getElementById(
    "generated"
  );

const controls =
  document.getElementById(
    "analyzer-controls"
  );

const slotSelect =
  document.getElementById(
    "slot-select"
  );

const spoilersCheckbox =
  document.getElementById(
    "checkbox-spoilers"
  );

const researchCheckbox =
  document.getElementById(
    "checkbox-research"
  );

const researchPanel =
  document.getElementById(
    "research-panel"
  );

const researchSummaryView =
  document.getElementById(
    "research-summary-view"
  );

const rawJsonView =
  document.getElementById(
    "raw-json-view"
  );

const rawOutput =
  document.getElementById(
    "save-area"
  );

const researchSummaryTab =
  document.getElementById(
    "research-summary-tab"
  );

const rawJsonTab =
  document.getElementById(
    "raw-json-tab"
  );

const copyButton =
  document.getElementById(
    "copy-json"
  );

const downloadButton =
  document.getElementById(
    "download-json"
  );

const saveLocationInput =
  document.getElementById(
    "save-location-input"
  );

const saveLocationTooltip =
  saveLocationInput.closest(
    ".tooltip"
  );

const scrollButton =
  document.getElementById(
    "scroll-up-button"
  );

let currentSave =
  null;

let activeAnalyzerTab =
  "main";

/* ---------------------------------------------------------------------------
   Generic helpers
--------------------------------------------------------------------------- */

function EscapeHTML(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function Percent(
  current,
  target
) {
  if (!target) {
    return 0;
  }

  return Math.min(
    100,
    Math.round(
      current / target * 100
    )
  );
}

function EntryState(
  current,
  target
) {
  if (
    current >= target
  ) {
    return "complete";
  }

  if (
    current > 0
  ) {
    return "partial";
  }

  return "missing";
}

function StatusSymbol(state) {
  if (
    state === "complete"
  ) {
    return "✓";
  }

  if (
    state === "partial"
  ) {
    return "◐";
  }

  if (
    state === "missing"
  ) {
    return "✕";
  }

  if (
    state === "unknown"
  ) {
    return "?";
  }

  return "•";
}

/*
 * External guide links now use KHGuides.com.
 *
 * Many entries have an exact category/page URL in kh1-content.js.
 * If an item does not yet have a specific KHGuides URL, use the KHGuides
 * Kingdom Hearts section as the fallback instead of KHWiki.
 */
function KHGuidesUrl() {
  return "https://www.khguides.com/";
}

function ResolveUrl(
  name,
  url = ""
) {
  /*
   * `name` is kept in the signature because BuildExternalName() passes it,
   * and a future version can use it for more detailed URL mapping.
   */
  void name;

  return (
    url ||
    KHGuidesUrl()
  );
}

function SpoilerText(
  text,
  shouldBlur = true
) {
  const blurred =
    shouldBlur &&
    !spoilersCheckbox.checked;

  return (
    `<span class="spoiler-text${blurred ? " blurred" : ""}">` +
    `${EscapeHTML(text)}` +
    "</span>"
  );
}

function BuildExternalName(
  name,
  url,
  spoiler
) {
  const content =
    spoiler
      ? SpoilerText(name)
      : EscapeHTML(name);

  const resolvedUrl =
    ResolveUrl(
      name,
      url
    );

  return `
    <a
      class="entry-link"
      href="${EscapeHTML(resolvedUrl)}"
      target="_blank"
      rel="noopener noreferrer"
      title="Open external information for ${EscapeHTML(name)}"
    >
      ${content}
    </a>
  `;
}

function BuildEntry({
  name,
  value = "",
  description = "",
  hint = "",
  state = "info",
  spoiler = null,
  url = "",
  external = false
}) {
  /*
   * Completion entries should be spoiler-safe by default.
   *
   * A caller can still explicitly pass:
   *   spoiler: false
   * for labels that are intentionally always visible (for example postcard
   * sequence numbers).
   */
  const resolvedSpoiler =
    spoiler === null
      ? (
          state === "missing" ||
          state === "partial"
        )
      : Boolean(spoiler);

  const nameHtml =
    external
      ? BuildExternalName(
          name,
          url,
          resolvedSpoiler
        )
      : (
          resolvedSpoiler
            ? SpoilerText(name)
            : EscapeHTML(name)
        );

  return `
    <div class="single-entry ${state}">
      <span class="entry-status">${StatusSymbol(state)}</span>

      <div class="entry-main">
        <span class="entry-name">
          ${nameHtml}
        </span>

        ${
          description
            ? `<span class="entry-description">${EscapeHTML(description)}</span>`
            : ""
        }

        ${
          hint
            ? `
              <span
                class="entry-hint"
                tabindex="0"
                aria-label="Hint. Hover or focus to reveal the hint text."
              >
                <strong class="hint-label">Hint:</strong>
                <span class="hint-text">
                  ${EscapeHTML(hint)}
                </span>
              </span>
            `
            : ""
        }
      </div>

      ${
        value !== ""
          ? `<span class="entry-value">${EscapeHTML(value)}</span>`
          : ""
      }
    </div>
  `;
}

function BuildCollapsibleSection({
  title,
  body,
  description = "",
  summaryRight = "",
  open = true,
  sectionClass = ""
}) {
  return `
    <details
      class="analyzer-section collapsible-section ${sectionClass}"
      ${open ? "open" : ""}
    >
      <summary class="collapsible-summary">
        <span class="collapsible-title">
          ${EscapeHTML(title)}
        </span>

        ${
          summaryRight
            ? `<span class="collapsible-summary-right">${EscapeHTML(summaryRight)}</span>`
            : ""
        }
      </summary>

      <div class="collapsible-content">
        ${
          description
            ? `<p class="section-description">${EscapeHTML(description)}</p>`
            : ""
        }

        ${body}
      </div>
    </details>
  `;
}

function BuildProgressSection(
  title,
  current,
  target,
  body,
  description = "",
  open = true
) {
  const percent =
    Percent(
      current,
      target
    );

  const state =
    EntryState(
      current,
      target
    );

  const content = `
    <div class="progress-track">
      <div
        class="progress-fill ${state === "complete" ? "complete" : ""}"
        style="width:${percent}%"
      ></div>
    </div>

    <div class="section-block">
      ${body}
    </div>
  `;

  return BuildCollapsibleSection({
    title,
    body:
      content,
    description,
    summaryRight:
      `${current}/${target} · ${percent}%`,
    open
  });
}

function GroupBy(
  array,
  keyName
) {
  return array.reduce(
    (groups, item) => {
      const key =
        item[keyName];

      if (!groups[key]) {
        groups[key] =
          [];
      }

      groups[key].push(
        item
      );

      return groups;
    },
    {}
  );
}

/* ---------------------------------------------------------------------------
   Current slot / item ownership
--------------------------------------------------------------------------- */

function GetSelectedSlot() {
  if (
    !currentSave ||
    currentSave.slots.length === 0
  ) {
    return null;
  }

  if (
    slotSelect.value === "all"
  ) {
    return currentSave.slots[
      currentSave.slots.length - 1
    ];
  }

  const slotNumber =
    Number(
      slotSelect.value
    );

  return (
    currentSave.slots.find(
      slot =>
        slot.slot === slotNumber
    ) ??
    currentSave.slots[
      currentSave.slots.length - 1
    ]
  );
}

function GetSelectedJSON() {
  if (!currentSave) {
    return null;
  }

  if (
    slotSelect.value === "all"
  ) {
    return currentSave;
  }

  return GetSelectedSlot();
}

function GetItemOwnership(
  slot,
  itemId
) {
  const inventoryItem =
    slot.inventory.find(
      item =>
        item.itemId === itemId
    );

  const equippedBy =
    slot.characters
      .filter(
        character =>
          character.weapon
            ?.id === itemId
      )
      .map(
        character =>
          character.name
      );

  return {
    owned:
      Boolean(
        inventoryItem ||
        equippedBy.length
      ),

    quantity:
      inventoryItem
        ?.quantity ?? 0,

    equippedBy
  };
}

function OwnershipLabel(
  ownership
) {
  if (
    !ownership.owned
  ) {
    return "Missing";
  }

  if (
    ownership.equippedBy.length
  ) {
    return (
      "Owned · Equipped by " +
      ownership.equippedBy.join(", ")
    );
  }

  return "Owned";
}

function ResolveCompletionSource(
  slot,
  source
) {
  if (!source) {
    return {
      known: false,
      complete: null
    };
  }

  if (
    source.type ===
    "completionBoolean"
  ) {
    return {
      known: true,
      complete:
        Boolean(
          slot.completion[
            source.key
          ]
        )
    };
  }

  if (
    source.type ===
    "report"
  ) {
    return {
      known: true,
      complete:
        slot.completion
          .reports
          .reports
          .includes(
            source.report
          )
    };
  }

  if (
    source.type ===
    "journalCharacter"
  ) {
    const entry =
      slot.completion
        .journalCharacters
        ?.entries
        ?.[source.key];

    return {
      known:
        Boolean(entry) &&
        entry.found !== null,

      complete:
        entry
          ? entry.found
          : null,

      data:
        entry ?? null
    };
  }

  if (
    source.type ===
    "acreWoodMinigame"
  ) {
    const entry =
      slot.completion
        .acreWoodMinigames
        ?.minigames
        ?.[source.key];

    return {
      known:
        Boolean(entry),

      complete:
        entry
          ? entry.complete
          : null,

      data:
        entry ?? null
    };
  }

  if (
    source.type ===
    "olympusMilestone"
  ) {
    const entry =
      slot.completion
        .olympusColiseum
        ?.milestones
        ?.[source.key];

    return {
      known:
        Boolean(entry),

      complete:
        entry
          ? entry.complete
          : null,

      data:
        entry ?? null
    };
  }

  if (
    source.type ===
    "olympusCup"
  ) {
    const entry =
      slot.completion
        .olympusColiseum
        ?.cups
        ?.[source.key];

    return {
      known:
        Boolean(entry),

      complete:
        entry
          ? entry.complete
          : null,

      data:
        entry ?? null
    };
  }

  return {
    known: false,
    complete: null,
    data: null
  };
}

/* ---------------------------------------------------------------------------
   Always-visible Game Status
--------------------------------------------------------------------------- */

function RenderGameStatus(slot) {
  const sora =
    slot.characters[0];

  const donald =
    slot.characters[1];

  const goofy =
    slot.characters[2];

  const location =
    slot.system?.location ??
    slot.core.world ??
    "Unknown";

  const body = [
    BuildEntry({
      name: "Save Slot",
      value: String(slot.slot),
      state: "info"
    }),

    BuildEntry({
      name: "Difficulty",
      value:
        slot.core.difficultyName ??
        `Raw ${slot.core.difficulty}`,
      state: "info"
    }),

    BuildEntry({
      name: "Current Location",
      value: location,
      state: "info"
    }),

    BuildEntry({
      name: "Munny",
      value:
        Number(slot.core.munny)
          .toLocaleString(),
      state: "info"
    }),

    BuildEntry({
      name: "Sora",
      value:
        `Lv ${sora.level} · HP ${sora.hpCurrent}/${sora.hpMax} · MP ${sora.mpCurrent}/${sora.mpMax}`,
      state: "info"
    }),

    BuildEntry({
      name: "Donald",
      value:
        `Lv ${donald.level} · HP ${donald.hpCurrent}/${donald.hpMax}`,
      state: "info"
    }),

    BuildEntry({
      name: "Goofy",
      value:
        `Lv ${goofy.level} · HP ${goofy.hpCurrent}/${goofy.hpMax}`,
      state: "info"
    })
  ].join("");

  return `
    <section class="game-status-section">
      <h2>Game Status</h2>

      <div class="section-block">
        ${body}
      </div>
    </section>
  `;
}

/* ---------------------------------------------------------------------------
   Main tab
--------------------------------------------------------------------------- */

function RenderWorlds(slot) {
  const worlds =
    slot.completion.worldStatus ??
    [];

  /*
   * Do not use only:
   *
   *     world.raw === 4
   *
   * because Monstro and End of the World require special completion rules.
   * ParseWorldStatus() already calculates the correct `complete` value.
   */
  const acreWood =
    slot.completion
      .acreWoodPages;

  const acreWoodComplete =
    Boolean(
      acreWood &&
      acreWood.convertedCount >=
        acreWood.target
    );

  const completed =
    worlds.filter(
      world =>
        world.complete
    ).length +
    (acreWoodComplete ? 1 : 0);

  const worldTarget =
    worlds.length +
    (acreWood ? 1 : 0);

  const worldRows =
    worlds.map(
      world => {
        let state =
          "missing";

        if (
          world.complete
        ) {
          state =
            "complete";
        } else if (
          world.raw > 0 ||
          (
            world.progress !== null &&
            world.progress > 0
          )
        ) {
          state =
            "partial";
        }

        let description =
          "";

        /*
         * Keep special-case reasoning visible to the user so values such as
         * Monstro map status 3 or End of the World map status 3 do not look
         * like parser mistakes.
         */
        if (
          world.completionNote
        ) {
          description =
            world.completionNote;
        }

        return BuildEntry({
          name:
            world.name,

          value:
            world.status,

          description,

          state,

          spoiler:
            !world.complete,

          external:
            true,

          url:
            KH1_CONTENT
              .WORLD_PROGRESS_URLS
              ?.[world.name] ??
            ""
        });
      }
    );

  if (acreWood) {
    worldRows.push(
      BuildEntry({
        name:
          "100 Acre Wood",

        value:
          `${acreWood.convertedCount}/${acreWood.target} page flags`,

        description:
          "Tracked separately from the world-status table.",

        state:
          EntryState(
            acreWood.convertedCount,
            acreWood.target
          ),

        spoiler:
          !acreWoodComplete,

        external:
          true,

        url:
          KH1_CONTENT
            .WORLD_PROGRESS_URLS
            ?.["100 Acre Wood"] ??
          ""
      })
    );
  }

  return BuildProgressSection(
    "World Progress",
    completed,
    worldTarget,
    worldRows.join(""),
    "World-map status and story-progress bytes are kept separately. Monstro and End of the World use special story-progress completion rules.",
    true
  );
}

function RenderEquipmentList(
  slot,
  title,
  entries,
  open = false
) {
  let ownedCount =
    0;

  const body =
    entries.map(
      entry => {
        const ownership =
          GetItemOwnership(
            slot,
            entry.itemId
          );

        if (
          ownership.owned
        ) {
          ownedCount++;
        }

        return BuildEntry({
          name:
            entry.name,

          value:
            OwnershipLabel(
              ownership
            ),

          description:
            `Item ID ${entry.itemId}`,

          hint:
            entry.hint,

          state:
            ownership.owned
              ? "complete"
              : "missing",

          spoiler:
            !ownership.owned,

          external:
            true,

          url:
            entry.url
        });
      }
    ).join("");

  return BuildProgressSection(
    title,
    ownedCount,
    entries.length,
    body,
    "Ownership is detected from the inventory table and currently equipped weapons.",
    open
  );
}

function RenderMagic(slot) {
  const parsedMagic =
    slot.completion
      .magicLevels ??
    [];

  const parsedByName =
    Object.fromEntries(
      parsedMagic.map(
        spell => [
          spell.name,
          spell
        ]
      )
    );

  let acquiredCount =
    0;

  let totalLevels =
    0;

  const body =
    KH1_CONTENT.MAGIC
      .map(
        spell => {
          const parsed =
            parsedByName[
              spell.name
            ];

          const level =
            Math.max(
              0,
              Math.min(
                3,
                Number(
                  parsed?.level ?? 0
                )
              )
            );

          if (
            level > 0
          ) {
            acquiredCount++;
          }

          totalLevels +=
            level;

          const tierName =
            spell.tiers[level] ??
            `Raw level ${level}`;

          const upgradeHint =
            level > 0
              ? (
                  spell.upgradeHints[
                    level - 1
                  ] ?? ""
                )
              : "";

          return BuildEntry({
            name:
              spell.name,

            value:
              tierName,

            description:
              `Magic level ${level}/3`,

            hint:
              upgradeHint ||
              spell.hint,

            state:
              level >= 3
                ? "complete"
                : (
                    level > 0
                      ? "partial"
                      : "missing"
                  ),

            spoiler:
              level === 0,

            external:
              true,

            url:
              spell.url
          });
        }
      )
      .join("");

  return BuildProgressSection(
    "Magic",
    totalLevels,
    KH1_CONTENT.MAGIC.length * 3,
    body,
    `${acquiredCount}/${KH1_CONTENT.MAGIC.length} spells obtained. Fill upgradeHints in kh1-content.js when you verify the source of each upgrade.`,
    true
  );
}

function RenderSummons(slot) {
  const summons =
    slot.completion.summons;

  const owned =
    new Set(
      summons.unlocked
    );

  const entries =
    KH1_CONTENT.SUMMONS
      .map(
        summon => {
          const has =
            owned.has(
              summon.name
            );

          return BuildEntry({
            name:
              summon.name,

            value:
              has
                ? "Unlocked"
                : "Missing",

            hint:
              summon.hint,

            state:
              has
                ? "complete"
                : "missing",

            spoiler:
              !has,

            external:
              true,

            url:
              summon.url
          });
        }
      ).join("");

  return BuildProgressSection(
    "Summons",
    summons.count,
    KH1_CONTENT.SUMMONS.length,
    entries,
    "",
    false
  );
}

function RenderMainTab(slot) {
  return [
    RenderWorlds(slot),

    RenderEquipmentList(
      slot,
      "Keyblades",
      KH1_CONTENT.KEYBLADES,
      true
    ),

    RenderMagic(slot),

    RenderSummons(slot),

    RenderEquipmentList(
      slot,
      "Shields",
      KH1_CONTENT.SHIELDS
    ),

    RenderEquipmentList(
      slot,
      "Staves",
      KH1_CONTENT.STAVES
    )
  ].join("");
}

/* ---------------------------------------------------------------------------
   Essentials tab
--------------------------------------------------------------------------- */

function GetTrinityDisplayState(
  mark,
  markStates
) {
  const exactState =
    markStates[
      mark.testNumber
    ] ?? null;

  const mapped =
    Number.isInteger(
      exactState?.offset
    ) &&
    Number.isInteger(
      exactState?.mask
    ) &&
    typeof exactState?.found ===
      "boolean";

  if (!mapped) {
    return {
      ...mark,
      mapped: false,
      found: null,
      value: "Unknown",
      state: "unknown",
      description:
        "Action-dependent independent flag is still pending. Color counters are intentionally not used as a fallback."
    };
  }

  const offsetText =
    `0x${exactState.offset
      .toString(16)
      .toUpperCase()}`;

  const maskText =
    `0x${exactState.mask
      .toString(16)
      .toUpperCase()
      .padStart(2, "0")}`;

  return {
    ...mark,
    mapped: true,
    found:
      exactState.found,
    value:
      exactState.found
        ? "Found"
        : "Not Found",
    state:
      exactState.found
        ? "complete"
        : "missing",
    description:
      `Independent Trinity flag: ${offsetText} mask ${maskText}.`
  };
}

function RenderTrinityMark(mark) {
  return BuildEntry({
    name:
      mark.name,

    value:
      mark.value,

    description:
      mark.description,

    hint:
      mark.hint,

    state:
      mark.state,

    spoiler:
      mark.state !==
        "complete",

    external:
      true,

    url:
      mark.url
  });
}

function RenderTrinity(slot) {
  const trinity =
    slot.completion.trinity;

  const markStates =
    trinity.markStates ?? {};

  /*
   * Build each physical Trinity exactly once. The same decoded rows are then
   * used for both display and summary counts, so rendering cannot disagree
   * with the section totals.
   *
   * The color counters at 0x1C66..0x1C6B stay available in parsed JSON for
   * research, but they never determine an individual physical location.
   */
  const groups =
    KH1_CONTENT.TRINITY_MARKS
      .map(
        group => ({
          ...group,
          unlocked:
            trinity.unlocked.includes(
              group.color
            ),
          marks:
            group.marks.map(
              mark =>
                GetTrinityDisplayState(
                  mark,
                  markStates
                )
            )
        })
      );

  const allMarks =
    groups.flatMap(
      group =>
        group.marks
    );

  const mappedCount =
    allMarks.filter(
      mark =>
        mark.mapped
    ).length;

  const foundCount =
    allMarks.filter(
      mark =>
        mark.found === true
    ).length;

  const pendingCount =
    allMarks.length -
    mappedCount;

  const body =
    groups.map(
      group => `
        <details
          class="nested-list"
          open
        >
          <summary>
            ${EscapeHTML(group.color)} Trinity
          </summary>

          <p class="nested-description">
            ${
              group.unlocked
                ? "Each location below has its own independent status. No color-counter inference is used."
                : "This Trinity ability is not unlocked in the selected save. Individual location flags are still shown independently below."
            }
          </p>

          <div class="section-block">
            ${
              group.marks
                .map(
                  RenderTrinityMark
                )
                .join("")
            }
          </div>
        </details>
      `
    ).join("");

  return BuildCollapsibleSection({
    title:
      "Trinity Marks",

    body,

    description:
      "Every physical Trinity is tracked as an independent completion row. The five Trinity color counters are retained only as research data and never determine an individual row. The eight action-dependent locations remain Unknown until their own environmental/action flags are mapped.",

    summaryRight:
      `${foundCount} found · ${mappedCount} mapped · ${pendingCount} pending`,

    open:
      true,

    sectionClass:
      "trinity-independent-section"
  });
}

function RenderColiseum(slot) {
  const olympus =
    slot.completion
      .olympusColiseum;

  const body =
    KH1_CONTENT.COLISEUM
      .map(
        entry => {
          const completion =
            ResolveCompletionSource(
              slot,
              entry.completionSource
            );

          let state =
            "unknown";

          let value =
            "Mapping needed";

          let description =
            "";

          if (
            completion.known
          ) {
            state =
              completion.complete
                ? "complete"
                : "missing";

            value =
              completion.complete
                ? "Finished"
                : "Not Finished";

            const data =
              completion.data;

            if (
              entry.completionSource
                ?.type ===
              "olympusCup"
            ) {
              description =
                `${data.statusOffsetHex} = ${data.statusRawHex} (${data.statusLabel}) · ` +
                `${data.completionOffsetHex} / ${data.completionMaskHex}`;
            } else if (
              entry.completionSource
                ?.type ===
              "olympusMilestone"
            ) {
              description =
                `Olympus story progress ${data.storyProgressHex} · ` +
                `completion threshold ${data.thresholdHex}`;

              if (
                data.flagOffsetHex
              ) {
                description +=
                  ` · flag ${data.flagOffsetHex}`;
              }
            }
          }

          return BuildEntry({
            name:
              entry.name,

            value,

            description,

            hint:
              entry.hint,

            state,

            spoiler:
              state !== "complete",

            external:
              true,

            url:
              entry.url
          });
        }
      )
      .join("");

  const footer =
    olympus
      ? `
        <p class="nested-description">
          Cup completion bits: ${EscapeHTML(olympus.cupCompletion.rawHex)}
          · Olympus story progress: ${EscapeHTML(olympus.storyProgressHex)}
        </p>
      `
      : "";

  return BuildCollapsibleSection({
    title:
      "Olympus Coliseum",

    body:
      `<div class="section-block">${body}</div>${footer}`,

    description:
      "Phil's Training, the story Preliminaries, and the first three cups are now mapped from controlled saves. Hades Cup follows the same cup structure but still benefits from a dedicated controlled test.",

    open:
      true
  });
}

function RenderPostcards(slot) {
  const current =
    slot.completion
      .postcardsMailed ?? 0;

  /*
   * The save stores a mailed-count, not ten distinct postcard identities.
   *
   * So these rows represent the sequential mailed/reward steps:
   *
   *   current = 3
   *   #1 -> Mailed
   *   #2 -> Mailed
   *   #3 -> Mailed
   *   #4..#10 -> Not Mailed
   */
  const body =
    KH1_CONTENT.POSTCARDS
      .map(
        postcard => {
          const mailed =
            postcard.sequence <=
            current;

          return BuildEntry({
            name:
              postcard.name,

            value:
              mailed
                ? "Mailed"
                : "Not Mailed",

            hint:
              postcard.hint,

            state:
              mailed
                ? "complete"
                : "missing",

            /*
             * Postcard numbers themselves are not spoilers.
             */
            spoiler:
              false,

            external:
              true,

            url:
              postcard.url
          });
        }
      )
      .join("");

  return BuildProgressSection(
    "Postcards",
    current,
    KH1_CONTENT.POSTCARDS.length,
    body,
    "Each line represents one sequential postcard-mail/reward step.",
    false
  );
}

function RenderAtlanticaClams(slot) {
  const clams =
    slot.completion
      .atlanticaClams;

  const current =
    clams?.openedCount ?? 0;

  const flags =
    clams?.flags ?? [];

  const flagByIndex =
    Object.fromEntries(
      flags.map(
        flag => [
          flag.index,
          flag
        ]
      )
    );

  const body =
    KH1_CONTENT.ATLANTICA_CLAMS
      .map(
        clam => {
          const flag =
            flagByIndex[
              clam.flagIndex
            ];

          const opened =
            Boolean(
              flag?.opened
            );

          return BuildEntry({
            name:
              clam.name,

            value:
              opened
                ? "Opened"
                : "Not Opened",

            description:
              flag
                ? `${flag.saveOffsetHex} · ${flag.maskHex}`
                : "",

            hint:
              clam.hint,

            state:
              opened
                ? "complete"
                : "missing",

            spoiler:
              !opened,

            external:
              true,

            url:
              clam.url
          });
        }
      )
      .join("");

  return BuildProgressSection(
    "Atlantica Clams",
    current,
    KH1_CONTENT.ATLANTICA_CLAMS.length,
    body,
    "All 16 individual clam bits are shown separately. Names/hints can be replaced with exact in-world locations as they are documented.",
    false
  );
}

function RenderChests(slot) {
  const chestData =
    slot.completion
      .chestStaticFlags;

  const knownChests =
    slot.completion
      .knownChests ?? {};

  const knownRows =
    (
      KH1_CONTENT.KNOWN_CHESTS ??
      []
    )
      .map(
        chest => {
          const data =
            knownChests[
              chest.key
            ];

          if (!data) {
            return "";
          }

          return BuildEntry({
            name:
              chest.name,

            value:
              data.opened
                ? "Opened"
                : "Not Opened",

            description:
              `${data.offsetHex} · ${data.maskHex}`,

            hint:
              chest.hint,

            state:
              data.opened
                ? "complete"
                : "missing",

            spoiler:
              !data.opened,

            external:
              true,

            url:
              chest.url
          });
        }
      )
      .join("");

  const researchRows = [
    BuildEntry({
      name:
        "Chest / Static Check Flags",

      value:
        `${chestData.setBitCount} set bits`,

      description:
        "Only individually mapped chest bits should be treated as exact chest completion. The wider block still contains unresolved static checks.",

      state:
        "unknown",

      external:
        true,

      url:
        "https://www.khguides.com/kh/collectibles/treasures/"
    }),

    BuildEntry({
      name:
        "Raw Chest Region",

      value:
        "0x05CC · 509 bytes",

      description:
        "Use Research Data / rawHex while mapping additional chest flags.",

      state:
        "info"
    })
  ].join("");

  return BuildCollapsibleSection({
    title:
      "Chests",

    body:
      `
        ${
          knownRows
            ? `<div class="section-block">${knownRows}</div>`
            : ""
        }

        <div class="section-block">
          ${researchRows}
        </div>
      `,

    description:
      "Watergleam is now individually confirmed. Additional chests can be added as controlled tests identify their bits.",

    open:
      false
  });
}

function RenderEssentialsTab(slot) {
  return [
    RenderTrinity(slot),
    RenderColiseum(slot),
    RenderPostcards(slot),
    RenderAtlanticaClams(slot),
    RenderChests(slot)
  ].join("");
}

/* ---------------------------------------------------------------------------
   Journal tab
--------------------------------------------------------------------------- */

function RenderJournalCharacters(slot) {
  const groups =
    KH1_CONTENT
      .JOURNAL_CHARACTERS;

  const totalCharacters =
    groups.reduce(
      (total, group) =>
        total +
        group.characters.length,
      0
    );

  let calculatedFoundTotal =
    0;

  const worlds =
    groups
      .map(
        group => {
          const characterStatuses =
            group.characters
              .map(
                characterKey => {
                  const status =
                    ResolveCompletionSource(
                      slot,
                      {
                        type:
                          "journalCharacter",

                        key:
                          characterKey
                      }
                    );

                  return {
                    key:
                      characterKey,

                    name:
                      KH1_DICTIONARY
                        .JOURNAL_CHARACTER_NAMES
                        ?.[characterKey] ??
                      characterKey,

                    content:
                      KH1_CONTENT
                        .JOURNAL_CHARACTER_OVERRIDES
                        ?.[characterKey] ??
                      {},

                    status
                  };
                }
              );

          const foundCount =
            characterStatuses
              .filter(
                character =>
                  character.status
                    .complete ===
                  true
              )
              .length;

          calculatedFoundTotal +=
            foundCount;

          const groupTotal =
            characterStatuses.length;

          const groupPercent =
            Percent(
              foundCount,
              groupTotal
            );

          const groupState =
            EntryState(
              foundCount,
              groupTotal
            );

          const entries =
            characterStatuses
              .map(
                character => {
                  const status =
                    character.status;

                  const descriptionParts =
                    [];

                  if (
                    status.data
                      ?.mappingText
                  ) {
                    descriptionParts.push(
                      status.data
                        .mappingText
                    );
                  }

                  if (
                    status.data
                      ?.variantCount >
                    1
                  ) {
                    descriptionParts.push(
                      `${status.data.variantCount} confirmed Journal states`
                    );
                  }

                  if (
                    status.data
                      ?.stateLabel
                  ) {
                    descriptionParts.push(
                      status.data
                        .stateLabel
                    );
                  }

                  if (
                    status.data
                      ?.note
                  ) {
                    descriptionParts.push(
                      status.data
                        .note
                    );
                  }

                  return BuildEntry({
                    name:
                      character.name,

                    value:
                      status.known
                        ? (
                            status.complete
                              ? "Journal Entry Found"
                              : "Journal Entry Missing"
                          )
                        : "Mapping needed",

                    description:
                      descriptionParts
                        .join(" · "),

                    hint:
                      character.content
                        .hint ??
                      "",

                    state:
                      status.known
                        ? (
                            status.complete
                              ? "complete"
                              : "missing"
                          )
                        : "unknown",

                    spoiler:
                      !status.known ||
                      !status.complete,

                    external:
                      true,

                    url:
                      character.content
                        .url ??
                      KH1_CONTENT
                        .JOURNAL_CHARACTER_URL
                  });
                }
              )
              .join("");

          return `
            <details class="nested-list">
              <summary>
                ${EscapeHTML(group.world)}
                <span>${foundCount}/${groupTotal} · ${groupPercent}%</span>
              </summary>

              <div class="progress-track nested-progress-track">
                <div
                  class="progress-fill ${groupState === "complete" ? "complete" : ""}"
                  style="width:${groupPercent}%"
                ></div>
              </div>

              <div class="section-block">
                ${entries}
              </div>
            </details>
          `;
        }
      )
      .join("");

  const analysis =
    slot.completionAnalysis
      ?.journalCharacters;

  const foundTotal =
    analysis
      ?.current ??
    calculatedFoundTotal;

  const target =
    analysis
      ?.target ??
    totalCharacters;

  return BuildProgressSection(
    "Characters by World",
    foundTotal,
    target,
    worlds,
    "All 103 expected Journal characters are mapped. The main section and every world group now show completion count and percentage.",
    true
  );
}

function RenderEnemyJournal(slot) {
  const enemyData =
    slot.completion
      .enemyDefeatCounters;

  const analysis =
    slot.completionAnalysis
      ?.heartlessDefeated;

  if (
    !enemyData ||
    !analysis
  ) {
    return "";
  }

  const journalPages =
    enemyData.journalGroups
      .map(
        group => `
          <div class="section-block enemy-journal-group">
            ${
              group
                .map(
                  enemy => {
                    const completed =
                      enemy.defeated > 0;

                    const killLabel =
                      enemy.defeated === 1
                        ? "1 kill"
                        : `${Number(
                            enemy.defeated
                          ).toLocaleString()} kills`;

                    return BuildEntry({
                      name:
                        enemy.name,

                      value:
                        killLabel,

                      description:
                        completed
                          ? "Defeated at least once"
                          : "Not defeated yet",

                      state:
                        completed
                          ? "complete"
                          : "missing",

                      spoiler:
                        !completed,

                      external:
                        true
                    });
                  }
                )
                .join("")
            }
          </div>
        `
      )
      .join("");

  return BuildProgressSection(
    "Heartless",
    analysis.current,
    analysis.target,
    journalPages,
    `${analysis.current}/${analysis.target} Heartless Journal entries have been defeated at least once. Kill totals are preserved.`,
    true
  );
}

function RenderBosses(slot) {
  const groups =
    GroupBy(
      KH1_CONTENT.BOSSES,
      "world"
    );

  const analysis =
    slot.completionAnalysis
      ?.bosses ?? {
        current: 0,
        mappedTarget: 0,
        target: KH1_CONTENT.BOSSES.length,
        percent: 0,
        unknownCount: KH1_CONTENT.BOSSES.length
      };

  const body =
    Object.entries(
      groups
    )
      .map(
        ([world, bosses]) => {
          let worldMapped =
            0;

          let worldDefeated =
            0;

          const entries =
            bosses
              .map(
                boss => {
                  const status =
                    slot.completion
                      .bosses
                      ?.entries
                      ?.[boss.key] ??
                    null;

                  if (status) {
                    worldMapped++;

                    if (
                      status.complete
                    ) {
                      worldDefeated++;
                    }
                  }

                  const technicalDetails =
                    status
                      ? [
                          status.offsetHex,
                          status.maskHex,
                          status.thresholdHex,
                          status.report
                            ? `Report ${status.report}`
                            : null
                        ]
                          .filter(Boolean)
                          .join(" · ")
                      : "";

                  let description =
                    "";

                  if (status) {
                    const evidenceLabel =
                      status.evidence ===
                      "confirmed"
                        ? "Confirmed mapping"
                        : status.evidence ===
                          "strong"
                          ? "Strong persistent progress mapping"
                          : status.evidence ===
                            "battle-clear proxy"
                            ? "Battle-clear proxy"
                            : status.evidence ===
                              "direct defeat reward"
                              ? "Direct defeat reward"
                              : status.evidence ===
                                "confirmed external save mapping"
                                ? "Confirmed persistent save mapping"
                                : status.evidence ===
                                  "max saveable progress"
                                  ? "Maximum saveable progress"
                                  : status.evidence;

                    description =
                      [
                        evidenceLabel,
                        technicalDetails
                      ]
                        .filter(Boolean)
                        .join(" · ");
                  } else {
                    description =
                      boss.trackingNote ??
                      "Persistent boss completion state still needs controlled mapping.";
                  }

                  return BuildEntry({
                    name:
                      boss.name,

                    value:
                      status
                        ? (
                            status.complete
                              ? (
                                  status.maxSaveable
                                    ? "Complete (max saveable progress)"
                                    : "Defeated"
                                )
                              : (
                                  status.maxSaveable
                                    ? "Not Complete"
                                    : "Not Defeated"
                                )
                          )
                        : "Mapping needed",

                    description,

                    hint:
                      boss.hint,

                    state:
                      status
                        ? (
                            status.complete
                              ? "complete"
                              : "missing"
                          )
                        : "unknown",

                    spoiler:
                      Boolean(
                        status &&
                        !status.complete
                      ),

                    external:
                      true,

                    url:
                      boss.url
                  });
                }
              )
              .join("");

          const worldUnknown =
            bosses.length -
            worldMapped;

          const worldPercent =
            Percent(
              worldDefeated,
              worldMapped
            );

          return `
            <details class="nested-list">
              <summary>
                ${EscapeHTML(world)}
                <span>
                  ${
                    worldMapped > 0
                      ? `${worldDefeated}/${worldMapped} mapped · ${worldPercent}%`
                      : "Mapping needed"
                  }
                  ${
                    worldUnknown > 0
                      ? ` · ${worldUnknown} ?`
                      : ""
                  }
                </span>
              </summary>

              ${
                worldMapped > 0
                  ? `
                    <div class="progress-track">
                      <div
                        class="progress-fill ${worldDefeated >= worldMapped ? "complete" : ""}"
                        style="width:${worldPercent}%"
                      ></div>
                    </div>
                  `
                  : ""
              }

              <div class="section-block">
                ${entries}
              </div>
            </details>
          `;
        }
      )
      .join("");

  const overallPercent =
    Percent(
      analysis.current,
      analysis.mappedTarget
    );

  return BuildCollapsibleSection({
    title:
      "Bosses",

    body:
      `
        ${
          analysis.mappedTarget > 0
            ? `
              <div class="progress-track">
                <div
                  class="progress-fill ${analysis.current >= analysis.mappedTarget ? "complete" : ""}"
                  style="width:${overallPercent}%"
                ></div>
              </div>
            `
            : ""
        }

        ${body}
      `,

    description:
      `${analysis.current}/${analysis.mappedTarget} mapped boss completion entries are complete. The final Ansem / Darkside / World of Chaos sequence follows the same maximum-saveable-progress rule as End of the World because KH1 has no normal post-final-boss clear save.`,

    summaryRight:
      `${analysis.current}/${analysis.mappedTarget} · ${overallPercent}%`,

    open:
      false
  });
}

function RenderMinigames(slot) {
  const groups =
    GroupBy(
      KH1_CONTENT.MINIGAMES,
      "world"
    );

  const analysis =
    slot.completionAnalysis
      ?.minigames ?? {
        current: 0,
        mappedTarget: 0,
        target: KH1_CONTENT.MINIGAMES.length,
        percent: 0,
        unknownCount: KH1_CONTENT.MINIGAMES.length
      };

  /*
   * Jungle Slider, Vine Jump and Olympus Coliseum are Journal categories
   * containing several individual course/cup records. Render them as nested
   * completion lists, matching the way the five 100 Acre Wood minigames are
   * presented as individual completion entries.
   *
   * Jungle Slider / Vine Jump technically store a top-5 leaderboard for each
   * course. The completion tracker intentionally shows ONLY leaderboard
   * record #1, per project design. The remaining four raw records are still
   * preserved by the parser/research data and are not discarded.
   */
  function RenderSubrecordMinigame(
    minigame,
    status
  ) {
    const subrecords =
      status.subrecords ??
      [];

    const completed =
      subrecords.filter(
        subrecord =>
          subrecord.complete
      ).length;

    const total =
      subrecords.length;

    const percent =
      Percent(
        completed,
        total
      );

    /*
     * Parent/category names are navigation labels, not undiscovered rewards.
     *
     * Keep Jungle Slider, Vine Jump, and Olympus Coliseum visible even when
     * some/all of their child course records are still missing. Only the
     * individual missing subrecords are spoiler-hidden.
     */
    const parentName =
      BuildExternalName(
        minigame.name,
        minigame.url,
        false
      );

    const entries =
      subrecords
        .map(
          subrecord => {
            /*
             * For leaderboard-based courses this is specifically record #1,
             * not every available top-5 record.
             * For Olympus each cup only has one saved record, so the same
             * field works for both structures.
             */
            const firstRecord =
              subrecord.records?.[0] ??
              subrecord.bestRecord ??
              null;

            const hasRecord =
              Boolean(
                firstRecord &&
                firstRecord.available
              );

            const value =
              hasRecord
                ? firstRecord.display
                : "No record";

            const description =
              firstRecord?.offsetHex
                ? `1st record · ${firstRecord.offsetHex}`
                : "1st record";

            return BuildEntry({
              name:
                subrecord.name,

              value,

              description,

              state:
                hasRecord
                  ? "complete"
                  : "missing",

              spoiler:
                !hasRecord,

              external:
                true,

              url:
                minigame.url
            });
          }
        )
        .join("");

    return `
      <details class="nested-list minigame-record-list">
        <summary>
          <span class="minigame-record-title">
            ${parentName}
          </span>

          <span>
            ${completed}/${total} · ${percent}%
          </span>
        </summary>

        <div class="progress-track">
          <div
            class="progress-fill ${completed >= total ? "complete" : ""}"
            style="width:${percent}%"
          ></div>
        </div>

        <div class="section-block">
          ${entries}
        </div>
      </details>
    `;
  }

  const body =
    Object.entries(
      groups
    )
      .map(
        ([world, minigames]) => {
          let worldMapped =
            0;

          let worldFinished =
            0;

          const entries =
            minigames
              .map(
                minigame => {
                  const status =
                    slot.completion
                      .minigames
                      ?.entries
                      ?.[minigame.key] ??
                    null;

                  if (status) {
                    worldMapped++;

                    if (
                      status.complete
                    ) {
                      worldFinished++;
                    }
                  }

                  /*
                   * Nested course/cup categories:
                   * - Jungle Slider: 5 slider courses
                   * - Vine Jump: 4 jump courses
                   * - Olympus Coliseum: 4 cup time-trial records
                   */
                  if (
                    status?.subrecords
                  ) {
                    return RenderSubrecordMinigame(
                      minigame,
                      status
                    );
                  }

                  let value =
                    "Mapping needed";

                  if (status) {
                    value =
                      status.complete
                        ? "Finished"
                        : "Not Finished";

                    if (
                      status.scoreDisplay
                    ) {
                      value +=
                        ` · ${status.scoreLabel}: ${status.scoreDisplay}`;
                    }
                  }

                  let description =
                    "";

                  if (status) {
                    const evidence =
                      status.evidence ===
                      "confirmed"
                        ? "Confirmed mapping"
                        : "Strongly inferred mapping";

                    description =
                      `${evidence} · ` +
                      `${status.completionOffsetHex} / ${status.maskHex}` +
                      ` · Score ${status.scoreOffsetHex}`;
                  } else {
                    description =
                      minigame.trackingNote ??
                      "Persistent finished-state and/or score location still needs controlled mapping.";
                  }

                  return BuildEntry({
                    name:
                      minigame.name,

                    value,

                    description,

                    hint:
                      minigame.hint,

                    state:
                      status
                        ? (
                            status.complete
                              ? "complete"
                              : "missing"
                          )
                        : "unknown",

                    spoiler:
                      !status ||
                      !status.complete,

                    external:
                      true,

                    url:
                      minigame.url
                  });
                }
              )
              .join("");

          const worldUnknown =
            minigames.length -
            worldMapped;

          const worldPercent =
            Percent(
              worldFinished,
              worldMapped
            );

          return `
            <details class="nested-list">
              <summary>
                ${EscapeHTML(world)}
                <span>
                  ${
                    worldMapped > 0
                      ? `${worldFinished}/${worldMapped} mapped · ${worldPercent}%`
                      : "Mapping needed"
                  }
                  ${
                    worldUnknown > 0
                      ? ` · ${worldUnknown} ?`
                      : ""
                  }
                </span>
              </summary>

              ${
                worldMapped > 0
                  ? `
                    <div class="progress-track">
                      <div
                        class="progress-fill ${worldFinished >= worldMapped ? "complete" : ""}"
                        style="width:${worldPercent}%"
                      ></div>
                    </div>
                  `
                  : ""
              }

              <div class="section-block">
                ${entries}
              </div>
            </details>
          `;
        }
      )
      .join("");

  const overallPercent =
    Percent(
      analysis.current,
      analysis.mappedTarget
    );

  return BuildCollapsibleSection({
    title:
      "Minigames",

    body:
      `
        ${
          analysis.mappedTarget > 0
            ? `
              <div class="progress-track">
                <div
                  class="progress-fill ${analysis.current >= analysis.mappedTarget ? "complete" : ""}"
                  style="width:${overallPercent}%"
                ></div>
              </div>
            `
            : ""
        }

        ${body}
      `,

    description:
      `${analysis.current}/${analysis.mappedTarget} Journal mini-games are fully finished. Jungle Slider, Vine Jump, and Olympus Coliseum expand into their individual course/cup entries. Only the 1st leaderboard record is shown for each Jungle Slider and Vine Jump course.`,

    summaryRight:
      `${analysis.current}/${analysis.mappedTarget} mapped · ${overallPercent}%`,

    open:
      false
  });
}

function RenderJournalTab(slot) {
  return [
    RenderJournalCharacters(slot),
    RenderEnemyJournal(slot),
    RenderBosses(slot),
    RenderMinigames(slot)
  ].join("");
}

/* ---------------------------------------------------------------------------
   Synthesis tab
--------------------------------------------------------------------------- */

function RenderSynthesis(slot) {
  const synthesis =
    slot.completion
      .synthesis;

  if (!synthesis) {
    return "";
  }

  const completedIndexes =
    new Set(
      synthesis.completedIndexes
    );

  let ownedNow =
    0;

  const totalItems =
    KH1_CONTENT
      .SYNTHESIS_SETS
      .reduce(
        (total, set) =>
          total + set.items.length,
        0
      );

  const sets =
    KH1_CONTENT
      .SYNTHESIS_SETS
      .map(
        set => {
          const entries =
            set.items
              .map(
                item => {
                  const ownership =
                    GetItemOwnership(
                      slot,
                      item.itemId
                    );

                  if (
                    ownership.owned
                  ) {
                    ownedNow++;
                  }

                  const crafted =
                    completedIndexes.has(
                      item.synthesisIndex
                    );

                  return BuildEntry({
                    name:
                      item.name,

                    value:
                      crafted
                        ? "Synthesized"
                        : "Not Synthesized",

                    description:
                      `${
                        ownership.owned
                          ? "Owned now"
                          : "Not owned now"
                      } · Synthesis index ${item.synthesisIndex} · Item ID ${item.itemId}`,

                    hint:
                      item.hint,

                    state:
                      crafted
                        ? "complete"
                        : "missing",

                    spoiler:
                      !crafted,

                    external:
                      true,

                    url:
                      item.url
                  });
                }
              )
              .join("");

          return `
            <details class="nested-list" open>
              <summary>
                ${EscapeHTML(set.name)}
                <span>${set.items.length} items</span>
              </summary>

              ${
                set.unlockHint
                  ? `<p class="nested-description">${EscapeHTML(set.unlockHint)}</p>`
                  : ""
              }

              <div class="section-block">
                ${entries}
              </div>
            </details>
          `;
        }
      )
      .join("");

  return BuildProgressSection(
    "Synthesis Items",
    synthesis.completedCount,
    synthesis.target,
    sets,
    `${synthesis.completedCount}/${synthesis.target} recipes have been synthesized at least once. ` +
    `${ownedNow}/${totalItems} synthesis-result items are currently owned. ` +
    `Synthesis stage ${synthesis.listProgress?.raw ?? "?"}: ${synthesis.listProgress?.label ?? "Unknown"}. ` +
    `Synthesis history and current inventory are intentionally tracked separately.`,
    true
  );
}
function RenderSynthesisTab(slot) {
  return RenderSynthesis(slot);
}

/* ---------------------------------------------------------------------------
   Collectable tab
--------------------------------------------------------------------------- */

function RenderReports(slot) {
  const reports =
    slot.completion.reports;

  const owned =
    new Set(
      reports.reports
    );

  const entries =
    [];

  for (
    let report = 1;
    report <= 13;
    report++
  ) {
    const has =
      owned.has(report);

    entries.push(
      BuildEntry({
        name:
          `Ansem's Report ${report}`,

        value:
          has
            ? "Obtained"
            : "Missing",

        state:
          has
            ? "complete"
            : "missing",

        spoiler:
          !has,

        external:
          true
      })
    );
  }

  return BuildProgressSection(
    "Ansem Reports",
    reports.count,
    13,
    entries.join(""),
    "",
    true
  );
}

function RenderPuppies(slot) {
  const puppies =
    slot.completion.puppies;

  const found =
    new Set(
      puppies.foundIds
    );

  const groups =
    [];

  for (
    let start = 1;
    start <= 99;
    start += 3
  ) {
    const end =
      Math.min(
        start + 2,
        99
      );

    const ids =
      [];

    for (
      let id = start;
      id <= end;
      id++
    ) {
      ids.push(id);
    }

    const current =
      ids.filter(
        id =>
          found.has(id)
      ).length;

    groups.push(
      BuildEntry({
        name:
          `Puppies ${start}-${end}`,

        value:
          `${current}/${ids.length}`,

        state:
          EntryState(
            current,
            ids.length
          ),

        spoiler:
          current < ids.length,

        external:
          true,

        url:
          "https://www.khguides.com/kh/collectibles/puppies/"
      })
    );
  }

  return BuildProgressSection(
    "99 Puppies",
    puppies.foundCount,
    99,
    groups.join(""),
    "Exact puppy IDs are read from the 13-byte Dalmatians bitfield.",
    true
  );
}


function RenderGummiBlueprints(slot) {
  const blueprints =
    slot.completion
      .gummiBlueprints;

  const entries =
    blueprints
      ?.entries ??
    [];

  const groups =
    KH1_CONTENT
      .GUMMI_BLUEPRINT_GROUPS
      .map(
        group => {
          const groupEntries =
            entries.filter(
              entry =>
                entry.index >=
                  group.startIndex &&
                entry.index <=
                  group.endIndex
            );

          const current =
            groupEntries.filter(
              entry =>
                entry.owned
            ).length;

          const body =
            groupEntries
              .map(
                entry =>
                  BuildEntry({
                    name:
                      entry.name,

                    value:
                      entry.owned
                        ? "Obtained"
                        : "Missing",

                    description:
                      `${entry.offsetHex} · blueprint index ${entry.index}`,

                    state:
                      entry.owned
                        ? "complete"
                        : "missing",

                    spoiler:
                      !entry.owned,

                    external:
                      true,

                    url:
                      group.url ||
                      KH1_CONTENT
                        .GUMMI_BLUEPRINT_URL
                  })
              )
              .join("");

          return `
            <details
              class="nested-list"
              ${current > 0 ? "open" : ""}
            >
              <summary>
                ${EscapeHTML(group.name)}
                <span>${current}/${groupEntries.length} · ${Percent(current, groupEntries.length)}%</span>
              </summary>

              <div class="section-block">
                ${body}
              </div>
            </details>
          `;
        }
      )
      .join("");

  return BuildProgressSection(
    "Gummi Ship Blueprints",
    blueprints?.ownedCount ?? 0,
    KH1_DICTIONARY
      .GUMMI_BLUEPRINT_NAMES
      .length,
    groups,
    "Blueprint ownership is a 48-byte table at 0xBEBF. The 48-entry PC index-to-name order is accepted after the user's one-hot blueprint spot-checks matched the expected models.",
    true
  );
}

function RenderCollectableTab(slot) {
  return [
    RenderReports(slot),
    RenderPuppies(slot),
    RenderGummiBlueprints(slot)
  ].join("");
}

/* ---------------------------------------------------------------------------
   Extra tab
--------------------------------------------------------------------------- */

function RenderCharacters(slot) {
  const body =
    slot.characters
      .map(
        character => {
          const abilityCount =
            character.abilities
              ?.length ?? 0;

          return BuildEntry({
            name:
              character.name,

            value:
              `Lv ${character.level}`,

            description:
              `EXP ${Number(character.experience).toLocaleString()} · ` +
              `HP ${character.hpCurrent}/${character.hpMax} · ` +
              `MP ${character.mpCurrent}/${character.mpMax} · ` +
              `AP ${character.ap} · STR ${character.strength} · DEF ${character.defense} · ` +
              `${abilityCount} learned abilities`,

            state:
              "info",

            external:
              true
          });
        }
      )
      .join("");

  return BuildCollapsibleSection({
    title:
      "Character Levels & Details",

    body:
      `<div class="section-block">${body}</div>`,

    description:
      "Shows the parsed character records from the save slot.",

    open:
      true
  });
}

function RenderExtraTab(slot) {
  return RenderCharacters(slot);
}

/* ---------------------------------------------------------------------------
   Analyzer tabs
--------------------------------------------------------------------------- */

function RenderAnalyzerTabs() {
  return `
    <nav
      class="analyzer-tabs"
      aria-label="Completion analyzer sections"
    >
      ${
        KH1_CONTENT.TABS
          .map(
            tab => `
              <button
                type="button"
                class="analyzer-tab-button ${
                  tab.id === activeAnalyzerTab
                    ? "active"
                    : ""
                }"
                data-analyzer-tab="${EscapeHTML(tab.id)}"
              >
                ${EscapeHTML(tab.name)}
              </button>
            `
          )
          .join("")
      }
    </nav>
  `;
}

const ANALYZER_TAB_RENDERERS =
  Object.freeze({
    main:
      RenderMainTab,

    essentials:
      RenderEssentialsTab,

    journal:
      RenderJournalTab,

    synthesis:
      RenderSynthesisTab,

    collectable:
      RenderCollectableTab,

    extra:
      RenderExtraTab
  });

function RenderActiveTab(slot) {
  const renderer =
    ANALYZER_TAB_RENDERERS[
      activeAnalyzerTab
    ] ??
    RenderMainTab;

  return renderer(
    slot
  );
}

function RenderAnalyzer() {
  const slot =
    GetSelectedSlot();

  if (!slot) {
    generated.innerHTML =
      "";

    return;
  }

  generated.innerHTML = `
    <div class="horizontal-line"></div>

    ${RenderGameStatus(slot)}

    <div class="horizontal-line"></div>

    ${RenderAnalyzerTabs()}

    <div
      class="analyzer-tab-panel"
      data-active-tab="${EscapeHTML(activeAnalyzerTab)}"
    >
      ${RenderActiveTab(slot)}
    </div>
  `;

  RenderResearch();
  RenderRawJSON();
}

/* ---------------------------------------------------------------------------
   Research view
--------------------------------------------------------------------------- */

function RenderEnemyCounters(
  slot,
  fallbackValues
) {
  const decoded =
    slot.completion
      ?.enemyDefeatCounters
      ?.counters;

  if (
    Array.isArray(decoded)
  ) {
    return `
      <div class="counter-grid">
        ${
          decoded.map(
            enemy => `
              <div class="counter-cell">
                <span>
                  Index ${enemy.index}
                  ${enemy.name ? ` · ${EscapeHTML(enemy.name)}` : ""}
                </span>
                ${Number(enemy.defeated).toLocaleString()}
              </div>
            `
          ).join("")
        }
      </div>
    `;
  }

  if (
    !Array.isArray(
      fallbackValues
    )
  ) {
    return "";
  }

  return `
    <div class="counter-grid">
      ${
        fallbackValues.map(
          (value, index) => `
            <div class="counter-cell">
              <span>Index ${index}</span>
              ${value}
            </div>
          `
        ).join("")
      }
    </div>
  `;
}

function RenderResearch() {
  const slot =
    GetSelectedSlot();

  if (
    !slot ||
    !researchCheckbox.checked
  ) {
    researchPanel.classList.add(
      "hidden"
    );

    return;
  }

  researchPanel.classList.remove(
    "hidden"
  );

  const regions =
    slot.research?.regions ?? {};

  researchSummaryView.innerHTML =
    Object.entries(regions)
      .map(
        ([key, region]) => {
          const counters =
            key === "enemyDefeatCounters"
              ? RenderEnemyCounters(
                  slot,
                  region.uint16LE
                )
              : "";

          const preview =
            region.rawHex
              ? (
                  region.rawHex.length > 160
                    ? region.rawHex.slice(0, 160) + "…"
                    : region.rawHex
                )
              : "";

          return `
            <div class="research-region">
              <div class="research-region-name">
                ${EscapeHTML(region.label ?? key)}
              </div>

              <div class="research-meta">
                ${EscapeHTML(region.offsetHex ?? "")}
                · ${EscapeHTML(region.length ?? 0)} byte(s)
                · ${EscapeHTML(region.confidence ?? "research")}
              </div>

              ${
                preview
                  ? `<div class="entry-description"><code>${EscapeHTML(preview)}</code></div>`
                  : ""
              }

              ${counters}
            </div>
          `;
        }
      )
      .join("");
}

function RenderRawJSON() {
  const selected =
    GetSelectedJSON();

  rawOutput.textContent =
    selected
      ? JSON.stringify(
          selected,
          null,
          2
        )
      : "No save loaded.";
}

/* ---------------------------------------------------------------------------
   File handling
--------------------------------------------------------------------------- */

async function HandleFile(file) {
  if (!file) {
    return;
  }

  try {
    fileLabel.textContent =
      "Reading Save...";

    SetStatus(
      "Reading Kingdom Hearts save..."
    );

    currentSave =
      await ProcessKH1File(
        file
      );

    KH1CheckCompletion(
      currentSave
    );

    slotSelect.innerHTML =
      '<option value="all">Latest / All Slots</option>' +
      currentSave.slots
        .map(
          slot => {
            const location =
              slot.system?.location
                ? ` — ${EscapeHTML(slot.system.location)}`
                : "";

            return (
              `<option value="${slot.slot}">` +
              `Slot ${slot.slot}${location}` +
              "</option>"
            );
          }
        )
        .join("");

    slotSelect.disabled =
      false;

    controls.classList.remove(
      "hidden"
    );

    fileLabel.textContent =
      "Choose Another Save...";

    SetStatus(
      `Loaded ${currentSave.slots.length} save slot(s).`,
      "good"
    );

    RenderAnalyzer();
  } catch (error) {
    console.error(error);

    currentSave =
      null;

    fileLabel.textContent =
      "Choose Save File...";

    SetStatus(
      error.message ??
      String(error),
      "bad"
    );

    generated.innerHTML =
      "";

    researchPanel.classList.add(
      "hidden"
    );
  }
}

/* ---------------------------------------------------------------------------
   Research tabs
--------------------------------------------------------------------------- */

function ShowResearchSummary() {
  researchSummaryView.classList.remove(
    "hidden"
  );

  rawJsonView.classList.add(
    "hidden"
  );

  researchSummaryTab.classList.add(
    "tab-active"
  );

  rawJsonTab.classList.remove(
    "tab-active"
  );
}

function ShowRawJSON() {
  researchSummaryView.classList.add(
    "hidden"
  );

  rawJsonView.classList.remove(
    "hidden"
  );

  researchSummaryTab.classList.remove(
    "tab-active"
  );

  rawJsonTab.classList.add(
    "tab-active"
  );

  RenderRawJSON();
}

/* ---------------------------------------------------------------------------
   Events
--------------------------------------------------------------------------- */

fileInput.addEventListener(
  "change",
  event =>
    HandleFile(
      event.target.files[0]
    )
);

slotSelect.addEventListener(
  "change",
  RenderAnalyzer
);

spoilersCheckbox.addEventListener(
  "change",
  RenderAnalyzer
);

researchCheckbox.addEventListener(
  "change",
  RenderAnalyzer
);

/*
 * Event delegation is used for the dynamically generated analyzer tabs.
 *
 * RenderAnalyzer() replaces #generated every time the save slot or tab
 * changes, so attaching a separate listener to each generated button would
 * need to be repeated after every render.
 */
generated.addEventListener(
  "click",
  event => {
    const button =
      event.target.closest(
        "[data-analyzer-tab]"
      );

    if (!button) {
      return;
    }

    activeAnalyzerTab =
      button.dataset
        .analyzerTab;

    RenderAnalyzer();
  }
);

researchSummaryTab.addEventListener(
  "click",
  ShowResearchSummary
);

rawJsonTab.addEventListener(
  "click",
  ShowRawJSON
);

copyButton.addEventListener(
  "click",
  async () => {
    const selected =
      GetSelectedJSON();

    if (!selected) {
      return;
    }

    await navigator.clipboard.writeText(
      JSON.stringify(
        selected,
        null,
        2
      )
    );

    SetStatus(
      "JSON copied to clipboard.",
      "good"
    );
  }
);

downloadButton.addEventListener(
  "click",
  () => {
    const selected =
      GetSelectedJSON();

    if (!selected) {
      return;
    }

    const suffix =
      slotSelect.value === "all"
        ? "all"
        : `slot_${slotSelect.value}`;

    DownloadJSON(
      selected,
      `KHFM_WW_${suffix}_decoded.json`
    );
  }
);

saveLocationInput.addEventListener(
  "click",
  async () => {
    try {
      await navigator.clipboard.writeText(
        saveLocationInput.value
      );

      saveLocationTooltip.classList.add(
        "tooltip-visible"
      );

      document.getElementById(
        "save-location-input-tooltip"
      ).textContent =
        "Copied!";

      window.setTimeout(
        () => {
          saveLocationTooltip.classList.remove(
            "tooltip-visible"
          );

          document.getElementById(
            "save-location-input-tooltip"
          ).textContent =
            "Click once to copy to clipboard";
        },
        1200
      );
    } catch (error) {
      console.warn(
        "Clipboard copy failed.",
        error
      );
    }
  }
);

window.addEventListener(
  "scroll",
  () => {
    if (
      window.scrollY > 500
    ) {
      scrollButton.classList.remove(
        "hidden"
      );
    } else {
      scrollButton.classList.add(
        "hidden"
      );
    }
  }
);

scrollButton.addEventListener(
  "click",
  () =>
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    })
);
