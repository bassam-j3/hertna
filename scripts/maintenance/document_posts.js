const fs = require('fs');

let c1 = fs.readFileSync('backend/src/posts/posts.controller.ts', 'utf8');

c1 = c1.replace(
  'export class PostsController {',
  '/**\n * متحكم الطلبات (Posts Controller)\n * \n * يعالج الطلبات القادمة لإنشاء، جلب، أو حذف منشورات (إعارة/تبرع/عاجل).\n * يستخدم الـ JwtAuthGuard للتأكد من أن المستخدم مسجل دخول.\n */\nexport class PostsController {'
);

c1 = c1.replace(
  '@UseGuards(JwtAuthGuard)\n  @Post()',
  '// مسار محمي لإنشاء طلب جديد. يأخذ بيانات الطلب من الـ Body ومعرف المستخدم من الـ JWT Token.\n  @UseGuards(JwtAuthGuard)\n  @Post()'
);

c1 = c1.replace(
  '@Get()\n  findAll(@Query() query) {',
  '// جلب جميع الطلبات مع إمكانية التصفية الجغرافية باستخدام الاستعلامات (Query).\n  @Get()\n  findAll(@Query() query) {'
);

fs.writeFileSync('backend/src/posts/posts.controller.ts', c1);
console.log('posts.controller.ts commented');

let c2 = fs.readFileSync('backend/src/posts/posts.service.ts', 'utf8');

c2 = c2.replace(
  'export class PostsService {',
  '/**\n * خدمة الطلبات (Posts Service)\n * \n * تتعامل مباشرة مع قاعدة البيانات Prisma وتنفذ المنطق البرمجي (Business Logic)\n * لحفظ، استرجاع، وحذف الطلبات.\n */\nexport class PostsService {'
);

c2 = c2.replace(
  'async findAll(query: any) {',
  '// جلب الطلبات من الداتابيز. إذا تم تمرير إحداثيات، يتم حساب المسافة (Geospatial logic)\n  async findAll(query: any) {'
);

fs.writeFileSync('backend/src/posts/posts.service.ts', c2);
console.log('posts.service.ts commented');
