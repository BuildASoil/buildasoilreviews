// lib/competitors.js
// Competitor data for /vs/[competitor] comparison pages.
// Tone is "informed, fair, and specific" — factual ingredient comparisons paired
// with explanations of what each ingredient actually does and trade-offs between them.

// The real BuildASoil Recipe 3.0 ingredient list, used on every comparison page.
const BUILDASOIL_3_INGREDIENTS = [
  'Compost',
  'Worm Castings',
  'Canadian Sphagnum Peat Moss',
  'Pumice',
  'Rice Hulls',
  'Chunky Basalt',
  'Fine Basalt',
  'BIG 6 Trace Minerals',
  'Fish Bone Meal',
  'Rice Bran',
  'Kelp Meal',
  'Mustard Seed Meal',
  'Gypsum',
  'Oyster Shell Flour',
  'Gnarly Barley Sprouted Seed Flour',
  'Calcium Silicate',
  'Bio Char (Charged)',
];

const competitors = {
  'fox-farm-ocean-forest': {
    slug: 'fox-farm-ocean-forest',
    name: 'Fox Farm Ocean Forest',
    brand: 'Fox Farm (FoxFarm Soil & Fertilizer Company)',
    comparableProduct: 'BuildASoil Potting Soil Recipe 3.0',
    reviewSearchTerms: ['3.0', 'recipe 3', 'potting soil', 'living soil', 'no till'],
    wasInSoilWars: true,
    wasIn26BagTest: true,
    blurb: 'Fox Farm Ocean Forest is one of the most widely-distributed potting soils in the US, available at most major garden retailers and big-box stores.',
    productType: 'Ready-to-use amended potting soil',
    typicalPriceRange: '$15–$25 per 1.5 cu ft (varies by retailer)',
    availableAt: 'Home Depot, Lowes, Walmart, Amazon, garden centers',
    keyIngredients: [
      'Aged forest products',
      'Sphagnum peat moss',
      'Sandy loam',
      'Perlite',
      'Earthworm castings',
      'Bat guano',
      'Fish emulsion / fish meal',
      'Crab meal',
      'Oyster shell (pH buffer)',
    ],
    pHRange: '6.3–6.8',
    organicCertification: 'Not OMRI listed (marketed as organic, but no third-party organic certification)',
    designedFor: 'General container gardening, seedlings, vegetables, houseplants, ornamentals',
    nutrientFeedingPhilosophy:
      'Designed to be fed with the Fox Farm liquid nutrient line (Grow Big, Tiger Bloom, Big Bloom) starting after the initial weeks. A "feed the plant" model.',
    livingSoilCompatible: false,
    notesOnCompatibility:
      'Contains chemical-derived nutrients and is intended to be paired with synthetic and semi-synthetic liquid feeds. Not designed as a no-till living soil system.',
    bestUseCase:
      'Growers who want a soil they can buy locally same-day, plan to use a bottled nutrient regimen, and prefer the convenience of a widely available retail product.',
    // NEW: per-ingredient analytical comparison
    ingredientNotes: [
      {
        topic: 'Aeration: Perlite vs Pumice + Rice Hulls',
        their: 'Perlite (volcanic glass, heat-popped). Inexpensive, but lightweight enough to float to the top with watering and tends to break down across grows.',
        ours: 'Pumice + rice hulls. Pumice is volcanic stone — structurally stable, doesn\'t float, doesn\'t degrade. Rice hulls add light aeration and break down into silica-rich organic matter over the grow cycle.',
      },
      {
        topic: 'Bulk material: Aged forest products vs Compost + Worm Castings',
        their: 'Aged forest products are a common low-cost bulk ingredient in mainstream potting mixes — they add volume but contribute relatively little nutrition or biological activity compared to the active ingredients.',
        ours: 'Compost and worm castings are the bulk and the nutrition. Both are biologically active and provide the microbial diversity living soil depends on.',
      },
      {
        topic: 'Nitrogen sources: Bat guano vs Plant-based amendments',
        their: 'Bat guano. Effective as a nutrient, but wild bat populations in source countries (Peru, Indonesia, Madagascar) are under pressure from over-harvesting and white-nose syndrome. Increasingly avoided by conservation-minded growers.',
        ours: 'Plant-based: rice bran, kelp meal, mustard seed meal, gnarly barley sprouted seed flour, plus fish bone meal. No bat guano.',
      },
      {
        topic: 'Fish input: Fish emulsion vs Fish bone meal',
        their: 'Fish emulsion is chemically extracted, typically using potassium hydroxide to break down fish waste into a liquid.',
        ours: 'Fish bone meal is mechanically processed — ground bones with no chemical extraction. Slower-release than emulsion.',
      },
      {
        topic: 'Minerals and biology',
        their: 'Limited mineral input beyond oyster shell as a pH buffer.',
        ours: 'Chunky and fine basalt, BIG 6 trace minerals, gypsum, oyster shell flour, calcium silicate, and pre-charged biochar for long-term nutrient holding and microbe habitat.',
      },
    ],
    whereBuildASoilWins: [
      'Living soil biology designed for reuse across multiple grow cycles, vs. one-grow amended soil',
      'Full no-till system with included amendments and water-only growing once established',
      'Independent batch soil testing publicly available (buildasoil.com/pages/batch-soil-testing)',
      'Mineral-rich amendment profile (basalt, biochar, BIG 6) beyond the basics',
    ],
    whereCompetitorWins: [
      'Significantly lower per-bag price at retail',
      'Available same-day at most garden centers and hardware stores',
      'Lower learning curve for growers who want a simple "soil + bottle nutrients" approach',
      'Strong brand recognition outside the living soil niche',
    ],
  },

  'happy-frog': {
    slug: 'happy-frog',
    name: 'Fox Farm Happy Frog',
    brand: 'Fox Farm',
    comparableProduct: 'BuildASoil Potting Soil Recipe 3.0',
    reviewSearchTerms: ['3.0', 'recipe 3', 'potting soil', 'living soil', 'seedling', 'transplant'],
    blurb: 'Happy Frog is Fox Farm\'s gentler, more biology-forward potting soil — lighter on guanos and fish, heavier on mycorrhizae and humic acids.',
    productType: 'Ready-to-use amended potting soil (biology-forward)',
    typicalPriceRange: '$15–$22 per 2 cu ft',
    availableAt: 'Home Depot, Lowes, Walmart, Amazon, garden centers',
    keyIngredients: [
      'Aged forest products',
      'Sphagnum peat moss',
      'Perlite',
      'Earthworm castings',
      'Bat guano',
      'Humic acid',
      'Soil microbes (mycorrhizal fungi)',
      'Oyster shell & dolomitic lime (pH buffer)',
    ],
    pHRange: '6.3–6.8',
    organicCertification: 'Not OMRI listed',
    designedFor: 'Seedlings, transplants, gentle container growing, houseplants',
    nutrientFeedingPhilosophy:
      'A "warm-start" mix — gentler than Ocean Forest, designed not to burn young plants. Most growers add liquid nutrients within a few weeks.',
    livingSoilCompatible: false,
    notesOnCompatibility:
      'Closer in spirit to a living soil than Ocean Forest thanks to added mycorrhizae, but still designed as a single-cycle amended mix rather than a reusable no-till system.',
    bestUseCase:
      'Seedlings, vegetable starts, and growers who want a gentler version of Ocean Forest with a bit more biology.',
    ingredientNotes: [
      {
        topic: 'Aeration: Perlite vs Pumice + Rice Hulls',
        their: 'Perlite. Floats with watering and breaks down across grow cycles, which is one reason Happy Frog is positioned as a single-cycle mix.',
        ours: 'Pumice (volcanic stone, structurally stable) and rice hulls (light organic aeration). Designed to hold up across multiple grows.',
      },
      {
        topic: 'Biology: Mycorrhizae vs Full microbial diversity + biochar',
        their: 'Mycorrhizal fungi inoculation and humic acids — a good start on biological activity.',
        ours: 'Compost and worm castings provide native microbial diversity, plus pre-charged biochar that gives microbes long-term habitat to thrive in. Mineral inputs (basalt, BIG 6 trace minerals) feed microbial activity.',
      },
      {
        topic: 'Nitrogen: Bat guano vs Plant-based',
        their: 'Bat guano is one of the active nitrogen sources. Bat populations in source regions are facing significant pressure.',
        ours: 'Plant-based amendments — kelp, mustard seed, rice bran, gnarly barley sprouted seed flour — plus fish bone meal. No bat guano.',
      },
      {
        topic: 'Designed lifecycle',
        their: 'A single-grow gentle starter mix. Generally replaced or amended heavily between grows.',
        ours: 'Designed for indefinite reuse with top-dressing. The same soil can go through multiple grow cycles when maintained.',
      },
    ],
    whereBuildASoilWins: [
      'True living soil designed for indefinite reuse via top-dressing and water-only feeding',
      'Significantly higher biological inoculation density and amendment diversity',
      'Complete no-till system documented openly (the "BuildASoil Way")',
      'Independent third-party batch soil testing',
    ],
    whereCompetitorWins: [
      'Available locally same-day, no shipping wait',
      'Lower retail price per bag',
      'Excellent reputation for not burning young seedlings',
      'Lighter weight (easier handling for casual gardeners)',
    ],
  },

  'roots-organics-original': {
    slug: 'roots-organics-original',
    name: 'Roots Organics Original',
    brand: 'Aurora Innovations',
    comparableProduct: 'BuildASoil Potting Soil Recipe 3.0',
    reviewSearchTerms: ['3.0', 'recipe 3', 'potting soil', 'living soil', 'water only', 'indoor'],
    blurb: 'Roots Organics Original is a premium coco-fiber-based amended potting soil, marketed toward serious indoor growers using heavy bottled feeding regimens.',
    productType: 'Coco-fiber-based ready-to-use potting soil',
    typicalPriceRange: '$25–$35 per 1.5 cu ft',
    availableAt: 'Hydroponics shops, specialty garden retailers, Amazon, online',
    keyIngredients: [
      'Coco fiber (coir)',
      'Perlite',
      'Peat moss',
      'Composted forest material',
      'Pumice',
      'Worm castings',
      'Bat guano',
      'Soybean meal (non-GMO)',
      'Alfalfa meal (non-GMO)',
      'Fishbone meal',
      'Kelp meal',
      'Greensand',
      'Mycorrhizal fungi',
    ],
    pHRange: 'Not officially published; balanced',
    organicCertification: 'Not OMRI listed (uses organic ingredients but no third-party certification)',
    designedFor: 'Indoor container growing, heavy-feeding crops, growers paired with bottled nutrients',
    nutrientFeedingPhilosophy:
      'Designed for heavy-feeding fast-growing plants. Aurora recommends pairing with their Roots Organics nutrient bottle line starting 10–21 days after transplant.',
    livingSoilCompatible: false,
    notesOnCompatibility:
      'Higher coco fiber content makes it dry faster and require more frequent feeding — the opposite philosophy of a water-only living soil. More of a "premium feeding medium" than a self-sustaining ecosystem.',
    bestUseCase:
      'Indoor growers who specifically want a coco-blended medium and plan to follow a bottled nutrient feeding schedule throughout the grow.',
    ingredientNotes: [
      {
        topic: 'Base medium: Coco fiber vs Peat + Compost + Castings',
        their: 'Coco fiber is the main base. Coco dries fast, demands frequent watering and feeding, and is intentionally low in inherent nutrition so growers can dial in bottled feeding.',
        ours: 'Compost, worm castings, and Canadian sphagnum peat as the base — moisture-retentive, biologically active, nutrient-dense. Designed to feed the plant from the soil, not from a bottle.',
      },
      {
        topic: 'Aeration: Perlite vs Pumice + Rice Hulls',
        their: 'Perlite and pumice both included.',
        ours: 'Pumice plus rice hulls — pumice alone for stability, rice hulls for additional light aeration that breaks down into silica-rich organic matter.',
      },
      {
        topic: 'Nitrogen sources: Bat guano vs Plant-based',
        their: 'Bat guano is part of the amendment profile. Bat populations in source regions are increasingly stressed.',
        ours: 'Plant-based nitrogen sources — kelp, mustard seed, rice bran, gnarly barley sprouted seed — plus fish bone meal. No bat guano.',
      },
      {
        topic: 'Mineral profile',
        their: 'Greensand for trace minerals plus mycorrhizal inoculation.',
        ours: 'Chunky and fine basalt, BIG 6 trace minerals, gypsum, oyster shell flour, calcium silicate, plus pre-charged biochar — broader mineral profile aimed at long-term soil health.',
      },
      {
        topic: 'Feeding model',
        their: 'Intentionally designed to require bottled nutrient inputs — ongoing cost beyond the bag.',
        ours: 'Water-only after establishment for many growers; top-dress amendments between cycles instead of constant bottle feeding.',
      },
    ],
    whereBuildASoilWins: [
      'Peat-and-compost based living soil designed for water-only growing once established',
      'No required bottled nutrient program — built-in amendments handle the cycle',
      'Designed for true no-till reuse across multiple grows',
      'Lower long-term cost when factoring in soil reuse and reduced nutrient purchases',
    ],
    whereCompetitorWins: [
      'Coco-based growers who prefer that medium for faster drying and more feeding control',
      'Strong reputation among heavy-feeder, high-EC growing styles',
      'Wider distribution in hydroponics retail',
    ],
  },

  'coast-of-maine-stonington': {
    slug: 'coast-of-maine-stonington',
    name: 'Coast of Maine Stonington Blend',
    brand: 'Coast of Maine Organic Products',
    comparableProduct: 'BuildASoil Potting Soil Recipe 3.0',
    reviewSearchTerms: ['3.0', 'recipe 3', 'potting soil', 'living soil', 'no till', 'outdoor', 'raised bed'],
    wasInSoilWars: true,
    wasIn26BagTest: true,
    blurb: 'Stonington Blend is Coast of Maine\'s premium high-performance container mix, formulated for large pots and longer feeding cycles.',
    productType: 'Premium amended container "super soil"',
    typicalPriceRange: '~$37 per 1.5 cu ft',
    availableAt: 'Coast of Maine local retailers (no big-box), specialty garden centers, Amazon',
    keyIngredients: [
      'Sphagnum peat moss',
      'Composted manure (poultry)',
      'Coconut coir',
      'Perlite',
      'Lobster shell meal',
      'Crab shell meal',
      'Kelp meal',
      'Fish bone meal',
      'Alfalfa meal',
      'Earthworm castings',
      'Mycorrhizae (Glomus intraradices)',
    ],
    pHRange: 'Balanced (specific range not published)',
    organicCertification: 'OMRI listed (many Coast of Maine products are OMRI certified)',
    designedFor: 'High-performance container growing in 15-gallon+ pots, long single-cycle grows',
    nutrientFeedingPhilosophy:
      'Marketed as "no need for expensive nutrients" when used in 15-gallon containers — designed to carry plants through a full cycle on the amendments built in.',
    livingSoilCompatible: true,
    notesOnCompatibility:
      'The closest competitor philosophically to BuildASoil. Both are amendment-rich "complete" soils designed to feed a plant through a cycle without bottled nutrients. Key differences: ingredient mix and the system design (Coast of Maine focuses per-bag; BuildASoil focuses on a documented reusable no-till system).',
    bestUseCase:
      'Outdoor and raised-bed growers in the Northeast US who want an OMRI-listed organic mix from a regional brand with strong local retail support.',
    ingredientNotes: [
      {
        topic: 'Aeration: Perlite vs Pumice + Rice Hulls',
        their: 'Perlite. Lightweight, floats, degrades across grow cycles.',
        ours: 'Pumice (volcanic stone — stable, doesn\'t float, doesn\'t degrade) plus rice hulls for additional aeration that breaks down beneficially over the grow.',
      },
      {
        topic: 'Manure: Composted poultry vs No manure',
        their: 'Composted poultry manure is one of the main amendments. Effective nutrient source; some growers prefer to avoid manure-based fertility for taste, smell, or composting concerns.',
        ours: 'No manure. Nutrition comes from worm castings, plant-based meals (kelp, mustard seed, rice bran, gnarly barley sprouted seed flour), and fish bone meal.',
      },
      {
        topic: 'Marine inputs: Lobster + crab vs Fish bone meal + oyster shell',
        their: 'Lobster shell meal and crab shell meal — regional sourcing advantage for a Maine brand. Strong calcium and chitin content.',
        ours: 'Fish bone meal and oyster shell flour for calcium and phosphorus. Different sources, similar function.',
      },
      {
        topic: 'Mineral and biological depth',
        their: 'Mycorrhizae inoculation plus the amendment profile above.',
        ours: 'Mineral-heavy: chunky and fine basalt, BIG 6 trace minerals, gypsum, calcium silicate, plus pre-charged biochar. Compost + worm castings supply native microbial diversity.',
      },
      {
        topic: 'Lifecycle',
        their: 'Designed for one strong cycle in a 15-gallon+ container.',
        ours: 'Designed for indefinite reuse with top-dressing — the same soil ecosystem can host multiple consecutive grows.',
      },
    ],
    whereBuildASoilWins: [
      'Full no-till system documentation and the "BuildASoil Way" educational program',
      'Designed for indefinite reuse across multiple grows, not single-cycle',
      'Broader product line with dedicated amendments, mineral packs, and reuse kits',
      'Larger free educational content library (YouTube, calculators, soil tests)',
    ],
    whereCompetitorWins: [
      'OMRI organic certification (BuildASoil is not OMRI listed)',
      'Strong local retail network in the Northeast — buy in-person without shipping',
      'Northeast/Maine regional brand identity and sourcing story',
      'Lower per-bag price than equivalent BuildASoil offerings in many markets',
    ],
  },
};

module.exports = { competitors, BUILDASOIL_3_INGREDIENTS };
