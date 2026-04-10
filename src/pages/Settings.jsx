import React, { useState, useEffect } from "react";
import { loadAccount, ensureAccount, accountAge, formatBirthdate, updateAccount } from "../lib/accountStorage";
import {
  SettingsHeader,
  SettingsItem,
  PasswordGate,
  VerificationFlow,
  Modal,
  LanguageModal,
  EditProfileModal,
} from "../components/SettingsComponents";
import { 
  User, 
  CircleDollarSign, 
  CheckCircle2, 
  Users, 
  ShieldCheck, 
  EyeOff, 
  Bell, 
  Accessibility, 
  Info,
  Lock,
  Smartphone,
  Mail,
  Trash2,
  Globe,
  Languages,
  MoreHorizontal,
  Search
} from "lucide-react";

export default function SettingsPage() {
  const [account, setAccount] = useState(null);
  const [section, setSection] = useState("root"); // root, account_info, change_username, change_phone, change_email, change_password, deactivate, gender, country, languages
  const [isVerified, setIsVerified] = useState(false);
  const [activeModal, setActiveModal] = useState(null); // edit_profile, languages
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const acc = ensureAccount();
    setAccount(acc);
    setLoading(false);
  }, []);

  const refresh = () => setAccount(loadAccount());

  const navigate = (sec) => {
    if (sec === "account_info" && !isVerified && account?.authMethod === "email") {
      setSection("password_gate");
    } else {
      setSection(sec);
    }
  };

  const updateField = (key, val) => {
    const updated = updateAccount({ [key]: val });
    setAccount(updated);
  };

  if (loading) return null;

  const renderContent = () => {
    switch (section) {
      case "root":
        return (
          <>
            <header className="settingsSectionHeader">
               <div className="settingsHeaderTitle">Your Account</div>
            </header>
            <div className="settingsGroup" style={{ padding: "16px 16px 0" }}>
              See information about your account, download an archive of your data, or learn about your account deactivation options
            </div>
            <div style={{ marginTop: 12 }}>
              <SettingsItem
                title="Account information"
                sub="See your account information like your phone number and email address."
                left={<User />}
                onClick={() => navigate("account_info")}
              />
              <SettingsItem
                title="Change your password"
                sub="Change your password at any time."
                left={<Lock />}
                onClick={() => navigate("change_password")}
              />
              <SettingsItem
                title="Download an archive of your data"
                sub="Get insights into the type of information stored for your account."
                left={<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" style={{ opacity: 0.8 }}><path d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12 20.25c-4.549 0-8.25-3.701-8.25-8.25s3.701-8.25 8.25-8.25 8.25 3.701 8.25 8.25-3.701 8.25-8.25 8.25zM12 7.5a.75.75 0 01.75.75v3.31l1.47-1.47a.75.75 0 111.06 1.06l-2.75 2.75a.75.75 0 01-1.06 0l-2.75-2.75a.75.75 0 111.06-1.06l1.47 1.47V8.25a.75.75 0 01.75-.75zM8.25 15a.75.75 0 000 1.5h7.5a.75.75 0 000-1.5h-7.5z" /></svg>}
              />
              <SettingsItem
                title="Deactivate your account"
                sub="Find out how you can deactivate your account."
                left={<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" style={{ opacity: 0.8 }}><path d="M12 5.694l-.744-.64a6.518 6.518 0 00-4.148-1.554H6.5c-2.485 0-4.5 2.015-4.5 4.5v.754c0 1.346.425 2.645 1.213 3.706C4.425 14.153 6.366 15.69 8.5 16.793c1.76.906 3.12 1.487 3.5 1.707.38-.22 1.74-.801 3.5-1.707 2.134-1.103 4.075-2.64 5.287-4.273.788-1.061 1.213-2.36 1.213-3.706v-.754c0-2.485-2.015-4.5-4.5-4.5h-.608c-1.562 0-3.024.71-4.148 1.554L12 5.694zm7.5 10.609c-1.436 1.942-3.705 3.744-6.223 5.045a2.536 2.536 0 01-2.554 0c-2.518-1.301-4.787-3.103-6.223-5.045-1-1.345-1.5-3.024-1.5-4.793v-.754C3.5 6.93 5.31 5 7.5 5c1.112 0 2.181.458 2.943 1.258l1.557 1.63 1.557-1.63c.762-.8 1.831-1.258 2.943-1.258h.608c2.19 0 4 2.07 4 4.25v.754c0 1.769-.5 3.448-1.5 4.793zm-5.632-4.56a.75.75 0 01.132 1.053l-3 3.5a.75.75 0 01-1.053.132l-2-1.5a.75.75 0 01.9-1.2l1.418 1.063 2.582-3.012a.75.75 0 011.053-.132z" /></svg>}
                onClick={() => navigate("deactivate")}
              />
            </div>
          </>
        );

      case "password_gate":
        return (
          <>
            <SettingsHeader title="Account information" onBack={() => setSection("root")} />
            <PasswordGate onVerified={() => { setIsVerified(true); setSection("account_info"); }} />
          </>
        );

      case "account_info":
        return (
          <>
            <SettingsHeader title="Account information" onBack={() => setSection("root")} />
            <SettingsItem title="Username" sub={account.handle} onClick={() => setSection("change_username")} />
            <SettingsItem title="Phone" sub={account.phone || "None"} onClick={() => setSection("change_phone")} />
            <SettingsItem title="Email" sub={account.email} onClick={() => setSection("change_email")} />
            <SettingsItem title="Verified" sub={account.emailVerified ? "Yes" : "No. Learn more"} />
            <div style={{ borderTop: "1px solid var(--border)", margin: "8px 0" }} />
            <SettingsItem
              title="Protected posts"
              sub={account.protectedPosts ? "Yes" : "No"}
              right={
                <input
                  type="checkbox"
                  checked={account.protectedPosts}
                  onChange={(e) => updateField("protectedPosts", e.target.checked)}
                />
              }
            />
            <div className="settingsItem" style={{ cursor: "default", flexDirection: "column", alignItems: "flex-start" }}>
              <div className="settingsItemTitle">Account creation</div>
              <div className="settingsItemSub">
                {new Date(account.createdAt).toLocaleString(undefined, {
                  month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "numeric", second: "numeric"
                })}
              </div>
              <div className="settingsItemSub">{account.createdIp} ({account.country})</div>
            </div>
            <div style={{ borderTop: "1px solid var(--border)", margin: "8px 0" }} />
            <SettingsItem title="Country" sub={account.country} onClick={() => setSection("country")} />
            <SettingsItem title="Languages" sub={account.languages.join(", ")} onClick={() => setActiveModal("languages")} />
            <SettingsItem title="Gender" sub={account.gender} onClick={() => setSection("gender")} />
            <SettingsItem
              title="Birth date"
              sub={`${formatBirthdate(account)}\nChange your date of birth on your profile.`}
              onClick={() => setActiveModal("edit_profile")}
            />
            <SettingsItem title="Age" sub={accountAge(account) || "Not set"} />
            <SettingsItem title="Automation" sub="Manage your automated account." onClick={() => setSection("automation")} />
            <SettingsItem title="Parody, commentary and fan account" sub="Manage your parody, commentary and fan account" onClick={() => setSection("parody")} />
          </>
        );

      case "change_username":
        return (
          <>
            <SettingsHeader title="Change username" onBack={() => setSection("account_info")} />
            <div style={{ padding: 16 }}>
              <div className="settingsInputGroup">
                <label className="settingsLabel">Username</label>
                <input
                  className="settingsInputField"
                  value={account.username}
                  onChange={(e) => updateField("username", e.target.value)}
                />
              </div>
              <div style={{ marginTop: 24 }}>
                <div style={{ fontWeight: 700, marginBottom: 12 }}>Suggestions</div>
                {["MaulikDarjiyadr", "MaulikDarjks", "MaulikDarjfow"].map(s => (
                  <div key={s} style={{ color: "var(--accent)", padding: "8px 0", cursor: "pointer" }} onClick={() => updateField("username", s)}>
                    {s}
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 40, borderTop: "1px solid var(--border)", paddingTop: 20 }}>
                <button className="primaryCta" style={{ width: "auto", padding: "10px 32px" }} onClick={() => setSection("account_info")}>Save</button>
              </div>
              <div style={{ marginTop: 40, background: "#000", borderRadius: 12, padding: 20, color: "#fff", position: "relative" }}>
                 <div style={{ position: "absolute", right: 10, top: 10, cursor: "pointer" }}>✕</div>
                 <h2 style={{ fontSize: 24, fontWeight: 900, textAlign: "center", margin: "20px 0" }}>The handle you want might be on the <span style={{ fontFamily: "serif" }}>X</span> Handle Marketplace</h2>
                 <button className="primaryCta" style={{ background: "#fff", color: "#000", width: "fit-content", margin: "0 auto", display: "block", padding: "8px 20px" }}>Browse handles</button>
              </div>
            </div>
          </>
        );

      case "change_phone":
        return (
          <>
            <SettingsHeader title="Change phone" onBack={() => setSection("account_info")} />
            <div style={{ display: "flex", justifyContent: "center", marginTop: 20 }}>
              <button className="ghostBtn" style={{ color: "var(--accent)", fontWeight: 600 }} onClick={() => setSection("phone_flow")}>Add phone number</button>
            </div>
          </>
        );

      case "phone_flow":
        return (
          <>
            <SettingsHeader title="Change phone" onBack={() => setSection("account_info")} />
            <VerificationFlow
              type="phone"
              initialValue={account.phone}
              onComplete={(val) => { updateField("phone", val); updateField("phoneVerified", true); setSection("account_info"); }}
            />
          </>
        );

      case "change_email":
        return (
          <>
            <SettingsHeader title="Change email" onBack={() => setSection("account_info")} />
            <div style={{ display: "flex", justifyContent: "center", marginTop: 20 }}>
              <button className="ghostBtn" style={{ color: "var(--accent)", fontWeight: 600 }} onClick={() => setSection("email_flow")}>Update email address</button>
            </div>
          </>
        );

      case "email_flow":
        return (
          <>
            <SettingsHeader title="Change email" onBack={() => setSection("account_info")} />
            <VerificationFlow
              type="email"
              initialValue={account.email}
              onComplete={(val) => { updateField("email", val); updateField("emailVerified", true); setSection("account_info"); }}
            />
          </>
        );

      case "change_password":
        return (
          <>
            <SettingsHeader title="Change your password" onBack={() => setSection("root")} />
            <div style={{ padding: 16 }}>
              <div className="settingsInputGroup">
                <label className="settingsLabel">Current password</label>
                <input type="password" className="settingsInputField" />
                <div style={{ color: "var(--accent)", fontSize: 13, marginTop: 4, cursor: "pointer" }}>Forgot password?</div>
              </div>
              <div style={{ height: 1, background: "var(--border)", margin: "20px 0" }} />
              <div className="settingsInputGroup">
                <label className="settingsLabel">New password</label>
                <input type="password" className="settingsInputField" />
              </div>
              <div className="settingsInputGroup">
                <label className="settingsLabel">Confirm password</label>
                <input type="password" className="settingsInputField" />
              </div>
              <button className="primaryCta" style={{ width: "auto", padding: "10px 32px" }} onClick={() => setSection("root")}>Save</button>
            </div>
          </>
        );

      case "deactivate":
        return (
          <>
            <SettingsHeader title="Deactivate account" onBack={() => setSection("root")} />
            <div style={{ padding: 16 }}>
              <h3>This will deactivate your account</h3>
              <p style={{ color: "var(--text-muted)", marginTop: 12, fontSize: 14 }}>
                You’re about to start the process of deactivating your account. Your display name, username, and public profile will no longer be viewable on Shitposter.com...
              </p>
              <button className="primaryCta dangerBtn" style={{ marginTop: 40 }} onClick={() => alert("Account deactivated")}>
                Deactivate
              </button>
            </div>
          </>
        );

      case "gender":
        const genders = ["Female", "Male"];
        const [showOther, setShowOther] = useState(false);
        const [otherGender, setOtherGender] = useState("");

        return (
          <>
            <SettingsHeader title="Gender" onBack={() => setSection("account_info")} />
            <div style={{ padding: 16 }}>
              <p style={{ color: "var(--text-muted)", fontSize: 13, marginBottom: 24 }}>
                If you haven’t already specified a gender, this is the one associated with your account based on your profile and activity. This information won’t be displayed publicly.
              </p>
              {genders.map(g => (
                <label key={g} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0", cursor: "pointer" }}>
                  <span style={{ fontWeight: 500 }}>{g}</span>
                  <input
                    type="radio"
                    name="gender"
                    checked={account.gender === g}
                    onChange={() => updateField("gender", g)}
                    style={{ width: 20, height: 20 }}
                  />
                </label>
              ))}
              <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0", cursor: "pointer" }}>
                <span style={{ fontWeight: 500 }}>Add your gender</span>
                <input
                  type="radio"
                  name="gender"
                  checked={!genders.includes(account.gender)}
                  onChange={() => setShowOther(true)}
                  style={{ width: 20, height: 20 }}
                />
              </label>
              {(showOther || !genders.includes(account.gender)) && (
                <div className="settingsInputGroup" style={{ marginTop: 12 }}>
                  <input
                    className="settingsInputField"
                    placeholder="Enter your gender"
                    value={!genders.includes(account.gender) ? account.gender : otherGender}
                    onChange={(e) => {
                      setOtherGender(e.target.value);
                      updateField("gender", e.target.value);
                    }}
                    autoFocus
                  />
                </div>
              )}
              <button className="primaryCta" style={{ width: "auto", padding: "10px 32px", marginTop: 20 }} onClick={() => setSection("account_info")}>Save</button>
            </div>
          </>
        );

      case "country":
        const countries = ["India", "United States", "United Kingdom", "Canada", "Australia", "Indonesia"];
        const [showOtherCountry, setShowOtherCountry] = useState(false);

        return (
          <>
            <SettingsHeader title="Country" onBack={() => setSection("account_info")} />
            <div style={{ padding: 16 }}>
              {countries.map(c => (
                <label key={c} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0", cursor: "pointer" }}>
                  <span style={{ fontWeight: 500 }}>{c}</span>
                  <input
                    type="radio"
                    name="country"
                    checked={account.country === c}
                    onChange={() => updateField("country", c)}
                    style={{ width: 20, height: 20 }}
                  />
                </label>
              ))}
              <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0", cursor: "pointer" }}>
                <span style={{ fontWeight: 500 }}>Other</span>
                <input
                  type="radio"
                  name="country"
                  checked={!countries.includes(account.country)}
                  onChange={() => setShowOtherCountry(true)}
                  style={{ width: 20, height: 20 }}
                />
              </label>
              {(showOtherCountry || !countries.includes(account.country)) && (
                <div className="settingsInputGroup" style={{ marginTop: 12 }}>
                  <input
                    className="settingsInputField"
                    placeholder="Enter country name"
                    value={!countries.includes(account.country) ? account.country : ""}
                    onChange={(e) => updateField("country", e.target.value)}
                    autoFocus
                  />
                </div>
              )}
              <button className="primaryCta" style={{ width: "auto", padding: "10px 32px", marginTop: 20 }} onClick={() => setSection("account_info")}>Save</button>
            </div>
          </>
        );

      default:
        return <div>Section under development</div>;
    }
  };

  return (
    <div className="settingsLayout">
      <div className="settingsNavColumn">
        <header className="feedHeader">
          <div className="feedTitle">Settings</div>
        </header>
        <div className="settingsSearchRow" style={{ padding: "12px 16px" }}>
          <div className="settingsSearchFieldWrap">
            <Search size={18} className="settingsSearchIcon" />
            <input className="settingsSearchInput" placeholder="Search Settings" />
          </div>
        </div>
        <div className="settingsList">
          <SettingsItem 
            title="Your account" 
            active={section.startsWith("account_") || section === "root" || section === "password_gate" || section.includes("flow") || section.startsWith("change_")} 
            onClick={() => setSection("root")} 
            left={<User />}
          />
          <SettingsItem title="Monetization" left={<CircleDollarSign />} />
          <SettingsItem title="Premium" left={<CheckCircle2 />} />
          <SettingsItem title="Creator Subscriptions" left={<Users />} />
          <SettingsItem title="Security and account access" left={<Lock />} />
          <SettingsItem title="Privacy and safety" left={<ShieldCheck />} />
          <SettingsItem title="Notifications" left={<Bell />} />
          <SettingsItem title="Accessibility, display, and languages" left={<Accessibility />} />
          <SettingsItem title="Additional resources" left={<Info />} />
          <SettingsItem title="Help Center" left={<Globe />} right={<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M18.25 15.5a.75.75 0 01-.75-.75V7.56L7.28 17.78a.75.75 0 01-1.06-1.06L16.44 6.5H9.25a.75.75 0 010-1.5h9a.75.75 0 01.75.75v9a.75.75 0 01-.75.75z" /></svg>} />
        </div>
      </div>
      <div className="settingsContentColumn">
        {renderContent()}
      </div>

      {activeModal === "languages" && (
        <LanguageModal
          currentLanguages={account.languages}
          onSave={(langs) => { updateField("languages", langs); setActiveModal(null); }}
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal === "edit_profile" && (
        <EditProfileModal
          account={account}
          onSave={() => { refresh(); setActiveModal(null); }}
          onClose={() => setActiveModal(null)}
        />
      )}
    </div>
  );
}
