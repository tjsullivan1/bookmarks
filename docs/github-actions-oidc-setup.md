# GitHub Actions OIDC Authentication Setup

This document provides step-by-step instructions for implementing OIDC authentication between GitHub Actions and Azure services for the Bookmarks application.

## Overview

GitHub Actions uses OpenID Connect (OIDC) to authenticate with Azure without storing long-lived secrets. This approach provides enhanced security through:

- **No stored secrets**: Uses short-lived tokens instead of permanent credentials
- **Trust boundaries**: Federated credentials can restrict access by repository, branch, and environment
- **Better audit trail**: Enhanced logging and monitoring of authentication attempts

## Prerequisites

- Azure subscription with permissions to create App Registrations
- GitHub repository with Actions enabled
- Azure CLI installed and authenticated
- GitHub CLI installed and authenticated

## Implementation Steps

### Step 1: Create Azure AD Application Registration

```bash
# Create the Azure AD application
az ad app create \
  --display-name "bookmarks-github-actions-oidc" \
  --sign-in-audience "AzureADMyOrg"

# Get the application ID
APP_ID=$(az ad app list --display-name "bookmarks-github-actions-oidc" --query "[0].appId" -o tsv)
echo "Application ID: $APP_ID"

# Create service principal
az ad sp create --id $APP_ID
```

### Step 2: Configure Federated Identity Credentials

```bash
# Main branch deployment credential
az ad app federated-credential create \
  --id $APP_ID \
  --parameters '{
    "name": "bookmarks-main-branch",
    "issuer": "https://token.actions.githubusercontent.com",
    "subject": "repo:tjsullivan1/bookmarks:ref:refs/heads/main",
    "description": "GitHub Actions OIDC for main branch deployments",
    "audiences": ["api://AzureADTokenExchange"]
  }'

# Pull request validation credential
az ad app federated-credential create \
  --id $APP_ID \
  --parameters '{
    "name": "bookmarks-pull-requests",
    "issuer": "https://token.actions.githubusercontent.com",
    "subject": "repo:tjsullivan1/bookmarks:pull_request",
    "description": "GitHub Actions OIDC for pull request validation",
    "audiences": ["api://AzureADTokenExchange"]
  }'

# Production environment credential
az ad app federated-credential create \
  --id $APP_ID \
  --parameters '{
    "name": "bookmarks-production-env",
    "issuer": "https://token.actions.githubusercontent.com",
    "subject": "repo:tjsullivan1/bookmarks:environment:production",
    "description": "GitHub Actions OIDC for production environment",
    "audiences": ["api://AzureADTokenExchange"]
  }'
```

### Step 3: Assign Azure Permissions

```bash
# Get necessary IDs
SUBSCRIPTION_ID=$(az account show --query id -o tsv)
RESOURCE_GROUP="dev-bookmarks-rg"  # Adjust based on your environment

# Assign resource group permissions
az role assignment create \
  --assignee $APP_ID \
  --role "Contributor" \
  --scope "/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP"

# Assign Container Registry permissions
ACR_NAME=$(az acr list --resource-group $RESOURCE_GROUP --query "[0].name" -o tsv)
az role assignment create \
  --assignee $APP_ID \
  --role "AcrPush" \
  --scope "/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.ContainerRegistry/registries/$ACR_NAME"

# Assign Web Apps permissions
az role assignment create \
  --assignee $APP_ID \
  --role "Website Contributor" \
  --scope "/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP"
```

### Step 4: Configure GitHub Repository Variables

```bash
# Set repository variables (not secrets!)
gh variable set AZURE_CLIENT_ID --body "$APP_ID"
gh variable set AZURE_TENANT_ID --body "$(az account show --query tenantId -o tsv)"
gh variable set AZURE_SUBSCRIPTION_ID --body "$SUBSCRIPTION_ID"
gh variable set AZURE_RESOURCE_GROUP --body "$RESOURCE_GROUP"
gh variable set AZURE_CONTAINER_REGISTRY --body "$ACR_NAME"
```

### Step 5: Test OIDC Authentication

Use the `test-oidc-auth.yml` workflow to validate the setup:

1. Go to Actions tab in GitHub repository
2. Select "Test OIDC Authentication" workflow
3. Click "Run workflow" to trigger manual execution
4. Verify authentication succeeds and Azure resources are accessible

## Workflow Template Structure

The CI/CD pipeline is structured with the following workflows:

- **`test-oidc-auth.yml`**: Validates OIDC authentication setup
- **`backend-ci-cd.yml`**: Backend application pipeline with test, build, scan, deploy stages
- **`frontend-ci-cd.yml`**: Frontend application pipeline with test, build, scan, deploy stages

Each workflow uses OIDC authentication with proper permissions:

```yaml
permissions:
  id-token: write   # Required for OIDC
  contents: read
  pull-requests: write  # For PR comments
```

## Troubleshooting

### Common Issues

1. **"Error: The audience is invalid"**
   - Ensure audience is set to `api://AzureADTokenExchange`
   - Verify federated credential configuration

2. **"Error: OIDC token verification failed"**
   - Check subject claim matches repository/branch exactly
   - Verify issuer is `https://token.actions.githubusercontent.com`

3. **"Error: Insufficient permissions"**
   - Verify Azure role assignments are correct
   - Check service principal has necessary permissions

### Validation Commands

```bash
# List federated credentials
az ad app federated-credential list --id $APP_ID

# Check role assignments
az role assignment list --assignee $APP_ID

# Test Azure CLI access
az account show
az group list --query "[?name=='$RESOURCE_GROUP']"
```

## Security Considerations

- **Principle of Least Privilege**: Only assign minimum required permissions
- **Environment Constraints**: Use environment-specific federated credentials for production
- **Regular Reviews**: Periodically review and audit federated credentials and permissions
- **Monitoring**: Set up logging and alerting for authentication attempts

## Next Steps

Once OIDC authentication is working:

1. Implement container build automation (Story 010)
2. Add security scanning integration (Story 011)
3. Configure container registry publishing (Story 012)
4. Set up automated deployment (Story 013)

## References

- [GitHub OIDC Documentation](https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/about-security-hardening-with-openid-connect)
- [Azure Federated Identity Credentials](https://docs.microsoft.com/en-us/azure/active-directory/develop/workload-identity-federation)
- [Azure CLI Authentication](https://docs.microsoft.com/en-us/cli/azure/authenticate-azure-cli)
