<template>
    <section>
        <router-view></router-view>
    </section>
</template>

<script setup>
import { onBeforeMount, onMounted, getCurrentInstance, watch, reactive, ref } from "vue";
const { proxy, data } = getCurrentInstance();
// proxy.$HelperCore.domFuncAddCssFile(["/CSS/Core.Schema.css"], function () {});
onBeforeMount(() => {});
onMounted(() => {});
</script>

<style>
/* @import "@/VisualConfig/CSS/Core.Schema.css"; */
</style>
