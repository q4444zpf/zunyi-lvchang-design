import { mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it, vi } from "vitest";

import App from "../App.vue";
import { usePlantStore } from "../stores/plant";

vi.mock("../api", () => ({
  getOverview: vi.fn().mockResolvedValue({
    plant_name: "遵义氧化铝厂", data_time: "2026-07-23T14:30:00+08:00",
    communication: "在线", operator: "张伟",
    metrics: [{ label: "总供水量", value: 2840, unit: "m³/h", trend: "上升", comparison: "较计划 +2.4%" }],
    nodes: [{ id: "N-05", name: "赤泥洗涤", category: "生产用水", flow: 286, pressure: 0.38, status: "预警" }],
    pools: [{ id: "POOL-02", name: "2#集水池", level: 6.42, capacity: 7, inflow: 510, outflow: 380, forecast_level: 6.88, status: "危险" }],
    pumps: [{ id: "P-01", name: "1#外排泵", running: true, frequency: 42, current: 68.4 }]
  }),
  getTrends: vi.fn().mockResolvedValue({ total: [{ time: "14:00", actual: 2840, plan: 2780 }], zones: {} }),
  getAlarms: vi.fn().mockResolvedValue([{ id: "ALM-001", severity: "危险", device: "2#赤泥集水池", event: "液位接近高高限", occurred_at: "2026-07-23T14:18:00+08:00", status: "未确认" }]),
  acknowledgeAlarm: vi.fn().mockResolvedValue({ status: "已确认" }),
  dispatchPlan: vi.fn().mockResolvedValue({ record_id: "DSP-0001", status: "已下发" })
}));

describe("调度台", () => {
  beforeEach(() => setActivePinia(createPinia()));

  it("初始显示标题、导航和加载状态", () => {
    const wrapper = mount(App);
    expect(wrapper.text()).toContain("遵义氧化铝厂");
    const navigation = wrapper.get('[data-testid="top-navigation"]');
    expect(navigation.attributes("aria-label")).toBe("平台主导航");
    expect(navigation.findAll("a").map((item) => item.text())).toEqual([
      "监控总览",
      "水网监控",
      "运行分析",
      "智能调度",
      "告警事件"
    ]);
    expect(wrapper.find(".sidebar").exists()).toBe(false);
    expect(wrapper.text()).toContain("正在连接实时数据");
  });

  it("顶部导航为当前任务提供选中状态和有效页面锚点", () => {
    const wrapper = mount(App);
    const links = wrapper.get('[data-testid="top-navigation"]').findAll("a");
    expect(links[0].attributes("aria-current")).toBe("page");
    expect(links.map((item) => item.attributes("href"))).toEqual([
      "#overview",
      "#network",
      "#analysis",
      "#pools",
      "#alarms"
    ]);
  });

  it("点击运行分析后切换到分析中心并保持当前导航状态", async () => {
    const wrapper = mount(App);
    await wrapper.get('[data-task="analysis"]').trigger("click");
    expect(wrapper.get('[data-testid="analysis-center"]').exists()).toBe(true);
    expect(wrapper.get('[data-task="analysis"]').attributes("aria-current")).toBe("page");
  });

  it("提供页面级运行范围、刷新入口和三种空间视图", async () => {
    const wrapper = mount(App);
    await new Promise((resolve) => setTimeout(resolve, 0));
    await wrapper.vm.$nextTick();

    const toolbar = wrapper.get('[data-testid="dashboard-toolbar"]');
    expect(toolbar.text()).toContain("监控中心");
    expect(toolbar.text()).toContain("全厂范围");
    expect(toolbar.text()).toContain("实时数据");
    expect(toolbar.get("button").text()).toContain("刷新数据");

    const viewSwitcher = wrapper.get('[data-testid="view-switcher"]');
    expect(viewSwitcher.findAll("button").map((item) => item.text())).toEqual([
      "概化图",
      "GIS 图",
      "三维图"
    ]);
    expect(viewSwitcher.find('[aria-pressed="true"]').text()).toBe("概化图");
  });

  it("切换空间视图时保留当前页面并更新选中状态", async () => {
    const wrapper = mount(App);
    await new Promise((resolve) => setTimeout(resolve, 0));
    await wrapper.vm.$nextTick();

    const gisButton = wrapper
      .get('[data-testid="view-switcher"]')
      .findAll("button")
      .find((item) => item.text() === "GIS 图");
    if (!gisButton) throw new Error("GIS 图入口不存在");
    await gisButton.trigger("click");
    expect(gisButton.attributes("aria-pressed")).toBe("true");
    expect(wrapper.text()).toContain("GIS 管网态势");
  });

  it("趋势图监听容器尺寸变化以避免响应式布局溢出", async () => {
    const observe = vi.fn();
    vi.stubGlobal("ResizeObserver", class {
      observe = observe;
      disconnect = vi.fn();
    });
    const wrapper = mount(App);
    await new Promise((resolve) => setTimeout(resolve, 0));
    await wrapper.vm.$nextTick();
    expect(observe).toHaveBeenCalled();
    vi.unstubAllGlobals();
  });

  it("加载后显示关键指标和工艺节点", async () => {
    const wrapper = mount(App);
    await new Promise((resolve) => setTimeout(resolve, 0));
    await wrapper.vm.$nextTick();
    expect(wrapper.text()).toContain("总供水量");
    expect(wrapper.text()).toContain("赤泥洗涤");
    expect(wrapper.text()).toContain("2#集水池");
  });

  it("支持键盘选择节点并确认告警", async () => {
    const wrapper = mount(App);
    await new Promise((resolve) => setTimeout(resolve, 0));
    await wrapper.vm.$nextTick();
    const node = wrapper.get('[data-node-id="N-05"]');
    await node.trigger("keydown", { key: "Enter" });
    expect(wrapper.text()).toContain("节点详情");
    await wrapper.get('[data-alarm-id="ALM-001"]').trigger("click");
    expect(wrapper.text()).toContain("已确认");
  });

  it("离线时禁用下发按钮并显示提示", async () => {
    const wrapper = mount(App);
    await new Promise((resolve) => setTimeout(resolve, 0));
    await wrapper.vm.$nextTick();
    const store = usePlantStore();
    if (!store.overview) throw new Error("overview 尚未加载");
    store.overview.communication = "离线";
    await wrapper.vm.$nextTick();
    expect(wrapper.get('[data-testid="dispatch-button"]').attributes("disabled")).toBeDefined();
    expect(wrapper.text()).toContain("通信中断，禁止下发控制命令");
  });
});
