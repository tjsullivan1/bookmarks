# Story 007: Basic Application Insights Setup

## User Story
**As a** Site Reliability Engineer
**I want** basic monitoring and telemetry collection for the bookmarks platform
**So that** I can observe application health, performance, and user behavior from day one

## Details
- **Epic**: [Epic 001: Infrastructure as Code Automation Platform](../epics/epic001.epic.md)
- **Priority**: High
- **Story Points**: 5 (to be validated during planning)
- **Sprint**: Sprint 1
- **Theme**: Monitoring and Observability Foundation

## Acceptance Criteria

### AC1: Application Insights Workspace Provisioning
**Given** I need monitoring capabilities for the bookmarks platform
**When** I provision Application Insights
**Then** the workspace is configured with:
- Name following pattern: `{environment}-bookmarks-ai`
- Application type set to "web" for web application monitoring
- Location matching the resource group
- Daily data cap set to prevent unexpected charges
- Connected to Log Analytics workspace for centralized logging

### AC2: Web Apps Integration Configuration
**Given** Web Apps need automatic telemetry collection
**When** Application Insights is provisioned
**Then** integration is configured with:
- Frontend Web App connected to Application Insights
- Backend Web App connected to Application Insights
- Instrumentation key available as Web App application setting
- Connection string configured for modern SDK usage
- Auto-instrumentation enabled for supported runtimes

### AC3: Basic Monitoring Dashboards
**Given** operations teams need immediate visibility into application health
**When** Application Insights is configured
**Then** basic dashboards include:
- Application overview dashboard with key metrics
- Performance dashboard showing response times and dependencies
- Failures dashboard highlighting errors and exceptions
- Usage dashboard for user engagement metrics
- Custom dashboard for bookmark-specific metrics

### AC4: Instrumentation Key Management
**Given** applications need to send telemetry to Application Insights
**When** the workspace is provisioned
**Then** instrumentation keys are:
- Available as Terraform outputs for application configuration
- Stored in Key Vault for secure access
- Configured as Web App application settings
- Available for CI/CD pipeline configuration

### AC5: Initial Alert Rules Configuration
**Given** critical system failures need immediate attention
**When** Application Insights is configured
**Then** basic alerts include:
- High error rate alert (>5% within 5 minutes)
- Application unavailability alert (availability <95%)
- High response time alert (>2 seconds for 95th percentile)
- Failed dependency alert for external service failures
- Alert actions configured to notify platform engineering team

## Non-Functional Requirements
- **Performance**: Telemetry collection adds <50ms latency to application requests
- **Cost**: Daily data cap configured to prevent budget overruns
- **Reliability**: Monitoring system available independent of application health
- **Security**: Instrumentation keys secured and not exposed in application code

## Technical Notes
- **Implementation Approach**: Use azurerm_application_insights with Log Analytics workspace
- **Integration**: Configure Web Apps with Application Insights connection strings
- **Alerting**: Use Azure Monitor alert rules for basic operational alerts
- **Dashboard**: Create custom workbooks for bookmark-specific metrics

## Test Scenarios

### Happy Path
1. **Workspace Creation**: Application Insights workspace provisions successfully
2. **Web App Integration**: Both Web Apps connected and sending basic telemetry
3. **Dashboard Access**: Basic dashboards accessible and showing data

### Edge Cases
1. **Data Cap Limits**: Monitoring continues to function when data cap reached
2. **Workspace Conflicts**: Handles Application Insights name conflicts appropriately
3. **Integration Delays**: Manages telemetry flow startup delays gracefully

### Error Conditions
1. **Invalid Configuration**: Clear validation for invalid Application Insights settings
2. **Integration Failures**: Proper error handling for Web App integration issues
3. **Alert Configuration**: Validation for alert rule configuration errors

## Dependencies
- **Prerequisites**:
  - Story 003 (Web Apps) for integration targets
  - Story 006 (Key Vault) for instrumentation key storage
  - Azure subscription with Application Insights quota
- **Technical**:
  - Log Analytics workspace for centralized logging
  - Azure Monitor service available for alerting
- **External**:
  - Platform engineering team contact information for alert notifications

## Definition of Done
- [ ] Application Insights workspace resource implemented in Terraform
- [ ] Log Analytics workspace created for centralized logging
- [ ] Web Apps connected to Application Insights
- [ ] Instrumentation keys stored in Key Vault
- [ ] Basic alert rules configured for critical failures
- [ ] Custom dashboard created for bookmark metrics
- [ ] Code reviewed and approved
- [ ] Terraform plan shows expected monitoring resources
- [ ] Terraform apply succeeds creating monitoring infrastructure
- [ ] Web Apps sending telemetry to Application Insights
- [ ] Basic alerts functional and tested

## Technical Implementation Details

### Log Analytics Workspace
```hcl
resource "azurerm_log_analytics_workspace" "main" {
  name                = local.log_analytics_name
  location           = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  sku                = "PerGB2018"
  retention_in_days  = var.environment == "prod" ? 90 : 30

  tags = local.common_tags
}
```

### Application Insights Configuration
```hcl
resource "azurerm_application_insights" "main" {
  name                = local.application_insights_name
  location           = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  workspace_id       = azurerm_log_analytics_workspace.main.id
  application_type   = "web"

  daily_data_cap_in_gb                  = var.environment == "prod" ? 10 : 1
  daily_data_cap_notifications_disabled = false
  retention_in_days                     = var.environment == "prod" ? 90 : 30

  tags = local.common_tags
}
```

### Web App Integration
```hcl
resource "azurerm_linux_web_app_slot" "frontend_production" {
  name           = "production"
  app_service_id = azurerm_linux_web_app.frontend.id

  site_config {
    application_stack {
      docker_image     = "nginx"
      docker_image_tag = "alpine"
    }
  }

  app_settings = {
    "APPINSIGHTS_INSTRUMENTATIONKEY"        = azurerm_application_insights.main.instrumentation_key
    "APPLICATIONINSIGHTS_CONNECTION_STRING" = azurerm_application_insights.main.connection_string
    "ApplicationInsightsAgent_EXTENSION_VERSION" = "~3"
  }
}
```

### Basic Alert Rules
```hcl
resource "azurerm_monitor_metric_alert" "high_error_rate" {
  name                = "${local.application_insights_name}-high-error-rate"
  resource_group_name = azurerm_resource_group.main.name
  scopes              = [azurerm_application_insights.main.id]
  description         = "Alert when error rate exceeds 5%"
  severity            = 2
  frequency           = "PT5M"
  window_size         = "PT5M"

  criteria {
    metric_namespace = "Microsoft.Insights/components"
    metric_name      = "requests/failed"
    aggregation      = "Average"
    operator         = "GreaterThan"
    threshold        = 5
  }

  action {
    action_group_id = azurerm_monitor_action_group.main.id
  }

  tags = local.common_tags
}

resource "azurerm_monitor_action_group" "main" {
  name                = "${local.application_insights_name}-alerts"
  resource_group_name = azurerm_resource_group.main.name
  short_name          = "bookmarks"

  email_receiver {
    name          = "platform-engineering"
    email_address = var.alert_email_address
  }

  tags = local.common_tags
}
```

### Key Vault Integration
```hcl
resource "azurerm_key_vault_secret" "app_insights_instrumentation_key" {
  name         = "app-insights-instrumentation-key"
  value        = azurerm_application_insights.main.instrumentation_key
  key_vault_id = azurerm_key_vault.main.id
  content_type = "text/plain"

  depends_on = [azurerm_role_assignment.current_user_kv_admin]

  tags = {
    Environment = var.environment
    SecretType  = "InstrumentationKey"
  }
}

resource "azurerm_key_vault_secret" "app_insights_connection_string" {
  name         = "app-insights-connection-string"
  value        = azurerm_application_insights.main.connection_string
  key_vault_id = azurerm_key_vault.main.id
  content_type = "text/plain"

  depends_on = [azurerm_role_assignment.current_user_kv_admin]
}
```

### Required Outputs
```hcl
output "application_insights_name" {
  description = "Name of the Application Insights workspace"
  value       = azurerm_application_insights.main.name
}

output "application_insights_instrumentation_key" {
  description = "Instrumentation key for Application Insights"
  value       = azurerm_application_insights.main.instrumentation_key
  sensitive   = true
}

output "application_insights_connection_string" {
  description = "Connection string for Application Insights"
  value       = azurerm_application_insights.main.connection_string
  sensitive   = true
}

output "log_analytics_workspace_id" {
  description = "ID of the Log Analytics workspace"
  value       = azurerm_log_analytics_workspace.main.id
}
```

### Variables Required
- `app_insights_daily_cap_gb` (number): Daily data cap in GB
- `alert_email_address` (string): Email address for alert notifications
- `log_retention_days` (number): Log retention period in days

## Related Stories
- **Previous**: Story 006 (Azure Key Vault and Secrets Management)
- **Next**: Story 008 (Infrastructure Testing and Validation)
- **Dependencies**: Key Vault for instrumentation key storage, Web Apps for integration
