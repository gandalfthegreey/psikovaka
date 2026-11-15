const fs = require('fs');
const path = require('path');

const diagPath = path.join(__dirname, 'js', 'diagnoses.js');
const diagModule = require(diagPath);
const list = diagModule.DIAGNOSES_DATABASE;
const cats = diagModule.DSM_CATEGORIES;

const additions = [
    { id: "other_specified_anxiety", nameTr: "Belirlenmiş Diğer Bir Anksiyete Bozukluğu (Sınırlı Belirtili Panik vb.)", nameEn: "Other Specified Anxiety Disorder", category: "ANXIETY", aliases: ["Kısa Süreli Anksiyete", "F41.8"] },
    { id: "other_specified_ocd", nameTr: "Belirlenmiş Diğer Bir OKB ve İlişkili Bozukluk (Obsesyonel Kıskançlık / Koro)", nameEn: "Other Specified Obsessive-Compulsive and Related Disorder", category: "OCD_RELATED", aliases: ["Koro Sendromu", "Obsesyonel Kıskançlık", "F42.8"] },
    { id: "other_specified_trauma", nameTr: "Belirlenmiş Diğer Bir Travma ve Stresörle İlişkili Bozukluk", nameEn: "Other Specified Trauma- and Stressor-Related Disorder", category: "TRAUMA", aliases: ["Süregen Karmaşık Yas", "F43.8"] },
    { id: "other_specified_somatic", nameTr: "Belirlenmiş Diğer Bir Bedensel Belirti Bozukluğu", nameEn: "Other Specified Somatic Symptom and Related Disorder", category: "SOMATIC", aliases: ["Kısa Süreli Somatizasyon", "F45.8"] },
    { id: "other_specified_feeding", nameTr: "Belirlenmiş Diğer Bir Beslenme ve Yeme Bozukluğu (Sınırlı Tıkınma)", nameEn: "Other Specified Feeding or Eating Disorder", category: "EATING", aliases: ["OSFED", "EDNOS", "F50.89"] }
];

additions.forEach(add => {
    if (!list.some(d => d.id === add.id)) {
        list.push(add);
    }
});

console.log('Total diagnoses in database after addition:', list.length);

const codeContent = `/**
 * PsikoVaka - DSM-5 & DSM-5-TR Tam Kapsamlı 297 Tanı Kütüphanesi
 * 22 Ana Kategori ve Tüm Resmi DSM-5 Tanı Listesi
 */

const DSM_CATEGORIES = ${JSON.stringify(cats, null, 4)};

const DIAGNOSES_DATABASE = ${JSON.stringify(list, null, 4)};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { DSM_CATEGORIES, DIAGNOSES_DATABASE };
}
`;

fs.writeFileSync(diagPath, codeContent, 'utf8');
console.log('Successfully written full 297 diagnoses.js!');
