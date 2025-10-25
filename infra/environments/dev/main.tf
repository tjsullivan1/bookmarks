# Development Environment Configuration
# Test deployment of the bookmarks platform infrastructure

terraform {
  required_version = ">= 1.5.0"

  # Backend configuration for remote state
  backend "azurerm" {
    resource_group_name  = "rg-tjs-tpxs"
    storage_account_name = "satjstpxs"
    container_name       = "tfstate"
    key                  = "bookmarks/dev/terraform.tfstate"
  }
}

# Configure the bookmarks platform module
module "bookmarks_platform" {
  source = "../../catalog/terraform_modules/bookmarks_web_apps"

  environment = "dev"
  project     = "bookmarks"
  location    = "Canada Central"

  # Development-optimized configuration
  app_service_plan_sku = {
    name     = "S1"
    capacity = 1
  }

  container_registry_sku = "Basic"

  cosmos_db_consistency_level = "Session"

  application_insights_retention_in_days = 30

  # Disable expensive features for development
  enable_backup             = false
  enable_security_hardening = false

  tags = {
    Environment = "development"
    Team        = "platform-engineering"
    Project     = "bookmarks"
    Purpose     = "sprint-001-testing"
    CreatedBy   = "terraform"
  }
}

# Outputs for integration
output "resource_summary" {
  description = "Summary of created resources"
  value       = module.bookmarks_platform.resource_summary
}

output "deployment_info" {
  description = "Information for deployment automation"
  value       = module.bookmarks_platform.deployment_info
}

output "frontend_url" {
  description = "Frontend application URL"
  value       = module.bookmarks_platform.frontend_app_url
}

output "backend_url" {
  description = "Backend application URL"
  value       = module.bookmarks_platform.backend_app_url
}
