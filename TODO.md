# TODO - Antora Extensions Registry

## Cloudflare & DNS

- [ ] Point `antora-extensions.org` to your hosting provider.
- [ ] Configure SSL/TLS.

## Authentication Setup

- [ ] Create OAuth Application on **GitHub** (the-dev-center organization).
- [ ] Create OAuth Application on **GitLab**.
- [ ] Create OAuth Application on **Google Cloud Console**.
- [ ] Create OAuth Application on **Microsoft Azure Portal**.
- [ ] Configure **SMTP** server for Email magic links.
- [ ] Set `AUTH_SECRET` and provider IDs/Secrets in `.env`.

## Database & Deployment

- [ ] Provision a production database (e.g., Turso for LibSQL or a managed Postgres).
- [ ] Run `pnpm db:push` to initialize the production schema.
- [ ] Troubleshoot persistent Vinxi SSR build error (`Exited with code: 1`) during `pnpm build`.
- [ ] Set up a CI/CD pipeline (GitHub Actions).

## Backend Enhancements

- [ ] Implement actual `package.json` fetching from remote URLs (GitHub/GitLab APIs).
- [ ] Add caching for dependency trees to avoid re-computing.
- [ ] Implement rate limiting for extension submissions.

## Frontend Polishing

- [ ] Add more micro-animations to the tree expansion.
- [ ] Implement a full-screen search experience.
- [ ] Add user profiles to manage submitted extensions.
