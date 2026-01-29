# 認可制御

このドキュメントでは，Pulsate API(v0) における認可制御について記述する．

## 用語

- `Actor`: アクションを実行する主体．ほとんどの場合で`Account`が該当する．
- `Action`: リソースに対して行う何らかの操作のこと．
- `Resource`: `Action`の対象となるもの．
- `Policy`: `Actor`が`Action`を実行するための条件．

## 全体像
- Pulsate API での認可制御は Policy クラスによって定義される．
- Policy クラス は `isAllowed` static メソッドを持ち，actor, action, resource の3値を要求する．
  - `isAllowed` メソッドは `Option.Option<Error>` を返す．
    - 要求が拒否された場合は `Option.Some<Error>` を返し，要求が承認された場合は `Option.None()` を返す．

```ts
interface PolicyArgs<Actor, Action, Resource> {
  actor: Actor,
  action: Action,
  resource: Resource
}

type NotePolicyArgs = PolicyArgs<Account, NotePolicyActions, Note>

class NotePolicy {
  static isAllowed(args: NotePolicyArgs): Option.Option<Error> {
    // 略
  }
}
```

### PolicyScope
Action は識別子 PolicyScope を用いて識別する．

- PolicyScope は3つの要素からなる文字列である．
- 要素は以下の通り．
  - 1: ポリシー名
  - 2: モデル名 (例: `account`, `note`)
    - モデルではないものも含む (例: `follow` )．
    - タイムラインの場合はタイムライン種別名とする (例: `home`, `conversation`)
  - 3: アクション名 (例: `fetch`, `update`)
- これらは以下で示す型で表現できる形式に従って結合される．
```ts
type PolicyScope = `${PolicyName}.${ModelName}:${ActionName}`
```
- `isAllowed` メソッドは，PolicyScope のポリシー名が自分が管理するものでない場合，エラーを返す．

