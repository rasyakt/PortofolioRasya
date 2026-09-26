# Production Deploy — Ubuntu + Docker + nginx + Cloudflare Tunnel

Target: `https://rasyasmz.my.id` served from an Ubuntu server. No inbound
ports are opened — Cloudflare Tunnel makes outbound-only connections.

Architecture:

```
visitor ──TLS──> Cloudflare Edge ──tunnel──> cloudflared ──> nginx:80 ──> app:3000
                                                                        └─> db:3306 (MySQL 8.4)
```

## 0. Prereqs (Ubuntu 22.04 / 24.04)

```bash
sudo apt update && sudo apt install -y git
# Docker (official repo)
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list
sudo apt update && sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
sudo usermod -aG docker $USER && newgrp docker
```

## 1. Clone & configure

```bash
git clone <repository-url> portfolio && cd portfolio
cp .env.example .env
nano .env
```

Fill in `.env` (production values):

```bash
DATABASE_URL="mysql://appuser:CHANGEME@db:3306/portofoliorasya"  # overridden by compose, keep in sync
SESSION_SECRET="<output of the command below>"
NEXTAUTH_URL="https://rasyasmz.my.id"
MYSQL_ROOT_PASSWORD="<strong random>"
MYSQL_DATABASE="portofoliorasya"
MYSQL_USER="appuser"
MYSQL_PASSWORD="<strong random>"
# CLOUDFLARE_TUNNEL_TOKEN="<paste from Zero Trust dashboard, or leave empty>"
```

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

> The compose file overrides `DATABASE_URL`/`NEXTAUTH_URL` automatically —
> make sure `MYSQL_*` values match in both places.

## 2. Build & start

```bash
docker compose up -d --build
docker compose ps
```

The `app` container runs `prisma migrate deploy` on every start, so the
database schema is always in sync — no manual migration step.

## 3. First-time data

Fresh database is empty. Create the admin user, then fill content via CMS:

```bash
docker compose exec app node scripts/create-admin.mjs rasya <password-min-8>
```

Then open `https://rasyasmz.my.id/admin` and add profile, projects,
certifications, experience, and skills. (Or seed locally against the VPS
database over an SSH tunnel and let it replicate — data lives in MySQL.)

> `public/cv.pdf` and `public/profile.jpeg` are baked into the image at
> build time. Prefer uploading both through the CMS (`/admin/profile`)
> so they live in the database + persistent volumes instead.

## 4. Cloudflare Tunnel

1. Cloudflare dashboard → your domain `rasyasmz.my.id` → **Zero Trust →
   Networks → Tunnels → Create** (Cloudflared).
2. Copy the tunnel **token**.
3. Either set `CLOUDFLARE_TUNNEL_TOKEN` in `.env` and uncomment the
   `cloudflared` service in `docker-compose.yml`, **or** run `cloudflared`
   on the host pointing at `http://127.0.0.1:8080`.
4. In the tunnel's **Public Hostnames**, add:
   `rasyasmz.my.id` → `http://nginx:80` (compose) or
   `http://127.0.0.1:8080` (host agent).
5. SSL/TLS mode in Cloudflare: **Full** (tunnel is already end-to-end TLS).

## 5. Verify

```bash
curl -s http://127.0.0.1:8080/api/health
docker compose logs --tail=50 app
```

Then in a browser: homepage, `/sitemap.xml`, `/robots.txt`, theme toggle,
`/admin/login` (rate-limited + security headers active).

## 6. Operate

```bash
docker compose logs -f app        # follow logs
docker compose up -d --build app  # redeploy after git pull
docker compose down               # stop (data volumes are kept)
```

**Backup (run weekly via cron):**

```bash
docker compose exec db mysqldump -u root -p"$MYSQL_ROOT_PASSWORD" \
  "$MYSQL_DATABASE" | gzip > backup-$(date +%F).sql.gz
```

Uploads live in named volumes (`uploads-covers`, `-badges`, `-docs`).
Back them up with:

```bash
docker run --rm -v portfolio_uploads-covers:/data -v "$PWD":/out \
  alpine tar czf /out/uploads-covers-$(date +%F).tar.gz -C /data .
```

**Notes**

- The login page is additionally throttled in nginx (`5r/m` on
  `/admin/login`) on top of the in-app limiter.
- Error logs + traffic stats: CMS → **Analytics**.
- Never commit `.env`. Never expose port 3306 publicly.
