# Terraform Versions and Provider Requirements
# This file defines version constraints for Terraform and required providers

terraform {
  required_version = ">= 1.5.0"

  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 4.40"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.5"
    }
  }

  # Backend configuration will be provided during terraform init
  # terraform {
  #   backend "azurerm" {
  #     resource_group_name  = "tfstate-rg"
  #     storage_account_name = "tfstatestorage"
  #     container_name       = "tfstate"
  #     key                  = "bookmarks/terraform.tfstate"
  #   }
  # }
}
