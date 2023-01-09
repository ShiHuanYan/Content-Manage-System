<template>
    <section class="cat-sir">
        <header>
            <section>
                <a href="javascript: void(0)">加盟合作</a>
                <a href="javascript: void(0)">企业新闻</a>
                <a href="javascript: void(0)">投诉建议</a>
                <a href="javascript: void(0)">免费报价</a>
            </section>
            <section class="top-bar">
                <section class="logo">
                    <img src="/Pict/ValAddedBiz/Logo.jpeg" alt="">
                </section>
                <nav>
                    <a href="javascript: void(0)">首页</a>
                    <a href="javascript: void(0)">装修服务</a>
                    <a href="javascript: void(0)">品质保障</a>
                    <a href="javascript: void(0)">精英团队</a>
                    <a href="javascript: void(0)">装修案例</a>
                    <a href="javascript: void(0)">装修现场</a>
                    <a href="javascript: void(0)">实景案例库</a>
                    <a href="javascript: void(0)">了解猫老爷</a>
                </nav>
            </section>
            <section class="banner">
                <img src="/Pict/ValAddedBiz/Banner.jpg" alt="">
            </section>
        </header>
        <main>
            <article>
                <p class="title">专业的设计团队, 为您打造理想的居家环境.</p>
                <section>
                    <aside class="menu-bar">
                        <el-tree
                            :data="treeData"
                            show-checkbox node-key="id"
                            :default-expanded-keys="[2, 3]"
                            :default-checked-keys="[5]"
                            :props="treeProps" 
                        />
                    </aside>
                    <section class="content">
                        <Designer v-for="(item, index) in 4" :key="index"></Designer>
                    </section>
                </section>
            </article>
        </main>
        <footer>
            <img src="/Pict/ValAddedBiz/Footer.png" alt="">
        </footer>
    </section>
</template>

<script>
import { onMounted } from 'vue'
import Designer from '../components/Designer.vue';
export default {
    name: "CatSir",
    components: { Designer },
    setup(props) {
        onMounted(() => {
            document.title = '猫老爷';
        });
        let treeData = [
            {
                label: '风格',
                children: [
                    { label: '简约风格' },
                    { label: '中式风格' },
                    { label: '欧式风格' },
                    { label: '田园风格' },
                    { label: '美式风格' },
                    { label: '新古典风格' },
                    { label: '地中海风格' },
                    { label: '东南亚风格' }
                ],
            },
            {
                label: '户型',
                children: [
                    { label: '一室两厅', },
                    { label: '跃层户型', },
                    { label: '错层户型', },
                    { label: '复式户型', }
                ],
            },
            {
                label: '设计师职级',
                children: [
                    { label: '电气设计师' },
                    { label: '结构设计师' },
                    { label: '3D设计师' },
                    { label: '规划设计师' },
                    { label: '钢结构设计师' },
                    { label: '品牌设计师' },
                    { label: '包装设计师' },
                ],
            },
        ]

        const treeProps = {
            children: 'children',
            label: 'label',
        }
        return {
            treeData,
            treeProps
        };
    },
}
</script>

<style scoped>
header>section:first-child {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    background-color: rgb(240, 240, 240);
    padding: 8px 165px;
}

header>section:first-child>a {
    color: rgb(149, 148, 153);
    font-size: 12px;
    margin-right: 10px;
}

section.top-bar,
section.top-bar>nav {
    display: flex;
    align-items: center;
}

section.top-bar {
    justify-content: space-between;
    height: 60px;
    padding: 0 145px;
}

section.logo {
    width: 120px;
    height: 100%;
}

section.logo+nav {
    font-size: 12px;
}

section.top-bar a {
    color: #25292a;
    margin-right: 30px;
}

main {
    width: 100%;
    background-color: black;
    padding: 20px 160px 15px;
}
main p.title {
    color: rgb(59, 67, 86);
    font-size: 12px;
    border-bottom: 1px solid #949188;
    padding-left: 70px;
    padding-bottom: 10px;
    margin-bottom: 8px;
}
main p.title+section {
    display: flex;
}
aside.menu-bar {
    width: 180px;
    height: 450px;
    background-color: #fff;
    overflow-y: scroll;
    margin-right: 20px;
}
section.content {
    display: grid;
    width: calc(100% - 180px);
    grid-template-columns: repeat(2, 50%);
    grid-template-rows: repeat(2, 220px);
    gap: 10px;
}
footer {
    background-color: rgba(57, 57, 57);
}
</style>