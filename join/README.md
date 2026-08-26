# LivingHub Join v1.1.1 — Final Product

版本号保持 v1.1.1。

## 完整链路
- 任何人可注册公开会员资料
- 照片上传到 Supabase Storage `member-photos`
- 真实会员资料写入 `profiles`
- 所有人打开 `/join/` 都能看到真实会员
- DEMO 案例明确标记，不冒充真人
- 会员注册后自动获得 Member ID + Private Management Code
- 会员本人可以修改、暂停、恢复、删除自己的资料
- 管理员后台可以查看、暂停、恢复、删除会员
- 已删除会员的图片进入清理队列，管理员可一键清理
- 联系方式不公开，想认识对方通过组织者

## 上线步骤
1. Supabase SQL Editor 运行 `supabase-final-schema.sql`
2. 如果当前全是测试会员，先运行 `RESET-TEST-DATA.sql`
3. Storage > member-photos：手动删除当前测试图片文件（一次性清理）
4. Authentication > URL Configuration:
   - Redirect URL 加入 `https://livinghub.app/join/admin.html`
5. 整个 `join/` 覆盖上传到前端仓库

## URLs
会员入口：
https://livinghub.app/join/

管理员后台：
https://livinghub.app/join/admin.html

## 管理员
hello.singlesclub@outlook.com

## 注意
Publishable key 可以放前端。
不要把 service_role / secret key / 数据库密码放到 GitHub。

## 版本
v1.1.1
