import {
  Product,
  RawMaterial,
  ProductionBatch,
  QualityCheck,
  Order,
  Employee,
  Supplier,
  StockMovement,
  AppNotification,
  Settings
} from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: "PROD-101",
    name: "Classic Milk Chocolate Bar",
    category: "Milk Chocolate",
    description: "Velvety Swiss-style milk chocolate crafted with 38% single-origin Ecuadorian cocoa and alpine milk cream.",
    price: 6.50,
    weight: "100g",
    ingredients: "Cocoa butter, whole milk powder, sugar, cocoa beans, bourbon vanilla extract, sunflower lecithin",
    allergens: "Contains Milk. May contain traces of tree nuts and soy.",
    nutrition: {
      calories: "540 kcal",
      fat: "34g",
      saturatedFat: "21g",
      carbs: "52g",
      sugar: "50g",
      protein: "7.5g"
    },
    stock: 140,
    status: "Active",
    rating: 4.9,
    color: "#794426",
    badge: "Bestseller"
  },
  {
    id: "PROD-102",
    name: "Artisanal Dark Cocoa 70%",
    category: "Dark Chocolate",
    description: "Intense dark chocolate roasted with Criollo beans, featuring notes of roasted hazelnuts and red berries.",
    price: 7.50,
    weight: "90g",
    ingredients: "Single-origin cocoa beans 70%, unrefined cane sugar, cocoa butter, organic vanilla bean",
    allergens: "Vegan. May contain traces of milk and tree nuts.",
    nutrition: {
      calories: "570 kcal",
      fat: "42g",
      saturatedFat: "26g",
      carbs: "36g",
      sugar: "28g",
      protein: "8.8g"
    },
    stock: 85,
    status: "Active",
    rating: 4.8,
    color: "#3B1F13",
    badge: "Signature"
  },
  {
    id: "PROD-103",
    name: "Roasted Hazelnut Crunch",
    category: "Chocolate Bars",
    description: "Slow-roasted Piedmont hazelnuts folded into luscious 45% milk chocolate with caramelized praline flakes.",
    price: 8.00,
    weight: "120g",
    ingredients: "Cocoa beans, whole milk powder, raw cane sugar, cocoa butter, roasted Piedmont hazelnuts (22%), sea salt",
    allergens: "Contains Milk, Hazelnuts (Tree Nuts).",
    nutrition: {
      calories: "595 kcal",
      fat: "44g",
      saturatedFat: "19g",
      carbs: "41g",
      sugar: "38g",
      protein: "9.2g"
    },
    stock: 50,
    status: "Active",
    rating: 4.95,
    color: "#8C4E2D",
    badge: "Staff Favorite"
  },
  {
    id: "PROD-104",
    name: "Toasted Almond Delight",
    category: "Chocolate Bars",
    description: "Crunchy roasted California almonds immersed in deep 60% semisweet cocoa with Fleur de Sel sea salt flakes.",
    price: 7.75,
    weight: "110g",
    ingredients: "Cocoa mass, cane sugar, roasted whole almonds (20%), cocoa butter, Fleur de Sel salt, natural vanilla",
    allergens: "Contains Almonds (Tree Nuts). May contain traces of milk.",
    nutrition: {
      calories: "560 kcal",
      fat: "38g",
      saturatedFat: "18g",
      carbs: "44g",
      sugar: "32g",
      protein: "10.1g"
    },
    stock: 25,
    status: "Active",
    rating: 4.7,
    color: "#63321A",
    badge: "Limited"
  },
  {
    id: "PROD-105",
    name: "Madagascan White Vanilla",
    category: "White Chocolate",
    description: "Silky sweet confection made with pure cold-pressed cocoa butter, rich cream, and ground Madagascan vanilla pods.",
    price: 6.75,
    weight: "100g",
    ingredients: "Cocoa butter (34%), whole milk powder, sugar, skimmed milk powder, real bourbon vanilla caviar",
    allergens: "Contains Milk.",
    nutrition: {
      calories: "580 kcal",
      fat: "39g",
      saturatedFat: "24g",
      carbs: "50g",
      sugar: "50g",
      protein: "7.0g"
    },
    stock: 90,
    status: "Active",
    rating: 4.6,
    color: "#D8B486",
    badge: "Sweet Delicate"
  },
  {
    id: "PROD-106",
    name: "Salted Caramel Ganache Truffles",
    category: "Truffles",
    description: "Hand-rolled dark chocolate shells bursting with soft gooey salted golden caramel and dusted in bittersweet cocoa powder.",
    price: 14.50,
    weight: "160g (8 pcs)",
    ingredients: "Dark cocoa 65%, heavy cream, caramelized sugar, sweet cream butter, Guerande sea salt, cocoa powder",
    allergens: "Contains Milk. May contain tree nuts.",
    nutrition: {
      calories: "510 kcal",
      fat: "31g",
      saturatedFat: "20g",
      carbs: "55g",
      sugar: "46g",
      protein: "5.4g"
    },
    stock: 42,
    status: "Active",
    rating: 5.0,
    color: "#572A15",
    badge: "Award Winner"
  },
  {
    "id": "PROD-107",
    name: "Velvet Raspberry Dark Truffles",
    category: "Truffles",
    description: "Crisp 72% dark chocolate enrobing a tart and aromatic organic raspberry puree reduction infused with dark cocoa ganache.",
    price: 15.00,
    weight: "160g (8 pcs)",
    ingredients: "Cocoa beans, raspberry fruit puree, cane sugar, cocoa butter, dairy cream, natural fruit pectin",
    allergens: "Contains Milk.",
    nutrition: {
      calories: "490 kcal",
      fat: "29g",
      saturatedFat: "18g",
      carbs: "53g",
      sugar: "42g",
      protein: "5.8g"
    },
    stock: 30,
    status: "Active",
    rating: 4.85,
    color: "#4A1C16",
    badge: "New"
  },
  {
    id: "PROD-108",
    name: "Piedmont Gianduja Praline",
    category: "Filled Chocolates",
    description: "Traditional Italian Gianduja paste ground smooth with 35% hazelnut puree and golden milk chocolate.",
    price: 12.00,
    weight: "140g",
    ingredients: "Hazelnuts (35%), cane sugar, cocoa butter, whole milk powder, cocoa mass, vanilla",
    allergens: "Contains Milk, Hazelnuts.",
    nutrition: {
      calories: "610 kcal",
      fat: "46g",
      saturatedFat: "16g",
      carbs: "42g",
      sugar: "38g",
      protein: "9.8g"
    },
    stock: 60,
    status: "Active",
    rating: 4.9,
    color: "#783F23",
    badge: "Classic"
  },
  {
    id: "PROD-109",
    name: "Master Chocolatier Gift Box (16 pcs)",
    category: "Gift Boxes",
    description: "An exquisite luxury box of our sixteen finest single-origin truffles, crunchy pralines, and filled dark chocolates.",
    price: 32.00,
    weight: "320g (16 pcs)",
    ingredients: "Assorted cocoa beans, cocoa butter, cane sugar, milk cream, hazelnuts, almonds, vanilla, fruit purees, sea salt",
    allergens: "Contains Milk, Almonds, Hazelnuts. Packaged in a facility handling gluten.",
    nutrition: {
      calories: "535 kcal",
      fat: "35g",
      saturatedFat: "20g",
      carbs: "49g",
      sugar: "41g",
      protein: "6.8g"
    },
    stock: 18,
    status: "Active",
    rating: 5.0,
    color: "#2E150B",
    badge: "Luxury Box"
  },
  {
    id: "PROD-110",
    name: "Autumn Spiced Cinnamon Truffles",
    category: "Seasonal Collection",
    description: "Seasonal batch infused with Ceylon cinnamon, freshly grated nutmeg, and clove infused ganache with 62% cocoa.",
    price: 16.50,
    weight: "150g",
    ingredients: "Dark chocolate 62%, cream, organic Ceylon cinnamon, nutmeg, Madagascar vanilla, raw turbinado sugar",
    allergens: "Contains Milk.",
    nutrition: {
      calories: "505 kcal",
      fat: "32g",
      saturatedFat: "19g",
      carbs: "51g",
      sugar: "40g",
      protein: "6.0g"
    },
    stock: 0,
    status: "Out of Stock",
    rating: 4.75,
    color: "#5A2814",
    badge: "Seasonal"
  }
];

export const INITIAL_RAW_MATERIALS: RawMaterial[] = [
  {
    id: "MAT-001",
    name: "Raw Cocoa Beans (Ecuador)",
    category: "Cocoa",
    quantity: 2800,
    unit: "kg",
    minimumStock: 1000,
    supplier: "Andes Cocoa Co-operative",
    batchNumber: "CB-EC-2026-04",
    expiryDate: "2027-08-30",
    status: "In Stock",
    costPerUnit: 4.20
  },
  {
    id: "MAT-002",
    name: "Criollo Fermented Cocoa Beans",
    category: "Cocoa",
    quantity: 420,
    unit: "kg",
    minimumStock: 600,
    supplier: "Valley Gold Organics",
    batchNumber: "CB-CR-2026-01",
    expiryDate: "2027-03-15",
    status: "Low Stock",
    costPerUnit: 6.80
  },
  {
    id: "MAT-003",
    name: "Natural Dutch Cocoa Powder",
    category: "Cocoa",
    quantity: 850,
    unit: "kg",
    minimumStock: 300,
    supplier: "EuroCocoa Processors",
    batchNumber: "CP-NL-8841",
    expiryDate: "2027-06-20",
    status: "In Stock",
    costPerUnit: 5.10
  },
  {
    id: "MAT-004",
    name: "Deodorized Cocoa Butter",
    category: "Cocoa Butter",
    quantity: 1250,
    unit: "kg",
    minimumStock: 500,
    supplier: "PureCocoa Refining Ltd",
    batchNumber: "CBTR-2026-09",
    expiryDate: "2027-05-12",
    status: "In Stock",
    costPerUnit: 7.50
  },
  {
    id: "MAT-005",
    name: "Fine Caster Cane Sugar",
    category: "Sweetener",
    quantity: 2100,
    unit: "kg",
    minimumStock: 800,
    supplier: "Mauritius Sweet Imports",
    batchNumber: "SGR-2026-11",
    expiryDate: "2028-01-01",
    status: "In Stock",
    costPerUnit: 1.15
  },
  {
    id: "MAT-006",
    name: "Whole Alpine Milk Powder",
    category: "Dairy",
    quantity: 380,
    unit: "kg",
    minimumStock: 400,
    supplier: "Alpine Dairy Federation",
    batchNumber: "MLK-CH-772",
    expiryDate: "2026-10-15",
    status: "Low Stock",
    costPerUnit: 3.90
  },
  {
    id: "MAT-007",
    name: "Bourbon Vanilla Extract & Pods",
    category: "Flavoring",
    quantity: 35,
    unit: "kg",
    minimumStock: 20,
    supplier: "Madagascar Spice Trade",
    batchNumber: "VAN-MG-330",
    expiryDate: "2026-09-28",
    status: "Expiring Soon",
    costPerUnit: 145.00
  },
  {
    id: "MAT-008",
    name: "Roasted Piedmont Hazelnuts",
    category: "Nuts",
    quantity: 420,
    unit: "kg",
    minimumStock: 250,
    supplier: "Piedmont Nut Groves",
    batchNumber: "NUT-HN-441",
    expiryDate: "2027-02-18",
    status: "In Stock",
    costPerUnit: 11.20
  },
  {
    id: "MAT-009",
    name: "Blanched California Almonds",
    category: "Nuts",
    quantity: 180,
    unit: "kg",
    minimumStock: 200,
    supplier: "Pacific Nut Growers",
    batchNumber: "NUT-AL-902",
    expiryDate: "2027-01-10",
    status: "Low Stock",
    costPerUnit: 9.50
  },
  {
    id: "MAT-010",
    name: "Raw Organic Cashews",
    category: "Nuts",
    quantity: 0,
    unit: "kg",
    minimumStock: 150,
    supplier: "Kerala Harvests",
    batchNumber: "NUT-CS-112",
    expiryDate: "2026-12-05",
    status: "Out of Stock",
    costPerUnit: 10.40
  },
  {
    id: "MAT-011",
    name: "Salted Liquid Butter Caramel",
    category: "Confectionery",
    quantity: 320,
    unit: "kg",
    minimumStock: 150,
    supplier: "Breton Artisan Syrups",
    batchNumber: "CRM-BR-202",
    expiryDate: "2026-11-20",
    status: "In Stock",
    costPerUnit: 6.20
  },
  {
    id: "MAT-012",
    name: "Gold Embossed Foil Wrappers",
    category: "Packaging",
    quantity: 24000,
    unit: "units",
    minimumStock: 10000,
    supplier: "Prestige Foils & Print",
    batchNumber: "PKG-FL-5501",
    expiryDate: "2029-01-01",
    status: "In Stock",
    costPerUnit: 0.08
  },
  {
    id: "MAT-013",
    name: "Eco Kraft Chocolate Bar Boxes",
    category: "Packaging",
    quantity: 4200,
    unit: "units",
    minimumStock: 5000,
    supplier: "GreenPack Solutions",
    batchNumber: "PKG-BX-229",
    expiryDate: "2029-01-01",
    status: "Low Stock",
    costPerUnit: 0.35
  },
  {
    id: "MAT-014",
    name: "Deluxe 16-Piece Truffle Boxes",
    category: "Packaging",
    quantity: 1800,
    unit: "units",
    minimumStock: 1000,
    supplier: "Prestige Foils & Print",
    batchNumber: "PKG-GB-990",
    expiryDate: "2029-01-01",
    status: "In Stock",
    costPerUnit: 1.25
  }
];

export const INITIAL_PRODUCTION_BATCHES: ProductionBatch[] = [
  {
    id: "CH-BATCH-001",
    productId: "PROD-101",
    productName: "Classic Milk Chocolate Bar",
    plannedQuantity: 500,
    producedQuantity: 496,
    startDate: "2026-09-01",
    expectedCompletion: "2026-09-03",
    currentStage: "Packaging",
    manager: "Elena Rostova",
    status: "Approved",
    notes: "Optimal tempering curve achieved. Silky finish and clean snap.",
    recipe: [
      { materialId: "MAT-001", name: "Raw Cocoa Beans (Ecuador)", amount: 190, unit: "kg" },
      { materialId: "MAT-004", name: "Deodorized Cocoa Butter", amount: 60, unit: "kg" },
      { materialId: "MAT-005", name: "Fine Caster Cane Sugar", amount: 160, unit: "kg" },
      { materialId: "MAT-006", name: "Whole Alpine Milk Powder", amount: 90, unit: "kg" }
    ]
  },
  {
    id: "CH-BATCH-002",
    productId: "PROD-102",
    productName: "Artisanal Dark Cocoa 70%",
    plannedQuantity: 400,
    producedQuantity: 388,
    startDate: "2026-09-02",
    expectedCompletion: "2026-09-04",
    currentStage: "Tempering",
    manager: "Elena Rostova",
    status: "Rejected",
    notes: "Temperature spike during conching created sandy micro-crystallization texture.",
    recipe: [
      { materialId: "MAT-002", name: "Criollo Fermented Cocoa Beans", amount: 280, unit: "kg" },
      { materialId: "MAT-004", name: "Deodorized Cocoa Butter", amount: 40, unit: "kg" },
      { materialId: "MAT-005", name: "Fine Caster Cane Sugar", amount: 80, unit: "kg" }
    ]
  },
  {
    id: "CH-BATCH-003",
    productId: "PROD-103",
    productName: "Roasted Hazelnut Crunch",
    plannedQuantity: 350,
    producedQuantity: 350,
    startDate: "2026-09-03",
    expectedCompletion: "2026-09-05",
    currentStage: "Packaging",
    manager: "Elena Rostova",
    status: "Sent to QC",
    notes: "Awaiting final sensory and seal integrity testing before warehousing.",
    recipe: [
      { materialId: "MAT-001", name: "Raw Cocoa Beans (Ecuador)", amount: 120, unit: "kg" },
      { materialId: "MAT-008", name: "Roasted Piedmont Hazelnuts", amount: 80, unit: "kg" },
      { materialId: "MAT-005", name: "Fine Caster Cane Sugar", amount: 100, unit: "kg" },
      { materialId: "MAT-006", name: "Whole Alpine Milk Powder", amount: 50, unit: "kg" }
    ]
  },
  {
    id: "CH-BATCH-004",
    productId: "PROD-106",
    productName: "Salted Caramel Ganache Truffles",
    plannedQuantity: 300,
    producedQuantity: 0,
    startDate: "2026-09-04",
    expectedCompletion: "2026-09-06",
    currentStage: "Conching",
    manager: "Elena Rostova",
    status: "In Production",
    notes: "Conching at 55C. Caramel ganache core prepared in cooling vessel B.",
    recipe: [
      { materialId: "MAT-003", name: "Natural Dutch Cocoa Powder", amount: 80, unit: "kg" },
      { materialId: "MAT-004", name: "Deodorized Cocoa Butter", amount: 60, unit: "kg" },
      { materialId: "MAT-011", name: "Salted Liquid Butter Caramel", amount: 100, unit: "kg" },
      { materialId: "MAT-005", name: "Fine Caster Cane Sugar", amount: 60, unit: "kg" }
    ]
  },
  {
    id: "CH-BATCH-005",
    productId: "PROD-104",
    productName: "Toasted Almond Delight",
    plannedQuantity: 250,
    producedQuantity: 0,
    startDate: "2026-09-04",
    expectedCompletion: "2026-09-07",
    currentStage: "Cocoa Preparation",
    manager: "Elena Rostova",
    status: "Planned",
    notes: "Almonds scheduled for dry roasting in Kiln 2.",
    recipe: [
      { materialId: "MAT-001", name: "Raw Cocoa Beans (Ecuador)", amount: 100, unit: "kg" },
      { materialId: "MAT-009", name: "Blanched California Almonds", amount: 50, unit: "kg" },
      { materialId: "MAT-005", name: "Fine Caster Cane Sugar", amount: 70, unit: "kg" },
      { materialId: "MAT-004", name: "Deodorized Cocoa Butter", amount: 30, unit: "kg" }
    ]
  },
  {
    id: "CH-BATCH-006",
    productId: "PROD-108",
    productName: "Piedmont Gianduja Praline",
    plannedQuantity: 200,
    producedQuantity: 200,
    startDate: "2026-09-03",
    expectedCompletion: "2026-09-04",
    currentStage: "Packaging",
    manager: "Elena Rostova",
    status: "Sent to QC",
    notes: "Praline enrobed and ready for quality checks.",
    recipe: [
      { materialId: "MAT-008", name: "Roasted Piedmont Hazelnuts", amount: 70, unit: "kg" },
      { materialId: "MAT-004", name: "Deodorized Cocoa Butter", amount: 40, unit: "kg" },
      { materialId: "MAT-005", name: "Fine Caster Cane Sugar", amount: 60, unit: "kg" },
      { materialId: "MAT-001", name: "Raw Cocoa Beans (Ecuador)", amount: 30, unit: "kg" }
    ]
  }
];

export const INITIAL_QUALITY_CHECKS: QualityCheck[] = [
  {
    id: "QC-2026-001",
    batchId: "CH-BATCH-001",
    productName: "Classic Milk Chocolate Bar",
    inspector: "Dr. Marcus Vance",
    date: "2026-09-03",
    status: "Approved",
    overallResult: "Pass",
    rejectionReason: null,
    tests: {
      appearance: { status: "Pass", value: "Glossy mirror sheen, uniform color", notes: "No fat bloom or marbling detected" },
      texture: { status: "Pass", value: "Clean crisp snap at 20C, silky mouthfeel", notes: "Fineness tested < 18 microns" },
      weight: { status: "Pass", value: "100.4g (Target: 100g ± 2g)", notes: "Within standard deviation tolerance" },
      temperature: { status: "Pass", value: "18.8C tempering discharge", notes: "Proper crystallization Form V achieved" },
      moisture: { status: "Pass", value: "0.85% (Max 1.2%)", notes: "Compliant with shelf life requirements" },
      packaging: { status: "Pass", value: "Airtight foil seal, clean outer box", notes: "Lot code and expiry date printed legibly" },
      taste: { status: "Pass", value: "Rich dairy cream notes, balanced sweetness", notes: "Sensory panel unanimously scored 9.4/10" }
    },
    notes: "Premium production quality. Batch cleared for distribution to Finished Goods."
  },
  {
    id: "QC-2026-002",
    batchId: "CH-BATCH-002",
    productName: "Artisanal Dark Cocoa 70%",
    inspector: "Dr. Marcus Vance",
    date: "2026-09-04",
    status: "Rejected",
    overallResult: "Fail",
    rejectionReason: "Texture issue",
    tests: {
      appearance: { status: "Pass", value: "Deep mahogany gloss", notes: "Surface aesthetics pass standard" },
      texture: { status: "Fail", value: "Gritty particle size ~ 38 microns", notes: "Failed fineness threshold (< 20 microns)" },
      weight: { status: "Pass", value: "89.8g (Target: 90g ± 2g)", notes: "Weight is compliant" },
      temperature: { status: "Fail", value: "Overheated to 34.5C during second tempering cycle", notes: "Polymorphic destabilization" },
      moisture: { status: "Pass", value: "0.72%", notes: "Low moisture acceptable" },
      packaging: { status: "Pass", value: "Foil wrapped correctly", notes: "Packaging intact" },
      taste: { status: "Fail", value: "Slight astringency and sandy residue on palate", notes: "Does not meet brand artisanal standard" }
    },
    notes: "Severe micro-granulation due to tempering malfunction. Batch flagged for rework or melting scrap."
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: "ORD-2026-1001",
    orderDate: "2026-09-01 10:30",
    customer: {
      name: "Alice Morgan",
      email: "customer@chocofactory.com",
      phone: "+1 (555) 234-5678",
      address: "452 Maple Blossom Way, Suite 4B",
      city: "San Francisco",
      postalCode: "94107"
    },
    items: [
      { productId: "PROD-101", name: "Classic Milk Chocolate Bar", price: 6.50, quantity: 3, subtotal: 19.50 },
      { productId: "PROD-106", name: "Salted Caramel Ganache Truffles", price: 14.50, quantity: 1, subtotal: 14.50 }
    ],
    totalQuantity: 4,
    subtotal: 34.00,
    deliveryFee: 5.00,
    total: 39.00,
    paymentMethod: "Demo Card",
    paymentDetails: {
      cardholderName: "Alice Morgan",
      cardType: "Visa Demo",
      reference: "DEMO-PAY-88190"
    },
    paymentStatus: "Paid",
    orderStatus: "Delivered",
    timeline: [
      { status: "Placed", time: "2026-09-01 10:30", note: "Order placed online via Customer Shop" },
      { status: "Confirmed", time: "2026-09-01 10:45", note: "Inventory verified in Climate Vault WH-D" },
      { status: "Processing", time: "2026-09-01 12:00", note: "Allocated to packing queue" },
      { status: "Packed", time: "2026-09-01 15:20", note: "Insulated ice-pack gift wrap applied" },
      { status: "Shipped", time: "2026-09-02 08:30", note: "Dispatched via EcoCold Courier #EXP-4401" },
      { status: "Delivered", time: "2026-09-03 14:15", note: "Delivered to recipient with signature" }
    ]
  },
  {
    id: "ORD-2026-1002",
    orderDate: "2026-09-02 14:10",
    customer: {
      name: "Alice Morgan",
      email: "customer@chocofactory.com",
      phone: "+1 (555) 234-5678",
      address: "452 Maple Blossom Way, Suite 4B",
      city: "San Francisco",
      postalCode: "94107"
    },
    items: [
      { productId: "PROD-109", name: "Master Chocolatier Gift Box (16 pcs)", price: 32.00, quantity: 1, subtotal: 32.00 },
      { productId: "PROD-102", name: "Artisanal Dark Cocoa 70%", price: 7.50, quantity: 2, subtotal: 15.00 }
    ],
    totalQuantity: 3,
    subtotal: 47.00,
    deliveryFee: 5.00,
    total: 52.00,
    paymentMethod: "Demo Card",
    paymentDetails: {
      cardholderName: "Alice Morgan",
      cardType: "Mastercard Demo",
      reference: "DEMO-PAY-91044"
    },
    paymentStatus: "Paid",
    orderStatus: "Shipped",
    timeline: [
      { status: "Placed", time: "2026-09-02 14:10", note: "Order placed online" },
      { status: "Confirmed", time: "2026-09-02 14:30", note: "Payment verified" },
      { status: "Processing", time: "2026-09-02 16:00", note: "Order picked from Finished Goods" },
      { status: "Packed", time: "2026-09-03 09:00", note: "Packaged in luxury gold ribbon gift box" },
      { status: "Shipped", time: "2026-09-03 17:00", note: "In transit with tracking #TRK-9921" }
    ]
  },
  {
    id: "ORD-2026-1003",
    orderDate: "2026-09-03 18:40",
    customer: {
      name: "David Sterling",
      email: "david.sterling@luxuryhotel.com",
      phone: "+1 (555) 789-0123",
      address: "12 Grand Promenade Ave",
      city: "San Jose",
      postalCode: "95113"
    },
    items: [
      { productId: "PROD-103", name: "Roasted Hazelnut Crunch", price: 8.00, quantity: 5, subtotal: 40.00 },
      { productId: "PROD-108", name: "Piedmont Gianduja Praline", price: 12.00, quantity: 4, subtotal: 48.00 }
    ],
    totalQuantity: 9,
    subtotal: 88.00,
    deliveryFee: 0.00,
    total: 88.00,
    paymentMethod: "Cash on Delivery",
    paymentDetails: {
      cardholderName: "David Sterling",
      cardType: "COD",
      reference: "COD-ORDER-1003"
    },
    paymentStatus: "Pending",
    orderStatus: "Processing",
    timeline: [
      { status: "Placed", time: "2026-09-03 18:40", note: "Hotel mini-bar order received" },
      { status: "Confirmed", time: "2026-09-03 19:00", note: "Confirmed by factory sales manager" },
      { status: "Processing", time: "2026-09-04 08:00", note: "Being assembled in packaging line" }
    ]
  },
  {
    id: "ORD-2026-1004",
    orderDate: "2026-09-04 09:15",
    customer: {
      name: "Alice Morgan",
      email: "customer@chocofactory.com",
      phone: "+1 (555) 234-5678",
      address: "452 Maple Blossom Way, Suite 4B",
      city: "San Francisco",
      postalCode: "94107"
    },
    items: [
      { productId: "PROD-107", name: "Velvet Raspberry Dark Truffles", price: 15.00, quantity: 2, subtotal: 30.00 }
    ],
    totalQuantity: 2,
    subtotal: 30.00,
    deliveryFee: 5.00,
    total: 35.00,
    paymentMethod: "Demo Card",
    paymentDetails: {
      cardholderName: "Alice Morgan",
      cardType: "Visa Demo",
      reference: "DEMO-PAY-99512"
    },
    paymentStatus: "Paid",
    orderStatus: "Confirmed",
    timeline: [
      { status: "Placed", time: "2026-09-04 09:15", note: "Order placed successfully" },
      { status: "Confirmed", time: "2026-09-04 09:20", note: "Stock reserved in Finished Goods" }
    ]
  }
];

export const INITIAL_EMPLOYEES: Employee[] = [
  {
    id: "EMP-001",
    name: "Henrietta Dupont",
    department: "Executive Management",
    role: "Admin",
    email: "admin@chocofactory.com",
    phone: "+1 (555) 100-2001",
    joiningDate: "2020-03-15",
    status: "Active",
    password: "admin"
  },
  {
    id: "EMP-002",
    name: "Elena Rostova",
    department: "Production & Processing",
    role: "Production Manager",
    email: "production@chocofactory.com",
    phone: "+1 (555) 100-2002",
    joiningDate: "2021-06-01",
    status: "Active",
    password: "production"
  },
  {
    id: "EMP-003",
    name: "Dr. Marcus Vance",
    department: "Quality Control & Compliance",
    role: "QC Manager",
    email: "qc@chocofactory.com",
    phone: "+1 (555) 100-2003",
    joiningDate: "2022-01-10",
    status: "Active",
    password: "qc"
  },
  {
    id: "EMP-004",
    name: "Silvia Ramos",
    department: "Supply Chain & Warehousing",
    role: "Inventory Manager",
    email: "inventory@chocofactory.com",
    phone: "+1 (555) 100-2004",
    joiningDate: "2021-11-20",
    status: "Active",
    password: "inventory"
  },
  {
    id: "EMP-005",
    name: "Jean-Luc Moreau",
    department: "Production & Processing",
    role: "Production Manager",
    email: "jeanluc@chocofactory.com",
    phone: "+1 (555) 100-2005",
    joiningDate: "2023-04-12",
    status: "Active",
    password: "pass"
  }
];

export const INITIAL_SUPPLIERS: Supplier[] = [
  {
    id: "SUP-01",
    companyName: "Andes Cocoa Co-operative",
    contactPerson: "Mateo Delgado",
    phone: "+593 2 299 1800",
    email: "orders@andescocoa.org",
    address: "Calle de los Molinos 42, Quito, Ecuador",
    materialsSupplied: ["Raw Cocoa Beans (Ecuador)", "Raw Cocoa Nibs"],
    status: "Active",
    leadTimeDays: 14,
    rating: 4.9
  },
  {
    id: "SUP-02",
    companyName: "Valley Gold Organics",
    contactPerson: "Beatriz Solano",
    phone: "+506 2200 4488",
    email: "sales@valleygold.cr",
    address: "Valle Central km 18, San Jose, Costa Rica",
    materialsSupplied: ["Criollo Fermented Cocoa Beans"],
    status: "Preferred",
    leadTimeDays: 21,
    rating: 4.8
  },
  {
    id: "SUP-03",
    companyName: "EuroCocoa Processors",
    contactPerson: "Dirk van Houten",
    phone: "+31 20 555 3110",
    email: "supply@eurococoa.nl",
    address: "Havenweg 84, Amsterdam Port, Netherlands",
    materialsSupplied: ["Natural Dutch Cocoa Powder", "Deodorized Cocoa Butter"],
    status: "Active",
    leadTimeDays: 7,
    rating: 4.7
  },
  {
    id: "SUP-04",
    companyName: "Alpine Dairy Federation",
    contactPerson: "Lucia Meier",
    phone: "+41 31 880 2000",
    email: "contracts@alpinedairy.ch",
    address: "Milchstrasse 14, Bern, Switzerland",
    materialsSupplied: ["Whole Alpine Milk Powder", "Sweet Cream Powder"],
    status: "Preferred",
    leadTimeDays: 5,
    rating: 5.0
  },
  {
    id: "SUP-05",
    companyName: "Piedmont Nut Groves",
    contactPerson: "Gianni Ferrero",
    phone: "+39 0173 440100",
    email: "export@piedmontnuts.it",
    address: "Via Nocciola 9, Alba (CN), Italy",
    materialsSupplied: ["Roasted Piedmont Hazelnuts", "Hazelnut Gianduja Paste"],
    status: "Active",
    leadTimeDays: 10,
    rating: 4.9
  },
  {
    id: "SUP-06",
    companyName: "Prestige Foils & Print",
    contactPerson: "Clara Sterling",
    phone: "+1 (555) 774-8800",
    email: "sales@prestigefoils.com",
    address: "88 Industrial Parkway, Chicago, IL",
    materialsSupplied: ["Gold Embossed Foil Wrappers", "Deluxe 16-Piece Truffle Boxes"],
    status: "Active",
    leadTimeDays: 8,
    rating: 4.6
  },
  {
    id: "SUP-07",
    companyName: "GreenPack Solutions",
    contactPerson: "Nathan Ross",
    phone: "+1 (555) 612-4490",
    email: "hello@greenpack.eco",
    address: "304 Eco Boulevard, Portland, OR",
    materialsSupplied: ["Eco Kraft Chocolate Bar Boxes"],
    status: "Under Review",
    leadTimeDays: 6,
    rating: 4.3
  }
];

export const INITIAL_STOCK_MOVEMENTS: StockMovement[] = [
  {
    id: "SM-2026-101",
    materialId: "MAT-001",
    materialName: "Raw Cocoa Beans (Ecuador)",
    movementType: "Received",
    quantity: 1000,
    unit: "kg",
    previousStock: 1800,
    newStock: 2800,
    date: "2026-08-30 09:15",
    reason: "Shipment delivery from Andes Cocoa Co-op PO-901",
    performedBy: "Silvia Ramos"
  },
  {
    id: "SM-2026-102",
    materialId: "MAT-001",
    materialName: "Raw Cocoa Beans (Ecuador)",
    movementType: "Issued",
    quantity: -190,
    unit: "kg",
    previousStock: 2990,
    newStock: 2800,
    date: "2026-09-01 07:30",
    reason: "Issued for production batch CH-BATCH-001",
    performedBy: "Silvia Ramos"
  },
  {
    id: "SM-2026-103",
    materialId: "MAT-004",
    materialName: "Deodorized Cocoa Butter",
    movementType: "Issued",
    quantity: -60,
    unit: "kg",
    previousStock: 1310,
    newStock: 1250,
    date: "2026-09-01 07:35",
    reason: "Issued for production batch CH-BATCH-001",
    performedBy: "Silvia Ramos"
  },
  {
    id: "SM-2026-104",
    materialId: "PROD-101",
    materialName: "Classic Milk Chocolate Bar",
    movementType: "Finished Goods Stocked",
    quantity: 496,
    unit: "units",
    previousStock: 0,
    newStock: 496,
    date: "2026-09-03 16:45",
    reason: "QC Approved batch CH-BATCH-001 transfer to Warehouse D",
    performedBy: "Silvia Ramos"
  },
  {
    id: "SM-2026-105",
    materialId: "MAT-008",
    materialName: "Roasted Piedmont Hazelnuts",
    movementType: "Adjusted",
    quantity: -10,
    unit: "kg",
    previousStock: 430,
    newStock: 420,
    date: "2026-09-02 11:20",
    reason: "Spillage during silo calibration, reconciled in audit",
    performedBy: "Silvia Ramos"
  },
  {
    id: "SM-2026-106",
    materialId: "MAT-012",
    materialName: "Gold Embossed Foil Wrappers",
    movementType: "Received",
    quantity: 5000,
    unit: "units",
    previousStock: 19000,
    newStock: 24000,
    date: "2026-09-03 14:00",
    reason: "Replenishment delivery from Prestige Foils",
    performedBy: "Silvia Ramos"
  }
];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: "NOTIF-01",
    timestamp: "2026-09-04 09:20",
    type: "warning",
    targetRole: "All",
    message: "Raw Organic Cashews (MAT-010) is Out of Stock (0 kg). Restock required.",
    read: false
  },
  {
    id: "NOTIF-02",
    timestamp: "2026-09-04 09:10",
    type: "info",
    targetRole: "Quality Control Manager",
    message: "Batch CH-BATCH-003 (Roasted Hazelnut Crunch) is completed and ready for QC inspection.",
    read: false
  },
  {
    id: "NOTIF-03",
    timestamp: "2026-09-04 08:45",
    type: "danger",
    targetRole: "Production Manager",
    message: "Batch CH-BATCH-002 was rejected by QC due to Texture issue (gritty particle fineness).",
    read: true
  },
  {
    id: "NOTIF-04",
    timestamp: "2026-09-03 17:00",
    type: "success",
    targetRole: "Customer",
    message: "Your order ORD-2026-1002 has been shipped with tracking number TRK-9921.",
    read: true
  }
];

export const INITIAL_SETTINGS: Settings = {
  factoryName: "Maison Artisanal Chocolate Mills",
  facilityCode: "FAC-CA-802",
  currency: "$",
  currencyCode: "USD",
  standardShippingFee: 5.00,
  freeShippingThreshold: 50.00,
  qcMaxMoisturePercent: 1.2,
  temperingTargetTempC: 18.5,
  conchingDurationHours: 24,
  defaultTaxRate: 0.08,
  address: "740 Cocoa Mill Way, Suite 100, Vallejo, CA 94590",
  supportEmail: "contact@artisanalchocofactory.com",
  supportPhone: "+1 (555) 100-2462",
  autoReserveStock: true,
  operatingMode: "Full Factory Production & Customer Direct E-Commerce"
};
