<script setup lang="ts">
import { computed, ref } from "vue";

type AnalysisView = "water" | "pressure" | "leakage" | "dma";

const tabs: { id: AnalysisView; label: string }[] = [
  { id: "water", label: "用水分析" },
  { id: "pressure", label: "压力分析" },
  { id: "leakage", label: "漏损分析" },
  { id: "dma", label: "DMA 分区" }
];

const activeView = ref<AnalysisView>("water");
const viewCopy = computed(() => ({
  water: {
    eyebrow: "供需与回用结构",
    title: "用水分析",
    summary: "本班总用水低于计划 1.8%，回用水占比保持在目标区间。焙烧车间 14:00 后用水抬升，需要关注下一时段峰值。",
    metrics: [["本班用水", "18,420", "m³"], ["计划偏差", "-1.8", "%"], ["回用率", "76.8", "%"], ["单位耗水", "2.31", "m³/t"]]
  },
  pressure: {
    eyebrow: "压力安全边界",
    title: "压力分析",
    summary: "全厂压力合格率 94.5%。赤泥洗涤支线连续 18 分钟低于 0.35 MPa，阈值来自《供水压力控制参数 V3》。",
    metrics: [["平均压力", "0.42", "MPa"], ["压力合格率", "94.5", "%"], ["低压测点", "3", "个"], ["离线测点", "1", "个"]]
  },
  leakage: {
    eyebrow: "产销差与夜间流量",
    title: "漏损分析",
    summary: "DMA-03 的最小夜间流量连续三日上升，模型判断赤泥洗涤北支线存在中等漏损风险，建议生成巡检工单。",
    metrics: [["估算漏损", "884", "m³/d"], ["综合漏损率", "7.6", "%"], ["夜间异常", "2", "处"], ["诊断可信度", "86", "%"]]
  },
  dma: {
    eyebrow: "分区计量与责任闭环",
    title: "DMA 分区管理",
    summary: "DMA-03 赤泥洗涤区产销差 9.4%，高于 7.0% 预警线。分区边界、进出表计和责任人资料完整，可直接转事件处置。",
    metrics: [["DMA 数量", "12", "个"], ["异常分区", "2", "个"], ["表计在线率", "96", "%"], ["待复核边界", "1", "处"]]
  }
}[activeView.value]));

const rows = computed(() => ({
  water: [
    ["赤泥洗涤", "286 m³/h", "+7.2%", "关注"],
    ["蒸发工序", "242 m³/h", "-1.6%", "正常"],
    ["焙烧车间", "218 m³/h", "+4.8%", "关注"],
    ["循环水站", "1,020 m³/h", "+0.9%", "正常"]
  ],
  pressure: [
    ["P-17 赤泥北支", "0.32 MPa", "下限 0.35", "低压"],
    ["P-09 蒸发西线", "0.38 MPa", "下限 0.36", "正常"],
    ["P-04 厂前主管", "0.51 MPa", "上限 0.55", "正常"],
    ["P-22 回水东线", "—", "数据中断", "离线"]
  ],
  leakage: [
    ["DMA-03 赤泥洗涤区", "9.4%", "北支线", "中风险"],
    ["DMA-08 焙烧区", "7.8%", "南侧阀井", "中风险"],
    ["DMA-02 蒸发区", "4.1%", "无", "正常"],
    ["DMA-11 生活区", "3.6%", "无", "正常"]
  ],
  dma: [
    ["DMA-03 赤泥洗涤区", "FT-031 / FT-032", "王海", "9.4%"],
    ["DMA-08 焙烧区", "FT-081 / FT-084", "李宁", "7.8%"],
    ["DMA-02 蒸发区", "FT-021 / FT-025", "赵峰", "4.1%"],
    ["DMA-11 生活区", "FT-111 / FT-112", "陈璐", "3.6%"]
  ]
}[activeView.value]));
</script>

<template>
  <section class="task-workspace analysis-center" data-testid="analysis-center">
    <header class="task-heading">
      <div>
        <span class="eyebrow">{{ viewCopy.eyebrow }}</span>
        <h2>{{ viewCopy.title }}</h2>
        <p>{{ viewCopy.summary }}</p>
      </div>
      <div class="data-stamp"><small>统计范围</small><b>全厂 · 今日 00:00—14:30</b><span class="success">数据完整率 97.8%</span></div>
    </header>

    <div class="subtask-tabs" role="tablist" aria-label="运行分析视图">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        type="button"
        role="tab"
        :data-analysis-tab="tab.id"
        :aria-selected="activeView===tab.id"
        :class="{ active: activeView===tab.id }"
        @click="activeView=tab.id"
      >{{ tab.label }}</button>
    </div>

    <div class="analysis-metrics" aria-label="关键分析指标">
      <article v-for="metric in viewCopy.metrics" :key="metric[0]">
        <span>{{ metric[0] }}</span>
        <strong class="mono">{{ metric[1] }} <small>{{ metric[2] }}</small></strong>
      </article>
    </div>

    <div class="analysis-grid">
      <section class="signal-panel">
        <header><div><span class="eyebrow">24 小时信号</span><h3>{{ viewCopy.title }}趋势</h3></div><span class="legend"><i></i>实时值　<i class="loop"></i>计划/阈值</span></header>
        <div class="signal-chart" :class="`signal-${activeView}`" role="img" :aria-label="`${viewCopy.title}趋势示意图`">
          <div class="chart-axis"><span>高</span><span>中</span><span>低</span></div>
          <svg viewBox="0 0 720 250" preserveAspectRatio="none" aria-hidden="true">
            <g class="grid-lines"><path d="M0 45H720M0 125H720M0 205H720"/><path d="M90 0V250M180 0V250M270 0V250M360 0V250M450 0V250M540 0V250M630 0V250"/></g>
            <path class="threshold-line" d="M0 166 L720 166"/>
            <path class="area-line" d="M0 190 C70 176 82 148 150 156 S250 202 320 160 S430 92 505 124 S620 82 720 98 L720 250 L0 250Z"/>
            <path class="live-line" d="M0 190 C70 176 82 148 150 156 S250 202 320 160 S430 92 505 124 S620 82 720 98"/>
            <circle cx="505" cy="124" r="5"/>
          </svg>
          <div class="chart-note"><span>{{ activeView==="dma" ? "DMA-03" : "当前" }}</span><b>{{ viewCopy.metrics[0][1] }} {{ viewCopy.metrics[0][2] }}</b></div>
          <div class="chart-times"><span>00:00</span><span>06:00</span><span>12:00</span><span>18:00</span><span>24:00</span></div>
        </div>
      </section>

      <aside class="diagnosis-panel">
        <header><span class="eyebrow">模型诊断</span><h3>处置建议</h3></header>
        <div class="diagnosis-score"><strong class="mono">{{ activeView==="leakage" ? "86" : "92" }}</strong><span>%<small>结论可信度</small></span></div>
        <ol>
          <li><b>定位</b><span>{{ activeView==="dma" || activeView==="leakage" ? "赤泥洗涤北支线" : "赤泥洗涤与焙烧区域" }}</span></li>
          <li><b>判断</b><span>{{ activeView==="pressure" ? "持续低压，不属于测点离线" : "偏差连续出现，建议复核" }}</span></li>
          <li><b>动作</b><span>{{ activeView==="water" ? "错峰调整并观察 30 分钟" : "创建事件并派发现场复核" }}</span></li>
        </ol>
        <button type="button" class="secondary-action">查看诊断依据</button>
      </aside>
    </div>

    <section class="data-table-panel">
      <header><div><span class="eyebrow">对象排名</span><h3>{{ activeView==="dma" ? "分区运行清单" : "重点对象" }}</h3></div><button type="button" class="text-action">导出当前数据</button></header>
      <div class="industrial-table" role="table" :aria-label="`${viewCopy.title}重点对象`">
        <div class="table-row table-head" role="row"><span>对象</span><span>实时值/表计</span><span>对比/位置</span><span>状态</span></div>
        <div v-for="row in rows" :key="row[0]" class="table-row" role="row">
          <strong>{{ row[0] }}</strong><span class="mono">{{ row[1] }}</span><span>{{ row[2] }}</span><b :class="row[3].includes('正常') ? 'success' : 'warning'">{{ row[3] }}</b>
        </div>
      </div>
    </section>
  </section>
</template>
