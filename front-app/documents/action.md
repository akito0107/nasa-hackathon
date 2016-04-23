アクション周りのデータ要件を整理しました。

# アクションに関する要件

星をTap

1.モーダルが出る
モーダルに表示するもの

2.アクションをする
戦争してる感じ
hack => 相手の陣地だと攻撃できる。自分の陣地だと守りを強化できる。
星っぽいアクション

3.星を確保できる
確保したら星の色が変わる

# サーバ・クライアント共通のモデル

> 実際にはリスト形式だったり計算・結合した形でIFしたいので別途調整させてください。

## star

- id
- name (`${name} -` (nameが存在する場合) + `HIP: ${hip}`)
- description (`赤経 ${赤経}, 赤緯 ${赤緯} の星です`)
- lon
- lat

説明文は時間かかるなら削除。scoreとjoinして所有teamを求めるSQLがパフォーマンス悪ければこっちにカラム追加してロジックで同期。

## team

- id
- name

チームは `0:Not(White)`, `1:Earth(Blue)`, `2:Alien(Red)` の3つを想定。道などを緑で表示かな。
`0` を明記しているのはシステム都合で万が一必要になったときの予防策。

フロントでは定数扱い。DBでstarやscoreを管理するために使う。

## Score

- id
- star_id
- team_id
- count

星はいずれかのチームに属する（相手のスコアを0にした上で攻撃すると取り返せる）。星の状態はstar_idで絞り込む。チームの合計スコアはteam_idで絞り込んでsum。

# フロントのアクション

## 描画
- 戦況を掲示（teamのscore もしくは starのteam_idごとの数）
- 星を描画（lon/latで位置を指定、team_idで色を指定）
    - 現在値から一定範囲で取得？だとしたら要Indexだけど。

## 星をタップ
- starの各カラムを表示
    - name, description, score
    - team_idに応じて色を変える
- Hack（user_id/star_idの組み合わせをサーバにPOSTする）

## Hack
- Must
    - scoreを変更（自分のteam_idなら++, 相手のteam_idなら--）
- Want
    - なんか攻撃している！感を描画
    - starのteam_idが変わったら変わったぞ！感を描画

※テキストデータでかつ容量大きめになるようなら要zipか

# WebAPIのIF

- RESTfulではなく画面描画のために1コールで呼べるIFとする
- 緯度経度は 10進法 `135.6733223` を利用
- starの `name` `description` は上記モデルの形式を想定する

## /main

### リクエスト
- get
    - lon
    - lat

※サーバサイド：絞り込む範囲は後で数字をいじれるようにしてほしいっす（TODO: 画面を見ながら最終調整）

### レスポンス
- response (オブジェクト)
    - stars (配列) > star (オブジェクト)
        - id
        - lon
        - lat
        - team_id (所有チーム: scoreとjoinして絞り込む)
    - scores (オブジェクト)
        - blue_score (team_idで絞り込んだscoreの合算)
        - red_score (team_idで絞り込んだscoreの合算)

## /star

### リクエスト
- get
    - id

### レスポンス
- response (オブジェクト)
    - star (オブジェクト)
        - id
        - name
        - description
        - lon
        - lat
        - team_id (所有チーム: scoreとjoinして絞り込む)

## /hack

### リクエスト
- post
    - team_id
    - star_id
    - lon
    - lat

### レスポンス
- response (オブジェクト)
    - change (このPOSTで所有チームが変更したかどうか true/false で返す)
    - stars (配列) > star (オブジェクト)
        - id
        - lon
        - lat
        - team_id (所有チーム: scoreとjoinして絞り込む)
    - scores (オブジェクト)
        - blue_score (team_idで絞り込んだscoreの合算)
        - red_score (team_idで絞り込んだscoreの合算)

change以外はmainと同じレスポンス（再描画に使う）
