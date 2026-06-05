import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Auth.module.css";

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // TODO: POST to /api/auth/login with { email, password }
    console.log("login payload", { email, password });
    alert("Login submitted. Connect this form to /api/auth/login and redirect to /dashboard.");
    navigate("/");
  };

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
              <button type="button" className={styles.btnSocial}>
                Continue with Google
              </button>
              <button type="button" className={styles.btnSocial}>
                Continue with Apple
              </button>
            </div>

            <div className={styles.divider}>or sign in with email</div>

            <form className={styles.form} onSubmit={handleSubmit}>
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
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="loginPw">Password</label>
                <div className={styles.inputWrap}>
                  <span className={styles.inputIcon}>🔑</span>
                  <input
                    id="loginPw"
                    className={styles.inputField}
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className={styles.pwToggle}
                    onClick={() => setShowPassword((current) => !current)}
                  >
                    {showPassword ? "🙈" : "👁"}
                  </button>
                </div>
              </div>

              <div className={styles.forgotRow}>
                <button type="button" className={styles.forgotLink}>
                  Forgot password?
                </button>
              </div>

              <button type="submit" className={styles.btnPrimary}>
                Sign in to Saathy 💜
              </button>
            </form>

            <p className={styles.switchText}>
              Don’t have an account? <Link to="/register">Create one — it’s free.</Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default LoginPage;
