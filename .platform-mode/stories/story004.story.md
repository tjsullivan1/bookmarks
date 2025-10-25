# Story 004: Azure Container Registry Integration

## User Story
**As a** DevOps Engineer
**I want** a private container registry with managed identity access and proper configuration
**So that** I can securely store and deploy container images with automated authentication

## Details
- **Epic**: [Epic 001: Infrastructure as Code Automation Platform](../epics/epic001.epic.md)
- **Priority**: High
- **Story Points**: 5 (to be validated during planning)
- **Sprint**: Sprint 1
- **Theme**: Container and Registry Infrastructure

## Acceptance Criteria

### AC1: Azure Container Registry Provisioning
**Given** I need a private container registry for the bookmarks platform
**When** I apply the Terraform module
**Then** an Azure Container Registry is created with:
- Name following pattern: `{environment}bookmarksacr` (no hyphens, globally unique)
- Basic SKU for cost optimization (can be upgraded later)
- Location matching the resource group
- Admin user enabled for CI/CD integration
- Standard tags applied for governance

### AC2: Registry Access Configuration
**Given** Web Apps need to pull container images from the registry
**When** the Container Registry is provisioned
**Then** access is configured with:
- Admin credentials enabled for initial setup
- Public network access enabled (can be restricted later)
- Content trust disabled initially (can be enabled for production)
- Quarantine policy disabled for development environments

### AC3: Managed Identity RBAC Integration
**Given** Web Apps should authenticate using managed identities
**When** the registry and Web Apps are provisioned
**Then** RBAC assignments are created:
- Frontend Web App managed identity has AcrPull role on registry
- Backend Web App managed identity has AcrPull role on registry
- Platform engineering team has AcrPush and AcrPull roles
- Role assignments reference managed identity principal IDs

### AC4: Registry Configuration Outputs
**Given** CI/CD pipelines need registry connection information
**When** the registry is provisioned
**Then** Terraform outputs include:
- Container registry login server URL
- Registry name for CI/CD pipeline configuration
- Admin username and password (sensitive)
- Registry resource ID for additional RBAC if needed

### AC5: Network and Security Configuration
**Given** the registry contains sensitive container images
**When** the registry is configured
**Then** security settings include:
- Network rule set configured for future restriction
- Retention policy enabled for image lifecycle management
- Trust policy configuration available for production
- Registry scanning enabled for vulnerability detection

## Non-Functional Requirements
- **Performance**: Registry responds to image pulls within 30 seconds
- **Security**: Access controlled via RBAC with managed identities preferred over credentials
- **Reliability**: Registry available with 99.9% uptime SLA
- **Cost**: Basic SKU provides adequate performance while minimizing costs

## Technical Notes
- **Implementation Approach**: Use azurerm_container_registry resource with Basic SKU
- **Naming**: Registry names must be globally unique and contain only alphanumeric characters
- **Authentication**: Configure both admin credentials and managed identity access
- **RBAC**: Use azurerm_role_assignment resources for managed identity permissions

## Test Scenarios

### Happy Path
1. **Registry Creation**: Container registry provisions successfully with correct configuration
2. **Access Configuration**: Web App managed identities can authenticate to registry
3. **Image Operations**: Can push and pull container images using admin credentials

### Edge Cases
1. **Name Conflicts**: Handles registry name conflicts with random suffix generation
2. **RBAC Delays**: Handles eventual consistency issues with role assignment propagation
3. **SKU Limitations**: Basic SKU limitations understood and documented

### Error Conditions
1. **Name Already Taken**: Clear error message when registry name unavailable globally
2. **RBAC Failures**: Proper error handling when role assignments fail
3. **Permission Issues**: Clear guidance when insufficient permissions for registry creation

## Dependencies
- **Prerequisites**:
  - Story 003 (Web Apps) completed for managed identity principal IDs
  - Azure subscription with permissions for Container Registry creation
- **Technical**:
  - Web App managed identities available for RBAC assignment
  - Unique naming strategy for globally unique registry names
- **External**:
  - Azure Container Registry service available in target region

## Definition of Done
- [ ] Azure Container Registry resource implemented in Terraform
- [ ] Basic SKU configured with appropriate settings
- [ ] Admin credentials enabled for CI/CD integration
- [ ] RBAC assignments created for Web App managed identities
- [ ] Required outputs defined for CI/CD pipeline usage
- [ ] Code reviewed and approved
- [ ] Terraform plan shows expected registry and role assignments
- [ ] Terraform apply succeeds creating registry
- [ ] Managed identities can authenticate to registry
- [ ] Admin credentials available for CI/CD pipeline configuration

## Technical Implementation Details

### Container Registry Configuration
```hcl
resource "azurerm_container_registry" "main" {
  name                = local.container_registry_name
  resource_group_name = azurerm_resource_group.main.name
  location           = azurerm_resource_group.main.location
  sku                = "Basic"
  admin_enabled      = true

  public_network_access_enabled = true
  quarantine_policy_enabled     = false
  trust_policy {
    enabled = false
  }

  retention_policy {
    enabled = true
    days    = 30
  }

  tags = local.common_tags
}
```

### RBAC Role Assignments
```hcl
resource "azurerm_role_assignment" "frontend_acr_pull" {
  scope                = azurerm_container_registry.main.id
  role_definition_name = "AcrPull"
  principal_id         = azurerm_linux_web_app.frontend.identity[0].principal_id
}

resource "azurerm_role_assignment" "backend_acr_pull" {
  scope                = azurerm_container_registry.main.id
  role_definition_name = "AcrPull"
  principal_id         = azurerm_linux_web_app.backend.identity[0].principal_id
}
```

### Required Outputs
```hcl
output "container_registry_login_server" {
  description = "Login server URL for the container registry"
  value       = azurerm_container_registry.main.login_server
}

output "container_registry_name" {
  description = "Name of the container registry"
  value       = azurerm_container_registry.main.name
}

output "container_registry_admin_username" {
  description = "Admin username for container registry"
  value       = azurerm_container_registry.main.admin_username
  sensitive   = true
}

output "container_registry_admin_password" {
  description = "Admin password for container registry"
  value       = azurerm_container_registry.main.admin_password
  sensitive   = true
}
```

### Variables Required
- `container_registry_sku` (string): SKU for container registry (default: "Basic")
- `enable_admin_user` (bool): Enable admin user for CI/CD (default: true)

## Related Stories
- **Previous**: Story 003 (Azure Web Apps for Frontend and Backend)
- **Next**: Story 005 (Cosmos DB Foundation Setup)
- **Dependencies**: Web App managed identity principal IDs required for RBAC
