const fs = require('fs');
let content = fs.readFileSync('src/lib/i18n.ts', 'utf8');

const enValues = {
  backToMyOrders: 'Back to My Orders',
  orderItems: 'Items',
  defaultColor: 'Default',
  trackingNumber: 'Tracking Number',
  copied: 'Copied!',
  copy: 'Copy',
  carrier: 'Carrier',
  paymentFailed: 'Payment Failed',
  paymentNameOnCard: 'Name on card',
  paymentBankLabel: 'Bank',
  paymentAccountLabel: 'Account',
  paymentBeneficiaryLabel: 'Beneficiary',
  expressShipping: 'Express Shipping',
  standardShipping: 'Standard Shipping',
  payment: 'Payment',
  paymentHowToPayBankTransfer: 'How to Pay by Bank Transfer',
  cartQty: 'Qty',
};

// Find pt-BR and ko sections
const lines = content.split('\n');

function findLocaleEnd(startIdx) {
  let braceDepth = 1;
  for (let i = startIdx + 1; i < lines.length; i++) {
    braceDepth += (lines[i].match(/\{/g) || []).length;
    braceDepth -= (lines[i].match(/\}/g) || []).length;
    if (braceDepth === 0) return i;
  }
  return -1;
}

// Find pt-BR
let ptBRStart = -1;
let koStart = -1;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].match(/"pt-BR"\s*:\s*\{/)) ptBRStart = i;
  if (lines[i].match(/^\s*ko:\s*\{/)) koStart = i;
}

function addMissingKeys(localeName, startIdx) {
  if (startIdx === -1) {
    console.log(`WARNING: Could not find ${localeName} section`);
    return;
  }
  
  const endIdx = findLocaleEnd(startIdx);
  if (endIdx === -1) {
    console.log(`WARNING: Could not find end of ${localeName} section`);
    return;
  }
  
  const localeContent = lines.slice(startIdx, endIdx + 1).join('\n');
  const missingKeys = Object.keys(enValues).filter(k => !localeContent.includes(`${k}:`));
  
  if (missingKeys.length === 0) {
    console.log(`${localeName}: all keys present`);
    return;
  }
  
  // Find last key line before closing brace
  let lastKeyLine = endIdx - 1;
  while (lastKeyLine > startIdx && !lines[lastKeyLine].match(/^\s*\w+:\s*['"']/)) {
    lastKeyLine--;
  }
  
  const insertLines = missingKeys.map(k => `    ${k}: '${enValues[k]}',`);
  lines.splice(lastKeyLine + 1, 0, ...insertLines);
  console.log(`${localeName}: added ${missingKeys.length} keys (${missingKeys.join(', ')}) at line ${lastKeyLine + 1}`);
}

addMissingKeys('pt-BR', ptBRStart);
addMissingKeys('ko', koStart);

fs.writeFileSync('src/lib/i18n.ts', lines.join('\n'));
