<template>
    <header>
        <section class="logo">
            <img src="@/assets/logo.svg" alt="" />
        </section>
        <section class="user-info">
            <p class="user-account" v-if="currentUserGroup !== null">
                你好，{{ currentUserGroup }}
            </p>
            <a href="javascript: void(0)" @click="centerDialogVisible = true">退出</a>
        </section>
    </header>
    <main>
        <aside class="menu-bar">
            <section>
                <section class="title">System Admin</section>
                <nav class="options">
                    <el-tree
                        :data="treeData"
                        :props="treeProp"
                        @node-click="handleRoute"
                    />
                </nav>
            </section>
        </aside>
        <article>
            <router-view v-slot="{ Component }">
                <keep-alive v-if="!!$route.meta.keepAlive">
                    <component :is="Component" :dataGroup="currentDataGroup" />
                </keep-alive>
                <template v-else>
                    <component :is="Component" :dataGroup="currentDataGroup" />
                </template>
            </router-view>
        </article>
    </main>
    <el-dialog v-model="centerDialogVisible" title="退出登录" width="30%" align-center>
        <span>确定要退出登录吗？</span>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="centerDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="logout"> 确定 </el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script>
import { onMounted, getCurrentInstance, ref } from "vue";
import { ElMessage } from "element-plus";
export default {
    name: "CMS",
    setup(props) {
        let { proxy } = getCurrentInstance();
        let currentUserGroup = ref(null),
            centerDialogVisible = ref(false),
            whetherToLogout = false,
            currentDataGroup = ref(50004);
        let treeData = ref(null),
            treeProp = {
                children: "ListChild",
                label: "ShowText",
            };
        let tree = null;
        onMounted(() => {
            document.title = "内容管理系统";
            tree = document.querySelector(".el-tree");
            getCurrentUserGroup();
            getDataGroup();
        });
        function handleRoute(node_data) {
            // console.log(node_data);
            if (
                proxy.$HelperCore.boolFuncJsonExistChk(
                    node_data.JO01LC030,
                    "HomeSystemMgt"
                )
            ) {
                // 检查当前 node 是否有查看用户信息的权限，2表示有
                if (node_data.NV04AP040[2] === 2) {
                    sessionStorage.setItem(
                        "jsonCurrentDataGroup",
                        JSON.stringify(node_data.NumDataGroup)
                    );
                    const path = node_data.JO01LC030.HomeSystemMgt.URL;
                    currentDataGroup.value = node_data.NumDataGroup;
                    proxy.$router.push({ path });
                } else {
                    ElMessage.info("Autorization is required for viewing.");
                    proxy.$router.push({ path: "/LayoutViewSystemMgt" });
                }
            } else {
                proxy.$router.push({ path: "/LayoutViewSystemMgt" });
            }
        }
        function getCurrentUserGroup() {
            const accessToken = localStorage.getItem("AccessToken");
            const jsonArrayUserGroup = sessionStorage.getItem("jsonArrayUserGroup");
            if (jsonArrayUserGroup !== null)
                currentUserGroup.value = JSON.parse(jsonArrayUserGroup)[0].NumUserGroup;
            if (accessToken !== null && jsonArrayUserGroup === null) {
                proxy.$HelperAxios
                    .get("/AttrUserAccount/QueryUserGroup", { params: {} })
                    .then((response) => {
                        if (response.status === 200) {
                            if (response.data.StatusCode === "SuccGoal") {
                                const jsonArraytUserGruop_ =
                                    response.data.Payload.JsonArrayUserGroup;
                                sessionStorage.setItem(
                                    "jsonArrayUserGroup",
                                    JSON.stringify(jsonArraytUserGruop_)
                                );
                                currentUserGroup.value =
                                    jsonArraytUserGruop_[0].NumUserGroup;
                            } else {
                                ElMessage.error("用户信息请求失败");
                            }
                        } else {
                            ElMessage.error("请求用户信息时，发生网络错误");
                        }
                    });
            }
        }
        function getDataGroup() {
            const loadingInstance = proxy.$loading({
                fullscreen: false,
                target: tree,
            });
            proxy.$HelperAxios
                .get("/DataAccessWithGroup/QueryDataGroup", { params: {} })
                .then((response) => {
                    if (response.status === 200) {
                        if (response.data.StatusCode === "SuccGoal") {
                            loadingInstance.close();
                            treeData.value = response.data.Payload;
                        } else {
                            ElMessage.error("栏目信息请求失败");
                            console.log(response);
                        }
                    } else {
                        ElMessage.error("请求栏目信息时，发生网络错误");
                    }
                });
        }
        function logout() {
            localStorage.removeItem("AccessToken");
            sessionStorage.removeItem("jsonArrayUserGroup");
            sessionStorage.removeItem("jsonCurrentDataGroup");
            currentUserGroup.value = sessionStorage.getItem("jsonArrayUserGroup");
            centerDialogVisible = false;
            window.location.reload();
        }
        return {
            currentUserGroup,
            centerDialogVisible,
            whetherToLogout,
            currentDataGroup,
            treeData,
            treeProp,
            handleRoute,
            logout,
        };
    },
};
</script>

<style scoped>
summary {
    cursor: pointer;
    user-select: none;
}

header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding: 10px 10px 15px;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
}

section.logo {
    width: 30px;
    height: 30px;
}

section.user-info {
    display: flex;
    padding: 0 20px;
}

p.user-account,
p.user-account + a {
    font-size: 12px;
}

p.user-account {
    margin-right: 10px;
}

main {
    display: flex;
}

aside.menu-bar {
    min-width: 200px;
    height: 803px;
    font-size: 14px;
    padding: 10px;
    border-top: 2px solid #0000ff1a;
    overflow-y: scroll;
    transition: all 0.5s ease 0s;
}

aside.menu-bar {
    background-color: rgba(0, 0, 255, 0.02);
}

aside.menu-bar section.title {
    color: #476582;
    margin-bottom: 20px;
}

aside.menu-bar + article {
    padding-top: 20px;
}

article {
    flex-grow: 1;
    height: 803px;
    overflow-y: scroll;
}

.el-tree {
    background-color: transparent;
}
</style>

<style>
.el-tree .el-tree-node__content {
    height: 45px !important;
    border-radius: 3px;
    transition: background-color 0.2s ease-in-out 0s;
}

.el-tree .el-tree-node__content:hover {
    background-color: #0000ff1a !important;
}
</style>
