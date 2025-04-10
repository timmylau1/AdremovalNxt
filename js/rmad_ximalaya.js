// 喜马拉雅动态广告检测脚本（Loon 3.2.1+）
// 功能：拦截信息流广告、VIP推广、开屏广告
const adKeywords = ["ad_type", "advert", "business-vip", "customCategories"];
const adPaths = ["/discovery-", "/business-vip", "/first/request/ts-"];

if (typeof $response !== "undefined") {
    // 解压gzip响应（需开启requires-body）
    let body = $response.body;
    if ($response.headers["Content-Encoding"] === "gzip") {
        body = $utils.ungzip(body);
    }
    
    try {
        const jsonData = JSON.parse(body);
        
        // 核心广告检测逻辑
        const isAdRequest = adPaths.some(path => $request.url.includes(path));
        const hasAdContent = JSON.stringify(jsonData).match(new RegExp(adKeywords.join("|"), "i"));
        
        if (isAdRequest || hasAdContent) {
            // 清除广告数据（保留UI结构防崩溃）
            const cleanData = {
                ...jsonData,
                data: jsonData.data?.filter(item => !item.hasOwnProperty("advertId")),
                config: null
            };
            
            // 重建响应体
            let newBody = JSON.stringify(cleanData);
            if ($response.headers["Content-Encoding"] === "gzip") {
                newBody = $utils.gzip(newBody);
            }
            
            $done({
                status: 200,
                headers: $response.headers,
                body: newBody
            });
        } else {
            $done({});
        }
    } catch (e) {
        console.log(`广告检测异常：${e}`);
        $done({});
    }
} else {
    $done({});
}
