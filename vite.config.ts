import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import path from 'path'
import gzip from 'rollup-plugin-gzip'
import Icons from 'unplugin-icons/vite'
import { defineConfig } from 'vite'
import svg from 'vite-svg-loader'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isDev = mode === 'development',
    isTest = mode === 'onlineTest',
    isProd = mode === 'production',
    devHost = '',
    testHost = '',
    prodHost = '',
    apiPath = '',
    sslMap = {
      dev: false,
      test: false,
      prod: false,
    },
    routerBase = '',
    wsPath = ''

  const curHttpProt = should(
    getHttpProt(sslMap.dev),
    getHttpProt(sslMap.test),
    getHttpProt(sslMap.prod)
  )

  const curWSProt = should(
    getWsProt(sslMap.dev),
    getWsProt(sslMap.test),
    getWsProt(sslMap.prod)
  )

  const host = should(devHost, testHost, prodHost)

  const define = {
    __DEV__: isDev,
    __TEST__: isTest,
    __PROD__: isProd,
    __TEST_ORIGIN__: stringify(
      may(`${getHttpProt(sslMap.test)}//${testHost}`, testHost)
    ),
    __PROD_ORIGIN__: stringify(
      may(`${getHttpProt(sslMap.prod)}//${prodHost}`, prodHost)
    ),
    __ROUTER_BASE__: stringify(routerBase),
    __API_URL__: stringify(
      host ? `${curHttpProt}//${host}${apiPath}` : apiPath
    ),
    __WS_URL__: stringify(
      host ? `${wsPath ? `${curWSProt}//${host}${wsPath}` : ''}` : wsPath
    ),
  }

  Object.entries(define).forEach(([k, v]) => console.log(k + ': ', v))

  return {
    base: isDev ? '/' : './',
    define,
    plugins: [
      vue({ include: [/\.vue$/, /\.md$/] }),
      vueJsx(),
      gzip({ filter: /\.(js|mjs|json|css|html|dat|png|svg)$/ }),
      svg(),
      Icons({
        compiler: `vue3`,
        defaultClass: `transition-all full`,
        iconCustomizer: (_, __, props) => {
          props.width = props.height = `0`
        },
      }),
    ],
    resolve: { alias: { '@': path.resolve(process.cwd(), 'src') } },
    build: { sourcemap: true, cssCodeSplit: false },
  }

  function may(data: unknown, has?: unknown) {
    return has ? data : ''
  }

  function should(dev?: string, test?: string, prod?: string) {
    return isTest ? test : isDev ? dev : prod
  }

  function getHttpProt(ssl?: boolean) {
    return ssl ? 'https:' : 'http:'
  }

  function getWsProt(ssl?: boolean) {
    return ssl ? 'wss:' : 'ws:'
  }

  function stringify(s: any) {
    return JSON.stringify(s)
  }
})
