# Terraform Coding Assistant Instructions

## Core Principles

### Clarity First - Always Ask Questions
- **CRITICAL**: If the user's request is ambiguous, incomplete, or lacks specific requirements, ALWAYS ask clarifying questions before writing any Terraform code
- Do NOT assume infrastructure requirements, resource configurations, or naming conventions
- Ask about:
  - Target cloud provider and region
  - Environment (dev, staging, prod)
  - Security requirements
  - Networking needs
  - Scaling requirements
  - Naming conventions
  - Required tags or labels

### DRY (Don't Repeat Yourself) Principles
- Use `locals` blocks for computed values and complex expressions
- Use `variables` for all configurable values
- Use `data` sources instead of hardcoding existing resource references
- Create reusable modules for common patterns
- Use consistent naming conventions across all resources

## Code Structure and Best Practices

### File Organization
- should be created in the directory %project_root%/catalog/terraform_modules/%module_name%

```
module_name/
├── 00-variables.tf      # Input variables
├── 01-main.tf           # Primary resource definitions
├── 02-outputs.tf        # Output values
├── locals.tf         # Local values and computed expressions
├── data.tf           # Data source definitions
├── providers.tf      # Provider configurations
├── versions.tf       # Terraform and provider version constraints
└── terraform.tfvars # Variable values (environment-specific)
```

### Naming Conventions
- Use `snake_case` for all Terraform identifiers
- Resource names should be descriptive and include environment: `${var.environment}_${var.project}_${resource_type}`
- Use locals for consistent naming patterns:

```hcl
locals {
  name_prefix = "${var.environment}-${var.project}"
  common_tags = {
    Environment = var.environment
    Project     = var.project
    ManagedBy   = "terraform"
    Owner       = var.owner
  }
}
```

### Variables and Locals Best Practices
- Always provide descriptions for variables
- Use appropriate variable types (string, number, bool, list, map, object)
- Set sensible defaults where applicable
- Use validation blocks for input validation
- Group related locals together with comments

```hcl
variable "environment" {
  description = "Environment name (dev, staging, prod)"
  type        = string
  validation {
    condition     = contains(["dev", "staging", "prod"], var.environment)
    error_message = "Environment must be dev, staging, or prod."
  }
}

locals {
  # Naming conventions
  resource_prefix = "${var.environment}-${var.project}"

  # Network configuration
  vpc_cidr = var.environment == "prod" ? "10.0.0.0/16" : "10.1.0.0/16"

  # Common tags applied to all resources
  default_tags = merge(var.additional_tags, {
    Environment = var.environment
    Project     = var.project
    ManagedBy   = "terraform"
    CreatedAt   = timestamp()
  })
}
```

### Resource Configuration Standards
- Always use explicit resource naming with locals/variables
- Include comprehensive tags on all taggable resources
- Use `for_each` instead of `count` when creating multiple similar resources
- Implement proper dependencies with `depends_on` when implicit dependencies aren't sufficient
- Use data sources for existing resources rather than hardcoding values

```hcl
resource "aws_instance" "app_server" {
  for_each = var.app_instances

  ami           = data.aws_ami.app_ami.id
  instance_type = each.value.instance_type
  subnet_id     = data.aws_subnet.app_subnets[each.value.availability_zone].id

  tags = merge(local.default_tags, {
    Name = "${local.resource_prefix}-app-${each.key}"
    Role = "application"
  })
}
```

## Module Development Standards

### Module Structure as Product
Treat modules as products with:
- **Clear API**: Well-defined inputs (variables) and outputs
- **Documentation**: README.md with usage examples
- **Versioning**: Semantic versioning for module releases
- **Testing**: Automated testing with tools like Terratest
- **Examples**: Working examples in `examples/` directory

### Module Stack Management
- **Composition over Inheritance**: Build complex infrastructure by composing smaller, focused modules
- **Interface Contracts**: Define clear interfaces between modules using outputs/variables
- **Version Pinning**: Always pin module versions in production
- **Backward Compatibility**: Maintain backward compatibility within major versions

```hcl
module "vpc" {
  source = "git::https://github.com/your-org/terraform-modules.git//vpc?ref=v2.1.0"

  name_prefix     = local.resource_prefix
  cidr_block      = local.vpc_cidr
  environment     = var.environment
  additional_tags = local.default_tags
}

module "application" {
  source = "git::https://github.com/your-org/terraform-modules.git//application?ref=v1.5.2"

  vpc_id              = module.vpc.vpc_id
  private_subnet_ids  = module.vpc.private_subnet_ids
  application_name    = var.application_name
  environment         = var.environment

  depends_on = [module.vpc]
}
```

## Security and Compliance

### Security Best Practices
- Never hardcode sensitive values; use variables or data sources
- Use appropriate IAM roles and policies (principle of least privilege)
- Enable encryption at rest and in transit where applicable
- Implement proper network segmentation
- Use secrets management services for sensitive data

```hcl
# Good: Using data source for sensitive values
data "aws_secretsmanager_secret_version" "db_password" {
  secret_id = "${local.resource_prefix}-db-password"
}

# Good: Encrypted storage
resource "aws_s3_bucket_server_side_encryption_configuration" "app_bucket" {
  bucket = aws_s3_bucket.app_bucket.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}
```

### Compliance and Governance
- Implement resource tagging strategies for cost allocation and governance
- Use Terraform workspaces or separate state files for environment isolation
- Implement proper state file security (encryption, access controls)
- Use remote state backends (S3, Azure Storage, GCS) for team collaboration

## Code Quality and Maintenance

### Formatting and Linting
- Always run `terraform fmt` before committing
- Use `terraform validate` to check configuration syntax
- Implement pre-commit hooks for automated checks
- Use tools like `tflint` and `checkov` for additional validation

### Documentation Requirements
- Document all variables with clear descriptions
- Provide usage examples in module READMEs
- Document outputs and their intended use
- Include architectural diagrams for complex modules

### State Management
- Use remote state backends for all environments
- Implement state locking to prevent concurrent modifications
- Regular state file backups
- Use workspaces or separate state files for environment isolation

```hcl
terraform {
  backend "s3" {
    bucket         = "your-terraform-state-bucket"
    key            = "environments/${var.environment}/terraform.tfstate"
    region         = "us-west-2"
    encrypt        = true
    dynamodb_table = "terraform-locks"
  }
}
```

## Error Handling and Debugging

### Validation and Error Prevention
- Use variable validation blocks to catch errors early
- Implement proper resource dependencies
- Use lifecycle rules to prevent accidental destruction of critical resources

```hcl
resource "aws_s3_bucket" "critical_data" {
  bucket = "${local.resource_prefix}-critical-data"

  lifecycle {
    prevent_destroy = true
  }

  tags = local.default_tags
}
```

### Troubleshooting Guidelines
- Use `terraform plan` extensively before applying changes
- Enable debug logging when troubleshooting: `TF_LOG=DEBUG`
- Use `terraform show` and `terraform state list` for state inspection
- Implement proper output values for debugging and integration

## Implementation Checklist

Before writing any Terraform code, ensure you have:
- [ ] Clear understanding of the infrastructure requirements
- [ ] Confirmed target cloud provider and region
- [ ] Established naming conventions and tagging strategy
- [ ] Identified reusable components that should be modules
- [ ] Determined state management strategy
- [ ] Confirmed security and compliance requirements

## Common Anti-Patterns to Avoid

❌ **Don't:**
- Hardcode values that could change between environments
- Use `count` when `for_each` would be more appropriate
- Create monolithic Terraform configurations
- Ignore resource dependencies
- Skip variable validation
- Use implicit dependencies when explicit ones are clearer

✅ **Do:**
- Use variables and locals for all configurable values
- Create focused, reusable modules
- Implement proper tagging strategies
- Use data sources for existing resources
- Document all variables and outputs
- Implement proper error handling and validation

## When to Ask for Clarification

Always ask questions when:
- Infrastructure requirements are not clearly specified
- Security or compliance requirements are unclear
- Naming conventions haven't been established
- Environment-specific configurations are not defined
- Module boundaries and responsibilities are ambiguous
- State management strategy is not specified
- Cloud provider or region preferences are not stated

Remember: It's better to ask clarifying questions than to make assumptions that could lead to infrastructure that doesn't meet requirements or best practices.
