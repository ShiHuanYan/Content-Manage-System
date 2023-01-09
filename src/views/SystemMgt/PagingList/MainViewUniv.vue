<template>
    <section class="main-view-univ">
        <main>
            <el-input
                v-model="keyword"
                placeholder="search the article you want to lookup."
            />
            <el-divider />
            <template v-if="pagination_config.total !== 0">
                <el-table :data="listData" style="width: 100%">
                    <el-table-column fixed prop="DF03000" label="编号" width="180" />
                    <el-table-column prop="TitleMark" label="标题备注" width="200" />
                    <el-table-column prop="StrCT050" label="创建日期" width="180" />
                    <el-table-column prop="StrMT050" label="修改日期" width="180" />
                    <el-table-column prop="NumAL040" label="AL" width="60" />
                    <el-table-column prop="NumTE030" label="TE" width="60" />
                    <el-table-column fixed="right" label="操作" width="150">
                        <template #default="{ row }">
                            <el-button
                                link
                                type="primary"
                                size="small"
                                @click="editArticle(row.StrPK010)"
                                >编辑</el-button
                            >
                            <el-button
                                link
                                type="primary"
                                size="small"
                                @click="
                                    (article_pk = row.StrPK010) &&
                                        (removeArticleDialogVisible = true)
                                "
                                >删除</el-button
                            >
                        </template>
                    </el-table-column>
                </el-table>
            </template>
            <el-pagination
                small
                background
                layout="prev, pager, next"
                :current-page="pagination_config.pageIndex"
                :page-size="pagination_config.pageSize"
                :total="pagination_config.total"
                @current-change="changePage"
            />
        </main>
        <section class="operation">
            <section
                title="新建文章"
                class="create-article"
                @click="createArticleDialogVisible = true"
            >
                新建文章
            </section>
        </section>
        <el-dialog
            v-model="removeArticleDialogVisible"
            title="删除文章"
            width="30%"
            align-center
        >
            <span style="display: flex; align-items: center">
                <el-icon :size="20">
                    <Warning />
                </el-icon>
                <span style="margin-left: 5px">确定要删除这篇文章吗？</span>
            </span>
            <template #footer>
                <span class="dialog-footer">
                    <el-button
                        @click="
                            !(removeArticleDialogVisible = false) && exitDialog('删除')
                        "
                        >取消</el-button
                    >
                    <el-button type="primary" @click="removeArticle(article_pk)"
                        >确定</el-button
                    >
                </span>
            </template>
        </el-dialog>
        <el-dialog
            v-model="createArticleDialogVisible"
            title="新建文章"
            width="30%"
            align-center
        >
            <span style="display: flex; align-items: center">
                <el-icon :size="20">
                    <Warning />
                </el-icon>
                <span style="margin-left: 5px">你需要撰写一篇新文章吗？</span>
            </span>
            <template #footer>
                <span class="dialog-footer">
                    <el-button
                        @click="
                            !(createArticleDialogVisible = false) && exitDialog('创建')
                        "
                        >稍后再说</el-button
                    >
                    <el-button type="primary" @click="createArticle">需要</el-button>
                </span>
            </template>
        </el-dialog>
    </section>
</template>

<script setup>
import { onMounted, getCurrentInstance, ref, reactive, watch } from "vue";
import { ElMessage } from "element-plus";
import { Debounce } from "/util/Debounce";
let { proxy } = getCurrentInstance();
let props = defineProps({
    dataGroup: Number,
});
let pagination_config = reactive({
    pageIndex: 1,
    pageSize: 14,
    total: 0,
});
let listData = reactive([]);
let keyword = ref(""),
    debounce = new Debounce((...args) => {
        const keyword = args[0];
        requestArticleDataWithKeyword(keyword);
    }, 800);
let removeArticleDialogVisible = ref(false),
    createArticleDialogVisible = ref(false),
    article_pk = ref(null);
watch(keyword, (newVal) => {
    debounce.launch(newVal);
});
watch(
    () => props.dataGroup,
    (newVal) => requestArticleData(newVal, 1, pagination_config.pageSize),
    { immediate: true }
);
/**
 *
 * @param {Number} current_page_index
 */
function changePage(current_page_index) {
    pagination_config.pageIndex = current_page_index;
    requestArticleData(
        props.dataGroup,
        current_page_index,
        pagination_config.pageSize,
        keyword.value
    );
}
/**
 *
 * @param {Number} PageIndex 请求页码
 * @param {Number} PageSize 分页大小
 */
function requestArticleData(CurrentDataGroup, PageIndex, PageSize, Keyword = "") {
    proxy.$HelperAxios
        .post("/DataAccessWithGroup/QueryPagingList", {
            CurrentDataGroup,
            PageIndex,
            PageSize,
            Keyword,
        })
        .then((response) => {
            if (response.status === 200) {
                if (response.data.StatusCode === "SuccGoal") {
                    pagination_config.pageSize = response.data.Payload.NumRQ020;
                    pagination_config.total = response.data.Payload.NumRowQuantity;
                    listData.length = 0;
                    listData.push(...response.data.Payload.DataList);
                } else if (response.data.StatusCode === "NullGoal") {
                    ElMessage.info("未查找到包含输入关键字的数据。");
                } else {
                    ElMessage.error("请求列表数据失败。");
                }
            } else {
                ElMessage.error("请求列表数据时，发生网络错误。");
            }
        });
}
function requestArticleDataWithKeyword(keyword_) {
    requestArticleData(
        props.dataGroup,
        (pagination_config.pageIndex = 1),
        pagination_config.pageSize,
        keyword_
    );
}
function editArticle(article_pk) {
    proxy.$router.push({
        name: "DetailedDataTextarea",
        query: { PrimaryKey: article_pk },
    });
}
function removeArticle(article_pk) {
    removeArticleDialogVisible.value = false;
    proxy.$HelperAxios
        .delete("/DataAccessWithGroup/DeleteDataRow", {
            params: {
                CurrentDataGroup: props.dataGroup,
                StrPrimaryKey: article_pk,
            },
        })
        .then((response) => {
            if (response.data.StatusCode === "SuccGoal") {
                requestArticleDataWithKeyword("");
                ElMessage.success("删除成功！");
            } else {
                ElMessage.error("删除失败！");
            }
        });
}
function createArticle() {
    createArticleDialogVisible.value = false;
    proxy.$HelperAxios
        .post("/DataAccessWithGroup/CreateDataRow", {
            CurrentDataGroup: props.dataGroup,
            TitleMark: "新建文章标题",
            ActionId: "InsertData",
        })
        .then((response) => {
            if (response.status === 200) {
                if (response.data.StatusCode === "SuccGoal") {
                    const article_pk_ = response.data.Payload;
                    proxy.$router.push({
                        name: "DetailedDataTextarea",
                        query: { PrimaryKey: article_pk_ },
                    });
                } else ElMessage.error("新建文章失败，可能缺少必要的请求参数。");
            } else ElMessage.error("新建文章时，发生网络错误。");
        });
}
// 退出对话框后，弹出消息框
function exitDialog(type) {
    ElMessage.info(`取消${type}文章`);
}
</script>

<style scoped>
section.main-view-univ {
    height: 100%;
    min-height: 100%;
    position: relative;
}

section.main-view-univ > main {
    min-height: calc(100% - 30px);
    padding: 0 10px;
}

section.operation {
    display: flex;
    justify-content: flex-end;
    width: 100%;
    color: rgba(0, 0, 0, 0.5);
    background-color: rgb(248, 248, 248);
    font-size: 12px;
    padding: 0 10px;
    position: sticky;
    bottom: 0;
}

section.operation > section {
    cursor: pointer;
    user-select: none;
    padding: 6px 12px;
    margin-left: 10px;
    border: 1px solid transparent;
    border-radius: 3px;
}

section.operation > section:hover {
    background-color: rgba(0, 100, 255, 0.05);
}

section.operation > section:active {
    border: 1px solid rgba(0, 0, 0, 0.6);
}

.el-table {
    margin-bottom: 20px;
}
</style>
