import { useEffect, useRef, useState, useCallback } from 'react'

const COLS=10,ROWS=20,CS=36,BW=362,BH=722

function hexToRgba(hex,a){const r=parseInt(hex.slice(1,3),16),g=parseInt(hex.slice(3,5),16),b=parseInt(hex.slice(5,7),16);return `rgba(${r},${g},${b},${a})`}

const PIECES=[
  {id:0,color:'#00b4c8',type:'tablets',name:'Torah',shape:[[1,1,1,1]],verses:['"In the beginning God created the heavens and the earth." — Gen 1:1','"I am the LORD your God who brought you out of Egypt." — Ex 20:2','"Love your neighbor as yourself." — Lev 19:18','"The LORD bless you and keep you." — Num 6:24','"Be strong and courageous, do not be afraid." — Deut 31:6','"You shall have no other gods before me." — Ex 20:3','"Hear O Israel, the LORD our God is one." — Deut 6:4','"God created man in his own image." — Gen 1:27','"The LORD is my rock and my fortress." — Ps 18:2','"I will be with you wherever you go." — Josh 1:9']},
  {id:1,color:'#e6b800',type:'flame',name:"Nevi'im",shape:[[1,1],[1,1]],verses:['"I know the plans I have for you, plans for peace." — Jer 29:11','"A virgin will conceive and bear a son, Immanuel." — Isa 7:14','"Not by might nor by power, but by my Spirit." — Zech 4:6','"The spirit lifted me up between earth and heaven." — Ezek 8:3','"He was pierced for our transgressions." — Isa 53:5','"Return to me and I will return to you." — Zech 1:3','"For I am with you to deliver you." — Jer 1:8','"The lion has roared; who will not fear?" — Amos 3:8','"Come, let us reason together, says the LORD." — Isa 1:18','"The day of the LORD is great and dreadful." — Joel 2:11']},
  {id:2,color:'#a050dc',type:'doublenote',name:'Ketuvim',shape:[[0,1,0],[1,1,1]],verses:['"The LORD is my shepherd, I shall not want." — Ps 23:1','"Trust in the LORD with all your heart." — Prov 3:5','"Vanity of vanities, all is vanity." — Eccl 1:2','"Many waters cannot quench love." — Song 8:7','"The fear of the LORD is the beginning of wisdom." — Ps 111:10','"Create in me a clean heart, O God." — Ps 51:10','"Even through the valley of shadow I fear no evil." — Ps 23:4','"The LORD is close to the brokenhearted." — Ps 34:18','"Delight yourself in the LORD." — Ps 37:4','"Blessed is the man who walks not in wicked counsel." — Ps 1:1']},
  {id:3,color:'#e07000',type:'ichthus',name:'Gospels',shape:[[0,1,1],[1,1,0]],verses:['"For God so loved the world he gave his only Son." — John 3:16','"I am the way, the truth, and the life." — John 14:6','"Blessed are the pure in heart." — Matt 5:8','"In the beginning was the Word." — John 1:1','"The Spirit of the Lord is upon me." — Luke 4:18','"Come to me all who are weary." — Matt 11:28','"I am the resurrection and the life." — John 11:25','"Love one another as I have loved you." — John 15:12','"The kingdom of God is at hand." — Mark 1:15','"You are the light of the world." — Matt 5:14']},
  {id:4,color:'#1e64dc',type:'cross',name:'Epistles',shape:[[1,1,0],[0,1,1]],verses:['"I can do all things through Christ." — Phil 4:13','"For all have sinned and fall short." — Rom 3:23','"Faith without works is dead." — Jas 2:26','"The fruit of the Spirit is love, joy, peace." — Gal 5:22','"Grace and peace be multiplied to you." — 1 Pet 1:2','"If God is for us who can be against us?" — Rom 8:31','"Do not be conformed to this world." — Rom 12:2','"Rejoice in the Lord always." — Phil 4:4','"Greater is he in you than he in the world." — 1 John 4:4','"Love is patient, love is kind." — 1 Cor 13:4']},
  {id:5,color:'#008830',type:'alphaomega',name:'Revelation',shape:[[1,0],[1,0],[1,1]],verses:['"I am the Alpha and the Omega." — Rev 1:8','"Behold, I am coming soon." — Rev 22:12','"God will wipe away every tear." — Rev 21:4','"Holy, holy, holy is the Lord God Almighty." — Rev 4:8','"Worthy is the Lamb who was slain." — Rev 5:12','"He who has an ear, let him hear." — Rev 2:7','"Behold I stand at the door and knock." — Rev 3:20','"They overcame by the blood of the Lamb." — Rev 12:11','"The Spirit and the Bride say Come." — Rev 22:17','"There will be no more death or mourning." — Rev 21:4']},
  {id:6,color:'#b89000',type:'jesus',name:'Messianic',shape:[[0,1],[0,1],[1,1]],verses:['"The scepter shall not depart from Judah." — Gen 49:10','"Out of Bethlehem will come a ruler." — Mic 5:2','"He was pierced for our transgressions." — Isa 53:5','"Rejoice greatly, O daughter of Zion!" — Zech 9:9','"They will look on me whom they pierced." — Zech 12:10','"Therefore the Lord will give you a sign." — Isa 7:14','"For to us a child is born, a son is given." — Isa 9:6','"The LORD laid on him the iniquity of us all." — Isa 53:6','"Kiss the Son, lest he be angry." — Ps 2:12','"My God, why have you forsaken me?" — Ps 22:1']},
]

const HELP_VERSES={
  sword:'"For the word of God is alive and active. Sharper than any double-edged sword, it penetrates even to dividing soul and spirit, joints and marrow; it judges the thoughts and attitudes of the heart." — Hebrews 4:12 (NIV)',
  dove:'"Suddenly a sound like the blowing of a violent wind came from heaven and filled the whole house where they were sitting." — Acts 2:2 (NIV)',
  cross:'"We demolish arguments and every pretension that sets itself up against the knowledge of God, and we take captive every thought to make it obedient to Christ." — 2 Corinthians 10:5 (NIV)'
}

const ENV_EFFECTS=['lightning','tornado','firerain','earthquake','pillars','wheel','angels']
const VERSE_STYLES=['zoom','slideLeft','slideRight','slideTop','ninjastar','crystallize','bounce']

function getSpeed(level){if(level<=2)return 600;return Math.max(200,600-Math.max(0,level-2)*35)}

function drawTablet(ctx,x,y,w,h){
  const archH=w*0.5
  ctx.strokeStyle='#fff';ctx.lineWidth=1.8;ctx.fillStyle='rgba(220,240,255,0.2)'
  ctx.beginPath();ctx.moveTo(x,y+archH);ctx.arc(x+w/2,y+archH,w/2,Math.PI,0,false)
  ctx.lineTo(x+w,y+h);ctx.lineTo(x,y+h);ctx.closePath();ctx.fill();ctx.stroke()
  ctx.strokeStyle='rgba(200,220,255,0.7)';ctx.lineWidth=1
  const lsY=y+archH+(h-archH)*0.12,leY=y+h-(h-archH)*0.1,lsp=(leY-lsY)/3
  for(let i=0;i<4;i++){const ly=lsY+i*lsp;ctx.beginPath();ctx.moveTo(x+w*0.12,ly);ctx.lineTo(x+w*0.88,ly);ctx.stroke()}
}

function drawIcon(ctx,type,x,y,size){
  const cx=x+size/2,cy=y+size/2
  ctx.save();ctx.shadowColor='rgba(0,0,0,0.9)';ctx.shadowBlur=4
  if(type==='tablets'){const tw=size*0.38,th=size*0.56,gap=size*0.05,ty=cy-th*0.5+size*0.02;drawTablet(ctx,cx-tw-gap/2,ty,tw,th);drawTablet(ctx,cx+gap/2,ty,tw,th)}
  else if(type==='flame'){const by=cy+size*0.38,h=size*0.78;ctx.beginPath();ctx.moveTo(cx,by);ctx.bezierCurveTo(cx-size*0.32,by-h*0.3,cx-size*0.28,by-h*0.55,cx-size*0.08,by-h*0.7);ctx.bezierCurveTo(cx-size*0.04,by-h*0.55,cx-size*0.16,by-h*0.38,cx-size*0.04,by-h*0.48);ctx.bezierCurveTo(cx+size*0.04,by-h*0.62,cx,by-h*0.78,cx,by-h*0.82);ctx.bezierCurveTo(cx+size*0.02,by-h*0.75,cx+size*0.08,by-h*0.6,cx+size*0.1,by-h*0.5);ctx.bezierCurveTo(cx+size*0.22,by-h*0.38,cx+size*0.18,by-h*0.2,cx+size*0.32,by-h*0.3);ctx.bezierCurveTo(cx+size*0.34,by-h*0.15,cx+size*0.28,by,cx,by);ctx.fillStyle='#ff4400';ctx.fill();ctx.beginPath();ctx.moveTo(cx,by-size*0.02);ctx.bezierCurveTo(cx-size*0.16,by-h*0.28,cx-size*0.1,by-h*0.5,cx,by-h*0.64);ctx.bezierCurveTo(cx+size*0.1,by-h*0.5,cx+size*0.16,by-h*0.28,cx,by-size*0.02);ctx.fillStyle='#ff8800';ctx.fill();ctx.beginPath();ctx.moveTo(cx,by-size*0.08);ctx.bezierCurveTo(cx-size*0.08,by-h*0.22,cx-size*0.04,by-h*0.38,cx,by-h*0.48);ctx.bezierCurveTo(cx+size*0.04,by-h*0.38,cx+size*0.08,by-h*0.22,cx,by-size*0.08);ctx.fillStyle='#ffe000';ctx.fill()}
  else if(type==='doublenote'){ctx.fillStyle='#fff';ctx.strokeStyle='#fff';ctx.lineWidth=size*0.07;ctx.beginPath();ctx.ellipse(cx-size*0.16,cy+size*0.25,size*0.12,size*0.09,-0.4,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.moveTo(cx-size*0.05,cy+size*0.2);ctx.lineTo(cx-size*0.05,cy-size*0.18);ctx.lineWidth=size*0.06;ctx.stroke();ctx.beginPath();ctx.ellipse(cx+size*0.1,cy+size*0.25,size*0.12,size*0.09,-0.4,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.moveTo(cx+size*0.21,cy+size*0.2);ctx.lineTo(cx+size*0.21,cy-size*0.18);ctx.lineWidth=size*0.06;ctx.stroke();ctx.beginPath();ctx.moveTo(cx-size*0.05,cy-size*0.18);ctx.lineTo(cx+size*0.21,cy-size*0.18);ctx.lineWidth=size*0.09;ctx.stroke()}
  else if(type==='ichthus'){ctx.strokeStyle='#fff';ctx.lineWidth=size*0.1;ctx.lineCap='round';const fw=size*0.42,fh=size*0.24,fx=cx+fw*0.05;ctx.beginPath();ctx.ellipse(fx,cy,fw*0.55,fh,0,0,Math.PI*2);ctx.stroke();ctx.beginPath();ctx.moveTo(fx-fw*0.55,cy);ctx.lineTo(fx-fw*0.95,cy-fh*1.1);ctx.stroke();ctx.beginPath();ctx.moveTo(fx-fw*0.55,cy);ctx.lineTo(fx-fw*0.95,cy+fh*1.1);ctx.stroke();ctx.beginPath();ctx.moveTo(fx-fw*0.95,cy-fh*1.1);ctx.lineTo(fx-fw*0.95,cy+fh*1.1);ctx.stroke()}
  else if(type==='cross'){ctx.strokeStyle='#ffd700';ctx.lineWidth=size*0.2;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(cx,cy-size*0.4);ctx.lineTo(cx,cy+size*0.4);ctx.stroke();ctx.beginPath();ctx.moveTo(cx-size*0.3,cy-size*0.1);ctx.lineTo(cx+size*0.3,cy-size*0.1);ctx.stroke()}
  else if(type==='alphaomega'){ctx.strokeStyle='#aaffcc';ctx.lineWidth=size*0.09;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(cx,cy-size*0.38);ctx.lineTo(cx,cy+size*0.38);ctx.stroke();ctx.beginPath();ctx.moveTo(cx-size*0.13,cy-size*0.08);ctx.lineTo(cx+size*0.13,cy-size*0.08);ctx.stroke();ctx.fillStyle='#aaffcc';ctx.font=`bold ${size*0.36}px serif`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('A',cx-size*0.32,cy+size*0.08);ctx.fillText('Ω',cx+size*0.32,cy+size*0.1)}
  else if(type==='jesus'){ctx.fillStyle='#3a1a0a';ctx.beginPath();ctx.ellipse(cx,cy+size*0.05,size*0.32,size*0.4,0,0,Math.PI*2);ctx.fill();ctx.fillStyle='#d4956a';ctx.beginPath();ctx.ellipse(cx,cy,size*0.22,size*0.28,0,0,Math.PI*2);ctx.fill();ctx.fillStyle='#1a0a00';ctx.beginPath();ctx.ellipse(cx-size*0.09,cy-size*0.06,size*0.04,size*0.03,0,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.ellipse(cx+size*0.09,cy-size*0.06,size*0.04,size*0.03,0,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#8a4030';ctx.lineWidth=size*0.025;ctx.beginPath();ctx.arc(cx,cy+size*0.08,size*0.06,0.2,Math.PI-0.2);ctx.stroke();ctx.fillStyle='#2a0e04';ctx.beginPath();ctx.moveTo(cx-size*0.18,cy+size*0.1);ctx.bezierCurveTo(cx-size*0.2,cy+size*0.22,cx-size*0.1,cy+size*0.32,cx,cy+size*0.3);ctx.bezierCurveTo(cx+size*0.1,cy+size*0.32,cx+size*0.2,cy+size*0.22,cx+size*0.18,cy+size*0.1);ctx.bezierCurveTo(cx+size*0.1,cy+size*0.2,cx-size*0.1,cy+size*0.2,cx-size*0.18,cy+size*0.1);ctx.fill();ctx.strokeStyle='#ffd700';ctx.lineWidth=size*0.06;ctx.beginPath();ctx.arc(cx,cy-size*0.16,size*0.28,Math.PI*0.75,Math.PI*0.25,false);ctx.stroke()}
  ctx.restore()
}

function drawCell(ctx,x,y,size,color,type){
  ctx.fillStyle=hexToRgba(color,0.10);ctx.beginPath();ctx.roundRect(x+1,y+1,size-2,size-2,3);ctx.fill()
  ctx.strokeStyle=color;ctx.lineWidth=2;ctx.beginPath();ctx.roundRect(x+1,y+1,size-2,size-2,3);ctx.stroke()
  drawIcon(ctx,type,x,y,size)
}

function drawJerusalemBg(ctx,W,H){
  const skyGrd=ctx.createLinearGradient(0,0,0,H*0.55)
  skyGrd.addColorStop(0,'#3a6fa8');skyGrd.addColorStop(0.3,'#6fa0c8');skyGrd.addColorStop(0.6,'#c8a860');skyGrd.addColorStop(0.8,'#e8c070');skyGrd.addColorStop(1,'#f0d090')
  ctx.fillStyle=skyGrd;ctx.fillRect(0,0,W,H)
  const sunGrd=ctx.createRadialGradient(W*0.82,H*0.08,0,W*0.82,H*0.08,H*0.35)
  sunGrd.addColorStop(0,'rgba(255,230,100,0.6)');sunGrd.addColorStop(0.3,'rgba(255,180,50,0.2)');sunGrd.addColorStop(1,'rgba(255,150,0,0)')
  ctx.fillStyle=sunGrd;ctx.fillRect(0,0,W,H)
  function cloud(x,y,w,h,a){ctx.save();ctx.globalAlpha=a;ctx.fillStyle='rgba(255,240,200,0.7)';[[-w*0.3,0,w*0.5,h],[0,-h*0.4,w*0.6,h*0.8],[w*0.2,0,w*0.5,h]].forEach(([dx,dy,cw,ch])=>{ctx.beginPath();ctx.ellipse(x+dx,y+dy,cw,ch,0,0,Math.PI*2);ctx.fill()});ctx.restore()}
  cloud(W*0.15,H*0.06,30,12,0.6);cloud(W*0.35,H*0.04,45,16,0.5);cloud(W*0.62,H*0.07,35,13,0.55)
  ctx.fillStyle='rgba(140,160,180,0.4)';ctx.beginPath();ctx.moveTo(0,H*0.42);ctx.bezierCurveTo(W*0.2,H*0.36,W*0.4,H*0.38,W*0.6,H*0.35);ctx.bezierCurveTo(W*0.8,H*0.33,W*0.9,H*0.38,W,H*0.4);ctx.lineTo(W,H*0.55);ctx.lineTo(0,H*0.55);ctx.closePath();ctx.fill()
  const groundGrd=ctx.createLinearGradient(0,H*0.62,0,H)
  groundGrd.addColorStop(0,'#c8a870');groundGrd.addColorStop(0.4,'#b89050');groundGrd.addColorStop(1,'#a07840')
  ctx.fillStyle=groundGrd;ctx.fillRect(0,H*0.62,W,H*0.38)
  ctx.fillStyle='#c4a878';ctx.fillRect(0,H*0.42,W,H*0.22)
  for(let row=0;row<8;row++){const ry=H*0.42+row*(H*0.22/8);ctx.strokeStyle='rgba(150,110,60,0.5)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(0,ry);ctx.lineTo(W,ry);ctx.stroke();const offset=row%2===0?0:20;for(let x=offset;x<W;x+=38){ctx.beginPath();ctx.moveTo(x,ry);ctx.lineTo(x,ry+H*0.22/8);ctx.stroke()}}
  const wallShad=ctx.createLinearGradient(0,H*0.42,0,H*0.64);wallShad.addColorStop(0,'rgba(0,0,0,0.15)');wallShad.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=wallShad;ctx.fillRect(0,H*0.42,W,H*0.22)
  ;[[0,0.2,0.08,0.25,'#c8b080'],[0.06,0.16,0.06,0.28,'#d4bc8c'],[0.11,0.22,0.07,0.22,'#c0a870'],[0.17,0.14,0.09,0.30,'#d4bc8c'],[0.65,0.18,0.08,0.26,'#c8b080'],[0.72,0.14,0.07,0.30,'#d4bc8c'],[0.78,0.20,0.09,0.24,'#c0a870'],[0.86,0.16,0.08,0.28,'#d4bc8c'],[0.93,0.22,0.07,0.22,'#c8b080']].forEach(([bx,by,bw,bh,bc])=>{ctx.fillStyle=bc;ctx.fillRect(W*bx,H*by,W*bw,H*bh);ctx.fillStyle='rgba(180,150,90,0.5)';ctx.fillRect(W*bx,H*by,W*bw,4);ctx.fillStyle='rgba(100,80,40,0.6)';for(let wy=H*by+12;wy<H*(by+bh)-15;wy+=18)for(let wx=W*bx+6;wx<W*(bx+bw)-8;wx+=14)ctx.fillRect(wx,wy,7,9)})
  ctx.fillStyle='#d8c090';ctx.fillRect(W*0.3,H*0.08,W*0.04,H*0.36);ctx.fillStyle='#c4a878';ctx.fillRect(W*0.28,H*0.14,W*0.08,H*0.025);ctx.fillRect(W*0.28,H*0.22,W*0.08,H*0.02);ctx.fillStyle='#c8b080';ctx.beginPath();ctx.moveTo(W*0.3,H*0.08);ctx.lineTo(W*0.34,H*0.08);ctx.lineTo(W*0.32,H*0.04);ctx.closePath();ctx.fill()
  const dc=W*0.58
  ctx.fillStyle='#c8b480';ctx.fillRect(W*0.38,H*0.32,W*0.42,H*0.12);ctx.fillStyle='#b8a470';ctx.fillRect(W*0.38,H*0.32,W*0.42,4)
  ctx.fillStyle='#d4bc8c';ctx.fillRect(W*0.42,H*0.24,W*0.32,H*0.10);ctx.fillStyle='#3a7055';ctx.fillRect(W*0.42,H*0.24,W*0.32,H*0.022);ctx.fillStyle='#2a5540';ctx.fillRect(W*0.42,H*0.26,W*0.32,H*0.008);ctx.fillStyle='#3a7055';ctx.fillRect(W*0.42,H*0.32,W*0.32,H*0.012)
  ctx.fillStyle='rgba(180,160,100,0.8)';for(let wi=0;wi<5;wi++){const wx=W*(0.44+wi*0.058);ctx.fillRect(wx,H*0.272,W*0.038,H*0.048);ctx.beginPath();ctx.arc(wx+W*0.019,H*0.272,W*0.019,Math.PI,0,false);ctx.fillStyle='rgba(160,140,80,0.7)';ctx.fill();ctx.fillStyle='rgba(180,160,100,0.8)'}
  ctx.fillStyle='#ccc090';ctx.fillRect(W*0.46,H*0.16,W*0.24,H*0.09);ctx.fillStyle='#3a7055';ctx.fillRect(W*0.46,H*0.16,W*0.24,H*0.018)
  ctx.fillStyle='#c07808';ctx.beginPath();ctx.ellipse(dc,H*0.155,W*0.125,H*0.016,0,0,Math.PI*2);ctx.fill()
  const domeGrd=ctx.createRadialGradient(dc-W*0.02,H*0.09,0,dc,H*0.155,W*0.13)
  domeGrd.addColorStop(0,'#f0e060');domeGrd.addColorStop(0.2,'#e8c840');domeGrd.addColorStop(0.5,'#d4a020');domeGrd.addColorStop(0.8,'#b88010');domeGrd.addColorStop(1,'#8a5808')
  ctx.fillStyle=domeGrd;ctx.beginPath();ctx.moveTo(dc-W*0.125,H*0.155);ctx.bezierCurveTo(dc-W*0.13,H*0.12,dc-W*0.08,H*0.065,dc,H*0.048);ctx.bezierCurveTo(dc+W*0.08,H*0.065,dc+W*0.13,H*0.12,dc+W*0.125,H*0.155);ctx.closePath();ctx.fill()
  ctx.fillStyle='rgba(255,240,100,0.3)';ctx.beginPath();ctx.moveTo(dc-W*0.05,H*0.155);ctx.bezierCurveTo(dc-W*0.07,H*0.11,dc-W*0.03,H*0.07,dc-W*0.01,H*0.055);ctx.bezierCurveTo(dc+W*0.01,H*0.07,dc-W*0.01,H*0.12,dc-W*0.01,H*0.155);ctx.closePath();ctx.fill()
  ctx.strokeStyle='#a07010';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(dc,H*0.155,W*0.125,H*0.016,0,0,Math.PI*2);ctx.stroke()
  ctx.fillStyle='#c89018';ctx.fillRect(dc-2,H*0.03,4,H*0.02);ctx.beginPath();ctx.arc(dc,H*0.03,5,0,Math.PI*2);ctx.fill()
  ctx.strokeStyle='#ffd700';ctx.lineWidth=2;ctx.beginPath();ctx.arc(dc,H*0.022,6,Math.PI*0.75,Math.PI*0.25,false);ctx.stroke()
  function cypress(x,y,h){ctx.fillStyle='#2a5020';ctx.beginPath();ctx.ellipse(x,y-h*0.5,h*0.15,h*0.55,0,0,Math.PI*2);ctx.fill();ctx.fillStyle='#4a3020';ctx.fillRect(x-3,y-h*0.08,6,h*0.1)}
  cypress(W*0.26,H*0.42,H*0.18);cypress(W*0.72,H*0.42,H*0.16);cypress(W*0.78,H*0.42,H*0.14);cypress(W*0.08,H*0.44,H*0.15)
  ctx.fillStyle='rgba(40,25,10,0.7)';for(let i=0;i<12;i++){const px=W*(0.08+i*0.07),ph=H*0.025;ctx.fillRect(px,H*0.62-ph,W*0.012,ph);ctx.beginPath();ctx.arc(px+W*0.006,H*0.62-ph-W*0.008,W*0.008,0,Math.PI*2);ctx.fill()}
  const warmGrd=ctx.createLinearGradient(W*0.8,0,0,H*0.6);warmGrd.addColorStop(0,'rgba(255,160,30,0.12)');warmGrd.addColorStop(1,'rgba(255,160,30,0)');ctx.fillStyle=warmGrd;ctx.fillRect(0,0,W,H)
  ctx.fillStyle='rgba(5,5,20,0.28)';ctx.fillRect(0,0,W,H)
}

export default function BibleTetris({onBack, isVisible = true}){
  const boardRef=useRef(null)
  const effectRef=useRef(null)
  const helpRef=useRef(null)
  const nextRef=useRef(null)
  const verseRef=useRef(null)
  const gameLoopRef=useRef(null)
  const helpAnimRef=useRef(null)
  const effectAnimRef=useRef(null)
  const verseAnimRef=useRef(null)
  const bgCanvasRef=useRef(null)
  const audioCtxRef=useRef(null)
  const musicSchedulerRef=useRef(null)
  const verseGraceRef=useRef(null)

  const stateRef=useRef({
    board:Array.from({length:ROWS},()=>Array(COLS).fill(null)),
    current:null,next:null,score:0,lines:0,level:1,
    stats:[0,0,0,0,0,0,0],running:false,paused:false,
    helps:3,helpActive:false,helpCycle:0,nextHelpScore:5000,
    bag:[],bagUsed:[],usedVerses:[{},{},{},{},{},{},{}],
    envBag:[...ENV_EFFECTS].sort(()=>Math.random()-0.5),
    verseBag:[...VERSE_STYLES].sort(()=>Math.random()-0.5),
    useEnvNext:true,particles:[],musicOn:false,
    nextNoteTime:0,currentBeat:0,melodyBeat:0,
    lastVerse:'Clear a line...'
  })

  const [ui,setUi]=useState({score:0,lines:0,level:1,helps:3,nextHelpScore:5000,stats:[0,0,0,0,0,0,0],running:false,paused:false,musicOn:false,lastVerse:'Clear a line...',bagUsed:[],bag:[]})

  function updateUi(){
    const s=stateRef.current
    setUi({score:s.score,lines:s.lines,level:s.level,helps:s.helps,nextHelpScore:s.nextHelpScore,stats:[...s.stats],running:s.running,paused:s.paused,musicOn:s.musicOn,lastVerse:s.lastVerse,bagUsed:[...s.bagUsed],bag:[...s.bag]})
  }
useEffect(()=>{
    if(!isVisible){
      const s = stateRef.current
      if(s.running && !s.paused){
        s.paused = true
      }
      if(s.musicOn){
        s.musicOn = false
        if(musicSchedulerRef.current){
          clearInterval(musicSchedulerRef.current)
          musicSchedulerRef.current = null
        }
      }
      updateUi()
    }
  },[isVisible])
  // ===== MUSIC =====
  const NOTE={C2:65.41,G2:98,A2:110,B2:123.47,C3:130.81,D3:146.83,E3:164.81,F3:174.61,G3:196,A3:220,B3:246.94,C4:261.63,D4:293.66,E4:329.63,F4:349.23,G4:392,A4:440,B4:493.88,C5:523.25,D5:587.33,E5:659.25,G5:784,C6:1046.5}
  const MELODY=[{n:329.63,d:1},{n:392,d:1},{n:523.25,d:1.5},{n:493.88,d:0.5},{n:440,d:1},{n:392,d:1},{n:329.63,d:2},{n:349.23,d:1},{n:440,d:1},{n:523.25,d:1.5},{n:440,d:0.5},{n:392,d:1},{n:329.63,d:1},{n:293.66,d:1},{n:261.63,d:1}]
  const CHORDS=[[130.81,164.81,196],[110,130.81,164.81],[87.31,110,130.81],[98,123.47,146.83]]
  const TEMPO=0.9

  function makeOsc(freq,type,startT,endT,gainVal,attack=0.05,release=0.15){
    const ctx=audioCtxRef.current;if(!ctx)return
    const osc=ctx.createOscillator(),gain=ctx.createGain()
    osc.connect(gain);gain.connect(ctx.destination)
    osc.type=type;osc.frequency.setValueAtTime(freq,startT)
    gain.gain.setValueAtTime(0,startT);gain.gain.linearRampToValueAtTime(gainVal,startT+attack)
    gain.gain.linearRampToValueAtTime(gainVal,endT-release);gain.gain.linearRampToValueAtTime(0,endT)
    osc.start(startT);osc.stop(endT+0.05)
  }

  function scheduleBeat(){
    const s=stateRef.current,ctx=audioCtxRef.current
    if(!ctx||!s.musicOn)return
    while(s.nextNoteTime<ctx.currentTime+0.2){
      const t=s.nextNoteTime
      if(s.currentBeat%2===0){const chord=CHORDS[Math.floor(s.currentBeat/2)%CHORDS.length];chord.forEach((f,i)=>{makeOsc(f,'sine',t,t+TEMPO*2,0.07+i*0.01,0.1,0.4);makeOsc(f*1.003,'sine',t,t+TEMPO*2,0.04,0.12,0.4)})}
      if(s.currentBeat%2===0){const bf=[65.41,55,43.65,49];makeOsc(bf[Math.floor(s.currentBeat/2)%4],'triangle',t,t+TEMPO*1.8,0.12,0.05,0.3)}
      if(s.melodyBeat<MELODY.length){const mn=MELODY[s.melodyBeat];makeOsc(mn.n,'triangle',t,t+TEMPO*mn.d*0.85,0.18,0.04,0.1);if(s.melodyBeat%4===0)makeOsc(mn.n*1.5,'sine',t,t+TEMPO*mn.d*0.8,0.06,0.05,0.15);s.melodyBeat++;if(s.melodyBeat>=MELODY.length)s.melodyBeat=0}
      s.nextNoteTime+=TEMPO;s.currentBeat++;if(s.currentBeat>=8)s.currentBeat=0
    }
  }

  function startMusic(){
    if(!audioCtxRef.current)audioCtxRef.current=new(window.AudioContext||window.webkitAudioContext)()
    const ctx=audioCtxRef.current;if(ctx.state==='suspended')ctx.resume()
    const s=stateRef.current;s.nextNoteTime=ctx.currentTime+0.1;s.currentBeat=0;s.melodyBeat=0;s.musicOn=true
    if(musicSchedulerRef.current)clearInterval(musicSchedulerRef.current)
    musicSchedulerRef.current=setInterval(scheduleBeat,80)
  }

  function stopMusic(){
    stateRef.current.musicOn=false
    if(musicSchedulerRef.current){clearInterval(musicSchedulerRef.current);musicSchedulerRef.current=null}
  }

  function sfxDrop(){const ctx=audioCtxRef.current;if(!ctx||!stateRef.current.musicOn)return;const t=ctx.currentTime;makeOsc(180,'triangle',t,t+0.12,0.15,0.01,0.08)}
  function sfxClear(n){const ctx=audioCtxRef.current;if(!ctx||!stateRef.current.musicOn)return;const t=ctx.currentTime;const ns=n>=4?[523.25,659.25,784,1046.5]:[523.25,659.25,784];ns.forEach((f,i)=>makeOsc(f,'triangle',t+i*0.08,t+i*0.08+0.25,0.25,0.02,0.1))}
  function sfxHelp(){const ctx=audioCtxRef.current;if(!ctx||!stateRef.current.musicOn)return;const t=ctx.currentTime;[261.63,329.63,392,523.25,784].forEach((f,i)=>makeOsc(f,'triangle',t+i*0.06,t+i*0.06+0.3,0.2,0.01,0.08))}
  function sfxOver(){const ctx=audioCtxRef.current;if(!ctx||!stateRef.current.musicOn)return;const t=ctx.currentTime;[392,329.63,261.63,220].forEach((f,i)=>makeOsc(f,'sine',t+i*0.2,t+i*0.2+0.5,0.2,0.02,0.2))}

  // ===== BAG =====
  function shuffleBag(){
    const s=stateRef.current
    s.bag=[0,1,2,3,4,5,6].sort(()=>Math.random()-0.5)
    s.bagUsed=[]
  }

  function drawFromBag(){
    const s=stateRef.current
    if(!s.bag.length)shuffleBag()
    const id=s.bag.shift();s.bagUsed.push(id)
    const p=PIECES[id]
    return{...p,shape:p.shape.map(r=>[...r]),x:Math.floor((COLS-p.shape[0].length)/2),y:0}
  }

  function getVerse(pid){
    const s=stateRef.current,verses=PIECES[pid].verses,used=s.usedVerses[pid]
    const avail=verses.filter((_,i)=>!used[i])
    if(!avail.length){s.usedVerses[pid]={};return getVerse(pid)}
    const idx=Math.floor(Math.random()*avail.length)
    used[verses.indexOf(avail[idx])]=true
    return avail[idx]
  }

  // ===== BACKGROUND =====
  function getBg(){
    if(!bgCanvasRef.current){
      const c=document.createElement('canvas');c.width=BW;c.height=BH
      const ctx=c.getContext('2d')
      // Try to use real photo first, fall back to drawn background
      const img=new Image();img.src='/jerusalem.png'
      img.onload=()=>{
        const imgCtx=c.getContext('2d')
        imgCtx.drawImage(img,0,0,BW,BH)
        imgCtx.fillStyle='rgba(5,5,20,0.3)';imgCtx.fillRect(0,0,BW,BH)
      }
      img.onerror=()=>drawJerusalemBg(c.getContext('2d'),BW,BH)
      drawJerusalemBg(ctx,BW,BH) // draw immediately as fallback
      bgCanvasRef.current=c
    }
    return bgCanvasRef.current
  }

  // ===== RENDER =====
  function renderBoard(){
    const canvas=boardRef.current;if(!canvas)return
    const ctx=canvas.getContext('2d'),s=stateRef.current
    ctx.drawImage(getBg(),0,0)
    ctx.strokeStyle='rgba(255,255,255,0.05)';ctx.lineWidth=0.5
    for(let r=0;r<=ROWS;r++){ctx.beginPath();ctx.moveTo(0,r*CS);ctx.lineTo(BW,r*CS);ctx.stroke()}
    for(let c=0;c<=COLS;c++){ctx.beginPath();ctx.moveTo(c*CS,0);ctx.lineTo(c*CS,BH);ctx.stroke()}
    for(let r=0;r<ROWS;r++)for(let c=0;c<COLS;c++){if(s.board[r][c])drawCell(ctx,c*CS,r*CS,CS,s.board[r][c].color,s.board[r][c].type)}
    if(s.current){s.current.shape.forEach((row,dy)=>row.forEach((v,dx)=>{if(v){const rx=s.current.x+dx,ry=s.current.y+dy;if(ry>=0)drawCell(ctx,rx*CS,ry*CS,CS,s.current.color,s.current.type)}}))}
  }

  function renderNext(){
    const canvas=nextRef.current;if(!canvas||!stateRef.current.next)return
    const ctx=canvas.getContext('2d'),next=stateRef.current.next
    ctx.fillStyle='rgba(200,180,130,0.4)';ctx.fillRect(0,0,88,88)
    const ns=22,offX=Math.floor((4-next.shape[0].length)/2),offY=Math.floor((4-next.shape.length)/2)
    next.shape.forEach((row,dy)=>row.forEach((v,dx)=>{if(v)drawCell(ctx,(offX+dx)*ns,(offY+dy)*ns,ns,next.color,next.type)}))
  }

  // ===== COLLISION =====
  function collides(piece,dx=0,dy=0,shape=null){
    const s=shape||piece.shape
    for(let r=0;r<s.length;r++)for(let c=0;c<s[r].length;c++){
      if(s[r][c]){const nx=piece.x+c+dx,ny=piece.y+r+dy
      if(nx<0||nx>=COLS||ny>=ROWS)return true
      if(ny>=0&&stateRef.current.board[ny][nx])return true}
    }
    return false
  }

  function rotate(piece){
    const s=piece.shape,rot=s[0].map((_,i)=>s.map(row=>row[i]).reverse())
    if(!collides(piece,0,0,rot))piece.shape=rot
  }

  // ===== GAME LOGIC =====
  function place(){
    const s=stateRef.current
    s.current.shape.forEach((row,dy)=>row.forEach((v,dx)=>{if(v){const rx=s.current.x+dx,ry=s.current.y+dy;if(ry>=0)s.board[ry][rx]={color:s.current.color,type:s.current.type}}}))
    sfxDrop();s.stats[s.current.id]++;clearLines(s.current.id)
    s.current=s.next;s.next=drawFromBag();renderNext()
    if(collides(s.current))endGame()
  }

  function clearLines(pieceId){
    const s=stateRef.current;let cleared=0
    for(let r=ROWS-1;r>=0;r--){if(s.board[r].every(c=>c)){s.board.splice(r,1);s.board.unshift(Array(COLS).fill(null));cleared++;r++}}
    if(cleared>0){
      s.lines+=cleared;s.score+=[0,100,300,500,800][cleared]*s.level
      if(s.score>=s.nextHelpScore){s.helps=Math.min(s.helps+1,9);s.nextHelpScore+=5000}
      s.level=Math.floor(s.lines/10)+1
      sfxClear(cleared)
      if(gameLoopRef.current){clearInterval(gameLoopRef.current);gameLoopRef.current=null}
      if(verseGraceRef.current)clearTimeout(verseGraceRef.current)
      verseGraceRef.current=setTimeout(()=>{
        verseGraceRef.current=null
        const st=stateRef.current
        if(st.running&&!st.paused&&!gameLoopRef.current){gameLoopRef.current=setInterval(tick,getSpeed(st.level))}
      },3930)
      triggerVerseShow(pieceId,cleared)
    }
    updateUi()
  }

  function endGame(){
    const s=stateRef.current;s.running=false
    if(gameLoopRef.current){clearInterval(gameLoopRef.current);gameLoopRef.current=null}
    sfxOver();updateUi()
  }

  function tick(){
    const s=stateRef.current
    if(!s.running||s.paused||s.helpActive)return
    if(!collides(s.current,0,1))s.current.y++;else place()
    renderBoard();updateUi()
  }

  // ===== ENV EFFECTS =====
  function runEnvEffect(type,intensity,onDone){
    const canvas=effectRef.current;if(!canvas)return onDone()
    canvas.style.display='block'
    const ctx=canvas.getContext('2d'),dur=700+intensity*250,start=performance.now()
    if(effectAnimRef.current)cancelAnimationFrame(effectAnimRef.current)
    function frame(now){
      const t=Math.min((now-start)/dur,1);ctx.clearRect(0,0,BW,BH)
      if(type==='lightning'&&t<0.7){ctx.fillStyle=`rgba(180,210,255,${0.18*(1-t)})`;ctx.fillRect(0,0,BW,BH);for(let b=0;b<intensity+1;b++){const x=BW*(0.15+b*0.7/(intensity+1))+Math.sin(t*25+b)*15;ctx.strokeStyle=`rgba(180,220,255,${(1-t)*0.95})`;ctx.lineWidth=2.5-t*1.5;ctx.shadowColor='#88ccff';ctx.shadowBlur=18;ctx.beginPath();ctx.moveTo(x,0);let cy2=0;while(cy2<BH){ctx.lineTo(x+Math.sin(t*35+cy2*0.05)*28,cy2);cy2+=15}ctx.stroke()}}
      else if(type==='tornado'){const tx=t*BW*1.3-BW*0.15,topW=20+intensity*5,botW=60+intensity*15;for(let i=0;i<BH;i+=4){const prog=i/BH,w=topW+(botW-topW)*prog,wob=Math.sin(t*15+i*0.04)*w*0.15;ctx.fillStyle=`rgba(60,60,100,${0.6*(1-prog*0.3)})`;ctx.fillRect(tx-w/2+wob,i,w,4)};for(let d=0;d<6+intensity*2;d++){const dy=((t*3+d*0.15)%1)*BH,dw=(20+(60-20)*(dy/BH))*0.8,angle=t*20+d;ctx.strokeStyle='rgba(100,100,150,0.65)';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(tx+Math.cos(angle)*dw,dy);ctx.lineTo(tx-Math.cos(angle)*dw,dy+8);ctx.stroke()}}
      else if(type==='firerain'){const cols=3+intensity;for(let i=0;i<cols;i++){const x=BW*(i+0.5)/cols+Math.sin(t*3+i)*10,offset=(t*1.5+(i*0.3))%1,h=BH*0.7+intensity*40,y=offset*BH*1.4-BH*0.2;const grd=ctx.createLinearGradient(x-8,y,x+8,y+h);grd.addColorStop(0,'rgba(255,220,50,0.9)');grd.addColorStop(0.3,'rgba(255,120,0,0.85)');grd.addColorStop(0.7,'rgba(220,40,0,0.7)');grd.addColorStop(1,'rgba(100,10,0,0)');ctx.fillStyle=grd;const fw=10+intensity*3;ctx.beginPath();ctx.moveTo(x-fw/2,y);for(let j=0;j<h;j+=8){ctx.lineTo(x-fw/2+Math.sin(t*20+j*0.1)*fw*0.4,y+j)}ctx.lineTo(x,y+h);for(let j=h;j>=0;j-=8){ctx.lineTo(x+fw/2+Math.sin(t*20+j*0.1+Math.PI)*fw*0.4,y+j)}ctx.closePath();ctx.fill()}}
      else if(type==='earthquake'&&t<0.8){const shake=Math.sin(t*80)*(1-t)*8*intensity;ctx.save();ctx.translate(shake,shake*0.5);ctx.fillStyle=`rgba(100,60,20,${0.12*(1-t)*intensity})`;ctx.fillRect(-10,-10,BW+20,BH+20);for(let i=0;i<intensity+1;i++){ctx.strokeStyle=`rgba(80,40,10,${0.5*(1-t)})`;ctx.lineWidth=1+intensity*0.5;ctx.beginPath();const sx=BW*0.2+i*BW*0.3;ctx.moveTo(sx,BH*0.3);for(let j=0;j<6;j++)ctx.lineTo(sx+Math.sin(j*2.5+i)*40,BH*0.3+j*40);ctx.stroke()}ctx.restore()}
      else if(type==='pillars'){const np=3+intensity,pw=28+intensity*8;for(let i=0;i<np;i++){const delay=i*0.1,pt=Math.max(0,Math.min(1,(t*2.2-delay)*1.8)),x=-pw+(BW+pw*2)*pt+i*(BW/(np+1));if(pt<=0.01||pt>=0.99)continue;const grd=ctx.createLinearGradient(x,0,x+pw,0);grd.addColorStop(0,'rgba(255,220,50,0)');grd.addColorStop(0.2,'rgba(255,180,0,0.9)');grd.addColorStop(0.5,'rgba(255,60,0,0.95)');grd.addColorStop(0.8,'rgba(255,180,0,0.9)');grd.addColorStop(1,'rgba(255,220,50,0)');ctx.fillStyle=grd;ctx.beginPath();ctx.moveTo(x,0);for(let y2=0;y2<=BH;y2+=6){ctx.lineTo(x+Math.sin(t*25+y2*0.08)*4,y2)}ctx.lineTo(x+pw,BH);for(let y2=BH;y2>=0;y2-=6){ctx.lineTo(x+pw+Math.sin(t*25+y2*0.08+Math.PI)*4,y2)}ctx.closePath();ctx.fill();ctx.fillStyle='rgba(255,255,180,0.4)';ctx.fillRect(x+pw*0.3,0,pw*0.4,BH)};ctx.fillStyle=`rgba(255,80,0,${0.05*intensity*Math.sin(t*Math.PI)})`;ctx.fillRect(0,0,BW,BH)}
      else if(type==='wheel'){const segs=4,segT=t*segs,segIdx=Math.floor(segT),segProg=segT-segIdx;if(segIdx<segs){const startX=segIdx%2===0?-80:BW+80,endX=segIdx%2===0?BW+80:-80,wx=startX+(endX-startX)*segProg,wy=(segIdx/segs)*BH+((1/segs)*BH)*segProg;if(wx>-100&&wx<BW+100){const r=28+intensity*8,angle=t*Math.PI*8;ctx.save();ctx.translate(wx,wy);const grd=ctx.createRadialGradient(0,0,r*0.5,0,0,r*2.2);grd.addColorStop(0,'rgba(255,200,50,0.35)');grd.addColorStop(1,'rgba(255,150,0,0)');ctx.fillStyle=grd;ctx.beginPath();ctx.arc(0,0,r*2.2,0,Math.PI*2);ctx.fill();ctx.rotate(angle);ctx.strokeStyle='rgba(210,160,20,0.95)';ctx.lineWidth=4;ctx.shadowColor='#ffd700';ctx.shadowBlur=12;ctx.beginPath();ctx.arc(0,0,r,0,Math.PI*2);ctx.stroke();ctx.rotate(-angle*2);ctx.strokeStyle='rgba(180,130,10,0.9)';ctx.lineWidth=3;ctx.shadowBlur=6;ctx.beginPath();ctx.arc(0,0,r*0.6,0,Math.PI*2);ctx.stroke();ctx.rotate(angle);ctx.strokeStyle='rgba(200,150,20,0.8)';ctx.lineWidth=2;for(let s=0;s<8;s++){const a=s*Math.PI/4;ctx.beginPath();ctx.moveTo(Math.cos(a)*r*0.6,Math.sin(a)*r*0.6);ctx.lineTo(Math.cos(a)*r,Math.sin(a)*r);ctx.stroke()}ctx.rotate(angle*0.5);for(let e=0;e<12;e++){const ea=e*(Math.PI*2/12),ex=Math.cos(ea)*r*0.88,ey=Math.sin(ea)*r*0.88;ctx.fillStyle='rgba(255,255,255,0.92)';ctx.beginPath();ctx.ellipse(ex,ey,4,2.5,ea,0,Math.PI*2);ctx.fill();ctx.fillStyle='rgba(0,80,200,0.9)';ctx.beginPath();ctx.ellipse(ex,ey,2,1.5,ea,0,Math.PI*2);ctx.fill();ctx.fillStyle='rgba(0,0,0,0.95)';ctx.beginPath();ctx.arc(ex,ey,0.8,0,Math.PI*2);ctx.fill()}ctx.rotate(-angle*0.5);ctx.fillStyle='rgba(255,255,255,0.95)';ctx.beginPath();ctx.ellipse(0,0,7,5,0,0,Math.PI*2);ctx.fill();ctx.fillStyle='rgba(0,120,255,0.95)';ctx.beginPath();ctx.ellipse(0,0,4,3,0,0,Math.PI*2);ctx.fill();ctx.fillStyle='rgba(0,0,0,1)';ctx.beginPath();ctx.arc(0,0,2,0,Math.PI*2);ctx.fill();ctx.restore()}}}
      else if(type==='angels'){for(let a=0;a<1+intensity;a++){const fromLeft=a%2===0,x=fromLeft?t*BW*(0.65+a*0.1):(BW-t*BW*(0.65+a*0.1)),y=BH*(0.18+a*0.22),wp=Math.sin(t*20+a)*0.5+0.5;ctx.save();ctx.translate(x,y);if(!fromLeft)ctx.scale(-1,1);ctx.shadowColor='rgba(255,255,200,0.5)';ctx.shadowBlur=15;ctx.fillStyle='rgba(255,255,220,0.9)';ctx.beginPath();ctx.ellipse(0,0,12,18,0,0,Math.PI*2);ctx.fill();ctx.fillStyle='rgba(255,255,255,0.8)';ctx.beginPath();ctx.moveTo(-5,-5);ctx.bezierCurveTo(-30,-22,-38,6,-10,9);ctx.closePath();ctx.fill();ctx.beginPath();ctx.moveTo(-5,6);ctx.bezierCurveTo(-30,18,-38,32,-10,22);ctx.closePath();ctx.fill();ctx.strokeStyle='rgba(255,215,0,0.95)';ctx.lineWidth=2.5;ctx.shadowColor='#ffd700';ctx.shadowBlur=8;ctx.beginPath();ctx.ellipse(0,-24,11,4,0,0,Math.PI*2);ctx.stroke();ctx.shadowBlur=0;ctx.fillStyle='rgba(255,200,50,0.95)';ctx.beginPath();ctx.moveTo(8,-5);ctx.lineTo(28,-9);ctx.lineTo(32,-3);ctx.lineTo(8,1);ctx.closePath();ctx.fill();for(let w=0;w<3;w++){ctx.strokeStyle=`rgba(255,215,0,${(0.7-w*0.2)*wp})`;ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(32,-3,8+w*7,Math.PI*1.3,Math.PI*0.7);ctx.stroke()}ctx.restore()}}
      if(t<1)effectAnimRef.current=requestAnimationFrame(frame)
      else{canvas.style.display='none';ctx.clearRect(0,0,BW,BH);onDone()}
    }
    effectAnimRef.current=requestAnimationFrame(frame)
  }

  // ===== VERSE ANIMATION =====
  function showVerseAnimated(text,style,intensity){
    if(verseAnimRef.current)cancelAnimationFrame(verseAnimRef.current)
    const box=verseRef.current;if(!box)return
    box.textContent=text;box.style.display='block';box.style.opacity='1'
    const startY=BH/2-60,endY=-180,travelY=startY-endY
    const entranceDur=500,totalDur=3250+intensity*250,start=performance.now()
    function frame(now){
      const elapsed=now-start,eT=Math.min(elapsed/entranceDur,1)
      const driftT=Math.min(Math.max(0,elapsed-entranceDur)/(totalDur-entranceDur),1)
      const currentY=startY-travelY*driftT
      let et='',op=1
      switch(style){
        case 'zoom':et=`scale(${eT<0.5?0.1+eT*1.8:1})`;op=eT;break
        case 'slideLeft':et=`translateX(${(1-eT)*-280}px)`;op=eT;break
        case 'slideRight':et=`translateX(${(1-eT)*280}px)`;op=eT;break
        case 'slideTop':et=`translateY(${(1-eT)*-120}px)`;op=eT;break
        case 'ninjastar':et=`rotate(${(1-eT)*720}deg) scale(${eT<0.3?eT*3.3:1})`;op=eT;break
        case 'crystallize':et=`scale(${0.3+eT*0.7})`;op=eT;break
        case 'bounce':const b=eT<0.6?Math.sin(eT*Math.PI)*(-60):Math.sin(eT*Math.PI*2)*(-15*(1-eT));et=`translateY(${b}px)`;op=eT;break
        default:op=eT
      }
      box.style.top=`${currentY}px`
      box.style.transform=eT>=1?`translateX(-50%)`:`translateX(-50%) ${et}`
      box.style.opacity=String(op)
      if(elapsed<totalDur)verseAnimRef.current=requestAnimationFrame(frame)
      else box.style.display='none'
    }
    verseAnimRef.current=requestAnimationFrame(frame)
  }

  function triggerVerseShow(pieceId,intensity){
    const s=stateRef.current
    const verse=getVerse(pieceId)
    s.lastVerse=verse
    // Alternate between env effect and verse style
    if(s.useEnvNext){
      if(!s.envBag.length)s.envBag=[...ENV_EFFECTS].sort(()=>Math.random()-0.5)
      const envType=s.envBag.shift();s.useEnvNext=false
      runEnvEffect(envType,intensity,()=>{
        if(!s.verseBag.length)s.verseBag=[...VERSE_STYLES].sort(()=>Math.random()-0.5)
        showVerseAnimated(verse,s.verseBag.shift(),intensity+5.5)
      })
    } else {
      s.useEnvNext=true
      if(!s.verseBag.length)s.verseBag=[...VERSE_STYLES].sort(()=>Math.random()-0.5)
      showVerseAnimated(verse,s.verseBag.shift(),intensity+5.5)
    }
    updateUi()
  }

  // ===== HELP ANIMATIONS =====
  function captureParticles(){
    const s=stateRef.current;s.particles=[]
    for(let r=0;r<ROWS;r++)for(let c=0;c<COLS;c++){
      if(s.board[r][c]){s.particles.push({x:c*CS+CS/2,y:r*CS+CS/2,origX:c*CS+CS/2,origY:r*CS+CS/2,color:s.board[r][c].color,type:s.board[r][c].type,vx:0,vy:0,alpha:1,scale:1,rotation:0,wobble:Math.random()*Math.PI*2,dir:c<COLS/2?r<ROWS/2?'nw':'sw':r<ROWS/2?'ne':'se'})}}
  }

  function finishHelp(verse,slow){
    const s=stateRef.current
    s.board=Array.from({length:ROWS},()=>Array(COLS).fill(null))
    s.helpActive=false
    const hc=helpRef.current;if(hc){hc.style.display='none';hc.getContext('2d').clearRect(0,0,BW,BH)}
    if(helpAnimRef.current){cancelAnimationFrame(helpAnimRef.current);helpAnimRef.current=null}
    renderBoard();s.lastVerse=verse
    showVerseAnimated(verse,'zoom',25)
    if(gameLoopRef.current){clearInterval(gameLoopRef.current);gameLoopRef.current=null}
    if(verseGraceRef.current)clearTimeout(verseGraceRef.current)
    verseGraceRef.current=setTimeout(()=>{
      verseGraceRef.current=null
      const st=stateRef.current
      if(st.running&&!st.paused&&!gameLoopRef.current){gameLoopRef.current=setInterval(tick,getSpeed(st.level))}
    },7550)
    updateUi()
  }

  function runSwordHelp(verse){
    // SWORD: Large medieval flaming sword pointing UP, Hebrew "דבר אלוהים" in blood red on blade
    // Lightning background, blocks split in half (tops fly up, bottoms fall down)
    const canvas=helpRef.current;if(!canvas)return
    canvas.style.display='block'
    const ctx=canvas.getContext('2d'),dur=2800,start=performance.now()
    const particles=[...stateRef.current.particles]
    function frame(now){
      const t=Math.min((now-start)/dur,1);ctx.clearRect(0,0,BW,BH)
      // Lightning background
      if(t<0.5){
        const flash=Math.sin(t*50)*0.5+0.5
        ctx.fillStyle=`rgba(80,100,200,${0.35*flash*(1-t*1.5)})`;ctx.fillRect(0,0,BW,BH)
        if(flash>0.6){for(let b=0;b<4;b++){const bx=BW*(0.1+b*0.25)+Math.sin(t*30+b)*20;ctx.strokeStyle=`rgba(160,200,255,${flash*0.9})`;ctx.lineWidth=2;ctx.shadowColor='#aaddff';ctx.shadowBlur=20;ctx.beginPath();ctx.moveTo(bx,0);let y2=0;while(y2<BH){ctx.lineTo(bx+Math.sin(t*40+y2)*22,y2);y2+=12}ctx.stroke()}}
      }
      // Blocks splitting
      if(t>0.25){
        const splitT=(t-0.25)/0.75
        particles.forEach(p=>{
          if(splitT<0.2){
            // Vibrate before split
            const vib=Math.sin(splitT*100)*5*(1-splitT*5)
            ctx.save();ctx.globalAlpha=1
            ctx.fillStyle=p.color;ctx.strokeStyle=p.color;ctx.lineWidth=2
            // Top half
            ctx.beginPath();ctx.roundRect(p.origX-CS/2+vib,p.origY-CS/2,CS-2,CS/2-1,2);ctx.fill();ctx.stroke()
            // Bottom half
            ctx.beginPath();ctx.roundRect(p.origX-CS/2+vib,p.origY,CS-2,CS/2-1,2);ctx.fill();ctx.stroke()
            ctx.restore()
          } else {
            const st=(splitT-0.2)/0.8
            const topY=p.origY-CS/2-st*BH*1.4
            const botY=p.origY+st*BH*1.4
            const lateral=Math.sin(p.wobble)*st*30
            ctx.save();ctx.globalAlpha=Math.max(0,1-st*1.3)
            ctx.fillStyle=p.color;ctx.strokeStyle=p.color;ctx.lineWidth=2
            ctx.beginPath();ctx.roundRect(p.origX-CS/2+lateral,topY,CS-2,CS/2-1,2);ctx.fill();ctx.stroke()
            ctx.beginPath();ctx.roundRect(p.origX-CS/2-lateral,botY,CS-2,CS/2-1,2);ctx.fill();ctx.stroke()
            ctx.restore()
          }
        })
      }
      // Draw sword
      if(t>0.05&&t<0.9){
        const swordT=Math.min((t-0.05)/0.2,1)
        const cx=BW/2,bladeTop=30,bladeH=BH*0.62,guardY=bladeTop+bladeH,handleH=80
        ctx.save();ctx.globalAlpha=swordT
        // Big flames on both sides of blade
        for(let fy=bladeTop;fy<guardY;fy+=15){
          const prog=(fy-bladeTop)/bladeH,fInt=Math.sin(t*18+fy*0.06)*0.4+0.6
          const flameW=15+prog*8
          ctx.globalAlpha=swordT*fInt*0.85
          // Left flames
          ctx.fillStyle=`hsl(${15+prog*15},100%,45%)`;ctx.beginPath();ctx.moveTo(cx-10,fy+18);ctx.bezierCurveTo(cx-10-flameW*1.4,fy+5,cx-10-flameW*0.8,fy-12,cx-10,fy);ctx.closePath();ctx.fill()
          ctx.fillStyle='rgba(255,180,0,0.7)';ctx.beginPath();ctx.moveTo(cx-10,fy+12);ctx.bezierCurveTo(cx-10-flameW*0.9,fy+3,cx-10-flameW*0.5,fy-7,cx-10,fy);ctx.closePath();ctx.fill()
          // Right flames
          ctx.fillStyle=`hsl(${15+prog*15},100%,45%)`;ctx.beginPath();ctx.moveTo(cx+10,fy+18);ctx.bezierCurveTo(cx+10+flameW*1.4,fy+5,cx+10+flameW*0.8,fy-12,cx+10,fy);ctx.closePath();ctx.fill()
          ctx.fillStyle='rgba(255,180,0,0.7)';ctx.beginPath();ctx.moveTo(cx+10,fy+12);ctx.bezierCurveTo(cx+10+flameW*0.9,fy+3,cx+10+flameW*0.5,fy-7,cx+10,fy);ctx.closePath();ctx.fill()
        }
        ctx.globalAlpha=swordT
        // Blade (steel silver-blue)
        const bladeGrd=ctx.createLinearGradient(cx-10,0,cx+10,0)
        bladeGrd.addColorStop(0,'rgba(120,150,200,0.95)');bladeGrd.addColorStop(0.4,'rgba(220,235,255,1)');bladeGrd.addColorStop(0.6,'rgba(220,235,255,1)');bladeGrd.addColorStop(1,'rgba(120,150,200,0.95)')
        ctx.fillStyle=bladeGrd
        ctx.beginPath();ctx.moveTo(cx,bladeTop);ctx.lineTo(cx+10,bladeTop+bladeH*0.5);ctx.lineTo(cx+10,guardY);ctx.lineTo(cx-10,guardY);ctx.lineTo(cx-10,bladeTop+bladeH*0.5);ctx.closePath();ctx.fill()
        ctx.strokeStyle='rgba(80,120,200,0.6)';ctx.lineWidth=1;ctx.stroke()
        // Center fuller (groove down middle)
        ctx.strokeStyle='rgba(255,255,255,0.5)';ctx.lineWidth=1.5
        ctx.beginPath();ctx.moveTo(cx,bladeTop+20);ctx.lineTo(cx,guardY-10);ctx.stroke()
        // Hebrew text "דבר אלוהים" blood red carved into blade
        ctx.fillStyle='rgba(160,0,0,0.92)';ctx.font='bold 13px serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.shadowColor='rgba(0,0,0,0.8)';ctx.shadowBlur=3
        const heb=['ד','ב','ר',' ','א','ל','ו','ה','י','ם']
        heb.forEach((ch,i)=>{ctx.fillText(ch,cx,bladeTop+35+i*22)})
        ctx.shadowBlur=0
        // Guard (ornate crossguard)
        const guardGrd=ctx.createLinearGradient(cx-45,guardY-9,cx+45,guardY+9)
        guardGrd.addColorStop(0,'#5a3008');guardGrd.addColorStop(0.2,'#c89020');guardGrd.addColorStop(0.5,'#f8e060');guardGrd.addColorStop(0.8,'#c89020');guardGrd.addColorStop(1,'#5a3008')
        ctx.fillStyle=guardGrd;ctx.shadowColor='#ffd700';ctx.shadowBlur=8
        ctx.beginPath();ctx.roundRect(cx-45,guardY-9,90,18,4);ctx.fill()
        ctx.strokeStyle='rgba(255,215,0,0.6)';ctx.lineWidth=1;ctx.stroke()
        ctx.shadowBlur=0
        // Handle
        const handleGrd=ctx.createLinearGradient(cx-7,0,cx+7,0)
        handleGrd.addColorStop(0,'#5a2808');handleGrd.addColorStop(0.5,'#c87030');handleGrd.addColorStop(1,'#5a2808')
        ctx.fillStyle=handleGrd;ctx.beginPath();ctx.roundRect(cx-7,guardY+9,14,handleH,3);ctx.fill()
        // Grip wrapping
        ctx.strokeStyle='rgba(100,50,10,0.7)';ctx.lineWidth=2
        for(let i=0;i<6;i++){ctx.beginPath();ctx.moveTo(cx-7,guardY+15+i*12);ctx.lineTo(cx+7,guardY+15+i*12);ctx.stroke()}
        // Pommel
        ctx.fillStyle='#c89018';ctx.shadowColor='#ffd700';ctx.shadowBlur=10
        ctx.beginPath();ctx.arc(cx,guardY+9+handleH+8,10,0,Math.PI*2);ctx.fill()
        ctx.shadowBlur=0
        // Glow around sword
        const glowGrd=ctx.createRadialGradient(cx,BH/2,20,cx,BH/2,160)
        glowGrd.addColorStop(0,'rgba(100,150,255,0.15)');glowGrd.addColorStop(1,'rgba(100,150,255,0)')
        ctx.globalAlpha=swordT*0.6;ctx.fillStyle=glowGrd;ctx.beginPath();ctx.ellipse(cx,BH/2,160,BH*0.55,0,0,Math.PI*2);ctx.fill()
        ctx.restore()
      }
      if(t<1)helpAnimRef.current=requestAnimationFrame(frame)
      else finishHelp(verse)
    }
    helpAnimRef.current=requestAnimationFrame(frame)
  }

  function runDoveHelp(verse){
    // DOVE: White body, HUGE fire wings, rapid flapping, blocks blown N/E/W/S with rotation
    const canvas=helpRef.current;if(!canvas)return
    canvas.style.display='block'
    const ctx=canvas.getContext('2d'),dur=2500,start=performance.now()
    const particles=stateRef.current.particles.map(p=>{
      const speed=10+Math.random()*8
      const dirs={nw:{vx:-speed*0.8,vy:-speed},sw:{vx:-speed*0.8,vy:speed},ne:{vx:speed*0.8,vy:-speed},se:{vx:speed*0.8,vy:speed}}
      const d=dirs[p.dir]||{vx:(Math.random()-0.5)*speed*2,vy:(Math.random()-0.5)*speed*2}
      return{...p,vx:d.vx,vy:d.vy,rot:0,rotV:(Math.random()-0.5)*0.3}
    })
    function frame(now){
      const t=Math.min((now-start)/dur,1);ctx.clearRect(0,0,BW,BH)
      // Orange wind glow
      const bgA=Math.sin(t*Math.PI)*0.25
      ctx.fillStyle=`rgba(255,120,0,${bgA})`;ctx.fillRect(0,0,BW,BH)
      // Flying particles
      if(t>0.08){
        const flyT=(t-0.08)/0.92
        particles.forEach(p=>{
          const accel=1+flyT*4
          p.x+=p.vx*accel*0.5;p.y+=p.vy*accel*0.5;p.rot+=p.rotV
          ctx.save();ctx.globalAlpha=Math.max(0,1-flyT*1.2)
          ctx.translate(p.x,p.y);ctx.rotate(p.rot)
          ctx.fillStyle=p.color;ctx.strokeStyle=p.color;ctx.lineWidth=2
          ctx.beginPath();ctx.roundRect(-CS/2,-CS/2,CS-2,CS-2,3);ctx.fill();ctx.stroke()
          ctx.restore()
        })
      }
      // Draw fiery dove — LARGE
      const cx=BW/2,cy=BH/2-20
      const wingFlap=Math.sin(t*25)*0.55 // rapid flap
      const appear=Math.min(t*2.5,1),sz=120
      ctx.save();ctx.globalAlpha=appear
      // Outer fire aura
      const auraGrd=ctx.createRadialGradient(cx,cy,15,cx,cy,sz*1.8)
      auraGrd.addColorStop(0,'rgba(255,200,50,0.45)');auraGrd.addColorStop(0.4,'rgba(255,80,0,0.2)');auraGrd.addColorStop(1,'rgba(255,50,0,0)')
      ctx.fillStyle=auraGrd;ctx.beginPath();ctx.arc(cx,cy,sz*1.8,0,Math.PI*2);ctx.fill()
      // Fire sparks/embers
      for(let e=0;e<20;e++){
        const ex=cx+(Math.sin(t*8+e*0.8)*sz*1.3)*(Math.sin(t*15+e)*0.5+0.5)
        const ey=cy+(Math.cos(t*7+e*0.6)*sz*0.8)*(Math.sin(t*12+e*1.2)*0.5+0.5)-Math.abs(Math.sin(t*10+e))*sz*0.3
        ctx.fillStyle=`hsl(${30+e*4},100%,${55+Math.sin(t*20+e)*20}%)`;ctx.globalAlpha=appear*0.7
        ctx.beginPath();ctx.arc(ex,ey,2+Math.sin(t*15+e)*1.5,0,Math.PI*2);ctx.fill()
      }
      ctx.globalAlpha=appear
      // LEFT WING — huge fire wing
      ctx.save();ctx.translate(cx,cy);ctx.rotate(-0.25+wingFlap*0.8)
      const lwGrd=ctx.createRadialGradient(-sz*0.25,-sz*0.15,0,-sz*0.6,-sz*0.3,sz*1.1)
      lwGrd.addColorStop(0,'rgba(255,230,120,0.98)');lwGrd.addColorStop(0.15,'rgba(255,160,0,0.95)');lwGrd.addColorStop(0.4,'rgba(255,80,0,0.9)');lwGrd.addColorStop(0.7,'rgba(200,30,0,0.7)');lwGrd.addColorStop(1,'rgba(150,10,0,0)')
      ctx.fillStyle=lwGrd
      // Main wing shape
      ctx.beginPath();ctx.moveTo(-12,-8);ctx.bezierCurveTo(-sz*0.5,-sz*0.4,-sz*1.0,-sz*0.15,-sz*0.85,sz*0.12);ctx.bezierCurveTo(-sz*0.6,sz*0.25,-sz*0.25,sz*0.15,-8,sz*0.05);ctx.closePath();ctx.fill()
      // Secondary feathers below
      ctx.fillStyle='rgba(255,100,0,0.8)'
      ctx.beginPath();ctx.moveTo(-8,sz*0.05);ctx.bezierCurveTo(-sz*0.4,sz*0.3,-sz*0.7,sz*0.5,-sz*0.5,sz*0.35);ctx.bezierCurveTo(-sz*0.3,sz*0.2,-sz*0.1,sz*0.1,-8,sz*0.05);ctx.closePath();ctx.fill()
      // Feather tips glow
      ctx.strokeStyle='rgba(255,220,80,0.6)';ctx.lineWidth=2
      for(let f=0;f<6;f++){const fa=f*0.18-0.4;ctx.beginPath();ctx.moveTo(-15,-5);ctx.lineTo(-sz*0.9*Math.cos(fa)+Math.sin(fa)*sz*0.2,sz*0.6*Math.sin(fa-0.3));ctx.stroke()}
      ctx.restore()
      // RIGHT WING — huge fire wing (mirror)
      ctx.save();ctx.translate(cx,cy);ctx.rotate(0.25-wingFlap*0.8)
      const rwGrd=ctx.createRadialGradient(sz*0.25,-sz*0.15,0,sz*0.6,-sz*0.3,sz*1.1)
      rwGrd.addColorStop(0,'rgba(255,230,120,0.98)');rwGrd.addColorStop(0.15,'rgba(255,160,0,0.95)');rwGrd.addColorStop(0.4,'rgba(255,80,0,0.9)');rwGrd.addColorStop(0.7,'rgba(200,30,0,0.7)');rwGrd.addColorStop(1,'rgba(150,10,0,0)')
      ctx.fillStyle=rwGrd
      ctx.beginPath();ctx.moveTo(12,-8);ctx.bezierCurveTo(sz*0.5,-sz*0.4,sz*1.0,-sz*0.15,sz*0.85,sz*0.12);ctx.bezierCurveTo(sz*0.6,sz*0.25,sz*0.25,sz*0.15,8,sz*0.05);ctx.closePath();ctx.fill()
      ctx.fillStyle='rgba(255,100,0,0.8)'
      ctx.beginPath();ctx.moveTo(8,sz*0.05);ctx.bezierCurveTo(sz*0.4,sz*0.3,sz*0.7,sz*0.5,sz*0.5,sz*0.35);ctx.bezierCurveTo(sz*0.3,sz*0.2,sz*0.1,sz*0.1,8,sz*0.05);ctx.closePath();ctx.fill()
      ctx.strokeStyle='rgba(255,220,80,0.6)';ctx.lineWidth=2
      for(let f=0;f<6;f++){const fa=f*0.18+0.1;ctx.beginPath();ctx.moveTo(15,-5);ctx.lineTo(sz*0.9*Math.cos(fa)+Math.sin(fa)*sz*0.2,sz*0.6*Math.sin(fa-0.3));ctx.stroke()}
      ctx.restore()
      // White dove body
      const bodyGrd=ctx.createRadialGradient(cx,cy-8,5,cx,cy,sz*0.32)
      bodyGrd.addColorStop(0,'rgba(255,255,255,1)');bodyGrd.addColorStop(0.4,'rgba(255,240,210,0.95)');bodyGrd.addColorStop(1,'rgba(255,180,80,0.6)')
      ctx.fillStyle=bodyGrd;ctx.beginPath();ctx.ellipse(cx,cy,sz*0.18,sz*0.28,0,0,Math.PI*2);ctx.fill()
      // Head
      ctx.fillStyle='rgba(255,255,255,1)';ctx.beginPath();ctx.arc(cx,cy-sz*0.24,sz*0.11,0,Math.PI*2);ctx.fill()
      // Golden halo
      ctx.strokeStyle='rgba(255,215,0,0.95)';ctx.lineWidth=3;ctx.shadowColor='#ffd700';ctx.shadowBlur=15
      ctx.beginPath();ctx.arc(cx,cy-sz*0.24,sz*0.18,0,Math.PI*2);ctx.stroke()
      ctx.shadowBlur=0
      // Eye
      ctx.fillStyle='rgba(80,40,0,1)';ctx.beginPath();ctx.arc(cx+sz*0.05,cy-sz*0.26,sz*0.02,0,Math.PI*2);ctx.fill()
      // Beak
      ctx.fillStyle='rgba(255,160,0,0.9)';ctx.beginPath();ctx.moveTo(cx+sz*0.11,cy-sz*0.24);ctx.lineTo(cx+sz*0.22,cy-sz*0.21);ctx.lineTo(cx+sz*0.11,cy-sz*0.19);ctx.closePath();ctx.fill()
      // Fire tail feathers
      ctx.fillStyle='rgba(255,120,0,0.85)'
      ctx.beginPath();ctx.moveTo(cx-sz*0.1,cy+sz*0.22);ctx.lineTo(cx-sz*0.22,cy+sz*0.5);ctx.lineTo(cx,cy+sz*0.26);ctx.closePath();ctx.fill()
      ctx.beginPath();ctx.moveTo(cx+sz*0.1,cy+sz*0.22);ctx.lineTo(cx+sz*0.22,cy+sz*0.5);ctx.lineTo(cx,cy+sz*0.26);ctx.closePath();ctx.fill()
      ctx.fillStyle='rgba(255,200,50,0.7)';ctx.beginPath();ctx.moveTo(cx,cy+sz*0.22);ctx.lineTo(cx,cy+sz*0.55);ctx.lineTo(cx+sz*0.06,cy+sz*0.25);ctx.closePath();ctx.fill()
      ctx.restore()
      if(t<1)helpAnimRef.current=requestAnimationFrame(frame)
      else finishHelp(verse)
    }
    helpAnimRef.current=requestAnimationFrame(frame)
  }

  function runCrossHelp(verse){
    // CROSS: 3D beveled gold cross with fire glow, blocks scramble with arms/legs then melt
    const canvas=helpRef.current;if(!canvas)return
    canvas.style.display='block'
    const ctx=canvas.getContext('2d'),dur=3000,start=performance.now()
    const particles=stateRef.current.particles.map(p=>({...p,sx:(Math.random()-0.5)*4,sy:(Math.random()-0.5)*4,wobble:Math.random()*Math.PI*2}))
    function frame(now){
      const t=Math.min((now-start)/dur,1);ctx.clearRect(0,0,BW,BH)
      // Gold glow background
      ctx.fillStyle=`rgba(255,200,0,${Math.sin(t*Math.PI)*0.12})`;ctx.fillRect(0,0,BW,BH)
      // Scrambling blocks
      const meltT=Math.max(0,(t-0.55)/0.45)
      particles.forEach(p=>{
        p.x=p.origX+Math.sin(t*28+p.wobble)*22*(1-meltT)
        p.y=p.origY+Math.cos(t*22+p.wobble*1.3)*16*(1-meltT)
        const alpha=Math.max(0,1-meltT*1.6),sc=1-meltT*0.85
        ctx.save();ctx.globalAlpha=alpha;ctx.translate(p.x,p.y);ctx.scale(sc,sc);ctx.rotate(Math.sin(t*18+p.wobble)*0.35)
        ctx.fillStyle=p.color;ctx.beginPath();ctx.roundRect(-CS/2,-CS/2,CS-2,CS-2,3);ctx.fill()
        ctx.strokeStyle=p.color;ctx.lineWidth=2;ctx.stroke()
        // Tiny arms
        ctx.strokeStyle='rgba(255,255,255,0.85)';ctx.lineWidth=2;ctx.lineCap='round'
        const armA=Math.sin(t*22+p.wobble)*0.9
        ctx.beginPath();ctx.moveTo(-CS/2,0);ctx.lineTo(-CS/2-9*Math.cos(armA),-9*Math.sin(armA));ctx.stroke()
        ctx.beginPath();ctx.moveTo(CS/2,0);ctx.lineTo(CS/2+9*Math.cos(armA),-9*Math.sin(armA));ctx.stroke()
        const legA=Math.sin(t*28+p.wobble+1)*0.7
        ctx.beginPath();ctx.moveTo(-CS/4,CS/2);ctx.lineTo(-CS/4-7*Math.sin(legA),CS/2+9);ctx.stroke()
        ctx.beginPath();ctx.moveTo(CS/4,CS/2);ctx.lineTo(CS/4+7*Math.sin(legA),CS/2+9);ctx.stroke()
        // Tiny eyes
        if(sc>0.35){ctx.fillStyle='white';ctx.beginPath();ctx.arc(-4,-5,2.5,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(4,-5,2.5,0,Math.PI*2);ctx.fill();ctx.fillStyle='black';ctx.beginPath();ctx.arc(-4+Math.sin(t*18+p.wobble)*1.5,-5,1.2,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(4+Math.sin(t*18+p.wobble)*1.5,-5,1.2,0,Math.PI*2);ctx.fill()}
        if(meltT>0.2){ctx.fillStyle=`${p.color}88`;ctx.beginPath();ctx.ellipse(0,CS/2+meltT*CS*0.7,CS*0.28,meltT*CS*0.45,0,0,Math.PI*2);ctx.fill()}
        ctx.restore()
      })
      // Draw 3D beveled gold cross
      if(t>0.08){
        const appear=Math.min((t-0.08)/0.18,1)
        const cx=BW/2,cy=BH*0.42
        const cw=34,cvh=160,chw=120,chh=34,armY=cy-18
        ctx.save();ctx.globalAlpha=appear
        function crossPath(inset){
          const i=inset
          ctx.beginPath()
          ctx.moveTo(cx-cw/2+i,cy-cvh/2+i)
          ctx.lineTo(cx-cw/2+i,armY-chh/2+i)
          ctx.lineTo(cx-chw/2+i,armY-chh/2+i)
          ctx.lineTo(cx-chw/2+i,armY+chh/2-i)
          ctx.lineTo(cx-cw/2+i,armY+chh/2-i)
          ctx.lineTo(cx-cw/2+i,cy+cvh/2-i)
          ctx.lineTo(cx+cw/2-i,cy+cvh/2-i)
          ctx.lineTo(cx+cw/2-i,armY+chh/2-i)
          ctx.lineTo(cx+chw/2-i,armY+chh/2-i)
          ctx.lineTo(cx+chw/2-i,armY-chh/2+i)
          ctx.lineTo(cx+cw/2-i,armY-chh/2+i)
          ctx.lineTo(cx+cw/2-i,cy-cvh/2+i)
          ctx.closePath()
        }
        // Outer glow
        ctx.shadowColor='#ffd700';ctx.shadowBlur=50;crossPath(0);ctx.fillStyle='#8B5A0A';ctx.fill();ctx.shadowBlur=0
        // Dark outer bevel
        crossPath(0);ctx.fillStyle='#6a3808';ctx.fill()
        // Main gold gradient body
        const mainGrd=ctx.createLinearGradient(cx-chw/2,0,cx+chw/2,0)
        mainGrd.addColorStop(0,'#5a3005');mainGrd.addColorStop(0.06,'#a06010');mainGrd.addColorStop(0.18,'#d49020');mainGrd.addColorStop(0.32,'#f0c040');mainGrd.addColorStop(0.5,'#fef0a0');mainGrd.addColorStop(0.68,'#f0c040');mainGrd.addColorStop(0.82,'#d49020');mainGrd.addColorStop(0.94,'#a06010');mainGrd.addColorStop(1,'#5a3005')
        crossPath(5);ctx.fillStyle=mainGrd;ctx.fill()
        // Vertical light gradient overlay
        const vertGrd=ctx.createLinearGradient(0,cy-cvh/2,0,cy+cvh/2)
        vertGrd.addColorStop(0,'rgba(255,255,200,0.2)');vertGrd.addColorStop(0.3,'rgba(255,255,200,0.05)');vertGrd.addColorStop(1,'rgba(0,0,0,0.2)')
        crossPath(5);ctx.fillStyle=vertGrd;ctx.fill()
        // Inner border highlight line
        crossPath(9);ctx.strokeStyle='rgba(255,250,200,0.75)';ctx.lineWidth=1.5;ctx.stroke()
        // Inner panel fill
        const innerGrd=ctx.createLinearGradient(cx-chw/2,0,cx+chw/2,0)
        innerGrd.addColorStop(0,'#a07018');innerGrd.addColorStop(0.3,'#e0b030');innerGrd.addColorStop(0.5,'#f8e060');innerGrd.addColorStop(0.7,'#e0b030');innerGrd.addColorStop(1,'#a07018')
        crossPath(11);ctx.fillStyle=innerGrd;ctx.fill()
        // Second inner border
        crossPath(14);ctx.strokeStyle='rgba(255,250,220,0.5)';ctx.lineWidth=1;ctx.stroke()
        // Fire glow around cross
        const pulse=Math.sin(t*7)*0.3+0.7
        ctx.strokeStyle=`rgba(255,200,0,${pulse*0.35*appear})`;ctx.lineWidth=3;ctx.shadowColor='#ffd700';ctx.shadowBlur=25;crossPath(0);ctx.stroke()
        ctx.shadowBlur=0
        // Fire embers around cross
        for(let e=0;e<12;e++){
          const ea=t*3+e*0.52,er=95+Math.sin(t*4+e)*20
          const ex=cx+Math.cos(ea)*er,ey=armY+Math.sin(ea)*er
          ctx.fillStyle=`hsl(${35+e*5},100%,${55+Math.sin(t*10+e)*20}%)`
          ctx.globalAlpha=appear*(Math.sin(t*8+e)*0.4+0.5)
          ctx.beginPath();ctx.arc(ex,ey,2.5+Math.sin(t*12+e)*1.5,0,Math.PI*2);ctx.fill()
        }
        ctx.restore()
      }
      if(t<1)helpAnimRef.current=requestAnimationFrame(frame)
      else finishHelp(verse,true)
    }
    helpAnimRef.current=requestAnimationFrame(frame)
  }

  function useHelp(){
    const s=stateRef.current
    if(s.helps<=0||s.helpActive||!s.running||s.paused)return
    s.helps--;s.helpActive=true;sfxHelp();captureParticles()
    const type=['sword','dove','cross'][s.helpCycle%3];s.helpCycle++
    const verse=HELP_VERSES[type]
    if(type==='sword')runSwordHelp(verse)
    else if(type==='dove')runDoveHelp(verse)
    else runCrossHelp(verse)
    updateUi()
  }

  // ===== START/PAUSE =====
  function startGame(){
    if(gameLoopRef.current)clearInterval(gameLoopRef.current)
    if(helpAnimRef.current){cancelAnimationFrame(helpAnimRef.current);helpAnimRef.current=null}
    if(effectAnimRef.current){cancelAnimationFrame(effectAnimRef.current);effectAnimRef.current=null}
    if(verseAnimRef.current){cancelAnimationFrame(verseAnimRef.current);verseAnimRef.current=null}
    const hc=helpRef.current;if(hc){hc.style.display='none';hc.getContext('2d').clearRect(0,0,BW,BH)}
    const ec=effectRef.current;if(ec){ec.style.display='none';ec.getContext('2d').clearRect(0,0,BW,BH)}
    const vb=verseRef.current;if(vb)vb.style.display='none'
    const s=stateRef.current
    s.board=Array.from({length:ROWS},()=>Array(COLS).fill(null))
    s.score=0;s.lines=0;s.level=1;s.stats=[0,0,0,0,0,0,0]
    s.helps=3;s.helpActive=false;s.helpCycle=0;s.nextHelpScore=5000
    s.bag=[];s.bagUsed=[];s.usedVerses=[{},{},{},{},{},{},{}]
    s.envBag=[...ENV_EFFECTS].sort(()=>Math.random()-0.5)
    s.verseBag=[...VERSE_STYLES].sort(()=>Math.random()-0.5)
    s.useEnvNext=true;s.lastVerse='Clear a line...'
    shuffleBag()
    s.current=drawFromBag();s.next=drawFromBag()
    s.running=true;s.paused=false
    renderBoard();renderNext()
    gameLoopRef.current=setInterval(tick,getSpeed(1))
    updateUi()
  }

  function togglePause(){
    const s=stateRef.current;if(!s.running)return
    s.paused=!s.paused
    if(s.paused){if(gameLoopRef.current){clearInterval(gameLoopRef.current);gameLoopRef.current=null}}
    else{gameLoopRef.current=setInterval(tick,getSpeed(s.level))}
    updateUi()
  }

  function toggleMusic(){
    const s=stateRef.current
    if(s.musicOn)stopMusic()
    else startMusic()
    s.musicOn=!s.musicOn
    updateUi()
  }

  // ===== KEYBOARD =====
  useEffect(()=>{
    function onKey(e){
      const s=stateRef.current
      if(e.key==='p'||e.key==='P'){togglePause();return}
      if(e.key==='m'||e.key==='M'){toggleMusic();return}
      if(e.key==='h'||e.key==='H'){useHelp();return}
      if(!s.running||s.paused||s.helpActive)return
      if(e.key==='ArrowLeft'){if(!collides(s.current,-1,0)){s.current.x--;renderBoard()}}
      else if(e.key==='ArrowRight'){if(!collides(s.current,1,0)){s.current.x++;renderBoard()}}
      else if(e.key==='ArrowDown'){if(!collides(s.current,0,1)){s.current.y++;renderBoard()}else place()}
      else if(e.key==='ArrowUp'){rotate(s.current);renderBoard()}
      else if(e.key===' '){e.preventDefault();while(!collides(s.current,0,1))s.current.y++;place()}
      else return
      e.preventDefault()
    }
    window.addEventListener('keydown',onKey)
    return()=>window.removeEventListener('keydown',onKey)
  },[])

  // ===== RENDER INITIAL BG =====
  useEffect(()=>{
    getBg()
    renderBoard()
  },[])

  const STAT_LABELS=['תּוֹרָה','נְבִיאִים','כְּתוּבִים','Εὐαγγέλιον','Ἐπιστολή','Ἀποκάλυψις','Messianic']

  return(
    <div style={{display:'flex',gap:12,padding:16,justifyContent:'center',alignItems:'flex-start',fontFamily:'monospace'}}>
      {/* STATS PANEL */}
      <div style={{width:176,background:'rgba(255,255,255,0.93)',borderRadius:8,padding:10,border:'1px solid rgba(0,0,0,0.15)',display:'flex',flexDirection:'column',gap:0}}>
        <div style={{fontWeight:'bold',color:'#7a3800',fontSize:11,marginBottom:6,letterSpacing:1}}>STATISTICS</div>
        {PIECES.map((p,i)=>(
          <div key={i} style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:4,padding:'3px 4px',borderRadius:4,background:`${p.color}22`}}>
            <div style={{fontSize:9,lineHeight:1.3}}>
              <div style={{direction:'rtl',fontSize:11}}>{STAT_LABELS[i]}</div>
              <div style={{color:'#666'}}>{p.name}</div>
            </div>
            <div style={{fontWeight:'bold',color:'#7a3800',fontSize:12}}>{String(ui.stats[i]).padStart(3,'0')}</div>
          </div>
        ))}
        <div style={{marginTop:5,borderTop:'1px solid #ddd',paddingTop:4}}>
          <div style={{fontWeight:'bold',color:'#7a3800',fontSize:11,marginBottom:4}}>BAG</div>
          <div style={{display:'flex',gap:3,flexWrap:'wrap'}}>
            {[...ui.bagUsed,...ui.bag].map((id,i)=>(
              <div key={i} style={{width:10,height:10,borderRadius:'50%',background:PIECES[id].color,opacity:i<ui.bagUsed.length?1:0.35}}/>
            ))}
          </div>
        </div>
        <div style={{marginTop:6,borderTop:'1px solid #ddd',paddingTop:5,flex:1}}>
          <div style={{fontWeight:'bold',color:'#7a3800',fontSize:11,marginBottom:4}}>📖 LAST VERSE</div>
          <div style={{fontSize:10,color:'#1a0a00',lineHeight:1.6,fontFamily:'Georgia,serif',fontStyle:'italic',fontWeight:'bold'}}>{ui.lastVerse}</div>
        </div>
      </div>

      {/* BOARD */}
      <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:8}}>
        <div style={{display:'flex',gap:10,background:'rgba(255,255,255,0.9)',borderRadius:8,padding:'6px 10px',border:'1px solid rgba(0,0,0,0.15)',fontSize:11}}>
          <div><div style={{color:'#666',fontSize:9}}>LINES</div><div style={{color:'#7a3800',fontWeight:'bold'}}>{String(ui.lines).padStart(3,'0')}</div></div>
          <div><div style={{color:'#666',fontSize:9}}>SCORE</div><div style={{color:'#7a3800',fontWeight:'bold'}}>{String(ui.score).padStart(6,'0')}</div></div>
          <div><div style={{color:'#666',fontSize:9}}>LEVEL</div><div style={{color:'#7a3800',fontWeight:'bold'}}>{String(ui.level).padStart(2,'0')}</div></div>
          <div><div style={{color:'#666',fontSize:9}}>NEXT HELP</div><div style={{color:'#7a3800',fontWeight:'bold'}}>{ui.nextHelpScore}</div></div>
        </div>
        <div style={{position:'relative'}}>
          <canvas ref={boardRef} width={BW} height={BH} style={{display:'block',border:'2px solid #8a6a40',borderRadius:2}}/>
          <canvas ref={effectRef} width={BW} height={BH} style={{position:'absolute',top:0,left:0,pointerEvents:'none',display:'none',borderRadius:2}}/>
          <canvas ref={helpRef} width={BW} height={BH} style={{position:'absolute',top:0,left:0,pointerEvents:'none',display:'none',borderRadius:2}}/>
          <div ref={verseRef} style={{position:'absolute',left:'50%',transform:'translateX(-50%)',background:'rgba(0,0,0,0.45)',border:'2px solid rgba(255,215,0,0.8)',borderRadius:12,padding:'12px 16px',width:250,textAlign:'center',backdropFilter:'blur(2px)',display:'none',pointerEvents:'none',zIndex:20,fontFamily:'Georgia,serif',fontSize:14,fontWeight:'bold',color:'#ffd700',lineHeight:1.5,textShadow:'0 1px 4px rgba(0,0,0,0.9)'}}/>
          {ui.paused&&<div style={{position:'absolute',top:0,left:0,right:0,bottom:0,background:'rgba(0,0,0,0.65)',display:'flex',alignItems:'center',justifyContent:'center',color:'#ffd700',fontSize:22,fontWeight:'bold',letterSpacing:3,borderRadius:2}}>⏸ PAUSED</div>}
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div style={{width:108,display:'flex',flexDirection:'column',gap:7}}>
        <div style={{background:'rgba(255,255,255,0.9)',borderRadius:8,padding:8,border:'1px solid rgba(0,0,0,0.15)'}}>
          <div style={{fontWeight:'bold',color:'#7a3800',fontSize:11,marginBottom:6}}>NEXT</div>
          <canvas ref={nextRef} width={88} height={88}/>
        </div>
        <button onClick={startGame} style={{background:'#c8860a',color:'#fff',border:'none',padding:'8px 12px',borderRadius:6,fontWeight:'bold',cursor:'pointer',fontSize:12,width:'100%'}}>
          {ui.running?'RESTART':'START'}
        </button>
        <button onClick={useHelp} disabled={ui.helps<=0||!ui.running||ui.paused}
          style={{background:'linear-gradient(135deg,#8B0000,#cc2200)',color:'#ffd700',border:'2px solid #ffd700',padding:'8px 12px',borderRadius:6,fontWeight:'bold',cursor:'pointer',fontSize:11,width:'100%',textShadow:'0 1px 2px rgba(0,0,0,0.8)',boxShadow:'0 2px 8px rgba(139,0,0,0.5)',opacity:ui.helps<=0||!ui.running?0.4:1}}>
          ⚔️ HELP ×{ui.helps}
        </button>
        <button onClick={toggleMusic} style={{background:'rgba(255,255,255,0.9)',color:'#333',border:'1px solid rgba(0,0,0,0.2)',padding:'6px 12px',borderRadius:6,fontWeight:'bold',cursor:'pointer',fontSize:11,width:'100%'}}>
          {ui.musicOn?'🔇 Music OFF':'🎵 Music ON'}
        </button>
        <button onClick={togglePause} style={{background:'rgba(255,255,255,0.9)',color:'#333',border:'1px solid rgba(0,0,0,0.2)',padding:'6px 12px',borderRadius:6,fontWeight:'bold',cursor:'pointer',fontSize:11,width:'100%'}}>
          {ui.paused?'RESUME (P)':'PAUSE (P)'}
        </button>
        {onBack&&<button onClick={onBack} style={{background:'rgba(255,255,255,0.7)',color:'#333',border:'1px solid rgba(0,0,0,0.2)',padding:'6px 12px',borderRadius:6,fontWeight:'bold',cursor:'pointer',fontSize:10,width:'100%'}}>← Back</button>}
        {!ui.running&&<div style={{color:'#cc2200',fontWeight:'bold',textAlign:'center',background:'rgba(255,255,255,0.9)',borderRadius:6,padding:6,fontSize:11}}>GAME OVER</div>}
        <div style={{color:'#aaa',fontSize:9,textAlign:'center',lineHeight:1.8,background:'rgba(255,255,255,0.9)',borderRadius:8,padding:6}}>
          ← → Move<br/>↑ Rotate<br/>↓ Drop<br/>Space: Hard<br/>P: Pause<br/>M: Music<br/>H: Help
        </div>
      </div>
    </div>
  )
}
