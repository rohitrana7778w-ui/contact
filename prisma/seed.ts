// @ts-ignore
declare const process: any;
import { PrismaClient, Role, ProviderType, AvailabilityStatus, VerificationType, VerificationStatus } from "@prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...");

  // Clean existing data
  await prisma.savedProvider.deleteMany();
  await prisma.contactEvent.deleteMany();
  await prisma.complaint.deleteMany();
  await prisma.trustScoreLog.deleteMany();
  await prisma.verification.deleteMany();
  await prisma.review.deleteMany();
  await prisma.portfolioProject.deleteMany();
  await prisma.providerService.deleteMany();
  await prisma.service.deleteMany();
  await prisma.category.deleteMany();
  await prisma.provider.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash("Password@123", 10);

  // 1. Create Admin & Customers
  const admin = await prisma.user.create({
    data: {
      email: "admin@trustlocal.in",
      hashedPassword: passwordHash,
      name: "Admin Officer",
      phone: "+919876543210",
      role: Role.ADMIN,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
    },
  });

  const customer1 = await prisma.user.create({
    data: {
      email: "rahul.dehradun@example.com",
      hashedPassword: passwordHash,
      name: "Rahul Rawat",
      phone: "+919812345678",
      role: Role.CUSTOMER,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    },
  });

  const customer2 = await prisma.user.create({
    data: {
      email: "priya.sharma@example.com",
      hashedPassword: passwordHash,
      name: "Priya Sharma",
      phone: "+919876123456",
      role: Role.CUSTOMER,
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
    },
  });

  console.log("✅ Created Admin and Customers");

  // 2. Create Categories & Subcategories
  const homeServices = await prisma.category.create({
    data: {
      name: "Home Services",
      slug: "home-services",
      description: "Electricians, plumbers, AC technicians, appliance repairs, and carpenters for your home.",
      icon: "Home",
      sortOrder: 1,
    },
  });

  const techServices = await prisma.category.create({
    data: {
      name: "Technology & CCTV",
      slug: "technology-services",
      description: "Laptop, computer, smartphone repair, CCTV setup, and home/office networking.",
      icon: "Cpu",
      sortOrder: 2,
    },
  });

  const vehicleServices = await prisma.category.create({
    data: {
      name: "Vehicle Services",
      slug: "vehicle-services",
      description: "Mechanics, car detailing, battery services, and on-demand vehicle electricals.",
      icon: "Car",
      sortOrder: 3,
    },
  });

  const constructionServices = await prisma.category.create({
    data: {
      name: "Construction & Civil",
      slug: "construction-services",
      description: "House contractors, civil engineers, tile work, masonry, and full house renovations.",
      icon: "HardHat",
      sortOrder: 4,
    },
  });

  // Services
  const sAc = await prisma.service.create({
    data: {
      name: "AC Repair & Installation",
      slug: "ac-repair-installation",
      categoryId: homeServices.id,
      keywords: ["ac repair", "ac not cooling", "gas refill", "split ac install", "ac servicing", "inverter ac"],
    },
  });

  const sElectrician = await prisma.service.create({
    data: {
      name: "Electrician Services",
      slug: "electrician-services",
      categoryId: homeServices.id,
      keywords: ["electrician", "short circuit", "wiring", "mcb tripping", "inverter installation", "light fitting"],
    },
  });

  const sPlumber = await prisma.service.create({
    data: {
      name: "Plumbing & Leakage",
      slug: "plumbing-leakage",
      categoryId: homeServices.id,
      keywords: ["plumber", "water leakage", "pipe bursting", "tap repair", "drainage cleaning", "geyser repair"],
    },
  });

  const sAppliance = await prisma.service.create({
    data: {
      name: "Washing Machine & Refrigerator",
      slug: "appliance-repair",
      categoryId: homeServices.id,
      keywords: ["fridge repair", "refrigerator not cooling", "washing machine repair", "noise in washing machine"],
    },
  });

  const sLaptop = await prisma.service.create({
    data: {
      name: "Laptop & PC Repair",
      slug: "laptop-pc-repair",
      categoryId: techServices.id,
      keywords: ["laptop repair", "screen broken", "macbook repair", "slow computer", "ram upgrade", "virus removal"],
    },
  });

  const sCctv = await prisma.service.create({
    data: {
      name: "CCTV Installation & Security",
      slug: "cctv-installation-security",
      categoryId: techServices.id,
      keywords: ["cctv camera", "camera setup", "dvr installation", "wifi camera", "ip camera"],
    },
  });

  const sCarMechanic = await prisma.service.create({
    data: {
      name: "Car Mechanic & Engine Work",
      slug: "car-mechanic-engine-work",
      categoryId: vehicleServices.id,
      keywords: ["car mechanic", "brake issue", "car breakdown", "clutch plate", "car engine repair", "oil change"],
    },
  });

  const sContractor = await prisma.service.create({
    data: {
      name: "House Construction Contractor",
      slug: "house-construction-contractor",
      categoryId: constructionServices.id,
      keywords: ["house contractor", "civil contractor", "home construction", "building builder", "architectural plan"],
    },
  });

  const sTileWork = await prisma.service.create({
    data: {
      name: "Tiles & Flooring Specialist",
      slug: "tiles-flooring-specialist",
      categoryId: constructionServices.id,
      keywords: ["tile fitting", "marble polish", "flooring", "bathroom tiles", "granite kitchen top"],
    },
  });

  console.log("✅ Created Categories and Services");

  // Helper for provider user
  async function createProviderUser(email: string, name: string, phone: string) {
    return prisma.user.create({
      data: {
        email,
        hashedPassword: passwordHash,
        name,
        phone,
        role: Role.PROVIDER,
        avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150`,
      },
    });
  }

  // Provider 1: Ramesh Verma (Individual AC Expert) - Highly Trusted (Score: 93)
  const uRamesh = await createProviderUser("ramesh.ac@example.com", "Ramesh Verma", "+919837012345");
  const pRamesh = await prisma.provider.create({
    data: {
      userId: uRamesh.id,
      type: ProviderType.INDIVIDUAL,
      businessName: "Verma Cooling Solutions",
      slug: "verma-cooling-solutions",
      description: "14+ years certified HVAC technician specializing in Daikin, Voltas, and Hitachi split/window ACs. Known for honest diagnosis, genuine copper coil parts, and punctual home visits across Dehradun.",
      avatarUrl: "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=400",
      city: "Dehradun",
      locality: "Rajpur Road",
      address: "Near Jakhan Chowk, Rajpur Road, Dehradun",
      serviceArea: "Rajpur Road, Jakhan, Hathibarkala, Sahastradhara Road, Dalanwala (Within 12 km)",
      experienceYears: 14,
      specializations: ["Inverter AC Circuit Repair", "Gas Leak Detection & R32/R410A Refill", "Copper Piping"],
      pricing: {
        startingPrice: 350,
        visitCharge: 200,
        hourlyRate: null,
        pricingType: "LABOUR_ONLY",
        notes: "Visit charge waived if service approved. Parts provided at wholesale bill cost.",
      },
      availability: AvailabilityStatus.AVAILABLE,
      workingHours: {
        mon_sat: "8:30 AM - 8:00 PM",
        sunday: "9:00 AM - 2:00 PM (Emergency)",
      },
      completedJobsCount: 420,
      trustScore: 93,
      isApproved: true,
      isActive: true,
      featured: true,
    },
  });

  await prisma.providerService.create({
    data: { providerId: pRamesh.id, serviceId: sAc.id, customPrice: 400, notes: "Includes complete pressure wash" },
  });
  await prisma.providerService.create({
    data: { providerId: pRamesh.id, serviceId: sAppliance.id, customPrice: 350, notes: "Inspection and diagnosis" },
  });

  // Verifications for Ramesh
  await prisma.verification.createMany({
    data: [
      { providerId: pRamesh.id, type: VerificationType.PHONE, status: VerificationStatus.APPROVED, evidence: "OTP Verified" },
      { providerId: pRamesh.id, type: VerificationType.IDENTITY, status: VerificationStatus.APPROVED, evidence: "Aadhaar Card checked by admin", reviewedBy: admin.id },
      { providerId: pRamesh.id, type: VerificationType.LOCATION, status: VerificationStatus.APPROVED, evidence: "Electricity bill address verified", reviewedBy: admin.id },
      { providerId: pRamesh.id, type: VerificationType.EXPERIENCE, status: VerificationStatus.APPROVED, evidence: "ITI Air Conditioning Diploma verified", reviewedBy: admin.id },
      { providerId: pRamesh.id, type: VerificationType.WORK, status: VerificationStatus.APPROVED, evidence: "5 On-site client job photos with customer contact verified", reviewedBy: admin.id },
    ],
  });

  // Portfolio for Ramesh
  await prisma.portfolioProject.createMany({
    data: [
      {
        providerId: pRamesh.id,
        title: "Complete 3x Multi-Split AC Installation at Canal Road Villa",
        projectType: "Multi-Unit Installation",
        locality: "Canal Road, Dehradun",
        year: 2024,
        approxBudget: 14500,
        description: "Outdoor multi-bracket mounting with concealed copper piping and zero wall vibration. Tested for pressure hold over 48 hours.",
        workPerformed: "Core drilling, high-grade copper piping, Nitrogen flushing, vacuuming, and commissioning.",
        mediaUrls: [
          "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800",
          "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800",
        ],
        verificationStatus: VerificationStatus.APPROVED,
      },
      {
        providerId: pRamesh.id,
        title: "Commercial VRV System Overhaul at Dalanwala Office",
        projectType: "Commercial Repair",
        locality: "Dalanwala, Dehradun",
        year: 2023,
        approxBudget: 28000,
        description: "Compressor valve replacement and R410A balanced charging for a 10HP system.",
        workPerformed: "Compressor diagnosis, copper brazing under nitrogen purge, sensor calibration.",
        mediaUrls: ["https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=800"],
        verificationStatus: VerificationStatus.APPROVED,
      },
    ],
  });

  // Reviews for Ramesh
  await prisma.review.create({
    data: {
      customerId: customer1.id,
      providerId: pRamesh.id,
      serviceId: sAc.id,
      overallRating: 5,
      qualityRating: 5,
      behaviorRating: 5,
      pricingRating: 5,
      timelinessRating: 5,
      communicationRating: 5,
      text: "Ramesh ji reached my home in Jakhan in under 45 minutes when our AC stopped cooling during peak June heat. Other technicians quoted 4,000 for PCB replacement, but Ramesh ji found it was merely a faulty capacitor (cost Rs 350) + dust choke. Highly honest person!",
      isVerified: true,
      providerResponse: "Thank you Rahul ji for your kind words. Ensuring customers aren't misled with fake PCB faults is my core principle.",
      providerRespondedAt: new Date(),
    },
  });

  await prisma.review.create({
    data: {
      customerId: customer2.id,
      providerId: pRamesh.id,
      serviceId: sAc.id,
      overallRating: 5,
      qualityRating: 5,
      behaviorRating: 4,
      pricingRating: 5,
      timelinessRating: 5,
      communicationRating: 5,
      text: "Punctual, carried all drop cloths so the bedroom carpet stayed completely clean. The AC runs like brand new.",
      isVerified: true,
    },
  });

  // Provider 2: Shiva Electricals & Lighting (Professional Shop) - Trusted (Score: 84)
  const uShiva = await createProviderUser("shiva.electric@example.com", "Sunil Aggarwal", "+919837098765");
  const pShiva = await prisma.provider.create({
    data: {
      userId: uShiva.id,
      type: ProviderType.SHOP,
      businessName: "Shiva Electricals & Service Center",
      slug: "shiva-electricals-service-center",
      description: "Established in 2008 in Paltan Bazar. We maintain our own physical store with genuine Havells, Polycab, and Schneider switchgear, along with 4 on-call certified wiremen for residential and commercial electrical work.",
      avatarUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=400",
      city: "Dehradun",
      locality: "Paltan Bazar",
      address: "Shop #14, Paltan Bazar, Clock Tower, Dehradun",
      serviceArea: "Paltan Bazar, Ballupur, Chakrata Road, Clement Town, GMS Road",
      experienceYears: 16,
      specializations: ["Full House Rewiring", "Inverter Battery Setup", "Commercial Panel Installation", "Earthing Testing"],
      pricing: {
        startingPrice: 300,
        visitCharge: 150,
        hourlyRate: 200,
        pricingType: "LABOUR_PLUS_MATERIAL",
        notes: "Store invoice provided with 1-year warranty on all electrical fittings.",
      },
      availability: AvailabilityStatus.AVAILABLE,
      workingHours: {
        mon_sat: "10:00 AM - 8:30 PM",
        sunday: "Closed",
      },
      completedJobsCount: 1250,
      trustScore: 84,
      isApproved: true,
      isActive: true,
      featured: false,
    },
  });

  await prisma.providerService.create({
    data: { providerId: pShiva.id, serviceId: sElectrician.id, customPrice: 300, notes: "Per point or hourly rates" },
  });

  await prisma.verification.createMany({
    data: [
      { providerId: pShiva.id, type: VerificationType.PHONE, status: VerificationStatus.APPROVED, evidence: "Phone Verified" },
      { providerId: pShiva.id, type: VerificationType.BUSINESS, status: VerificationStatus.APPROVED, evidence: "GST Registration Certificate 05AAAAA0000A1Z5 verified", reviewedBy: admin.id },
      { providerId: pShiva.id, type: VerificationType.LOCATION, status: VerificationStatus.APPROVED, evidence: "Shop verified in Paltan Bazar by field visit", reviewedBy: admin.id },
      { providerId: pShiva.id, type: VerificationType.EXPERIENCE, status: VerificationStatus.APPROVED, evidence: "Trade license 2008 verified", reviewedBy: admin.id },
    ],
  });

  // Provider 3: Doon Tech Care (Shop / Tech Service) - Good (Score: 72)
  const uTech = await createProviderUser("doontechcare@example.com", "Ankit Bhatt", "+919837055443");
  const pTech = await prisma.provider.create({
    data: {
      userId: uTech.id,
      type: ProviderType.SHOP,
      businessName: "Doon Tech Care - Laptop & Apple Specialists",
      slug: "doon-tech-care-laptop-apple",
      description: "Chip-level motherboard repair, liquid damage recovery, and display replacement for Dell, HP, Lenovo, and Apple MacBooks. Fast turnaround with warranty seal.",
      avatarUrl: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=400",
      city: "Dehradun",
      locality: "Chakrata Road",
      address: "1st Floor, Krishna Plaza, Opp. Bindal Bridge, Chakrata Road, Dehradun",
      serviceArea: "Entire Dehradun (Doorstep pickup and drop available)",
      experienceYears: 8,
      specializations: ["BGA Chip Level Soldering", "MacBook Screen & Battery Replacement", "SSD Speed Upgrades"],
      pricing: {
        startingPrice: 500,
        visitCharge: 250,
        hourlyRate: null,
        pricingType: "PER_SERVICE",
        notes: "Free diagnostics at shop. Doorstep pickup: Rs 150.",
      },
      availability: AvailabilityStatus.AVAILABLE,
      workingHours: {
        mon_sat: "10:30 AM - 8:00 PM",
        sunday: "11:00 AM - 4:00 PM",
      },
      completedJobsCount: 890,
      trustScore: 72,
      isApproved: true,
      isActive: true,
      featured: true,
    },
  });

  await prisma.providerService.create({
    data: { providerId: pTech.id, serviceId: sLaptop.id, customPrice: 500, notes: "Chip level diagnosis" },
  });

  await prisma.verification.createMany({
    data: [
      { providerId: pTech.id, type: VerificationType.PHONE, status: VerificationStatus.APPROVED, evidence: "Phone Verified" },
      { providerId: pTech.id, type: VerificationType.IDENTITY, status: VerificationStatus.APPROVED, evidence: "PAN & Aadhaar Verified", reviewedBy: admin.id },
      { providerId: pTech.id, type: VerificationType.BUSINESS, status: VerificationStatus.APPROVED, evidence: "Shop Act License Verified", reviewedBy: admin.id },
    ],
  });

  // Provider 4: Rawat Civil Contractors & Builders (Contractor / Team) - Highly Trusted (Score: 95)
  const uContractor = await createProviderUser("rawat.builders@example.com", "Virender Singh Rawat", "+919837011223");
  const pContractor = await prisma.provider.create({
    data: {
      userId: uContractor.id,
      type: ProviderType.CONTRACTOR,
      businessName: "Himalayan Infra & Civil Contractors",
      slug: "himalayan-infra-civil-contractors",
      description: "Grade-A licensed civil contractor with 22 years constructing earthquake-resistant hill residences, duplex villas, and commercial spaces across Dehradun, Mussoorie, and Rishikesh. In-house architects, structural engineers, and dedicated team of 35 skilled masons.",
      avatarUrl: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400",
      city: "Dehradun",
      locality: "Sahastradhara Road",
      address: "Plot 42, Near Touchwood School, Sahastradhara Road, Dehradun",
      serviceArea: "Dehradun Valley, Mussoorie, Rishikesh, Vikas Nagar",
      experienceYears: 22,
      specializations: ["Turnkey House Construction", "Earthquake Resistant RCC Framing", "Hill Slope Retaining Walls", "MDDA Map Approvals"],
      pricing: {
        startingPrice: 1650,
        visitCharge: 0,
        hourlyRate: null,
        pricingType: "PROJECT_BASED",
        notes: "Starting at Rs 1,650/sq ft (Grey Structure) to Rs 2,400/sq ft (Full Turnkey with Premium Finishes). Free site visit in Dehradun.",
      },
      availability: AvailabilityStatus.ACCEPTING,
      workingHours: {
        mon_sat: "8:00 AM - 6:30 PM",
        sunday: "Site Visits by Appointment",
      },
      completedJobsCount: 68,
      trustScore: 95,
      isApproved: true,
      isActive: true,
      featured: true,
    },
  });

  await prisma.providerService.create({
    data: { providerId: pContractor.id, serviceId: sContractor.id, customPrice: 1650, notes: "Per sq ft rate" },
  });
  await prisma.providerService.create({
    data: { providerId: pContractor.id, serviceId: sTileWork.id, customPrice: 35, notes: "Per sq ft tile laying and leveling" },
  });

  await prisma.verification.createMany({
    data: [
      { providerId: pContractor.id, type: VerificationType.PHONE, status: VerificationStatus.APPROVED, evidence: "Phone Verified" },
      { providerId: pContractor.id, type: VerificationType.IDENTITY, status: VerificationStatus.APPROVED, evidence: "Government ID Verified", reviewedBy: admin.id },
      { providerId: pContractor.id, type: VerificationType.LOCATION, status: VerificationStatus.APPROVED, evidence: "Registered Office inspected", reviewedBy: admin.id },
      { providerId: pContractor.id, type: VerificationType.BUSINESS, status: VerificationStatus.APPROVED, evidence: "Uttarakhand PWD Class-A License & GST Verified", reviewedBy: admin.id },
      { providerId: pContractor.id, type: VerificationType.EXPERIENCE, status: VerificationStatus.APPROVED, evidence: "22 years registration history verified", reviewedBy: admin.id },
      { providerId: pContractor.id, type: VerificationType.WORK, status: VerificationStatus.APPROVED, evidence: "12 completed project occupancy certificates verified", reviewedBy: admin.id },
      { providerId: pContractor.id, type: VerificationType.CUSTOMER, status: VerificationStatus.APPROVED, evidence: "6 customer phone reference checks completed and verified", reviewedBy: admin.id },
    ],
  });

  // Portfolio for Contractor
  await prisma.portfolioProject.createMany({
    data: [
      {
        providerId: pContractor.id,
        title: "3,200 sq ft Modern Hill Villa at Rajpur",
        projectType: "Full Turnkey House Construction",
        locality: "Old Rajpur, Dehradun",
        year: 2023,
        approxArea: "3,200 sq ft",
        approxBudget: 7200000,
        description: "3-story modern mountain architecture with reinforced retaining walls, double-glazed soundproof glass, teakwood joinery, and rainwater harvesting cistern.",
        workPerformed: "Architectural drawings, structural engineering, excavation, RCC framing, brickwork, electrical & sanitary, finishing.",
        mediaUrls: [
          "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
          "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
        ],
        verificationStatus: VerificationStatus.APPROVED,
      },
      {
        providerId: pContractor.id,
        title: "Duplex Residence at Sahastradhara Enclave",
        projectType: "Residential Villa",
        locality: "Sahastradhara Road, Dehradun",
        year: 2022,
        approxArea: "2,400 sq ft",
        approxBudget: 4800000,
        description: "Completed ahead of schedule within 9 months. Ultra-strong foundation with anti-termite treatment throughout.",
        workPerformed: "Full civil execution from foundation to paint handover.",
        mediaUrls: [
          "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800",
        ],
        verificationStatus: VerificationStatus.APPROVED,
      },
    ],
  });

  await prisma.review.create({
    data: {
      customerId: customer1.id,
      providerId: pContractor.id,
      serviceId: sContractor.id,
      overallRating: 5,
      qualityRating: 5,
      behaviorRating: 5,
      pricingRating: 4,
      timelinessRating: 5,
      communicationRating: 5,
      text: "Virender Rawat ji built our home on Sahastradhara Road. In an industry notorious for contractor delays and surprise cost escalations, Mr. Rawat stuck to the milestone schedule down to the week! Every batch of cement and steel was branded and tested. Highest recommendation.",
      isVerified: true,
      providerResponse: "Thank you Rahul ji. Delivering solid quality that lasts generations is our pride.",
      providerRespondedAt: new Date(),
    },
  });

  // Provider 5: Mohan Lal (Individual Plumber) - Good (Score: 68)
  const uPlumber = await createProviderUser("mohan.plumber@example.com", "Mohan Lal", "+919837066778");
  const pPlumber = await prisma.provider.create({
    data: {
      userId: uPlumber.id,
      type: ProviderType.INDIVIDUAL,
      businessName: "Mohan Master Plumber",
      slug: "mohan-master-plumber",
      description: "Experienced residential plumber for concealed piping, motor installations, overhead tank cleaning, and bathroom sanitary fitting. 10 years working in Clement Town and Subhash Nagar.",
      avatarUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400",
      city: "Dehradun",
      locality: "Clement Town",
      address: "Near Graphic Era Hill University, Clement Town, Dehradun",
      serviceArea: "Clement Town, Subhash Nagar, Majra, Turner Road",
      experienceYears: 10,
      specializations: ["Pressure Pump Setup", "CPVC & PPR Pipe Jointing", "Underground Leak Detection"],
      pricing: {
        startingPrice: 250,
        visitCharge: 150,
        hourlyRate: null,
        pricingType: "LABOUR_ONLY",
        notes: "Minor leak fixing Rs 250 - 400. Major pipeline work quoted after inspection.",
      },
      availability: AvailabilityStatus.BUSY,
      workingHours: {
        mon_sat: "8:00 AM - 7:00 PM",
        sunday: "Emergency Calls Only",
      },
      completedJobsCount: 520,
      trustScore: 68,
      isApproved: true,
      isActive: true,
    },
  });

  await prisma.providerService.create({
    data: { providerId: pPlumber.id, serviceId: sPlumber.id, customPrice: 250, notes: "Inspection & labour" },
  });

  await prisma.verification.createMany({
    data: [
      { providerId: pPlumber.id, type: VerificationType.PHONE, status: VerificationStatus.APPROVED, evidence: "Phone Verified" },
      { providerId: pPlumber.id, type: VerificationType.IDENTITY, status: VerificationStatus.APPROVED, evidence: "Aadhaar Verified", reviewedBy: admin.id },
    ],
  });

  // Provider 6: Garhwal Security & CCTV (Service Company) - Trusted (Score: 88)
  const uCctv = await createProviderUser("garhwal.cctv@example.com", "Rajeev Joshi", "+919837033221");
  const pCctv = await prisma.provider.create({
    data: {
      userId: uCctv.id,
      type: ProviderType.COMPANY,
      businessName: "Garhwal Security Systems Pvt. Ltd.",
      slug: "garhwal-security-systems",
      description: "Authorized CP Plus, Hikvision, and Dahua partners. We deploy IP CCTV, biometric access control, video door phones, and smart home automation for residential townships and retail businesses.",
      avatarUrl: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=400",
      city: "Dehradun",
      locality: "GMS Road",
      address: "Plot 18, Commercial Belt, GMS Road, Dehradun",
      serviceArea: "All Dehradun, Haridwar, Roorkee, Paonta Sahib",
      experienceYears: 12,
      specializations: ["4K IP Camera Networks", "Remote Mobile Viewing Setup", "Solar CCTV for Hill Farms", "Biometric Access Control"],
      pricing: {
        startingPrice: 1200,
        visitCharge: 300,
        hourlyRate: null,
        pricingType: "LABOUR_PLUS_MATERIAL",
        notes: "4-camera complete setup starting at Rs 14,999 with 2-year replacement warranty.",
      },
      availability: AvailabilityStatus.AVAILABLE,
      workingHours: {
        mon_sat: "9:00 AM - 7:30 PM",
        sunday: "10:00 AM - 2:00 PM",
      },
      completedJobsCount: 780,
      trustScore: 88,
      isApproved: true,
      isActive: true,
      featured: true,
    },
  });

  await prisma.providerService.create({
    data: { providerId: pCctv.id, serviceId: sCctv.id, customPrice: 1200, notes: "Installation per 4 cameras" },
  });

  await prisma.verification.createMany({
    data: [
      { providerId: pCctv.id, type: VerificationType.PHONE, status: VerificationStatus.APPROVED, evidence: "Phone Verified" },
      { providerId: pCctv.id, type: VerificationType.IDENTITY, status: VerificationStatus.APPROVED, evidence: "Director Aadhaar & DIN verified", reviewedBy: admin.id },
      { providerId: pCctv.id, type: VerificationType.BUSINESS, status: VerificationStatus.APPROVED, evidence: "MCA Incorporation Certificate & GST verified", reviewedBy: admin.id },
      { providerId: pCctv.id, type: VerificationType.LOCATION, status: VerificationStatus.APPROVED, evidence: "Office location verified on GMS Road", reviewedBy: admin.id },
      { providerId: pCctv.id, type: VerificationType.WORK, status: VerificationStatus.APPROVED, evidence: "Client contracts verified", reviewedBy: admin.id },
    ],
  });

  // Provider 7: Doon Car Care & Diagnostics (Shop) - Good (Score: 65)
  const uCar = await createProviderUser("doon.car@example.com", "Deepak Panwar", "+919837077889");
  const pCar = await prisma.provider.create({
    data: {
      userId: uCar.id,
      type: ProviderType.SHOP,
      businessName: "Doon Car Clinic & Multibrand Garage",
      slug: "doon-car-clinic-garage",
      description: "Multibrand car diagnostics, suspension overhaul, OBD scanning, clutch overhaul, and periodic maintenance for Maruti, Hyundai, Tata, and Mahindra vehicles.",
      avatarUrl: "https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=400",
      city: "Dehradun",
      locality: "Haridwar Bypass",
      address: "Near Rispana Bridge, Haridwar Bypass, Dehradun",
      serviceArea: "Dharampur, Rispana, Haridwar Bypass, Nehru Colony, Race Course",
      experienceYears: 7,
      specializations: ["Engine OBD Diagnostics", "Brake Overhaul", "AC Gas Refill for Cars"],
      pricing: {
        startingPrice: 600,
        visitCharge: 300,
        hourlyRate: null,
        pricingType: "LABOUR_ONLY",
        notes: "Inspection and OBD scan: Rs 500. Roadside jumpstart: Rs 400.",
      },
      availability: AvailabilityStatus.AVAILABLE,
      workingHours: {
        mon_sat: "9:00 AM - 8:00 PM",
        sunday: "10:00 AM - 5:00 PM",
      },
      completedJobsCount: 310,
      trustScore: 65,
      isApproved: true,
      isActive: true,
    },
  });

  await prisma.providerService.create({
    data: { providerId: pCar.id, serviceId: sCarMechanic.id, customPrice: 600, notes: "Standard servicing labor" },
  });

  await prisma.verification.createMany({
    data: [
      { providerId: pCar.id, type: VerificationType.PHONE, status: VerificationStatus.APPROVED, evidence: "Phone Verified" },
      { providerId: pCar.id, type: VerificationType.IDENTITY, status: VerificationStatus.APPROVED, evidence: "PAN Verified", reviewedBy: admin.id },
    ],
  });

  // Provider 8: New Pending Provider (For Admin Approval Demo)
  const uNew = await createProviderUser("new.technician@example.com", "Sanjay Thapa", "+919837000111");
  await prisma.provider.create({
    data: {
      userId: uNew.id,
      type: ProviderType.INDIVIDUAL,
      businessName: "Thapa RO Water Purifier Repair",
      slug: "thapa-ro-water-purifier",
      description: "Expert in Kent, Aquaguard, and Livpure RO filter change, membrane replacement, and TDS adjustment.",
      avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
      city: "Dehradun",
      locality: "Prem Nagar",
      address: "Prem Nagar Main Market, Dehradun",
      serviceArea: "Prem Nagar, Selaqui, Clement Town",
      experienceYears: 4,
      specializations: ["RO Membrane Change", "TDS Balance", "UV Lamp Replacement"],
      pricing: {
        startingPrice: 250,
        visitCharge: 150,
        pricingType: "LABOUR_ONLY",
      },
      availability: AvailabilityStatus.AVAILABLE,
      completedJobsCount: 45,
      trustScore: 35, // New provider
      isApproved: false, // Pending admin approval!
      isActive: true,
    },
  });

  console.log("✅ Seed completed successfully with realistic Dehradun data!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
