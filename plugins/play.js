/**
 * ◈ GARFIELD-V11-CORE ◈
 * * This architectural core is engineered for performance.
 * Designed & Developed by Tharindu Liyanage
 * * © 2026 Xnodes Laboratory. All rights reserved.
 * ---------------------------------------------------------
 */
const{commands:t}=require("../command"),{pipeline:e}=require("stream/promises"),fs=require("fs"),path=require("path"),axios=require("axios"),yts=require("yt-search"),{createDecipheriv:a}=require("crypto"),TEMP=path.join(__dirname,"../lib/store");function get_id(t){let e=t.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|v\/|embed\/|user\/[^\/\n\s]+\/)?(?:watch\?v=|v%3D|embed%2F|video%2F)?|youtu\.be\/|youtube\.com\/watch\?v=|youtube\.com\/embed\/|youtube\.com\/v\/|youtube\.com\/shorts\/|youtube\.com\/playlist\?list=)([a-zA-Z0-9_-]{11})/);return e?e[1]:null}fs.existsSync(TEMP)||fs.mkdirSync(TEMP,{recursive:!0});const decode=t=>{try{let e=Buffer.from(t,"base64"),o=e.slice(0,16),i=e.slice(16),n=Buffer.from("C5D58EF67A7584E4A29F6C35BBC4EB12","hex"),r=a("aes-128-cbc",n,o),s=Buffer.concat([r.update(i),r.final()]);return JSON.parse(s.toString())}catch(l){return null}};async function savetube(t,e,a){let o=(await axios.get("https://media.savetube.vip/api/random-cdn")).data.cdn,i=(await axios.post("https://"+o+"/v2/info",{url:t})).data,n=decode(i.data);if(!n)throw Error("Decryption failed");let r=(await axios.post("https://"+o+"/download",{downloadType:a,quality:`${e}`,key:n.key})).data;return{downloadUrl:r.data.downloadUrl,title:n.title||"Audio",duration:n.durationLabel||"00:00"}}t.push({pattern:"play",react:"⚡",async function(t,a,o){let{from:i,q:n,reply:r}=o;if(!n)return r("⚠️ Provide a song name or YouTube link!\nExample: *.play dukanalu*");let s=n.trim();try{if(!get_id(s)){let l=await yts(n),u=l.videos[0];if(!u)return r("❌ Not found.");s=u.url}}catch(c){return r("❌ Search error.")}let d;try{d=await savetube(s,128,"audio")}catch(y){return r("❌ Service unavailable.")}let m=d.title.replace(/[/\\?%*:|"<>]/g,"-"),p=path.join(TEMP,`play_${m}_${Date.now()}.mp3`);try{let f=await axios({method:"get",url:d.downloadUrl,responseType:"stream"});if(await e(f.data,fs.createWriteStream(p)),!fs.existsSync(p)||0===fs.statSync(p).size)throw Error("Zero byte stream");let h=(fs.statSync(p).size/1e6).toFixed(2),w=`*${d.title}* ✅

────────────────────
\`\`\`Size     : ${h} MB\`\`\`
\`\`\`Duration : ${d.duration}\`\`\`

> _Garfield BotV11 \xa9 2026_`;await t.sendMessage(i,{document:{url:p},mimetype:"audio/mpeg",fileName:`${d.title}.mp3`,caption:w},{quoted:a})}catch(b){return r(`❌ Failure: ${b.message}`)}finally{fs.existsSync(p)&&fs.unlinkSync(p)}}});
