# 認可制御

このドキュメントでは，Pulsate API(v0) における認可制御について記述する．

## 用語

- `Actor`: アクションを実行する主体．`Account`が該当する．
- `Action`: リソースに対して行う何らかの操作のこと．
  - `read`: 読み取り
  - `write`: 書き込み，更新(リソースが更新可能な場合)，リソースの削除
- `Resource`: `Action`の対象となるもの．
- `Target`: 操作が許可されたときに使用する，操作を行うまたは操作後のリソースを保存するもの．
- `Policy`: `Actor`が`Action`を実行するための条件．

## 全体像

- Pulsate API での認可制御は Policy クラスによって定義される．
- Policy クラスは `withCheck` static メソッドを持ち，actor, action, resource, targetの3値，および関数 `fn` を要求する．
  - `withCheck` メソッドはジェネリクス `<Target,Res>` を受け取る．`Target` は target の型，`Res` は `fn` の返値である．

```ts
interface PolicyArgs<Actor, Action, Resource> {
  actor: Actor;
  action: Action;
  resource: Resource;
}

type NotePolicyArgs = PolicyArgs<Account, NotePolicyScope, Note>;

class NotePolicy {
  static withCheck<Target, Res>(target: Target): (args: NotePolicyArgs, fn: (target: Target) => Promise<Result.Result<Error, Res>>) => Promise<Result.Result<Error, Res>> {
    return async (
            args: AccountPolicyArgs,
            fn: (target: Target) => Promise<Result.Result<Error, Res>>
    ): Promise<Result.Result<Error, Res>> => {
      if (!args.actor) return Result.err(Error("ログインしないと使えません"));
      // 条件を満たしたときだけ実行する
      return await fn(target);
    };
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
  - 3: アクション名
- これらは以下で示す型で表現できる形式に従って結合される．

```ts
type PolicyScope = `${PolicyName}.${ModelName}:${ActionName}`;
```

- `withCheck` メソッドは，PolicyScope
  のポリシー名が自分が管理するものでない場合，エラーを返す．
