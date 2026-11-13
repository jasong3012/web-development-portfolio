/* Shared behaviour for Version B pages: project data, cards, detail dialog, menu and theme.
   Loaded at the end of <body>. Pages set <html data-base="../../"> when they live in a subfolder. */
(function(){
  'use strict';
  var BASE=document.documentElement.getAttribute('data-base')||'';
  /* grids load small *-card.webp covers; the dialog loads the full image */
  function thumb(src){return src.replace(/\.webp$/,'-card.webp')}
  function esc(s){return String(s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
  var PROJECTS=[
    {name:'Electrolux (Sweden)',kicker:'Enterprise · Ecommerce · EU',featured:true,url:'https://www.electrolux.se/discover/saphirmatt-induction-hobs/',img:BASE+'assets/images/elx-eu-web-dev-mockup.webp',
     summary:'A product-discovery landing page for the SaphirMatt induction hob range on Electrolux\'s Swedish ecommerce site, with full-width video storytelling and an enterprise personalization and analytics stack.',
     features:['Full-width layout','Minimal','Videos','Ecommerce','Blog'],integrations:['Contentsquare','Microsoft Clarity','Facebook Pixel','TikTok Pixel','Instana'],plugins:['Dynamic Yield','Genesys Cloud','Qualtrics'],fonts:['Noto Sans']},
    {name:'Electrolux (Taiwan)',kicker:'Enterprise · Ecommerce · APAC',url:'https://www.electrolux.com.tw/blog/wet-cleaning-range/',img:BASE+'assets/images/elx-apac-web-dev-mockup.webp',
     summary:'A wet-cleaning range content page for Electrolux Taiwan, built on the same enterprise platform and localized for the APAC market.',
     features:['Full-width layout','Minimal','Videos','Ecommerce','Blog'],integrations:['Contentsquare','Microsoft Clarity','Facebook Pixel','TikTok Pixel','Instana'],plugins:['Dynamic Yield','Genesys Cloud','Qualtrics'],fonts:['Noto Sans']},
    {name:'Seven Peaks Software',kicker:'B2B · Software consultancy',url:'https://sevenpeakssoftware.com/',img:BASE+'assets/images/sps-web-dev-mockup.webp',
     summary:'The corporate site for a Bangkok software consultancy, with lead-capture forms connected to the CRM, product analytics and automated document generation.',
     features:['Full-width layout','Minimal','Sliders','Icons','Blog'],integrations:['Mixpanel','Google Analytics','Microsoft Clarity','Albacross','Facebook Pixel'],plugins:['Mailchimp','Zapier','Pipedrive','Google Sheets','Form Submission PDF Generator','LitePics'],fonts:['Lora','Source Sans Pro']},
    {name:'Morphosis',kicker:'Agency · SEO services',url:'https://morphos.is/services/seo-company-in-bangkok',img:BASE+'assets/images/mph-web-dev-mockup.webp',
     summary:'An SEO services page for a Bangkok digital agency, built on a headless CMS and optimized for search and conversion rate, with internationalization and redirect management.',
     features:['Whitespace','Minimal','SEO-optimized','Conversion-rate optimized','Blog'],integrations:['Mixpanel','Google Analytics','Google Tag Manager','Google Font API','Microsoft Clarity','Hotjar','Facebook Pixel','Clutch widget'],plugins:['Media Library','REST Cache','Content Manager','Publisher','Email','Redirects','Internationalization','SEO'],fonts:['Poppins']},
    {name:'UpPass',kicker:'SaaS · Identity verification',url:'https://www.uppass.io/blog/',img:BASE+'assets/images/upp-web-dev-mockup.webp',
     summary:'An SEO-focused blog for an identity-verification SaaS, optimized for email sign-ups, with embedded video and consent management.',
     features:['Whitespace','YouTube embeds','SEO-optimized','Email sign-up optimized','Blog'],integrations:['Google Analytics','Hotjar','LinkedIn Insight Tag','CookieHub','Keen Slider','Lodash','Priority Hints'],plugins:['Yoast SEO','Jetpack','Recent Posts Widget With Thumbnails'],fonts:['Sans-serif']},
    {name:'Vincent Clinic',kicker:'Healthcare · Clinic',url:'https://vincent.clinic/en',img:BASE+'assets/images/clinic-web-dev-mockup.webp',
     summary:'A website for a medical and aesthetics clinic, combining animated sliders and video with SEO and performance tuning through WP Rocket and priority hints.',
     features:['Full-width layout','Sliders','Animations','Videos','SEO-optimized','Blog'],integrations:['YouTube','Google Analytics','Google Tag Manager','Microsoft Clarity','Facebook Pixel','Ahrefs','Webpack','Priority Hints'],plugins:['Yoast SEO','WPCode','WP Rocket'],fonts:['Sans-serif']},
    {name:'Solar Hash',kicker:'Web3 · Prototype',prototype:true,img:BASE+'assets/images/solarhash-web-dev-mockup.webp',
     summary:'A prototype landing page for a Web3 project, with animated sections, sliders and Web3 wallet integration.',
     features:['Full-width layout','Sliders','Animations','Minimal','Icons','Web3 wallet integration'],integrations:[],plugins:[],fonts:['Inter']}
  ];
  function card(p,i,inTabs){
    var tags=p.features.slice(0,4).map(function(f){return '<span class="tag">'+esc(f)+'</span>'}).join('');
    return '<button class="work-card'+(inTabs?'':' reveal')+(p.featured&&!inTabs?' is-featured':'')+'" type="button" data-project="'+i+'">'+
      '<div class="work-visual"><img src="'+thumb(p.img)+'" alt="'+esc(p.name)+' website shown on desktop and mobile" width="720" height="400" loading="lazy" decoding="async"></div>'+
      '<div class="work-body"><span class="work-fig"><b>FIG. 2.'+(i+1)+'</b> · '+esc(p.kicker)+'</span>'+(p.prototype?'<span class="badge">Prototype</span>':'')+
      '<h3>'+esc(p.name)+'</h3><p>'+esc(p.summary)+'</p><div class="tags">'+tags+'</div>'+
      '<span class="work-cta"><span>View stack &amp; details</span><span aria-hidden="true">→</span></span></div></button>';
  }
  var IMG=BASE+'assets/images/disciplines/';
  function im(f){return IMG+f+'.webp'}
  function tt(handle,id,kind){return {t:'TikTok '+kind,u:'https://www.tiktok.com/@'+handle+'/'+(kind==='carousel'?'photo':'video')+'/'+id}}
  var TABS=[
    {id:'web-development',label:'Web development',projects:true},
    {id:'web-analytics',label:'Web analytics',intro:'Custom-built, automated dashboards that integrate GA4 and Google Search Console to reveal traffic sources, user behaviour and key events, so website improvements are backed by data.',items:[
      {name:'Custom Website Analytics Dashboard for eKYC Platform',kicker:'Looker Studio · GA4 · Search Console',summary:'Automated dashboards for an eKYC platform covering website analytics, Search Console performance and acquisition channels.',imgs:[im('looker-dashboard-ekyc-tech-client-web-analytics-edited'),im('looker-dashboard-ekyc-tech-client-search-console-analytics-edited'),im('looker-dashboard-ekyc-tech-client-web-acquisition-analytics-edited')],tags:['GA4','Search Console','Looker Studio','Acquisition']},
      {name:'Web Analytics Dashboard for B2B Roofing Product Manufacturer',kicker:'Looker Studio · GA4',summary:'A website analytics dashboard for a B2B roofing product manufacturer, giving clear visibility of traffic and user behaviour.',imgs:[im('looker-dashboard-roof-manufacturing-store-client-web-analytics-edited')],tags:['GA4','Looker Studio','B2B']},
      {name:'Real-Time Web Traffic Dashboard for Personal Portfolio Site',kicker:'Looker Studio · GA4',summary:'A real-time traffic dashboard for my own portfolio site, used to understand visitor behaviour and improve performance.',imgs:[im('looker-dashboard-portfolio-web-analytics-edited')],tags:['GA4','Real-time','Looker Studio']}]},
    {id:'seo-performance',label:'SEO Performance',intro:'On-page and off-page SEO strategies, with high-quality website enhancements that help businesses climb the search results and grow organic visibility.',items:[
      {name:'International Software Consultancy',kicker:'SEO case study · Software',summary:'Elevating SEO for tech titans.',imgs:[im('seo-for-software-house')],tags:['On-page SEO','Off-page SEO']},
      {name:'Thailand’s Largest Clinic',kicker:'SEO case study · Healthcare',summary:'Prescribing SEO excellence for a beauty haven.',imgs:[im('seo-for-large-clinic')],tags:['On-page SEO','Off-page SEO']},
      {name:'Digital Design Agency',kicker:'SEO case study · Agency',summary:'Crafting SEO brilliance for a creative hub.',imgs:[im('seo-for-design-agency')],tags:['On-page SEO','Off-page SEO']},
      {name:'E-Bike Retailer',kicker:'SEO case study · Retail',summary:'Energizing SEO success for a pedal powerhouse.',imgs:[im('seo-for-bike-company')],tags:['On-page SEO','Off-page SEO']},
      {name:'Crypto Wallet & Broker',kicker:'SEO case study · Fintech',summary:'Amplifying SEO triumph for a crypto oasis.',imgs:[im('seo-for-crypto-firm')],tags:['On-page SEO','Off-page SEO']},
      {name:'Multi-national Automotive',kicker:'SEO case study · Automotive',summary:'Accelerating SEO for an automotive giant.',imgs:[im('seo-for-automotive-company')],tags:['On-page SEO','Off-page SEO']}],
     foot:{title:'Full case studies',links:[{t:'Vincent Clinic full case study',u:'https://morphos.is/our-work/vincent-clinic-case-study'},{t:'Bitkub case study and testimonial',u:'https://sevenpeakssoftware.com/case-studies/bitkub-seo'},{t:'Beameo written case study',u:'https://morphos.is/our-work/beameo-case-study'}]}},
    {id:'automation',label:'Automated Workflows',intro:'Low-code workflow automations with n8n and Make.com that connect APIs, handle webhooks and integrate with platforms like Airtable, Supabase and Pipedrive, cutting repetitive work so teams move faster.',items:[
      {name:'Smart Web Scraping & AI Email Personalization Flow',kicker:'Make.com · AI',summary:'Scrapes website text and uses AI to personalise outreach emails automatically.',imgs:[im('makedotcom-web-text-parser-for-email-outreach')],tags:['Make.com','Web scraping','AI','Email outreach']},
      {name:'Google Maps Places + Coordinates Auto-Fetch Workflow',kicker:'Google Maps API',summary:'Automatically fetches places and their coordinates from Google Maps for use in downstream workflows.',imgs:[im('google-maps-api-workflow'),im('google-maps-api-geo-location-workflow-items')],tags:['Google Maps API','Geolocation','Automation']},
      {name:'Gemini AI Agent: Smart Website Lookup & Company Data Enrichment',kicker:'n8n · Gemini',summary:'An AI agent that looks up company websites and enriches company data, with token usage kept efficient.',imgs:[im('n8n-get-website-url'),im('n8n-get-website-url-process'),im('gemini-api-smart-token-optimization')],tags:['n8n','Gemini API','AI agent','Data enrichment']},
      {name:'Automated Lead Email Discovery & Personalization with Hunter.io',kicker:'n8n · Hunter.io',summary:'Finds lead email addresses with Hunter.io and personalises the outreach automatically.',imgs:[im('n8n-hunter-lead-gen-machine')],tags:['n8n','Hunter.io','Lead generation']},
      {name:'Veo 3 + Postiz: Automated AI Video Generation & Scheduled Posting',kicker:'n8n · Veo 3 · Postiz',summary:'Generates short AI videos with Veo 3 and schedules them for posting with Postiz.',imgs:[im('n8n-reels-factory')],tags:['n8n','Veo 3','Postiz','Social scheduling']}]},
    {id:'chatbot-development',label:'AI Chatbots',intro:'Conversational AI chatbots and voice agents. Case studies are on the way.',placeholders:[{name:'AI chatbot case study',kicker:'Chatbot'},{name:'Voice agent case study',kicker:'Voice agent'}]},
    {id:'ai-content-creation',label:'AI Content Creation',intro:'AI-powered visual storytelling for social media: short videos and image carousels made with prompt engineering and a creative eye, built to educate, entertain and inspire.',items:[
      {name:'Stable Diffusion + Flux Portfolio',kicker:'ComfyUI · Stable Diffusion · Flux',summary:'Ghost Diffusion: a showcase of AI-generated visuals and the ComfyUI workflows behind them.',imgs:[im('ghostdiffusion-home')],url:'https://ghostdiffusion.com/',cta:'Visit Ghost Diffusion',tags:['ComfyUI','Stable Diffusion','Flux']},
      {name:'Mentality Fuel',kicker:'TikTok series · @maker.jason',summary:'Bold ideas, brought to life through animated visual storytelling.',poster:{play:true},url:'https://www.tiktok.com/@maker.jason',cta:'View on TikTok',tags:['TikTok','AI video','Carousels'],
       links:[tt('maker.jason','7505408880390737153','carousel'),tt('maker.jason','7510948490520923413','carousel'),tt('maker.jason','7511372418280099079','video'),tt('maker.jason','7514636546146913556','video'),tt('maker.jason','7515066387463720213','video'),tt('maker.jason','7516160502561574145','carousel')]},
      {name:'Historic POVs',kicker:'TikTok series · @era.eyes',summary:'Immersive historical experiences you won’t find in textbooks.',poster:{play:true},url:'https://www.tiktok.com/@era.eyes',cta:'View on TikTok',tags:['TikTok','AI video','Storytelling'],
       links:[tt('era.eyes','7494988284473494802','video'),tt('era.eyes','7497995605860470017','video'),tt('era.eyes','7503150654400089361','video'),tt('era.eyes','7508377329337371924','video')]}]},
    {id:'creative-assets',label:'Creative Assets',intro:'Visual and written content across social media, email marketing automation and video, plus full-length articles published on the web.',items:[
      {name:'Social Media Content',kicker:'Social graphics · Animation',summary:'Graphics and animated visuals created and shared across social media platforms.',imgs:['software-company-social-media-posts','aws-social-media-post-compressed','tour-guide-social-media-post','real-estate-company-social-media-post-3','real-estate-company-social-media-post-4','real-estate-company-social-media-post-1','real-estate-company-social-media-post-2','software-company-social-media-posts-2','education-agency-social-media-post-2','education-agency-social-media-post-1','education-agency-social-media-post-3'].map(im),tags:['Social media','Animation','Design']},
      {name:'Email Marketing Automation Campaigns',kicker:'HubSpot · MoEngage',summary:'Email marketing automation flows with carefully crafted templates for personalised content.',imgs:['hubspot-marketingautomation-flow','moengage-marketing-automation','software-email-flow-1','meeting-tech-email-flow-1','software-email-flow-2','meeting-tech-email-flow-3'].map(im),tags:['Email automation','HubSpot','MoEngage']},
      {name:'Video Edits',kicker:'Premiere Pro',summary:'Video editing work, mostly done in Premiere Pro.',imgs:[im('youtube-cpxtc_7qokc')],url:'https://www.youtube.com/watch?v=cpxTC_7qOKc',cta:'Watch on YouTube',tags:['Premiere Pro','Video editing'],
       links:[{t:'YouTube video',u:'https://www.youtube.com/watch?v=cpxTC_7qOKc'},{t:'Seven Peaks Software video (Facebook)',u:'https://www.facebook.com/sevenpeakssoftware/videos/654752008581402/'},{t:'Seven Peaks Software video (Facebook)',u:'https://www.facebook.com/sevenpeakssoftware/videos/949246965524354/'},{t:'Seven Peaks Software video (Facebook)',u:'https://www.facebook.com/sevenpeakssoftware/videos/597554811186111/'}]},
      {name:'Written Blog Articles',kicker:'Copywriting · SEO',summary:'Full-length articles and landing page copy published on the web.',poster:{list:true},tags:['Copywriting','SEO','B2B'],
       links:[{t:'Improving User Experience with Gen AI File Upload Tools',u:'https://www.uppass.io/blog/gen-ai-file-upload-guide/'},{t:'How to Upload Files using JavaScript - Simplified',u:'https://www.uppass.io/blog/upload-files-using-javascript/'},{t:'Web Form vs. API: Which is Best for Seamless File Uploads?',u:'https://www.uppass.io/blog/webform-or-api-for-uploading-files/'},{t:'Full Landing Page: Award-winning SEO Service Provider',u:'https://morphos.is/services/seo-company-in-bangkok'},{t:'What Web Designers Should Know About Search Engine Optimization',u:'https://morphos.is/blog/what-product-designers-need-to-know-about-search-engine-optimization'},{t:'Understanding the Build, Measure, Learn Model for Software Development',u:'https://sevenpeakssoftware.com/blog/build-measure-learn-model-for-software-development/'},{t:'In-house Recruitment Vs Agency: How to Maximize your ROI with Both!',u:'https://sevenpeakssoftware.com/blog/in-house-recruitment-vs-agency/'},{t:'IT Outsourcing Trends to Know (That are still relevant in 2024)',u:'https://sevenpeakssoftware.com/blog/reasons-for-outsourcing-it-services/'}]}]},
    {id:'games',label:'Browser Games',intro:'Small games that run right in the browser. Projects coming soon.',placeholders:[{name:'Browser game',kicker:'Game'},{name:'Browser game',kicker:'Game'}]}
  ];
  function linkList(links){return links.map(function(l){return '<li><a href="'+esc(l.u)+'" target="_blank" rel="noopener noreferrer"><span>'+esc(l.t)+'</span><span aria-hidden="true">↗</span></a></li>'}).join('')}
  function itemCard(it,n,t,k){
    var vis;
    if(it.poster&&it.poster.list){vis='<div class="work-visual poster"><ul>'+it.links.slice(0,4).map(function(l){return '<li>'+esc(l.t)+'</li>'}).join('')+'</ul><i>'+it.links.length+' published pieces</i></div>'}
    else if(it.poster){vis='<div class="work-visual poster"><span class="play" aria-hidden="true"></span><i>'+esc(it.kicker)+'</i><b>'+esc(it.name)+'</b></div>'}
    else{vis='<div class="work-visual"><img src="'+thumb(it.imgs[0])+'" alt="'+esc(it.name)+'" loading="lazy" decoding="async"></div>'}
    var tags=(it.tags||[]).slice(0,4).map(function(f){return '<span class="tag">'+esc(f)+'</span>'}).join('');
    var more=it.imgs&&it.imgs.length>1?' · '+it.imgs.length+' images':'';
    return '<button class="work-card" type="button" data-item="'+t+':'+k+'">'+vis+'<div class="work-body"><span class="work-fig"><b>FIG. 0.'+n+'</b> · '+esc(it.kicker)+more+'</span><h3>'+esc(it.name)+'</h3><p>'+esc(it.summary)+'</p><div class="tags">'+tags+'</div><span class="work-cta"><span>View details</span><span aria-hidden="true">→</span></span></div></button>';
  }
  function phCard(ph,n){return '<div class="work-card is-placeholder"><div class="work-visual">Coming soon</div><div class="work-body"><span class="work-fig"><b>FIG. 0.'+n+'</b> · '+esc(ph.kicker)+'</span><h3>'+esc(ph.name)+'</h3><p>Coming soon.</p></div></div>'}
  function renderTab(T,n,gridEl,footEl){
    var count;
    if(T.projects){gridEl.innerHTML=PROJECTS.map(function(p,i){return card(p,i,true)}).join('');count=PROJECTS.length+' projects'}
    else if(T.items){gridEl.innerHTML=T.items.map(function(it,k){return itemCard(it,k+1,n,k)}).join('');count=T.items.length+(T.items.length===1?' project':' projects')}
    else{gridEl.innerHTML=T.placeholders.map(function(ph,k){return phCard(ph,k+1)}).join('');count='coming soon'}
    footEl.hidden=!T.foot;footEl.innerHTML=T.foot?'<p>'+esc(T.foot.title)+'</p><ul class="dialog-links">'+linkList(T.foot.links)+'</ul>':'';
    return count;
  }
  function gridClick(e){
    var c=e.target.closest('[data-project]');if(c){openProject(+c.dataset.project);return}
    var d=e.target.closest('[data-item]');if(d){var q=d.dataset.item.split(':');openItem(+q[0],+q[1])}}
  var dlg=document.getElementById('detail-dialog'),visual=document.getElementById('dialog-visual'),lastFocus=null;
  function specRow(l,items){return items&&items.length?'<div><dt>'+l+'</dt><dd class="tags">'+items.map(function(x){return '<span class="tag">'+esc(x)+'</span>'}).join('')+'</dd></div>':''}
  function show(){lastFocus=document.activeElement;if(dlg.showModal){dlg.showModal()}else{dlg.setAttribute('open','')}document.body.style.overflow='hidden'}
  function close(){if(dlg.open){dlg.close?dlg.close():dlg.removeAttribute('open')}}
  var thumbs=document.getElementById('dialog-thumbs'),dLinks=document.getElementById('dialog-links'),dImg=document.getElementById('dialog-image');
  function setVisit(url,label){var v=document.getElementById('dialog-visit');if(url){v.href=url;v.hidden=false;[].forEach.call(v.querySelectorAll('[data-visit-label]'),function(x){x.textContent=label||'Visit live site'})}else{v.hidden=true}}
  function resetExtras(){thumbs.hidden=true;thumbs.innerHTML='';dLinks.hidden=true;dLinks.innerHTML='';visual.hidden=false}
  function openItem(t,k){
    var it=TABS[t].items[k];resetExtras();
    if(it.imgs){visual.classList.add('is-photo');dImg.src=it.imgs[0];dImg.alt=it.name+', image 1';
      if(it.imgs.length>1){thumbs.hidden=false;thumbs.innerHTML=it.imgs.map(function(src,i){return '<button type="button" aria-pressed="'+(i===0)+'" aria-label="Show image '+(i+1)+' of '+it.imgs.length+'"><img src="'+thumb(src)+'" alt="" loading="lazy" decoding="async"></button>'}).join('');
        thumbs.onclick=function(e){var b=e.target.closest('button');if(!b)return;var i=[].indexOf.call(thumbs.children,b);dImg.src=it.imgs[i];dImg.alt=it.name+', image '+(i+1);[].forEach.call(thumbs.children,function(x,j){x.setAttribute('aria-pressed',String(j===i))})}}}
    else{visual.hidden=true}
    document.getElementById('dialog-kicker').textContent='FIG. 0.'+(k+1)+' · '+it.kicker;
    document.getElementById('dialog-title').textContent=it.name;
    document.getElementById('dialog-text').textContent=it.summary;
    var sp=document.getElementById('dialog-specs');sp.hidden=!(it.tags&&it.tags.length);sp.innerHTML=it.tags?specRow('Tools & focus',it.tags):'';
    if(it.links){dLinks.hidden=false;dLinks.innerHTML=linkList(it.links)}
    setVisit(it.url,it.cta);
    show();
  }
  function openProject(i){
    var p=PROJECTS[i],img=document.getElementById('dialog-image');resetExtras();
    visual.classList.remove('is-photo');img.src=p.img;img.alt=p.name+' website shown on desktop and mobile';
    document.getElementById('dialog-kicker').textContent='FIG. 2.'+(i+1)+' · '+p.kicker;
    document.getElementById('dialog-title').textContent=p.name;
    document.getElementById('dialog-text').textContent=p.summary;
    var s=document.getElementById('dialog-specs');s.hidden=false;
    s.innerHTML=specRow('Features',p.features)+specRow('Third-party integrations',p.integrations)+specRow('Plugins',p.plugins)+specRow('Fonts',p.fonts);
    setVisit(p.url,'Visit live site');
    show();
  }
  if(dlg){ /* pages without project cards (e.g. the projects index) have no dialog */
    dlg.addEventListener('close',function(){document.body.style.overflow='';if(lastFocus)lastFocus.focus()});
    dlg.addEventListener('click',function(e){if(e.target===dlg)close()});
    document.getElementById('dialog-close').addEventListener('click',close);
    document.getElementById('dialog-back').addEventListener('click',close);
  }
  /* Mobile menu */
  var toggle=document.querySelector('.menu-toggle'),nav=document.getElementById('main-nav');
  if(toggle&&nav){
  function setMenu(o){toggle.setAttribute('aria-expanded',String(o));nav.classList.toggle('is-open',o);toggle.textContent=o?'close ×':'menu →'}
  toggle.addEventListener('click',function(){setMenu(toggle.getAttribute('aria-expanded')!=='true')});
  nav.addEventListener('click',function(e){if(e.target.closest('a'))setMenu(false)});
  document.addEventListener('keydown',function(e){if(e.key==='Escape')setMenu(false)});
  }

  /* Theme toggle: light is the default, dark (Midnight IDE) is optional and remembered */
  (function(){
    var btn=document.getElementById('theme-toggle'),root=document.documentElement,meta=document.querySelector('meta[name="theme-color"]');
    if(!btn)return;
    function apply(dark,save){
      if(dark)root.setAttribute('data-theme','dark');else root.removeAttribute('data-theme');
      btn.title=dark?'Switch to light theme':'Switch to dark theme';btn.setAttribute('aria-checked',String(dark));
      if(meta)meta.setAttribute('content',dark?'#0B0D12':'#F9F4F5');
      if(save){try{localStorage.setItem('jg-theme',dark?'dark':'light')}catch(e){}}
    }
    apply(root.getAttribute('data-theme')==='dark',false);
    btn.addEventListener('click',function(){apply(root.getAttribute('data-theme')!=='dark',true)});
  })();

  function counts(T){return T.projects?PROJECTS.length:T.items?T.items.length:0}
  function categoryCard(T,i){
    var n=counts(T),cover=T.projects?PROJECTS[0].img:(T.items&&T.items[0].imgs?T.items[0].imgs[0]:null);
    var vis=cover?'<div class="work-visual"><img src="'+thumb(cover)+'" alt="" loading="lazy" decoding="async"></div>':'<div class="work-visual poster"><i>'+(n?'Projects':'Coming soon')+'</i><b>'+esc(T.label)+'</b></div>';
    var intro=T.intro||'Live, non-confidential sites across enterprise and open-source CMS platforms.';
    return '<a class="work-card" href="'+T.id+'">'+vis+'<div class="work-body"><span class="work-fig"><b>FIG. 0'+(i+1)+'</b> · '+(n?n+(n===1?' project':' projects'):'coming soon')+'</span><h3>'+esc(T.label)+'</h3><p>'+esc(intro)+'</p><span class="work-cta"><span>Open page</span><span aria-hidden="true">→</span></span></div></a>';
  }
  var yr=document.getElementById('year');if(yr)yr.textContent=new Date().getFullYear();
  window.JG={BASE:BASE,thumb:thumb,counts:counts,categoryCard:categoryCard,PROJECTS:PROJECTS,TABS:TABS,esc:esc,card:card,itemCard:itemCard,phCard:phCard,linkList:linkList,renderTab:renderTab,gridClick:gridClick,
    openProject:openProject,openItem:openItem,show:show,close:close,resetExtras:resetExtras,setVisit:setVisit,specRow:specRow,visual:visual};
})();
