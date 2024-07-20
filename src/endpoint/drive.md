# ドライブAPI

## `GET /drive`

自分がアップロードした画像のリストを取得します

### 入力

なし

### 出力

#### **`200 OK`**

```json
[
  {
    "id": "2938492384",
    "name": "image.jpeg",
    "author_id": "384880009940302",
    "hash": "nf9:e;g711*c@drgj55",
    "mime": "image/jpeg",
    "nsfw": false,
    "url": "https://images.example.com/image.jpeg",
    "thumbnail": "https://images.example.com/thumb-image.jpeg"
  }
]
```

| 項目名    | 型                    | 説明                                        | 制約          | 例 |
| --------- | --------------------- | ------------------------------------------- | ------------- | -- |
| id        | `snowflake`           | ファイルのID                                |               |    |
| name      | `string`              | ファイル名                                  | 1≤N≤256[文字] |    |
| author_id | `snowflake`           | アップロードしたアカウントのID              |               |    |
| hash      | `string`              | 画像のblurhash                              |               |    |
| mime      | `string`              | mimeタイプ                                  |               |    |
| nsfw      | `boolean`             | [NSFWフラグ](../endpoint.md#nsfwフラグ)     |               |    |
| url       | `string`              | 画像へのリンク                              |               |    |
| thumbnail | `string`, `undefined` | (利用可能な場合のみ) 縮小版のサムネイル画像 |               |    |

#### **`404 Not Found`**

```json
{
  "error": "TEST_ERROR_CODE"
}
```

- `FILE_NOT_FOUND`: ファイルが存在しません

## `POST /drive/`

添付ファイルをアップロードします

### 入力

- body: `multipart/form-data`

| 項目名 | 型                             | 説明                                                           | 制約          | 例                         |
| ------ | ------------------------------ | -------------------------------------------------------------- | ------------- | -------------------------- |
| name   | `string`                       | ファイル名拡張子が必須                                         | 1≤N≤256[文字] | `neko.png`, `箱根駅伝.mp3` |
| file   | (ファイルの実体)               | アップロードするファイル. アップロード可能なファイル種類は後述 | 1≤100 [MB]    |                            |
| nsfw   | `string` ( `"true", "false"` ) | [NSFWフラグ](../endpoint.md#nsfwフラグ)                        |               |                            |

<details>
<summary>アップロード可能なファイル種類(mimeタイプ) mimeタイプについて詳しくは [https://www.iana.org/assignments/media-types/media-types.xhtml](https://www.iana.org/assignments/media-types/media-types.xhtml) を参照</summary>

画像:

- `image/apng`
- `image/avif`
- `image/gif`
- `image/jpeg`
- `image/png`
- `image/webp`

音声、動画:

- `audio/wave` , `audio/wav`
- `audio/webm`
- `audio/mpeg`
- `video/mpeg`
- `video/webm`
- `audio/ogg`

</details>

### 出力

**`200 OK`**

アップロードが完了しました.

```json
{
  "id": "2938492384",
  "name": "image.jpeg",
  "author_id": "493094050",
  "hash": "nf9:e;g711*c@drgj55",
  "mime": "image/jpeg",
  "nsfw": false,
  "url": "https://images.example.com/image.jpeg",
  "thumbnail": "https://images.example.com/thumb-image.jpeg"
}
```

| 項目名    | 型                    | 説明                                        | 制約          | 例 |
| --------- | --------------------- | ------------------------------------------- | ------------- | -- |
| id        | `snowflake`           | ファイルのID                                |               |    |
| name      | `string`              | ファイル名                                  | 1≤N≤256[文字] |    |
| author_id | `snowflake`           | アップロードしたアカウントのID              |               |    |
| hash      | `string`              | 画像のblurhash                              |               |    |
| mime      | `string`              | mimeタイプ                                  |               |    |
| nsfw      | `boolean`             | [NSFWフラグ](../endpoint.md#nsfwフラグ)     |               |    |
| url       | `string`              | 画像へのリンク                              |               |    |
| thumbnail | `string`, `undefined` | (利用可能な場合のみ) 縮小版のサムネイル画像 |               |    |

**`400 Bad Request`**

```json
{
  "error": "TEST_ERROR_CODE"
}
```

- `FILE_SIZE_TOO_BIG`: ファイルサイズが大きすぎます
- `FILE_NAME_TOO_LONG`: ファイル名が長すぎます

## `DELETE /drive/{file_id}`

指定したファイルを削除します

> [!WARNING]
>
> ファイルを削除すると,紐付けられているすべてのノートに影響します.

### 入力

- パスパラメータ
  - `file_id`: `snowflake`
    - ファイルのID

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

- `FILE_NOT_FOUND`: ファイルが存在しません

## `GET /drive/{file_id}`

ファイルのメタ情報を取得します

### 入力

- パスパラメータ
  - `file_id`: `snowflake`
    - ファイルのID

### 出力

**`200 OK`**

```json
{
  "id": "2938492384",
  "name": "image.jpeg",
  "author_id": "384880009940302",
  "hash": "nf9:e;g711*c@drgj55",
  "mime": "image/jpeg",
  "nsfw": false,
  "url": "https://images.example.com/image.jpeg",
  "thumbnail": "https://images.example.com/thumb-image.jpeg"
}
```

| 項目名    | 型                    | 説明                                        | 制約          | 例 |
| --------- | --------------------- | ------------------------------------------- | ------------- | -- |
| id        | `snowflake`           | ファイルのID                                |               |    |
| name      | `string`              | ファイル名                                  | 1≤N≤256[文字] |    |
| author_id | `snowflake`           | アップロードしたアカウントのID              |               |    |
| hash      | `string`              | 画像のblurhash                              |               |    |
| mime      | `string`              | mimeタイプ                                  |               |    |
| nsfw      | `boolean`             | [NSFWフラグ](../endpoint.md#nsfwフラグ)     |               |    |
| url       | `string`              | 画像へのリンク                              |               |    |
| thumbnail | `string`, `undefined` | (利用可能な場合のみ) 縮小版のサムネイル画像 |               |    |

**`404 Not Found`**

```json
{
  "error": "TEST_ERROR_CODE"
}
```

- `FILE_NOT_FOUND`: ファイルが存在しません

## `PUT /drive/{file_id}`

ファイルの情報を変更します

> [!WARNING]
>
> 情報を変更すると、そのファイルが紐付けられているすべてのノートに影響します

### 入力

- パスパラメータ
  - `file_id`: `snowflake`
    - ファイルのID

- body: `application/json`

| 項目名 | 型        | 説明                                    | 制約 | 例 |
| ------ | --------- | --------------------------------------- | ---- | -- |
| nsfw   | `boolean` | [NSFWフラグ](../endpoint.md#nsfwフラグ) |      |    |

**入力例**

```json
{
  "nsfw": false
}
```

### 出力

**`200 OK`**

```json
{
  "id": "2938492384",
  "name": "image.jpeg",
  "author_id": "384880009940302",
  "hash": "nf9:e;g711*c@drgj55",
  "mime": "image/jpeg",
  "nsfw": false,
  "url": "https://images.example.com/image.jpeg",
  "thumbnail": "https://images.example.com/thumb-image.jpeg"
}
```

| 項目名    | 型                    | 説明                                        | 制約          | 例 |
| --------- | --------------------- | ------------------------------------------- | ------------- | -- |
| id        | `snowflake`           | ファイルのID                                |               |    |
| name      | `string`              | ファイル名                                  | 1≤N≤256[文字] |    |
| author_id | `snowflake`           | アップロードしたアカウントのID              |               |    |
| hash      | `string`              | 画像のblurhash                              |               |    |
| mime      | `string`              | mimeタイプ                                  |               |    |
| nsfw      | `boolean`             | [NSFWフラグ](../endpoint.md#nsfwフラグ)     |               |    |
| url       | `string`              | 画像へのリンク                              |               |    |
| thumbnail | `string`, `undefined` | (利用可能な場合のみ) 縮小版のサムネイル画像 |               |    |

**`404 Not Found`**

```json
{
  "error": "TEST_ERROR_CODE"
}
```

- `FILE_NOT_FOUND`: ファイルが存在しません

| 項目名    | 型                    | 説明                                        | 制約          | 例 |
| --------- | --------------------- | ------------------------------------------- | ------------- | -- |
| id        | `snowflake`           | ファイルのID                                |               |    |
| name      | `string`              | ファイル名                                  | 1≤N≤256[文字] |    |
| author_id | `snowflake`           | アップロードしたアカウントのID              |               |    |
| hash      | `string`              | 画像のblurhash                              |               |    |
| mime      | `string`              | mimeタイプ                                  |               |    |
| nsfw      | `boolean`             | [NSFWフラグ](../endpoint.md#nsfwフラグ)     |               |    |
| url       | `string`              | 画像へのリンク                              |               |    |
| thumbnail | `string`, `undefined` | (利用可能な場合のみ) 縮小版のサムネイル画像 |               |    |
