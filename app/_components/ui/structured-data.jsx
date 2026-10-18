import { serializeSchema } from "../../_lib/seo";

export default function StructuredData({ data }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeSchema({ "@context": "https://schema.org", "@graph": Array.isArray(data) ? data : [data] }) }} />;
}
