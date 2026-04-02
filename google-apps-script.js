// ============================================================
// GOOGLE APPS SCRIPT — Colle ce code dans ton Google Sheet
// ============================================================
//
// ETAPES :
// 1. Ouvre Google Sheets → cree une nouvelle feuille
// 2. Va dans Extensions → Apps Script
// 3. Colle ce code (remplace tout le contenu)
// 4. Clique "Deployer" → "Nouveau deploiement"
// 5. Type = "Application Web"
// 6. Executer en tant que = "Moi"
// 7. Acces = "Tout le monde"
// 8. Copie l'URL du deploiement
// 9. Colle cette URL dans index.html a la ligne SHEET_WEBHOOK_URL
//
// ============================================================

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    // Create headers if first row is empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        'Date & Heure',
        'Prenom',
        'Age',
        'Serie',
        'Score',
        'Pourcentage',
        'Score normalise',
        'Niveau',
        'Temps',
        'Matieres (detail)',
        'Lacunes',
        'Points forts',
        'Difficulte max'
      ]);
      // Bold headers
      sheet.getRange(1, 1, 1, 13).setFontWeight('bold');
      sheet.setFrozenRows(1);
    }

    // Format subject scores
    let matieresStr = '';
    if (data.matieres) {
      matieresStr = Object.entries(data.matieres)
        .map(([subj, score]) => subj + ': ' + score)
        .join(' | ');
    }

    // Format timestamp
    const date = new Date(data.timestamp);
    const dateStr = Utilities.formatDate(date, 'Africa/Abidjan', 'dd/MM/yyyy HH:mm');

    sheet.appendRow([
      dateStr,
      data.prenom || 'Anonyme',
      data.age || '-',
      data.serie || '-',
      data.score || '-',
      (data.pourcentage || 0) + '%',
      (data.scoreNormalise || 0) + '%',
      data.niveau || '-',
      data.temps || '-',
      matieresStr,
      data.lacunes || '-',
      data.forces || '-',
      data.difficulteMax || '-'
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ok' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Allow GET requests for testing
function doGet() {
  return ContentService
    .createTextOutput('Webhook actif ! Les resultats des eleves seront enregistres ici.')
    .setMimeType(ContentService.MimeType.TEXT);
}
