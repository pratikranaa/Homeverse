require('dotenv').config();
const { sequelize, testConnection } = require('./config');
const logger = require('../helpers/logger');
const { ContentPage, ContentSection } = require('../models');

const seedData = async () => {
  try {
    logger.info('Starting database seeding...');
    
    // Test connection
    const connected = await testConnection();
    if (!connected) {
      throw new Error('Database connection failed');
    }

    // Check if data already exists
    const existingPages = await ContentPage.count();
    if (existingPages > 0) {
      logger.info('Database already contains data. Skipping seed.');
      return;
    }

    // Create content pages
    const pages = [
      {
        page_key: 'buyer-landing',
        title: 'Buyer Landing Page',
        description: 'Landing page for property buyers',
        is_active: true
      },
      {
        page_key: 'seller-landing',
        title: 'Seller Landing Page',
        description: 'Landing page for property sellers',
        is_active: true
      },
      {
        page_key: 'about',
        title: 'About Us',
        description: 'Company information and mission',
        is_active: true
      },
      {
        page_key: 'contact',
        title: 'Contact Us',
        description: 'Contact information and form',
        is_active: true
      },
      {
        page_key: 'home',
        title: 'Home Page',
        description: 'Main landing page with banners, testimonials, and FAQs',
        is_active: true
      }
    ];

    const createdPages = await ContentPage.bulkCreate(pages);
    logger.info(`Created ${createdPages.length} content pages`);

    // Create content sections for each page
    const sections = [];

    // Buyer Landing Page sections
    const buyerPage = createdPages.find(p => p.page_key === 'buyer-landing');
    sections.push(
      {
        page_id: buyerPage.id,
        section_key: 'hero',
        section_type: 'hero',
        content: {
          title: 'Find Your Dream Home',
          subtitle: 'Discover the perfect property with our expert guidance',
          cta_text: 'Browse Properties',
          cta_link: '/properties',
          background_image: '/images/buyer-hero.jpg'
        },
        sort_order: 1,
        is_active: true
      },
      {
        page_id: buyerPage.id,
        section_key: 'features',
        section_type: 'features',
        content: {
          title: 'Why Choose Us',
          items: [
            {
              icon: 'search',
              title: 'Extensive Listings',
              description: 'Access thousands of verified properties'
            },
            {
              icon: 'shield',
              title: 'Trusted Service',
              description: 'Secure and transparent transactions'
            },
            {
              icon: 'support',
              title: 'Expert Support',
              description: '24/7 customer assistance'
            }
          ]
        },
        sort_order: 2,
        is_active: true
      }
    );

    // Seller Landing Page sections
    const sellerPage = createdPages.find(p => p.page_key === 'seller-landing');
    sections.push(
      {
        page_id: sellerPage.id,
        section_key: 'hero',
        section_type: 'hero',
        content: {
          title: 'Sell Your Property Fast',
          subtitle: 'Get the best price with our proven marketing strategies',
          cta_text: 'List Your Property',
          cta_link: '/list-property',
          background_image: '/images/seller-hero.jpg'
        },
        sort_order: 1,
        is_active: true
      },
      {
        page_id: sellerPage.id,
        section_key: 'benefits',
        section_type: 'features',
        content: {
          title: 'Selling Made Easy',
          items: [
            {
              icon: 'chart',
              title: 'Market Analysis',
              description: 'Get accurate property valuations'
            },
            {
              icon: 'megaphone',
              title: 'Wide Exposure',
              description: 'Reach thousands of potential buyers'
            },
            {
              icon: 'handshake',
              title: 'Dedicated Agent',
              description: 'Personal support throughout the process'
            }
          ]
        },
        sort_order: 2,
        is_active: true
      }
    );

    // About Page sections
    const aboutPage = createdPages.find(p => p.page_key === 'about');
    sections.push(
      {
        page_id: aboutPage.id,
        section_key: 'mission',
        section_type: 'text',
        content: {
          title: 'Our Mission',
          body: 'We are committed to making real estate transactions simple, transparent, and accessible for everyone.'
        },
        sort_order: 1,
        is_active: true
      },
      {
        page_id: aboutPage.id,
        section_key: 'team',
        section_type: 'team',
        content: {
          title: 'Meet Our Team',
          members: [
            {
              name: 'John Smith',
              role: 'CEO',
              image: '/images/team/john.jpg',
              bio: 'Leading the company with 20 years of real estate experience'
            },
            {
              name: 'Sarah Johnson',
              role: 'Head of Sales',
              image: '/images/team/sarah.jpg',
              bio: 'Expert in property marketing and client relations'
            }
          ]
        },
        sort_order: 2,
        is_active: true
      }
    );

    // Contact Page sections
    const contactPage = createdPages.find(p => p.page_key === 'contact');
    sections.push(
      {
        page_id: contactPage.id,
        section_key: 'contact_info',
        section_type: 'contact',
        content: {
          title: 'Get In Touch',
          phone: '+1-234-567-8900',
          email: 'info@example.com',
          address: '123 Real Estate Ave, City, State 12345',
          hours: 'Mon-Fri: 9AM-6PM, Sat: 10AM-4PM'
        },
        sort_order: 1,
        is_active: true
      }
    );

    // Home Page sections
    const homePage = createdPages.find(p => p.page_key === 'home');
    sections.push(
      {
        page_id: homePage.id,
        section_key: 'banner',
        section_type: 'banner',
        content: {
          title: 'Welcome to Your Real Estate Partner',
          subtitle: 'Buy, Sell, or Rent with Confidence',
          cta_primary: {
            text: 'Buy Property',
            link: '/buyer-landing'
          },
          cta_secondary: {
            text: 'Sell Property',
            link: '/seller-landing'
          },
          background_image: '/images/home-banner.jpg'
        },
        sort_order: 1,
        is_active: true
      },
      {
        page_id: homePage.id,
        section_key: 'testimonials',
        section_type: 'testimonials',
        content: {
          title: 'What Our Clients Say',
          items: [
            {
              name: 'Michael Brown',
              role: 'Property Buyer',
              text: 'Found my dream home in just 2 weeks! Excellent service.',
              rating: 5,
              image: '/images/testimonials/michael.jpg'
            },
            {
              name: 'Emily Davis',
              role: 'Property Seller',
              text: 'Sold my property above asking price. Highly recommend!',
              rating: 5,
              image: '/images/testimonials/emily.jpg'
            }
          ]
        },
        sort_order: 2,
        is_active: true
      },
      {
        page_id: homePage.id,
        section_key: 'faq',
        section_type: 'faq',
        content: {
          title: 'Frequently Asked Questions',
          items: [
            {
              question: 'How long does it take to buy a property?',
              answer: 'The process typically takes 30-60 days from offer to closing, depending on financing and inspections.'
            },
            {
              question: 'What fees are involved in selling?',
              answer: 'Standard fees include agent commission (typically 5-6%), closing costs, and any necessary repairs or staging.'
            },
            {
              question: 'Do you offer property management services?',
              answer: 'Yes, we provide comprehensive property management for landlords and investors.'
            }
          ]
        },
        sort_order: 3,
        is_active: true
      }
    );

    const createdSections = await ContentSection.bulkCreate(sections);
    logger.info(`Created ${createdSections.length} content sections`);

    logger.info('Database seeding completed successfully');
  } catch (error) {
    logger.error('Seeding failed:', error);
    throw error;
  }
};

// Run seeding if called directly
if (require.main === module) {
  seedData()
    .then(() => {
      logger.info('Seed script completed');
      process.exit(0);
    })
    .catch((error) => {
      logger.error('Seed script failed:', error);
      process.exit(1);
    });
}

module.exports = { seedData };
