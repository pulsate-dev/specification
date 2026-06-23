# List モジュール

## `List`

アカウントをグループ化するエンティティ．
リストタイムライン（`GET /lists/{list_id}/notes`）を通じて，アサインされたアカウントの投稿をまとめて閲覧できる．

TypeScript 上ではリスト固有の ID 型を次のように定義する．

```typescript
export type ListID = ID<List>;
```

`List` は次の属性を持つ．

- **`id`**：ListID
  - このリストを一意に識別する Snowflake ID
- **`ownerId`**：作成者の AccountID
- **`title`**：リストのタイトル
  - 文字長は `1 ≦ L ≦ 100`
- **`public`**：公開フラグ
  - `true`
    の場合，アサイン操作の際にアサインされたアカウントへ通知が送られ，リスト作成者以外のアカウントからもリストを参照できる
  - `false` の場合，アサイン通知は送られず，リスト作成者のみが参照できる
- **`assignees`**：アサインされたアカウントの AccountID の集合

> [!NOTE]
> 一度の操作でアサインまたは削除できるアカウント数は最大 30．
