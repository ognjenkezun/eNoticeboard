import { Directive, Host } from '@angular/core';
import { EditorComponent } from '@progress/kendo-angular-editor';
import { ToolBarButtonComponent } from '@progress/kendo-angular-toolbar';

@Directive({
  selector: 'kendo-toolbar-button[appCustomKendoEditorToolbar]'
})
export class CustomKendoEditorToolbarDirective {

  constructor(private button: ToolBarButtonComponent, @Host() private editor: EditorComponent) { }

}
