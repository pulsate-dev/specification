# 検索API

## クエリ

ベースは [Twitter v2](https://zenn.dev/mamushi/articles/twitter_search_query)
のクエリ.

### オペレータ

| Operator    | 意味                     | 例                                                | 単独使用可能 |
| ----------- | ------------------------ | ------------------------------------------------- | ------------ |
| `keyword`   | 特定のキーワードを含む   | `松江 AND どこ`                                   | yes          |
| `""`        | 文字列の完全一致         | `"造幣局 桜"`                                     | yes          |
| `from:`     | 特定ユーザーによるノート | `from:@john@example.com or from:@doe@example.com` | yes          |
| `is:renote` | リノート                 | `hello world -is:renote`                          | no           |
| `is:quote`  | 引用リノート             | `#筑後川花火大会 is:quote`                        | no           |
| `has:link`  | 本文にリンクを含むノート | `nowplaying has:link`                             | no           |
| `has:media` | 添付ファイルを含むノート | `#徳川家康 has:media`                             | no           |

### 演算子

| 演算子 | 説明                                                                                       |
| ------ | ------------------------------------------------------------------------------------------ |
| `AND`  | スペースを挟んで連続する演算子はAND 論理演算となり、両方の条件を満たしたノートが返されます |
| `OR`   | OR を挟んで連続する演算子はOR論理演算となり、どちらかの条件を満たしたノートが返されます.   |
| `-`    | キーワードの前にハイフンをつけると、そのキーワードを論理否定することができます.            |
| `()`   | カッコでくくると演算子をグループ化できます. AND>ORの順で適用されます.                      |

## `GET /search/notes`

投稿を検索します. 返す最大件数は100件です

### 入力

- クエリパラメータ
  - `query`: `string`
    - 検索クエリ
    - 上記の内容を受け取ります

### 出力

**`200 OK`**

検索に成功

出力の内容はタイムラインと同一である.

```json
[
  {
    "id": "3893974892",
    "content": "hello world!",
    "cw_comment": "",
    "visibility": "public",
    "created_at": "2023-09-27T14:17:29.169Z",
    "attachment_files": [
      {
        "id": "204980348583",
        "filename": "hello.png",
        "content_type": "image/png",
        "url": "https://example.com/images/hello.png",
        "blur": "eoig:woi!our@nj/d",
        "nsfw": false
      }
    ],
    "reactions": [
      {
        "emoji": "<:alias:11938437>",
        "reacted_by": "3085763644"
      },
      {
        "emoji": "🎉",
        "reacted_by": "494984128"
      }
    ],
    "author": {
      "id": "2874987398",
      "name": "@john@example.com",
      "display_name": "John Doe",
      "bio": "I am Test User.",
      "avatar": "https://example.com/images/avatar.png",
      "header": "https://example.com/images/header.png",
      "followed_count": 200,
      "following_count": 10
    }
  }
]
```

**`400 Bad Request`**

```json
{
  "error": "TEST_ERROR_CODE"
}
```

- `INVALID_QUERY`: クエリが正しくありません
