# 住记 · 装修与铝型材设计

完整住记默认使用管理员入口；另提供只包含铝型材设计的公开分享版。

- [住记管理员完整预览](https://misslamajay.github.io/home-renovation/)
- [铝型材公开分享](https://misslamajay.github.io/home-renovation/aluminum/)
- [所有版本与下载](https://github.com/misslamajay/home-renovation/releases)
- [旧版移动电视架 V9](https://misslamajay.github.io/home-renovation/tv-stand.html)

## 版本与回退

| 版本 | 内容 | 定位 |
| --- | --- | --- |
| v10.0.1 | 管理员口令轮换、重新加密资料与原图、迁移在线草稿 | `versions/v10.0.1/`、同名 Git 标签和 Release |
| v10.0.0 | 住记完整管理员版、独立铝型材公开版、镜柜方案二展示净高400 | `versions/v10.0.0/`、同名 Git 标签和 Release |
| v9.0.0 | 原移动电视架 V9、材料页及 Excel | 原发布提交 `6fb048992c1a8216ebdc297fee2a54451fb9346e`，同名标签与 Release |

稳定入口指向当前版本；历史版本有独立路径、标签、更新记录、校验值和下载包。已发布的版本目录和标签不覆盖。回退时只修改稳定入口指向，不改写历史。`releases.json` 是版本索引，`CHANGELOG.md` 记录变更。

管理员口令轮换是安全例外：旧管理员线上入口、当前发布分支的旧密文及旧管理员下载包可停用；保留历史标签、公开展示和本机归档。v10.0.0的管理员线上入口已停用，改密不能撤回Git历史及已下载的旧副本。

## 访问范围

管理员输入口令后可查看全部居家空间、采购、待办、证据原图和铝型材设计。采购数据、原图及在线浏览器草稿使用 AES-256-GCM 加密，口令通过 PBKDF2-SHA-256 派生密钥，不发送到服务器，也不进入仓库。原图按需在浏览器中解密；锁定时移除完整页面、撤销原图临时地址并清除内存中的会话。

铝型材公开版只有设计导航、三维交互和尺寸说明，不包含采购数据、原图、其他居家空间或管理员菜单。修改网址参数不会获得管理员数据。公开版可以自由转发，无需 GitHub 账号。

这是站点的口令访问分级，**不是 GitHub 仓库的按目录权限或个人账号系统**。持有管理员口令的人具有相同的完整访问权限，不能逐人撤权。更换口令需要重新加密发布；旧版本若继续在线，旧口令仍能解锁旧版本，已下载的副本也不能撤回。仓库保留公开状态，私密内容以密文存储。

## 后续发布

需要 Node.js、Git、GitHub CLI 和系统 `zip`。本机源台账和口令文件均在此公开仓库之外。

```sh
# 默认构建管理员完整版本，并同时生成铝型材公开版本。
npm run release -- --version 10.0.2 --source ../住记/Web --credentials ../住记/私密发布/admin-access.json
npm run release:check

# 审核构建及差异后提交；不得提交口令或源台账。
git add .
git commit -m "Release v10.0.2"
git tag -a v10.0.2 -m "住记 v10.0.2"
git push origin HEAD:main
git push origin v10.0.2
gh release create v10.0.2 .artifacts/v10.0.2/*.zip --verify-tag --title "住记 v10.0.2" --notes-file release-notes/v10.0.2.md
```

每次应先补充 `CHANGELOG.md` 与对应 `release-notes/` 文档，并保持版本号递增。构建拒绝覆盖带 Git 标签的版本；`--rebuild` 仅用于尚未标记、尚未发布的本地构建。管理员口令沿用本机凭证文件，不同版本之间的在线加密草稿可继续读取。管理员编辑保存在自己的浏览器，不会自动修改仓库中的发布台账；更新发布数据前需把最新台账放回本机源文件，或向构建命令传入 `--source-data` 指定导出的台账。

```sh
npm run preview
```

在 Chrome 中打开 `http://127.0.0.1:4175/home-renovation/` 查看完整发布预览。使用 HTTP(S) 地址，不能用 `file://` 打开。发布完成后提供完整线上预览地址，并在 Chrome 打开它。

## 文件

- `publishing/`：管理员解锁页、公开版及启动桥接模板。
- `scripts/build-release.mjs`：版本构建、加密、双版本输出和下载包。
- `scripts/check-release.mjs`：校验文件完整性和公开版内容隔离。
- `versions/`：固定版本，每版自带 `release.json` 与 `SHA256SUMS`。
- `tv-stand.html`、`materials.html`、`assets/`、`downloads/`：保留的电视架 V9 内容，旧版限制见 [原说明](./tv-stand-v9-readme.md)。

铝型材模型用于空间、构造及运动审阅，滑轨额定承重和整柜稳定性仍需按实物选型核算，不作为可直接加工或承重认证的图纸。
