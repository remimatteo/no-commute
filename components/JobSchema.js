import Head from 'next/head';

/**
 * JobPosting Schema.org structured data for Google rich results
 * Helps jobs appear in Google for Jobs and other search features
 */
export default function JobSchema({ job }) {
  if (!job) return null;

  const schema = {
    "@context": "https://schema.org/",
    "@type": "JobPosting",
    "title": job.title,
    "description": job.description || `${job.title} position at ${job.company}`,
    "identifier": {
      "@type": "PropertyValue",
      "name": job.company,
      "value": job.id
    },
    "datePosted": job.created_at || job.postedDate,
    "validThrough": job.validThrough || new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(), // 60 days from now
    "employmentType": job.type || "FULL_TIME",
    "hiringOrganization": {
      "@type": "Organization",
      "name": job.company,
      "sameAs": job.company_url || ""
    },
    "jobLocation": {
      "@type": "Place",
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "Remote",
        "addressLocality": job.location || "Worldwide"
      }
    },
    "applicantLocationRequirements": {
      "@type": "Country",
      "name": job.location || "Worldwide"
    },
    "jobLocationType": "TELECOMMUTE",
    "baseSalary": job.salary && job.salary !== "Competitive" ? {
      "@type": "MonetaryAmount",
      "currency": "USD",
      "value": {
        "@type": "QuantitativeValue",
        "value": job.salary,
        "unitText": "YEAR"
      }
    } : undefined
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
