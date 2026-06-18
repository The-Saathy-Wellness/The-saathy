// NOTE: This tool is internal-only -- assume it runs on localhost or an internal network, not exposed publicly.

import { FormEvent, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import styles from "./Auth.module.css";

const moods = [
  "Calm",
  "Anxious",
  "Sad",
  "Excited",
  "Stressed",
  "Hopeful",
  "Overwhelmed",
  "Grateful",
];

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [ageRange, setAgeRange] = useState("");
  const [location, setLocation] = useState("");
  const [language, setLanguage] = useState("en");
  const [termsChecked, setTermsChecked] = useState(true);
  const [selectedMoods, setSelectedMoods] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const progressWidth = useMemo(() => {
    return currentStep === 1 ? "33%" : currentStep === 2 ? "66%" : "100%";
  }, [currentStep]);

  const toggleMood = (mood: string) => {
    setSelectedMoods((existing) =>
      existing.includes(mood)
        ? existing.filter((item) => item !== mood)
        : [...existing, mood],
    );
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (currentStep === 1) {
      if (!firstName.trim() || !email.trim() || !password.trim()) {
        alert("Please fill in your name, email, and password.");
        return;
      }
      setCurrentStep(2);
      return;
    }

    if (currentStep === 2) {
      if (!ageRange.trim() || !language.trim()) {
        alert("Please select your age and preferred language.");
        return;
      }
      setCurrentStep(3);
      return;
    }

    if (!termsChecked) {
      alert("Please accept the terms of service and privacy policy to continue.");
      return;
    }

    setLoading(true);
    try {
      // Step 1: Sign up the user in Supabase
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password: password.trim(),
        options: {
          data: {
            first_name: firstName.trim(),
            last_name: lastName.trim(),
          }
        }
      });

      if (signUpError) throw signUpError;

      const token = data.session?.access_token;
      
      // If immediate session is returned (email confirmation disabled or auto-login)
      if (token) {
        const parsedAge = parseInt(ageRange, 10) || 18;
        
        // Sync profile details to custom DB
        const payload = {
          nickname: `${firstName} ${lastName}`.trim() || "Saathy Friend",
          email: email.trim(),
          phone: phone.trim() || null,
          age: parsedAge,
          language: language.trim() || "en",
          city: location.trim() || null,
          reasonForJoining: "Signed up for mental wellbeing support",
          consents: {
            memory_storage: "granted",
            session_summary: "granted",
            voice_to_text: "granted",
            listener_context_share: "granted",
            crisis_review: "granted",
            notifications: "granted",
            ai_training: "revoked" // Privacy-first default
          }
        };

        const response = await fetch(`${API_BASE}/api/v1/auth/sync`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });

        const syncResult = await response.json();
        if (!response.ok) {
          throw new Error(syncResult.error?.message || "Profile synchronization failed");
        }

        navigate("/dashboard");
      } else {
        // Verification email sent
        alert("Account registered successfully! Please check your inbox to confirm your email before signing in.");
        navigate("/login");
      }
    } catch (err: any) {
      alert(err.message || "Failed to create your account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.page}>
      <section className={styles.authLayout}>
        <div className={styles.illusSide}>
          <div className={styles.illusBadge}>
            <span className={styles.badgeDot} /> Designed for South India
          </div>
          <h1 className={styles.illusHeadline}>
            Let’s get to know you.
            <br />
            Take your first step toward mental wellbeing.
          </h1>
          <p className={styles.illusSub}>
            Create your Saathy account to receive personalized support, AI check-ins,
            and culturally aware guidance whenever you need it.
          </p>
          <div className={styles.featurePills}>
            <div className={styles.pill}>
              <span className={styles.pillIcon}>🤝</span>Trusted community
            </div>
            <div className={styles.pill}>
              <span className={styles.pillIcon}>🌿</span>Mindful journeys
            </div>
            <div className={styles.pill}>
              <span className={styles.pillIcon}>🎯</span>Personalized care
            </div>
          </div>
          <div className={styles.progressWrapper}>
            <span className={styles.progressLabel}>Step {currentStep} of 3</span>
            <div className={styles.progressTrack}>
              <div className={styles.progressFill} style={{ width: progressWidth }} />
            </div>
          </div>
        </div>

        <div className={styles.cardSide}>
          <div className={styles.authCard}>
            <div className={styles.cardTop}>
              <div className={styles.cardEyebrow}>Create your account</div>
              <h2 className={styles.cardTitle}>Sign up for <em>Saathy</em></h2>
              <p className={styles.cardSub}>Simple onboarding in three quick steps.</p>
            </div>

            <form className={styles.form} onSubmit={handleSubmit}>
              {currentStep === 1 && (
                <>
                  <div className={styles.formRow}>
                    <label htmlFor="firstName">First name</label>
                    <input
                      id="firstName"
                      className={styles.inputField}
                      value={firstName}
                      onChange={(event) => setFirstName(event.target.value)}
                      placeholder="First name"
                      disabled={loading}
                    />
                  </div>
                  <div className={styles.formRow}>
                    <label htmlFor="lastName">Last name</label>
                    <input
                      id="lastName"
                      className={styles.inputField}
                      value={lastName}
                      onChange={(event) => setLastName(event.target.value)}
                      placeholder="Last name"
                      disabled={loading}
                    />
                  </div>
                  <div className={styles.formRow}>
                    <label htmlFor="registerEmail">Email address</label>
                    <input
                      id="registerEmail"
                      className={styles.inputField}
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="you@example.com"
                      disabled={loading}
                    />
                  </div>
                  <div className={styles.formRow}>
                    <label htmlFor="registerPassword">Password</label>
                    <input
                      id="registerPassword"
                      className={styles.inputField}
                      type="password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="Create a password"
                      disabled={loading}
                    />
                  </div>
                </>
              )}

              {currentStep === 2 && (
                <>
                  <div className={styles.formRow}>
                    <label htmlFor="phone">Phone number <span style={{ color: "#9CA3AF", fontWeight: 400 }}>(optional)</span></label>
                    <input
                      id="phone"
                      className={styles.inputField}
                      value={phone}
                      onChange={(event) => setPhone(event.target.value)}
                      placeholder="Mobile number"
                      disabled={loading}
                    />
                  </div>
                  <div className={styles.formRow}>
                    <label htmlFor="ageRange">Age</label>
                    <select
                      id="ageRange"
                      className={styles.inputField}
                      value={ageRange}
                      onChange={(event) => setAgeRange(event.target.value)}
                      style={{ paddingLeft: 16 }}
                      disabled={loading}
                    >
                      <option value="">Select your age range</option>
                      <option value="16">13–17</option>
                      <option value="20">18–24</option>
                      <option value="28">25–34</option>
                      <option value="38">35–44</option>
                      <option value="48">45–54</option>
                      <option value="58">55+</option>
                    </select>
                  </div>
                  <div className={styles.formRow}>
                    <label htmlFor="location">Location <span style={{ color: "#9CA3AF", fontWeight: 400 }}>(optional)</span></label>
                    <input
                      id="location"
                      className={styles.inputField}
                      value={location}
                      onChange={(event) => setLocation(event.target.value)}
                      placeholder="City or state"
                      disabled={loading}
                    />
                  </div>
                  <div className={styles.formRow}>
                    <label htmlFor="language">Preferred language</label>
                    <select
                      id="language"
                      className={styles.inputField}
                      value={language}
                      onChange={(event) => setLanguage(event.target.value)}
                      style={{ paddingLeft: 16 }}
                      disabled={loading}
                    >
                      <option value="en">English</option>
                      <option value="hi">Hindi</option>
                      <option value="ta">Tamil</option>
                      <option value="te">Telugu</option>
                      <option value="kn">Kannada</option>
                      <option value="ml">Malayalam</option>
                      <option value="mr">Marathi</option>
                    </select>
                  </div>
                </>
              )}

              {currentStep === 3 && (
                <>
                  <div className={styles.formDescription}>
                    Pick the moods that describe you today. This helps Saathy tailor your
                    first check-in and content suggestions.
                  </div>
                  <div className={styles.moodGrid}>
                    {moods.map((mood) => (
                      <button
                        key={mood}
                        type="button"
                        className={
                          selectedMoods.includes(mood)
                            ? `${styles.moodCard} ${styles.moodActive}`
                            : styles.moodCard
                        }
                        onClick={() => toggleMood(mood)}
                        disabled={loading}
                      >
                        {mood}
                      </button>
                    ))}
                  </div>
                  <div className={styles.formRowCheckbox}>
                    <input
                      id="terms"
                      type="checkbox"
                      checked={termsChecked}
                      onChange={(event) => setTermsChecked(event.target.checked)}
                      disabled={loading}
                    />
                    <label htmlFor="terms">
                      I agree to the <Link to="/">terms of service</Link> and
                      privacy policy.
                    </label>
                  </div>
                </>
              )}

              <div className={styles.actionRow}>
                <button type="submit" className={styles.btnPrimary} disabled={loading}>
                  {loading
                    ? "Processing..."
                    : currentStep < 3
                      ? "Continue"
                      : "Create account"}
                </button>
                {currentStep > 1 && (
                  <button
                    type="button"
                    className={styles.btnSecondary}
                    onClick={() => setCurrentStep((step) => step - 1)}
                    disabled={loading}
                  >
                    Back
                  </button>
                )}
              </div>
            </form>

            <p className={styles.switchText}>
              Already have an account? <Link to="/login">Sign in instead.</Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default RegisterPage;
