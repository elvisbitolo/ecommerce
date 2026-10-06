import {
  BadgeCheck,
  Drill,
  Gauge,
  HardHat,
  Hammer,
  ShieldCheck,
  Sparkles,
  Truck,
  Wrench,
} from "lucide-react";

export const categories = [
  { name: "Engineering - Tooling", slug: "engineering-tooling", detail: "Cutting, drilling, threading and milling tools", icon: Drill },
  { name: "Cutting & Sawing", slug: "cutting-sawing", parentSlug: "engineering-tooling", detail: "Cutting and sawing tools", icon: Sparkles },
  { name: "Drilling & Holemaking", slug: "drilling-holemaking", parentSlug: "engineering-tooling", detail: "Drills, bits and holemaking tools", icon: Drill },
  { name: "Threading & Tapping", slug: "threading-tapping", parentSlug: "engineering-tooling", detail: "Taps, dies and threading tools", icon: Wrench },
  { name: "Diamond Dressers, Grinding & Carbide Burrs", slug: "diamond-dressers-grinding-carbide-burrs", parentSlug: "engineering-tooling", detail: "Diamond dressers, grinding tools and carbide burrs", icon: Sparkles },
  { name: "Milling", slug: "milling", parentSlug: "engineering-tooling", detail: "Milling cutters and machine tooling", icon: Drill },
  { name: "Measuring, Marking & Testing", slug: "measuring-marking-testing", detail: "Precision measuring, marking and testing tools", icon: Gauge },
  { name: "Bore Gauges", slug: "bore-gauges", parentSlug: "measuring-marking-testing", detail: "Bore gauges and internal measurement tools", icon: Gauge },
  { name: "Calipers", slug: "calipers", parentSlug: "measuring-marking-testing", detail: "Digital, vernier, spring and outside calipers", icon: Gauge },
  { name: "Depth Gauges", slug: "depth-gauges", parentSlug: "measuring-marking-testing", detail: "Depth gauges for workshop measurement", icon: Gauge },
  { name: "Micrometers & Thickness Gauges", slug: "micrometers-thickness-gauges", parentSlug: "measuring-marking-testing", detail: "Micrometers and precision thickness gauges", icon: Gauge },
  { name: "Rulers & Levels", slug: "rulers-levels", parentSlug: "measuring-marking-testing", detail: "Rules, rulers and levels", icon: Gauge },
  { name: "Tools & Accessories", slug: "tools-accessories", detail: "Hand, power and air tools for the workshop", icon: Hammer },
  { name: "Hand Tools", slug: "hand-tools", parentSlug: "tools-accessories", detail: "Hand tools and workshop accessories", icon: Hammer },
  { name: "Power Tools", slug: "power-tools", parentSlug: "tools-accessories", detail: "Corded and cordless power tools", icon: Wrench },
  { name: "Corded Tools", slug: "corded-tools", parentSlug: "power-tools", detail: "Corded power tools", icon: Wrench },
  { name: "Cordless Tools", slug: "cordless-tools", parentSlug: "power-tools", detail: "Cordless power tools", icon: Wrench },
  { name: "Air Tools", slug: "air-tools", parentSlug: "tools-accessories", detail: "Pneumatic tools and workshop equipment", icon: Wrench },
  { name: "Abrasives", slug: "abrasives", detail: "Abrasives for cutting, grinding and finishing", icon: BadgeCheck },
  { name: "Fiber & Flap Discs", slug: "fiber-flap-discs", parentSlug: "abrasives", detail: "Fiber discs and flap discs", icon: BadgeCheck },
  { name: "Non-Woven Discs", slug: "non-woven-discs", parentSlug: "abrasives", detail: "Non-woven surface preparation discs", icon: BadgeCheck },
  { name: "Mounted Points", slug: "mounted-points", parentSlug: "abrasives", detail: "Mounted grinding points", icon: BadgeCheck },
  { name: "Diamond Blades", slug: "diamond-blades", parentSlug: "abrasives", detail: "Diamond blades for cutting applications", icon: BadgeCheck },
  { name: "Automotive Tools", slug: "automotive-tools", detail: "Vehicle service, repair and maintenance tools", icon: Truck },
  { name: "Body Repair Tools", slug: "body-repair-tools", parentSlug: "automotive-tools", detail: "Body repair and panel beating tools", icon: Truck },
  { name: "Cylinder, Piston & Valve Tools", slug: "cylinder-piston-valve-tools", parentSlug: "automotive-tools", detail: "Engine service tools", icon: Truck },
  { name: "Lubrication Tools", slug: "lubrication-tools", parentSlug: "automotive-tools", detail: "Grease and fluid handling tools", icon: Truck },
  { name: "Sealants & Lubricants", slug: "sealants-lubricants", detail: "Adhesives, sealants, lubricants and chemicals", icon: ShieldCheck },
  { name: "Adhesives & Glues", slug: "adhesives-glues", parentSlug: "sealants-lubricants", detail: "Industrial adhesives and glues", icon: ShieldCheck },
  { name: "Safety", slug: "safety", detail: "Safety footwear, PPE and protective equipment", icon: HardHat },
  { name: "Hardware & Materials", slug: "hardware-materials", detail: "Workshop hardware and materials", icon: Sparkles },
  { name: "Ladders", slug: "ladders", detail: "Ladders and access equipment", icon: ShieldCheck },
];

export const categoryGroups = categories.filter((category) => !category.parentSlug);

export function isProductInCategory(product, categorySlug) {
  let category = categories.find((item) => item.slug === product.categorySlug);

  while (category) {
    if (category.slug === categorySlug) return true;
    category = categories.find((item) => item.slug === category.parentSlug);
  }

  return false;
}

export const industries = [
  { name: "Building and Construction", slug: "building-construction", detail: "Tools and equipment for building, construction and site work." },
  { name: "Automotive Aftermarket", slug: "automotive-aftermarket", detail: "Workshop and vehicle service tools for automotive professionals." },
  { name: "Fabrication", slug: "fabrication", detail: "Machining, cutting, measuring and finishing tools for fabrication." },
];

export const newArrivalHighlights = [
  { name: "Treading Insert Tips 20mm - CNMG190612 MRT1", categorySlug: "engineering-tooling" },
  { name: "Mitutoyo 7301A Dial Thickness Gauge, 0-10mm, 0.01mm", productSlug: "mitutoyo-7301a-dial-thickness-gauge", categorySlug: "measuring-marking-testing" },
  { name: "Moore & Wright Digital Caliper 300mm 12''", productSlug: "moore-wright-digital-caliper-300mm", categorySlug: "calipers" },
  { name: 'OZAR Air Sander 6" (ASA9454)', productSlug: "ozar-air-sander-6-inch", categorySlug: "air-tools" },
  { name: 'Impact Socket 1" x 32mm - Deep', categorySlug: "hand-tools" },
  { name: "Sterling White Straight Cup Wheel 200 x 80 x 32", productSlug: "sterling-white-straight-cup-wheel", categorySlug: "mounted-points" },
  { name: "CASOMAN 18pcs Impact Drive Tool Accessory Set", productSlug: "casoman-18-piece-impact-drive-set", categorySlug: "hand-tools" },
  { name: "Plastic Welding Machine 150W (800pcs)", productSlug: "plastic-welding-machine-150w", categorySlug: "corded-tools" },
];

export const homepageCollections = [
  {
    title: "Measuring, Marking & Testing",
    eyebrow: "PRECISION FOR EVERY MEASUREMENT",
    categorySlug: "measuring-marking-testing",
    products: [
      "OZAR DIVIDER 18″ (450mm) - ADS0095",
      "Kennedy 751-003 MARKER PEN - DARK BLUE EDD7340150K",
      "ACL Flexigauge 300mm BLUE - AB-1 (0.120 - 0.229mm)",
      "Kinex Digital Height Gauge 600 / 0.02mm - 3022-05-060",
      "Kinex Outside Micrometer 0-100mm - 7002-12-100",
      "OZAR FLEXIBLE RULE 24″ / 600 MM - ASR2545",
      "OZAR Marking and Mortise Gauge (Big) - ACT7966",
      "K-MET (Kinex) Forester Caliper Red & Black LINE",
      "OZAR Dial Gauge 0-10mm - AID9400",
      "OZAR OUTSIDE CALIPER 12″ - ACS0114",
    ],
  },
  {
    title: "Machine Tools",
    eyebrow: "WORLD CLASS ENGINEERING TOOLS",
    categorySlug: "engineering-tooling",
    feature: "High Quality Milling Cutters",
    description: "Gear Cutters, Side and Face Cutters, Slot Drills & End Mills at GREAT PRICES!",
    products: [
      "OZAR TOOLBIT 5% COBALT 8 x 8 x 100mm - ATB6873",
      "OZAR L/H TOOL HOLDER 1/4″ - ATH0520",
      "Lathe Coolant Pipe 1/4″ x 12″ - Plastic",
      "OZAR DOUBLE ENDED BORING BAR WITH HOLDER 1/4″ - ABH0733",
      "OZAR 8mm CARBIDE TIP TOOL SET 10pcs - ATS6590",
      "OZAR REPLACEMENT KNURL FOR AKT0199 3/4 x 3/8 x 1/4 - AKS1075 (6pcs)",
      "OZAR KNURLING TOOL HOLDER 6 Wheels - AKT0199",
      "OZAR REVOLVING CENTRE MT-6 - ALC0496",
      "OZAR SOLID LATHE CENTER CARBIDE TIPPED MT-6 - ALC2096",
      "OZAR ST TOOL HOLDER 3/8″ - ATH0512",
    ],
  },
  {
    title: "Automotive Service Tools",
    eyebrow: "HIGH PERFORMANCE · RELIABLE, TRUSTED BRANDS",
    categorySlug: "automotive-tools",
    feature: "Vehicle service tools for professional workshops",
    products: [
      "Kennedy 1/2LTR POLYETHYLENE MEASURE KEN5405520K",
      "OZAR Grease Gun Spout 6″/150 mm, Bent - AGG8286",
      "SENATOR 1/4 DR. TORQUE WRENCH 5 - 25 NM",
      "Kennedy Piston Ring Pliers 50-100 mm - KEN5032090K",
      "Kennedy Funnel with Flexible Spout & Filter Medium Ø160mm - Red",
      "OZAR Grease Gun Spout 4″ / 100 mm, Straight - AGG8287",
      "Sealey Ball Joint Splitter - AK381",
      "Senator 1/4 DR. TORQUE WRENCH 5 - 25 Nm - SEN5570300K",
      "OZAR HYDRAULIC COUPLER 1/8 - AHC7760",
      "OZAR BUCKET GREASE PUMP 6KG (WITHOUT WHEEL) - APG7079",
    ],
  },
  {
    title: "Hot Products This Week!",
    eyebrow: "WORKSHOP ESSENTIALS",
    categorySlug: "engineering-tooling",
    feature: "Rotary Barrel Hand Pumps",
    description: "Smooth, simple drum transfer. Ideal for dispensing and transferring light- to medium-viscosity fluids. Check fluid compatibility for oil, water, or chemicals.",
    price: "From KES 11,000/-",
    products: [
      "India GEAR CUTTER - P Angle 20 Degree MOD 3 No.5",
      "OZAR DIAMOND DRESSER 1/4 CARAT - ADD1791",
      "Kennedy Allen Key 19.0mm LONG ARM",
      "Trubor Screwed Shank End Mill Std 520A - 1″",
      "Cobalt HSS Drill Bit 8.0mm",
      "Norton Quantum Cutting Disc (230mm x 1.9 x 22.23) - INOX 66252837990",
      "Norton Quantum Fibre Disc F996 (180 x 22mm) - 80",
      "Half Shank Drill Bit 17.0mm",
      "Euroboor Annular Cutter HSS 14mm x 55mm",
      "OZAR COMBINATION ANVIL & BENCH PIN - AJT1252",
    ],
  },
  {
    title: "High Performance Abrasives",
    eyebrow: "GREAT PERFORMANCE",
    categorySlug: "abrasives",
    feature: "Pink Vitrified Mounted Points",
    description: "Highly refined aluminium oxide.",
    products: [
      "Norton BLAZE RAPID STRIP 115mm 66623303783",
      "Norton RAPID POLISH 115mm 66254481899",
      "Norton Rapid Blend (115 x 22) - U4401 / NEX3SF",
      "Norton BearTex Rapid Blend (115 X 22) - F2303 / HSMA - Medium (66261020549) - Maroon",
      "Makita Cutting Disc Inox 115mm x 1mm D-75524",
      "Norton Vulcan Flap Disc 180mm x P80 (63642502345)",
      "Norton Vulcan Diamond Disc - Universal 115",
      "Norton Twist Knotted Cup Brush (65 x M14 T20)",
      "Norton RAPID PREP DISC - V FINE - BLUE 115mm 66623379028",
      "Norton Quantum Fibre Disc (180 x 22) - Grit 36",
    ],
  },
  {
    title: "Sealants, Adhesives, Lubricants & Industrial Chemicals",
    eyebrow: "MAINTENANCE & REPAIR",
    categorySlug: "sealants-lubricants",
    products: [
      "Loctite 2701 Threadlocker (Green) - 50ml",
      "Belzona 1111 (Super Metal) 1Kg Kit",
      "Loctite 648 Retaining Compound (Green) - 50ml",
      "Hylomar Advance F/HMAFOHY/085G 85gm",
      "Hylosil 310 Red High Temp Silicone 85g",
    ],
  },
];

export const homepagePromotions = [
  { eyebrow: "EUROBOOR", title: "Tungsten Carbide Rotary Burrs", copy: "Fast stock removal.", categorySlug: "engineering-tooling", tone: "copper" },
  { eyebrow: "WESAF", title: "Dye Penetrant Test Kit", copy: "Cleaner · Penetrant · Developer.", categorySlug: "measuring-marking-testing", tone: "blue" },
  { eyebrow: "NEW IN EUROBOOR", title: "Lightest 30mm Machine", copy: "With advanced safety features.", categorySlug: "engineering-tooling", tone: "slate" },
  { eyebrow: "OZAR · MEASURING", title: "Spring Calipers & Dividers", copy: "Sizes up to 24″ / 600mm.", categorySlug: "measuring-marking-testing", tone: "green" },
  { eyebrow: "OZAR", title: "Bench Vices", copy: "Available in 4″ / 6″ / 8″. Shop now.", categorySlug: "tools-accessories", tone: "copper" },
  { eyebrow: "WOODWORKING ESSENTIALS", title: "A wide selection", copy: "For professionals and DIY · for small to large projects.", categorySlug: "tools-accessories", tone: "blue" },
  { eyebrow: "BUILDING & CONSTRUCTION", title: "Solutions for the jobsite", copy: "Equipping you with tools you need.", categorySlug: "hardware-materials", tone: "green" },
];

export const homepageArticles = [
  { category: "Uncategorized", title: "The Endless Possibilities of Knurling", author: "utl-online", date: "7 Mar 2023" },
  { category: "Metalworking", title: "From Stripping to Finishing with Just One Disc", author: "utl-online", date: "7 Mar 2023" },
  { category: "Metalworking", title: "Now You Can Work Smarter Without Working Harder, Read On…", author: "utl-online", date: "7 Mar 2023" },
  { category: "Metalworking", title: "Introducing Belzona 1111 (Super Metal) – An epoxy-based composite for metal repair", author: "utl-online", date: "6 Mar 2023" },
];

export const companyHighlights = {
  title: "Why Choose United Tools Limited, Kenya?",
  subtitle: "Quality Assurance, Competitive Pricing, Expert Support",
  brands: "OZAR, K-MET (Kinex), Norton Abrasives, EUROBOOR, Kennedy, Draper, Sealey, Clarke, Addison, Denzel, MTX, Makita, Ryobi, Loctite, Belzona, UNIKA, Helicoil, Rennie, Trubor, Cetaform, RIVIT, Band-IT, Somta, Tamtek, Sykes, Senator, Gear Cutters, Lathe Tools, Hydraulic Tools, Key Steel, Silver Steel, PCL, Airmax Pneumatic, Sterling Abrasives, and Sharp.",
  destinations: "Kenya, Tanzania, Uganda, Rwanda, Burundi, Ethiopia, and South Sudan.",
  paragraphs: [
    "We supply trusted, well-known brands and industry leaders to support professional-grade work, from precision measuring to workshop maintenance. Direct supplier relationships help us offer competitive pricing.",
    "Our technical team can help with tool selection, application needs, and maintenance procedures. We work with workshops, garages, and industrial facilities, and can arrange safe, reliable delivery across Kenya and East Africa.",
    "From grease buckets to precision micrometers, we support the demanding needs of workshops, garages, and industrial facilities.",
  ],
};

export const homepageIndustryContent = [
  {
    title: "Digital Calipers & Micrometers - K-MET Precision Instruments",
    categorySlug: "measuring-marking-testing",
    copy: "K-MET measuring tools reflect over 110 years of European precision engineering. Browse digital, vernier, and Forester calipers, plus outside, tube, and internal micrometers for machining and fabrication.",
    items: ["Digital depth and internal calipers", "Dial gauges, indicators, and magnetic stands", "Height and surface marking gauges", "Steel squares, protractors, and digital protractors", "Feeler, radius, welding, and thread gauges"],
  },
  {
    title: "Power Tools Kenya - Professional Grade Equipment",
    categorySlug: "power-tools",
    copy: "Drilling and cutting equipment for metal fabrication, garage work, construction projects, and workshops.",
    items: ["EUROBOOR magnetic drills, vacuum drills, and annular cutters", "Countersinks, holesaws, twist drills, and drill-bit sets", "Angle grinders, portable band saws, and hole punchers", "Jigsaws, routers, and compound mitre saws", "Air compressors, grease guns, and rebar tying tools"],
  },
  {
    title: "Automotive Tools Kenya - Complete Vehicle Service Solutions",
    categorySlug: "automotive-tools",
    copy: "Professional service equipment for vehicle maintenance, engine work, diagnostics, and body repair.",
    items: ["Telescopic bore and angular torque gauges", "Impact adaptors, socket sets, and impact wrenches", "Adjustable hook wrenches and torque wrenches", "Mechanic's stethoscopes, radiator pressure testers, and cooling-system tools", "Oil-filter wrenches and specialized automotive hand tools", "Panel-beating kits with hammers, dollies, and forming tools", "Center-punch sets, V-blocks, and clamp jacks"],
  },
  {
    title: "Industrial Adhesives & Maintenance Solutions",
    categorySlug: "sealants-lubricants",
    copy: "Industrial products for assembly, maintenance, repair, and sealing.",
    items: ["Loctite threadlockers, instant adhesives, and structural acrylics", "Belzona 1111 repair compounds and protective coatings for pumps, pipework, and machinery", "Hylomar gasket compounds and Hylosil 300 sealing products"],
  },
  {
    title: "Hydraulic Tools & Equipment",
    categorySlug: "hardware-materials",
    copy: "Professional hydraulic crimping tools, hole punches, and cylinders for high-force construction, maintenance, and fabrication work.",
    items: [],
  },
  {
    title: "Safety Equipment & PPE",
    categorySlug: "safety",
    copy: "Protective equipment for industrial work and workshop environments.",
    items: ["ACE Mamba, ACE Chui, and ACE Duma safety shoes designed for protection and comfort", "Protective eyewear, work gloves, and specialist safety gear for welding, grinding, and machining"],
  },
  {
    title: "Testing, Quality Control & Surface Preparation",
    categorySlug: "measuring-marking-testing",
    copy: "WESAF non-destructive testing supplies include dye penetrant kits, anti-spatter nozzle gel, pickling paste, and silicone spray. Food-grade anti-spatter fluid is available for food-processing environments.",
    items: ["Industrial wire brushes for cleaning, deburring, and surface preparation"],
  },
  {
    title: "Access Equipment, Hand Tools & Workshop Solutions",
    categorySlug: "ladders",
    copy: "Metaform step, multi-purpose, extension, and platform ladders, including mobile platforms, designed to meet international safety standards. Workshop ranges also include screwdrivers, pliers, wrenches, carbide rotary burrs, taper- and half-shank drills, die stocks, Helicoil thread-repair kits, and organized tool storage.",
    items: [],
  },
];

export const footerLinkGroups = [
  {
    title: "Need Help?",
    links: ["Chat With Us", "How to Order", "Delivery Options", "Refund and Returns Policy", "Privacy Policy", "Terms and Conditions"],
  },
  {
    title: "Useful Links",
    links: ["Become a Supplier", "Become a Reseller", "Request Partnership", "Service Center", "Careers", "Contact Us"],
  },
  {
    title: "About Us",
    links: ["Our Services", "About Us", "The UTL Difference", "Customer Reviews", "Want Us To Reach Out?", "FAQs"],
  },
];

export const products = [
  {
    id: "mitutoyo-7301a",
    slug: "mitutoyo-7301a-dial-thickness-gauge",
    name: "Mitutoyo 7301A Dial Thickness Gauge",
    brand: "MITUTOYO",
    category: "Micrometers & Thickness Gauges",
    categorySlug: "micrometers-thickness-gauges",
    detail: "0-10 mm · 0.01 mm graduation",
    image: "https://utl.co.ke/wp-content/uploads/2026/04/Mitutoyo-7301A-Dial-Thickness-Gauge-0-10mm-0.01mm-300x300.jpg",
  },
  {
    id: "moore-wright-caliper",
    slug: "moore-wright-digital-caliper-300mm",
    name: "Moore & Wright Digital Caliper 300mm",
    brand: "MOORE & WRIGHT",
    category: "Calipers",
    categorySlug: "calipers",
    detail: "12 in · Digital readout",
    image: "https://utl.co.ke/wp-content/uploads/2026/09/Moore-Wright-Digital-Caliper-300mm-12inch-300x300.jpg",
  },
  {
    id: "ozar-air-sander",
    slug: "ozar-air-sander-6-inch",
    name: "OZAR Air Sander 6 inch",
    brand: "OZAR",
    category: "Air Tools",
    categorySlug: "air-tools",
    detail: "Pneumatic · Workshop finish",
    image: "https://utl.co.ke/wp-content/uploads/2026/07/OZAR-Air-Sander-5inch-6Inch-without-Vacuum-ASA-9454-300x300.jpg",
  },
  {
    id: "sterling-cup-wheel",
    slug: "sterling-white-straight-cup-wheel",
    name: "Sterling White Straight Cup Wheel",
    brand: "STERLING ABRASIVES",
    category: "Abrasives",
    categorySlug: "abrasives",
    detail: "200 x 80 x 32 mm",
    image: "https://utl.co.ke/wp-content/uploads/2025/01/Sterling-Grinding-Wheel-White-Straight-Cup-1c-300x300.jpg",
  },
  {
    id: "casoman-impact-set",
    slug: "casoman-18-piece-impact-drive-set",
    name: "CASOMAN 18-Piece Impact Drive Set",
    brand: "CASOMAN",
    category: "Hand Tools",
    categorySlug: "hand-tools",
    detail: "Impact drive tool accessories",
    image: "https://utl.co.ke/wp-content/uploads/2026/07/CASOMAN-18pcs-Impact-Drive-Tool-Accessory-Set-300x300.jpg",
  },
  {
    id: "draper-air-riveter",
    slug: "draper-air-riveter-16851",
    name: "Draper Air Riveter 16851",
    brand: "DRAPER",
    category: "Automotive Tools",
    categorySlug: "automotive-tools",
    detail: "Pneumatic riveting tool",
    image: "https://utl.co.ke/wp-content/uploads/2026/07/Draper-Air-Riveter-16851_1__85795-300x300.jpg",
  },
  {
    id: "acl-flexigauge",
    slug: "acl-flexigauge-300mm-red",
    name: "ACL Flexigauge 300mm Red",
    brand: "ACL",
    category: "Automotive Tools",
    categorySlug: "automotive-tools",
    detail: "AR-1 · 0.051-0.152 mm",
    image: "https://utl.co.ke/wp-content/uploads/2026/07/ACL-Flexigauge-Red-AR-1-300x300.jpg",
  },
  {
    id: "plastic-welding-machine",
    slug: "plastic-welding-machine-150w",
    name: "Plastic Welding Machine 150W",
    brand: "WORKSHOP TOOLS",
    category: "Corded Tools",
    categorySlug: "corded-tools",
    detail: "Repair and fabrication",
    image: "https://utl.co.ke/wp-content/uploads/2026/07/Plastic-Welding-Gun-150W-300x300.jpg",
  },
  {
    id: "kennedy-marker-pen",
    slug: "kennedy-751-003-marker-pen",
    name: "Kennedy 751-003 Marker Pen",
    brand: "KENNEDY",
    category: "Measuring, Marking & Testing",
    categorySlug: "measuring-marking-testing",
    detail: "Dark blue · Workshop marking",
    image: "https://utl.co.ke/wp-content/uploads/2026/03/Kennedy-751-003-MARKER-PEN-300x300.jpg",
  },
  {
    id: "ozar-divider",
    slug: "ozar-divider-18-inch",
    name: "OZAR Divider 18 inch",
    brand: "OZAR",
    category: "Measuring, Marking & Testing",
    categorySlug: "measuring-marking-testing",
    detail: "450mm · Layout and scribing",
    image: "https://utl.co.ke/wp-content/uploads/2026/04/OZAR-DIVIDER-18-inch-450mm-300x300.jpg",
  },
  {
    id: "norton-quantum-cutting-disc",
    slug: "norton-quantum-cutting-disc-230mm",
    name: "Norton Quantum Cutting Disc",
    brand: "NORTON",
    category: "Fiber & Flap Discs",
    categorySlug: "fiber-flap-discs",
    detail: "230mm x 1.9 x 22.23 · INOX",
    image: "https://utl.co.ke/wp-content/uploads/2026/02/Norton-Quantum-Cutting-Disc-230mm-300x300.jpg",
  },
  {
    id: "loctite-2701-threadlocker",
    slug: "loctite-2701-threadlocker-50ml",
    name: "Loctite 2701 Threadlocker",
    brand: "LOCTITE",
    category: "Adhesives & Glues",
    categorySlug: "adhesives-glues",
    detail: "Green · 50ml retaining compound",
    image: "https://utl.co.ke/wp-content/uploads/2026/03/Loctite-2701-Threadlocker-50ml-300x300.jpg",
  },
];

export const slides = [
  {
    eyebrow: "MACHINING TOOLS",
    title: "Mill. Slot. Shape.",
    copy: "End mills and slot drills for the work that calls for precision.",
    image: "https://utl.co.ke/wp-content/uploads/2026/06/slider-33-end-mills-and-slot-drills-utl.jpg",
    category: "Engineering - Tooling",
    categorySlug: "engineering-tooling",
    action: "Explore engineering tools",
  },
  {
    eyebrow: "ABRASIVES RANGE",
    title: "Finish with confidence.",
    copy: "Cutting, grinding and finishing essentials for your workshop.",
    image: "https://utl.co.ke/wp-content/uploads/2026/05/slider-32-abrasives-range-utl.jpg",
    category: "Abrasives",
    categorySlug: "abrasives",
    action: "Explore abrasives",
  },
  {
    eyebrow: "PROFESSIONAL AIR TOOLS",
    title: "Power your workshop.",
    copy: "Dependable pneumatic tools for busy bays and production floors.",
    image: "https://utl.co.ke/wp-content/uploads/2025/11/slider-29-NEW-ARRIVALS-DENZEL-b-utl.jpg",
    category: "Tools & Accessories",
    categorySlug: "tools-accessories",
    action: "Explore workshop tools",
  },
];
