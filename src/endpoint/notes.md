# 投稿API

> [!NOTE]
>
> 投稿は”ノート”, 再投稿は”リノート”と言い換えられている場合があります.
>
> ダイレクト投稿: ノートのうち,公開範囲がダイレクトに指定されているもの

## `POST /notes`

ノートを作成

### 入力

- body: `application/json`

| 項目名              | 型                            | 制約/説明                                                                                              | 数制約        | 例 |
| ------------------- | ----------------------------- | ------------------------------------------------------------------------------------------------------ | ------------- | -- |
| content             | `string`                      | 投稿本文添付ファイルが存在する場合は0文字を許容                                                        | 1≤3000[文字]  |    |
| visibility          | `string`, `undefined`         | 投稿の公開範囲 デフォルト: `public` とり得る値: `public` `home` `followers`, `direct`                  | -             |    |
| attachment_file_ids | `Array<snowflake>, undefined` | 投稿の添付ファイルID 1つでもファイルが存在しない場合はエラー終了する                                   | 0≤N≤16[個]    |    |
| cw_comment          | `string`                      | CW時の注釈 [Untitled](https://www.notion.so/bb170e32e67142e79221de90c29c9cd4) 参照デフォルトは空文字列 | 0≤N≤256[文字] |    |
| send_to             | `snowflake`, `undefined`      | ダイレクト投稿の宛先公開範囲が`direct`のときのみ指定可能                                               |               |    |

### 入力例

```json
{
  "content": "hello world!",
  "visibility": "public",
  "attachment_file_ids": [
    "11938472"
  ],
  "cw_comment": ""
}
```

```json
{
  "content": "hello world!",
  "visibility": "direct",
  "attachment_file_ids": [
    "11938472"
  ],
  "cw_comment": "",
  "send_to": "8585030584"
}
```

### 出力

**`201 Created`**

投稿を作成しました.

```json
{
  "id": "3893974892",
  "content": "hello world!",
  "cw_comment": "",
  "visibility": "public",
  "created_at": "2023-09-27T14:17:29.169Z",
  "attachment_files": [
    {
      "id": "11938472",
      "filename": "hello.png",
      "content_type": "image/png",
      "url": "https://example.com/images/hello.png",
      "blur": "eoig:woi!our@nj/d",
      "nsfw": false
    }
  ]
}
```

| 項目名           | 型                     | 説明                                                                                   | 数制約        | 例 |
| ---------------- | ---------------------- | -------------------------------------------------------------------------------------- | ------------- | -- |
| id               | `snowflake`            | 投稿のID                                                                               |               |    |
| content          | `string`               | 投稿本文. 添付ファイルが存在する場合は0文字を許容                                      | 1≤3000[文字]  |    |
| visibility       | `string`               | 投稿の公開範囲. デフォルト: `public`. とり得る値: `public` `home` `followers` `direct` | -             |    |
| attachment_files | `Array<object>`        | 投稿の添付ファイルのオブジェクト (後述)                                                | 0≤N≤16[個]    |    |
| cw_comment       | `string`               | CW時の注釈, 参照 デフォルトは空文字列                                                  | 0≤N≤256[文字] |    |
| send_to          | `Snowflake, undefined` | ダイレクト投稿の宛先. 公開範囲がdirectのときのみ指定可能                               |               |    |
| created_at       | `string`               | 投稿の送信日時                                                                         |               |    |

- 添付ファイル (`attchment_files`)

| 項目名       | 型                    | 説明                                                                      | 数制約        | 例 |
| ------------ | --------------------- | ------------------------------------------------------------------------- | ------------- | -- |
| id           | `snowflake`           | 投稿のID                                                                  |               |    |
| filename     | `string`              | ファイル名                                                                | 3≤N≤256[文字] |    |
| content_type | `string`              | mimeタイプ                                                                |               |    |
| url          | `string`              | 添付ファイルのURL                                                         |               |    |
| blurhash     | `string`, `undefined` | 添付ファイルが画像であるときのサムネイルの [blurhash](https://blurha.sh/) |               |    |
| nsfw         | `boolean`             | ToDo                                                                      |               |    |

**`400 Bad Request`**

```json
{
  "error": "TEST_ERROR_CODE"
}
```

- `TOO_MANY_ATTACHMENTS` : 添付ファイルが制限を超過
- `TOO_MANY_C`ONTENT`` : CW注釈/投稿本文の文字数制限を超過
- `NO_DESTINATION`: 公開範囲がdirectのノートでsend_toが指定されていない
- `INVALID_VISIBILITY`: 公開範囲が正しい形式でない

**`403 Forbidden`**

```json
{
  "error": "TEST_ERROR_CODE"
}
```

- `YOU_ARE_SILENCED` : サイレンスされている際に公開範囲を`public`に指定した場合

**`404 Not Found`**

```json
{
  "error": "TEST_ERROR_CODE"
}
```

- `ATTACHMENT_NOT_FOUND`: 添付したファイルが存在しない
- `ACCOUNT_NOT_FOUND`: 宛先(send_to)に指定したアカウントが存在しない

## `GET /notes/{note_id}`

特定の投稿を取得します.

### 入力

- パスパラメータ
  - `note_id`: `string`
    - 取得したい投稿のID

### 出力例

**`200 OK`**

投稿を取得しました.

```json
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
```

| 項目名 | 型          | 説明     | 数制約 | 例 |
| ------ | ----------- | -------- | ------ | -- |
| id     | `snowflake` | 投稿のID |        |    |

**`404 Not Found`**

```json
{
  "error": "TEST_ERROR_CODE"
}
```

- `NOTE_NOT_FOUND`: 指定したIDのノートが存在しない
  - 指定したIDのノートを(アクセスしたユーザーが)取得できない場合もこのエラーを返す.

## `POST /notes/{note_id}/renote`

指定したIDのノートをリノートします.

### 入力

- パスパラメータ
  - `note_id`: `string`
    - 取得したい投稿のID
- body: `application/json`

| 項目名           | 型                     | 説明                                                                                   | 数制約        | 例 |
| ---------------- | ---------------------- | -------------------------------------------------------------------------------------- | ------------- | -- |
| id               | `snowflake`            | 投稿のID                                                                               |               |    |
| content          | `string`               | 投稿本文. 添付ファイルが存在する場合は0文字を許容                                      | 1≤3000[文字]  |    |
| visibility       | `string`               | 投稿の公開範囲. デフォルト: `public`. とり得る値: `public` `home` `followers` `direct` | -             |    |
| attachment_files | `Array<object>`        | 投稿の添付ファイルのオブジェクト (後述)                                                | 0≤N≤16[個]    |    |
| cw_comment       | `string`               | CW時の注釈, 参照 デフォルトは空文字列                                                  | 0≤N≤256[文字] |    |
| send_to          | `Snowflake, undefined` | ダイレクト投稿の宛先. 公開範囲がdirectのときのみ指定可能                               |               |    |
| created_at       | `string`               | 投稿の送信日時                                                                         |               |    |

`attachment_files`:

| 項目名       | 型          | 説明                                                                      | 数制約 | 例 |
| ------------ | ----------- | ------------------------------------------------------------------------- | ------ | -- |
| id           | `snowflake` | 投稿のID                                                                  |        |    |
| filename     | `string`    | ファイル名                                                                | ToDo   |    |
| content_type | `string`    | mimeタイプ                                                                |        |    |
| ToDo         |             |                                                                           |        |    |
| url          | `string`    | 添付ファイルのURL                                                         |        |    |
| blur         | `string`    | 添付ファイルが画像であるときのサムネイルの [blurhash](https://blurha.sh/) |        |    |
| nsfw         | `boolean`   | ToDo                                                                      |        |    |

### 入力例:

```json
{
  "content": "hello world!",
  "visibility": "public",
  "attachment_file_ids": [
    "11938472"
  ],
  "cw_comment": ""
}
```

### 出力

**`200 OK`**

リノートしました

```json
{
  "id": "3893974892",
  "content": "hello world!",
  "cw_comment": "",
  "visibility": "public",
  "renote_id": "4973874850",
  "created_at": "2023-09-27T14:17:29.169Z",
  "attachment_files": [
    {
      "id": "11938472",
      "filename": "hello.png",
      "content_type": "image/png",
      "url": "https://example.com/images/hello.png",
      "blur": "eoig:woi!our@nj/d",
      "nsfw": false
    }
  ]
}
```

| 項目名           | 型                     | 説明                                                                                   | 数制約        | 例 |
| ---------------- | ---------------------- | -------------------------------------------------------------------------------------- | ------------- | -- |
| id               | `snowflake`            | 投稿のID                                                                               |               |    |
| content          | `string`               | 投稿本文. 添付ファイルが存在する場合は0文字を許容                                      | 1≤3000[文字]  |    |
| visibility       | `string`               | 投稿の公開範囲. デフォルト: `public`. とり得る値: `public` `home` `followers` `direct` | -             |    |
| attachment_files | `Array<object>`        | 投稿の添付ファイルのオブジェクト (後述)                                                | 0≤N≤16[個]    |    |
| cw_comment       | `string`               | CW時の注釈, 参照 デフォルトは空文字列                                                  | 0≤N≤256[文字] |    |
| send_to          | `Snowflake, undefined` | ダイレクト投稿の宛先. 公開範囲がdirectのときのみ指定可能                               |               |    |
| created_at       | `string`               | 投稿の送信日時                                                                         |               |    |

| 項目名       | 型          | 説明                                                                      | 数制約 | 例 |
| ------------ | ----------- | ------------------------------------------------------------------------- | ------ | -- |
| id           | `snowflake` | 投稿のID                                                                  |        |    |
| filename     | `string`    | ファイル名                                                                | ToDo   |    |
| content_type | `string`    | mimeタイプ                                                                |        |    |
| ToDo         |             |                                                                           |        |    |
| url          | `string`    | 添付ファイルのURL                                                         |        |    |
| blur         | `string`    | 添付ファイルが画像であるときのサムネイルの [blurhash](https://blurha.sh/) |        |    |
| nsfw         | `boolean`   | ToDo                                                                      |        |    |

**`400 Bad Request`**

```json
{
  "error": "TEST_ERROR_CODE"
}
```

- `TOO_MANY_CHAR_LENGTH` : CW注釈/投稿本文の文字数制限を超過
- `INVALID_VISIBILITY`: 公開範囲が正しい形式でない
- `NO_DESTINATION`: 公開範囲がdirectのノートでsend_toが指定されていない

**`403 Forbidden`**

```json
{
  "error": "TEST_ERROR_CODE"
}
```

- `YOU_ARE_SILENCED` : サイレンスされている際に公開範囲を`public`に指定した

**`404 Not Found`**

```json
{
  "error": "TEST_ERROR_CODE"
}
```

- `ATTACHMENT_NOT_FOUND`: 添付したファイルが存在しない
- `NOTE_NOT_FOUND`: ノートが存在しない

## `POST /notes/{note_id}/reply`

指定したIDのノートに返信します.

### 入力

- パスパラメータ
  - `note_id`: `string`
    - 取得したい投稿のID
- body: `application/json`

| 項目名           | 型              | 説明                                                                                   | 数制約        | 例 |
| ---------------- | --------------- | -------------------------------------------------------------------------------------- | ------------- | -- |
| id               | `snowflake`     | 投稿のID                                                                               |               |    |
| content          | `string`        | 投稿本文. 添付ファイルが存在する場合は0文字を許容                                      | 1≤3000[文字]  |    |
| visibility       | `string`        | 投稿の公開範囲. デフォルト: `public`. とり得る値: `public` `home` `followers` `direct` | -             |    |
| attachment_files | `Array<object>` | 投稿の添付ファイルのオブジェクト (後述)                                                | 0≤N≤16[個]    |    |
| cw_comment       | `string`        | CW時の注釈, 参照 デフォルトは空文字列                                                  | 0≤N≤256[文字] |    |
| created_at       | `string`        | 投稿の送信日時                                                                         |               |    |

`attachment_files`:

| 項目名       | 型          | 説明                                                                      | 数制約 | 例 |
| ------------ | ----------- | ------------------------------------------------------------------------- | ------ | -- |
| id           | `snowflake` | 投稿のID                                                                  |        |    |
| filename     | `string`    | ファイル名                                                                | ToDo   |    |
| content_type | `string`    | mimeタイプ                                                                |        |    |
| ToDo         |             |                                                                           |        |    |
| url          | `string`    | 添付ファイルのURL                                                         |        |    |
| blur         | `string`    | 添付ファイルが画像であるときのサムネイルの [blurhash](https://blurha.sh/) |        |    |
| nsfw         | `boolean`   | ToDo                                                                      |        |    |

### 入力例

```json
{
  "content": "hello world!",
  "visibility": "public",
  "attachment_file_ids": [
    "11938472"
  ],
  "cw_comment": ""
}
```

### 出力

**`200 OK`**

投稿を作成しました.

```json
{
  "id": "3893974892",
  "content": "hello world!",
  "cw_comment": "",
  "reply_to": "2948933000",
  "visibility": "public",
  "created_at": "2023-09-27T14:17:29.169Z",
  "attachment_files": [
    {
      "id": "11938472",
      "filename": "hello.png",
      "content_type": "image/png",
      "url": "https://example.com/images/hello.png",
      "blur": "eoig:woi!our@nj/d",
      "nsfw": false
    }
  ]
}
```

| 項目名           | 型                     | 説明                                                                                   | 数制約        | 例 |
| ---------------- | ---------------------- | -------------------------------------------------------------------------------------- | ------------- | -- |
| id               | `snowflake`            | 投稿のID                                                                               |               |    |
| content          | `string`               | 投稿本文. 添付ファイルが存在する場合は0文字を許容                                      | 1≤3000[文字]  |    |
| visibility       | `string`               | 投稿の公開範囲. デフォルト: `public`. とり得る値: `public` `home` `followers` `direct` | -             |    |
| attachment_files | `Array<object>`        | 投稿の添付ファイルのオブジェクト (後述)                                                | 0≤N≤16[個]    |    |
| cw_comment       | `string`               | CW時の注釈, 参照 デフォルトは空文字列                                                  | 0≤N≤256[文字] |    |
| send_to          | `Snowflake, undefined` | ダイレクト投稿の宛先. 公開範囲がdirectのときのみ指定可能                               |               |    |
| created_at       | `string`               | 投稿の送信日時                                                                         |               |    |

| 項目名       | 型          | 説明                                                                      | 数制約 | 例 |
| ------------ | ----------- | ------------------------------------------------------------------------- | ------ | -- |
| id           | `snowflake` | 投稿のID                                                                  |        |    |
| filename     | `string`    | ファイル名                                                                | ToDo   |    |
| content_type | `string`    | mimeタイプ                                                                |        |    |
| ToDo         |             |                                                                           |        |    |
| url          | `string`    | 添付ファイルのURL                                                         |        |    |
| blur         | `string`    | 添付ファイルが画像であるときのサムネイルの [blurhash](https://blurha.sh/) |        |    |
| nsfw         | `boolean`   | ToDo                                                                      |        |    |

**`400 Bad Request`**

```json
{
  "error": "TEST_ERROR_CODE"
}
```

- `TOO_MANY_CHAR_LENGTH` : CW注釈/投稿本文の文字数制限を超過
- `INVALID_VISIBILITY`: 公開範囲が正しい形式でない

**`403 Forbidden`**

```json
{
  "error": "TEST_ERROR_CODE"
}
```

- `YOU_ARE_SILENCED` : サイレンスされている際に公開範囲を`public`に指定した
- `YOU_ARE_BLOCKED`: 返信先ユーザーにブロックされている

**`404 Not Found`**

```json
{
  "error": "TEST_ERROR_CODE"
}
```

- `ATTACHMENT_NOT_FOUND`: 添付したファイルが存在しない
- `NOTE_NOT_FOUND`: ノートが存在しない

## `DELETE /notes/{note_id}`

投稿を削除します.

NOTICE: 自分以外のノートを削除する場合はモデレータ以上の資格情報が必要です.

### 入力

- パスパラメータ
  - `note_id`: `string`
    - 削除するノートのID

### 出力

**`204 No Content`**

削除しました.

※ レスポンスボディは空になります

**`403 Forbidden`**

```json
{
  "error": "TEST_ERROR_CODE"
}
```

- `NO_PERMISSION`: ノートの投稿者でないため削除できない

**`404 Not Found`**

```json
{
  "error": "TEST_ERROR_CODE"
}
```

- `NOTE_NOT_FOUND`: 削除するノートが存在しない

## `POST /notes/{note_id}/reaction`

指定したノートにリアクションします.

### 入力

- パスパラメータ
  - `note_id`: `string`
    - リアクションしたい投稿のID

body: `application/json`

| 項目名                                                                         | 型                  | 説明   | 例 |
| ------------------------------------------------------------------------------ | ------------------- | ------ | -- |
| emoji                                                                          | `string`            | 絵文字 |    |
| 表記法は [共通](https://www.notion.so/74411becb886427fb512a32d523d6faf) を参照 | `<:alias:11938437>` |        |    |
| `🎉`                                                                           |                     |        |    |

### 入力例

```json
{
  "emoji": "🎉"
}
```

```json
{
  "emoji": "<:awesome:489395643749>"
}
```

### 出力

`200 OK`

リアクションしました.

```json
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
```

| 項目名           | 型                     | 説明                                                                                   | 数制約        | 例 |
| ---------------- | ---------------------- | -------------------------------------------------------------------------------------- | ------------- | -- |
| id               | `snowflake`            | 投稿のID                                                                               |               |    |
| content          | `string`               | 投稿本文. 添付ファイルが存在する場合は0文字を許容                                      | 1≤3000[文字]  |    |
| visibility       | `string`               | 投稿の公開範囲. デフォルト: `public`. とり得る値: `public` `home` `followers` `direct` | -             |    |
| attachment_files | `Array<object>`        | 投稿の添付ファイルのオブジェクト (後述)                                                | 0≤N≤16[個]    |    |
| cw_comment       | `string`               | CW時の注釈, 参照 デフォルトは空文字列                                                  | 0≤N≤256[文字] |    |
| send_to          | `Snowflake, undefined` | ダイレクト投稿の宛先. 公開範囲がdirectのときのみ指定可能                               |               |    |
| created_at       | `string`               | 投稿の送信日時                                                                         |               |    |

`attachment_files`:

| 項目名       | 型          | 説明                                                                      | 数制約 | 例 |
| ------------ | ----------- | ------------------------------------------------------------------------- | ------ | -- |
| id           | `snowflake` | 投稿のID                                                                  |        |    |
| filename     | `string`    | ファイル名                                                                | ToDo   |    |
| content_type | `string`    | mimeタイプ                                                                |        |    |
| ToDo         |             |                                                                           |        |    |
| url          | `string`    | 添付ファイルのURL                                                         |        |    |
| blur         | `string`    | 添付ファイルが画像であるときのサムネイルの [blurhash](https://blurha.sh/) |        |    |
| nsfw         | `boolean`   | ToDo                                                                      |        |    |

`reactions`:

| 項目名     | 型          | 説明                                                                | 例                        |
| ---------- | ----------- | ------------------------------------------------------------------- | ------------------------- |
| emoji      | `string`    | 絵文字. 表記法は [絵文字の扱い](../endpoint.md#絵文字の扱い) を参照 | `🎉`, `<:alias:11938437>` |
| reacted_by | `snowflake` | リアクションしたアカウントID                                        | `48499372`                |

**`400`** **`Bad Request`**

```json
{
  "error": "TEST_ERROR_CODE"
}
```

- `ALREADY_REACTED`: すでにリアクション済み
- `EMOJI_NOT_FOUND`:
  指定した絵文字が存在しない(カスタム絵文字のみ)/複数指定している(Unicode絵文字

**`404 Not Found`**

```json
{
  "error": "TEST_ERROR_CODE"
}
```

- `NOTE_NOT_FOUND`: リアクションするノートが存在しない

## `DELETE /notes/{note_id}/reaction`

指定したノートにつけたリアクションを解除します

### 入力

- パスパラメータ
  - `note_id`: `string`
    - リアクションしたい投稿のID

### 出力

**`204 No Content`**

削除しました.

※ レスポンスボディは空になります.

**`400 Forbidden`**

```json
{
  "error": "TEST_ERROR_CODE"
}
```

- `NOT_REACTED`: リアクションしていない

**`404 Not Found`**

```json
{
  "error": "TEST_ERROR_CODE"
}
```

- `NOTE_NOT_FOUND`: ノートが存在しない

## `POST /notes/{note_id}/bookmark`

指定した投稿をブックマークします

### 入力

- パスパラメータ
  - `note_id`: `string`
    - リアクションしたい投稿のID

### 出力

**`200 OK`**

ブックマークしました

```json
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
```

| 項目名           | 型                     | 説明                                                                                   | 数制約        | 例 |
| ---------------- | ---------------------- | -------------------------------------------------------------------------------------- | ------------- | -- |
| id               | `snowflake`            | 投稿のID                                                                               |               |    |
| content          | `string`               | 投稿本文. 添付ファイルが存在する場合は0文字を許容                                      | 1≤3000[文字]  |    |
| visibility       | `string`               | 投稿の公開範囲. デフォルト: `public`. とり得る値: `public` `home` `followers` `direct` | -             |    |
| attachment_files | `Array<object>`        | 投稿の添付ファイルのオブジェクト (後述)                                                | 0≤N≤16[個]    |    |
| cw_comment       | `string`               | CW時の注釈, 参照 デフォルトは空文字列                                                  | 0≤N≤256[文字] |    |
| send_to          | `Snowflake, undefined` | ダイレクト投稿の宛先. 公開範囲がdirectのときのみ指定可能                               |               |    |
| created_at       | `string`               | 投稿の送信日時                                                                         |               |    |

`attachment_files`:

| 項目名       | 型          | 説明                                                                      | 数制約 | 例 |
| ------------ | ----------- | ------------------------------------------------------------------------- | ------ | -- |
| id           | `snowflake` | 投稿のID                                                                  |        |    |
| filename     | `string`    | ファイル名                                                                | ToDo   |    |
| content_type | `string`    | mimeタイプ                                                                |        |    |
| ToDo         |             |                                                                           |        |    |
| url          | `string`    | 添付ファイルのURL                                                         |        |    |
| blur         | `string`    | 添付ファイルが画像であるときのサムネイルの [blurhash](https://blurha.sh/) |        |    |
| nsfw         | `boolean`   | ToDo                                                                      |        |    |

`reactions`:

| 項目名                                                      | 型                 | 説明                         | 例         |
| ----------------------------------------------------------- | ------------------ | ---------------------------- | ---------- |
| emoji                                                       | `string`           | 絵文字                       |            |
| 表記法は [絵文字の扱い](../endpoint.md#絵文字の扱い) を参照 | `<:alias:11938437` |                              |            |
| `🎉`                                                        |                    |                              |            |
| reacted_by                                                  | `snowflake`        | リアクションしたアカウントID | `48499372` |

**`404 Not Found`**

```json
{
  "error": "TEST_ERROR_CODE"
}
```

- `NOTE_NOT_FOUND`: ノートが存在しない

## `DELETE /notes/{note_id}/bookmark`

指定した投稿をブックマーク解除します

### 入力

- パスパラメータ
  - `note_id`: `string`
    - ブックマーク解除したい投稿のID

### 出力

**`204 No Content`**

ブックマーク解除しました

※レスポンスボディは空になります.

**`404 Not Found`**

```json
{
  "error": "TEST_ERROR_CODE"
}
```

- `NOTE_NOT_FOUND`: ノートが存在しない

---

| 項目名           | 型                     | 説明                                                                                   | 数制約        | 例 |
| ---------------- | ---------------------- | -------------------------------------------------------------------------------------- | ------------- | -- |
| id               | `snowflake`            | 投稿のID                                                                               |               |    |
| content          | `string`               | 投稿本文. 添付ファイルが存在する場合は0文字を許容                                      | 1≤3000[文字]  |    |
| visibility       | `string`               | 投稿の公開範囲. デフォルト: `public`. とり得る値: `public` `home` `followers` `direct` | -             |    |
| attachment_files | `Array<object>`        | 投稿の添付ファイルのオブジェクト (後述)                                                | 0≤N≤16[個]    |    |
| cw_comment       | `string`               | CW時の注釈, 参照 デフォルトは空文字列                                                  | 0≤N≤256[文字] |    |
| send_to          | `Snowflake, undefined` | ダイレクト投稿の宛先. 公開範囲がdirectのときのみ指定可能                               |               |    |
| created_at       | `string`               | 投稿の送信日時                                                                         |               |    |

| 項目名       | 型          | 説明                                                                      | 数制約 | 例 |
| ------------ | ----------- | ------------------------------------------------------------------------- | ------ | -- |
| id           | `snowflake` | 投稿のID                                                                  |        |    |
| filename     | `string`    | ファイル名                                                                | ToDo   |    |
| content_type | `string`    | mimeタイプ                                                                |        |    |
| ToDo         |             |                                                                           |        |    |
| url          | `string`    | 添付ファイルのURL                                                         |        |    |
| blur         | `string`    | 添付ファイルが画像であるときのサムネイルの [blurhash](https://blurha.sh/) |        |    |
| nsfw         | `boolean`   | ToDo                                                                      |        |    |

| 項目名                                                      | 型                 | 説明                         | 例         |
| ----------------------------------------------------------- | ------------------ | ---------------------------- | ---------- |
| emoji                                                       | `string`           | 絵文字                       |            |
| 表記法は [絵文字の扱い](../endpoint.md#絵文字の扱い) を参照 | `<:alias:11938437` |                              |            |
| `🎉`                                                        |                    |                              |            |
| reacted_by                                                  | `snowflake`        | リアクションしたアカウントID | `48499372` |
