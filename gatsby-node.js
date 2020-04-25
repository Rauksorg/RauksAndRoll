exports.onCreatePage = ({ page, actions }) => {
  const { createPage } = actions
  if (page.path.match(/^\/12345\/$/) || page.path.match(/^\/$/) ) {
    page.context.layout = "noLayout"
    createPage(page)
  }
}