const ContentPage = require('./ContentPage');
const ContentSection = require('./ContentSection');
const CallbackRequest = require('./CallbackRequest');
const BrokerRequest = require('./BrokerRequest');
const IntegrationLog = require('./IntegrationLog');
const ResponseLog = require('./ResponseLog');
const ErrorLog = require('./ErrorLog');
const SubmissionStatus = require('./SubmissionStatus');
const IntegrationConfig = require('./IntegrationConfig');

// Define associations
ContentPage.hasMany(ContentSection, {
  foreignKey: 'page_id',
  as: 'sections',
  onDelete: 'CASCADE'
});

ContentSection.belongsTo(ContentPage, {
  foreignKey: 'page_id',
  as: 'page'
});

IntegrationLog.hasMany(ResponseLog, {
  foreignKey: 'integration_log_id',
  as: 'responses'
});

ResponseLog.belongsTo(IntegrationLog, {
  foreignKey: 'integration_log_id',
  as: 'integration'
});

IntegrationLog.hasMany(ErrorLog, {
  foreignKey: 'integration_log_id',
  as: 'errors'
});

ErrorLog.belongsTo(IntegrationLog, {
  foreignKey: 'integration_log_id',
  as: 'integration'
});

module.exports = {
  ContentPage,
  ContentSection,
  CallbackRequest,
  BrokerRequest,
  IntegrationLog,
  ResponseLog,
  ErrorLog,
  SubmissionStatus,
  IntegrationConfig
};
