# 装修与家居 DIY 设计

在线查看：**[移动电视架 V9 · 效果、三维与尺寸图](https://misslamajay.github.io/home-renovation/)**

材料与校验：**[在线清单及核对记录](https://misslamajay.github.io/home-renovation/materials.html)**，或[下载完整 Excel](https://misslamajay.github.io/home-renovation/downloads/tv-stand-v9-materials-audit.xlsx)。包含77项材料/组件、26类连接节点和20项校验。

**当前为询价核对版，暂不能直接下料。** 两根前斜撑与上层侧连接梁、830高侧托板共存在4处实体干涉；侧托板开孔边距需要修改，挂架接口、实际脚轮及紧固件规格仍待确认。当前三维仍保留V9布局，尚未修正这些问题，详细状态见核对记录。

当前收录：85 寸铝型材移动电视架 V9。透明粉色亚克力与桥梁拉线的客厅效果图、对应三维及尺寸图。后续装修和家居 DIY 方案可继续在这个仓库整理。

静态展示网页，包含客厅效果图、可旋转三维模型、正视图、侧视图、背视图、俯视图，以及设备层和双层净空的尺寸详图。材料页面同时列出型材定尺参考、拉线毛坯估算及待商家确认的连接节点。

整体设计外轮廓为 2400 × 800 × 1880 mm，电视按海信 85E7S-PRO 的 1890 × 1101 × 53 mm 外形表示。

## 查看

用浏览器打开 `index.html` 即可查看。网页所需的样式、绘图代码和模型包含在该文件中，效果图放在同目录的 `assets/` 内；无需安装依赖或登录 ChatGPT。

`materials.html` 可直接阅读材料与校验；`downloads/` 内的 Excel 保留完整表格、数量公式、筛选及商家填写栏。尚未核定的紧固件数量保持待定，不作零件下单数。

- 在“三维预览”中拖动旋转，滚轮或双指缩放。
- 使用“透视、正面、背面收纳、侧面、下部两层”切换角度。
- 取消“显示电视”和“背面收纳”可查看内部加强框架。
- 在“尺寸图”中查看六张带尺寸图纸，单位为毫米。
- 每位访客的视角和显示设置保存在自己的浏览器中，不会改变其他人的页面。

## 发布到 GitHub Pages

1. 创建一个用于展示的公开 GitHub 仓库，或使用已有、允许发布 Pages 的仓库。
2. 将本目录内的 `index.html`、`materials.html`、`assets/`、`downloads/`、`.nojekyll` 和 `README.md` 上传到仓库根目录，提交到 `main` 分支。不要把它们再包进一层文件夹。
3. 进入仓库 **Settings → Pages**。
4. 在 **Build and deployment** 中选择 **Deploy from a branch**。
5. 选择 **main** 分支、**/(root)** 文件夹，点击 **Save**。
6. 等待部署完成，复制 Pages 页面显示的站点网址发给别人即可。

本仓库地址为 `https://github.com/misslamajay/home-renovation`，默认站点地址为 `https://misslamajay.github.io/home-renovation/`。其他普通项目仓库的访问地址形式为 `https://<GitHub用户名>.github.io/<仓库名>/`，最终地址以 GitHub Pages 显示的结果为准。

已有仓库请先检查是否已有首页，避免覆盖现有网站。仓库默认分支不是 `main` 时，选择实际存放这些文件的分支。

GitHub 官方说明：

- https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site
- https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

## 更新

更新对应的网页和资源文件并提交即可，网址保持不变。材料变更需同步 `materials.html` 与 `downloads/` 内的 Excel。本项目没有构建步骤，也不需要 Node.js、服务端或访问密钥。

## 方案状态

V9 保留 V8 的加强框架，新增透明粉色亚克力与装饰拉线。拉线塔顶 740 mm，距电视下沿 30 mm；扇形拉线位于手办后侧。装饰拉线不计入承重，效果图用于观察外观，尺寸以三维和尺寸图中的数值为准。

已检查模型外轮廓、拉线避让、部分空间及设备取放路径；实际型材、连接件、挂架孔位、脚轮、亚克力开孔加工及实物承载、抗倾覆和地毯推行仍待核验。页面不作为可直接加工的零件图或成品承重认证。

此发布目录仅包含电视架网页，不包含其他家具设计、聊天记录或本机路径。
