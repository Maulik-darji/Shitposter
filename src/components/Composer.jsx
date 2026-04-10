import React, { useLayoutEffect, useState } from "react";
import { Bold, Code, Image, Italic, Link2, List, ListOrdered, Quote, Repeat } from "lucide-react";
import { SHIT_TAG_MARK } from "../lib/hashtags";

const MAX_BODY = 700;
const MAX_TITLE = 300;

export default function Composer({
  composerTitleRef,
  composerBodyRef,
  title,
  body,
  onTitleChange,
  onBodyChange,
  language,
  languages,
  onLanguageChange,
  onSubmit,
  canPost,
}) {
  const [tab, setTab] = useState("text");

  function autosize() {
    const el = composerBodyRef?.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }

  useLayoutEffect(() => {
    autosize();
  }, [body]);

  function insertShitMarkInto(el, value, setValue) {
    if (!el) return;
    const start = el.selectionStart ?? value.length;
    const end = el.selectionEnd ?? value.length;
    const next = `${value.slice(0, start)}${SHIT_TAG_MARK}${value.slice(end)}`;
    setValue(next);
    requestAnimationFrame(() => {
      el.focus();
      const pos = start + SHIT_TAG_MARK.length;
      el.setSelectionRange(pos, pos);
    });
  }

  return (
    <section className="composer" aria-label="Create post">
      <div className="avatar">U</div>

      <form className="composerMain composerMain--reddit" onSubmit={onSubmit}>
        <div className="composerTopRow">
          <button className="composerCommunity" type="button" disabled title="Communities are not enabled yet">
            Select a community
          </button>
          <label className="composerLang">
            <span className="srOnly">Language</span>
            <select
              value={language || ""}
              onChange={(e) => onLanguageChange?.(e.target.value)}
              aria-label="Post language"
              title="Post language"
            >
              {(languages && languages.length ? languages : ["English"]).map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </label>
          <div className="composerDrafts" title="Drafts are not enabled yet">
            Drafts
          </div>
        </div>

        <div className="composerTabs" role="tablist" aria-label="Create post type">
          <button
            className={`composerTab ${tab === "text" ? "composerTab--active" : ""}`}
            type="button"
            role="tab"
            aria-selected={tab === "text"}
            onClick={() => setTab("text")}
          >
            Text
          </button>
          <button className="composerTab" type="button" disabled title="Text-only on Shitposter">
            <Image size={16} aria-hidden="true" /> Images &amp; Video
          </button>
          <button className="composerTab" type="button" disabled title="Text-only on Shitposter">
            <Link2 size={16} aria-hidden="true" /> Link
          </button>
          <button className="composerTab" type="button" disabled title="Text-only on Shitposter">
            <Repeat size={16} aria-hidden="true" /> Poll
          </button>
        </div>

        <div className="composerCard">
          <div className="composerTitleRow">
            <input
              ref={composerTitleRef}
              className="composerTitleInput"
              type="text"
              placeholder="Title*"
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key !== "#") return;
                e.preventDefault();
                insertShitMarkInto(e.currentTarget, title, onTitleChange);
              }}
              maxLength={MAX_TITLE}
            />
            <div className="composerTitleCount" aria-live="polite">
              {title.length}/{MAX_TITLE}
            </div>
          </div>

          <div className="composerTagRow">
            <button
              className="composerTagsBtn"
              type="button"
              onClick={() => composerBodyRef.current?.focus()}
              title="Use #tag (becomes 💩tag)"
            >
              Add tags
            </button>
          </div>

          <div className="composerEditor">
            <div className="composerToolbar" aria-label="Formatting toolbar (prototype)">
              <button className="composerToolBtn" type="button" disabled title="Formatting is not enabled yet">
                <Bold size={16} />
              </button>
              <button className="composerToolBtn" type="button" disabled title="Formatting is not enabled yet">
                <Italic size={16} />
              </button>
              <button className="composerToolBtn" type="button" disabled title="Formatting is not enabled yet">
                <Quote size={16} />
              </button>
              <button className="composerToolBtn" type="button" disabled title="Formatting is not enabled yet">
                <Code size={16} />
              </button>
              <div className="composerToolSep" aria-hidden="true" />
              <button className="composerToolBtn" type="button" disabled title="Formatting is not enabled yet">
                <List size={16} />
              </button>
              <button className="composerToolBtn" type="button" disabled title="Formatting is not enabled yet">
                <ListOrdered size={16} />
              </button>
            </div>

            <textarea
              ref={composerBodyRef}
              className="composerBody"
              placeholder="Body text (optional)"
              value={body}
              onChange={(e) => onBodyChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key !== "#") return;
                e.preventDefault();
                insertShitMarkInto(e.currentTarget, body, onBodyChange);
              }}
              maxLength={MAX_BODY}
            />
          </div>

          <div className="composerBottom">
            <div className="composerMeta" aria-live="polite">
              {body.length}/{MAX_BODY}
            </div>
            <div className="composerActions">
              <button className="ghostBtn" type="button" disabled title="Drafts are not enabled yet">
                Save Draft
              </button>
              <button className="postBtn" type="submit" disabled={!canPost}>
                Post
              </button>
            </div>
          </div>
        </div>
      </form>
    </section>
  );
}
