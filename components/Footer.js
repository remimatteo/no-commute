import Link from 'next/link';

export default function Footer({ darkMode = false }) {
  const locations = [
    { name: 'USA', slug: 'usa', emoji: '🇺🇸' },
    { name: 'Europe', slug: 'europe', emoji: '🇪🇺' },
    { name: 'Canada', slug: 'canada', emoji: '🇨🇦' },
    { name: 'UK', slug: 'uk', emoji: '🇬🇧' },
    { name: 'Australia', slug: 'australia', emoji: '🇦🇺' },
    { name: 'Asia', slug: 'asia', emoji: '🌏' }
  ];

  const categories = [
    { name: 'Software Development', slug: 'software-development', emoji: '💻' },
    { name: 'Design', slug: 'design', emoji: '🎨' },
    { name: 'Marketing', slug: 'marketing', emoji: '📈' },
    { name: 'Sales', slug: 'sales', emoji: '💼' },
    { name: 'Customer Service', slug: 'customer-service', emoji: '🎧' },
    { name: 'Product', slug: 'product', emoji: '🚀' },
    { name: 'Data Analysis', slug: 'data-analysis', emoji: '📊' },
    { name: 'Writing', slug: 'writing', emoji: '✍️' }
  ];

  return (
    <footer className={`${darkMode ? 'bg-gray-900' : 'bg-gray-900'} text-white py-12 border-t ${darkMode ? 'border-gray-800' : 'border-gray-800'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">

          {/* Company Info */}
          <div>
            <h3 className="font-bold text-lg mb-4">No Commute</h3>
            <p className="text-gray-400 text-sm mb-4">
              Find your perfect remote job from 3000+ verified listings. Work from anywhere, live everywhere.
            </p>
            <div className="flex gap-4">
              {/* Social links can go here */}
            </div>
          </div>

          {/* Browse by Location */}
          <div>
            <h4 className="font-bold mb-4">Browse by Location</h4>
            <ul className="space-y-2 text-sm">
              {locations.map(location => (
                <li key={location.slug}>
                  <Link
                    href={`/remote-jobs/${location.slug}`}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {location.emoji} Remote Jobs in {location.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Browse by Category */}
          <div>
            <h4 className="font-bold mb-4">Browse by Category</h4>
            <ul className="space-y-2 text-sm">
              {categories.map(category => (
                <li key={category.slug}>
                  <Link
                    href={`/category/${category.slug}`}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {category.emoji} {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-bold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/blog" className="text-gray-400 hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/post-job" className="text-gray-400 hover:text-white transition-colors">
                  Post a Job
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © 2025 No Commute Jobs. All rights reserved. Work from anywhere, live everywhere.
          </p>
        </div>
      </div>
    </footer>
  );
}
