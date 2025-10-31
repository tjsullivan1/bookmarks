# Main Infrastructure Resources
# Core Azure resources for the bookmarks web application platform

# Random suffix for globally unique resource names
resource "random_string" "unique_suffix" {
  length  = 4
  upper   = false
  special = false
  numeric = true
}

# Resource Group
resource "azurerm_resource_group" "main" {
  name     = local.resource_group_name
  location = var.location
  tags     = local.common_tags

  lifecycle {
    ignore_changes = [
      tags["CreatedDate"]
    ]
  }
}

# App Service Plan
resource "azurerm_service_plan" "main" {
  name                = local.app_service_plan_name
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name

  os_type  = "Linux"
  sku_name = var.app_service_plan_sku.name

  tags = local.common_tags

  lifecycle {
    ignore_changes = [
      tags["CreatedDate"]
    ]
  }
}

# Log Analytics Workspace for Application Insights
resource "azurerm_log_analytics_workspace" "main" {
  name                = local.log_analytics_workspace_name
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name

  sku               = "PerGB2018"
  retention_in_days = var.application_insights_retention_in_days

  tags = local.common_tags

  lifecycle {
    ignore_changes = [
      tags["CreatedDate"]
    ]
  }
}

# Application Insights
resource "azurerm_application_insights" "main" {
  name                = local.application_insights_name
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  workspace_id        = azurerm_log_analytics_workspace.main.id

  application_type                    = local.application_insights_config.application_type
  retention_in_days                   = local.application_insights_config.retention_in_days
  sampling_percentage                 = local.application_insights_config.sampling_percentage
  disable_ip_masking                  = local.application_insights_config.disable_ip_masking
  local_authentication_disabled       = local.application_insights_config.local_authentication_disabled
  internet_ingestion_enabled          = local.application_insights_config.internet_ingestion_enabled
  internet_query_enabled              = local.application_insights_config.internet_query_enabled
  force_customer_storage_for_profiler = local.application_insights_config.force_customer_storage_for_profiler

  tags = local.common_tags

  lifecycle {
    ignore_changes = [
      tags["CreatedDate"]
    ]
  }
}

# Container Registry
resource "azurerm_container_registry" "main" {
  name                = local.container_registry_name_unique
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name

  sku           = var.container_registry_sku
  admin_enabled = true # Required for Web Apps integration

  # Network access configuration
  public_network_access_enabled = true
  network_rule_bypass_option    = "AzureServices"

  tags = local.common_tags

  lifecycle {
    ignore_changes = [
      tags["CreatedDate"]
    ]
  }
}

# Frontend Web App
resource "azurerm_linux_web_app" "frontend" {
  name                = local.frontend_app_name
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  service_plan_id     = azurerm_service_plan.main.id

  # Enable system-assigned managed identity
  identity {
    type = "SystemAssigned"
  }

  site_config {
    always_on                               = local.app_service_config.always_on
    http2_enabled                           = local.app_service_config.http2_enabled
    minimum_tls_version                     = local.app_service_config.minimum_tls_version
    scm_minimum_tls_version                 = local.app_service_config.scm_minimum_tls_version
    ftps_state                              = local.app_service_config.ftps_state
    container_registry_use_managed_identity = local.app_service_config.container_registry_use_managed_identity

    # Container configuration - will be updated via deployment
    application_stack {
      docker_image_name   = "nginx:latest"
      docker_registry_url = "https://${azurerm_container_registry.main.login_server}"
    }

    # Health check configuration
    health_check_path = var.frontend_health_check_path
  }

  app_settings = {
    # Application Insights
    "APPINSIGHTS_INSTRUMENTATIONKEY"             = azurerm_application_insights.main.instrumentation_key
    "APPLICATIONINSIGHTS_CONNECTION_STRING"      = azurerm_application_insights.main.connection_string
    "ApplicationInsightsAgent_EXTENSION_VERSION" = "~3"

    # Container configuration
    "DOCKER_REGISTRY_SERVER_URL"          = "https://${azurerm_container_registry.main.login_server}"
    "DOCKER_ENABLE_CI"                    = "true"
    "WEBSITES_ENABLE_APP_SERVICE_STORAGE" = "false"
    "WEBSITES_PORT"                       = "80"
    "WEBSITES_CONTAINER_START_TIME_LIMIT" = var.container_startup_time_limit

    # Environment-specific settings
    "ENVIRONMENT" = var.environment
    "PROJECT"     = var.project
  }

  # Connection strings for sensitive configuration
  connection_string {
    name  = "DefaultConnection"
    type  = "Custom"
    value = "@Microsoft.KeyVault(SecretUri=${azurerm_key_vault.main.vault_uri}secrets/cosmos-connection-string/)"
  }

  tags = local.common_tags

  lifecycle {
    ignore_changes = [
      tags["CreatedDate"],
      site_config[0].application_stack[0].docker_image_name # Managed by CI/CD
    ]
  }
}

# Backend Web App
resource "azurerm_linux_web_app" "backend" {
  name                = local.backend_app_name
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  service_plan_id     = azurerm_service_plan.main.id

  # Enable system-assigned managed identity
  identity {
    type = "SystemAssigned"
  }

  site_config {
    always_on                               = local.app_service_config.always_on
    http2_enabled                           = local.app_service_config.http2_enabled
    minimum_tls_version                     = local.app_service_config.minimum_tls_version
    scm_minimum_tls_version                 = local.app_service_config.scm_minimum_tls_version
    ftps_state                              = local.app_service_config.ftps_state
    container_registry_use_managed_identity = local.app_service_config.container_registry_use_managed_identity

    # Container configuration - will be updated via deployment
    application_stack {
      docker_image_name   = "python:3.11-slim"
      docker_registry_url = "https://${azurerm_container_registry.main.login_server}"
    }

    # Health check configuration
    health_check_path = var.backend_health_check_path

    # CORS configuration for frontend access
    cors {
      allowed_origins     = ["https://${azurerm_linux_web_app.frontend.default_hostname}"]
      support_credentials = true
    }
  }

  app_settings = {
    # Application Insights
    "APPINSIGHTS_INSTRUMENTATIONKEY"             = azurerm_application_insights.main.instrumentation_key
    "APPLICATIONINSIGHTS_CONNECTION_STRING"      = azurerm_application_insights.main.connection_string
    "ApplicationInsightsAgent_EXTENSION_VERSION" = "~3"

    # Container configuration
    "DOCKER_REGISTRY_SERVER_URL"          = "https://${azurerm_container_registry.main.login_server}"
    "DOCKER_ENABLE_CI"                    = "true"
    "WEBSITES_ENABLE_APP_SERVICE_STORAGE" = "false"
    "WEBSITES_PORT"                       = "8000" # FastAPI default port
    "WEBSITES_CONTAINER_START_TIME_LIMIT" = var.container_startup_time_limit

    # Environment-specific settings
    "ENVIRONMENT" = var.environment
    "PROJECT"     = var.project

    # Python-specific settings
    "PYTHONPATH"       = "/app"
    "PYTHONUNBUFFERED" = "1"
  }

  # Connection strings for sensitive configuration
  connection_string {
    name  = "CosmosDB"
    type  = "Custom"
    value = "@Microsoft.KeyVault(SecretUri=${azurerm_key_vault.main.vault_uri}secrets/cosmos-connection-string/)"
  }

  tags = local.common_tags

  lifecycle {
    ignore_changes = [
      tags["CreatedDate"],
      site_config[0].application_stack[0].docker_image_name # Managed by CI/CD
    ]
  }
}

# Cosmos DB Account
resource "azurerm_cosmosdb_account" "main" {
  name                = local.cosmos_account_name_unique
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name

  offer_type = local.cosmos_db_config.offer_type
  kind       = local.cosmos_db_config.kind

  # Serverless configuration
  capabilities {
    name = "EnableServerless"
  }

  consistency_policy {
    consistency_level       = local.cosmos_db_config.consistency_policy.consistency_level
    max_interval_in_seconds = local.cosmos_db_config.consistency_policy.max_interval_in_seconds
    max_staleness_prefix    = local.cosmos_db_config.consistency_policy.max_staleness_prefix
  }

  geo_location {
    location          = local.cosmos_db_config.geo_location.location
    failover_priority = local.cosmos_db_config.geo_location.failover_priority
    zone_redundant    = local.cosmos_db_config.geo_location.zone_redundant
  }

  # Backup configuration
  dynamic "backup" {
    for_each = var.enable_backup ? [1] : []
    content {
      type                = local.cosmos_db_config.backup.type
      interval_in_minutes = local.cosmos_db_config.backup.interval_in_minutes
      retention_in_hours  = local.cosmos_db_config.backup.retention_in_hours
      storage_redundancy  = local.cosmos_db_config.backup.storage_redundancy
    }
  }

  tags = local.common_tags

  lifecycle {
    ignore_changes = [
      tags["CreatedDate"]
    ]
  }
}

# Cosmos DB SQL Database
resource "azurerm_cosmosdb_sql_database" "main" {
  name                = local.cosmos_database_name
  resource_group_name = azurerm_resource_group.main.name
  account_name        = azurerm_cosmosdb_account.main.name
}

# Cosmos DB SQL Container
resource "azurerm_cosmosdb_sql_container" "bookmarks" {
  name                = local.cosmos_container_name
  resource_group_name = azurerm_resource_group.main.name
  account_name        = azurerm_cosmosdb_account.main.name
  database_name       = azurerm_cosmosdb_sql_database.main.name

  partition_key_paths   = ["/id"]
  partition_key_version = 1

  # Indexing policy for bookmark queries
  indexing_policy {
    indexing_mode = "consistent"

    included_path {
      path = "/*"
    }

    excluded_path {
      path = "/\"_etag\"/?"
    }
  }

  # Unique key policy for bookmark URLs per user
  unique_key {
    paths = ["/userId", "/url"]
  }
}

# Key Vault
resource "azurerm_key_vault" "main" {
  name                = local.key_vault_name_unique
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name

  tenant_id                  = local.key_vault_config.tenant_id
  sku_name                   = local.key_vault_config.sku_name
  soft_delete_retention_days = local.key_vault_config.soft_delete_retention_days
  purge_protection_enabled   = local.key_vault_config.purge_protection_enabled
  enable_rbac_authorization  = local.key_vault_config.enable_rbac_authorization

  enabled_for_deployment          = local.key_vault_config.enabled_for_deployment
  enabled_for_disk_encryption     = local.key_vault_config.enabled_for_disk_encryption
  enabled_for_template_deployment = local.key_vault_config.enabled_for_template_deployment

  # Network access configuration
  dynamic "network_acls" {
    for_each = var.enable_security_hardening ? [1] : []
    content {
      default_action = local.key_vault_config.network_acls.default_action
      bypass         = local.key_vault_config.network_acls.bypass
      ip_rules       = local.key_vault_config.network_acls.ip_rules
    }
  }

  tags = local.common_tags

  lifecycle {
    ignore_changes = [
      tags["CreatedDate"]
    ]
  }
}

# Store Cosmos DB connection string in Key Vault
resource "azurerm_key_vault_secret" "cosmos_connection_string" {
  name         = "cosmos-connection-string"
  value        = azurerm_cosmosdb_account.main.primary_sql_connection_string
  key_vault_id = azurerm_key_vault.main.id

  tags = local.common_tags

  depends_on = [
    azurerm_role_assignment.current_user_kv_admin
  ]

  lifecycle {
    ignore_changes = [
      tags["CreatedDate"]
    ]
  }
}

# Store Application Insights connection string in Key Vault
resource "azurerm_key_vault_secret" "app_insights_connection_string" {
  name         = "app-insights-connection-string"
  value        = azurerm_application_insights.main.connection_string
  key_vault_id = azurerm_key_vault.main.id
  content_type = "text/plain"

  tags = local.common_tags

  depends_on = [
    azurerm_role_assignment.current_user_kv_admin
  ]

  lifecycle {
    ignore_changes = [
      tags["CreatedDate"]
    ]
  }
}
