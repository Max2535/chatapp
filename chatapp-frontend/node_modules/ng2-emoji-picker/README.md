[![npm version](https://badge.fury.io/js/angular2-emoji-picker.svg)](https://badge.fury.io/js/angular2-emoji-picker)

# Emoji picker for Angular

This project was forked from the [EmojiPanel](https://github.com/danbovey/EmojiPanel) project created by [DanBovey](https://github.com/danbovey)

It's pretty basic right now, not very customizable but propagates necessary emoji selection events and comes with basic search and category selection functionalities.

[Demo](https://lsharir.github.io/angular2-emoji-picker/)

Demo uses the sprite sheets


### Usage:

```
import { EmojiPickerModule } from 'angular2-emoji-picker';

@NgModule({
  ...
  imports: [
    EmojiPickerModule.forRoot()
  ],
  ...
})
export class AppModule {}

```

### Use The Sprite Sheet

```
/** file: app.component.ts */

import { EmojiPickerOptions } from 'angular2-emoji-picker';

/** imported seperately to reduce package size for those who won't use sheets */
import { EmojiPickerAppleSheetLocator } from 'angular2-emoji-picker/sheets';

constructor(private emojiPickerOptions: EmojiPickerOptions) {
  this.emojiPickerOptions.setEmojiSheet({
      url: 'sheet_apple_32.png',
      locator: EmojiPickerAppleSheetLocator
    });
}
```

include the sheet_apple_32.png file in your build and provide your specific file url

```
/** .angular-cli.json */

{
  "apps": [
    {
      "assets": [
        { "glob": "sheet_apple_32.png", "input": "../node_modules/angular2-emoji-picker/sheets/", "output": "./" }
      ]
    }
  ]
}

```

### Directive API:

```
<i
    (click)="toggled = !toggled"
    [(emojiPickerIf)]="toggled"
    [emojiPickerDirection]="'bottom' || 'top' || 'left' || 'right'"
    [emojiPickerPreserveSelection]="true || false"
    [emojiPickerAutofocus]="true || false"
    (emojiPickerSelect)="handleSelection($event)">😄</i>
```

### Emitter `(emojiPickerSelect)="handleSelection($event)"`

```
$event = EmojiEvent{ char : "😌", label : "relieved" }
```

## EmojiPickerCaretEmitter

added for your convenience, emits information regarding a contenteditable enabled element

### Emitter `(emojiPickerCaretEmitter)="handleCaretChange($event)"`

```
$event = CaretEvent{ caretOffset: 13, caretRange: Range{...}, textContent: 'content of div or input' }
```

Emoji Picker will get placed relative the element chosen via the directive api, centered and within window borders
