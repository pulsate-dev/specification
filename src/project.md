# プロジェクト概要

<!-- toc -->

## プロジェクトの目標

**高速で安全な ActivityPub 実装**

1. パフォーマンス重視

2. セキュリティ重視

3. ActivityPub 仕様の重視

## 実装方針

### パフォーマンス・セキュリティの強化

- Misskey や Mastodon よりも高速に動作する次世代の ActivityPub 実装.
  - 各APIリクエストに対するレスポンスを始めとするパフォーマンスの向上(タイムラインの読み込み,
    メディアのレスポンスなど).
- SQL Injection や XSS などのセキュリティに関わる脆弱性の発生可能性を減少させる.
  見つかったとしてもすぐに修正できる仕組みづくり.
  - パスワードレスログイン, 2FA など.

### ActivityPub 実装の重視

- 無駄な機能は実装せずあくまで ActivityPub の実装として忠実に従う.
- MFM など特定のソフトウェア固有の実装に従わない.
  - ただし, Mastodon や Misskey
    などの主要な実装が互いに実装している機能は実装する. (引用など)

### クライアント, App 周りのサポートの強化

- ターゲットはモバイルユーザーが大半だと考え, Pulsate ではネイティブアプリとして
  iOS App, Android App をリリースする(構想段階).
  - PWAはChromium系ブラウザは概ね対応しているが, Firefox や Safari
    は対応していない.
  - また、大部分のユーザーはアプリストアで検索すると考えられるため、マーケティング的な観点からもネイティブアプリの実装は必要.
- コミュニティが開発するサードパーティクライアントも尊重し, API
  リファレンスなどのリソースを多く用意しコミュニティの開発を支援する.

### 開発手法の厳格化 / 改善

- semver (セマンティックバージョニング) に従い, 破壊的変更をなるべく少なくする.
  破壊的変更が行われる場合は予めコミュニティに通告する.

### コミュニティの声を聞く

- 簡単に言えば Discord や GitHub Discussions の採用.
- バグ報告は基本的に **インスタンス管理者** , **ユーザー**
  から受けるのが多いと考えるため, Discord での報告も受け付ける. (GitHub Issues
  には Discord Bot を使ってうまく Import する)

## プロジェクトコードネーム

**Pulsate**

- 意味: 脈打つ, 鼓動する; 〈光･音などが〉振動する; ドキドキする; など.
- 由来: indigo la End のアルバム "PULSATE" から.

## バージョンコードネーム

<details>

<summary>v0, v1 - Antenna</summary>

v0 (開発途上バージョン), v1 (最初の安定版) のコードネーム.

由来は Mrs. GREEN APPLE の ANTENNA から.

<iframe width="560" height="315" src="https://www.youtube.com/embed/XiSa_VIrGKE?si=eJz-KfIBeFG_lrSw" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

</details>
