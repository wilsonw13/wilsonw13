### Setup Development Environment
1. Install [Node v22 LTS](https://nodejs.org/en/download) or look into using [nvm](https://github.com/coreybutler/nvm-windows).

2. Install pnpm
```bash
npm install -g pnpm@10.15.1
```

3. Install packages
```bash
cd backend
pnpm install

cd ../frontend
pnpm install
```

Sidenote:
If you're using VSCode, I recommend you add/change the following settings (if you haven't already):

`settings.json`
```json
{
    "editor.formatOnSave": true,
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "files.trimTrailingWhitespace": true,
    "editor.guides.bracketPairs": true,
    "editor.guides.highlightActiveIndentation": true,
    "editor.guides.bracketPairsHorizontal": "active",
}
```

* Note: You can access this file by pressing `Ctrl + ,` and clicking the `{}` icon in the top right corner. *DO NOT modify the `settings.json` file in the `.vscode` folder.*

### Running Development Servers
In separate terminal windows, run:
```bash
cd backend
pnpm dev

cd frontend
pnpm dev
```

OR

`Ctrl + Shift + B` to run both servers using the provided tasks in `.vscode/tasks.json`.

### Recommended VSCode Extensions
It's recommended to install the following extensions for VSCode:
```text
naumovs.color-highlight
dsznajder.es7-react-js-snippets
ecmel.vscode-html-css
kisstkondoros.vscode-gutter-preview
esbenp.prettier-vscode
bradlc.vscode-tailwindcss
```