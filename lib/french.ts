import { books, type Book } from './catalogue';
import { frenchYear } from './locale';

export const specialtyNames: Record<string, string> = { medicine: 'Médecine', pharmacy: 'Pharmacie', 'dental-surgery': 'Médecine dentaire' };
const subjects: Record<string, string> = {
  Anatomy: 'Anatomie', Cytology: 'Cytologie', Histology: 'Histologie', Embryology: 'Embryologie', Biochemistry: 'Biochimie', Biophysics: 'Biophysique', Physiology: 'Physiologie', Genetics: 'Génétique', Immunology: 'Immunologie', Semiology: 'Sémiologie', Pathology: 'Anatomopathologie', Pharmacology: 'Pharmacologie', Microbiology: 'Microbiologie', Parasitology: 'Parasitologie', Radiology: 'Radiologie', Cardiology: 'Cardiologie', Pulmonology: 'Pneumologie', Gastroenterology: 'Gastro-entérologie', Nephrology: 'Néphrologie', Endocrinology: 'Endocrinologie', Haematology: 'Hématologie', Neurology: 'Neurologie', Paediatrics: 'Pédiatrie', 'Gynaecology and obstetrics': 'Gynécologie et obstétrique', 'General surgery': 'Chirurgie générale', Psychiatry: 'Psychiatrie', 'Infectious diseases': 'Maladies infectieuses', Dermatology: 'Dermatologie', 'Emergency medicine': 'Médecine d’urgence', Oncology: 'Oncologie', 'Public health': 'Santé publique', 'Legal medicine': 'Médecine légale', Ophthalmology: 'Ophtalmologie', ENT: 'ORL', Botany: 'Botanique', 'Organic chemistry': 'Chimie organique', 'Galenic pharmacy': 'Pharmacie galénique', Toxicology: 'Toxicologie', 'Analytical chemistry': 'Chimie analytique', 'Clinical pharmacy': 'Pharmacie clinique', Pharmacognosy: 'Pharmacognosie', 'Pharmaceutical legislation': 'Législation pharmaceutique', 'Hospital pharmacy': 'Pharmacie hospitalière', Pharmacovigilance: 'Pharmacovigilance', 'Dental anatomy': 'Anatomie dentaire', Occlusodontics: 'Occlusodontie', Biomaterials: 'Biomatériaux', 'Restorative dentistry': 'Dentisterie restauratrice', Periodontology: 'Parodontologie', 'Oral pathology': 'Pathologie buccale', Prosthodontics: 'Prothèse dentaire', 'Oral surgery': 'Chirurgie buccale', Orthodontics: 'Orthodontie', Endodontics: 'Endodontie', 'Paediatric dentistry': 'Odontologie pédiatrique', Implantology: 'Implantologie', 'Oral medicine': 'Médecine buccale',
};
export function frenchBook(book: Book): Book {
  const subject = book.kind === 'bundle' ? `${frenchYear(book.year)} complète` : subjects[book.subject];
  if (!subject) throw new Error(`Missing French translation: ${book.subject}`);
  return { ...book, specialtyName: specialtyNames[book.specialty], subject,
    title: `${subject} — ${specialtyNames[book.specialty]}`,
    summary: book.kind === 'bundle' ? `Toutes les matières de ${frenchYear(book.year)} de ${specialtyNames[book.specialty].toLowerCase()} réunies dans un carnet, avec des pages pour vos notes après chaque chapitre.` : `Des résumés essentiels de ${subject.toLowerCase()} pour la ${frenchYear(book.year)} de ${specialtyNames[book.specialty].toLowerCase()}, avec schémas, moyens mnémotechniques et pages de notes personnelles.`,
    href: `/fr${book.href}` };
}
export const frenchBooks = books.map(frenchBook);
export const features = ['Résumés essentiels', 'Organisation visuelle claire', 'Schémas d’anatomie', 'Notes de physiologie', 'Moyens mnémotechniques', 'Mise en page adaptée aux révisions', 'Pages de notes personnelles', 'Papier de qualité'];
export const frenchFaqs = [
  ['Que contient le carnet ?', 'Des résumés structurés et manuscrits de la matière indiquée sur la couverture, avec schémas et moyens mnémotechniques. Chaque chapitre est suivi de pages vierges pour vos notes, corrections et compléments de cours.'],
  ['Quelles années et spécialités sont couvertes ?', 'La collection se développe en médecine, pharmacie et médecine dentaire, année par année et matière par matière. En médecine, elle couvre les six premières années : la septième se déroule à l’hôpital. Une édition est disponible et les autres sont en préparation.'],
  ['Combien de pages contient un carnet ?', 'Cela dépend de la matière. L’édition de première année de médecine compte 320 pages. Chaque édition est imprimée sur du papier ivoire de 120 g/m², avec une reliure cousue qui permet une ouverture à plat.'],
  ['Les résumés sont-ils manuscrits ?', 'Chaque résumé est écrit à la main, puis reproduit en qualité d’impression. Vous retrouvez la clarté de l’écriture manuscrite et la régularité d’un livre imprimé.'],
  ['La livraison est-elle possible ?', 'Oui, la livraison est proposée dans tout le pays, avec un emballage rigide de protection. Les modalités sont confirmées par e-mail lors de la commande.'],
  ['De nouvelles éditions sont-elles prévues ?', 'Oui. De nouvelles matières sont publiées au fur et à mesure, et les éditions existantes sont révisées grâce aux retours des étudiants.'],
];
