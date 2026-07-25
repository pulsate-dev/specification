# 認可制御

このドキュメントでは，Pulsate API(v0) における認可制御について記述する．

## 用語

- `Actor`：アクションを実行する主体．判定に必要な属性だけを持つ，薄いオブジェクトとして表現する．
  - `id`：AccountID
  - `role`：[`AccountRole`](model/account.md)
  - `silenced`：[`AccountSilenced`](model/account.md)
- `Action`：リソースに対して行う何らかの操作のこと．
  - `read`：読み取り
  - `write`：書き込み，更新（リソースが更新可能な場合），リソースの削除
  - TypeScript上では次のUnion型で表現する．
    ```ts
    type Action = "read" | "write";
    ```
- `Resource`：`Action`の対象となるもの．
- `Policy`：`Actor`が`Action`を実行するための条件．

`Actor`に凍結状態（`AccountFrozen`）を含めないのは，凍結の判定が認可の`Policy`ではなく，型の上で解決されるためである．
凍結されたアカウントは`InactiveAccount`と同様に，型レベルで通常の`Account`と区別される．
したがって認可判定の対象になる時点で，凍結アカウントは既に取り除かれている．

## 全体像

Pulsate APIでの認可制御は，`Policy`を接尾辞に持つクラス群によって定義する．

各`Policy`クラスは`withCheck` staticメソッドを持つ．
`withCheck`は`actor`，`action`，`resource`の3値を含む引数と，判定を通過したときに実行する関数`fn`を受け取る．
`fn`は`resource`を受け取り，`Result`を返す．

```ts
interface PolicyArgs<Actor, Action, Resource> {
  actor: Actor;
  action: Action;
  resource: Resource;
}

interface NoteResource {
  note: Note;
  relationship: AccountRelationship;
}

type NotePolicyArgs = PolicyArgs<Actor, Action, NoteResource>;

class NotePolicy {
  static async withCheck<Res>(
    args: NotePolicyArgs,
    fn: (resource: NoteResource) => Promise<Result.Result<Error, Res>>,
  ): Promise<Result.Result<Error, Res>> {
    switch (args.action) {
      case "read": {
        const allowed = args.resource.note.isVisibleTo(args.resource.relationship);
        if (!allowed) return Result.err(Error("この投稿は閲覧できません"));
        return await fn(args.resource);
      }
      case "write": {
        const allowed =
          args.actor.id === args.resource.note.getAuthorId() ||
          args.actor.role === "admin";
        if (!allowed) return Result.err(Error("権限がありません"));
        return await fn(args.resource);
      }
      default:
        return args.action satisfies never;
    }
  }
}
```

`withCheck`が`fn`を包む形を取るのは，特権的な操作がコード上のどの範囲に当たるかを示すためである．
判定を通過した後の処理を`fn`として切り出すことで，「ここから先は認可された範囲の処理である」という境界がコード上に残る．

`action`の網羅性は，`switch`と`satisfies never`によってコンパイル時に確かめる．
`Action`が増えたとき，対応する`case`を書き漏らすとコンパイルエラーになる．

### Resourceの合成

`Resource`は，常にドメインモデル1つだけとは限らない．
判定に他のモデルの情報が要る場合は，呼び出し側が判定に必要な値を事前に取得し，合成オブジェクトとして渡す．
`withCheck`自体はI/Oを行わない．

上の例で`resource`が`{ note: Note; relationship: AccountRelationship }`という合成オブジェクトになっているのは，Noteの読み取り可否がNoteの公開範囲と`AccountRelationship`の両方に依存するためである．

### PolicyAction

`Action`そのものの識別は`read`／`write`のUnion型で足りるが，ログ出力やデバッグ時に，どの`Policy`のどの`Action`が実行されたかを1つの文字列として残したい場合がある．
この用途のために，`PolicyAction`というTemplate Literal型を別途用意する．

```ts
type PolicyAction = `${PolicyName}.${ModelName}:${ActionName}`;
```

`PolicyAction`は認可判定そのものには使わない．
判定は`Action`の値と`switch`による網羅性チェックで行い，`PolicyAction`はログ出力時の識別子としてのみ使う．

## 認可処理の配置場所

Pulsate APIのレイヤード構成に対応づけると，認可処理は次の2箇所に配置する．

- Service層：単一リソースに対する読み書き．対象リソースを取得した後，`withCheck`による判定を挟む．
- Repository層：一覧・タイムライン取得の絞り込み．全件取得してからフィルタするのではなく，`actor`を条件に含めたクエリとして可視性を表現する．

一覧・タイムライン取得では，可視性の判定条件を1箇所にまとめる．
ホームタイムライン，Listタイムライン，アカウント別の投稿一覧は，いずれも同じ可視性条件を再利用し，呼び出し元ごとに候補となる投稿者集合（フォロー中のアカウント，Listのassignees，単一アカウントなど）だけを差し替える．

また，Listのように複数のコンテキストにまたがる操作は，各コンテキストの`Policy`やRepository層を直接結合させず，Service層で組み合わせる．
たとえば`GET /lists/{list_id}/notes`は，まずListへのアクセス可否をListの`Policy`で判定し，その後Noteの可視性をRepository層のクエリで絞り込む．
Listの`Policy`がNoteのモデルをimportすることはない．
