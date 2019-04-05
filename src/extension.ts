import {
    Disposable,
    ExtensionContext,
    Range,
    StatusBarAlignment,
    StatusBarItem,
    TextDocumentWillSaveEvent,
    TextEdit,
    window,
    workspace,
    WorkspaceConfiguration
} from 'vscode';

export function activate(context: ExtensionContext) {
    const config = workspace.getConfiguration('files', null);
    const handler = new RemoveSingleFinalNewlineHandler(config);
    context.subscriptions.push(handler);
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

    private _onWillSaveTextDocument(event: TextDocumentWillSaveEvent) {
        if (this._config.get('removeFinalNewlines', false) && !this._config.get('insertFinalNewline', false)) {
            const doc = event.document;
            const edits = [];

            let newlinesRemoved = 0;

            if (!this._config.get('insertFinalNewline', false)) {
                for (let index = doc.lineCount - 1; index > 0; index--) {
                    const prevLine = doc.lineAt(index - 1);
                    const currentLine = doc.lineAt(index);
                    if (currentLine.isEmptyOrWhitespace) {
                        newlinesRemoved++;
                        edits.push(TextEdit.delete(new Range(prevLine.range.end, currentLine.range.end)));
                        if (!prevLine.isEmptyOrWhitespace) {
                            break;
                        }
                    } else {
                        break;
                    }
                }
            }

            if (newlinesRemoved > 0) {
                this._statusBarItem.text = newlinesRemoved === 1 ? 'Removed final newline!' : 'Removed final newlines!';

                this._statusBarItem.show();
                setTimeout(() => {
                    this._statusBarItem.hide();
                }, 3000);
            }

            event.waitUntil(Promise.resolve(edits));
        }
    }

    private _onDidChangeConfiguration() {
        this._config = workspace.getConfiguration('files', null);
    }
}