// Garantie des produits de ventilation. Ébauche à faire valider par Laurie.
export const warrantyUpdated = { fr: '6 novembre 2026', en: 'November 6, 2026' };
type W = { intro: string; highlights: [string, string][]; sections: { h: string; p?: string[]; li?: string[] }[] };

export const warranty: Record<'fr' | 'en', W> = {
  fr: {
    intro: 'On fabrique nos produits de ventilation pour qu’ils durent aussi longtemps que votre toit. Et si une pièce a un défaut de fabrication, on la remplace. Voici, en termes simples, comment fonctionne notre garantie.',
    highlights: [['À vie', 'garantie limitée sur les défauts de fabrication'], ['10 ans', 'remplacement sans frais, puis crédit de 50 % à vie'], ['10 ans', 'sur la peinture, décoloration comprise'], ['Transférable', 'au prochain propriétaire du bâtiment']],
    sections: [
      { h: 'Ce que couvre la garantie', p: [
        'Elle couvre tous les produits de ventilation fabriqués par Multi-Moulures et vendus sous la marque Multi-Ventilation : aérateurs de toit, dômes, cols de cygne, louvres, clapets, sorties murales et soffites ventilés.',
        'Défauts de fabrication : un défaut de matériau ou d’assemblage présent au moment de la livraison, par exemple un joint mal fermé, une soudure ou un rivet manquant, une pièce mal formée ou un grillage mal fixé.',
        'Peinture : pendant 10 ans, nous couvrons toute décoloration de la peinture d’usine, ainsi que l’écaillage, la fissuration et le cloquage.',
      ] },
      { h: 'Combien de temps', li: [
        'Pendant les 10 premières années après l’achat : nous remplaçons la pièce défectueuse sans frais.',
        'Après 10 ans, pour toute la vie du produit : nous vous accordons un crédit de 50 % sur le prix courant de la pièce de remplacement.',
        'Peinture : couverte pendant 10 ans à partir de la date d’achat, y compris contre toute décoloration.',
      ] },
      { h: 'La condition essentielle : une installation professionnelle', p: [
        'Le produit doit avoir été installé par un couvreur ou un entrepreneur professionnel, selon nos recommandations d’installation et les règles de l’art en toiture.',
        'L’étanchéité autour du produit (solins, membranes, scellants) relève de l’installateur. Notre garantie couvre la pièce que nous avons fabriquée, pas l’étanchéité du toit ni la performance de l’ensemble du système de ventilation, qui dépend aussi de l’isolation, du pare-vapeur et des entrées d’air du bâtiment.',
      ] },
      { h: 'Ce qui n’est pas couvert', li: [
        'L’usure normale, et la décoloration de la peinture après les 10 premières années.',
        'Les effets d’un environnement corrosif : air salin, émanations industrielles, pluies acides, bâtiments d’élevage (porcheries, poulaillers) et autres milieux acides ou humides.',
        'Une installation non conforme à nos recommandations ou aux règles de l’art, et les infiltrations d’eau qui en découlent.',
        'Les égratignures et dommages survenus pendant le transport, la manutention, l’entreposage ou l’installation.',
        'Une modification du produit, une peinture appliquée par la suite, l’utilisation de produits nettoyants inappropriés ou le manque d’entretien.',
        'L’accumulation de neige ou de glace qui recouvre le produit, les intempéries extrêmes et les catastrophes naturelles.',
        'La main-d’œuvre pour retirer et réinstaller la pièce, les frais de déplacement et la réparation des dommages au bâtiment ou à son contenu.',
      ] },
      { h: 'La garantie suit le bâtiment', p: [
        'Si le bâtiment est vendu, la garantie est transférée au nouveau propriétaire pour le reste de sa durée. Il lui suffit de présenter la preuve d’achat d’origine.',
      ] },
      { h: 'Comment faire une réclamation', li: [
        'Écrivez-nous à info@multimoulures.com dans les 30 jours suivant la découverte du problème.',
        'Joignez la preuve d’achat (facture de Multi-Moulures ou d’un revendeur Multi-Ventilation), le nom de l’installateur et quelques photos du problème.',
        'Nous examinons chaque réclamation rapidement. Au besoin, nous vous demanderons de nous retourner la pièce ou nous irons la voir.',
        'Si le défaut est confirmé, nous fabriquons la pièce de remplacement et nous vous la livrons sans frais, ou vous la cueillez à notre usine de Saint-Bruno-de-Montarville.',
      ] },
      { h: 'Vos autres droits', p: [
        'Cette garantie s’ajoute aux garanties prévues par la loi, notamment le Code civil du Québec et, s’il y a lieu, la Loi sur la protection du consommateur. Elle ne les limite pas.',
      ] },
    ],
  },
  en: {
    intro: 'We build our ventilation products to last as long as your roof. And if a part has a manufacturing defect, we replace it. Here is how our warranty works, in plain terms.',
    highlights: [['Lifetime', 'limited warranty on manufacturing defects'], ['10 years', 'free replacement, then a 50% credit for life'], ['10 years', 'on paint, fading included'], ['Transferable', 'to the next building owner']],
    sections: [
      { h: 'What the warranty covers', p: [
        'It covers every ventilation product made by Multi-Moulures and sold under the Multi-Ventilation brand: roof vents, domes, gooseneck vents, louvres, exhaust caps, wall vents and vented soffits.',
        'Manufacturing defects: a defect in material or workmanship present at delivery, for example a poorly closed seam, a missing weld or rivet, a badly formed part or a loose screen.',
        'Paint: for 10 years, we cover any fading of the factory finish, as well as peeling, cracking and blistering.',
      ] },
      { h: 'How long', li: [
        'For the first 10 years after purchase: we replace the defective part free of charge.',
        'After 10 years, for the life of the product: we give you a 50% credit on the current price of the replacement part.',
        'Paint: covered for 10 years from the date of purchase, including against any fading.',
      ] },
      { h: 'The key condition: professional installation', p: [
        'The product must have been installed by a professional roofer or contractor, following our installation recommendations and good roofing practice.',
        'Weatherproofing around the product (flashing, membranes, sealants) is the installer’s responsibility. Our warranty covers the part we made, not the roof’s watertightness or the performance of the whole ventilation system, which also depends on the building’s insulation, vapour barrier and air intakes.',
      ] },
      { h: 'What is not covered', li: [
        'Normal wear, and paint fading after the first 10 years.',
        'The effects of a corrosive environment: salt air, industrial fallout, acid rain, livestock buildings (hog barns, poultry barns) and other acidic or humid settings.',
        'Installation that does not follow our recommendations or good practice, and any water infiltration that results.',
        'Scratches and damage during shipping, handling, storage or installation.',
        'Modifying the product, painting it afterwards, using unsuitable cleaning products, or lack of maintenance.',
        'Snow or ice covering the product, extreme weather and natural disasters.',
        'Labour to remove and reinstall the part, travel costs, and repairs to the building or its contents.',
      ] },
      { h: 'The warranty follows the building', p: [
        'If the building is sold, the warranty transfers to the new owner for the rest of its term. They just need the original proof of purchase.',
      ] },
      { h: 'How to make a claim', li: [
        'Email info@multimoulures.com within 30 days of finding the problem.',
        'Include the proof of purchase (invoice from Multi-Moulures or a Multi-Ventilation reseller), the installer’s name and a few photos of the problem.',
        'We review every claim quickly. If needed, we will ask you to return the part or we will come and see it.',
        'If the defect is confirmed, we make the replacement part and deliver it free of charge, or you can pick it up at our Saint-Bruno-de-Montarville plant.',
      ] },
      { h: 'Your other rights', p: [
        'This warranty is in addition to the warranties provided by law, including the Civil Code of Québec and, where applicable, the Consumer Protection Act. It does not limit them.',
      ] },
    ],
  },
};
