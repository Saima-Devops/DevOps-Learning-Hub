import { useState, useEffect } from "react";

const T = {
  bg:"#0B0F1A", surface:"#131929", card:"#1A2235",
  text:"#F0F4FF", textSub:"#B8C5D6", textMute:"#7A8FA6", textDim:"#4E6278",
  border:"rgba(255,255,255,0.09)", borderHi:"rgba(255,255,255,0.18)",
  cyan:"#22D3EE", violet:"#A78BFA", amber:"#FBBF24",
  green:"#34D399", red:"#F87171", pink:"#F472B6",
  cyanGlow:"rgba(34,211,238,0.20)", violetGlow:"rgba(167,139,250,0.20)", amberGlow:"rgba(251,191,36,0.20)",
};
const phaseRGB = { foundation:"34,211,238", intermediate:"167,139,250", advanced:"251,191,36" };
const POPPINS = "@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=Fira+Code:wght@400;500&display=swap');";

// ─── GLOSSARY ────────────────────────────────────────────────────────────────
const GLOSSARY = {
  "Cloud Computing": "Delivery of computing services (servers, storage, databases, networking, software, analytics) over the internet on a pay-as-you-go basis. You rent capacity instead of buying and running your own hardware.",
  "Shared Responsibility Model": "Defines which security and management tasks belong to the cloud provider and which belong to the customer. The more the provider manages (SaaS > PaaS > IaaS), the less you are responsible for. Data, identities, and devices are ALWAYS the customer's responsibility.",
  "CapEx": "Capital Expenditure. Up-front spending on physical infrastructure (servers, datacenters) that is depreciated over time. Typical of on-premises environments.",
  "OpEx": "Operational Expenditure. Spending on services as you use them, billed per use or per period. Cloud computing is mostly OpEx - no up-front hardware purchase.",
  "Consumption-based model": "Pay-as-you-go pricing: you pay only for the resources you actually use, with no up-front cost or termination fees. Stop using a resource and the charge stops.",
  "High availability": "The ability of a workload to keep running with minimal downtime, even when components fail. Achieved with redundancy, Availability Zones, and load balancing. Backed by an SLA.",
  "Scalability": "The ability to increase or decrease resources to match demand. Vertical scaling (scale up/down) changes the size of a VM. Horizontal scaling (scale out/in) changes the number of instances.",
  "Elasticity": "Automatic scaling of resources up or down in response to real-time demand, so you do not over-provision or under-provision.",
  "Reliability": "The ability of a system to recover from failures and keep functioning. Built using redundancy, replication, and a decentralized global design.",
  "Predictability": "Cloud benefit covering performance predictability (autoscale, load balancing) and cost predictability (tracking, forecasting, Pricing Calculator).",
  "IaaS": "Infrastructure as a Service. You rent virtualized compute, storage, and networking (e.g., Azure Virtual Machines). You manage the OS, middleware, runtime, apps, and data. Most control, most responsibility.",
  "PaaS": "Platform as a Service. The provider manages OS, runtime, and infrastructure; you deploy code and manage apps and data (e.g., Azure App Service, Azure SQL Database).",
  "SaaS": "Software as a Service. Fully managed software delivered over the internet (e.g., Microsoft 365, Dynamics 365). You manage only your data, users, and configuration.",
  "Serverless": "A model where the provider runs and scales your code on demand and you pay only for execution (e.g., Azure Functions, Logic Apps). There are still servers, but you never manage them.",
  "Public cloud": "Cloud services owned and operated by a provider (like Azure) and shared across many customers (multi-tenant). No CapEx; you pay for what you use.",
  "Private cloud": "Cloud infrastructure used exclusively by one organization, hosted on-premises or by a third party. Highest control, but you pay CapEx and maintenance.",
  "Hybrid cloud": "A combination of public and private cloud (or on-premises) working together. Lets you keep sensitive workloads on-premises while using Azure for flexibility. Azure Arc and Azure Stack support this.",
  "Region": "A geographic area containing one or more datacenters networked together with a low-latency connection. Examples: UAE North, West Europe, East US.",
  "Availability Zone": "A physically separate location within a region with independent power, cooling, and networking. Each AZ-enabled region has a minimum of three zones. Protects against datacenter-level failure.",
  "Region pair": "Two regions in the same geography, at least 300 miles apart where possible, paired for disaster recovery. Updates are rolled out one region at a time, and one region in each pair is prioritized for recovery in a wide outage.",
  "Geography": "A discrete market, typically containing two or more regions, that preserves data residency and compliance boundaries (e.g., United States, Europe, Asia Pacific).",
  "Management group": "A container above subscriptions used to apply governance (Azure Policy, RBAC) across multiple subscriptions. Up to six levels of depth (excluding root).",
  "Subscription": "A logical unit of Azure services that is linked to an account and acts as a billing and access boundary. Every resource lives in exactly one subscription.",
  "Resource group": "A logical container for related Azure resources that share a lifecycle. Deleting the group deletes everything inside it. Resources in a group can be in different regions. A resource belongs to exactly one group.",
  "Azure Resource Manager": "The deployment and management service for Azure. Every request (portal, CLI, PowerShell, SDK, REST) goes through ARM, which handles authentication, authorization, and consistent management.",
  "Virtual Machine": "An IaaS compute resource that emulates a physical computer. You choose the OS and size and are responsible for patching and configuration. Good for lift-and-shift and full control.",
  "Virtual Machine Scale Set": "A group of identical, load-balanced VMs that automatically increase or decrease in number based on demand or a schedule. Provides high availability and scalability.",
  "Availability Set": "Groups VMs across fault domains and update domains inside a single datacenter so a hardware failure or maintenance event does not take down all VMs. Protects within a datacenter, not across zones.",
  "App Service": "A PaaS offering for hosting web apps, REST APIs, and mobile backends in .NET, Java, Node.js, Python, PHP, and more. Includes autoscale, deployment slots, and built-in security.",
  "Azure Functions": "Serverless, event-driven compute. Run small pieces of code in response to triggers (HTTP, timer, queue). Pay only when the code runs.",
  "Azure Container Instances": "The fastest and simplest way to run a container in Azure without managing VMs or an orchestrator. Per-second billing.",
  "Azure Kubernetes Service": "Managed Kubernetes. Azure manages the control plane; you manage the worker nodes and workloads. Used to orchestrate many containers at scale.",
  "Azure Virtual Desktop": "A desktop and app virtualization service running in Azure. Delivers Windows 10/11 multi-session desktops to users on any device.",
  "Virtual Network": "A logically isolated private network in Azure (VNet). Resources inside can communicate with each other, the internet, and on-premises networks. Divided into subnets.",
  "Subnet": "A range of IP addresses inside a VNet. Used to segment a network and apply security rules (NSGs) and routing.",
  "Network Security Group": "A stateful firewall of allow/deny rules that filter inbound and outbound traffic by source/destination IP, port, and protocol. Attach to a subnet or a network interface.",
  "VNet peering": "Connects two virtual networks so resources communicate over the Microsoft backbone with low latency, as if on the same network. Works across regions (global peering).",
  "VPN Gateway": "Sends encrypted traffic between an Azure VNet and an on-premises location over the public internet (site-to-site, point-to-site). Quick to set up, moderate bandwidth.",
  "ExpressRoute": "A private, dedicated connection between on-premises and Azure through a connectivity provider. Does NOT go over the public internet. Higher reliability, lower latency, and consistent speeds.",
  "Azure DNS": "A hosting service for DNS domains that uses Microsoft Azure infrastructure to provide name resolution. Manage DNS records with the same credentials and tools as other Azure resources.",
  "Azure Load Balancer": "A layer 4 (TCP/UDP) load balancer that distributes traffic across healthy VMs inside a region. Public or internal.",
  "Application Gateway": "A layer 7 (HTTP/HTTPS) regional load balancer with URL-based routing, SSL termination, and an optional Web Application Firewall.",
  "Azure Front Door": "A global, layer 7 entry point that provides routing, acceleration, caching, and WAF for web apps across regions.",
  "Storage account": "A top-level Azure container that provides a unique namespace for Blob, File, Queue, and Table storage. The name must be globally unique, 3-24 lowercase letters and numbers.",
  "Blob storage": "Object storage for massive amounts of unstructured data (images, video, backups, logs). Access tiers: Hot, Cool, Cold, and Archive.",
  "Access tier": "Blob storage cost/performance levels: Hot (frequent access, higher storage cost), Cool (infrequent, 30+ days), Cold (rare, 90+ days), Archive (offline, 180+ days, hours to rehydrate).",
  "Azure Files": "Fully managed cloud file shares accessible over SMB and NFS. Can be mounted concurrently by cloud or on-premises machines.",
  "LRS": "Locally Redundant Storage. Three copies within a single datacenter. Cheapest. Protects against drive/rack failure, NOT a datacenter outage.",
  "ZRS": "Zone-Redundant Storage. Three copies across three Availability Zones in one region. Protects against datacenter (zone) failure.",
  "GRS": "Geo-Redundant Storage. LRS in the primary region plus asynchronous copy (LRS) to the paired secondary region. Protects against a regional outage. Secondary is not readable unless RA-GRS.",
  "GZRS": "Geo-Zone-Redundant Storage. ZRS in the primary region plus asynchronous copy to the secondary region. Highest durability and availability combination.",
  "Azure Cosmos DB": "A globally distributed, multi-model NoSQL database with single-digit millisecond latency and multiple consistency levels.",
  "Azure SQL Database": "A fully managed PaaS relational database engine based on SQL Server. Handles patching, backups, and high availability automatically.",
  "Azure Migrate": "A central hub of tools to discover, assess, and migrate on-premises servers, databases, web apps, and VMs to Azure.",
  "Azure Data Box": "A physical device Microsoft ships to you to transfer large amounts of data (terabytes to petabytes) offline into Azure.",
  "AzCopy": "A command-line utility for copying blobs and files to and from storage accounts at high speed.",
  "Microsoft Entra ID": "Microsoft's cloud-based identity and access management service (formerly Azure Active Directory). Provides authentication, SSO, MFA, and Conditional Access for Azure, Microsoft 365, and thousands of SaaS apps.",
  "Authentication": "Proving WHO you are (identity), for example with a password, MFA, or biometrics. Comes before authorization.",
  "Authorization": "Determining WHAT an authenticated identity is allowed to do (permissions). In Azure this is handled by RBAC.",
  "Multifactor authentication": "Requires two or more verification methods: something you know (password), something you have (phone/token), something you are (biometric). Greatly reduces account compromise.",
  "Conditional Access": "Entra ID policy engine using if-then signals (user, location, device, risk) to allow, block, or require extra verification such as MFA.",
  "Single sign-on": "Sign in once with one set of credentials to access multiple applications without being prompted again.",
  "Passwordless authentication": "Sign in without a password using Windows Hello for Business, the Microsoft Authenticator app, or FIDO2 security keys.",
  "Azure RBAC": "Role-Based Access Control. Grants permissions by assigning a role (Owner, Contributor, Reader) to a user, group, or service principal at a scope (management group, subscription, resource group, resource). Permissions are inherited downward.",
  "Zero Trust": "A security model that assumes breach: verify explicitly, use least-privilege access, and never trust by default based on network location.",
  "Defense in depth": "A layered security strategy: physical, identity & access, perimeter, network, compute, application, and data. If one layer fails, the next still protects.",
  "Microsoft Defender for Cloud": "A cloud security posture management and workload protection tool. Gives a secure score, security recommendations, and threat detection for Azure, hybrid, and multi-cloud.",
  "Azure Policy": "Creates, assigns, and manages policies that enforce rules on resources (e.g., allowed regions, required tags). Evaluates compliance and can deny or remediate non-compliant resources.",
  "Resource lock": "Prevents accidental deletion (CanNotDelete) or modification (ReadOnly) of resources, regardless of RBAC permissions. Inherited by child resources.",
  "Microsoft Purview": "A family of data governance, risk, and compliance solutions that helps you discover, classify, and protect data across on-premises, multi-cloud, and SaaS.",
  "Service Trust Portal": "Microsoft's portal with compliance reports, audit reports, and security documentation (ISO, SOC, etc.).",
  "Tag": "A name-value pair added to a resource, resource group, or subscription for organizing, cost reporting, and automation. Tags are NOT inherited by default.",
  "Pricing calculator": "Online tool to estimate the monthly cost of Azure services BEFORE you deploy them. Use it for planning new workloads.",
  "TCO calculator": "Total Cost of Ownership calculator. Compares the cost of running on-premises infrastructure versus Azure to build a business case for migration.",
  "Cost Management": "Microsoft Cost Management + Billing. Analyze, monitor, and optimize spending after deployment: cost analysis, budgets, and alerts.",
  "Azure Reservations": "Commit to 1 or 3 years of specific resources (e.g., VMs) in exchange for significant discounts versus pay-as-you-go.",
  "Azure Hybrid Benefit": "Use existing on-premises Windows Server or SQL Server licenses with Software Assurance on Azure to reduce costs.",
  "Spot VM": "Unused Azure compute capacity at deep discounts. Can be evicted at any time, so it suits interruptible workloads such as batch jobs.",
  "Azure portal": "The web-based graphical interface for creating and managing Azure resources. Great for learning and one-off tasks.",
  "Azure CLI": "A cross-platform command-line tool (az) for managing Azure resources. Works in Bash, PowerShell, or cmd.",
  "Azure PowerShell": "A PowerShell module (Az) with cmdlets like New-AzResourceGroup for managing Azure resources, using the Verb-Noun style.",
  "Azure Cloud Shell": "A browser-based, authenticated shell (Bash or PowerShell) with Azure CLI and PowerShell pre-installed. Accessible from the portal or shell.azure.com.",
  "ARM template": "A JSON file that declaratively defines Azure resources for repeatable deployments. Part of Infrastructure as Code (IaC).",
  "Bicep": "A cleaner, domain-specific language that compiles to ARM templates. Simpler syntax than JSON for Infrastructure as Code.",
  "Infrastructure as code": "Managing and provisioning infrastructure through machine-readable definition files rather than manual processes. Gives consistency, repeatability, and version control.",
  "Azure Arc": "Extends Azure management and services (Policy, Monitor, Defender) to resources running outside Azure: on-premises, other clouds, and edge. Key to hybrid and multi-cloud.",
  "Azure Advisor": "A personalized recommendation engine that analyzes your resources and suggests improvements across reliability, security, performance, cost, and operational excellence.",
  "Azure Service Health": "Tracks Azure service issues, planned maintenance, and health advisories that affect YOUR subscriptions and regions. Includes Azure status, Service Health, and Resource Health.",
  "Azure Monitor": "A platform to collect, analyze, and act on telemetry (metrics and logs) from Azure and on-premises resources. Includes alerts, Log Analytics, and Application Insights.",
  "Log Analytics": "A tool in Azure Monitor for querying and analyzing log data using Kusto Query Language (KQL).",
  "Application Insights": "An Azure Monitor feature for application performance monitoring (APM): requests, dependencies, failures, and user behavior.",
  "SLA": "Service Level Agreement. Microsoft's formal commitment for uptime and connectivity, expressed as a percentage (e.g., 99.9%). If not met, you may get service credits.",
  "Composite SLA": "The combined SLA of a solution built from multiple services. Calculated by multiplying individual SLAs, so it is lower than the weakest single service unless redundancy is added.",
  "Public preview": "A pre-release stage where features are available for evaluation. Not covered by the standard SLA and may change before release.",
  "General availability": "The stage when a service is fully released, supported, and covered by the SLA for production use.",
};

// ─── SCENARIOS ───────────────────────────────────────────────────────────────
const SCENARIOS = [
  {
    id:"first-rg", phase:"foundation",
    title:"Your First Azure Resources",
    subtitle:"Sign in, explore hierarchy, create a tagged resource group",
    emoji:"🚀", duration:"~25 min", difficulty:"Beginner",
    examWeight:"High",
    goal:"You just got an Azure free account. Learn how the account, subscription, and resource group hierarchy fits together, then create a tagged resource group using Azure Cloud Shell. No install required.",
    concepts:["Subscription","Resource group","Tags","Cloud Shell","Azure CLI","Hierarchy"],
    steps:[
      { title:"Open Azure Cloud Shell",
        context:"Cloud Shell is a browser-based terminal that is already signed in and has Azure CLI installed. It is the quickest way to practice.",
        cmds:[
          {cmd:"https://shell.azure.com  (or click the >_ icon in the portal top bar)", why:"Opens Cloud Shell. Choose Bash. First launch creates a small storage account to persist your files - this is normal and cheap."},
          {cmd:"az account show --output table", why:"Shows the active subscription (name, ID, tenant). Every resource you create is billed to this subscription."},
          {cmd:"az account list-locations --query \"[].name\" -o tsv | head -20", why:"Lists region names you can deploy to (e.g., uaenorth, westeurope). Regions are where your datacenter resources physically live."},
        ]},
      { title:"Create a resource group",
        context:"A resource group is a logical container for resources that share a lifecycle. Think of it as a folder - delete the folder, delete everything inside.",
        cmds:[
          {cmd:"az group create --name rg-az900-lab --location uaenorth", why:"Creates the resource group. The location only stores the group's metadata; resources inside can be in other regions."},
          {cmd:"az group list --output table", why:"Confirms the group exists with Provisioning State = Succeeded."},
          {cmd:"az group show --name rg-az900-lab", why:"Shows the full JSON including the resource ID: /subscriptions/<id>/resourceGroups/rg-az900-lab. This ID shows the hierarchy: subscription > resource group."},
        ]},
      { title:"Add tags for organization and cost tracking",
        context:"Tags are name-value pairs used for billing reports and organization. Important exam fact: tags are NOT inherited by child resources by default.",
        cmds:[
          {cmd:"az group update --name rg-az900-lab --tags env=dev owner=yourname project=az900", why:"Adds three tags to the group. In Cost Management you can later group spend by the env or project tag."},
          {cmd:"az group show --name rg-az900-lab --query tags", why:"Verifies the tags were saved."},
          {cmd:"az tag list --output table", why:"Shows tag names and counts used across the subscription."},
        ]},
      { title:"Create a resource and observe tag behavior",
        cmds:[
          {cmd:`az storage account create \\
  --name stgaz900$RANDOM \\
  --resource-group rg-az900-lab \\
  --location uaenorth \\
  --sku Standard_LRS`, why:"Creates a storage account. Names must be globally unique, 3-24 lowercase letters and numbers, so $RANDOM adds a random suffix."},
          {cmd:"az resource list --resource-group rg-az900-lab --output table", why:"Lists the resources in the group. Notice the storage account has NO env/owner/project tags - tags on a resource group are not inherited by default."},
        ]},
      { title:"Clean up",
        cmds:[
          {cmd:"az group delete --name rg-az900-lab --yes --no-wait", why:"Deleting the resource group deletes ALL resources inside it. The fastest, cleanest way to avoid unexpected charges."},
        ]},
    ]
  },
  {
    id:"cost-estimate", phase:"foundation",
    title:"Estimate and Compare Costs",
    subtitle:"Pricing Calculator vs TCO Calculator, CapEx vs OpEx",
    emoji:"💰", duration:"~30 min", difficulty:"Beginner",
    examWeight:"High",
    goal:"Your manager asks two questions: 'What will this new app cost on Azure?' and 'Is moving our datacenter to Azure cheaper?' Learn which tool answers which question - a classic AZ-900 exam trap.",
    concepts:["Pricing calculator","TCO calculator","CapEx","OpEx","Consumption-based model","Cost Management"],
    steps:[
      { title:"Answer question 1: cost of a NEW workload",
        context:"The Pricing Calculator estimates the monthly cost of Azure services you plan to deploy. Use it BEFORE building something new.",
        cmds:[
          {cmd:"Open: https://azure.microsoft.com/pricing/calculator/", why:"No sign-in needed. This is the planning tool for any new Azure workload."},
          {cmd:"Add product: Virtual Machines > region UAE North > Linux > D2s v5 > 730 hours (1 month)", why:"Shows pay-as-you-go cost. Notice the estimate changes with region, OS, size, and hours - this is the consumption-based model."},
          {cmd:"Change the savings option to 1-year Reserved Instance", why:"Reservations commit you to 1 or 3 years for a big discount. Compare with Pay-as-you-go and Spot to see the spread."},
        ]},
      { title:"Answer question 2: on-premises vs Azure",
        context:"The TCO (Total Cost of Ownership) Calculator compares what you pay today in your own datacenter with what the same workload would cost in Azure.",
        cmds:[
          {cmd:"Open: https://azure.microsoft.com/pricing/tco/calculator/", why:"This tool is for building a MIGRATION business case, not for estimating a brand new workload."},
          {cmd:"Enter: 20 Windows Server VMs, 10 TB storage, 2 sysadmins, electricity and rack costs", why:"The TCO tool includes hidden on-premises costs (power, cooling, space, labor) that people forget when comparing to cloud."},
          {cmd:"Review the 3-5 year report: CapEx vs OpEx breakdown", why:"On-premises is mostly CapEx (up-front hardware). Azure shifts to OpEx (pay for what you use). This shift is a core exam concept."},
        ]},
      { title:"Track REAL spend after deployment",
        context:"Estimating is not the same as monitoring. Cost Management tracks actual costs once resources are running.",
        cmds:[
          {cmd:"Portal > Cost Management + Billing > Cost analysis", why:"Shows actual spend, filterable by resource group, tag, service, or location. Tags you add make this report far more useful."},
          {cmd:"Portal > Cost Management > Budgets > + Add (set 20 USD, alert at 80%)", why:"A budget does NOT stop spending - it only sends an alert when a threshold is reached. A frequent exam trick."},
          {cmd:"az consumption usage list --top 5 --output table", why:"CLI view of recent usage records. Useful for scripting reports. May be empty on a brand new account."},
        ]},
      { title:"Memory aid: which tool for which job",
        cmds:[
          {cmd:"Pricing calculator = ESTIMATE cost of NEW Azure resources (before)", why:"Think: 'How much WILL this cost?'"},
          {cmd:"TCO calculator = COMPARE on-premises vs Azure (migration case)", why:"Think: 'How much will we SAVE by moving?'"},
          {cmd:"Cost Management = MONITOR + control ACTUAL spending (after)", why:"Think: 'How much DID we spend, and are we on budget?'"},
        ]},
    ]
  },
  {
    id:"linux-vm", phase:"intermediate",
    title:"Deploy a Web Server on a Virtual Machine",
    subtitle:"VM + VNet + NSG - IaaS compute and networking in action",
    emoji:"🖥️", duration:"~40 min", difficulty:"Intermediate",
    examWeight:"Critical",
    goal:"Launch an Ubuntu VM, install nginx, open port 80 through a Network Security Group, and reach your site from a browser. You will see IaaS responsibilities first-hand: Azure runs the hardware, you manage the OS.",
    concepts:["Virtual Machine","Virtual Network","Network Security Group","IaaS","Public IP","Availability"],
    steps:[
      { title:"Create the resource group",
        cmds:[
          {cmd:"az group create --name rg-vm-lab --location uaenorth", why:"Container for the VM and every related resource (NIC, disk, public IP, VNet, NSG)."},
        ]},
      { title:"Create the virtual machine",
        context:"This one command creates the VM and automatically provisions a VNet, subnet, NIC, public IP, OS disk, and an NSG.",
        cmds:[
          {cmd:`az vm create \\
  --resource-group rg-vm-lab \\
  --name vm-web01 \\
  --image Ubuntu2204 \\
  --size Standard_B1s \\
  --admin-username azureuser \\
  --generate-ssh-keys \\
  --public-ip-sku Standard`, why:"Standard_B1s is a small, low-cost burstable size. --generate-ssh-keys creates SSH keys if none exist. Output includes the public IP address - copy it."},
          {cmd:"az resource list --resource-group rg-vm-lab --output table", why:"See everything that was created. A 'VM' in Azure is really several linked resources - good to know for cost, since disks and public IPs bill separately."},
        ]},
      { title:"Install a web server",
        context:"IaaS means YOU manage the OS and software. Azure will not patch or configure nginx for you.",
        cmds:[
          {cmd:`az vm run-command invoke \\
  --resource-group rg-vm-lab \\
  --name vm-web01 \\
  --command-id RunShellScript \\
  --scripts "sudo apt-get update && sudo apt-get install -y nginx"`, why:"Runs a script inside the VM without opening SSH. This installs nginx. It takes about a minute."},
        ]},
      { title:"Open port 80 with the NSG",
        context:"Network Security Groups are the VM's firewall. By default only SSH (22) is allowed inbound for Linux VMs created this way, so a browser request on port 80 is blocked.",
        cmds:[
          {cmd:"az vm open-port --resource-group rg-vm-lab --name vm-web01 --port 80", why:"Adds an inbound allow rule for TCP 80 to the NSG attached to the VM's NIC."},
          {cmd:"az network nsg rule list --resource-group rg-vm-lab --nsg-name vm-web01NSG --output table", why:"Lists NSG rules. You should see the allow rule for port 80 alongside the default rules. Rules are evaluated by priority number - lowest first."},
          {cmd:"az vm show -d --resource-group rg-vm-lab --name vm-web01 --query publicIps -o tsv", why:"Prints the public IP. Open http://<ip> in a browser - you should see the nginx welcome page."},
        ]},
      { title:"Stop paying for compute: deallocate",
        context:"Exam favorite: a VM that is stopped inside the OS still holds its compute reservation and keeps billing. Only 'Stopped (deallocated)' stops compute charges.",
        cmds:[
          {cmd:"az vm deallocate --resource-group rg-vm-lab --name vm-web01", why:"Releases the compute resources so you stop paying for VM compute. Disks and static public IPs still cost money."},
          {cmd:"az vm get-instance-view --resource-group rg-vm-lab --name vm-web01 --query \"instanceView.statuses[1].displayStatus\" -o tsv", why:"Should print 'VM deallocated'."},
        ]},
      { title:"Clean up",
        cmds:[
          {cmd:"az group delete --name rg-vm-lab --yes --no-wait", why:"Removes the VM, disks, NIC, public IP, VNet, and NSG all at once."},
        ]},
    ]
  },
  {
    id:"storage-redundancy", phase:"intermediate",
    title:"Storage Redundancy and Access Tiers",
    subtitle:"Blob storage, LRS vs GRS, Hot vs Cool vs Archive",
    emoji:"🗄️", duration:"~35 min", difficulty:"Intermediate",
    examWeight:"Critical",
    goal:"Create a storage account, upload a file to Blob storage, change its access tier, and change the redundancy option. Practice matching redundancy and tiers to business requirements - a heavily tested topic.",
    concepts:["Storage account","Blob storage","LRS","ZRS","GRS","Access tier"],
    steps:[
      { title:"Create a storage account with LRS",
        cmds:[
          {cmd:`az group create --name rg-storage-lab --location uaenorth
STG=stgaz900$RANDOM
echo $STG`, why:"Creates the group and stores a unique account name in a shell variable. Names are globally unique across all of Azure."},
          {cmd:`az storage account create \\
  --name $STG \\
  --resource-group rg-storage-lab \\
  --location uaenorth \\
  --sku Standard_LRS \\
  --kind StorageV2 \\
  --access-tier Hot`, why:"Standard_LRS keeps 3 copies in ONE datacenter - cheapest, but no protection from a datacenter-wide outage. Default access tier is Hot."},
        ]},
      { title:"Upload data to Blob storage",
        cmds:[
          {cmd:`az storage container create \\
  --account-name $STG \\
  --name docs \\
  --auth-mode login`, why:"A container is like a folder that holds blobs. --auth-mode login uses your Entra ID identity instead of account keys (you may need the Storage Blob Data Contributor role)."},
          {cmd:`echo "AZ-900 lab file" > hello.txt
az storage blob upload \\
  --account-name $STG \\
  --container-name docs \\
  --name hello.txt \\
  --file hello.txt \\
  --auth-mode login`, why:"Uploads the file as a block blob. For large datasets, use AzCopy instead."},
          {cmd:`az storage blob list \\
  --account-name $STG \\
  --container-name docs \\
  --auth-mode login --output table`, why:"Confirms the blob exists and shows its current access tier (Hot)."},
        ]},
      { title:"Move the blob to a cheaper access tier",
        context:"Hot = frequent access. Cool = infrequent (30+ days). Cold = rare (90+ days). Archive = offline, cheapest storage, 180+ days, takes hours to rehydrate.",
        cmds:[
          {cmd:`az storage blob set-tier \\
  --account-name $STG \\
  --container-name docs \\
  --name hello.txt \\
  --tier Cool \\
  --auth-mode login`, why:"Cool lowers storage cost but raises access cost. Good for backups you rarely read."},
          {cmd:`az storage blob set-tier \\
  --account-name $STG \\
  --container-name docs \\
  --name hello.txt \\
  --tier Archive \\
  --auth-mode login`, why:"Archive is the cheapest storage but the blob is OFFLINE - you cannot read it until you rehydrate it to Hot or Cool, which can take hours."},
        ]},
      { title:"Upgrade redundancy",
        context:"Choose redundancy by the failure you must survive: drive/rack = LRS, datacenter = ZRS, entire region = GRS, both = GZRS.",
        cmds:[
          {cmd:"az storage account update --name $STG --resource-group rg-storage-lab --sku Standard_GRS", why:"Changes to Geo-Redundant Storage: 3 copies locally plus 3 copies in the paired region (six total). Protects against a regional disaster."},
          {cmd:"az storage account show --name $STG --resource-group rg-storage-lab --query \"{sku:sku.name, secondary:secondaryLocation}\"", why:"Shows the SKU and the paired secondary region. For UAE North the pair is UAE Central."},
        ]},
      { title:"Clean up",
        cmds:[
          {cmd:"az group delete --name rg-storage-lab --yes --no-wait", why:"Deletes the storage account and all its data. Archive-tier blobs deleted early may incur an early-deletion fee, but this is a tiny test file."},
        ]},
    ]
  },
  {
    id:"governance", phase:"advanced",
    title:"Govern a Subscription: Policy, Locks and RBAC",
    subtitle:"Enforce rules, prevent accidents, grant least privilege",
    emoji:"🔐", duration:"~45 min", difficulty:"Advanced",
    examWeight:"Critical",
    goal:"You are the cloud admin. Enforce that resources can only be created in approved regions (Azure Policy), prevent accidental deletion (resource locks), and grant a colleague read-only access (RBAC). Learn how these three governance tools differ - they are commonly confused on the exam.",
    concepts:["Azure Policy","Resource lock","Azure RBAC","Least privilege","Scope","Inheritance"],
    steps:[
      { title:"Create a governed resource group",
        cmds:[
          {cmd:"az group create --name rg-gov-lab --location uaenorth", why:"The scope we will govern. Policy, locks, and RBAC can all be applied at management group, subscription, resource group, or resource scope and are inherited downward."},
          {cmd:"SUB=$(az account show --query id -o tsv); echo $SUB", why:"Saves your subscription ID for building scope paths."},
        ]},
      { title:"Azure Policy: restrict allowed regions",
        context:"Azure Policy answers 'are my resources COMPLIANT with company rules?'. It does not grant access to anyone.",
        cmds:[
          {cmd:`az policy assignment create \\
  --name allowed-locations \\
  --display-name "Allowed locations" \\
  --scope /subscriptions/$SUB/resourceGroups/rg-gov-lab \\
  --policy e56962a6-4747-49cd-b67b-bf8b01975c4c \\
  --params '{"listOfAllowedLocations":{"value":["uaenorth","uaecentral"]}}'`, why:"Assigns the built-in 'Allowed locations' policy. Anything created outside UAE North or UAE Central in this group will be denied."},
          {cmd:"az storage account create --name stgpolicy$RANDOM --resource-group rg-gov-lab --location eastus --sku Standard_LRS", why:"This should FAIL with a RequestDisallowedByPolicy error because eastus is not an allowed location. The policy is working."},
        ]},
      { title:"Resource lock: prevent accidental deletion",
        context:"A lock protects a resource from being deleted or changed even by someone with Owner permissions. It is not about compliance or identity.",
        cmds:[
          {cmd:"az storage account create --name stglock$RANDOM --resource-group rg-gov-lab --location uaenorth --sku Standard_LRS", why:"Creates a valid resource (allowed region) to protect."},
          {cmd:"az lock create --name no-delete --lock-type CanNotDelete --resource-group rg-gov-lab", why:"CanNotDelete lets you read and modify but not delete. ReadOnly blocks changes too. The lock is inherited by every resource in the group."},
          {cmd:"az group delete --name rg-gov-lab --yes", why:"Should FAIL with a ScopeLocked error even though you are the owner. You must remove the lock first (az lock delete) - a deliberate speed bump."},
        ]},
      { title:"Azure RBAC: grant least privilege",
        context:"RBAC answers 'WHO can do WHAT at WHICH scope?'. Built-in roles: Owner (everything + assign roles), Contributor (everything except assign roles), Reader (view only).",
        cmds:[
          {cmd:"az role definition list --query \"[?roleName=='Reader'].{name:roleName, desc:description}\" -o table", why:"Reads the built-in Reader role definition. Always grant the lowest role that does the job."},
          {cmd:`az role assignment create \\
  --assignee colleague@yourtenant.onmicrosoft.com \\
  --role Reader \\
  --scope /subscriptions/$SUB/resourceGroups/rg-gov-lab`, why:"Gives your colleague view-only access to this group (replace with a real user in your tenant). They can see resources but not change or delete them."},
          {cmd:"az role assignment list --resource-group rg-gov-lab --output table", why:"Audit who has access. Includes inherited assignments from higher scopes."},
        ]},
      { title:"Compare the three tools",
        cmds:[
          {cmd:"Azure Policy = enforces RULES on resources (compliance, allowed regions, required tags)", why:"Question to ask: 'Is this resource allowed to exist in this form?'"},
          {cmd:"Resource lock = blocks DELETE/EDIT on a resource (even for Owners)", why:"Question to ask: 'Can someone accidentally delete this?'"},
          {cmd:"Azure RBAC = controls WHO can perform actions (identity permissions)", why:"Question to ask: 'Is this person allowed to do this action?'"},
        ]},
      { title:"Clean up",
        cmds:[
          {cmd:`az lock delete --name no-delete --resource-group rg-gov-lab
az policy assignment delete --name allowed-locations --scope /subscriptions/$SUB/resourceGroups/rg-gov-lab
az group delete --name rg-gov-lab --yes --no-wait`, why:"Remove the lock first, then the policy assignment, then the group. Locks must be removed before deletion works."},
        ]},
    ]
  },
  {
    id:"bicep-monitor", phase:"advanced",
    title:"Infrastructure as Code with Bicep + Monitoring",
    subtitle:"Repeatable deployments through ARM, then watch with Azure Monitor",
    emoji:"⚙️", duration:"~40 min", difficulty:"Advanced",
    examWeight:"High",
    goal:"Deploy a storage account from a Bicep file instead of clicking in the portal, see how Azure Resource Manager handles it, then inspect metrics and recommendations with Azure Monitor and Azure Advisor.",
    concepts:["Bicep","ARM template","Infrastructure as code","Azure Resource Manager","Azure Monitor","Azure Advisor"],
    steps:[
      { title:"Write the Bicep file",
        context:"Bicep is a simpler syntax that compiles to ARM templates. Both are declarative: you describe the desired end state and ARM figures out how to get there.",
        cmds:[
          {cmd:`cat > main.bicep <<'EOF'
param storageName string
param location string = resourceGroup().location

resource sa 'Microsoft.Storage/storageAccounts@2023-01-01' = {
  name: storageName
  location: location
  sku: {
    name: 'Standard_LRS'
  }
  kind: 'StorageV2'
}

output storageId string = sa.id
EOF`, why:"Defines one storage account with two parameters. The same file deploys identically every time - consistency and repeatability are the main benefits of IaC."},
        ]},
      { title:"Deploy it through Azure Resource Manager",
        cmds:[
          {cmd:"az group create --name rg-iac-lab --location uaenorth", why:"Target group for the deployment."},
          {cmd:`az deployment group create \\
  --resource-group rg-iac-lab \\
  --template-file main.bicep \\
  --parameters storageName=stgiac$RANDOM`, why:"Sends the template to Azure Resource Manager. ARM validates it, checks your permissions, and creates the resource. Re-running it is idempotent: it will not create duplicates."},
          {cmd:"az deployment group list --resource-group rg-iac-lab --output table", why:"Every deployment is recorded in the group's deployment history, which is useful for auditing and troubleshooting."},
        ]},
      { title:"Inspect with Azure Monitor",
        context:"Azure Monitor collects metrics (numeric, near real-time) and logs (detailed events) from your resources.",
        cmds:[
          {cmd:"SAID=$(az storage account list -g rg-iac-lab --query \"[0].id\" -o tsv); echo $SAID", why:"Grabs the resource ID of the new storage account."},
          {cmd:"az monitor metrics list --resource $SAID --metric Availability --interval PT1H --output table", why:"Reads the Availability metric. Metrics are retained for 93 days by default and can drive alerts and autoscale."},
          {cmd:"az monitor metrics list-definitions --resource $SAID --output table", why:"Shows every metric available for this resource type."},
        ]},
      { title:"Review recommendations with Azure Advisor",
        context:"Advisor analyzes your resources and recommends improvements in five categories: Reliability, Security, Performance, Cost, and Operational Excellence.",
        cmds:[
          {cmd:"az advisor recommendation list --output table", why:"Lists recommendations. A new tiny lab may have few or none. In production this catches idle VMs, missing backups, and exposed endpoints."},
          {cmd:"Portal > Service Health > Planned maintenance / Health advisories", why:"Service Health shows Azure incidents that affect YOUR subscriptions and regions. Resource Health shows the status of one specific resource. Azure status shows global status for everyone."},
        ]},
      { title:"Clean up",
        cmds:[
          {cmd:"az group delete --name rg-iac-lab --yes --no-wait", why:"Removes everything the template created."},
        ]},
    ]
  },
];

// ─── PHASES ──────────────────────────────────────────────────────────────────
const PHASES = [
  {
    id:"foundation", level:"BASIC", title:"Cloud Concepts",
    subtitle:"Domain 1 · 25-30% of the exam", duration:"2 Weeks",
    color:T.cyan, glow:T.cyanGlow, icon:"☁", badge:"L1",
    topics:[
      { title:"What Is Cloud Computing?",
        keywords:["Cloud Computing","CapEx","OpEx","Consumption-based model","Region"],
        explanation:`Cloud Computing means renting computing services - servers, storage, databases, networking, software, analytics - over the internet instead of buying and running your own hardware. Microsoft Azure is a public cloud platform with over 200 products and cloud services running in datacenters around the world.\n\nWHY COMPANIES MOVE TO THE CLOUD:\n• No large up-front hardware purchase\n• Resources appear in minutes instead of weeks\n• Pay only for what you use\n• Provider handles physical security, power, cooling, and hardware replacement\n\nCapEx vs OpEx - a favorite exam topic:\n• CapEx (Capital Expenditure) is up-front spending on physical infrastructure, depreciated over time. Typical of on-premises datacenters.\n• OpEx (Operational Expenditure) is spending on services as you consume them, billed per use. Typical of cloud.\n\nCONSUMPTION-BASED MODEL: You pay for what you use. No up-front costs, no termination fees, and you can stop paying simply by stopping the resource. This is why cloud shifts spending from CapEx to OpEx.`,
        subtopics:["Definition of cloud computing","CapEx vs OpEx","Consumption-based pricing","Benefits of Azure's global infrastructure","On-premises vs cloud trade-offs"],
        commands:[
          {cmd:"az login",desc:"Signs in to Azure from the CLI using your browser."},
          {cmd:"az account show --output table",desc:"Shows the active subscription and tenant."},
          {cmd:"az account list-locations -o table",desc:"Lists the regions available to your subscription."},
          {cmd:"az version",desc:"Displays the installed Azure CLI version."},
        ],
        resources:[
          {title:"Microsoft Learn - Describe cloud concepts",url:"https://learn.microsoft.com/training/paths/microsoft-azure-fundamentals-describe-cloud-concepts/"},
          {title:"What is cloud computing?",url:"https://azure.microsoft.com/resources/cloud-computing-dictionary/what-is-cloud-computing"},
        ]},
      { title:"Benefits of Cloud Services",
        keywords:["High availability","Scalability","Elasticity","Reliability","Predictability","SLA"],
        explanation:`The exam tests six major benefits of cloud computing. Learn to match a scenario to the correct benefit.\n\nHIGH AVAILABILITY: Workloads stay online with minimal downtime even when components fail. Backed by an SLA (e.g., 99.9% or 99.99% uptime).\n\nSCALABILITY: Adjust resources to meet demand.\n• Vertical scaling (scale up/down): make one VM bigger or smaller (more CPU or RAM).\n• Horizontal scaling (scale out/in): add or remove VM instances.\n\nELASTICITY: Scalability that happens AUTOMATICALLY. Resources grow during a traffic spike and shrink afterward so you never overpay.\n\nRELIABILITY: The system recovers from failures and continues running thanks to a decentralized global design and redundancy.\n\nPREDICTABILITY: Performance predictability (autoscaling and load balancing) and cost predictability (forecasting with the Pricing Calculator).\n\nSECURITY AND GOVERNANCE: Built-in tools, compliance certifications, and policy enforcement.\n\nMANAGEABILITY: Manage resources through the portal, CLI, APIs, and templates; monitor and automate.\n\nEXAM TIP: 'Automatically adds VMs during a sale, then removes them' = Elasticity. 'Can grow when needed' = Scalability.`,
        subtopics:["High availability and SLAs","Vertical vs horizontal scaling","Scalability vs elasticity","Reliability and predictability","Security, governance, manageability"],
        commands:[
          {cmd:"az vm resize --resource-group rg --name vm1 --size Standard_D4s_v5",desc:"Vertical scaling: change the size of an existing VM."},
          {cmd:"az vmss scale --resource-group rg --name myScaleSet --new-capacity 5",desc:"Horizontal scaling: set the number of VM instances in a scale set."},
          {cmd:"az monitor autoscale create --resource-group rg --resource myScaleSet --resource-type Microsoft.Compute/virtualMachineScaleSets --min-count 2 --max-count 10 --count 2",desc:"Creates an autoscale setting - elasticity in action."},
        ],
        resources:[
          {title:"Benefits of cloud computing",url:"https://learn.microsoft.com/training/modules/describe-benefits-use-cloud-services/"},
          {title:"Azure Architecture Center",url:"https://learn.microsoft.com/azure/architecture/"},
        ]},
      { title:"Shared Responsibility Model",
        keywords:["Shared Responsibility Model","IaaS","PaaS","SaaS","Zero Trust"],
        explanation:`In the cloud, security and operations are split between Microsoft and the customer. The Shared Responsibility Model defines who handles what.\n\nALWAYS THE CUSTOMER'S RESPONSIBILITY (in every model):\n• Information and data\n• Devices (mobile and PCs)\n• Accounts and identities\n\nALWAYS MICROSOFT'S RESPONSIBILITY (in every model):\n• Physical datacenter\n• Physical network\n• Physical hosts\n\nIT VARIES BY SERVICE TYPE:\n• On-premises: you manage everything.\n• IaaS: Microsoft manages the physical layers; you manage OS, network controls, and applications.\n• PaaS: Microsoft also manages the OS and runtime; you manage applications and some network controls.\n• SaaS: Microsoft manages almost everything; you still manage data, devices, and identities.\n\nRULE OF THUMB: Moving from IaaS to PaaS to SaaS shifts more responsibility to Microsoft, but you can NEVER hand off responsibility for your data and identities.`,
        subtopics:["Provider vs customer responsibilities","Responsibilities by service type","What the customer always owns","Physical vs logical security"],
        commands:[
          {cmd:"az vm show --resource-group rg --name vm1 --query storageProfile.osDisk",desc:"With IaaS you manage the OS - this reveals the OS disk you are responsible for patching."},
          {cmd:"az webapp list --output table",desc:"With PaaS App Service, Azure patches the OS for you."},
        ],
        resources:[
          {title:"Shared responsibility in the cloud",url:"https://learn.microsoft.com/azure/security/fundamentals/shared-responsibility"},
        ]},
      { title:"Cloud Service Types: IaaS, PaaS, SaaS",
        keywords:["IaaS","PaaS","SaaS","Serverless","Virtual Machine","App Service","Azure Functions"],
        explanation:`Cloud services come in three main models. The difference is how much YOU manage.\n\nIaaS (Infrastructure as a Service): You rent virtualized hardware. You install and patch the OS and apps. Example: Azure Virtual Machines. Use for lift-and-shift migrations, custom OS needs, and full control.\n\nPaaS (Platform as a Service): The provider manages the OS and runtime. You deploy your code and data. Examples: Azure App Service, Azure SQL Database. Use to focus on development, not infrastructure.\n\nSaaS (Software as a Service): Fully managed finished software. Examples: Microsoft 365, Dynamics 365, Outlook.com. You just use it.\n\nSERVERLESS: A related model where the provider manages all servers and scales code automatically; you pay only when your code runs. Example: Azure Functions, Logic Apps.\n\nHOW TO ANSWER EXAM QUESTIONS:\n• 'Need full control of the OS' = IaaS\n• 'Developers want to deploy code without managing servers' = PaaS\n• 'Employees need email' = SaaS\n• 'Run code only when an event happens, pay per execution' = Serverless`,
        subtopics:["IaaS: most control","PaaS: focus on apps","SaaS: ready to use","Serverless computing","Choosing the right model"],
        commands:[
          {cmd:"az vm create --resource-group rg --name vm1 --image Ubuntu2204",desc:"IaaS: creates a virtual machine you must manage."},
          {cmd:"az webapp create --resource-group rg --plan myplan --name myapp123 --runtime \"NODE:20-lts\"",desc:"PaaS: creates an App Service web app without managing servers."},
          {cmd:"az functionapp create --resource-group rg --name myfunc123 --storage-account mystorage --consumption-plan-location uaenorth --runtime node",desc:"Serverless: creates a Function App on the Consumption plan."},
        ],
        resources:[
          {title:"Describe cloud service types",url:"https://learn.microsoft.com/training/modules/describe-cloud-compute/"},
        ]},
      { title:"Cloud Models: Public, Private, Hybrid",
        keywords:["Public cloud","Private cloud","Hybrid cloud","Azure Arc","CapEx","OpEx"],
        explanation:`Where your cloud runs and who owns it defines the cloud model.\n\nPUBLIC CLOUD: Owned and operated by a provider like Microsoft and shared by many customers (multi-tenant). No CapEx, near-unlimited scale, pay-as-you-go. Azure is a public cloud.\n\nPRIVATE CLOUD: Used by a single organization, either in its own datacenter or hosted by a third party. Maximum control and compliance, but the organization pays CapEx and handles maintenance.\n\nHYBRID CLOUD: Combines public and private (or on-premises). Data and apps can move between them. Use when some data must stay on-premises for regulation, latency, or legacy reasons, while other workloads use Azure's scale. Azure Arc and Azure Stack help manage hybrid environments.\n\nMULTI-CLOUD: Using services from more than one cloud provider. Azure Arc can manage resources across providers.\n\nCOMPARISON:\n• Public: lowest cost, least control, highest scalability\n• Private: highest cost, most control, limited scalability\n• Hybrid: balance of both, more complexity`,
        subtopics:["Public cloud benefits","Private cloud trade-offs","Hybrid cloud scenarios","Multi-cloud and Azure Arc","Choosing a cloud model"],
        commands:[
          {cmd:"az connectedmachine list --output table",desc:"Lists servers connected through Azure Arc (hybrid management). Requires the connectedmachine extension."},
          {cmd:"az extension add --name connectedmachine",desc:"Installs the Azure Arc-enabled servers CLI extension."},
        ],
        resources:[
          {title:"Describe cloud models",url:"https://learn.microsoft.com/training/modules/describe-cloud-compute/"},
          {title:"Azure Arc overview",url:"https://learn.microsoft.com/azure/azure-arc/overview"},
        ]},
    ],
    labs:[
      {title:"Lab 1: Free Account & Portal Tour",difficulty:"Easy",desc:"Create an Azure free account. Explore the portal: Dashboard, All services, and Cost Management. Open Cloud Shell and run az account show.",
       solution:"# 1. Sign up at https://azure.microsoft.com/free/\n# 2. Portal > click the >_ icon to open Cloud Shell (Bash)\naz account show --output table\naz account list-locations -o table | head\n# 3. Portal > Cost Management + Billing > note the free credit balance"},
      {title:"Lab 2: Match the Benefit",difficulty:"Easy",desc:"Write down which cloud benefit each scenario shows: (a) traffic spike auto-adds servers, (b) site stays up when a datacenter fails, (c) you can estimate next month's bill.",
       solution:"(a) Elasticity (automatic scaling)\n(b) High availability / Reliability\n(c) Predictability (cost) - use the Pricing Calculator\n\nBonus: make a VM bigger = vertical scaling.\nAdd more VMs = horizontal scaling."},
      {title:"Lab 3: Responsibility Matrix",difficulty:"Medium",desc:"Draw a table with columns On-premises / IaaS / PaaS / SaaS and rows for Data, Apps, OS, Network, Physical. Mark Customer or Microsoft in each cell.",
       solution:"Row: Data         -> Customer in ALL columns\nRow: Applications -> Customer, Customer, Customer, Microsoft(SaaS)\nRow: OS           -> Customer, Customer, Microsoft, Microsoft\nRow: Network ctrl -> Customer, Shared,   Shared,    Microsoft\nRow: Physical     -> Customer, Microsoft, Microsoft, Microsoft\n\nRemember: identities, devices, and data are always the customer's."},
      {title:"Lab 4: Classify 10 Services",difficulty:"Medium",desc:"Classify each as IaaS, PaaS, SaaS, or Serverless: Azure VM, Microsoft 365, Azure SQL Database, Azure Functions, App Service, Dynamics 365, Azure Kubernetes Service, Logic Apps, Virtual Machine Scale Set, Azure Cosmos DB.",
       solution:"Azure VM = IaaS\nVM Scale Set = IaaS\nAKS = PaaS (managed Kubernetes, you manage nodes)\nAzure SQL Database = PaaS\nCosmos DB = PaaS\nApp Service = PaaS\nAzure Functions = Serverless (PaaS)\nLogic Apps = Serverless (PaaS)\nMicrosoft 365 = SaaS\nDynamics 365 = SaaS"},
    ],
    assessment:{title:"L1 Cloud Concepts Quiz",questions:[
      {q:"A retailer's website automatically adds servers during a holiday sale and removes them afterward. Which cloud benefit is this?",options:["High availability","Elasticity","Predictability","Manageability"],answer:1,explain:"Elasticity is automatic scaling up and down with demand. Scalability alone only means the ability to scale; elasticity means it happens automatically."},
      {q:"Which expenditure type is associated with buying physical servers for an on-premises datacenter?",options:["OpEx","CapEx","Consumption-based","Subscription-based"],answer:1,explain:"CapEx is up-front spending on physical assets. Cloud services are generally OpEx."},
      {q:"In every cloud service model (IaaS, PaaS, SaaS), which item is ALWAYS the customer's responsibility?",options:["Physical network","Operating system patching","Information and data","Physical hosts"],answer:2,explain:"Data, devices, and identities remain the customer's responsibility in all models. Physical layers are always Microsoft's in the cloud."},
      {q:"A company wants developers to deploy web code without managing servers or operating system patches. Which model fits best?",options:["IaaS","PaaS","On-premises","Private cloud"],answer:1,explain:"PaaS (e.g., Azure App Service) lets developers focus on code while the provider manages OS and runtime."},
      {q:"Your company must keep sensitive data in its own datacenter but wants to use Azure for burst capacity. Which cloud model is this?",options:["Public cloud","Private cloud","Hybrid cloud","Community cloud"],answer:2,explain:"Hybrid cloud combines on-premises/private infrastructure with the public cloud."},
      {q:"Making a single VM larger by adding more CPU and RAM is an example of what?",options:["Horizontal scaling","Vertical scaling","Elasticity","Load balancing"],answer:1,explain:"Vertical scaling (scale up) changes the size of an instance. Horizontal scaling (scale out) changes the number of instances."},
    ]}
  },
  {
    id:"intermediate", level:"INTERMEDIATE", title:"Architecture & Services",
    subtitle:"Domain 2 · 35-40% of the exam", duration:"3 Weeks",
    color:T.violet, glow:T.violetGlow, icon:"◈", badge:"L2",
    topics:[
      { title:"Regions, Availability Zones & Resource Hierarchy",
        keywords:["Region","Availability Zone","Region pair","Geography","Management group","Subscription","Resource group","Azure Resource Manager"],
        explanation:`PHYSICAL INFRASTRUCTURE:\n• Datacenter: a building with servers, power, cooling, and networking.\n• Region: a set of datacenters deployed within a latency-defined perimeter and connected by a dedicated low-latency network. Example: UAE North.\n• Availability Zones: physically separate locations inside a region, each with independent power, cooling, and networking. Regions with zones have at least three. Zones protect against datacenter failure.\n• Region pairs: two regions in the same geography, paired for disaster recovery. Updates roll out to one region of a pair at a time.\n• Geography: a market boundary (e.g., Europe) that preserves data residency and compliance.\n• Sovereign regions: isolated instances for compliance, such as Azure Government (US) and Azure China (21Vianet).\n\nMANAGEMENT HIERARCHY (top to bottom):\nManagement groups > Subscriptions > Resource groups > Resources\n\n• Management groups apply governance across multiple subscriptions.\n• A subscription is a billing and access boundary.\n• A resource group is a logical container; a resource lives in exactly one group.\n• Policies and RBAC assigned at a higher scope are INHERITED by everything below.\n\nAzure Resource Manager (ARM) is the management layer through which the portal, CLI, PowerShell, and templates all talk to Azure.`,
        subtopics:["Regions and Availability Zones","Region pairs and geographies","Sovereign regions","Management groups, subscriptions, resource groups","Inheritance of policy and RBAC","Azure Resource Manager"],
        commands:[
          {cmd:"az account list-locations --query \"[].{Name:name, Region:regionalDisplayName}\" -o table",desc:"Lists all regions with display names."},
          {cmd:"az group create --name rg1 --location uaenorth",desc:"Creates a resource group in UAE North."},
          {cmd:"az account management-group list -o table",desc:"Lists management groups in your tenant."},
          {cmd:"az account subscription list -o table",desc:"Lists subscriptions you can access."},
          {cmd:"az resource list --resource-group rg1 -o table",desc:"Lists resources in a resource group."},
        ],
        resources:[
          {title:"Azure global infrastructure",url:"https://azure.microsoft.com/explore/global-infrastructure/"},
          {title:"Products available by region",url:"https://azure.microsoft.com/explore/global-infrastructure/products-by-region/"},
          {title:"Azure management hierarchy",url:"https://learn.microsoft.com/azure/governance/management-groups/overview"},
        ]},
      { title:"Compute Services",
        keywords:["Virtual Machine","Virtual Machine Scale Set","Availability Set","App Service","Azure Functions","Azure Container Instances","Azure Kubernetes Service","Azure Virtual Desktop","Spot VM","Azure Reservations"],
        explanation:`Azure offers many ways to run code. Pick the one that fits the level of control you need.\n\nVIRTUAL MACHINES (IaaS): Full control of the OS. Good for lift-and-shift, custom software, and legacy apps. You patch and secure the OS. VM billing stops only when the VM is deallocated.\n\nVM SCALE SETS: A group of identical VMs that scale automatically with demand. Gives high availability and elasticity.\n\nAVAILABILITY SETS: Spread VMs across fault domains (hardware) and update domains (maintenance) inside one datacenter. Availability Zones go further by spreading VMs across datacenters.\n\nAPP SERVICE (PaaS): Host web apps, APIs, and mobile backends without managing servers. Supports autoscale and deployment slots.\n\nAZURE FUNCTIONS (serverless): Run small code snippets triggered by events. Pay only while code executes.\n\nCONTAINERS:\n• Azure Container Instances (ACI): run a container quickly with no orchestration.\n• Azure Kubernetes Service (AKS): managed Kubernetes for orchestrating many containers.\n• Azure Container Apps: serverless containers.\n\nAZURE VIRTUAL DESKTOP: Windows desktops and apps in the cloud for remote users.\n\nCOST OPTIONS: Pay-as-you-go, Reservations (1 or 3 years), Spot VMs (discounted, evictable), Azure Hybrid Benefit (reuse Windows/SQL licenses).`,
        subtopics:["Virtual machines and scale sets","Availability sets vs availability zones","App Service and Functions","Containers: ACI and AKS","Azure Virtual Desktop","Compute cost options"],
        commands:[
          {cmd:"az vm create --resource-group rg1 --name vm1 --image Ubuntu2204 --generate-ssh-keys",desc:"Creates a Linux VM."},
          {cmd:"az vm list -d -o table",desc:"Lists VMs with power state and IPs."},
          {cmd:"az vm deallocate --resource-group rg1 --name vm1",desc:"Stops the VM and releases compute, stopping compute charges."},
          {cmd:"az vmss create --resource-group rg1 --name ss1 --image Ubuntu2204 --instance-count 2 --generate-ssh-keys",desc:"Creates a scale set with 2 instances."},
          {cmd:"az container create --resource-group rg1 --name aci1 --image mcr.microsoft.com/azuredocs/aci-helloworld --dns-name-label aci-demo-az900 --ports 80",desc:"Runs a container in ACI with a public DNS name."},
        ],
        resources:[
          {title:"Azure compute services",url:"https://learn.microsoft.com/training/modules/describe-azure-compute-networking-services/"},
          {title:"Choose an Azure compute service",url:"https://learn.microsoft.com/azure/architecture/guide/technology-choices/compute-decision-tree"},
        ]},
      { title:"Networking Services",
        keywords:["Virtual Network","Subnet","Network Security Group","VNet peering","VPN Gateway","ExpressRoute","Azure DNS","Azure Load Balancer","Application Gateway","Azure Front Door"],
        explanation:`VIRTUAL NETWORK (VNet): Your private, isolated network in Azure. Divided into subnets. Resources in the same VNet communicate by default. VNets are free; you pay for gateways and data transfer.\n\nNETWORK SECURITY GROUPS (NSG): Allow/deny rules by source, destination, port, and protocol. Attached to subnets or NICs. Rules are processed by priority, lowest number first.\n\nVNET PEERING: Connect two VNets over the Microsoft backbone. Works across regions.\n\nCONNECTING TO ON-PREMISES:\n• VPN Gateway: encrypted tunnel over the PUBLIC internet. Fast to set up, cheaper.\n• ExpressRoute: PRIVATE dedicated connection that does NOT use the public internet. More reliable, lower latency, higher cost.\n\nAZURE DNS: Host DNS zones and records on Azure infrastructure.\n\nLOAD BALANCING - match the layer and scope:\n• Azure Load Balancer: layer 4 (TCP/UDP), regional.\n• Application Gateway: layer 7 (HTTP/S), regional, with WAF.\n• Azure Front Door: layer 7, GLOBAL, with acceleration and WAF.\n• Traffic Manager: DNS-based global traffic routing.\n\nEXAM TIP: 'Dedicated private connection, not over the internet' = ExpressRoute. 'Encrypted over the internet' = VPN Gateway.`,
        subtopics:["VNets and subnets","NSGs and rule priority","VNet peering","VPN Gateway vs ExpressRoute","Azure DNS","Load Balancer vs Application Gateway vs Front Door"],
        commands:[
          {cmd:"az network vnet create --resource-group rg1 --name vnet1 --address-prefix 10.0.0.0/16 --subnet-name web --subnet-prefixes 10.0.1.0/24",desc:"Creates a VNet with one subnet."},
          {cmd:"az network nsg create --resource-group rg1 --name nsg-web",desc:"Creates a Network Security Group."},
          {cmd:"az network nsg rule create --resource-group rg1 --nsg-name nsg-web --name allow-http --priority 100 --destination-port-ranges 80 --access Allow --protocol Tcp",desc:"Adds an inbound rule that allows HTTP."},
          {cmd:"az network vnet peering create --resource-group rg1 --name peer1 --vnet-name vnet1 --remote-vnet vnet2 --allow-vnet-access",desc:"Peers vnet1 with vnet2 (repeat in the other direction)."},
          {cmd:"az network public-ip list -o table",desc:"Lists public IP addresses."},
        ],
        resources:[
          {title:"Azure networking services",url:"https://learn.microsoft.com/training/modules/describe-azure-compute-networking-services/"},
          {title:"Load balancing options",url:"https://learn.microsoft.com/azure/architecture/guide/technology-choices/load-balancing-overview"},
        ]},
      { title:"Storage Services",
        keywords:["Storage account","Blob storage","Access tier","Azure Files","LRS","ZRS","GRS","GZRS","AzCopy","Azure Data Box"],
        explanation:`A storage account is a globally unique namespace that provides these services:\n• Blob storage - unstructured object data (images, video, backups, logs)\n• Azure Files - SMB/NFS file shares\n• Queue storage - messaging between app components\n• Table storage - NoSQL key/value\n• Managed Disks - disks for VMs\n\nBLOB ACCESS TIERS:\n• Hot - frequent access, highest storage cost, lowest access cost\n• Cool - infrequent, stored 30+ days\n• Cold - rare, stored 90+ days\n• Archive - offline, stored 180+ days, cheapest storage, hours to rehydrate\n\nREDUNDANCY - choose by the failure you must survive:\n• LRS: 3 copies in one datacenter. Survives drive/rack failure.\n• ZRS: 3 copies across 3 availability zones. Survives a datacenter failure.\n• GRS: LRS + copy to paired region (6 total). Survives a regional outage.\n• GZRS: ZRS + copy to paired region. Best protection.\n• RA-GRS / RA-GZRS: same, plus READ access to the secondary region.\n\nDATA MOVEMENT TOOLS: AzCopy (command-line), Azure Storage Explorer (GUI), Azure File Sync, Azure Migrate (servers/databases/apps), Azure Data Box (physical device for huge offline transfers).\n\nDATABASES TO KNOW: Azure SQL Database (managed relational PaaS), Azure Cosmos DB (global NoSQL), Azure Database for MySQL/PostgreSQL.`,
        subtopics:["Storage account services","Blob access tiers","Redundancy options LRS to GZRS","Azure Files and managed disks","AzCopy, Storage Explorer, Data Box","Azure Migrate and database services"],
        commands:[
          {cmd:"az storage account create --name stg123abc --resource-group rg1 --sku Standard_GRS --kind StorageV2",desc:"Creates a geo-redundant storage account."},
          {cmd:"az storage container create --account-name stg123abc --name data --auth-mode login",desc:"Creates a blob container."},
          {cmd:"az storage blob set-tier --account-name stg123abc --container-name data --name file.txt --tier Cool --auth-mode login",desc:"Changes a blob's access tier."},
          {cmd:"azcopy copy './local' 'https://stg123abc.blob.core.windows.net/data' --recursive",desc:"Bulk uploads a folder with AzCopy (needs authentication or SAS)."},
          {cmd:"az storage share-rm create --storage-account stg123abc --name myshare --quota 100",desc:"Creates a 100 GiB Azure Files share."},
        ],
        resources:[
          {title:"Azure storage services",url:"https://learn.microsoft.com/training/modules/describe-azure-storage-services/"},
          {title:"Storage redundancy",url:"https://learn.microsoft.com/azure/storage/common/storage-redundancy"},
          {title:"Blob access tiers",url:"https://learn.microsoft.com/azure/storage/blobs/access-tiers-overview"},
        ]},
      { title:"Identity, Access & Security",
        keywords:["Microsoft Entra ID","Authentication","Authorization","Multifactor authentication","Conditional Access","Single sign-on","Passwordless authentication","Azure RBAC","Zero Trust","Defense in depth","Microsoft Defender for Cloud"],
        explanation:`MICROSOFT ENTRA ID (formerly Azure Active Directory) is Microsoft's cloud identity service. It provides:\n• Authentication - proving WHO you are\n• Single sign-on (SSO) - one login for many apps\n• Multifactor authentication (MFA) - two or more verification methods\n• Passwordless sign-in - Windows Hello, Authenticator app, FIDO2 keys\n• Conditional Access - if-then policies using signals like location, device, and risk\n• External identities - B2B for partners, B2C for customers\n\nAUTHENTICATION vs AUTHORIZATION:\n• Authentication = Who are you?\n• Authorization = What are you allowed to do? (Azure RBAC)\n\nAZURE RBAC: Assign a role (Owner, Contributor, Reader, or custom) to a user, group, or service principal at a scope. Permissions flow down the hierarchy.\n\nZERO TRUST principles: verify explicitly, use least-privilege access, assume breach.\n\nDEFENSE IN DEPTH layers (outside in): Physical > Identity & access > Perimeter > Network > Compute > Application > Data.\n\nMICROSOFT DEFENDER FOR CLOUD: Gives a secure score, recommendations, and threat protection for Azure, hybrid, and multi-cloud workloads.`,
        subtopics:["Entra ID and SSO","MFA and passwordless","Conditional Access","Authentication vs authorization","Azure RBAC roles and scope","Zero Trust and defense in depth","Defender for Cloud"],
        commands:[
          {cmd:"az ad user list --query \"[].userPrincipalName\" -o tsv",desc:"Lists users in your Entra ID tenant."},
          {cmd:"az role assignment create --assignee user@domain.com --role Reader --resource-group rg1",desc:"Grants Reader on a resource group."},
          {cmd:"az role assignment list --all -o table",desc:"Audits all role assignments in the subscription."},
          {cmd:"az role definition list --query \"[?roleType=='BuiltInRole'].roleName\" -o tsv | head -20",desc:"Lists some built-in roles."},
          {cmd:"az security pricing list -o table",desc:"Shows Defender for Cloud plan status per resource type."},
        ],
        resources:[
          {title:"Azure identity, access, and security",url:"https://learn.microsoft.com/training/modules/describe-azure-identity-access-security/"},
          {title:"What is Microsoft Entra ID?",url:"https://learn.microsoft.com/entra/fundamentals/whatis"},
          {title:"Zero Trust guidance",url:"https://learn.microsoft.com/security/zero-trust/zero-trust-overview"},
        ]},
    ],
    labs:[
      {title:"Lab 5: Region & Zone Planning",difficulty:"Medium",desc:"Pick a workload that must survive a datacenter failure but stay in the UAE. Decide which region, whether to use Availability Zones, and which storage redundancy option fits.",
       solution:"Region: UAE North (has Availability Zones; paired with UAE Central)\nCompute: deploy VMs across Zones 1, 2, 3 (or use a zone-redundant scale set)\nStorage: ZRS (survives datacenter failure inside the region)\nIf the whole region must be survivable: GZRS (secondary in the paired region)\n\nCheck zone support:\naz vm list-skus --location uaenorth --size Standard_D2s_v5 --zone -o table"},
      {title:"Lab 6: Build a Network",difficulty:"Medium",desc:"Create a VNet with two subnets (web, db). Create an NSG that allows HTTP to web and denies everything to db from the internet. Attach the NSGs.",
       solution:"az group create -n rg-net -l uaenorth\naz network vnet create -g rg-net -n vnet1 --address-prefix 10.0.0.0/16 --subnet-name web --subnet-prefixes 10.0.1.0/24\naz network vnet subnet create -g rg-net --vnet-name vnet1 -n db --address-prefixes 10.0.2.0/24\naz network nsg create -g rg-net -n nsg-web\naz network nsg rule create -g rg-net --nsg-name nsg-web -n allow-http --priority 100 --destination-port-ranges 80 --access Allow --protocol Tcp\naz network nsg create -g rg-net -n nsg-db\naz network vnet subnet update -g rg-net --vnet-name vnet1 -n web --network-security-group nsg-web\naz network vnet subnet update -g rg-net --vnet-name vnet1 -n db --network-security-group nsg-db\naz group delete -n rg-net --yes --no-wait"},
      {title:"Lab 7: Storage Decision Table",difficulty:"Medium",desc:"Choose the redundancy option for each: (a) cheapest dev data, (b) must survive a datacenter failure, (c) must survive a regional disaster with read access to the secondary.",
       solution:"(a) LRS - cheapest, 3 copies in one datacenter\n(b) ZRS - 3 copies across 3 zones\n(c) RA-GRS (or RA-GZRS) - copied to the paired region AND readable there\n\nTier hints:\nFrequently read = Hot | Monthly backups = Cool/Cold | 7-year compliance archive = Archive"},
      {title:"Lab 8: Identity Layers",difficulty:"Hard",desc:"Design sign-in for a company: SSO for SaaS apps, MFA for admins, block sign-in from outside approved countries, grant a contractor read-only access to one resource group.",
       solution:"SSO: register the SaaS apps as enterprise applications in Microsoft Entra ID\nMFA for admins: Conditional Access policy -> Users: Directory roles (admins) -> Grant: Require multifactor authentication\nGeo-block: Conditional Access -> Conditions: Locations (exclude trusted countries) -> Block access\nContractor: invite as a guest user (B2B), then\naz role assignment create --assignee contractor@partner.com --role Reader --resource-group rg-projectX"},
    ],
    assessment:{title:"L2 Architecture & Services Quiz",questions:[
      {q:"Which storage redundancy option protects data against the failure of an entire datacenter within a region at the LOWEST cost?",options:["LRS","ZRS","GRS","RA-GRS"],answer:1,explain:"ZRS copies data across three availability zones (separate datacenters) in one region. LRS stays in one datacenter and does not survive a datacenter failure. GRS/RA-GRS cost more and are for regional disasters."},
      {q:"Which service provides a private, dedicated connection between on-premises and Azure that does NOT travel over the public internet?",options:["VPN Gateway","Azure ExpressRoute","VNet peering","Azure Front Door"],answer:1,explain:"ExpressRoute uses a private connectivity provider circuit. VPN Gateway tunnels encrypted traffic over the public internet. VNet peering connects two VNets in Azure."},
      {q:"What is the correct order of the Azure management hierarchy from highest to lowest?",options:["Subscription > Management group > Resource group > Resource","Management group > Subscription > Resource group > Resource","Resource group > Subscription > Management group > Resource","Management group > Resource group > Subscription > Resource"],answer:1,explain:"Management groups contain subscriptions, subscriptions contain resource groups, and resource groups contain resources. Policy and RBAC are inherited downward."},
      {q:"A team wants to run code only when a file lands in storage and pay only for execution time. Which service fits?",options:["Azure Virtual Machine","Azure Functions","Azure Virtual Desktop","Azure Kubernetes Service"],answer:1,explain:"Azure Functions is serverless and event-driven with consumption-based billing."},
      {q:"Which Microsoft Entra ID feature uses signals such as user location, device, and sign-in risk to decide whether to require MFA or block access?",options:["Azure RBAC","Conditional Access","Azure Policy","Resource locks"],answer:1,explain:"Conditional Access evaluates if-then conditions at sign-in. RBAC controls permissions on Azure resources, not sign-in conditions."},
      {q:"Which blob access tier has the lowest storage cost but requires hours to rehydrate before data can be read?",options:["Hot","Cool","Cold","Archive"],answer:3,explain:"Archive is offline storage and must be rehydrated to Hot or Cool before reading. It suits rarely accessed data kept 180+ days."},
      {q:"Which load balancing service operates at layer 7 and provides URL-based routing for HTTP/HTTPS traffic within a single region?",options:["Azure Load Balancer","Application Gateway","Azure DNS","VPN Gateway"],answer:1,explain:"Application Gateway is a regional layer 7 load balancer with URL path routing and optional WAF. Azure Load Balancer is layer 4."},
    ]}
  },
  {
    id:"advanced", level:"ADVANCED", title:"Management & Governance",
    subtitle:"Domain 3 · 30-35% of the exam", duration:"2 Weeks",
    color:T.amber, glow:T.amberGlow, icon:"✦", badge:"L3",
    topics:[
      { title:"Cost Management & Pricing",
        keywords:["Pricing calculator","TCO calculator","Cost Management","Azure Reservations","Azure Hybrid Benefit","Spot VM","Tag","Consumption-based model"],
        explanation:`FACTORS THAT AFFECT AZURE COSTS:\n• Resource type and size (VM series, SQL tier)\n• Consumption (hours running, GB stored)\n• Region (prices differ by location)\n• Bandwidth - inbound data is free; outbound data (egress) is charged\n• Subscription type (free, pay-as-you-go, Enterprise Agreement)\n• Azure Marketplace purchases\n\nTOOLS - know which one answers which question:\n• Pricing calculator: estimate the cost of NEW Azure services before deploying.\n• TCO calculator: compare on-premises cost to Azure for a MIGRATION business case.\n• Cost Management + Billing: analyze actual spend, set budgets and alerts. A budget only ALERTS - it does not stop resources.\n\nWAYS TO SAVE MONEY:\n• Azure Reservations (1 or 3 year commitment)\n• Azure Hybrid Benefit (reuse Windows Server / SQL Server licenses)\n• Spot VMs (deep discount, can be evicted)\n• Azure Advisor cost recommendations (delete idle resources, right-size)\n• Auto-shutdown / deallocate VMs when not in use\n• Tags to attribute costs to teams, projects, or environments`,
        subtopics:["Factors affecting costs","Pricing calculator vs TCO calculator","Cost Management, budgets, alerts","Reservations, Hybrid Benefit, Spot VMs","Using tags for cost allocation"],
        commands:[
          {cmd:"az consumption usage list --top 10 -o table",desc:"Lists recent usage records."},
          {cmd:"az tag create --resource-id /subscriptions/<id>/resourceGroups/rg1 --tags cost-center=1234",desc:"Applies a cost-center tag to a resource group."},
          {cmd:"az resource list --tag env=dev -o table",desc:"Finds all resources with a specific tag."},
          {cmd:"az advisor recommendation list --category Cost -o table",desc:"Shows cost-saving recommendations."},
        ],
        resources:[
          {title:"Azure Pricing Calculator",url:"https://azure.microsoft.com/pricing/calculator/"},
          {title:"TCO Calculator",url:"https://azure.microsoft.com/pricing/tco/calculator/"},
          {title:"Microsoft Cost Management",url:"https://learn.microsoft.com/azure/cost-management-billing/costs/"},
        ]},
      { title:"Governance & Compliance Tools",
        keywords:["Azure Policy","Resource lock","Microsoft Purview","Service Trust Portal","Tag","Azure RBAC","Management group"],
        explanation:`Four tools are often confused. Learn the question each one answers.\n\nAZURE POLICY: Enforces organizational rules on resources and evaluates compliance. Examples: allowed regions, allowed VM sizes, required tags. Effects include Deny, Audit, and Modify/DeployIfNotExists (remediation). Policies can be grouped into initiatives.\n\nRESOURCE LOCKS: Protect resources from accidental deletion or changes. Two types: CanNotDelete (read and modify allowed) and ReadOnly (no changes or deletes). Locks override RBAC permissions - even an Owner cannot delete until the lock is removed. Locks are inherited.\n\nAZURE RBAC: Controls WHO can do WHAT at WHICH scope.\n\nMICROSOFT PURVIEW: Data governance, compliance, and risk management across on-premises, multi-cloud, and SaaS. Classify and protect sensitive data.\n\nSERVICE TRUST PORTAL: Microsoft's library of compliance and audit reports (ISO, SOC, etc.).\n\nQUICK RECALL:\n• 'Allowed locations only' = Azure Policy\n• 'Nobody can delete this by mistake' = Resource lock\n• 'Give a user read-only access' = RBAC\n• 'Find and classify sensitive data' = Microsoft Purview\n• 'Download an audit report' = Service Trust Portal`,
        subtopics:["Azure Policy and initiatives","Resource locks","RBAC vs Policy","Microsoft Purview","Service Trust Portal"],
        commands:[
          {cmd:"az policy definition list --query \"[?policyType=='BuiltIn'].displayName\" -o tsv | head -20",desc:"Lists some built-in policy definitions."},
          {cmd:"az policy assignment create --name allowed-loc --scope /subscriptions/<id> --policy e56962a6-4747-49cd-b67b-bf8b01975c4c --params '{\"listOfAllowedLocations\":{\"value\":[\"uaenorth\"]}}'",desc:"Assigns the Allowed locations policy."},
          {cmd:"az policy state summarize",desc:"Summarizes compliance state."},
          {cmd:"az lock create --name no-delete --lock-type CanNotDelete --resource-group rg1",desc:"Prevents deletion of a resource group."},
          {cmd:"az lock list -o table",desc:"Lists all locks."},
        ],
        resources:[
          {title:"Azure Policy overview",url:"https://learn.microsoft.com/azure/governance/policy/overview"},
          {title:"Lock your resources",url:"https://learn.microsoft.com/azure/azure-resource-manager/management/lock-resources"},
          {title:"Service Trust Portal",url:"https://servicetrust.microsoft.com/"},
          {title:"Microsoft Purview",url:"https://learn.microsoft.com/purview/purview"},
        ]},
      { title:"Management Tools & Infrastructure as Code",
        keywords:["Azure portal","Azure CLI","Azure PowerShell","Azure Cloud Shell","ARM template","Bicep","Infrastructure as code","Azure Arc","Azure Resource Manager"],
        explanation:`WAYS TO MANAGE AZURE:\n• Azure portal - web GUI. Best for learning, exploring, and one-off tasks.\n• Azure Cloud Shell - browser-based Bash or PowerShell, already authenticated.\n• Azure CLI - cross-platform commands (az ...). Works in Bash, PowerShell, cmd.\n• Azure PowerShell - Az module cmdlets like New-AzResourceGroup (Verb-Noun).\n• REST APIs and SDKs - for programmatic access from your own code.\nAll of them call Azure Resource Manager, so results are consistent.\n\nINFRASTRUCTURE AS CODE (IaC): Define infrastructure in files instead of clicking. Benefits: consistency, repeatability, version control, faster deployments.\n• ARM templates - JSON, declarative.\n• Bicep - simpler language that compiles to ARM templates.\n• Terraform is a popular third-party option.\n\nAZURE ARC: Extends Azure management (Policy, Monitor, Defender, RBAC, tags) to servers, Kubernetes clusters, and databases running on-premises, at the edge, or in other clouds. The key hybrid and multi-cloud management service.\n\nEXAM TIP: 'Automate and repeat deployments with a template' = ARM template/Bicep. 'Manage on-premises servers from Azure' = Azure Arc.`,
        subtopics:["Portal, Cloud Shell, CLI, PowerShell","Azure Resource Manager as the common layer","ARM templates and Bicep","Benefits of infrastructure as code","Azure Arc for hybrid and multi-cloud"],
        commands:[
          {cmd:"az bicep install",desc:"Installs the Bicep CLI."},
          {cmd:"az deployment group create --resource-group rg1 --template-file main.bicep",desc:"Deploys a Bicep or ARM template to a resource group."},
          {cmd:"az deployment group what-if --resource-group rg1 --template-file main.bicep",desc:"Previews changes before deploying."},
          {cmd:"New-AzResourceGroup -Name rg1 -Location uaenorth",desc:"PowerShell equivalent of az group create."},
          {cmd:"Get-AzVM | Format-Table Name, Location",desc:"PowerShell cmdlet to list VMs."},
        ],
        resources:[
          {title:"Azure management tools",url:"https://learn.microsoft.com/training/modules/describe-features-tools-azure-for-governance-compliance/"},
          {title:"Bicep documentation",url:"https://learn.microsoft.com/azure/azure-resource-manager/bicep/"},
          {title:"Azure CLI documentation",url:"https://learn.microsoft.com/cli/azure/"},
        ]},
      { title:"Monitoring: Advisor, Service Health & Azure Monitor",
        keywords:["Azure Advisor","Azure Service Health","Azure Monitor","Log Analytics","Application Insights","Microsoft Defender for Cloud"],
        explanation:`AZURE ADVISOR: Personalized recommendations across five pillars: Reliability, Security, Performance, Cost, and Operational Excellence. Answers 'How can I improve my deployment?'\n\nAZURE SERVICE HEALTH: Three parts:\n• Azure status - global status of Azure services (public page)\n• Service Health - issues and planned maintenance affecting YOUR subscriptions and regions\n• Resource Health - health of ONE specific resource (e.g., one VM)\n\nAZURE MONITOR: The platform for collecting and analyzing telemetry.\n• Metrics - numeric time-series data, near real-time\n• Logs - detailed events queried with Kusto Query Language (KQL) in Log Analytics\n• Alerts - notify or trigger actions via action groups\n• Application Insights - application performance monitoring (APM)\n• Autoscale settings use monitor data\n\nMICROSOFT DEFENDER FOR CLOUD: Security posture (secure score) and threat protection.\n\nQUICK RECALL:\n• 'Is Azure having an outage affecting me?' = Service Health\n• 'Recommendations to cut cost or boost reliability' = Advisor\n• 'Collect and query logs and metrics, create alerts' = Azure Monitor\n• 'Improve security posture' = Defender for Cloud`,
        subtopics:["Azure Advisor pillars","Azure status vs Service Health vs Resource Health","Azure Monitor metrics, logs, alerts","Log Analytics and KQL","Application Insights","Defender for Cloud"],
        commands:[
          {cmd:"az advisor recommendation list -o table",desc:"Lists Advisor recommendations."},
          {cmd:"az monitor metrics list --resource <resourceId> --metric \"Percentage CPU\" -o table",desc:"Reads a VM's CPU metric."},
          {cmd:"az monitor action-group create --name ag-email --resource-group rg1 --action email admin admin@contoso.com",desc:"Creates an action group that emails an admin."},
          {cmd:"az monitor metrics alert create --name cpu-high --resource-group rg1 --scopes <vmId> --condition \"avg Percentage CPU > 80\" --action ag-email",desc:"Alerts when VM CPU exceeds 80%."},
          {cmd:"az monitor log-analytics workspace create --resource-group rg1 --workspace-name law1",desc:"Creates a Log Analytics workspace."},
        ],
        resources:[
          {title:"Azure Monitor overview",url:"https://learn.microsoft.com/azure/azure-monitor/overview"},
          {title:"Azure Advisor overview",url:"https://learn.microsoft.com/azure/advisor/advisor-overview"},
          {title:"Azure Service Health",url:"https://learn.microsoft.com/azure/service-health/overview"},
        ]},
      { title:"SLAs, Composite SLAs & Service Lifecycle",
        keywords:["SLA","Composite SLA","Public preview","General availability","High availability","Availability Zone"],
        explanation:`SERVICE LEVEL AGREEMENTS (SLA): Microsoft's formal uptime commitment per service, such as 99.9% or 99.99%. If Microsoft misses it, you may receive service credits. SLAs are defined per service, and often get better when you use redundancy features such as Availability Zones.\n\nWHAT 99.9% MEANS: about 8.76 hours of allowed downtime per year. 99.99% allows about 52.6 minutes per year.\n\nCOMPOSITE SLA: When a solution depends on multiple services, multiply their SLAs.\nExample: a web app (99.95%) + SQL database (99.99%) in series\n= 0.9995 x 0.9999 = 0.9994 = 99.94%\nThe composite is LOWER than either individual SLA. Adding redundancy (e.g., a second region) can raise it.\n\nSERVICE LIFECYCLE:\n• Private preview - invited customers only\n• Public preview - available to all to try, NOT covered by the SLA, features may change, may be limited by region\n• General availability (GA) - fully supported and covered by the SLA\n\nEXAM TIP: 'Which stage is not covered by the standard SLA?' = Preview.`,
        subtopics:["What an SLA guarantees","Calculating composite SLAs","Improving SLA through redundancy","Private preview, public preview, GA","Where to find Azure SLAs"],
        commands:[
          {cmd:"az feature list --namespace Microsoft.Compute -o table",desc:"Lists preview features (and their registration state) for a provider."},
          {cmd:"az provider list --query \"[?registrationState=='Registered'].namespace\" -o tsv",desc:"Lists resource providers registered in your subscription."},
          {cmd:"az vm list-skus --location uaenorth --zone -o table",desc:"Shows which VM sizes support Availability Zones in a region."},
        ],
        resources:[
          {title:"Azure SLAs (Microsoft licensing)",url:"https://www.microsoft.com/licensing/docs/view/Service-Level-Agreements-SLA-for-Online-Services"},
          {title:"Preview terms and lifecycle",url:"https://azure.microsoft.com/support/legal/preview-supplemental-terms/"},
        ]},
    ],
    labs:[
      {title:"Lab 9: Tagging Strategy",difficulty:"Medium",desc:"Create three resource groups with env, owner, and cost-center tags. Query resources by tag. Explain why a resource inside the group does not automatically get the tags.",
       solution:"for e in dev test prod; do\n  az group create -n rg-$e -l uaenorth --tags env=$e owner=me cost-center=1001\ndone\naz group list --tag env=dev -o table\n\n# Tags on a resource group are NOT inherited by its resources.\n# To enforce it, assign the built-in Azure Policy 'Inherit a tag from the resource group'."},
      {title:"Lab 10: Policy + Lock + RBAC",difficulty:"Hard",desc:"On one resource group: allow only UAE regions (Policy), prevent deletion (Lock), and give a colleague Reader access (RBAC). Test each control.",
       solution:"SUB=$(az account show --query id -o tsv)\naz group create -n rg-gov -l uaenorth\naz policy assignment create --name allowed-loc --scope /subscriptions/$SUB/resourceGroups/rg-gov --policy e56962a6-4747-49cd-b67b-bf8b01975c4c --params '{\"listOfAllowedLocations\":{\"value\":[\"uaenorth\",\"uaecentral\"]}}'\naz lock create -n no-delete --lock-type CanNotDelete -g rg-gov\naz role assignment create --assignee user@tenant.com --role Reader -g rg-gov\n# Test: create a resource in eastus (denied), delete the group (blocked by lock)\n# Clean up: az lock delete, az policy assignment delete, az group delete"},
      {title:"Lab 11: Calculate a Composite SLA",difficulty:"Medium",desc:"A solution uses App Service (99.95%), Azure SQL Database (99.99%), and Storage (99.9%) in series. Calculate the composite SLA and the approximate yearly downtime.",
       solution:"0.9995 x 0.9999 x 0.999 = 0.99840\nComposite SLA is about 99.84%\nDowntime per year = (1 - 0.9984) x 8760 h = about 14 hours\n\nTo improve: add a second region with Traffic Manager/Front Door, or use zone-redundant tiers."},
      {title:"Lab 12: Bicep Deployment",difficulty:"Hard",desc:"Write a Bicep file for a storage account, deploy it to two resource groups (dev and prod) with different names, and preview changes with what-if.",
       solution:"# main.bicep: param storageName string; resource sa 'Microsoft.Storage/storageAccounts@2023-01-01' = { name: storageName location: resourceGroup().location sku: { name: 'Standard_LRS' } kind: 'StorageV2' }\naz group create -n rg-dev -l uaenorth\naz group create -n rg-prod -l uaenorth\naz deployment group what-if -g rg-dev --template-file main.bicep --parameters storageName=stgdev$RANDOM\naz deployment group create -g rg-dev --template-file main.bicep --parameters storageName=stgdev$RANDOM\naz deployment group create -g rg-prod --template-file main.bicep --parameters storageName=stgprod$RANDOM\n# Same file, different parameters = repeatable infrastructure as code"},
    ],
    assessment:{title:"L3 Management & Governance Quiz",questions:[
      {q:"You want to estimate the monthly cost of a NEW workload before deploying it in Azure. Which tool should you use?",options:["TCO calculator","Pricing calculator","Cost Management","Azure Advisor"],answer:1,explain:"The Pricing calculator estimates cost of new Azure services. The TCO calculator compares on-premises with Azure. Cost Management tracks actual spend."},
      {q:"You need to ensure that no one, including subscription Owners, can accidentally delete a production resource group. What should you use?",options:["Azure Policy","Azure RBAC Reader role","Resource lock (CanNotDelete)","Azure Advisor"],answer:2,explain:"A CanNotDelete lock prevents deletion regardless of RBAC permissions until the lock is removed."},
      {q:"Which service lets you manage on-premises Windows servers and other-cloud VMs from the Azure portal using Azure Policy and Azure Monitor?",options:["Azure Arc","Azure Front Door","Azure Migrate","Azure Data Box"],answer:0,explain:"Azure Arc projects non-Azure resources into Azure Resource Manager so you can apply Azure management and governance tools to them."},
      {q:"You must ensure that all new resources are created only in approved regions. Which service enforces this?",options:["Azure RBAC","Azure Policy","Resource locks","Microsoft Purview"],answer:1,explain:"Azure Policy enforces rules such as allowed locations and can deny non-compliant deployments."},
      {q:"A solution uses two services in series with SLAs of 99.9% and 99.95%. What is true about the composite SLA?",options:["It is higher than 99.95%","It is lower than 99.9%","It equals the average of the two","It always equals 100%"],answer:1,explain:"Composite SLA is the product: 0.999 x 0.9995 = about 99.85%, lower than either individual SLA."},
      {q:"Which Azure tool provides personalized recommendations across reliability, security, performance, cost, and operational excellence?",options:["Azure Monitor","Azure Service Health","Azure Advisor","Azure Policy"],answer:2,explain:"Azure Advisor analyzes your resources and recommends best practices across those five pillars."},
      {q:"Which release stage is NOT covered by the standard Azure SLA?",options:["General availability","Public preview","Both of them","Neither of them"],answer:1,explain:"Public preview services are provided without an SLA and may change before general availability."},
    ]}
  },
];

const CHEATSHEET = [
  {cat:"Account & Setup",cmds:["az login","az account show -o table","az account set --subscription <id>","az account list-locations -o table"]},
  {cat:"Resource Groups",cmds:["az group create -n <rg> -l uaenorth","az group list -o table","az resource list -g <rg> -o table","az group delete -n <rg> --yes --no-wait"]},
  {cat:"Compute",cmds:["az vm create -g <rg> -n <vm> --image Ubuntu2204","az vm list -d -o table","az vm deallocate -g <rg> -n <vm>","az vm open-port -g <rg> -n <vm> --port 80"]},
  {cat:"Storage",cmds:["az storage account create -n <name> -g <rg> --sku Standard_LRS","az storage container create --account-name <n> -n <c> --auth-mode login","az storage blob set-tier ... --tier Cool","az storage account update -n <n> --sku Standard_GRS"]},
  {cat:"Governance",cmds:["az policy assignment create ...","az lock create -n <n> --lock-type CanNotDelete -g <rg>","az role assignment create --assignee <u> --role Reader -g <rg>","az tag list -o table"]},
  {cat:"Monitoring & IaC",cmds:["az monitor metrics list --resource <id> --metric <m>","az advisor recommendation list -o table","az deployment group create -g <rg> --template-file main.bicep","az deployment group what-if -g <rg> --template-file main.bicep"]},
];

const AZ_LINKS = [
  {cat:"Official & Exam",links:[
    {title:"AZ-900 Certification Page",url:"https://learn.microsoft.com/credentials/certifications/azure-fundamentals/"},
    {title:"AZ-900 Study Guide (skills measured)",url:"https://learn.microsoft.com/credentials/certifications/resources/study-guides/az-900"},
    {title:"Microsoft Learn - AZ-900 Learning Paths",url:"https://learn.microsoft.com/training/courses/az-900t00"},
    {title:"Exam Sandbox (try the question types)",url:"https://aka.ms/examdemo"},
  ]},
  {cat:"Hands-on Practice",links:[
    {title:"Azure Free Account",url:"https://azure.microsoft.com/free/"},
    {title:"Azure Cloud Shell",url:"https://shell.azure.com/"},
    {title:"Microsoft Learn Training Hub",url:"https://learn.microsoft.com/training/"},
    {title:"Azure Portal",url:"https://portal.azure.com/"},
  ]},
  {cat:"Calculators & Trust",links:[
    {title:"Pricing Calculator",url:"https://azure.microsoft.com/pricing/calculator/"},
    {title:"TCO Calculator",url:"https://azure.microsoft.com/pricing/tco/calculator/"},
    {title:"Azure SLAs",url:"https://www.microsoft.com/licensing/docs/view/Service-Level-Agreements-SLA-for-Online-Services"},
    {title:"Service Trust Portal",url:"https://servicetrust.microsoft.com/"},
  ]},
  {cat:"Deep Dives",links:[
    {title:"Azure Architecture Center",url:"https://learn.microsoft.com/azure/architecture/"},
    {title:"Azure Global Infrastructure",url:"https://azure.microsoft.com/explore/global-infrastructure/"},
    {title:"Azure CLI Reference",url:"https://learn.microsoft.com/cli/azure/"},
    {title:"Bicep Documentation",url:"https://learn.microsoft.com/azure/azure-resource-manager/bicep/"},
  ]},
];

// ─── PRACTICE PLATFORMS (footer box on the Labs tab) ─────────────────────────
const PRACTICE_PLATFORMS = [
  { name:"Azure Free Account", desc:"12 months of popular services plus credit", url:"https://azure.microsoft.com/free/" },
  { name:"Azure Cloud Shell", desc:"No install, browser-based CLI", url:"https://shell.azure.com/" },
  { name:"Microsoft Learn", desc:"Free modules with sandbox environments", url:"https://learn.microsoft.com/training/" },
  { name:"Exam Sandbox", desc:"Practice the exam question formats", url:"https://aka.ms/examdemo" },
];

// ─── SITE FOOTER ─────────────────────────────────────────────────────────────
function SiteFooter() {
  return (
    <footer style={{padding:"26px var(--azure-gutter) 30px",fontFamily:"'Poppins', sans-serif",borderTop:"1px solid rgba(255,255,255,.12)",textAlign:"center"}}>
      <p style={{fontSize:"12px",color:T.textMute,lineHeight:1.9,margin:"0 0 14px"}}>
        &copy; 2026 <a className="footer-profile" href="../about/index.html">Saima Usman</a>. All Rights Reserved.
      </p>
      <p style={{fontSize:"11px",color:T.textMute,lineHeight:1.9,margin:0}}>
        Note: Unofficial study aid, not affiliated with Microsoft. Microsoft Azure is a trademark of Microsoft Corporation.
      </p>
    </footer>
  );
}

// ─── MOCK EXAM: CONFIG ───────────────────────────────────────────────────────
const DOMAINS = {
  1:{ name:"Cloud Concepts", weight:"25-30%", color:T.cyan, rgb:phaseRGB.foundation },
  2:{ name:"Azure Architecture & Services", weight:"35-40%", color:T.violet, rgb:phaseRGB.intermediate },
  3:{ name:"Management & Governance", weight:"30-35%", color:T.amber, rgb:phaseRGB.advanced },
};
const EXAM_MODES = {
  full:{ label:"Full Mock Exam", icon:"🎯", counts:{1:11,2:15,3:14}, minutes:45, color:T.green, rgb:"52,211,153",
    desc:"40 questions mixed across all three domains using the official exam weighting. The closest thing to the real test." },
  quick:{ label:"Quick Check", icon:"⚡", counts:{1:4,2:6,3:5}, minutes:15, color:T.pink, rgb:"244,114,182",
    desc:"15 questions for a fast snapshot of where you stand today." },
  d1:{ label:"Domain 1 Drill", icon:"☁", counts:{1:12}, minutes:15, color:T.cyan, rgb:phaseRGB.foundation,
    desc:"12 questions on Cloud Concepts only." },
  d2:{ label:"Domain 2 Drill", icon:"◈", counts:{2:12}, minutes:15, color:T.violet, rgb:phaseRGB.intermediate,
    desc:"12 questions on Azure Architecture & Services only." },
  d3:{ label:"Domain 3 Drill", icon:"✦", counts:{3:12}, minutes:15, color:T.amber, rgb:phaseRGB.advanced,
    desc:"12 questions on Management & Governance only." },
  weak:{ label:"Weak-Area Practice", icon:"🩺", counts:{}, minutes:null, color:T.red, rgb:"248,113,113",
    desc:"Targeted questions on the topics you scored below 70% on in your last attempt." },
};
const HISTORY_KEY = "az900-mock-history";

const shuffle = arr => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};
const band = p => p >= 80
  ? { label:"Strong", color:T.green, rgb:"52,211,153" }
  : p >= 70
    ? { label:"Almost there", color:T.amber, rgb:"251,191,36" }
    : { label:"Weak", color:T.red, rgb:"248,113,113" };
const readiness = p => p >= 80
  ? { label:"Exam ready", emoji:"🏆", color:T.green, rgb:"52,211,153",
      msg:"You are scoring comfortably above the 70% pass line. Keep your edge with another full mock, then book the exam." }
  : p >= 70
    ? { label:"Almost ready", emoji:"📖", color:T.amber, rgb:"251,191,36",
        msg:"You are right around the pass line. Fix the weak areas below and retake a full mock to build a safety margin." }
    : p >= 50
      ? { label:"Needs focused study", emoji:"🎯", color:T.amber, rgb:"251,191,36",
          msg:"You know the basics but there are clear gaps. Revisit the lessons for your weak areas first, then practice them." }
      : { label:"Early stage", emoji:"🌱", color:T.red, rgb:"248,113,113",
          msg:"Plenty of room to grow. Work through the lessons and labs in order, then come back to the mock exam." };

function loadHistory() {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    const a = raw ? JSON.parse(raw) : [];
    return Array.isArray(a) ? a : [];
  } catch (e) { return []; }
}

// ─── MOCK EXAM: QUESTION BANK ────────────────────────────────────────────────
// Q(phaseIndex, topicIndex, question, correctAnswer, [3 wrong answers], explanation)
// phaseIndex 0/1/2 = Domain 1/2/3 and topicIndex points at the lesson to revisit.
// Options are shuffled every attempt, so the order written here does not matter.
// These are original practice questions, not real exam questions.
const Q = (p, i, q, right, wrong, explain) => ({ d: p + 1, p, i, q, right, wrong, explain });
const QUESTION_BANK = [
  // ── Domain 1: Cloud Concepts ──
  Q(0,0,"A company replaces its on-premises servers with Azure virtual machines billed per hour. How does its spending model change?",
    "From capital expenditure (CapEx) to operational expenditure (OpEx)",
    ["From operational expenditure (OpEx) to capital expenditure (CapEx)","From variable costs to fixed up-front costs","It stays CapEx because Azure hardware is depreciated by the customer"],
    "Cloud services are consumed and billed as you go (OpEx). CapEx is up-front spending on physical assets such as servers."),
  Q(0,0,"Which statement describes the consumption-based pricing model?",
    "You pay only for the resources you use, with no up-front cost",
    ["You pay a fixed annual fee regardless of usage","You buy hardware once and use it for five years","You must sign a three-year contract to receive any pricing"],
    "Consumption-based (pay-as-you-go) means no up-front cost and no termination fee. Stop using a resource and the charge stops."),
  Q(0,0,"Which is an advantage of using a cloud datacenter instead of running your own?",
    "The provider handles hardware purchase, power, cooling and physical security",
    ["You control which physical rack your workload runs on","You pay for hardware up front but get lower rates later","You are responsible for replacing failed disks"],
    "In the cloud the provider owns and operates the physical infrastructure, which removes that burden from the customer."),
  Q(0,0,"Which expense is an example of CapEx?",
    "Purchasing physical servers for an on-premises datacenter",
    ["Paying monthly for Azure Storage","Paying per second for Azure Container Instances","Paying per user per month for Microsoft 365"],
    "CapEx is up-front spending on physical assets. The other options are pay-for-what-you-use OpEx."),

  Q(0,1,"A retail website must stay available even if one datacenter fails. Which cloud benefit addresses this requirement?",
    "High availability",
    ["Predictability","Manageability","Governance"],
    "High availability keeps workloads running with minimal downtime when components fail, and is backed by an SLA."),
  Q(0,1,"Which cloud benefit lets you automatically add and remove resources as demand changes so you never overpay?",
    "Elasticity",
    ["Reliability","Geo-distribution","Predictability"],
    "Elasticity is automatic scaling out and in with demand. Scalability is the broader ability to scale, whether or not it is automatic."),
  Q(0,1,"You add four more VM instances to handle a traffic increase. What is this called?",
    "Horizontal scaling (scale out)",
    ["Vertical scaling (scale up)","Vertical scaling (scale down)","Horizontal scaling (scale in)"],
    "Changing the number of instances is horizontal scaling. Changing the size of one instance is vertical scaling."),
  Q(0,1,"A team uses the Pricing calculator to forecast next quarter's Azure spend. Which cloud benefit does this support?",
    "Cost predictability",
    ["High availability","Elasticity","Reliability"],
    "Predictability covers both performance predictability and cost predictability, such as forecasting spend before deploying."),
  Q(0,1,"Which benefit describes the ability of a system to recover from failures and continue to function?",
    "Reliability",
    ["Elasticity","Scalability","Predictability"],
    "Reliability is resilience: the system recovers from failure and keeps working, helped by redundancy and a decentralized global design."),

  Q(0,2,"In a SaaS solution such as Microsoft 365, which responsibility always remains with the customer?",
    "Managing the information and data and who can access it",
    ["Patching the physical hosts","Securing the physical datacenter","Maintaining the application code"],
    "Data, devices and identities are always the customer's responsibility, in every service model."),
  Q(0,2,"When you deploy an Azure virtual machine (IaaS), who is responsible for installing operating system updates?",
    "The customer",
    ["Microsoft","Microsoft and the customer equally","Nobody, because updates are not required"],
    "With IaaS the customer manages the OS, middleware and applications. Microsoft manages the physical layers."),
  Q(0,2,"Which responsibility belongs to Microsoft in every cloud service model?",
    "Physical datacenter, physical network and physical hosts",
    ["Identities and accounts","Customer data","The devices that connect to the service"],
    "Physical infrastructure is always Microsoft's job in the cloud. Information, devices and identities stay with the customer."),
  Q(0,2,"In a PaaS offering such as Azure App Service, which task is handled by Microsoft rather than the customer?",
    "Operating system and runtime patching",
    ["Securing the application data","Managing user identities","Writing and configuring the application code"],
    "PaaS moves the OS and runtime to the provider. You still own your application, your data and your identities."),

  Q(0,3,"Which Azure service is an example of IaaS?",
    "Azure Virtual Machines",
    ["Azure App Service","Microsoft 365","Azure Functions"],
    "Virtual machines give you raw virtualized compute and you manage the OS. App Service is PaaS, Functions is serverless, Microsoft 365 is SaaS."),
  Q(0,3,"Which type of cloud service delivers fully managed software that users access over the internet, such as email?",
    "SaaS",
    ["IaaS","PaaS","Hybrid"],
    "SaaS is finished software managed by the provider. Users only manage their data, accounts and settings."),
  Q(0,3,"A developer wants to publish code without managing the operating system and have it run only when a trigger fires, paying per execution. Which model fits best?",
    "Serverless, such as Azure Functions",
    ["IaaS, such as Azure Virtual Machines","SaaS, such as Microsoft 365","A private cloud"],
    "Serverless is event-driven, scales automatically and bills per execution."),
  Q(0,3,"Which service type gives the customer the most control and also the most management responsibility?",
    "IaaS",
    ["PaaS","SaaS","Serverless"],
    "IaaS lets you control the OS and everything above it, so you are responsible for managing it."),
  Q(0,3,"Azure SQL Database is best described as which type of service?",
    "PaaS",
    ["IaaS","SaaS","On-premises software"],
    "Azure SQL Database is a managed relational database. Microsoft handles patching, backups and high availability."),

  Q(0,4,"A hospital must keep patient records in its own datacenter but wants to burst analytics workloads to Azure. Which cloud model is this?",
    "Hybrid cloud",
    ["Public cloud","Private cloud","Multi-cloud"],
    "Hybrid cloud combines on-premises or private infrastructure with the public cloud."),
  Q(0,4,"Which option has no CapEx for hardware and shares the underlying infrastructure with other customers?",
    "Public cloud",
    ["A private cloud hosted in your own datacenter","A traditional on-premises datacenter","A hybrid cloud that includes your own servers"],
    "The public cloud is owned by the provider and shared across tenants, so the customer buys no hardware."),
  Q(0,4,"An organization uses services from both Azure and another cloud provider. What is this called?",
    "Multi-cloud",
    ["Private cloud","Single-tenant cloud","Edge cloud"],
    "Multi-cloud means using more than one cloud provider. Azure Arc can help manage resources across them."),

  // ── Domain 2: Azure Architecture & Services ──
  Q(1,0,"What does an Availability Zone protect your workload from?",
    "The failure of a single datacenter within a region",
    ["The failure of an entire Azure geography","Accidental deletion of resources","A compromised administrator account"],
    "Availability Zones are physically separate datacenters in a region with independent power, cooling and networking."),
  Q(1,0,"What is the minimum number of Availability Zones in a region that supports them?",
    "Three",
    ["One","Two","Four"],
    "Every region that supports Availability Zones has a minimum of three separate zones."),
  Q(1,0,"Which statement about Azure region pairs is correct?",
    "Planned updates are rolled out to only one region in a pair at a time",
    ["Both regions in a pair always receive updates at the same time","Region pairs span different geographies","Region pairs exist only for Azure Government"],
    "Region pairs sit in the same geography and are updated sequentially so a bad update cannot hit both. One region is prioritized for recovery in a wide outage."),
  Q(1,0,"What is the correct order of the Azure management hierarchy from top to bottom?",
    "Management group, subscription, resource group, resource",
    ["Subscription, management group, resource group, resource","Resource group, subscription, management group, resource","Management group, resource group, subscription, resource"],
    "Management groups contain subscriptions, subscriptions contain resource groups, and resource groups contain resources."),
  Q(1,0,"How many resource groups can a single Azure resource belong to at any one time?",
    "One",
    ["Two","As many as you need","Up to five"],
    "Each resource exists in exactly one resource group (you can move it to another group)."),
  Q(1,0,"Which service is the deployment and management layer that receives requests from the Azure portal, CLI and PowerShell?",
    "Azure Resource Manager",
    ["Azure Policy","Azure Monitor","Azure Advisor"],
    "Every management tool talks to Azure Resource Manager, which handles authentication, authorization and consistent management."),
  Q(1,0,"Which offering is an isolated Azure cloud designed for United States government agencies?",
    "Azure Government",
    ["Azure Dedicated Host","Azure Arc","Azure Availability Zones"],
    "Azure Government is a sovereign cloud for US federal, state and local government and their partners."),

  Q(1,1,"Which service lets you run a container in Azure quickly, without managing virtual machines or an orchestrator?",
    "Azure Container Instances",
    ["Azure Kubernetes Service","Azure Virtual Machines","Azure Virtual Desktop"],
    "Azure Container Instances is the simplest way to run a container, billed per second. AKS is for orchestrating many containers."),
  Q(1,1,"You need a group of identical VMs that automatically grows and shrinks in number based on load. What should you use?",
    "Virtual machine scale sets",
    ["Availability sets","Azure Container Instances","Azure Virtual Desktop"],
    "Scale sets add or remove identical, load-balanced VM instances automatically."),
  Q(1,1,"Which feature protects VMs from hardware failure and planned maintenance inside a single datacenter by using fault domains and update domains?",
    "Availability sets",
    ["Availability Zones","Region pairs","Resource locks"],
    "Availability sets spread VMs across fault and update domains in one datacenter. Availability Zones spread them across datacenters."),
  Q(1,1,"A company wants to host a web app and its APIs without managing servers or operating system patches. Which service fits?",
    "Azure App Service",
    ["Azure Virtual Machines","Azure Virtual Network","Azure Data Box"],
    "App Service is a PaaS offering for web apps, APIs and mobile back ends."),
  Q(1,1,"Which service delivers Windows desktops and applications from Azure to remote users on any device?",
    "Azure Virtual Desktop",
    ["Azure App Service","Azure Functions","Azure Front Door"],
    "Azure Virtual Desktop is a desktop and app virtualization service."),
  Q(1,1,"Which VM option offers deeply discounted pricing but can be evicted when Azure needs the capacity back?",
    "Spot virtual machines",
    ["Reserved virtual machine instances","Azure Dedicated Host","Availability sets"],
    "Spot VMs use unused capacity at a big discount and suit interruptible workloads such as batch jobs."),

  Q(1,2,"Which service provides a private, dedicated connection between on-premises and Azure that does not use the public internet?",
    "Azure ExpressRoute",
    ["Azure VPN Gateway","Virtual network peering","Azure DNS"],
    "ExpressRoute uses a private circuit from a connectivity provider. VPN Gateway tunnels over the public internet."),
  Q(1,2,"What does a network security group (NSG) do?",
    "Filters inbound and outbound network traffic with allow and deny rules",
    ["Encrypts data stored in a storage account","Distributes traffic across VMs at layer 7","Translates domain names into IP addresses"],
    "An NSG is a stateful set of rules based on source, destination, port and protocol, applied to subnets or network interfaces."),
  Q(1,2,"Which feature connects two Azure virtual networks so their resources communicate privately over the Microsoft backbone?",
    "Virtual network peering",
    ["Azure DNS","Network security groups","Azure Front Door"],
    "VNet peering links virtual networks, including across regions, with low latency."),
  Q(1,2,"Which service is a regional layer 7 load balancer with URL-based routing and an optional web application firewall?",
    "Azure Application Gateway",
    ["Azure Load Balancer","Azure DNS","Azure VPN Gateway"],
    "Application Gateway works at layer 7 (HTTP/HTTPS). Azure Load Balancer works at layer 4 (TCP/UDP)."),
  Q(1,2,"Which service hosts DNS domains in Azure and lets you manage records with the same credentials and tools as other Azure resources?",
    "Azure DNS",
    ["Azure Bastion","Azure ExpressRoute","Network security groups"],
    "Azure DNS provides name resolution using Azure infrastructure and integrates with Azure RBAC and billing."),
  Q(1,2,"A branch office needs an encrypted tunnel over the public internet to an Azure virtual network at the lowest cost. Which service fits?",
    "Azure VPN Gateway",
    ["Azure ExpressRoute","Azure Data Box","Virtual network peering"],
    "VPN Gateway sends encrypted traffic across the public internet. It is quicker and cheaper to set up than ExpressRoute."),

  Q(1,3,"Which Blob storage access tier has the lowest storage cost but requires rehydration before the data can be read?",
    "Archive",
    ["Hot","Cool","Premium"],
    "Archive is an offline tier. Data must be rehydrated to Hot or Cool, which can take hours."),
  Q(1,3,"Which redundancy option keeps three copies of your data across three Availability Zones in one region?",
    "Zone-redundant storage (ZRS)",
    ["Locally redundant storage (LRS)","Geo-redundant storage (GRS)","Read-access geo-redundant storage (RA-GRS)"],
    "ZRS replicates synchronously across three zones, so it survives the loss of a datacenter."),
  Q(1,3,"Which redundancy option protects against an entire regional outage by copying data to a paired region?",
    "Geo-redundant storage (GRS)",
    ["Locally redundant storage (LRS)","Zone-redundant storage (ZRS)","Premium block blob storage"],
    "GRS keeps copies in the primary region and replicates asynchronously to the paired secondary region."),
  Q(1,3,"You must move tens of terabytes to Azure but your network bandwidth is very limited. Which option is the best fit?",
    "Azure Data Box",
    ["AzCopy over the internet","Azure File Sync","Azure Storage Explorer"],
    "Azure Data Box is a physical device Microsoft ships to you for large offline transfers."),
  Q(1,3,"Which Azure service provides fully managed file shares accessible over SMB and NFS?",
    "Azure Files",
    ["Azure Blob storage","Azure Queue storage","Azure Table storage"],
    "Azure Files offers cloud file shares that can be mounted by cloud or on-premises machines."),
  Q(1,3,"Which service helps you discover, assess and migrate on-premises servers, databases and web apps to Azure?",
    "Azure Migrate",
    ["Azure Monitor","Azure Policy","Azure Service Health"],
    "Azure Migrate is the central hub of tools for discovery, assessment and migration."),
  Q(1,3,"Which database service is a globally distributed, multi-model NoSQL database with single-digit millisecond latency?",
    "Azure Cosmos DB",
    ["Azure SQL Database","Azure Database for PostgreSQL","Azure Files"],
    "Cosmos DB is Microsoft's globally distributed NoSQL database with multiple consistency levels."),

  Q(1,4,"Microsoft Entra ID was formerly known as what?",
    "Azure Active Directory",
    ["Azure Domain Services","Azure Identity Manager","Windows Server Active Directory"],
    "Microsoft Entra ID is the renamed Azure Active Directory, Microsoft's cloud identity and access service."),
  Q(1,4,"Which statement describes authentication?",
    "Verifying who a user is",
    ["Determining which resources a user can access","Encrypting data at rest","Recording all user activity"],
    "Authentication proves identity. Authorization (for example Azure RBAC) decides what that identity may do."),
  Q(1,4,"A user signs in with a password and then approves a notification on their phone. Which feature is being used?",
    "Multifactor authentication",
    ["Single sign-on","Role-based access control","Resource locks"],
    "MFA requires two or more factors: something you know, something you have, or something you are."),
  Q(1,4,"Which Entra ID feature uses signals such as location and device state to allow, block or require MFA at sign-in?",
    "Conditional Access",
    ["Azure RBAC","Azure Policy","Resource locks"],
    "Conditional Access evaluates if-then policies at sign-in."),
  Q(1,4,"Which Azure RBAC built-in role lets a user view resources but not make any changes?",
    "Reader",
    ["Contributor","Owner","User Access Administrator"],
    "Reader is view-only. Contributor can manage resources but not assign roles. Owner can do both."),
  Q(1,4,"Which layer of the defense in depth model includes controls such as Conditional Access and multifactor authentication?",
    "Identity and access",
    ["Physical security","Network","Data"],
    "The identity and access layer controls who can sign in and what they can reach."),
  Q(1,4,"Which Zero Trust principle means giving users only the access they need, for only as long as they need it?",
    "Use least privilege access",
    ["Verify explicitly","Assume breach","Trust the corporate network"],
    "The three Zero Trust principles are verify explicitly, use least privilege access and assume breach."),
  Q(1,4,"Which tool gives a secure score and security recommendations across Azure, hybrid and multi-cloud workloads?",
    "Microsoft Defender for Cloud",
    ["Azure Policy","Microsoft Cost Management","Azure Service Health"],
    "Defender for Cloud provides cloud security posture management and workload protection."),

  // ── Domain 3: Management & Governance ──
  Q(2,0,"You want to estimate the monthly cost of a new Azure workload before you deploy it. Which tool should you use?",
    "Pricing calculator",
    ["TCO calculator","Azure Advisor","Azure Service Health"],
    "The Pricing calculator estimates the cost of Azure services you plan to deploy."),
  Q(2,0,"Which tool compares the cost of running workloads on-premises with the cost of running them in Azure?",
    "Total Cost of Ownership (TCO) calculator",
    ["Pricing calculator","Cost analysis in Microsoft Cost Management","Azure Monitor"],
    "The TCO calculator builds a migration business case by comparing on-premises and Azure costs."),
  Q(2,0,"Which type of data transfer is generally free in Azure?",
    "Inbound data transfer (ingress)",
    ["Outbound data transfer to the internet (egress)","Data transfer between regions","All data transfer"],
    "Data coming into Azure is free. Outbound transfer and cross-region transfer are charged."),
  Q(2,0,"You create a $500 budget in Cost Management with an alert at 90%. What happens when spending reaches 90%?",
    "An alert is sent but resources keep running",
    ["Resources are stopped automatically","The subscription is disabled","Azure Policy denies new deployments"],
    "A budget only notifies. It never stops spending or resources on its own."),
  Q(2,0,"Which option gives a significant discount on VMs in exchange for a one- or three-year commitment?",
    "Azure Reservations",
    ["Pay-as-you-go pricing","Resource tags","Azure Advisor"],
    "Reservations trade a commitment for a lower price than pay-as-you-go."),
  Q(2,0,"A company already owns Windows Server licenses with Software Assurance. Which offer lets it reuse them to lower Azure VM costs?",
    "Azure Hybrid Benefit",
    ["Azure Reservations","Spot virtual machines","The Pricing calculator"],
    "Azure Hybrid Benefit lets you apply existing Windows Server and SQL Server licenses to Azure."),
  Q(2,0,"How can an organization report Azure costs by department?",
    "Tag resources with a department tag and group costs by that tag",
    ["Create a separate Azure region for each department","Place each department in an availability set","Give each department the Reader role"],
    "Tags are name-value pairs you can filter and group by in Cost Management reports."),

  Q(2,1,"You must ensure resources can only be created in approved regions. Which service enforces this?",
    "Azure Policy",
    ["Azure RBAC","Resource locks","Azure Advisor"],
    "Azure Policy enforces rules on resource properties, such as allowed locations, and can deny non-compliant deployments."),
  Q(2,1,"Which feature prevents anyone, including subscription owners, from accidentally deleting a resource?",
    "Resource lock",
    ["Resource tags","Azure Advisor","Azure Monitor alerts"],
    "A CanNotDelete lock blocks deletion regardless of RBAC permissions until the lock is removed."),
  Q(2,1,"A tag is applied to a resource group. By default, what happens to the resources inside that group?",
    "They do not inherit the tag",
    ["They automatically inherit the tag","They are deleted","They are blocked from deployment"],
    "Tags are not inherited by default. Azure Policy can be used to enforce or copy tags."),
  Q(2,1,"Which service helps you discover, classify and govern data across on-premises, multi-cloud and SaaS sources?",
    "Microsoft Purview",
    ["Microsoft Defender for Cloud","Azure Policy","Azure Advisor"],
    "Microsoft Purview is the family of data governance, risk and compliance solutions."),
  Q(2,1,"Where can you download Microsoft's compliance and audit reports, such as ISO and SOC reports?",
    "Service Trust Portal",
    ["Azure Advisor","Azure Service Health","Azure Marketplace"],
    "The Service Trust Portal hosts compliance, audit and security documentation."),
  Q(2,1,"Which statement about Azure RBAC is true?",
    "Permissions assigned at a higher scope are inherited by lower scopes",
    ["Permissions are never inherited","RBAC enforces rules about resource properties","RBAC replaces the need for authentication"],
    "A role assigned to a management group, subscription or resource group applies to everything beneath it."),

  Q(2,2,"Which tool provides a browser-based shell that is already authenticated and has Azure CLI and PowerShell installed?",
    "Azure Cloud Shell",
    ["Azure Bastion","Azure Advisor","Azure Service Health"],
    "Cloud Shell is available from the portal or shell.azure.com with no local install."),
  Q(2,2,"Which approach lets you define infrastructure in a declarative file so deployments are consistent and repeatable?",
    "Infrastructure as code, such as ARM templates or Bicep",
    ["Creating each resource by hand in the portal","Azure Advisor recommendations","Azure Service Health alerts"],
    "Infrastructure as code gives consistency, repeatability and version control."),
  Q(2,2,"Which service extends Azure management tools such as Policy and Monitor to servers running outside Azure?",
    "Azure Arc",
    ["Azure Migrate","Azure Data Box","Azure DNS"],
    "Azure Arc projects on-premises, edge and other-cloud resources into Azure Resource Manager."),
  Q(2,2,"Which Azure PowerShell cmdlet creates a new resource group?",
    "New-AzResourceGroup",
    ["az group create","Create-AzGroup","Set-AzGroup"],
    "Azure PowerShell uses Verb-Noun cmdlets. 'az group create' is the Azure CLI equivalent."),
  Q(2,2,"Bicep files are compiled into which format before they are deployed?",
    "ARM templates (JSON)",
    ["Terraform plans","PowerShell scripts","Docker images"],
    "Bicep is a simpler language that transpiles to ARM templates."),

  Q(2,3,"Which service gives personalized recommendations to improve reliability, security, performance, cost and operational excellence?",
    "Azure Advisor",
    ["Azure Monitor","Azure Service Health","Azure Policy"],
    "Advisor analyzes your resources and recommends improvements across five pillars."),
  Q(2,3,"You want to know whether an Azure outage or planned maintenance affects your own subscriptions and regions. Which service should you check?",
    "Azure Service Health",
    ["Azure Advisor","Azure Monitor metrics","Azure Policy"],
    "Service Health shows incidents, maintenance and health advisories that affect your resources."),
  Q(2,3,"Which tool in Azure Monitor lets you query log data with Kusto Query Language (KQL)?",
    "Log Analytics",
    ["Azure Advisor","Service Trust Portal","Cost analysis"],
    "Log Analytics workspaces store log data you can query with KQL."),
  Q(2,3,"Which Azure Monitor feature provides application performance monitoring, such as request rates and failures for web apps?",
    "Application Insights",
    ["Azure Advisor","Azure Service Health","Azure Policy"],
    "Application Insights is Azure Monitor's APM feature."),
  Q(2,3,"Which part of Azure Service Health shows the health of an individual resource, such as one virtual machine?",
    "Resource Health",
    ["Azure status","Planned maintenance","Azure Advisor"],
    "Azure status is global, Service Health is about your subscriptions and regions, and Resource Health is about a single resource."),

  Q(2,4,"Two services deployed in series each have an SLA of 99.95%. What is the approximate composite SLA?",
    "99.90%",
    ["99.95%","99.99%","100%"],
    "Multiply the SLAs: 0.9995 x 0.9995 = 0.9990. The composite is lower than either individual SLA."),
  Q(2,4,"Which release stage is NOT covered by the standard Azure SLA?",
    "Public preview",
    ["General availability","Long-term support","Extended support"],
    "Preview features come without an SLA and may change before general availability."),
  Q(2,4,"How can you improve the availability of a solution and raise its composite SLA?",
    "Add redundancy, such as deploying across Availability Zones or multiple regions",
    ["Deploy every component in a single datacenter","Reduce the number of instances","Remove the load balancer"],
    "Redundant components remove single points of failure and can increase the combined SLA."),
  Q(2,4,"What does a 99.9% SLA for an Azure service represent?",
    "A formal uptime commitment, with service credits if it is not met",
    ["A guarantee that the service will never fail","The maximum response time of the service","The pricing tier of the service"],
    "SLAs are uptime commitments. Missing one can entitle you to service credits, but it does not promise zero failures."),
  Q(2,4,"A service has reached general availability (GA). What does this mean?",
    "It is fully released, supported and covered by its SLA",
    ["It is available only to invited customers","It has no SLA and may change significantly","It has been deprecated"],
    "GA is the stage for production use. Private and public previews come before it."),
];

function SiteHeader() {
  return (
    <header className="site-navigation azure-header">
      <div className="site-navigation-inner">
        <a className="site-brand" href="../index.html" aria-label="Learn with Sam - return to Learning Hub"><span className="site-brand-mark">&gt;_</span><span>Learn with <em>Sam</em></span></a>
      </div>
    </header>
  );
}

export default function AZ900Dashboard() {
  const [activePhase, setActivePhase] = useState(0);
  const [activeTab, setActiveTab] = useState("topics");
  const [expandedTopic, setExpandedTopic] = useState(null);
  const [openSolution, setOpenSolution] = useState(null);
  const [showCheatsheet, setShowCheatsheet] = useState(false);
  const [mcqAnswers, setMcqAnswers] = useState({});
  const [mcqChecked, setMcqChecked] = useState({});
  const [activeScenario, setActiveScenario] = useState(null);
  const [completedSteps, setCompletedSteps] = useState({});
  const [copiedCmd, setCopiedCmd] = useState(null);
  const [glossaryWord, setGlossaryWord] = useState(null);
  const [showLinks, setShowLinks] = useState(false);

  // ── Mock exam state ──
  const [view, setView] = useState("dashboard");          // "dashboard" | "exam"
  const [exam, setExam] = useState(null);                  // null = menu, else { stage: "running" | "results", ... }
  const [tick, setTick] = useState(0);
  const [modal, setModal] = useState(null);                // null | "submit" | "quit"
  const [reviewFilter, setReviewFilter] = useState("wrong");
  const [history, setHistory] = useState(loadHistory);

  const [pendingNavigation, setPendingNavigation] = useState(null);
  useEffect(() => {
    const restoreNavigation = () => {
      const id = location.hash.slice(1);
      if (["azure-overview", "azure-learning", "azure-exam"].includes(id)) {
        setView(id === "azure-exam" ? "exam" : "dashboard");
        setActiveScenario(null);
        setPendingNavigation({id});
      }
    };
    restoreNavigation();
    window.addEventListener("popstate", restoreNavigation);
    window.addEventListener("hashchange", restoreNavigation);
    return () => {
      window.removeEventListener("popstate", restoreNavigation);
      window.removeEventListener("hashchange", restoreNavigation);
    };
  }, []);
  useEffect(() => {
    if (!pendingNavigation) return;
    const frame = requestAnimationFrame(() => {
      const target = document.getElementById(pendingNavigation.id);
      if (target) {
        target.style.scrollMarginTop = (document.querySelector(".site-navigation").offsetHeight + 32) + "px";
        target.scrollIntoView({behavior:"auto",block:"start"});
      }
    });
    return () => cancelAnimationFrame(frame);
  }, [pendingNavigation, view, activeScenario]);

  function openExam() {
    setView("exam");
    try { window.scrollTo(0, 0); } catch (e) {}
  }
  function buildQuestions(modeKey, weakKeys) {
    const cfg = EXAM_MODES[modeKey];
    let picked = [];
    if (modeKey === "weak") {
      const inWeak = q => weakKeys.includes(q.p + "-" + q.i);
      picked = shuffle(QUESTION_BANK.filter(inWeak)).slice(0, 15);
      if (picked.length < 8) {
        const filler = shuffle(QUESTION_BANK.filter(q => !inWeak(q))).slice(0, 8 - picked.length);
        picked = picked.concat(filler);
      }
    } else {
      [1, 2, 3].forEach(d => {
        const n = cfg.counts[d];
        if (n) picked = picked.concat(shuffle(QUESTION_BANK.filter(q => q.d === d)).slice(0, n));
      });
    }
    return shuffle(picked).map((q, id) => {
      const opts = shuffle([q.right, ...q.wrong]);
      return { ...q, id, opts, ans: opts.indexOf(q.right) };
    });
  }
  function startExam(modeKey, weakKeys) {
    const questions = buildQuestions(modeKey, weakKeys || []);
    const cfg = EXAM_MODES[modeKey];
    const minutes = cfg.minutes || Math.max(10, Math.ceil(questions.length * 1.1));
    const now = Date.now();
    setModal(null);
    setExam({ stage: "running", mode: modeKey, minutes, questions, answers: {}, flags: {}, current: 0, startedAt: now, endAt: now + minutes * 60000 });
    try { window.scrollTo(0, 0); } catch (e) {}
  }
  function scoreExam(ex, timedOut) {
    const perDomain = { 1: { c: 0, t: 0 }, 2: { c: 0, t: 0 }, 3: { c: 0, t: 0 } };
    const perTopic = {};
    let correct = 0;
    ex.questions.forEach((q, idx) => {
      const ok = ex.answers[idx] === q.ans;
      if (ok) correct++;
      perDomain[q.d].t++;
      if (ok) perDomain[q.d].c++;
      const k = q.p + "-" + q.i;
      if (!perTopic[k]) perTopic[k] = { key: k, c: 0, t: 0, p: q.p, i: q.i, d: q.d };
      perTopic[k].t++;
      if (ok) perTopic[k].c++;
    });
    const total = ex.questions.length;
    const weak = Object.values(perTopic)
      .filter(v => v.c / v.t < 0.7)
      .sort((a, b) => a.c / a.t - b.c / b.t)
      .map(v => v.key);
    return {
      correct, total, pct: Math.round((correct / total) * 100), perDomain, perTopic, weak, timedOut,
      answered: Object.keys(ex.answers).length,
      timeUsed: Math.max(0, Math.min(Date.now(), ex.endAt) - ex.startedAt),
    };
  }
  function finishExam(timedOut) {
    if (!exam || exam.stage !== "running") return;
    const result = scoreExam(exam, !!timedOut);
    const domPct = {};
    [1, 2, 3].forEach(d => { const v = result.perDomain[d]; domPct[d] = v.t ? Math.round((v.c / v.t) * 100) : null; });
    const entry = { t: Date.now(), mode: exam.mode, pct: result.pct, correct: result.correct, total: result.total, domains: domPct, weak: result.weak };
    const next = [entry, ...history].slice(0, 10);
    setHistory(next);
    try { localStorage.setItem(HISTORY_KEY, JSON.stringify(next)); } catch (e) {}
    setExam({ ...exam, stage: "results", result });
    setReviewFilter(result.correct < result.total ? "wrong" : "all");
    setModal(null);
    try { window.scrollTo(0, 0); } catch (e) {}
  }
  function clearHistory() {
    setHistory([]);
    try { localStorage.removeItem(HISTORY_KEY); } catch (e) {}
  }
  function pickExamAnswer(qi, oi) {
    setExam(ex => ({ ...ex, answers: { ...ex.answers, [qi]: oi } }));
  }
  function toggleExamFlag(qi) {
    setExam(ex => ({ ...ex, flags: { ...ex.flags, [qi]: !ex.flags[qi] } }));
  }
  function goExamQuestion(qi) {
    setExam(ex => ({ ...ex, current: Math.max(0, Math.min(ex.questions.length - 1, qi)) }));
  }
  function studyTopic(p, i) {
    setView("dashboard");
    setActivePhase(p);
    setActiveTab("topics");
    setExpandedTopic(i);
    setOpenSolution(null);
    try { window.scrollTo(0, 0); } catch (e) {}
  }

  useEffect(() => {
    if (!exam || exam.stage !== "running") return;
    const id = setInterval(() => setTick(t => t + 1), 1000);
    return () => clearInterval(id);
  }, [exam && exam.stage]);
  useEffect(() => {
    if (exam && exam.stage === "running" && Date.now() >= exam.endAt) finishExam(true);
  }, [tick]);

  const phase = PHASES[activePhase];
  const phaseId = phase.id;
  const color = phase.color;
  const rgb = phaseRGB[phaseId];
  const font = "'Poppins', sans-serif";
  const mono = "'Fira Code', 'Courier New', monospace";

  const totalTopics = PHASES.reduce((s, p) => s + p.topics.length, 0);
  const totalWeeks = PHASES.reduce((s, p) => s + parseInt(p.duration), 0);

  const pickAnswer = (qi, oi) => {
    if (mcqChecked[phaseId]) return;
    setMcqAnswers(p => ({ ...p, [`${phaseId}-${qi}`]: oi }));
  };
  const submitQuiz = () => setMcqChecked(p => ({ ...p, [phaseId]: true }));
  const retryQuiz = () => {
    setMcqChecked(p => ({ ...p, [phaseId]: false }));
    setMcqAnswers(p => {
      const n = { ...p };
      phase.assessment.questions.forEach((_, i) => delete n[`${phaseId}-${i}`]);
      return n;
    });
  };
  const quizScore = pid => {
    const qs = PHASES.find(p => p.id === pid).assessment.questions;
    const c = qs.filter((q, i) => mcqAnswers[`${pid}-${i}`] === q.answer).length;
    return { correct: c, total: qs.length, pct: Math.round((c / qs.length) * 100) };
  };
  const totalPct = () => {
    const done = PHASES.reduce((s, p) => s + (mcqChecked[p.id] ? quizScore(p.id).correct : 0), 0);
    const total = PHASES.reduce((s, p) => s + p.assessment.questions.length, 0);
    return Math.round((done / total) * 100);
  };
  const answeredCount = phase.assessment.questions.filter((_, i) => mcqAnswers[`${phaseId}-${i}`] !== undefined).length;
  const allAnswered = answeredCount === phase.assessment.questions.length;
  const diffColor = d => d === "Easy" ? T.green : d === "Medium" ? T.amber : T.red;
  const toggleStep = (sid, si) => { const k = `${sid}-${si}`; setCompletedSteps(p => ({ ...p, [k]: !p[k] })); };
  const stepDone = (sid, si) => !!completedSteps[`${sid}-${si}`];
  const scenarioDone = scen => scen.steps.every((_, i) => stepDone(scen.id, i));
  const copyCmd = cmd => {
    navigator.clipboard.writeText(cmd).catch(() => {});
    setCopiedCmd(cmd);
    setTimeout(() => setCopiedCmd(null), 1500);
  };
  const phaseScenarios = SCENARIOS.filter(s => s.phase === phaseId);
  const labOffset = PHASES.slice(0, activePhase).reduce((s, p) => s + p.labs.length, 0);

  const renderKeywords = (text, keywords) => {
    if (!keywords || keywords.length === 0) return text;
    const parts = [];
    let remaining = text;
    const sorted = [...keywords].sort((a, b) => b.length - a.length);
    let idx = 0;
    while (remaining.length > 0) {
      let found = false;
      for (const kw of sorted) {
        const i = remaining.indexOf(kw);
        if (i === 0) {
          const def = GLOSSARY[kw];
          parts.push(
            <span key={idx++}
              onClick={() => setGlossaryWord(glossaryWord === kw ? null : kw)}
              style={{ color, textDecoration: "underline dotted", cursor: "pointer", fontWeight: 600 }}
              title={def ? def.substring(0, 80) + "…" : kw}>
              {kw}
            </span>
          );
          remaining = remaining.slice(kw.length);
          found = true;
          break;
        }
      }
      if (!found) {
        let nextIdx = remaining.length;
        for (const kw of sorted) {
          const i = remaining.indexOf(kw);
          if (i > 0 && i < nextIdx) nextIdx = i;
        }
        parts.push(<span key={idx++}>{remaining.slice(0, nextIdx)}</span>);
        remaining = remaining.slice(nextIdx);
      }
    }
    return parts;
  };

  const renderExplanation = (text, keywords) => {
    return text.split('\n').map((line, i) => {
      if (line.trim() === '') return <br key={i} />;
      const rendered = renderKeywords(line, keywords);
      return (
        <p key={i} style={{ margin: "0 0 6px", fontSize: "14px", color: T.textSub, lineHeight: "1.85", whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
          {rendered}
        </p>
      );
    });
  };

  // ── Practice platforms cell (Labs tab footer box) ──
  const platformCell = p => (
    <a key={p.name} href={p.url} target="_blank" rel="noopener noreferrer"
      style={{ display: "block", padding: "8px 14px", textDecoration: "none", textAlign: "left" }}>
      <div style={{ color, fontSize: "13px", fontWeight: 600, wordBreak: "break-word" }}>↗ {p.name}</div>
      <div style={{ color: T.textSub, fontSize: "12px", lineHeight: "1.5", marginTop: "2px", wordBreak: "break-word" }}>{p.desc}</div>
    </a>
  );

  // ── Mock exam views ──
  const backBtn = { background: "transparent", border: "1px solid rgba(255,255,255,0.15)", color: T.textSub, padding: "6px 14px", borderRadius: "8px", cursor: "pointer", fontSize: "13px", fontFamily: font };
  const modeTotal = k => Object.values(EXAM_MODES[k].counts).reduce((a, b) => a + b, 0);
  const domBadge = d => (
    <span style={{ background: `rgba(${DOMAINS[d].rgb},0.18)`, color: DOMAINS[d].color, fontSize: "10px", fontWeight: 700, letterSpacing: "1px", padding: "3px 9px", borderRadius: "20px", whiteSpace: "nowrap" }}>
      DOMAIN {d}
    </span>
  );

  function renderExamMenu() {
    const last = history[0];
    const lastWeak = last && last.weak ? last.weak : [];
    const best = history.length ? Math.max(...history.map(h => h.pct)) : null;
    const cardBtn = (mk, onClick, label) => (
      <button onClick={onClick}
        style={{ width: "100%", background: `rgba(${EXAM_MODES[mk].rgb},0.16)`, border: `1px solid ${EXAM_MODES[mk].color}`, color: EXAM_MODES[mk].color, padding: "8px 12px", borderRadius: "8px", cursor: "pointer", fontSize: "13px", fontWeight: 600, fontFamily: font }}>
        {label}
      </button>
    );
    return (
      <div style={{ padding: "20px var(--azure-gutter)", width: "100%", margin: 0, boxSizing: "border-box" }}>
        <button onClick={() => setView("dashboard")} style={backBtn}>← Back to Dashboard</button>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", margin: "16px 0 8px", flexWrap: "wrap" }}>
          <div style={{ fontSize: "34px" }}>📝</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ color: T.green, fontSize: "11px", fontWeight: 600, letterSpacing: "1.5px" }}>EXAM SIMULATOR</div>
            <h2 style={{ margin: "2px 0 0", fontSize: "22px", fontWeight: 700 }}>Mock Exam Centre</h2>
          </div>
          {best !== null && (
            <div style={{ background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.3)", borderRadius: "12px", padding: "8px 14px", textAlign: "center" }}>
              <div style={{ fontSize: "20px", fontWeight: 700, color: T.green, lineHeight: 1 }}>{best}%</div>
              <div style={{ fontSize: "10px", color: T.textMute, marginTop: "3px" }}>BEST SCORE</div>
            </div>
          )}
        </div>
        <p style={{ margin: "0 0 14px", fontSize: "13px", color: T.textSub, lineHeight: "1.75" }}>
          Test your AZ-900 readiness under exam-like conditions: a countdown timer, no answers shown until you submit, and the option to flag questions for review.
          Afterwards you get your preparedness percentage, a score for each exam domain, and a ranked list of the lessons to revisit first.
        </p>
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "18px" }}>
          {["⏱ Timed", "🙈 No feedback until you submit", "⚖ Weighted like the real exam", "🔀 Questions and answers shuffled every attempt", `📚 ${QUESTION_BANK.length}-question bank`].map((c, i) => (
            <span key={i} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: T.textSub, fontSize: "11px", padding: "4px 10px", borderRadius: "20px" }}>{c}</span>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))", gap: "12px" }}>
          {["full", "quick", "d1", "d2", "d3"].map(k => {
            const m = EXAM_MODES[k];
            return (
              <div key={k} style={{ background: T.card, border: `1px solid rgba(${m.rgb},0.3)`, borderRadius: "14px", overflow: "hidden", display: "flex", flexDirection: "column" }}>
                <div style={{ height: "3px", background: m.color }} />
                <div style={{ padding: "16px", display: "flex", flexDirection: "column", flex: 1 }}>
                  <div style={{ fontSize: "26px", marginBottom: "6px" }}>{m.icon}</div>
                  <h3 style={{ margin: "0 0 3px", fontSize: "15px", fontWeight: 700 }}>{m.label}</h3>
                  <div style={{ fontSize: "12px", color: m.color, fontWeight: 600, marginBottom: "8px" }}>{modeTotal(k)} questions · {m.minutes} min</div>
                  <p style={{ margin: "0 0 14px", fontSize: "12px", color: T.textSub, lineHeight: "1.65", flex: 1 }}>{m.desc}</p>
                  {cardBtn(k, () => startExam(k), "▶ Start")}
                </div>
              </div>
            );
          })}
          {lastWeak.length > 0 && (
            <div style={{ background: T.card, border: `1px solid rgba(${EXAM_MODES.weak.rgb},0.35)`, borderRadius: "14px", overflow: "hidden", display: "flex", flexDirection: "column" }}>
              <div style={{ height: "3px", background: T.red }} />
              <div style={{ padding: "16px", display: "flex", flexDirection: "column", flex: 1 }}>
                <div style={{ fontSize: "26px", marginBottom: "6px" }}>{EXAM_MODES.weak.icon}</div>
                <h3 style={{ margin: "0 0 3px", fontSize: "15px", fontWeight: 700 }}>{EXAM_MODES.weak.label}</h3>
                <div style={{ fontSize: "12px", color: T.red, fontWeight: 600, marginBottom: "8px" }}>{lastWeak.length} weak topic{lastWeak.length > 1 ? "s" : ""} from your last attempt</div>
                <p style={{ margin: "0 0 14px", fontSize: "12px", color: T.textSub, lineHeight: "1.65", flex: 1 }}>
                  {lastWeak.slice(0, 4).map(k => { const [p, i] = k.split("-").map(Number); return PHASES[p].topics[i].title; }).join(" · ")}
                  {lastWeak.length > 4 ? ` · +${lastWeak.length - 4} more` : ""}
                </p>
                {cardBtn("weak", () => startExam("weak", lastWeak), "▶ Practice weak areas")}
              </div>
            </div>
          )}
        </div>

        {history.length > 0 && (
          <div style={{ marginTop: "22px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <div style={{ color: T.pink, fontSize: "11px", fontWeight: 600, letterSpacing: "1px" }}>YOUR RECENT ATTEMPTS</div>
              <button onClick={clearHistory} style={{ background: "transparent", border: "none", color: T.textDim, fontSize: "11px", cursor: "pointer", fontFamily: font, textDecoration: "underline" }}>Clear history</button>
            </div>
            <div style={{ background: T.card, border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", overflow: "hidden" }}>
              {history.slice(0, 6).map((h, i) => {
                const b = band(h.pct);
                return (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px 14px", borderBottom: i < Math.min(history.length, 6) - 1 ? "1px solid rgba(255,255,255,0.06)" : "none", flexWrap: "wrap" }}>
                    <div style={{ minWidth: "52px", fontSize: "18px", fontWeight: 700, color: b.color }}>{h.pct}%</div>
                    <div style={{ flex: 1, minWidth: "140px" }}>
                      <div style={{ fontSize: "13px", fontWeight: 600 }}>{EXAM_MODES[h.mode] ? EXAM_MODES[h.mode].label : h.mode}</div>
                      <div style={{ fontSize: "11px", color: T.textMute }}>{new Date(h.t).toLocaleString([], { dateStyle: "medium", timeStyle: "short" })} · {h.correct}/{h.total} correct</div>
                    </div>
                    <div style={{ display: "flex", gap: "6px" }}>
                      {[1, 2, 3].map(d => h.domains && h.domains[d] !== null && h.domains[d] !== undefined && (
                        <span key={d} style={{ fontSize: "10px", color: DOMAINS[d].color, background: `rgba(${DOMAINS[d].rgb},0.12)`, padding: "2px 7px", borderRadius: "5px", fontWeight: 600 }}>D{d} {h.domains[d]}%</span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{ fontSize: "11px", color: T.textDim, marginTop: "6px" }}>Saved in this browser only.</div>
          </div>
        )}

        <p style={{ margin: "20px 0 0", fontSize: "11px", color: T.textDim, lineHeight: "1.7" }}>
          These are original practice questions written for this dashboard, not real exam questions. The real AZ-900 pass mark is 700/1000, which is roughly 70%; your percentage here is an indicator of readiness, not a prediction. The exam is not negatively marked, so always answer every question.
        </p>
      </div>
    );
  }

  function renderExamRunning() {
    const ex = exam;
    const qs = ex.questions;
    const q = qs[ex.current];
    const remaining = Math.max(0, Math.round((ex.endAt - Date.now()) / 1000));
    const mm = String(Math.floor(remaining / 60)).padStart(2, "0");
    const ss = String(remaining % 60).padStart(2, "0");
    const low = remaining <= 300;
    const answered = qs.reduce((n, _, i) => n + (ex.answers[i] !== undefined ? 1 : 0), 0);
    const flagged = qs.reduce((n, _, i) => n + (ex.flags[i] ? 1 : 0), 0);
    const isLast = ex.current === qs.length - 1;
    const chosen = ex.answers[ex.current];
    const sbtn = (c, filled) => ({ background: filled ? `rgba(${c},0.18)` : "transparent", border: `1px solid rgb(${c})`, color: `rgb(${c})`, padding: "7px 14px", borderRadius: "8px", cursor: "pointer", fontSize: "12px", fontWeight: 600, fontFamily: font, whiteSpace: "nowrap" });
    return (
      <div>
        <div style={{ position: "sticky", top: 68, zIndex: 20, background: T.surface, borderBottom: `1px solid ${T.border}`, padding: "10px var(--azure-gutter)" }}>
          <div style={{ width: "100%", margin: 0, display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: "170px" }}>
              <div style={{ fontSize: "10px", color: T.textDim, letterSpacing: "1.5px", fontWeight: 600 }}>{EXAM_MODES[ex.mode].label.toUpperCase()}</div>
              <div style={{ fontSize: "14px", fontWeight: 600 }}>
                Question {ex.current + 1} of {qs.length} <span style={{ color: T.textMute, fontWeight: 400, fontSize: "12px" }}>· {answered} answered</span>
              </div>
              <div style={{ height: "4px", background: "rgba(255,255,255,0.08)", borderRadius: "2px", marginTop: "6px", overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${(answered / qs.length) * 100}%`, background: T.green, transition: "width .2s" }} />
              </div>
            </div>
            <div style={{ fontFamily: mono, fontSize: "18px", fontWeight: 500, color: low ? T.red : T.text, background: low ? "rgba(248,113,113,0.12)" : "rgba(255,255,255,0.06)", border: `1px solid ${low ? "rgba(248,113,113,0.5)" : "rgba(255,255,255,0.12)"}`, padding: "6px 12px", borderRadius: "10px" }}>
              ⏱ {mm}:{ss}
            </div>
            <button onClick={() => setModal("submit")} style={sbtn("52,211,153", true)}>Finish &amp; Submit</button>
            <button onClick={() => setModal("quit")} title="Exit exam" style={sbtn("122,143,166", false)}>✕</button>
          </div>
        </div>

        <div style={{ padding: "18px var(--azure-gutter)", width: "100%", margin: 0, boxSizing: "border-box", display: "flex", gap: "16px", flexWrap: "wrap", alignItems: "flex-start" }}>
          <div style={{ flex: "3 1 360px", minWidth: 0 }}>
            <div style={{ background: T.card, border: "1px solid rgba(255,255,255,0.09)", borderRadius: "14px", padding: "18px" }}>
              <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "12px", flexWrap: "wrap" }}>
                {domBadge(q.d)}
                <span style={{ fontSize: "11px", color: T.textMute }}>Question {ex.current + 1}</span>
                {ex.flags[ex.current] && <span style={{ fontSize: "11px", color: T.amber, fontWeight: 600 }}>⚑ Marked for review</span>}
              </div>
              <div style={{ fontSize: "15px", fontWeight: 600, lineHeight: "1.7", marginBottom: "14px", wordBreak: "break-word" }}>{q.q}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {q.opts.map((opt, oi) => {
                  const sel = chosen === oi;
                  return (
                    <div key={oi} onClick={() => pickExamAnswer(ex.current, oi)}
                      style={{ display: "flex", alignItems: "flex-start", gap: "10px", padding: "11px 14px", borderRadius: "10px", cursor: "pointer", background: sel ? "rgba(34,211,238,0.12)" : "rgba(255,255,255,0.03)", border: `1px solid ${sel ? T.cyan : "rgba(255,255,255,0.1)"}` }}>
                      <div style={{ width: "16px", height: "16px", borderRadius: "50%", border: `2px solid ${sel ? T.cyan : "rgba(255,255,255,0.25)"}`, background: sel ? T.cyan : "transparent", flexShrink: 0, marginTop: "2px" }} />
                      <span style={{ fontSize: "14px", color: sel ? T.text : T.textSub, lineHeight: "1.6", wordBreak: "break-word" }}>{opt}</span>
                    </div>
                  );
                })}
              </div>
              <div style={{ display: "flex", gap: "8px", marginTop: "16px", flexWrap: "wrap", alignItems: "center" }}>
                <button onClick={() => goExamQuestion(ex.current - 1)} disabled={ex.current === 0}
                  style={{ ...sbtn("184,197,214", false), opacity: ex.current === 0 ? 0.4 : 1, cursor: ex.current === 0 ? "not-allowed" : "pointer" }}>← Previous</button>
                <button onClick={() => toggleExamFlag(ex.current)} style={sbtn("251,191,36", !!ex.flags[ex.current])}>
                  {ex.flags[ex.current] ? "⚑ Unmark" : "⚐ Mark for review"}
                </button>
                <div style={{ flex: 1 }} />
                {isLast
                  ? <button onClick={() => setModal("submit")} style={sbtn("52,211,153", true)}>Review &amp; Submit</button>
                  : <button onClick={() => goExamQuestion(ex.current + 1)} style={sbtn("34,211,238", true)}>Next →</button>}
              </div>
            </div>
          </div>

          <div style={{ flex: "1 1 230px", minWidth: 0 }}>
            <div style={{ background: T.card, border: "1px solid rgba(255,255,255,0.09)", borderRadius: "14px", padding: "14px" }}>
              <div style={{ color: T.pink, fontSize: "11px", fontWeight: 600, letterSpacing: "1px", marginBottom: "10px" }}>QUESTION NAVIGATOR</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(34px,1fr))", gap: "6px" }}>
                {qs.map((_, i) => {
                  const a = ex.answers[i] !== undefined;
                  const f = !!ex.flags[i];
                  const cur = i === ex.current;
                  return (
                    <button key={i} onClick={() => goExamQuestion(i)}
                      style={{ position: "relative", height: "34px", borderRadius: "8px", cursor: "pointer", fontSize: "12px", fontWeight: 600, fontFamily: font, color: a ? T.cyan : T.textMute, background: a ? "rgba(34,211,238,0.14)" : "rgba(255,255,255,0.04)", border: cur ? `2px solid ${T.text}` : `1px solid ${a ? "rgba(34,211,238,0.5)" : "rgba(255,255,255,0.12)"}`, padding: 0 }}>
                      {i + 1}
                      {f && <span style={{ position: "absolute", top: "-3px", right: "-3px", width: "9px", height: "9px", borderRadius: "50%", background: T.amber, border: `1px solid ${T.card}` }} />}
                    </button>
                  );
                })}
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "12px", fontSize: "11px", color: T.textMute }}>
                <span><span style={{ color: T.cyan }}>■</span> Answered ({answered})</span>
                <span><span style={{ color: T.textDim }}>■</span> Unanswered ({qs.length - answered})</span>
                <span><span style={{ color: T.amber }}>●</span> Flagged ({flagged})</span>
              </div>
            </div>
          </div>
        </div>

        {modal && (
          <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.7)", zIndex: 999, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}
            onClick={() => setModal(null)}>
            <div style={{ background: T.card, border: `1px solid ${modal === "quit" ? "rgba(248,113,113,0.45)" : "rgba(52,211,153,0.45)"}`, borderRadius: "14px", padding: "20px 22px", maxWidth: "420px", width: "100%", boxSizing: "border-box" }}
              onClick={e => e.stopPropagation()}>
              <h3 style={{ margin: "0 0 8px", fontSize: "17px", fontWeight: 700, color: modal === "quit" ? T.red : T.green }}>
                {modal === "quit" ? "Exit this exam?" : "Submit your exam?"}
              </h3>
              <p style={{ margin: "0 0 16px", fontSize: "13px", color: T.textSub, lineHeight: "1.7" }}>
                {modal === "quit"
                  ? "Your progress in this attempt will be lost and no score will be saved."
                  : `You have answered ${answered} of ${qs.length} questions.` +
                    (qs.length - answered > 0 ? ` ${qs.length - answered} unanswered will count as incorrect.` : "") +
                    (flagged > 0 ? ` ${flagged} question${flagged > 1 ? "s are" : " is"} still flagged for review.` : "")}
              </p>
              <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end", flexWrap: "wrap" }}>
                <button onClick={() => setModal(null)} style={sbtn("184,197,214", false)}>{modal === "quit" ? "Keep going" : "Keep working"}</button>
                {modal === "quit"
                  ? <button onClick={() => { setModal(null); setExam(null); }} style={sbtn("248,113,113", true)}>Exit exam</button>
                  : <button onClick={() => finishExam(false)} style={sbtn("52,211,153", true)}>Submit exam</button>}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  function renderExamResults() {
    const ex = exam;
    const r = ex.result;
    const qs = ex.questions;
    const lvl = readiness(r.pct);
    const topics = Object.values(r.perTopic)
      .map(v => ({ ...v, pct: Math.round((v.c / v.t) * 100), title: PHASES[v.p].topics[v.i].title }))
      .sort((a, b) => a.pct - b.pct || b.t - a.t);
    const weakT = topics.filter(t => t.pct < 70);
    const fairT = topics.filter(t => t.pct >= 70 && t.pct < 80);
    const strongT = topics.filter(t => t.pct >= 80);
    const domRows = [1, 2, 3].map(d => ({ d, ...r.perDomain[d], pct: r.perDomain[d].t ? Math.round((r.perDomain[d].c / r.perDomain[d].t) * 100) : null })).filter(x => x.t > 0);
    const weakestDom = [...domRows].sort((a, b) => a.pct - b.pct)[0];
    const mins = Math.floor(r.timeUsed / 60000);
    const secs = Math.round((r.timeUsed % 60000) / 1000);
    const CIRC = 2 * Math.PI * 58;
    const items = qs.map((q, i) => ({ q, i, ok: ex.answers[i] === q.ans, flagged: !!ex.flags[i] }));
    const shown = items.filter(it => reviewFilter === "all" ? true : reviewFilter === "flagged" ? it.flagged : !it.ok);
    const wrongCount = items.filter(it => !it.ok).length;
    const flaggedCount = items.filter(it => it.flagged).length;
    const pill = (key, label) => (
      <button key={key} onClick={() => setReviewFilter(key)}
        style={{ background: reviewFilter === key ? "rgba(34,211,238,0.16)" : "transparent", border: `1px solid ${reviewFilter === key ? T.cyan : "rgba(255,255,255,0.12)"}`, color: reviewFilter === key ? T.cyan : T.textMute, padding: "5px 12px", borderRadius: "20px", cursor: "pointer", fontSize: "12px", fontWeight: 600, fontFamily: font }}>
        {label}
      </button>
    );
    const act = (c, filled) => ({ background: filled ? `rgba(${c},0.18)` : "transparent", border: `1px solid rgb(${c})`, color: `rgb(${c})`, padding: "9px 16px", borderRadius: "10px", cursor: "pointer", fontSize: "13px", fontWeight: 600, fontFamily: font });
    return (
      <div style={{ padding: "20px var(--azure-gutter)", width: "100%", margin: 0, boxSizing: "border-box" }}>
        <button onClick={() => setView("dashboard")} style={backBtn}>← Back to Dashboard</button>

        {/* Headline */}
        <div style={{ marginTop: "16px", background: `rgba(${lvl.rgb},0.07)`, border: `2px solid rgba(${lvl.rgb},0.35)`, borderRadius: "16px", padding: "20px", display: "flex", gap: "22px", alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ position: "relative", width: "140px", height: "140px", flexShrink: 0 }}>
            <svg width="140" height="140" viewBox="0 0 140 140" style={{ transform: "rotate(-90deg)" }}>
              <circle cx="70" cy="70" r="58" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="12" />
              <circle cx="70" cy="70" r="58" fill="none" stroke={lvl.color} strokeWidth="12" strokeLinecap="round" strokeDasharray={`${(r.pct / 100) * CIRC} ${CIRC}`} />
            </svg>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <div style={{ fontSize: "34px", fontWeight: 700, color: lvl.color, lineHeight: 1 }}>{r.pct}%</div>
              <div style={{ fontSize: "10px", color: T.textMute, marginTop: "4px", letterSpacing: "1px" }}>PREPARED</div>
            </div>
          </div>
          <div style={{ flex: 1, minWidth: "220px" }}>
            <div style={{ fontSize: "11px", color: T.textMute, letterSpacing: "1.5px", fontWeight: 600 }}>{EXAM_MODES[ex.mode].label.toUpperCase()} · RESULT</div>
            <div style={{ fontSize: "22px", fontWeight: 700, color: lvl.color, margin: "3px 0 6px" }}>{lvl.label} {lvl.emoji}</div>
            <p style={{ margin: "0 0 8px", fontSize: "13px", color: T.textSub, lineHeight: "1.7" }}>{lvl.msg}</p>
            <div style={{ fontSize: "12px", color: T.textMute, lineHeight: "1.7" }}>
              {r.correct} of {r.total} correct · {r.answered} answered · time used {mins}m {String(secs).padStart(2, "0")}s of {ex.minutes}m
              {r.timedOut && <span style={{ color: T.red }}> · time expired, unanswered questions counted as incorrect</span>}
            </div>
          </div>
        </div>

        {/* Domain breakdown */}
        <div style={{ marginTop: "18px", background: T.card, border: "1px solid rgba(255,255,255,0.08)", borderRadius: "14px", padding: "16px" }}>
          <div style={{ color: T.pink, fontSize: "11px", fontWeight: 600, letterSpacing: "1px", marginBottom: "12px" }}>SCORE BY EXAM DOMAIN</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {domRows.map(row => {
              const b = band(row.pct);
              return (
                <div key={row.d}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "10px", flexWrap: "wrap", marginBottom: "5px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                      {domBadge(row.d)}
                      <span style={{ fontSize: "13px", fontWeight: 600 }}>{DOMAINS[row.d].name}</span>
                      <span style={{ fontSize: "11px", color: T.textDim }}>exam weight {DOMAINS[row.d].weight}</span>
                    </div>
                    <div style={{ fontSize: "12px", color: T.textMute }}>
                      {row.c}/{row.t} · <span style={{ color: b.color, fontWeight: 700 }}>{row.pct}% {b.label}</span>
                    </div>
                  </div>
                  <div style={{ height: "10px", background: "rgba(255,255,255,0.07)", borderRadius: "5px", overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${row.pct}%`, background: b.color, borderRadius: "5px" }} />
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ fontSize: "11px", color: T.textDim, marginTop: "12px" }}>
            Strong 80%+ · Almost there 70-79% · Weak below 70% (the real pass mark is about 70%).
          </div>
        </div>

        {/* Focus areas */}
        <div style={{ marginTop: "18px", background: T.card, border: `1px solid ${weakT.length ? "rgba(248,113,113,0.35)" : "rgba(52,211,153,0.35)"}`, borderRadius: "14px", padding: "16px" }}>
          <div style={{ color: weakT.length ? T.red : T.green, fontSize: "11px", fontWeight: 600, letterSpacing: "1px", marginBottom: "8px" }}>
            {weakT.length ? "🎯 WHERE TO CONCENTRATE" : "✅ NO WEAK AREAS FOUND"}
          </div>
          {weakT.length > 0 ? (
            <>
              <p style={{ margin: "0 0 12px", fontSize: "13px", color: T.textSub, lineHeight: "1.7" }}>
                Spend most of your study time on {weakT.slice(0, 3).map(t => t.title).join(", ")}
                {weakT.length > 3 ? ` and ${weakT.length - 3} more` : ""}
                {weakestDom ? `. Your weakest domain is Domain ${weakestDom.d}, ${DOMAINS[weakestDom.d].name} (${weakestDom.pct}%).` : "."}
              </p>
              <div style={{ display: "flex", flexDirection: "column" }}>
                {weakT.map((t, i) => (
                  <div key={t.key} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px 0", borderTop: i ? "1px solid rgba(255,255,255,0.06)" : "none", flexWrap: "wrap" }}>
                    <div style={{ flex: 1, minWidth: "190px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", marginBottom: "5px" }}>
                        {domBadge(t.d)}
                        <span style={{ fontSize: "13px", fontWeight: 600, wordBreak: "break-word" }}>{t.title}</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <div style={{ flex: 1, maxWidth: "220px", height: "6px", background: "rgba(255,255,255,0.07)", borderRadius: "3px", overflow: "hidden" }}>
                          <div style={{ height: "100%", width: `${t.pct}%`, background: T.red }} />
                        </div>
                        <span style={{ fontSize: "11px", color: T.red, fontWeight: 700 }}>{t.pct}%</span>
                        <span style={{ fontSize: "11px", color: T.textDim }}>{t.c}/{t.t} correct</span>
                      </div>
                    </div>
                    <button onClick={() => studyTopic(t.p, t.i)} style={act("34,211,238", false)}>Study lesson →</button>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p style={{ margin: 0, fontSize: "13px", color: T.textSub, lineHeight: "1.7" }}>
              Every topic in this attempt scored 70% or higher. {fairT.length ? "Polish the amber topics below, then " : ""}Take another full mock exam to confirm your result across all domains.
            </p>
          )}
          {(fairT.length > 0 || strongT.length > 0) && (
            <div style={{ marginTop: "14px", paddingTop: "12px", borderTop: "1px solid rgba(255,255,255,0.07)", display: "flex", flexDirection: "column", gap: "10px" }}>
              {fairT.length > 0 && (
                <div>
                  <div style={{ fontSize: "11px", color: T.amber, fontWeight: 600, letterSpacing: "1px", marginBottom: "6px" }}>KEEP REVISING (70-79%)</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                    {fairT.map(t => (
                      <button key={t.key} onClick={() => studyTopic(t.p, t.i)}
                        style={{ background: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.3)", color: T.amber, fontSize: "11px", padding: "4px 10px", borderRadius: "6px", cursor: "pointer", fontFamily: font }}>
                        {t.title} · {t.pct}%
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {strongT.length > 0 && (
                <div>
                  <div style={{ fontSize: "11px", color: T.green, fontWeight: 600, letterSpacing: "1px", marginBottom: "6px" }}>STRONG (80%+)</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                    {strongT.map(t => (
                      <span key={t.key} style={{ background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.3)", color: T.green, fontSize: "11px", padding: "4px 10px", borderRadius: "6px" }}>
                        {t.title} · {t.pct}%
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          {r.total < 30 && (
            <div style={{ fontSize: "11px", color: T.textDim, marginTop: "12px" }}>
              Short test: each topic has only 1-3 questions, so treat topic scores as hints. The Full Mock Exam gives a more reliable picture.
            </div>
          )}
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", margin: "18px 0" }}>
          {weakT.length > 0 && <button onClick={() => startExam("weak", r.weak)} style={act("248,113,113", true)}>🩺 Practice weak areas</button>}
          <button onClick={() => startExam(ex.mode === "weak" ? "full" : ex.mode, r.weak)} style={act("52,211,153", true)}>🔁 Retake {ex.mode === "weak" ? "a full mock" : "this exam type"}</button>
          <button onClick={() => setExam(null)} style={act("184,197,214", false)}>📋 Exam menu</button>
        </div>

        {/* Answer review */}
        <div style={{ background: T.card, border: "1px solid rgba(255,255,255,0.08)", borderRadius: "14px", padding: "16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "10px", flexWrap: "wrap", marginBottom: "12px" }}>
            <div style={{ color: T.pink, fontSize: "11px", fontWeight: 600, letterSpacing: "1px" }}>ANSWER REVIEW</div>
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
              {pill("wrong", `Incorrect (${wrongCount})`)}
              {pill("flagged", `Flagged (${flaggedCount})`)}
              {pill("all", `All (${qs.length})`)}
            </div>
          </div>
          {shown.length === 0 && (
            <div style={{ textAlign: "center", color: T.textMute, fontSize: "13px", padding: "18px 0" }}>Nothing to show for this filter.</div>
          )}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {shown.map(({ q, i, ok }) => {
              const chosen = ex.answers[i];
              return (
                <div key={i} style={{ border: `1px solid ${ok ? "rgba(52,211,153,0.35)" : "rgba(248,113,113,0.35)"}`, borderRadius: "12px", padding: "14px", background: "rgba(255,255,255,0.02)" }}>
                  <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap", marginBottom: "8px" }}>
                    <span style={{ fontSize: "11px", fontWeight: 700, color: ok ? T.green : T.red }}>{ok ? "✓ Correct" : chosen === undefined ? "✗ Not answered" : "✗ Incorrect"}</span>
                    {domBadge(q.d)}
                    <span style={{ fontSize: "11px", color: T.textMute }}>{PHASES[q.p].topics[q.i].title}</span>
                    {ex.flags[i] && <span style={{ fontSize: "11px", color: T.amber }}>⚑ flagged</span>}
                  </div>
                  <div style={{ fontSize: "14px", fontWeight: 600, lineHeight: "1.65", marginBottom: "10px", wordBreak: "break-word" }}>{i + 1}. {q.q}</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                    {q.opts.map((opt, oi) => {
                      const isRight = oi === q.ans;
                      const isMine = oi === chosen;
                      let bg = "rgba(255,255,255,0.03)", bc = "rgba(255,255,255,0.08)", tc = T.textSub;
                      if (isRight) { bg = "rgba(52,211,153,0.12)"; bc = T.green; tc = "#D1FAE5"; }
                      if (isMine && !isRight) { bg = "rgba(248,113,113,0.12)"; bc = T.red; tc = "#FEE2E2"; }
                      return (
                        <div key={oi} style={{ display: "flex", gap: "8px", alignItems: "flex-start", padding: "7px 10px", borderRadius: "8px", background: bg, border: `1px solid ${bc}` }}>
                          <span style={{ fontSize: "11px", fontWeight: 700, color: isRight ? T.green : isMine ? T.red : T.textDim, minWidth: "14px", marginTop: "2px" }}>{isRight ? "✓" : isMine ? "✗" : "·"}</span>
                          <span style={{ fontSize: "13px", color: tc, lineHeight: "1.55", wordBreak: "break-word" }}>
                            {opt}{isMine && <span style={{ color: T.textMute, fontSize: "11px" }}>  (your answer)</span>}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  <div style={{ marginTop: "10px", fontSize: "12px", color: T.textSub, lineHeight: "1.7", borderLeft: `3px solid ${DOMAINS[q.d].color}`, paddingLeft: "10px" }}>
                    {q.explain}
                    {!ok && (
                      <button onClick={() => studyTopic(q.p, q.i)} style={{ marginLeft: "8px", background: "transparent", border: "none", color: T.cyan, cursor: "pointer", fontSize: "12px", fontFamily: font, textDecoration: "underline" }}>
                        Study this lesson →
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  if (view === "exam") {
    return (
      <>
        <style>{POPPINS}</style>
        <SiteHeader />
        <div id="azure-exam" style={{ background: T.bg, fontFamily: font, color: T.text, overflowX: "clip" }}>
          {!exam ? renderExamMenu() : exam.stage === "running" ? renderExamRunning() : renderExamResults()}
          <SiteFooter />
        </div>
      </>
    );
  }

  if (activeScenario) {
    const scen = SCENARIOS.find(s => s.id === activeScenario);
    const scRGB = phaseRGB[scen.phase];
    const scColor = PHASES.find(p => p.id === scen.phase).color;
    const totalCmds = scen.steps.reduce((s, st) => s + st.cmds.length, 0);
    const doneCmds = scen.steps.reduce((s, st, si) => s + (stepDone(scen.id, si) ? st.cmds.length : 0), 0);
    const pct = Math.round((doneCmds / totalCmds) * 100);

    return (
      <>
        <style>{POPPINS}</style>
        <SiteHeader />
        <div id="azure-learning" style={{ background: T.bg, fontFamily: font, color: T.text, overflowX: "clip" }}>
          <div style={{ background: `rgba(${scRGB},0.06)`, borderBottom: `1px solid rgba(${scRGB},0.25)`, padding: "16px var(--azure-gutter)" }}>
            <button onClick={() => setActiveScenario(null)}
              style={{ background: "transparent", border: `1px solid rgba(255,255,255,0.15)`, color: T.textSub, padding: "6px 14px", borderRadius: "8px", cursor: "pointer", fontSize: "13px", fontFamily: font, marginBottom: "12px" }}>
              ← Back
            </button>
            <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", flexWrap: "wrap" }}>
              <div style={{ fontSize: "36px", flexShrink: 0 }}>{scen.emoji}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", gap: "6px", marginBottom: "6px", flexWrap: "wrap" }}>
                  <span style={{ background: `rgba(${scRGB},0.18)`, color: scColor, fontSize: "11px", fontWeight: 700, letterSpacing: "1.5px", padding: "3px 10px", borderRadius: "20px" }}>{scen.difficulty.toUpperCase()}</span>
                  <span style={{ background: "rgba(255,255,255,0.07)", color: T.textMute, fontSize: "11px", padding: "3px 10px", borderRadius: "20px" }}>{scen.duration}</span>
                  <span style={{ background: `rgba(248,113,113,0.15)`, color: T.red, fontSize: "11px", fontWeight: 600, padding: "3px 10px", borderRadius: "20px" }}>Exam Weight: {scen.examWeight}</span>
                </div>
                <h2 style={{ margin: "0 0 4px", fontSize: "20px", fontWeight: 700, color: T.text, wordBreak: "break-word" }}>{scen.title}</h2>
                <p style={{ margin: "0 0 8px", color: T.textSub, fontSize: "13px" }}>{scen.subtitle}</p>
                <p style={{ margin: 0, color: T.textMute, fontSize: "13px", lineHeight: "1.7", wordBreak: "break-word" }}>
                  <b style={{ color: scColor }}>Goal: </b>{scen.goal}
                </p>
              </div>
              <div style={{ background: `rgba(${scRGB},0.1)`, border: `1px solid rgba(${scRGB},0.3)`, borderRadius: "12px", padding: "12px 16px", textAlign: "center", flexShrink: 0 }}>
                <div style={{ fontSize: "26px", fontWeight: 700, color: scColor, lineHeight: 1 }}>{pct}%</div>
                <div style={{ fontSize: "11px", color: T.textMute, marginTop: "3px" }}>DONE</div>
                <div style={{ fontSize: "11px", color: T.textDim, marginTop: "2px" }}>{doneCmds}/{totalCmds}</div>
              </div>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "5px", marginTop: "12px" }}>
              {scen.concepts.map((c, i) => (
                <span key={i} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: T.textSub, fontSize: "11px", padding: "3px 9px", borderRadius: "6px" }}>{c}</span>
              ))}
            </div>
          </div>

          <div style={{ padding: "20px var(--azure-gutter)", width: "100%", margin: 0, boxSizing: "border-box" }}>
            {scen.steps.map((step, si) => {
              const done = stepDone(scen.id, si);
              return (
                <div key={si} style={{ marginBottom: "16px", display: "flex", gap: "12px" }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                    <button onClick={() => toggleStep(scen.id, si)}
                      style={{ width: "36px", height: "36px", borderRadius: "50%", border: `2px solid ${done ? scColor : "rgba(255,255,255,0.15)"}`, background: done ? `rgba(${scRGB},0.2)` : "rgba(255,255,255,0.04)", color: done ? scColor : T.textMute, fontSize: "13px", fontWeight: 700, cursor: "pointer", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: font }}>
                      {done ? "✓" : si + 1}
                    </button>
                    {si < scen.steps.length - 1 && <div style={{ width: "2px", flex: 1, background: done ? `rgba(${scRGB},0.35)` : "rgba(255,255,255,0.07)", marginTop: "6px", minHeight: "16px" }} />}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ background: done ? `rgba(${scRGB},0.05)` : T.card, border: `1px solid ${done ? `rgba(${scRGB},0.3)` : "rgba(255,255,255,0.08)"}`, borderRadius: "12px", overflow: "hidden" }}>
                      <div style={{ padding: "12px 16px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "10px", flexWrap: "wrap" }}>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <span style={{ fontSize: "10px", color: T.textDim, fontWeight: 500, letterSpacing: "1px" }}>STEP {si + 1}</span>
                            <h3 style={{ margin: "3px 0 0", fontSize: "15px", fontWeight: 700, color: done ? scColor : T.text, wordBreak: "break-word" }}>{step.title}</h3>
                          </div>
                          <button onClick={() => toggleStep(scen.id, si)}
                            style={{ background: done ? `rgba(${scRGB},0.15)` : "rgba(255,255,255,0.05)", border: `1px solid ${done ? scColor : "rgba(255,255,255,0.12)"}`, color: done ? scColor : T.textMute, padding: "5px 12px", borderRadius: "8px", cursor: "pointer", fontSize: "12px", fontWeight: 600, fontFamily: font, whiteSpace: "nowrap", flexShrink: 0 }}>
                            {done ? "✓ Done" : "Mark Done"}
                          </button>
                        </div>
                        {step.context && (
                          <p style={{ margin: "8px 0 0", fontSize: "13px", color: T.textSub, lineHeight: "1.7", background: "rgba(255,255,255,0.03)", borderLeft: `3px solid rgba(${scRGB},0.4)`, padding: "7px 10px", borderRadius: "0 6px 6px 0", wordBreak: "break-word" }}>{step.context}</p>
                        )}
                      </div>
                      <div style={{ padding: "12px 16px", display: "flex", flexDirection: "column", gap: "10px" }}>
                        {step.cmds.map(({ cmd, why }, ci) => (
                          <div key={ci} style={{ background: "#060B14", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "10px", overflow: "hidden" }}>
                            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", padding: "10px 12px", borderBottom: "1px solid rgba(255,255,255,0.05)", gap: "8px" }}>
                              <pre style={{ fontFamily: mono, fontSize: "12px", color: T.green, flex: 1, margin: 0, whiteSpace: "pre-wrap", wordBreak: "break-all", lineHeight: "1.6" }}>
                                <span style={{ color: T.textDim, userSelect: "none" }}>$ </span>{cmd}
                              </pre>
                              <button onClick={() => copyCmd(cmd)}
                                style={{ background: copiedCmd === cmd ? `rgba(${scRGB},0.2)` : "rgba(255,255,255,0.06)", border: `1px solid ${copiedCmd === cmd ? scColor : "rgba(255,255,255,0.1)"}`, color: copiedCmd === cmd ? scColor : T.textMute, padding: "3px 9px", borderRadius: "6px", cursor: "pointer", fontSize: "11px", fontWeight: 600, fontFamily: font, flexShrink: 0, whiteSpace: "nowrap" }}>
                                {copiedCmd === cmd ? "✓" : "Copy"}
                              </button>
                            </div>
                            <div style={{ padding: "9px 12px", display: "flex", gap: "8px", alignItems: "flex-start" }}>
                              <span style={{ color: scColor, fontSize: "11px", fontWeight: 700, flexShrink: 0, marginTop: "2px", letterSpacing: "0.5px" }}>WHY</span>
                              <span style={{ fontSize: "12px", color: T.textSub, lineHeight: "1.75", wordBreak: "break-word" }}>{why}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            {scenarioDone(scen) && (
              <div style={{ background: `rgba(${scRGB},0.1)`, border: `2px solid rgba(${scRGB},0.4)`, borderRadius: "14px", padding: "20px", textAlign: "center" }}>
                <div style={{ fontSize: "36px", marginBottom: "8px" }}>🎉</div>
                <div style={{ fontSize: "18px", fontWeight: 700, color: scColor, marginBottom: "5px" }}>Scenario Complete!</div>
                <div style={{ color: T.textSub, fontSize: "13px", marginBottom: "14px" }}>You ran all {totalCmds} steps. Great hands-on practice for AZ-900.</div>
                <button onClick={() => setActiveScenario(null)}
                  style={{ background: `rgba(${scRGB},0.2)`, border: `1px solid ${scColor}`, color: scColor, padding: "9px 22px", borderRadius: "10px", cursor: "pointer", fontSize: "14px", fontWeight: 600, fontFamily: font }}>
                  Back to All Scenarios
                </button>
              </div>
            )}
          </div>
          <SiteFooter />
        </div>
      </>
    );
  }

  return (
    <>
      <style>{POPPINS}</style>
        <SiteHeader />
      <div style={{ background: T.bg, fontFamily: font, color: T.text, overflowX: "clip" }}>

        {/* Glossary Modal */}
        {glossaryWord && (
          <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.65)", zIndex: 999, display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "60px 16px 16px" }}
            onClick={() => setGlossaryWord(null)}>
            <div style={{ background: T.card, border: `1px solid rgba(${rgb},0.4)`, borderRadius: "14px", padding: "20px 24px", maxWidth: "520px", width: "100%", boxSizing: "border-box" }}
              onClick={e => e.stopPropagation()}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                <div>
                  <span style={{ fontSize: "10px", color: T.textDim, letterSpacing: "1.5px" }}>GLOSSARY</span>
                  <h3 style={{ margin: "3px 0 0", fontSize: "18px", fontWeight: 700, color }}>
                    {glossaryWord}
                  </h3>
                </div>
                <button onClick={() => setGlossaryWord(null)}
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: T.textMute, width: "30px", height: "30px", borderRadius: "50%", cursor: "pointer", fontSize: "14px", fontFamily: font }}>✕</button>
              </div>
              <p style={{ margin: 0, fontSize: "14px", color: T.textSub, lineHeight: "1.8", wordBreak: "break-word" }}>
                {GLOSSARY[glossaryWord] || "Definition not found."}
              </p>
            </div>
          </div>
        )}

        {/* Header */}
        <div id="azure-overview" style={{ borderBottom: `1px solid rgba(${rgb},0.2)`, padding: "20px var(--azure-gutter) 16px", background: `rgba(${rgb},0.04)` }}>
          <div className="azure-summary-layout" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px" }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "5px", flexWrap: "wrap" }}>
                <span style={{ background: `rgba(${rgb},0.18)`, border: `1px solid rgba(${rgb},0.4)`, color, fontSize: "10px", fontWeight: 600, letterSpacing: "1.5px", padding: "3px 10px", borderRadius: "20px" }}>AZ-900 PREP · v1.0</span>
              </div>
              <h1 style={{ fontSize: "clamp(18px,4vw,32px)", fontWeight: 700, margin: "0 0 3px", color: T.text, lineHeight: 1.2, wordBreak: "break-word" }}>
                Azure Fundamentals: <span style={{ color }}>Zero → Certified</span>
              </h1>
              <p style={{ color: T.textSub, fontSize: "13px", margin: 0 }}>
                {totalWeeks} Weeks · 3 Exam Domains · {totalTopics} Topics · {SCENARIOS.length} Scenarios · MCQ Assessments · {QUESTION_BANK.length} Mock Exam Questions
              </p>
            </div>
            <div style={{ display: "flex", gap: "8px", alignItems: "flex-start", flexWrap: "wrap" }}>
              <div style={{ background: `rgba(${rgb},0.1)`, border: `1px solid rgba(${rgb},0.3)`, borderRadius: "12px", padding: "10px 16px", textAlign: "center" }}>
                <div style={{ fontSize: "24px", fontWeight: 700, color, lineHeight: 1 }}>{totalPct()}%</div>
                <div style={{ fontSize: "10px", color: T.textMute, marginTop: "3px" }}>OVERALL</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <button onClick={openExam}
                  style={{ background: "rgba(52,211,153,0.16)", border: `1px solid ${T.green}`, color: T.green, padding: "6px 12px", borderRadius: "8px", cursor: "pointer", fontSize: "12px", fontWeight: 700, fontFamily: font, boxShadow: "0 0 14px rgba(52,211,153,0.2)" }}>
                  {exam && exam.stage === "running" ? "▶ Resume Exam" : "📝 Mock Exam"}
                </button>
                <button onClick={() => setShowCheatsheet(p => !p)}
                  style={{ background: showCheatsheet ? `rgba(167,139,250,0.18)` : "transparent", border: `1px solid ${T.violet}`, color: T.violet, padding: "6px 12px", borderRadius: "8px", cursor: "pointer", fontSize: "12px", fontWeight: 600, fontFamily: font }}>
                  {showCheatsheet ? "▲ Cheatsheet" : "▼ Cheatsheet"}
                </button>
                <button onClick={() => setShowLinks(p => !p)}
                  style={{ background: showLinks ? `rgba(251,191,36,0.18)` : "transparent", border: `1px solid ${T.amber}`, color: T.amber, padding: "6px 12px", borderRadius: "8px", cursor: "pointer", fontSize: "12px", fontWeight: 600, fontFamily: font }}>
                  {showLinks ? "▲ AZ-900 Links" : "▼ AZ-900 Links"}
                </button>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: "8px", marginTop: "16px", flexWrap: "wrap" }}>
            {PHASES.map((p, i) => {
              const pRGB = phaseRGB[p.id]; const active = activePhase === i;
              return (
                <button key={p.id} onClick={() => { setActivePhase(i); setActiveTab("topics"); setExpandedTopic(null); setOpenSolution(null); }}
                  style={{ background: active ? `rgba(${pRGB},0.16)` : "rgba(255,255,255,0.04)", border: `2px solid ${active ? p.color : "rgba(255,255,255,0.1)"}`, color: active ? p.color : T.textMute, padding: "8px 16px", borderRadius: "10px", cursor: "pointer", fontSize: "12px", fontWeight: 600, fontFamily: font, boxShadow: active ? `0 0 16px rgba(${pRGB},0.2)` : "none", display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
                  <span style={{ fontSize: "16px" }}>{p.icon}</span>
                  <span>{p.badge} · {p.level}</span>
                  <span style={{ fontSize: "10px", opacity: .55, fontWeight: 400 }}>{p.duration}</span>
                  {mcqChecked[p.id] && <span style={{ background: `rgba(${pRGB},0.2)`, color: T.green, fontSize: "10px", fontWeight: 700, padding: "2px 6px", borderRadius: "6px" }}>✓ {quizScore(p.id).pct}%</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* Cheatsheet */}
        {showCheatsheet && (
          <div style={{ background: `rgba(167,139,250,0.06)`, borderBottom: `1px solid rgba(167,139,250,0.18)`, padding: "16px var(--azure-gutter)" }}>
            <p style={{ color: T.violet, fontSize: "11px", letterSpacing: "1.5px", margin: "0 0 12px", fontWeight: 600 }}>// ESSENTIAL AZURE CLI CHEATSHEET</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: "10px" }}>
              {CHEATSHEET.map(cat => (
                <div key={cat.cat} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(167,139,250,0.15)", borderRadius: "10px", padding: "12px" }}>
                  <div style={{ color: T.violet, fontSize: "11px", letterSpacing: "1px", fontWeight: 600, marginBottom: "8px" }}>{cat.cat}</div>
                  {cat.cmds.map((cmd, i) => (
                    <div key={i} style={{ fontFamily: mono, fontSize: "11px", color: T.green, padding: "3px 0", borderBottom: i < cat.cmds.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none", wordBreak: "break-all" }}>$ {cmd}</div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Links */}
        {showLinks && (
          <div style={{ background: `rgba(251,191,36,0.04)`, borderBottom: `1px solid rgba(251,191,36,0.18)`, padding: "16px var(--azure-gutter)" }}>
            <p style={{ color: T.amber, fontSize: "11px", letterSpacing: "1.5px", margin: "0 0 12px", fontWeight: 600 }}>// AZ-900 STUDY RESOURCES</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: "10px" }}>
              {AZ_LINKS.map(cat => (
                <div key={cat.cat} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(251,191,36,0.15)", borderRadius: "10px", padding: "12px" }}>
                  <div style={{ color: T.amber, fontSize: "11px", letterSpacing: "1px", fontWeight: 600, marginBottom: "8px" }}>{cat.cat}</div>
                  {cat.links.map((l, i) => (
                    <a key={i} href={l.url} target="_blank" rel="noopener noreferrer"
                      style={{ display: "block", fontSize: "12px", color: T.textSub, padding: "4px 0", borderBottom: i < cat.links.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none", textDecoration: "none", wordBreak: "break-word", lineHeight: "1.5" }}>
                      <span style={{ color: T.amber, marginRight: "4px" }}>↗</span>{l.title}
                    </a>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Main Content */}
        <div id="azure-learning" style={{ padding: "20px var(--azure-gutter)", boxSizing: "border-box" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "10px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: `rgba(${rgb},0.15)`, border: `2px solid rgba(${rgb},0.4)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", flexShrink: 0 }}>{phase.icon}</div>
              <div>
                <div style={{ color, fontSize: "11px", fontWeight: 600, letterSpacing: "1.5px" }}>{phase.level} · {phase.duration} · {phase.topics.length} Topics</div>
                <h2 style={{ margin: "2px 0 0", fontSize: "18px", fontWeight: 700, color: T.text }}>{phase.title}</h2>
                <div style={{ color: T.textSub, fontSize: "13px" }}>{phase.subtitle}</div>
              </div>
            </div>
            {mcqChecked[phaseId] && (
              <div style={{ background: `rgba(${rgb},0.1)`, border: `1px solid rgba(${rgb},0.3)`, borderRadius: "12px", padding: "10px 16px", textAlign: "center" }}>
                <div style={{ fontSize: "22px", fontWeight: 700, color, lineHeight: 1 }}>{quizScore(phaseId).pct}%</div>
                <div style={{ fontSize: "10px", color: T.textMute, marginTop: "2px" }}>{quizScore(phaseId).correct}/{quizScore(phaseId).total} CORRECT</div>
              </div>
            )}
          </div>

          {/* Tabs */}
          <div style={{ display: "flex", gap: "2px", borderBottom: "2px solid rgba(255,255,255,0.07)", marginBottom: "18px", overflowX: "auto", overflowY: "hidden", paddingBottom: "2px", scrollbarWidth: "none" }}>
            {["topics", "labs", "scenarios", "assessment"].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                style={{ background: "transparent", border: "none", borderBottom: activeTab === tab ? `3px solid ${color}` : "3px solid transparent", color: activeTab === tab ? color : T.textMute, padding: "8px 16px", cursor: "pointer", fontSize: "12px", fontWeight: activeTab === tab ? 600 : 400, fontFamily: font, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "-2px", whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: "5px" }}>
                {tab}
                {tab === "scenarios" && phaseScenarios.length > 0 && (
                  <span style={{ background: `rgba(${rgb},0.2)`, color, fontSize: "10px", fontWeight: 700, padding: "1px 5px", borderRadius: "10px" }}>{phaseScenarios.length}</span>
                )}
              </button>
            ))}
          </div>

          {/* TOPICS */}
          {activeTab === "topics" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <p style={{ margin: "0 0 10px", fontSize: "12px", color: T.textMute, lineHeight: "1.6" }}>
                Click <span style={{ color, textDecoration: "underline dotted", fontWeight: 600 }}>underlined keywords</span> in any lesson explanation to expand their definition.
              </p>
              {phase.topics.map((topic, ti) => {
                const isOpen = expandedTopic === ti;
                return (
                  <div key={ti} style={{ border: `1px solid ${isOpen ? color + "60" : "rgba(255,255,255,0.08)"}`, borderRadius: "12px", overflow: "hidden", background: isOpen ? `rgba(${rgb},0.05)` : "rgba(255,255,255,0.02)" }}>
                    <button onClick={() => setExpandedTopic(isOpen ? null : ti)}
                      style={{ width: "100%", background: "transparent", border: "none", padding: "14px 16px", cursor: "pointer", textAlign: "left", display: "flex", justifyContent: "space-between", alignItems: "center", fontFamily: font, gap: "10px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px", flex: 1, minWidth: 0 }}>
                        <span style={{ background: isOpen ? color : `rgba(${rgb},0.2)`, color: isOpen ? "#000" : color, width: "28px", height: "28px", borderRadius: "7px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: 700, flexShrink: 0 }}>{ti + 1}</span>
                        <span style={{ fontSize: "15px", fontWeight: 600, color: T.text, wordBreak: "break-word" }}>{topic.title}</span>
                      </div>
                      <span style={{ color, fontSize: "16px", transform: isOpen ? "rotate(90deg)" : "none", flexShrink: 0 }}>▶</span>
                    </button>
                    {isOpen && (
                      <div style={{ padding: "0 16px 16px" }}>
                        <div style={{ background: T.surface, border: `1px solid rgba(${rgb},0.25)`, borderLeft: `4px solid ${color}`, borderRadius: "0 10px 10px 0", padding: "14px 16px", marginBottom: "14px" }}>
                          <span style={{ background: `rgba(${rgb},0.18)`, color, fontSize: "10px", fontWeight: 700, letterSpacing: "1.5px", padding: "3px 9px", borderRadius: "20px", display: "inline-block", marginBottom: "10px" }}>📖 LESSON</span>
                          {renderExplanation(topic.explanation, topic.keywords)}
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: "14px" }}>
                          <div>
                            <div style={{ color: T.pink, fontSize: "11px", fontWeight: 600, letterSpacing: "1px", marginBottom: "10px" }}>WHAT YOU'LL LEARN</div>
                            {topic.subtopics.map((s, si) => (
                              <div key={si} style={{ display: "flex", gap: "8px", alignItems: "flex-start", marginBottom: "7px" }}>
                                <span style={{ color, marginTop: "4px", flexShrink: 0 }}>›</span>
                                <span style={{ fontSize: "13px", color: T.textSub, lineHeight: "1.6", wordBreak: "break-word" }}>{s}</span>
                              </div>
                            ))}
                            {topic.resources && (
                              <div style={{ marginTop: "14px" }}>
                                <div style={{ color: T.amber, fontSize: "11px", fontWeight: 600, letterSpacing: "1px", marginBottom: "8px" }}>📚 FURTHER READING</div>
                                {topic.resources.map((r, ri) => (
                                  <a key={ri} href={r.url} target="_blank" rel="noopener noreferrer"
                                    style={{ display: "flex", alignItems: "flex-start", gap: "6px", fontSize: "12px", color: T.textSub, marginBottom: "5px", textDecoration: "none", wordBreak: "break-word", lineHeight: "1.5" }}>
                                    <span style={{ color: T.amber, flexShrink: 0, marginTop: "1px" }}>↗</span>
                                    <span style={{ borderBottom: `1px solid rgba(251,191,36,0.3)` }}>{r.title}</span>
                                  </a>
                                ))}
                              </div>
                            )}
                          </div>
                          <div>
                            <div style={{ color: T.green, fontSize: "11px", fontWeight: 600, letterSpacing: "1px", marginBottom: "10px" }}>KEY COMMANDS</div>
                            <div style={{ background: "#060B14", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "10px", overflow: "hidden" }}>
                              {topic.commands.map(({ cmd, desc }, ci) => (
                                <div key={ci} style={{ padding: "10px 12px", borderBottom: ci < topic.commands.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none" }}>
                                  <div style={{ fontFamily: mono, fontSize: "11px", color: T.green, marginBottom: "4px", wordBreak: "break-all" }}><span style={{ color: T.textDim }}>$ </span>{cmd}</div>
                                  <div style={{ fontSize: "12px", color: T.textSub, lineHeight: "1.6", paddingLeft: "12px", borderLeft: `2px solid rgba(${rgb},0.35)`, wordBreak: "break-word" }}>{desc}</div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* SCENARIOS */}
          {activeTab === "scenarios" && (
            <div>
              {phaseScenarios.length === 0 ? (
                <div style={{ textAlign: "center", padding: "50px 20px", color: T.textMute }}>
                  <div style={{ fontSize: "36px", marginBottom: "12px" }}>🚧</div>
                  <div style={{ fontSize: "15px" }}>No scenarios for this level yet.</div>
                </div>
              ) : (
                <>
                  <p style={{ color: T.textSub, fontSize: "13px", marginTop: 0, marginBottom: "16px", lineHeight: "1.7" }}>
                    Each scenario is a complete, real-world task you run step-by-step in Azure Cloud Shell or the portal. Every step has a WHY explanation tied to an exam concept. Use a free account and always run the cleanup step.
                  </p>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: "12px" }}>
                    {phaseScenarios.map(scen => {
                      const done = scenarioDone(scen);
                      const scRGB = phaseRGB[scen.phase];
                      const scColor = PHASES.find(p => p.id === scen.phase).color;
                      const totalCmds = scen.steps.reduce((s, st) => s + st.cmds.length, 0);
                      const doneCmds = scen.steps.reduce((s, st, si) => s + (stepDone(scen.id, si) ? st.cmds.length : 0), 0);
                      const pct = Math.round((doneCmds / totalCmds) * 100);
                      const dc = scen.difficulty === "Beginner" ? T.green : scen.difficulty === "Intermediate" ? T.amber : T.red;
                      return (
                        <div key={scen.id} style={{ background: T.card, border: `1px solid ${done ? `rgba(${scRGB},0.4)` : "rgba(255,255,255,0.08)"}`, borderRadius: "14px", overflow: "hidden", cursor: "pointer" }}
                          onClick={() => setActiveScenario(scen.id)}>
                          <div style={{ height: "3px", background: done ? scColor : `linear-gradient(90deg,${scColor} ${pct}%,rgba(255,255,255,0.08) ${pct}%)` }} />
                          <div style={{ padding: "16px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
                              <div style={{ fontSize: "28px" }}>{scen.emoji}</div>
                              <div style={{ textAlign: "right" }}>
                                <div style={{ fontSize: "18px", fontWeight: 700, color: pct === 0 ? T.textMute : scColor, lineHeight: 1 }}>{pct}%</div>
                                <div style={{ fontSize: "10px", color: T.textDim, marginTop: "2px" }}>{doneCmds}/{totalCmds}</div>
                              </div>
                            </div>
                            <div style={{ display: "flex", gap: "5px", marginBottom: "7px", flexWrap: "wrap" }}>
                              <span style={{ fontSize: "10px", fontWeight: 600, color: dc, background: `${dc}1A`, padding: "2px 7px", borderRadius: "5px" }}>{scen.difficulty}</span>
                              <span style={{ fontSize: "10px", color: T.textDim, background: "rgba(255,255,255,0.05)", padding: "2px 7px", borderRadius: "5px" }}>{scen.duration}</span>
                              <span style={{ fontSize: "10px", color: scen.examWeight === "Critical" ? T.red : T.amber, background: scen.examWeight === "Critical" ? "rgba(248,113,113,0.12)" : "rgba(251,191,36,0.12)", padding: "2px 7px", borderRadius: "5px", fontWeight: 600 }}>EXAM: {scen.examWeight}</span>
                            </div>
                            <h3 style={{ margin: "0 0 3px", fontSize: "14px", fontWeight: 700, color: T.text, wordBreak: "break-word" }}>{scen.title}</h3>
                            <p style={{ margin: "0 0 10px", fontSize: "12px", color: T.textSub, lineHeight: "1.5" }}>{scen.subtitle}</p>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: "3px", marginBottom: "12px" }}>
                              {scen.concepts.slice(0, 3).map((c, i) => (
                                <span key={i} style={{ fontSize: "10px", color: T.textDim, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", padding: "2px 7px", borderRadius: "4px" }}>{c}</span>
                              ))}
                              {scen.concepts.length > 3 && <span style={{ fontSize: "10px", color: T.textDim }}>+{scen.concepts.length - 3}</span>}
                            </div>
                            <div style={{ background: `rgba(${scRGB},0.12)`, border: `1px solid rgba(${scRGB},0.3)`, borderRadius: "8px", padding: "7px 12px", color: scColor, fontSize: "12px", fontWeight: 600, textAlign: "center" }}>
                              {done ? "✓ Completed - Review" : "▶ Start Scenario"}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          )}

          {/* LABS */}
          {activeTab === "labs" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {phase.labs.map((lab, li) => {
                const dc = diffColor(lab.difficulty);
                const isOpen = openSolution === li;
                return (
                  <div key={li} style={{ background: T.card, border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", overflow: "hidden" }}>
                    <div style={{ height: "3px", background: dc }} />
                    <div style={{ padding: "16px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px", flexWrap: "wrap" }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "7px", flexWrap: "wrap" }}>
                            <span style={{ fontSize: "11px", color: T.textDim, fontWeight: 500 }}>LAB {li + 1 + labOffset}</span>
                            <span style={{ fontSize: "11px", fontWeight: 600, padding: "2px 9px", borderRadius: "20px", color: dc, background: `${dc}1A` }}>{lab.difficulty.toUpperCase()}</span>
                          </div>
                          <div style={{ fontSize: "15px", fontWeight: 700, color, marginBottom: "6px", wordBreak: "break-word" }}>{lab.title}</div>
                          <div style={{ fontSize: "13px", color: T.textSub, lineHeight: "1.75", wordBreak: "break-word" }}>{lab.desc}</div>
                        </div>
                        <button onClick={() => setOpenSolution(isOpen ? null : li)}
                          style={{ background: isOpen ? `rgba(${rgb},0.18)` : "rgba(255,255,255,0.06)", border: `1px solid ${isOpen ? color : "rgba(255,255,255,0.12)"}`, color: isOpen ? color : T.textSub, padding: "7px 14px", borderRadius: "8px", cursor: "pointer", fontSize: "12px", fontWeight: 600, fontFamily: font, flexShrink: 0, whiteSpace: "nowrap" }}>
                          {isOpen ? "▲ Hide" : "▼ Solution"}
                        </button>
                      </div>
                      {isOpen && (
                        <div style={{ marginTop: "12px", background: "#060B14", border: `1px solid rgba(${rgb},0.25)`, borderLeft: `4px solid ${color}`, borderRadius: "0 10px 10px 0", padding: "14px 16px" }}>
                          <div style={{ color, fontSize: "11px", fontWeight: 700, letterSpacing: "1px", marginBottom: "10px" }}>💡 SOLUTION</div>
                          <pre style={{ margin: 0, fontFamily: mono, fontSize: "11px", color: T.green, lineHeight: "1.8", whiteSpace: "pre-wrap", wordBreak: "break-all" }}>{lab.solution}</pre>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
              <div style={{ background: `rgba(${rgb},0.06)`, border: `2px dashed rgba(${rgb},0.25)`, borderRadius: "12px", padding: "12px 8px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginBottom: "8px" }}>
                  <span style={{ fontSize: "18px" }}>🔧</span>
                  <span style={{ color, fontSize: "13px", fontWeight: 600 }}>Free Practice Platforms</span>
                </div>
                {[0, 2].map(r => (
                  <div key={r}>
                    {r > 0 && <div style={{ height: "1px", margin: "2px 10px", background: `linear-gradient(90deg, transparent, rgba(${rgb},0.4), transparent)` }} />}
                    <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 1px minmax(0,1fr)" }}>
                      {platformCell(PRACTICE_PLATFORMS[r])}
                      <div style={{ background: "linear-gradient(180deg, transparent, rgba(255,255,255,0.2), transparent)" }} />
                      {platformCell(PRACTICE_PLATFORMS[r + 1])}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ASSESSMENT */}
          {activeTab === "assessment" && (
            <div>
              {mcqChecked[phaseId] && (() => {
                const s = quizScore(phaseId);
                const grade = s.pct >= 85 ? { label: "Exam Ready! 🏆", c: T.green } : s.pct >= 70 ? { label: "Close - Review Misses 📖", c: T.amber } : { label: "Needs More Practice 🔁", c: T.red };
                return (
                  <div style={{ background: `rgba(${rgb},0.08)`, border: `2px solid rgba(${rgb},0.3)`, borderRadius: "14px", padding: "16px 20px", marginBottom: "16px", display: "flex", alignItems: "center", gap: "20px", flexWrap: "wrap" }}>
                    <div style={{ textAlign: "center", minWidth: "70px" }}>
                      <div style={{ fontSize: "36px", fontWeight: 700, color, lineHeight: 1 }}>{s.pct}%</div>
                      <div style={{ fontSize: "11px", color: T.textMute, marginTop: "3px" }}>{s.correct} / {s.total}</div>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: "16px", fontWeight: 700, color: grade.c }}>{grade.label}</div>
                      <div style={{ fontSize: "13px", color: T.textSub, marginTop: "3px" }}>The real exam pass mark is 700/1000 (about 70%). Explanations shown below each question.</div>
                    </div>
                    <button onClick={retryQuiz} style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.2)", color: T.textSub, padding: "7px 16px", borderRadius: "8px", cursor: "pointer", fontSize: "12px", fontWeight: 600, fontFamily: font }}>Retry</button>
                  </div>
                );
              })()}
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {phase.assessment.questions.map((q, qi) => {
                  const chosen = mcqAnswers[`${phaseId}-${qi}`];
                  const checked = mcqChecked[phaseId];
                  const isRight = chosen === q.answer;
                  return (
                    <div key={qi} style={{ background: T.card, border: `1px solid ${checked ? (isRight ? "rgba(52,211,153,0.4)" : "rgba(248,113,113,0.4)") : "rgba(255,255,255,0.08)"}`, borderRadius: "12px", padding: "16px" }}>
                      <div style={{ display: "flex", gap: "10px", marginBottom: "12px" }}>
                        <span style={{ background: `rgba(${rgb},0.22)`, color, width: "26px", height: "26px", borderRadius: "7px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 700, flexShrink: 0, marginTop: "1px" }}>Q{qi + 1}</span>
                        <span style={{ fontSize: "14px", color: T.text, lineHeight: "1.65", fontWeight: 600, wordBreak: "break-word" }}>{q.q}</span>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: "6px", paddingLeft: "36px" }}>
                        {q.options.map((opt, oi) => {
                          const selected = chosen === oi; const isCorrect = oi === q.answer;
                          let bg = "rgba(255,255,255,0.03)", bc = "rgba(255,255,255,0.1)", tc = T.textSub;
                          if (!checked && selected) { bg = `rgba(${rgb},0.14)`; bc = color; tc = T.text; }
                          if (checked && isCorrect) { bg = "rgba(52,211,153,0.12)"; bc = T.green; tc = "#D1FAE5"; }
                          if (checked && selected && !isCorrect) { bg = "rgba(248,113,113,0.12)"; bc = T.red; tc = "#FEE2E2"; }
                          return (
                            <div key={oi} onClick={() => pickAnswer(qi, oi)}
                              style={{ display: "flex", alignItems: "flex-start", gap: "8px", padding: "9px 12px", borderRadius: "8px", cursor: checked ? "default" : "pointer", background: bg, border: `1px solid ${bc}` }}>
                              <div style={{ width: "16px", height: "16px", borderRadius: "50%", border: `2px solid ${bc}`, background: ((!checked && selected) || (checked && isCorrect)) ? bc : "transparent", flexShrink: 0, marginTop: "2px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                {checked && isCorrect && <span style={{ fontSize: "9px", color: "#000", fontWeight: 900 }}>✓</span>}
                                {checked && selected && !isCorrect && <span style={{ fontSize: "9px", color: "#fff", fontWeight: 900 }}>✗</span>}
                              </div>
                              <span style={{ fontSize: "13px", color: tc, lineHeight: "1.55", wordBreak: "break-word" }}>{opt}</span>
                            </div>
                          );
                        })}
                      </div>
                      {checked && (
                        <div style={{ marginTop: "10px", paddingLeft: "36px" }}>
                          <div style={{ background: isRight ? "rgba(52,211,153,0.08)" : "rgba(248,113,113,0.08)", border: `1px solid ${isRight ? "rgba(52,211,153,0.3)" : "rgba(248,113,113,0.3)"}`, borderRadius: "8px", padding: "10px 12px", display: "flex", gap: "8px", alignItems: "flex-start" }}>
                            <span style={{ fontSize: "12px", fontWeight: 700, color: isRight ? T.green : T.red, flexShrink: 0 }}>{isRight ? "✓ Correct" : "✗ Wrong"}</span>
                            <span style={{ fontSize: "12px", color: T.textSub, lineHeight: "1.65", wordBreak: "break-word" }}>{q.explain}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              {!mcqChecked[phaseId] && (
                <div style={{ marginTop: "16px", textAlign: "center" }}>
                  <button onClick={submitQuiz} disabled={!allAnswered}
                    style={{ background: allAnswered ? `rgba(${rgb},0.2)` : "rgba(255,255,255,0.04)", border: `2px solid ${allAnswered ? color : "rgba(255,255,255,0.1)"}`, color: allAnswered ? color : T.textDim, padding: "10px 30px", borderRadius: "10px", cursor: allAnswered ? "pointer" : "not-allowed", fontSize: "14px", fontWeight: 700, fontFamily: font, letterSpacing: "1px" }}>
                    Submit Quiz ({answeredCount}/{phase.assessment.questions.length} answered)
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        <SiteFooter />
      </div>
    </>
  );
}
