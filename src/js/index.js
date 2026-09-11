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
      <span class="external-link-mark" aria-hidden="true">↗</span>
    </a>
  `;
}

function BuildEntry({
  name,
  value = "",
  description = "",
  hint = "",
  state = "info",
  spoiler = false,
  url = "",
  external = false
}) {
  const nameHtml =
    external
      ? BuildExternalName(
          name,
          url,
          spoiler
        )
      : (
          spoiler
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
                aria-label="Hidden hint. Hover or focus to reveal."
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
  const completed =
    worlds.filter(
      world =>
        world.complete
    ).length;

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
            true
        });
      }
    );

  const acreWood =
    slot.completion
      .acreWoodPages;

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

        external:
          true
      })
    );
  }

  return BuildProgressSection(
    "World Progress",
    completed,
    worlds.length,
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

function RenderTrinity(slot) {
  const trinity =
    slot.completion.trinity;

  /*
   * IMPORTANT:
   *
   * The save currently gives us only the number of found Trinity marks per
   * color. It does not yet tell us the identity of each exact world location.
   *
   * Therefore these individual rows are COUNT-BASED progress slots.
   * They are useful for a 46-line completion checklist, but should not yet be
   * interpreted as exact physical location flags.
   */
  const groups =
    KH1_CONTENT.TRINITY_MARKS
      .map(
        group => {
          const current =
            trinity.counts[
              group.color
            ] ?? 0;

          const isUnlocked =
            trinity.unlocked.includes(
              group.color
            );

          const marks =
            group.marks
              .map(
                mark => {
                  const found =
                    mark.number <=
                    current;

                  return BuildEntry({
                    name:
                      mark.name,

                    value:
                      found
                        ? "Found"
                        : "Not Found",

                    description:
                      "Count-based progress row. Exact physical Trinity location flag is not mapped yet.",

                    hint:
                      mark.hint,

                    state:
                      found
                        ? "complete"
                        : "missing",

                    spoiler:
                      !found,

                    external:
                      true,

                    url:
                      mark.url
                  });
                }
              )
              .join("");

          return `
            <details
              class="nested-list"
              ${current > 0 ? "open" : ""}
            >
              <summary>
                ${EscapeHTML(group.color)} Trinity
                <span>${current}/${group.marks.length}</span>
              </summary>

              ${
                !isUnlocked
                  ? `<p class="nested-description">Trinity ability is not unlocked yet.</p>`
                  : ""
              }

              <div class="section-block">
                ${marks}
              </div>
            </details>
          `;
        }
      )
      .join("");

  return BuildProgressSection(
    "Trinity Marks",
    trinity.foundTotal,
    46,
    groups,
    "All 46 progress rows are shown individually. Current statuses are derived from each color's found counter until exact location flags are mapped.",
    true
  );
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

  let knownCount =
    0;

  let completedKnown =
    0;

  const body =
    Object.entries(groups)
      .map(
        ([world, bosses]) => {
          const entries =
            bosses.map(
              boss => {
                const status =
                  ResolveCompletionSource(
                    slot,
                    boss.completionSource
                  );

                if (
                  status.known
                ) {
                  knownCount++;

                  if (
                    status.complete
                  ) {
                    completedKnown++;
                  }
                }

                return BuildEntry({
                  name:
                    boss.name,

                  value:
                    status.known
                      ? (
                          status.complete
                            ? "Defeated"
                            : "Not Defeated"
                        )
                      : "Mapping needed",

                  description:
                    status.known
                      ? "Persistent completion source is currently mapped."
                      : "Boss is listed so its persistent save flag can be identified later.",

                  hint:
                    boss.hint,

                  state:
                    status.known
                      ? (
                          status.complete
                            ? "complete"
                            : "missing"
                        )
                      : "unknown",

                  spoiler:
                    status.known &&
                    !status.complete,

                  external:
                    true,

                  url:
                    boss.url
                });
              }
            ).join("");

          return `
            <details class="nested-list">
              <summary>
                ${EscapeHTML(world)}
                <span>${bosses.length}</span>
              </summary>

              <div class="section-block">
                ${entries}
              </div>
            </details>
          `;
        }
      )
      .join("");

  return BuildCollapsibleSection({
    title:
      "Bosses",

    body,

    description:
      `${completedKnown}/${knownCount} currently mapped boss flags are complete. Unmapped bosses remain visible for future reverse engineering.`,

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

  const body =
    Object.entries(groups)
      .map(
        ([world, minigames]) => {
          const entries =
            minigames.map(
              minigame => {
                const status =
                  ResolveCompletionSource(
                    slot,
                    minigame.statusSource
                  );

                return BuildEntry({
                  name:
                    minigame.name,

                  value:
                    status.known
                      ? (
                          status.complete
                            ? (
                                status.data?.score !== null &&
                                status.data?.score !== undefined
                                  ? `Finished · Score ${Number(status.data.score).toLocaleString()}`
                                  : "Finished"
                              )
                            : "Not Finished"
                        )
                      : "Mapping needed",

                  description:
                    status.known
                      ? (
                          status.data
                            ? `${status.data.completionOffsetHex} · ${status.data.maskHex}` +
                              (
                                status.data.scoreOffsetHex
                                  ? ` · Score ${status.data.scoreOffsetHex}`
                                  : ""
                              )
                            : ""
                        )
                      : "Persistent minigame completion flag has not been identified yet.",

                  hint:
                    minigame.hint,

                  state:
                    status.known
                      ? (
                          status.complete
                            ? "complete"
                            : "missing"
                        )
                      : "unknown",

                  external:
                    true,

                  url:
                    minigame.url
                });
              }
            ).join("");

          return `
            <details class="nested-list">
              <summary>
                ${EscapeHTML(world)}
                <span>${minigames.length}</span>
              </summary>

              <div class="section-block">
                ${entries}
              </div>
            </details>
          `;
        }
      )
      .join("");

  return BuildCollapsibleSection({
    title:
      "Minigames",

    body,

    description:
      "The minigame list is present now; finish-state mappings can be filled as their save variables are identified.",

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
    "Blueprint ownership is a 48-byte table at 0xBEBF. The supplied one-blueprint-per-slot save pack is intended to directly verify the exact PC index-to-name order.",
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

function RenderActiveTab(slot) {
  if (
    activeAnalyzerTab ===
    "essentials"
  ) {
    return RenderEssentialsTab(
      slot
    );
  }

  if (
    activeAnalyzerTab ===
    "journal"
  ) {
    return RenderJournalTab(
      slot
    );
  }

  if (
    activeAnalyzerTab ===
    "synthesis"
  ) {
    return RenderSynthesisTab(
      slot
    );
  }

  if (
    activeAnalyzerTab ===
    "collectable"
  ) {
    return RenderCollectableTab(
      slot
    );
  }

  if (
    activeAnalyzerTab ===
    "extra"
  ) {
    return RenderExtraTab(
      slot
    );
  }

  return RenderMainTab(
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
