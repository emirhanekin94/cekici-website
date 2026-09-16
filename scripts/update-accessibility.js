const fs = require('fs');
const path = require('path');

const bolgelerDir = path.join(__dirname, '..', 'bolgeler');
const files = fs.readdirSync(bolgelerDir);

let count = 0;
for (const file of files) {
  if (file.endsWith('.html')) {
    const fullPath = path.join(bolgelerDir, file);
    let html = fs.readFileSync(fullPath, 'utf8');

    html = html.replace(
      /<select name="region_select" class="([^"]+)" required>/g,
      '<select name="region_select" aria-label="Bulunduğunuz Bölge" class="$1" required>'
    );
    html = html.replace(
      /<select name="vehicle_type_select" class="([^"]+)" required>/g,
      '<select name="vehicle_type_select" aria-label="Araç Türü" class="$1" required>'
    );
    html = html.replace(
      /<select name="problem_select" class="([^"]+)" required>/g,
      '<select name="problem_select" aria-label="Yaşanan Problem" class="$1" required>'
    );

    fs.writeFileSync(fullPath, html, 'utf8');
    count++;
  }
}

console.log(`Successfully added aria-labels to ${count} bolgeler pages.`);
