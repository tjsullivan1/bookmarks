# Story 005: Cosmos DB Foundation Setup

## User Story
**As a** Backend Developer
**I want** a managed NoSQL database with proper configuration for the bookmarks application
**So that** I can persist bookmark data with optimal performance, cost efficiency, and scalability

## Details
- **Epic**: [Epic 001: Infrastructure as Code Automation Platform](../epics/epic001.epic.md)
- **Priority**: High
- **Story Points**: 8 (to be validated during planning)
- **Sprint**: Sprint 1
- **Theme**: Data and Storage Infrastructure

## Acceptance Criteria

### AC1: Cosmos DB Account Configuration
**Given** I need a NoSQL database for bookmark storage
**When** I provision the Cosmos DB account
**Then** the account is configured with:
- Name following pattern: `{environment}-bookmarks-cosmos`
- SQL API enabled for document-based storage
- Serverless capacity mode for cost optimization
- Consistent prefix consistency level for balanced performance
- Location matching the resource group

### AC2: Database and Container Setup
**Given** the Cosmos DB account is provisioned
**When** I create the database structure
**Then** the following are created:
- Database named `bookmarks_db`
- Container named `bookmarks` for storing bookmark documents
- Partition key set to `/id` for optimal distribution
- No initial throughput provisioning (serverless mode)
- Indexing policy optimized for bookmark queries

### AC3: Backup and Retention Configuration
**Given** bookmark data needs protection against data loss
**When** the Cosmos DB account is configured
**Then** backup settings include:
- Periodic backup mode enabled (7-day retention)
- Backup interval of 4 hours for development, 1 hour for production
- Geo-redundant backup storage for production environments
- Point-in-time restore capability for critical environments

### AC4: Security and Access Configuration
**Given** the database contains user bookmark data
**When** security settings are configured
**Then** access control includes:
- Network access restricted to Azure services initially
- Primary and secondary connection strings available
- Read-only keys generated for monitoring and analytics
- Local authentication enabled alongside managed identity support

### AC5: Connection Information Outputs
**Given** applications need to connect to the database
**When** Cosmos DB is provisioned
**Then** Terraform outputs include:
- Primary connection string (sensitive)
- Secondary connection string (sensitive)
- Database endpoint URL
- Database name and container name for application configuration

## Non-Functional Requirements
- **Performance**: Database responds to queries within 200ms for 95th percentile
- **Cost**: Serverless billing optimizes costs for variable workloads
- **Security**: Connection strings secured and not exposed in plaintext
- **Reliability**: Backup and retention policies protect against data loss

## Technical Notes
- **Implementation Approach**: Use azurerm_cosmosdb_account with SQL API and serverless capacity
- **Partition Strategy**: Use `/id` partition key for bookmark documents
- **Consistency**: Consistent prefix provides good balance of performance and consistency
- **Billing**: Serverless mode charges based on actual usage rather than provisioned capacity

## Test Scenarios

### Happy Path
1. **Database Creation**: Cosmos DB account and database provision successfully
2. **Container Access**: Can create, read, update, and delete documents in the bookmarks container
3. **Connection Testing**: Applications can connect using provided connection strings

### Edge Cases
1. **Account Name Conflicts**: Handles Cosmos DB account name conflicts with unique suffixes
2. **Region Availability**: Manages Cosmos DB service availability across regions
3. **Quota Limits**: Handles subscription quota limits for Cosmos DB accounts

### Error Conditions
1. **Invalid Configuration**: Clear validation for invalid Cosmos DB settings
2. **Insufficient Permissions**: Proper error handling for inadequate Azure permissions
3. **Service Unavailable**: Graceful handling when Cosmos DB service unavailable in region

## Dependencies
- **Prerequisites**:
  - Story 002 (Resource Group) completed for resource placement
  - Azure subscription with Cosmos DB quota available
- **Technical**:
  - Azure Cosmos DB service available in target region
  - Understanding of bookmark data schema for container design
- **External**:
  - Network configuration compatible with Cosmos DB access patterns

## Definition of Done
- [ ] Cosmos DB account resource implemented in Terraform
- [ ] Serverless capacity mode configured appropriately
- [ ] Database and container created with proper partition key
- [ ] Backup and retention policies configured by environment
- [ ] Security settings configured for Azure service access
- [ ] Connection string outputs defined (marked sensitive)
- [ ] Code reviewed and approved
- [ ] Terraform plan shows expected Cosmos DB resources
- [ ] Terraform apply succeeds creating database infrastructure
- [ ] Database accessible via connection strings
- [ ] Basic CRUD operations validated against container

## Technical Implementation Details

### Cosmos DB Account Configuration
```hcl
resource "azurerm_cosmosdb_account" "main" {
  name                = local.cosmos_account_name
  location           = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  offer_type         = "Standard"
  kind               = "GlobalDocumentDB"

  capacity {
    total_throughput_limit = -1  # Serverless
  }

  consistency_policy {
    consistency_level       = "ConsistentPrefix"
    max_interval_in_seconds = 300
    max_staleness_prefix    = 100000
  }

  geo_location {
    location          = azurerm_resource_group.main.location
    failover_priority = 0
  }

  backup {
    type                = "Periodic"
    interval_in_minutes = var.environment == "prod" ? 60 : 240
    retention_in_hours  = var.environment == "prod" ? 168 : 48
    storage_redundancy  = var.environment == "prod" ? "Geo" : "Local"
  }

  tags = local.common_tags
}
```

### Database and Container Configuration
```hcl
resource "azurerm_cosmosdb_sql_database" "bookmarks_db" {
  name                = "bookmarks_db"
  resource_group_name = azurerm_resource_group.main.name
  account_name        = azurerm_cosmosdb_account.main.name
}

resource "azurerm_cosmosdb_sql_container" "bookmarks" {
  name                  = "bookmarks"
  resource_group_name   = azurerm_resource_group.main.name
  account_name          = azurerm_cosmosdb_account.main.name
  database_name         = azurerm_cosmosdb_sql_database.bookmarks_db.name
  partition_key_path    = "/id"
  partition_key_version = 1

  indexing_policy {
    indexing_mode = "consistent"

    included_path {
      path = "/*"
    }

    excluded_path {
      path = "/\"_etag\"/?"
    }
  }
}
```

### Required Outputs
```hcl
output "cosmos_db_endpoint" {
  description = "Endpoint URL for Cosmos DB account"
  value       = azurerm_cosmosdb_account.main.endpoint
}

output "cosmos_db_primary_connection_string" {
  description = "Primary connection string for Cosmos DB"
  value       = azurerm_cosmosdb_account.main.connection_strings[0]
  sensitive   = true
}

output "cosmos_db_database_name" {
  description = "Name of the bookmarks database"
  value       = azurerm_cosmosdb_sql_database.bookmarks_db.name
}

output "cosmos_db_container_name" {
  description = "Name of the bookmarks container"
  value       = azurerm_cosmosdb_sql_container.bookmarks.name
}
```

### Variables Required
- `cosmos_backup_interval` (number): Backup interval in minutes
- `cosmos_backup_retention` (number): Backup retention in hours
- `cosmos_consistency_level` (string): Consistency level (default: "ConsistentPrefix")

## Related Stories
- **Previous**: Story 004 (Azure Container Registry Integration)
- **Next**: Story 006 (Azure Key Vault and Secrets Management)
- **Dependencies**: Connection strings will be stored in Key Vault (next story)
