#!/usr/bin/env node
/**
 * PsikoVaka — cevap anahtarı + seçenek kataloğu SQL üreticisi.
 *
 * Kullanım (proje kökünden):   node supabase/seed/generate_answer_key.js
 * Çıktı:                       supabase/seed/0002_cases_answer_key.sql
 *
 * Normalde elle çalıştırmaya gerek yok: GITHUBA_YUKLE.bat (deploy_to_github.js)
 * bunu her yüklemede çalıştırır; GitHub'a gelince .github/workflows/
 * supabase-cevap-anahtari.yml aynı betiği yeniden çalıştırıp çıkan SQL'i
 * Supabase'e uygular. Elle yedek yol: SQL Editor'de bu dosyayı çalıştırmak.
 *
 * Betik idempotenttir (upsert; çıktıda tarih yok, aynı girdi = aynı dosya).
 * Listeden çıkan / adı değişen vakalar silinmez, is_active=false yapılır
 * (eski maç kayıtları ve sürmekte olan turlar onlara bağlı). Katalogdan çıkan
 * seçenekler silinir; ama hâlâ bir vakanın (pasif olsa bile) doğru cevabıysa
 * tutulur, böylece eski turların "grup doğru" hesabı bozulmaz. Katalog
 * satırlarına başka tablodan yabancı anahtar yok (round_guesses.item_id düz metin).
 *
 * Doğru cevaplar oyunun kendisiyle aynı kurallarla çözülür:
 *   therapyId yoksa 'cbt_general' (app.js openResultModal/submitGuess),
 *   pharmacologyId resolvePharmacologyIdForCase() ile (app.js getFallbackPharmacologyId).
 */
'use strict';
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..', '..');
const { CLINICAL_CASES } = require(path.join(root, 'js', 'cases.js'));
const { DIAGNOSES_DATABASE } = require(path.join(root, 'js', 'diagnoses.js'));
const { THERAPIES_DATABASE } = require(path.join(root, 'js', 'therapies.js'));
const { PHARMACOLOGY_DATABASE, resolvePharmacologyIdForCase } = require(path.join(root, 'js', 'pharmacology.js'));

const q = (v) => (v === null || v === undefined) ? 'null' : `'${String(v).replace(/'/g, "''")}'`;
const n = (v) => Number.isFinite(Number(v)) && v !== null && v !== undefined && v !== '' ? String(Number(v)) : 'null';

const errors = [];
const diagIds = new Set(DIAGNOSES_DATABASE.map(d => d.id));
const therIds = new Set(THERAPIES_DATABASE.map(t => t.id));
const pharIds = new Set(PHARMACOLOGY_DATABASE.map(p => p.id));
const seen = new Set();

const caseRows = CLINICAL_CASES.map((c) => {
  const therapyId = c.therapyId || 'cbt_general';
  const pharmacologyId = c.pharmacologyId || resolvePharmacologyIdForCase(c);
  if (!c.id) errors.push('id eksik vaka');
  if (seen.has(c.id)) errors.push(`tekrarlanan vaka id: ${c.id}`);
  seen.add(c.id);
  if (!diagIds.has(c.diagnosisId)) errors.push(`${c.id}: bilinmeyen diagnosisId ${c.diagnosisId}`);
  if (!therIds.has(therapyId)) errors.push(`${c.id}: bilinmeyen therapyId ${therapyId}`);
  if (!pharIds.has(pharmacologyId)) errors.push(`${c.id}: bilinmeyen pharmacologyId ${pharmacologyId}`);
  return `  (${q(c.id)}, ${n(c.caseNumber)}, ${q(c.diagnosisId)}, ${q(therapyId)}, ${q(pharmacologyId)}, ${q(c.category)}, ${q(c.difficulty)}, ${q(c.course)})`;
});

if (!CLINICAL_CASES.length) errors.push('js/cases.js içinde hiç vaka yok');
// Aynı id iki kez olursa "ON CONFLICT DO UPDATE command cannot affect row a second time" hatası çıkar
[['diagnosis', DIAGNOSES_DATABASE], ['therapy', THERAPIES_DATABASE], ['pharmacology', PHARMACOLOGY_DATABASE]]
  .forEach(([kind, list]) => {
    const ids = new Set();
    list.forEach(x => {
      if (!x.id) errors.push(`${kind}: id eksik öğe`);
      else if (ids.has(x.id)) errors.push(`${kind}: tekrarlanan id ${x.id}`);
      ids.add(x.id);
    });
  });
if (errors.length) {
  console.error('Doğrulama hataları:\n' + errors.join('\n'));
  process.exit(1);
}

const catalogRows = [
  ...DIAGNOSES_DATABASE.map(d => `  ('diagnosis', ${q(d.id)}, ${q(d.category)})`),
  ...THERAPIES_DATABASE.map(t => `  ('therapy', ${q(t.id)}, ${q(t.family)})`),
  ...PHARMACOLOGY_DATABASE.map(p => `  ('pharmacology', ${q(p.id)}, ${q(p.family)})`),
];

const catalogKeys = [
  ...DIAGNOSES_DATABASE.map(d => `           ('diagnosis', ${q(d.id)})`),
  ...THERAPIES_DATABASE.map(t => `           ('therapy', ${q(t.id)})`),
  ...PHARMACOLOGY_DATABASE.map(p => `           ('pharmacology', ${q(p.id)})`),
];

const sql = `-- OTOMATİK ÜRETİLDİ — elle düzenlemeyin.
-- Üretici: supabase/seed/generate_answer_key.js
-- Kaynak: js/cases.js (${CLINICAL_CASES.length} vaka), js/diagnoses.js (${DIAGNOSES_DATABASE.length}),
--         js/therapies.js (${THERAPIES_DATABASE.length}), js/pharmacology.js (${PHARMACOLOGY_DATABASE.length})
-- GitHub Actions (supabase-cevap-anahtari.yml) bu dosyayı her push'ta yeniden üretip Supabase'e uygular.
-- Elle yedek yol: dosyanın tamamını Supabase SQL Editor'de çalıştırın. Tekrar çalıştırmak güvenlidir.

begin;

insert into public.answer_catalog (kind, item_id, group_id) values
${catalogRows.join(',\n')}
on conflict (kind, item_id) do update set group_id = excluded.group_id;

insert into public.cases_answer_key
  (case_id, case_number, diagnosis_id, therapy_id, pharmacology_id, category, difficulty, course)
values
${caseRows.join(',\n')}
on conflict (case_id) do update set
  case_number     = excluded.case_number,
  diagnosis_id    = excluded.diagnosis_id,
  therapy_id      = excluded.therapy_id,
  pharmacology_id = excluded.pharmacology_id,
  category        = excluded.category,
  difficulty      = excluded.difficulty,
  course          = excluded.course,
  is_active       = true,
  updated_at      = now();

-- Listeden çıkan vakalar pasif (silinmez; eski maçlar onlara bağlı olabilir)
update public.cases_answer_key set is_active = false, updated_at = now()
 where is_active and case_id not in (${CLINICAL_CASES.map(c => q(c.id)).join(', ')});

-- Kaynaktan çıkan seçenekler katalogdan silinir; herhangi bir vakanın (pasif dahil)
-- doğru cevabı olanlar korunur.
delete from public.answer_catalog c
 where not exists (
         select 1 from (values
${catalogKeys.join(',\n')}
         ) as src(kind, item_id)
          where src.kind = c.kind::text and src.item_id = c.item_id)
   and not exists (
         select 1 from public.cases_answer_key k
          where (c.kind::text = 'diagnosis'    and k.diagnosis_id    = c.item_id)
             or (c.kind::text = 'therapy'      and k.therapy_id      = c.item_id)
             or (c.kind::text = 'pharmacology' and k.pharmacology_id = c.item_id));

commit;
`;

const out = path.join(__dirname, '0002_cases_answer_key.sql');
fs.writeFileSync(out, sql, 'utf8');
console.log(`Yazıldı: ${path.relative(root, out)} (${CLINICAL_CASES.length} vaka, ${catalogRows.length} katalog öğesi)`);
