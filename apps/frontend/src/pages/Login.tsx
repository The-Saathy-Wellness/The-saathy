// NOTE: This tool is internal-only -- assume it runs on localhost or an internal network, not exposed publicly.

import { FormEvent, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { generateFingerprint } from "../lib/privacy/fingerprint";
import { detectIncognito } from "../lib/privacy/detectIncognito";
import styles from "./Auth.module.css";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [showIncognitoWarning, setShowIncognitoWarning] = useState(false);
  const [showRestorePrompt, setShowRestorePrompt] = useState(false);
  const [returningGuestId, setReturningGuestId] = useState<string | null>(null);

  // ── Google OAuth ──
  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      alert(err.message || "Failed to sign in with Google");
    } finally {
      setLoading(false);
    }
  };

  // ── Email Magic Link ──
  const handleMagicLinkSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim()) {
      alert("Please enter your email address");
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      });
      if (error) throw error;
      setMagicLinkSent(true);
    } catch (err: any) {
      alert(err.message || "Failed to send magic link");
    } finally {
      setLoading(false);
    }
  };

  // ── Guest (Anonymous) Sign-In ──
  const handleGuestSignIn = useCallback(async () => {
    setLoading(true);
    try {
      // Step 1: Check if browsing in incognito
      const isIncognito = await detectIncognito();
      if (isIncognito) {
        setShowIncognitoWarning(true);
        setLoading(false);
        return;
      }

      await proceedAsGuest();
    } catch (err: any) {
      alert(err.message || "Failed to continue as guest");
      setLoading(false);
    }
  }, []);

  const proceedAsGuest = async () => {
    setLoading(true);
    try {
      // Step 2: Generate device fingerprint
      const fingerprint = await generateFingerprint();

      // Step 3: Sign in anonymously via Supabase
      const { data, error } = await supabase.auth.signInAnonymously();
      if (error) throw error;

      const token = data.session?.access_token;
      if (!token) throw new Error("No session returned from anonymous sign-in");

      // Step 5: Associate fingerprint with the guest session
      await fetch(`${API_BASE}/api/v1/auth/continuity/update-fingerprint`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ deviceFingerprint: fingerprint }),
      });

      // Step 6: Check if this device was used before by another guest
      const checkResponse = await fetch(
        `${API_BASE}/api/v1/auth/continuity/fingerprint-check`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ deviceFingerprint: fingerprint }),
        },
      );

      const checkData = await checkResponse.json();
      if (
        checkData.data?.found &&
        checkData.data.guestUserId !== data.user?.id
      ) {
        // A different guest session exists for this device — offer restore
        setReturningGuestId(checkData.data.guestUserId);
        setShowRestorePrompt(true);
        setLoading(false);
        return;
      }

      navigate("/dashboard");
    } catch (err: any) {
      alert(err.message || "Failed to continue as guest");
    } finally {
      setLoading(false);
    }
  };

  const handleDismissIncognito = async () => {
    setShowIncognitoWarning(false);
    await proceedAsGuest();
  };

  const handleRestoreSession = async () => {
    setShowRestorePrompt(false);
    navigate("/dashboard");
  };

  const handleSkipRestore = () => {
    setShowRestorePrompt(false);
    navigate("/dashboard");
  };

  // ── Incognito Warning View ──
  if (showIncognitoWarning) {
    return (
      <main className={styles.page}>
        <div className={styles.authCard} style={{ maxWidth: 460, textAlign: "center", margin: "40px auto", padding: "40px" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🫂</div>
          <h2 className={styles.cardTitle} style={{ marginBottom: 12 }}>
            Saathy won't be able to <em>remember</em> you
          </h2>
          <p className={styles.cardSub} style={{ marginBottom: 24 }}>
            It looks like you're in a private browsing window. That's completely okay —
            but it means Saathy won't be able to carry your emotional journey forward
            across sessions. Your conversations will start fresh each time.
          </p>
          <button
            className={styles.btnPrimary}
            onClick={handleDismissIncognito}
            style={{ marginBottom: 12 }}
          >
            That's okay, continue 💜
          </button>
          <button
            className={styles.btnSecondary}
            onClick={() => setShowIncognitoWarning(false)}
          >
            Go back
          </button>
        </div>
      </main>
    );
  }

  // ── Guest Restore Prompt View ──
  if (showRestorePrompt) {
    return (
      <main className={styles.page}>
        <div className={styles.authCard} style={{ maxWidth: 460, textAlign: "center", margin: "40px auto", padding: "40px" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>💜</div>
          <h2 className={styles.cardTitle} style={{ marginBottom: 12 }}>
            Welcome back, <em>friend</em>
          </h2>
          <p className={styles.cardSub} style={{ marginBottom: 24 }}>
            Saathy recognizes this device from a previous visit. Would you like to
            pick up where you left off? Your emotional journey and conversations
            are still here.
          </p>
          <button
            className={styles.btnPrimary}
            onClick={handleRestoreSession}
            style={{ marginBottom: 12 }}
          >
            Yes, restore my journey ✨
          </button>
          <button
            className={styles.btnSecondary}
            onClick={handleSkipRestore}
          >
            Start fresh instead
          </button>
        </div>
      </main>
    );
  }

  // ── Magic Link Success View ──
  if (magicLinkSent) {
    return (
      <main className={styles.page}>
        <div className={styles.authCard} style={{ maxWidth: 460, textAlign: "center", margin: "40px auto", padding: "40px" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>✉️</div>
          <h2 className={styles.cardTitle} style={{ marginBottom: 12 }}>
            Check your <em>email</em> ✨
          </h2>
          <p className={styles.cardSub} style={{ marginBottom: 8 }}>
            We've sent a magic link to <strong>{email}</strong>.
          </p>
          <p className={styles.cardSub} style={{ marginBottom: 24 }}>
            Click the link in your email to sign in — no password needed.
            The link will expire in 10 minutes.
          </p>
          <button
            className={styles.btnSecondary}
            onClick={() => setMagicLinkSent(false)}
          >
            ← Use a different method
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <section className={styles.authLayout}>
        <div className={styles.illusSide}>
          <div className={styles.illusBadge}>
            <span className={styles.badgeDot} /> Safe • Private • Always here
          </div>
          <h1 className={styles.illusHeadline}>
            Welcome back.
            <br />
            You don’t have to <em>carry this alone.</em>
          </h1>
          <p className={styles.illusSub}>
            Saathy is your AI companion and human support network. A judgment-free
            space designed for South India, built for every feeling.
          </p>
          <div className={styles.featurePills}>
            <div className={styles.pill}>
              <span className={styles.pillIcon}>🔒</span>100% Anonymous
            </div>
            <div className={styles.pill}>
              <span className={styles.pillIcon}>🤝</span>Human Listeners
            </div>
            <div className={styles.pill}>
              <span className={styles.pillIcon}>🧠</span>AI + Empathy
            </div>
            <div className={styles.pill}>
              <span className={styles.pillIcon}>💜</span>Built for India
            </div>
          </div>
          <div className={styles.trustRow}>
            <div className={styles.avatars}>
              <span>🧑</span>
              <span>👩</span>
              <span>🧑‍🦱</span>
              <span>👨</span>
            </div>
            <div className={styles.trustText}>
              Trusted by <strong>1000+ People</strong> across India
            </div>
          </div>
        </div>

        <div className={styles.cardSide}>
          <div className={styles.authCard}>
            <div className={styles.cardTop}>
              <div className={styles.cardEyebrow}>Welcome back</div>
              <h2 className={styles.cardTitle}>Sign in to <em>Saathy</em></h2>
              <p className={styles.cardSub}>Your safe space is one step away.</p>
            </div>

            <div className={styles.socialRow}>
              <button
                type="button"
                className={styles.btnSocial}
                onClick={handleGoogleSignIn}
                disabled={loading}
                style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}
              >
                Continue with Google
              </button>
            </div>

            <div className={styles.divider}>or sign in with email link</div>

            <form className={styles.form} onSubmit={handleMagicLinkSubmit}>
              <div className={styles.formGroup}>
                <label htmlFor="loginEmail">Email address</label>
                <div className={styles.inputWrap}>
                  <span className={styles.inputIcon}>✉️</span>
                  <input
                    id="loginEmail"
                    className={styles.inputField}
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    autoComplete="email"
                    disabled={loading}
                  />
                </div>
              </div>

              <button type="submit" className={styles.btnPrimary} disabled={loading}>
                {loading ? "Sending..." : "Send Magic Link 💜"}
              </button>
            </form>

            <div className={styles.divider}>or continue anonymously</div>

            <button
              type="button"
              className={styles.btnSecondary}
              onClick={handleGuestSignIn}
              disabled={loading}
              style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}
            >
              Continue as Guest 🕶️
            </button>

            <p className={styles.switchText}>New Here? Signing in will create your account automatically</p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default LoginPage;
