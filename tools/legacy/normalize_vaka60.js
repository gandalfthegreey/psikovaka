const fs = require('fs');
const path = require('path');

const casesFile = path.join(__dirname, 'generate_cases_70_89.js');
let fileContent = fs.readFileSync(casesFile, 'utf8');

// Require the generate_cases_70_89.js by wrapping it or modifying it
// Let's create a script that reads the raw `newCases` and normalizes every case to pure format:
const rawCases = require('./vaka_paketi_60.json');

const difficultyMap = {
    1: "Kolay",
    2: "Orta",
    3: "Zor",
    4: "İleri Düzey"
};

const normalizedCases = rawCases.map((c, idx) => {
    const caseNum = 70 + idx;
    
    // Normalize clues
    let cluesStrList = [];
    let symptomHighlights = [];

    if (Array.isArray(c.clues)) {
        c.clues.forEach((clueObj, cIdx) => {
            let text = typeof clueObj === 'object' && clueObj !== null ? (clueObj.text || '') : String(clueObj || '');
            
            // Clean any [[...]] brackets
            const cleanText = text.replace(/\[\[(.*?)\]\]/g, '$1');
            cluesStrList.push(cleanText);

            if (clueObj.highlightTags && Array.isArray(clueObj.highlightTags)) {
                clueObj.highlightTags.forEach(tag => {
                    const cleanTag = tag.replace(/\[\[(.*?)\]\]/g, '$1');
                    if (cleanText.includes(cleanTag)) {
                        symptomHighlights.push({
                            clueIndex: cIdx,
                            text: cleanTag,
                            dsmMatch: `DSM-5 Kriter Belirteci: ${cleanTag}`
                        });
                    }
                });
            }
        });
    }

    // Normalize differential diagnosis string
    let diffStr = "";
    if (Array.isArray(c.differentialDiagnosis)) {
        diffStr = c.differentialDiagnosis.map(d => `• ${d.diagnosis}: ${d.reason}`).join('\n');
    } else if (typeof c.differentialDiagnosis === 'string') {
        diffStr = c.differentialDiagnosis;
    } else {
        diffStr = "• Ayırıcı tanı analizi tamamlanmıştır.";
    }

    let diffLevel = "Orta";
    if (typeof c.difficulty === 'number') {
        diffLevel = difficultyMap[c.difficulty] || "Orta";
    } else if (typeof c.difficulty === 'string') {
        diffLevel = c.difficulty;
    }

    return {
        id: `case-${String(caseNum).padStart(3, '0')}`,
        caseNumber: caseNum,
        difficulty: diffLevel,
        course: c.course || "ADULT",
        diagnosisId: c.diagnosisId,
        therapyId: c.therapyId || "cbt_general",
        category: c.category || "OTHER",
        patientSummary: typeof c.patientSummary === 'string' ? c.patientSummary : `${c.age} yaşında ${c.gender}, ${c.occupation}`,
        clues: cluesStrList,
        symptomHighlights: symptomHighlights.slice(0, 4),
        treatmentModality: c.treatmentModality || {
            goldStandardTherapy: "Bilişsel Davranışçı Terapi (BDT)",
            therapyDetails: "Otomatik düşünceleri yeniden yapılandırma ve davranışsal deneyler.",
            pharmacologyNote: "Gerektiğinde birinci basamak medikal tedavi."
        },
        miniQuiz: c.miniQuiz || {
            question: `Bu vakada (${c.patientSummary || 'Danışan'}) kesin tanıya götüren en kritik klinik bulgu nedir?`,
            options: [
                cluesStrList[5] || "DSM-5 tanı kriterinin karşılanması",
                "Fiziksel belirtilerin organik kökenli olması",
                "Belirtilerin sadece 1 gün sürmesi",
                "Hiçbir işlevsellik kaybı olmaması"
            ],
            correctIndex: 0,
            explanation: c.dsmAnalysis || diffStr
        },
        differentialDiagnosis: diffStr,
        dsmCriteriaSummary: c.dsmAnalysis || "DSM-5 tanı ölçütleri tam olarak karşılanmaktadır."
    };
});

fs.writeFileSync(path.join(__dirname, 'vaka_paketi_60.json'), JSON.stringify(normalizedCases, null, 2), 'utf8');
console.log('Successfully normalized vaka_paketi_60.json! Total cases:', normalizedCases.length);
