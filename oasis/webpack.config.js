module.exports = {
  entry: './index.js',
  output: {
    // path: './dist',
    filename: 'main.js',
    umdNamedDefine: true,
    libraryTarget: 'var',
    library: 'oasis'
  },
  node: {
    fs: 'empty'
  }
};
