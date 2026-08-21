const fs = require('fs');

let c1 = fs.readFileSync('backend/src/swaps/swaps.controller.ts', 'utf8');

c1 = c1.replace(
  'export class SwapsController {',
  '/**\n * متحكم المبادلات (Swaps Controller)\n * \n * يعالج دورة حياة المبادلات (Handshake Protocol) بين المستخدمين\n * (طلب إعارة -> موافقة -> قيد الاستخدام -> تم الإرجاع).\n */\nexport class SwapsController {'
);

c1 = c1.replace(
  '@Post()\n  create',
  '// إنشاء طلب مبادلة جديد (Handshake Request)\n  @Post()\n  create'
);

c1 = c1.replace(
  '@Get(\'my-swaps\')\n  findMySwaps',
  '// جلب المبادلات الخاصة بالمستخدم الحالي (كمالك أو كمستعير)\n  @Get(\'my-swaps\')\n  findMySwaps'
);

c1 = c1.replace(
  '@Patch(\':id/status\')\n  updateStatus',
  '// تغيير حالة المبادلة (مثل: pending -> approved -> active -> completed)\n  @Patch(\':id/status\')\n  updateStatus'
);

fs.writeFileSync('backend/src/swaps/swaps.controller.ts', c1);
console.log('swaps.controller.ts commented');

let c2 = fs.readFileSync('backend/src/swaps/swaps.service.ts', 'utf8');

c2 = c2.replace(
  'export class SwapsService {',
  '/**\n * خدمة المبادلات (Swaps Service)\n * \n * تدير المنطق البرمجي لحفظ المبادلات في الداتابيز والتأكد من الصلاحيات.\n */\nexport class SwapsService {'
);

c2 = c2.replace(
  'async updateStatus(id: string, status: string, userId: string) {',
  '// تحديث حالة الطلب والتحقق من أن المستخدم يملك الصلاحية (إما المالك أو المستعير)\n  async updateStatus(id: string, status: string, userId: string) {'
);

fs.writeFileSync('backend/src/swaps/swaps.service.ts', c2);
console.log('swaps.service.ts commented');
