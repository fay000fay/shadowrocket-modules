/* Intercept known Bilibili splash endpoints before fetching ads. */
(function () {
  const match = /^https?:\/\/app\.bilibili\.com\/x\/v\d+\/splash\/(list|brand\/list|show|event\/list2)(?:[/?]|$)/i.exec($request.url);
  if (!match) return $done({});
  const data = {
    max_time: 0, min_interval: 31536000, pull_interval: 31536000,
    keep_ids: [], show: [], event_list: [], list: [],
    splash_request_id: ''
  };
  console.log('[BilibiliSplash 20261013-2] intercepted '+match[1]);
  $done({response:{status:200,headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'},body:JSON.stringify({code:0,message:'OK',ttl:1,data})}});
})();
