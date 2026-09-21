$ErrorActionPreference = "Stop"

$ResourceGroup = "AI-Analytics-RG-Final" 
$Location = "japaneast"           
$Suffix = Get-Random -Maximum 99999
$AcrName = "aianalyticsacr$Suffix" 
$AppServicePlan = "AI-AppPlan"
$BackendAppName = "ai-backend-api-$Suffix"
$FrontendAppName = "ai-frontend-ui-$Suffix"

# THE HAMMER: Force the Azure CLI to use the correct group for this exact session, bypassing all cached settings.
$env:AZURE_DEFAULTS_GROUP = $ResourceGroup

Write-Host "1. Creating Resource Group..."
az group create --name $ResourceGroup --location $Location --output none

Write-Host "2. Creating Azure Container Registry (ACR)..."
az acr create --resource-group $ResourceGroup --name $AcrName --sku Basic --admin-enabled true --output none

Write-Host "3. Building & Pushing Backend Docker Image to ACR..."
az acr build --registry $AcrName --image backend:latest ./backend --output none

Write-Host "4. Building & Pushing Frontend Docker Image to ACR..."
az acr build --registry $AcrName --image frontend:latest ./frontend --output none

Write-Host "5. Provisioning App Service Plan (B1 Linux)..."
az appservice plan create --name $AppServicePlan --resource-group $ResourceGroup --sku B1 --is-linux --output none

Write-Host "6. Deploying Backend Container App..."
az webapp create --resource-group $ResourceGroup --plan $AppServicePlan --name $BackendAppName --deployment-container-image-name "$AcrName.azurecr.io/backend:latest" --output none

az webapp config appsettings set --resource-group $ResourceGroup --name $BackendAppName --settings WEBSITES_PORT=8000 --output none

Write-Host "7. Deploying Frontend Container App..."
az webapp create --resource-group $ResourceGroup --plan $AppServicePlan --name $FrontendAppName --deployment-container-image-name "$AcrName.azurecr.io/frontend:latest" --output none

az webapp config appsettings set --resource-group $ResourceGroup --name $FrontendAppName --settings WEBSITES_PORT=80 --output none

Write-Host "========================================"
Write-Host "Infrastructure Successfully Provisioned!"
Write-Host "Container Registry: $AcrName.azurecr.io"
Write-Host "Backend API URL: https://$BackendAppName.azurewebsites.net/docs"
Write-Host "Frontend UI URL: https://$FrontendAppName.azurewebsites.net"
Write-Host "========================================"