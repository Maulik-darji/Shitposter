import React from "react";

const GLOBAL_CSS = `
:root {
  --bg: #181818;
  --bg-hover: rgba(231, 233, 234, 0.1);
  --border: rgb(47, 51, 54);
  --text: #e7e9ea;
  --text-muted: #71767b;
  --accent: #1d9bf0;
  --accent-hover: #1a8cd8;
  --cta-bg: #e7e9ea;
  --cta-text: #0f1419;
  --cta-bg-hover: #d7dbdc;
  --danger: #f4212e;
  --success: #00ba7c;
  --font: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  --radius: 16px;
  --sidebar-width: 275px;
  --feed-width: 600px;
  --right-width: 350px;
  --widget-bg: #16181c;
  --chip-bg: #0a0a0a;
}

html[data-theme="light"] {
  --bg: #ffffff;
  --bg-hover: rgba(15, 20, 25, 0.1);
  --border: rgb(239, 243, 244);
  --text: #0f1419;
  --text-muted: #536471;
  --accent: #1d9bf0;
  --accent-hover: #1a8cd8;
  --cta-bg: #0f1419;
  --cta-text: #ffffff;
  --cta-bg-hover: #272c30;
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
  line-height: 1.3;
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
  background: rgba(24, 24, 24, 0.75);
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

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #1f2328;
  border: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  color: white;
  flex-shrink: 0;
}

textarea {
  width: 100%;
  border: none;
  background: none;
  color: var(--text);
  font-size: 20px;
  resize: none;
  outline: none;
  padding: 12px 0;
  min-height: 60px;
  overflow: hidden;
}

textarea::placeholder {
  color: var(--text-muted);
}

.composerBottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 12px;
  border-top: 1px solid var(--border);
}

.composerMeta {
  color: var(--text-muted);
  font-size: 13px;
  font-variant-numeric: tabular-nums;
}

.postBtn {
  background: var(--cta-bg);
  color: var(--cta-text);
  font-weight: 700;
  padding: 8px 16px;
  border-radius: 999px;
  font-size: 15px;
}

.postBtn:hover {
  background: var(--cta-bg-hover);
}

.postBtn:disabled {
  opacity: 0.5;
}

/* Timeline Posts */
.post {
  padding: 12px 16px;
  border-bottom: 1px solid var(--border);
  display: flex;
  gap: 12px;
  cursor: pointer;
  transition: background 0.2s;
  background: linear-gradient(0deg, var(--postTintBg, transparent), var(--postTintBg, transparent));
  box-shadow: inset 3px 0 0 var(--postTintBorder, transparent);
  position: relative;
  overflow: hidden;
}

.post:hover {
  background:
    linear-gradient(0deg, rgba(231, 233, 234, 0.03), rgba(231, 233, 234, 0.03)),
    linear-gradient(0deg, var(--postTintBg, transparent), var(--postTintBg, transparent));
}

.post--viral {
  box-shadow:
    inset 3px 0 0 rgba(29, 155, 240, 0.9),
    inset 0 0 0 1px rgba(29, 155, 240, 0.08);
}

.postContent {
  flex: 1;
}

.postBurst {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  pointer-events: none;
}

.postBurstIcon {
  width: 84px;
  height: 84px;
  filter: drop-shadow(0 10px 30px rgba(0, 0, 0, 0.55));
  animation: postBurstPop 650ms ease-out both;
  object-fit: contain;
}

@keyframes postBurstPop {
  0% {
    transform: scale(0.65);
    opacity: 0;
  }
  20% {
    transform: scale(1.12);
    opacity: 1;
  }
  100% {
    transform: scale(1.0);
    opacity: 0;
  }
}

.shitIcon {
  display: inline-block;
  width: 18px;
  height: 18px;
  object-fit: contain;
  filter: drop-shadow(0 0 1px rgba(0, 0, 0, 0.6));
}

.postHeader {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 2px;
}

.postName {
  font-weight: 700;
  color: var(--text);
}

.postHandle, .postTime {
  color: var(--text-muted);
  font-size: 15px;
}

.postText {
  font-size: 15px;
  line-height: 1.5;
  white-space: pre-wrap;
  word-wrap: break-word;
  margin-bottom: 12px;
}

.shitTag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 1px 6px 1px 4px;
  border-radius: 999px;
  background: rgba(231, 233, 234, 0.06);
  border: 1px solid rgba(231, 233, 234, 0.12);
}

.shitTagIcon {
  opacity: 0.95;
}

.shitTagText {
  color: var(--text);
  font-weight: 700;
  letter-spacing: -0.01em;
}

.postActions {
  display: flex;
  justify-content: space-between;
  max-width: 425px;
  color: var(--text-muted);
}

.action {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  padding: 8px 10px;
  border-radius: 999px;
  position: relative;
}

.action:hover {
  background: rgba(231, 233, 234, 0.06);
}

.action--shit:hover { color: #f59e0b; }

.action--shit.isActive {
  background: rgba(245, 158, 11, 0.14);
  box-shadow: inset 0 0 0 1px rgba(245, 158, 11, 0.35);
}

/* Tooltip (X-like simple hover label) */
.action[data-tip]::after {
  content: attr(data-tip);
  position: absolute;
  left: 50%;
  bottom: calc(100% + 10px);
  transform: translateX(-50%);
  padding: 6px 10px;
  border-radius: 999px;
  border: 1px solid var(--border);
  background: rgba(15, 20, 25, 0.92);
  color: #ffffff;
  font-size: 12px;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 120ms ease, transform 120ms ease;
}

.action[data-tip]:hover::after,
.action[data-tip]:focus-visible::after {
  opacity: 1;
  transform: translateX(-50%) translateY(-2px);
}

/* Right Sidebar (Widgets) */
.sidebar {
  width: var(--right-width);
  padding: 12px 20px 64px 30px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.searchWrapper {
  position: sticky;
  top: 0;
  background: var(--bg);
  padding: 4px 0 12px;
  z-index: 10;
}

.searchField {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #202327;
  padding: 12px 20px;
  border-radius: 999px;
  border: 1px solid transparent;
}

.searchIcon {
  color: var(--text-muted);
}

.searchField:focus-within {
  background: var(--bg);
  border-color: var(--accent);
}

.searchField input {
  background: none;
  border: none;
  outline: none;
  color: var(--text);
  font-size: 15px;
  width: 100%;
}

.widget {
  background: var(--widget-bg);
  border-radius: 16px;
  overflow: hidden;
}

.widgetHeader {
  padding: 12px 16px;
  font-size: 20px;
  font-weight: 800;
}

.widgetItem {
  padding: 12px 16px;
  transition: background 0.2s;
  cursor: pointer;
  width: 100%;
  text-align: left;
}

.widgetItem:hover {
  background: rgba(255, 255, 255, 0.03);
}

.widgetSubtitle {
  color: var(--text-muted);
  font-size: 13px;
}

.widgetTitle {
  font-weight: 700;
  font-size: 15px;
  margin: 2px 0;
}

.widgetMeta {
  color: var(--text-muted);
  font-size: 13px;
}

.widgetMore {
  padding: 16px;
  color: var(--accent);
  font-size: 15px;
  width: 100%;
  text-align: left;
}

.widgetMore:hover {
  background: rgba(255, 255, 255, 0.03);
}

/* Notifications */
.notifList {
  display: flex;
  flex-direction: column;
}

.notifItem {
  padding: 14px 16px;
  border-bottom: 1px solid var(--border);
}

.notifTitle {
  font-weight: 900;
  letter-spacing: -0.01em;
}

.notifBody {
  margin-top: 6px;
  color: var(--text);
  font-size: 14px;
}

.notifPostPreview {
  margin-top: 10px;
  color: var(--text-muted);
  font-size: 13px;
}

.notifMeta {
  margin-top: 10px;
  color: var(--text-muted);
  font-size: 12px;
}

/* Profile */
.profileHeader {
  border-bottom: 1px solid var(--border);
}

.profileBanner {
  height: 140px;
  background: linear-gradient(90deg, rgba(29, 155, 240, 0.35), rgba(244, 33, 46, 0.2));
}

.profileInfo {
  padding: 12px 16px 16px;
  position: relative;
}

.profileAvatar {
  width: 72px;
  height: 72px;
  border-radius: 999px;
  background: #1f2328;
  border: 4px solid var(--bg);
  display: grid;
  place-items: center;
  font-weight: 900;
  position: absolute;
  top: -36px;
  left: 16px;
}

.profileNameRow {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding-top: 44px;
}

.profileName {
  font-size: 20px;
  font-weight: 900;
}

.profileHandle {
  color: var(--text-muted);
  margin-top: 4px;
}

.profileMeta {
  color: var(--text-muted);
  margin-top: 10px;
  font-size: 13px;
}

.profileTabs {
  display: flex;
  border-bottom: 1px solid var(--border);
  position: sticky;
  top: 0;
  z-index: 9;
  background: rgba(24, 24, 24, 0.75);
  backdrop-filter: blur(12px);
}

.profileTab {
  flex: 1;
  padding: 14px 12px;
  color: var(--text-muted);
  font-weight: 700;
  position: relative;
}

.profileTab:hover {
  background: rgba(231, 233, 234, 0.04);
  color: var(--text);
}

.profileTab--active {
  color: var(--text);
}

.profileTab--active::after {
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

/* Settings */
.settingsList {
  padding: 8px 0 20px;
}

.settingsItem {
  width: 100%;
  text-align: left;
  padding: 14px 16px;
  border-bottom: 1px solid var(--border);
}

.settingsItem:hover {
  background: rgba(255, 255, 255, 0.03);
}

.settingsItemTitle {
  font-weight: 900;
  font-size: 15px;
}

.settingsItemSub {
  margin-top: 4px;
  color: var(--text-muted);
  font-size: 13px;
}

.widgetBody {
  padding: 12px 16px 16px;
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
  background: #ffffff;
  color: #0f1419;
  padding: 8px 16px;
  border-radius: 999px;
  font-weight: 800;
}

.followBtn:hover {
  filter: brightness(0.95);
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
    background: rgba(231, 233, 234, 0.06);
  }
}
`;

export default function GlobalStyles() {
  return <style>{GLOBAL_CSS}</style>;
}
