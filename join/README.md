# LivingHub Member Join v1.0

独立接龙式入会产品，不放在主平台首页。

建议部署：`join.livinghub.app` 或 `livinghub.app/join/`。

当前功能：30秒免费登记、会员编号、推荐来源 `?ref=会员号`、个人邀请链接、二维码、分享、积分展示、本设备登录、PWA。

重要：当前是独立前端产品，会员数据保存在浏览器 localStorage。要实现后台查看全部会员、跨设备登录、真实推荐积分、付费会员状态和受权限保护的会员资料，需要下一步接入 Supabase 或现有 LivingHub 后端。

推荐只做一级：A邀请B，A获得奖励；B邀请C时由B获得奖励，不做多层返利。
