require('dotenv').config();
const { sequelize } = require('./config');
const { ContentPage, ContentSection } = require('../models');
const logger = require('../helpers/logger');

const addCtaToBuyerLanding = async () => {
    try {
        logger.info('Starting CTA section addition...');

        // Find buyer-landing page
        const buyerPage = await ContentPage.findOne({ where: { page_key: 'buyer-landing' } });

        if (!buyerPage) {
            throw new Error('Buyer landing page not found');
        }

        // Check if CTA section already exists
        const existingCta = await ContentSection.findOne({
            where: {
                page_id: buyerPage.id,
                section_key: 'cta'
            }
        });

        if (existingCta) {
            logger.info('CTA section already exists for buyer-landing. Skipping.');
            return;
        }

        // Create CTA section
        await ContentSection.create({
            page_id: buyerPage.id,
            section_key: 'cta',
            section_type: 'cta',
            content: {
                title: 'Ready to Buy?',
                description: 'Get in touch with our experts today.',
            },
            sort_order: 3,
            is_active: true
        });

        logger.info('Successfully added CTA section to buyer-landing');

    } catch (error) {
        logger.error('Failed to add CTA section:', error);
        process.exit(1);
    } finally {
        await sequelize.close();
    }
};

if (require.main === module) {
    addCtaToBuyerLanding();
}

module.exports = { addCtaToBuyerLanding };
