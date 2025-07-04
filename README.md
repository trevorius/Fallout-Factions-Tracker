This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, install the project dependencies using the `--legacy-peer-deps` flag to avoid resolution conflicts with React versions:

```bash
npm install --legacy-peer-deps
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## 📚 Documentation

### [� Complete Documentation Index](./docs/README.md)
**🎯 Start here for all documentation!** Navigate to the comprehensive documentation index with quick reference guides, essential commands, and links to all guides.

**Quick Access:**
- [🏗️ Architecture & Database](./docs/README.md#-architecture--database)
- [🎨 Theming System](./docs/README.md#-advanced-features)
- [📄 PDF Generation](./docs/README.md#-advanced-features)
- [📁 File Reference](./docs/README.md#-quick-reference)

## Project Architecture

This project's architecture and data models are documented to ensure clarity and consistency.

- **[Database Schema](./docs/schema.md)**: View the detailed database schema, including an entity-relationship diagram and model explanations.
- **[Super Admin Documentation](./docs/superadmin/README.md)**: Find guides for managing global game assets like factions, weapons, and unit templates.
- **[Organization Template Management](./docs/organization-template-management.md)**: Learn how admins can manage game assets for their organization.

## Advanced Features

### Theming System
This project includes a sophisticated multi-theme system with automatic synchronization between web interface and PDF exports.

- **[Theming Documentation](./docs/theming.md)**: Complete guide to the theming system including how to update theme variables, add new themes, and maintain the single source of truth architecture.

### PDF Generation
The application features automatic PDF generation for crew rosters that mirrors the desktop layout and updates automatically as new features are added.

- **[PDF Generation Documentation](./docs/pdf-generation.md)**: Comprehensive guide covering PDF system architecture, usage, technical implementation, troubleshooting, and how to extend the system with new features.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deployment on Vercel

This project is optimized for deployment on the [Vercel Platform](https://vercel.com/new).

### Configuration Steps

1.  **Connect Your Repository**: Import your GitHub repository into Vercel.

2.  **Set Build Command**: In the project settings on Vercel, override the default build command and set it to:

    ```
    npm run build:prod
    ```

    This command ensures that database migrations are applied before the application is built.

3.  **Add Environment Variable**: Set up the `DATABASE_URL` environment variable in your Vercel project's settings. This should be the full connection string to your production database.
    - **Variable Name**: `DATABASE_URL`
    - **Value**: `postgresql://USER:PASSWORD@HOST:PORT/DATABASE`

After configuring these settings, Vercel will automatically build and deploy your project upon every `git push` to the main branch.
