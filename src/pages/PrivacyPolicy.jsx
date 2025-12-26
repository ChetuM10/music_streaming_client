import { Link } from "react-router-dom";

/**
 * Privacy Policy Page
 * GDPR Compliance - Required for data processing transparency
 */
const PrivacyPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-white mb-6">Privacy Policy</h1>
      <p className="text-[var(--text-secondary)] mb-8">
        Last updated: {new Date().toLocaleDateString()}
      </p>

      <div className="space-y-8 text-[var(--text-secondary)]">
        <section>
          <h2 className="text-xl font-semibold text-white mb-3">
            1. Information We Collect
          </h2>
          <p className="mb-3">We collect the following types of information:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong className="text-white">Account Information:</strong> Email
              address, username, and password when you create an account.
            </li>
            <li>
              <strong className="text-white">Listening History:</strong> Tracks
              you play, playlists you create, and your favorites.
            </li>
            <li>
              <strong className="text-white">Usage Data:</strong> How you
              interact with the app to improve our service.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">
            2. How We Use Your Information
          </h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>To provide personalized music recommendations</li>
            <li>To maintain your playlists and listening history</li>
            <li>To improve our service and user experience</li>
            <li>To communicate with you about updates and features</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">
            3. Your Rights (GDPR)
          </h2>
          <p className="mb-3">Under GDPR, you have the following rights:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong className="text-white">Right to Access:</strong> You can
              export all your data at any time from your account settings.
            </li>
            <li>
              <strong className="text-white">Right to Deletion:</strong> You can
              delete your account and all associated data permanently.
            </li>
            <li>
              <strong className="text-white">Right to Portability:</strong> Your
              data export is in a standard JSON format.
            </li>
            <li>
              <strong className="text-white">Right to Rectification:</strong>{" "}
              You can update your profile information at any time.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">
            4. Data Retention
          </h2>
          <p>
            We retain your data for as long as your account is active. When you
            delete your account, all personal data is permanently removed within
            30 days. Anonymous, aggregated analytics data may be retained for
            service improvement.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">
            5. Data Security
          </h2>
          <p>
            We use industry-standard security measures including encryption,
            secure connections (HTTPS), and regular security audits to protect
            your data.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">
            6. Third-Party Services
          </h2>
          <p>We use the following third-party services:</p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>
              <strong className="text-white">Supabase:</strong> Authentication
              and database hosting
            </li>
            <li>
              <strong className="text-white">Sentry:</strong> Error monitoring
              (anonymous)
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">
            7. Contact Us
          </h2>
          <p>
            If you have any questions about this Privacy Policy, please contact
            us at{" "}
            <a
              href="mailto:privacy@melodify.app"
              className="text-[var(--accent-primary)] hover:underline"
            >
              privacy@melodify.app
            </a>
          </p>
        </section>

        <section className="bg-[var(--bg-tertiary)] rounded-lg p-6 mt-8">
          <h3 className="text-lg font-semibold text-white mb-3">
            Manage Your Data
          </h3>
          <p className="mb-4">
            You can export or delete your data from your account settings.
          </p>
          <div className="flex gap-4">
            <Link
              to="/settings"
              className="px-4 py-2 bg-[var(--accent-primary)] text-black rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              Go to Settings
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
