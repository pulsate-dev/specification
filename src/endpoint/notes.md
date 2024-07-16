# 投稿API (WIP)

[API Reference - notes](https://api.pulsate.dev/reference#tag/notes)

## `POST /notes`

投稿を作成します.

### 入力

- body: `application/json`
  - content: `string` (3000文字以内)
    - 投稿の本文(CW時は折りたたまれます)
    - default: `""`
  - visibility: `string`
    - 投稿の公開範囲
    - default: `"public"`
      - `"public"` `"home"` `"followers"` `"direct"` のみ指定できます
        - 指定しない場合は`"public"` になります
        - 返信 または リノート の場合、返信先 or リノート元の公開範囲より広い範囲を指定することはできません
  - cw_comment: `string | undefined` (256文字以内)
    - CW時のコメント
    - default: `undefined`
      - stringである場合はCWとして扱われます.
  - attachment_file_ids: `array<Snowflake>` (16個以内)
    - 投稿の添付ファイルID
    - default: `[]`
      - 16個以上はエラーになります
  - reply_id: `Snowflake | undefined`
    - 投稿の返信先
      - default: `undefined`

```json
{
    "content": "hello world",
    "visibility": "public",
    "cw_comment": undefined,
    "attachment_file_ids": ["1292049892"],
    "reply_id": undefined,
}
```

### 出力

> [!NOTE]
>
> - `reactions.id` は、カスタム絵文字の場合IDのSnowflakeが入ります.
> - `name` は、Unicode絵文字の場合絵文字が直接入ります.
>   - カスタム絵文字の場合は, `:<string>:`のうち`<string>`が入ります. (`<>`は取り除いてください)

- 201 Created

```json
{
    id: "3893974892",
    content: "hello world",
    cw_comment: undefined,
    visibility: "public",
    renote_id: "4973874850",
    reply_id: undefined,
    created_at: "2023-09-27T14:17:29.169Z",
    attachment_files: [
      {
        id: "204980348583",
        filename: "hello.png",
        content_type: "image/png",
        url: "https://example.com/images/hello.png",
        blur: "eoig:woi!our@nj/d",
        nsfw: false,
      },
    ],
    reactions: [],
    author: {
      id: "2874987398",
      username: "test",
      acct: "testuser@example.com",
      display_name: "テストユーザー",
      bio: "自己紹介で書くことがありません",
      avatar: "https://example.com/images/avatar.png",
      header: "https://example.com/images/header.png",
      followed_count: 200,
      following_count: 10,
    },
  }
```

- 400 Bad Request
  - 添付ファイルが多すぎる
  - cw/contentの文字数が超過している
  - visibilityで期待する文字列が入っていない

- 403 Forbidden
  - サイレンス時にpublicを選択したとき

- 404 Not Found
  - 返信先の投稿が存在しない場合

## `GET /notes/{note_id}`

特定の投稿情報を取得します

### 出力

- 200 OK

```json
{
  id: "3893974892",
  content: "hello world",
  cw_comment: undefined,
  visibility: "public",
  renote_id: "4973874850",
  reply_id: undefined,
  created_at: "2023-09-27T14:17:29.169Z",
  attachment_files: [
    {
      id: "204980348583",
      filename: "hello.png",
      content_type: "image/png",
      url: "https://example.com/images/hello.png",
      blur: "eoig:woi!our@nj/d",
      nsfw: false,
    },
  ],
  reactions: [
    {
      count: 1,
      id: null,
      name: "🤔",
    },
    {
      count: 10,
      id: "19873984",
      name: "sugoi",
    },
  ],
  author: {
    id: "2874987398",
    username: "test",
    acct: "testuser@example.com",
    display_name: "テストユーザー",
    bio: "自己紹介で書くことがありません",
    avatar: "https://example.com/images/avatar.png",
    header: "https://example.com/images/header.png",
    followed_count: 200,
    following_count: 10,
  },
}
```

- 403 Forbidden
  - 公開範囲がダイレクトなど、特定ユーザーしか見ることのできない投稿であるとき
  - 投稿したユーザーが凍結されているとき

- 404 Not Found
  - 投稿が存在しないとき

## `POST /notes/{note_id}/renote`

投稿をリノートします

### 入力

- body: `application/json`
  - content: `string` (3000文字以内)
    - 投稿の本文(CW時は折りたたまれます)
    - default: `""`
  - visibility: `string`
    - 投稿の公開範囲
    - default: `"public"`
    - `"public"` `"home"` `"followers"` `"direct"` のみ指定できます
      - 指定しない場合は`"public"` になります
      - 返信 または リノート の場合、返信先 or リノート元の公開範囲より広い範囲を指定することはできません
  - cw_comment: `string | undefined` (256文字以内)
    - CW時のコメント
    - default: `undefined`
      - stringである場合はCWとして扱われます
  - attachment_file_ids: `array<Snowflake>` (16個以内)
    - 投稿の添付ファイルID
    - default: `[]`
      - 16個以上はエラーになります
  - renote_id: `Snowflake | undefined`
    - リノート元のID
    - default: `undefined`
      - `content`に値が入っている場合は、引用RNとして扱われます

### 出力

```json
{
    id: "3893974892",
    content: "hello world",
    cw_comment: undefined,
    visibility: "public",
    renote_id: "4973874850",
    reply_id: undefined,
    created_at: "2023-09-27T14:17:29.169Z",
    attachment_files: [
      {
        id: "204980348583",
        filename: "hello.png",
        content_type: "image/png",
        url: "https://example.com/images/hello.png",
        blur: "eoig:woi!our@nj/d",
        nsfw: false,
      },
    ],
    reactions: [],
    author: {
      id: "2874987398",
      username: "test",
      acct: "testuser@example.com",
      display_name: "テストユーザー",
      bio: "自己紹介で書くことがありません",
      avatar: "https://example.com/images/avatar.png",
      header: "https://example.com/images/header.png",
      followed_count: 200,
      following_count: 10,
    },
  }
```

## `DELETE /notes/{note_id}`

投稿を削除します

> [!NOTE]
>
> リノートである場合はリノートが解除されます

### 出力

- 204 No Content
- 403 Forbidden
  - ノートの投稿者でない時
  - 管理者 / モデレーターは自分以外で削除可能です
- 404 Not Found
  - 削除するノートが存在しない時

## `GET /notes/accounts/{account_id}`

ユーザーの投稿を取得します

### 入力

- クエリ
  - hasFile: `bool`(default: `false`)
    - ファイルを含む投稿のみ返します
      - 指定していない場合はデフォルト値になります
  - includeReply: `bool` (default: `false`)
    - 別ユーザーに対する返信を含めます
      - 指定していない場合はデフォルト値になります
  - limit: `int` (default: `20`)
    - 取得する投稿の数
    - limit(n)の範囲 `20 ≤ n ≤ 100`
      - 指定していない場合はデフォルト値になります
    - reverse: `bool` (default: `false`)
    - 投稿が古いものからソートされます
      - 指定していない場合はデフォルト値になります

### 出力

- 200 OK

```json
[
  {
    id: "3893974892",
    content: "hello world",
    cw_comment: undefined,
    visibility: "public",
    renote_id: "4973874850",
    reply_id: undefined,
    created_at: "2023-09-27T14:17:29.169Z",
    attachment_files: [
      {
        id: "204980348583",
        filename: "hello.png",
        content_type: "image/png",
        url: "https://example.com/images/hello.png",
        blur: "eoig:woi!our@nj/d",
        nsfw: false,
      },
    ],
    reactions: [
      {
        count: 1,
        id: null,
        name: "🤔",
      },
      {
        count: 10,
        id: "19873984",
        name: "sugoi",
      },
    ],
    author: {
      id: "2874987398",
      username: "test",
      acct: "testuser@example.com",
      display_name: "テストユーザー",
      bio: "自己紹介で書くことがありません",
      avatar: "https://example.com/images/avatar.png",
      header: "https://example.com/images/header.png",
      followed_count: 200,
      following_count: 10,
    },
  },
]
```

- 400 Invalid Request
  - クエリの値が不正の時
- 404 Not Found
  - ユーザーが存在しない時
