# Bookmarks Web Apps Terraform Module

This Terraform module creates a complete Azure infrastructure for the Bookmarks web application platform, including frontend and backend Web Apps, Container Registry, Cosmos DB, Key Vault, and Application Insights.

## Architecture

The module creates the following Azure resources:

```
┌─────────────────────────────────────────────────────────────────┐
│                        Resource Group                           │
│                                                                 │
│  ┌─────────────────┐    ┌─────────────────┐                    │
│  │  Frontend App   │    │  Backend App    │                    │
│  │  (React/Vite)   │    │  (FastAPI)      │                    │
│  │                 │    │                 │                    │
│  └─────────────────┘    └─────────────────┘                    │
│           │                       │                            │
│           └───────────┬───────────┘                            │
│                       │                                        │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              App Service Plan (Linux)                  │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────┐  ┌─────────────────┐  ┌───────────────┐   │
│  │ Container       │  │ Cosmos DB       │  │ Key Vault     │   │
│  │ Registry        │  │ (Serverless)    │  │               │   │
│  │                 │  │                 │  │               │   │
│  └─────────────────┘  └─────────────────┘  └───────────────┘   │
│                                                                 │
│  ┌─────────────────┐  ┌─────────────────────────────────────┐   │
│  │ Application     │  │     Log Analytics Workspace        │   │
│  │ Insights        │  │                                     │   │
│  │                 │  │                                     │   │
│  └─────────────────┘  └─────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

## Features

### 🔒 Security
- **Managed Identities**: All services use system-assigned managed identities
- **Key Vault Integration**: Secrets stored securely in Azure Key Vault
- **RBAC**: Role-based access control with least privilege principle
- **Network Security**: Configurable network access controls
- **TLS 1.2+**: Enforced minimum TLS version

### 📊 Monitoring & Observability
- **Application Insights**: Comprehensive application monitoring
- **Log Analytics**: Centralized logging and analytics
- **Health Checks**: Automated health monitoring for both apps
- **Custom Metrics**: Business and technical metrics collection

### 🚀 Deployment & Scalability
- **Container Support**: Full Docker container deployment
- **Auto-scaling**: App Service Plan with scaling capabilities
- **CI/CD Ready**: Container registry integration for automated deployments
- **Multi-environment**: Support for dev, staging, and production environments

### 💾 Data & Storage
- **Cosmos DB**: Serverless NoSQL database with global distribution
- **Backup**: Automated backup for data protection
- **Partitioning**: Optimized partition strategy for bookmark data

## Usage

### Basic Usage

```hcl
module "bookmarks_platform" {
  source = "./catalog/terraform_modules/bookmarks_web_apps"

  environment = "dev"
  project     = "bookmarks"
  location    = "East US"

  tags = {
    Environment = "development"
    Team        = "platform-engineering"
    Project     = "bookmarks"
  }
}
```

### Production Configuration

```hcl
module "bookmarks_platform" {
  source = "./catalog/terraform_modules/bookmarks_web_apps"

  environment = "prod"
  project     = "bookmarks"
  location    = "East US"

  app_service_plan_sku = {
    name     = "P1v3"
    capacity = 2
  }

  container_registry_sku = "Premium"

  cosmos_db_consistency_level = "Strong"

  application_insights_retention_in_days = 365

  enable_backup = true
  enable_monitoring = true
  enable_security_hardening = true

  tags = {
    Environment = "production"
    Team        = "platform-engineering"
    Project     = "bookmarks"
    CostCenter  = "engineering"
  }
}
```

### Development Configuration

```hcl
module "bookmarks_platform" {
  source = "./catalog/terraform_modules/bookmarks_web_apps"

  environment = "dev"
  project     = "bookmarks"
  location    = "East US"

  app_service_plan_sku = {
    name     = "B1"
    capacity = 1
  }

  container_registry_sku = "Basic"

  cosmos_db_consistency_level = "Session"

  application_insights_retention_in_days = 30

  enable_backup = false
  enable_security_hardening = false

  tags = {
    Environment = "development"
    Team        = "platform-engineering"
    Project     = "bookmarks"
  }
}
```

## Requirements

| Name | Version |
|------|---------|
| terraform | >= 1.5.0 |
| azurerm | ~> 3.80 |
| random | ~> 3.5 |

## Providers

| Name | Version |
|------|---------|
| azurerm | ~> 3.80 |
| random | ~> 3.5 |

## Resources Created

| Resource Type | Count | Purpose |
|---------------|-------|---------|
| azurerm_resource_group | 1 | Container for all resources |
| azurerm_service_plan | 1 | Linux App Service Plan |
| azurerm_linux_web_app | 2 | Frontend and Backend applications |
| azurerm_container_registry | 1 | Container image storage |
| azurerm_cosmosdb_account | 1 | NoSQL database account |
| azurerm_cosmosdb_sql_database | 1 | SQL API database |
| azurerm_cosmosdb_sql_container | 1 | Bookmarks container |
| azurerm_key_vault | 1 | Secrets management |
| azurerm_key_vault_secret | 2+ | Application secrets |
| azurerm_application_insights | 1 | Application monitoring |
| azurerm_log_analytics_workspace | 1 | Log aggregation |
| azurerm_role_assignment | 8+ | RBAC permissions |

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| environment | Environment name (dev, staging, prod) | `string` | n/a | yes |
| project | Project name for resource naming | `string` | `"bookmarks"` | no |
| location | Azure region for resource deployment | `string` | `"East US"` | no |
| app_service_plan_sku | SKU for the App Service Plan | `object({name=string, capacity=number})` | `{name="B1", capacity=1}` | no |
| container_registry_sku | SKU for the Azure Container Registry | `string` | `"Basic"` | no |
| cosmos_db_consistency_level | Cosmos DB consistency level | `string` | `"Session"` | no |
| enable_backup | Enable automated backup for applicable resources | `bool` | `true` | no |
| enable_monitoring | Enable monitoring and alerting for resources | `bool` | `true` | no |
| enable_security_hardening | Enable additional security hardening features | `bool` | `true` | no |
| tags | Tags to apply to all resources | `map(string)` | `{ManagedBy="Terraform", Project="Bookmarks"}` | no |

## Outputs

| Name | Description |
|------|-------------|
| resource_group_name | Name of the created resource group |
| frontend_app_url | URL of the frontend web application |
| backend_app_url | URL of the backend web application |
| container_registry_login_server | Container registry login server URL |
| cosmos_account_endpoint | Cosmos DB account endpoint |
| key_vault_uri | Key Vault URI |
| application_insights_app_id | Application Insights application ID |
| deployment_info | Information needed for CI/CD deployment |

## Networking

### Default Configuration
- **Public Access**: All services are publicly accessible by default
- **CORS**: Backend configured to accept requests from frontend
- **HTTPS**: All web apps enforce HTTPS redirection
- **TLS**: Minimum TLS 1.2 enforced

### Security Hardening
When `enable_security_hardening = true`:
- Key Vault network access restricted to Azure services
- Additional security policies applied
- Enhanced monitoring enabled

## Authentication & Authorization

### Managed Identities
Each Web App has a system-assigned managed identity with the following permissions:

**Frontend App**:
- `AcrPull` on Container Registry
- `Key Vault Secrets User` on Key Vault
- `Cosmos DB Built-in Data Reader` on Cosmos DB
- `Monitoring Metrics Publisher` on Application Insights

**Backend App**:
- `AcrPull` on Container Registry
- `Key Vault Secrets User` on Key Vault
- `Cosmos DB Built-in Data Contributor` on Cosmos DB
- `Monitoring Metrics Publisher` on Application Insights

### Key Vault Integration
Application secrets are automatically stored in Key Vault and referenced in Web App configuration:
- Cosmos DB connection string
- Application Insights connection string
- Custom application secrets (can be added post-deployment)

## Data Model

### Cosmos DB Configuration
- **Database**: `bookmarks_db`
- **Container**: `bookmarks`
- **Partition Key**: `/id`
- **Unique Keys**: `/userId` + `/url` (prevents duplicate bookmarks per user)
- **Indexing**: Optimized for bookmark queries
- **Consistency**: Session consistency (configurable)

## Monitoring & Alerting

### Application Insights
- **Telemetry**: Automatic collection from both Web Apps
- **Custom Metrics**: Ready for business metrics implementation
- **Performance**: Response time and dependency tracking
- **Availability**: Health check monitoring

### Log Analytics
- **Centralized Logging**: All application and infrastructure logs
- **Retention**: Configurable retention period
- **Querying**: KQL queries for troubleshooting and analysis

## Cost Optimization

### Development Environment
- App Service Plan: B1 (Basic)
- Container Registry: Basic SKU
- Cosmos DB: Serverless billing
- Application Insights: 30-day retention
- **Estimated Monthly Cost**: ~$50-100

### Production Environment
- App Service Plan: P1v3+ (Premium)
- Container Registry: Premium SKU
- Cosmos DB: Serverless or Provisioned
- Application Insights: 365-day retention
- **Estimated Monthly Cost**: ~$200-500

## Deployment Guide

### Prerequisites
1. Azure subscription with appropriate permissions
2. Terraform >= 1.5.0
3. Azure CLI authentication

### Step 1: Initialize Terraform
```bash
cd catalog/terraform_modules/bookmarks_web_apps
terraform init
```

### Step 2: Plan Deployment
```bash
terraform plan -var="environment=dev"
```

### Step 3: Apply Configuration
```bash
terraform apply -var="environment=dev"
```

### Step 4: Verify Deployment
```bash
# Check Web App URLs
terraform output frontend_app_url
terraform output backend_app_url

# Verify Container Registry
az acr list --query "[?name=='$(terraform output -raw container_registry_name)']"
```

## Container Deployment

### Image Requirements
- **Frontend**: Nginx-based container serving React application
- **Backend**: Python container running FastAPI application
- **Ports**: Frontend (80), Backend (8000)
- **Health Checks**: Frontend (/), Backend (/health)

### Deployment Process
1. Build container images
2. Push to Azure Container Registry
3. Update Web App container configuration
4. Verify deployment through health checks

## Troubleshooting

### Common Issues

#### Web App Startup Issues
```bash
# Check application logs
az webapp log tail --name <app-name> --resource-group <rg-name>

# Check container logs
az webapp log download --name <app-name> --resource-group <rg-name>
```

#### Container Registry Access
```bash
# Verify managed identity permissions
az role assignment list --assignee <principal-id> --scope <acr-id>

# Test container pull
az acr login --name <registry-name>
docker pull <registry-name>.azurecr.io/<image>:<tag>
```

#### Cosmos DB Connectivity
```bash
# Test connection string
az cosmosdb keys list --name <cosmos-name> --resource-group <rg-name>

# Check firewall rules
az cosmosdb show --name <cosmos-name> --resource-group <rg-name> --query "ipRules"
```

### Support

For issues and support:
1. Check Azure Activity Log for deployment errors
2. Review Application Insights for runtime issues
3. Verify RBAC assignments for permission issues
4. Check Key Vault access policies for secret access issues

## Contributing

When modifying this module:
1. Update variable validation for new inputs
2. Add appropriate outputs for new resources
3. Update documentation and examples
4. Test in development environment before production use
5. Follow semantic versioning for module releases

## License

This module is part of the Bookmarks platform engineering project and follows the same licensing terms.
