// Service categories. Each one becomes a page at /hire/<slug>/.
// Prices are typical marketplace ranges in USD at the time of writing. Review them before launch
// and update them every few months.
//
// costLow / costHigh = the typical launch cost used by the store launch cost calculator.

module.exports = [
  {
    slug: "logo-designer",
    name: "Logo Design",
    short: "Logo designers",
    h1: "Hire a Logo Designer for Your Online Store",
    metaTitle: "Hire a Logo Designer for Your Store: Prices, Checklist and Picks",
    metaDesc:
      "What a store logo should include, what it really costs, how to vet a designer, and hand-picked logo designers for new ecommerce brands.",
    summary: "A clean, readable logo with the right file formats for your store, packaging and ads.",
    intro:
      "Your logo shows up in your store header, on packaging, on social profiles and in every ad you run. It does not need to be expensive, but it does need to be clean, readable at small sizes and delivered in the right file formats. Here is how to get one without wasting money.",
    when: [
      "You are launching a new store and have no brand mark yet",
      "Your current logo looks blurry or unreadable on mobile and in ad thumbnails",
      "You are moving from a marketplace like Etsy or Amazon to your own store and want a proper brand",
    ],
    included: [
      "2 to 4 initial concepts based on your brief",
      "Revisions on the concept you choose",
      "Final files: SVG or AI/EPS (vector), PNG with a transparent background, and JPG",
      "Light and dark versions, plus a square icon version for social profiles and favicons",
      "Commercial use rights, and source files on higher packages",
    ],
    pricing: [
      { tier: "Basic", range: "$30 - $80", gets: "1 to 2 concepts, limited revisions, PNG and JPG files. Fine for testing a product idea." },
      { tier: "Standard", range: "$80 - $200", gets: "3 or more concepts, vector files, transparent PNG and an icon version. The sweet spot for most new stores." },
      { tier: "Premium", range: "$200 - $500+", gets: "A brand kit: logo variations, color palette, fonts, a simple brand guide and social assets." },
    ],
    costLow: 80,
    costHigh: 200,
    vetting: [
      "The portfolio shows original work in different styles, not the same template recolored",
      "Vector source files (SVG, AI or EPS) are included in the package you pick",
      "The seller asks about your audience, competitors and style, not just your store name",
      "Recent reviews mention ecommerce or small brands",
      "Revisions are clearly defined: how many, and what counts as one",
    ],
    questions: [
      "Is this design original, or based on a template or stock icon?",
      "Which file formats are included in this package?",
      "Will I get full commercial rights to use it on products and packaging?",
      "Can you show the logo on a mockup of a store header and a product label?",
    ],
    redFlags: [
      "Very low prices with unlimited concepts in 24 hours, often a sign of reused templates",
      "No vector files offered at any package level",
      "Portfolio images that look like free logo-maker results",
    ],
    tip:
      "Ask the designer to show your logo at 32px wide (favicon size) and on a dark background. If it falls apart there, it will fall apart in ad thumbnails too.",
    faqs: [
      { q: "How much should a logo cost for a new online store?", a: "Most new stores get a solid logo in the $80 to $200 range, which usually includes several concepts and vector files. Paying more makes sense when you want a full brand kit with colors, fonts and guidelines." },
      { q: "Which file formats do I need?", a: "At minimum a vector file (SVG, AI or EPS) for printing and resizing, a transparent PNG for your website, and a square icon version for social profiles and your favicon." },
      { q: "How long does logo design take?", a: "Usually 2 to 7 days, depending on the package and how many revision rounds you need. A clear brief with examples you like speeds things up a lot." },
    ],
    related: ["shopify-developer", "product-photography", "product-video-ugc"],
  },

  {
    slug: "shopify-developer",
    name: "Shopify Store Setup",
    short: "Shopify developers",
    h1: "Hire a Shopify Developer to Set Up Your Store",
    metaTitle: "Hire a Shopify Developer: Store Setup Costs, Checklist and Picks",
    metaDesc:
      "What a Shopify store setup should include, typical costs, how to vet a developer safely, and hand-picked Shopify experts for new stores.",
    summary: "Theme, products, payments, shipping and key pages set up so your store is ready to sell.",
    intro:
      "A Shopify developer can take you from an empty account to a store that is ready to sell: theme set up, products uploaded, payments and shipping configured, and the key pages in place. The biggest mistakes are overpaying for custom code you do not need, or underpaying for a setup that breaks checkout.",
    when: [
      "You have products and a Shopify account but no time to build the store",
      "Your theme looks unfinished on mobile",
      "You need products, collections and variants uploaded in bulk",
    ],
    included: [
      "Theme installation and customization: colors, fonts and homepage sections",
      "Product and collection setup, including variants",
      "Payments, shipping zones and tax settings",
      "Core pages: About, Contact, Shipping, Returns, Privacy and Terms",
      "Basic apps connected: reviews, email popup and analytics",
      "Mobile testing and a test order",
    ],
    pricing: [
      { tier: "Basic", range: "$100 - $300", gets: "Theme setup and roughly 10 to 20 products on a free or purchased theme." },
      { tier: "Standard", range: "$300 - $800", gets: "Full store setup: pages, policies, payments, shipping, apps and 20 to 50 products." },
      { tier: "Premium", range: "$800 - $2,500+", gets: "Custom sections, advanced theme edits, migrations from another platform and larger catalogs." },
    ],
    costLow: 300,
    costHigh: 800,
    vetting: [
      "The portfolio includes live Shopify store URLs you can open and test on your phone",
      "The seller states which theme they will use and whether the theme license is included",
      "The scope lists how many products and pages are included",
      "They test checkout with a test order before handover",
      "They work through Shopify collaborator access, so you never share your password",
    ],
    questions: [
      "Will you use a free theme or a paid one, and who buys the license?",
      "How many products, collections and pages are included?",
      "Will you set up shipping rates, taxes and payment methods?",
      "Do you work through Shopify collaborator access?",
      "What happens if something breaks in the first 2 weeks after delivery?",
    ],
    redFlags: [
      "Asking for your Shopify login and password instead of collaborator access",
      "Promising guaranteed sales or ready-made winning products with the setup",
      "Installing a pile of paid apps without asking you first",
    ],
    tip:
      "Shopify supports collaborator access, so a developer can work in your store without your password. If a seller insists on your login, move on.",
    faqs: [
      { q: "How long does a Shopify store setup take?", a: "Usually 3 to 10 days for a standard setup. It depends mostly on how many products you have and how quickly you send images, descriptions and policies." },
      { q: "Do I need a paid Shopify theme?", a: "No. Shopify's free themes are fast and well supported. A paid theme makes sense when you need specific features, like advanced filtering or mega menus, that a free theme does not offer." },
      { q: "Should the developer write my product descriptions too?", a: "Some can, but writing is a separate skill. For stores with more than a handful of products, a dedicated product copywriter usually gives better results." },
    ],
    related: ["logo-designer", "product-description-writer", "meta-pixel-capi-setup"],
  },

  {
    slug: "woocommerce-developer",
    name: "WooCommerce Store Setup",
    short: "WooCommerce developers",
    h1: "Hire a WooCommerce Developer to Build Your Store",
    metaTitle: "Hire a WooCommerce Developer: Setup Costs, Checklist and Picks",
    metaDesc:
      "What a WooCommerce store setup includes, what it costs, how to avoid security and speed problems, and hand-picked WooCommerce developers.",
    summary: "A WordPress store set up for speed, security and easy updates, not just good looks.",
    intro:
      "WooCommerce turns a WordPress site into a store. It is flexible and has no monthly platform fee, but it puts more responsibility on you: hosting, security, plugin updates and speed. A good developer sets it up so those things do not become problems later.",
    when: [
      "You already run a WordPress site and want to sell on it",
      "You want full control and no platform transaction fees",
      "You need custom product options that are awkward on other platforms",
    ],
    included: [
      "WordPress and WooCommerce installed on your hosting",
      "Theme setup, often a block theme or a page builder like Elementor",
      "Product, category and variation setup",
      "Payment gateways (such as Stripe, PayPal or Razorpay) and shipping zones",
      "Security basics, backups and caching for speed",
      "Policy pages and a test order",
    ],
    pricing: [
      { tier: "Basic", range: "$100 - $300", gets: "Install, theme setup and a handful of products on your existing hosting." },
      { tier: "Standard", range: "$300 - $900", gets: "Complete store: design, payments, shipping, tax, 20 to 50 products, plus speed and security setup." },
      { tier: "Premium", range: "$900 - $3,000+", gets: "Custom functionality, migrations, large catalogs, custom checkout or B2B pricing." },
    ],
    costLow: 300,
    costHigh: 900,
    vetting: [
      "Live WooCommerce sites in the portfolio that load fast on mobile",
      "They talk about speed (caching, image optimization) and security, not just design",
      "The plugins they plan to use are listed and are well maintained",
      "Admin access is handed over and their developer account is removed after the project",
      "Backups are set up before any major changes",
    ],
    questions: [
      "Which theme and page builder will you use?",
      "Which plugins will you install, and are any of them paid?",
      "Will you set up caching, backups and basic security?",
      "Does the price include hosting setup, or do I need hosting first?",
    ],
    redFlags: [
      "Nulled (pirated) premium themes or plugins, which can contain malware",
      "No mention of backups or updates",
      "Dozens of plugins for simple features",
    ],
    tip:
      "Ask for the plugin list before work starts. Every plugin is something you will need to keep updated, so fewer, well-known plugins is usually better.",
    faqs: [
      { q: "Is WooCommerce cheaper than Shopify?", a: "There is no monthly platform fee, but you pay for hosting, and premium plugins or themes add up. For many small stores the total cost ends up similar. The real difference is control versus convenience." },
      { q: "Do I need hosting before hiring a developer?", a: "Usually yes. Most sellers expect you to provide hosting and a domain, although some will help you choose and set them up as part of the project." },
      { q: "How long does a WooCommerce setup take?", a: "Typically 5 to 14 days for a standard store, longer for custom features or large catalogs." },
    ],
    related: ["logo-designer", "product-photography", "meta-pixel-capi-setup"],
  },

  {
    slug: "product-photography",
    name: "Product Photography and Editing",
    short: "Product photo editors",
    h1: "Hire Product Photo Editors and Photographers",
    metaTitle: "Hire Product Photo Editing and Photography: Prices and Picks",
    metaDesc:
      "Background removal, retouching, lifestyle images and studio shoots for online stores. Typical prices, vetting checklist and hand-picked sellers.",
    summary: "Clean, consistent product images for your store, marketplaces and ads.",
    intro:
      "Product images do most of the selling on a product page and in your ads. You can often start with good phone photos plus professional editing, then add lifestyle or studio shots once a product proves it sells.",
    when: [
      "Your photos have messy backgrounds or inconsistent lighting",
      "Marketplaces or Google Shopping need clean white-background images",
      "You need lifestyle images or ad creatives but cannot do a full shoot",
    ],
    included: [
      "Background removal and white or colored backgrounds",
      "Color correction, retouching and natural shadows",
      "Resizing for your store, marketplaces and ad placements",
      "Lifestyle composites or AI-assisted scenes on some packages",
      "Studio shoots where you ship the product to the photographer",
    ],
    pricing: [
      { tier: "Basic", range: "$1 - $5 per image", gets: "Background removal, cropping and basic retouching. Best value if you can take decent photos yourself." },
      { tier: "Standard", range: "$10 - $30 per image", gets: "Advanced retouching, shadows, lifestyle composites and ad-ready crops." },
      { tier: "Premium", range: "$150 - $500+ per set", gets: "A studio shoot with your physical product shipped to the photographer, plus edited images." },
    ],
    costLow: 50,
    costHigh: 300,
    vetting: [
      "Before-and-after samples on products similar to yours, like jewelry, clothing or furniture",
      "Clear turnaround per batch and how many revisions are included",
      "Delivery in the sizes you need, for example 2048 x 2048 pixels for most store themes",
      "For shoots: they explain shipping, insurance and whether your product is returned",
    ],
    questions: [
      "Can you do a sample on 1 or 2 images first?",
      "What file sizes and formats will you deliver?",
      "Do you use AI-generated elements, and will that be clear to me?",
      "For shoots: how do you handle shipping the product back?",
    ],
    redFlags: [
      "A portfolio made only of stock images",
      "Heavy edits that change how the real product looks, which leads to returns and complaints",
    ],
    tip:
      "Order a small test batch first. Editing quality varies a lot between sellers, and a 2-image test costs far less than redoing 100 images.",
    faqs: [
      { q: "Can I use phone photos for my store?", a: "Yes. A modern phone, good natural light and professional editing are enough for many new stores. Upgrade to studio or lifestyle shots once you know which products sell." },
      { q: "Are AI product images allowed?", a: "AI can work for backgrounds and lifestyle scenes, but the product itself must look exactly like what customers receive. Misleading images lead to returns and can break marketplace and ad policies." },
      { q: "How many images should each product have?", a: "Aim for at least 4 to 6: a main white-background shot, other angles, detail close-ups, an in-use or scale shot, and packaging if it matters to buyers." },
    ],
    related: ["product-video-ugc", "product-description-writer", "shopify-developer"],
  },

  {
    slug: "product-description-writer",
    name: "Product Description Copywriting",
    short: "Product copywriters",
    h1: "Hire a Product Description Writer for Your Store",
    metaTitle: "Hire a Product Description Writer: Prices, Checklist and Picks",
    metaDesc:
      "How to hire an ecommerce copywriter for product descriptions, collection pages and SEO titles. Typical prices, questions to ask and picks.",
    summary: "Product and collection copy that answers buyer questions and helps your pages rank.",
    intro:
      "Good product copy answers the questions a shopper would ask in a physical store: what is it, who is it for, what does it feel like, will it fit, and what happens if it does not. It also helps your pages show up in search. Here is how to hire a writer who can do both.",
    when: [
      "Many of your products have empty or copied manufacturer descriptions",
      "Your product pages get traffic but few add-to-carts",
      "You want collection and product pages that can rank in Google",
    ],
    included: [
      "Product descriptions with benefits, specs and use cases",
      "SEO titles and meta descriptions",
      "Collection or category page copy",
      "A brand story or About page",
      "Email and ad copy on some packages",
    ],
    pricing: [
      { tier: "Basic", range: "$10 - $30 per description", gets: "Short descriptions for simple products." },
      { tier: "Standard", range: "$80 - $250 per 10 products", gets: "Researched, SEO-aware descriptions with titles and meta descriptions." },
      { tier: "Premium", range: "$250 - $700+", gets: "Full store copy: collections, About page, key product pages and a brand voice guide." },
    ],
    costLow: 80,
    costHigh: 250,
    vetting: [
      "Samples in your niche, or one close to it",
      "They ask about your customer, brand voice and keywords before writing",
      "The writing is original and passes a basic plagiarism check",
      "They follow your format consistently: bullets, specs table, size guide",
      "They do not stuff keywords or make claims you cannot back up",
    ],
    questions: [
      "Will you research keywords, or should I provide them?",
      "Do you write from scratch or use AI and then edit? Either can work, as long as it is reviewed and accurate.",
      "Can you write 1 sample product first?",
      "Will you include SEO titles and meta descriptions?",
    ],
    redFlags: [
      "Copy that makes medical, safety or results claims you cannot prove",
      "Very fast bulk delivery with generic text that could fit any product",
    ],
    tip:
      "Give the writer real details: materials, dimensions, who buys it, and the top 3 questions customers ask. Generic inputs produce generic copy.",
    faqs: [
      { q: "Should product descriptions be long or short?", a: "Long enough to answer real buyer questions. Lead with the main benefit, then use bullets for specs, sizing and care instructions." },
      { q: "Is AI-written product copy okay for SEO?", a: "Google cares whether content is helpful and accurate, not how it was produced. Unedited, generic AI text usually is not helpful, so make sure a person reviews it and adds real product details." },
      { q: "Can the same writer do my ad copy?", a: "Sometimes, but ad copy is a different skill. Look for sellers who show ad samples or ad results specifically." },
    ],
    related: ["product-photography", "shopify-developer", "meta-ads-setup"],
  },

  {
    slug: "meta-ads-setup",
    name: "Meta Ads Setup",
    short: "Meta ads specialists",
    h1: "Hire a Meta Ads Expert to Set Up Facebook and Instagram Ads",
    metaTitle: "Hire a Meta Ads Expert: Facebook and Instagram Ads Setup Costs",
    metaDesc:
      "What a proper Facebook and Instagram ads setup includes, what it costs, how to spot a good specialist, and hand-picked Meta ads experts.",
    summary: "Tracking, account structure, audiences and creatives set up before you spend real budget.",
    intro:
      "Meta ads can grow a new store fast, or burn your first budget in a week. The setup decides a lot: correct tracking, a clean account structure, the right campaign objective and creatives that match your offer. This page helps you hire someone who sets it up properly.",
    when: [
      "You are ready to run ads but have never set up a business portfolio or Ads Manager",
      "Your campaigns spend money but you cannot tell which ads lead to sales",
      "You want a proper testing structure before you scale your budget",
    ],
    included: [
      "Business portfolio, ad account and page connections",
      "A Pixel and Conversions API check, or full setup (see the Pixel and CAPI page)",
      "Campaign structure with objectives matched to your goal",
      "Audience setup: broad, interest-based and retargeting",
      "Ad copy and a creative brief, or ready-made creatives on higher packages",
      "A simple guide on what to watch in the first 2 weeks",
    ],
    pricing: [
      { tier: "Basic", range: "$50 - $150", gets: "Account, page and pixel connection plus 1 basic campaign." },
      { tier: "Standard", range: "$150 - $400", gets: "Full campaign setup: prospecting and retargeting, audiences, ad copy and a testing plan." },
      { tier: "Premium", range: "$400 - $1,000+ per month", gets: "Ongoing management with creative testing, optimization and reporting." },
    ],
    costLow: 150,
    costHigh: 400,
    vetting: [
      "They ask about your margins, average order value and target cost per purchase before suggesting a budget",
      "Case studies show results with numbers like ROAS and cost per purchase, plus context",
      "They check your tracking before launching anything",
      "They can explain the campaign structure in plain language",
      "They use partner access to your own ad account instead of running ads from theirs",
    ],
    questions: [
      "What will you check in my tracking before launch?",
      "How will you structure testing for creatives and audiences?",
      "What daily budget do you recommend for testing, and why?",
      "How will you report results, and how often?",
    ],
    redFlags: [
      "Guaranteed ROAS or guaranteed sales promises",
      "Running ads from their own ad account, so you never own the data",
      "No questions about your product, margins or customer",
    ],
    tip:
      "Before you hire anyone, know your break-even ROAS: 1 divided by your profit margin before ad costs. At a 40% margin that is 2.5. A serious specialist will ask for this number.",
    faqs: [
      { q: "How much ad budget do I need to start?", a: "Enough to get meaningful data on each ad set, which depends on your target cost per purchase. A good specialist explains the budget logic for your numbers instead of quoting a random figure." },
      { q: "Should I pay for a one-time setup or ongoing management?", a: "If you can watch results and make simple changes yourself, a one-time setup plus a testing plan is often enough at the start. Ongoing management makes more sense once you have a product that sells and a bigger budget." },
      { q: "Who should own the ad account?", a: "You should. The ad account, page, pixel and audiences should sit in your own business portfolio, with the freelancer given partner or employee access." },
    ],
    related: ["meta-pixel-capi-setup", "product-video-ugc", "product-description-writer"],
  },

  {
    slug: "meta-pixel-capi-setup",
    name: "Meta Pixel and CAPI Setup",
    short: "Pixel and CAPI specialists",
    h1: "Hire an Expert to Set Up Meta Pixel and Conversions API",
    metaTitle: "Meta Pixel and Conversions API Setup: Costs, Checklist and Picks",
    metaDesc:
      "Why Pixel and Conversions API both matter, what a correct setup includes, typical costs, and hand-picked tracking specialists for Shopify and WooCommerce.",
    summary: "Accurate purchase tracking from browser and server, without double counting.",
    intro:
      "If your tracking is wrong, every decision you make in Meta ads is based on bad data. The Meta Pixel tracks events in the browser, and the Conversions API (CAPI) sends the same events from your server, which helps recover events lost to ad blockers and browser privacy settings. Set up correctly, both work together without double counting.",
    when: [
      "Ads Manager shows far fewer purchases than your store does",
      "Events Manager shows warnings about deduplication or event match quality",
      "You are about to start ads and want tracking right from day one",
    ],
    included: [
      "Pixel installation and standard events: PageView, ViewContent, AddToCart, InitiateCheckout and Purchase",
      "Conversions API through your Shopify or WooCommerce integration, server-side Google Tag Manager, or a partner app",
      "Deduplication with matching event IDs",
      "Domain verification and event configuration in Events Manager",
      "Testing with the Test Events tool and a test order",
    ],
    pricing: [
      { tier: "Basic", range: "$30 - $80", gets: "Pixel installation and standard events through a native integration." },
      { tier: "Standard", range: "$80 - $250", gets: "Pixel plus Conversions API through your platform integration, deduplication and testing." },
      { tier: "Premium", range: "$250 - $600+", gets: "Server-side Google Tag Manager, custom events, advanced matching and GA4 alignment." },
    ],
    costLow: 80,
    costHigh: 250,
    vetting: [
      "They ask which platform and theme you use before quoting",
      "They explain how browser and server events will be deduplicated",
      "They can show Events Manager screenshots from past work, including event match quality",
      "They test with real or test purchases and share proof",
      "Access is given through your business portfolio, never by sharing your Facebook password",
    ],
    questions: [
      "Will you set up CAPI through the native integration, server-side GTM or an app, and why?",
      "How will you prevent purchases from being counted twice?",
      "How will you check that Purchase events send the right value and currency?",
      "Will this work with my cookie consent setup?",
    ],
    redFlags: [
      "Pixel installed with no proof of test events",
      "Duplicate pixels installed through both theme code and an app",
      "Asking for your personal Facebook login",
    ],
    tip:
      "After setup, place a test order and check it in two places: your store admin and Test Events in Events Manager. The Purchase event should arrive once, with the right value and currency. If not, the job is not finished.",
    faqs: [
      { q: "Do I need Conversions API if I already have the Pixel?", a: "For most stores running Meta ads, yes. Browser-only tracking misses events because of ad blockers and privacy features, and the Conversions API helps recover them." },
      { q: "Does Shopify have a built-in Conversions API option?", a: "Yes. Meta's Facebook and Instagram sales channel on Shopify supports the Conversions API through its data sharing settings. A specialist can check that it is configured correctly and not duplicated by other apps." },
      { q: "How long does a Pixel and CAPI setup take?", a: "A setup through a native integration is often done within 1 to 3 days. Server-side Google Tag Manager setups take longer." },
    ],
    related: ["meta-ads-setup", "shopify-developer", "woocommerce-developer"],
  },

  {
    slug: "product-video-ugc",
    name: "Product Videos and UGC Ads",
    short: "UGC creators and video editors",
    h1: "Hire UGC Creators and Product Video Editors",
    metaTitle: "Hire UGC Creators for Product Video Ads: Prices and Picks",
    metaDesc:
      "UGC video ads and product videos for Meta, TikTok and Instagram. Typical prices, usage rights, hook testing tips and hand-picked creators.",
    summary: "Short, scroll-stopping product videos and UGC ads you can test on Meta and TikTok.",
    intro:
      "Short videos are often the strongest creatives on Meta, TikTok and Instagram. UGC (user-generated content) style ads show a real person using your product on camera, which tends to feel more trustworthy than a polished brand video. Here is how to hire creators and editors without wasting money.",
    when: [
      "Your image ads have stopped performing",
      "You need 3 to 5 new creatives every month for testing",
      "You want a product demo video for your product page",
    ],
    included: [
      "Scripts and hooks on some packages",
      "Filming by a creator with your product",
      "Editing with captions, music and a call to action",
      "Formats for Reels, Stories and feeds (9:16 and 4:5)",
      "Raw footage or multiple hook versions on higher packages",
    ],
    pricing: [
      { tier: "Basic", range: "$50 - $150", gets: "An edited product video made from footage or images you supply." },
      { tier: "Standard", range: "$100 - $300 per video", gets: "A UGC video filmed by a creator with your product, edited for ads." },
      { tier: "Premium", range: "$300 - $800+", gets: "Bundles of 3 to 5 videos, multiple hooks, raw footage and usage rights for paid ads." },
    ],
    costLow: 100,
    costHigh: 300,
    vetting: [
      "Samples show natural, confident creators in a style that fits your brand",
      "Usage rights for paid ads are clearly included in the package",
      "They offer hook variations, since the first 3 seconds matter most",
      "Delivery formats match your placements, at minimum 9:16 vertical",
      "You agree in advance on what happens to the product you ship",
    ],
    questions: [
      "Are paid ad usage rights included, and for how long?",
      "Can I get 2 or 3 hook variations of the same video?",
      "Do you write the script, or should I provide it?",
      "Will I get the raw footage?",
    ],
    redFlags: [
      "No mention of usage rights for ads",
      "Creators reading an obvious script without really handling the product",
      "Framing paid content as an independent customer review",
    ],
    tip:
      "Order one video with 3 different hooks rather than 3 completely different videos. Testing hooks is the cheapest way to find what stops the scroll.",
    faqs: [
      { q: "What is the difference between UGC and influencer content?", a: "UGC creators make content for you to post and run as ads. Influencers post to their own audience. UGC is usually cheaper and easier to test in ads." },
      { q: "Do I need to ship my product to the creator?", a: "For real UGC, yes. Budget for the product and shipping, and agree in advance whether the creator keeps it." },
      { q: "Can I present UGC as a customer review?", a: "Be careful. Presenting paid content as an independent customer review can mislead buyers and break advertising rules. Keep it honest, for example a creator demonstrating how the product works." },
    ],
    related: ["meta-ads-setup", "product-photography", "product-description-writer"],
  },
];
