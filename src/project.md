# プロジェクト概要

<!-- toc -->

## プロジェクトの目標

**Misskey や Mastodon のアンチテーゼ. 高速で安全な ActivityPub 実装**

1. パフォーマンス重視

2. セキュリティ重視

3. ActivityPub 仕様の重視

## 実装方針

### パフォーマンス・セキュリティの強化

- Misskey や Mastodon よりも高速に動作する次世代の ActivityPub 実装.
- 各APIリクエストに対するレスポンスを始めとする タイムラインの読み込み, メディアのレスポンスなど.
- TypeScript での開発を行い, パフォーマンスの向上を図る.
  - TypeScript は JavaScript に比べて型安全性が高く, パフォーマンスが向上する.
- SQL Injection や XSS などセキュリティに関わる脆弱性が少ない. 見つかったとしてもすぐに修正できる仕組みづくり.
  - パスワードレスログイン, 2FA など.

### ActivityPub 実装の重視

- 無駄な機能は実装せずあくまで ActivityPub の実装として忠実に従う.
- MFM など特定の分散型ソフトウェアのみの実装に従わない. ただし Mastodon や Misskey などの主要実装が互いに実装している機能は実装する. (引用など)

### クライアント, App 周りのサポートの強化

- PWA は対応状況が酷い.
  - Chromium系ブラウザは軒並み対応しているが, Firefox や Safari は対応していない.
- ターゲットはモバイルユーザーが大半だと考え, Pulsate ではネイティブアプリとして iOS App, Android App をリリースする.
- ネイティブアプリと同様コミュニティが開発するサードパーティクライアントも尊重し, API リファレンスなどリソースを多く用意しコミュニティの開発を支援する.

### 開発手法の厳格化 / 改善

- semver (セマンティックバージョニング) に従い, 破壊的変更をなるべく少なくする. 破壊的変更が行われる場合は予めコミュニティに通告する.
- Rust のエディション方式を採用し, 同じエディション内では基本的に後方互換性を保つ.
  - エディションが切り替わる = リリース の切り替わり (メジャーバージョンアップ)
- またエディションをまたぐときには, そのエディションの変更点をまとめたガイドを提供したりスクリプトを提供することで, 既存のインスタンスを新しいエディションに対応させる手助けをする.
  - これは Rust の思想を受けたもの.

> Rust 1.0 のリリースでは、Rust のコア機能として「よどみない安定性」が提供されるようになりました。 Rust は、1.0 のリリース以来、いちど安定版にリリースされた機能は、将来の全リリースに渡ってサポートし続ける、というルールの下で開発されてきました。
>
> 一方で、後方互換でないような小さい変更を言語に加えることも、ときには便利です。 最もわかりやすいのは新しいキーワードの導入で、これは同名の変数を使えなくします。 例えば、Rust の最初のバージョンには `async` や `await` といったキーワードはありませんでした。 後のバージョンになってこれらを突然キーワードに変えてしまうと、例えば `let async = 1;` のようなコードが壊れてしまいます。
>
> 我々は、クレートを新しいエディションにアップグレードするのが簡単になるよう目指しています。 新しいエディションがリリースされるとき、我々は移行を自動化するツールも提供します。 このツールは、新しいエディションに適合させるために必要な小さな変更をコードに施します。 例えば、Rust 2018 への移行の際は、`async` と名のつく全てのものを、等価な生識別子構文である `r#async` へと書き換える、といった具合です。
>
> ref: [エディションとは? - Rust エディションガイド](https://doc.rust-jp.rs/edition-guide/editions/index.html)

### コミュニティの声を聞く

- 簡単に言えば Discord や GitHub Discussions の採用.
- バグ報告は基本的に **インスタンス管理者** , **ユーザー** から受けるのが多いと考えるため, Discord での報告も受け付ける. (GitHub Issues には Discord Bot を使ってうまく Import する)

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