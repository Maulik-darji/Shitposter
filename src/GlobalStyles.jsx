import React from "react";

const GLOBAL_CSS = `
:root {
  --bg: #ffffff;
  --bg-hover: rgba(0, 0, 0, 0.04);
  --border: rgba(0, 0, 0, 0.09);
  --text: #242424;
  --text-muted: #6b6b6b;
  --accent: #242424;
  --accent-hover: #000000;
  --logo-invert: 1;
  --cta-bg: #adadad;
  --cta-text: #242424;
  --cta-bg-hover: #dcdcdc;
  --danger: #f4212e;
  --success: #00ba7c;
  --font: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial,
    sans-serif;
  --font-serif: ui-serif, "Charter", "Georgia", "Times New Roman", serif;
  --radius: 16px;
  --sidebar-width: 275px;
  --feed-width: 600px;
  --right-width: 350px;
  --widget-bg: #ffffff;
  --chip-bg: #f2f2f2;
  --invert-filled: 0;
  --invert-outline: 1;
  --glass: rgba(255, 255, 255, 0.82);
  --ui-scale: 1;
}

html[data-theme="dark"] {
  --bg: #181818;
  --bg-hover: rgba(231, 233, 234, 0.1);
  --border: rgb(47, 51, 54);
  --text: #e7e9ea;
  --text-muted: #71767b;
  --accent: #1d9bf0;
  --accent-hover: #1a8cd8;
  --logo-invert: 0;
  --cta-bg: #e7e9ea;
  --cta-text: #0f1419;
  --cta-bg-hover: #d7dbdc;
  --widget-bg: #16181c;
  --chip-bg: #0a0a0a;
  --invert-filled: 1;
  --invert-outline: 0;
  --glass: rgba(24, 24, 24, 0.82);
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: var(--font);
  background: var(--bg);
  color: var(--text);
  line-height: 1.4;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
}

button {
  cursor: pointer;
  border: none;
  background: none;
  font: inherit;
  color: inherit;
  transition: background 0.2s ease;
}

button:disabled {
  cursor: not-allowed;
}

a {
  text-decoration: none;
  color: inherit;
}

:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

.srOnly {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.app {
  display: flex;
  justify-content: center;
  min-height: 100vh;
  margin: 0 auto;
  max-width: 1265px;
  zoom: var(--ui-scale, 1);
}

/* Sidebar Navigation */
.nav {
  display: flex;
  flex-direction: column;
  width: var(--sidebar-width);
  padding: 0 12px;
  position: sticky;
  top: 0;
  height: 100vh;
}

.brand {
  padding: 12px;
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  gap: 12px;
  border-radius: 999px;
  width: fit-content;
  cursor: pointer;
}

.brand:hover {
  background: var(--bg-hover);
}

.brandMark {
  width: 34px;
  height: 34px;
  border-radius: 999px;
  background: var(--accent);
}

.brandLogoImg {
  height: 66px;
  width: auto;
  display: block;
  filter: invert(var(--logo-invert, 0));
}

.brandName {
  font-weight: 900;
  letter-spacing: -0.02em;
}

.brandTag {
  color: var(--text-muted);
  font-size: 12px;
  margin-top: 2px;
}

.navItems {
  display: flex;
  flex-direction: column;
}

.navItem {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 12px;
  border-radius: 999px;
  width: fit-content;
  font-size: 20px;
  margin-bottom: 4px;
}

.navItem:hover {
  background: var(--bg-hover);
}

.navItem--active {
  font-weight: 700;
}

.navItem:disabled {
  opacity: 0.55;
}

.navText {
  padding-right: 16px;
}

.pill {
  width: fit-content;
  border: 1px solid var(--border);
  padding: 10px 12px;
  border-radius: 999px;
  font-size: 12px;
  color: var(--text-muted);
  background: var(--chip-bg);
}

.primaryCta {
  background: var(--cta-bg);
  color: var(--cta-text);
  font-weight: 700;
  font-size: 17px;
  padding: 15px 0;
  border-radius: 999px;
  margin-top: 16px;
  width: 90%;
  text-align: center;
  box-shadow: rgba(0, 0, 0, 0.08) 0px 8px 28px;
}

.primaryCta:hover {
  background: var(--cta-bg-hover);
}

/* Fixed spacing at bottom of nav for profile (placeholder) */
.navFooter {
  margin-top: auto;
  padding-bottom: 12px;
}

/* Feed Column */
.feed {
  width: var(--feed-width);
  border-left: 1px solid var(--border);
  border-right: 1px solid var(--border);
  min-height: 100vh;
}

.app[data-page="settings"] .sidebar {
  display: none;
}

.app[data-page="settings"] .feed {
  width: calc(var(--feed-width) + var(--right-width));
}

.viralSection {
  border-bottom: 1px solid var(--border);
}

.viralHeader {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 16px 8px;
}

.viralTitle {
  font-size: 16px;
  font-weight: 900;
  letter-spacing: -0.01em;
}

.viralMeta {
  color: var(--text-muted);
  font-size: 13px;
}

.viralMiniTitle {
  font-weight: 900;
  letter-spacing: -0.01em;
}

.viralMiniText {
  margin-top: 8px;
  color: var(--text-muted);
  font-size: 13px;
  line-height: 1.35;
}

.feedHeader {
  position: sticky;
  top: 0;
  z-index: 10;
  background: rgba(255, 255, 255, 0.82);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border);
}

.feedTitle {
  padding: 12px 16px;
  font-size: 20px;
  font-weight: 700;
}

.feedTabs {
  display: flex;
  height: 53px;
}

.feedTab {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  font-weight: 500;
  color: var(--text-muted);
  position: relative;
}

.feedTab:hover {
  background: var(--bg-hover);
}

.feedTab--active {
  color: var(--text);
  font-weight: 700;
}

.feedTab--active::after {
  content: "";
  position: absolute;
  bottom: 0;
  height: 4px;
  min-width: 56px;
  background: var(--accent);
  border-radius: 999px;
}

.emptyState {
  min-height: 55vh;
  display: grid;
  place-items: center;
  padding: 24px 16px;
}

.emptyTitle {
  font-size: 28px;
  font-weight: 900;
  letter-spacing: -0.02em;
}

.emptySub {
  margin-top: 8px;
  color: var(--text-muted);
  font-size: 15px;
  max-width: 420px;
  text-align: center;
}

.emptyState .postBtn {
  margin-top: 16px;
}

/* Explore */
.exploreHeader {
  position: sticky;
  top: 0;
  z-index: 10;
  background: rgba(255, 255, 255, 0.82);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border);
}

.exploreSearchRow {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 16px 8px;
}

.exploreSearchField {
  flex: 1;
}

.exploreGear {
  width: 40px;
  height: 40px;
  display: grid;
  place-items: center;
  border-radius: 999px;
}

.exploreGear:hover {
  background: var(--bg-hover);
}

.exploreTabs {
  display: flex;
  height: 48px;
}

.exploreTab {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-muted);
  position: relative;
}

.exploreTab:hover {
  background: var(--bg-hover);
}

.exploreTab--active {
  color: var(--text);
  font-weight: 800;
}

.exploreTab--active::after {
  content: "";
  position: absolute;
  left: 50%;
  bottom: 0;
  transform: translateX(-50%);
  height: 4px;
  min-width: 56px;
  border-radius: 999px;
  background: var(--accent);
}

.exploreBody {
  padding-bottom: 24px;
}

.exploreHero {
  margin: 12px 16px;
  border: 1px solid var(--border);
  border-radius: 16px;
  overflow: hidden;
  position: relative;
  min-height: 148px;
  display: flex;
  align-items: flex-end;
  background: #fafafa;
}

.exploreHero--forYou {
  background:
    radial-gradient(90% 180% at 20% 0%, rgba(0, 0, 0, 0.10), transparent 60%),
    radial-gradient(120% 200% at 85% 30%, rgba(0, 0, 0, 0.08), transparent 55%),
    linear-gradient(135deg, rgba(0, 0, 0, 0.04), rgba(255, 255, 255, 0.9));
}

.exploreHero--trending {
  align-items: center;
  background:
    radial-gradient(120% 200% at 40% 0%, rgba(0, 0, 0, 0.06), transparent 60%),
    radial-gradient(100% 180% at 70% 50%, rgba(0, 0, 0, 0.08), transparent 55%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.95), rgba(250, 250, 250, 0.8));
}

.exploreHeroShade {
  position: absolute;
  inset: 0;
  background: linear-gradient(0deg, rgba(255, 255, 255, 0.92), rgba(255, 255, 255, 0.15));
}

.exploreHeroInner {
  position: relative;
  padding: 16px;
  width: 100%;
}

.exploreHeroKicker {
  color: rgba(36, 36, 36, 0.85);
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 0.02em;
  text-transform: uppercase;
}

.exploreHeroTitle {
  margin-top: 6px;
  font-size: 32px;
  font-weight: 900;
  letter-spacing: -0.03em;
}

.exploreHeroSub {
  margin-top: 6px;
  color: rgba(36, 36, 36, 0.74);
  font-size: 14px;
  line-height: 1.35;
}

.exploreHeroBtn {
  margin-top: 12px;
  width: fit-content;
  padding: 10px 16px;
  border-radius: 999px;
  border: 1px solid rgba(0, 0, 0, 0.16);
  background: rgba(255, 255, 255, 0.7);
  font-weight: 900;
}

.exploreHeroBtn:hover {
  background: rgba(255, 255, 255, 0.95);
}

.exploreSectionHeader {
  padding: 12px 16px;
  font-size: 20px;
  font-weight: 900;
  letter-spacing: -0.01em;
}

.exploreList {
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
}

.exploreEmpty {
  padding: 18px 16px;
  color: var(--text-muted);
  font-size: 14px;
  line-height: 1.35;
}

.exploreInlineTag {
  color: var(--text);
  font-weight: 900;
}

.exploreStory {
  width: 100%;
  text-align: left;
  padding: 14px 16px;
  border-bottom: 1px solid var(--border);
}

.exploreStory:hover {
  background: rgba(0, 0, 0, 0.02);
}

.exploreStoryTitle {
  font-weight: 800;
  font-size: 16px;
  line-height: 1.25;
  letter-spacing: -0.01em;
}

.exploreStoryMeta {
  margin-top: 6px;
  color: var(--text-muted);
  font-size: 13px;
}

.exploreTrend {
  width: 100%;
  text-align: left;
  padding: 14px 16px;
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.exploreTrend:hover {
  background: rgba(0, 0, 0, 0.02);
}

.exploreTrendMeta {
  color: var(--text-muted);
  font-size: 13px;
}

.exploreTrendTag {
  margin-top: 2px;
  font-weight: 900;
  font-size: 16px;
  letter-spacing: -0.01em;
}

.exploreTrendCount {
  margin-top: 4px;
  color: var(--text-muted);
  font-size: 13px;
}

.exploreTrendMore {
  color: var(--text-muted);
  margin-top: 4px;
}

/* Post Composer */
.composer {
  padding: 16px;
  border-bottom: 1px solid var(--border);
  display: flex;
  gap: 12px;
}

.composerMain {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.composerMain--reddit {
  gap: 12px;
}

.composerTopRow {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.composerCommunity {
  padding: 10px 14px;
  border-radius: 999px;
  border: 1px solid var(--border);
  background: #ffffff;
  font-weight: 800;
  color: var(--text-muted);
}

.composerDrafts {
  color: var(--text-muted);
  font-weight: 800;
  font-size: 13px;
}

.composerLang select {
  border: 1px solid var(--border);
  border-radius: 999px;
  padding: 10px 12px;
  background: #ffffff;
  color: var(--text);
  font-weight: 800;
  font-size: 13px;
}

.composerTabs {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 2px;
}

.composerTab {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 10px;
  border-radius: 10px;
  color: var(--text-muted);
  font-weight: 800;
  font-size: 13px;
}

.composerTab:hover {
  background: rgba(0, 0, 0, 0.02);
  color: var(--text);
}

.composerTab:disabled {
  opacity: 0.5;
}

.composerTab--active {
  color: var(--text);
  position: relative;
}

.composerTab--active::after {
  content: "";
  position: absolute;
  left: 12px;
  right: 12px;
  bottom: -2px;
  height: 3px;
  border-radius: 999px;
  background: var(--accent);
}

.composerCard {
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 12px;
  background: #ffffff;
}

.composerTitleRow {
  display: flex;
  align-items: center;
  gap: 12px;
}

.composerTitleInput {
  flex: 1;
  border: none;
  outline: none;
  font-size: 18px;
  font-weight: 900;
  letter-spacing: -0.01em;
  padding: 10px 8px;
  background: transparent;
  color: var(--text);
}

.composerTitleInput::placeholder {
  color: var(--text-muted);
}

.composerTitleCount {
  color: var(--text-muted);
  font-size: 12px;
  font-variant-numeric: tabular-nums;
}

.composerTagRow {
  margin-top: 6px;
}

.composerTagsBtn {
  padding: 8px 12px;
  border-radius: 999px;
  border: 1px solid var(--border);
  background: #ffffff;
  color: var(--text-muted);
  font-weight: 800;
  font-size: 13px;
}

.composerTagsBtn:hover {
  background: rgba(0, 0, 0, 0.02);
  color: var(--text);
}

.composerEditor {
  margin-top: 10px;
  border: 1px solid var(--border);
  border-radius: 14px;
  overflow: hidden;
}

.composerToolbar {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 10px;
  border-bottom: 1px solid var(--border);
  background: #fafafa;
}

.composerToolBtn {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  display: grid;
  place-items: center;
  color: var(--text-muted);
}

.composerToolBtn:disabled {
  opacity: 0.55;
}

.composerToolSep {
  width: 1px;
  height: 18px;
  background: var(--border);
  margin: 0 6px;
}

.composerBody {
  font-size: 15px;
  padding: 12px 10px;
  min-height: 120px;
}

.composerActions {
  display: inline-flex;
  align-items: center;
  gap: 10px;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #eaeaea;
  border: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  color: var(--text);
  flex-shrink: 0;
}

.dangerBtn {
  width: 100%;
  padding: 12px 14px;
  border-radius: 999px;
  border: 1px solid rgba(244, 33, 46, 0.55);
  background: rgba(244, 33, 46, 0.1);
  color: var(--text);
  font-weight: 800;
}

.dangerBtn:hover {
  background: rgba(244, 33, 46, 0.14);
}

.finePrint {
  color: var(--text-muted);
  font-size: 13px;
  margin-top: 10px;
  line-height: 1.35;
}

.followItem {
  padding: 12px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.followMeta {
  text-align: left;
}

.followBtn {
  background: transparent;
  border: 1px solid var(--border);
  color: var(--text);
  padding: 8px 16px;
  border-radius: 999px;
  font-weight: 800;
}

.followBtn:hover {
  background: var(--bg-hover);
}

/* Mobile Nav */
.mobileNav {
  display: none;
}

.mobileOnly {
  display: none;
}

@media (max-width: 1265px) {
  .nav { width: 88px; }
  .navText, .primaryCta span, .brandText { display: none; }
  .primaryCta { width: 50px; height: 50px; padding: 0; display: flex; align-items: center; justify-content: center; }
  .mobileOnly { display: inline-flex; }
  .brandLogoImg { height: 50px; width: auto; }
}

@media (max-width: 1000px) {
  .sidebar { display: none; }
}

@media (max-width: 700px) {
  .nav { display: none; }
  .mobileNav {
    display: flex;
    position: fixed;
    bottom: 0;
    width: 100%;
    background: var(--bg);
    border-top: 1px solid var(--border);
    justify-content: space-around;
    padding: 10px 0;
    z-index: 100;
  }

  .mobileNavItem {
    padding: 8px 10px;
    border-radius: 999px;
  }

  .mobileNavItem:hover {
    background: var(--bg-hover);
  }
}

/* Settings System Styles */
.settingsLayout {
  display: flex;
  min-height: 100vh;
  width: 100%;
}

.settingsNavColumn {
  width: 350px;
  border-right: 1px solid var(--border);
  flex-shrink: 0;
}

.settingsContentColumn {
  flex: 1;
  background: var(--bg);
  min-width: 0;
}

.settingsSectionHeader {
  padding: 12px 16px;
  border-bottom: 1px solid var(--border);
  position: sticky;
  top: 0;
  background: var(--glass);
  backdrop-filter: blur(12px);
  z-index: 5;
  display: flex;
  align-items: center;
  gap: 20px;
}

.settingsHeaderTitle {
  font-size: 20px;
  font-weight: 700;
}

.settingsGroup {
  padding: 12px 16px;
  color: var(--text-muted);
  font-size: 13px;
  line-height: 1.35;
}

.settingsItem {
  width: 100%;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  text-align: left;
  border-bottom: 1px solid transparent;
}

.settingsItem:hover {
  background: var(--bg-hover);
}

.settingsItem--active {
  background: var(--bg-hover);
  border-right: 2px solid var(--accent);
}

.settingsItemTitle {
  font-size: 15px;
  font-weight: 400;
  color: var(--text);
}

.settingsItem--active .settingsItemTitle {
  font-weight: 700;
}

.settingsItemLeftGroup {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  min-width: 0;
}

.settingsItemLeftIcon {
  width: 34px;
  height: 34px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  color: var(--text-muted);
  flex-shrink: 0;
}

.settingsItemLeftIcon svg {
  width: 18px;
  height: 18px;
}

.settingsItemMain {
  flex: 1;
  min-width: 0;
}

.settingsItemTitle {
  font-size: 15px;
  font-weight: 500;
  color: var(--text);
}

.settingsItemSub {
  font-size: 13px;
  color: var(--text-muted);
  margin-top: 2px;
}

.settingsChevron {
  color: var(--text-muted);
  opacity: 0.5;
}

/* Settings: Display */
.displaySection {
  padding: 16px;
  border-top: 1px solid var(--border);
}

.displaySectionTitle {
  font-size: 20px;
  font-weight: 900;
  letter-spacing: -0.01em;
}

.displaySliderRow {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 12px;
}

.displayAa {
  color: var(--text-muted);
  font-weight: 900;
  font-size: 13px;
  width: 28px;
  text-align: center;
  user-select: none;
}

.displayAa--lg {
  font-size: 18px;
  width: 32px;
}

.displaySlider {
  flex: 1;
  accent-color: var(--accent);
}

.displaySwatches {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-top: 12px;
  flex-wrap: wrap;
}

.displaySwatch {
  width: 44px;
  height: 44px;
  border-radius: 999px;
  border: 2px solid transparent;
  display: grid;
  place-items: center;
}

.displaySwatch:hover {
  filter: brightness(1.04);
}

.displaySwatch--active {
  box-shadow: 0 0 0 3px var(--bg), 0 0 0 5px var(--accent);
}

.displayBackgroundGrid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-top: 12px;
}

.displayBackgroundGrid.isDisabled {
  opacity: 0.65;
}

.displayBackgroundCard {
  padding: 14px 16px;
  border-radius: 16px;
  border: 1px solid var(--border);
  background: var(--widget-bg);
  display: flex;
  align-items: center;
  gap: 12px;
  justify-content: center;
  min-height: 72px;
  font-weight: 900;
}

.displayBackgroundCard:hover:enabled {
  background: var(--bg-hover);
}

.displayBackgroundCard.isSelected {
  border-color: var(--accent);
  box-shadow: inset 0 0 0 1px var(--accent);
}

.displayRadio {
  width: 22px;
  height: 22px;
  border-radius: 999px;
  border: 2px solid var(--border);
  display: grid;
  place-items: center;
  color: var(--accent);
  background: transparent;
}

.displayBackgroundCard.isSelected .displayRadio {
  border-color: var(--accent);
}

.displayBackgroundLabel {
  font-size: 15px;
}

.displayToggleRow {
  margin-top: 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  padding: 14px 0 2px;
}

.displayToggleTitle {
  font-weight: 900;
}

.displayToggleSub {
  margin-top: 4px;
  font-size: 13px;
  color: var(--text-muted);
  line-height: 1.3;
}

.displaySwitch {
  position: relative;
  display: inline-flex;
  align-items: center;
}

.displaySwitch input {
  position: absolute;
  opacity: 0;
  width: 44px;
  height: 24px;
  margin: 0;
  cursor: pointer;
}

.displaySwitchTrack {
  width: 44px;
  height: 24px;
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.25);
  background: color-mix(in srgb, var(--text-muted), transparent 55%);
  border: 1px solid var(--border);
  position: relative;
  transition: background 160ms ease, border-color 160ms ease;
}

.displaySwitchTrack::after {
  content: "";
  position: absolute;
  top: 2px;
  left: 2px;
  width: 20px;
  height: 20px;
  border-radius: 999px;
  background: var(--bg);
  border: 1px solid var(--border);
  transition: transform 160ms ease;
}

.displaySwitch input:checked + .displaySwitchTrack {
  background: var(--accent);
  border-color: var(--accent);
}

.displaySwitch input:checked + .displaySwitchTrack::after {
  transform: translateX(20px);
}

/* Modals */
.modalOverlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.modalContent {
  background: var(--bg);
  width: 100%;
  max-width: 600px;
  border-radius: 16px;
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
  max-height: 90vh;
}

.modalHeader {
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 24px;
}

.modalTitle {
  font-size: 20px;
  font-weight: 700;
}

.modalBody {
  padding: 16px;
  overflow-y: auto;
}

.modalFooter {
  padding: 12px 16px;
  display: flex;
  justify-content: flex-end;
  border-top: 1px solid var(--border);
}

/* Inputs & Forms */
.settingsInputGroup {
  margin-bottom: 24px;
}

.settingsLabel {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-muted);
  margin-bottom: 8px;
}

.settingsInputField {
  width: 100%;
  padding: 12px;
  border: 1px solid var(--border);
  border-radius: 4px;
  background: var(--bg);
  color: var(--text);
  font-size: 16px;
}

.settingsInputField:focus {
  border-color: var(--accent);
  outline: none;
}

.settingsSearchFieldWrap {
  position: relative;
  width: 100%;
}

.settingsSearchIcon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-muted);
  pointer-events: none;
}

.settingsSearchInput {
  width: 100%;
  padding: 8px 12px 8px 40px;
  border-radius: 999px;
  border: 1px solid var(--border);
  background: var(--bg);
  color: var(--text);
  font-size: 15px;
  outline: none;
}

.settingsSearchInput:focus {
  border-color: var(--accent);
  background: transparent;
}

/* Calendar Picker */
.calendarContainer {
  display: flex;
  gap: 12px;
  padding: 12px 0;
}

.calendarCol {
  flex: 1;
  height: 200px;
  overflow-y: scroll;
  -ms-overflow-style: none;
  scrollbar-width: none;
  position: relative;
  border: 1px solid var(--border);
  border-radius: 8px;
}

.calendarCol::-webkit-scrollbar {
  display: none;
}

.calendarItem {
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  cursor: pointer;
}

.calendarItem:hover {
  background: var(--bg-hover);
}

.calendarItem--selected {
  font-weight: 700;
  color: var(--accent);
  background: var(--bg-hover);
}

/* Specific items */
.verifiedLabel {
  color: var(--accent);
  font-weight: 600;
}

.otpInputContainer {
  display: flex;
  gap: 12px;
  margin-top: 12px;
}

.otpBox {
  width: 50px;
  height: 60px;
  border: 1px solid var(--border);
  border-radius: 8px;
  font-size: 24px;
  text-align: center;
  font-weight: 700;
}

.editProfileHero {
  position: relative;
}

.editProfileBanner {
  width: 100%;
  aspect-ratio: 3 / 1;
  background: #333;
}

.editProfileAvatarWrap {
  position: absolute;
  left: 16px;
  bottom: -40px;
  width: 112px;
  height: 112px;
  border-radius: 50%;
  border: 4px solid var(--bg);
  background: #444;
  overflow: hidden;
}

.profileEditForm {
  margin-top: 50px;
  padding: 16px;
}

.backBtn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: grid;
  place-items: center;
}

.backBtn:hover {
  background: var(--bg-hover);
}
`;

export default function GlobalStyles() {
  return <style>{GLOBAL_CSS}</style>;
}
