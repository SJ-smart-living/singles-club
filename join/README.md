# LivingHub Join v1.1.1 — Supabase Live

版本号保持 v1.1.1。

## 已接入
- Supabase profiles 公共会员目录
- member-photos 公共图片存储
- 任何访客可提交公开会员资料
- 上传照片后所有设备都能看到
- DEMO 案例明确标记
- 联系方式不存入 profiles
- “联系组织者”代替直接公开联系方式

## 当前简化阶段的重要限制
当前 profiles INSERT 和 member-photos INSERT 对匿名访客开放，适合早期小规模测试。
正式大规模推广前应增加：
- CAPTCHA / Turnstile
- 邮箱或手机验证
- 管理员审核状态
- 删除/编辑本人资料的身份验证
- 上传频率限制

## 安全
前端只包含 Supabase Publishable key。不要放 service_role / secret key / 数据库密码。

## 部署
把整个 join/ 文件夹覆盖上传到前端仓库。
地址保持：
https://livinghub.app/join/


## Submission reset fix
- Fixed async submit error: `Cannot read properties of null (reading 'reset')`.
- Product version remains v1.1.1.
