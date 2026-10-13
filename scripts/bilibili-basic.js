/* Shadowrocket JSON-only adaptation.
 * Sources: user supplied rewrites and kokoryh/Sparkle JSON live handlers.
 * Excludes gRPC, SponsorBlock, unavailable kelee jq layouts, VIP status edits.
 */
(function () {
  try {
    const path = new URL($request.url).pathname;
    function reply(body) {
      const headers = Object.assign({}, $response.headers);
      Object.keys(headers).forEach(k => { if (/^(content-length|content-encoding|content-type)$/i.test(k)) delete headers[k]; });
      headers['Content-Type'] = 'application/json; charset=utf-8';
      $done({status:200,headers,body:JSON.stringify(body)});
    }
    if (/^\/x\/v2\/splash\/list$/i.test(path)) return reply({code:0,message:'OK',ttl:1,data:{max_time:0,min_interval:31536000,pull_interval:31536000,keep_ids:[],show:[],list:[{}],splash_request_id:''}});
    if (/^\/pgc\/activity\/deliver\/material\/receive$/i.test(path)) return reply({code:0,data:{closeType:'close_win',container:[],showTime:''},message:'success'});
    if (/^\/x\/(resource\/(top\/activity|patch\/tab(\/v2)?)|v2\/search\/square|vip\/ads\/materials)$/i.test(path)) return reply({code:-404,message:'-404',ttl:1,data:null});
    if (typeof $response.body !== 'string' || !$response.body) return $done({});
    const obj = JSON.parse($response.body), data = obj?.data;
    if (!data || typeof data !== 'object') return $done({});
    if (/^\/x\/v2\/splash\/(show|event\/list2)$/i.test(path)) {
      ['show','event_list'].forEach(k => { if (Object.prototype.hasOwnProperty.call(data,k)) data[k]=[]; });
    } else if (/^\/x\/v2\/feed\/index$/i.test(path)) {
      if (Array.isArray(data.items)) data.items = data.items.filter(i => i && i.banner_item == null && i.ad_info == null && i.card_goto === 'av' && ['small_cover_v2','large_cover_single_v9','large_cover_v1'].includes(i.card_type));
    } else if (/^\/pgc\/page\/channel$/i.test(path)) {
      if (Array.isArray(data.modules)) data.modules = data.modules.filter(i => i?.type !== 'TIP').map(i => {
        if (i?.type === 'BANNER' && Array.isArray(i.module_data?.items)) i.module_data.items = i.module_data.items.filter(x => typeof x?.url !== 'string' || !x.url.startsWith('https://www.bilibili.com/blackboard/era/'));
        return i;
      });
    } else if (/^\/x\/pd-proxy\/tracker$/i.test(path)) {
      Object.keys(data).forEach(k => { const group=data[k]; if (group && typeof group==='object') Object.keys(group).forEach(j => { group[j]='stun.chat.bilibili.com:3478'; }); });
    } else if (/^\/xlive\/open-interface\/v2\/tracker\/conf$/i.test(path)) {
      data.domains=['wss://tracker.chat.bilibili.com'];
    } else if (/^\/x\/resource\/show\/skin$/i.test(path)) {
      delete data.common_equip;
    } else if (/^\/xlive\/app-interface\/v2\/index\/feed$/i.test(path)) {
      if (Array.isArray(data.card_list)) data.card_list=data.card_list.filter(i => !['banner_v2','activity_card_v1'].includes(i?.card_type));
    } else if (/^\/xlive\/app-room\/v1\/index\/getInfoByRoom$/i.test(path)) {
      data.big_card_info=null; data.show_reserve_status=false;
      if (data.reserve_info) data.reserve_info.show_reserve_status=false;
      if (data.shopping_info) data.shopping_info.is_show=0;
      ['activity_banner_info','function_card'].forEach(k => { if(data[k] && typeof data[k]==='object') Object.keys(data[k]).forEach(j => {data[k][j]=null;}); });
      const tab=data.new_tab_info;
      if(tab){
        if(Array.isArray(tab.outer_list)) tab.outer_list=tab.outer_list.filter(i => i?.biz_id!==33);
        if(Array.isArray(tab.candidate_list) && Array.isArray(tab.v2_outer_list)){
          const ids=[33,36,162,186]; tab.candidate_list=tab.candidate_list.filter(i=>!ids.includes(i?.biz_id));
          tab.v2_outer_list.forEach(i=>{if(Array.isArray(i?.indices))i.indices=i.indices.filter(id=>!ids.includes(id));});
        }
      }
    } else if (/^\/xlive\/app-room\/v1\/index\/getInfoByUser$/i.test(path)) {
      delete data.play_together_info; delete data.play_together_info_v2;
      if(data.function_card && typeof data.function_card==='object') Object.keys(data.function_card).forEach(k=>{data.function_card[k]=null;});
    }
    $done({body:JSON.stringify(obj)});
  } catch(error) { console.log('[Bilibili basic] Original response retained: '+String(error)); $done({}); }
})();
