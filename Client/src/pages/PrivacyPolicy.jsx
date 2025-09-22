export default function PrivacyPolicy() {
  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "var(--bg-primary)" }}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header Section */}
        <div className="text-center mb-8 sm:mb-12">
          <div
            className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-2xl mb-4 sm:mb-6 shadow-lg"
            style={{ backgroundColor: "var(--btn)" }}
          >
            <svg
              className="w-6 h-6 sm:w-8 sm:h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
          </div>
          <h1
            className="text-3xl sm:text-4xl font-bold mb-3 sm:mb-4"
            style={{ color: "var(--txt)" }}
          >
            Privacy Policy
          </h1>
          <p
            className="text-lg sm:text-xl mb-2"
            style={{ color: "var(--txt-dim)" }}
          >
            EduHeaven Extension
          </p>
          <div
            className="inline-flex items-center px-3 sm:px-4 py-2 rounded-full shadow-sm border"
            style={{
              backgroundColor: "var(--bg-ter)",
              borderColor: "var(--bg-sec)",
            }}
          >
            <svg
              className="w-4 h-4 mr-2"
              style={{ color: "var(--btn)" }}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span
              className="text-sm font-medium"
              style={{ color: "var(--txt)" }}
            >
              Effective Date: June 28, 2025
            </span>
          </div>
        </div>

        {/* Main Content */}
        <div
          className="rounded-3xl shadow-xl border overflow-hidden"
          style={{
            backgroundColor: "var(--bg-ter)",
            borderColor: "var(--bg-sec)",
          }}
        >
          <div className="p-6 sm:p-8 lg:p-12">
            {/* Section 1 */}
            <section className="mb-8 sm:mb-10">
              <div className="flex items-center mb-4 sm:mb-6">
                <div
                  className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl mr-3 sm:mr-4"
                  style={{ backgroundColor: "var(--bg-sec)" }}
                >
                  <span
                    className="text-base sm:text-lg font-bold"
                    style={{ color: "var(--btn)" }}
                  >
                    1
                  </span>
                </div>
                <h2
                  className="text-xl sm:text-2xl font-bold"
                  style={{ color: "var(--txt)" }}
                >
                  Information We Collect
                </h2>
              </div>
              <p
                className="leading-relaxed mb-4 sm:mb-6"
                style={{ color: "var(--txt-dim)" }}
              >
                We collect the following information when you use the EduHeaven
                extension to provide you with the best possible experience:
              </p>
              <div className="grid gap-3 sm:gap-4">
                <div
                  className="flex flex-col sm:flex-row sm:items-start p-4 rounded-xl border"
                  style={{
                    backgroundColor: "var(--bg-sec)",
                    borderColor: "var(--bg-primary)",
                  }}
                >
                  <div
                    className="flex items-center justify-center w-8 h-8 rounded-lg mb-3 sm:mb-0 sm:mr-4 sm:mt-0.5 flex-shrink-0"
                    style={{ backgroundColor: "var(--btn)" }}
                  >
                    <svg
                      className="w-4 h-4 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </div>
                  <div>
                    <h4
                      className="font-semibold mb-1"
                      style={{ color: "var(--txt)" }}
                    >
                      Account Information
                    </h4>
                    <p style={{ color: "var(--txt-dim)" }}>
                      Your email address and public profile data when you log in
                      via Google
                    </p>
                  </div>
                </div>
                <div
                  className="flex flex-col sm:flex-row sm:items-start p-4 rounded-xl border"
                  style={{
                    backgroundColor: "var(--bg-sec)",
                    borderColor: "var(--bg-primary)",
                  }}
                >
                  <div
                    className="flex items-center justify-center w-8 h-8 rounded-lg mb-3 sm:mb-0 sm:mr-4 sm:mt-0.5 flex-shrink-0"
                    style={{ backgroundColor: "var(--btn)" }}
                  >
                    <svg
                      className="w-4 h-4 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4
                      className="font-semibold mb-1"
                      style={{ color: "var(--txt)" }}
                    >
                      User Preferences
                    </h4>
                    <p style={{ color: "var(--txt-dim)" }}>
                      Settings and preferences stored locally using Chrome
                      extension storage
                    </p>
                  </div>
                </div>
                <div
                  className="flex flex-col sm:flex-row sm:items-start p-4 rounded-xl border"
                  style={{
                    backgroundColor: "var(--bg-sec)",
                    borderColor: "var(--bg-primary)",
                  }}
                >
                  <div
                    className="flex items-center justify-center w-8 h-8 rounded-lg mb-3 sm:mb-0 sm:mr-4 sm:mt-0.5 flex-shrink-0"
                    style={{ backgroundColor: "var(--btn)" }}
                  >
                    <svg
                      className="w-4 h-4 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4
                      className="font-semibold mb-1"
                      style={{ color: "var(--txt)" }}
                    >
                      Progress Data
                    </h4>
                    <p style={{ color: "var(--txt-dim)" }}>
                      Learning progress and dashboard data synced via our secure
                      backend
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 2 */}
            <section className="mb-8 sm:mb-10">
              <div className="flex items-center mb-4 sm:mb-6">
                <div
                  className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl mr-3 sm:mr-4"
                  style={{ backgroundColor: "var(--bg-sec)" }}
                >
                  <span
                    className="text-base sm:text-lg font-bold"
                    style={{ color: "var(--btn)" }}
                  >
                    2
                  </span>
                </div>
                <h2
                  className="text-xl sm:text-2xl font-bold"
                  style={{ color: "var(--txt)" }}
                >
                  How We Use Your Information
                </h2>
              </div>
              <div
                className="p-4 sm:p-6 rounded-xl border"
                style={{
                  backgroundColor: "var(--bg-sec)",
                  borderColor: "var(--bg-primary)",
                }}
              >
                <p
                  className="leading-relaxed mb-4"
                  style={{ color: "var(--txt-dim)" }}
                >
                  We use your information exclusively to enhance your learning
                  experience through:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="flex items-center">
                    <div
                      className="w-2 h-2 rounded-full mr-3 flex-shrink-0"
                      style={{ backgroundColor: "var(--btn)" }}
                    ></div>
                    <span style={{ color: "var(--txt-dim)" }}>
                      Personalizing your dashboard
                    </span>
                  </div>
                  <div className="flex items-center">
                    <div
                      className="w-2 h-2 rounded-full mr-3 flex-shrink-0"
                      style={{ backgroundColor: "var(--btn)" }}
                    ></div>
                    <span style={{ color: "var(--txt-dim)" }}>
                      Maintaining secure sessions
                    </span>
                  </div>
                  <div className="flex items-center">
                    <div
                      className="w-2 h-2 rounded-full mr-3 flex-shrink-0"
                      style={{ backgroundColor: "var(--btn)" }}
                    ></div>
                    <span style={{ color: "var(--txt-dim)" }}>
                      Providing core features
                    </span>
                  </div>
                  <div className="flex items-center">
                    <div
                      className="w-2 h-2 rounded-full mr-3 flex-shrink-0"
                      style={{ backgroundColor: "var(--btn)" }}
                    ></div>
                    <span style={{ color: "var(--txt-dim)" }}>
                      Syncing your progress
                    </span>
                  </div>
                </div>
                <div
                  className="mt-4 p-3 sm:p-4 rounded-lg border"
                  style={{
                    backgroundColor: "var(--bg-ter)",
                    borderColor: "var(--bg-primary)",
                  }}
                >
                  <p
                    className="text-sm font-semibold"
                    style={{ color: "var(--btn)" }}
                  >
                    🔒 Privacy Commitment: We do not sell, share, or monetize
                    your personal data.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 3 */}
            <section className="mb-8 sm:mb-10">
              <div className="flex items-center mb-4 sm:mb-6">
                <div
                  className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl mr-3 sm:mr-4"
                  style={{ backgroundColor: "var(--bg-sec)" }}
                >
                  <span
                    className="text-base sm:text-lg font-bold"
                    style={{ color: "var(--btn)" }}
                  >
                    3
                  </span>
                </div>
                <h2
                  className="text-xl sm:text-2xl font-bold"
                  style={{ color: "var(--txt)" }}
                >
                  Data Storage & Security
                </h2>
              </div>
              <p
                className="leading-relaxed mb-4 sm:mb-6"
                style={{ color: "var(--txt-dim)" }}
              >
                Your data is securely stored using industry-standard encryption
                and security practices:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div
                  className="p-4 sm:p-6 rounded-xl border"
                  style={{
                    backgroundColor: "var(--bg-sec)",
                    borderColor: "var(--bg-primary)",
                  }}
                >
                  <div className="flex items-center mb-4">
                    <div
                      className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl mr-3 sm:mr-4"
                      style={{ backgroundColor: "var(--btn)" }}
                    >
                      <svg
                        className="w-5 h-5 sm:w-6 sm:h-6 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M2 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 002 2H4a2 2 0 01-2-2V5zm3 1h6v4H5V6zm6 6H5v2h6v-2z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <h3
                      className="text-lg font-semibold"
                      style={{ color: "var(--txt)" }}
                    >
                      Cloud Backend
                    </h3>
                  </div>
                  <p className="mb-3" style={{ color: "var(--txt-dim)" }}>
                    Securely hosted on our backend server
                  </p>
                  <code
                    className="text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2 rounded-lg border block break-all"
                    style={{
                      backgroundColor: "var(--bg-ter)",
                      borderColor: "var(--bg-primary)",
                      color: "var(--txt)",
                    }}
                  >
                    https://eduhaven-backend.onrender.com
                  </code>
                </div>
                <div
                  className="p-4 sm:p-6 rounded-xl border"
                  style={{
                    backgroundColor: "var(--bg-sec)",
                    borderColor: "var(--bg-primary)",
                  }}
                >
                  <div className="flex items-center mb-4">
                    <div
                      className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl mr-3 sm:mr-4"
                      style={{ backgroundColor: "var(--btn)" }}
                    >
                      <svg
                        className="w-5 h-5 sm:w-6 sm:h-6 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <h3
                      className="text-lg font-semibold"
                      style={{ color: "var(--txt)" }}
                    >
                      Local Storage
                    </h3>
                  </div>
                  <p className="mb-3" style={{ color: "var(--txt-dim)" }}>
                    Stored locally in your browser
                  </p>
                  <code
                    className="text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2 rounded-lg border block"
                    style={{
                      backgroundColor: "var(--bg-ter)",
                      borderColor: "var(--bg-primary)",
                      color: "var(--txt)",
                    }}
                  >
                    chrome.storage
                  </code>
                </div>
              </div>
            </section>

            {/* Section 4 */}
            <section className="mb-8 sm:mb-10">
              <div className="flex items-center mb-4 sm:mb-6">
                <div
                  className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl mr-3 sm:mr-4"
                  style={{ backgroundColor: "var(--bg-sec)" }}
                >
                  <span
                    className="text-base sm:text-lg font-bold"
                    style={{ color: "var(--btn)" }}
                  >
                    4
                  </span>
                </div>
                <h2
                  className="text-xl sm:text-2xl font-bold"
                  style={{ color: "var(--txt)" }}
                >
                  Third-Party Services
                </h2>
              </div>
              <div
                className="flex flex-col sm:flex-row items-start p-4 sm:p-6 rounded-xl border"
                style={{
                  backgroundColor: "var(--bg-sec)",
                  borderColor: "var(--bg-primary)",
                }}
              >
                <div className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 mb-4 sm:mb-0 sm:mr-6 flex-shrink-0 mx-auto sm:mx-0">
                  <svg
                    className="w-10 h-10 sm:w-12 sm:h-12"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h3
                    className="text-lg sm:text-xl font-semibold mb-3"
                    style={{ color: "var(--txt)" }}
                  >
                    Google OAuth Integration
                  </h3>
                  <p
                    className="leading-relaxed mb-4"
                    style={{ color: "var(--txt-dim)" }}
                  >
                    We use Google OAuth for secure authentication. This allows
                    you to log in safely without us storing your password.
                  </p>
                  <a
                    href="https://policies.google.com/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-3 sm:px-4 py-2 border rounded-lg text-sm font-medium transition-colors duration-200 hover:opacity-80"
                    style={{
                      backgroundColor: "var(--bg-ter)",
                      borderColor: "var(--bg-primary)",
                      color: "var(--txt-dim)",
                    }}
                  >
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z"
                        clipRule="evenodd"
                      />
                    </svg>
                    View Google Privacy Policy
                  </a>
                </div>
              </div>
            </section>

            {/* Section 5 */}
            <section>
              <div className="flex items-center mb-4 sm:mb-6">
                <div
                  className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl mr-3 sm:mr-4"
                  style={{ backgroundColor: "var(--bg-sec)" }}
                >
                  <span
                    className="text-base sm:text-lg font-bold"
                    style={{ color: "var(--btn)" }}
                  >
                    5
                  </span>
                </div>
                <h2
                  className="text-xl sm:text-2xl font-bold"
                  style={{ color: "var(--txt)" }}
                >
                  Contact Information
                </h2>
              </div>
              <div
                className="p-6 sm:p-8 rounded-xl border"
                style={{
                  backgroundColor: "var(--bg-sec)",
                  borderColor: "var(--bg-primary)",
                }}
              >
                <div className="text-center">
                  <div
                    className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-2xl mx-auto mb-4"
                    style={{ backgroundColor: "var(--btn)" }}
                  >
                    <svg
                      className="w-6 h-6 sm:w-8 sm:h-8 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </div>
                  <h3
                    className="text-lg sm:text-xl font-semibold mb-3"
                    style={{ color: "var(--txt)" }}
                  >
                    Questions or Concerns?
                  </h3>
                  <p
                    className="mb-4 sm:mb-6"
                    style={{ color: "var(--txt-dim)" }}
                  >
                    We are here to help! If you have any questions about this
                    privacy policy or how we handle your data, please do not
                    hesitate to reach out.
                  </p>
                  <div
                    className="inline-flex items-center px-4 sm:px-6 py-3 rounded-xl border shadow-sm transition-colors duration-200 hover:opacity-80"
                    style={{
                      backgroundColor: "var(--bg-ter)",
                      borderColor: "var(--bg-primary)",
                    }}
                  >
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5 mr-3"
                      style={{ color: "var(--btn)" }}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                    <span
                      className="text-base sm:text-lg font-semibold"
                      style={{ color: "var(--txt)" }}
                    >
                      <a
                        href="https://mail.google.com/mail/?view=cm&fs=1&to=rishucodingdrive@gmail.com"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        rishucodingdrive@gmail.com
                      </a>
                    </span>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 sm:mt-12">
          <p className="text-sm" style={{ color: "var(--txt-disabled)" }}>
            This privacy policy is effective as of June 28, 2025 and will remain
            in effect except with respect to any changes in its provisions in
            the future.
          </p>
        </div>
      </div>
    </div>
  );
}
