import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';

const json=value=>JSON.stringify(value).replaceAll('<','\\u003c');
const mime=file=>({'.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp'})[path.extname(file)]||'application/octet-stream';
export async function buildPrivateResources(source,write,encrypt){
  const resources={};
  async function add(name,bytes,type){
    const resource='vault/'+crypto.randomBytes(16).toString('hex')+'.bin';
    await write(resource,encrypt(bytes,resource));
    resources[name]={path:resource,mime:type,sha256:crypto.createHash('sha256').update(bytes).digest('hex')};
  }
  const lighting=path.join(source,'designs/switch-panels');
  if(await fs.access(lighting).then(()=>true).catch(()=>false)){
    const manifest=JSON.parse(await fs.readFile(path.join(lighting,'manifest.json'),'utf8')),images={};
    for(const icon of manifest.icons){
      const file=path.resolve(lighting,manifest.assetBase,icon.file);
      assert(file.startsWith(lighting+path.sep));
      images[icon.file]='data:'+mime(file)+';base64,'+(await fs.readFile(file)).toString('base64');
    }
    let script=await fs.readFile(path.join(lighting,'panels.js'),'utf8');
    assert(script.includes("const response = await fetch('manifest.json');"));
    script=script.replace(/const response = await fetch\('manifest.json'\);[\s\S]*?manifest = await response.json\(\);/,'manifest = PRIVATE_MANIFEST;');
    const reference='${manifest.assetBase}/${encodeURIComponent(icon.file)}';
    assert(script.includes(reference));script=script.replaceAll(reference,'${PRIVATE_IMAGES[icon.file]}');
    script=script.replace(/document.body.classList.toggle\('embedded',[^\n]+/,'document.body.classList.add(\'embedded\');');
    let html=await fs.readFile(path.join(lighting,'index.html'),'utf8');
    for(const css of ['panels.css','summary.css'])html=html.replace('<link rel="stylesheet" href="'+css+'">','<style>'+(await fs.readFile(path.join(lighting,css),'utf8'))+'</style>');
    for(const match of html.matchAll(/(?:src|href)="([^"#]+\.png)"/g)){
      const file=path.resolve(lighting,match[1]);assert(file.startsWith(lighting+path.sep));
      html=html.replaceAll(match[1],'data:image/png;base64,'+(await fs.readFile(file)).toString('base64'));
    }
    html=html.replace('<script type="module" src="panels.js"></script>','<script>const PRIVATE_MANIFEST='+json(manifest)+';const PRIVATE_IMAGES='+json(images)+';\n'+script.replaceAll('</script','<\\/script')+'</script>');
    assert(!html.includes('src="panels.js"'));assert(!html.includes('href="panels.css"'));
    await add('lighting-page',Buffer.from(html),'text/html;charset=utf-8');
    let workspace=await fs.readFile(path.join(lighting,'workspace.js'),'utf8');
    assert(workspace.includes("const source = '/designs/switch-panels/index.html?embed=1';"));
    workspace=workspace.replace("const source = '/designs/switch-panels/index.html?embed=1';","const source = await window.ZhujiPrivate.url('lighting-page');");
    await add('lighting-workspace',Buffer.from(workspace),'text/javascript');
  }
  const original=path.join(source,'designs/aluminum/elevator-shoe-cabinet/assets/shoe-cabinet-reference.png');
  if(await fs.access(original).then(()=>true).catch(()=>false))await add('shoe-reference-original',await fs.readFile(original),'image/png');
  return resources;
}

export async function preparePublicDesigns(source,stage,previewFile,version='当前版'){
  const original='shoe-cabinet-reference.png';
  await fs.cp(path.join(source,'designs/aluminum'),path.join(stage,'aluminum/designs/aluminum'),{recursive:true,filter:file=>path.basename(file)!==original&&!path.basename(file).startsWith('.')});
  const shoe=path.join(stage,'aluminum/designs/aluminum/elevator-shoe-cabinet');
  for(const name of ['index.html','dimensions.html','storage-report.js','README.md']){
    const file=path.join(shoe,name);if(!await fs.access(file).then(()=>true).catch(()=>false))continue;
    let text=await fs.readFile(file,'utf8');
    text=text.replace(/本地调整 · ([^<\n]+)/g,'发布版 '+version+' · $1')
      .replace(/当前为本地调整 r(\d+)，尚未发布。/g,'当前为 '+version+' 发布方案（模型 r$1）。')
      .replaceAll('本地调整：','当前发布方案：').replaceAll('尚未发布','已发布')
      .replaceAll('本轮仍只更新本地，待当前候选明确确认后再发布。','当前方案已按本版确认发布。')
      .replaceAll('本地候选 · 灯箱改侧挂','发布版 '+version+' · 灯箱侧挂')
      .replaceAll('本地调整 · 上部有门，下部开放','发布版 '+version+' · 上部有门，下部开放')
      .replaceAll('仅更新本地住记，未发布。','住记 '+version+'。')
      .replaceAll('当前仅本地方案；','当前发布方案；').replaceAll('当前仅本地修改。','当前为 '+version+' 发布版。')
      .replaceAll('横向灯箱为本地暂定尺寸；','侧挂灯箱按当前方案示意；')
      .replaceAll('先按图片中左侧外角位置制作，尺寸与占地均为本地待确认候选：','当前发布方案采用左侧外角侧挂：')
      .replace(/^[^\n]*(?:设计归档\/|不作为发布授权)[^\n]*\n?/gm,'')
      .replaceAll('http://127.0.0.1:4173/','https://misslamajay.github.io/home-renovation/aluminum/');
    await fs.writeFile(file,text);
  }
  const rendering=path.join(shoe,'rendering.html');
  if(await fs.access(rendering).then(()=>true).catch(()=>false)){
    if(!previewFile)throw Error('鞋柜参考图需要不含截图界面的公开预览照片。');
    const preview=await fs.readFile(previewFile);assert(preview.subarray(0,8).toString('hex')==='89504e470d0a1a0a');
    await fs.copyFile(previewFile,path.join(shoe,'assets/shoe-cabinet-reference-preview.png'));
    let html=await fs.readFile(rendering,'utf8');
    html=html.replace(/<a class="original"[\s\S]*?<\/a>/,'<a class="original" id="private-reference" hidden target="_blank" rel="noopener">查看完整原图 ↗</a>');
    html=html.replaceAll(original,'shoe-cabinet-reference-preview.png').replace('transform:translateY(-12.3%)','transform:none');
    html=html.replace('</body>','<script src="./assets/private-reference.js"></script>\n</body>');
    await fs.writeFile(rendering,html);
    await fs.writeFile(path.join(shoe,'assets/private-reference.js'),`(async()=>{const owner=parent!==window&&parent.ZhujiPrivate;if(!owner)return;try{const link=document.getElementById('private-reference');link.href=await owner.url('shoe-reference-original');link.hidden=false;}catch{}})();\n`);
  }
}
