HealFlow - DevSecOps CI/CD Pipeline

A healthcare SaaS demo application showcasing a secure CI/CD pipeline with integrated code quality checks and security scanning.

Live Application - https://my-medical-oox6042vu-wav-pipeline.vercel.app/

--CI/CD Pipeline (GitHub Actions)--
Pipeline triggers on every push to "main"
Workflow Stages
1. Build
   - Install dependencies (npm ci)
   - Build application

2. Code Quality (ESLint)
   - Enforces coding standards
   - Fails pipeline on warnings/errors

3. Security Scan (npm audit)
   - Detects vulnerable dependencies
   - Blocks high severity issues

4. SAST (Semgrep)
   - Detects insecure code patterns (e.g., eval)
   - Enforces secure coding practices

5. Deployment (Vercel)
   - Deploys ONLY if all checks pass
   - Fully automated

--Security & Compliance (SOC2-aligned)--
  - ✅ Shift-left security (scanning before deploy)
  - ✅ Dependency vulnerability management
  - ✅ Static code analysis (SAST)
  - ✅ Secure CI/CD gating
  - ✅ Audit logs via GitHub Actions

--Failure Demonstration--
  - Added vulnerable dependency → pipeline failed
  - Added unsafe code (eval) → SAST failed

--Fix--
  Removed vulnerabilities → pipeline passed → deployment triggered

--Tech Stack--
  - React (Vite)
  - GitHub Actions (CI/CD)
  - ESLint
  - npm audit
  - Semgrep (SAST)
  - Vercel (Deployment)


  
