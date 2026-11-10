/**
 * Structured data for search and AI engines, rendered in the server HTML so
 * crawlers that do not run JavaScript still read it. `<` is escaped so text
 * from the database can never close the script element.
 */
export default function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  );
}
