import React, { useState, useEffect, useMemo } from 'react';

// ============================================================================
// COMMAND CENTER - Dynamic Sales Tracker for ALL Entrepreneurs
// Adapts terminology and features based on user's side hustle type
// ============================================================================

// Side Hustle Configuration - Defines terminology for each profession
export const SIDE_HUSTLE_CONFIG = {
  'real-estate': {
    name: 'Real Estate',
    icon: '🏠',
    dealName: 'Transaction',
    dealNamePlural: 'Transactions',
    clientName: 'Client',
    clientNamePlural: 'Clients',
    revenueName: 'Commission',
    revenueNamePlural: 'Commissions',
    projectName: 'Listing',
    projectNamePlural: 'Listings',
    pipelineStages: ['Prospecting', 'Listed', 'Under Contract', 'Closed'],
    crmStages: ['New Lead', 'Contacted', 'Qualified', 'Active Client'],
    kpiLabels: {
      totalRevenue: 'Total Commissions',
      activeDeals: 'Active Transactions',
      avgDealSize: 'Avg Commission',
      closedDeals: 'Closed Deals'
    },
    taxDeductions: [
      { name: 'Vehicle/Mileage', rate: '67¢/mile (2024)', description: 'Business miles driven for showings, meetings, etc.' },
      { name: 'Home Office', rate: '$5/sq ft (simplified)', description: 'Dedicated workspace in your home' },
      { name: 'Marketing & Advertising', rate: '100%', description: 'Yard signs, flyers, online ads, photography' },
      { name: 'MLS & Association Dues', rate: '100%', description: 'Board fees, MLS access, NAR dues' },
      { name: 'Continuing Education', rate: '100%', description: 'License renewal, courses, certifications' },
      { name: 'Client Gifts', rate: '$25/person limit', description: 'Closing gifts, holiday gifts to clients' },
      { name: 'Professional Services', rate: '100%', description: 'Accountant, attorney, coach fees' },
      { name: 'Technology & Software', rate: '100%', description: 'CRM, e-signature, virtual tour tools' }
    ],
    quickTips: [
      '📍 Track every showing and open house for mileage deductions',
      '📸 Save receipts for staging, photography, and virtual tours',
      '🎁 Document all client gifts (max $25/person deductible)',
      '💻 Deduct CRM, MLS, and marketing software subscriptions'
    ]
  },
  'photographer': {
    name: 'Photography',
    icon: '📸',
    dealName: 'Session',
    dealNamePlural: 'Sessions',
    clientName: 'Client',
    clientNamePlural: 'Clients',
    revenueName: 'Booking',
    revenueNamePlural: 'Bookings',
    projectName: 'Shoot',
    projectNamePlural: 'Shoots',
    pipelineStages: ['Inquiry', 'Booked', 'Session Complete', 'Delivered'],
    crmStages: ['New Inquiry', 'Consultation', 'Booked', 'Repeat Client'],
    kpiLabels: {
      totalRevenue: 'Total Revenue',
      activeDeals: 'Upcoming Sessions',
      avgDealSize: 'Avg Session Value',
      closedDeals: 'Completed Sessions'
    },
    taxDeductions: [
      { name: 'Camera Equipment', rate: 'Depreciation/Sec 179', description: 'Cameras, lenses, lighting, memory cards' },
      { name: 'Editing Software', rate: '100%', description: 'Lightroom, Photoshop, Capture One subscriptions' },
      { name: 'Props & Backdrops', rate: '100%', description: 'Studio props, backgrounds, furniture' },
      { name: 'Travel Expenses', rate: '100%', description: 'Mileage to sessions, destination shoots' },
      { name: 'Website & Portfolio', rate: '100%', description: 'Hosting, domain, portfolio platforms' },
      { name: 'Insurance', rate: '100%', description: 'Equipment insurance, liability coverage' },
      { name: 'Education', rate: '100%', description: 'Workshops, courses, conferences' },
      { name: 'Second Shooter', rate: '100%', description: 'Contractor payments for assistants' }
    ],
    quickTips: [
      '📷 Keep equipment receipts for depreciation deductions',
      '🚗 Log mileage to every client session and location scout',
      '💻 Deduct all editing software and cloud storage',
      '📚 Save receipts for photography workshops and courses'
    ]
  },
  'hair-stylist': {
    name: 'Hair & Beauty',
    icon: '💇',
    dealName: 'Appointment',
    dealNamePlural: 'Appointments',
    clientName: 'Client',
    clientNamePlural: 'Clients',
    revenueName: 'Service',
    revenueNamePlural: 'Services',
    projectName: 'Booking',
    projectNamePlural: 'Bookings',
    pipelineStages: ['Consultation', 'Scheduled', 'In Progress', 'Completed'],
    crmStages: ['Walk-in', 'Booked', 'Regular', 'VIP Client'],
    kpiLabels: {
      totalRevenue: 'Total Revenue',
      activeDeals: 'Today\'s Appointments',
      avgDealSize: 'Avg Ticket',
      closedDeals: 'Clients Served'
    },
    taxDeductions: [
      { name: 'Booth/Chair Rent', rate: '100%', description: 'Salon booth rental or chair fees' },
      { name: 'Supplies & Products', rate: '100%', description: 'Hair color, styling products, tools' },
      { name: 'Tools & Equipment', rate: 'Depreciation/Sec 179', description: 'Shears, dryers, flat irons, chairs' },
      { name: 'Continuing Education', rate: '100%', description: 'Classes, certifications, hair shows' },
      { name: 'Uniforms & Aprons', rate: '100%', description: 'Work clothing with logo, aprons, capes' },
      { name: 'Business Cards/Marketing', rate: '100%', description: 'Cards, social media ads, website' },
      { name: 'Liability Insurance', rate: '100%', description: 'Professional liability coverage' },
      { name: 'Mileage', rate: '67¢/mile', description: 'Travel to clients, supply runs, education' }
    ],
    quickTips: [
      '💇 Keep all receipts for hair products and supplies',
      '🪑 Track booth rent payments monthly',
      '✂️ Document equipment purchases for depreciation',
      '📱 Deduct booking software and payment processing fees'
    ]
  },
  'fitness-trainer': {
    name: 'Fitness & Training',
    icon: '💪',
    dealName: 'Session',
    dealNamePlural: 'Sessions',
    clientName: 'Client',
    clientNamePlural: 'Clients',
    revenueName: 'Package',
    revenueNamePlural: 'Packages',
    projectName: 'Program',
    projectNamePlural: 'Programs',
    pipelineStages: ['Consultation', 'Trial Session', 'Active Program', 'Completed'],
    crmStages: ['Prospect', 'Trial', 'Active Member', 'Loyal Client'],
    kpiLabels: {
      totalRevenue: 'Total Revenue',
      activeDeals: 'Active Clients',
      avgDealSize: 'Avg Package Value',
      closedDeals: 'Sessions Completed'
    },
    taxDeductions: [
      { name: 'Equipment', rate: 'Depreciation/Sec 179', description: 'Weights, mats, resistance bands, machines' },
      { name: 'Certifications', rate: '100%', description: 'CPT, specialty certs, CEU courses' },
      { name: 'Liability Insurance', rate: '100%', description: 'Trainer liability coverage' },
      { name: 'Gym/Studio Rent', rate: '100%', description: 'Space rental or gym access fees' },
      { name: 'Uniforms', rate: '100%', description: 'Branded workout gear, shoes' },
      { name: 'Software', rate: '100%', description: 'Training apps, scheduling, nutrition tracking' },
      { name: 'Marketing', rate: '100%', description: 'Social media ads, website, business cards' },
      { name: 'Mileage', rate: '67¢/mile', description: 'Travel to client homes, gyms, parks' }
    ],
    quickTips: [
      '🏋️ Track all equipment purchases for depreciation',
      '📜 Deduct certification courses and renewals',
      '🚗 Log mileage for in-home training sessions',
      '📱 Deduct fitness apps and scheduling software'
    ]
  },
  'freelance-creative': {
    name: 'Freelance Creative',
    icon: '🎨',
    dealName: 'Project',
    dealNamePlural: 'Projects',
    clientName: 'Client',
    clientNamePlural: 'Clients',
    revenueName: 'Contract',
    revenueNamePlural: 'Contracts',
    projectName: 'Project',
    projectNamePlural: 'Projects',
    pipelineStages: ['Proposal', 'Contracted', 'In Progress', 'Delivered'],
    crmStages: ['Lead', 'Pitched', 'Active Client', 'Repeat Client'],
    kpiLabels: {
      totalRevenue: 'Total Revenue',
      activeDeals: 'Active Projects',
      avgDealSize: 'Avg Project Value',
      closedDeals: 'Projects Delivered'
    },
    taxDeductions: [
      { name: 'Software/Subscriptions', rate: '100%', description: 'Adobe CC, Figma, Sketch, design tools' },
      { name: 'Computer Equipment', rate: 'Depreciation/Sec 179', description: 'Computer, tablet, monitor, peripherals' },
      { name: 'Home Office', rate: '$5/sq ft (simplified)', description: 'Dedicated workspace in your home' },
      { name: 'Professional Development', rate: '100%', description: 'Courses, conferences, tutorials' },
      { name: 'Website & Portfolio', rate: '100%', description: 'Hosting, domain, Behance/Dribbble Pro' },
      { name: 'Stock Assets', rate: '100%', description: 'Stock photos, fonts, templates, icons' },
      { name: 'Coworking Space', rate: '100%', description: 'Membership fees and day passes' },
      { name: 'Client Meetings', rate: '50%', description: 'Meals with clients (50% deductible)' }
    ],
    quickTips: [
      '💻 Track all software subscriptions monthly',
      '🏠 Measure your home office for the deduction',
      '📚 Save receipts for online courses and tutorials',
      '☕ Keep receipts from client meetings (50% deductible)'
    ]
  },
  'content-creator': {
    name: 'Content Creator',
    icon: '📱',
    dealName: 'Campaign',
    dealNamePlural: 'Campaigns',
    clientName: 'Brand',
    clientNamePlural: 'Brands',
    revenueName: 'Sponsorship',
    revenueNamePlural: 'Sponsorships',
    projectName: 'Content',
    projectNamePlural: 'Content Pieces',
    pipelineStages: ['Pitched', 'Negotiating', 'Creating', 'Published'],
    crmStages: ['Prospect', 'In Talks', 'Partner', 'Long-term Partner'],
    kpiLabels: {
      totalRevenue: 'Total Earnings',
      activeDeals: 'Active Campaigns',
      avgDealSize: 'Avg Deal Value',
      closedDeals: 'Completed Campaigns'
    },
    taxDeductions: [
      { name: 'Equipment', rate: 'Depreciation/Sec 179', description: 'Camera, lighting, microphone, ring light' },
      { name: 'Props & Wardrobe', rate: '100% (if for content)', description: 'Items purchased specifically for content' },
      { name: 'Editing Software', rate: '100%', description: 'Final Cut, Premiere, CapCut Pro' },
      { name: 'Platform Fees', rate: '100%', description: 'Patreon, Gumroad, email marketing' },
      { name: 'Home Studio', rate: '$5/sq ft (simplified)', description: 'Dedicated filming/recording space' },
      { name: 'Travel for Content', rate: '100%', description: 'Trips taken specifically for content' },
      { name: 'Music/Stock Licenses', rate: '100%', description: 'Epidemic Sound, Artlist, stock footage' },
      { name: 'VA/Editor Payments', rate: '100%', description: 'Contractors who help with content' }
    ],
    quickTips: [
      '🎬 Keep equipment receipts organized by year',
      '🏠 Set up a dedicated filming space for deductions',
      '✈️ Document business purpose for all travel content',
      '📝 Track contractor payments for 1099 filing'
    ]
  },
  'consultant': {
    name: 'Consulting',
    icon: '💼',
    dealName: 'Engagement',
    dealNamePlural: 'Engagements',
    clientName: 'Client',
    clientNamePlural: 'Clients',
    revenueName: 'Contract',
    revenueNamePlural: 'Contracts',
    projectName: 'Project',
    projectNamePlural: 'Projects',
    pipelineStages: ['Discovery', 'Proposal', 'Active', 'Completed'],
    crmStages: ['Prospect', 'Qualified', 'Client', 'Strategic Partner'],
    kpiLabels: {
      totalRevenue: 'Total Revenue',
      activeDeals: 'Active Engagements',
      avgDealSize: 'Avg Contract Value',
      closedDeals: 'Engagements Completed'
    },
    taxDeductions: [
      { name: 'Home Office', rate: '$5/sq ft (simplified)', description: 'Dedicated workspace in your home' },
      { name: 'Professional Development', rate: '100%', description: 'Certifications, conferences, courses' },
      { name: 'Business Travel', rate: '100%', description: 'Flights, hotels, transportation for clients' },
      { name: 'Technology', rate: '100%', description: 'Computer, software, cloud services' },
      { name: 'Professional Services', rate: '100%', description: 'Accountant, attorney, business coach' },
      { name: 'Marketing', rate: '100%', description: 'Website, LinkedIn Premium, advertising' },
      { name: 'Client Entertainment', rate: '50%', description: 'Business meals with clients' },
      { name: 'Insurance', rate: '100%', description: 'E&O insurance, liability coverage' }
    ],
    quickTips: [
      '✈️ Track all business travel expenses separately',
      '🍽️ Keep receipts and note attendees for client meals',
      '📜 Deduct professional certifications and memberships',
      '💻 Track software subscriptions (Zoom, Slack, etc.)'
    ]
  },
  'event-planner': {
    name: 'Event Planning',
    icon: '🎉',
    dealName: 'Event',
    dealNamePlural: 'Events',
    clientName: 'Client',
    clientNamePlural: 'Clients',
    revenueName: 'Contract',
    revenueNamePlural: 'Contracts',
    projectName: 'Event',
    projectNamePlural: 'Events',
    pipelineStages: ['Inquiry', 'Planning', 'Execution', 'Completed'],
    crmStages: ['Lead', 'Consultation', 'Booked', 'Repeat Client'],
    kpiLabels: {
      totalRevenue: 'Total Revenue',
      activeDeals: 'Events in Progress',
      avgDealSize: 'Avg Event Value',
      closedDeals: 'Events Completed'
    },
    taxDeductions: [
      { name: 'Vendor Deposits', rate: '100%', description: 'Deposits paid on behalf of clients' },
      { name: 'Event Supplies', rate: '100%', description: 'Decor, signage, planning materials' },
      { name: 'Transportation', rate: '67¢/mile', description: 'Site visits, vendor meetings, event day' },
      { name: 'Technology', rate: '100%', description: 'Planning software, design tools' },
      { name: 'Marketing', rate: '100%', description: 'Website, social media, advertising' },
      { name: 'Insurance', rate: '100%', description: 'Event liability insurance' },
      { name: 'Subcontractors', rate: '100%', description: 'Day-of coordinators, assistants' },
      { name: 'Professional Development', rate: '100%', description: 'Certifications, workshops, conferences' }
    ],
    quickTips: [
      '📋 Track vendor payments separately from your fees',
      '🚗 Log mileage for every site visit and vendor meeting',
      '📸 Save receipts for decor and supplies inventory',
      '🤝 Document subcontractor payments for 1099s'
    ]
  },
  'ecommerce': {
    name: 'E-commerce / Seller',
    icon: '🛒',
    dealName: 'Order',
    dealNamePlural: 'Orders',
    clientName: 'Customer',
    clientNamePlural: 'Customers',
    revenueName: 'Sale',
    revenueNamePlural: 'Sales',
    projectName: 'Product',
    projectNamePlural: 'Products',
    pipelineStages: ['Listed', 'Order Received', 'Shipped', 'Delivered'],
    crmStages: ['Browser', 'First Purchase', 'Repeat Buyer', 'Loyal Customer'],
    kpiLabels: {
      totalRevenue: 'Total Sales',
      activeDeals: 'Pending Orders',
      avgDealSize: 'Avg Order Value',
      closedDeals: 'Orders Fulfilled'
    },
    taxDeductions: [
      { name: 'Cost of Goods Sold', rate: '100%', description: 'Materials, supplies, wholesale costs' },
      { name: 'Platform Fees', rate: '100%', description: 'Etsy, Amazon, Shopify fees' },
      { name: 'Shipping Supplies', rate: '100%', description: 'Boxes, tape, labels, packaging' },
      { name: 'Shipping Costs', rate: '100%', description: 'Postage and carrier fees' },
      { name: 'Home Office/Workshop', rate: '$5/sq ft', description: 'Workspace for creating/storing inventory' },
      { name: 'Photography', rate: '100%', description: 'Product photography equipment/services' },
      { name: 'Marketing', rate: '100%', description: 'Ads, promoted listings, influencer collabs' },
      { name: 'Business Insurance', rate: '100%', description: 'Product liability insurance' }
    ],
    quickTips: [
      '📦 Track COGS meticulously for accurate profit margins',
      '🏷️ Save all platform fee statements monthly',
      '📸 Deduct product photography costs',
      '🏠 Measure workshop/storage space for deductions'
    ]
  },
  'music-dj': {
    name: 'Music / DJ',
    icon: '🎵',
    dealName: 'Gig',
    dealNamePlural: 'Gigs',
    clientName: 'Client',
    clientNamePlural: 'Clients',
    revenueName: 'Payment',
    revenueNamePlural: 'Payments',
    projectName: 'Event',
    projectNamePlural: 'Events',
    pipelineStages: ['Inquiry', 'Booked', 'Performed', 'Completed'],
    crmStages: ['Lead', 'Interested', 'Booked', 'Repeat Client'],
    kpiLabels: {
      totalRevenue: 'Total Earnings',
      activeDeals: 'Upcoming Gigs',
      avgDealSize: 'Avg Gig Value',
      closedDeals: 'Gigs Completed'
    },
    taxDeductions: [
      { name: 'Equipment', rate: 'Depreciation/Sec 179', description: 'Controllers, speakers, turntables, mixers' },
      { name: 'Music/Licensing', rate: '100%', description: 'Music subscriptions, licensing fees' },
      { name: 'Transportation', rate: '67¢/mile', description: 'Travel to gigs and equipment transport' },
      { name: 'Marketing', rate: '100%', description: 'Website, social media, promo materials' },
      { name: 'Insurance', rate: '100%', description: 'Equipment and liability insurance' },
      { name: 'Software', rate: '100%', description: 'DJ software, production tools' },
      { name: 'Professional Development', rate: '100%', description: 'Courses, workshops, certifications' },
      { name: 'Demo Materials', rate: '100%', description: 'Mix recordings, promo videos' }
    ],
    quickTips: [
      '🎧 Document all equipment purchases with receipts',
      '🚗 Track mileage to every gig and equipment rental',
      '🎵 Deduct music subscription services',
      '📱 Save receipts for DJ software and plugins'
    ]
  },
  'makeup-artist': {
    name: 'Makeup Artist',
    icon: '💄',
    dealName: 'Appointment',
    dealNamePlural: 'Appointments',
    clientName: 'Client',
    clientNamePlural: 'Clients',
    revenueName: 'Service',
    revenueNamePlural: 'Services',
    projectName: 'Look',
    projectNamePlural: 'Looks',
    pipelineStages: ['Inquiry', 'Trial', 'Booked', 'Completed'],
    crmStages: ['New Lead', 'Consultation', 'Booked', 'VIP Client'],
    kpiLabels: {
      totalRevenue: 'Total Revenue',
      activeDeals: 'Upcoming Appointments',
      avgDealSize: 'Avg Service Value',
      closedDeals: 'Services Completed'
    },
    taxDeductions: [
      { name: 'Makeup & Products', rate: '100%', description: 'All makeup, skincare, and beauty products' },
      { name: 'Kit & Tools', rate: 'Depreciation/Sec 179', description: 'Brushes, cases, lighting, mirrors' },
      { name: 'Travel/Mileage', rate: '67¢/mile', description: 'Travel to client locations, weddings' },
      { name: 'Portfolio Photography', rate: '100%', description: 'Professional photos of your work' },
      { name: 'Education', rate: '100%', description: 'Courses, certifications, masterclasses' },
      { name: 'Marketing', rate: '100%', description: 'Website, social media, business cards' },
      { name: 'Insurance', rate: '100%', description: 'Liability insurance coverage' },
      { name: 'Sanitation Supplies', rate: '100%', description: 'Disposables, sanitizers, cleaning supplies' }
    ],
    quickTips: [
      '💄 Track ALL product purchases for kit deductions',
      '📸 Invest in portfolio photography (it\'s deductible!)',
      '🚗 Log mileage for on-location appointments',
      '✨ Keep receipts for masterclasses and training'
    ]
  },
  'handyman': {
    name: 'Handyman / Contractor',
    icon: '🔧',
    dealName: 'Job',
    dealNamePlural: 'Jobs',
    clientName: 'Client',
    clientNamePlural: 'Clients',
    revenueName: 'Payment',
    revenueNamePlural: 'Payments',
    projectName: 'Project',
    projectNamePlural: 'Projects',
    pipelineStages: ['Estimate', 'Scheduled', 'In Progress', 'Completed'],
    crmStages: ['New Lead', 'Quoted', 'Active', 'Repeat Client'],
    kpiLabels: {
      totalRevenue: 'Total Revenue',
      activeDeals: 'Active Jobs',
      avgDealSize: 'Avg Job Value',
      closedDeals: 'Jobs Completed'
    },
    taxDeductions: [
      { name: 'Tools & Equipment', rate: 'Depreciation/Sec 179', description: 'Power tools, hand tools, ladders' },
      { name: 'Vehicle Expenses', rate: '67¢/mile or actual', description: 'Work truck, mileage, fuel, maintenance' },
      { name: 'Materials', rate: '100%', description: 'Supplies and materials for jobs' },
      { name: 'Insurance', rate: '100%', description: 'Liability, vehicle, workers comp' },
      { name: 'Licenses & Permits', rate: '100%', description: 'Contractor licenses, permits, bonds' },
      { name: 'Phone/Communication', rate: '100% business use', description: 'Phone plan, internet for business' },
      { name: 'Uniforms/Safety Gear', rate: '100%', description: 'Work clothes, boots, safety equipment' },
      { name: 'Subcontractors', rate: '100%', description: 'Payments to helpers and subs' }
    ],
    quickTips: [
      '🔧 Track every tool purchase no matter how small',
      '🚗 Keep a mileage log in your work vehicle',
      '🧾 Save ALL receipts for materials',
      '📝 Document subcontractor payments for 1099s'
    ]
  },
  'pet-services': {
    name: 'Pet Services',
    icon: '🐕',
    dealName: 'Booking',
    dealNamePlural: 'Bookings',
    clientName: 'Client',
    clientNamePlural: 'Clients',
    revenueName: 'Service',
    revenueNamePlural: 'Services',
    projectName: 'Appointment',
    projectNamePlural: 'Appointments',
    pipelineStages: ['Inquiry', 'Consultation', 'Scheduled', 'Completed'],
    crmStages: ['New Lead', 'Trial', 'Regular', 'VIP Client'],
    kpiLabels: {
      totalRevenue: 'Total Revenue',
      activeDeals: 'Active Bookings',
      avgDealSize: 'Avg Service Value',
      closedDeals: 'Services Completed'
    },
    taxDeductions: [
      { name: 'Supplies', rate: '100%', description: 'Grooming supplies, treats, leashes, waste bags' },
      { name: 'Equipment', rate: 'Depreciation/Sec 179', description: 'Grooming tables, clippers, tubs, crates' },
      { name: 'Vehicle/Mileage', rate: '67¢/mile', description: 'Travel to clients, vet trips, supply runs' },
      { name: 'Insurance', rate: '100%', description: 'Liability and bonding insurance' },
      { name: 'Certifications', rate: '100%', description: 'Pet first aid, grooming certs, training' },
      { name: 'Marketing', rate: '100%', description: 'Website, business cards, social media' },
      { name: 'Software', rate: '100%', description: 'Booking software, payment processing' },
      { name: 'Home Office', rate: '$5/sq ft', description: 'Dedicated space for pet care' }
    ],
    quickTips: [
      '🐕 Track all supply purchases (treats, leashes, etc.)',
      '🚗 Log every mile driven for pet pickups/dropoffs',
      '📜 Deduct pet first aid and grooming certifications',
      '🏠 If you use home space for pets, measure it!'
    ]
  },
  'notary': {
    name: 'Notary / Loan Signing',
    icon: '📝',
    dealName: 'Signing',
    dealNamePlural: 'Signings',
    clientName: 'Client',
    clientNamePlural: 'Clients',
    revenueName: 'Fee',
    revenueNamePlural: 'Fees',
    projectName: 'Appointment',
    projectNamePlural: 'Appointments',
    pipelineStages: ['Assigned', 'Confirmed', 'Completed', 'Paid'],
    crmStages: ['New Contact', 'Active', 'Preferred', 'Top Client'],
    kpiLabels: {
      totalRevenue: 'Total Fees',
      activeDeals: 'Pending Signings',
      avgDealSize: 'Avg Fee',
      closedDeals: 'Signings Completed'
    },
    taxDeductions: [
      { name: 'Vehicle/Mileage', rate: '67¢/mile', description: 'Travel to signing appointments' },
      { name: 'Notary Supplies', rate: '100%', description: 'Stamps, journal, seal, pens' },
      { name: 'E&O Insurance', rate: '100%', description: 'Errors and omissions coverage' },
      { name: 'Background Checks', rate: '100%', description: 'NNA, signing service background fees' },
      { name: 'Training/Certifications', rate: '100%', description: 'NSA certification, continuing ed' },
      { name: 'Technology', rate: '100%', description: 'Scanner, printer, phone, laptop' },
      { name: 'Platform Fees', rate: '100%', description: 'Signing service memberships' },
      { name: 'Home Office', rate: '$5/sq ft', description: 'Dedicated workspace' }
    ],
    quickTips: [
      '🚗 Track EVERY mile - notaries drive a lot!',
      '📜 Deduct NNA membership and certification fees',
      '🖨️ Save receipts for printer ink, paper, and supplies',
      '💼 Track all signing service platform fees'
    ]
  },
  'general-sales': {
    name: 'Sales Professional',
    icon: '🎯',
    dealName: 'Deal',
    dealNamePlural: 'Deals',
    clientName: 'Client',
    clientNamePlural: 'Clients',
    revenueName: 'Commission',
    revenueNamePlural: 'Commissions',
    projectName: 'Opportunity',
    projectNamePlural: 'Opportunities',
    pipelineStages: ['Prospecting', 'Qualified', 'Proposal', 'Closed Won'],
    crmStages: ['Cold Lead', 'Warm Lead', 'Hot Lead', 'Customer'],
    kpiLabels: {
      totalRevenue: 'Total Commissions',
      activeDeals: 'Active Opportunities',
      avgDealSize: 'Avg Deal Size',
      closedDeals: 'Deals Closed'
    },
    taxDeductions: [
      { name: 'Vehicle/Mileage', rate: '67¢/mile', description: 'Driving to meet prospects and clients' },
      { name: 'Client Entertainment', rate: '50%', description: 'Business meals with clients' },
      { name: 'Technology', rate: '100%', description: 'CRM software, phone, laptop' },
      { name: 'Professional Attire', rate: '100% (if required)', description: 'Industry-specific required clothing' },
      { name: 'Home Office', rate: '$5/sq ft', description: 'Dedicated workspace' },
      { name: 'Marketing', rate: '100%', description: 'Business cards, personal branding' },
      { name: 'Professional Development', rate: '100%', description: 'Sales training, certifications' },
      { name: 'Communication', rate: '100%', description: 'Phone plan, internet (business %)' }
    ],
    quickTips: [
      '🚗 Track every mile driven to client meetings',
      '🍽️ Log all client meal receipts with attendees',
      '📱 Deduct business portion of phone/internet',
      '💼 Keep receipts for sales training programs'
    ]
  },
  'other': {
    name: 'Other Business',
    icon: '✨',
    dealName: 'Project',
    dealNamePlural: 'Projects',
    clientName: 'Client',
    clientNamePlural: 'Clients',
    revenueName: 'Payment',
    revenueNamePlural: 'Payments',
    projectName: 'Job',
    projectNamePlural: 'Jobs',
    pipelineStages: ['Lead', 'Quoted', 'In Progress', 'Completed'],
    crmStages: ['New Lead', 'Contacted', 'Active', 'Repeat Client'],
    kpiLabels: {
      totalRevenue: 'Total Revenue',
      activeDeals: 'Active Projects',
      avgDealSize: 'Avg Project Value',
      closedDeals: 'Projects Completed'
    },
    taxDeductions: [
      { name: 'Home Office', rate: '$5/sq ft (simplified)', description: 'Dedicated workspace in your home' },
      { name: 'Vehicle/Mileage', rate: '67¢/mile', description: 'Business miles driven' },
      { name: 'Supplies & Materials', rate: '100%', description: 'Items used for your business' },
      { name: 'Technology', rate: '100%', description: 'Computer, phone, software' },
      { name: 'Marketing', rate: '100%', description: 'Website, business cards, advertising' },
      { name: 'Professional Services', rate: '100%', description: 'Accountant, attorney, coach' },
      { name: 'Insurance', rate: '100%', description: 'Business liability insurance' },
      { name: 'Education', rate: '100%', description: 'Courses, certifications, training' }
    ],
    quickTips: [
      '📝 Keep all business receipts organized by category',
      '🚗 Log every business mile driven',
      '🏠 Measure your home office space',
      '💰 Set aside 25-30% for quarterly taxes'
    ]
  }
};

// Export for use in welcome modal
export const SIDE_HUSTLE_OPTIONS = [
  { value: 'real-estate', label: 'Real Estate Agent', icon: '🏠' },
  { value: 'photographer', label: 'Photographer', icon: '📸' },
  { value: 'hair-stylist', label: 'Hair Stylist / Barber', icon: '💇' },
  { value: 'makeup-artist', label: 'Makeup Artist', icon: '💄' },
  { value: 'fitness-trainer', label: 'Personal Trainer / Fitness Coach', icon: '💪' },
  { value: 'freelance-creative', label: 'Designer / Artist / Illustrator', icon: '🎨' },
  { value: 'content-creator', label: 'Content Creator / Influencer', icon: '📱' },
  { value: 'music-dj', label: 'Music Producer / DJ', icon: '🎵' },
  { value: 'consultant', label: 'Consultant / Coach', icon: '💼' },
  { value: 'event-planner', label: 'Event Planner', icon: '🎉' },
  { value: 'ecommerce', label: 'E-commerce / Etsy Seller', icon: '🛒' },
  { value: 'handyman', label: 'Handyman / Contractor', icon: '🔧' },
  { value: 'pet-services', label: 'Pet Groomer / Dog Walker', icon: '🐕' },
  { value: 'notary', label: 'Notary / Loan Signing Agent', icon: '📝' },
  { value: 'general-sales', label: 'Sales Professional', icon: '🎯' },
  { value: 'other', label: 'Other / General Business', icon: '✨' },
];

// Get default config for users without a side hustle set
const DEFAULT_CONFIG = SIDE_HUSTLE_CONFIG['general-sales'];

const SalesTrackerTab = ({ user, isDarkMode }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [pipeline, setPipeline] = useState([]);
  const [commissions, setCommissions] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  
  // Get user's side hustle type (defaults to general-sales if not set)
  const sideHustleType = user?.sideHustle || 'general-sales';
  const config = SIDE_HUSTLE_CONFIG[sideHustleType] || DEFAULT_CONFIG;
  
  // Generate unique storage key for this user
  const getStorageKey = (key) => `pn_command_${user?.id || user?.email || 'default'}_${key}`;
  
  // Load data from localStorage on mount
  useEffect(() => {
    const savedPipeline = localStorage.getItem(getStorageKey('pipeline'));
    const savedCommissions = localStorage.getItem(getStorageKey('commissions'));
    const savedExpenses = localStorage.getItem(getStorageKey('expenses'));
    const savedContacts = localStorage.getItem(getStorageKey('contacts'));
    
    if (savedPipeline) setPipeline(JSON.parse(savedPipeline));
    if (savedCommissions) setCommissions(JSON.parse(savedCommissions));
    if (savedExpenses) setExpenses(JSON.parse(savedExpenses));
    if (savedContacts) setContacts(JSON.parse(savedContacts));
  }, [user]);
  
  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(getStorageKey('pipeline'), JSON.stringify(pipeline));
  }, [pipeline]);
  
  useEffect(() => {
    localStorage.setItem(getStorageKey('commissions'), JSON.stringify(commissions));
  }, [commissions]);
  
  useEffect(() => {
    localStorage.setItem(getStorageKey('expenses'), JSON.stringify(expenses));
  }, [expenses]);
  
  useEffect(() => {
    localStorage.setItem(getStorageKey('contacts'), JSON.stringify(contacts));
  }, [contacts]);

  // Calculate KPIs
  const kpis = useMemo(() => {
    const totalRevenue = commissions.reduce((sum, c) => sum + (parseFloat(c.amount) || 0), 0);
    const activeDeals = pipeline.filter(p => p.stage !== config.pipelineStages[config.pipelineStages.length - 1]).length;
    const closedDeals = pipeline.filter(p => p.stage === config.pipelineStages[config.pipelineStages.length - 1]).length;
    const avgDealSize = closedDeals > 0 ? totalRevenue / closedDeals : 0;
    const totalExpenses = expenses.reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);
    const netIncome = totalRevenue - totalExpenses;
    
    return { totalRevenue, activeDeals, closedDeals, avgDealSize, totalExpenses, netIncome };
  }, [pipeline, commissions, expenses, config]);

  // Tax calculations
  const taxEstimates = useMemo(() => {
    const selfEmploymentTax = kpis.netIncome * 0.153;
    const federalTax = kpis.netIncome * 0.22; // Simplified 22% bracket estimate
    const stateTax = kpis.netIncome * 0.05; // Estimated state tax
    const totalTax = selfEmploymentTax + federalTax + stateTax;
    const quarterlyPayment = totalTax / 4;
    
    return { selfEmploymentTax, federalTax, stateTax, totalTax, quarterlyPayment };
  }, [kpis]);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Styles
  const styles = {
    container: {
      padding: '24px',
      backgroundColor: isDarkMode ? '#1a1a2e' : '#f8fafc',
      minHeight: '100vh',
    },
    header: {
      marginBottom: '24px',
    },
    title: {
      fontSize: '28px',
      fontWeight: '700',
      color: isDarkMode ? '#ffffff' : '#1e293b',
      marginBottom: '4px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    },
    subtitle: {
      fontSize: '14px',
      color: isDarkMode ? '#94a3b8' : '#64748b',
    },
    hustleBadge: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      padding: '4px 12px',
      backgroundColor: isDarkMode ? 'rgba(99, 102, 241, 0.2)' : 'rgba(99, 102, 241, 0.1)',
      borderRadius: '20px',
      fontSize: '13px',
      fontWeight: '500',
      color: '#6366f1',
    },
    tabs: {
      display: 'flex',
      gap: '8px',
      marginBottom: '24px',
      flexWrap: 'wrap',
      backgroundColor: isDarkMode ? '#16213e' : '#ffffff',
      padding: '8px',
      borderRadius: '12px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    },
    tab: {
      padding: '10px 20px',
      borderRadius: '8px',
      border: 'none',
      cursor: 'pointer',
      fontWeight: '500',
      fontSize: '14px',
      transition: 'all 0.2s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    activeTab: {
      backgroundColor: '#6366f1',
      color: '#ffffff',
    },
    inactiveTab: {
      backgroundColor: 'transparent',
      color: isDarkMode ? '#94a3b8' : '#64748b',
    },
    kpiGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '16px',
      marginBottom: '24px',
    },
    kpiCard: {
      background: isDarkMode 
        ? 'linear-gradient(135deg, #1e3a5f 0%, #16213e 100%)' 
        : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      borderRadius: '16px',
      padding: '20px',
      color: '#ffffff',
      position: 'relative',
      overflow: 'hidden',
    },
    kpiCardAlt: {
      background: isDarkMode 
        ? 'linear-gradient(135deg, #2d1f47 0%, #16213e 100%)' 
        : 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    },
    kpiCardGreen: {
      background: isDarkMode 
        ? 'linear-gradient(135deg, #1a4d3e 0%, #16213e 100%)' 
        : 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    },
    kpiCardGold: {
      background: isDarkMode 
        ? 'linear-gradient(135deg, #4a3f1a 0%, #16213e 100%)' 
        : 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    },
    kpiLabel: {
      fontSize: '12px',
      fontWeight: '500',
      opacity: 0.9,
      marginBottom: '8px',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
    },
    kpiValue: {
      fontSize: '28px',
      fontWeight: '700',
    },
    kpiIcon: {
      position: 'absolute',
      right: '16px',
      top: '50%',
      transform: 'translateY(-50%)',
      fontSize: '48px',
      opacity: 0.2,
    },
    card: {
      backgroundColor: isDarkMode ? '#16213e' : '#ffffff',
      borderRadius: '16px',
      padding: '24px',
      marginBottom: '24px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
    },
    cardTitle: {
      fontSize: '18px',
      fontWeight: '600',
      color: isDarkMode ? '#ffffff' : '#1e293b',
      marginBottom: '16px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
    },
    th: {
      textAlign: 'left',
      padding: '12px 16px',
      fontSize: '12px',
      fontWeight: '600',
      color: isDarkMode ? '#94a3b8' : '#64748b',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      borderBottom: `1px solid ${isDarkMode ? '#2d3748' : '#e2e8f0'}`,
    },
    td: {
      padding: '16px',
      fontSize: '14px',
      color: isDarkMode ? '#e2e8f0' : '#334155',
      borderBottom: `1px solid ${isDarkMode ? '#2d3748' : '#f1f5f9'}`,
    },
    stageBadge: {
      padding: '4px 12px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: '500',
    },
    addButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '10px 20px',
      backgroundColor: '#6366f1',
      color: '#ffffff',
      border: 'none',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    },
    emptyState: {
      textAlign: 'center',
      padding: '48px 24px',
      color: isDarkMode ? '#94a3b8' : '#64748b',
    },
    emptyIcon: {
      fontSize: '48px',
      marginBottom: '16px',
    },
    tipCard: {
      backgroundColor: isDarkMode ? 'rgba(99, 102, 241, 0.1)' : 'rgba(99, 102, 241, 0.05)',
      borderRadius: '12px',
      padding: '16px',
      marginBottom: '12px',
      borderLeft: '4px solid #6366f1',
    },
    deductionGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '16px',
    },
    deductionCard: {
      backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
      borderRadius: '12px',
      padding: '16px',
      border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}`,
    },
    quarterlyCard: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      borderRadius: '16px',
      padding: '24px',
      color: '#ffffff',
      marginBottom: '24px',
    },
    dueDate: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '12px 16px',
      backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
      borderRadius: '8px',
      marginBottom: '8px',
    },
  };

  // Get stage color
  const getStageColor = (stage, stages) => {
    const index = stages.indexOf(stage);
    const colors = [
      { bg: 'rgba(239, 68, 68, 0.1)', text: '#ef4444' },
      { bg: 'rgba(245, 158, 11, 0.1)', text: '#f59e0b' },
      { bg: 'rgba(59, 130, 246, 0.1)', text: '#3b82f6' },
      { bg: 'rgba(34, 197, 94, 0.1)', text: '#22c55e' },
    ];
    return colors[index] || colors[0];
  };

  // Tab content components
  const renderDashboard = () => (
    <>
      <div style={styles.kpiGrid}>
        <div style={styles.kpiCard}>
          <div style={styles.kpiLabel}>{config.kpiLabels.totalRevenue}</div>
          <div style={styles.kpiValue}>{formatCurrency(kpis.totalRevenue)}</div>
          <span style={styles.kpiIcon}>💰</span>
        </div>
        <div style={{...styles.kpiCard, ...styles.kpiCardAlt}}>
          <div style={styles.kpiLabel}>{config.kpiLabels.activeDeals}</div>
          <div style={styles.kpiValue}>{kpis.activeDeals}</div>
          <span style={styles.kpiIcon}>📊</span>
        </div>
        <div style={{...styles.kpiCard, ...styles.kpiCardGreen}}>
          <div style={styles.kpiLabel}>{config.kpiLabels.avgDealSize}</div>
          <div style={styles.kpiValue}>{formatCurrency(kpis.avgDealSize)}</div>
          <span style={styles.kpiIcon}>📈</span>
        </div>
        <div style={{...styles.kpiCard, ...styles.kpiCardGold}}>
          <div style={styles.kpiLabel}>{config.kpiLabels.closedDeals}</div>
          <div style={styles.kpiValue}>{kpis.closedDeals}</div>
          <span style={styles.kpiIcon}>🏆</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
        <div style={styles.card}>
          <div style={styles.cardTitle}>
            <span>📋</span> Recent {config.dealNamePlural}
          </div>
          {pipeline.length === 0 ? (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>📭</div>
              <p>No {config.dealNamePlural.toLowerCase()} yet</p>
              <p style={{ fontSize: '13px', marginTop: '8px' }}>Add your first {config.dealName.toLowerCase()} from the Pipeline tab</p>
            </div>
          ) : (
            <div>
              {pipeline.slice(0, 5).map((item, idx) => (
                <div key={idx} style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  padding: '12px 0',
                  borderBottom: idx < 4 ? `1px solid ${isDarkMode ? '#2d3748' : '#f1f5f9'}` : 'none'
                }}>
                  <div>
                    <div style={{ fontWeight: '500', color: isDarkMode ? '#ffffff' : '#1e293b' }}>{item.name}</div>
                    <div style={{ fontSize: '13px', color: isDarkMode ? '#94a3b8' : '#64748b' }}>{item.client}</div>
                  </div>
                  <span style={{
                    ...styles.stageBadge,
                    backgroundColor: getStageColor(item.stage, config.pipelineStages).bg,
                    color: getStageColor(item.stage, config.pipelineStages).text
                  }}>
                    {item.stage}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={styles.card}>
          <div style={styles.cardTitle}>
            <span>💡</span> Quick Tips for {config.name}
          </div>
          {config.quickTips.map((tip, idx) => (
            <div key={idx} style={styles.tipCard}>
              {tip}
            </div>
          ))}
        </div>
      </div>
    </>
  );

  const renderPipeline = () => (
    <div style={styles.card}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div style={styles.cardTitle}>
          <span>🎯</span> {config.dealName} Pipeline
        </div>
        <button 
          style={styles.addButton}
          onClick={() => { setModalType('pipeline'); setShowAddModal(true); }}
        >
          <span>+</span> Add {config.dealName}
        </button>
      </div>
      
      {pipeline.length === 0 ? (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>🎯</div>
          <p>Your pipeline is empty</p>
          <p style={{ fontSize: '13px', marginTop: '8px' }}>Start tracking your {config.dealNamePlural.toLowerCase()} to see your progress</p>
        </div>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>{config.dealName} Name</th>
              <th style={styles.th}>{config.clientName}</th>
              <th style={styles.th}>Value</th>
              <th style={styles.th}>Stage</th>
              <th style={styles.th}>Date Added</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pipeline.map((item, idx) => (
              <tr key={idx}>
                <td style={styles.td}>{item.name}</td>
                <td style={styles.td}>{item.client}</td>
                <td style={styles.td}>{formatCurrency(item.value)}</td>
                <td style={styles.td}>
                  <select
                    value={item.stage}
                    onChange={(e) => {
                      const updated = [...pipeline];
                      updated[idx].stage = e.target.value;
                      setPipeline(updated);
                    }}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '6px',
                      border: `1px solid ${isDarkMode ? '#4a5568' : '#e2e8f0'}`,
                      backgroundColor: isDarkMode ? '#2d3748' : '#ffffff',
                      color: isDarkMode ? '#ffffff' : '#1e293b',
                      cursor: 'pointer',
                    }}
                  >
                    {config.pipelineStages.map(stage => (
                      <option key={stage} value={stage}>{stage}</option>
                    ))}
                  </select>
                </td>
                <td style={styles.td}>{item.date}</td>
                <td style={styles.td}>
                  <button
                    onClick={() => {
                      if (window.confirm(`Delete this ${config.dealName.toLowerCase()}?`)) {
                        setPipeline(pipeline.filter((_, i) => i !== idx));
                      }
                    }}
                    style={{
                      padding: '6px 12px',
                      backgroundColor: 'rgba(239, 68, 68, 0.1)',
                      color: '#ef4444',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '13px',
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );

  const renderCommissions = () => (
    <div style={styles.card}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div style={styles.cardTitle}>
          <span>💵</span> {config.revenueNamePlural}
        </div>
        <button 
          style={styles.addButton}
          onClick={() => { setModalType('commission'); setShowAddModal(true); }}
        >
          <span>+</span> Add {config.revenueName}
        </button>
      </div>
      
      <div style={{ marginBottom: '24px', padding: '20px', backgroundColor: isDarkMode ? 'rgba(34, 197, 94, 0.1)' : 'rgba(34, 197, 94, 0.05)', borderRadius: '12px' }}>
        <div style={{ fontSize: '14px', color: isDarkMode ? '#94a3b8' : '#64748b', marginBottom: '4px' }}>
          Total {config.revenueNamePlural} (YTD)
        </div>
        <div style={{ fontSize: '32px', fontWeight: '700', color: '#22c55e' }}>
          {formatCurrency(kpis.totalRevenue)}
        </div>
      </div>

      {commissions.length === 0 ? (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>💵</div>
          <p>No {config.revenueNamePlural.toLowerCase()} recorded yet</p>
          <p style={{ fontSize: '13px', marginTop: '8px' }}>Track your income to monitor your business growth</p>
        </div>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Description</th>
              <th style={styles.th}>{config.clientName}</th>
              <th style={styles.th}>Amount</th>
              <th style={styles.th}>Date</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {commissions.map((item, idx) => (
              <tr key={idx}>
                <td style={styles.td}>{item.description}</td>
                <td style={styles.td}>{item.client}</td>
                <td style={{...styles.td, color: '#22c55e', fontWeight: '600'}}>{formatCurrency(item.amount)}</td>
                <td style={styles.td}>{item.date}</td>
                <td style={styles.td}>
                  <button
                    onClick={() => {
                      if (window.confirm('Delete this entry?')) {
                        setCommissions(commissions.filter((_, i) => i !== idx));
                      }
                    }}
                    style={{
                      padding: '6px 12px',
                      backgroundColor: 'rgba(239, 68, 68, 0.1)',
                      color: '#ef4444',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '13px',
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );

  const renderExpenses = () => (
    <div style={styles.card}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div style={styles.cardTitle}>
          <span>📝</span> Business Expenses
        </div>
        <button 
          style={styles.addButton}
          onClick={() => { setModalType('expense'); setShowAddModal(true); }}
        >
          <span>+</span> Add Expense
        </button>
      </div>
      
      <div style={{ marginBottom: '24px', padding: '20px', backgroundColor: isDarkMode ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.05)', borderRadius: '12px' }}>
        <div style={{ fontSize: '14px', color: isDarkMode ? '#94a3b8' : '#64748b', marginBottom: '4px' }}>
          Total Expenses (YTD)
        </div>
        <div style={{ fontSize: '32px', fontWeight: '700', color: '#ef4444' }}>
          {formatCurrency(kpis.totalExpenses)}
        </div>
      </div>

      {expenses.length === 0 ? (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>📝</div>
          <p>No expenses recorded yet</p>
          <p style={{ fontSize: '13px', marginTop: '8px' }}>Track your business expenses for tax deductions</p>
        </div>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Description</th>
              <th style={styles.th}>Category</th>
              <th style={styles.th}>Amount</th>
              <th style={styles.th}>Date</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((item, idx) => (
              <tr key={idx}>
                <td style={styles.td}>{item.description}</td>
                <td style={styles.td}>{item.category}</td>
                <td style={{...styles.td, color: '#ef4444', fontWeight: '600'}}>-{formatCurrency(item.amount)}</td>
                <td style={styles.td}>{item.date}</td>
                <td style={styles.td}>
                  <button
                    onClick={() => {
                      if (window.confirm('Delete this expense?')) {
                        setExpenses(expenses.filter((_, i) => i !== idx));
                      }
                    }}
                    style={{
                      padding: '6px 12px',
                      backgroundColor: 'rgba(239, 68, 68, 0.1)',
                      color: '#ef4444',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '13px',
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );

  const renderCRM = () => (
    <div style={styles.card}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div style={styles.cardTitle}>
          <span>👥</span> {config.clientName} Relationship Manager
        </div>
        <button 
          style={styles.addButton}
          onClick={() => { setModalType('contact'); setShowAddModal(true); }}
        >
          <span>+</span> Add {config.clientName}
        </button>
      </div>
      
      {/* CRM Stage Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '24px' }}>
        {config.crmStages.map((stage, idx) => {
          const count = contacts.filter(c => c.stage === stage).length;
          const colors = ['#ef4444', '#f59e0b', '#3b82f6', '#22c55e'];
          return (
            <div key={stage} style={{
              backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
              padding: '16px',
              borderRadius: '12px',
              textAlign: 'center',
              borderTop: `3px solid ${colors[idx]}`
            }}>
              <div style={{ fontSize: '24px', fontWeight: '700', color: colors[idx] }}>{count}</div>
              <div style={{ fontSize: '12px', color: isDarkMode ? '#94a3b8' : '#64748b' }}>{stage}</div>
            </div>
          );
        })}
      </div>

      {contacts.length === 0 ? (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>👥</div>
          <p>No {config.clientNamePlural.toLowerCase()} added yet</p>
          <p style={{ fontSize: '13px', marginTop: '8px' }}>Start building your {config.clientName.toLowerCase()} database</p>
        </div>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Email</th>
              <th style={styles.th}>Phone</th>
              <th style={styles.th}>Stage</th>
              <th style={styles.th}>Notes</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map((contact, idx) => (
              <tr key={idx}>
                <td style={styles.td}>{contact.name}</td>
                <td style={styles.td}>{contact.email}</td>
                <td style={styles.td}>{contact.phone}</td>
                <td style={styles.td}>
                  <select
                    value={contact.stage}
                    onChange={(e) => {
                      const updated = [...contacts];
                      updated[idx].stage = e.target.value;
                      setContacts(updated);
                    }}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '6px',
                      border: `1px solid ${isDarkMode ? '#4a5568' : '#e2e8f0'}`,
                      backgroundColor: isDarkMode ? '#2d3748' : '#ffffff',
                      color: isDarkMode ? '#ffffff' : '#1e293b',
                      cursor: 'pointer',
                    }}
                  >
                    {config.crmStages.map(stage => (
                      <option key={stage} value={stage}>{stage}</option>
                    ))}
                  </select>
                </td>
                <td style={{...styles.td, maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>
                  {contact.notes}
                </td>
                <td style={styles.td}>
                  <button
                    onClick={() => {
                      if (window.confirm(`Delete this ${config.clientName.toLowerCase()}?`)) {
                        setContacts(contacts.filter((_, i) => i !== idx));
                      }
                    }}
                    style={{
                      padding: '6px 12px',
                      backgroundColor: 'rgba(239, 68, 68, 0.1)',
                      color: '#ef4444',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '13px',
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );

  const renderTaxCenter = () => (
    <>
      {/* Quarterly Payment Card */}
      <div style={styles.quarterlyCard}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '4px' }}>Estimated Quarterly Tax Payment</div>
            <div style={{ fontSize: '36px', fontWeight: '700' }}>{formatCurrency(taxEstimates.quarterlyPayment)}</div>
            <div style={{ fontSize: '13px', opacity: 0.8, marginTop: '8px' }}>
              Based on {formatCurrency(kpis.netIncome)} net income
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px' }}>2025 Due Dates</div>
            <div style={{ fontSize: '13px', opacity: 0.8 }}>Q1: April 15 • Q2: June 16</div>
            <div style={{ fontSize: '13px', opacity: 0.8 }}>Q3: Sept 15 • Q4: Jan 15, 2026</div>
          </div>
        </div>
      </div>

      {/* Tax Breakdown */}
      <div style={styles.card}>
        <div style={styles.cardTitle}>
          <span>📊</span> Tax Breakdown
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <div style={{ padding: '16px', backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)', borderRadius: '12px' }}>
            <div style={{ fontSize: '12px', color: isDarkMode ? '#94a3b8' : '#64748b', marginBottom: '4px' }}>Self-Employment Tax (15.3%)</div>
            <div style={{ fontSize: '24px', fontWeight: '600', color: isDarkMode ? '#ffffff' : '#1e293b' }}>{formatCurrency(taxEstimates.selfEmploymentTax)}</div>
          </div>
          <div style={{ padding: '16px', backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)', borderRadius: '12px' }}>
            <div style={{ fontSize: '12px', color: isDarkMode ? '#94a3b8' : '#64748b', marginBottom: '4px' }}>Est. Federal Tax (~22%)</div>
            <div style={{ fontSize: '24px', fontWeight: '600', color: isDarkMode ? '#ffffff' : '#1e293b' }}>{formatCurrency(taxEstimates.federalTax)}</div>
          </div>
          <div style={{ padding: '16px', backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)', borderRadius: '12px' }}>
            <div style={{ fontSize: '12px', color: isDarkMode ? '#94a3b8' : '#64748b', marginBottom: '4px' }}>Est. State Tax (~5%)</div>
            <div style={{ fontSize: '24px', fontWeight: '600', color: isDarkMode ? '#ffffff' : '#1e293b' }}>{formatCurrency(taxEstimates.stateTax)}</div>
          </div>
          <div style={{ padding: '16px', backgroundColor: isDarkMode ? 'rgba(99, 102, 241, 0.1)' : 'rgba(99, 102, 241, 0.05)', borderRadius: '12px', border: '2px solid #6366f1' }}>
            <div style={{ fontSize: '12px', color: '#6366f1', marginBottom: '4px' }}>Total Annual Tax Estimate</div>
            <div style={{ fontSize: '24px', fontWeight: '600', color: '#6366f1' }}>{formatCurrency(taxEstimates.totalTax)}</div>
          </div>
        </div>
      </div>

      {/* Deductions Guide */}
      <div style={styles.card}>
        <div style={styles.cardTitle}>
          <span>💡</span> Common Deductions for {config.name}
        </div>
        <div style={styles.deductionGrid}>
          {config.taxDeductions.map((deduction, idx) => (
            <div key={idx} style={styles.deductionCard}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <div style={{ fontWeight: '600', color: isDarkMode ? '#ffffff' : '#1e293b' }}>{deduction.name}</div>
                <div style={{ 
                  padding: '2px 8px', 
                  backgroundColor: 'rgba(34, 197, 94, 0.1)', 
                  color: '#22c55e', 
                  borderRadius: '4px', 
                  fontSize: '12px',
                  fontWeight: '500'
                }}>
                  {deduction.rate}
                </div>
              </div>
              <div style={{ fontSize: '13px', color: isDarkMode ? '#94a3b8' : '#64748b' }}>{deduction.description}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <div style={{ 
        padding: '16px', 
        backgroundColor: isDarkMode ? 'rgba(245, 158, 11, 0.1)' : 'rgba(245, 158, 11, 0.05)', 
        borderRadius: '12px',
        borderLeft: '4px solid #f59e0b',
        fontSize: '13px',
        color: isDarkMode ? '#fbbf24' : '#92400e'
      }}>
        <strong>⚠️ Disclaimer:</strong> These are estimates based on general 2024 IRS guidelines. Tax rates shown are simplified. 
        Please consult a tax professional for personalized advice. State tax rates vary significantly by location.
      </div>
    </>
  );

  // Add Modal Component
  const AddModal = () => {
    const [formData, setFormData] = useState({});

    const handleSubmit = () => {
      const today = new Date().toLocaleDateString();
      
      if (modalType === 'pipeline') {
        setPipeline([...pipeline, {
          name: formData.name || '',
          client: formData.client || '',
          value: parseFloat(formData.value) || 0,
          stage: config.pipelineStages[0],
          date: today
        }]);
      } else if (modalType === 'commission') {
        setCommissions([...commissions, {
          description: formData.description || '',
          client: formData.client || '',
          amount: parseFloat(formData.amount) || 0,
          date: today
        }]);
      } else if (modalType === 'expense') {
        setExpenses([...expenses, {
          description: formData.description || '',
          category: formData.category || 'Other',
          amount: parseFloat(formData.amount) || 0,
          date: today
        }]);
      } else if (modalType === 'contact') {
        setContacts([...contacts, {
          name: formData.name || '',
          email: formData.email || '',
          phone: formData.phone || '',
          stage: config.crmStages[0],
          notes: formData.notes || ''
        }]);
      }
      
      setShowAddModal(false);
      setFormData({});
    };

    const modalStyles = {
      overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      },
      modal: {
        backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
        borderRadius: '16px',
        padding: '24px',
        width: '90%',
        maxWidth: '500px',
        maxHeight: '90vh',
        overflow: 'auto',
      },
      title: {
        fontSize: '20px',
        fontWeight: '600',
        color: isDarkMode ? '#ffffff' : '#1e293b',
        marginBottom: '20px',
      },
      inputGroup: {
        marginBottom: '16px',
      },
      label: {
        display: 'block',
        fontSize: '14px',
        fontWeight: '500',
        color: isDarkMode ? '#94a3b8' : '#64748b',
        marginBottom: '6px',
      },
      input: {
        width: '100%',
        padding: '12px 16px',
        borderRadius: '8px',
        border: `1px solid ${isDarkMode ? '#4a5568' : '#e2e8f0'}`,
        backgroundColor: isDarkMode ? '#2d3748' : '#ffffff',
        color: isDarkMode ? '#ffffff' : '#1e293b',
        fontSize: '14px',
        boxSizing: 'border-box',
      },
      buttonRow: {
        display: 'flex',
        gap: '12px',
        marginTop: '24px',
      },
      cancelBtn: {
        flex: 1,
        padding: '12px',
        borderRadius: '8px',
        border: `1px solid ${isDarkMode ? '#4a5568' : '#e2e8f0'}`,
        backgroundColor: 'transparent',
        color: isDarkMode ? '#94a3b8' : '#64748b',
        fontSize: '14px',
        fontWeight: '500',
        cursor: 'pointer',
      },
      submitBtn: {
        flex: 1,
        padding: '12px',
        borderRadius: '8px',
        border: 'none',
        backgroundColor: '#6366f1',
        color: '#ffffff',
        fontSize: '14px',
        fontWeight: '500',
        cursor: 'pointer',
      },
    };

    const getModalTitle = () => {
      switch(modalType) {
        case 'pipeline': return `Add ${config.dealName}`;
        case 'commission': return `Add ${config.revenueName}`;
        case 'expense': return 'Add Expense';
        case 'contact': return `Add ${config.clientName}`;
        default: return 'Add Item';
      }
    };

    const renderFields = () => {
      switch(modalType) {
        case 'pipeline':
          return (
            <>
              <div style={modalStyles.inputGroup}>
                <label style={modalStyles.label}>{config.dealName} Name</label>
                <input
                  style={modalStyles.input}
                  placeholder={`Enter ${config.dealName.toLowerCase()} name`}
                  value={formData.name || ''}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div style={modalStyles.inputGroup}>
                <label style={modalStyles.label}>{config.clientName}</label>
                <input
                  style={modalStyles.input}
                  placeholder={`Enter ${config.clientName.toLowerCase()} name`}
                  value={formData.client || ''}
                  onChange={(e) => setFormData({...formData, client: e.target.value})}
                />
              </div>
              <div style={modalStyles.inputGroup}>
                <label style={modalStyles.label}>Estimated Value</label>
                <input
                  style={modalStyles.input}
                  type="number"
                  placeholder="0.00"
                  value={formData.value || ''}
                  onChange={(e) => setFormData({...formData, value: e.target.value})}
                />
              </div>
            </>
          );
        case 'commission':
          return (
            <>
              <div style={modalStyles.inputGroup}>
                <label style={modalStyles.label}>Description</label>
                <input
                  style={modalStyles.input}
                  placeholder="What was this for?"
                  value={formData.description || ''}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>
              <div style={modalStyles.inputGroup}>
                <label style={modalStyles.label}>{config.clientName}</label>
                <input
                  style={modalStyles.input}
                  placeholder={`${config.clientName} name`}
                  value={formData.client || ''}
                  onChange={(e) => setFormData({...formData, client: e.target.value})}
                />
              </div>
              <div style={modalStyles.inputGroup}>
                <label style={modalStyles.label}>Amount</label>
                <input
                  style={modalStyles.input}
                  type="number"
                  placeholder="0.00"
                  value={formData.amount || ''}
                  onChange={(e) => setFormData({...formData, amount: e.target.value})}
                />
              </div>
            </>
          );
        case 'expense':
          return (
            <>
              <div style={modalStyles.inputGroup}>
                <label style={modalStyles.label}>Description</label>
                <input
                  style={modalStyles.input}
                  placeholder="What did you spend on?"
                  value={formData.description || ''}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>
              <div style={modalStyles.inputGroup}>
                <label style={modalStyles.label}>Category</label>
                <select
                  style={modalStyles.input}
                  value={formData.category || ''}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                >
                  <option value="">Select category</option>
                  {config.taxDeductions.map(d => (
                    <option key={d.name} value={d.name}>{d.name}</option>
                  ))}
                  <option value="Other">Other</option>
                </select>
              </div>
              <div style={modalStyles.inputGroup}>
                <label style={modalStyles.label}>Amount</label>
                <input
                  style={modalStyles.input}
                  type="number"
                  placeholder="0.00"
                  value={formData.amount || ''}
                  onChange={(e) => setFormData({...formData, amount: e.target.value})}
                />
              </div>
            </>
          );
        case 'contact':
          return (
            <>
              <div style={modalStyles.inputGroup}>
                <label style={modalStyles.label}>Name</label>
                <input
                  style={modalStyles.input}
                  placeholder="Full name"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div style={modalStyles.inputGroup}>
                <label style={modalStyles.label}>Email</label>
                <input
                  style={modalStyles.input}
                  type="email"
                  placeholder="email@example.com"
                  value={formData.email || ''}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
              <div style={modalStyles.inputGroup}>
                <label style={modalStyles.label}>Phone</label>
                <input
                  style={modalStyles.input}
                  placeholder="(555) 555-5555"
                  value={formData.phone || ''}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </div>
              <div style={modalStyles.inputGroup}>
                <label style={modalStyles.label}>Notes</label>
                <input
                  style={modalStyles.input}
                  placeholder="Any notes about this contact"
                  value={formData.notes || ''}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                />
              </div>
            </>
          );
        default:
          return null;
      }
    };

    return (
      <div style={modalStyles.overlay} onClick={() => setShowAddModal(false)}>
        <div style={modalStyles.modal} onClick={(e) => e.stopPropagation()}>
          <div style={modalStyles.title}>{getModalTitle()}</div>
          {renderFields()}
          <div style={modalStyles.buttonRow}>
            <button style={modalStyles.cancelBtn} onClick={() => setShowAddModal(false)}>Cancel</button>
            <button style={modalStyles.submitBtn} onClick={handleSubmit}>Add</button>
          </div>
        </div>
      </div>
    );
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'pipeline', label: 'Pipeline', icon: '🎯' },
    { id: 'commissions', label: config.revenueNamePlural, icon: '💵' },
    { id: 'expenses', label: 'Expenses', icon: '📝' },
    { id: 'crm', label: 'CRM', icon: '👥' },
    { id: 'tax', label: 'Tax Center', icon: '🏛️' },
  ];

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.title}>
          <span>⚡</span> Command Center
          <span style={styles.hustleBadge}>
            <span>{config.icon}</span>
            {config.name}
          </span>
        </div>
        <div style={styles.subtitle}>
          Track your {config.dealNamePlural.toLowerCase()}, {config.clientNamePlural.toLowerCase()}, and finances all in one place
        </div>
      </div>

      {/* Tabs */}
      <div style={styles.tabs}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            style={{
              ...styles.tab,
              ...(activeTab === tab.id ? styles.activeTab : styles.inactiveTab)
            }}
            onClick={() => setActiveTab(tab.id)}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'dashboard' && renderDashboard()}
      {activeTab === 'pipeline' && renderPipeline()}
      {activeTab === 'commissions' && renderCommissions()}
      {activeTab === 'expenses' && renderExpenses()}
      {activeTab === 'crm' && renderCRM()}
      {activeTab === 'tax' && renderTaxCenter()}

      {/* Add Modal */}
      {showAddModal && <AddModal />}
    </div>
  );
};

export default SalesTrackerTab;
