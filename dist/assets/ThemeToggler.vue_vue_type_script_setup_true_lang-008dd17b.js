import{A as a,bJ as c,a as r,o as l,d as i,b as m,w as p,e as _,x as h,u as e}from"./index-6b729fcd.js";const u={class:"theme-toggler"},x=a({__name:"ThemeToggler",props:{color:{type:String,default:"inherit"}},setup(o){const{isDark:n,onToggleTheme:t}=c();return(d,g)=>{const s=r("v-btn");return l(),i("div",u,[m(s,{icon:"",color:o.color,onClick:e(t)},{default:p(()=>[_("span",{class:h([e(n)?"i-iconoir-sun-light":"i-iconoir-half-moon","text-2xl"])},null,2)]),_:1},8,["color","onClick"])])}}});export{x as _};