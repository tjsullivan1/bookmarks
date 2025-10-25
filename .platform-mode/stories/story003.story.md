# Story 003: Azure Web Apps for Frontend and Backend Container Deployment

## User Story
**As a** Developer
**I want** dedicated Web Apps for frontend and backend containers with proper configuration
**So that** I can deploy applications independently with proper isolation and managed identity security

## Details
- **Epic**: [Epic 001: Infrastructure as Code Automation Platform](../epics/epic001.epic.md)
- **Priority**: High
- **Story Points**: 8 (to be validated during planning)
- **Sprint**: Sprint 1
- **Theme**: Core Azure Resource Provisioning

## Acceptance Criteria

### AC1: Frontend Web App Configuration
**Given** I need to deploy a React frontend application
**When** the Terraform module provisions the frontend Web App
**Then** the Web App is configured with:
- Name following pattern: `{environment}-bookmarks-frontend-app`
- Linux OS for container support
- Continuous deployment disabled (will be managed by CI/CD)
- Health check path configured to `/`
- System-assigned managed identity enabled

### AC2: Backend Web App Configuration
**Given** I need to deploy a FastAPI backend application
**When** the Terraform module provisions the backend Web App
**Then** the Web App is configured with:
- Name following pattern: `{environment}-bookmarks-backend-app`
- Linux OS for container support
- Continuous deployment disabled (will be managed by CI/CD)
- Health check path configured to `/health`
- System-assigned managed identity enabled

### AC3: Container Deployment Settings
**Given** both Web Apps will run containerized applications
**When** the Web Apps are provisioned
**Then** both apps are configured for:
- Docker container deployment
- Container registry authentication via managed identity
- Always-on enabled for production environments
- HTTP2 enabled for performance
- Minimum TLS version 1.2 enforced

### AC4: Managed Identity Integration
**Given** applications need secure access to Azure services
**When** Web Apps are created with managed identities
**Then** each Web App has:
- System-assigned managed identity enabled
- Identity principal ID available as Terraform output
- Identity configured for Azure service authentication
- No service principal credentials stored in application settings

### AC5: Environment-Specific Configuration
**Given** different environments have different requirements
**When** Web Apps are provisioned
**Then** configuration varies by environment:
- Development: Basic monitoring, HTTP allowed
- Staging: Enhanced monitoring, HTTPS preferred
- Production: Full monitoring, HTTPS only, always-on enabled

## Non-Functional Requirements
- **Performance**: Web App provisioning completes within 5 minutes per app
- **Security**: All Web Apps use managed identities and enforce minimum TLS 1.2
- **Reliability**: Web Apps include health check configuration for monitoring
- **Scalability**: Web Apps configured to support horizontal scaling when needed

## Technical Notes
- **Implementation Approach**: Use azurerm_linux_web_app resource for container support
- **Container Configuration**: Configure for Docker deployment without specific image (handled by CI/CD)
- **Health Checks**: Implement appropriate health check paths for each application type
- **Security**: Enable managed identities and enforce HTTPS for production

## Test Scenarios

### Happy Path
1. **Frontend Deployment**: Frontend Web App provisions successfully with correct configuration
2. **Backend Deployment**: Backend Web App provisions successfully with health check endpoint
3. **Managed Identity**: System-assigned identities created and accessible via outputs

### Edge Cases
1. **Name Conflicts**: Handles Web App name conflicts gracefully with unique suffixes
2. **Resource Constraints**: Handles App Service Plan capacity limitations appropriately
3. **Regional Availability**: Manages Web App availability across different Azure regions

### Error Conditions
1. **Invalid Configuration**: Clear validation errors for invalid Web App settings
2. **App Service Plan Missing**: Explicit dependency error if App Service Plan not available
3. **Managed Identity Issues**: Clear error handling for managed identity configuration failures

## Dependencies
- **Prerequisites**:
  - Story 002 (Resource Group and App Service Plan) completed
  - App Service Plan provisioned and available
- **Technical**:
  - Azure Web App service available in target region
  - Managed identity services enabled
- **External**:
  - Container registry will be configured in subsequent story

## Definition of Done
- [ ] Frontend Web App resource implemented in Terraform
- [ ] Backend Web App resource implemented in Terraform
- [ ] Container deployment settings configured for both apps
- [ ] System-assigned managed identities enabled
- [ ] Health check paths configured appropriately
- [ ] Environment-specific settings implemented
- [ ] Code reviewed and approved
- [ ] Terraform plan shows expected Web App creation
- [ ] Terraform apply succeeds creating both Web Apps
- [ ] Managed identity outputs available for other resources
- [ ] Web Apps accessible and responding to health checks

## Technical Implementation Details

### Frontend Web App Configuration
```hcl
resource "azurerm_linux_web_app" "frontend" {
  name                = local.frontend_app_name
  resource_group_name = azurerm_resource_group.main.name
  location           = azurerm_resource_group.main.location
  service_plan_id    = azurerm_service_plan.main.id

  site_config {
    always_on                         = var.environment == "prod"
    health_check_path                = "/"
    health_check_grace_period_minutes = 5
    http2_enabled                    = true
    minimum_tls_version              = "1.2"

    application_stack {
      docker_image     = "nginx"
      docker_image_tag = "alpine"
    }
  }

  identity {
    type = "SystemAssigned"
  }

  tags = local.common_tags
}
```

### Backend Web App Configuration
```hcl
resource "azurerm_linux_web_app" "backend" {
  name                = local.backend_app_name
  resource_group_name = azurerm_resource_group.main.name
  location           = azurerm_resource_group.main.location
  service_plan_id    = azurerm_service_plan.main.id

  site_config {
    always_on                         = var.environment == "prod"
    health_check_path                = "/health"
    health_check_grace_period_minutes = 5
    http2_enabled                    = true
    minimum_tls_version              = "1.2"

    application_stack {
      docker_image     = "python"
      docker_image_tag = "3.11-slim"
    }
  }

  identity {
    type = "SystemAssigned"
  }

  tags = local.common_tags
}
```

### Required Outputs
```hcl
output "frontend_app_name" {
  description = "Name of the frontend Web App"
  value       = azurerm_linux_web_app.frontend.name
}

output "backend_app_name" {
  description = "Name of the backend Web App"
  value       = azurerm_linux_web_app.backend.name
}

output "frontend_identity_principal_id" {
  description = "Principal ID of frontend Web App managed identity"
  value       = azurerm_linux_web_app.frontend.identity[0].principal_id
}

output "backend_identity_principal_id" {
  description = "Principal ID of backend Web App managed identity"
  value       = azurerm_linux_web_app.backend.identity[0].principal_id
}
```

## Related Stories
- **Previous**: Story 002 (Resource Group and App Service Plan)
- **Next**: Story 004 (Azure Container Registry Integration)
- **Dependencies**: Managed identity outputs needed for container registry access
