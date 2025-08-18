import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ 
  title, 
  description, 
  keywords, 
  image, 
  url, 
  type = 'website',
  structuredData,
  noindex = false 
}) => {
  const defaultTitle = 'EduHaven - Premium Study Platform | Study Rooms, Focus Tools & Learning Games';
  const defaultDescription = 'Transform your learning experience with EduHaven. Join study rooms, use focus timers, play educational games, and collaborate with students worldwide.';
  const defaultImage = 'https://eduhaven.online/og-image.jpg';
  const defaultUrl = 'https://eduhaven.online';

  const seoTitle = title ? `${title} | EduHaven` : defaultTitle;
  const seoDescription = description || defaultDescription;
  const seoImage = image || defaultImage;
  const seoUrl = url || defaultUrl;

  useEffect(() => {
    // Update document title for better UX
    document.title = seoTitle;
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', seoDescription);
    }
  }, [seoTitle, seoDescription]);

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{seoTitle}</title>
      <meta name="description" content={seoDescription} />
      {keywords && <meta name="keywords" content={keywords} />}
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      
      {/* Canonical URL */}
      <link rel="canonical" href={seoUrl} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={seoUrl} />
      <meta property="og:title" content={seoTitle} />
      <meta property="og:description" content={seoDescription} />
      <meta property="og:image" content={seoImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="EduHaven" />
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={seoUrl} />
      <meta property="twitter:title" content={seoTitle} />
      <meta property="twitter:description" content={seoDescription} />
      <meta property="twitter:image" content={seoImage} />
      
      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
      
      {/* Additional Meta Tags */}
      <meta name="author" content="EduHaven Team" />
      <meta name="language" content="English" />
      
      {/* Preload critical resources */}
      <link rel="preload" href="/Logo.svg" as="image" type="image/svg+xml" />
      <link rel="preload" href="/Page1LightScreenshot.png" as="image" />
    </Helmet>
  );
};

export default SEO;
