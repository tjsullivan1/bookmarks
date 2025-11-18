# Story 013: Azure Web Apps Deployment Setup

## Required GitHub Repository Variables

The following GitHub repository variables need to be configured for Azure Web Apps deployment to work:

### Azure Authentication (Already Configured)
- `AZURE_CLIENT_ID`: The client ID of your Azure AD application (d2ff13b6-bf7e-4889-9142-0c109351d612)
- `AZURE_TENANT_ID`: Your Azure tenant ID (012c6d21-cad3-4e61-98dd-2bc660a112b8)
- `AZURE_SUBSCRIPTION_ID`: Your Azure subscription ID

### Azure Resource Configuration (Needs Setup)
- `AZURE_RESOURCE_GROUP`: The name of the Azure resource group containing your Web Apps

### Docker Hub Authentication (Already Configured)
- `DOCKER_USERNAME`: Your Docker Hub username (configured as secret)
- `DOCKER_PASSWORD`: Your Docker Hub password (configured as secret)

## Azure Infrastructure Requirements

The workflows expect the following Azure resources to exist:

### Web Apps
- A frontend Web App (name containing "frontend")
- A backend Web App (name containing "backend")
- Both should be Linux container-based Web Apps

### Resource Group
- All resources should be in the same resource group specified by `AZURE_RESOURCE_GROUP`

## Deployment Process

The implementation provides:

1. **Zero-Downtime Deployment**: Uses Azure Web App staging slots
2. **Container Build & Push**: Builds and pushes to Docker Hub
3. **Security Scanning**: Uses Docker Scout for vulnerability scanning
4. **Health Validation**: Validates deployment health before production swap
5. **Automatic Rollback**: Fails deployment if validation doesn't pass

## Deployment Flow

1. **Build Phase**: Test and build application
2. **Container Phase**: Build and push Docker container
3. **Security Phase**: Scan container for vulnerabilities
4. **Deploy Phase** (main branch only):
   - Create/update staging slot
   - Deploy container to staging
   - Warm up and validate staging
   - Swap staging to production
   - Validate production deployment

## Manual Setup Required

### 1. Configure GitHub Variables
```bash
# Set the resource group name (adjust as needed)
gh variable set AZURE_RESOURCE_GROUP --body "rg-prod-bookmarks"
```

### 2. Deploy Azure Infrastructure
You'll need to either:

**Option A**: Deploy your Terraform infrastructure
```bash
cd infra/environments/dev
terraform init
terraform plan
terraform apply
```

**Option B**: Create Web Apps manually or adjust variable to match existing infrastructure

### 3. Test the Deployment
After setup, push to main branch to trigger the complete CI/CD pipeline.

## Troubleshooting

### Common Issues
1. **Web App Not Found**: Check that `AZURE_RESOURCE_GROUP` variable matches your actual resource group
2. **OIDC Authentication Failed**: Verify Azure AD application has proper permissions
3. **Container Pull Failed**: Ensure Web App can access Docker Hub with provided credentials
4. **Health Check Failed**: Verify your applications expose the expected health endpoints

### Health Check Endpoints
- **Backend**: Should respond to `/health` endpoint
- **Frontend**: Should respond to root `/` endpoint with HTTP 200

### Monitoring
- Check GitHub Actions logs for detailed deployment progress
- Monitor Azure Web App logs for container startup issues
- Use Azure Application Insights for application health monitoring

## Security Considerations

- Container images are scanned for critical and high severity vulnerabilities
- OIDC authentication eliminates need for long-lived Azure credentials
- Staging slot validation prevents problematic deployments from reaching production
- Docker Hub credentials are stored as GitHub secrets, not repository variables
