const data = window.bootstrapData
delete window.bootstrapData

module.exports = {
  isProd: data.isProd
  , resources: data.resources
  , userId: data.userId
}
