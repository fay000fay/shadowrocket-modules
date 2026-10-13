/* Adapted from user supplied RuCu6 amap.js (2026-03-09).
 * Preserves original cleanup; adds guards and the three supplied JSON rewrites.
 * URL matching is reconstructed from script branches, not the original plugin.
 */
(function () {
  try {
    const url = $request.url;
    if (typeof $response.body !== 'string' || !$response.body) return $done({});
    const obj = JSON.parse($response.body);
    function get(path) { return path.split('.').reduce((o, k) => o == null ? undefined : o[k], obj); }
    function set(path, value) {
      const keys = path.split('.'); const key = keys.pop(); const parent = keys.length ? get(keys.join('.')) : obj;
      if (parent && typeof parent === 'object') parent[key] = value;
    }
    function del(path) {
      const keys = path.split('.'); const key = keys.pop();
      const parent = keys.length ? get(keys.join('.')) : obj;
      if (parent && typeof parent === 'object') delete parent[key];
    }
    function remove(base, keys) { keys.split(/\s+/).filter(Boolean).forEach(k => del(base ? base + '.' + k : k)); }
    function clear(path, value) { if (get(path)) set(path, value); }
    function empty(path) { const a = get(path); if (Array.isArray(a) && a.length) set(path, []); }
    function filter(path, predicate) { const a = get(path); if (Array.isArray(a) && a.length) set(path, a.filter(predicate)); }
    function searchList(list) {
      if (!list || typeof list !== 'object') return;
      if (list.hookInfo && list.hookInfo.data) { delete list.hookInfo.data.header; delete list.hookInfo.data.house_info; }
      if (list.map_bottom_bar) delete list.map_bottom_bar.hotel;
      if (list.poi?.item_info?.tips_bottombar_button) delete list.poi.item_info.tips_bottombar_button.hotel;
      delete list.tips_operation_info;
      if (list.bottom?.bottombar_button) delete list.bottom.bottombar_button.hotel;
    }
    if (url.includes('/aos/perception/publicTravel/beforeNavi')) {
      ['bus_plan_bottom_event','bus_plan_bottom_tips','bus_plan_segment_event'].forEach(k => empty('data.common_data.'+k+'.data'));
      empty('data.front_end.assistant');
    } else if (url.includes('/boss/car/order/content_info')) {
      ['benefitsCard','popup','skin'].forEach(k => empty('data.lubanData.'+k+'.dataList'));
      ['c3DiversionCard','DiversionCard'].forEach(k => empty('data.matrixData.'+k+'.dataList'));
    } else if (url.includes('/boss/order_web/friendly_information')) {
      remove('data.105','banners carouselTips integratedBanners integratedTips skins skinAndTips tips');
    } else if (url.includes('/bus/plan/integrate')) {
      ['data.banner_lists.data','data.banner_lists.tips','data.mixed_plans.data.taxiPlans'].forEach(empty);
    } else if (url.includes('/c3frontend/af-hotel/page/main')) {
      remove('data.modules','CouponPortalCard CouponWidget recommended_list');
      del('data.modules.user_filter_card.data.search_button_data.rightbgText');
      remove('data.modules.user_filter_card.data','banner bannerList service_data sug_items_data');
    } else if (url.includes('/c3frontend/af-launch/page/main')) {
      clear('data.modules.C1EndNaviEngine.data',{});
    } else if (url.includes('/c3frontend/af-nearby/nearby')) {
      clear('data.modules.banner',{}); clear('data.modules.contentPoster',{});
    } else if (url.includes('/faas/amap-navigation/card-service-plan-home')) {
      filter('data.children',i => i != null && !Object.prototype.hasOwnProperty.call(i,'schema'));
    } else if (url.includes('/faas/amap-navigation/main-page')) {
      filter('data.cardList',i => ['ContinueNavigationCard','FrequentLocation','LoginCard'].includes(i?.dataKey));
      filter('data.mapBizList',i => i?.dataKey === 'FindCarVirtualCard');
    } else if (url.includes('/perception/drive/routeInfo') || url.includes('/perception/drive/routePlan')) {
      const planning = url.includes('/perception/drive/routePlan');
      remove('data.front_end',planning ? 'assistant global_guide_data route_search start_button_tips' : 'assistant');
      if (!planning) filter('data.front_end.guide_tips',i => i?.biz_type !== 'music');
      ['data.tbt.event','data.front_end.download'].forEach(p => filter(p,i => !/ads-\d+/.test(i?.dynamic_id_s)));
    } else if (url.includes('/promotion-web/resource')) {
      remove('data','alpha banner bravo bubble charlie icon other popup push tips');
    } else if (url.includes('/shield/dsp/profile/index/nodefaasv3')) {
      remove('data','tipData memberInfo topMixedCard');
      filter('data.cardList',i => i?.dataKey === 'MyOrderCard');
    } else if (url.includes('/shield/frogserver/aocs/updatable/')) {
      const keys = 'Naviendpage_Searchwords SplashScreenControl TipsTaxiButton amapCoin favorites_info feedback_banner footprint his_input_tip home_business_position_config hotel_activity hotel_fillin_opt hotel_loop hotel_tipsicon hotsaleConfig landing_page_info map_weather_switch maplayers navi_end nearby_business_popup nearby_map_entry_guide nearby_map_pull_down_guide operation_layer poi_rec preword route_banner routeresult_banner search_homepage search_keyword search_moni search_perf search_poi_recommend search_service_adcode search_word sportsGroupConfig sportsHealthConfig sportsHomeConfig sportsRouteConfig sportsTaskConfig sports_walk small_biz_b2b_kb small_biz_case small_biz_fun small_biz_index small_biz_news splashscreen splashview_config sur_bar taxi_activity testflight_adiu tf_remind tips_bar_black_list vip';
      keys.split(' ').forEach(k => clear('data.'+k,{status:1,version:'',value:''}));
    } else if (url.includes('/shield/search/common/coupon/info')) {
      clear('data',{});
    } else if (url.includes('/shield/search/nearbyrec_smart')) {
      filter('data.modules',i => ['head','search_hot_words','feed_rec'].includes(i));
    } else if (url.includes('/shield/search/poi/detail')) {
      del('data.modules.combineReviews.data.write_comment');
      remove('data.modules',`CouponBanner CouponPush adStoreBigBannerModule adv_compliance_info adv_gift bigListBizRec bottomDescription brand_service brand_shop_bar businessQualifications carServiceCard checkIn check_in cityCardFeed city_discount claim co_branded_card collector_guide commonAiAgent commonGoodsShelf commonHkfMiniPortal common_coupon_bar common_coupon_card comprehensiveEditEntrance contributor cpt_service_shop dayTripList discount_commodity divergentRecommendModule enhanceCustomerServiceFixedBottom enhanceCustomerServicePoiModule everyOneToSee feedback first_surround_estate_tab footer_tel_button ggc_entry hkfMiniPortal hkfCalendarRecommend horizontalGoodsShelf hospital_strategy hotPlay hot_new_house_estate hot_shop hotelCoupon hotelList hotelMustRead houseAgentService houseList houseOfficeBrandIntroduction houseOfficeInfo houseOfficeNotice houseOfficeService houseShelf house_apart_info house_buying_agent house_coupon house_cp_clues house_cpt_coupon house_cpt_grab house_price house_price_v2 house_rent_sale_agency image_banner kaMarketingCampaign kaProductMixServiceShelf ka_not_enter legSameIndustryRecEntrance legal_document listBizRec_1 listBizRec_2 matrix_banner merchantSettlement membership mini_hook_shelf movie_info multi_page_anchor nearbyGoodCar nearbyRecommendModule nearby_house nearby_new_house_estate nearby_office_estate nearby_old_sell_estate nearby_play_rec newGuest newRelatedRecommends new_operation_banner newsellhouse officerenthouse officesellhouse official_account official_account_hospital oldsellhouse operation_banner operator_card packageShelf parentBizRec parentPoiRecEntrance platformCustomerCommonModule platformCustomerComplianceInfo poiDetailBottomBar poiDetailBottomBarOperation poiDetailCommonConfig poiDetailNewBeltCardV2 poiDetailNewBeltV2 poiDetailWaterFeed poiDetailWaterFeedTitle poster_banner portal_entrance quickLink quickLinksPortal relatedRecommends renthouse rentSaleHouse rentsaleagencyv2 rentsaleagencyv3 rentsalehouse residentialOwners retainInfo reviews sameIndustryRecommendModule sameIndustry2RecommendModule scenic_coupon scenic_filter scenic_lifeservices scenic_mustplay scenic_play_guide scenic_recommend scenic_voice searchPlaMap second_surround_estate_tab service_shop shopBaseCase shopStdActivity shopStructGift shoppingMallEvent similarShelfRecommend similarShopRecommend smallListBizRec smallOrListBizRec societyPublicExperience subscription surroundHouseTab surroundOldSellHouse surroundRentHouse surround_facility surround_facility_new surround_house_tab surround_oldsellhouse surround_renthouse surround_rentoffice surround_selloffice thirdparty_info travelGuideRec uploadBar upload_bar verification waistRecEntrance waterFallFeed waterFallFeedTitle yellowPageAdRecommendModule`);
    } else if (url.includes('/shield/search_bff/hotword')) {
      empty('data.headerHotWord');
    } else if (url.includes('/shield/search_poi/search/sp') || url.includes('/shield/search_poi/mps')) {
      if (get('data.list_data')) {
        const list = get('data.list_data.content.0'); searchList(list);
        if (list && ((list.card?.card_id === 'SearchCardBrand' && list.item_type === 'brandAdCard') || (list.card?.card_id === 'NearbyGroupBuy' && list.item_type === 'toplist') || (list.card?.card_id === 'ImageBanner' && list.item_type === 'ImageBanner'))) delete list.card;
      } else if (get('data.district.poi_list')) {
        remove('data.district.poi_list.0','transportation feed_rec_tab');
      } else if (get('data.modules')) {
        searchList(get('data.modules.not_parse_result.data.list_data.content.0'));
        filter('data.modules.list_data.data.content',i => !['brandAdCard','toplist_al'].includes(i?.item_type));
      }
    } else if (url.includes('/shield/search_poi/sug')) {
      if (get('tip_list')) {
        filter('tip_list',i => !(['12'].includes(i?.tip?.datatype_spec) || ['ad','poi_ad','toplist'].includes(i?.tip?.result_type) || ['ad','exct_query_sug_merge_theme','query_sug_merge_theme','sp'].includes(i?.tip?.task_tag)));
      } else if (Array.isArray(obj?.city_list)) {
        obj.city_list.forEach(city => { if (Array.isArray(city?.tip_list)) city.tip_list = city.tip_list.filter(i => !(['12'].includes(i?.tip?.datatype_spec) || ['ad','poi_ad'].includes(i?.tip?.result_type))); });
      }
    } else if (url.includes('/shield/search_poi/tips_operation_location')) {
      del('data.coupon');
      remove('data.modules','belt common_float_bar common_image_banner coupon_discount_float_bar coupon_float_bar discount_coupon image_cover_bar mood_coupon_banner operation_brand promotion_wrap_card tips_top_banner');
    } else if (url.includes('/valueadded/alimama/splash_screen')) {
      if (Array.isArray(obj?.data?.ad)) obj.data.ad.forEach(item => {
        if (item?.set?.setting) item.set.setting.display_time = 0;
        if (item?.creative?.[0]) { item.creative[0].start_time = 3818332800; item.creative[0].end_time = 3818419199; }
      });
    }
    // Supplied Loon JSON rewrites use case-insensitive matching.
    if (/^https:\/\/m5\.amap\.com\/ws\/shield\/search_business\/process\/marketingOperationStructured\?/i.test(url)) remove('data','commonMaterial tipsOperationLocation resourcePlacement');
    if (/^https:\/\/m5\.amap\.com\/ws\/shield\/search_poi\/homepage\?/i.test(url)) del('history_tags');
    if (/^https:\/\/m5-zb\.amap\.com\/ws\/sharedtrip\/taxi\/order_detail_car_tips\?/i.test(url)) del('data.carTips.data.popupInfo');
    $done({body:JSON.stringify(obj)});
  } catch (error) {
    console.log('[Amap cleanup] Original response retained: '+String(error));
    $done({});
  }
})();
