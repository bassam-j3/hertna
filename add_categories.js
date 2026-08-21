const fs = require('fs');

let f1 = 'frontend/src/components/SearchView.tsx';
let c1 = fs.readFileSync(f1, 'utf8');
if (!c1.includes("'ملابس'")) {
  c1 = c1.replace(/'أدوات منزلية'/g, "'أدوات منزلية',\n    'ملابس'");
  fs.writeFileSync(f1, c1);
  console.log('Updated SearchView.tsx');
}

let f2 = 'frontend/src/components/HomeFeed.tsx';
let c2 = fs.readFileSync(f2, 'utf8');
if (!c2.includes("'ملابس'")) {
  c2 = c2.replace(/'أدوات منزلية'/g, "'أدوات منزلية',\n    'ملابس'");
  fs.writeFileSync(f2, c2);
  console.log('Updated HomeFeed.tsx');
}

let f3 = 'frontend/src/components/modals/AddItemModal.tsx';
let c3 = fs.readFileSync(f3, 'utf8');
if (!c3.includes('<option value="clothes">ملابس</option>')) {
  c3 = c3.replace('<option value="kids">مستلزمات أطفال</option>', '<option value="kids">مستلزمات أطفال</option>\n                  <option value="clothes">ملابس</option>');
  fs.writeFileSync(f3, c3);
  console.log('Updated AddItemModal.tsx');
}

let f4 = 'frontend/src/components/AddPostModal.tsx';
let c4 = fs.readFileSync(f4, 'utf8');
if (!c4.includes('<option value="ملابس">ملابس</option>')) {
  c4 = c4.replace('<option value="مستلزمات أطفال">مستلزمات أطفال</option>', '<option value="مستلزمات أطفال">مستلزمات أطفال</option>\n                <option value="ملابس">ملابس</option>');
  fs.writeFileSync(f4, c4);
  console.log('Updated AddPostModal.tsx');
}
