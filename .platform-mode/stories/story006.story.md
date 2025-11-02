# Story 006: Azure Key Vault and Secrets Management

## User Story
**As a** Security Engineer
**I want** centralized secrets management with managed identity access and proper security controls
**So that** applications can securely access configuration without hardcoded secrets and maintain audit compliance

## Details
- **Epic**: [Epic 001: Infrastructure as Code Automation Platform](../epics/epic001.epic.md)
- **Priority**: High
- **Story Points**: 6 (to be validated during planning)
- **Sprint**: Sprint 1
- **Theme**: Security and Secrets Management

## Acceptance Criteria

### AC1: Key Vault Provisioning and Configuration
**Given** I need centralized secrets management for the bookmarks platform
**When** I provision the Azure Key Vault
**Then** the Key Vault is configured with:
- Name following pattern: `{environment}-bookmarks-kv`
- Standard pricing tier for cost optimization
- Soft delete enabled with 7-day retention period
- Purge protection enabled for production environments
- Vault access via RBAC (disable legacy access policies)

### AC2: Managed Identity Access Policies
**Given** Web Apps need to access secrets via managed identities
**When** access policies are configured
**Then** RBAC assignments include:
- Frontend Web App managed identity: Key Vault Secrets User role
- Backend Web App managed identity: Key Vault Secrets User role
- Platform engineering team: Key Vault Administrator role
- Principle of least privilege applied to all assignments

### AC3: Initial Secrets Storage
**Given** applications need database and service connection information
**When** the Key Vault is provisioned
**Then** initial secrets are stored:
- `cosmos-db-connection-string`: Primary Cosmos DB connection string
- `cosmos-db-endpoint`: Cosmos DB endpoint URL
- `container-registry-server`: Container registry login server
- All secrets marked with appropriate content type and expiration policies

### AC4: Audit and Monitoring Configuration
**Given** secret access needs to be auditable for compliance
**When** the Key Vault is configured
**Then** monitoring includes:
- Diagnostic settings enabled for audit logging
- Key Vault access events logged to Azure Monitor
- Alert rules for unusual access patterns
- Retention period set to 365 days for compliance

### AC5: Network and Security Hardening
**Given** the Key Vault contains sensitive application secrets
**When** security settings are applied
**Then** access control includes:
- Public network access enabled initially (can be restricted later)
- Default action set to allow for initial setup
- Private endpoint configuration prepared for future implementation
- Certificate permissions disabled (not needed for this use case)

## Non-Functional Requirements
- **Security**: All secret access controlled via managed identities with RBAC
- **Performance**: Secret retrieval completes within 2 seconds
- **Compliance**: All access events logged and retained for audit requirements
- **Reliability**: Key Vault available with 99.9% uptime SLA

## Technical Notes
- **Implementation Approach**: Use azurerm_key_vault with RBAC authorization model
- **Secret Management**: Store connection strings and endpoints, avoid storing credentials
- **Access Control**: Use Azure RBAC instead of legacy access policies
- **Monitoring**: Integrate with Azure Monitor for comprehensive audit logging

## Test Scenarios

### Happy Path
1. **Vault Creation**: Key Vault provisions successfully with correct configuration
2. **Secret Storage**: Initial secrets stored successfully via Terraform
3. **Managed Identity Access**: Web App managed identities can retrieve secrets

### Edge Cases
1. **Name Conflicts**: Handles Key Vault name conflicts with unique suffixes
2. **RBAC Propagation**: Handles eventual consistency delays in role assignment
3. **Secret Limits**: Manages Key Vault secret storage limits appropriately

### Error Conditions
1. **Insufficient Permissions**: Clear error when inadequate permissions for Key Vault operations
2. **Invalid Secret Names**: Validation errors for non-compliant secret names
3. **RBAC Assignment Failures**: Proper error handling for failed role assignments

## Dependencies
- **Prerequisites**:
  - Story 003 (Web Apps) for managed identity principal IDs
  - Story 005 (Cosmos DB) for connection strings to store
  - Azure subscription with Key Vault permissions
- **Technical**:
  - Web App managed identities available for RBAC assignment
  - Cosmos DB connection strings available from previous story
- **External**:
  - Azure Key Vault service available in target region

## Definition of Done
- [ ] Azure Key Vault resource implemented in Terraform
- [ ] RBAC authorization model configured
- [ ] Managed identity access policies implemented via role assignments
- [ ] Initial secrets stored from Cosmos DB and Container Registry
- [ ] Audit logging and monitoring configured
- [ ] Soft delete and purge protection configured by environment
- [ ] Code reviewed and approved
- [ ] Terraform plan shows expected Key Vault and role assignments
- [ ] Terraform apply succeeds creating vault and storing secrets
- [ ] Managed identities can retrieve secrets successfully
- [ ] Audit logs capture secret access events

## Technical Implementation Details

### Key Vault Configuration
```hcl
resource "azurerm_key_vault" "main" {
  name                = local.key_vault_name
  location           = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  tenant_id          = data.azurerm_client_config.current.tenant_id
  sku_name           = "standard"

  enable_rbac_authorization = true
  soft_delete_retention_days = 7
  purge_protection_enabled   = var.environment == "prod"

  public_network_access_enabled = true

  network_acls {
    default_action = "Allow"
    bypass         = "AzureServices"
  }

  tags = local.common_tags
}
```

### RBAC Role Assignments
```hcl
resource "azurerm_role_assignment" "frontend_kv_secrets_user" {
  scope                = azurerm_key_vault.main.id
  role_definition_name = "Key Vault Secrets User"
  principal_id         = azurerm_linux_web_app.frontend.identity[0].principal_id
}

resource "azurerm_role_assignment" "backend_kv_secrets_user" {
  scope                = azurerm_key_vault.main.id
  role_definition_name = "Key Vault Secrets User"
  principal_id         = azurerm_linux_web_app.backend.identity[0].principal_id
}

resource "azurerm_role_assignment" "current_user_kv_admin" {
  scope                = azurerm_key_vault.main.id
  role_definition_name = "Key Vault Administrator"
  principal_id         = data.azurerm_client_config.current.object_id
}
```

### Initial Secrets Storage
```hcl
resource "azurerm_key_vault_secret" "cosmos_connection_string" {
  name         = "cosmos-db-connection-string"
  value        = azurerm_cosmosdb_account.main.connection_strings[0]
  key_vault_id = azurerm_key_vault.main.id
  content_type = "text/plain"

  depends_on = [azurerm_role_assignment.current_user_kv_admin]

  tags = {
    Environment = var.environment
    SecretType  = "ConnectionString"
  }
}

resource "azurerm_key_vault_secret" "cosmos_endpoint" {
  name         = "cosmos-db-endpoint"
  value        = azurerm_cosmosdb_account.main.endpoint
  key_vault_id = azurerm_key_vault.main.id
  content_type = "text/plain"

  depends_on = [azurerm_role_assignment.current_user_kv_admin]
}

resource "azurerm_key_vault_secret" "container_registry_server" {
  name         = "container-registry-server"
  value        = azurerm_container_registry.main.login_server
  key_vault_id = azurerm_key_vault.main.id
  content_type = "text/plain"

  depends_on = [azurerm_role_assignment.current_user_kv_admin]
}
```

### Monitoring Configuration
```hcl
resource "azurerm_monitor_diagnostic_setting" "key_vault" {
  name                       = "key-vault-diagnostics"
  target_resource_id         = azurerm_key_vault.main.id
  log_analytics_workspace_id = azurerm_log_analytics_workspace.main.id

  enabled_log {
    category = "AuditEvent"

    retention_policy {
      enabled = true
      days    = 365
    }
  }

  metric {
    category = "AllMetrics"
    enabled  = true

    retention_policy {
      enabled = true
      days    = 365
    }
  }
}
```

### Required Outputs
```hcl
output "key_vault_name" {
  description = "Name of the Key Vault"
  value       = azurerm_key_vault.main.name
}

output "key_vault_uri" {
  description = "URI of the Key Vault"
  value       = azurerm_key_vault.main.vault_uri
}
```

## Related Stories
- **Previous**: Story 005 (Cosmos DB Foundation Setup)
- **Next**: Story 007 (Basic Application Insights Setup)
- **Dependencies**: Cosmos DB connection strings and Container Registry details
