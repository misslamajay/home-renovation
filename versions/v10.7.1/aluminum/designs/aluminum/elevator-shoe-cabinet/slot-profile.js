// Reference fit only; this does not approve material, loads, machining or procurement.
export const slotReference=Object.freeze({
  maker:'MISUMI',model:'HFS6-3030',section:30,slotWidth:8,slotDepth:9,
  nominalPanelThickness:5,endClearance:1,clampThickness:3,
  source:'https://in.misumi-ec.com/vona2/detail/110302263130/',
  sectionSource:'https://us.misumi-ec.com/pdf/fa/2010/p2273.pdf',
  mountingSource:'https://us.misumi-ec.com/maker/misumi/mech/product/al/howto/',
  status:'计算基准；不是已确认采购型号或已批准下料尺寸'
});
export function slotFit(outerDepth,requestedPanelDepth){
  const p=slotReference,innerDepth=outerDepth-2*p.section,insertion=p.slotDepth-p.endClearance;
  if(!Number.isFinite(outerDepth)||innerDepth<=0)throw new RangeError('外深必须大于两根型材的合计宽度');
  const panelDepth=innerDepth+2*insertion,requested=requestedPanelDepth??panelDepth,requiredInsertion=(requested-innerDepth)/2;
  return Object.freeze({outerDepth,innerDepth,centerDistance:outerDepth-p.section,panelDepth,
    insertion,panelStart:p.section-insertion,panelEnd:outerDepth-p.section+insertion,
    requestedPanelDepth:requested,requiredInsertion,
    fits:requiredInsertion>0&&requiredInsertion<=insertion,
    outerForPanel:requested+2*p.section-2*insertion,
    outerForClear:requested+2*p.section});
}
