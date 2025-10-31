# Output Values
# Expose important resource information for integration and reference

# Resource Group
output "resource_group_name" {
  description = "Name of the created resource group"
  value       = azurerm_resource_group.main.name
}

output "resource_group_location" {
  description = "Location of the resource group"
  value       = azurerm_resource_group.main.location
}

output "resource_group_id" {
  description = "ID of the created resource group"
  value       = azurerm_resource_group.main.id
}

# App Service Plan
output "app_service_plan_name" {
  description = "Name of the App Service Plan"
  value       = azurerm_service_plan.main.name
}

output "app_service_plan_id" {
  description = "ID of the App Service Plan"
  value       = azurerm_service_plan.main.id
}

output "app_service_plan_sku" {
  description = "SKU of the App Service Plan"
  value       = azurerm_service_plan.main.sku_name
}

# Frontend Web App
output "frontend_app_name" {
  description = "Name of the frontend web app"
  value       = azurerm_linux_web_app.frontend.name
}

output "frontend_app_id" {
  description = "ID of the frontend web app"
  value       = azurerm_linux_web_app.frontend.id
}

output "frontend_app_hostname" {
  description = "Default hostname of the frontend web app"
  value       = azurerm_linux_web_app.frontend.default_hostname
}

output "frontend_app_url" {
  description = "Default URL of the frontend web app"
  value       = "https://${azurerm_linux_web_app.frontend.default_hostname}"
}

output "frontend_principal_id" {
  description = "Principal ID of the frontend app's managed identity"
  value       = azurerm_linux_web_app.frontend.identity[0].principal_id
}

# Backend Web App
output "backend_app_name" {
  description = "Name of the backend web app"
  value       = azurerm_linux_web_app.backend.name
}

output "backend_app_id" {
  description = "ID of the backend web app"
  value       = azurerm_linux_web_app.backend.id
}

output "backend_app_hostname" {
  description = "Default hostname of the backend web app"
  value       = azurerm_linux_web_app.backend.default_hostname
}

output "backend_app_url" {
  description = "Default URL of the backend web app"
  value       = "https://${azurerm_linux_web_app.backend.default_hostname}"
}

output "backend_principal_id" {
  description = "Principal ID of the backend app's managed identity"
  value       = azurerm_linux_web_app.backend.identity[0].principal_id
}

# Container Registry
output "container_registry_name" {
  description = "Name of the Azure Container Registry"
  value       = azurerm_container_registry.main.name
}

output "container_registry_id" {
  description = "ID of the Azure Container Registry"
  value       = azurerm_container_registry.main.id
}

output "container_registry_login_server" {
  description = "Login server URL for the Azure Container Registry"
  value       = azurerm_container_registry.main.login_server
}

output "container_registry_admin_username" {
  description = "Admin username for the Azure Container Registry"
  value       = azurerm_container_registry.main.admin_username
  sensitive   = true
}

output "container_registry_admin_password" {
  description = "Admin password for the Azure Container Registry"
  value       = azurerm_container_registry.main.admin_password
  sensitive   = true
}

# Cosmos DB
output "cosmos_account_name" {
  description = "Name of the Cosmos DB account"
  value       = azurerm_cosmosdb_account.main.name
}

output "cosmos_account_id" {
  description = "ID of the Cosmos DB account"
  value       = azurerm_cosmosdb_account.main.id
}

output "cosmos_account_endpoint" {
  description = "Endpoint of the Cosmos DB account"
  value       = azurerm_cosmosdb_account.main.endpoint
}

output "cosmos_database_name" {
  description = "Name of the Cosmos DB database"
  value       = azurerm_cosmosdb_sql_database.main.name
}

output "cosmos_container_name" {
  description = "Name of the Cosmos DB container"
  value       = azurerm_cosmosdb_sql_container.bookmarks.name
}

output "cosmos_primary_key" {
  description = "Primary key for the Cosmos DB account"
  value       = azurerm_cosmosdb_account.main.primary_key
  sensitive   = true
}

output "cosmos_primary_sql_connection_string" {
  description = "Primary SQL connection string for the Cosmos DB account"
  value       = azurerm_cosmosdb_account.main.primary_sql_connection_string
  sensitive   = true
}

# Key Vault
output "key_vault_name" {
  description = "Name of the Key Vault"
  value       = azurerm_key_vault.main.name
}

output "key_vault_id" {
  description = "ID of the Key Vault"
  value       = azurerm_key_vault.main.id
}

output "key_vault_uri" {
  description = "URI of the Key Vault"
  value       = azurerm_key_vault.main.vault_uri
}

# Application Insights
output "application_insights_name" {
  description = "Name of the Application Insights instance"
  value       = azurerm_application_insights.main.name
}

output "application_insights_id" {
  description = "ID of the Application Insights instance"
  value       = azurerm_application_insights.main.id
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

output "application_insights_app_id" {
  description = "App ID for Application Insights"
  value       = azurerm_application_insights.main.app_id
}

# Log Analytics Workspace
output "log_analytics_workspace_name" {
  description = "Name of the Log Analytics Workspace"
  value       = azurerm_log_analytics_workspace.main.name
}

output "log_analytics_workspace_id" {
  description = "ID of the Log Analytics Workspace"
  value       = azurerm_log_analytics_workspace.main.id
}

output "log_analytics_workspace_workspace_id" {
  description = "Workspace ID of the Log Analytics Workspace"
  value       = azurerm_log_analytics_workspace.main.workspace_id
}

# Environment Information
output "environment" {
  description = "Environment name"
  value       = var.environment
}

output "project" {
  description = "Project name"
  value       = var.project
}

output "location" {
  description = "Azure region"
  value       = var.location
}

# Resource Summary
output "resource_summary" {
  description = "Summary of created resources"
  value = {
    resource_group = {
      name     = azurerm_resource_group.main.name
      location = azurerm_resource_group.main.location
    }
    frontend_app = {
      name     = azurerm_linux_web_app.frontend.name
      url      = "https://${azurerm_linux_web_app.frontend.default_hostname}"
      identity = azurerm_linux_web_app.frontend.identity[0].principal_id
    }
    backend_app = {
      name     = azurerm_linux_web_app.backend.name
      url      = "https://${azurerm_linux_web_app.backend.default_hostname}"
      identity = azurerm_linux_web_app.backend.identity[0].principal_id
    }
    container_registry = {
      name         = azurerm_container_registry.main.name
      login_server = azurerm_container_registry.main.login_server
    }
    cosmos_db = {
      account_name   = azurerm_cosmosdb_account.main.name
      database_name  = azurerm_cosmosdb_sql_database.main.name
      container_name = azurerm_cosmosdb_sql_container.bookmarks.name
      endpoint       = azurerm_cosmosdb_account.main.endpoint
    }
    key_vault = {
      name = azurerm_key_vault.main.name
      uri  = azurerm_key_vault.main.vault_uri
    }
    application_insights = {
      name   = azurerm_application_insights.main.name
      app_id = azurerm_application_insights.main.app_id
    }
  }
}

# Deployment Information
output "deployment_info" {
  description = "Information for deployment automation"
  value = {
    container_registry = {
      login_server = azurerm_container_registry.main.login_server
      name         = azurerm_container_registry.main.name
    }
    frontend_app = {
      name           = azurerm_linux_web_app.frontend.name
      resource_group = azurerm_resource_group.main.name
    }
    backend_app = {
      name           = azurerm_linux_web_app.backend.name
      resource_group = azurerm_resource_group.main.name
    }
    key_vault = {
      name = azurerm_key_vault.main.name
      uri  = azurerm_key_vault.main.vault_uri
    }
  }
}
