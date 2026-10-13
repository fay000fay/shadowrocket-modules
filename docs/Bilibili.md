# 哔哩哔哩小火箭基础版

模块地址：
https://raw.githubusercontent.com/fay000fay/shadowrocket-modules/main/modules/Bilibili_remove_ads.module

在小火箭“配置 → 模块 → 添加模块”填写上面的地址。脚本自动下载，需启用 HTTPS 解密并信任小火箭 CA 证书。建议先停用其他 B 站净化模块，避免重复修改。

## 已实现

- 4 条 biliapi 域名拦截及原 AND/OR P2P 规则。
- 开屏列表、开屏事件、推荐流广告卡片、番剧频道推广。
- 活动弹窗、搜索广场、活动入口、广告物料接口返回指定 JSON。
- 游戏推广和直播购物信息接口返回空 JSON。
- tracker 配置替换和皮肤 common_equip 删除。
- 根据 Sparkle 公开 JSON 源码移植直播推荐横幅、活动卡、直播间购物和活动入口处理。增加缺失字段和非 JSON 保护。
- 重复提供的频道及活动规则各合并为一条。

## 本版未包含

- 空降助手和请求处理：原脚本会重新发送 gRPC 请求，并处理二进制与 HTTP/2 trailers，作者明确未支持 Shadowrocket。没有以原脚本链接冒充兼容实现。
- ProtoBuf 响应处理及二进制假响应：尚未完成小火箭适配和设备验证。
- 底栏和“我的”页面 jq：提供的两份 kelee 文件返回 403，未能确认其内容，未用其他版本静默替换。
- 青少年模式响应替换、会员状态修改：本版按普通去广告范围制作，未包含这两项。
- bsbsb.top 代理规则：只有空降助手使用该服务，本基础版未调用它。

10 组模拟响应、JS 语法及模块匹配检查通过。未在手机上实测。当前版本 App 若主要使用 gRPC，视频详情、动态、评论等页面的广告可能仍存在。本模块不是原 Loon 插件的完整移植。

## 来源

用户提供的 Loon 配置。
直播处理逻辑：https://github.com/kokoryh/Sparkle/blob/master/src/script/bilibili/json/handler.ts
作者支持列表：https://github.com/kokoryh/Sparkle/blob/master/src/script/bilibili/README.md
小火箭格式：https://github.com/LOWERTOP/Shadowrocket
