# SEO Launch Checklist

Use this checklist before opening public indexing for the GCSE Russian marketing cluster.

## URL And Indexing

- Confirm `/` is intentionally the app home and `/marketing` is the marketing home.
- Confirm clean public resource URLs are live: `/gcse-russian-course`, `/pricing`, `/resources`, `/edexcel-gcse-russian`, `/gcse-russian-revision`, `/gcse-russian-past-papers`, `/russian-gcse-private-candidate`.
- Confirm legacy `/marketing/:path*` redirects to the matching clean URL.
- Confirm platform, admin, auth, account, dashboard, mock exam, grammar, vocabulary, courses, assignments, teacher, profile, and settings routes remain disallowed or noindexed as intended.
- Submit `/sitemap.xml` in Google Search Console after production DNS and canonical host are final.

## Metadata And Structured Data

- Run `npm run seo:check`.
- Run `npm run build`.
- Spot-check canonical URLs on:
  - `/marketing`
  - `/gcse-russian-course`
  - `/edexcel-gcse-russian`
  - `/pricing`
  - `/russian-gcse-private-candidate`
  - `/gcse-russian-past-papers`
- Validate structured data with Google's Rich Results Test or Schema Markup Validator for:
  - Course schema on `/gcse-russian-course`
  - Product/Offer schema on `/pricing`
  - FAQ schema on priority guide pages
  - Breadcrumb schema on public guide pages
- Check page-specific OG images for:
  - `/og/course`
  - `/og/edexcel`
  - `/og/revision`
  - `/og/past-papers`
  - `/og/private-candidates`
  - `/og/pricing`

## Content QA

- Check Edexcel 1RU0 details against the latest Pearson qualification page before launch.
- Check every guide has at least one contextual internal link to the course or pricing path.
- Check private-candidate copy clearly separates course preparation from exam-centre entry responsibilities.
- Check pricing copy matches the active product catalogue and trial-first billing flow.
- Check no blog placeholder is indexed until there is a real publishing plan.

## Search Console

- Add and verify the canonical host property.
- Submit sitemap.
- Request indexing for the marketing home and top priority pages.
- Inspect `/robots.txt` in Search Console.
- Monitor Coverage, Page indexing, Enhancements, and Core Web Vitals after launch.

## Post-Launch

- Add page-specific OG images for any new high-intent guide pages.
- Expand pages that start receiving impressions but low clicks.
- Add examples and FAQ entries based on real parent/student questions.
- Review query data monthly and update internal links accordingly.
