# タイムラインAPI

> [!WARNING]
>
> 取得した投稿は時系列順にソートされた状態で返されます.\
> 一度に取得できる件数は最大20件です.

## `GET /timeline/{timeline_type}`

タイムラインを取得します.

### 入力

- パスパラメータ
  - `timeline_type`: `string`, `undefined`
    - とり得る値: `home` / `global`
    - デフォルト: `home`
- クエリパラメータ
  - `has_attachment`: `bool | undefined`
    - デフォルト: `false`
    - ファイルを含む投稿のみを返します
  - `no_nsfw` : `bool | undefined`
    - デフォルト: `false`
    - NSFWフラグの立っているファイルを含む投稿を返さなくなります
  - `before_id` : `snowflake| undefined`
    - デフォルト: `undefined`
      - ~~デフォルトでは現在取得できる最新の投稿から20件取得します.~~
    - 指定したIDより古い投稿を返します.指定したIDの投稿は含まれません

### 出力

**`200 OK`**

タイムラインを取得します.

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

- `INVALID_TIMELINE_TYPE`: 指定したタイムラインタイプは存在しません

**`404 Not Found`**

```json
{
  "error": "TEST_ERROR_CODE"
}
```

- `NOTHING_LEFT`: これ以上古い投稿はありません
  - 1つでも古い投稿がある場合は投稿を返します

## `GET /timeline/accounts/{account_id|account_name}`

特定のユーザーの投稿を取得します.

### 入力

- パスパラメータ
  - `account_id,account_name`: `snowflake`|`string`
    - アカウント名かアカウントのIDを指定できます.
- クエリパラメータ
  - `has_attachment`: `bool | undefined`
    - デフォルト: `false`
    - ファイルを含む投稿のみを返します
  - `no_nsfw` : `bool | undefined`
    - デフォルト: `false`
    - NSFWフラグの立っているファイルを1つでも含む投稿を返さなくなります
  - `before_id` : `snowflake`| undefined`
    - デフォルト: `undefined`
      - デフォルトでは現在取得できる最新の投稿から20件取得します.
    - 指定したIDより古い投稿を返します.指定したIDの投稿は含まれません

### 出力

**`200 OK`**

タイムラインを取得します.

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

- `INVALID_TIMELINE_TYPE`: 指定したタイムラインタイプは存在しません

**`403 Forbidden`**

```json
{
  "error": "TEST_ERROR_CODE"
}
```

- `YOU_ARE_BLOCKED`: 指定したアカウントにブロックされています.

**`404 Not Found`**

```json
{
  "error": "TEST_ERROR_CODE"
}
```

- `NOTHING_LEFT`: これ以上古い投稿はありません
  - 1つでも古い投稿がある場合は投稿を返します
- `ACCOUNT_NOT_FOUND` : 指定したアカウントが見つかりませんでした
