import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { ConfigBiz } from "./util/ConfigBiz";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    host: ConfigBiz.jsonFuncOption().AppInfo.StrHost,
    https: ConfigBiz.jsonFuncOption().AppInfo.BoolHTTPS,
    port: ConfigBiz.jsonFuncOption().AppInfo.PortNum, //指定端口号
    proxy: {
      '/proxy': {
        target: 'http://wh011040.mysh360.com',
        secure: false,
        changeOrigin: true,
        rewrite: path => path.replace(/^\/proxy/, '')
      },
    }
  },
});
