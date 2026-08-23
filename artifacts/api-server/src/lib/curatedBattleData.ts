// Generated from the curated source snapshots in /data. Keep data changes in JSON; this module keeps the API deployment self-contained.

export type CuratedCompany = {
  [key: string]: unknown;
  batch: string | null;
  category?: string;
  industry: string | null;
  location: string | null;
  logo_url: string | null;
  long_description: string | null;
  name: string;
  one_liner: string | null;
  slug: string;
  website: string | null;
};

export type CuratedCompetitor = {
  [key: string]: unknown;
  id: string;
  slug: string;
  name: string;
  one_liner: string;
  description: string;
  website: string;
  category: string;
  location: string;
  logo_url: string;
};

export type CuratedBattle = {
  [key: string]: unknown;
  id: string;
  slug: string;
  title: string;
  space: string;
  yc_slug: string;
  rival_id: string;
  left_argument: string;
  right_argument: string;
  featured: boolean;
};

export const curatedCompanies: CuratedCompany[] = [
  {
    "batch": "Winter 2012",
    "id": 8,
    "industries": [
      "Real Estate and Construction",
      "Construction"
    ],
    "industry": "Real Estate and Construction",
    "is_hiring": false,
    "launched_at": 1322045547,
    "location": "San Francisco, CA, USA",
    "logo_url": "https://bookface-images.s3.amazonaws.com/small_logos/33ee27aa9c6b3036b40ec6c7f0c2a98ccaf32f40.png",
    "long_description": "PlanGrid is the leader in construction productivity software, used on more than one million projects in 84 countries. PlanGrid's cloud-based platform empowers contractors and owners in commercial, heavy civil, and other industries to collaborate easily from their mobile devices and desktop, managing blueprints, specs, photos, RFIs, field reports, and punch lists. With over 100 million digital blueprints on its platform, PlanGrid is also the largest digital blueprint repository in the world. \r\n\r\nFounded in 2011, the company was part of Y Combinator in 2012, and has secured over $69 million in funding from Sequoia Capital, Tenaya Capital and several other top firms.",
    "name": "PlanGrid",
    "one_liner": "Mobile applications for the construction industry.",
    "slug": "plangrid",
    "status": "Acquired",
    "subindustry": "Real Estate and Construction -> Construction",
    "tags": [
      "Construction"
    ],
    "team_size": 355,
    "top_company": true,
    "website": "http://plangrid.com",
    "yc_url": "https://www.ycombinator.com/companies/plangrid"
  },
  {
    "batch": "Winter 2012",
    "id": 24,
    "industries": [
      "B2B",
      "Human Resources"
    ],
    "industry": "B2B",
    "is_hiring": true,
    "launched_at": 1322045716,
    "location": "San Francisco, CA, USA",
    "logo_url": "https://bookface-images.s3.amazonaws.com/small_logos/6ce7845c2e268525f5f04915212ac0a106fb7e3d.png",
    "long_description": "Launched in 2012 as ZenPayroll, Gusto serves more than 300,000 businesses nationwide. Each year we process tens of billions of dollars of payroll and provide employee benefits—like health insurance and 401(k) accounts—while helping companies create incredible work places.\r\n\r\nThrough one refreshingly easy, integrated platform, we automate and simplify your payroll, benefits, and HR, all while providing expert support. You and your employees will get the peace of mind you need to do your best work.",
    "name": "Gusto",
    "one_liner": "Provides growing businesses with everything to take care of their team",
    "slug": "gusto",
    "status": "Active",
    "subindustry": "B2B -> Human Resources",
    "tags": [
      "B2B",
      "Payroll",
      "Health Insurance"
    ],
    "team_size": 2400,
    "top_company": true,
    "website": "https://gusto.com",
    "yc_url": "https://www.ycombinator.com/companies/gusto"
  },
  {
    "batch": "Winter 2012",
    "id": 30,
    "industries": [
      "Consumer",
      "Virtual and Augmented Reality"
    ],
    "industry": "Consumer",
    "is_hiring": false,
    "launched_at": 1322045771,
    "location": "San Francisco, CA, USA; Sunnyvale, CA, USA",
    "logo_url": "https://bookface-images.s3.amazonaws.com/small_logos/b271a79c3b59d6344c90e2803525a22f2a5e8406.png",
    "long_description": "Matterport is an immersive media technology company that is shaking up the 3D / VR world.  Our team has built the first end-to-end system for creating, modifying, distributing, and navigating immersive 3D and virtual reality (VR) versions of real-world spaces on web and mobile devices. Matterport offers the world's most inexpensive and simplest way to capture 3D spaces. \r\n\r\nOur products include:\r\n- Matterport Pro Camera for capturing real spaces in 3D.  It collects accurate visual and spatial data to map entire areas in minutes and is all about automation and ease of use.\r\n- The Matterport Cloud for processing and hosting 3D models\r\n- Matterport Portal, our system for viewing, editing, and managing models; collaborating with colleagues; and sharing models with others\r\n- Matterport 3D Showcase, a browser-based 3D media player, which allows anyone to view 3D models in their browser with no additional software\r\n- Matterport Core VR: All Spaces can be converted to VR and experienced on Samsung Gear VR or Google Cardboard (in beta), with additional device support coming soon.\r\n\r\nMatterport 3D media solutions power industries from real estate (residential, multi-family and commercial) and travel and hospitality (hotels, vacation rentals, and venue booking), to business listings, architecture, engineering and construction, news and entertainment, and everything in between. \r\n\r\nWe’re growing fast. If you’re passionate about solving cutting-edge problems in computer vision and hardware design and creating order-of-magnitude improvements in the ability to easily create and share 3D models of real world spaces, we want to talk to you. See open positions at matterport.com/jobs.\r\n\r\nTry Matterport for yourself at matterport.com/try.",
    "name": "Matterport",
    "one_liner": "Turn physical objects and environments into 3D models in seconds.",
    "slug": "matterport",
    "status": "Public",
    "subindustry": "Consumer -> Virtual and Augmented Reality",
    "tags": [
      "Computer Vision"
    ],
    "team_size": 201,
    "top_company": true,
    "website": "http://matterport.com",
    "yc_url": "https://www.ycombinator.com/companies/matterport"
  },
  {
    "batch": "Winter 2012",
    "id": 40,
    "industries": [
      "B2B",
      "Analytics"
    ],
    "industry": "B2B",
    "is_hiring": true,
    "launched_at": 1322045852,
    "location": "San Francisco, CA, USA",
    "logo_url": "https://bookface-images.s3.amazonaws.com/small_logos/fa98c8a53255b3fd2e9d4a65dbb47eec293729f1.png",
    "long_description": "Since graduating from YC, Amplitude (W12) has made it to IPO and beyond by helping cutting edge startups become category leaders. We’ve pioneered the digital analytics category to become the go-to solution for AI pioneers (Cruise, Midjourney), apps that touch millions of consumers (Doordash, Coinbase), and the best in B2B (Atlassian, Rippling, Canva).  \r\n\r\nWith product analytics, experiment, CDP, session replay, and more, Amplitude’s digital analytics platform shows you what your users love, where they’re getting stuck, and what keeps them coming back. You want to build a generational business, and we have the capabilities and pricing plans to guide you every step of the way. Check out our special deal for YC companies and get started on your analytics journey. ",
    "name": "Amplitude",
    "one_liner": "Digital Analytics Platform",
    "slug": "amplitude",
    "status": "Public",
    "subindustry": "B2B -> Analytics",
    "tags": [
      "Developer Tools",
      "B2B",
      "Analytics",
      "Marketing",
      "Data Visualization"
    ],
    "team_size": 750,
    "top_company": true,
    "website": "https://amplitude.com",
    "yc_url": "https://www.ycombinator.com/companies/amplitude"
  },
  {
    "batch": "Winter 2012",
    "id": 60,
    "industries": [
      "Fintech",
      "Payments"
    ],
    "industry": "Fintech",
    "is_hiring": false,
    "launched_at": 1625089349,
    "location": "Boston, MA, USA; Remote",
    "logo_url": "https://bookface-images.s3.amazonaws.com/small_logos/1bbfeae646cc8051b5ad469413e67295e9fae353.png",
    "long_description": "Sendwave's mission is to make sending money as easy and affordable as sending a text. Our app sends transfers securely from North America and Europe to Africa, Asia, and the Americas at great rates.",
    "name": "Sendwave",
    "one_liner": "Instant, no fee international remittances.",
    "slug": "sendwave",
    "status": "Acquired",
    "subindustry": "Fintech -> Payments",
    "tags": [
      "Fintech",
      "Payments"
    ],
    "team_size": 350,
    "top_company": true,
    "website": "https://www.sendwave.com",
    "yc_url": "https://www.ycombinator.com/companies/sendwave"
  },
  {
    "batch": "Summer 2011",
    "id": 86,
    "industries": [
      "Education"
    ],
    "industry": "Education",
    "is_hiring": false,
    "launched_at": 1326789163,
    "location": "New York City, NY, USA; New York, NY, USA",
    "logo_url": "https://bookface-images.s3.amazonaws.com/small_logos/ee26c3b11a260e7a045f68b47d8c804b306db89f.png",
    "long_description": "Working professionals are experiencing their jobs changing amidst the rise of technology and automation threatens over 800 million jobs. At the same time, software is eating the world, disrupting every major industry, and creating millions of new technology jobs that companies are eager to fill. This is the skills gap. Our mission is closing it.\r\n\r\nIn 2011, we changed the face of education by creating free interactive coding courses explored by over 45 million people. As we look to the future, we're focused on helping anyone get the skills they need for the jobs they want.  We aim to bridge the gap: between companies and the workforce, people and their dream jobs. Join one of the most dynamic technology companies in New York that is changing the way the world learns.\r\n\r\nHeadquartered in New York City, our team is filled with highly curious diverse individuals whose backgrounds span tech and education. Our team is passionate about our mission: helping people get the skills they need for the jobs they want. We seek transparency, thrive on feedback, value teamwork, love evolving and never forget it's people first. We enjoy catered lunches together, company outings, guest speakers and long walks on the beach.",
    "name": "Codecademy",
    "one_liner": "The leading online learning platform for technical skills.",
    "slug": "codecademy",
    "status": "Acquired",
    "subindustry": "Education",
    "tags": [
      "Education"
    ],
    "team_size": 225,
    "top_company": true,
    "website": "http://codecademy.com",
    "yc_url": "https://www.ycombinator.com/companies/codecademy"
  },
  {
    "batch": "Summer 2011",
    "id": 88,
    "industries": [
      "B2B",
      "Analytics"
    ],
    "industry": "B2B",
    "is_hiring": false,
    "launched_at": 1326789181,
    "location": "San Francisco, CA, USA",
    "logo_url": "https://bookface-images.s3.amazonaws.com/small_logos/99f5abd1f15fa4ca4394b5781c98d8ff23db6f7b.png",
    "long_description": "Segment is one place to collect customer data and send it to your tools for analytics, marketing automation, and raw data access with SQL. Implement all of your event tracking with Segment’s single API instead of wrangling a new API for every new tool or database. Segment's integrations let you send your data to hundreds of tools and databases.",
    "name": "Segment",
    "one_liner": "Software and APIs to collect, clean, and control customer data.",
    "slug": "segment",
    "status": "Acquired",
    "subindustry": "B2B -> Analytics",
    "tags": [
      "SaaS",
      "B2B"
    ],
    "team_size": 550,
    "top_company": true,
    "website": "http://segment.com",
    "yc_url": "https://www.ycombinator.com/companies/segment"
  },
  {
    "batch": "Winter 2011",
    "id": 145,
    "industries": [
      "B2B",
      "Productivity"
    ],
    "industry": "B2B",
    "is_hiring": false,
    "launched_at": 1326789780,
    "location": "San Francisco, CA, USA",
    "logo_url": "https://bookface-images.s3.amazonaws.com/small_logos/251df7a6d1d16ee11aac63b910791aca861aff29.png",
    "long_description": "We believe that the way business gets done today is broken. That’s why we’re dedicated to simplifying work for everyone - from small startups to large enterprise companies. Millions of individuals and over 65,000 companies world-wide trust the HelloSign platform – which includes eSignature, digital workflow and electronic fax solutions – to automate and manage their most important business transactions. \r\n\r\nWith a sharp focus on user experience and a lust for innovation, HelloSign is on a mission to Simplify Work.",
    "name": "HelloSign",
    "one_liner": "eSignature software for small and mid-market businesses.",
    "slug": "hellosign",
    "status": "Acquired",
    "subindustry": "B2B -> Productivity",
    "tags": [
      "SaaS",
      "Enterprise Software"
    ],
    "team_size": 100,
    "top_company": true,
    "website": "https://www.hellosign.com",
    "yc_url": "https://www.ycombinator.com/companies/hellosign"
  },
  {
    "batch": "Winter 2011",
    "id": 158,
    "industries": [
      "B2B",
      "Retail"
    ],
    "industry": "B2B",
    "is_hiring": false,
    "launched_at": 1326789909,
    "location": "San Francisco, CA, USA",
    "logo_url": "https://bookface-images.s3.amazonaws.com/small_logos/e57fe3f2f5b8a158002acd8fef99c01e7294b55c.png",
    "long_description": "Fivestars is a leading payment and customer loyalty platform for small local businesses. Our mission is to help businesses and communities thrive by turning every transaction into a relationship. \r\n\r\nSince launching in 2011, Fivestars has become a rewarding platform with 60 million users discovering and driving sales to 14,000+ small businesses. We help drive over $3 billion in local sales per year. More than 1 million people sign up monthly to support the local businesses that make our neighborhoods great. \r\n\r\nThe company is backed by Lightspeed, DCM, Menlo Ventures, HarbourVest, and others. \r\n\r\nTogether, let’s #LoveLocal. Visit www.fivestars.com for more information.\r\n",
    "name": "Fivestars",
    "one_liner": "Customer loyalty and payments platform for small businesses.",
    "slug": "fivestars",
    "status": "Acquired",
    "subindustry": "B2B -> Retail",
    "tags": [
      "Fintech",
      "Marketplace"
    ],
    "team_size": 201,
    "top_company": true,
    "website": "http://fivestars.com",
    "yc_url": "https://www.ycombinator.com/companies/fivestars"
  },
  {
    "batch": "Winter 2011",
    "id": 168,
    "industries": [
      "Consumer",
      "Apparel and Cosmetics"
    ],
    "industry": "Consumer",
    "is_hiring": true,
    "launched_at": 1326789988,
    "location": "Los Angeles, CA, USA",
    "logo_url": "https://bookface-images.s3.amazonaws.com/small_logos/4f3a455935f36a6655742aae286b206df1cd13bd.png",
    "long_description": "GOAT Group represents the leading platforms for authentic sneakers, apparel and accessories. Operating four distinct brands–GOAT, Flight Club, Grailed and alias–GOAT Group has a global community of over 50M members across 170 countries.\r\n\r\nWe are backed by some of the leading names in venture capital including Accel Partners, Andreessen Horowitz, Index Ventures, Matrix Partners, NEA, SV Angel, Upfront Ventures, Webb Investment Network and Y Combinator.",
    "name": "GOAT Group",
    "one_liner": "Platform for the greatest products from the past, present and future.",
    "slug": "goat-group",
    "status": "Active",
    "subindustry": "Consumer -> Apparel and Cosmetics",
    "tags": [
      "Marketplace"
    ],
    "team_size": 1600,
    "top_company": true,
    "website": "https://www.goatgroup.com/",
    "yc_url": "https://www.ycombinator.com/companies/goat-group"
  },
  {
    "batch": "Winter 2011",
    "id": 170,
    "industries": [
      "Healthcare",
      "Healthcare IT"
    ],
    "industry": "Healthcare",
    "is_hiring": false,
    "launched_at": 1326790001,
    "location": "San Francisco, CA, USA; CA, USA; Remote",
    "logo_url": "https://bookface-images.s3.amazonaws.com/small_logos/777dd100388a6a777571baee7bd41695a7129e6a.png",
    "long_description": "DrChrono develops the essential platform and services for modern medical practices to make care more informed, more interactive, and more personalized. The open platform powers telehealth, electronic health record (EHR), practice management, medical billing, and revenue cycle solutions for physicians and patients, and is fully extensible via a robust API and marketplace of applications and services. The platform is used by thousands of physicians and millions of patients, and is facilitating millions of patient appointments and is processing billions of dollars in medical billing. For more information about DrChrono, visit www.drchrono.com",
    "name": "DrChrono",
    "one_liner": "The essential platform for modern medical practices and patients.",
    "slug": "drchrono",
    "status": "Acquired",
    "subindustry": "Healthcare -> Healthcare IT",
    "tags": [
      "Healthcare",
      "Telemedicine",
      "API"
    ],
    "team_size": 150,
    "top_company": true,
    "website": "https://www.drchrono.com",
    "yc_url": "https://www.ycombinator.com/companies/drchrono"
  },
  {
    "batch": "Summer 2010",
    "id": 202,
    "industries": [
      "B2B",
      "Engineering, Product and Design"
    ],
    "industry": "B2B",
    "is_hiring": false,
    "launched_at": 1326790252,
    "location": "San Francisco, CA, USA",
    "logo_url": "https://bookface-images.s3.amazonaws.com/small_logos/18fd6f870541d2398827dedc9e57678e8770c424.png",
    "long_description": "PagerDuty is an operations performance platform delivering visibility and actionable intelligence across the entire incident lifecycle. Their SaaS-based solution empowers over 10,000 small, mid-size and enterprise global customers such as Comcast, eHarmony, Slack and Lululemon with the insight to intelligently respond to critical disruptions for exceptional customer experience. PagerDuty was founded to deliver a new and innovative approach to increase business response and efficiency. When brand reputation depends on customer satisfaction, PagerDuty arms businesses with the insight to proactively manage incidents and events that may impact customers across their IT environment.",
    "name": "PagerDuty",
    "one_liner": "Real-time visibility into critical apps and services all in one place.",
    "slug": "pagerduty",
    "status": "Public",
    "subindustry": "B2B -> Engineering, Product and Design",
    "tags": [
      "DevOps",
      "Monitoring"
    ],
    "team_size": 950,
    "top_company": true,
    "website": "http://pagerduty.com",
    "yc_url": "https://www.ycombinator.com/companies/pagerduty"
  },
  {
    "batch": "Winter 2010",
    "id": 221,
    "industries": [
      "B2B",
      "Engineering, Product and Design"
    ],
    "industry": "B2B",
    "is_hiring": false,
    "launched_at": 1326790440,
    "location": "San Francisco, CA, USA",
    "logo_url": "https://bookface-images.s3.amazonaws.com/small_logos/0d8d48fc3d7aa043a1e1d86d30f84a388f342454.png",
    "long_description": "At Optimizely, we're on a mission to help people unlock their digital potential. We do that by reinventing how marketing and product teams work to create and optimize digital experiences across all channels. With Optimizely One, our industry-first operating system for marketers, we offer teams flexibility and choice to build their stack their way with our fully SaaS, fully decoupled, and highly composable solution. We help companies around the world orchestrate their entire content lifecycle, monetize every digital experience and experiment across all customer touchpoints – all through Optimizely One, the leading digital experience platform that powers every phase of the marketing lifecycle through a single, AI-accelerated workflow. \r\n\r\nOptimizely has nearly 1500 employees across our 21 global offices and has 700+ partners. We are proud to help more than 10,000 businesses, including H&M, PayPal, Zoom, and Toyota, enrich their customer lifetime value, increase revenue and grow their brands. At Optimizely, we live each day with a simple philosophy: large enough to serve, small enough to care. Learn more at optimizely.com. ",
    "name": "Optimizely",
    "one_liner": "The first all-in-one operating system for marketing",
    "slug": "optimizely",
    "status": "Acquired",
    "subindustry": "B2B -> Engineering, Product and Design",
    "tags": [
      "Marketing"
    ],
    "team_size": 1500,
    "top_company": true,
    "website": "http://optimizely.com",
    "yc_url": "https://www.ycombinator.com/companies/optimizely"
  },
  {
    "batch": "Summer 2009",
    "id": 240,
    "industries": [
      "Fintech"
    ],
    "industry": "Fintech",
    "is_hiring": true,
    "launched_at": 1326790584,
    "location": "San Francisco, CA, USA",
    "logo_url": "https://bookface-images.s3.amazonaws.com/small_logos/e5ccedd9995f6524b4a0379062eb67f7c991613e.png",
    "long_description": "Launched out of Y Combinator’s 2009 Summer batch, Stripe is a global technology company that builds economic infrastructure for the internet. Businesses of every size—from new startups to public companies—use our software to accept payments and manage their businesses online Stripe is a proud partner of YC companies—from Airbnb (S09) to Defog (W23)—to help them grow their businesses and increase the GDP of the internet.",
    "name": "Stripe",
    "one_liner": "Economic infrastructure for the internet.",
    "slug": "stripe",
    "status": "Active",
    "subindustry": "Fintech",
    "tags": [
      "Banking as a Service",
      "Fintech",
      "SaaS"
    ],
    "team_size": 7000,
    "top_company": true,
    "website": "http://stripe.com",
    "yc_url": "https://www.ycombinator.com/companies/stripe"
  },
  {
    "batch": "Summer 2009",
    "id": 248,
    "industries": [
      "B2B",
      "Analytics"
    ],
    "industry": "B2B",
    "is_hiring": false,
    "launched_at": 1326790650,
    "location": "San Francisco, CA, USA",
    "logo_url": "https://bookface-images.s3.amazonaws.com/small_logos/de2e1c705cd83dd0add15fd23dbc3d1818388b84.png",
    "long_description": "Mixpanel is analytics for builders that need answers from their data at their fingertips. When everyone in the organization can see — and learn from — the impact of their work, they are poised to make better decisions. Companies like OpenAI, Netflix, Pinterest, sweetgreen, CNN, samsara, Uber, and Yelp use Mixpanel to understand their customers, measure progress, and endeavor to make better decisions.",
    "name": "Mixpanel",
    "one_liner": "Mixpanel is event analytics for builders that need answers.",
    "slug": "mixpanel",
    "status": "Active",
    "subindustry": "B2B -> Analytics",
    "tags": [
      "B2B",
      "Analytics",
      "Data Visualization",
      "Cloud Computing",
      "Databases"
    ],
    "team_size": 410,
    "top_company": true,
    "website": "http://mixpanel.com",
    "yc_url": "https://www.ycombinator.com/companies/mixpanel"
  },
  {
    "batch": "Winter 2009",
    "id": 271,
    "industries": [
      "Consumer",
      "Travel, Leisure and Tourism"
    ],
    "industry": "Consumer",
    "is_hiring": false,
    "launched_at": 1326790856,
    "location": "San Francisco, CA, USA",
    "logo_url": "https://bookface-images.s3.amazonaws.com/small_logos/3e9a0092bee2ccf926e650e59c06503ec6b9ee65.png",
    "long_description": "Founded in August of 2008 and based in San Francisco, California, Airbnb is a trusted community marketplace for people to list, discover, and book unique accommodations around the world — online or from a mobile phone. Whether an apartment for a night, a castle for a week, or a villa for a month, Airbnb connects people to unique travel experiences, at any price point, in more than 33,000 cities and 192 countries. And with world-class customer service and a growing community of users, Airbnb is the easiest way for people to monetize their extra space and showcase it to an audience of millions.  \r\n\r\nNo global movement springs from individuals. It takes an entire team united behind something big. Together, we work hard, we laugh a lot, we brainstorm nonstop, we use hundreds of Post-Its a week, and we give the best high-fives in town. Headquartered in San Francisco, we have satellite offices in Dublin, London, Barcelona, Paris, Milan, Copenhagen, Berlin, Moscow, São Paolo, Sydney, and Singapore.",
    "name": "Airbnb",
    "one_liner": "Book accommodations around the world.",
    "slug": "airbnb",
    "status": "Public",
    "subindustry": "Consumer -> Travel, Leisure and Tourism",
    "tags": [
      "Marketplace",
      "Travel"
    ],
    "team_size": 6132,
    "top_company": true,
    "website": "http://airbnb.com",
    "yc_url": "https://www.ycombinator.com/companies/airbnb"
  },
  {
    "batch": "Winter 2008",
    "id": 311,
    "industries": [
      "B2B",
      "Infrastructure"
    ],
    "industry": "B2B",
    "is_hiring": false,
    "launched_at": 1326791220,
    "location": "San Francisco, CA, USA",
    "logo_url": "https://bookface-images.s3.amazonaws.com/small_logos/ccf274d8a6c429ccf311e735490c66dee76ccace.png",
    "long_description": "Heroku, a Salesforce company and industry pioneer in platform as a service (PaaS), enables developers to build and run applications entirely in the cloud. Heroku provides companies from startups to Fortune 500 enterprises with a faster and more effective way to create, deploy, and manage apps.\r\n\r\nHeroku operates the world’s largest PaaS, continuously delivering millions of apps with 6+ million container deployments, 60+ billion routing requests, and 10+ terabytes of application logs per day.",
    "name": "Heroku",
    "one_liner": "Enabling developers to build and run applications in the cloud.",
    "slug": "heroku",
    "status": "Acquired",
    "subindustry": "B2B -> Infrastructure",
    "tags": [],
    "team_size": 300,
    "top_company": true,
    "website": "http://heroku.com",
    "yc_url": "https://www.ycombinator.com/companies/heroku"
  },
  {
    "batch": "Summer 2007",
    "id": 325,
    "industries": [
      "B2B",
      "Productivity"
    ],
    "industry": "B2B",
    "is_hiring": false,
    "launched_at": 1326791328,
    "location": "San Francisco, CA, USA",
    "logo_url": "https://bookface-images.s3.amazonaws.com/small_logos/f09464ae6ddf165ef871115af711c89d6530057f.png",
    "long_description": "Dropbox is building the world’s first smart workspace.\r\nBack in 2007, making work better for people meant designing a simpler way to keep files in sync. Today, it means designing products that reduce busywork so you can focus on the work that matters.\r\n\r\nMost “productivity tools” get in your way. They constantly ping, distract, and disrupt your team’s flow, so you spend your days switching between apps and tracking down feedback. It’s busywork, not the meaningful stuff. We want to change this. \r\n\r\nWe believe there’s a more enlightened way to work. Dropbox helps people be organized, stay focused, and get in sync with their teams.",
    "name": "Dropbox",
    "one_liner": "Backup and share files in the cloud.",
    "slug": "dropbox",
    "status": "Public",
    "subindustry": "B2B -> Productivity",
    "tags": [],
    "team_size": 4000,
    "top_company": true,
    "website": "http://dropbox.com",
    "yc_url": "https://www.ycombinator.com/companies/dropbox"
  },
  {
    "batch": "Summer 2006",
    "id": 356,
    "industries": [
      "Consumer",
      "Content"
    ],
    "industry": "Consumer",
    "is_hiring": false,
    "launched_at": 1326791580,
    "location": "San Francisco, CA, USA",
    "logo_url": "https://bookface-images.s3.amazonaws.com/small_logos/01a86e89391dfdeb194190d1925b25fee5854301.png",
    "long_description": "Scribd gives you access to millions of ebooks, audiobooks, magazines, podcasts, and more — all in one place, for one price.\r\n\r\nOUR VISION\r\nInspire the world through stories and knowledge.\r\n\r\nOUR MISSION\r\nBuild the largest and most accessible library connecting storytellers with their audience.\r\n\r\nIf you love working with smart, motivated people, you’ll love working at Scribd. We value our employees, we demonstrate accountability, and we take action. We’re one team with a common goal: helping our customers flourish.",
    "name": "Scribd",
    "one_liner": "World's largest online library.",
    "slug": "scribd",
    "status": "Active",
    "subindustry": "Consumer -> Content",
    "tags": [
      "AI-Enhanced Learning",
      "Remote Work",
      "Edtech"
    ],
    "team_size": 300,
    "top_company": true,
    "website": "http://scribd.com",
    "yc_url": "https://www.ycombinator.com/companies/scribd"
  },
  {
    "batch": "Summer 2005",
    "id": 379,
    "industries": [
      "Consumer",
      "Content"
    ],
    "industry": "Consumer",
    "is_hiring": false,
    "launched_at": 1326791708,
    "location": "San Francisco, CA, USA",
    "logo_url": "https://bookface-images.s3.amazonaws.com/small_logos/2f5bed7ab9abb66ee8ccbf622c27a9d741c3c4e4.png",
    "long_description": "Founded by Steve Huffman and Alexis Ohanian in 2005, Reddit is an online community where users submit, vote, and comment on content, news, and discussions. Nicknamed \"the front page of the internet,\"​ Reddit is one of the top ten sites in the United States (source: Alexa), with hundreds of millions of users each month on desktop, mobile web, and our official Android/iOS apps. \r\n\r\nInterested in joining our growing team? Check out about.reddit.com/careers",
    "name": "Reddit",
    "one_liner": "The frontpage of the internet.",
    "slug": "reddit",
    "status": "Acquired",
    "subindustry": "Consumer -> Content",
    "tags": [
      "Community",
      "Social Media",
      "Social",
      "Social Network"
    ],
    "team_size": 2000,
    "top_company": true,
    "website": "http://reddit.com",
    "yc_url": "https://www.ycombinator.com/companies/reddit"
  },
  {
    "batch": "Winter 2007",
    "id": 383,
    "industries": [
      "Consumer",
      "Content"
    ],
    "industry": "Consumer",
    "is_hiring": false,
    "launched_at": 1326791723,
    "location": "San Francisco, CA, USA",
    "logo_url": "https://bookface-images.s3.amazonaws.com/small_logos/d0e24465d91469fa05da337659e25131f5295e3d.png",
    "long_description": "Twitch is the world’s leading video platform and community for gamers. More than 100 million gamers gather every month to broadcast, watch and chat about gaming. Twitch’s video platform is the backbone of live and on-demand distribution for leading video game broadcasters including casual gamers, pro players, tournaments, leagues, developers and gaming media organizations. Twitch is leading a revolution in the gaming community, working to create a participatory experience that transcends gameplay. Learn more at http://twitch.tv.",
    "name": "Twitch",
    "one_liner": "A global community creating the future of live entertainment.",
    "slug": "twitch",
    "status": "Acquired",
    "subindustry": "Consumer -> Content",
    "tags": [
      "Community",
      "Gaming",
      "Social Media",
      "Video",
      "Social Network"
    ],
    "team_size": 2000,
    "top_company": true,
    "website": "http://twitch.com",
    "yc_url": "https://www.ycombinator.com/companies/twitch"
  },
  {
    "batch": "Summer 2012",
    "id": 412,
    "industries": [
      "Education"
    ],
    "industry": "Education",
    "is_hiring": false,
    "launched_at": 1336096710,
    "location": "San Francisco, CA, USA",
    "logo_url": "https://bookface-images.s3.amazonaws.com/small_logos/76cc0d8c3947ddc3bc0b8b889117b3cf3dc00ba2.png",
    "long_description": "Clever is a single platform for all of your digital learning programs. Founded in 2012, Clever was started by educators and technology professionals who knew that schools, teachers, and students could all benefit from the amazing learning software that was available, but key challenges stood in the way of accessing the technology. Today, half of K-12 schools in the U.S. use Clever to give students and teachers single sign-on access for any resource or file they need, and to automate software account setup and updates for district administrators. Clever gives teachers time to teach, helps districts be better informed, and makes using applications in the classroom effortless.\r\n\r\nWe are a team of more than 100 people passionate about education. If you feel the same way, you should see our openings at https://clever.com/about/jobs.",
    "name": "Clever",
    "one_liner": "The platform that powers technology in the classroom.",
    "slug": "clever",
    "status": "Acquired",
    "subindustry": "Education",
    "tags": [
      "Education",
      "SaaS"
    ],
    "team_size": 210,
    "top_company": true,
    "website": "https://clever.com",
    "yc_url": "https://www.ycombinator.com/companies/clever"
  },
  {
    "batch": "Summer 2012",
    "id": 414,
    "industries": [
      "Fintech",
      "Consumer Finance"
    ],
    "industry": "Fintech",
    "is_hiring": false,
    "launched_at": 1336096730,
    "location": "Austin, TX, USA; Remote",
    "logo_url": "https://bookface-images.s3.amazonaws.com/small_logos/d79adb13b4acb20f9e08e876a7ad54319a3e7a10.png",
    "long_description": "SmartAsset is an online destination for consumer-focused financial information and advice. Reaching approximately 59 million people each month (as of January 2024) through its educational content and personalized calculators and tools, SmartAsset's mission is to help people make smart financial decisions. \r\n\r\nAdditionally, SmartAsset powers SmartAsset AMP, a national marketplace connecting consumers to financial advisors. Building on SmartAsset’s relationship with millions of investors, SmartAsset AMP connects financial advisors directly with prospects who meet their target client profile. Our algorithm matches consumers with up to three fiduciary financial advisors. In 2023, SmartAsset helped advisors close an estimated $34 billion.",
    "name": "SmartAsset",
    "one_liner": "Marketplace connecting consumers to financial advisors",
    "slug": "smartasset",
    "status": "Active",
    "subindustry": "Fintech -> Consumer Finance",
    "tags": [
      "Fintech",
      "Marketplace"
    ],
    "team_size": 210,
    "top_company": true,
    "website": "http://smartasset.com",
    "yc_url": "https://www.ycombinator.com/companies/smartasset"
  },
  {
    "batch": "Summer 2012",
    "id": 429,
    "industries": [
      "B2B",
      "Recruiting and Talent"
    ],
    "industry": "B2B",
    "is_hiring": false,
    "launched_at": 1336096858,
    "location": "San Francisco, CA, USA",
    "logo_url": "https://bookface-images.s3.amazonaws.com/small_logos/5aab29bbd372c8ae56867cfafbca2d5d2ae180e6.png",
    "long_description": "Lever is one of the most recognized brands in talent acquisition software for high growth companies. We enable teams to post jobs, source, interview, and hire top talent. We've combined ATS & CRM into a single platform, Lever TRM. Our Talent Acquisition Suite also includes tools for recruitment marketing and analytics: Lever Nurture, Lever Advanced Analytics, and Lever Data Warehouse Sync. Our customers include Netflix, KPMG, Spotify, Talend, Cirque du Soleil, and over 5000 other customers.\r\n\r\nLever has raised $123 million in funding from Apax Digital, Adam Street Partners, Scale Venture Partners, Matrix Partners, and Y Combinator among others. With an overall gender ratio of 50:50, Lever is also fiercely committed to building a team culture that celebrates diversity and inclusion. For more information, visit https://www.lever.co/.",
    "name": "Lever",
    "one_liner": "Talent Acquisition Suite that combines ATS + Talent CRM",
    "slug": "lever",
    "status": "Acquired",
    "subindustry": "B2B -> Recruiting and Talent",
    "tags": [
      "SaaS",
      "Human Resources",
      "Talent Acquisition"
    ],
    "team_size": 225,
    "top_company": true,
    "website": "https://www.lever.co/",
    "yc_url": "https://www.ycombinator.com/companies/lever"
  },
  {
    "batch": "Summer 2012",
    "id": 439,
    "industries": [
      "Fintech",
      "Banking and Exchange"
    ],
    "industry": "Fintech",
    "is_hiring": false,
    "launched_at": 1336096943,
    "location": "Los Angeles, CA, USA; Remote",
    "logo_url": "https://bookface-images.s3.amazonaws.com/small_logos/1169cb0b69fa7b338b5d51c2d3805f8f988bdfa5.png",
    "long_description": "Founded in June of 2012, Coinbase is a digital currency wallet and platform where merchants and consumers can transact with new digital currencies like bitcoin, ethereum, and litecoin. Our vision is to bring more innovation, efficiency, and equality of opportunity to the world by building an open financial system. Our first step on that journey is making digital currency accessible and approachable for everyone. Two principles guide our efforts. First, be the most trusted company in our domain. Second, create user-focused products that are easier and more intuitive to use.",
    "name": "Coinbase",
    "one_liner": "Buy, sell, and manage cryptocurrencies.",
    "slug": "coinbase",
    "status": "Public",
    "subindustry": "Fintech -> Banking and Exchange",
    "tags": [
      "Crypto / Web3"
    ],
    "team_size": 6112,
    "top_company": true,
    "website": "https://www.coinbase.com",
    "yc_url": "https://www.ycombinator.com/companies/coinbase"
  },
  {
    "batch": "Summer 2012",
    "id": 442,
    "industries": [
      "B2B",
      "Productivity"
    ],
    "industry": "B2B",
    "is_hiring": true,
    "launched_at": 1336096965,
    "location": "San Francisco, CA, USA; Mountain View, CA, USA; Remote",
    "logo_url": "https://bookface-images.s3.amazonaws.com/small_logos/59fbaea3a4a565dd0eb1b1228ea2d6fd35e22ad8.png",
    "long_description": "Founded in 2011, Zapier is the #1 workflow automation platform for small and mid-sized businesses. By connecting more than 6,000 of the most popular work apps, Zapier empowers its users to make the most of the tools they already use—and to focus on what matters most.",
    "name": "Zapier",
    "one_liner": "The easiest way to automate your work.",
    "slug": "zapier",
    "status": "Active",
    "subindustry": "B2B -> Productivity",
    "tags": [
      "SaaS",
      "B2B",
      "Automation"
    ],
    "team_size": 700,
    "top_company": true,
    "website": "http://zapier.com",
    "yc_url": "https://www.ycombinator.com/companies/zapier"
  },
  {
    "batch": "Summer 2012",
    "id": 445,
    "industries": [
      "B2B"
    ],
    "industry": "B2B",
    "is_hiring": false,
    "launched_at": 1336096997,
    "location": "San Francisco, CA, USA",
    "logo_url": "https://bookface-images.s3.amazonaws.com/small_logos/56dfbb621883fb62890bd66d7bd967984b974c12.png",
    "long_description": "Biotechnology is rewriting life as we know it, from the medicines we take, to the crops we grow, the materials we wear, and the household goods that we rely on every day. Biotech R&D is radically transforming our world, but to move at the new speed of science, scientists need better technology.\r\n\r\nBenchling’s mission is to unlock the power of biotechnology. The world’s biotech leaders and innovators use our R&D Cloud to power the development of breakthrough products and accelerate time to milestone and market.",
    "name": "Benchling",
    "one_liner": "Unlocking the power of biotech with modern software for modern science",
    "slug": "benchling",
    "status": "Active",
    "subindustry": "B2B",
    "tags": [
      "SaaS",
      "B2B",
      "Biotech"
    ],
    "team_size": 750,
    "top_company": true,
    "website": "http://benchling.com",
    "yc_url": "https://www.ycombinator.com/companies/benchling"
  },
  {
    "batch": "Summer 2012",
    "id": 468,
    "industries": [
      "Consumer",
      "Food and Beverage"
    ],
    "industry": "Consumer",
    "is_hiring": true,
    "launched_at": 1340213784,
    "location": "San Francisco, CA, USA",
    "logo_url": "https://bookface-images.s3.amazonaws.com/small_logos/9750fca21baaee75e035f1baaf58df8e2f5dcc67.png",
    "long_description": "Instacart is the North American leader in online grocery and one of the fastest-growing companies in e-commerce. Instacart’s same-day delivery and pickup services bring fresh groceries and everyday essentials to busy people and families across the U.S. and Canada in as fast as an hour. Since its founding in 2012, Instacart has become an essential service for millions of families, while also serving as an immediate, flexible earnings opportunity for hundreds of thousands of shoppers across North America.  The company partners with more than 350 retailers and delivers from more than 25,000 stores across more than 5,500 cities in North America. Today, Instacart is accessible to more than 85% of households in the U.S. and more than 70% of households in Canada.",
    "name": "Instacart",
    "one_liner": "Marketplace for grocery delivery and pickup",
    "slug": "instacart",
    "status": "Public",
    "subindustry": "Consumer -> Food and Beverage",
    "tags": [
      "Grocery",
      "Delivery",
      "E-commerce"
    ],
    "team_size": 3000,
    "top_company": true,
    "website": "https://www.instacart.com",
    "yc_url": "https://www.ycombinator.com/companies/instacart"
  },
  {
    "batch": "Winter 2013",
    "id": 482,
    "industries": [
      "B2B",
      "Infrastructure"
    ],
    "industry": "B2B",
    "is_hiring": false,
    "launched_at": 1354492705,
    "location": "San Francisco, CA, USA; Oakland, CA, USA",
    "logo_url": "https://bookface-images.s3.amazonaws.com/small_logos/d6b5710a13038fe1daa1421a986e1f4a7839a65a.png",
    "long_description": "Fivetran automates data movement out of, into and across cloud data platforms. We automate the most time-consuming parts of the ELT process from extracts to schema drift handling to transformations, so data engineers can focus on higher-impact projects with total pipeline peace of mind. With 99.9% uptime and self-healing pipelines, Fivetran enables hundreds of leading brands across the globe, including Autodesk, Conagra Brands, JetBlue, Lionsgate, Morgan Stanley, and Ziff Davis, to accelerate data-driven decisions and drive business growth. Fivetran is headquartered in Oakland, California, with offices around the world. ",
    "name": "Fivetran",
    "one_liner": "The leader in automated data movement",
    "slug": "fivetran",
    "status": "Active",
    "subindustry": "B2B -> Infrastructure",
    "tags": [
      "SaaS",
      "B2B",
      "Analytics",
      "Data Engineering"
    ],
    "team_size": 1200,
    "top_company": true,
    "website": "http://fivetran.com",
    "yc_url": "https://www.ycombinator.com/companies/fivetran"
  },
  {
    "batch": "Winter 2013",
    "id": 498,
    "industries": [
      "B2B",
      "Analytics"
    ],
    "industry": "B2B",
    "is_hiring": false,
    "launched_at": 1354492832,
    "location": "Seattle, WA, USA; San Francisco, CA, USA",
    "logo_url": "https://bookface-images.s3.amazonaws.com/small_logos/0be58a0e5449236d7f3e0dbb741e2aadde9e2881.png",
    "long_description": "Heap automates away the annoying parts of user analytics. No manual event tracking. No messy tracking plans. No custom ETL pipelines. Just insights. For everyone on your team.",
    "name": "Heap",
    "one_liner": "Captures user interactions with no code to generate analytics.",
    "slug": "heap",
    "status": "Acquired",
    "subindustry": "B2B -> Analytics",
    "tags": [
      "SaaS",
      "Analytics"
    ],
    "team_size": 388,
    "top_company": true,
    "website": "https://heap.io/",
    "yc_url": "https://www.ycombinator.com/companies/heap"
  },
  {
    "batch": "Summer 2013",
    "id": 531,
    "industries": [
      "Consumer",
      "Food and Beverage"
    ],
    "industry": "Consumer",
    "is_hiring": true,
    "launched_at": 1367523459,
    "location": "San Francisco, CA, USA",
    "logo_url": "https://bookface-images.s3.amazonaws.com/small_logos/d13287c52acc96909f32342e85c26a33cfdac310.png",
    "long_description": "Founded in 2013, DoorDash is a San Francisco-based technology company passionate about transforming local businesses and dedicated to enabling new ways of working, earning, and living. Today, DoorDash connects customers with their favorite local and national restaurants in more than 600 cities across the United States and Canada. By building intelligent, last-mile delivery technology for local cities, DoorDash aims to connect people with the things they care about — one dash at a time. \r\n\r\nRead more at blog.doordash.com, and find us on Glassdoor.",
    "name": "DoorDash",
    "one_liner": "Restaurant delivery.",
    "slug": "doordash",
    "status": "Public",
    "subindustry": "Consumer -> Food and Beverage",
    "tags": [
      "Marketplace",
      "E-commerce"
    ],
    "team_size": 8600,
    "top_company": true,
    "website": "http://doordash.com",
    "yc_url": "https://www.ycombinator.com/companies/doordash"
  },
  {
    "batch": "Summer 2013",
    "id": 566,
    "industries": [
      "B2B",
      "Marketing"
    ],
    "industry": "B2B",
    "is_hiring": true,
    "launched_at": 1367523820,
    "location": "San Francisco, CA, USA",
    "logo_url": "https://bookface-images.s3.amazonaws.com/small_logos/c2275979b46d95062b78be0329b056f2290e3143.png",
    "long_description": "Webflow is the leading no-code visual web development platform. It seamlessly generates sophisticated code so anyone can build powerful web-based businesses and adapt to changes without developers or months of building. \r\n\r\nFrom entrepreneurs and creative agencies to Fortune 500 companies, Webflow makes the internet a more inclusive place by making the tools to build on it more accessible to more people, fueling business growth. Webflow powers websites for innovators like Discord, Monday.com, IDEO, Orange Theory Fitness, TED, and Dropbox. \r\n\r\nWebflow is backed by Y Combinator, Accel, CapitalG, Silversmith, and other awesome investors.",
    "name": "Webflow",
    "one_liner": "Professional website design and publishing platform. ",
    "slug": "webflow",
    "status": "Active",
    "subindustry": "B2B -> Marketing",
    "tags": [
      "SaaS",
      "Design",
      "Marketing"
    ],
    "team_size": 600,
    "top_company": true,
    "website": "https://webflow.com",
    "yc_url": "https://www.ycombinator.com/companies/webflow"
  },
  {
    "batch": "Winter 2014",
    "id": 580,
    "industries": [
      "Consumer",
      "Consumer Electronics"
    ],
    "industry": "Consumer",
    "is_hiring": false,
    "launched_at": 1384978624,
    "location": "San Francisco, CA, USA",
    "logo_url": "https://bookface-images.s3.amazonaws.com/small_logos/ed160215b7a30dc30384bfcf6e726bac65688aff.png",
    "long_description": "Founded in 2014, Bellabeat is a data-centered wellness femtech company behind some of the most fashionably designed tech-powered wellness products and one of the fastest-growing wellness subscription services for women. Throughout the years, Bellabeat built the go-to wellness brand with a compelling ecosystem of solutions and services focused on women’s health. The success of the Leaf and Ivy wearables enabled the brand to expand to international markets and kickstart industry discussions on the importance of innovating in the design and development of tech products. Today, Bellabeat is leading the market shift with hyper-personalized holistic wellness offerings aligned with a women’s menstrual cycle. ",
    "name": "Bellabeat",
    "one_liner": "Tech-powered women's wellness.",
    "slug": "bellabeat",
    "status": "Active",
    "subindustry": "Consumer -> Consumer Electronics",
    "tags": [
      "Fitness",
      "Health & Wellness",
      "Femtech"
    ],
    "team_size": 134,
    "top_company": true,
    "website": "http://bellabeat.com",
    "yc_url": "https://www.ycombinator.com/companies/bellabeat"
  },
  {
    "batch": "Winter 2014",
    "id": 595,
    "industries": [
      "B2B",
      "Supply Chain and Logistics"
    ],
    "industry": "B2B",
    "is_hiring": true,
    "launched_at": 1384978752,
    "location": "San Francisco, CA, USA",
    "logo_url": "https://bookface-images.s3.amazonaws.com/small_logos/54997aad4067ac1994f422a49a5473fa603f5354.png",
    "long_description": "Founded in 2013, we believe trade can move the human race forward. That’s why our mission at Flexport is to make global trade easy for everyone.\r\n\r\nWhat the internet has done for bits and bytes, Flexport is doing for physical goods: giving every business the ability to connect to any customer, wherever they are in the world. That sounds pretty straightforward, but a fragmented and inefficient global supply chain has held the world back from untapped growth and innovation. By connecting everyone in the global economy we can unlock commerce, creativity, and human progress.\r\n\r\nTo do so, we’re building the platform for global logistics—empowering buyers, sellers and their logistics partners with the technology and services they need to grow and innovate. \r\nToday, we work with more than 40,000 customers and their suppliers across industries like manufacturing, retail, electronics, consumer goods, tech, apparel, and beauty. Companies of all sizes—from emerging brands to Fortune 500s—used Flexport technology to move nearly $19B of merchandise across 112 countries in 2021.\r\n\r\nInterested in joining our team? Check out our open job postings on careers site and apply directly today! https://www.flexport.com/careers/jobs/ ",
    "name": "Flexport",
    "one_liner": "Platform for global logistics.",
    "slug": "flexport",
    "status": "Active",
    "subindustry": "B2B -> Supply Chain and Logistics",
    "tags": [
      "SaaS",
      "Logistics",
      "Supply Chain"
    ],
    "team_size": 3000,
    "top_company": true,
    "website": "https://www.flexport.com/careers/jobs/",
    "yc_url": "https://www.ycombinator.com/companies/flexport"
  },
  {
    "batch": "Winter 2014",
    "id": 630,
    "industries": [
      "B2B",
      "Office Management"
    ],
    "industry": "B2B",
    "is_hiring": false,
    "launched_at": 1384979087,
    "location": "Lehi, UT, USA",
    "logo_url": "https://bookface-images.s3.amazonaws.com/small_logos/5d33fe7ddb69049aa965ac936b584f1efc32afd2.png",
    "long_description": "As the pace of innovation continues, it is growing more difficult to see the value of technology. Often meaningful information is inaccessible at the time it would be most beneficial. Weave threads together data, software and communication platforms to build stronger relationships at the point of contact by making valuable information instantly available in simple and intuitive formats. This delivers improved productivity, better collaboration and greater insights making it easier to meet the needs of patients and to build better business and clinical outcomes.",
    "name": "Weave",
    "one_liner": "Customer communication and payments platform.",
    "slug": "weave",
    "status": "Public",
    "subindustry": "B2B -> Office Management",
    "tags": [
      "SaaS"
    ],
    "team_size": 600,
    "top_company": true,
    "website": "http://getweave.com",
    "yc_url": "https://www.ycombinator.com/companies/weave"
  },
  {
    "batch": "Winter 2014",
    "id": 636,
    "industries": [
      "B2B",
      "Engineering, Product and Design"
    ],
    "industry": "B2B",
    "is_hiring": true,
    "launched_at": 1384980277,
    "location": "San Francisco, CA, USA; Paris, Île-de-France, France",
    "logo_url": "https://bookface-images.s3.amazonaws.com/small_logos/3957efb32806e40351fb432ce3c38ae6d22865b3.png",
    "long_description": "Our mission is to make every search interaction meaningful & rewarding, through developer-friendly and enterprise-grade APIs.\r\n\r\nAlgolia is the leading Search & Discovery API for websites and mobile apps. We help the most innovative companies across e-commerce, media and SaaS industries create powerful, relevant and scalable discovery experiences for their users. Unlike other solutions, our hosted platform reduces the complexities of building and scaling a fast, relevant digital experience and helps teams accelerate development time. More than 9,000 companies like Under Armour, Twitch, Periscope, Medium and Stripe rely on Algolia to manage 50+ billion search queries a month.\r\n\r\nFounded in 2012, we're backed by $184M in funding from Accel Partners, Alven Capital, Point Nine Capital and Storm Ventures. The team is headquartered in San Francisco with offices in Paris, London, New York, and Atlanta. To learn more, visit www.algolia.com.\r\n\r\n---\r\nWe’re looking for talented, passionate people to build the world’s best search technology. As an ownership-driven company, we seek team members who thrive under autonomy and diversity. \r\n\r\nWe're committed to building an inclusive and diverse workplace. We care about each other and the world around us, and embrace talented people regardless of their race, age, ancestry, religion, sex, gender identity, sexual orientation, marital status, color, veteran status, disability and socioeconomic background",
    "name": "Algolia",
    "one_liner": "A developer-friendly and enterprise-grade search API.",
    "slug": "algolia",
    "status": "Active",
    "subindustry": "B2B -> Engineering, Product and Design",
    "tags": [
      "Developer Tools",
      "SaaS",
      "B2B"
    ],
    "team_size": 810,
    "top_company": true,
    "website": "http://www.algolia.com",
    "yc_url": "https://www.ycombinator.com/companies/algolia"
  },
  {
    "batch": "Summer 2014",
    "id": 662,
    "industries": [
      "B2B",
      "Human Resources"
    ],
    "industry": "B2B",
    "is_hiring": true,
    "launched_at": 1398907661,
    "location": "San Francisco, CA, USA",
    "logo_url": "https://bookface-images.s3.amazonaws.com/small_logos/211825b572def7bbe7c182d84f166129bc978b6b.png",
    "long_description": "Checkr builds people infrastructure for the future of work. And we believe everyone should have a fair chance to work. That's why we've designed a faster—and fairer—way to screen job seekers. For more information on our mission and products, visit https://checkr.com.",
    "name": "Checkr",
    "one_liner": "People infrastructure for the future of work",
    "slug": "checkr",
    "status": "Active",
    "subindustry": "B2B -> Human Resources",
    "tags": [
      "Artificial Intelligence",
      "Compliance",
      "HR Tech",
      "API",
      "Enterprise Software"
    ],
    "team_size": 800,
    "top_company": true,
    "website": "http://www.checkr.com",
    "yc_url": "https://www.ycombinator.com/companies/checkr"
  },
  {
    "batch": "Summer 2014",
    "id": 700,
    "industries": [
      "Industrials",
      "Manufacturing and Robotics"
    ],
    "industry": "Industrials",
    "is_hiring": false,
    "launched_at": 1398907961,
    "location": "San Francisco, CA, USA",
    "logo_url": "https://bookface-images.s3.amazonaws.com/small_logos/d917bc9763d052f49ea938f71c94205dabf1ec83.png",
    "long_description": "Rigetti Computing is building the world’s most powerful computers to help solve humanity’s most pressing and important problems. These systems will perform computations that today’s fastest supercomputers are incapable of — unlocking entirely new classes of problems and offering a direct path to solutions. We are scientists, engineers, builders, and visionaries. We believe quantum computing is going to significantly affect health care, how we treat disease, how we generate energy, and how we feed humanity. Rigetti is the only company deploying full-stack solutions for hybrid classical/quantum computing. Our 19-qubit quantum computer is available online through our Forest platform, and the first commercially useful applications are already under exploration.\r\n\r\nWe were founded in 2013 by Chad Rigetti, and are located Berkeley and Fremont, California.",
    "name": "Rigetti Computing",
    "one_liner": "Quantum coherent supercomputing.",
    "slug": "rigetti-computing",
    "status": "Public",
    "subindustry": "Industrials -> Manufacturing and Robotics",
    "tags": [
      "Quantum Computing"
    ],
    "team_size": 51,
    "top_company": true,
    "website": "http://rigetti.com",
    "yc_url": "https://www.ycombinator.com/companies/rigetti-computing"
  },
  {
    "batch": "Summer 2014",
    "id": 705,
    "industries": [
      "B2B",
      "Supply Chain and Logistics"
    ],
    "industry": "B2B",
    "is_hiring": true,
    "launched_at": 1398907999,
    "location": "Chicago, IL, USA",
    "logo_url": "https://bookface-images.s3.amazonaws.com/small_logos/a7fe6af4f0d7680132345ae356f0c1abe1939e2a.png",
    "long_description": "ShipBob is a leading global fulfillment and supply chain platform designed for SMB and Mid-Market ecommerce brands. ShipBob provides brands a single view of their business and customers across sales channels to manage products, inventory, orders, and shipments, leveraging real-time analytics and reporting, dedicated support, and access to hundreds of technology and retail partners. ShipBob enables brands to improve the operations in their own facilities with ShipBob WMS (ShipBob's proprietary warehouse management system), and/or outsource fulfillment to have their orders picked, packed, and shipped from any of ShipBob’s 50+ fulfillment centers across the United States, Canada, Europe, and Australia. Founded in 2014, ShipBob launched through Y Combinator by co-founders Dhruv Saxena and Divey Gulati, two ecommerce entrepreneurs who saw a need for more efficient SMB supply chain services. Learn more by visiting shipbob.com. ",
    "name": "ShipBob",
    "one_liner": "Providing Amazon level logistics to e-commerce businesses. ",
    "slug": "shipbob",
    "status": "Active",
    "subindustry": "B2B -> Supply Chain and Logistics",
    "tags": [
      "Logistics",
      "E-commerce"
    ],
    "team_size": 1,
    "top_company": true,
    "website": "http://shipbob.com",
    "yc_url": "https://www.ycombinator.com/companies/shipbob"
  },
  {
    "batch": "Summer 2014",
    "id": 729,
    "industries": [
      "Healthcare",
      "Industrial Bio"
    ],
    "industry": "Healthcare",
    "is_hiring": true,
    "launched_at": 1400927505,
    "location": "Boston, MA, USA",
    "logo_url": "https://bookface-images.s3.amazonaws.com/small_logos/d8427e9e647b115fc9f1f760c7a1324f1d2c02ef.png",
    "long_description": "Ginkgo Bioworks is the organism company. We design custom organisms for customers across multiple markets. We build our foundries to scale the process of organism engineering using software and hardware automation. Organism engineers at Ginkgo learn from nature to develop new organisms that replace technology with biology.",
    "name": "Ginkgo Bioworks",
    "one_liner": "Our mission is to make biology easier to engineer.",
    "slug": "ginkgo-bioworks",
    "status": "Public",
    "subindustry": "Healthcare -> Industrial Bio",
    "tags": [
      "Synthetic Biology",
      "Diagnostics",
      "Automation"
    ],
    "team_size": 641,
    "top_company": true,
    "website": "http://ginkgobioworks.com",
    "yc_url": "https://www.ycombinator.com/companies/ginkgo-bioworks"
  },
  {
    "batch": "Summer 2014",
    "id": 731,
    "industries": [
      "Industrials",
      "Energy"
    ],
    "industry": "Industrials",
    "is_hiring": false,
    "launched_at": 1400930834,
    "location": "San Francisco, CA, USA; Sunnyvale, CA, USA",
    "logo_url": "https://bookface-images.s3.amazonaws.com/small_logos/7296c0e632938afdac098d754da89730bfc674b7.png",
    "long_description": "About Oklo Inc.: \r\n\r\nOklo Inc. (Oklo) is developing advanced fission power plants to provide emission-free, reliable, and affordable energy. \r\n\r\nOklo received a Site Use Permit from the U.S Department of Energy, has performed successful prototypic fuel fabrication, was awarded fuel material from Idaho National Laboratory, developed the first advanced fission combined license application accepted and docketed by the U.S. Nuclear Regulatory Commission, and is developing advanced fuel recycling technologies in collaboration with the U.S. Department of Energy and national laboratories.\r\n\r\nOklo has been featured in Time, Newsweek, Wall Street Journal, CNBC, Popular Mechanics, Wired, Architectural Digest, Hyperallergic, POWER Magazine, has been the subject of a Harvard Business School case, and is featured in the Oliver Stone documentary Nuclear, among other features.",
    "name": "Oklo",
    "one_liner": "Emission free, always on power from advanced fission power plants.",
    "slug": "oklo",
    "status": "Public",
    "subindustry": "Industrials -> Energy",
    "tags": [
      "Small Modular Reactors",
      "Climate"
    ],
    "team_size": 50,
    "top_company": true,
    "website": "http://oklo.com",
    "yc_url": "https://www.ycombinator.com/companies/oklo"
  },
  {
    "batch": "Winter 2015",
    "id": 767,
    "industries": [
      "B2B",
      "Supply Chain and Logistics"
    ],
    "industry": "B2B",
    "is_hiring": false,
    "launched_at": 1416220249,
    "location": "San Francisco, CA, USA",
    "logo_url": "https://bookface-images.s3.amazonaws.com/small_logos/a10cd6dd027a6f9927f0c0574be6404d3ed0c014.png",
    "long_description": "GrubMarket is the AI-powered technology enabler and digital transformer of American Food Supply Chain industry. Our mission is to build and provide the eCommerce and software technologies to this industry, to transform this completely offline and highly manual industry into modernized online industry powered by software technologies, and improve the efficiency of American food supply chain.\r\n",
    "name": "GrubMarket",
    "one_liner": "AI-powered technology enabler and digital transformer of American…",
    "slug": "grubmarket",
    "status": "Active",
    "subindustry": "B2B -> Supply Chain and Logistics",
    "tags": [
      "E-commerce",
      "Supply Chain",
      "Food Tech",
      "Agriculture"
    ],
    "team_size": 4548,
    "top_company": true,
    "website": "http://grubmarket.com",
    "yc_url": "https://www.ycombinator.com/companies/grubmarket"
  },
  {
    "batch": "Winter 2015",
    "id": 809,
    "industries": [
      "Real Estate and Construction",
      "Construction"
    ],
    "industry": "Real Estate and Construction",
    "is_hiring": true,
    "launched_at": 1416306934,
    "location": "Columbia, MO, USA",
    "logo_url": "https://bookface-images.s3.amazonaws.com/small_logos/ad05853522c217d92c372ba8883ff6b45dd83d99.png",
    "long_description": "EquipmentShare delivers cloud solutions for the construction industry. We provide a better equipment rental experience, fleet tracking software and hardware security solutions to help contractors work smarter. ",
    "name": "EquipmentShare",
    "one_liner": "Cloud solutions for the construction industry.",
    "slug": "equipmentshare",
    "status": "Public",
    "subindustry": "Real Estate and Construction -> Construction",
    "tags": [
      "Construction"
    ],
    "team_size": 5400,
    "top_company": true,
    "website": "https://www.equipmentshare.com",
    "yc_url": "https://www.ycombinator.com/companies/equipmentshare"
  },
  {
    "batch": "Winter 2015",
    "id": 810,
    "industries": [
      "B2B",
      "Engineering, Product and Design"
    ],
    "industry": "B2B",
    "is_hiring": false,
    "launched_at": 1416307238,
    "location": "San Francisco, CA, USA; Remote",
    "logo_url": "https://bookface-images.s3.amazonaws.com/small_logos/af0d32f65e9007b7edbde422787633e338fa9bff.png",
    "long_description": "GitLab is the first single application for the entire DevOps lifecycle. Only GitLab enables Concurrent DevOps, unlocking organizations from the constraints of today’s toolchain. GitLab provides unmatched visibility, radical new levels of efficiency and comprehensive governance to significantly compress the time between planning a change and monitoring its effect. This makes the software lifecycle 200% faster, radically improving the speed of business.\r\n\r\nGitLab and Concurrent DevOps collapses cycle times by driving higher efficiency across all stages of the software development lifecycle. For the first time, Product, Development, QA, Security, and Operations teams can work concurrently in a single application. There’s no need to integrate and synchronize tools, or waste time waiting for handoffs. Everyone contributes to a single conversation, instead of managing multiple threads across disparate tools. And only GitLab gives teams complete visibility across the lifecycle with a single, trusted source of data to simplify troubleshooting and drive accountability. All activity is governed by consistent controls, making security and compliance first-class citizens instead of an afterthought.\r\n\r\nBuilt on Open Source, GitLab leverages the community contributions of thousands of developers and millions of users to continuously deliver new DevOps innovations. More than 100,000 organizations from startups to global enterprise organizations, including Ticketmaster, Jaguar Land Rover, NASDAQ, Dish Network and Comcast trust GitLab to deliver great software at new speeds.",
    "name": "GitLab",
    "one_liner": "A complete DevOps platform delivered as a single application.",
    "slug": "gitlab",
    "status": "Public",
    "subindustry": "B2B -> Engineering, Product and Design",
    "tags": [
      "Developer Tools",
      "DevSecOps",
      "Open Source"
    ],
    "team_size": 2000,
    "top_company": true,
    "website": "http://gitlab.com/",
    "yc_url": "https://www.ycombinator.com/companies/gitlab"
  },
  {
    "batch": "Winter 2015",
    "id": 827,
    "industries": [
      "Fintech",
      "Payments"
    ],
    "industry": "Fintech",
    "is_hiring": true,
    "launched_at": 1416309883,
    "location": "Bengaluru, KA, India",
    "logo_url": "https://bookface-images.s3.amazonaws.com/small_logos/b6a6aaf9a84fa4b7ddb53cabda7443c142a5a154.png",
    "long_description": "The journey of building Razorpay started in 2014, when Harshil Mathur (CEO & Co-Founder) and Shashank Kumar (MD & Co-Founder) witnessed the dismal state of the online payments industry in India then and understood that they have a larger and more important issue to solve. And That was democratizing online payments for Indian businesses, particularly the underserved market, Startups and SMEs. Over the last 9 years, Razorpay has evolved from a single-product company to a multi-product company, from an online payment gateway to India’s only full-stack financial solutions company, offering payments and banking solutions to businesses.  Razorpay today is transforming age-old complexities and changing every known paradigm of money movement for disruptive businesses.\r\n\r\nOver the last couple of years, Razorpay’s growth has evolved to be an index of India’s digital economy. From a kirana shop in Kashmir collecting payments on our POS device to a textile exporter in Kanyakumari accepting dollars through our International Payments product, Razorpay has revolutionised how businesses have traditionally transacted and interacted with money. \r\n\r\nRazorpay became the first and only Indian fintech to build a full-stack international Payment Gateway ‘Curlec by Razorpay’ and evolved into a comprehensive provider of payment solutions, leveraging the synergy between cutting-edge technological capabilities and a profound understanding of the local payment ecosystem. The introduction of the new Curlec Payment Gateway aims to cater to a wide spectrum of businesses, expanding its reach to over 5,000 establishments. \r\n\r\nBe it for international expansion or solving for Indian businesses, for Razorpay, the customer has always been at the core of all disruption, from addressing evolving needs to delivering new solutions. This hyperfocus helped bring Razorpay’s several industry-first innovations into the market since 2014. Razorpay became the first to launch a completely digital on-boarding process for startups, first to launch support for UPI, first to launch support for Bharath QR, first to introduce recurring payments for businesses through Razorpay Route, automating payment receipts and later automate payouts and making the entire process seamless and optimized and many more were introduced aling the way. Other firsts include: - First to launch India’s Multi-Network Tokenisation solution, TokenHQ - Razorpay became India’s first payment gateway to support credit cards on UPI - Razorpay also became India’s largest omnichannel payment gateway for businesses post acquiring Ezetap which is India’s leading offline POS company that was founded with the aim to simplify the in-person offline payments experience.\r\n\r\nOver the years, Razorpay’s valuation has jumped from $1 billion to $7.5 billion and has added a host of marquee investors to its captable. Razorpay is also the second Indian company to be a part of Silicon Valley’s largest tech accelerator, Y Combinator. Marquee investors such as Lone Pine Capital, Alkeon Capital, TCV, GIC, Tiger Global, Sequoia Capital India, Ribbit Capital, Matrix Partners, Salesforce Ventures, Y Combinator, and MasterCard have invested a total of $741.5 Mn through Series A, B, C, D, E and F funding. The last financing round of Series F led the company’s valuation to $7.5 Billion signaling one of the fastest increases in valuation for an Indian Unicorn. \r\n\r\nRazorpay has also made acquisitions with like-minded companies over the last 9 years. In total, till date, Razorpay has made eight acquisitions, Billme in 2023 - A Digital invoice and customer Engagement, Ezetap in 2022 - India’s leading offline POS company, PoshVine in 2022 - India’s leading loyalty and reward management platform, IZealiant in 2022 - A mobile-first, API-enabled, and cloud-ready payment solution and made its first international foray in South-East Asia by announcing its acquisition of Curlec in 2022 - A recurring payments platform. TeraFin Labs in 2021 - the AI-based SaaS platform that facilitates digital financing solutions, Opfin (Now RazorpayX Payroll) in 2019 -  The payroll management solution and Thirdwatch in 2019, the first acquisition - The AI-powered fraud detection platform.\r\n\r\nAll these efforts are being done in collaboration with banks, regulators, and stakeholders so that India can build a better place for small and big businesses. Today, Razorpay powers online payments for 76 Of 100 startup unicorns and millions of businesses in India. The core premise of what Razorpay was founded in 2014 and what it is today hasn’t changed. It is to make money movement simpler and easier, whether it is for businesses to receive money, send money, or manage money. \r\n\r\n",
    "name": "Razorpay",
    "one_liner": "India's only full-stack financial solutions company for businesses.",
    "slug": "razorpay",
    "status": "Active",
    "subindustry": "Fintech -> Payments",
    "tags": [
      "Banking as a Service",
      "Fintech",
      "Payments",
      "India"
    ],
    "team_size": 2700,
    "top_company": true,
    "website": "https://razorpay.com",
    "yc_url": "https://www.ycombinator.com/companies/razorpay"
  },
  {
    "batch": "Summer 2015",
    "id": 934,
    "industries": [
      "Consumer",
      "Apparel and Cosmetics"
    ],
    "industry": "Consumer",
    "is_hiring": false,
    "launched_at": 1430156130,
    "location": "New York City, NY, USA; New York, NY, USA; Remote",
    "logo_url": "https://bookface-images.s3.amazonaws.com/small_logos/ed2169123442c921e8a4af29191c3b42cd5e18f3.png",
    "long_description": "Scentbird inspires fragrance lovers to go beyond the ordinary and sample scents that evoke passion, confidence, and the unknown. \r\n\r\nOur mission is to revolutionize the way individuals perfume by bringing the ultimate fragrance playground right to their fingertips. By way of a monthly subscription service (starting at $14.95 a month), members can choose from over 500+ designer colognes and perfumes each month!\r\n\r\nSee what we're all about at: www.Scentbird.com // @Scentbird\r\n*WE'RE HIRING!: https://www.scentbird.com/careers",
    "name": "Scentbird",
    "one_liner": "Scentbird is a luxury fragrance subscription service.",
    "slug": "scentbird",
    "status": "Active",
    "subindustry": "Consumer -> Apparel and Cosmetics",
    "tags": [],
    "team_size": 165,
    "top_company": true,
    "website": "https://www.scentbird.com",
    "yc_url": "https://www.ycombinator.com/companies/scentbird"
  },
  {
    "batch": "Summer 2015",
    "id": 944,
    "industries": [
      "B2B",
      "Human Resources"
    ],
    "industry": "B2B",
    "is_hiring": true,
    "launched_at": 1430202917,
    "location": "Brisbane, QLD, Australia; San Francisco, CA, USA",
    "logo_url": "https://bookface-images.s3.amazonaws.com/small_logos/e1004ce910aafa76388e32ce5e89e431e2a22211.png",
    "long_description": "In today’s environment, employees need training to ensure business compliance, skill development and to support an engaged workforce. Go1 brings together content from the world’s top training providers and makes it easy to access in whichever platform your organization uses. This makes it easier to deliver, manage and engage with training. Go1 also works with existing LMS, HRIS, and business systems to make learning simpler and more effective.",
    "name": "Go1",
    "one_liner": "A learning platform that enables you to train your staff or customers.",
    "slug": "go1",
    "status": "Active",
    "subindustry": "B2B -> Human Resources",
    "tags": [
      "eLearning"
    ],
    "team_size": 650,
    "top_company": true,
    "website": "https://go1.com",
    "yc_url": "https://www.ycombinator.com/companies/go1"
  },
  {
    "batch": "Winter 2016",
    "id": 1005,
    "industries": [
      "Fintech",
      "Consumer Finance"
    ],
    "industry": "Fintech",
    "is_hiring": false,
    "launched_at": 1447311015,
    "location": "Silver Spring, MD, USA",
    "logo_url": "https://bookface-images.s3.amazonaws.com/small_logos/fae52e07d79df342dcfc28d120038d2083ae0679.png",
    "long_description": "Rocket Money (formerly Truebill) is a leading personal finance app that analyzes members' spending habits, identifies inefficiencies, and offers immediate methods to improve their financial health. It enables people to optimize their spending, manage subscriptions, lower their bills, and automatically set aside money to reach their savings goals. Truebill has saved members more than $100 million since 2016 and is headquartered in Silver Spring, Maryland, with offices in San Francisco. \r\n\r\nTruebill's mission is to empower people to live their best financial lives. Truebill offers members a unique understanding of their finances and a suite of valuable services that save them time and money - ultimately giving them a leg up on their financial journey. \r\n\r\nTruebill is backed by Accel, Bessemer Venture Partners, Eldridge Industries, and YCombinator.",
    "name": "Truebill",
    "one_liner": "Live your best financial life",
    "slug": "truebill",
    "status": "Acquired",
    "subindustry": "Fintech -> Consumer Finance",
    "tags": [
      "Fintech"
    ],
    "team_size": 225,
    "top_company": true,
    "website": "https://www.truebill.com",
    "yc_url": "https://www.ycombinator.com/companies/truebill"
  },
  {
    "batch": "Winter 2016",
    "id": 1021,
    "industries": [
      "Fintech",
      "Payments"
    ],
    "industry": "Fintech",
    "is_hiring": false,
    "launched_at": 1447312815,
    "location": "Lagos, LA, Nigeria; LA, Nigeria",
    "logo_url": "https://bookface-images.s3.amazonaws.com/small_logos/8f4d18618abc91ad79be53d918a199daffad6f58.png",
    "long_description": "Paystack is a small and vibrant family working across Lagos and San Francisco.\r\n\r\nWe enable businesses to accept payments via credit card, debit card, money transfer, and mobile money, directly from their website or mobile app.",
    "name": "Paystack",
    "one_liner": "Modern payments infrastructure for Africa",
    "slug": "paystack",
    "status": "Acquired",
    "subindustry": "Fintech -> Payments",
    "tags": [
      "Fintech"
    ],
    "team_size": 115,
    "top_company": true,
    "website": "https://www.paystack.com",
    "yc_url": "https://www.ycombinator.com/companies/paystack"
  },
  {
    "batch": "Winter 2016",
    "id": 1042,
    "industries": [
      "B2B",
      "Retail"
    ],
    "industry": "B2B",
    "is_hiring": true,
    "launched_at": 1447568415,
    "location": "Lehi, UT, USA",
    "logo_url": "https://bookface-images.s3.amazonaws.com/small_logos/d90bc164db5dd25a81e6dcfa222470eadf2c783a.png",
    "long_description": "Podium is the all-in-one AI-powered lead management and communication platform used by more than 100,000 businesses to acquire and convert new customers. At the forefront of Podium’s innovation is its AI employee, who ensures businesses respond to leads instantly, anytime of the day or night—significantly increasing lead conversion rates and revenue.\r\nPodium helps businesses obtain more reviews, rank higher on Google, and consolidate lead channels. Businesses can call and text customers from the web and/or mobile app, send payment links, drive repeat business through bulk messages, and more—all managed and delivered from one easy-to-use dashboard. Additionally, with Podium’s AI Employee and automations, businesses can efficiently handle customer inquiries seamlessly across all communication channels, providing timely and accurate responses that drive sales.\r\nPodium’s innovative work has gained recognition on top industry lists, such as Forbes’ Next Billion Dollar Startups, Forbes’ Cloud 100, the Inc. 5000, and Fast Company’s World’s Most Innovative Companies.\r\nPodium was founded in 2014 and is headquartered in Lehi, Utah. It is currently backed by Accel, Summit Partners, GV (formerly Google Ventures), and Y Combinator.",
    "name": "Podium",
    "one_liner": "Get more leads. Make more money. ",
    "slug": "podium",
    "status": "Active",
    "subindustry": "B2B -> Retail",
    "tags": [
      "Fintech",
      "SaaS",
      "B2B",
      "AI"
    ],
    "team_size": 1000,
    "top_company": true,
    "website": "https://podium.com",
    "yc_url": "https://www.ycombinator.com/companies/podium"
  },
  {
    "batch": "Winter 2016",
    "id": 1058,
    "industries": [
      "B2B",
      "Retail"
    ],
    "industry": "B2B",
    "is_hiring": false,
    "launched_at": 1447654816,
    "location": "",
    "logo_url": "https://bookface-images.s3.amazonaws.com/small_logos/45034c22d81491a4e49c2c46c3c822d2d820941d.png",
    "long_description": "Caper focuses on compacting Amazon-Go's technology (image recognition, sensor fusion and artificial intelligence) into a smart shopping cart, allowing each shopper to throw her groceries into the cart and self-checkout without cashiers. The technology is looking to fundamentally transform physical retail and rapidly scale into existing grocery stores.",
    "name": "Caper",
    "one_liner": "Plug-and-play cashier-less retail powered by computer vision and AI",
    "slug": "caper",
    "status": "Acquired",
    "subindustry": "B2B -> Retail",
    "tags": [
      "Artificial Intelligence",
      "Cashierless Checkout",
      "Computer Vision",
      "Retail Tech"
    ],
    "team_size": 15,
    "top_company": true,
    "website": "https://www.caper.ai/",
    "yc_url": "https://www.ycombinator.com/companies/caper"
  },
  {
    "batch": "Winter 2016",
    "id": 1067,
    "industries": [
      "Healthcare",
      "Consumer Health and Wellness"
    ],
    "industry": "Healthcare",
    "is_hiring": false,
    "launched_at": 1447747516,
    "location": "New York City, NY, USA; San Francisco, CA, USA",
    "logo_url": "https://bookface-images.s3.amazonaws.com/small_logos/e30eef55b4ffb18884d227d20476b264b3388dd6.png",
    "long_description": "Nurx is a telemedicine startup focused on increasing access to healthcare, starting with birth control and PrEP services.",
    "name": "NURX",
    "one_liner": "Medicine or testing kit, prescribed online and delivered to your door.",
    "slug": "nurx",
    "status": "Acquired",
    "subindustry": "Healthcare -> Consumer Health and Wellness",
    "tags": [
      "Consumer Health Services"
    ],
    "team_size": 300,
    "top_company": true,
    "website": "https://www.nurx.com/",
    "yc_url": "https://www.ycombinator.com/companies/nurx"
  },
  {
    "batch": "Winter 2016",
    "id": 1103,
    "industries": [
      "Consumer",
      "Food and Beverage"
    ],
    "industry": "Consumer",
    "is_hiring": true,
    "launched_at": 1453256409,
    "location": "Bogotá, Bogota, Colombia",
    "logo_url": "https://bookface-images.s3.amazonaws.com/small_logos/44285cf605c3f1d288f2fb7c2f002f859ab92d0b.png",
    "long_description": "Rappi is a mega high growth, Series B, consumer tech StartUp looking to be the everything store of Latin America. We are a marketplace that connects users who want to purchase prepared foods, groceries, clothes, and more with contractors who fulfil them. Think of Rappi as a Doordarsh meets Delivery meets Instacart. We are venture backed by top VCs in the world including Sequoia, DST, Andreessen Horrowitz and YCombinator. Management consultant skills are highly valued and one of the founders and three of the company's top leaders are former top tier management consultants. We are across Argentina, Brasil, Mexico, Colombia and are aggressively growing in these markets and all throughout LatAm.",
    "name": "Rappi",
    "one_liner": "On-demand delivery and financial services for Latin America.",
    "slug": "rappi",
    "status": "Active",
    "subindustry": "Consumer -> Food and Beverage",
    "tags": [
      "Fintech",
      "Delivery",
      "Latin America"
    ],
    "team_size": 4800,
    "top_company": true,
    "website": "http://www.rappi.com",
    "yc_url": "https://www.ycombinator.com/companies/rappi"
  },
  {
    "batch": "Summer 2016",
    "id": 1266,
    "industries": [
      "B2B",
      "Retail"
    ],
    "industry": "B2B",
    "is_hiring": true,
    "launched_at": 1461732013,
    "location": "Bengaluru, KA, India",
    "logo_url": "https://bookface-images.s3.amazonaws.com/small_logos/2e219c412cfa3b69bc5211d8d7473cf06bfe6593.png",
    "long_description": "Meesho is India’s only true online marketplace, altering the status quo to make e-commerce inclusive and accessible for the next billion users. With a vision to enable 100 million small businesses, including individual entrepreneurs, to succeed online, Meesho is democratising internet commerce and bringing a range of products and new customers online. The Meesho marketplace provides sellers access to millions of customers, selections from over 30 categories, pan-India logistics, payment services and customer support capabilities to efficiently run their businesses. \r\n\r\n",
    "name": "Meesho",
    "one_liner": "Democratizing internet commerce for everyone in India",
    "slug": "meesho",
    "status": "Public",
    "subindustry": "B2B -> Retail",
    "tags": [
      "E-commerce",
      "Retail"
    ],
    "team_size": 1450,
    "top_company": true,
    "website": "http://www.meesho.com",
    "yc_url": "https://www.ycombinator.com/companies/meesho"
  },
  {
    "batch": "Summer 2016",
    "id": 1270,
    "industries": [
      "Consumer",
      "Content"
    ],
    "industry": "Consumer",
    "is_hiring": false,
    "launched_at": 1461732014,
    "location": "San Francisco, CA, USA",
    "logo_url": "https://bookface-images.s3.amazonaws.com/small_logos/7f6b19c9a7bb7ba979f8935bcd2e5bd32b954069.png",
    "long_description": "The Athletic is a direct-to-consumer digital sports media company committed to helping subscribers experience storytelling in a whole new way. Founded in 2016 and headquartered in San Francisco, The Athletic has over 600 full-time employees and covers more than 250 professional sports and collegiate teams in the US, Canada and the UK. The Athletic’s newsroom has produced thousands of in-depth articles along with more than 120 podcasts and premium video content. The Athletic is a remote-friendly company as we have offices in San Francisco, Los Angeles, London, and Melbourne.",
    "name": "The Athletic",
    "one_liner": "Subscription sports media.",
    "slug": "the-athletic",
    "status": "Acquired",
    "subindustry": "Consumer -> Content",
    "tags": [
      "Media"
    ],
    "team_size": 600,
    "top_company": true,
    "website": "https://theathletic.com",
    "yc_url": "https://www.ycombinator.com/companies/the-athletic"
  },
  {
    "batch": "Summer 2016",
    "id": 1294,
    "industries": [
      "B2B",
      "Engineering, Product and Design"
    ],
    "industry": "B2B",
    "is_hiring": true,
    "launched_at": 1461817215,
    "location": "San Francisco, CA, USA",
    "logo_url": "https://bookface-images.s3.amazonaws.com/small_logos/8c45a78eb56f4a95e41a3a77960b00fdfb4cd918.png",
    "long_description": "Scale accelerates the development of AI within organizations of any size to deliver critical business insights and operational efficiency. Its data-centric infrastructure platform leverages RLHF (Reinforced Learning with Human Feedback) to help organizations build the strongest AI models that supercharge their business, with customers across industries including Meta, Microsoft, U.S. Army, DoD’s Defense Innovation Unit, Open AI, General Motors, Toyota Research Institute, Brex, Instacart and Flexport.",
    "name": "Scale AI",
    "one_liner": "Data-centric infrastructure to accelerate the development of AI ",
    "slug": "scale-ai",
    "status": "Active",
    "subindustry": "B2B -> Engineering, Product and Design",
    "tags": [
      "Artificial Intelligence",
      "Machine Learning"
    ],
    "team_size": 500,
    "top_company": true,
    "website": "http://scale.com",
    "yc_url": "https://www.ycombinator.com/companies/scale-ai"
  },
  {
    "batch": "Summer 2016",
    "id": 1433,
    "industries": [
      "B2B",
      "Engineering, Product and Design"
    ],
    "industry": "B2B",
    "is_hiring": false,
    "launched_at": 1465405816,
    "location": "Amsterdam, NH, Netherlands",
    "logo_url": "https://bookface-images.s3.amazonaws.com/small_logos/bdee5b69dd38909ad07702b3aebc29f8d5880658.png",
    "long_description": "The world’s largest omnichannel communications platform.\r\n \r\nBird CRM powers communication between businesses and their customers — across any channel, always with the right context, and on every corner of the planet. Its products and solutions are the foundational building blocks to business communications across preferred channels, like SMS, Voice, WhatsApp, WeChat, Messenger, Email and more. Founded in 2011, Bird connects to billions of devices and is trusted by nearly 20,000 customers worldwide.\r\n \r\nHeadquartered in Amsterdam, Bird operates across nine global hubs — including Singapore, Dublin, Shanghai, Sydney, London, Bogota and Asuncion — and is proud to be a “Work Anywhere” company. Its team of 500 employees represent more than 55 nationalities.",
    "name": "Bird",
    "one_liner": "The world’s largest omnichannel communications platform",
    "slug": "bird",
    "status": "Active",
    "subindustry": "B2B -> Engineering, Product and Design",
    "tags": [
      "Messaging",
      "API"
    ],
    "team_size": 500,
    "top_company": true,
    "website": "http://bird.com",
    "yc_url": "https://www.ycombinator.com/companies/bird"
  },
  {
    "batch": "Winter 2017",
    "id": 1451,
    "industries": [
      "B2B",
      "Human Resources"
    ],
    "industry": "B2B",
    "is_hiring": true,
    "launched_at": 1478140233,
    "location": "San Francisco, CA, USA",
    "logo_url": "https://bookface-images.s3.amazonaws.com/small_logos/2758f61527dbe7c44609bc669149123e07509b8d.png",
    "long_description": "Rippling gives businesses one place to run HR, IT, and Finance. It brings together all of the workforce systems that are normally scattered across a company, like payroll, expenses, benefits, and computers. For the first time ever, you can manage and automate every part of the employee lifecycle in a single system.\r\n\r\nTake onboarding, for example. With Rippling, you can hire a new employee anywhere in the world and set up their payroll, corporate card, computer, benefits, and even third-party apps like Slack and Microsoft 365—all within 90 seconds. \r\n\r\nBased in San Francisco, CA, Rippling has raised $1.2B from the world’s top investors—including Kleiner Perkins, Founders Fund, Sequoia, Greenoaks and Bedrock. \r\n",
    "name": "Rippling",
    "one_liner": "One place to run all your HR, IT, and Finance. Globally.",
    "slug": "rippling",
    "status": "Active",
    "subindustry": "B2B -> Human Resources",
    "tags": [
      "HR Tech"
    ],
    "team_size": 2500,
    "top_company": true,
    "website": "http://rippling.com/",
    "yc_url": "https://www.ycombinator.com/companies/rippling"
  },
  {
    "batch": "Winter 2017",
    "id": 1480,
    "industries": [
      "Consumer"
    ],
    "industry": "Consumer",
    "is_hiring": true,
    "launched_at": 1478221234,
    "location": "San Francisco, CA, USA",
    "logo_url": "https://bookface-images.s3.amazonaws.com/small_logos/2faf8d8d822c59f1eac78a6bce3d6ba75c760df7.png",
    "long_description": "Our Why\r\nAt Clipboard, our mission is to uplift as many communities as possible. We do this by connecting professionals with the workplaces that need amazing workers, helping people achieve financial stability for themselves and their families all across the U.S.\r\n\r\nOur How\r\nClipboard is an app-based marketplace where workplaces post calls for help and workers answer. Every year, we help hundreds of thousands of workers fill millions of shifts across the U.S. We’re the leader in Long-Term Care staffing and are rapidly expanding into Home Health, Hospitals, and more.\r\n\r\nOur Team\r\nFounded in 2016, we are a remote-first team of over 1,000 people working to uplift communities across the country.",
    "name": "Clipboard",
    "one_liner": "Every shift, Covered.",
    "slug": "clipboard",
    "status": "Active",
    "subindustry": "Consumer",
    "tags": [
      "Marketplace",
      "Consumer Health Services",
      "Health Tech",
      "Healthcare"
    ],
    "team_size": 1000,
    "top_company": true,
    "website": "https://www.clipboardworks.com/careers",
    "yc_url": "https://www.ycombinator.com/companies/clipboard"
  },
  {
    "batch": "Winter 2017",
    "id": 1543,
    "industries": [
      "B2B",
      "Retail"
    ],
    "industry": "B2B",
    "is_hiring": true,
    "launched_at": 1479418817,
    "location": "San Francisco, CA, USA",
    "logo_url": "https://bookface-images.s3.amazonaws.com/small_logos/3ccfa8cd66f2a1d09da157956ae8b5686f3b2fe5.png",
    "long_description": "Faire is an innovative online marketplace that uses machine learning to match local retailers with the brands and products that uniquely fit their stores. We are using the power of technology to connect brands and independent retailers from all over the world, building a thriving community of hundreds of thousands of retailers, which has resulted in over 7 million new connections to date. Faire was founded on the belief that the future of retail is local.\r\n\r\nOur mission is to empower brands and retailers to strengthen the unique character of local communities. Our data-driven approach unburdens retailers from decades-old obstacles by helping find the right products for their shop. Plus, our straight-forward financial terms level the playing field by eliminating inventory risk and providing access to capital—key offerings previously only available to big box chains. For brands, our platform provides powerful sales, marketing, and analytics tools that simplify their business and allow them to focus on what they love: making great products.\r\n",
    "name": "Faire",
    "one_liner": "The global online platform empowering independent retail.",
    "slug": "faire",
    "status": "Active",
    "subindustry": "B2B -> Retail",
    "tags": [
      "Marketplace",
      "Retail"
    ],
    "team_size": 900,
    "top_company": true,
    "website": "https://www.faire.com/",
    "yc_url": "https://www.ycombinator.com/companies/faire"
  },
  {
    "batch": "Winter 2017",
    "id": 1556,
    "industries": [
      "Fintech",
      "Banking and Exchange"
    ],
    "industry": "Fintech",
    "is_hiring": false,
    "launched_at": 1481770830,
    "location": "San Francisco, CA, USA",
    "logo_url": "https://bookface-images.s3.amazonaws.com/small_logos/72237ca3782563f0b12ffe1fe9869d878c153ab6.png",
    "long_description": "Brex is the AI-powered spend platform for modern companies, from startups to enterprises. Combining corporate cards, expense management, travel, business accounts, and bill pay, Brex makes it easy to control spend before it happens with unprecedented efficiency and accuracy. Our mission is to empower employees anywhere to make better financial decisions, so we designed our platform to make expenses almost effortless with unrivaled automation of manual expense work and real-time tracking. Brex supports more countries and currencies than any other spend solution. Brex has tens of thousands of customers, including some of the most successful, high-growth companies, such as DoorDash, SeatGeek, Coinbase, ScaleAI, MasterClass, Indeed, Allbirds, and Superhuman.\r\n\r\nBrex offers:\r\n- Corporate cards with 10-20x higher limits\r\n- Business accounts with easy wires, same-day liquidity, fast global payments, and $6M in FDIC insurance\r\n- Reward options that include billboards, offsites, and coaching\r\n- Founder-friendly financial modeling tools\r\n- Special events and masterclasses for founders\r\n- Advanced spend management software as startups grow that includes global capabilities, travel, bill pay and more.\r\n\r\n",
    "name": "Brex",
    "one_liner": "Business accounts, corporate cards, and spend management software.",
    "slug": "brex",
    "status": "Acquired",
    "subindustry": "Fintech -> Banking and Exchange",
    "tags": [
      "Fintech"
    ],
    "team_size": 1000,
    "top_company": true,
    "website": "https://www.brex.com",
    "yc_url": "https://www.ycombinator.com/companies/brex"
  },
  {
    "batch": "Summer 2017",
    "id": 1616,
    "industries": [
      "B2B",
      "Engineering, Product and Design"
    ],
    "industry": "B2B",
    "is_hiring": true,
    "launched_at": 1646149352,
    "location": "Atlanta, GA, USA",
    "logo_url": "https://bookface-images.s3.amazonaws.com/small_logos/ee69b5c905088288ff0fc007921dde14514a40a1.png",
    "long_description": "Flock Safety provides the first public safety operating system that empowers private communities and law enforcement to work together to eliminate crime. We are committed to protecting human privacy and mitigating bias in policing with the development of best-in-class technology rooted in ethical design, which unites civilians and public servants in pursuit of a safer, more equitable society. \r\n\r\nOur Safety-as-a-Service approach includes affordable devices powered by LTE and solar that can be installed anywhere.  Our technology detects and captures objective details, decodes evidence in real-time and delivers investigative leads into the hands of those who matter. \r\n\r\nWhile safety is a serious business, we are a supportive team that is optimizing the remote experience to create strong and fun relationships even when we are physically apart. Our flock of hard-working employees thrive in a positive and inclusive environment, where a bias towards action is rewarded. Flock Safety is headquartered in Atlanta and operates nationwide. We have raised $150M in our Series E led by Tiger Global at a $3.5B valuation.",
    "name": "Flock Safety",
    "one_liner": "The first public safety operating system that eliminates crime.",
    "slug": "flock-safety",
    "status": "Active",
    "subindustry": "B2B -> Engineering, Product and Design",
    "tags": [
      "Hardware",
      "Machine Learning",
      "SaaS"
    ],
    "team_size": 1000,
    "top_company": true,
    "website": "http://www.flocksafety.com",
    "yc_url": "https://www.ycombinator.com/companies/flock-safety"
  },
  {
    "batch": "Winter 2018",
    "id": 1654,
    "industries": [
      "Fintech",
      "Insurance"
    ],
    "industry": "Fintech",
    "is_hiring": false,
    "launched_at": 1493701824,
    "location": "San Francisco, CA, USA",
    "logo_url": "https://bookface-images.s3.amazonaws.com/small_logos/6d7ef9c80d04b0eeccadce07af72fa59e617fb84.png",
    "long_description": "Newfront is building the modern insurance brokerage. Transparent data delivered real-time translates into a lower total cost of risk and greater insights. We work with 20% of US unicorns, 100s of YC startups, and 150+ public companies on their Business Insurance and Total Rewards.\r\n\r\nHeadquartered in San Francisco, Newfront has more than 800 colleagues and offices throughout the US. ",
    "name": "Newfront",
    "one_liner": "Modern insurance brokerage.",
    "slug": "newfront-insurance",
    "status": "Acquired",
    "subindustry": "Fintech -> Insurance",
    "tags": [
      "Fintech",
      "Insurance"
    ],
    "team_size": 800,
    "top_company": true,
    "website": "https://www.newfront.com/",
    "yc_url": "https://www.ycombinator.com/companies/newfront-insurance"
  },
  {
    "batch": "Summer 2017",
    "id": 1688,
    "industries": [
      "Healthcare",
      "Consumer Health and Wellness"
    ],
    "industry": "Healthcare",
    "is_hiring": false,
    "launched_at": 1495670433,
    "location": "San Francisco, CA, USA",
    "logo_url": "https://bookface-images.s3.amazonaws.com/small_logos/b80c9ee16644141e27cf06459324dccdc7fd94bf.png",
    "long_description": "We're a women’s health company making personalized reproductive health information more accessible, earlier in life. We make the same laboratory tests that were previously confined to fertility clinics more accessible for women at home. By arming women with powerful information about their reproductive health, Modern Fertility is closing the fertility information gap and enabling women to own the decisions impacting their bodies and futures. We've raised $22 million from Forerunner Ventures, Maveron, Union Square Ventures, First Round Capital, #Angels and Y Combinator.\r\n",
    "name": "Modern Fertility",
    "one_liner": "At-home fertility test for women who aren't ready for kids right now…",
    "slug": "modern-fertility",
    "status": "Acquired",
    "subindustry": "Healthcare -> Consumer Health and Wellness",
    "tags": [
      "Fertility Tech",
      "Consumer Health Services",
      "Women's Health"
    ],
    "team_size": 25,
    "top_company": true,
    "website": "https://www.modernfertility.com",
    "yc_url": "https://www.ycombinator.com/companies/modern-fertility"
  },
  {
    "batch": "Winter 2018",
    "id": 1839,
    "industries": [
      "Fintech",
      "Asset Management"
    ],
    "industry": "Fintech",
    "is_hiring": true,
    "launched_at": 1510200189,
    "location": "Bengaluru, KA, India",
    "logo_url": "https://bookface-images.s3.amazonaws.com/small_logos/0ae62cb1672e8223d9b0ae2e5b7ecde4ae763c5e.png",
    "long_description": "Groww aims to empower people in India by making financial services simple, transparent and delightful. By leveraging technology, we build reliable and accessible financial services. \r\n\r\nGroww is India's largest stock broker (in terms of active NSE clients) and the largest distributor of mutual fund SIPs. \r\n",
    "name": "Groww",
    "one_liner": "Making financial services simple, transparent and delightful. ",
    "slug": "groww",
    "status": "Public",
    "subindustry": "Fintech -> Asset Management",
    "tags": [
      "India",
      "Investing"
    ],
    "team_size": 1050,
    "top_company": true,
    "website": "https://groww.in",
    "yc_url": "https://www.ycombinator.com/companies/groww"
  },
  {
    "batch": "Summer 2018",
    "id": 1886,
    "industries": [
      "Consumer",
      "Apparel and Cosmetics"
    ],
    "industry": "Consumer",
    "is_hiring": false,
    "launched_at": 1524535497,
    "location": "Los Angeles, CA, USA; San Francisco, CA, USA",
    "logo_url": "https://bookface-images.s3.amazonaws.com/small_logos/50726ec2a923dcdbc1976fc34ca5ae61e74a8d58.png",
    "long_description": "Honeylove is a DTC startup founded by EDM artist Betsie Larkin. After searching high and low for quality shapewear that made her feel confident on stage, Betsie decided to create her own line of stage-worthy shapewear and launched publicly in 2018. Since then, Honeylove has expanded to tops, bras, and many other garments that have set new standards in their verticals. We apply a technical and artistic approach to problems we see in the fashion industry, creating products that serve our customers of all shapes, sizes, and backgrounds.",
    "name": "Honeylove",
    "one_liner": "Honeylove makes functional undergarments for women",
    "slug": "honeylove",
    "status": "Active",
    "subindustry": "Consumer -> Apparel and Cosmetics",
    "tags": [
      "Smart Clothing"
    ],
    "team_size": 100,
    "top_company": true,
    "website": "https://www.honeylove.com",
    "yc_url": "https://www.ycombinator.com/companies/honeylove"
  },
  {
    "batch": "Summer 2018",
    "id": 1993,
    "industries": [
      "Industrials",
      "Aviation and Space"
    ],
    "industry": "Industrials",
    "is_hiring": false,
    "launched_at": 1525748776,
    "location": "San Francisco, CA, USA; Santa Clara, CA, USA",
    "logo_url": "https://bookface-images.s3.amazonaws.com/small_logos/a9e04d61888abfae102ae9245cd5325c24e4bef5.png",
    "long_description": "Momentus is a space infrastructure services company. As a first mover, Momentus will offer the most basic, foundational services that enable businesses to flourish in space. With their experienced team of aerospace, propulsion, and robotics engineers, Momentus makes and operates cost-effective and energy-efficient in-space transport and service vehicles that utilize water plasma propulsion technology. Momentus has service agreements in place with numerous private satellite companies, government agencies, and research organizations.",
    "name": "Momentus",
    "one_liner": "The space infrastructure services company",
    "slug": "momentus",
    "status": "Public",
    "subindustry": "Industrials -> Aviation and Space",
    "tags": [
      "Commercial Space Launch",
      "Solar Power",
      "Space Exploration"
    ],
    "team_size": 125,
    "top_company": true,
    "website": "https://momentus.space",
    "yc_url": "https://www.ycombinator.com/companies/momentus"
  },
  {
    "batch": "Winter 2012",
    "id": 4940,
    "industries": [
      "Fintech",
      "Payments"
    ],
    "industry": "Fintech",
    "is_hiring": false,
    "launched_at": 1638361727,
    "location": "Dakar, Dakar Region, Senegal; Remote",
    "logo_url": "https://bookface-images.s3.amazonaws.com/small_logos/7bb010b1c1951d3cc6578fb3ff4c83700de7c376.png",
    "long_description": "Building extremely affordable financial infrastructure for Africa.",
    "name": "Wave",
    "one_liner": "Mobile money app for Africa",
    "slug": "wave",
    "status": "Active",
    "subindustry": "Fintech -> Payments",
    "tags": [
      "Fintech"
    ],
    "team_size": 1600,
    "top_company": true,
    "website": "https://wave.com",
    "yc_url": "https://www.ycombinator.com/companies/wave"
  },
  {
    "batch": "Winter 2019",
    "id": 12064,
    "industries": [
      "B2B",
      "Finance and Accounting"
    ],
    "industry": "B2B",
    "is_hiring": true,
    "launched_at": 1541644458,
    "location": "San Francisco, CA, USA; Remote",
    "logo_url": "https://bookface-images.s3.amazonaws.com/small_logos/2b5c8a17f0ab4fa9a72447d94bc3194dc17fce9b.png",
    "long_description": "Deel is the all-in-one payroll and HR platform for global teams. Built for the way the world works today, Deel combines HRIS, payroll, compliance, benefits, performance, and equipment management into one seamless platform. With AI-powered tools and a fully owned payroll infrastructure, Deel supports every worker type in 120+ countries—helping businesses scale smarter, faster, and more compliantly. Discover how Deel makes global work simple at deel.com.",
    "name": "Deel",
    "one_liner": "The all-in-one HR and payroll platform for global teams",
    "slug": "deel",
    "status": "Active",
    "subindustry": "B2B -> Finance and Accounting",
    "tags": [
      "Fintech",
      "SaaS",
      "B2B",
      "HR Tech",
      "Payroll"
    ],
    "team_size": 5000,
    "top_company": true,
    "website": "https://www.deel.com/",
    "yc_url": "https://www.ycombinator.com/companies/deel"
  },
  {
    "batch": "Winter 2019",
    "id": 12237,
    "industries": [
      "B2B",
      "Supply Chain and Logistics"
    ],
    "industry": "B2B",
    "is_hiring": false,
    "launched_at": 1543948512,
    "location": "",
    "logo_url": "https://bookface-images.s3.amazonaws.com/small_logos/3adc2d7230f0a2c3c705c361a16f9f9b93e81b7d.png",
    "long_description": "Nowports is the first digital Freight Forwarder shipping ocean containers to and from Latin America. One out of every two containers gets lost or delayed due to miscommunication and lack of management. The platform reduces human mistakes to 0% and saves up to 40% of delays with Nowports models and algorithms. Nowports assist companies so moving ocean containers is fast, simple and secure.",
    "name": "Nowports",
    "one_liner": "The core engine of supply chain in LATAM",
    "slug": "nowports",
    "status": "Active",
    "subindustry": "B2B -> Supply Chain and Logistics",
    "tags": [],
    "team_size": 550,
    "top_company": true,
    "website": "https://nowports.com/",
    "yc_url": "https://www.ycombinator.com/companies/nowports"
  },
  {
    "batch": "Summer 2019",
    "id": 12565,
    "industries": [
      "B2B"
    ],
    "industry": "B2B",
    "is_hiring": true,
    "launched_at": 1556154664,
    "location": "New York City, NY, USA; New York, NY, USA",
    "logo_url": "https://bookface-images.s3.amazonaws.com/small_logos/3b1e7b7eb171eccce88cf7089d2997df49764f1c.png",
    "long_description": "We’re a passionate team of dreamers and builders, determined to liberate small businesses from the not-so-fun aspects of the job so that they can focus on what’s fun and important.",
    "name": "Odeko",
    "one_liner": "Our operations software makes it easier to run--and grow--your cafe",
    "slug": "odeko",
    "status": "Active",
    "subindustry": "B2B",
    "tags": [
      "B2B",
      "Logistics"
    ],
    "team_size": 371,
    "top_company": true,
    "website": "http://www.odeko.com",
    "yc_url": "https://www.ycombinator.com/companies/odeko"
  },
  {
    "batch": "Winter 2020",
    "id": 13208,
    "industries": [
      "Consumer"
    ],
    "industry": "Consumer",
    "is_hiring": true,
    "launched_at": 1580948094,
    "location": "Los Angeles, CA, USA; Remote",
    "logo_url": "https://bookface-images.s3.amazonaws.com/small_logos/8cc4364cbc36079057551f98544d5fb6be675455.png",
    "long_description": "Whatnot is the largest livestream shopping platform in the U.S., connecting buyers and sellers in real-time across any category – from collectibles like trading cards to comics, fashion, sneakers, and more. ",
    "name": "Whatnot",
    "one_liner": "Whatnot is the largest livestream shopping platform in the U.S.",
    "slug": "whatnot",
    "status": "Active",
    "subindustry": "Consumer",
    "tags": [
      "Marketplace",
      "E-commerce"
    ],
    "team_size": 731,
    "top_company": true,
    "website": "https://www.whatnot.com",
    "yc_url": "https://www.ycombinator.com/companies/whatnot"
  },
  {
    "batch": "Winter 2021",
    "id": 22721,
    "industries": [
      "Consumer",
      "Food and Beverage"
    ],
    "industry": "Consumer",
    "is_hiring": false,
    "launched_at": 1636637510,
    "location": "MH, India",
    "logo_url": "https://bookface-images.s3.amazonaws.com/small_logos/b419835c59c3d3a4db7e0aaf094b54bb5cee0adb.png",
    "long_description": "We deliver groceries in 10 minutes through a network of optimized micro-warehouses or 'dark stores' that we build across cities in India.\r\n\r\nWe're currently doing hundreds of millions of dollars in annual sales with best-in-class unit economics - come join us!",
    "name": "Zepto",
    "one_liner": "10-Minute Grocery Delivery in India",
    "slug": "zepto",
    "status": "Active",
    "subindustry": "Consumer -> Food and Beverage",
    "tags": [
      "Grocery",
      "Delivery"
    ],
    "team_size": 1300,
    "top_company": true,
    "website": "https://www.zeptonow.com/",
    "yc_url": "https://www.ycombinator.com/companies/zepto"
  }
];

export const curatedCompetitors: CuratedCompetitor[] = [
  {
    "category": "Fintech",
    "description": "Adyen is a Netherlands-based payments company used by large global merchants for online and in-person checkout.",
    "id": "ext-adyen",
    "location": "Amsterdam, Netherlands",
    "logo_url": "https://www.google.com/s2/favicons?domain=adyen.com&sz=128",
    "name": "Adyen",
    "one_liner": "Global payments platform for enterprise checkout.",
    "slug": "adyen",
    "tags": [
      "Payments",
      "Fintech"
    ],
    "website": "https://www.adyen.com"
  },
  {
    "category": "Consumer",
    "description": "Vrbo (Expedia Group) is a vacation-rental marketplace focused on entire homes for families and groups, making it Airbnb's closest like-for-like rival.",
    "id": "ext-vrbo",
    "location": "Austin, TX",
    "logo_url": "https://www.google.com/s2/favicons?domain=vrbo.com&sz=128",
    "name": "Vrbo",
    "one_liner": "Vacation rentals built around whole homes.",
    "slug": "vrbo",
    "tags": [
      "Travel",
      "Marketplace"
    ],
    "website": "https://www.vrbo.com"
  },
  {
    "category": "Consumer",
    "description": "Uber Eats competes in on-demand restaurant delivery across most major cities.",
    "id": "ext-uber-eats",
    "location": "San Francisco, CA",
    "logo_url": "https://www.google.com/s2/favicons?domain=ubereats.com&sz=128",
    "name": "Uber Eats",
    "one_liner": "Food delivery network built on Uber's logistics.",
    "slug": "uber-eats",
    "tags": [
      "Food Delivery",
      "Marketplace"
    ],
    "website": "https://www.ubereats.com"
  },
  {
    "category": "Fintech",
    "description": "Binance is a major cryptocurrency exchange known for deep liquidity and a wide asset list.",
    "id": "ext-binance",
    "location": "Global",
    "logo_url": "https://www.google.com/s2/favicons?domain=binance.com&sz=128",
    "name": "Binance",
    "one_liner": "High-volume global crypto exchange.",
    "slug": "binance",
    "tags": [
      "Crypto / Web3",
      "Fintech"
    ],
    "website": "https://www.binance.com"
  },
  {
    "category": "B2B",
    "description": "Google Drive is the default cloud file system for many teams already on Gmail/Docs.",
    "id": "ext-google-drive",
    "location": "Mountain View, CA",
    "logo_url": "https://www.google.com/s2/favicons?domain=google.com&sz=128",
    "name": "Google Drive",
    "one_liner": "Cloud storage bundled with Google Workspace.",
    "slug": "google-drive",
    "tags": [
      "SaaS",
      "Productivity"
    ],
    "website": "https://drive.google.com"
  },
  {
    "category": "Consumer",
    "description": "Amazon Fresh brings grocery delivery into Amazon's Prime membership and fulfillment network.",
    "id": "ext-amazon-fresh",
    "location": "Seattle, WA",
    "logo_url": "https://www.google.com/s2/favicons?domain=amazon.com&sz=128",
    "name": "Amazon Fresh",
    "one_liner": "Grocery delivery from Amazon's logistics stack.",
    "slug": "amazon-fresh",
    "tags": [
      "Grocery",
      "Marketplace"
    ],
    "website": "https://www.amazon.com/fresh"
  },
  {
    "category": "B2B",
    "description": "ADP is a long-running payroll and HCM provider for SMBs through large enterprises.",
    "id": "ext-adp",
    "location": "Roseland, NJ",
    "logo_url": "https://www.google.com/s2/favicons?domain=adp.com&sz=128",
    "name": "ADP",
    "one_liner": "Incumbent payroll and HR platform for enterprises.",
    "slug": "adp",
    "tags": [
      "HR",
      "Payroll"
    ],
    "website": "https://www.adp.com"
  },
  {
    "category": "Fintech",
    "description": "American Express dominates premium consumer and corporate card spend with rewards and charge products.",
    "id": "ext-amex",
    "location": "New York, NY",
    "logo_url": "https://www.google.com/s2/favicons?domain=americanexpress.com&sz=128",
    "name": "American Express",
    "one_liner": "Premium cards and corporate spend brand.",
    "slug": "american-express",
    "tags": [
      "Payments",
      "Fintech"
    ],
    "website": "https://www.americanexpress.com"
  },
  {
    "category": "Consumer",
    "description": "YouTube is the default destination for on-demand and live video creators and audiences.",
    "id": "ext-youtube",
    "location": "San Bruno, CA",
    "logo_url": "https://www.google.com/s2/favicons?domain=youtube.com&sz=128",
    "name": "YouTube",
    "one_liner": "Dominant video platform with live streaming.",
    "slug": "youtube",
    "tags": [
      "Content",
      "Video"
    ],
    "website": "https://www.youtube.com"
  },
  {
    "category": "B2B",
    "description": "Labelbox helps teams create and manage labeled datasets for machine learning.",
    "id": "ext-labelbox",
    "location": "San Francisco, CA",
    "logo_url": "https://www.google.com/s2/favicons?domain=labelbox.com&sz=128",
    "name": "Labelbox",
    "one_liner": "Data labeling and training-data platform for ML teams.",
    "slug": "labelbox",
    "tags": [
      "AI",
      "Machine Learning"
    ],
    "website": "https://labelbox.com"
  },
  {
    "category": "B2B",
    "description": "Render competes as a developer-friendly alternative to classic PaaS for deploying web services.",
    "id": "ext-render",
    "location": "San Francisco, CA",
    "logo_url": "https://www.google.com/s2/favicons?domain=render.com&sz=128",
    "name": "Render",
    "one_liner": "Modern cloud host for web apps and services.",
    "slug": "render",
    "tags": [
      "Developer Tools",
      "Infrastructure"
    ],
    "website": "https://render.com"
  },
  {
    "category": "Real Estate and Construction",
    "description": "Procore Technologies (NYSE: PCOR) is a global construction management platform covering project management, quality, safety, and cost control.",
    "id": "ext-procore",
    "location": "Carpinteria, CA",
    "logo_url": "https://www.google.com/s2/favicons?domain=procore.com&sz=128",
    "name": "Procore",
    "one_liner": "Public construction management platform for project and field teams.",
    "slug": "procore",
    "tags": [
      "Construction",
      "SaaS"
    ],
    "website": "https://www.procore.com"
  },
  {
    "category": "Real Estate and Construction",
    "description": "iGUIDE, made by Planitar Inc., combines laser measurement and 360-degree imagery to produce accurate floor plans and virtual tours for real estate; REA Group acquired a majority stake in 2025.",
    "id": "ext-iguide",
    "location": "Waterloo, Ontario, Canada",
    "logo_url": "https://www.google.com/s2/favicons?domain=goiguide.com&sz=128",
    "name": "iGUIDE",
    "one_liner": "3D tours and measurement-grade floor plans for real estate listings.",
    "slug": "iguide",
    "tags": [
      "PropTech",
      "3D Scanning"
    ],
    "website": "https://www.goiguide.com"
  },
  {
    "category": "B2B",
    "description": "Pendo is a product analytics and digital adoption platform used by product teams to track usage, guide users in-app, and collect feedback.",
    "id": "ext-pendo",
    "location": "Raleigh, NC",
    "logo_url": "https://www.google.com/s2/favicons?domain=pendo.io&sz=128",
    "name": "Pendo",
    "one_liner": "Product experience platform combining analytics, in-app guides, and feedback.",
    "slug": "pendo",
    "tags": [
      "Analytics",
      "Product Management"
    ],
    "website": "https://www.pendo.io"
  },
  {
    "category": "Fintech",
    "description": "Remitly (Nasdaq: RELY) is a digital remittance company offering international money transfers to more than 170 countries.",
    "id": "ext-remitly",
    "location": "Seattle, WA",
    "logo_url": "https://www.google.com/s2/favicons?domain=remitly.com&sz=128",
    "name": "Remitly",
    "one_liner": "Public digital remittance app for international money transfers.",
    "slug": "remitly",
    "tags": [
      "Payments",
      "Remittances"
    ],
    "website": "https://www.remitly.com"
  },
  {
    "category": "B2B",
    "description": "mParticle is a customer data platform (CDP) that unifies and routes customer data across marketing, analytics, and product tools.",
    "id": "ext-mparticle",
    "location": "New York, NY",
    "logo_url": "https://www.google.com/s2/favicons?domain=mparticle.com&sz=128",
    "name": "mParticle",
    "one_liner": "Customer data platform for real-time data collection and activation.",
    "slug": "mparticle",
    "tags": [
      "CDP",
      "Data Infrastructure"
    ],
    "website": "https://www.mparticle.com"
  },
  {
    "category": "B2B",
    "description": "DocuSign (Nasdaq: DOCU) is the category-defining e-signature platform used across consumer and enterprise workflows.",
    "id": "ext-docusign",
    "location": "San Francisco, CA",
    "logo_url": "https://www.google.com/s2/favicons?domain=docusign.com&sz=128",
    "name": "DocuSign",
    "one_liner": "Public market leader in e-signature and agreement management.",
    "slug": "docusign",
    "tags": [
      "eSignature",
      "SaaS"
    ],
    "website": "https://www.docusign.com"
  },
  {
    "category": "Consumer",
    "description": "StockX is a Detroit-founded 'stock market of things' marketplace for buying and selling authenticated sneakers and streetwear.",
    "id": "ext-stockx",
    "location": "Detroit, MI",
    "logo_url": "https://www.google.com/s2/favicons?domain=stockx.com&sz=128",
    "name": "StockX",
    "one_liner": "Bid/ask marketplace for authenticated sneakers, streetwear, and collectibles.",
    "slug": "stockx",
    "tags": [
      "Marketplace",
      "Sneakers"
    ],
    "website": "https://stockx.com"
  },
  {
    "category": "Healthcare",
    "description": "athenahealth provides cloud EHR, revenue cycle, and practice management software for medical practices and health systems.",
    "id": "ext-athenahealth",
    "location": "Watertown, MA",
    "logo_url": "https://www.google.com/s2/favicons?domain=athenahealth.com&sz=128",
    "name": "athenahealth",
    "one_liner": "Cloud-based EHR and practice management for medical groups.",
    "slug": "athenahealth",
    "tags": [
      "Healthcare IT",
      "EHR"
    ],
    "website": "https://www.athenahealth.com"
  },
  {
    "category": "B2B",
    "description": "Opsgenie provides on-call scheduling, alerting, and incident response for engineering and ops teams, acquired by Atlassian in 2018.",
    "id": "ext-opsgenie",
    "location": "Sydney, Australia",
    "logo_url": "https://www.google.com/s2/favicons?domain=atlassian.com&sz=128",
    "name": "Opsgenie",
    "one_liner": "On-call scheduling and incident alerting tool now owned by Atlassian.",
    "slug": "opsgenie",
    "tags": [
      "DevOps",
      "Incident Management"
    ],
    "website": "https://www.atlassian.com/software/opsgenie"
  },
  {
    "category": "B2B",
    "description": "VWO, built by Wingify, is an experimentation and conversion-rate-optimization platform used by thousands of brands worldwide.",
    "id": "ext-vwo",
    "location": "New Delhi, India",
    "logo_url": "https://www.google.com/s2/favicons?domain=vwo.com&sz=128",
    "name": "VWO",
    "one_liner": "A/B testing and conversion optimization platform.",
    "slug": "vwo",
    "tags": [
      "Experimentation",
      "Marketing"
    ],
    "website": "https://vwo.com"
  },
  {
    "category": "Consumer",
    "description": "Kindle Unlimited is Amazon's subscription reading service offering access to millions of ebooks and audiobooks.",
    "id": "ext-kindle-unlimited",
    "location": "Seattle, WA",
    "logo_url": "https://www.google.com/s2/favicons?domain=amazon.com&sz=128",
    "name": "Kindle Unlimited",
    "one_liner": "Amazon's all-you-can-read ebook and audiobook subscription.",
    "slug": "kindle-unlimited",
    "tags": [
      "Content",
      "Subscription"
    ],
    "website": "https://www.amazon.com/kindle-dbs/hz/subscribe/ku"
  },
  {
    "category": "Education",
    "description": "ClassLink provides single sign-on, class rostering, and analytics for schools, competing directly with Clever for district-level access management contracts.",
    "id": "ext-classlink",
    "location": "Clifton, NJ, USA",
    "logo_url": "https://www.google.com/s2/favicons?domain=classlink.com&sz=128",
    "name": "ClassLink",
    "one_liner": "Identity and rostering platform for K-12 school districts.",
    "slug": "classlink",
    "tags": [
      "Education",
      "Identity",
      "SaaS"
    ],
    "website": "https://www.classlink.com"
  },
  {
    "category": "B2B",
    "description": "Greenhouse is an applicant tracking and hiring platform known for structured interview workflows, competing head-to-head with Lever for mid-market and enterprise recruiting teams.",
    "id": "ext-greenhouse",
    "location": "New York, NY, USA",
    "logo_url": "https://www.google.com/s2/favicons?domain=greenhouse.io&sz=128",
    "name": "Greenhouse",
    "one_liner": "Structured hiring platform with scorecards and compliance tooling.",
    "slug": "greenhouse",
    "tags": [
      "SaaS",
      "Human Resources",
      "Recruiting"
    ],
    "website": "https://www.greenhouse.io"
  },
  {
    "category": "B2B",
    "description": "Make (formerly Integromat, now owned by Celonis) lets users build complex, branching automations on a visual canvas, competing directly with Zapier in no-code automation.",
    "id": "ext-make",
    "location": "Prague, Czech Republic",
    "logo_url": "https://www.google.com/s2/favicons?domain=make.com&sz=128",
    "name": "Make",
    "one_liner": "Visual, canvas-based workflow automation platform.",
    "slug": "make",
    "tags": [
      "SaaS",
      "Automation",
      "No-Code"
    ],
    "website": "https://www.make.com"
  },
  {
    "category": "B2B",
    "description": "Dotmatics (now owned by Siemens) offers ELN, LIMS, and chemistry-aware data tools for life-science R&D teams, and is the most frequently cited rival to Benchling.",
    "id": "ext-dotmatics",
    "location": "Boston, MA, USA",
    "logo_url": "https://www.google.com/s2/favicons?domain=dotmatics.com&sz=128",
    "name": "Dotmatics",
    "one_liner": "Scientific informatics suite for biotech and pharma R&D.",
    "slug": "dotmatics",
    "tags": [
      "SaaS",
      "Biotech",
      "R&D Software"
    ],
    "website": "https://www.dotmatics.com"
  },
  {
    "category": "B2B",
    "description": "Matillion builds and manages data pipelines with low-code, push-down transformations for cloud data platforms, competing with Fivetran in data integration.",
    "id": "ext-matillion",
    "location": "Manchester, UK; Denver, CO, USA",
    "logo_url": "https://www.google.com/s2/favicons?domain=matillion.com&sz=128",
    "name": "Matillion",
    "one_liner": "Cloud-native ETL/ELT platform for data warehouses.",
    "slug": "matillion",
    "tags": [
      "SaaS",
      "Data Engineering",
      "Analytics"
    ],
    "website": "https://www.matillion.com"
  },
  {
    "category": "B2B",
    "description": "Framer lets designers build and publish sites directly from a design canvas with heavy animation support, and is widely cited as Webflow's leading 2026 no-code rival.",
    "id": "ext-framer",
    "location": "Amsterdam, Netherlands",
    "logo_url": "https://www.google.com/s2/favicons?domain=framer.com&sz=128",
    "name": "Framer",
    "one_liner": "Design-canvas website builder focused on speed and motion.",
    "slug": "framer",
    "tags": [
      "No-Code",
      "Design",
      "SaaS"
    ],
    "website": "https://www.framer.com"
  },
  {
    "category": "Consumer",
    "description": "Oura makes a ring-form wearable tracking sleep, activity, and cycle health, competing with Bellabeat for the wellness-wearable market including women's health features.",
    "id": "ext-oura",
    "location": "Oulu, Finland",
    "logo_url": "https://www.google.com/s2/favicons?domain=ouraring.com&sz=128",
    "name": "Oura",
    "one_liner": "Smart ring for sleep, readiness, and biometric tracking.",
    "slug": "oura",
    "tags": [
      "Wearables",
      "Health & Wellness",
      "Hardware"
    ],
    "website": "https://ouraring.com"
  },
  {
    "category": "Healthcare",
    "description": "Solutionreach provides automated reminders, recall, and review-request tools for healthcare practices, and is described as Weave's most direct functional competitor.",
    "id": "ext-solutionreach",
    "location": "Lehi, UT, USA",
    "logo_url": "https://www.google.com/s2/favicons?domain=solutionreach.com&sz=128",
    "name": "Solutionreach",
    "one_liner": "Patient communication and recall platform for medical and dental practices.",
    "slug": "solutionreach",
    "tags": [
      "Healthcare",
      "SaaS",
      "Patient Communication"
    ],
    "website": "https://www.solutionreach.com"
  },
  {
    "category": "B2B",
    "description": "Elastic (NYSE: ESTC), maker of Elasticsearch, offers self-managed and cloud search infrastructure with deep query control, a common comparison point against Algolia's managed search API.",
    "id": "ext-elastic",
    "location": "Amsterdam, Netherlands; San Francisco, CA, USA",
    "logo_url": "https://www.google.com/s2/favicons?domain=elastic.co&sz=128",
    "name": "Elastic",
    "one_liner": "Public search, observability, and security data platform.",
    "slug": "elastic",
    "tags": [
      "Developer Tools",
      "Search",
      "Infrastructure"
    ],
    "website": "https://www.elastic.co"
  },
  {
    "category": "B2B",
    "description": "First Advantage (Nasdaq: FA) is a long-established background check and screening company, listed by Checkr itself as a direct competitor.",
    "id": "ext-first-advantage",
    "location": "Atlanta, GA, USA",
    "logo_url": "https://www.google.com/s2/favicons?domain=fadv.com&sz=128",
    "name": "First Advantage",
    "one_liner": "Public global employment background screening provider.",
    "slug": "first-advantage",
    "tags": [
      "Compliance",
      "HR Tech",
      "Background Checks"
    ],
    "website": "https://fadv.com"
  },
  {
    "category": "Industrials",
    "description": "IonQ (NYSE: IONQ) builds trapped-ion quantum computers and cloud access, and is routinely ranked alongside Rigetti as one of the two leading pure-play quantum computing stocks.",
    "id": "ext-ionq",
    "location": "College Park, MD, USA",
    "logo_url": "https://www.google.com/s2/favicons?domain=ionq.com&sz=128",
    "name": "IonQ",
    "one_liner": "Public trapped-ion quantum computing company.",
    "slug": "ionq",
    "tags": [
      "Quantum Computing",
      "Hardware"
    ],
    "website": "https://ionq.com"
  },
  {
    "category": "B2B",
    "description": "ShipMonk operates a multi-warehouse fulfillment network with inventory software for DTC and e-commerce brands, competing directly with ShipBob in outsourced fulfillment.",
    "id": "ext-shipmonk",
    "location": "Fort Lauderdale, FL, USA",
    "logo_url": "https://www.google.com/s2/favicons?domain=shipmonk.com&sz=128",
    "name": "ShipMonk",
    "one_liner": "Tech-driven third-party fulfillment for e-commerce brands.",
    "slug": "shipmonk",
    "tags": [
      "Logistics",
      "E-commerce",
      "Fulfillment"
    ],
    "website": "https://www.shipmonk.com"
  },
  {
    "category": "Industrials",
    "description": "NuScale Power designs and licenses small modular nuclear reactors, and was the first SMR maker to win NRC design approval and go public.",
    "id": "ext-nuscale",
    "location": "Tigard, OR",
    "logo_url": "https://www.google.com/s2/favicons?domain=nuscalepower.com&sz=128",
    "name": "NuScale Power",
    "one_liner": "Public small modular reactor developer for carbon-free power.",
    "slug": "nuscale-power",
    "tags": [
      "Small Modular Reactors",
      "Nuclear Energy",
      "Climate"
    ],
    "website": "https://www.nuscalepower.com"
  },
  {
    "category": "B2B",
    "description": "Sysco is the incumbent broadline food distributor supplying restaurants, healthcare, and education customers across North America.",
    "id": "ext-sysco",
    "location": "Houston, TX",
    "logo_url": "https://www.google.com/s2/favicons?domain=sysco.com&sz=128",
    "name": "Sysco",
    "one_liner": "Largest foodservice distributor in North America.",
    "slug": "sysco",
    "tags": [
      "Food Distribution",
      "Supply Chain"
    ],
    "website": "https://www.sysco.com"
  },
  {
    "category": "Real Estate and Construction",
    "description": "United Rentals rents construction and industrial equipment through thousands of locations across North America and Europe.",
    "id": "ext-united-rentals",
    "location": "Stamford, CT",
    "logo_url": "https://www.google.com/s2/favicons?domain=unitedrentals.com&sz=128",
    "name": "United Rentals",
    "one_liner": "World's largest equipment rental company.",
    "slug": "united-rentals",
    "tags": [
      "Construction",
      "Equipment Rental"
    ],
    "website": "https://www.unitedrentals.com"
  },
  {
    "category": "B2B",
    "description": "GitHub hosts code, issues, and CI/CD workflows for most of the world's developers, and has been owned by Microsoft since 2018.",
    "id": "ext-github",
    "location": "San Francisco, CA",
    "logo_url": "https://www.google.com/s2/favicons?domain=github.com&sz=128",
    "name": "GitHub",
    "one_liner": "Microsoft-owned home for open-source and enterprise code.",
    "slug": "github",
    "tags": [
      "Developer Tools",
      "DevOps",
      "Open Source"
    ],
    "website": "https://github.com"
  },
  {
    "category": "Fintech",
    "description": "PayU is a global payments and fintech provider owned by Prosus, with deep reach in India through its BillDesk acquisition.",
    "id": "ext-payu",
    "location": "Gurugram, India",
    "logo_url": "https://www.google.com/s2/favicons?domain=payu.in&sz=128",
    "name": "PayU",
    "one_liner": "Prosus-owned payments gateway operating across 50+ markets.",
    "slug": "payu",
    "tags": [
      "Payments",
      "Fintech",
      "India"
    ],
    "website": "https://payu.in"
  },
  {
    "category": "Consumer",
    "description": "Scentbox is a monthly fragrance subscription service offering hundreds of scents to sample before buying a full bottle.",
    "id": "ext-scentbox",
    "location": "Beverly Hills, CA",
    "logo_url": "https://www.google.com/s2/favicons?domain=scentbox.com&sz=128",
    "name": "Scentbox",
    "one_liner": "Fragrance sampling subscription rivaling Scentbird.",
    "slug": "scentbox",
    "tags": [
      "Subscription",
      "Fragrance",
      "E-commerce"
    ],
    "website": "https://www.scentbox.com"
  },
  {
    "category": "B2B",
    "description": "LinkedIn Learning offers on-demand video courses for workplace and technical skills, bundled with LinkedIn's professional network.",
    "id": "ext-linkedin-learning",
    "location": "Sunnyvale, CA",
    "logo_url": "https://www.google.com/s2/favicons?domain=linkedin.com&sz=128",
    "name": "LinkedIn Learning",
    "one_liner": "Microsoft-owned video course library for career skills.",
    "slug": "linkedin-learning",
    "tags": [
      "eLearning",
      "HR",
      "Professional Development"
    ],
    "website": "https://www.linkedin.com/learning"
  },
  {
    "category": "Fintech",
    "description": "Trim automatically finds and cancels unwanted subscriptions and negotiates bills on behalf of users; it is now owned by OneMain Financial.",
    "id": "ext-trim",
    "location": "San Francisco, CA",
    "logo_url": "https://www.google.com/s2/favicons?domain=asktrim.com&sz=128",
    "name": "Trim",
    "one_liner": "OneMain-owned bill negotiation and subscription-cancellation app.",
    "slug": "trim",
    "tags": [
      "Fintech",
      "Consumer Finance",
      "Subscription Management"
    ],
    "website": "https://www.asktrim.com"
  },
  {
    "category": "Fintech",
    "description": "Interswitch is a Nigerian payments and digital commerce company founded in 2002, powering card switching, processing, and the Verve card network across Africa.",
    "id": "ext-interswitch",
    "location": "Lagos, Nigeria",
    "logo_url": "https://www.google.com/s2/favicons?domain=interswitchgroup.com&sz=128",
    "name": "Interswitch",
    "one_liner": "Longstanding Nigerian payments and switching infrastructure.",
    "slug": "interswitch",
    "tags": [
      "Payments",
      "Fintech",
      "Africa"
    ],
    "website": "https://interswitchgroup.com"
  },
  {
    "category": "B2B",
    "description": "Birdeye helps multi-location brands manage reviews, messaging, and listings, competing directly with Podium for local-business customer engagement.",
    "id": "ext-birdeye",
    "location": "Palo Alto, CA",
    "logo_url": "https://www.google.com/s2/favicons?domain=birdeye.com&sz=128",
    "name": "Birdeye",
    "one_liner": "AI-driven reputation and customer experience platform.",
    "slug": "birdeye",
    "tags": [
      "SaaS",
      "Reputation Management",
      "Customer Experience"
    ],
    "website": "https://birdeye.com"
  },
  {
    "category": "B2B",
    "description": "Zippin builds cashierless checkout systems for retailers, using cameras and sensors that let shoppers grab items and walk out without scanning.",
    "id": "ext-zippin",
    "location": "San Francisco, CA",
    "logo_url": "https://www.google.com/s2/favicons?domain=getzippin.com&sz=128",
    "name": "Zippin",
    "one_liner": "Computer-vision checkout-free store technology.",
    "slug": "zippin",
    "tags": [
      "Computer Vision",
      "Cashierless Checkout",
      "Retail Tech"
    ],
    "website": "https://www.getzippin.com"
  },
  {
    "category": "Consumer",
    "description": "iFood commands over 80% of Brazil's food delivery market and is fully owned by Prosus and its affiliate Movile.",
    "id": "ext-ifood",
    "location": "São Paulo, Brazil",
    "logo_url": "https://www.google.com/s2/favicons?domain=ifood.com.br&sz=128",
    "name": "iFood",
    "one_liner": "Dominant Brazilian food delivery app, owned by Prosus.",
    "slug": "ifood",
    "tags": [
      "Delivery",
      "Food Tech",
      "Latin America"
    ],
    "website": "https://www.ifood.com.br"
  },
  {
    "category": "B2B",
    "description": "Flipkart is India's largest e-commerce marketplace by GMV, majority-owned by Walmart since 2018.",
    "id": "ext-flipkart",
    "location": "Bengaluru, India",
    "logo_url": "https://www.google.com/s2/favicons?domain=flipkart.com&sz=128",
    "name": "Flipkart",
    "one_liner": "Walmart-owned e-commerce marketplace leader in India.",
    "slug": "flipkart",
    "tags": [
      "E-commerce",
      "Retail",
      "India"
    ],
    "website": "https://www.flipkart.com"
  },
  {
    "category": "B2B",
    "description": "Sinch is a Sweden-based, publicly traded (XSTO: SINCH) communications platform providing SMS, voice, and email APIs for enterprises worldwide.",
    "id": "ext-sinch",
    "location": "Stockholm, Sweden",
    "logo_url": "https://www.google.com/s2/favicons?domain=sinch.com&sz=128",
    "name": "Sinch",
    "one_liner": "Public CPaaS company for messaging, voice, and email at scale.",
    "slug": "sinch",
    "tags": [
      "CPaaS",
      "Messaging",
      "API"
    ],
    "website": "https://www.sinch.com"
  },
  {
    "category": "B2B",
    "description": "BambooHR is a privately held HR information system (HRIS) covering hiring, onboarding, payroll, and benefits for SMBs.",
    "id": "ext-bamboohr",
    "location": "Lindon, UT, USA",
    "logo_url": "https://www.google.com/s2/favicons?domain=bamboohr.com&sz=128",
    "name": "BambooHR",
    "one_liner": "HR software built for small and midsize businesses.",
    "slug": "bamboohr",
    "tags": [
      "HR Tech",
      "SaaS"
    ],
    "website": "https://www.bamboohr.com"
  },
  {
    "category": "Healthcare",
    "description": "ShiftKey is a Texas-based platform that lets healthcare facilities fill open shifts with independent, credentialed professionals, valued at over $2B.",
    "id": "ext-shiftkey",
    "location": "Irving, TX, USA",
    "logo_url": "https://www.google.com/s2/favicons?domain=shiftkey.com&sz=128",
    "name": "ShiftKey",
    "one_liner": "Marketplace connecting healthcare facilities with independent shift workers.",
    "slug": "shiftkey",
    "tags": [
      "Marketplace",
      "Healthcare",
      "Gig Economy"
    ],
    "website": "https://www.shiftkey.com"
  },
  {
    "category": "B2B",
    "description": "Ankorstore is a Paris-based wholesale marketplace connecting independent brands with retailers across Europe, valued at roughly $2B.",
    "id": "ext-ankorstore",
    "location": "Paris, France",
    "logo_url": "https://www.google.com/s2/favicons?domain=ankorstore.com&sz=128",
    "name": "Ankorstore",
    "one_liner": "European B2B wholesale marketplace for independent retailers.",
    "slug": "ankorstore",
    "tags": [
      "Marketplace",
      "Retail"
    ],
    "website": "https://www.ankorstore.com"
  },
  {
    "category": "B2B",
    "description": "Motorola Solutions is a public technology company (NYSE: MSI) whose Vigilant Solutions unit runs one of the largest commercial ALPR camera and database networks in North America.",
    "id": "ext-motorola-solutions",
    "location": "Chicago, IL, USA",
    "logo_url": "https://www.google.com/s2/favicons?domain=motorolasolutions.com&sz=128",
    "name": "Motorola Solutions (Vigilant)",
    "one_liner": "Public safety technology giant with license-plate recognition via Vigilant.",
    "slug": "motorola-solutions",
    "tags": [
      "Public Safety",
      "Hardware",
      "Security"
    ],
    "website": "https://www.motorolasolutions.com"
  },
  {
    "category": "Fintech",
    "description": "Embroker is a tech-first insurance brokerage offering self-serve commercial coverage for startups and small businesses.",
    "id": "ext-embroker",
    "location": "San Francisco, CA, USA",
    "logo_url": "https://www.google.com/s2/favicons?domain=embroker.com&sz=128",
    "name": "Embroker",
    "one_liner": "Digital commercial insurance brokerage for startups and SMBs.",
    "slug": "embroker",
    "tags": [
      "Insurance",
      "Insurtech"
    ],
    "website": "https://www.embroker.com"
  },
  {
    "category": "Healthcare",
    "description": "Everlywell sells CLIA-lab-backed at-home health tests, including a women's fertility/hormone panel, shipped direct to consumers.",
    "id": "ext-everlywell",
    "location": "Austin, TX, USA",
    "logo_url": "https://www.google.com/s2/favicons?domain=everlywell.com&sz=128",
    "name": "Everlywell",
    "one_liner": "At-home lab testing brand covering fertility, hormones, and more.",
    "slug": "everlywell",
    "tags": [
      "Consumer Health Services",
      "Women's Health",
      "DTC"
    ],
    "website": "https://www.everlywell.com"
  },
  {
    "category": "Fintech",
    "description": "Zerodha is a profitable, entirely self-funded Indian brokerage offering zero-commission equity delivery trading and direct mutual funds.",
    "id": "ext-zerodha",
    "location": "Bengaluru, KA, India",
    "logo_url": "https://www.google.com/s2/favicons?domain=zerodha.com&sz=128",
    "name": "Zerodha",
    "one_liner": "India's largest bootstrapped discount stockbroker.",
    "slug": "zerodha",
    "tags": [
      "India",
      "Investing",
      "Broking"
    ],
    "website": "https://zerodha.com"
  },
  {
    "category": "Consumer",
    "description": "Skims is a Los Angeles-based \"solutionwear\" and shapewear brand co-founded by Kim Kardashian and Jens Grede.",
    "id": "ext-skims",
    "location": "Los Angeles, CA, USA",
    "logo_url": "https://www.google.com/s2/favicons?domain=skims.com&sz=128",
    "name": "Skims",
    "one_liner": "Kim Kardashian's shapewear and loungewear label.",
    "slug": "skims",
    "tags": [
      "Apparel",
      "DTC",
      "Shapewear"
    ],
    "website": "https://skims.com"
  },
  {
    "category": "B2B",
    "description": "Remote is a VC-backed global employment platform offering EOR, payroll, and contractor management, competing directly with Deel.",
    "id": "ext-remote",
    "location": "San Francisco, CA, USA",
    "logo_url": "https://www.google.com/s2/favicons?domain=remote.com&sz=128",
    "name": "Remote",
    "one_liner": "Global HR, payroll, and Employer-of-Record platform.",
    "slug": "remote",
    "tags": [
      "HR Tech",
      "Payroll",
      "Global Employment"
    ],
    "website": "https://remote.com"
  },
  {
    "category": "B2B",
    "description": "DHL Global Forwarding is one of the world's largest traditional air and ocean freight forwarders, part of the publicly traded Deutsche Post DHL Group.",
    "id": "ext-dhl-global-forwarding",
    "location": "Bonn, Germany",
    "logo_url": "https://www.google.com/s2/favicons?domain=dhl.com&sz=128",
    "name": "DHL Global Forwarding",
    "one_liner": "Legacy global freight forwarding arm of Deutsche Post DHL.",
    "slug": "dhl-global-forwarding",
    "tags": [
      "Logistics",
      "Supply Chain and Logistics",
      "Freight"
    ],
    "website": "https://www.dhl.com/global-en/home/global-forwarding.html"
  },
  {
    "category": "Consumer",
    "description": "TikTok Shop is ByteDance's social-commerce and livestream shopping feature built into the TikTok app.",
    "id": "ext-tiktok-shop",
    "location": "Los Angeles, CA, USA; Singapore",
    "logo_url": "https://www.google.com/s2/favicons?domain=tiktok.com&sz=128",
    "name": "TikTok Shop",
    "one_liner": "ByteDance's in-app livestream and social shopping marketplace.",
    "slug": "tiktok-shop",
    "tags": [
      "Livestream Shopping",
      "E-commerce",
      "Marketplace"
    ],
    "website": "https://shop.tiktok.com"
  },
  {
    "category": "Consumer",
    "description": "Blinkit, owned by publicly traded Eternal Ltd (formerly Zomato), is India's largest quick-commerce grocery delivery service by market share.",
    "id": "ext-blinkit",
    "location": "Gurugram, HR, India",
    "logo_url": "https://www.google.com/s2/favicons?domain=blinkit.com&sz=128",
    "name": "Blinkit",
    "one_liner": "India's leading 10-minute grocery delivery app.",
    "slug": "blinkit",
    "tags": [
      "Grocery",
      "Delivery",
      "Quick Commerce"
    ],
    "website": "https://blinkit.com"
  }
];

export const curatedBattles: CuratedBattle[] = [
  {
    "featured": true,
    "id": "battle-stripe-adyen",
    "left_argument": "Developer-first APIs, docs, and startup default.",
    "right_argument": "Enterprise global acquiring and unified commerce at scale.",
    "rival_id": "ext-adyen",
    "slug": "stripe-vs-adyen",
    "space": "Payments",
    "title": "Stripe vs Adyen",
    "yc_slug": "stripe"
  },
  {
    "featured": true,
    "id": "battle-airbnb-vrbo",
    "left_argument": "Homes and experiences brand with community trust.",
    "right_argument": "Whole-home vacation rentals built for families and groups.",
    "rival_id": "ext-vrbo",
    "slug": "airbnb-vs-vrbo",
    "space": "Travel",
    "title": "Airbnb vs Vrbo",
    "yc_slug": "airbnb"
  },
  {
    "featured": true,
    "id": "battle-doordash-ubereats",
    "left_argument": "US density and merchant tooling focus.",
    "right_argument": "Global Uber network and multi-vertical logistics.",
    "rival_id": "ext-uber-eats",
    "slug": "doordash-vs-uber-eats",
    "space": "Food Delivery",
    "title": "DoorDash vs Uber Eats",
    "yc_slug": "doordash"
  },
  {
    "featured": false,
    "id": "battle-coinbase-binance",
    "left_argument": "US-regulated brand and retail trust.",
    "right_argument": "Liquidity, listings, and global volume.",
    "rival_id": "ext-binance",
    "slug": "coinbase-vs-binance",
    "space": "Crypto",
    "title": "Coinbase vs Binance",
    "yc_slug": "coinbase"
  },
  {
    "featured": false,
    "id": "battle-dropbox-gdrive",
    "left_argument": "Focused sync product and cross-platform files.",
    "right_argument": "Free bundling with Google account and Docs.",
    "rival_id": "ext-google-drive",
    "slug": "dropbox-vs-google-drive",
    "space": "Cloud Storage",
    "title": "Dropbox vs Google Drive",
    "yc_slug": "dropbox"
  },
  {
    "featured": false,
    "id": "battle-instacart-amazon",
    "left_argument": "Retailer marketplace and local shopper network.",
    "right_argument": "Prime logistics and Amazon retail gravity.",
    "rival_id": "ext-amazon-fresh",
    "slug": "instacart-vs-amazon-fresh",
    "space": "Grocery",
    "title": "Instacart vs Amazon Fresh",
    "yc_slug": "instacart"
  },
  {
    "featured": false,
    "id": "battle-gusto-adp",
    "left_argument": "SMB-friendly UX and modern benefits stack.",
    "right_argument": "Enterprise compliance breadth and incumbency.",
    "rival_id": "ext-adp",
    "slug": "gusto-vs-adp",
    "space": "Payroll",
    "title": "Gusto vs ADP",
    "yc_slug": "gusto"
  },
  {
    "featured": false,
    "id": "battle-brex-amex",
    "left_argument": "Startup spend controls and software-native cards.",
    "right_argument": "Rewards brand and corporate charge network.",
    "rival_id": "ext-amex",
    "slug": "brex-vs-amex",
    "space": "Corporate Cards",
    "title": "Brex vs American Express",
    "yc_slug": "brex"
  },
  {
    "featured": true,
    "id": "battle-twitch-youtube",
    "left_argument": "Live community culture and gaming identity.",
    "right_argument": "Audience scale and creator monetization surface.",
    "rival_id": "ext-youtube",
    "slug": "twitch-vs-youtube",
    "space": "Live Video",
    "title": "Twitch vs YouTube",
    "yc_slug": "twitch"
  },
  {
    "featured": false,
    "id": "battle-heroku-render",
    "left_argument": "Original developer PaaS with add-on ecosystem.",
    "right_argument": "Modern pricing and DX without legacy baggage.",
    "rival_id": "ext-render",
    "slug": "heroku-vs-render",
    "space": "PaaS",
    "title": "Heroku vs Render",
    "yc_slug": "heroku"
  },
  {
    "featured": true,
    "id": "battle-scale-labelbox",
    "left_argument": "Full-stack data engine for frontier AI labs.",
    "right_argument": "Self-serve labeling workflows for ML teams.",
    "rival_id": "ext-labelbox",
    "slug": "scale-ai-vs-labelbox",
    "space": "AI Data",
    "title": "Scale AI vs Labelbox",
    "yc_slug": "scale-ai"
  },
  {
    "featured": false,
    "id": "battle-plangrid-procore",
    "left_argument": "Mobile-first blueprints and field markup that construction crews adopted early.",
    "right_argument": "Public-company platform that's become the default for end-to-end construction management.",
    "rival_id": "ext-procore",
    "slug": "plangrid-vs-procore",
    "space": "Construction Tech",
    "title": "PlanGrid vs Procore",
    "yc_slug": "plangrid"
  },
  {
    "featured": false,
    "id": "battle-matterport-iguide",
    "left_argument": "Public 3D-capture leader known for its dollhouse-view digital twins.",
    "right_argument": "Measurement-grade floor plans trusted by Canadian appraisers and agents.",
    "rival_id": "ext-iguide",
    "slug": "matterport-vs-iguide",
    "space": "3D Property Tech",
    "title": "Matterport vs iGUIDE",
    "yc_slug": "matterport"
  },
  {
    "featured": false,
    "id": "battle-amplitude-pendo",
    "left_argument": "Public product-analytics platform built for deep behavioral data and experimentation.",
    "right_argument": "Combines analytics with in-app guides and feedback in one product-led-growth suite.",
    "rival_id": "ext-pendo",
    "slug": "amplitude-vs-pendo",
    "space": "Product Analytics",
    "title": "Amplitude vs Pendo",
    "yc_slug": "amplitude"
  },
  {
    "featured": false,
    "id": "battle-sendwave-remitly",
    "left_argument": "No-fee, app-first transfers focused on Africa and Asia corridors.",
    "right_argument": "Public-market scale across 170+ countries and mainstream brand trust.",
    "rival_id": "ext-remitly",
    "slug": "sendwave-vs-remitly",
    "space": "Remittances",
    "title": "Sendwave vs Remitly",
    "yc_slug": "sendwave"
  },
  {
    "featured": false,
    "id": "battle-segment-mparticle",
    "left_argument": "Twilio-owned CDP that pioneered simple one-line data collection APIs.",
    "right_argument": "Real-time CDP built for mobile-first and enterprise data orchestration.",
    "rival_id": "ext-mparticle",
    "slug": "segment-vs-mparticle",
    "space": "Customer Data Platforms",
    "title": "Segment vs mParticle",
    "yc_slug": "segment"
  },
  {
    "featured": false,
    "id": "battle-hellosign-docusign",
    "left_argument": "Simple, developer-friendly e-signatures now bundled into Dropbox.",
    "right_argument": "The category-defining public e-signature brand with the widest enterprise reach.",
    "rival_id": "ext-docusign",
    "slug": "hellosign-vs-docusign",
    "space": "eSignature",
    "title": "HelloSign vs DocuSign",
    "yc_slug": "hellosign"
  },
  {
    "featured": true,
    "id": "battle-goat-stockx",
    "left_argument": "Authentication-first marketplace with deep sneakerhead community roots.",
    "right_argument": "Bid/ask 'stock market of things' model and first-mover brand in resale.",
    "rival_id": "ext-stockx",
    "slug": "goat-vs-stockx",
    "space": "Sneaker Resale",
    "title": "GOAT Group vs StockX",
    "yc_slug": "goat-group"
  },
  {
    "featured": false,
    "id": "battle-drchrono-athenahealth",
    "left_argument": "iPad-first EHR and billing built for small and mobile practices.",
    "right_argument": "Established cloud EHR and revenue-cycle platform used by large medical groups.",
    "rival_id": "ext-athenahealth",
    "slug": "drchrono-vs-athenahealth",
    "space": "Practice Management / EHR",
    "title": "DrChrono vs athenahealth",
    "yc_slug": "drchrono"
  },
  {
    "featured": false,
    "id": "battle-pagerduty-opsgenie",
    "left_argument": "Public, standalone incident response platform deeply integrated into engineering workflows.",
    "right_argument": "On-call alerting bundled into the Atlassian suite teams already run.",
    "rival_id": "ext-opsgenie",
    "slug": "pagerduty-vs-opsgenie",
    "space": "Incident Management",
    "title": "PagerDuty vs Opsgenie",
    "yc_slug": "pagerduty"
  },
  {
    "featured": false,
    "id": "battle-optimizely-vwo",
    "left_argument": "Enterprise experimentation platform now part of a broader digital experience suite.",
    "right_argument": "Bootstrapped-turned-PE-backed A/B testing platform serving thousands of global brands.",
    "rival_id": "ext-vwo",
    "slug": "optimizely-vs-vwo",
    "space": "A/B Testing",
    "title": "Optimizely vs VWO",
    "yc_slug": "optimizely"
  },
  {
    "featured": false,
    "id": "battle-scribd-kindle-unlimited",
    "left_argument": "Multi-format library (now Everand) spanning ebooks, audiobooks, and documents with a social reading layer.",
    "right_argument": "Amazon-scale ebook and audiobook catalog bundled into the Kindle ecosystem.",
    "rival_id": "ext-kindle-unlimited",
    "slug": "scribd-vs-kindle-unlimited",
    "space": "Reading Subscriptions",
    "title": "Scribd vs Kindle Unlimited",
    "yc_slug": "scribd"
  },
  {
    "featured": false,
    "id": "battle-clever-classlink",
    "left_argument": "Widely adopted classroom single sign-on with a huge app-library.",
    "right_argument": "District-first identity and rostering platform, free to districts.",
    "rival_id": "ext-classlink",
    "slug": "clever-vs-classlink",
    "space": "Education SSO",
    "title": "Clever vs ClassLink",
    "yc_slug": "clever"
  },
  {
    "featured": false,
    "id": "battle-lever-greenhouse",
    "left_argument": "ATS plus CRM in one suite, built for proactive pipeline building.",
    "right_argument": "Structured, enterprise-grade hiring workflows and scorecards.",
    "rival_id": "ext-greenhouse",
    "slug": "lever-vs-greenhouse",
    "space": "Recruiting Software",
    "title": "Lever vs Greenhouse",
    "yc_slug": "lever"
  },
  {
    "featured": false,
    "id": "battle-zapier-make",
    "left_argument": "7,000+ app integrations and the simplest builder for quick automations.",
    "right_argument": "Visual canvas built for complex, branching multi-step workflows.",
    "rival_id": "ext-make",
    "slug": "zapier-vs-make",
    "space": "Automation",
    "title": "Zapier vs Make",
    "yc_slug": "zapier"
  },
  {
    "featured": false,
    "id": "battle-benchling-dotmatics",
    "left_argument": "Cloud-native ELN/LIMS built molecular-biology-first for modern biotech.",
    "right_argument": "Broad scientific informatics suite with deep chemistry support.",
    "rival_id": "ext-dotmatics",
    "slug": "benchling-vs-dotmatics",
    "space": "Biotech R&D Software",
    "title": "Benchling vs Dotmatics",
    "yc_slug": "benchling"
  },
  {
    "featured": false,
    "id": "battle-fivetran-matillion",
    "left_argument": "Zero-maintenance managed ELT with 700+ connectors.",
    "right_argument": "Cloud-native ETL with AI-assisted, low-code pipeline building.",
    "rival_id": "ext-matillion",
    "slug": "fivetran-vs-matillion",
    "space": "Data Integration",
    "title": "Fivetran vs Matillion",
    "yc_slug": "fivetran"
  },
  {
    "featured": false,
    "id": "battle-webflow-framer",
    "left_argument": "Mature visual CMS for complex, content-heavy sites with strong SEO.",
    "right_argument": "Design-canvas-first builder built for speed and motion.",
    "rival_id": "ext-framer",
    "slug": "webflow-vs-framer",
    "space": "No-Code Web Design",
    "title": "Webflow vs Framer",
    "yc_slug": "webflow"
  },
  {
    "featured": false,
    "id": "battle-bellabeat-oura",
    "left_argument": "Jewelry-like wearable built around women's hormonal and cycle health.",
    "right_argument": "Ring-form biometric tracker with deep sleep and readiness data.",
    "rival_id": "ext-oura",
    "slug": "bellabeat-vs-oura",
    "space": "Wellness Wearables",
    "title": "Bellabeat vs Oura",
    "yc_slug": "bellabeat"
  },
  {
    "featured": false,
    "id": "battle-weave-solutionreach",
    "left_argument": "All-in-one VOIP phone system plus texting and payments for practices.",
    "right_argument": "Communication layer with reminders, recall, and review requests.",
    "rival_id": "ext-solutionreach",
    "slug": "weave-vs-solutionreach",
    "space": "Patient Communication",
    "title": "Weave vs Solutionreach",
    "yc_slug": "weave"
  },
  {
    "featured": false,
    "id": "battle-algolia-elastic",
    "left_argument": "Managed, API-first search built for fast front-end developer experience.",
    "right_argument": "Self-hosted-or-cloud search engine with full query control at scale.",
    "rival_id": "ext-elastic",
    "slug": "algolia-vs-elastic",
    "space": "Search Infrastructure",
    "title": "Algolia vs Elastic",
    "yc_slug": "algolia"
  },
  {
    "featured": false,
    "id": "battle-checkr-first-advantage",
    "left_argument": "API-first, highly automated screening built for modern hiring platforms.",
    "right_argument": "Long-established global screening provider with enterprise scale.",
    "rival_id": "ext-first-advantage",
    "slug": "checkr-vs-first-advantage",
    "space": "Background Checks",
    "title": "Checkr vs First Advantage",
    "yc_slug": "checkr"
  },
  {
    "featured": false,
    "id": "battle-rigetti-ionq",
    "left_argument": "Superconducting-qubit quantum processors with cloud access.",
    "right_argument": "Trapped-ion quantum systems with faster-growing commercial revenue.",
    "rival_id": "ext-ionq",
    "slug": "rigetti-computing-vs-ionq",
    "space": "Quantum Computing",
    "title": "Rigetti Computing vs IonQ",
    "yc_slug": "rigetti-computing"
  },
  {
    "featured": false,
    "id": "battle-shipbob-shipmonk",
    "left_argument": "Distributed fulfillment network built for fast-growing DTC brands.",
    "right_argument": "Growth-equity-backed 3PL with tech-driven multi-warehouse fulfillment.",
    "rival_id": "ext-shipmonk",
    "slug": "shipbob-vs-shipmonk",
    "space": "E-commerce Fulfillment",
    "title": "ShipBob vs ShipMonk",
    "yc_slug": "shipbob"
  },
  {
    "featured": false,
    "id": "battle-oklo-nuscale",
    "left_argument": "Fast fission micro-reactors aimed at data centers and remote power.",
    "right_argument": "First small modular reactor design to win NRC approval and go public.",
    "rival_id": "ext-nuscale",
    "slug": "oklo-vs-nuscale-power",
    "space": "Nuclear Energy",
    "title": "Oklo vs NuScale Power",
    "yc_slug": "oklo"
  },
  {
    "featured": false,
    "id": "battle-grubmarket-sysco",
    "left_argument": "Tech-enabled marketplace and software modernizing food supply chains.",
    "right_argument": "The incumbent broadline distributor restaurants and institutions already rely on.",
    "rival_id": "ext-sysco",
    "slug": "grubmarket-vs-sysco",
    "space": "Food Distribution",
    "title": "GrubMarket vs Sysco",
    "yc_slug": "grubmarket"
  },
  {
    "featured": false,
    "id": "battle-equipmentshare-united-rentals",
    "left_argument": "Telematics-driven rental and fleet software built for contractors.",
    "right_argument": "The world's largest equipment rental company by fleet and locations.",
    "rival_id": "ext-united-rentals",
    "slug": "equipmentshare-vs-united-rentals",
    "space": "Equipment Rental",
    "title": "EquipmentShare vs United Rentals",
    "yc_slug": "equipmentshare"
  },
  {
    "featured": true,
    "id": "battle-gitlab-github",
    "left_argument": "Single-application DevSecOps platform, public since 2021.",
    "right_argument": "The default home for open-source and enterprise code, owned by Microsoft.",
    "rival_id": "ext-github",
    "slug": "gitlab-vs-github",
    "space": "DevOps",
    "title": "GitLab vs GitHub",
    "yc_slug": "gitlab"
  },
  {
    "featured": false,
    "id": "battle-razorpay-payu",
    "left_argument": "India's full-stack payments and banking infrastructure provider.",
    "right_argument": "Prosus-owned gateway with deep reach across 50+ global markets.",
    "rival_id": "ext-payu",
    "slug": "razorpay-vs-payu",
    "space": "Payments",
    "title": "Razorpay vs PayU",
    "yc_slug": "razorpay"
  },
  {
    "featured": false,
    "id": "battle-scentbird-scentbox",
    "left_argument": "Indie-friendly fragrance subscription with 450+ brands.",
    "right_argument": "Rival fragrance sampler offering 575+ scents and multi-sample plans.",
    "rival_id": "ext-scentbox",
    "slug": "scentbird-vs-scentbox",
    "space": "Fragrance Subscription",
    "title": "Scentbird vs Scentbox",
    "yc_slug": "scentbird"
  },
  {
    "featured": false,
    "id": "battle-go1-linkedin-learning",
    "left_argument": "Aggregates 250+ content providers into one corporate learning library.",
    "right_argument": "Microsoft-owned video course library bundled with the LinkedIn network.",
    "rival_id": "ext-linkedin-learning",
    "slug": "go1-vs-linkedin-learning",
    "space": "Corporate Learning",
    "title": "Go1 vs LinkedIn Learning",
    "yc_slug": "go1"
  },
  {
    "featured": false,
    "id": "battle-truebill-trim",
    "left_argument": "Now Rocket Money — tracks spending and cancels unwanted subscriptions at scale.",
    "right_argument": "OneMain-owned rival that negotiates bills and cancels subscriptions on your behalf.",
    "rival_id": "ext-trim",
    "slug": "truebill-vs-trim",
    "space": "Subscription Management",
    "title": "Truebill vs Trim",
    "yc_slug": "truebill"
  },
  {
    "featured": false,
    "id": "battle-paystack-interswitch",
    "left_argument": "Stripe-owned payments API popular with African startups and merchants.",
    "right_argument": "Nigeria's longstanding payments and card-switching infrastructure incumbent.",
    "rival_id": "ext-interswitch",
    "slug": "paystack-vs-interswitch",
    "space": "African Payments",
    "title": "Paystack vs Interswitch",
    "yc_slug": "paystack"
  },
  {
    "featured": false,
    "id": "battle-podium-birdeye",
    "left_argument": "SMS-first messaging and reviews platform for local service businesses.",
    "right_argument": "Multi-location reputation and customer experience platform backed by Marc Benioff.",
    "rival_id": "ext-birdeye",
    "slug": "podium-vs-birdeye",
    "space": "Local Business Messaging",
    "title": "Podium vs Birdeye",
    "yc_slug": "podium"
  },
  {
    "featured": false,
    "id": "battle-caper-zippin",
    "left_argument": "Instacart-owned smart cart technology now rolling out at Wegmans and other grocers.",
    "right_argument": "Computer-vision checkout-free store technology backed by SAP and Kraft Heinz's venture arm.",
    "rival_id": "ext-zippin",
    "slug": "caper-vs-zippin",
    "space": "Cashierless Retail",
    "title": "Caper vs Zippin",
    "yc_slug": "caper"
  },
  {
    "featured": false,
    "id": "battle-rappi-ifood",
    "left_argument": "Colombia-born multi-vertical super-app for delivery and financial services.",
    "right_argument": "Brazil's dominant food delivery app, owned by Prosus and Movile.",
    "rival_id": "ext-ifood",
    "slug": "rappi-vs-ifood",
    "space": "LatAm Delivery",
    "title": "Rappi vs iFood",
    "yc_slug": "rappi"
  },
  {
    "featured": false,
    "id": "battle-meesho-flipkart",
    "left_argument": "Social-commerce marketplace for value-focused Indian shoppers.",
    "right_argument": "India's largest e-commerce marketplace, majority-owned by Walmart.",
    "rival_id": "ext-flipkart",
    "slug": "meesho-vs-flipkart",
    "space": "Indian E-commerce",
    "title": "Meesho vs Flipkart",
    "yc_slug": "meesho"
  },
  {
    "featured": false,
    "id": "battle-bird-sinch",
    "left_argument": "Owns its own carrier network for faster, cheaper omnichannel messaging.",
    "right_argument": "Public CPaaS scale spanning SMS, voice, and email across 60+ countries.",
    "rival_id": "ext-sinch",
    "slug": "bird-vs-sinch",
    "space": "CPaaS",
    "title": "Bird vs Sinch",
    "yc_slug": "bird"
  },
  {
    "featured": false,
    "id": "battle-rippling-bamboohr",
    "left_argument": "Unified HR, IT, and Finance system built for fast-scaling companies.",
    "right_argument": "Long-established, SMB-friendly HRIS with deep small-business trust.",
    "rival_id": "ext-bamboohr",
    "slug": "rippling-vs-bamboohr",
    "space": "HR Tech",
    "title": "Rippling vs BambooHR",
    "yc_slug": "rippling"
  },
  {
    "featured": false,
    "id": "battle-clipboard-shiftkey",
    "left_argument": "Marketplace matching healthcare facilities with credentialed shift workers, still growing fast.",
    "right_argument": "$2B+ valued rival marketplace for independent healthcare shift work, backed by PE firms, not YC.",
    "rival_id": "ext-shiftkey",
    "slug": "clipboard-vs-shiftkey",
    "space": "Healthcare Staffing",
    "title": "Clipboard Health vs ShiftKey",
    "yc_slug": "clipboard"
  },
  {
    "featured": false,
    "id": "battle-faire-ankorstore",
    "left_argument": "Largest global wholesale marketplace connecting independent retailers and brands.",
    "right_argument": "Paris-based wholesale marketplace leader across Europe, valued at $2B.",
    "rival_id": "ext-ankorstore",
    "slug": "faire-vs-ankorstore",
    "space": "Wholesale Marketplace",
    "title": "Faire vs Ankorstore",
    "yc_slug": "faire"
  },
  {
    "featured": false,
    "id": "battle-flock-safety-motorola-solutions",
    "left_argument": "Fast-growing camera and ALPR network built for cities and neighborhoods.",
    "right_argument": "Public safety incumbent whose Vigilant unit runs a massive ALPR database.",
    "rival_id": "ext-motorola-solutions",
    "slug": "flock-safety-vs-motorola-solutions",
    "space": "Public Safety / ALPR",
    "title": "Flock Safety vs Motorola Solutions",
    "yc_slug": "flock-safety"
  },
  {
    "featured": false,
    "id": "battle-newfront-embroker",
    "left_argument": "Tech-enabled brokerage blending advisors with software for mid-market risk.",
    "right_argument": "Self-serve digital brokerage built for startups and SMBs.",
    "rival_id": "ext-embroker",
    "slug": "newfront-vs-embroker",
    "space": "Insurtech Brokerage",
    "title": "Newfront vs Embroker",
    "yc_slug": "newfront-insurance"
  },
  {
    "featured": false,
    "id": "battle-modern-fertility-everlywell",
    "left_argument": "Pioneering at-home hormone test now powering Ro's women's health line.",
    "right_argument": "Broader at-home lab testing brand that also sells a comparable women's fertility/hormone panel.",
    "rival_id": "ext-everlywell",
    "slug": "modern-fertility-vs-everlywell",
    "space": "At-Home Health Testing",
    "title": "Modern Fertility vs Everlywell",
    "yc_slug": "modern-fertility"
  },
  {
    "featured": false,
    "id": "battle-groww-zerodha",
    "left_argument": "Fast-growing, beginner-friendly investing app now India's largest broker by active users.",
    "right_argument": "Bootstrapped, debt-free pioneer of India's discount broking model.",
    "rival_id": "ext-zerodha",
    "slug": "groww-vs-zerodha",
    "space": "India Broking",
    "title": "Groww vs Zerodha",
    "yc_slug": "groww"
  },
  {
    "featured": false,
    "id": "battle-honeylove-skims",
    "left_argument": "Body-positive shapewear brand known for comfort-first engineering.",
    "right_argument": "Kim Kardashian's shapewear juggernaut and cultural phenomenon.",
    "rival_id": "ext-skims",
    "slug": "honeylove-vs-skims",
    "space": "Shapewear",
    "title": "Honeylove vs Skims",
    "yc_slug": "honeylove"
  },
  {
    "featured": false,
    "id": "battle-deel-remote",
    "left_argument": "150+ country global employment platform combining payroll, HR, and IT.",
    "right_argument": "VC-backed global EOR and payroll platform covering 100+ countries.",
    "rival_id": "ext-remote",
    "slug": "deel-vs-remote",
    "space": "Global HR & Payroll",
    "title": "Deel vs Remote",
    "yc_slug": "deel"
  },
  {
    "featured": false,
    "id": "battle-nowports-dhl-global-forwarding",
    "left_argument": "Digital-first freight forwarder streamlining LATAM trade with tech and embedded financing.",
    "right_argument": "Traditional global freight forwarding giant with legacy scale in ocean and air.",
    "rival_id": "ext-dhl-global-forwarding",
    "slug": "nowports-vs-dhl-global-forwarding",
    "space": "Freight Forwarding",
    "title": "Nowports vs DHL Global Forwarding",
    "yc_slug": "nowports"
  },
  {
    "featured": true,
    "id": "battle-whatnot-tiktok-shop",
    "left_argument": "Leading livestream marketplace built around collectibles and dedicated seller communities.",
    "right_argument": "ByteDance's in-app social shopping and livestream commerce feature reaching TikTok's massive audience.",
    "rival_id": "ext-tiktok-shop",
    "slug": "whatnot-vs-tiktok-shop",
    "space": "Livestream Shopping",
    "title": "Whatnot vs TikTok Shop",
    "yc_slug": "whatnot"
  },
  {
    "featured": true,
    "id": "battle-zepto-blinkit",
    "left_argument": "Fast-growing 10-minute grocery delivery startup with strong investor momentum.",
    "right_argument": "Market-leading quick-commerce app with 50%+ share, owned by public company Eternal (formerly Zomato).",
    "rival_id": "ext-blinkit",
    "slug": "zepto-vs-blinkit",
    "space": "Quick Commerce",
    "title": "Zepto vs Blinkit",
    "yc_slug": "zepto"
  }
];
