import React, { useState, useEffect, useRef } from "react";
import { updateAccount, verifyPassword, accountAge, formatBirthdate } from "../lib/accountStorage";

export function SettingsHeader({ title, onBack }) {
  return (
    <div className="settingsSectionHeader">
      {onBack && (
        <button onClick={onBack} className="backBtn">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
            <path d="M7.414 13l5.043 5.04-1.414 1.42L3.586 12l7.457-7.46 1.414 1.42L7.414 11H21v2H7.414z" />
          </svg>
        </button>
      )}
      <div className="settingsHeaderTitle">{title}</div>
    </div>
  );
}

export function SettingsItem({ title, sub, onClick, right, active, danger, left }) {
  return (
    <button
      className={`settingsItem ${active ? "settingsItem--active" : ""}`}
      onClick={onClick}
      type="button"
    >
      <div className="settingsItemLeftGroup">
        {left ? <div className="settingsItemLeftIcon" aria-hidden="true">{left}</div> : null}
        <div className="settingsItemMain">
          <div className={`settingsItemTitle ${danger ? "dangerBtn" : ""}`}>{title}</div>
          {sub && <div className="settingsItemSub">{sub}</div>}
        </div>
      </div>
      <div className="settingsChevron">
        {right || (
          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
            <path d="M14.586 12L7.543 4.96l1.414-1.42L17.414 12l-8.457 8.46-1.414-1.42L14.586 12z" />
          </svg>
        )}
      </div>
    </button>
  );
}

export function Modal({ title, children, onClose, onAction, actionLabel, actionDanger }) {
  return (
    <div className="modalOverlay" onClick={onClose}>
      <div className="modalContent" onClick={(e) => e.stopPropagation()}>
        <div className="modalHeader">
          <button onClick={onClose}>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M10.584 12L3.541 4.96l1.414-1.42L12 10.58l7.043-7.04 1.414 1.42L13.414 12l7.043 7.04-1.414 1.42L12 13.42l-7.043 7.04-1.414-1.42L10.584 12z" />
            </svg>
          </button>
          <div className="modalTitle">{title}</div>
        </div>
        <div className="modalBody">{children}</div>
        {onAction && (
          <div className="modalFooter">
            <button
              className={`primaryCta ${actionDanger ? "dangerBtn" : ""}`}
              onClick={onAction}
              style={{ width: "auto", padding: "8px 24px", marginTop: 0 }}
            >
              {actionLabel || "Save"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export function PasswordGate({ onVerified }) {
  const [pass, setPass] = useState("");
  const [error, setError] = useState(false);

  const handleVerify = () => {
    if (verifyPassword(pass)) {
      onVerified();
    } else {
      setError(true);
    }
  };

  return (
    <div style={{ padding: "40px 20px", textAlign: "center" }}>
      <h2 style={{ marginBottom: 12 }}>Confirm your password</h2>
      <p style={{ color: "var(--text-muted)", marginBottom: 24 }}>
        Please enter your password in order to get access to this.
      </p>
      <div className="settingsInputGroup" style={{ maxWidth: 400, margin: "0 auto" }}>
        <input
          type="password"
          className="settingsInputField"
          placeholder="Password"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
          autoFocus
        />
        {error && <div style={{ color: "var(--danger)", marginTop: 8 }}>Wrong password. Try again.</div>}
      </div>
      <button
        className="primaryCta"
        onClick={handleVerify}
        style={{ maxWidth: 400, marginTop: 24 }}
      >
        Confirm
      </button>
    </div>
  );
}

export function VerificationFlow({ type, initialValue, onComplete }) {
  const [step, setStep] = useState(1); // 1: input, 2: otp
  const [value, setValue] = useState(initialValue);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const otpRefs = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()];

  const handleNext = () => setStep(2);

  const handleOtpChange = (index, val) => {
    if (val.length > 1) val = val[0];
    const newOtp = [...otp];
    newOtp[index] = val;
    setOtp(newOtp);

    if (val && index < 5) {
      otpRefs[index + 1].current.focus();
    }

    if (newOtp.every((v) => v !== "")) {
      // Auto complete
      setTimeout(() => onComplete(value), 500);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      {step === 1 ? (
        <>
          <h3>Change {type}</h3>
          <div className="settingsInputGroup" style={{ marginTop: 20 }}>
            <label className="settingsLabel">Current</label>
            <input className="settingsInputField" value={initialValue} disabled />
          </div>
          <div className="settingsInputGroup">
            <label className="settingsLabel">New {type}</label>
            <input
              className="settingsInputField"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              autoFocus
            />
          </div>
          <button className="primaryCta" onClick={handleNext}>
            Next
          </button>
        </>
      ) : (
        <div style={{ textAlign: "center" }}>
          <h3>We sent you a code</h3>
          <p style={{ color: "var(--text-muted)", marginTop: 8 }}>
            Enter it below to verify your {type}.
          </p>
          <div className="otpInputContainer" style={{ justifyContent: "center", marginTop: 32 }}>
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={otpRefs[i]}
                className="otpBox"
                value={digit}
                onChange={(e) => handleOtpChange(i, e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Backspace" && !digit && i > 0) {
                    otpRefs[i - 1].current.focus();
                  }
                }}
              />
            ))}
          </div>
          <button
            className="ghostBtn"
            style={{ marginTop: 32, color: "var(--accent)" }}
            onClick={() => setStep(1)}
          >
            Didn't receive a code?
          </button>
        </div>
      )}
    </div>
  );
}

export function CustomCalendar({ initialDate, onSave, onClose }) {
  const d = new Date(initialDate || "2000-01-01");
  const [day, setDay] = useState(d.getDate());
  const [month, setMonth] = useState(d.getMonth());
  const [year, setYear] = useState(d.getFullYear());

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const years = Array.from({ length: 120 }, (_, i) => new Date().getFullYear() - i);

  const handleSave = () => {
    const formatted = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    onSave(formatted);
  };

  return (
    <Modal title="Edit birth date" onAction={handleSave} onClose={onClose}>
      <div style={{ padding: "0 8px" }}>
        <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 20 }}>
          This will not be shown publicly. Confirm your own age, even if this account is for a business, a pet, or something else.
        </p>
        <div className="calendarContainer">
          <div className="calendarCol">
            {months.map((m, i) => (
              <div
                key={m}
                className={`calendarItem ${month === i ? "calendarItem--selected" : ""}`}
                onClick={() => setMonth(i)}
              >
                {m}
              </div>
            ))}
          </div>
          <div className="calendarCol">
            {days.map((d) => (
              <div
                key={d}
                className={`calendarItem ${day === d ? "calendarItem--selected" : ""}`}
                onClick={() => setDay(d)}
              >
                {d}
              </div>
            ))}
          </div>
          <div className="calendarCol">
            {years.map((y) => (
              <div
                key={y}
                className={`calendarItem ${year === y ? "calendarItem--selected" : ""}`}
                onClick={() => setYear(y)}
              >
                {y}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
}

export function LanguageModal({ currentLanguages, onSave, onClose }) {
  const [selected, setSelected] = useState(currentLanguages || []);
  const [search, setSearch] = useState("");

  const allLanguages = [
    { id: "en-gb", name: "British English - British English" },
    { id: "hi", name: "Hindi - \u0939\u093f\u0928\u094d\u0926\u0940" },
    { id: "bn", name: "Bangla - \u09ac\u09be\u0982\u09b2\u09be" },
    { id: "mr", name: "Marathi - \u092e\u0930\u093e\u0920\u0940" },
    { id: "ta", name: "Tamil - \u0ba4\u0bae\u0bbf\u0bb4\u0bcd" },
    { id: "ur", name: "Urdu - \u0627\u0631\u062f\u0648" },
    { id: "id", name: "Indonesian - Bahasa Indonesia" },
    { id: "es", name: "Spanish - Espa\u00f1ol" },
    { id: "fr", name: "French - Fran\u00e7ais" },
    { id: "de", name: "German - Deutsch" },
  ];

  const filtered = allLanguages.filter((l) =>
    l.name.toLowerCase().includes(search.toLowerCase())
  );

  const toggle = (name) => {
    if (selected.includes(name)) {
      setSelected(selected.filter((s) => s !== name));
    } else {
      setSelected([...selected, name]);
    }
  };

  return (
    <Modal title="Select language" onAction={() => onSave(selected)} onClose={onClose} actionLabel="Next">
      <div className="settingsInputGroup">
        <input
          className="settingsInputField"
          placeholder="Search languages"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ borderRadius: 999 }}
        />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {filtered.map((lang) => (
          <label key={lang.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 0", cursor: "pointer" }}>
            <span style={{ fontWeight: 600 }}>{lang.name}</span>
            <input
              type="checkbox"
              checked={selected.includes(lang.name.split(" - ")[0])}
              onChange={() => toggle(lang.name.split(" - ")[0])}
              style={{ width: 20, height: 20 }}
            />
          </label>
        ))}
      </div>
    </Modal>
  );
}

export function EditProfileModal({ account, onSave, onClose }) {
  const [data, setData] = useState({ ...account });
  const [showCalendar, setShowCalendar] = useState(false);

  const handleSave = () => {
    updateAccount(data);
    onSave(data);
  };

  return (
    <>
      <Modal title="Edit profile" onAction={handleSave} onClose={onClose}>
        <div className="editProfileHero">
          <div className="editProfileBanner">
            <div style={{ width: "100%", height: "100%", display: "grid", placeItems: "center", background: "rgba(0,0,0,0.3)" }}>
              <svg viewBox="0 0 24 24" width="24" height="24" fill="#fff"><path d="M3 5.5C3 4.119 4.119 3 5.5 3h13C19.881 3 21 4.119 21 5.5v13c0 1.381-1.119 2.5-2.5 2.5h-13C4.119 21 3 19.881 3 18.5v-13zM5.5 5c-.276 0-.5.224-.5.5v13c0 .276.224.5.5.5h13c.276 0 .5-.224.5-.5v-13c0-.276-.224-.5-.5-.5h-13zM11 10h2v2h2v2h-2v2h-2v-2H9v-2h2v-2z" /></svg>
            </div>
          </div>
          <div className="editProfileAvatarWrap">
            <div style={{ width: "100%", height: "100%", display: "grid", placeItems: "center", background: "rgba(0,0,0,0.3)" }}>
              <svg viewBox="0 0 24 24" width="24" height="24" fill="#fff"><path d="M3 5.5C3 4.119 4.119 3 5.5 3h13C19.881 3 21 4.119 21 5.5v13c0 1.381-1.119 2.5-2.5 2.5h-13C4.119 21 3 19.881 3 18.5v-13zM5.5 5c-.276 0-.5.224-.5.5v13c0 .276.224.5.5.5h13c.276 0 .5-.224.5-.5v-13c0-.276-.224-.5-.5-.5h-13zM11 10h2v2h2v2h-2v2h-2v-2H9v-2h2v-2z" /></svg>
            </div>
          </div>
        </div>
        <div className="profileEditForm">
          <div style={{ color: "var(--accent)", cursor: "pointer", marginBottom: 24, fontSize: 13 }}>
            Edit your photo with Imagine
            <span style={{ marginLeft: 8, color: "var(--text-muted)" }}>Customize yourself in seconds</span>
          </div>
          <div className="settingsInputGroup">
            <label className="settingsLabel">Name</label>
            <input
              className="settingsInputField"
              value={data.name}
              onChange={(e) => setData({ ...data, name: e.target.value })}
            />
          </div>
          <div className="settingsInputGroup">
            <label className="settingsLabel">Bio</label>
            <textarea
              className="settingsInputField"
              style={{ minHeight: 80 }}
              value={data.bio}
              onChange={(e) => setData({ ...data, bio: e.target.value })}
            />
          </div>
          <div className="settingsInputGroup">
            <label className="settingsLabel">Location</label>
            <input
              className="settingsInputField"
              value={data.location}
              onChange={(e) => setData({ ...data, location: e.target.value })}
            />
          </div>
          <div className="settingsInputGroup">
            <label className="settingsLabel">Website</label>
            <input
              className="settingsInputField"
              value={data.website}
              onChange={(e) => setData({ ...data, website: e.target.value })}
            />
          </div>
          <div className="settingsInputGroup" onClick={() => setShowCalendar(true)} style={{ cursor: "pointer" }}>
            <label className="settingsLabel">Birth date</label>
            <div className="settingsInputField" style={{ display: "flex", justifyContent: "space-between" }}>
              <span>{formatBirthdate(data)}</span>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" style={{ opacity: 0.5 }}>
                <path d="M14.586 12L7.543 4.96l1.414-1.42L17.414 12l-8.457 8.46-1.414-1.42L14.586 12z" />
              </svg>
            </div>
          </div>
          <div style={{ color: "var(--accent)", cursor: "pointer", marginTop: 12 }}>
            Switch to professional
          </div>
        </div>
      </Modal>
      {showCalendar && (
        <CustomCalendar
          initialDate={data.birthdate}
          onSave={(date) => {
            setData({ ...data, birthdate: date });
            setShowCalendar(false);
          }}
          onClose={() => setShowCalendar(false)}
        />
      )}
    </>
  );
}
