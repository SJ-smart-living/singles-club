# LivingHub Join v1.1.1 — Member + Admin Management

版本号保持 v1.1.1。

## 新增
- 会员注册后自动生成私人管理码
- 会员可修改自己的公开资料
- 会员可暂停/恢复展示
- 会员可永久删除自己的公开会员资料
- 平台新增 `/join/admin.html`
- 管理员可查看全部会员
- 管理员可暂停/恢复/删除会员
- 管理员可清理已删除会员的 Storage 照片

## 上线步骤
1. Supabase SQL Editor 新建查询。
2. 运行 `supabase-member-management.sql`。
3. Supabase Authentication → URL Configuration：
   - Site URL 可保持 `https://livinghub.app/join/`
   - Redirect URLs 增加 `https://livinghub.app/join/admin.html`
4. 整个 `join/` 文件夹覆盖上传前端仓库。
5. 会员入口：`https://livinghub.app/join/`
6. 管理后台：`https://livinghub.app/join/admin.html`

## 管理员
当前 SQL 预设管理员邮箱：
`hello.singlesclub@outlook.com`

后台使用 Supabase Magic Link 登录，不在前端保存管理员密码。

## 删除逻辑
会员本人删除后，公开 profile 会立即删除。
对应 Storage 照片进入清理队列。
管理员后台点击“清理已删除照片”后完成实际 Storage 文件删除。

## 安全
- 管理码只在会员端保存，数据库只保存 SHA-256 hash。
- `profile_secrets` 不对公开客户端开放读取。
- 管理员权限通过 Supabase Auth + admin_emails 校验。
- 前端只包含 Publishable key，不包含 service_role / secret key。
