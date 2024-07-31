# リストAPI

## `POST /lists/`

リストを作成します

### 入力

- body: `application/json`

| 項目名 | 型        | 説明                                                                                                                                                | 制約          | 例 |
| ------ | --------- | --------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- | -- |
| title  | `string`  | リストのタイトル                                                                                                                                    | 1≤N≤100[文字] |    |
| public | `boolean` | デフォルト: `false` (非公開) 公開: 　リストにアサインされたアカウントには通知が飛びます. 非公開: 通知は飛ばず、自分以外のアカウントからは見えません |               |    |

### 入力例

```json
{
  "title": "Pulsate Developers",
  "public": false
}
```

### 出力

**`200 OK`**

```json
{
  "id": "18342938400393",
  "title": "Pulsate Developers",
  "public": false
}
```

**`400 Bad Request`**

```json
{
  "error": "TEST_ERROR_CODE"
}
```

- `TITLE_TOO_LONG`: タイトルが長すぎます

## `PATCH /lists/{list_id}`

リスト情報を編集します

### 入力

- パスパラメータ
  - `list_id`: `string`
    - 編集したいリストのID
    
- body: `application/json`

| 項目名 | 型        | 説明                 | 制約          |
| ------ | --------- | -------------------- | ------------- |
| title  | `string`  | リストのタイトル     | 1≤N≤100[文字] |
| public | `boolean` | 公開・非公開のフラグ |               |

### 入力例

```json
{
  "title": "Edited Title",
  "public": true
}
```

### 出力

**`200 OK`**

```json
{
  "id": "18342938400393",
  "title": "Edited Title",
  "public": true,
  "assigners": [
    {
      "id": "1838933554",
      "name": "@john@example.com"
    }
  ]
}
```

**`404 Not Found`**

```json
{
  "error": "TEST_ERROR_CODE"
}
```

- `LIST_NOTFOUND`: リストが見つかりません

**`400 Bad Request`**

```json
{
  "error": "TEST_ERROR_CODE"
}
```

- `TITLE_TOO_LONG`: タイトルが長すぎます

## `GET /lists/{list_id}`

リスト情報を取得します

### 入力

- パスパラメータ
  - `list_id`: `string`
    - 取得したいリストのID

### 出力

**`200 OK`**

```json
{
  "id": "18342938400393",
  "title": "Pulsate Developers",
  "public": false,
  "assigners": [
    {
      "id": "1838933554",
      "name": "@john@example.com"
    }
  ]
}
```

**`404 Not Found`**

```json
{
  "error": "TEST_ERROR_CODE"
}
```

- `LIST_NOTFOUND`: リストが見つかりません

## `GET /lists/accounts/{account_id}`

アカウントが持つリストを取得します

### 入力

- パスパラメータ
  - `account_id`: `snowflake`
    - アカウントのID

### 出力

**`200 OK`**

```json
[
  {
    "id": "18342938400393",
    "title": "Pulsate Developers",
    "public": false,
    "assigners": [
      {
        "id": "1838933554",
        "name": "@john@example.com"
      }
    ]
  }
]
```

**`404 Not Found`**

```json
{
  "error": "TEST_ERROR_CODE"
}
```

- `ACCOUNT_NOT_FOUND` : ユーザーが存在しません
- `LIST_NOTFOUND`: リストが見つかりません

## `POST /lists/{list_id}`

リストにアカウントをアサインします

### 入力

- パスパラメータ
  - `list_id`: `string`
    - リストのID
- body: `application/json`
  - account_id: `Array<`snowflake`>`
    - アカウントID
    - 一度にアサインできる最大アカウント数: 30

### 出力

**`200 OK`**

```json
{
  "account_id": [
    "389384553329569",
    "586039500493885",
    "4847377595"
  ]
}
```

**`400 Bad Request`**

```json
{
  "error": "TEST_ERROR_CODE"
}
```

- `TOO_MANY_TARGETS`: アサインするアカウント数が多すぎます

**`404 Not Found`**

```json
{
  "error": "TEST_ERROR_CODE"
}
```

- `ACCOUNT_NOT_FOUND`: アカウントが存在しません
- `LIST_NOTFOUND`: リストが見つかりません

## `DELETE /lists/{list_id}`

リストからアカウントを削除します

### 入力

- パスパラメータ
  - `list_id`: `string`
    - リストのID
- body: `application/json`
  - account_id: `Array<`snowflake`>`
    - 削除するアカウントのID
    - 一度に削除できるアカウント数: 30

### 入力例

```json
{
  "account_id": [
    "389384553329569",
    "586039500493885",
    "4847377595"
  ]
}
```

### 出力

**`204 No Content`**

削除しました.

※レスポンスボディは空になります.

**`400 Bad Request`**

```json
{
  "error": "TEST_ERROR_CODE"
}
```

- `TOO_MANY_TARGETS` : 削除するアカウント数が多すぎます

**`404 Not Found`**

```json
{
  "error": "TEST_ERROR_CODE"
}
```

- `ACCOUNT_NOT_FOUND`: アカウントが存在しません
- `LIST_NOTFOUND`: リストが見つかりません

## `DELETE /lists/{list_id}`

リストを削除します.

### 入力

- パスパラメータ
  - `list_id`: `string`
    - リストのID

### 出力

**`204 No Content`**

削除しました.

※レスポンスボディは空になります.

**`404 Not Found`**

```json
{
  "error": "TEST_ERROR_CODE"
}
```

- `LIST_NOTFOUND`: リストが見つかりません

## `GET /lists/{list_id}/notes`

リストのノートを取得します.

### 入力

- パスパラメータ
  - `list_id`: `snowflake`
    - リストのID
- クエリパラメータ
  - `has_attachment`: `bool | undefined`
    - デフォルト: `false`
    - ファイルを含む投稿のみを返します
  - `no_nsfw` : `bool | undefined`
    - デフォルト: `false`
    - NSFWフラグの立っているファイルを含む投稿を返さなくなります
  - `before_id` : ``snowflake`| undefined`
    - デフォルト: `undefined`
      - デフォルトでは現在取得できる最新の投稿から20件取得します.
    - 指定したIDより古い投稿を返します.指定したIDの投稿は含まれません

### 出力

**`200 OK`**

取得に成功しました

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

**`404 Not Found`**

```json
{
  "error": "TEST_ERROR_CODE"
}
```

- `LIST_NOTFOUND`: リストが見つかりません
- `NOTHING_LEFT`: これ以上古い投稿はありません
  - 1つでも古い投稿がある場合は投稿を返します
