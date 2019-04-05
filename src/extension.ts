import {
    commands,
    Disposable,
    ExtensionContext,
    Range,
    StatusBarAlignment,
    StatusBarItem,
    TextDocument,
    TextDocumentWillSaveEvent,
    TextEdit,
    window,
    workspace,
    WorkspaceConfiguration
} from 'vscode';

export function activate(context: ExtensionContext) {
    const config = workspace.getConfiguration('files', null);
    const handler = new RemoveSingleFinalNewlineHandler(config);

    let command = commands.registerCommand('removeFinalNewlines.formatAndRemoveFinalNewlines', async () => {
        const activeTextEditor = window.activeTextEditor;
        if (!activeTextEditor || !activeTextEditor.document) {
            return;
        }

        await commands.executeCommand("editor.action.formatDocument");
        var edits = await handler.getRemoveFinalNewlinesTextEdits(activeTextEditor.document);
        if (edits && edits.length > 0) {
            activeTextEditor.edit(editBuilder => {
                for (let i = 0; i < edits.length; i++) {
                    editBuilder.delete(edits[i].range);
                }
            });

            handler.showStatusBarItemText(edits.length === 1 ? 'Document formatted and removed final newline!' : 'Document formatted and removed final newlines!');
        }
    });

    context.subscriptions.push(handler);
    context.subscriptions.push(command);
}

class RemoveSingleFinalNewlineHandler {
    private _disposable: Disposable;
    private _config: WorkspaceConfiguration;
    private _statusBarItem: StatusBarItem;

    constructor(config: WorkspaceConfiguration) {
        const subscriptions: Disposable[] = [];

        this._config = config;

        workspace.onWillSaveTextDocument(this._onWillSaveTextDocument, this, subscriptions);
        workspace.onDidChangeConfiguration(this._onDidChangeConfiguration, this, subscriptions);

        this._statusBarItem = window.createStatusBarItem(StatusBarAlignment.Right, 100);
        subscriptions.push(this._statusBarItem);

        this._disposable = Disposable.from(...subscriptions);
    }

    dispose() {
        this._disposable.dispose();
    }

    public showStatusBarItemText(text: string): void {
        this._statusBarItem.text = text;

        this._statusBarItem.show();
        setTimeout(() => {
            this._statusBarItem.hide();
        }, 3000);
    }

    public getRemoveFinalNewlinesTextEdits(doc: TextDocument): TextEdit[] {
        const edits: TextEdit[] = [];

        if (!doc) {
            return edits;
        }

        if (!this._config.get('insertFinalNewline', false)) {
            for (let index = doc.lineCount - 1; index > 0; index--) {
                const prevLine = doc.lineAt(index - 1);
                const currentLine = doc.lineAt(index);
                if (currentLine.isEmptyOrWhitespace) {
                    edits.push(TextEdit.delete(new Range(prevLine.range.end, currentLine.range.end)));
                    if (!prevLine.isEmptyOrWhitespace) {
                        break;
                    }
                } else {
                    break;
                }
            }
        }

        return edits;
    }

    private _onWillSaveTextDocument(event: TextDocumentWillSaveEvent): void {
        if (this._config.get('removeFinalNewlines', false) && !this._config.get('insertFinalNewline', false)) {
            const edits = this.getRemoveFinalNewlinesTextEdits(event.document);
            if (edits && edits.length > 0) {
                this.showStatusBarItemText(edits.length === 1 ? 'Removed final newline!' : 'Removed final newlines!');
                event.waitUntil(Promise.resolve(edits));
            }
        }
    }

    private _onDidChangeConfiguration(): void {
        this._config = workspace.getConfiguration('files', null);
    }
}