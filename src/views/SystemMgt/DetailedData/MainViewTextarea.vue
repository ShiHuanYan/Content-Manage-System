<template>
    <section class="main-view-textarea">
        <main>
            <label for="markTitle">
                <span>Mark Title</span>
                <el-input id="markTitle" clearable v-model="article_data.markTitle" />
            </label>
            <label for="formalTitle">
                <span>Formal Title</span>
                <el-input id="formalTitle" clearable v-model="article_data.formalTitle" />
            </label>
            <label for="shortTitle">
                <span>Short Title</span>
                <el-input id="shortTitle" clearable v-model="article_data.shortTitle" />
            </label>
            <label for="takeEffect">
                <span>Take Effect</span>
                <el-select placeholder="  " v-model="article_data.takeEffect">
                    <el-option label="生效" value="生效" />
                    <el-option label="失效" value="失效" />
                </el-select>
            </label>
            <label for="guide">
                <span>导读</span>
                <el-input
                    type="textarea"
                    id="guide"
                    autosize
                    v-model="article_data.guide"
                />
            </label>
            <label for="keyword">
                <span>Keyword</span>
                <el-input id="keyword" clearable v-model="article_data.keyword" />
            </label>
            <label for="source">
                <span>Source</span>
                <el-input id="source" clearable v-model="article_data.source" />
            </label>
        </main>
        <FileManage
            :dataGroup="dataGroup"
            :article_pk="article_primary_key"
            v-show="whetherManageFile"
        ></FileManage>
        <section class="operation">
            <section title="返回" class="back" @click="back">返回</section>
            <section title="重置" @click="resetData">重置</section>
            <section title="文件管理" @click="fileManage">文件管理</section>
            <section
                title="上传"
                class="upload-data"
                @click="modifyArticleDialogVisible = true"
            >
                上传
            </section>
        </section>
        <el-dialog
            v-model="modifyArticleDialogVisible"
            title="修改文章"
            width="30%"
            align-center
        >
            <span style="display: flex; align-items: center">
                <el-icon :size="20">
                    <Warning />
                </el-icon>
                <span style="margin-left: 5px">确定要上传修改的数据吗？</span>
            </span>
            <template #footer>
                <span class="dialog-footer">
                    <el-button
                        @click="
                            !(modifyArticleDialogVisible = false) && exitDialog('修改')
                        "
                        >取消</el-button
                    >
                    <el-button type="primary" @click="uploadData">确定</el-button>
                </span>
            </template>
        </el-dialog>
    </section>
</template>

<script setup>
import { onMounted, getCurrentInstance, ref, reactive, toRaw } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import FileManage from "@/components/FileManage.vue";
const { proxy } = getCurrentInstance();
let article_data = reactive({
        markTitle: "",
        formalTitle: "",
        shortTitle: "",
        takeEffect: "",
        guide: "",
        keyword: "",
        source: "",
    }),
    article_data_copy = null,
    article_primary_key = proxy.$route.query.PrimaryKey,
    dataGroup = ref(sessionStorage.getItem("jsonCurrentDataGroup") - 0);
let whetherManageFile = ref(false),
    modifyArticleDialogVisible = ref(false);
function requestOneArticleData() {
    proxy.$HelperAxios
        .post("/DataAccessWithGroup/DetailedDataRow", {
            CurrentDataGroup: dataGroup.value,
            StrPrimaryKey: article_primary_key,
        })
        .then((response) => {
            if (response.status === 200) {
                if (response.data.StatusCode === "SuccGoal") {
                    article_data.markTitle = response.data.Payload.TitleMark;
                    article_data.formalTitle = response.data.Payload.TitleFormal;
                    article_data.shortTitle = response.data.Payload.TitleShort;
                    article_data.takeEffect =
                        response.data.Payload.NumTE030 === 1 ? "生效" : "失效";
                    article_data.guide = response.data.Payload.Intro;
                    article_data.keyword = response.data.Payload.Keyword;
                    article_data.source = response.data.Payload.StrSource;
                    article_data_copy = Object.assign({}, toRaw(article_data));
                }
            } else ElMessage.error("请求文章数据时，发生网络错误。");
        });
}
function fileManage() {
    whetherManageFile.value = !whetherManageFile.value;
}
function uploadData() {
    modifyArticleDialogVisible.value = false;
    proxy.$HelperAxios
        .post("/DataAccessWithGroup/UpdateDataRow", {
            TitleMark: article_data.markTitle,
            TitleFormal: article_data.formalTitle,
            TitleShort: article_data.shortTitle,
            Intro: article_data.guide,
            NumTE030: article_data.takeEffect === "生效" ? 1 : 0,
            Keyword: article_data.keyword,
            StrSource: article_data.source,
            StrPK010: article_primary_key,
            CurrentDataGroup: dataGroup.value,
        })
        .then((response) => {
            if (response.data.StatusCode === "SuccGoal") {
                ElMessage.success("文章数据更新成功！");
                requestOneArticleData();
            }
        });
}
function resetData() {
    ElMessageBox.confirm("确定要重置文章数据吗？", {
        title: "重置文章数据",
        cancelButtonText: "否",
        confirmButtonText: "确定",
    }).then(
        () => {
            article_data.markTitle = article_data_copy.markTitle;
            article_data.formalTitle = article_data_copy.formalTitle;
            article_data.shortTitle = article_data_copy.shortTitle;
            article_data.takeEffect = article_data_copy.takeEffect;
            article_data.guide = article_data_copy.guide;
            article_data.keyword = article_data_copy.keyword;
            article_data.source = article_data_copy.source;
        },
        () => {
            exitDialog("重置");
        }
    );
}
function exitDialog(type) {
    ElMessage.info(`取消上传${type}数据`);
}
function back() {
    ElMessageBox.confirm("是否返回上一级页面？", {
        title: "返回",
        cancelButtonText: "否",
        confirmButtonText: "是",
    }).then(
        () => {
            proxy.$router.back();
        },
        () => {}
    );
}
onMounted(() => {
    requestOneArticleData();
});
</script>

<style scoped>
section.main-view-textarea {
    height: 100%;
    min-height: max-content;
    position: relative;
}

section.main-view-textarea > main {
    min-height: calc(100% - 30px);
    padding: 0 10px;
    overflow: hidden;
}

label {
    display: flex;
    align-items: center;
    width: 90%;
    margin-bottom: 20px;
}

label > span {
    display: inline-block;
    width: 110px;
    color: rgba(0, 0, 0, 0.8);
    font-size: 14px;
    white-space: nowrap;
    padding-right: 20px;
}

label[for="guide"] {
    align-items: flex-start;
}

section.operation {
    display: flex;
    justify-content: flex-end;
    width: 100%;
    color: rgba(0, 0, 0, 0.5);
    background-color: rgb(248, 248, 248);
    font-size: 12px;
    padding: 0 10px;
    z-index: 99;
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

section.operation > section.back {
    position: absolute;
    left: 0;
}

section.file-manage {
    position: absolute;
    top: 0;
    left: 0;
}

#editor-wrapper {
    border: 1px solid #ccc;
    z-index: 100;
}

#toolbar-container {
    border-bottom: 1px solid #ccc;
}

#editor-container {
    height: 500px;
}
</style>
<style>
.el-textarea > textarea {
    min-height: 50px !important;
    max-height: 160px !important;
}
</style>
