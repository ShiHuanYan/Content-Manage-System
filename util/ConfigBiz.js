// import ViteConfig from "../vite.config.js";
import { HelperCore, HelperWebComm, HelperUserAccount, DataModelDataGroup } from "./HelperCore";
class ConfigBiz {
  // static jsonFuncOption() {
  //   return {
  //     UI_OAuth: {
  //       strURL: "http://cloud.mysh360.com",
  //     },
  //     API_Local: {
  //       strURL: "http://wh011200.mysh360.com",
  //     },
  //     InfoSafety: {
  //       strVerifyTokenMode: "Gentleman",
  //     },
  //     AppInfo: {
  //       BoolHTTPS: false,
  //       PortNum: 45404,
  //       StrHost: "localhost",
  //       NumAppId: 9,
  //     },
  //   };
  // }
  static jsonFuncOption() {
    return {
      UI_OAuth: {
        strURL: "http://cloud.mysh360.com",
      },
      API_Local: {
        strURL: "http://wh011040.mysh360.com",
      },
      InfoSafety: {
        strVerifyTokenMode: "Gentleman",
      },
      AppInfo: {
        BoolHTTPS: false,
        PortNum: 46204,
        StrHost: "localhost",
        NumAppId: 1,
      },
    };
  }
  static URL_LocalFunc() {
    const jsonAppInfo = this.jsonFuncOption().AppInfo;
    const protocolName = jsonAppInfo.BoolHTTPS ? "https" : "http",
      strPortNum = jsonAppInfo.PortNum > 0 ? ":" + jsonAppInfo.PortNum : "";
    return protocolName + "://" + jsonAppInfo.StrHost + strPortNum;
  }
  static jsonFuncFileServConfig(numUpdateModeIn) {
    const jsonStrLocalConfig = sessionStorage.getItem("jsonLocalConfigFileService");
    if (numUpdateModeIn === 3 || (numUpdateModeIn === 2 && jsonStrLocalConfig === null)) {
      let promiseWebReq = HelperWebComm.reqFuncUniv(this.jsonFuncOption().API_Local.strURL + "/IC09LC070/QD01FC020", null, null, "get").then((strArrayRespResult) => {
        if (strArrayRespResult[0] === "SuccWebReq") {
          const jsonRespResult = JSON.parse(strArrayRespResult[1]);
          if (jsonRespResult.SC120 === "SuccGoal") {
            sessionStorage.setItem("jsonLocalConfigFileService", JSON.stringify(jsonRespResult.Payload));
            return jsonRespResult.Payload;
          } else {
            return null;
          }
        } else {
          return null;
        }
      });
      return promiseWebReq;
    } else if (jsonStrLocalConfig === null) {
      return Promise.resolve(null);
    } else {
      return Promise.resolve(JSON.parse(jsonStrLocalConfig));
    }
  }
}
export { ConfigBiz };
