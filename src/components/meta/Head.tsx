import Head from "next/head";

interface MetaProps {
  title?: string;
  description?: string;
  image?: string;
}

export function Meta({
  title = "WanderPlan Studio",
  description = "Plan your next adventure with WanderPlan Studio - Create personalized travel itineraries, discover new destinations, and share your experiences with fellow travelers.",
  image = "/og-image.png",
}: MetaProps) {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://wanderplan.studio";

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={siteUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={`${siteUrl}${image}`} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={siteUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${siteUrl}${image}`} />
    </Head>
  );
}
