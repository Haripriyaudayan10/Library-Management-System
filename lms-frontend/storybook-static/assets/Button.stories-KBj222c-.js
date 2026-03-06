import{j as x}from"./jsx-runtime-D_zvdyIk.js";import{c as b}from"./cn-C8nBGPD0.js";const f={primary:"bg-emerald-700 text-white hover:bg-emerald-800",secondary:"bg-white text-slate-700 border border-slate-200 hover:bg-slate-50",ghost:"bg-transparent text-slate-600 hover:bg-slate-100",danger:"bg-rose-500 text-white hover:bg-rose-600"},S={sm:"h-8 px-3 text-xs",md:"h-10 px-4 text-sm"};function p({className:u,variant:g="primary",size:y="md",children:v,...h}){return x.jsx("button",{className:b("inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50",f[g],S[y],u),...h,children:v})}p.__docgenInfo={description:"",methods:[],displayName:"Button",props:{variant:{required:!1,tsType:{name:"union",raw:"'primary' | 'secondary' | 'ghost' | 'danger'",elements:[{name:"literal",value:"'primary'"},{name:"literal",value:"'secondary'"},{name:"literal",value:"'ghost'"},{name:"literal",value:"'danger'"}]},description:"",defaultValue:{value:"'primary'",computed:!1}},size:{required:!1,tsType:{name:"union",raw:"'sm' | 'md'",elements:[{name:"literal",value:"'sm'"},{name:"literal",value:"'md'"}]},description:"",defaultValue:{value:"'md'",computed:!1}}},composes:["ButtonHTMLAttributes"]};const B={title:"UI/Button",component:p,args:{children:"Action"}},e={args:{variant:"primary"}},r={args:{variant:"secondary"}},a={args:{variant:"danger",children:"Delete"}};var t,s,n;e.parameters={...e.parameters,docs:{...(t=e.parameters)==null?void 0:t.docs,source:{originalSource:`{
  args: {
    variant: 'primary'
  }
}`,...(n=(s=e.parameters)==null?void 0:s.docs)==null?void 0:n.source}}};var o,i,l;r.parameters={...r.parameters,docs:{...(o=r.parameters)==null?void 0:o.docs,source:{originalSource:`{
  args: {
    variant: 'secondary'
  }
}`,...(l=(i=r.parameters)==null?void 0:i.docs)==null?void 0:l.source}}};var m,d,c;a.parameters={...a.parameters,docs:{...(m=a.parameters)==null?void 0:m.docs,source:{originalSource:`{
  args: {
    variant: 'danger',
    children: 'Delete'
  }
}`,...(c=(d=a.parameters)==null?void 0:d.docs)==null?void 0:c.source}}};const D=["Primary","Secondary","Danger"];export{a as Danger,e as Primary,r as Secondary,D as __namedExportsOrder,B as default};
