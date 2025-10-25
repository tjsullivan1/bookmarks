# RBAC Role Assignments
# Configure role-based access control for managed identities and service principals

# Current user Key Vault Administrator role (for secret management during deployment)
resource "azurerm_role_assignment" "current_user_kv_admin" {
  scope                = azurerm_key_vault.main.id
  role_definition_name = "Key Vault Administrator"
  principal_id         = data.azurerm_client_config.current.object_id
}

# Frontend App - Container Registry Pull
resource "azurerm_role_assignment" "frontend_acr_pull" {
  scope                = azurerm_container_registry.main.id
  role_definition_name = "AcrPull"
  principal_id         = azurerm_linux_web_app.frontend.identity[0].principal_id
}

# Backend App - Container Registry Pull
resource "azurerm_role_assignment" "backend_acr_pull" {
  scope                = azurerm_container_registry.main.id
  role_definition_name = "AcrPull"
  principal_id         = azurerm_linux_web_app.backend.identity[0].principal_id
}

# Frontend App - Key Vault Secrets User
resource "azurerm_role_assignment" "frontend_kv_secrets" {
  scope                = azurerm_key_vault.main.id
  role_definition_name = "Key Vault Secrets User"
  principal_id         = azurerm_linux_web_app.frontend.identity[0].principal_id

  depends_on = [
    azurerm_role_assignment.current_user_kv_admin
  ]
}

# Backend App - Key Vault Secrets User
resource "azurerm_role_assignment" "backend_kv_secrets" {
  scope                = azurerm_key_vault.main.id
  role_definition_name = "Key Vault Secrets User"
  principal_id         = azurerm_linux_web_app.backend.identity[0].principal_id

  depends_on = [
    azurerm_role_assignment.current_user_kv_admin
  ]
}

# Frontend App - Cosmos DB Built-in Data Reader (Data Plane)
# Using the built-in role definition ID from Microsoft documentation
# https://docs.microsoft.com/azure/cosmos-db/nosql/reference-data-plane-security
resource "azurerm_cosmosdb_sql_role_assignment" "frontend_cosmos_reader" {
  resource_group_name = azurerm_resource_group.main.name
  account_name        = azurerm_cosmosdb_account.main.name
  role_definition_id  = "${azurerm_cosmosdb_account.main.id}/sqlRoleDefinitions/00000000-0000-0000-0000-000000000001"
  principal_id        = azurerm_linux_web_app.frontend.identity[0].principal_id
  scope               = azurerm_cosmosdb_account.main.id
}

# Backend App - Cosmos DB Built-in Data Contributor (Data Plane)
# Using the built-in role definition ID from Microsoft documentation
# https://docs.microsoft.com/azure/cosmos-db/nosql/reference-data-plane-security
resource "azurerm_cosmosdb_sql_role_assignment" "backend_cosmos_contributor" {
  resource_group_name = azurerm_resource_group.main.name
  account_name        = azurerm_cosmosdb_account.main.name
  role_definition_id  = "${azurerm_cosmosdb_account.main.id}/sqlRoleDefinitions/00000000-0000-0000-0000-000000000002"
  principal_id        = azurerm_linux_web_app.backend.identity[0].principal_id
  scope               = azurerm_cosmosdb_account.main.id
}

# Frontend App - Monitoring Metrics Publisher
resource "azurerm_role_assignment" "frontend_monitoring" {
  scope                = azurerm_application_insights.main.id
  role_definition_name = "Monitoring Metrics Publisher"
  principal_id         = azurerm_linux_web_app.frontend.identity[0].principal_id
}

# Backend App - Monitoring Metrics Publisher
resource "azurerm_role_assignment" "backend_monitoring" {
  scope                = azurerm_application_insights.main.id
  role_definition_name = "Monitoring Metrics Publisher"
  principal_id         = azurerm_linux_web_app.backend.identity[0].principal_id
}
