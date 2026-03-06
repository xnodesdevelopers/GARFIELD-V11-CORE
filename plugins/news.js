/**
 * ◈ GARFIELD-V11-CORE ◈
 * * This architectural core is engineered for performance.
 * Designed & Developed by Tharindu Liyanage
 * * © 2026 Xnodes Laboratory. All rights reserved.
 * ---------------------------------------------------------
 * ⚠️ NOTICE: THIS MODULE IS PROTECTED.
 * **This scraping code is minified and in unreadable mode for ethical reasons.**
 * ---------------------------------------------------------
 */

"use strict";const{commands:e}=require("../command"),{chromium:t}=require("playwright");e.push({pattern:"news",alias:["esana"],react:"\uD83D\uDCF0",async function(e,a,n){let{from:i,reply:o}=n,l=null;try{await o("\uD83D\uDD0D Searching latest Sri Lanka news..."),l=await t.launch({headless:!0,args:["--no-sandbox","--disable-setuid-sandbox","--disable-dev-shm-usage","--single-process","--no-zygote",]});let s=await l.newPage();await s.route("**/*.{png,jpg,jpeg,gif,webp,css,woff,woff2,svg,ico,mp4,mp3}",e=>e.abort()),await s.goto("https://www.helakuru.lk/esana/",{waitUntil:"domcontentloaded",timeout:6e4}),await s.waitForFunction(()=>Array.from(document.querySelectorAll("a")).some(e=>e.href.includes("/esana/news/")),{timeout:2e4});let r=await s.evaluate(()=>Array.from(document.querySelectorAll("a")).find(e=>e.href.includes("/esana/news/"))?.href||null);if(!r)throw Error("No news links found");await s.goto(r,{waitUntil:"domcontentloaded",timeout:6e4}),await s.waitForSelector("h2.news_title",{timeout:15e3});let{title:w,content:c}=await s.evaluate(()=>({title:document.querySelector("h2.news_title")?.innerText.trim()||"No Title",content:Array.from(document.querySelectorAll(".news-single-content p.news_text")).map(e=>e.innerText.trim()).filter(e=>e.length>5).join("\n\n")}));if(!c)throw Error("Article content is empty");let u=["\uD83D\uDCF0 *HELAKURU ESANA*","▬▬▬▬▬▬▬▬▬▬▬▬▬","",`*${w}*`,"",c,"","▬▬▬▬▬▬▬▬▬▬▬▬▬","✅ *Verified News*","\uD83D\uDCE1 *Source:* Helakuru Esana",`\uD83D\uDCBB *Coded by:* ${"Tharindu Liyanage"}`,].join("\n");await e.sendMessage(i,{text:u},{quoted:a})}catch(d){await o(`❌ Error: ${d.message}`)}finally{l&&await l.close().catch(()=>{})}}});
