const isAd = ($response.body || "").includes("\"ad_type\"");
if(isAd) {
  $done({body: JSON.stringify({code:0})}); // 拦截广告响应
} else {
  $done();
}
