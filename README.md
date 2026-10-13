# Shadowrocket modules

高德地图净化模块，根据用户提供的 RuCu6 amap.js（2026-03-09）和 Loon 配置适配。

## 添加模块

在 Shadowrocket 的配置 → 模块 → 添加模块中填写：

https://raw.githubusercontent.com/fay000fay/shadowrocket-modules/main/modules/Amap_remove_ads.module

脚本会自动下载，不需要另行导入。需启用 HTTPS 解密，并安装和信任 Shadowrocket 的 CA 证书。

## 适配说明

保留 3 条分流、13 条返回空 JSON 的拦截及 3 条 JSON 字段删除规则。脚本匹配由提供的代码重建，并非原插件的完整匹配配置。保留原脚本隐藏天气、部分足迹入口、评价及推荐的行为。增加空响应、JSON 解析与缺失字段保护。

已通过 10 组模拟响应检查，尚未在真实 Shadowrocket 和高德地图上实测。

脚本源地址（已失效）：https://raw.githubusercontent.com/RuCu6/Loon/refs/heads/main/Scripts/amap.js