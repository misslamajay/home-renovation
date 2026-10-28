# 住记 · 装修与铝型材设计

完整住记默认使用管理员入口；另提供只包含铝型材设计的公开分享版。

- [住记管理员完整预览](https://misslamajay.github.io/home-renovation/)
- [铝型材公开分享](https://misslamajay.github.io/home-renovation/aluminum/)
- [所有版本与下载](https://github.com/misslamajay/home-renovation/releases)
- [住记 · 移动电视支架基础框架](https://misslamajay.github.io/home-renovation/aluminum/?space=aluminum&project=mobile-tv-stand&view=foundation)
- [原独立移动电视架 V9](https://misslamajay.github.io/home-renovation/tv-stand.html)

## 版本与回退

| 版本 | 内容 | 定位 |
| --- | --- | --- |
| v10.7.1 | 修正三维图状态栏旧净深标注，加入可见文字回归检查；保留420/360总深与入槽核定 | `versions/v10.7.1/`、同名 Git 标签和 Release |
| v10.7.0 | 鞋柜无背板、左总深420/右360、净深360/300、入槽参考截面376/316与交互SVG | `versions/v10.7.0/`、同名 Git 标签和 Release |
| v10.6.0 | 鞋柜净深400/350、左下并排双凳、最新净高、18厚纵向隔板封隔交集归右、137根型材、独立分享入口 | `versions/v10.6.0/`、同名 Git 标签和 Release |
| v10.5.0 | 鞋柜门板到顶、横向侧挂灯箱、独立固定三格、凳子落地、133根型材尺寸 | `versions/v10.5.0/`、同名 Git 标签和 Release |
| v10.4.0 | 福马轮电视基础框架、800/1000深度比较、完整型材尺寸、鞋柜对开门与白色洞洞板、加密全屋灯光 | `versions/v10.4.0/`、同名 Git 标签和 Release |
| v10.3.0 | 电梯鞋柜九层净高、透明踢脚抽、500高换鞋凳、怪兽小屋灯箱；铝型材导航置顶 | `versions/v10.3.0/`、同名 Git 标签和 Release |
| v10.2.0 | 电梯鞋柜阴角框架、三维旋转与俯视和立面尺寸 | `versions/v10.2.0/`、同名 Git 标签和 Release |
| v10.1.1 | 电视支架整合发布，并修复管理员页首次加载过早点击解锁会刷新的问题 | `versions/v10.1.1/`、同名 Git 标签和 Release |
| v10.1.0 | 移动电视支架 V9 接入住记；铝型材空间支持镜柜与电视支架两个项目 | `versions/v10.1.0/`、同名 Git 标签和 Release |
| v10.0.1 | 管理员口令轮换、重新加密资料与原图、迁移在线草稿 | `versions/v10.0.1/`、同名 Git 标签和 Release |
| v10.0.0 | 住记完整管理员版、独立铝型材公开版、镜柜方案二展示净高400 | `versions/v10.0.0/`、同名 Git 标签和 Release |
| v9.0.0 | 原移动电视架 V9、材料页及 Excel | 原发布提交 `6fb048992c1a8216ebdc297fee2a54451fb9346e`，同名标签与 Release |

稳定入口指向当前版本；历史版本有独立路径、标签、更新记录、校验值和下载包。已发布的版本目录和标签不覆盖。回退时只修改稳定入口指向，不改写历史。`releases.json` 是版本索引，`CHANGELOG.md` 记录变更。

管理员口令轮换是安全例外：旧管理员线上入口、当前发布分支的旧密文及旧管理员下载包可停用；保留历史标签、公开展示和本机归档。v10.0.0的管理员线上入口已停用，改密不能撤回Git历史及已下载的旧副本。

## 访问范围

管理员输入口令后可查看全部居家空间、采购、待办、证据原图和铝型材设计。采购数据、原图及在线浏览器草稿使用 AES-256-GCM 加密，口令通过 PBKDF2-SHA-256 派生密钥，不发送到服务器，也不进入仓库。原图按需在浏览器中解密；锁定时移除完整页面、撤销原图临时地址并清除内存中的会话。

铝型材公开版只有设计导航、三维交互、尺寸说明和公开设计材料清单，不包含采购台账、完整原图、其他居家空间或管理员菜单。包括客厅镜柜方案二、福马轮电视基础框架及原V9、电梯鞋柜九层方案；鞋柜当前为无背板的红黄对开门方案，左下双凳并排落地和两个开放鞋格，转角纵隔板归右柜，保留横向侧挂“怪兽小屋”灯箱。入槽截面页以具体厂家数据作尺寸核定示意；主三维图仍保留18厚托梁层板对照。全屋灯光模块与完整参考原图在管理员解锁后通过临时资源载入。修改公开版网址参数不会获得管理员数据。公开版可以自由转发，无需 GitHub 账号。

这是站点的口令访问分级，**不是 GitHub 仓库的按目录权限或个人账号系统**。持有管理员口令的人具有相同的完整访问权限，不能逐人撤权。更换口令需要重新加密发布；旧版本若继续在线，旧口令仍能解锁旧版本，已下载的副本也不能撤回。仓库保留公开状态，私密内容以密文存储。

## 后续发布

日常先在本地制作和检查，在 Chrome 打开完整住记本地预览 `http://127.0.0.1:4173/` 供确认。用户明确确认当前版本可以发布后，才执行以下发布命令、推送 GitHub 和更新线上版本；制作过程中的尺寸确认或普通“继续”不自动触发发布。本地调整不必逐次建立正式发布版本。

设计优化也需提供可交互的本地预览；未确定的占地或结构取舍以保留原方案的候选预览呈现，明确标注尺寸和影响，不自动发布。

需要 Node.js、Git、GitHub CLI 和系统 `zip`。本机源台账和口令文件均在此公开仓库之外。

```sh
# 默认构建管理员完整版本，并同时生成铝型材公开版本。
npm run release -- --version 10.6.1 --source ../住记/Web --credentials ../住记/私密发布/admin-access.json
npm run release:check

# 审核构建及差异后提交；不得提交口令或源台账。
git add .
git commit -m "Release v10.6.1"
git tag -a v10.6.1 -m "住记 v10.6.1"
git push origin HEAD:main
git push origin v10.6.1
gh release create v10.6.1 .artifacts/v10.6.1/*.zip --verify-tag --title "住记 v10.6.1" --notes-file release-notes/v10.6.1.md
```

每次应先补充 `CHANGELOG.md` 与对应 `release-notes/` 文档，并保持版本号递增。构建拒绝覆盖带 Git 标签的版本；`--rebuild` 仅用于尚未标记、尚未发布的本地构建。管理员口令沿用本机凭证文件，不同版本之间的在线加密草稿可继续读取。管理员编辑保存在自己的浏览器，不会自动修改仓库中的发布台账；更新发布数据前需把最新台账放回本机源文件，或向构建命令传入 `--source-data` 指定导出的台账。

```sh
npm run preview
```

在 Chrome 中打开 `http://127.0.0.1:4175/home-renovation/` 查看完整发布预览。使用 HTTP(S) 地址，不能用 `file://` 打开。发布完成后提供完整线上预览地址，并在 Chrome 打开它。

`npm run release:login-check` 使用 Playwright 检查慢速脚本、延迟配置和配置请求失败后的登录重试。本机预览需先启动；可用 `ZHUJI_DEPLOY_TEST_URL` 指向线上地址，`ZHUJI_CREDENTIALS_FILE` 指定仓库外的本机凭证文件。检查不输出口令，测试截图与报告仅保存在被忽略的 `.qa/` 中。

## 文件

- `publishing/`：管理员解锁页、公开版及启动桥接模板。
- `scripts/build-release.mjs`：版本构建、加密、双版本输出和下载包。
- `scripts/check-release.mjs`：校验文件完整性和公开版内容隔离。
- `versions/`：固定版本，每版自带 `release.json` 与 `SHA256SUMS`。
- `tv-stand.html`、`materials.html`、`assets/`、`downloads/`：保留的电视架 V9 内容，旧版限制见 [原说明](./tv-stand-v9-readme.md)。

铝型材模型用于空间、构造及运动审阅，滑轨额定承重和整柜稳定性仍需按实物选型核算，不作为可直接加工或承重认证的图纸。

鞋柜独立公开预览（免登录）：https://misslamajay.github.io/home-renovation/shoe-cabinet/ 。每次发布随构建更新此入口；固定版本通过对应版本目录和 Release 查找。
