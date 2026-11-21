// Lig eşik sınır testleri (node tools/online_dev/tests/p_leagues_unit.js)
const L = require('../../../js/leagues.js');
const exp = [['Bronz 1',0],['Bronz 2',150],['Bronz 3',300],['Gümüş 1',500],['Gümüş 2',700],['Gümüş 3',900],['Altın 1',1150],['Altın 2',1400],['Altın 3',1650],['Platin 1',1950],['Platin 2',2250],['Platin 3',2550],['Elmas 1',2900],['Elmas 2',3250],['Elmas 3',3600],['Uzman',4000],['Kahin',5000]];
let ok = 0, fail = 0; const t = (c, m) => { if (c) ok++; else { fail++; console.log('FAIL', m); } };
t(L.TIERS.length === 17, '17 kademe');
exp.forEach(([n, min], i) => {
  t(L.TIERS[i].name === n && L.TIERS[i].min === min, `${n} = ${min}`);
  t(L.tierFor(min).name === n, `tierFor(${min}) = ${n}`);
  if (i > 0) t(L.tierFor(min - 1).name === exp[i - 1][0], `tierFor(${min - 1}) = ${exp[i - 1][0]}`);
});
t(L.tierFor(-5).name === 'Bronz 1' && L.tierFor(null).name === 'Bronz 1', 'negatif/boş → Bronz 1');
t(L.tierFor(99999).name === 'Kahin' && L.tierFor(99999).next === null, 'Kahin en üst');
t(L.progressText(0) === "Bronz 2'ye 150 Elo kaldı", L.progressText(0));
t(L.progressText(1600) === "Altın 3'e 50 Elo kaldı", L.progressText(1600));
t(L.progressText(3700) === "Uzman'a 300 Elo kaldı", L.progressText(3700));
t(L.progressText(4500) === "Kahin'e 500 Elo kaldı", L.progressText(4500));
t(L.progressText(5000) === 'En üst ligdesin', 'en üst');
t(L.tierFor(1275).pct === 50, 'pct 1275 = 50 (' + L.tierFor(1275).pct + ')');
console.log(`lig sınır testleri: ${ok} ok / ${fail} fail`); process.exit(fail ? 1 : 0);
