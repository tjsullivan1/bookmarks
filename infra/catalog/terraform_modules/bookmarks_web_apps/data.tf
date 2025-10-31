# Data Sources
# Query existing Azure resources and configuration

# Current Azure client configuration
data "azurerm_client_config" "current" {}

# Current Azure subscription
# tflint-ignore: terraform_unused_declarations
data "azurerm_subscription" "current" {}

# Existing resource group (if creating resources in existing RG)
# data "azurerm_resource_group" "existing" {
#   count = var.use_existing_resource_group ? 1 : 0
#   name  = var.existing_resource_group_name
# }

# Available Azure locations for validation
# data "azurerm_locations" "available" {
#   location = var.location
# }

# Container registry admin credentials (only if needed for legacy access)
# data "azurerm_container_registry" "acr_credentials" {
#   depends_on          = [azurerm_container_registry.acr]
#   name                = azurerm_container_registry.acr.name
#   resource_group_name = azurerm_resource_group.main.name
# }
