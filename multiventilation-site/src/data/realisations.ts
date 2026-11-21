// Photos de réalisations par produit (affichées sous la fiche).
type Ph = { src: string; w: number; h: number; fr: string; en: string };
export const realisations: Record<string, Ph[]> = {
  'persiennes-architecturales': [
    { src: '/img/realisations/persiennes-architecturales-toit.webp', w: 1105, h: 620, fr: 'Persiennes architecturales installées en écran d’équipements sur le toit d’un immeuble.', en: 'Architectural louvres installed as an equipment screen on a building roof.' },
    { src: '/img/realisations/persiennes-architecturales-toit-2.webp', w: 1400, h: 375, fr: 'Même projet, en cours d’installation : les persiennes dissimulent les équipements mécaniques du toit.', en: 'Same project, during installation: the louvres screen the rooftop mechanical equipment.' },
  ],
};
