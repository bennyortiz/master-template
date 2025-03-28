/**
 * Schema.org JSON-LD markup generator
 * Generates structured data for SEO based on site configuration
 */

import { siteConfig } from './site';

/**
 * Generate Organization schema
 */
export const generateOrganizationSchema = () => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    logo: `${siteConfig.url}/images/logo.svg`,
    email: siteConfig.contact.email,
    telephone: siteConfig.contact.phone,
    address: {
      '@type': 'PostalAddress',
      streetAddress: siteConfig.contact.address.split(',')[0]?.trim(),
      addressLocality: siteConfig.contact.address.split(',')[1]?.trim(),
      addressRegion: siteConfig.contact.address.split(',')[2]?.trim()?.split(' ')[0],
      postalCode: siteConfig.contact.address.split(',')[2]?.trim()?.split(' ')[1],
      addressCountry: 'US',
    },
    sameAs: [
      siteConfig.social.facebook,
      siteConfig.social.twitter,
      siteConfig.social.instagram,
      siteConfig.social.linkedin,
    ],
    openingHoursSpecification: siteConfig.businessHours
      .filter(hour => hour.hours !== 'Closed')
      .map(hour => ({
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: `https://schema.org/${hour.day}`,
        opens: hour.hours.split('-')[0]?.trim(),
        closes: hour.hours.split('-')[1]?.trim(),
      })),
  };
};

/**
 * Generate LocalBusiness schema
 */
export const generateLocalBusinessSchema = () => {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${siteConfig.url}/#localbusiness`,
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    telephone: siteConfig.contact.phone,
    email: siteConfig.contact.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: siteConfig.contact.address.split(',')[0]?.trim(),
      addressLocality: siteConfig.contact.address.split(',')[1]?.trim(),
      addressRegion: siteConfig.contact.address.split(',')[2]?.trim()?.split(' ')[0],
      postalCode: siteConfig.contact.address.split(',')[2]?.trim()?.split(' ')[1],
      addressCountry: 'US',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 40.7128, // Example coordinates - replace with actual business location
      longitude: -74.006,
    },
    openingHoursSpecification: siteConfig.businessHours
      .filter(hour => hour.hours !== 'Closed')
      .map(hour => ({
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: `https://schema.org/${hour.day}`,
        opens: hour.hours.split('-')[0]?.trim(),
        closes: hour.hours.split('-')[1]?.trim(),
      })),
    priceRange: '$$',
    image: `${siteConfig.url}${siteConfig.defaultMetadata.ogImage}`,
    sameAs: [
      siteConfig.social.facebook,
      siteConfig.social.twitter,
      siteConfig.social.instagram,
      siteConfig.social.linkedin,
    ],
  };
};

/**
 * Generate WebSite schema
 */
export const generateWebsiteSchema = () => {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${siteConfig.url}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
};

/**
 * Generate Service schema for each service
 */
export const generateServicesSchema = () => {
  return siteConfig.services.map(service => ({
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.title,
    description: service.description,
    provider: {
      '@type': 'Organization',
      name: siteConfig.name,
      url: siteConfig.url,
    },
    url: `${siteConfig.url}/services/${service.id}`,
    image: `${siteConfig.url}${service.imageUrl}`,
  }));
};

/**
 * Generate the complete schema object for a page
 * @param type Type of page to generate schema for ('home', 'about', 'service', etc.)
 * @param additionalData Any additional data needed for the schema
 */
export const generatePageSchema = (
  type: 'home' | 'about' | 'services' | 'contact' | 'service' | 'gallery',
  additionalData?: any
) => {
  const baseSchemas = [generateWebsiteSchema(), generateOrganizationSchema()];

  switch (type) {
    case 'home':
      return [...baseSchemas, generateLocalBusinessSchema()];
    case 'services':
      return [...baseSchemas, ...generateServicesSchema()];
    case 'gallery':
      return [...baseSchemas, {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Gallery | ' + siteConfig.name,
        description: 'Portfolio and examples of our work',
        isPartOf: {
          '@type': 'WebSite',
          name: siteConfig.name,
          url: siteConfig.url
        },
        url: `${siteConfig.url}/gallery`,
      }];
    case 'service':
      if (additionalData?.serviceId) {
        const service = siteConfig.services.find(s => s.id === additionalData.serviceId);
        if (service) {
          return [
            ...baseSchemas,
            {
              '@context': 'https://schema.org',
              '@type': 'Service',
              name: service.title,
              description: service.description,
              provider: {
                '@type': 'Organization',
                name: siteConfig.name,
                url: siteConfig.url,
              },
              url: `${siteConfig.url}/services/${service.id}`,
              image: `${siteConfig.url}${service.imageUrl}`,
            },
          ];
        }
      }
      return baseSchemas;
    default:
      return baseSchemas;
  }
}; 