exports.onCreatePage = ({ page, actions }) => {
  const { createPage } = actions
  // if (page.path.match(/^\/12345\/$/) || page.path.match(/^\/$/)) {
  //   page.context.layout = 'setup'
  //   createPage(page)
  // }
  if (page.path.match(/admin/)) {
    page.context.layout = 'admin'
    createPage(page)
  }
  if (page.path.match(/demo/)) {
    page.context.layout = 'noLayout'
    createPage(page)
  }
}

exports.onCreateWebpackConfig = ({ stage, loaders, actions }) => {
  if (stage === 'build-html') {
    actions.setWebpackConfig({
      module: {
        rules: [
          {
            test: /mapbox-gl/,
            use: loaders.null(),
          },
          {
            test: /jsoneditor/,
            use: loaders.null(),
          },
        ],
      },
    })
  }
}
