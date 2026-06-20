import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

export default function Index() {
  const navigate = useNavigate();
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [ageConsent, setAgeConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGoogleSignIn = async () => {
    try {
      await supabase.auth.signInWithOAuth({ provider: "google" });
    } catch (err: any) {
      setError(err.message || "Google sign-in failed");
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!nickname.trim() || !email.trim() || !password.trim()) {
      setError("Please fill in all fields.");
      return;
    }
    if (!ageConsent) {
      setError("Please confirm you are 18+ and understand Saathy's terms.");
      return;
    }

    setLoading(true);
    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password: password.trim(),
        options: {
          data: { first_name: nickname.trim() },
        },
      });

      if (signUpError) throw signUpError;

      const token = data.session?.access_token;

      if (token) {
        const payload = {
          nickname: nickname.trim(),
          email: email.trim(),
          phone: null,
          age: 18,
          language: "en",
          city: null,
          reasonForJoining: "Signed up for mental wellbeing support",
          consents: {
            memory_storage: "granted",
            session_summary: "granted",
            voice_to_text: "granted",
            listener_context_share: "granted",
            crisis_review: "granted",
            notifications: "granted",
            ai_training: "revoked",
          },
        };

        const response = await fetch(`${API_BASE}/api/v1/auth/sync`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });

        const syncResult = await response.json();
        if (!response.ok) {
          throw new Error(
            syncResult.error?.message || "Profile synchronization failed",
          );
        }

        navigate("/dashboard");
      } else {
        setError(
          "Account created! Please check your inbox to confirm your email.",
        );
      }
    } catch (err: any) {
      setError(err.message || "Failed to create your account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left hero panel */}
      <div className="relative flex-1 bg-white overflow-hidden flex flex-col justify-center px-8 sm:px-12 lg:px-20 xl:px-24 py-16 lg:py-0">
        {/* Decorative gradient blobs */}
        <div
          className="absolute pointer-events-none"
          style={{
            right: "-20px",
            top: "30%",
            width: "111px",
            height: "107px",
            background:
              "linear-gradient(151deg, #E3FCFF 28%, #EBE4FD 73.08%)",
            borderRadius: "50%",
            filter: "blur(20px)",
            opacity: 0.8,
          }}
        />
        <div
          className="absolute pointer-events-none"
          style={{
            left: "-76px",
            bottom: "0px",
            width: "330px",
            height: "319px",
            background:
              "linear-gradient(151deg, #E3FCFF 28%, #EBE4FD 73.08%)",
            borderRadius: "265px",
            filter: "blur(45px)",
            opacity: 0.7,
          }}
        />

        <div className="relative z-10 max-w-xl">
          <h1
            className="text-5xl sm:text-6xl lg:text-[70px] leading-tight lg:leading-[90px] font-normal mb-5"
            style={{ fontFamily: "Manrope, sans-serif" }}
          >
            <span className="text-black">Your safe space </span>
            <br />
            <span style={{ color: "#8A76FF" }}>starts here</span>
          </h1>

          <p
            className="text-lg sm:text-xl leading-relaxed mb-10 max-w-md"
            style={{
              fontFamily: "'Public Sans', sans-serif",
              color: "#5D636F",
              lineHeight: "1.6",
            }}
          >
            Join thousands of people finding peer support, tools and community
            — all in one safe private place
          </p>

          <div className="flex flex-col gap-5">
            <FeatureItem
              icon={
                <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
                  <g clipPath="url(#clip0_glasses)">
                    <path
                      d="M21.325 16.2499C19 16.2499 17.05 17.9124 16.55 20.1249C15.3625 19.6124 14.275 19.7499 13.45 20.1124C12.9375 17.8874 10.9875 16.2499 8.675 16.2499C5.9625 16.2499 3.75 18.4874 3.75 21.2499C3.75 24.0124 5.9625 26.2499 8.675 26.2499C11.25 26.2499 13.35 24.2249 13.55 21.6499C13.975 21.3499 15.0875 20.7874 16.45 21.6749C16.675 24.2374 18.75 26.2499 21.325 26.2499C24.0375 26.2499 26.25 24.0124 26.25 21.2499C26.25 18.4874 24.0375 16.2499 21.325 16.2499ZM8.675 24.8249C6.725 24.8249 5.1625 23.2249 5.1625 21.2499C5.1625 19.2749 6.7375 17.6749 8.675 17.6749C10.625 17.6749 12.1875 19.2749 12.1875 21.2499C12.1875 23.2249 10.625 24.8249 8.675 24.8249ZM21.325 24.8249C19.375 24.8249 17.8125 23.2249 17.8125 21.2499C17.8125 19.2749 19.375 17.6749 21.325 17.6749C23.275 17.6749 24.85 19.2749 24.85 21.2499C24.85 23.2249 23.2625 24.8249 21.325 24.8249ZM27.5 13.1249H2.5V14.9999H27.5V13.1249ZM19.4125 3.2874C19.1375 2.6749 18.4375 2.3499 17.775 2.5624L15 3.4874L12.2125 2.5624L12.15 2.5499C11.4875 2.3624 10.7875 2.7124 10.5375 3.3499L7.5 11.2499H22.5L19.45 3.3499L19.4125 3.2874Z"
                      fill="#7934FF"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_glasses">
                      <rect width="30" height="30" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              }
              label="Anonymous-friendly"
            />
            <FeatureItem
              icon={
                <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
                  <g clipPath="url(#clip0_heart)">
                    <path
                      d="M15 26.6875L13.1875 25.0375C6.75 19.2 2.5 15.3375 2.5 10.625C2.5 6.7625 5.525 3.75 9.375 3.75C11.55 3.75 13.6375 4.7625 15 6.35C16.3625 4.7625 18.45 3.75 20.625 3.75C24.475 3.75 27.5 6.7625 27.5 10.625C27.5 15.3375 23.25 19.2 16.8125 25.0375L15 26.6875Z"
                      fill="#FF1F00"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_heart">
                      <rect width="30" height="30" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              }
              label="Peer to-peer support"
            />
            <FeatureItem
              icon={
                <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
                  <g clipPath="url(#clip0_community)">
                    <path
                      d="M4.61289 11.4C4.50906 11.2886 4.38324 11.2 4.24338 11.1397C4.10352 11.0795 3.95267 11.0489 3.80039 11.05C3.28789 11.05 2.90039 11.2875 2.65039 11.775C2.40039 12.2625 2.46289 12.725 2.86289 13.1625C4.33789 14.4875 5.27539 15.425 5.67539 15.975C6.18789 16.675 6.43789 17.7 6.43789 19.025C6.43789 20.6625 7.06289 21.875 8.31289 22.7125C9.01289 23.2625 9.77539 23.675 10.6254 23.95V19.0875C10.6254 17.9125 10.2129 16.9375 9.42539 16.15M20.5754 16.2125C19.8004 16.9875 19.3754 17.95 19.3754 19.0875V24C20.5754 23.575 21.5754 22.9125 22.4004 22.0375C23.2129 21.1625 23.6254 20.2 23.6254 19.025C23.6254 17.6125 23.8629 16.6 24.3379 15.975C24.4504 15.775 24.6629 15.525 25.0004 15.2125C25.2879 14.9 25.5879 14.6 25.8879 14.325C26.1754 14.0625 26.4629 13.7875 26.7379 13.5125L27.1504 13.1625C27.2621 13.0563 27.3509 12.9283 27.4111 12.7864C27.4713 12.6444 27.5017 12.4917 27.5004 12.3375C27.5004 11.9875 27.3879 11.675 27.1504 11.425C26.9129 11.175 26.6254 11.05 26.2504 11.05C25.8754 11.05 25.6254 11.1625 25.3879 11.4M15.0004 25C15.8629 25 16.7004 24.8875 17.5004 24.65V20.1875C17.5004 19.45 17.2754 18.875 16.7629 18.325C16.2504 17.775 15.6629 17.5 15.0004 17.5C14.3379 17.5 13.7504 17.75 13.2754 18.2625C12.7754 18.75 12.5004 19.325 12.5004 20.075V24.65C13.3004 24.8875 14.1379 25 15.0004 25ZM11.2504 10.625C11.2504 11.6625 10.4129 12.5 9.37539 12.5C8.33789 12.5 7.50039 11.6625 7.50039 10.625C7.50039 9.5875 8.33789 8.75 9.37539 8.75C10.4129 8.75 11.2504 9.5875 11.2504 10.625ZM22.5004 10.625C22.5004 11.6625 21.6629 12.5 20.6254 12.5C19.5879 12.5 18.7504 11.6625 18.7504 10.625C18.7504 9.5875 19.5879 8.75 20.6254 8.75C21.6629 8.75 22.5004 9.5875 22.5004 10.625ZM16.8754 6.875C16.8754 7.9125 16.0379 8.75 15.0004 8.75C13.9629 8.75 13.1254 7.9125 13.1254 6.875C13.1254 5.8375 13.9629 5 15.0004 5C16.0379 5 16.8754 5.8375 16.8754 6.875ZM16.8754 13.75C16.8754 14.7875 16.0379 15.625 15.0004 15.625C13.9629 15.625 13.1254 14.7875 13.1254 13.75C13.1254 12.7125 13.9629 11.875 15.0004 11.875C16.0379 11.875 16.8754 12.7125 16.8754 13.75Z"
                      fill="#006530"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_community">
                      <rect width="30" height="30" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              }
              label="Not therapy. Not dating. Not social media."
            />
            <FeatureItem
              icon={
                <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
                  <g clipPath="url(#clip0_data)">
                    <path
                      d="M24.9993 7.68377C24.7317 7.62138 24.4603 7.5767 24.1868 7.55002C23.8108 5.6453 22.8521 3.90453 21.4434 2.56856C20.0346 1.2326 18.2455 0.367478 16.3235 0.0929115C14.4016 -0.181655 12.4418 0.147903 10.7153 1.03599C8.98887 1.92407 7.5811 3.32678 6.68681 5.05002C6.11048 5.11967 5.54419 5.256 4.99931 5.45627C3.53803 5.96919 2.27214 6.92331 1.37658 8.18679C0.481019 9.45027 0 10.9607 0 12.5094C0 14.0581 0.481019 15.5685 1.37658 16.832C2.27214 18.0955 3.53803 19.0496 4.99931 19.5625V16.8075C4.23955 16.3725 3.60816 15.7446 3.16905 14.9872C2.72995 14.2298 2.49869 13.3699 2.49869 12.4944C2.49869 11.6189 2.72995 10.759 3.16905 10.0016C3.60816 9.24422 4.23955 8.61626 4.99931 8.18127C5.59623 7.83067 6.26097 7.61122 6.94931 7.53752L8.28681 7.40002L8.91181 6.21252C9.5649 4.94732 10.5955 3.91673 11.8608 3.26371C13.126 2.61069 14.5631 2.36761 15.9727 2.5682C17.3824 2.76879 18.6946 3.4031 19.7275 4.38314C20.7603 5.36318 21.4626 6.64036 21.7368 8.03752L22.1118 9.91252L24.0243 10.05C24.3574 10.0775 24.6853 10.1494 24.9993 10.2638C25.7288 10.5146 26.3618 10.9869 26.8098 11.6148C27.2579 12.2427 27.4988 12.9949 27.4988 13.7663C27.4988 14.5377 27.2579 15.2898 26.8098 15.9177C26.3618 16.5456 25.7288 17.018 24.9993 17.2688V19.8738C26.4089 19.5927 27.6775 18.8317 28.5891 17.7204C29.5007 16.6091 29.9989 15.2161 29.9989 13.7788C29.9989 12.3414 29.5007 10.9485 28.5891 9.83717C27.6775 8.72585 26.4089 7.96486 24.9993 7.68377Z"
                      fill="#2602A7"
                    />
                    <path
                      d="M15 13.75C10.2275 13.75 7.5 14.6975 7.5 16.4587V27.2913C7.5 29.0525 11.3587 30 15 30C18.6413 30 22.5 29.0525 22.5 27.2913V16.4587C22.5 14.6975 19.7725 13.75 15 13.75ZM15 15C18.3888 15 21.1375 16.0125 21.1375 17.135C21.1375 18.2575 18.3875 19.1663 15 19.1663C11.6125 19.1663 8.8625 18.2575 8.8625 17.135C8.8625 16.0125 11.6125 15 15 15ZM8.8625 24.905V23.4762C10.8081 24.2713 12.8992 24.6487 15 24.5837C17.1008 24.6487 19.1919 24.2713 21.1375 23.4762V24.95C19.1776 25.6836 17.0911 26.0194 15 25.9375C12.9063 25.9984 10.821 25.6476 8.8625 24.905Z"
                      fill="#2602A7"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_data">
                      <rect width="30" height="30" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              }
              label="Data never sold or shared"
            />
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div
        className="flex-1 flex items-center justify-center px-6 py-12 lg:py-0"
        style={{
          background: "linear-gradient(151deg, #E3FCFF 28%, #EBE4FD 73.08%)",
        }}
      >
        <div
          className="w-full max-w-sm bg-white rounded-2xl shadow-md px-8 sm:px-10 py-7"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          {/* Private by default badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 mb-4 rounded-full border border-[#E6E7F2] bg-white w-fit">
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clipPath="url(#clip0_sparkle)">
                <path
                  d="M5.50774 1.40698C5.52917 1.29228 5.59003 1.18868 5.67979 1.11414C5.76955 1.03959 5.88256 0.998779 5.99924 0.998779C6.11593 0.998779 6.22893 1.03959 6.3187 1.11414C6.40846 1.18868 6.46932 1.29228 6.49074 1.40698L7.01624 4.18598C7.05357 4.38355 7.14958 4.56529 7.29176 4.70746C7.43394 4.84964 7.61567 4.94565 7.81324 4.98298L10.5922 5.50848C10.7069 5.5299 10.8105 5.59076 10.8851 5.68053C10.9596 5.77029 11.0004 5.88329 11.0004 5.99998C11.0004 6.11666 10.9596 6.22967 10.8851 6.31943C10.8105 6.40919 10.7069 6.47005 10.5922 6.49148L7.81324 7.01698C7.61567 7.0543 7.43394 7.15031 7.29176 7.29249C7.14958 7.43467 7.05357 7.6164 7.01624 7.81398L6.49074 10.593C6.46932 10.7077 6.40846 10.8113 6.3187 10.8858C6.22893 10.9604 6.11593 11.0012 5.99924 11.0012C5.88256 11.0012 5.76955 10.9604 5.67979 10.8858C5.59003 10.8113 5.52917 10.7077 5.50774 10.593L4.98224 7.81398C4.94492 7.6164 4.84891 7.43467 4.70673 7.29249C4.56455 7.15031 4.38282 7.0543 4.18524 7.01698L1.40624 6.49148C1.29155 6.47005 1.18795 6.40919 1.1134 6.31943C1.03885 6.22967 0.998047 6.11666 0.998047 5.99998C0.998047 5.88329 1.03885 5.77029 1.1134 5.68053C1.18795 5.59076 1.29155 5.5299 1.40624 5.50848L4.18524 4.98298C4.38282 4.94565 4.56455 4.84964 4.70673 4.70746C4.84891 4.56529 4.94492 4.38355 4.98224 4.18598L5.50774 1.40698Z"
                  stroke="#7F6AFC"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M10 1V3"
                  stroke="#7F6AFC"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M11 2H9"
                  stroke="#7F6AFC"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2 11C2.55228 11 3 10.5523 3 10C3 9.44772 2.55228 9 2 9C1.44772 9 1 9.44772 1 10C1 10.5523 1.44772 11 2 11Z"
                  stroke="#7F6AFC"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
              <defs>
                <clipPath id="clip0_sparkle">
                  <rect width="12" height="12" fill="white" />
                </clipPath>
              </defs>
            </svg>
            <span
              className="text-[11px] font-medium leading-[16.5px]"
              style={{ color: "#5D636F" }}
            >
              Private by default
            </span>
          </div>

          {/* Google sign-in */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-3 py-2.5 px-5 rounded-[20px] border border-[rgba(93,99,111,0.3)] bg-white hover:bg-gray-50 transition-colors mb-6"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 31 35"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M27.7569 15.0519H26.75V15H15.5V20H22.5644C21.5338 22.9106 18.7644 25 15.5 25C11.3581 25 8 21.6419 8 17.5C8 13.3581 11.3581 10 15.5 10C17.4119 10 19.1513 10.7212 20.4756 11.8994L24.0112 8.36375C21.7787 6.28312 18.7925 5 15.5 5C8.59688 5 3 10.5969 3 17.5C3 24.4031 8.59688 30 15.5 30C22.4031 30 28 24.4031 28 17.5C28 16.6619 27.9137 15.8438 27.7569 15.0519Z"
                fill="#FFC107"
              />
              <path
                d="M4.07227 10.7123L8.31604 14.2261C9.46433 11.0163 12.2453 8.75008 15.4996 8.75008C17.4752 8.75008 19.2726 9.59154 20.6411 10.966L24.2946 6.84112C21.9877 4.41373 18.9019 2.91675 15.4996 2.91675C10.5384 2.91675 6.23581 6.07914 4.07227 10.7123Z"
                fill="#FF3D00"
              />
              <path
                d="M15.4991 32.0833C18.8354 32.0833 21.867 30.6418 24.159 28.2975L20.1613 24.4781C18.8209 25.629 17.183 26.2515 15.4991 26.25C12.1394 26.25 9.28679 23.8314 8.21212 20.4561L4 24.1201C6.13771 28.8429 10.479 32.0833 15.4991 32.0833Z"
                fill="#4CAF50"
              />
              <path
                d="M28.1654 14.6438H27.125V14.5833H15.5V20.4166H22.7999C22.2904 22.0327 21.3728 23.4449 20.1603 24.4788L20.1623 24.4773L24.16 28.2967C23.8771 28.5869 28.4167 24.7916 28.4167 17.4999C28.4167 16.5221 28.3275 15.5676 28.1654 14.6438Z"
                fill="#1976D2"
              />
            </svg>
            <span
              className="text-sm font-medium"
              style={{
                color: "#5D636F",
                fontFamily: "'Public Sans', sans-serif",
              }}
            >
              Continue with Google
            </span>
          </button>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Nickname */}
            <div className="flex flex-col gap-2">
              <label
                className="text-sm font-medium leading-5"
                style={{ color: "rgba(28,38,58,0.9)" }}
              >
                Nickname
              </label>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="What should we call you?"
                className="w-full px-4 py-3 rounded-[28px] border border-[#E6E7F2] bg-white/70 text-sm outline-none focus:border-[#7F6AFC] focus:ring-1 focus:ring-[#7F6AFC] transition-colors placeholder:text-[rgba(28,38,58,0.5)]"
                disabled={loading}
              />
            </div>

            {/* Email */}
            <div className="flex flex-col gap-2">
              <label
                className="text-sm font-medium leading-5"
                style={{ color: "rgba(28,38,58,0.9)" }}
              >
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-[28px] border border-[#E6E7F2] bg-white/70 text-sm outline-none focus:border-[#7F6AFC] focus:ring-1 focus:ring-[#7F6AFC] transition-colors placeholder:text-[rgba(28,38,58,0.5)]"
                disabled={loading}
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-2">
              <label
                className="text-sm font-medium leading-5"
                style={{ color: "rgba(28,38,58,0.9)" }}
              >
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Choose a strong password"
                className="w-full px-4 py-3 rounded-[28px] border border-[#E6E7F2] bg-white/70 text-sm outline-none focus:border-[#7F6AFC] focus:ring-1 focus:ring-[#7F6AFC] transition-colors placeholder:text-[rgba(28,38,58,0.5)]"
                disabled={loading}
              />
            </div>

            {/* Age + terms checkbox */}
            <label className="flex items-start gap-2 cursor-pointer">
              <div className="relative mt-0.5 shrink-0">
                <input
                  type="checkbox"
                  checked={ageConsent}
                  onChange={(e) => setAgeConsent(e.target.checked)}
                  className="sr-only"
                  disabled={loading}
                />
                <div
                  className="w-4 h-4 rounded-sm border-2 flex items-center justify-center transition-colors"
                  style={{
                    backgroundColor: ageConsent ? "#7F6AFC" : "white",
                    borderColor: ageConsent ? "#7F6AFC" : "#7F6AFC",
                  }}
                  onClick={() => setAgeConsent(!ageConsent)}
                >
                  {ageConsent && (
                    <svg
                      width="10"
                      height="8"
                      viewBox="0 0 10 8"
                      fill="none"
                    >
                      <path
                        d="M1 4L3.5 6.5L9 1"
                        stroke="white"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </div>
              </div>
              <span
                className="text-[11px] leading-[16.5px]"
                style={{ color: "#5D636F" }}
              >
                I'm 18+ and understand Saathy offers companionship support, not
                therapy, medical care, or emergency help.
              </span>
            </label>

            {/* Error message */}
            {error && (
              <p className="text-xs text-red-500 text-center">{error}</p>
            )}

            {/* CTA button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-6 rounded-full text-sm font-semibold text-white transition-opacity disabled:opacity-60"
              style={{
                background:
                  "linear-gradient(135deg, #8A76FF 0%, #7F6AFC 100%)",
              }}
            >
              {loading ? "Creating your space..." : "Create my safe space"}
            </button>
          </form>

          {/* Sign in link */}
          <div className="mt-6 pt-6 border-t border-[rgba(230,231,242,0.6)] text-center">
            <p className="text-sm" style={{ color: "#5D636F" }}>
              Already with us?{" "}
              <Link
                to="/login"
                className="font-semibold"
                style={{ color: "#7F6AFC" }}
              >
                Sign in
              </Link>
            </p>
          </div>

          {/* Privacy note */}
          <div className="mt-4 flex items-start gap-2">
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 15"
              fill="none"
              className="shrink-0 mt-0.5"
            >
              <path
                d="M11.0116 6.41919H2.89745C2.25726 6.41919 1.73828 6.93817 1.73828 7.57836V11.6354C1.73828 12.2756 2.25726 12.7946 2.89745 12.7946H11.0116C11.6518 12.7946 12.1708 12.2756 12.1708 11.6354V7.57836C12.1708 6.93817 11.6518 6.41919 11.0116 6.41919Z"
                stroke="#7F6AFC"
                strokeWidth="1.15917"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M4.05664 6.41913V4.1008C4.05664 3.33222 4.36196 2.59513 4.90542 2.05166C5.44889 1.5082 6.18598 1.20288 6.95456 1.20288C7.72313 1.20288 8.46023 1.5082 9.00369 2.05166C9.54716 2.59513 9.85247 3.33222 9.85247 4.1008V6.41913"
                stroke="#7F6AFC"
                strokeWidth="1.15917"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <p
              className="text-[11px] leading-[16.5px]"
              style={{ color: "#5D636F" }}
            >
              Your identity can stay hidden. Memory only with consent.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureItem({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div
        className="w-10 h-10 shrink-0 rounded-[10px] flex items-center justify-center"
        style={{
          border: "1px solid #B4A8FF",
          background: "rgba(127, 106, 252, 0.10)",
        }}
      >
        {icon}
      </div>
      <span
        className="text-lg sm:text-xl font-normal leading-[1.3]"
        style={{
          fontFamily: "'Public Sans', sans-serif",
          color: "#5D636F",
        }}
      >
        {label}
      </span>
    </div>
  );
}
