import TerserPlugin from 'terser-webpack-plugin'
import CopyWebpackPlugin from 'copy-webpack-plugin'
import globalVars from 'src/helper/globalVars'
import wpChain from 'src/helper/wpChain'
import {Configuration} from 'webpack'
export const wpProduction = () => {
  const config: Configuration = {
    // devtool: false,
    // devtool: 'eval-cheap-module-source-map',
    devtool: globalVars.config.build.sourcemap ? 'source-map' : false, //Recommended
    // devServer,
    performance: {
      hints: false,
      maxEntrypointSize: 512000,
      maxAssetSize: 512000,
    },
  }
  wpChain.merge(config)
  //
  const wpcConfig = {
    plugin: {
      copy: {
        plugin: CopyWebpackPlugin,
        args: [
          {
            patterns: [
              {
                from: globalVars.publicDir.replace(/\\/g, '/'),
                to: globalVars.outDir.replace(/\\/g, '/'),
                globOptions: {
                  // 加入 paths.template 避免被重置
                  ignore: [
                    '*.DS_Store',
                    // paths.template.replace(/\\/g, '/'),
                    //  paths.favicon.replace(/\\/g, '/'),
                  ],
                },
                noErrorOnMissing: true,
              },
            ],
          },
        ],
      },
    },
  }
  wpChain.merge(wpcConfig)
  //
  if (globalVars.config.build.minify === true) {
    wpChain.optimization.minimizer('TerserPlugin').use(TerserPlugin, [
      {
        minify: TerserPlugin.swcMinify,
        terserOptions: {
          compress: false,
        },
      },
    ] as any)
  }
}