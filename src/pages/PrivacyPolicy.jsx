import { Link } from "react-router-dom";

/**
 * Privacy Policy Page - Unstyled
 */
const PrivacyPolicy = () => {
  return (
    <div>
      <h1>Privacy Policy</h1>
      <p>Last updated: {new Date().toLocaleDateString()}</p>

      <div>
        <section>
          <h2>1. Information We Collect</h2>
          <p>We collect the following types of information:</p>
          <ul>
            <li>
              <strong>Account Information:</strong> Email address, username, and
              password when you create an account.
            </li>
            <li>
              <strong>Listening History:</strong> Tracks you play, playlists you
              create, and your favorites.
            </li>
            <li>
              <strong>Usage Data:</strong> How you interact with the app to
              improve our service.
            </li>
          </ul>
        </section>

        <section>
          <h2>2. How We Use Your Information</h2>
          <ul>
            <li>To provide personalized music recommendations</li>
            <li>To maintain your playlists and listening history</li>
            <li>To improve our service and user experience</li>
            <li>To communicate with you about updates and features</li>
          </ul>
        </section>

        <section>
          <h2>3. Your Rights (GDPR)</h2>
          <p>Under GDPR, you have the following rights:</p>
          <ul>
            <li>
              <strong>Right to Access:</strong> You can export all your data at
              any time from your account settings.
            </li>
            <li>
              <strong>Right to Deletion:</strong> You can delete your account
              and all associated data permanently.
            </li>
            <li>
              <strong>Right to Portability:</strong> Your data export is in a
              standard JSON format.
            </li>
            <li>
              <strong>Right to Rectification:</strong> You can update your
              profile information at any time.
            </li>
          </ul>
        </section>

        <section>
          <h2>4. Data Retention</h2>
          <p>
            We retain your data for as long as your account is active. When you
            delete your account, all personal data is permanently removed within
            30 days.
          </p>
        </section>

        <section>
          <h2>5. Data Security</h2>
          <p>
            We use industry-standard security measures including encryption,
            secure connections (HTTPS), and regular security audits.
          </p>
        </section>

        <section>
          <h2>6. Third-Party Services</h2>
          <p>We use the following third-party services:</p>
          <ul>
            <li>
              <strong>Supabase:</strong> Authentication and database hosting
            </li>
            <li>
              <strong>Sentry:</strong> Error monitoring (anonymous)
            </li>
          </ul>
        </section>

        <section>
          <h2>7. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact
            us at <a href="mailto:privacy@melodify.app">privacy@melodify.app</a>
          </p>
        </section>

        <section>
          <h3>Manage Your Data</h3>
          <p>You can export or delete your data from your account settings.</p>
          <div>
            <Link to="/settings">Go to Settings</Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
