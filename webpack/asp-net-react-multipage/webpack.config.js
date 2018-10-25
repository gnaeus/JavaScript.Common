const path = require("path");
const glob = require("glob");
const webpack = require("webpack");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");

const outDir = "wwwroot";

const outPath = path.resolve(__dirname, outDir);

const viewsPath = path.resolve(__dirname, "Views");

const views = new Set(glob.sync(path.resolve(viewsPath, "**/*.cshtml")));

const entries = glob
  // all .js, .jsx, ts and .tsx files from ~/Views folder
  .sync(path.resolve(viewsPath, "**/*.@(js|ts)"))
  // that have .cshtml view with same name
  .filter(page => views.has(page.slice(0, -3) + ".cshtml"))
  .concat(
    glob
      .sync(path.resolve(viewsPath, "**/*.@(jsx|tsx)"))
      .filter(page => views.has(page.slice(0, -4) + ".cshtml"))
  )
  // grouped to dictionary by path relative to ~/Views folder
  .reduce((entries, page) => {
    const name = /(.*)\.(js|ts|jsx|tsx)$/.exec(page.slice(viewsPath.length))[1];
    entries[name] = page;
    return entries;
  }, {});

module.exports = (_env, argv) => ({
  devtool: argv.mode === "production" ? "source-map" : "eval-source-map",
  entry: entries,
  resolve: {
    extensions: [".js", ".ts", ".jsx", ".tsx"],
    plugins: [
      // @ts-ignore
      new TsconfigPathsPlugin({
        extensions: [".js", ".ts", ".jsx", ".tsx"],
        configFile: path.resolve(__dirname, "tsconfig.json")
      })
    ]
  },
  output: {
    filename: "[name].js",
    path: outPath
  },
  module: {
    rules: [
      {
        test: /\.(tsx?|jsx?)$/,
        include: /(ClientApp|Views)/,
        use: [
          {
            loader: "ts-loader",
            options: {
              transpileOnly: argv.mode === "production",
              configFile: path.resolve(__dirname, "tsconfig.json")
            }
          }
        ]
      },
      {
        test: /\.(scss|css)$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: { minimize: argv.mode === "production" }
          },
          {
            loader: "postcss-loader",
            options: {
              plugins: [require("autoprefixer")]
            }
          },
          "sass-loader"
        ]
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg|ttf|eot|woff|woff2)$/,
        use: "url-loader?limit=10000"
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin([outPath]),
    new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /ru|kk/),
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify(argv.mode),
      "process.env.OUT_DIR": JSON.stringify(outDir),
      DEBUG: JSON.stringify(argv.mode !== "production")
    })
  ],
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: true,
        uglifyOptions: {
          compress: {
            // inline is buggy as of uglify-es 3.3.9
            // https://github.com/mishoo/UglifyJS2/issues/2842
            inline: 1
          }
        }
      })
    ]
  }
});
