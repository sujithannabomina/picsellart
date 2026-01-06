// FILE: src/pages/BuyerLogin.jsx
import React, { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext.jsx";

export default function BuyerLogin() {
  const { signIn, user, userDoc, refreshUserDoc } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();

  const returnTo = loc.state?.returnTo || null;

  const [profile, setProfile] = useState({
    fullName: userDoc?.buyerProfile?.fullName || userDoc?.displayName || "",
    phone: userDoc?.buyerProfile?.phone || "",
    purpose: userDoc?.buyerProfile?.purpose || "blogging",
    otherPurpose: userDoc?.buyerProfile?.otherPurpose || "",
  });

  const needsProfile = useMemo(() => {
    if (!user) return true;
    const p = userDoc?.buyerProfile;
    return !p || !p.fullName || !p.phone || !p.purpose;
  }, [user, userDoc]);

  async function handleGoogle() {
    await signIn("buyer");
    await refreshUserDoc();
  }

  async function saveProfile(e) {
    e.preventDefault();
    if (!user) return;

    const payload = {
      role: "buyer",
      buyerProfile: {
        fullName: profile.fullName.trim(),
        phone: profile.phone.trim(),
        purpose: profile.purpose,
        otherPurpose: profile.purpose === "other" ? (profile.otherPurpose || "").trim() : "",
      },
      updatedAt: serverTimestamp(),
    };

    await setDoc(doc(db, "users", user.uid), payload, { merge: true });
    await refreshUserDoc();

    nav(returnTo || "/buyer-dashboard", { replace: true });
  }

  return (
    <div style={{ maxWidth: 980, margin: "0 auto", padding: "36px 18px 60px" }}>
      <h1 style={{ fontSize: 34, margin: 0, fontWeight: 800, color: "#111" }}>Buyer Login</h1>
      <p style={{ color: "#555", marginTop: 10, lineHeight: 1.6 }}>
        Sign in to purchase and manage downloads. We collect basic info for licensing and compliance.
      </p>

      <div
        style={{
          marginTop: 18,
          border: "1px solid #eee",
          borderRadius: 18,
          background: "#fff",
          padding: 18,
          boxShadow: "0 12px 30px rgba(0,0,0,0.06)",
        }}
      >
        {!user ? (
          <button
            onClick={handleGoogle}
            style={{
              background: "#7c3aed",
              color: "#fff",
              border: "none",
              padding: "12px 16px",
              borderRadius: 12,
              fontWeight: 800,
              cursor: "pointer",
            }}
          >
            Continue with Google
          </button>
        ) : (
          <>
            <div style={{ fontWeight: 800, color: "#111" }}>Signed in as</div>
            <div style={{ color: "#555", marginTop: 6 }}>{user.email}</div>
          </>
        )}

        {user && needsProfile && (
          <form onSubmit={saveProfile} style={{ marginTop: 18, display: "grid", gap: 12, maxWidth: 520 }}>
            <div>
              <div style={{ fontWeight: 700, marginBottom: 6 }}>Full Name</div>
              <input
                value={profile.fullName}
                onChange={(e) => setProfile((p) => ({ ...p, fullName: e.target.value }))}
                required
                style={{ width: "100%", padding: 12, borderRadius: 12, border: "1px solid #ddd" }}
              />
            </div>

            <div>
              <div style={{ fontWeight: 700, marginBottom: 6 }}>Phone Number</div>
              <input
                value={profile.phone}
                onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))}
                required
                style={{ width: "100%", padding: 12, borderRadius: 12, border: "1px solid #ddd" }}
              />
            </div>

            <div>
              <div style={{ fontWeight: 700, marginBottom: 6 }}>Purpose of usage</div>
              <select
                value={profile.purpose}
                onChange={(e) => setProfile((p) => ({ ...p, purpose: e.target.value }))}
                style={{ width: "100%", padding: 12, borderRadius: 12, border: "1px solid #ddd" }}
              >
                <option value="blogging">Blogging</option>
                <option value="news">News Portal</option>
                <option value="ads">Advertising</option>
                <option value="website">Website</option>
                <option value="print">Print</option>
                <option value="other">Other</option>
              </select>
            </div>

            {profile.purpose === "other" && (
              <div>
                <div style={{ fontWeight: 700, marginBottom: 6 }}>Describe</div>
                <input
                  value={profile.otherPurpose}
                  onChange={(e) => setProfile((p) => ({ ...p, otherPurpose: e.target.value }))}
                  required
                  style={{ width: "100%", padding: 12, borderRadius: 12, border: "1px solid #ddd" }}
                />
              </div>
            )}

            <button
              type="submit"
              style={{
                background: "#111",
                color: "#fff",
                border: "none",
                padding: "12px 16px",
                borderRadius: 12,
                fontWeight: 800,
                cursor: "pointer",
              }}
            >
              Save & Continue
            </button>
          </form>
        )}

        {user && !needsProfile && (
          <div style={{ marginTop: 18 }}>
            <button
              onClick={() => nav(returnTo || "/buyer-dashboard")}
              style={{
                background: "#7c3aed",
                color: "#fff",
                border: "none",
                padding: "12px 16px",
                borderRadius: 12,
                fontWeight: 800,
                cursor: "pointer",
              }}
            >
              Go to Buyer Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
