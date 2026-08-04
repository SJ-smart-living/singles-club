-- Replace values before running.
insert into public.tenants (slug,name,page_title,site_url,city,contact_email,business_address)
values ('singles-club','Singles Club','Singles Club — Real Events and Serious Connections','https://example.com/','Los Angeles, California','hello@example.com','')
on conflict (slug) do nothing;

with t as (select id from public.tenants where slug='singles-club')
insert into public.plans (tenant_id,name,price,summary_zh,summary_en,features_zh,features_en,sort_order)
select id,'Club',99,'进入本地活动与公共学习小组。','Access local events and public learning groups.','每月1次基础活动
每周2条动态
公共学习小组
有限会员简介','1 basic event monthly
2 posts weekly
Public learning groups
Limited member profiles',1 from t
union all
select id,'Connection',299,'更多真实活动、授权会员资料和人工介绍。','More events, authorized profiles, and human introductions.','每月3次活动或小组
更多授权会员简介
限定学习小组
活动优先报名
有限人工介绍','3 events or groups monthly
More authorized profiles
Member-only learning groups
Priority registration
Limited human introductions',2 from t
union all
select id,'Private',599,'私人活动与更深入的人工服务。','Private events and deeper human support.','人工整理个人资料
每月人工推荐
私人小型活动
优先确认名额
双人体验协调','Human profile preparation
Monthly recommendations
Private small events
Highest priority
Couple experience coordination',3 from t;

with t as (select id from public.tenants where slug='singles-club')
insert into public.events (tenant_id,title_zh,title_en,start_at,city,region,country,venue_public,private_venue,capacity,price,currency,is_public)
select id,'咖啡与认真交流','Coffee & Conversation',now()+interval '14 days','Pasadena','CA','US','Venue shared after confirmation','Add exact address here',12,49,'USD',true from t
union all
select id,'周日城市散步','Sunday City Walk',now()+interval '21 days','Los Angeles','CA','US','Meeting point shared after confirmation','Add exact address here',16,39,'USD',true from t
union all
select id,'小型主题晚餐','Small Group Dinner',now()+interval '28 days','Arcadia','CA','US','Restaurant shared after confirmation','Add exact address here',10,69,'USD',true from t;

with t as (select id from public.tenants where slug='singles-club')
insert into public.posts (tenant_id,post_type,content_zh,content_en,is_public)
select id,'platform','本周活动申请即将截止。','Applications close soon this week.',true from t
union all
select id,'activity','Pasadena 咖啡交流剩余少量确认名额。','A few confirmed spots remain for the Pasadena coffee meetup.',true from t;

with t as (select id from public.tenants where slug='singles-club')
insert into public.learning_groups (tenant_id,title_zh,title_en,description_zh,description_en,city,sort_order,is_public)
select id,'英语交流','English Exchange','4—8人小组，每周一次轻松对话。','A relaxed weekly conversation group for 4–8 people.','Pasadena',1,true from t
union all
select id,'一起做饭','Cook Together','一起完成一道菜，在协作中自然认识。','Complete one dish together and connect through collaboration.','Arcadia',2,true from t;

-- After creating the merchant user in Authentication > Users:
-- insert into public.tenant_admins (tenant_id,user_id)
-- select id,'PASTE_AUTH_USER_UUID'::uuid from public.tenants where slug='singles-club';
