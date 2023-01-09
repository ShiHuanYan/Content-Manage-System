<template>
    <section class="file-manage">
        <header>
            <nav>
                <a
                    href="javascript: void(0)"
                    class="tab-nav"
                    :class="{ selected: tab_index === 0 }"
                    @click="tab_index = 0"
                    >图片文件</a
                >
                <a
                    href="javascript: void(0)"
                    class="tab-nav"
                    :class="{ selected: tab_index === 1 }"
                    @click="tab_index = 1"
                    >视频文件</a
                >
            </nav>
        </header>
        <main>
            <section class="tabs">
                <section class="tab" v-show="tab_index === 0">
                    <section class="uploaded-image-list">
                        <el-col
                            :span="6"
                            v-for="(item, index) in uploadedImages"
                            :key="index"
                        >
                            <el-card :body-style="{ padding: '0px' }">
                                <img :src="item.RL02Main" class="image" />
                                <div style="padding: 14px">
                                    <span>{{ item.FN010 }}</span>
                                    <el-row class="bottom">
                                        <el-col :span="4"><el-checkbox /></el-col>
                                        <el-col :span="8" :push="6">
                                            <el-button text class="button"
                                                >插入富文本</el-button
                                            >
                                        </el-col>
                                        <el-col :span="4" :push="1">
                                            <el-button
                                                text
                                                class="button"
                                                @click="removeUploadedImage(item.FN010)"
                                                >删除</el-button
                                            >
                                        </el-col>
                                    </el-row>
                                </div>
                            </el-card>
                        </el-col>
                    </section>
                    <el-upload
                        ref="upload_file"
                        accept="image/*"
                        action="http://wh011024.mysh360.com/FileServSystemMgt/FileUpload"
                        :data="requestParams"
                        :auto-upload="false"
                        multiple
                        :on-success="getUploadedImage"
                    >
                        <template #trigger>
                            <el-button type="primary">选择文件</el-button>
                        </template>

                        <el-button class="ml-3" type="success" @click="upload">
                            上传图片到服务器
                        </el-button>

                        <template #tip>
                            <div class="el-upload__tip">
                                .jpg/.png 文件的大小应小于 500KB
                            </div>
                        </template>
                    </el-upload>
                    <section class="custom-upload-btn">
                        <label for="upload-image">
                            上传图片
                            <input
                                type="file"
                                name="upload-image"
                                id="upload-image"
                                multiple
                                accept="image/*"
                        /></label>
                        <label for="upload-to-server"
                            ><input
                                type="button"
                                id="upload-to-server"
                                @click="uploadImageByFetch"
                                value="上传图片到服务器"
                        /></label>
                    </section>
                    <div class="placeholder"></div>
                </section>
                <section class="tab" v-show="tab_index === 1">
                    视频文件管理 视频文件管理
                </section>
            </section>
        </main>
    </section>
</template>

<script setup>
import { onMounted, getCurrentInstance, ref, reactive, toRaw } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
const { proxy } = getCurrentInstance();
const props = defineProps({
    dataGroup: {
        type: Number,
        default: 0,
    },
    article_pk: {
        type: String,
        default: "",
    },
    FileType: {
        type: String,
        default: "ImageFile",
    },
    AccessToken: {
        type: String,
        default: localStorage.getItem("AccessToken"),
    },
});
let tab_index = ref(0);
let upload_file = ref(null);
let requestParams = reactive({
    CurrentDataGroup: props.dataGroup,
    StrPrimaryKey: props.article_pk,
    FileType: props.FileType,
    AccessToken: props.AccessToken,
});
let uploadedImages = reactive([]);
const axiosInstance = proxy.$HelperAxios.create({
    baseURL: "http://wh011024.mysh360.com",
    headers: {
        authorization: localStorage.getItem("AccessToken"),
    },
});

onMounted(() => {
    getUploadedImage();
});
// 由 xhr api上传图片
function upload() {
    upload_file.value.submit();
}
// 由 fetch api 上传图片
function uploadImageByFetch() {
    const loadingInstance = proxy.$loading({
        fullscreen: false,
        target: document.querySelector(".file-manage"),
    });
    const upload_image = document.querySelector("input#upload-image");
    for (const image_file of upload_image.files) {
        const formData = new FormData();
        formData.append("CurrentDataGroup", requestParams.CurrentDataGroup);
        formData.append("StrPrimaryKey", requestParams.StrPrimaryKey);
        formData.append("FileType", requestParams.FileType);
        formData.append("AccessToken", requestParams.AccessToken);
        formData.append("file", image_file);
        fetch("http://wh011024.mysh360.com/FileServSystemMgt/FileUpload", {
            method: "post",
            body: formData,
        }).then((response) => {
            if (response.ok) {
                response.text().then((jsonData) => {
                    const StatusCode = JSON.parse(jsonData).StatusCode;
                    if (StatusCode === "SuccLocal") {
                        loadingInstance.close();
                        ElMessage.success("图片上传成功");
                        getUploadedImage();
                    } else {
                        loadingInstance.close();
                        ElMessage.error("图片上传失败");
                    }
                });
            } else {
                loadingInstance.close();
                ElMessage.error("图片上传失败");
            }
        });
    }
}
// 获取已上传的图片信息
function getUploadedImage() {
    axiosInstance({
        method: "post",
        url: "/FileServSystemMgt/FileList",
        data: {
            CurrentDataGroup: props.dataGroup,
            StrPrimaryKey: props.article_pk,
            FileType: props.FileType,
        },
    }).then((response) => {
        if (response.status === 200) {
            if (response.data.StatusCode === "SuccGoal") {
                let image_data = response.data.Payload;
                image_data.forEach((element) => {
                    element.RL02FI030 = replacePlaceholderImageUrl(element.RL02FI030);
                    element.RL02Main = replacePlaceholderImageUrl(element.RL02Main);
                });
                uploadedImages.length = 0;
                uploadedImages.push(...image_data);
            } else {
                ElMessage.error("请求已上传的图片失败，可能缺少请求参数。");
            }
        } else {
            ElMessage.error("请求已上传的图片时，发生网络错误。");
        }
    });
}
// 删除已上传的图片
function removeUploadedImage(image_name) {
    ElMessageBox.confirm(`确定要删除名为 ${image_name} 的图片吗`, {
        title: "删除图片",
        cancelButtonText: "取消",
        confirmButtonText: "确定",
    })
        .then(() => {
            let remove_file_request_params = Object.assign({}, toRaw(requestParams));
            remove_file_request_params.FileName = image_name;
            axiosInstance({
                method: "post",
                url: "/FileServSystemMgt/DelFileSingle",
                data: remove_file_request_params,
            }).then((response) => {
                if (response.status === 200) {
                    if (response.data.StatusCode === "SuccGoal") {
                        ElMessage.success(`图片 ${image_name} 删除成功！`);
                        getUploadedImage();
                    } else ElMessage.error("删除图片失败");
                } else ElMessage.error("删除图片时，发生网络错误");
            });
        })
        .catch(() => {
            ElMessage.info("取消删除图片");
        });
}
// 替换已上传的图片的 url 路径占位符
function replacePlaceholderImageUrl(img_url) {
    return img_url
        .replace("sPlaceholderColon", ":")
        .replace(/PlaceholderComma/g, ",")
        .replace(/PlaceholderQuote/g, '"');
}
</script>

<style scoped>
section.file-manage {
    width: 100%;
    height: calc(100% - 30px);
    background-color: #fff;
    z-index: 9;
    overflow-y: scroll;
}

section.file-manage::-webkit-scrollbar {
    width: 3px;
}

nav {
    display: flex;
}

nav > a {
    color: rgb(62, 62, 62);
    font-size: 14px;
    font-weight: 530;
    padding: 8px 10px;
}

nav > a.selected {
    border-bottom: 2px solid rgb(165, 130, 42);
}

main {
    padding: 0 10px;
}

section.tabs {
    min-height: 650px;
}

section.tab {
    height: 100%;
}

.time {
    font-size: 12px;
    color: #999;
}

.bottom {
    margin-top: 13px;
    line-height: 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.button {
    padding: 0;
    min-height: auto;
}

.image {
    width: 100%;
    display: block;
}

section.uploaded-image-list {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    margin: 20px 0;
}

label[for="upload-image"],
input#upload-to-server {
    cursor: pointer;
    color: #fff;
    font-size: 14px;
    padding: 5px 15px;
    border-radius: 5px;
}

label[for="upload-image"] {
    user-select: none;
    background-color: #1a87ff;
    margin-right: 12px;
    border: 1px solid #1a87ff;
}

input#upload-to-server {
    background: -webkit-linear-gradient(
        40deg,
        cyan 5%,
        #1a87ff 40%,
        rgba(152, 0, 152, 0.8) 90%
    );
    border: 1px solid #fff;
}

label[for="upload-image"]:hover {
    background-color: #4fa4ff;
}

input#upload-to-server:hover {
    background: -webkit-linear-gradient(
        40deg,
        rgb(68, 255, 255) 5%,
        #4fa4ff 40%,
        rgba(232, 55, 232, 0.8) 90%
    );
}

label[for="upload-image"]:active {
    background-color: #428ad6;
}
input#upload-to-server:active {
    background: -webkit-linear-gradient(
        40deg,
        rgb(63, 236, 236) 5%,
        #438ad6 40%,
        rgba(206, 49, 206, 0.8) 90%
    );
}

input#upload-image {
    display: none;
}

div.placeholder {
    width: 100%;
    height: 50px;
}
</style>

<style>
.el-row {
    margin: 20px 0;
}

.el-row:last-child {
    margin-bottom: 0;
}

section.uploaded-image-list > .el-row {
    flex-wrap: wrap;
}

button.ml-3 {
    margin-left: 0.75rem;
}
</style>
