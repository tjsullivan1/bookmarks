# Story 002: Azure Resource Group and App Service Plan Provisioning

## User Story
**As a** Platform Engineer
**I want** automated provisioning of core Azure resources with consistent naming and configuration
**So that** I can create reliable hosting environments that support different workload requirements

## Details
- **Epic**: [Epic 001: Infrastructure as Code Automation Platform](../epics/epic001.epic.md)
- **Priority**: High
- **Story Points**: 8 (to be validated during planning)
- **Sprint**: Sprint 1
- **Theme**: Core Azure Resource Provisioning

## Acceptance Criteria

### AC1: Resource Group Creation with Standard Configuration
**Given** I am provisioning infrastructure for a bookmarks environment
**When** I apply the Terraform module
**Then** a Resource Group is created with:
- Name following pattern: `{environment}-bookmarks-rg`
- Location specified via variable (default: East US)
- Standard tags: Environment, Project, Owner, CostCenter, CreatedBy
- Proper resource group-level RBAC if specified

### AC2: App Service Plan with Environment-Specific SKU
**Given** I need to provision compute resources for web applications
**When** the Resource Group is created
**Then** an App Service Plan is provisioned with:
- Name following pattern: `{environment}-bookmarks-asp`
- SKU based on environment: B1 for dev/staging, S1 for production
- Linux operating system for container support
- Zone redundancy enabled for production environments
- Resource tags inherited from resource group

### AC3: Standard Tagging Implementation
**Given** I need to track resources for cost management and governance
**When** resources are provisioned
**Then** all resources include standard tags:
- `Environment`: dev/staging/prod
- `Project`: bookmarks
- `Owner`: Platform Engineering
- `CostCenter`: Engineering
- `CreatedBy`: terraform
- `CreatedDate`: ISO 8601 timestamp

### AC4: Terraform State Backend Configuration
**Given** I need reliable state management for team collaboration
**When** I initialize the Terraform module
**Then** the backend is configured to use:
- Azure Storage Account for remote state
- State locking enabled with Azure Blob storage
- Encryption at rest enabled
- Access controlled via Azure RBAC

### AC5: Resource Dependency Management
**Given** resources have dependencies on each other
**When** Terraform applies the configuration
**Then** resources are created in the correct order:
- Resource Group created first
- App Service Plan depends on Resource Group
- All subsequent resources reference these foundational resources
- Dependency graph is explicit and clear

## Non-Functional Requirements
- **Performance**: Resource provisioning completes within 10 minutes
- **Security**: All resources follow enterprise security baselines
- **Reliability**: Resources can be destroyed and recreated without state corruption
- **Cost Optimization**: SKU selection optimized for environment workload requirements

## Technical Notes
- **Implementation Approach**: Use azurerm provider for all Azure resource management
- **Resource Naming**: Implement locals for consistent naming across all resources
- **Environment Configuration**: Use conditional logic for environment-specific settings
- **State Management**: Configure remote backend with proper access controls

## Test Scenarios

### Happy Path
1. **Development Environment**: Successfully provisions B1 App Service Plan in development resource group
2. **Production Environment**: Successfully provisions S1 App Service Plan with zone redundancy
3. **Resource Recreation**: Can destroy and recreate resources without errors

### Edge Cases
1. **Resource Group Already Exists**: Handles existing resource group gracefully (import scenario)
2. **SKU Not Available**: Provides clear error if requested SKU unavailable in region
3. **Tag Limit Reached**: Handles Azure tag limits appropriately

### Error Conditions
1. **Insufficient Permissions**: Clear error message when Azure permissions insufficient
2. **Invalid SKU**: Validation fails for invalid App Service Plan SKU
3. **Region Unavailability**: Graceful handling when services unavailable in target region

## Dependencies
- **Prerequisites**:
  - Story 001 (Terraform Module Structure) completed
  - Azure subscription with Contributor access
  - Terraform backend storage account configured
- **Technical**:
  - Azure Resource Manager provider configured
  - Enterprise tagging standards defined
- **External**:
  - Azure region availability confirmed
  - Cost management approval for resource SKUs

## Definition of Done
- [ ] Resource Group provisioning implemented in Terraform
- [ ] App Service Plan provisioning with environment-specific SKU
- [ ] Standard tagging applied to all resources
- [ ] Terraform backend configured for state management
- [ ] Resource dependencies explicitly defined
- [ ] Code reviewed and approved
- [ ] Terraform plan shows expected resource creation
- [ ] Terraform apply succeeds in development environment
- [ ] Resources can be destroyed and recreated cleanly
- [ ] Documentation updated with resource specifications

## Technical Implementation Details

### Resource Group Configuration
```hcl
resource "azurerm_resource_group" "main" {
  name     = local.resource_group_name
  location = var.location
  tags     = local.common_tags
}
```

### App Service Plan Configuration
```hcl
resource "azurerm_service_plan" "main" {
  name                = local.app_service_plan_name
  resource_group_name = azurerm_resource_group.main.name
  location           = azurerm_resource_group.main.location
  os_type            = "Linux"
  sku_name           = local.app_service_plan_sku

  tags = local.common_tags
}
```

### Variables Required
- `environment` (string): Environment name (dev/staging/prod)
- `location` (string): Azure region for resource deployment
- `project_name` (string): Project identifier for naming
- `cost_center` (string): Cost center for billing allocation

## Related Stories
- **Previous**: Story 001 (Terraform Module Structure Setup)
- **Next**: Story 003 (Azure Web Apps for Frontend and Backend)
- **Dependencies**: Foundational for all subsequent Azure resource stories
