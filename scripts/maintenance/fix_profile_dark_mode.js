const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'frontend/src/components/ProfileView.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// The goal is to aggressively add dark:text-xxx wherever there is a specific text-xxx class
// If a class already has a dark: variant, we shouldn't duplicate it.
// We will do a simple replace on the string.

// First, normalize to avoid duplicating dark:text if it already exists
content = content.replace(/text-\[\#181d17\](\s+dark:text-[\w-]+)?/g, 'text-[#181d17] dark:text-white');
content = content.replace(/text-\[\#40493d\](\s+dark:text-[\w-]+)?/g, 'text-[#40493d] dark:text-gray-200');
content = content.replace(/text-\[\#707a6c\](\s+dark:text-[\w-]+)?/g, 'text-[#707a6c] dark:text-gray-400');
content = content.replace(/text-gray-800(\s+dark:text-[\w-]+)?/g, 'text-gray-800 dark:text-white');
content = content.replace(/text-gray-700(\s+dark:text-[\w-]+)?/g, 'text-gray-700 dark:text-gray-200');
content = content.replace(/text-gray-600(\s+dark:text-[\w-]+)?/g, 'text-gray-600 dark:text-gray-300');
content = content.replace(/text-gray-500(\s+dark:text-[\w-]+)?/g, 'text-gray-500 dark:text-gray-400');

// Additional cleanup for backgrounds just in case
content = content.replace(/bg-gray-50(\s+dark:bg-[\w-\[\]]+)?/g, 'bg-gray-50 dark:bg-[#1a1a1a]');
content = content.replace(/bg-gray-100(\s+dark:bg-[\w-\[\]]+)?/g, 'bg-gray-100 dark:bg-[#222222]');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Fixed ProfileView.tsx');
