import React from "react";

export default function SettingsPage() {
  return (
    <>
      <header className="feedHeader">
        <div className="feedTitle">Settings</div>
      </header>
      <div className="settingsList">
        <button className="settingsItem" type="button">
          <div className="settingsItemTitle">Your account</div>
          <div className="settingsItemSub">See information about your account.</div>
        </button>
        <button className="settingsItem" type="button">
          <div className="settingsItemTitle">Privacy and safety</div>
          <div className="settingsItemSub">Manage what you see and share.</div>
        </button>
        <button className="settingsItem" type="button">
          <div className="settingsItemTitle">Notifications</div>
          <div className="settingsItemSub">Choose what notifications you get.</div>
        </button>
        <button className="settingsItem" type="button">
          <div className="settingsItemTitle">Help Center</div>
          <div className="settingsItemSub">Get support and learn more.</div>
        </button>
      </div>
    </>
  );
}

