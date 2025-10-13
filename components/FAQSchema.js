import Head from 'next/head';

/**
 * FAQ Schema for better Google search results
 * Helps show FAQ rich snippets in search
 */
export default function FAQSchema() {
  const faqs = [
    {
      question: "What types of remote jobs are available on No Commute Jobs?",
      answer: "We list 2000+ remote positions across all categories including Software Development, Design, Marketing, Sales, Customer Service, Product Management, Data Analysis, DevOps, Finance, HR, Writing, Project Management, and QA roles. All jobs are fully remote and updated daily."
    },
    {
      question: "Are all jobs on No Commute Jobs completely remote?",
      answer: "Yes! Every job listed on No Commute Jobs is 100% remote. We only list positions that allow you to work from anywhere, with no office requirement. You can filter by location if you need timezone-specific roles."
    },
    {
      question: "How often are new jobs added?",
      answer: "We update our job listings multiple times per day by aggregating positions from top remote job boards including RemoteOK and Remotive. New jobs are added as soon as they're posted by companies."
    },
    {
      question: "Is No Commute Jobs free to use for job seekers?",
      answer: "Absolutely! No Commute Jobs is 100% free for job seekers. You can search, filter, and apply to any job without creating an account or paying anything. We only charge companies to post jobs."
    },
    {
      question: "How much does it cost to post a remote job?",
      answer: "Job postings cost $99 for a 30-day listing. Your job goes live immediately after payment and stays active for 30 days, reaching thousands of remote job seekers actively looking for opportunities."
    },
    {
      question: "Can I filter jobs by salary?",
      answer: "Yes! We have a 'Salary Listed' filter that shows only jobs with disclosed salary ranges. We display actual salary information when provided by companies, helping you find transparent employers who value pay equity."
    },
    {
      question: "Do you list entry-level remote jobs?",
      answer: "Yes, we list remote jobs for all experience levels including entry-level positions, junior roles, mid-level, senior, and executive positions. Use our search to find 'entry level' or 'junior' positions that match your skills."
    },
    {
      question: "How do I apply to jobs on No Commute Jobs?",
      answer: "Click on any job listing to view full details, then click the 'Apply on Company Website' button. This takes you directly to the company's application page where you can submit your resume and information."
    }
  ];

  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
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
