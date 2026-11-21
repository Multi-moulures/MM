// Contenu orienté recherche : applications, mots-clés par produit, FAQ technique.
import type { Product } from './produits';
type L = 'fr' | 'en';

export type AppId = 'pente' | 'plat' | 'agricole' | 'entrees' | 'murales';
export const apps: { id: AppId; fr: [string, string]; en: [string, string]; img: string }[] = [
  { id: 'pente', fr: ['Toits en pente', 'Ventilateurs de toit et aérateurs pour toitures métalliques et en bardeaux'], en: ['Sloped roofs', 'Roof vents for metal and shingle roofs'], img: 'airm300-base-ajustable' },
  { id: 'plat', fr: ['Toits plats', 'Ventilateur de toit plat à base isolée, sortie multiple'], en: ['Flat roofs', 'Insulated-base flat roof ventilator, multi-port exhaust'], img: 'airm300-base-plate' },
  { id: 'agricole', fr: ['Agricole et commercial', 'Dômes, cols de cygne, louvres pour bâtiments ICI et de ferme'], en: ['Agricultural and commercial', 'Domes, gooseneck vents and louvres for ICI and farm buildings'], img: 'dome-480' },
  { id: 'entrees', fr: ['Entrées d’air (soffites)', 'Soffites ventilés en acier pour l’entrée d’air de l’entretoit'], en: ['Air intake (soffits)', 'Vented steel soffits for attic air intake'], img: 'soffite-ventile-oblong-50' },
  { id: 'murales', fr: ['Sorties murales et évacuation', 'Clapets de sécheuse, de salle de bain et de hotte, sorties murales'], en: ['Wall vents and exhaust', 'Dryer, bathroom fan and range hood caps, wall vents'], img: 'sortie-murale-de-ventilation' },
];

// Applications vérifiées à partir du catalogue (pente indiquée, base plate, catégorie).
export function appsOf(p: Product): AppId[] {
  const a: AppId[] = [];
  if (p.pitch) a.push('pente');
  if (p.slug === 'airm300-base-plate' || p.slug === 'boite-a-clapets-multiples') a.push('plat');
  if (p.cat === 'ici' && p.slug !== 'persiennes-architecturales') a.push('agricole');
  if (p.cat === 'soffites') a.push('entrees');
  if (p.cat === 'evacuation' || p.slug === 'sortie-murale-commerciale') a.push('murales');
  return [...new Set(a)];
}

// Mot-clé principal par produit, pour le titre et la description.
const kwFr: Record<string, string> = {
  aerateurs: 'ventilateur de toit', ici: 'ventilation commerciale', evacuation: 'clapet d’évacuation', soffites: 'soffite ventilé en acier',
  'airm300-base-plate': 'ventilateur de toit plat', 'airm300-base-pignon': 'ventilateur de faîte', 'dome-480': 'ventilateur de toit agricole', 'louvre': 'louvre de ventilation', 'persiennes-architecturales': 'persiennes architecturales',
  'sortie-murale-de-ventilation': 'sortie murale', 'sortie-murale-commerciale': 'sortie murale', 'boite-a-clapets-multiples': 'sortie de toit multiple', 'cmm-4': 'clapet de toiture', 'vr-rectangulaire': 'ventilateur de toit', 'vr-triangulaire': 'ventilateur de toit', 'col-de-cygne': 'ventilateur commercial',
};
const kwEn: Record<string, string> = {
  aerateurs: 'roof vent', ici: 'commercial roof ventilation', evacuation: 'exhaust cap', soffites: 'vented steel soffit',
  'airm300-base-plate': 'flat roof ventilator', 'airm300-base-pignon': 'ridge vent', 'dome-480': 'agricultural roof ventilator', 'louvre': 'wall louvre', 'persiennes-architecturales': 'architectural louvres',
  'sortie-murale-de-ventilation': 'wall vent', 'sortie-murale-commerciale': 'wall vent', 'boite-a-clapets-multiples': 'roof exhaust box', 'cmm-4': 'roof exhaust cap', 'vr-rectangulaire': 'roof vent', 'vr-triangulaire': 'roof vent', 'col-de-cygne': 'commercial roof vent',
};
export function seoTitle(name: string, kw: string, l: L) {
  const core = l === 'fr' ? `${name} : ${kw} sur mesure` : `${name}: custom ${kw}`;
  const full = `${core} | Multi-Ventilation`;
  if (full.length <= 65) return full;
  if (core.length <= 65) return core;
  return `${name} | Multi-Ventilation`.length <= 65 ? `${name} | Multi-Ventilation` : name;
}
export const clip = (s: string, n = 158) => (s.length > n ? s.slice(0, s.lastIndexOf(' ', n - 1)) + '…' : s);
export const keyword = (p: Product, l: L) => (l === 'fr' ? kwFr : kwEn)[p.slug] ?? (l === 'fr' ? kwFr : kwEn)[p.cat];

// Chiffre principal : la surface libre de ventilation (mesurée) passe avant le débit (estimé).
export function headline(p: Product, l: L) {
  const isFlow = /PCM|CFM/.test(p.metric.u);
  if (!isFlow) return { v: p.metric.v, u: p.metric.u, label: p.metric.label, note: p.metric.note, est: undefined as string | undefined };
  const spec = p.specs.find(([k]) => /SFVA|NFVA/.test(k));
  let area = spec?.[1];
  if (!area) { const i = p.table.head.findIndex((h) => /SFVA|NFVA/.test(h)); if (i >= 0) area = p.table.rows[0][i]; }
  const est = `${p.metric.v} ${p.metric.u}`;
  if (!area) return { v: p.metric.v, u: p.metric.u, label: p.metric.label, note: p.metric.note, est: undefined };
  const [v, ...u] = area.split(' ');
  const model = p.metric.label.includes(',') ? p.metric.label.split(',').slice(1).join(',').trim() : '';
  return {
    v, u: u.join(' '),
    label: (l === 'fr' ? 'Surface libre de ventilation (SFVA)' : 'Net free ventilating area (NFVA)') + (model ? `, ${model}` : ''),
    note: undefined,
    est: l === 'fr' ? `Débit d’air estimé : ${est}, calculé à partir de la SFVA (non mesuré en laboratoire).` : `Estimated airflow: ${est}, calculated from the NFVA (not laboratory measured).`,
  };
}

export const faqMore: Record<L, [string, string][]> = {
  fr: [
    ['Quelle est la différence entre la SFVA et le débit en PCM ?', 'La surface libre de ventilation (SFVA, ou NFVA en anglais) est l’aire réelle par laquelle l’air peut passer, une fois déduits les grillages et les lames. Elle se mesure en pouces carrés et c’est elle que le Code du bâtiment utilise pour dimensionner la ventilation d’un entretoit. Le débit en pieds cubes par minute (PCM, ou CFM) indique la quantité d’air déplacée : pour un ventilateur statique, il dépend du vent et de l’écart de température, donc nos débits sont des estimations calculées à partir de la SFVA. Pour comparer deux ventilateurs, comparez leur SFVA.'],
    ['Comment le ventilateur de toit et le soffite ventilé travaillent-ils ensemble ?', 'La ventilation d’un entretoit fonctionne comme une cheminée : l’air frais entre par le bas, au soffite, et l’air chaud et humide sort par le haut, au ventilateur de toit. Sans entrée d’air suffisante, même le meilleur aérateur ne peut pas évacuer l’air. La surface libre de ventilation se répartit donc entre les entrées (soffites ventilés) et les sorties (ventilateurs de toit).'],
    ['Qu’est-ce qui cause la condensation dans un entretoit ?', 'En hiver, l’air chaud et humide de la maison monte dans l’entretoit par les fuites d’air du plafond. Au contact du toit froid, l’humidité condense, puis gèle ou coule sur l’isolant. Les causes les plus courantes sont une ventilation insuffisante, des entrées d’air bloquées, un pare-vapeur incomplet et des ventilateurs de salle de bain ou de sécheuse qui se vident dans l’entretoit. Une bonne ventilation aide, mais l’étanchéité à l’air du plafond est tout aussi importante.'],
    ['Comment choisir un ventilateur pour une toiture métallique ?', 'Choisissez d’abord la surface libre de ventilation dont le toit a besoin, puis un modèle compatible avec la pente. Sur une toiture métallique, un ventilateur fabriqué dans le même acier prépeint que le revêtement s’agence à la couleur et vieillit de la même façon. Nos ventilateurs de toit sont fabriqués sur mesure, selon la pente, la grandeur et la couleur du toit, et installés par le couvreur avec les solins appropriés.'],
    ['Quelle est la différence entre l’AirM100 et l’AirM300 ?', 'Les deux sont des ventilateurs de toit statiques fabriqués sur mesure. L’AirM300 offre la plus grande surface libre de ventilation de notre gamme : 144 po² en format 12 x 12 po, jusqu’à 576 po² en 24 x 24 po. Il a été testé selon la norme CAN3-A93-M82 par UL Canada. L’AirM100 est plus compact : sa surface libre est de 70 po² en format 12 x 12 po, limitée par ses ouvertures latérales.'],
    ['Quel ventilateur choisir pour un toit à faible pente ?', 'Vérifiez la plage de pentes du modèle. L’AirM300 et l’AirM100 à base ajustable conviennent de 1/12 à 16/12. Le Dôme 480 et les ventilateurs à persiennes conviennent à partir de 2/12, et le ventilateur 2422 à partir de 3/12. Sous 1/12, consultez-nous : l’AirM300 base plate est conçu pour les toits plats.'],
    ['Quel ventilateur convient aux bâtiments agricoles et commerciaux ?', 'Pour les grandes toitures, le Dôme 480 se fabrique en longueurs de 4, 6 et 8 pieds et a été testé selon la norme CAN3-A93-M82. Le col de cygne, les louvres et les ventilateurs à persiennes complètent la gamme pour les bâtiments ICI. Dans les bâtiments d’élevage, l’air est corrosif : parlez-nous de l’usage du bâtiment avant de commander.'],
    ['Peut-on assortir le ventilateur à la couleur du toit ?', 'Oui. Chaque ventilateur est plié dans l’acier prépeint des grands fabricants de toitures métalliques, dans la couleur exacte de votre revêtement. Si votre couleur n’est pas dans nos palettes, nous trouvons la correspondance à partir d’un échantillon.'],
    ['Où trouver les instructions d’installation ?', 'Nos guides d’installation de l’AirM300 et du Dôme 480 sont en préparation. En attendant, le catalogue complet est téléchargeable sur chaque page produit, et nos conseillers techniques répondent aux couvreurs par téléphone. L’installation doit être faite par un couvreur ou un entrepreneur professionnel.'],
  ],
  en: [
    ['What is the difference between NFVA and CFM?', 'Net free ventilating area (NFVA) is the actual area air can pass through once screens and louvres are deducted. It is measured in square inches, and it is what the building code uses to size attic ventilation. Airflow in cubic feet per minute (CFM) is the volume of air moved: for a static vent it depends on wind and temperature difference, so our CFM figures are estimates calculated from the NFVA. To compare two vents, compare their NFVA.'],
    ['How do roof vents and vented soffits work together?', 'Attic ventilation works like a chimney: fresh air comes in low, at the soffit, and warm, humid air leaves high, through the roof vent. Without enough intake, even the best roof vent cannot exhaust air. The net free ventilating area is therefore split between intake (vented soffits) and exhaust (roof vents).'],
    ['What causes condensation in an attic?', 'In winter, warm, humid air from the house rises into the attic through air leaks in the ceiling. When it meets the cold roof, the moisture condenses, then freezes or drips onto the insulation. The most common causes are insufficient ventilation, blocked air intakes, an incomplete vapour barrier and bathroom or dryer fans venting into the attic. Good ventilation helps, but an airtight ceiling matters just as much.'],
    ['How do I choose a vent for a metal roof?', 'Start with the net free ventilating area the roof needs, then pick a model that fits the pitch. On a metal roof, a vent made from the same prepainted steel as the cladding matches the colour and weathers the same way. Our roof vents are made to order for the roof’s pitch, size and colour, and installed by the roofer with the proper flashing.'],
    ['What is the difference between the AirM100 and the AirM300?', 'Both are custom-made static roof vents. The AirM300 has the largest net free ventilating area in our range: 144 sq. in. in the 12 x 12 in. size, up to 576 sq. in. in 24 x 24 in. It was tested to CAN3-A93-M82 by UL Canada. The AirM100 is more compact: its NFVA is 70 sq. in. in the 12 x 12 in. size, limited by its side openings.'],
    ['Which vent should I use on a low-slope roof?', 'Check the model’s pitch range. The pitch-adjustable AirM300 and AirM100 fit 1/12 to 16/12. The 480 Dome and louvered roof vents fit from 2/12, and the 2422 vent from 3/12. Below 1/12, talk to us: the AirM300 flat roof base is designed for flat roofs.'],
    ['Which vent suits agricultural and commercial buildings?', 'For large roofs, the 480 Dome comes in 4, 6 and 8 ft lengths and was tested to CAN3-A93-M82. Gooseneck vents, louvres and louvered roof vents complete the range for ICI buildings. Livestock buildings have corrosive air: tell us how the building is used before ordering.'],
    ['Can the vent match my roof colour?', 'Yes. Every vent is formed from the prepainted steel used by the major metal roofing manufacturers, in the exact colour of your cladding. If your colour is not in our palettes, we match it from a sample.'],
    ['Where can I find installation instructions?', 'Our AirM300 and 480 Dome installation guides are in preparation. In the meantime, the full catalogue can be downloaded from every product page, and our technical advisors answer roofers by phone. Installation must be done by a professional roofer or contractor.'],
  ],
};
