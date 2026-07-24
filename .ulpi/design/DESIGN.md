---
project: 遵义氧化铝厂水网与赤泥集水池调度平台
register: product
aesthetic_direction: industrial / signage
color_strategy: restrained
design_system: Element Plus
design_variance: 7
motion_intensity: 3
visual_density: 8
---

# 设计语言锁定

## Design Read

像值班室里真正可信的工艺操作屏：冷静、密集、可追溯，把水流和液位变化放在视觉中心。

## Signature

核心记忆点是“工艺脉络线”：青蓝管线贯穿监控视图，节点以工业仪表牌形式挂接；赤泥池使用带刻度的剖面液位舱。其余界面保持克制，避免装饰争夺注意力。

## Color（锁定）

| role | OKLCH | hex | use / contrast |
|---|---|---|---|
| background | 18% 0.018 225 | `#111A1D` | 页面底色 |
| surface | 23% 0.020 225 | `#192428` | 工作区 |
| elevated | 28% 0.020 225 | `#233035` | 浮层、选中区 |
| text | 92% 0.012 205 | `#E7F0F1` | 主文字，对 background > 12:1 |
| muted | 70% 0.020 215 | `#9EAFB2` | 次文字，对 background > 6:1 |
| subtle | 52% 0.020 220 | `#697B7F` | 刻度与说明 |
| border | 36% 0.025 220 | `#35484D` | 分隔线 |
| accent | 75% 0.125 205 | `#20B8C7` | 唯一品牌强调色 |
| success | 72% 0.145 150 | `#48BD83` | 正常/开启 |
| warning | 79% 0.150 75 | `#F0B84A` | 预警/待确认 |
| danger | 65% 0.200 28 | `#EB625C` | 超限/故障 |
| info | 72% 0.115 245 | `#5CA7E8` | 信息 |

## Type（锁定）

| role | family | use | notes |
|---|---|---|---|
| display | `"DIN Alternate", "Bahnschrift", sans-serif` | 标题、关键数字 | 紧凑工业标牌感 |
| body | `"Noto Sans SC", "Microsoft YaHei", sans-serif` | 中文正文 | 65–75 字符行宽 |
| utility | `"JetBrains Mono", "Cascadia Mono", monospace` | 数值、时间、设备编号 | 等宽对齐 |

## Scales（锁定）

- spacing: `0, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64`
- radius: `sm 2, md 4, lg 8, full 9999`
- motion: `fast 120ms, base 240ms, emphasis 420ms`; easing `cubic-bezier(0.16, 1, 0.3, 1)`
- icon: Element Plus Icons；线性图标，不混用图标家族
- breakpoints: `sm 640, md 768, lg 1024, xl 1280, 2xl 1536`

## Voice

`register: 简洁、技术化、行动导向`。动作词统一使用“查看、确认、下发、停止、切换”；状态使用“运行、待机、故障、已确认”。告警文字先写设备，再写偏差与建议动作。

每个屏幕并排放置时，都必须让人看出属于同一个产品。
