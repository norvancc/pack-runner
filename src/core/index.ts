import * as vscode from 'vscode';

type PackageJson = {
  scripts: {
    [key: string]: string;
  };
};

const ignoreFileList = ['node_modules', 'dist', 'build', 'out', 'lib', 'es', 'coverage'];

// 检查是否有 package.json 文件，这是一个递归函数，如果当前目录没有 package.json 文件，弹出选择框让用户选择一个目录，然后递归调用
const checkPackageJson = async (uri: vscode.Uri): Promise<vscode.Uri | undefined> => {
  const packageJsonUri = vscode.Uri.joinPath(uri, 'package.json');
  try {
    await vscode.workspace.fs.stat(packageJsonUri);
    return packageJsonUri;
  } catch (error) {
    // 如果当前目录没有 package.json 文件，弹出选择框让用户选择一个目录
    // 先读取目录
    // @ts-ignore
    const files = await vscode.workspace.fs.readDirectory(uri);
    // 让用户选择一个目录
    const selectedFolder = await vscode.window.showQuickPick(
      files
        .map((f) => f[0])
        .filter((f) => {
          // 判断不是忽略的文件，并且是文件夹,并且不是隐藏文件
          return !ignoreFileList.includes(f) && files.find((ff) => ff[0] === f && ff[1] === vscode.FileType.Directory) && !f.includes('.');
        }),
      {
        placeHolder: 'Select a folder',
      }
    );
    if (!selectedFolder) {
      return;
    }
    // 根据用户选择的目录，获取目录的 Uri
    // @ts-ignore
    const selectedFolderUri = vscode.Uri.joinPath(uri, selectedFolder);
    return checkPackageJson(selectedFolderUri);
  }
};

export const commandsRunner = async () => {
  // vscode.window.showInformationMessage('Hello World from PackRuner!');
  // 读取当前项目的 package.json 文件

  // 读取当前项目的目录和文件
  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (!workspaceFolders) {
    vscode.window.showErrorMessage('No workspace is opened.');
    return;
  }

  // 如果有多个文件夹，让用户选择一个
  const workspaceFolder =
    workspaceFolders.length > 1 ? await vscode.window.showQuickPick(workspaceFolders.map((f) => f.name)) : workspaceFolders[0];

  if (!workspaceFolder) {
    vscode.window.showErrorMessage('No workspace folder is selected.');
    return;
  }
  const uri = typeof workspaceFolder === 'string' ? workspaceFolder : workspaceFolder.uri;

  // 检查是否有 package.json 文件
  // @ts-ignore
  const packageJsonUri = await checkPackageJson(uri);

  if (!packageJsonUri) {
    vscode.window.showErrorMessage('No package.json file found.');
    return;
  }

  const packageJson = await vscode.workspace.fs.readFile(packageJsonUri);
  const packageJsonContent = new TextDecoder().decode(packageJson);
  const packageJsonObj = JSON.parse(packageJsonContent) as PackageJson;

  // 读取 package.json 文件中的 scripts 字段
  const scripts = packageJsonObj.scripts;
  if (!scripts) {
    vscode.window.showErrorMessage('No scripts found in package.json.');
    return;
  }

  // 让用户选择一个 script
  const script = await vscode.window.showQuickPick(Object.keys(scripts));
  if (!script) {
    vscode.window.showErrorMessage('No script is selected.');
    return;
  }

  // 执行 script
  const terminal = vscode.window.createTerminal({
    name: `npm run ${script}`,
  });
  terminal.show();

  //  获取当前根目录
  const rootFolder = vscode.workspace.getWorkspaceFolder(packageJsonUri);
  if (!rootFolder) {
    vscode.window.showErrorMessage('No workspace folder is found.');
    return;
  }

  // 根据rootFolder的name,切割字符串，获取当前目录的名称
  const currentFolder = rootFolder.name;
  if (!currentFolder) {
    vscode.window.showErrorMessage(`Folder:${currentFolder} is found.`);
    return;
  }
  // 切换到packageJsonUri所在的目录
  const targteCdPath = packageJsonUri.fsPath?.split(currentFolder)?.[1]?.replace('/package.json', '')?.slice(1);

  if (!targteCdPath) {
    vscode.window.showErrorMessage(`Folder:${targteCdPath} is found.`);
    return;
  }

  terminal.sendText(`cd ${targteCdPath}`);
  terminal.sendText(`npm run ${script}`);
};
