/**
 * The council's eight departments, as first entered from the documents the
 * secretariat supplied (September 2026):
 *
 * - "Présentation du CEPCA" (BURED) — the remit of every department, the
 *   Executive Committee, the council-wide figures.
 * - The Health Department's profile and its roll-up sheet — vision,
 *   objectives, activities, services, figures, contact.
 * - "Le Département du Témoignage Chrétien" — the DTC, DJ and DFAS
 *   attributions, the DFAS constitution and the April–June 2026 action plans.
 * - The DIC's note on its premises (its salaries, rents and running costs are
 *   internal and deliberately left out).
 * - The Health Department's DHSD project framework.
 *
 * Pure data, read by two things: the "Import the council's departments"
 * action on /admin/departments and `npm run seed-departments`. Both insert only
 * the slugs that are missing, so running either again never overwrites what a
 * department has since written. A field the documents say nothing about is
 * left empty (and so hidden on the public page) rather than guessed.
 *
 * No imports, on purpose: `scripts/seed-departments.mts` loads this file with
 * plain Node, which cannot resolve the `@/` alias.
 */

export interface SeedText {
  en: string;
  fr: string;
}

export interface DepartmentSeed {
  slug: string;
  acronym: string;
  sortOrder: number;
  name: SeedText;
  tagline?: SeedText;
  summary: SeedText;
  vision?: SeedText;
  mission?: SeedText;
  objectives?: SeedText;
  services?: SeedText;
  structures?: SeedText;
  keyFigures?: SeedText;
  support?: SeedText;
  coverage?: SeedText;
  location?: SeedText;
  headTitle?: SeedText;
  headName?: string;
  phone?: string;
  email?: string;
  address?: string;
  website?: string;
  published: boolean;
}

export interface DepartmentActivitySeed {
  slug: string;
  departmentSlug: string;
  kind: 'event' | 'activity' | 'project';
  title: SeedText;
  summary: SeedText;
  body?: SeedText;
  location?: SeedText;
  /** YYYY-MM-DD */
  date: string;
  endDate?: string;
  published: boolean;
}

/** Markdown, one line per argument — keeps list items flush-left. */
const md = (...lines: string[]) => lines.join('\n');

const EXECUTIVE_SECRETARY: SeedText = { en: 'Executive Secretary', fr: 'Secrétaire exécutif' };

export const DEPARTMENT_SEEDS: DepartmentSeed[] = [
  /* ------------------------------------------------------------------ SAF */
  {
    slug: 'administration-and-finance',
    acronym: 'SAF',
    sortOrder: 1,
    published: true,
    name: {
      en: 'Administrative and Financial Service (SAF)',
      fr: 'Service Administratif et Financier (SAF)',
    },
    summary: {
      en: 'Centralizes all income and expenditures of CEPCA; prepares annual financial statements and inventory reports.',
      fr: "Centralise toutes les recettes et les dépenses du CEPCA ; établit le bilan et l'inventaire annuels.",
    },
    mission: {
      en: md(
        "- Centralise all of CEPCA's income and expenditure.",
        "- Draw up the council's annual balance sheet and inventory."
      ),
      fr: md(
        '- Centraliser toutes les recettes et les dépenses du CEPCA.',
        "- Établir le bilan et l'inventaire annuels du Conseil."
      ),
    },
    structures: {
      en: "The Head of the SAF sits on the **Executive Committee**, CEPCA's executive body. The committee meets twice a year, is convened by the President of CEPCA, and brings together the heads of the member churches, the General Secretary, the Executive Secretaries of the departments and the Head of the SAF.",
      fr: "Le Chef du SAF siège au **Comité Exécutif**, organe exécutif du CEPCA. Le comité se réunit deux fois par an sur convocation du Président du CEPCA et regroupe les Chefs d'Églises, le Secrétaire Général, les Secrétaires Exécutifs des Départements et le Chef du SAF.",
    },
    location: { en: 'CEPCA headquarters, Yaoundé', fr: 'Siège du CEPCA, Yaoundé' },
    headTitle: { en: 'Head of the SAF', fr: 'Chef du SAF' },
  },

  /* ------------------------------------------------------------------- DS */
  {
    slug: 'health',
    acronym: 'DS',
    sortOrder: 2,
    published: true,
    name: { en: 'Department of Health (DS)', fr: 'Département de la Santé (DS)' },
    tagline: {
      en: 'Restoring health through faith-based excellence.',
      fr: 'Restaurer la santé par une excellence fondée sur la foi.',
    },
    summary: {
      en: 'Coordinates public health activities of member churches; represents church medical works before the Government, particularly the Ministry of Public Health.',
      fr: 'Coordonne les activités de santé publique des Églises membres ; représente leurs œuvres médicales auprès du Gouvernement, en particulier du Ministère de la Santé Publique.',
    },
    vision: {
      en: "Guided by faith and driven by God's boundless love, the Council of Protestant Churches of Cameroon (CPCC) is dedicated to providing transformative, holistic and high-quality healthcare. Rooted in biblical principles and Christian values, our mission is to restore the physical, emotional and spiritual vitality of individuals and communities throughout Cameroon, realising our goal: “Together, One Church.”",
      fr: "Guidé par la foi et animé par l'amour infini de Dieu, le Conseil des Églises Protestantes du Cameroun (CEPCA) s'engage à offrir des services de santé transformateurs, holistiques et de grande qualité. Enracinée dans les principes bibliques et les valeurs chrétiennes, notre mission est de restaurer la vitalité physique, émotionnelle et spirituelle des personnes et des communautés à travers tout le Cameroun, pour réaliser notre devise : « Être Église ensemble ».",
    },
    mission: {
      en: md(
        "- Coordinate the public-health activities of CEPCA's member churches.",
        "- Represent the member churches' medical works before the Government, in particular the Ministry of Public Health.",
        '- Offer patients a warm welcome and quality care in our facilities, with priority given to the fight against HIV/AIDS, malaria and tuberculosis, and to community health.'
      ),
      fr: md(
        '- Coordonner les activités de santé publique des Églises membres du CEPCA.',
        '- Représenter les œuvres médicales des Églises membres auprès du Gouvernement, en particulier du Ministère de la Santé Publique.',
        "- Offrir aux patients un accueil et des soins de qualité dans nos structures, en donnant la priorité à la lutte contre le VIH/SIDA, le paludisme et la tuberculose, ainsi qu'à la santé communautaire."
      ),
    },
    objectives: {
      en: md(
        'Our strategic objectives promote inclusive access to quality healthcare, holistic health and well-being, a stronger health workforce and infrastructure, and sustainable growth.',
        '',
        '### 1. Ensure inclusive access to quality, compassionate healthcare',
        '- Accelerate access to quality reproductive, maternal, newborn, child and adolescent health (RMNCH) services, with an emphasis on reducing maternal and neonatal mortality.',
        '- Improve access to essential care for vulnerable populations, including internally displaced persons and persons with disabilities.',
        '- Empower member churches to establish and deliver basic health services, by expanding our healthcare network.',
        '',
        '### 2. Promote holistic health and well-being',
        '- Launch a comprehensive health education programme — preventive care, nutrition and hygiene — delivered by trained volunteers in at least 50% of member parishes.',
        '- Integrate mental health services into primary care in all major CPCC health facilities.',
        '- Organise quarterly vaccination and screening campaigns for common diseases, with local churches and community leaders.',
        '',
        '### 3. Strengthen human resources and infrastructure for health',
        '- Run a continuing professional development programme giving all clinical staff up-to-date training in modern medical practice and technology.',
        '- Develop and deploy a digital medical records system in all CPCC health facilities.',
        '- Create a recruitment and retention fund to attract and keep qualified health professionals in hard-to-serve locations.',
        '',
        '### 4. Promote unity and sustainable growth',
        '- Create a transparent, centralised financial management system for all Health Department activities.',
        '- Form a Health Department board, with representatives of the member churches, to guide strategy and foster shared ownership.',
        '- Diversify funding through partnerships with international NGOs, foundations and existing partners.'
      ),
      fr: md(
        "Nos objectifs stratégiques visent un accès inclusif à des soins de qualité, la santé et le bien-être intégral, des ressources humaines et des infrastructures de santé renforcées, et une croissance durable.",
        '',
        '### 1. Garantir un accès inclusif à des soins de qualité, empreints de compassion',
        "- Accélérer l'accès à des services de qualité en santé de la reproduction, de la mère, du nouveau-né, de l'enfant et de l'adolescent (SRMNIA), en mettant l'accent sur la réduction de la mortalité maternelle et néonatale.",
        "- Améliorer l'accès aux soins essentiels pour les populations vulnérables, notamment les personnes déplacées internes et les personnes handicapées.",
        "- Donner aux Églises membres les moyens de créer et d'offrir des services de santé de base, en étendant notre réseau de soins.",
        '',
        '### 2. Promouvoir la santé et le bien-être intégral',
        "- Lancer un programme complet d'éducation à la santé — prévention, nutrition et hygiène — animé par des bénévoles formés dans au moins 50 % des paroisses membres.",
        '- Intégrer les services de santé mentale aux soins primaires dans toutes les principales formations sanitaires du CEPCA.',
        '- Organiser chaque trimestre des campagnes de vaccination et de dépistage des maladies courantes, avec les Églises locales et les responsables communautaires.',
        '',
        '### 3. Renforcer les ressources humaines et les infrastructures de santé',
        '- Mettre en place un programme de formation continue offrant à tout le personnel clinique une mise à jour sur les pratiques et technologies médicales modernes.',
        '- Concevoir et déployer un système de dossiers médicaux numériques dans toutes les formations sanitaires du CEPCA.',
        '- Créer un fonds de recrutement et de fidélisation pour attirer et retenir des professionnels de santé qualifiés dans les zones difficiles.',
        '',
        "### 4. Promouvoir l'unité et une croissance durable",
        '- Créer un système de gestion financière transparent et centralisé pour toutes les activités du Département de la Santé.',
        "- Constituer un conseil du Département de la Santé, avec des représentants des Églises membres, pour orienter la stratégie et favoriser l'appropriation commune.",
        '- Diversifier les sources de financement par des partenariats avec des ONG internationales, des fondations et les partenaires existants.'
      ),
    },
    services: {
      en: md(
        'We provide comprehensive general medical services alongside a wide range of specialised care.',
        '',
        '### Specialised care',
        '- **Internal medicine** — cardiology, endocrinology, neurology and oncology.',
        '- **Surgical specialties** — general surgery, paediatric surgery, orthopaedics and ophthalmology.',
        '- **Family and specialised health** — gynaecology and obstetrics, paediatrics and dentistry.',
        '- **Diagnostic and support services** — radiology, dermatology, pharmacy and ENT (ear, nose and throat).',
        '',
        '### Programmes and activities',
        '- **Access to care** — establishing and strengthening maternal and child health clinics in the member churches, and providing subsidised essential medicines and basic health services in rural and underserved communities.',
        '- **Holistic health** — health education campaigns on hygiene, nutrition and preventive care in at least half of the parishes, and mental health counselling in primary care facilities.',
        '- **Health workforce** — continuing professional development workshops for doctors, nurses and community health workers, and a digital medical records system across CPCC health facilities.',
        '- **Unity and sustainable growth** — a centralised financial management system, a Health Department board with representatives of the member churches, partnerships with international NGOs and foundations, and an annual health conference to share good practice.',
        '- **Community engagement** — health awareness programmes with local schools for children and adolescents, health fairs and open days with community leaders, parish volunteers trained as health ambassadors, and health newsletters and radio programmes in local languages.',
        '- **Coordination** — a meeting every quarter with the health-service coordinators of each member church.'
      ),
      fr: md(
        "Nous offrons des services complets de médecine générale, ainsi qu'un large éventail de soins spécialisés.",
        '',
        '### Soins spécialisés',
        '- **Médecine interne** — cardiologie, endocrinologie, neurologie et oncologie.',
        '- **Spécialités chirurgicales** — chirurgie générale, chirurgie pédiatrique, orthopédie et ophtalmologie.',
        '- **Santé familiale et spécialisée** — gynécologie-obstétrique, pédiatrie et dentisterie.',
        '- **Diagnostic et services de soutien** — radiologie, dermatologie, pharmacie et ORL (oto-rhino-laryngologie).',
        '',
        '### Programmes et activités',
        '- **Accès aux soins** — créer et renforcer des centres de santé maternelle et infantile dans les Églises membres, et fournir des médicaments essentiels subventionnés et des services de santé de base aux communautés rurales et mal desservies.',
        "- **Santé intégrale** — campagnes d'éducation à la santé sur l'hygiène, la nutrition et la prévention dans au moins la moitié des paroisses, et accompagnement en santé mentale dans les structures de soins primaires.",
        '- **Personnel de santé** — ateliers de formation continue pour les médecins, les infirmiers et les agents de santé communautaire, et système de dossiers médicaux numériques dans les formations sanitaires du CEPCA.',
        '- **Unité et croissance durable** — système de gestion financière centralisé, conseil du Département de la Santé avec des représentants des Églises membres, partenariats avec des ONG internationales et des fondations, et conférence annuelle de la santé pour partager les bonnes pratiques.',
        '- **Engagement communautaire** — programmes de sensibilisation avec les écoles pour les enfants et les adolescents, foires de la santé et journées portes ouvertes avec les responsables communautaires, bénévoles paroissiaux formés comme ambassadeurs de la santé, bulletins et émissions radio sur la santé en langues locales.',
        '- **Coordination** — une réunion chaque trimestre avec les coordonnateurs des services de santé de chaque Église membre.'
      ),
    },
    structures: {
      en: 'The department is run by its **Technical Committee**, headed by the **Executive Secretary** and supported by an office clerk. Its network brings together the health services of nine of the twelve member churches, each with its own health-service coordinator.',
      fr: 'Le département est animé par son **Comité technique**, dirigé par le **Secrétaire exécutif** et appuyé par un commis de bureau. Son réseau réunit les services de santé de neuf des douze Églises membres, chacun avec son propre coordonnateur.',
    },
    keyFigures: {
      en: md(
        '10 | Regions of Cameroon served',
        '9 of 12 | Member churches in the health network',
        '450+ | Hospitals and health centres',
        '12 | Healthcare training schools',
        '10,000+ | Health personnel',
        '270 | Medical doctors',
        '236 | Specialists',
        '1,755,868 | Outpatient consultations a year (average)',
        '675,345 | Hospital admissions a year (average)',
        '51,837 | Safe deliveries a year (average)',
        '476,674 | Vaccinations a year (average)'
      ),
      fr: md(
        '10 | Régions du Cameroun couvertes',
        '9 sur 12 | Églises membres dans le réseau de santé',
        '450+ | Hôpitaux et centres de santé',
        '12 | Écoles de formation en santé',
        '10 000+ | Personnels de santé',
        '270 | Médecins',
        '236 | Spécialistes',
        '1 755 868 | Consultations externes par an (moyenne)',
        '675 345 | Hospitalisations par an (moyenne)',
        '51 837 | Accouchements sans risque par an (moyenne)',
        '476 674 | Vaccinations par an (moyenne)'
      ),
    },
    support: {
      en: 'The Health Department is building partnerships with international NGOs, foundations and existing partners — for funding and for technical support — to widen access to quality, compassionate care across Cameroon. It is also seeking support for a recruitment and retention fund, to attract and keep qualified health professionals where they are needed most.',
      fr: "Le Département de la Santé noue des partenariats avec des ONG internationales, des fondations et ses partenaires existants — pour le financement comme pour l'appui technique — afin d'élargir l'accès à des soins de qualité, empreints de compassion, dans tout le Cameroun. Il recherche aussi des soutiens pour un fonds de recrutement et de fidélisation, afin d'attirer et de retenir des professionnels de santé qualifiés là où ils sont le plus nécessaires.",
    },
    coverage: { en: 'All 10 regions of Cameroon', fr: 'Les 10 régions du Cameroun' },
    location: { en: 'CEPCA headquarters, Yaoundé', fr: 'Siège du CEPCA, Yaoundé' },
    headTitle: EXECUTIVE_SECRETARY,
    phone: '+237 698 834 015 / +237 675 528 381',
    email: 'executifsantecepcacm@gmail.com',
    address: 'Rue Ceper, Elig-Essono — BP 491 Yaoundé, Cameroon',
    website: 'https://www.cepca-cpcc.org',
  },

  /* ----------------------------------------------------------------- OEPP */
  {
    slug: 'education',
    acronym: 'OEPP',
    sortOrder: 3,
    published: true,
    name: { en: 'Department of Education (OEPP)', fr: "Département de l'Éducation (OEPP)" },
    summary: {
      en: 'Coordinates the educational work of member churches; develops mid- and long-term policies for Protestant private education.',
      fr: "Coordonne l'activité des œuvres scolaires des Églises membres ; élabore une politique scolaire à moyen et à long terme pour l'Enseignement Privé Protestant.",
    },
    vision: {
      en: 'Education has long been the calling of the Christian missions, and we carry that vocation forward: to form competent citizens, women and men, who uphold Christian ethics wherever they are.',
      fr: "L'éducation a été l'apanage des missions chrétiennes et nous poursuivons cette vocation pour former des citoyennes et des citoyens compétents et soucieux de préserver l'éthique chrétienne partout où ils se trouvent.",
    },
    mission: {
      en: md(
        "- Coordinate the work of the member churches' schools and educational institutions.",
        '- Develop a medium- and long-term schools policy on the distinctive character and strategy of Protestant private education.'
      ),
      fr: md(
        "- Coordonner l'activité des différentes œuvres scolaires des Églises membres du CEPCA.",
        "- Élaborer une politique scolaire à moyen et à long terme sur la spécificité et la stratégie de l'Enseignement Privé Protestant."
      ),
    },
    keyFigures: {
      en: md(
        '1,580 | Schools, colleges, institutes and training centres in the member churches (approx.)',
        '15 | Universities and higher-education institutions (approx.)'
      ),
      fr: md(
        '1 580 | Écoles, collèges, instituts et centres de formation des Églises membres (environ)',
        "15 | Universités et établissements d'enseignement supérieur (environ)"
      ),
    },
    headTitle: EXECUTIVE_SECRETARY,
  },

  /* ----------------------------------------------------------------- DFAS */
  {
    slug: 'women-and-social-affairs',
    acronym: 'DFAS',
    sortOrder: 4,
    published: true,
    name: {
      en: 'Department of Women and Social Affairs (DFAS)',
      fr: 'Département des Femmes et des Affaires Sociales (DFAS)',
    },
    summary: {
      en: 'Highlights the role of women in Church and society; prepares women for effective participation within their churches and the Cameroonian community.',
      fr: "Rend visibles les femmes et leurs actions dans l'Église et la société ; prépare les femmes des Églises membres à une participation effective au sein de leurs Églises et de la société camerounaise.",
    },
    mission: {
      en: md(
        '- Make women and their work visible in the Church and in society.',
        "- Prepare the women of CEPCA's member churches to take a full part in their churches and in Cameroonian society.",
        '- Raise awareness among women and train them in leadership and management.',
        '- Equip women, in every dimension of life, for social transformation.'
      ),
      fr: md(
        "- Rendre visibles les femmes et leurs actions dans l'Église et la société.",
        '- Préparer les femmes des Églises membres du CEPCA à une participation effective au sein de celles-ci et de la société camerounaise.',
        '- Conscientiser et former les femmes au leadership et à la gestion.',
        '- Équiper les femmes, dans toutes les dimensions de la vie, pour la transformation sociale.'
      ),
    },
    services: {
      en: md(
        "- Encourage and support the women's departments and associations newly created in the member churches.",
        '- Carry out or support projects that lead to self-sufficiency, especially in rural areas.',
        '- Encourage women to create small, income-generating community businesses, and support them.',
        '- Train women to lead Bible and theological study groups.',
        '- Train women leaders in family health and environmental management.',
        '- Hold bimonthly meetings of women leaders.',
        '- Publish a bilingual newsletter.',
        '- Mentor women theology students and promote the pastoral ministry of women.',
        '- Build networks of Christian career women.',
        '- Promote the Fellowship of the Least Coin and the World Day of Prayer in the community.',
        '- Educate for ecumenism.',
        '- Create spaces for encounter and dialogue between men and women.'
      ),
      fr: md(
        '- Encourager et assister les départements et associations de femmes nouvellement créés dans les Églises membres du CEPCA.',
        "- Réaliser ou soutenir des projets menant à l'autosuffisance, surtout en milieu rural.",
        '- Encourager la création de petites entreprises communautaires de femmes génératrices de revenus, et les appuyer.',
        "- Former des animatrices d'études bibliques et théologiques.",
        "- Former des animatrices en santé familiale et en gestion de l'environnement.",
        '- Organiser les rencontres bimensuelles des dirigeantes.',
        "- Publier un bulletin d'information bilingue.",
        '- Encadrer les étudiantes en théologie et promouvoir le ministère pastoral féminin.',
        '- Former des réseaux de femmes de carrière chrétiennes.',
        '- Promouvoir dans la communauté le mouvement du « Plus Petit Sou » et la Journée mondiale de prière.',
        "- Éduquer à l'œcuménisme.",
        '- Créer des espaces de rencontre et de dialogue entre hommes et femmes.'
      ),
    },
    structures: {
      en: "The department is made up of the women's associations of CEPCA's twelve member churches.",
      fr: 'Le département est constitué des associations de femmes des douze Églises membres du CEPCA.',
    },
    headTitle: EXECUTIVE_SECRETARY,
  },

  /* ------------------------------------------------------------------ DTC */
  {
    slug: 'christian-witness',
    acronym: 'DTC',
    sortOrder: 5,
    published: true,
    name: { en: 'Department of Christian Witness (DTC)', fr: 'Département du Témoignage Chrétien (DTC)' },
    summary: {
      en: 'Coordinates the evangelism planning of the member churches, organises theological reflection, and supports the bodies it oversees — the National Evangelism Centre, the Protestant Chaplaincy, Christian Youth and the Ecumenical Social Works.',
      fr: "Coordonne la planification de l'évangélisation des Églises membres, organise la réflexion théologique et soutient les structures qu'il supervise — le Centre National d'Évangélisation, l'Aumônerie Protestante, la Jeunesse Chrétienne et les Œuvres Sociales Œcuméniques.",
    },
    mission: {
      en: md(
        "- Coordinate the planning of the member churches' evangelism efforts.",
        '- Organise theological reflection meetings and related studies, to analyse the spiritual situation and find the right ways of evangelising in Cameroon — and above all within the member churches.',
        '- Support the different components of the department in their own fields of evangelism.',
        '- Know the financial needs of each component, and seek the means to help them.'
      ),
      fr: md(
        "- Coordonner le planning des différents efforts d'évangélisation des Églises membres du CEPCA.",
        "- Organiser des réunions de réflexion théologique et des études assimilées pour analyser la situation spirituelle et chercher les méthodes appropriées d'évangélisation au Cameroun, et plus précisément pour les Églises membres.",
        "- Assister les différentes composantes du département dans leurs domaines particuliers d'évangélisation.",
        '- Connaître les besoins financiers de chaque composante et chercher les moyens de les aider.'
      ),
    },
    structures: {
      en: md(
        'The department supervises the activities of:',
        '',
        '- **The National Evangelism Centre (CNE)**',
        '- **The Protestant Chaplaincy**',
        '- **Christian Youth**',
        '- **The Ecumenical Social Works**'
      ),
      fr: md(
        'Le département supervise les activités des structures suivantes :',
        '',
        "- **Le Centre National d'Évangélisation (CNE)**",
        "- **L'Aumônerie Protestante**",
        '- **La Jeunesse Chrétienne**',
        '- **Les Œuvres Sociales Œcuméniques**'
      ),
    },
    headTitle: EXECUTIVE_SECRETARY,
  },

  /* ------------------------------------------------------------------- DJ */
  {
    slug: 'youth',
    acronym: 'DJ',
    sortOrder: 6,
    published: true,
    name: { en: 'Department of Youth (DJ)', fr: 'Département de la Jeunesse (DJ)' },
    summary: {
      en: 'Trains young people for active participation in church and society; develops tools for civic and moral education; identifies common challenges and interests.',
      fr: "Forme les jeunes à une participation efficace et effective à la vie de l'Église et de la société ; développe des outils d'éducation à la citoyenneté et à l'intégrité ; identifie les problèmes et intérêts communs.",
    },
    mission: {
      en: md(
        '- Channel the efforts of young Christians towards spiritual renewal and attachment to the Word of God, so that they take an active part in the development of the Church and the nation.',
        '- Help the young people of the member churches pursue their concerns through the Word of God lived out in daily life.',
        '- Create, develop and sustain collaboration, solidarity, sharing and fellowship between the Christian youth movements of the member churches — and those the department recognises — so that the Gospel reaches the young people of Cameroon effectively.',
        '- Train young people to take an effective part in the life of the Church and of society.',
        '- Develop tools for citizenship and integrity education for young people, and identify their shared problems and interests.'
      ),
      fr: md(
        "- Canaliser les efforts des jeunes chrétiens pour un renouveau spirituel et un attachement à la Parole de Dieu, en vue d'une participation active au développement de l'Église et de la Nation.",
        "- Aider les jeunes des Églises membres du CEPCA à réaliser leurs préoccupations par l'attachement à la Parole de Dieu vécue dans leur vie quotidienne.",
        '- Créer, développer et entretenir des relations de collaboration, de solidarité, de partage et de fraternité entre les mouvements de jeunesse chrétiens des Églises membres du CEPCA et ceux reconnus par le département, afin de rendre effectif et efficace le message évangélique parmi les jeunes du Cameroun.',
        "- Former des jeunes pour une participation efficace et effective à la vie de l'Église et de la société.",
        "- Développer des outils d'éducation à la citoyenneté et à l'intégrité destinés aux jeunes, et identifier les problèmes et intérêts communs."
      ),
    },
    headTitle: EXECUTIVE_SECRETARY,
  },

  /* ------------------------------------------------------------------ DIC */
  {
    slug: 'information-and-communication',
    acronym: 'DIC',
    sortOrder: 7,
    published: true,
    name: {
      en: 'Department of Information and Communication (DIC)',
      fr: "Département de l'Information et de la Communication (DIC)",
    },
    summary: {
      en: 'Handles all communication within CEPCA; produces and broadcasts Protestant radio and TV programs; assists member churches with event coverage.',
      fr: "Assure l'information et la communication au sein du CEPCA ; produit et diffuse les émissions protestantes de radio et de télévision ; accompagne les Églises membres dans la couverture de leurs manifestations.",
    },
    mission: {
      en: md(
        '- Handle information and communication within CEPCA.',
        "- Produce and broadcast CEPCA's Protestant radio and television programmes.",
        '- Support the member churches and the departments in covering ceremonies and other public events — sound systems and live broadcasting.'
      ),
      fr: md(
        "- Assurer l'information et la communication au sein du CEPCA.",
        '- Produire et diffuser les émissions radiophoniques et télévisées protestantes du CEPCA.',
        '- Assister les Églises membres et les départements dans la couverture des cérémonies et autres manifestations publiques : sonorisation, diffusion en direct.'
      ),
    },
    services: {
      en: md(
        '- **Radio and television** — production and broadcasting of Protestant programmes.',
        '- **Event coverage** — sound systems and live broadcasts for the ceremonies and public events of the member churches and departments.',
        '- **Drama with young people** — drama programmes produced with youth.',
        '- **Peace in congregations** — peace-building activities at congregational level.'
      ),
      fr: md(
        "- **Radio et télévision** — production et diffusion d'émissions protestantes.",
        '- **Couverture des événements** — sonorisation et diffusion en direct des cérémonies et manifestations publiques des Églises membres et des départements.',
        '- **Théâtre avec les jeunes** — programmes de théâtre réalisés avec des jeunes.',
        '- **La paix dans les paroisses** — activités de paix au niveau des paroisses.'
      ),
    },
    structures: {
      en: md(
        "The department's premises, placed under the responsibility of the Executive Secretary:",
        '',
        '- **The Communication House**',
        '- **The Communication Department building**',
        '- **The radio** — conference room, recording studio, technical booth, store and audiovisual centre',
        "- **The producer's office**",
        '- **The office and secretariat of the Executive Secretary**'
      ),
      fr: md(
        'Les locaux du département, placés sous la responsabilité de la Secrétaire exécutive :',
        '',
        '- **La Maison de la Communication**',
        '- **Le bâtiment du Département de la Communication**',
        "- **La radio** — salle de conférence, studio d'enregistrement, régie technique, magasin et centre audiovisuel",
        '- **Le bureau du producteur**',
        '- **Le bureau et le secrétariat de la Secrétaire exécutive**'
      ),
    },
    keyFigures: {
      en: '9 | Radio stations, across five regions of Cameroon',
      fr: '9 | Radios, dans cinq régions du Cameroun',
    },
    headName: 'Rev. Elsie Etaka',
    headTitle: { en: 'Executive Secretary', fr: 'Secrétaire exécutive' },
  },

  /* ---------------------------------------------------------------- BURED */
  {
    slug: 'research-and-development',
    acronym: 'BURED',
    sortOrder: 8,
    published: true,
    name: {
      en: 'Bureau for Research and Development Studies (BURED)',
      fr: "Bureau de Recherches et d'Études pour le Développement (BURED)",
    },
    summary: {
      en: "Promotes CEPCA's and its member churches' participation in national development and socio-economic issues.",
      fr: 'Promeut et anime la participation du CEPCA et de ses Églises membres au développement et aux grandes questions sociales et économiques de la société camerounaise.',
    },
    vision: {
      en: 'CEPCA is an important actor and a strategic partner in development — for a holistic Gospel, one that brings together the purely religious and the works of Christian witness.',
      fr: "Le CEPCA est un acteur important et un partenaire stratégique pour les questions de développement d'un Évangile holistique, c'est-à-dire combinant à la fois les aspects purement religieux et ceux d'œuvres de témoignage chrétien.",
    },
    mission: {
      en: 'The main objective of BURED is to promote and drive the participation of CEPCA and its member churches in development, and in the major social and economic questions facing Cameroonian society.',
      fr: "L'objectif principal du BURED est de promouvoir et d'animer la participation du CEPCA et des Églises membres du CEPCA au développement et dans le cadre des grandes questions sociales et économiques de la société camerounaise.",
    },
    headName: 'John Essobe',
    headTitle: { en: 'Coordinator', fr: 'Coordonnateur' },
  },
];

/* --------------------------------------------------------------------------
   Drafts for the departments to confirm. None is published: the April–June
   2026 plans were written before the quarter, and nothing here says whether
   each one took place, so the department updates the date and the account and
   publishes it itself. The DHSD project is a proposal still seeking funding.
--------------------------------------------------------------------------- */

const Q2_2026 = { date: '2026-04-01', endDate: '2026-06-30' };

const DTC_DJ_PLAN = {
  en: 'Part of the quarterly action plan for April–June 2026 drawn up by the Youth and Christian Witness departments.',
  fr: "Activité inscrite au plan d'action trimestriel d'avril à juin 2026 du département de la Jeunesse et du Témoignage Chrétien.",
};

export const DEPARTMENT_ACTIVITY_SEEDS: DepartmentActivitySeed[] = [
  {
    slug: 'evangelism-campaign-east-cameroon-2026',
    departmentSlug: 'christian-witness',
    kind: 'event',
    ...Q2_2026,
    published: false,
    title: {
      en: 'Supervision of the evangelism campaign in East Cameroon',
      fr: "Supervision de la campagne d'évangélisation à l'Est Cameroun",
    },
    summary: {
      en: 'Planned for April–June 2026: supervising the evangelism campaign in East Cameroon, in partnership with the UEEC (CEPCA East).',
      fr: "Prévu d'avril à juin 2026 : supervision de la campagne d'évangélisation à l'Est Cameroun, en collaboration avec l'UEEC (CEPCA Est).",
    },
    body: DTC_DJ_PLAN,
    location: { en: 'East Region, Cameroon', fr: "Région de l'Est, Cameroun" },
  },
  {
    slug: 'trauma-training-military-chaplains-2026',
    departmentSlug: 'christian-witness',
    kind: 'event',
    ...Q2_2026,
    published: false,
    title: {
      en: 'Trauma training with the military chaplains',
      fr: 'Formation sur le traumatisme avec les aumôniers militaires',
    },
    summary: {
      en: 'Planned for April–June 2026: a training session on trauma, held with the military chaplains.',
      fr: "Prévu d'avril à juin 2026 : une formation sur le traumatisme avec les aumôniers militaires.",
    },
    body: DTC_DJ_PLAN,
  },
  {
    slug: 'refresher-course-military-chaplains-2026',
    departmentSlug: 'christian-witness',
    kind: 'event',
    ...Q2_2026,
    published: false,
    title: {
      en: 'Refresher course for the military chaplains',
      fr: 'Recyclage des aumôniers militaires',
    },
    summary: {
      en: 'Planned for April–June 2026: a refresher course for the military chaplains.',
      fr: "Prévu d'avril à juin 2026 : un recyclage des aumôniers militaires.",
    },
    body: DTC_DJ_PLAN,
  },
  {
    slug: 'be-yourself-pamphlet-2026',
    departmentSlug: 'youth',
    kind: 'event',
    ...Q2_2026,
    published: false,
    title: {
      en: 'Presenting the “Be Yourself” pamphlet to young people',
      fr: 'Présentation à la jeunesse du pamphlet « Be Yourself »',
    },
    summary: {
      en: 'Planned for April–June 2026: presenting the pamphlet “Be Yourself” to young people.',
      fr: "Prévu d'avril à juin 2026 : présentation à la jeunesse du pamphlet « Be Yourself ».",
    },
    body: DTC_DJ_PLAN,
  },
  {
    slug: 'regional-womens-offices-field-visits-2026',
    departmentSlug: 'women-and-social-affairs',
    kind: 'event',
    ...Q2_2026,
    published: false,
    title: {
      en: "Field visits to set up regional women's offices",
      fr: 'Descentes sur le terrain pour constituer des bureaux régionaux de femmes',
    },
    summary: {
      en: "Planned for April–June 2026: field visits to set up regional women's offices, to raise the department's visibility in the regions.",
      fr: "Prévu d'avril à juin 2026 : des descentes sur le terrain pour constituer des bureaux régionaux de femmes et accroître la visibilité du département dans les régions.",
    },
    body: {
      en: "Part of the department's quarterly action plan for April–June 2026.",
      fr: "Activité inscrite au plan d'action trimestriel d'avril à juin 2026 du département.",
    },
  },
  {
    slug: 'dignity-and-hygiene-for-schoolgirls-diamare',
    departmentSlug: 'health',
    kind: 'project',
    date: '2026-01-01',
    endDate: '2027-12-31',
    published: false,
    title: {
      en: 'Dignity and Hygiene for Schoolgirls in Diamaré (DHSD)',
      fr: 'Dignité et hygiène pour les filles scolarisées du Diamaré (DHSD)',
    },
    summary: {
      en: 'A two-year project proposal (2026–2027) to give schoolgirls in five pilot schools of the Diamaré department private sanitary blocks, hygiene education and sanitary napkins — so that no girl has to miss school because of her period. Funding is being sought.',
      fr: "Un projet de deux ans (2026–2027), en recherche de financement, pour doter cinq écoles pilotes du Diamaré de blocs sanitaires pour les filles, d'une éducation à l'hygiène et de serviettes hygiéniques — pour qu'aucune fille ne manque l'école à cause de ses règles.",
    },
    location: {
      en: 'Diamaré department, Far North Region',
      fr: "Département du Diamaré, Région de l'Extrême-Nord",
    },
    body: {
      en: md(
        '## The problem',
        '',
        'In the Diamaré department of the Far North Region, schools lack even basic sanitation. With no private toilets at all, girls are forced to relieve themselves in the open. With little education on menstrual health and little guidance from the adults around them, they face puberty with fear and shame — and the result is preventable infections, stigmatisation and high dropout rates.',
        '',
        '## What the project would change',
        '',
        '- **Dignified access** — one complete, functional sanitary block for girls in each of five pilot schools, ending open defecation and urination there.',
        '- **Health knowledge** — 90% of girls mastering bodily and menstrual hygiene, through a curriculum that includes menstrual and sexual health awareness.',
        '- **Staying in school** — a 50% fall in absenteeism during menstruation, helped by the distribution of sanitary napkins.',
        '- **Better health** — a 30% fall in reported cases of hygiene-related infections.',
        '- **Community ownership** — parents and teachers actively supporting girls, and student Hygiene and Sanitation Clubs looking after the facilities.',
        '',
        '## Main actions',
        '',
        '1. Build latrine and urinal blocks for girls in five pilot schools.',
        '2. Run hygiene awareness sessions focused on menstrual and sexual health.',
        '3. Train school directors, teachers and staff, together with personnel from the Delegation of Basic Education and the Diamaré Health District.',
        '4. Distribute sanitary napkins and hygiene kits to girls of pubescent age.',
        '5. Set up Hygiene and Sanitation Clubs to manage and maintain the facilities.',
        '',
        '## Timeline',
        '',
        'The project would run for 24 months:',
        '',
        '- **Year 1 — launch and construction:** baseline surveys and school selection in the first quarter, training of directors and teachers, and building the sanitary blocks.',
        '- **Year 2 — education and sustainability:** Hygiene and Sanitation Clubs, distribution of hygiene kits, parental involvement and a mid-term evaluation, then a final evaluation and the handover of the facilities to the local councils in the eighth quarter.',
        '',
        '## Partners',
        '',
        'The proposal is addressed to the Ministry of Public Health (MINSANTE) and involves the Ministry of Basic Education (MINEDUB) through its departmental delegation, the Diamaré Health District, the municipal councils and local elites. The aim is a model the Ministry of Public Health could extend to other departments, such as Logone-et-Chari.',
        '',
        '## Status',
        '',
        'This is a project proposal. The Health Department will contribute its own funds and is seeking the rest of the budget from partners, including the Ministries of Public Health and Basic Education, with contributions expected from local elites and municipal councils.'
      ),
      fr: md(
        '## Le problème',
        '',
        "Dans le département du Diamaré, dans la Région de l'Extrême-Nord, les écoles manquent de l'assainissement le plus élémentaire. Faute de toilettes privées, les filles sont contraintes de se soulager en plein air. Avec peu d'éducation à la santé menstruelle et peu d'accompagnement de la part des adultes qui les entourent, elles vivent la puberté dans la peur et la honte — avec pour conséquences des infections évitables, la stigmatisation et de nombreux abandons scolaires.",
        '',
        '## Ce que le projet changerait',
        '',
        "- **Un accès digne** — un bloc sanitaire complet et fonctionnel pour les filles dans chacune des cinq écoles pilotes, pour mettre fin à la défécation et à la miction à l'air libre.",
        "- **Des connaissances en santé** — 90 % des filles maîtrisant l'hygiène corporelle et menstruelle, grâce à un programme qui inclut la sensibilisation à la santé menstruelle et sexuelle.",
        "- **Rester à l'école** — une baisse de 50 % de l'absentéisme pendant les règles, favorisée par la distribution de serviettes hygiéniques.",
        "- **Une meilleure santé** — une baisse de 30 % des cas signalés d'infections liées au manque d'hygiène.",
        "- **L'appropriation communautaire** — des parents et des enseignants qui soutiennent activement les filles, et des clubs d'hygiène et d'assainissement d'élèves qui entretiennent les installations.",
        '',
        '## Principales actions',
        '',
        "1. Construire des blocs de latrines et d'urinoirs pour les filles dans cinq écoles pilotes.",
        "2. Animer des séances de sensibilisation à l'hygiène centrées sur la santé menstruelle et sexuelle.",
        "3. Former les directeurs d'école, les enseignants et le personnel, avec des agents de la Délégation de l'Éducation de Base et du District de Santé du Diamaré.",
        "4. Distribuer des serviettes hygiéniques et des kits d'hygiène aux filles pubères.",
        "5. Créer des clubs d'hygiène et d'assainissement pour gérer et entretenir les installations.",
        '',
        '## Calendrier',
        '',
        'Le projet se déroulerait sur 24 mois :',
        '',
        '- **Année 1 — lancement et construction :** enquêtes de base et choix des écoles au premier trimestre, formation des directeurs et des enseignants, construction des blocs sanitaires.',
        "- **Année 2 — éducation et durabilité :** clubs d'hygiène et d'assainissement, distribution des kits d'hygiène, implication des parents et évaluation à mi-parcours, puis évaluation finale et remise des installations aux communes au huitième trimestre.",
        '',
        '## Partenaires',
        '',
        "La proposition est adressée au Ministère de la Santé Publique (MINSANTE) et associe le Ministère de l'Éducation de Base (MINEDUB) par sa délégation départementale, le District de Santé du Diamaré, les communes et les élites locales. L'objectif est un modèle que le Ministère de la Santé Publique pourrait étendre à d'autres départements, comme le Logone-et-Chari.",
        '',
        '## État du projet',
        '',
        "Il s'agit d'une proposition de projet. Le Département de la Santé apportera ses fonds propres et recherche le reste du budget auprès de partenaires, notamment les Ministères de la Santé Publique et de l'Éducation de Base, avec des contributions attendues des élites locales et des communes."
      ),
    },
  },
];
