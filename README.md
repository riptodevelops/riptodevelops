# Ripto Develops (`riptodevelops.xyz`)

> Build, deploy, and scale autonomous AI workflows. Developer-first AI Agent & Cloud Workflow Orchestration Engine on AWS EC2 Nitro micro-VMs.

## Deploying to Vercel

This repository is pre-configured for **1-click zero-config deployment on Vercel**:

1. Log in to [vercel.com](https://vercel.com) using your GitHub account (`riptodevelops`).
2. Click **Add New...** → **Project**.
3. Select this repository: `riptodevelops`.
4. Keep the Framework Preset as **Other** (Root directory `./`).
5. Click **Deploy**.

Vercel will deploy:
- The static frontend with clean URLs and SPA routing configured in `vercel.json`.
- The serverless `/api/health` endpoint configured in `api/health.js`.

### Custom Domain (`riptodevelops.xyz`) on Vercel:
1. Go to your project settings in Vercel → **Domains**.
2. Add `riptodevelops.xyz` (and `www.riptodevelops.xyz`).
3. Add the DNS records (A record pointing to `76.76.21.21` or CNAME `cname.vercel-dns.com`) at your domain registrar.

---

## Local Development

Run with Node.js (zero dependencies):

```bash
# Start local HTTP server
node server.mjs
```

Or with `pnpm`:

```bash
pnpm start
```

Access points:
- Local: `http://localhost:3000`
- Health probe: `http://localhost:3000/api/health`

---

## Contact

- **Domain**: [riptodevelops.xyz](https://riptodevelops.xyz)
- **Contact**: [contact@riptodevelops.xyz](mailto:contact@riptodevelops.xyz)
- **Version**: `v1.4.2-beta`
