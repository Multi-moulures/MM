// Politique de confidentialité (Loi 25). Ébauche à faire valider par Laurie avant la mise en ligne.
// Les éléments entre [crochets] sont à confirmer.
export const privacyUpdated = { fr: '6 novembre 2026', en: 'November 6, 2026' };
export type Section = { h: string; p: string[]; todo?: string };

export function privacy(lang: 'fr' | 'en', brand: 'mm' | 'mv'): Section[] {
  const mv = brand === 'mv';
  if (lang === 'fr') return [
    { h: 'Qui sommes-nous', p: [
      `${mv ? 'Multi-Ventilation est une division de Multi-Moulures inc.' : 'Multi-Moulures inc.'} (« Multi-Moulures », « nous ») fabrique des moulures de métal et des produits de ventilation sur mesure au 1410, rue Hocquart, Saint-Bruno-de-Montarville (Québec) J3V 6B5.`,
      'Cette politique explique, en termes simples, quels renseignements personnels nous recueillons, pourquoi, comment nous les protégeons et quels sont vos droits. Elle s’applique aux sites multimoulures.com et multiventilation.ca, ainsi qu’aux renseignements que vous nous transmettez par téléphone ou par courriel.',
    ] },
    { h: 'Responsable de la protection des renseignements personnels', p: [
      'Marc Edwards, président, est responsable de la protection des renseignements personnels chez Multi-Moulures.',
      'Pour toute question, demande ou plainte : confidentialite@multimoulures.com, (450) 441-1226, ou par la poste à l’adresse ci-dessus, à l’attention du responsable de la protection des renseignements personnels.',
    ], todo: 'À confirmer : la personne responsable (par défaut, la personne ayant la plus haute autorité, déléguée par écrit au besoin) et la création de l’adresse confidentialite@multimoulures.com.' },
    { h: 'Les renseignements que nous recueillons', p: [
      'Lorsque vous remplissez un formulaire (demande de prix, ouverture de compte, demande revendeur) : votre nom, le nom de votre entreprise, votre téléphone, votre courriel, votre ville et votre province, votre type d’entreprise, le contenu de votre message et les fichiers que vous joignez (croquis, photos, plans).',
      'Lorsque vous devenez client : les coordonnées de facturation et de livraison de votre entreprise et l’historique de vos commandes.',
      'Nous ne demandons aucun renseignement sensible et aucun paiement en ligne sur nos sites.',
    ] },
    { h: 'Pourquoi nous les recueillons', p: [
      'Nous utilisons vos renseignements uniquement pour : répondre à votre demande et préparer votre prix ; ouvrir et gérer votre compte ; fabriquer, livrer et facturer vos commandes ; ' + (mv ? 'diriger votre demande vers le revendeur Multi-Ventilation de votre région, si vous y consentez ; ' : '') + 'respecter nos obligations légales et fiscales.',
      'Nous ne vendons ni ne louons jamais vos renseignements personnels.',
    ] },
    { h: 'Votre consentement', p: [
      'En nous envoyant un formulaire, vous consentez à l’utilisation de vos renseignements aux fins décrites ci-dessus. Vous pouvez retirer votre consentement en tout temps en écrivant au responsable ; nous cesserons alors de les utiliser, sauf si la loi nous oblige à les conserver.',
    ] },
    { h: 'Témoins et technologies du site', p: [
      'Nos sites n’utilisent aucun témoin (cookie) publicitaire ni aucune technologie qui permet de vous identifier, de vous localiser ou d’établir votre profil.',
      'Nous mesurons la fréquentation de façon anonyme, sans témoin, pour savoir quelles pages sont utiles. Ces statistiques ne permettent pas de vous identifier.',
    ], todo: 'À confirmer au moment d’ajouter un outil de statistiques (recommandé : Cloudflare Web Analytics, sans témoin). Si un outil avec témoins est ajouté, il devra être désactivé par défaut.' },
    { h: 'Qui a accès à vos renseignements', p: [
      'Seuls les employés de Multi-Moulures qui en ont besoin pour traiter votre demande ou votre commande y ont accès.',
      (mv ? 'Si vous êtes couvreur dans une région desservie par un revendeur, et seulement avec votre accord, nous lui transmettons vos coordonnées et votre demande pour qu’il vous serve. ' : '') + 'Nous faisons aussi appel à des fournisseurs de services pour héberger nos sites, recevoir les formulaires et gérer nos courriels. Ils n’utilisent vos renseignements que pour nous rendre ce service, selon une entente écrite qui les oblige à les protéger.',
      'Certains de ces fournisseurs conservent les données à l’extérieur du Québec, notamment aux États-Unis (hébergement Cloudflare). Avant de confier des renseignements à l’extérieur du Québec, nous évaluons que la protection offerte est adéquate, comme l’exige la loi.',
    ], todo: 'À confirmer : le service de formulaires retenu et son lieu d’hébergement, et la réalisation de l’évaluation des facteurs relatifs à la vie privée (EFVP) pour Cloudflare et ce service.' },
    { h: 'Combien de temps nous les conservons', p: [
      'Demandes de prix sans suite : 3 ans après le dernier contact. Dossiers clients : pendant la relation d’affaires, puis 6 ans pour respecter nos obligations fiscales. Ensuite, les renseignements sont détruits de façon sécuritaire ou anonymisés.',
    ], todo: 'À confirmer : les durées de conservation.' },
    { h: 'Comment nous les protégeons', p: [
      'Nos sites sont chiffrés (HTTPS), l’accès à nos systèmes est limité aux personnes autorisées et protégé par mot de passe, et nos employés sont sensibilisés à la confidentialité des renseignements des clients.',
    ] },
    { h: 'Vos droits', p: [
      'Vous pouvez en tout temps : savoir quels renseignements nous détenons sur vous et en obtenir une copie ; les faire corriger s’ils sont inexacts, incomplets ou équivoques ; retirer votre consentement ; demander que nous cessions de les diffuser ; obtenir les renseignements que vous nous avez fournis dans un format technologique structuré et couramment utilisé, ou les faire transmettre à une personne de votre choix.',
      'Écrivez au responsable de la protection des renseignements personnels. Nous répondons dans les 30 jours. Ce service est gratuit ; seuls des frais raisonnables de reproduction pourraient s’appliquer, et vous en seriez avisé à l’avance.',
    ] },
    { h: 'Incidents de confidentialité', p: [
      'Si un incident touche vos renseignements (accès, utilisation ou perte non autorisés), nous prenons rapidement les mesures pour en réduire les effets. S’il présente un risque de préjudice sérieux, nous en avisons la Commission d’accès à l’information et les personnes concernées. Nous tenons un registre de tous les incidents.',
    ] },
    { h: 'Plaintes', p: [
      'Adressez votre plainte par écrit au responsable de la protection des renseignements personnels. Nous l’examinons et vous répondons dans les 30 jours. Si notre réponse ne vous satisfait pas, vous pouvez vous adresser à la Commission d’accès à l’information du Québec (cai.gouv.qc.ca).',
    ] },
    { h: 'Notre gouvernance', p: [
      'Chez Multi-Moulures : le responsable de la protection des renseignements personnels veille à l’application de cette politique ; seuls les employés qui en ont besoin ont accès aux renseignements ; les plaintes et les demandes d’accès sont traitées selon la procédure décrite ci-dessus ; nous appliquons un calendrier de conservation et de destruction ; nous évaluons les facteurs relatifs à la vie privée avant tout nouveau système ou projet qui traite des renseignements personnels ; nous tenons un registre des incidents de confidentialité.',
    ] },
    { h: 'Modifications', p: [
      'Nous pouvons mettre cette politique à jour. La date de la dernière mise à jour figure en haut de la page. En cas de changement important, nous l’indiquerons clairement sur nos sites.',
    ] },
  ];
  return [
    { h: 'Who we are', p: [
      `${mv ? 'Multi-Ventilation is a division of Multi-Moulures inc.' : 'Multi-Moulures inc.'} ("Multi-Moulures", "we") manufactures custom metal flashings and ventilation products at 1410 rue Hocquart, Saint-Bruno-de-Montarville, Quebec J3V 6B5.`,
      'This policy explains, in plain terms, what personal information we collect, why, how we protect it and what your rights are. It applies to multimoulures.com and multiventilation.ca, and to information you send us by phone or email.',
    ] },
    { h: 'Person in charge of the protection of personal information', p: [
      'Marc Edwards, President, is in charge of the protection of personal information at Multi-Moulures.',
      'For any question, request or complaint: confidentialite@multimoulures.com, (450) 441-1226, or by mail at the address above, to the attention of the person in charge of the protection of personal information.',
    ], todo: 'To confirm: person in charge and the confidentialite@multimoulures.com address.' },
    { h: 'Information we collect', p: [
      'When you fill out a form (quote request, account application, reseller request): your name, company name, phone, email, city and province, type of business, the content of your message and any files you attach (sketches, photos, drawings).',
      'When you become a customer: your company’s billing and delivery details and your order history.',
      'We do not ask for any sensitive information or any online payment on our websites.',
    ] },
    { h: 'Why we collect it', p: [
      'We only use your information to: answer your request and prepare your quote; open and manage your account; manufacture, deliver and invoice your orders; ' + (mv ? 'refer your request to the Multi-Ventilation reseller in your region, if you agree; ' : '') + 'meet our legal and tax obligations.',
      'We never sell or rent your personal information.',
    ] },
    { h: 'Your consent', p: [
      'By sending us a form, you consent to the use of your information for the purposes above. You may withdraw your consent at any time by writing to the person in charge; we will then stop using it, unless the law requires us to keep it.',
    ] },
    { h: 'Cookies and website technologies', p: [
      'Our websites use no advertising cookies and no technology that can identify you, locate you or build a profile of you.',
      'We measure traffic anonymously, without cookies, to learn which pages are useful. These statistics cannot identify you.',
    ] },
    { h: 'Who has access to your information', p: [
      'Only Multi-Moulures employees who need it to handle your request or order have access.',
      (mv ? 'If you are a roofer in a region served by a reseller, and only with your agreement, we send them your contact details and request so they can serve you. ' : '') + 'We also use service providers to host our websites, receive forms and manage our email. They use your information only to provide that service, under a written agreement that requires them to protect it.',
      'Some of these providers store data outside Quebec, including in the United States (Cloudflare hosting). Before entrusting information outside Quebec, we assess that it will receive adequate protection, as the law requires.',
    ] },
    { h: 'How long we keep it', p: [
      'Quote requests that do not lead to an order: 3 years after the last contact. Customer files: for the business relationship, then 6 years to meet our tax obligations. After that, information is securely destroyed or anonymized.',
    ] },
    { h: 'How we protect it', p: [
      'Our websites are encrypted (HTTPS), access to our systems is limited to authorized people and password protected, and our employees are trained to keep customer information confidential.',
    ] },
    { h: 'Your rights', p: [
      'At any time, you may: find out what information we hold about you and get a copy; have it corrected if it is inaccurate, incomplete or ambiguous; withdraw your consent; ask us to stop disseminating it; get the information you provided to us in a structured, commonly used technological format, or have it sent to a person of your choice.',
      'Write to the person in charge of the protection of personal information. We answer within 30 days. This service is free; only reasonable copying fees could apply, and you would be told in advance.',
    ] },
    { h: 'Confidentiality incidents', p: [
      'If an incident affects your information (unauthorized access, use or loss), we act quickly to reduce its effects. If it presents a risk of serious injury, we notify the Commission d’accès à l’information and the people concerned. We keep a register of all incidents.',
    ] },
    { h: 'Complaints', p: [
      'Send your complaint in writing to the person in charge of the protection of personal information. We review it and answer within 30 days. If you are not satisfied with our answer, you may contact the Commission d’accès à l’information du Québec (cai.gouv.qc.ca).',
    ] },
    { h: 'Our governance', p: [
      'At Multi-Moulures: the person in charge of the protection of personal information oversees this policy; only employees who need it have access to personal information; complaints and access requests follow the procedure above; we apply a retention and destruction schedule; we assess privacy factors before any new system or project that handles personal information; we keep a register of confidentiality incidents.',
    ] },
    { h: 'Changes', p: [
      'We may update this policy. The date of the last update appears at the top of the page. If we make a significant change, we will say so clearly on our websites.',
    ] },
  ];
}
