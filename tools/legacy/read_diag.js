const fs = require('fs');
const path = require('path');

// We load the existing diagnoses to preserve all IDs that cases rely on
const existingDiagnoses = require('./js/diagnoses.js').DIAGNOSES_DATABASE;

console.log('Existing count:', existingDiagnoses.length);
