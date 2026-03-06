import{j as a}from"./jsx-runtime-D_zvdyIk.js";import{c as v}from"./cn-C8nBGPD0.js";import{r as i}from"./index-ZH-6pyQh.js";import"./_commonjsHelpers-CqkleIqs.js";/**
 * @license lucide-react v0.577.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const b=(...e)=>e.filter((r,t,s)=>!!r&&r.trim()!==""&&s.indexOf(r)===t).join(" ").trim();/**
 * @license lucide-react v0.577.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const T=e=>e.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase();/**
 * @license lucide-react v0.577.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const _=e=>e.replace(/^([A-Z])|[\s-_]+(\w)/g,(r,t,s)=>s?s.toUpperCase():t.toLowerCase());/**
 * @license lucide-react v0.577.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const m=e=>{const r=_(e);return r.charAt(0).toUpperCase()+r.slice(1)};/**
 * @license lucide-react v0.577.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var A={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};/**
 * @license lucide-react v0.577.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const q=e=>{for(const r in e)if(r.startsWith("aria-")||r==="role"||r==="title")return!0;return!1};/**
 * @license lucide-react v0.577.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const E=i.forwardRef(({color:e="currentColor",size:r=24,strokeWidth:t=2,absoluteStrokeWidth:s,className:n="",children:o,iconNode:w,...l},y)=>i.createElement("svg",{ref:y,...A,width:r,height:r,stroke:e,strokeWidth:s?Number(t)*24/Number(r):t,className:b("lucide",n),...!o&&!q(l)&&{"aria-hidden":"true"},...l},[...w.map(([N,k])=>i.createElement(N,k)),...Array.isArray(o)?o:[o]]));/**
 * @license lucide-react v0.577.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const I=(e,r)=>{const t=i.forwardRef(({className:s,...n},o)=>i.createElement(E,{ref:o,iconNode:r,className:b(`lucide-${T(m(e))}`,`lucide-${e}`,s),...n}));return t.displayName=m(e),t};/**
 * @license lucide-react v0.577.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const L=[["path",{d:"M12 7v14",key:"1akyts"}],["path",{d:"M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z",key:"ruj8y"}]],R=I("book-open",L);function C({children:e,className:r}){return a.jsx("section",{className:v("rounded-2xl border border-slate-200 bg-white shadow-sm",r),children:e})}C.__docgenInfo={description:"",methods:[],displayName:"Card",props:{className:{required:!1,tsType:{name:"string"},description:""}}};function j({label:e,value:r,icon:t,trend:s,negative:n}){return a.jsx(C,{className:"p-5",children:a.jsxs("div",{className:"flex items-start justify-between",children:[a.jsxs("div",{children:[a.jsx("p",{className:"text-sm font-medium text-slate-500",children:e}),a.jsx("p",{className:"mt-1 text-3xl font-bold text-slate-900",children:r}),s?a.jsx("p",{className:v("mt-2 text-xs font-semibold",n?"text-rose-600":"text-emerald-600"),children:s}):null]}),a.jsx("div",{className:"rounded-xl bg-emerald-50 p-3 text-emerald-700",children:a.jsx(t,{size:20})})]})})}j.__docgenInfo={description:"",methods:[],displayName:"StatCard",props:{label:{required:!0,tsType:{name:"string"},description:""},value:{required:!0,tsType:{name:"union",raw:"string | number",elements:[{name:"string"},{name:"number"}]},description:""},icon:{required:!0,tsType:{name:"LucideIcon"},description:""},trend:{required:!1,tsType:{name:"string"},description:""},negative:{required:!1,tsType:{name:"boolean"},description:""}}};const O={title:"UI/StatCard",component:j,args:{label:"Total Books",value:"24,512",icon:R},decorators:[e=>a.jsx("div",{className:"w-[320px]",children:a.jsx(e,{})})]},d={},c={args:{label:"Pending Returns",value:"142",trend:"+5 overdue",negative:!0}};var u,p,x;d.parameters={...d.parameters,docs:{...(u=d.parameters)==null?void 0:u.docs,source:{originalSource:"{}",...(x=(p=d.parameters)==null?void 0:p.docs)==null?void 0:x.source}}};var f,g,h;c.parameters={...c.parameters,docs:{...(f=c.parameters)==null?void 0:f.docs,source:{originalSource:`{
  args: {
    label: 'Pending Returns',
    value: '142',
    trend: '+5 overdue',
    negative: true
  }
}`,...(h=(g=c.parameters)==null?void 0:g.docs)==null?void 0:h.source}}};const U=["Default","NegativeTrend"];export{d as Default,c as NegativeTrend,U as __namedExportsOrder,O as default};
