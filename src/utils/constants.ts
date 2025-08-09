import {
  PreciousGemType,
  SemiPreciousGemType,
  OrganicGemType,
  PreciousMetalType,
  DesignType,
  Occasion,
  Shape,
  Transparency,
  Lustre,
  StockStatus,
  AntiqueEra,
  RegionalStyle
} from '../types';

export const PRECIOUS_GEMS: PreciousGemType[] = [
  'Ruby',
  'Pearl',
  'Red Coral',
  'Emerald',
  'Yellow Sapphire',
  'Diamond',
  'Blue Sapphire',
  'Hessonite',
  "Cat's Eye",
];

export const SEMI_PRECIOUS_GEMS: SemiPreciousGemType[] = [
  'Agate', 'Alexandrite', 'Amazonite', 'Amber', 'Amethyst', 'Ametrine', 'Andalusite', 'Apatite', 'Aquamarine', 'Aventurine', 'Azurite', 'Bloodstone', 'Carnelian', 'Chalcedony', 'Charoite', 'Chrysocolla', 'Chrysoprase', 'Citrine', 'Coral', 'Cordierite', 'Demantoid Garnet', 'Diopside', 'Dumortierite', 'Fluorite', 'Garnet', 'Heliodor', 'Hematite', 'Hemimorphite', 'Howlite', 'Iolite', 'Jadeite', 'Jasper', 'Kunzite', 'Kyanite', 'Labradorite', 'Lapis Lazuli', 'Larimar', 'Lepidolite', 'Malachite', 'Moonstone', 'Morganite', 'Nephrite', 'Obsidian', 'Onyx', 'Opal', 'Peridot', 'Prehnite', 'Pyrite', 'Quartz', 'Rhodochrosite', 'Rhodonite', 'Rose Quartz', 'Seraphinite', 'Serpentine', 'Smoky Quartz', 'Sodalite', 'Spinel', 'Sunstone', 'Tanzanite', "Tiger's Eye", 'Topaz', 'Tourmaline', 'Turquoise', 'Zircon', 'Other'
];

export const ORGANIC_GEMS: OrganicGemType[] = [
  'Pearl', 'Amber', 'Coral', 'Jet', 'Ivory', 'Shell', 'Other'
];

export const PRECIOUS_METALS: PreciousMetalType[] = [
  'Gold', 'Silver', 'Platinum', 'Palladium', 'Rhodium', 'Iridium', 'Other'
];

export const DESIGN_TYPES: DesignType[] = [
  'Antique', 'Modern', 'Temple', 'Classic', 'Contemporary', 'Ethnic', 'Other'
];

export const OCCASIONS: Occasion[] = [
  'Bridal', 'Daily Wear', 'Festive', 'Gift', 'Work Wear', 'Party Wear', 'Other'
];

export const SHAPES: Shape[] = [
  'Round', 'Princess', 'Emerald', 'Asscher', 'Marquise', 'Oval', 'Radiant', 'Pear', 'Heart', 'Cushion', 'Other'
];

export const TRANSPARENCIES: Transparency[] = [
  'Transparent', 'Translucent', 'Opaque'
];

export const LUSTRES: Lustre[] = [
  'Vitreous', 'Resinous', 'Pearly', 'Greasy', 'Silky', 'Waxy', 'Dull', 'Metallic'
];

export const STOCK_STATUSES: StockStatus[] = [
  'In Stock', 'Out of Stock', 'Made-to-Order', 'On Hold'
];

export const ANTIQUE_ERAS: AntiqueEra[] = [
  'Pre-1800s', 'Victorian (1837-1901)', 'Art Nouveau (1890-1910)', 'Edwardian (1901-1910)', 'Art Deco (1920-1935)', 'Retro (1935-1950)', 'Mid-Century (1950s)', 'Modern (Post-1960)', 'Other'
];

export const REGIONAL_STYLES: RegionalStyle[] = [
  'Rajasthani', 'South Indian', 'Mughal', 'Nizami', 'Pahari', 'Other'
];
