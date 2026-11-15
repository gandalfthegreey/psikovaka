const fs = require('fs');
const path = require('path');

function fixHighlightsForCase(c) {
    if (!c.symptomHighlights || !Array.isArray(c.symptomHighlights)) return;
    
    const validHighlights = [];
    c.symptomHighlights.forEach(hl => {
        const clueText = c.clues[hl.clueIndex];
        if (!clueText) return;

        if (clueText.includes(hl.text)) {
            validHighlights.push(hl);
        } else if (hl.text.includes('...')) {
            // Split by ... and take the longest segment that exists in clueText
            const parts = hl.text.split('...').map(p => p.trim()).filter(p => p.length >= 4);
            const matchingPart = parts.find(p => clueText.includes(p));
            if (matchingPart) {
                validHighlights.push({
                    clueIndex: hl.clueIndex,
                    text: matchingPart,
                    dsmMatch: hl.dsmMatch
                });
            }
        } else {
            // Try trimmed or lowercase or partial match
            const words = hl.text.split(' ').filter(w => w.length >= 4);
            for (let i = 0; i < words.length - 1; i++) {
                const phrase = words[i] + ' ' + words[i+1];
                if (clueText.includes(phrase)) {
                    validHighlights.push({
                        clueIndex: hl.clueIndex,
                        text: phrase,
                        dsmMatch: hl.dsmMatch
                    });
                    break;
                }
            }
        }
    });
    c.symptomHighlights = validHighlights;
}

// 1. Fix vaka_paketi_20.json
const p20Path = path.join(__dirname, 'vaka_paketi_20.json');
if (fs.existsSync(p20Path)) {
    const p20 = JSON.parse(fs.readFileSync(p20Path, 'utf8'));
    p20.forEach(fixHighlightsForCase);
    fs.writeFileSync(p20Path, JSON.stringify(p20, null, 2), 'utf8');
}

// 2. Fix vaka_paketi_40.json
const p40Path = path.join(__dirname, 'vaka_paketi_40.json');
if (fs.existsSync(p40Path)) {
    const p40 = JSON.parse(fs.readFileSync(p40Path, 'utf8'));
    p40.forEach(fixHighlightsForCase);
    fs.writeFileSync(p40Path, JSON.stringify(p40, null, 2), 'utf8');
}

// 3. Fix vaka_paketi_60.json
const p60Path = path.join(__dirname, 'vaka_paketi_60.json');
if (fs.existsSync(p60Path)) {
    const p60 = JSON.parse(fs.readFileSync(p60Path, 'utf8'));
    p60.forEach(fixHighlightsForCase);
    fs.writeFileSync(p60Path, JSON.stringify(p60, null, 2), 'utf8');
}

console.log('Fixed all highlight text matching!');
