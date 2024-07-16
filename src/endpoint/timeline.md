# タイムラインAPI (WIP)

## `GET /timeline`

- タイムラインを取得します

> [!NOTE]
>
> - 取得した投稿は時系列順にソートされた状態で返されます
> - 1度に返される件数は最大20件です

### 入力

- クエリ
  - type: `string` (default: `home`)
    - `home/local/global`が指定できます
  - hasFile: `bool`(default: `false`)
    - ファイルを含む投稿のみを返します
  - noNsfw: `bool` (default: `false`)
    - NSFWフラグの立っているメディアを含む投稿を返さなくなります
  - beforeId: `snowflake` (default: `undefined`)
    - 指定したIDより古い投稿を返します
    - 指定したIDの投稿は含まれません

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
