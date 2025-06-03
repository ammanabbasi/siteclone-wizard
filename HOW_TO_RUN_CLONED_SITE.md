# How to Run Your Cloned Website

After downloading your cloned website from SiteClone Wizard:

## 1. Extract the ZIP file

Extract the downloaded ZIP to a folder on your computer.

## 2. Open Terminal/PowerShell

Navigate to the extracted folder:

```bash
cd path/to/extracted/folder
```

## 3. Install Dependencies

```bash
npm install
# or
pnpm install
# or
yarn install
```

## 4. Run the Development Server

```bash
npm run dev
# or
pnpm dev
# or
yarn dev
```

## 5. View Your Site

Open your browser to: http://localhost:3000

Your cloned site with your custom branding will be running!

## To Deploy:

- **Vercel**: Run `vercel` in the terminal
- **Netlify**: Connect to GitHub and deploy
- **Other hosts**: Run `npm run build` then deploy the `.next` folder
