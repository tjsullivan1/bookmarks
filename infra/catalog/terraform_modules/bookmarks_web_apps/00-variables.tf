# Input Variables
# Define all input variables for the bookmarks web apps module with comprehensive validation

variable "environment" {
  description = "Environment name (dev, staging, prod)"
  type        = string
  validation {
    condition     = contains(["dev", "staging", "prod"], var.environment)
    error_message = "Environment must be one of: dev, staging, prod."
  }
}

variable "project" {
  description = "Project name for resource naming"
  type        = string
  default     = "bookmarks"
  validation {
    condition     = can(regex("^[a-z0-9-]{1,20}$", var.project))
    error_message = "Project name must be 1-20 characters, lowercase letters, numbers, and hyphens only."
  }
}

variable "location" {
  description = "Azure region for resource deployment"
  type        = string
  default     = "East US"
  validation {
    condition = contains([
      "East US", "East US 2", "West US", "West US 2", "West US 3",
      "Central US", "North Central US", "South Central US", "West Central US",
      "Canada Central", "Canada East",
      "North Europe", "West Europe", "UK South", "UK West",
      "France Central", "Germany West Central", "Switzerland North",
      "Southeast Asia", "East Asia", "Australia East", "Australia Southeast",
      "Japan East", "Japan West", "Korea Central", "Korea South",
      "India Central", "India South", "India West"
    ], var.location)
    error_message = "Location must be a valid Azure region."
  }
}

variable "app_service_plan_sku" {
  description = "SKU for the App Service Plan"
  type = object({
    name     = string
    capacity = optional(number, 1)
  })
  default = {
    name     = "B1"
    capacity = 1
  }
  validation {
    condition = contains([
      "F1", "D1",             # Free and Shared tiers
      "B1", "B2", "B3",       # Basic tiers
      "S1", "S2", "S3",       # Standard tiers
      "P1", "P2", "P3",       # Premium tiers
      "P1v2", "P2v2", "P3v2", # Premium v2 tiers
      "P1v3", "P2v3", "P3v3"  # Premium v3 tiers
    ], var.app_service_plan_sku.name)
    error_message = "App Service Plan SKU must be a valid Azure App Service Plan SKU."
  }
}

variable "container_registry_sku" {
  description = "SKU for the Azure Container Registry"
  type        = string
  default     = "Basic"
  validation {
    condition     = contains(["Basic", "Standard", "Premium"], var.container_registry_sku)
    error_message = "Container Registry SKU must be Basic, Standard, or Premium."
  }
}

variable "cosmos_db_consistency_level" {
  description = "Cosmos DB consistency level"
  type        = string
  default     = "Session"
  validation {
    condition = contains([
      "BoundedStaleness", "Eventual", "Session", "Strong", "ConsistentPrefix"
    ], var.cosmos_db_consistency_level)
    error_message = "Cosmos DB consistency level must be a valid option."
  }
}

variable "cosmos_db_max_interval_in_seconds" {
  description = "Maximum lag time in seconds for BoundedStaleness consistency"
  type        = number
  default     = 300
  validation {
    condition     = var.cosmos_db_max_interval_in_seconds >= 5 && var.cosmos_db_max_interval_in_seconds <= 86400
    error_message = "Max interval must be between 5 and 86400 seconds."
  }
}

variable "cosmos_db_max_staleness_prefix" {
  description = "Maximum stale requests for BoundedStaleness consistency"
  type        = number
  default     = 100000
  validation {
    condition     = var.cosmos_db_max_staleness_prefix >= 10 && var.cosmos_db_max_staleness_prefix <= 2147483647
    error_message = "Max staleness prefix must be between 10 and 2147483647."
  }
}

variable "key_vault_soft_delete_retention_days" {
  description = "Number of days to retain soft-deleted keys"
  type        = number
  default     = 7
  validation {
    condition     = var.key_vault_soft_delete_retention_days >= 7 && var.key_vault_soft_delete_retention_days <= 90
    error_message = "Soft delete retention days must be between 7 and 90."
  }
}

variable "application_insights_retention_in_days" {
  description = "Application Insights data retention in days"
  type        = number
  default     = 30
  validation {
    condition     = contains([30, 60, 90, 120, 180, 270, 365, 550, 730], var.application_insights_retention_in_days)
    error_message = "Retention must be one of: 30, 60, 90, 120, 180, 270, 365, 550, 730 days."
  }
}

variable "tags" {
  description = "Tags to apply to all resources"
  type        = map(string)
  default = {
    ManagedBy = "Terraform"
    Project   = "Bookmarks"
  }
  validation {
    condition     = length(var.tags) <= 50
    error_message = "Maximum of 50 tags allowed per resource."
  }
}

variable "enable_backup" {
  description = "Enable automated backup for applicable resources"
  type        = bool
  default     = true
}

variable "enable_security_hardening" {
  description = "Enable additional security hardening features"
  type        = bool
  default     = true
}

variable "frontend_health_check_path" {
  description = "Health check path for frontend application"
  type        = string
  default     = "/"
  validation {
    condition     = can(regex("^/.*", var.frontend_health_check_path))
    error_message = "Health check path must start with '/'."
  }
}

variable "backend_health_check_path" {
  description = "Health check path for backend application"
  type        = string
  default     = "/health"
  validation {
    condition     = can(regex("^/.*", var.backend_health_check_path))
    error_message = "Health check path must start with '/'."
  }
}

variable "container_startup_time_limit" {
  description = "Container startup time limit in seconds"
  type        = number
  default     = 1800
  validation {
    condition     = var.container_startup_time_limit >= 60 && var.container_startup_time_limit <= 3600
    error_message = "Container startup time limit must be between 60 and 3600 seconds."
  }
}
