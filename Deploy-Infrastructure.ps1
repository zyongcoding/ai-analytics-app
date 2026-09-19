# Deploy-Infrastructure.ps1
$ErrorActionPreference = "Stop"

$ResourceGroup = "AI-Analytics-RG-Final" 
$Location = "japaneast"           
$VmName = "AI-App-Server"
$KeyName = "ai-azure-key"

Write-Host "1. Creating Resource Group..."
az group create --name $ResourceGroup --location $Location --output none

Write-Host "2. Generating clean SSH keys..."
if (Test-Path "$KeyName*") { Remove-Item "$KeyName*" -Force }
ssh-keygen -m PEM -t rsa -b 2048 -f $KeyName -N '""'

Write-Host "3. Provisioning Virtual Machine..."
az vm create --resource-group $ResourceGroup --name $VmName --image Ubuntu2204 --admin-username azureuser --ssh-key-value "$KeyName.pub" --size Standard_B1s --output none

Write-Host "4. Configuring Firewall Rules..."
az vm open-port --resource-group $ResourceGroup --name $VmName --port 80,3000,8080 --priority 1000 --output none

Write-Host "5. Retrieving Public IP Address..."
$PublicIp = az vm show -d -g $ResourceGroup -n $VmName --query publicIps -o tsv

Write-Host "========================================"
Write-Host "Infrastructure Successfully Provisioned!"
Write-Host "Instance Name: $VmName"
Write-Host "Public IP Address: $PublicIp"
Write-Host "To connect: ssh -i $KeyName azureuser@$PublicIp"
Write-Host "========================================"