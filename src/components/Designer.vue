<template>
    <dl class="designer">
        <dt><img src="/Pict/Cat.jpg" alt=""></dt>
        <dd>
            <h3 class="name">龙百万</h3>
            <p>首席家装设计师</p>
            <p>擅长前端(Vue 方向)</p>
            <p>对豆豉回锅肉的制作有督导见解</p>
            <el-divider />
            <p>擅长户型 : 拼盘雕刻, 火锅白案</p>
        </dd>
    </dl>
</template>

<script>
export default {
    name: 'Designer',
    setup(props) {
        return {}
    }
}
</script>

<style scoped>
dl {
    display: flex;
    background-color: #fff;
    padding: 20px;
}
dt {
    width: 120px;
    height: 250px;
    margin-right: 20px;
}
h3.name {
    font-weight: 500;
    margin-bottom: 10px;
}
h3.name~p {
    font-size: 12px;
    margin-top: 10px;
}
p:last-child {
    color: rgb(172, 173, 178);
}
</style>