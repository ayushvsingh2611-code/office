# ☁️ AgentHive — Production AWS Cloud Architecture & Deployment Guide

> **Cloud Infrastructure & Production Hosting Blueprint**  
> *Target Domain:* Custom `.in` Domain  
> *Budget Strategy:* AWS Free Tier + $120 AWS Promotional Credits  
> *Number of AWS Services Attached:* **9 Services**  
> *Architectural Paradigm:* 100% Serverless & Containerized (Zero idle VM cost)

---

## 📑 Table of Contents
1. [Cloud Architecture Overview](#1-cloud-architecture-overview)
2. [The 9 AWS Services Portfolio](#2-the-9-aws-services-portfolio)
3. [Cost & Credit Optimization Plan (Guarding the $120 Credits)](#3-cost--credit-optimization-plan-guarding-the-120-credits)
4. [Step-by-Step Deployment Guide (Phase 1 to Phase 5)](#4-step-by-step-deployment-guide-phase-1-to-phase-5)
5. [Connecting the Custom `.in` Domain](#5-connecting-the-custom-in-domain)
6. [CI/CD Automated Deployment Pipeline](#6-cicd-automated-deployment-pipeline)
7. [Billing Alarms & Spend Guards](#7-billing-alarms--spend-guards)

---

## 1. Cloud Architecture Overview

The AgentHive cloud architecture is designed for **maximum performance, zero server management, and strict cost control**. It leverages serverless containers and content delivery networks so you never pay for idle virtual machines.

```mermaid
graph TD
    Client["🌐 Internet Users / Evaluators"] -->|HTTPS (Custom .in Domain)| R53["1. Amazon Route 53 (DNS)"]
    R53 -->|SSL/TLS Verified| ACM["2. AWS Certificate Manager (ACM)"]
    
    subgraph Frontend Delivery
        R53 -->|yourdomain.in| CF["3. Amazon CloudFront (CDN)"]
        CF --> S3["Amazon S3 (Web App Static Assets)"]
    end

    subgraph Backend Execution
        R53 -->|api.yourdomain.in| AppRunner["4. AWS App Runner (Backend Container)"]
        ECR["5. Amazon ECR (Docker Registry)"] -->|Deploy Image| AppRunner
        AppRunner --> DDB["6. Amazon DynamoDB (Task & Telemetry DB)"]
    end

    subgraph DevOps & CI/CD Pipeline
        Code["7. AWS CodeCommit / GitHub"] --> Pipeline["8. AWS CodePipeline & CodeBuild"]
        Pipeline -->|Build & Push| ECR
        Pipeline -->|Sync Frontend| S3
    end

    subgraph Observability & Cost Guard
        AppRunner -.-> CW["9. Amazon CloudWatch & AWS SNS"]
        CW -->|Billing Alert > $10| Email["📧 Email Warning (Shields $120 Credits)"]
    end
```

---

## 2. The 9 AWS Services Portfolio

Here is the exact catalog of 9 AWS services integrated into AgentHive:

| # | AWS Service | Role in AgentHive | Free Tier / Cost Impact |
| :-: | :--- | :--- | :--- |
| **1** | **Amazon Route 53** | Manages DNS records and routes traffic from your `.in` domain to CloudFront and App Runner. | \$0.50 / hosted zone / month. |
| **2** | **AWS Certificate Manager (ACM)** | Issues free public SSL/TLS certificates for `https://yourdomain.in` and `*.yourdomain.in`. | **100% FREE** |
| **3** | **Amazon CloudFront + S3** | Global CDN and object storage hosting the web frontend, presentation dashboard, and static assets. | **Free Tier:** 1 TB CloudFront egress + 5 GB S3 storage free for 12 months. |
| **4** | **AWS App Runner** | Fully managed container service running the AgentHive External Agent HTTP API and Webhook server. Auto-scales down when idle. | Pay-per-second only when active (~$3–$5/mo). Easily absorbed by credits. |
| **5** | **Amazon ECR** | Elastic Container Registry storing private Docker container images of the AgentHive backend. | **Free Tier:** 500 MB private storage/month free. |
| **6** | **Amazon DynamoDB** | Serverless NoSQL database storing sprint execution history, agent metrics, and public API cache. | **Free Tier:** 25 GB free forever (Always Free tier). |
| **7** | **AWS CodeCommit** | Secure private Git repository hosting the AgentHive production codebase on AWS infrastructure. | **Free Tier:** 5 active users free forever. |
| **8** | **AWS CodePipeline & CodeBuild** | Automated CI/CD pipeline that compiles TypeScript, builds Docker images, and deploys upon `git push`. | **Free Tier:** 1 active pipeline + 100 build minutes/month free. |
| **9** | **Amazon CloudWatch & AWS SNS** | Real-time logging, CPU/memory performance dashboards, and automated email billing alerts. | **Free Tier:** 10 custom metrics + 1M API requests free forever. |

---

## 3. Cost & Credit Optimization Plan (Guarding the $120 Credits)

With \$120 in AWS credits, your goal is to ensure this infrastructure runs smoothly **for over 6 to 12 months** without exhausting credits:

### Estimated Monthly Burn Rate
* **Route 53 Hosted Zone:** \$0.50
* **ACM SSL:** \$0.00 (Free)
* **S3 + CloudFront:** \$0.15 (Within Free Tier)
* **DynamoDB:** \$0.00 (Within 25 GB Always Free Tier)
* **App Runner (Low traffic / Auto-pause):** ~\$3.00 – \$5.00
* **ECR Storage:** \$0.10
* **CodePipeline & CodeBuild:** \$0.00 (Within 100 min Free Tier)
* **CloudWatch & SNS:** \$0.20
* **Total Estimated Cost:** **~\$4.00 to \$6.00 per month**

> [!TIP]
> **Credit Longevity:** At \$5.00/month, your **\$120 credits will last for over 20+ MONTHS!** You have more than enough budget for all project presentations, testing, and portfolio reviews.

---

## 4. Step-by-Step Deployment Guide (Phase 1 to Phase 5)

### Phase 1: Code Packaging & Containerization (ECR & App Runner)

1. **Create Dockerfile for AgentHive Cloud Backend:**
   In your project root, create `Dockerfile.cloud`:
   ```dockerfile
   FROM node:20-alpine
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci --omit=dev
   COPY . .
   RUN npm run build
   EXPOSE 3737
   CMD ["node", "out/main/index.js"]
   ```

2. **Create Amazon ECR Repository:**
   ```bash
   aws ecr create-repository --repository-name agenthive-api --region ap-south-1
   ```

3. **Build, Tag, and Push Docker Image:**
   ```bash
   aws ecr get-login-password --region ap-south-1 | docker login --username AWS --password-stdin <YOUR_ACCOUNT_ID>.dkr.ecr.ap-south-1.amazonaws.com
   docker build -t agenthive-api -f Dockerfile.cloud .
   docker tag agenthive-api:latest <YOUR_ACCOUNT_ID>.dkr.ecr.ap-south-1.amazonaws.com/agenthive-api:latest
   docker push <YOUR_ACCOUNT_ID>.dkr.ecr.ap-south-1.amazonaws.com/agenthive-api:latest
   ```

4. **Deploy AWS App Runner Service:**
   - In AWS Console -> **AWS App Runner** -> **Create service**.
   - Source: *Container registry* -> *Amazon ECR*.
   - Select `agenthive-api:latest`.
   - Port: `3737`.
   - CPU: `1 vCPU`, Memory: `2 GB`.
   - Set Auto-scaling: Min 1 instance, Max 2 instances.
   - Click **Create & Deploy**.

---

### Phase 2: Frontend Hosting via Amazon S3 & CloudFront

1. **Build the Web Frontend:**
   ```bash
   npm run build
   ```
   This generates the production bundle in `out/renderer/` or `dist/`.

2. **Create S3 Bucket:**
   ```bash
   aws s3 mb s3://agenthive-web-production --region ap-south-1
   ```

3. **Upload Web Build to S3:**
   ```bash
   aws s3 sync out/renderer/ s3://agenthive-web-production/ --delete
   ```

4. **Create CloudFront Distribution:**
   - In AWS Console -> **CloudFront** -> **Create distribution**.
   - Origin Domain: Select `agenthive-web-production.s3.amazonaws.com`.
   - Origin Access: Use **Origin Access Control (OAC)** (Recommended for high security).
   - Viewer Protocol Policy: **Redirect HTTP to HTTPS**.
   - Default Root Object: `index.html`.
   - Custom Error Response: HTTP 403 & 404 -> redirect to `/index.html` with status 200 (for SPA routing).

---

## 5. Connecting the Custom `.in` Domain

### Step 1: Request Free SSL Certificate in ACM
1. Go to AWS Console -> **AWS Certificate Manager (ACM)**.
2. **CRITICAL:** Switch region to `us-east-1` (N. Virginia) — CloudFront certificates *must* be in `us-east-1`!
3. Click **Request certificate** -> Request public certificate.
4. Domain names:
   - `yourdomain.in`
   - `*.yourdomain.in`
5. Validation method: **DNS validation**.
6. Click **Request**.

### Step 2: Configure Route 53 Hosted Zone
1. Go to AWS Console -> **Route 53** -> **Hosted zones** -> **Create hosted zone**.
2. Domain name: `yourdomain.in` (Enter your actual `.in` domain).
3. Type: **Public hosted zone**.
4. Route 53 will generate **4 Name Servers (NS records)** (e.g., `ns-xxx.awsdns-xx.org`).

### Step 3: Update Name Servers at your Domain Registrar
1. Log in to the registrar where you bought your `.in` domain (GoDaddy, Namecheap, Hostinger, BigRock).
2. Go to **DNS / Nameservers** settings.
3. Replace the default registrar nameservers with the **4 AWS Route 53 Nameservers**.
4. Save changes (takes between 15 minutes to 2 hours for global DNS propagation).

### Step 4: Add DNS Records in Route 53
1. **ACM Validation Record:** Click "Create records in Route 53" inside ACM to validate domain ownership automatically.
2. **Apex Domain Record (`yourdomain.in`):**
   - Record type: `A`.
   - Toggle: **Alias = Yes**.
   - Route traffic to: **Alias to CloudFront distribution** -> select your distribution.
3. **API Subdomain (`api.yourdomain.in`):**
   - Record type: `CNAME`.
   - Route traffic to: Your AWS App Runner default domain URL.

---

## 6. CI/CD Automated Deployment Pipeline (CodePipeline & CodeBuild)

1. Create a `buildspec.yml` in your project root:
   ```yaml
   version: 0.2
   phases:
     install:
       runtime-versions:
         nodejs: 20
       commands:
         - npm ci
     build:
       commands:
         - npm run typecheck
         - npm run build
     post_build:
       commands:
         - aws s3 sync out/renderer/ s3://agenthive-web-production/ --delete
         - aws cloudfront create-invalidation --distribution-id $CLOUDFRONT_DIST_ID --paths "/*"
   ```
2. In AWS Console -> **AWS CodePipeline** -> **Create pipeline**.
3. Source: Connect your GitHub repository (`ayushvsingh2611-code/office`).
4. Build: Select **AWS CodeBuild** (managed Linux environment).
5. Deploy: Handled via the post-build S3 sync and CloudFront invalidation.
6. Every time you run `git push origin main`, AWS will automatically test, compile, and update the live `.in` website within 3 minutes!

---

## 7. Billing Alarms & Spend Guards

To ensure your \$120 promotional credits are **100% protected** and never exceeded:

1. **Enable Billing Alerts in AWS Account:**
   - Click your account name (top right) -> **Billing and Cost Management**.
   - Go to **Billing Preferences** -> Check **Receive Billing Alerts**.

2. **Create CloudWatch Alarm for $10 Spend:**
   ```bash
   aws cloudwatch put-metric-alarm \
     --alarm-name "AgentHive-Budget-Guard-10USD" \
     --metric-name EstimatedCharges \
     --namespace AWS/Billing \
     --statistic Maximum \
     --period 21600 \
     --threshold 10 \
     --comparison-operator GreaterThanOrEqualToThreshold \
     --dimensions Name=Currency,Value=USD \
     --evaluation-periods 1 \
     --alarm-actions arn:aws:sns:us-east-1:<YOUR_ACCOUNT_ID>:billing-alerts
   ```
3. Subscribe your personal email to the SNS topic. If monthly spend ever reaches \$10, AWS will immediately send you an email alert!

---

## 8. Summary Checklist for PPT Presentation

When presenting the AWS deployment in your PPT, showcase these key highlights:

- [x] **Enterprise Multi-Service Architecture:** 9 interconnected AWS services operating seamlessly.
- [x] **Zero Idle Cost (Serverless):** No expensive EC2 instances running 24/7.
- [x] **Custom National TLD:** Professional `.in` domain integration with HTTPS.
- [x] **Bank-Grade Security:** Automated SSL via ACM and isolated private S3 buckets using OAC.
- [x] **Financial Engineering:** Optimized to run for over 20 months on a \$120 credit budget.
