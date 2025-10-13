import Head from 'next/head';

// Website Schema
export function WebsiteSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "No Commute Jobs",
    "url": "https://no-commute-jobs.com",
    "description": "Find remote job opportunities from verified companies",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://no-commute-jobs.com/?search={search_term_string}",
      "query-input": "required name=search_term_string"
    }
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

// Job Posting Schema
export function JobPostingSchema({ job }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    "title": job.title,
    "description": job.description,
    "datePosted": job.posted_date || job.created_at,
    "validThrough": new Date(new Date(job.posted_date || job.created_at).setMonth(new Date(job.posted_date || job.created_at).getMonth() + 2)).toISOString(),
    "employmentType": job.type || "FULL_TIME",
    "hiringOrganization": {
      "@type": "Organization",
      "name": job.company
    },
    "jobLocation": {
      "@type": "Place",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": job.location || "Remote",
        "addressCountry": "Worldwide"
      }
    },
    "applicantLocationRequirements": {
      "@type": "Country",
      "name": "Worldwide"
    },
    "jobLocationType": "TELECOMMUTE"
  };

  // Add salary if available
  if (job.salary) {
    schema.baseSalary = {
      "@type": "MonetaryAmount",
      "currency": "USD",
      "value": {
        "@type": "QuantitativeValue",
        "value": job.salary,
        "unitText": "YEAR"
      }
    };
  }

  return (
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </Head>
  );
}

// Organization Schema
export function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "No Commute Jobs",
    "url": "https://no-commute-jobs.com",
    "logo": "https://no-commute-jobs.com/logo.png",
    "description": "Remote job board featuring 2000+ verified remote positions updated daily",
    // TODO: Create these social accounts and update URLs:
    // Twitter/X: Create @nocommutejobs
    // LinkedIn: Create company page
    "sameAs": [
      // "https://twitter.com/nocommutejobs",  // TODO: Create account
      // "https://linkedin.com/company/nocommutejobs"  // TODO: Create page
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