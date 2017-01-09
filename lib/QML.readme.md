# Running in QML

You need to modify `bundle.qml.js` :

As the first line, add :

```
var window = { XMLHttpRequest: XMLHttpRequest };
var setTimeout = function (fn, ms) {};
var clearTimeout = function (timeout) {};
function btoa(param) { return Qt.btoa(param); }
```

This will disable request timeouts, because QML doesn't support `setTimeout`/`clearTimeout`.

And at the end of the file, add :

```
function GetClan() { return window.Clan; }
```

Now you can `import 'bundle.qml.js' as Api;` and use `var Clan = Api.GetClan();` and use Clan normally.
