<script setup lang="ts">
import { onMounted, onBeforeUnmount } from "vue"; import type { DispatchRequest } from "../types";
const props=defineProps<{open:boolean;request:DispatchRequest|null}>(); const emit=defineEmits<{close:[];confirm:[]}>();
function keydown(e:KeyboardEvent){if(e.key==="Escape"&&props.open)emit("close")} onMounted(()=>document.addEventListener("keydown",keydown)); onBeforeUnmount(()=>document.removeEventListener("keydown",keydown));
</script>
<template>
  <div v-if="open" class="dialog-backdrop" @click.self="$emit('close')">
    <section class="confirm-dialog" role="dialog" aria-modal="true" aria-labelledby="confirm-title">
      <span class="eyebrow">模拟操作确认</span><h2 id="confirm-title">确认下发调度方案？</h2>
      <p>方案 {{ request?.plan_id }} 将启动 {{ request?.pump_ids.join("、") }}，目标液位 {{ request?.target_level }} m。</p>
      <div><button @click="$emit('close')">取消</button><button class="primary-action" autofocus @click="$emit('confirm')">确认下发</button></div>
    </section>
  </div>
</template>
