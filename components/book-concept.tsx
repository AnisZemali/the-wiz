import type { Locale } from '@/lib/locale';
const french = [
 ['Des résumés de cours, pas des cours complets', 'Chaque livre rassemble des résumés de cours clairs et structurés, conçus à partir du programme algérien. L’objectif est de retrouver l’essentiel d’un cours sans se perdre dans des pages interminables.'],
 ['Un sommaire qui devient votre tracker', 'Au début de chaque livre, un sommaire complet des cours permet de retrouver facilement chaque contenu. Il devient également un tracker de progression, pour suivre les cours déjà révisés et ceux qu’il vous reste à parcourir.'],
 ['Une page pour apprendre, une page pour noter', 'En face de chaque résumé se trouve une page dédiée à vos propres notes. Ajoutez vos explications, remarques, schémas ou points importants directement dans le livre.'],
 ['Pensé selon le programme algérien', 'Les livres sont organisés par année, module et UEI, en suivant l’organisation du programme algérien afin de retrouver les modules dans un ordre familier.'],
 ['Un style manuscrit et minimaliste', 'Une typographie inspirée de l’écriture manuscrite, un design minimaliste en noir et blanc et des pages aérées donnent au livre une apparence proche de vos propres notes. Un support de révision personnel, simple et agréable à utiliser.'],
 ['Extra Notes', 'À la fin de chaque livre, une section Extra Notes rassemble des pages de notes vierges supplémentaires. Écrivez librement : informations, rappels, schémas ou tout ce qui n’a pas pu être noté en face des résumés. Le même style minimaliste, noir et blanc, inspiré de l’écriture manuscrite.'],
 ['Une collection qui évolue avec vous', 'MedWIZ — Médecine est la première collection de THE WIZ. D’autres collections viendront ensuite, avec le même principe : transformer les connaissances en livres de travail simples, organisés et agréables à utiliser.'],
];
const english = [
 ['Course summaries, not full courses', 'Each book brings together clear, structured course summaries based on the Algerian curriculum. Find the essentials of a course without getting lost in endless pages.'],
 ['Contents that become your tracker', 'Each book begins with a complete table of contents to help you find every summary. It also becomes a progress tracker, showing what you have revised and what is still ahead.'],
 ['A page to learn, a facing page to write', 'A dedicated notes page faces each summary. Add your explanations, comments, diagrams and key points directly in the book.'],
 ['Built around the Algerian curriculum', 'Books are organized by study year, module and integrated teaching unit (UEI), following the Algerian curriculum in a familiar order.'],
 ['Handwritten style, minimal design', 'Handwriting-inspired typography, black-and-white design and spacious pages give each book the feel of your own notes: a personal, simple and pleasant revision companion.'],
 ['Extra Notes', 'At the end of every book, Extra Notes provides additional blank notes pages. Write freely: information, reminders, diagrams and anything that did not fit beside the summaries. The same minimal, black-and-white, handwritten style continues throughout.'],
 ['A collection that grows with you', 'MedWIZ — Medicine is THE WIZ’s first collection. More collections will follow, sharing the same idea: turning knowledge into simple, organized and enjoyable workbooks.'],
];
export function BookConcept({locale}:{locale:Locale}) {
 const fr=locale==='fr';
 return <section id="why" className="shell border-t border-ink-12 py-20"><p className="type-eyebrow">{fr?'POURQUOI THE WIZ ?':'WHY THE WIZ?'}</p><h2 className="mt-6 max-w-3xl text-4xl">{fr?'Des livres pensés pour apprendre, noter et réviser.':'Books designed to learn, take notes and revise.'}</h2><div className="mt-12 grid gap-10 md:grid-cols-2">{(fr?french:english).map(([title,body],i)=><article key={title} className="border-t border-ink-12 pt-6"><p className="text-xs text-ink-56">0{i+1}</p><h3 className="mt-4 text-2xl">{title}</h3><p className="mt-4 max-w-xl leading-relaxed text-ink-56">{body}</p></article>)}</div></section>;
}
export function BookStructure({locale}:{locale:Locale}) {
 const fr=locale==='fr';
 const steps=fr?[['Sommaire / Tracker','Retrouvez les résumés et suivez votre progression.'],['Résumé du cours','L’essentiel, clairement structuré.'],['Page de notes en face','Vos explications et schémas à côté du résumé.'],['Extra Notes','Des pages vierges à la fin pour écrire librement.']]:[['Contents / Tracker','Find summaries and track your progress.'],['Course summary','The essentials, clearly structured.'],['Facing notes page','Your explanations and diagrams beside the summary.'],['Extra Notes','Blank pages at the end to write freely.']];
 return <ol className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{steps.map(([title,body],i)=><li key={title} className="rounded-2xl border border-ink-12 p-6"><span className="text-xs text-ink-56">0{i+1}</span><h3 className="mt-4 text-xl">{title}</h3><p className="mt-3 text-sm leading-relaxed text-ink-56">{body}</p></li>)}</ol>;
}
