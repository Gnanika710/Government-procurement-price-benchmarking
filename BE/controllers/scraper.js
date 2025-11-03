import express from 'express';
import axios from 'axios';
import * as cheerio from 'cheerio';

const app = express();
const router = express.Router();

export const test = (req, res) => {
  res.json({
    message: 'API is working!',
  });
};

export const scrapedata = async (req, res, next) => {
    const { location, description, serviceType } = req.body;

    console.log('Service search request:', { location, description, serviceType });

    if (!location || !description) {
        return res.status(400).json({ 
            error: 'Location and description are required.',
            received: { location, description, serviceType }
        });
    }

    try {
        const results = [];
        
        // Scrape from multiple sources in parallel
        const scrapingPromises = [
            scrapeJustDial(location, description),
            scrapeSulekha(location, description),
            scrapeUrbanPro(location, description)
        ];

        const scrapingResults = await Promise.allSettled(scrapingPromises);
        
        // Combine results from all sources
        scrapingResults.forEach((result, index) => {
            if (result.status === 'fulfilled' && result.value.length > 0) {
                results.push(...result.value);
                console.log(`Source ${index + 1} returned ${result.value.length} results`);
            } else if (result.status === 'rejected') {
                console.error(`Source ${index + 1} failed:`, result.reason);
            }
        });

        // Remove duplicates and filter valid results
        const uniqueResults = removeDuplicatesAndFilter(results);
        
        // Sort by rating and reviews
        const sortedResults = uniqueResults.sort((a, b) => {
            const aScore = (parseFloat(a.rating) || 0) * 0.7 + (parseInt(a.reviews) || 0) * 0.3;
            const bScore = (parseFloat(b.rating) || 0) * 0.7 + (parseInt(b.reviews) || 0) * 0.3;
            return bScore - aScore;
        });

        res.json({
            success: true,
            total: sortedResults.length,
            data: sortedResults,
            sources: scrapingResults.map((result, index) => ({
                source: ['JustDial', 'Sulekha', 'UrbanPro'][index],
                status: result.status,
                count: result.status === 'fulfilled' ? result.value.length : 0
            }))
        });

    } catch (error) {
        console.error('Scraping error:', error);
        res.status(500).json({ 
            error: 'Failed to scrape service provider data.',
            details: error.message 
        });
    }
};

// Enhanced JustDial scraper
async function scrapeJustDial(location, description) {
    const url = `https://www.justdial.com/${location}/${description}/`;
    
    try {
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5',
                'Accept-Encoding': 'gzip, deflate, br',
                'Connection': 'keep-alive',
                'Upgrade-Insecure-Requests': '1',
            },
            timeout: 15000
        });
        
        const html = response.data;
        const $ = cheerio.load(html);
        const results = [];

        $('.resultbox_info').each((index, element) => {
            try {
                const service_provider = $(element).find('.resultbox_title_anchor.line_clamp_1').text().trim();
                
                if (!service_provider || service_provider.length < 3) return;

                // Extract specialization from all .amenities_tabs elements
                const specialization = [];
                $(element).find('.amenities_tabs.font12.fw500.color777').each((i, el) => {
                    const spec = $(el).text().trim();
                    if (spec) specialization.push(spec);
                });
                
                const rating = $(element).find('.resultbox_totalrate').text().trim();
                const reviewsText = $(element).find('.resultbox_countrate').text().trim();
                const reviews = reviewsText.match(/\d+/)?.[0] || '0';
                const locationText = $(element).find('.font15.fw400.color111').text().trim();
                const phone = $(element).find('.callcontent').text().trim();
                const href = $(element).find('.resultbox_title_anchorbox').attr('href');
                const website = href ? `https://www.justdial.com${href}` : '';

                results.push({
                    service_provider,
                    specialization: specialization.join(', ') || description,
                    rating: cleanRating(rating),
                    reviews: parseInt(reviews) || 0,
                    location: locationText || location,
                    phone: cleanPhone(phone),
                    website,
                    source: 'JustDial'
                });
            } catch (err) {
                console.log('Error parsing JustDial element:', err.message);
            }
        });

        console.log(`JustDial scraped ${results.length} results`);
        return results;

    } catch (error) {
        console.error('JustDial scraping failed:', error.message);
        return [];
    }
}

// Sulekha scraper
async function scrapeSulekha(location, description) {
    try {
        const searchQuery = encodeURIComponent(`${description} ${location}`);
        const url = `https://www.sulekha.com/${location}/${description.replace(/\s+/g, '-').toLowerCase()}`;
        
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            },
            timeout: 10000
        });
        
        const html = response.data;
        const $ = cheerio.load(html);
        const results = [];

        $('.provider-card, .business-listing, .service-provider, .listing-item').each((index, element) => {
            try {
                const service_provider = $(element).find('.business-name, .provider-name, h3, .listing-title').text().trim();
                if (!service_provider || service_provider.length < 3) return;

                const specialization = $(element).find('.services, .specialization, .category, .service-list').text().trim();
                const rating = $(element).find('.rating, .star-rating, .rating-value').text().trim() || '0';
                const reviewsText = $(element).find('.reviews, .review-count, .review-text').text().trim();
                const reviews = reviewsText.match(/\d+/)?.[0] || '0';
                const locationText = $(element).find('.location, .address, .area').text().trim();
                const phone = $(element).find('.phone, .contact, .mobile').text().trim();
                const href = $(element).find('a').attr('href');
                const website = href ? (href.startsWith('http') ? href : `https://www.sulekha.com${href}`) : '';

                results.push({
                    service_provider,
                    specialization: specialization || description,
                    rating: cleanRating(rating),
                    reviews: parseInt(reviews) || 0,
                    location: locationText || location,
                    phone: cleanPhone(phone),
                    website,
                    source: 'Sulekha'
                });
            } catch (err) {
                console.log('Error parsing Sulekha element:', err.message);
            }
        });

        console.log(`Sulekha scraped ${results.length} results`);
        return results;

    } catch (error) {
        console.error('Sulekha scraping failed:', error.message);
        return [];
    }
}

// UrbanPro scraper
async function scrapeUrbanPro(location, description) {
    try {
        const searchQuery = encodeURIComponent(`${description} in ${location}`);
        const url = `https://www.urbanpro.com/search?q=${searchQuery}`;
        
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            },
            timeout: 10000
        });
        
        const html = response.data;
        const $ = cheerio.load(html);
        const results = [];

        $('.tutor-card, .provider-card, .professional-card, .listing-card').each((index, element) => {
            try {
                const service_provider = $(element).find('.tutor-name, .provider-name, .professional-name, .listing-name, h3').text().trim();
                if (!service_provider || service_provider.length < 3) return;

                const specialization = $(element).find('.subjects, .services, .skills, .categories').text().trim();
                const rating = $(element).find('.rating, .stars, .rating-value').text().trim() || '0';
                const reviewsText = $(element).find('.reviews, .review-count, .student-count').text().trim();
                const reviews = reviewsText.match(/\d+/)?.[0] || '0';
                const locationText = $(element).find('.location, .area, .address').text().trim();
                const phone = $(element).find('.phone, .contact, .mobile').text().trim();
                const href = $(element).find('a').attr('href');
                const website = href ? (href.startsWith('http') ? href : `https://www.urbanpro.com${href}`) : '';

                results.push({
                    service_provider,
                    specialization: specialization || description,
                    rating: cleanRating(rating),
                    reviews: parseInt(reviews) || 0,
                    location: locationText || location,
                    phone: cleanPhone(phone),
                    website,
                    source: 'UrbanPro'
                });
            } catch (err) {
                console.log('Error parsing UrbanPro element:', err.message);
            }
        });

        console.log(`UrbanPro scraped ${results.length} results`);
        return results;

    } catch (error) {
        console.error('UrbanPro scraping failed:', error.message);
        return [];
    }
}

// ✅ MISSING UTILITY FUNCTIONS - ADD THESE:
function cleanRating(rating) {
    const match = rating.match(/(\d+\.?\d*)/);
    return match ? parseFloat(match[1]).toFixed(1) : '0.0';
}

function cleanPhone(phone) {
    return phone.replace(/[^\d+\-\s]/g, '').trim();
}

function removeDuplicatesAndFilter(results) {
    const seen = new Set();
    return results.filter(item => {
        // ✅ Filter out invalid entries
        if (!item.service_provider || item.service_provider.length < 3) {
            return false;
        }
        
        // ✅ Remove duplicates based on name and phone
        const key = `${item.service_provider.toLowerCase()}_${item.phone}`.slice(0, 50);
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
    });
}