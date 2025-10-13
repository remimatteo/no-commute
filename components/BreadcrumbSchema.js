import Head from 'next/head';

/**
 * BreadcrumbList Schema for better Google navigation
 * Shows breadcrumb trails in search results
 */
export default function BreadcrumbSchema({ jobTitle, jobId, slug }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://no-commute-jobs.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Jobs",
        "item": "https://no-commute-jobs.com/#jobs"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": jobTitle,
        "item": `https://no-commute-jobs.com/jobs/${jobId}/${slug}`
      }
    ]
  };

  return (
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </Head>
  );
}
