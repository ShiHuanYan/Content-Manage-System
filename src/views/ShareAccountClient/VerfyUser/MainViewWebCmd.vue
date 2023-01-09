<template>
  <div>OAuth 2.0 Web Command</div>
</template>
<script setup>
import { onBeforeMount, onMounted, getCurrentInstance, reactive } from "vue";
let jsonReqParam = {
  AC010: "",
  SL060: "en",
};
const { proxy, data } = getCurrentInstance();
onBeforeMount(() => {
  // Trying to get the Authorization Code (AC010) from URL.
  const AuthCode = proxy.$HelperCore.queryStrFunc("AC010", proxy.router);
  if (AuthCode.length > 0) {
    // Query Access Token (AT06) by Authorization Code (AC01).
    jsonReqParam.AC010 = AuthCode;
    const PromiseReq = proxy.$HelperAxios.post(proxy.$ConfigBiz.jsonFuncOption().API_Local.strURL + "/UC03UV040/AR03AT060", jsonReqParam).then((jsonResult) => {
      const responseResult = jsonResult.data;
      const StrMsg = proxy.$HelperCore.strFuncJsonFilter(responseResult.Msg, false);
      if (responseResult.SC120 === "SuccGoal") {
        // alert("Login Successfully.");
        window.localStorage.setItem("AccessToken", responseResult.Payload.AT060);
        // User Group
        let promiseUserGroup = proxy.$HelperUserAccount.jsonFuncUserGroup(2).then((jsonArrayUserGroupIn) => {
          const URL_Return = proxy.$HelperCore.queryStrFunc("LR01Return", proxy.$router);
          if (URL_Return.length > 0) {
            window.location.href = decodeURIComponent(URL_Return);
          } else {
            // window.location.href = "/";
            document.location.href = '/LayoutViewSystemMgt';
          }
        });
        // const JO01RQ03M0 = OH01RW0118_M0.JM01RQ03HG(proxy.router);
        // proxy.$router.push({ path: decodeURIComponent(jsonReqParam.LR01AT060), query: { AC010: responseResult.Payload } });
      } else if (responseResult.SC120 === "NullAT060") {
        alert(StrMsg);
        proxy.$HelperUserAccount.handlerLogin();
      } else {
        alert(StrMsg);
      }
    });
  } else {
    proxy.$HelperUserAccount.handlerLogin();
  }
});
onMounted(() => {});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
