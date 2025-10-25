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

// Job Posting Schema - Google for Jobs Optimized
export function JobPostingSchema({ job }) {
  // Parse employment type - map common variations to schema.org standards
  const employmentTypeMap = {
    'full-time': 'FULL_TIME',
    'full time': 'FULL_TIME',
    'fulltime': 'FULL_TIME',
    'part-time': 'PART_TIME',
    'part time': 'PART_TIME',
    'parttime': 'PART_TIME',
    'contract': 'CONTRACTOR',
    'contractor': 'CONTRACTOR',
    'temporary': 'TEMPORARY',
    'intern': 'INTERN',
    'internship': 'INTERN',
    'volunteer': 'VOLUNTEER'
  };

  const jobType = job.type ? job.type.toLowerCase() : 'full-time';
  const employmentType = employmentTypeMap[jobType] || 'FULL_TIME';

  const schema = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    "title": job.title,
    "description": job.description || `${job.title} at ${job.company}. Remote ${employmentType} position.`,
    "identifier": {
      "@type": "PropertyValue",
      "name": job.company,
      "value": job.id.toString()
    },
    "datePosted": job.posted_date || job.created_at,
    "validThrough": new Date(new Date(job.posted_date || job.created_at).setMonth(new Date(job.posted_date || job.created_at).getMonth() + 2)).toISOString(),
    "employmentType": employmentType,
    "hiringOrganization": {
      "@type": "Organization",
      "name": job.company,
      "sameAs": job.company_url || undefined,
      "logo": job.company_url ? `https://logo.clearbit.com/${new URL(job.company_url.startsWith('http') ? job.company_url : `https://${job.company_url}`).hostname}` : undefined
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
    "jobLocationType": "TELECOMMUTE",
    "directApply": true,
    "applicationContact": {
      "@type": "ContactPoint",
      "contactType": "HR",
      "url": job.apply_url || job.url
    }
  };

  // Add salary if available and contains numbers
  if (job.salary && job.salary.match(/\d/)) {
    // Extract salary numbers - handle ranges like "$80k-$120k" or "$100,000"
    const salaryString = job.salary.replace(/[,$]/g, '');
    const numbers = salaryString.match(/\d+/g);

    if (numbers && numbers.length > 0) {
      let minValue, maxValue;

      if (numbers.length === 1) {
        // Single value like "$100k"
        minValue = maxValue = parseInt(numbers[0]) * (salaryString.toLowerCase().includes('k') ? 1000 : 1);
      } else {
        // Range like "$80k-$120k"
        minValue = parseInt(numbers[0]) * (salaryString.toLowerCase().includes('k') ? 1000 : 1);
        maxValue = parseInt(numbers[1]) * (salaryString.toLowerCase().includes('k') ? 1000 : 1);
      }

      schema.baseSalary = {
        "@type": "MonetaryAmount",
        "currency": "USD",
        "value": {
          "@type": "QuantitativeValue",
          "minValue": minValue,
          "maxValue": maxValue,
          "unitText": "YEAR"
        }
      };
    }
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
    "foundingDate": "2024",
    "sameAs": [
      "https://twitter.com/nocommutejobs",
      "https://linkedin.com/company/nocommutejobs"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer support",
      "email": "hello@no-commute-jobs.com"
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

// BreadcrumbList Schema
export function BreadcrumbSchema({ items }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
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

// Article Schema for Blog Posts
export function ArticleSchema({ post }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "description": post.excerpt,
    "image": post.image || "https://no-commute-jobs.com/og-image.jpg",
    "datePublished": post.date,
    "dateModified": post.dateModified || post.date,
    "author": {
      "@type": "Person",
      "name": post.author
    },
    "publisher": {
      "@type": "Organization",
      "name": "No Commute Jobs",
      "logo": {
        "@type": "ImageObject",
        "url": "https://no-commute-jobs.com/logo.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://no-commute-jobs.com/blog/${post.slug}`
    },
    "keywords": post.tags ? post.tags.join(', ') : ''
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