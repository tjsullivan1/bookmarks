# Local Values
# Computed values and naming conventions for consistent resource naming

locals {
  # Common naming convention: {environment}-{project}-{resource_type}
  name_prefix = "${var.environment}-${var.project}"

  # Resource naming
  resource_group_name          = "rg-${local.name_prefix}"
  app_service_plan_name        = "asp-${local.name_prefix}"
  frontend_app_name            = "wa-fe-${local.name_prefix}"
  backend_app_name             = "wa-be-${local.name_prefix}"
  cosmos_database_name         = "bookmarks_db"
  cosmos_container_name        = "bookmarks"
  application_insights_name    = "ai-${local.name_prefix}"
  log_analytics_workspace_name = "law-${local.name_prefix}"

  # Generate random suffix for globally unique resources
  random_suffix = random_string.unique_suffix.result

  # Update globally unique resource names with suffix
  container_registry_name_unique = "acr${var.environment}${var.project}${local.random_suffix}"
  cosmos_account_name_unique     = "cdb-${local.name_prefix}-${local.random_suffix}"
  key_vault_name_unique          = "kv-${local.name_prefix}-${local.random_suffix}"

  # Common tags
  common_tags = merge(var.tags, {
    Environment = var.environment
    Project     = var.project
    Location    = var.location
    CreatedDate = formatdate("YYYY-MM-DD", timestamp())
    ModuleName  = "bookmarks_web_apps"
  })

  # App Service configuration
  app_service_config = {
    linux_fx_version                        = "DOCKER|nginx:latest" # Will be updated during deployment
    always_on                               = var.environment == "prod" ? true : false
    http2_enabled                           = true
    minimum_tls_version                     = "1.2"
    scm_minimum_tls_version                 = "1.2"
    ftps_state                              = "Disabled"
    container_registry_use_managed_identity = true

    # Health check configuration
    health_check_grace_period_in_seconds = 300
  }

  # Cosmos DB configuration
  cosmos_db_config = {
    offer_type        = "Standard"
    kind              = "GlobalDocumentDB"
    enable_serverless = var.environment == "dev" ? true : false

    consistency_policy = {
      consistency_level       = var.cosmos_db_consistency_level
      max_interval_in_seconds = var.cosmos_db_max_interval_in_seconds
      max_staleness_prefix    = var.cosmos_db_max_staleness_prefix
    }

    geo_location = {
      location          = var.location
      failover_priority = 0
      zone_redundant    = false
    }

    backup = var.enable_backup ? {
      type                = "Periodic"
      interval_in_minutes = 240
      retention_in_hours  = 168 # 7 days
      storage_redundancy  = "Local"
    } : null
  }

  # Key Vault configuration
  key_vault_config = {
    sku_name                        = "standard"
    tenant_id                       = data.azurerm_client_config.current.tenant_id
    soft_delete_retention_days      = var.key_vault_soft_delete_retention_days
    purge_protection_enabled        = var.environment == "prod" ? true : false
    enable_rbac_authorization       = true
    enabled_for_deployment          = false
    enabled_for_disk_encryption     = false
    enabled_for_template_deployment = false

    network_acls = var.enable_security_hardening ? {
      default_action = "Deny"
      bypass         = "AzureServices"
      ip_rules       = []
    } : null
  }

  # Application Insights configuration
  application_insights_config = {
    application_type                    = "web"
    retention_in_days                   = var.application_insights_retention_in_days
    sampling_percentage                 = var.environment == "prod" ? 100 : 50
    disable_ip_masking                  = false
    local_authentication_disabled       = false
    internet_ingestion_enabled          = true
    internet_query_enabled              = true
    force_customer_storage_for_profiler = false
  }

  # Security configuration
  # tflint-ignore: terraform_unused_declarations
  security_config = {
    # Managed Identity configuration
    enable_system_assigned_identity = true

    # RBAC role assignments
    rbac_assignments = {
      cosmos_contributor = "Cosmos DB Contributor"
      acr_pull           = "AcrPull"
      key_vault_secrets  = "Key Vault Secrets User"
      monitoring         = "Monitoring Metrics Publisher"
    }
  }

  # Validation checks
  # tflint-ignore: terraform_unused_declarations
  validate_names = {
    # Ensure resource names meet Azure naming requirements
    rg_name_valid     = can(regex("^[a-zA-Z0-9._()-]{1,90}$", local.resource_group_name))
    acr_name_valid    = can(regex("^[a-zA-Z0-9]{5,50}$", local.container_registry_name_unique))
    kv_name_valid     = can(regex("^[a-zA-Z0-9-]{3,24}$", local.key_vault_name_unique))
    cosmos_name_valid = can(regex("^[a-zA-Z0-9-]{3,50}$", local.cosmos_account_name_unique))
  }
}
