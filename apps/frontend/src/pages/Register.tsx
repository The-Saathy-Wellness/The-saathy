import { FormEvent, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Auth.module.css";

const registerSteps = ["Account", "Profile", "Feelings"] as const;
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
  const [language, setLanguage] = useState("");
  const [termsChecked, setTermsChecked] = useState(true);
  const [selectedMoods, setSelectedMoods] = useState<string[]>([]);

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
    if (currentStep < 3) {
      setCurrentStep((current) => current + 1);
      return;
    }

    const payload = {
      firstName,
      lastName,
      email,
      password,
      phone,
      ageRange,
      location,
      language,
      moods: selectedMoods,
      termsAccepted: termsChecked,
    };

    // TODO: POST to /api/auth/register, then POST mood preferences or profile data to /api/user/mood-setup
    console.log("register payload", payload);
    alert("Registration submitted. Connect this form to /api/auth/register and continue onboarding.");
    navigate("/");
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
                    />
                  </div>
                </>
              )}

              {currentStep === 2 && (
                <>
                  <div className={styles.formRow}>
                    <label htmlFor="phone">Phone number</label>
                    <input
                      id="phone"
                      className={styles.inputField}
                      value={phone}
                      onChange={(event) => setPhone(event.target.value)}
                      placeholder="Mobile number"
                    />
                  </div>
                  <div className={styles.formRow}>
                    <label htmlFor="ageRange">Age range</label>
                    <input
                      id="ageRange"
                      className={styles.inputField}
                      value={ageRange}
                      onChange={(event) => setAgeRange(event.target.value)}
                      placeholder="Age range"
                    />
                  </div>
                  <div className={styles.formRow}>
                    <label htmlFor="location">Location</label>
                    <input
                      id="location"
                      className={styles.inputField}
                      value={location}
                      onChange={(event) => setLocation(event.target.value)}
                      placeholder="City or state"
                    />
                  </div>
                  <div className={styles.formRow}>
                    <label htmlFor="language">Preferred language</label>
                    <input
                      id="language"
                      className={styles.inputField}
                      value={language}
                      onChange={(event) => setLanguage(event.target.value)}
                      placeholder="Tamil, Telugu, Kannada, Malayalam"
                    />
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
                    />
                    <label htmlFor="terms">
                      I agree to the <Link to="/">terms of service</Link> and
                      privacy policy.
                    </label>
                  </div>
                </>
              )}

              <div className={styles.actionRow}>
                <button type="submit" className={styles.btnPrimary}>
                  {currentStep < 3 ? "Continue" : "Create account"}
                </button>
                {currentStep > 1 && (
                  <button
                    type="button"
                    className={styles.btnSecondary}
                    onClick={() => setCurrentStep((step) => step - 1)}
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
