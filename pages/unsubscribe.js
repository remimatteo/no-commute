import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import SEO from '../components/SEO';

export default function Unsubscribe() {
  const router = useRouter();
  const [email, setEmail] = useState(router.query.email || '');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleUnsubscribe = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/newsletter/unsubscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
      } else {
        setError(data.error || 'Failed to unsubscribe');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO
        title="Unsubscribe from Newsletter - No Commute Jobs"
        description="Unsubscribe from the No Commute Jobs newsletter"
        noindex={true}
      />

      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-md mx-auto">
          {/* Logo/Header */}
          <div className="text-center mb-8">
            <Link href="/">
              <img
                src="/logo.png"
                alt="No Commute Logo"
                className="w-16 h-16 mx-auto mb-4 cursor-pointer"
              />
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">
              Unsubscribe from Newsletter
            </h1>
          </div>

          {success ? (
            // Success Message
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <div className="text-green-600 text-5xl mb-4">✓</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                You've been unsubscribed
              </h2>
              <p className="text-gray-600 mb-6">
                We're sorry to see you go! You won't receive any more newsletters from us.
              </p>
              <p className="text-gray-600 mb-6">
                You can still browse all our remote jobs anytime.
              </p>
              <Link href="/">
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3 rounded-lg transition-colors">
                  Browse Remote Jobs
                </button>
              </Link>
            </div>
          ) : (
            // Unsubscribe Form
            <div className="bg-white rounded-xl shadow-lg p-8">
              <p className="text-gray-600 mb-6 text-center">
                We're sorry to see you go. Enter your email below to unsubscribe from our weekly newsletter.
              </p>

              <form onSubmit={handleUnsubscribe} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="your@email.com"
                  />
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3 rounded-lg transition-colors disabled:opacity-50"
                >
                  {loading ? 'Unsubscribing...' : 'Unsubscribe'}
                </button>
              </form>

              <div className="mt-6 text-center">
                <Link href="/">
                  <span className="text-blue-600 hover:text-blue-700 text-sm cursor-pointer">
                    ← Back to homepage
                  </span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
