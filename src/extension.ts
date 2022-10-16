import * as vscode from 'vscode';
import * as fs from 'fs';
import { TEMPLATE } from './templates';

const PATH_TO_PROJECT = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;

export function activate(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand('ngx-feature-generator.generate',
		async (context: vscode.ExtensionContext) => {		
			let name: string = await vscode.window
				.showInputBox({ title: 'Feature name', value: 'feature-example' }) ?? '';

			const helperEnabled: string = await vscode.window
				.showQuickPick(
					['Нет', 'Да'],
					{ title: 'Создать папку helpers (defaultErrorHandler function, ErrorType enum, HandledError class)?' },
				) ?? '';

			if (!helperEnabled) return;
			const isHelperEnabled = helperEnabled === 'Да';


			if (!name?.trim()) {
				return vscode.window.showErrorMessage('хуевое имя - без букв');
			}

			const nameWords = nameToWords(name);
			if (!nameWords?.length) {
				return vscode.window.showErrorMessage('хуйня, а не название');
			}

			const kebabName = nameWords.join('-');
			const pascalName = nameWords.map(w => w[0].toUpperCase() + w.substring(1)).join('');
			const camelName = pascalName.charAt(0).toLowerCase() + pascalName.substring(1);

			const featuresFolder = vscode.workspace.getConfiguration('featureGenerator').get('featuresParentFolder'); // 'src\\app\\feature_modules';
			const featurePath = `${PATH_TO_PROJECT}\\${featuresFolder}\\${kebabName}`;
			const wsedit = new vscode.WorkspaceEdit();

			fs.mkdirSync(featurePath, { recursive: true });
			fs.mkdirSync(`${featurePath}\\${kebabName}`, { recursive: true });
			if (isHelperEnabled) {
				fs.mkdirSync(`${featurePath}\\helpers`, { recursive: true });
			}

			const componentTsName = `${PATH_TO_PROJECT}\\${featuresFolder}\\${kebabName}\\${kebabName}\\${kebabName}.component.ts`;
			const componentScssName = `${PATH_TO_PROJECT}\\${featuresFolder}\\${kebabName}\\${kebabName}\\${kebabName}.component.scss`;
			const componentHtmlName = `${PATH_TO_PROJECT}\\${featuresFolder}\\${kebabName}\\${kebabName}\\${kebabName}.component.html`;
			const apiServiceName = `${PATH_TO_PROJECT}\\${featuresFolder}\\${kebabName}\\${kebabName}-api.service.ts`;
			const repoServiceName = `${PATH_TO_PROJECT}\\${featuresFolder}\\${kebabName}\\${kebabName}-repo.service.ts`;
			const facadeServiceName = `${PATH_TO_PROJECT}\\${featuresFolder}\\${kebabName}\\${kebabName}-facade.service.ts`;
			const modelClassName = `${PATH_TO_PROJECT}\\${featuresFolder}\\${kebabName}\\${kebabName}.ts`;
			const modelDtoInterfaceName = `${PATH_TO_PROJECT}\\${featuresFolder}\\${kebabName}\\${kebabName}-dto.interface.ts`;
			const pageModelInterfaceName = `${PATH_TO_PROJECT}\\${featuresFolder}\\${kebabName}\\${kebabName}-page.interface.ts`;
			const errorTypeEnumName = `${PATH_TO_PROJECT}\\${featuresFolder}\\${kebabName}\\helpers\\error-type.enum.ts`;
			const handledErrorModelName = `${PATH_TO_PROJECT}\\${featuresFolder}\\${kebabName}\\helpers\\handled-error.ts`;
			const defaultErrorHandlerFunctionName = `${PATH_TO_PROJECT}\\${featuresFolder}\\${kebabName}\\helpers\\default-error-handler.function.ts`;

			const createFile = (name: string) => {
				wsedit.createFile(vscode.Uri.file(name), { overwrite: true })
			}

			createFile(componentTsName);
			createFile(componentScssName);
			createFile(componentHtmlName);
			createFile(apiServiceName);
			createFile(repoServiceName);
			createFile(facadeServiceName);
			createFile(modelClassName);
			createFile(modelDtoInterfaceName);
			createFile(pageModelInterfaceName);
			if (isHelperEnabled) {
				createFile(errorTypeEnumName);
				createFile(handledErrorModelName);
				createFile(defaultErrorHandlerFunctionName);
			}
			await vscode.workspace.applyEdit(wsedit);

			const writeFile = (fileName: string, template: string) => {
				template = template.replace(/\{\{kebab-name\}\}/g, kebabName);
				template = template.replace(/\{\{PascalName\}\}/g, pascalName);
				template = template.replace(/\{\{camelName\}\}/g, camelName);
				fs.writeFileSync(fileName, template, { encoding: 'utf-8' });
			}

			writeFile(componentTsName, TEMPLATE.COMPONENT_TS);
			writeFile(componentScssName, TEMPLATE.COMPONENT_SCSS);
			writeFile(componentHtmlName, TEMPLATE.COMPONENT_HTML);
			writeFile(apiServiceName, TEMPLATE.API_SERVICE);
			writeFile(repoServiceName, TEMPLATE.REPO_SERVICE);
			writeFile(facadeServiceName, TEMPLATE.FACADE_SERVICE);
			writeFile(modelClassName, TEMPLATE.MODEL_CLASS);
			writeFile(modelDtoInterfaceName, TEMPLATE.MODEL_DTO_INTERFACE);
			writeFile(pageModelInterfaceName, TEMPLATE.PAGE_MODEL_INTERFACE);
			if (isHelperEnabled) {
				writeFile(errorTypeEnumName, TEMPLATE.ERROR_TYPE_ENUM);
				writeFile(handledErrorModelName, TEMPLATE.HANDLED_ERROR_MODEL);
				writeFile(defaultErrorHandlerFunctionName, TEMPLATE.DEFAULT_ERROR_HANDLER_FUNCTION);
			}

			vscode.window.showInformationMessage(`Сгенерирована фича ${kebabName}!`);
		});

	context.subscriptions.push(disposable);
}

const nameToWords = (name: string): string[] => {
	name = name?.trim();
	if (!name) return [];

	const words = name.toLowerCase().match(/[A-Za-z][A-Za-z0-9]*/g);
	return words ?? [];
}

// const writeFile = (fileName: string, template: string, kebabName: string, pascalName: string, camelName: string) => {
// 	template = template.replace(/\{\{kebab-name\}\}/g, kebabName);
// 	template = template.replace(/\{\{PascalName\}\}/g, pascalName);
// 	template = template.replace(/\{\{camelName\}\}/g, camelName);
// 	fs.writeFileSync(fileName, template, { encoding: 'utf-8' });
// }

export function deactivate() { }
