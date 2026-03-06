import{j as w}from"./jsx-runtime-D_zvdyIk.js";import{c as S}from"./cn-C8nBGPD0.js";const y={neutral:"bg-slate-100 text-slate-600",positive:"bg-emerald-100 text-emerald-700",warning:"bg-amber-100 text-amber-700",danger:"bg-rose-100 text-rose-600",info:"bg-blue-100 text-blue-700"};function f({tone:x="neutral",children:b,className:h}){return w.jsx("span",{className:S("inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium",y[x],h),children:b})}f.__docgenInfo={description:"",methods:[],displayName:"Badge",props:{tone:{required:!1,tsType:{name:"union",raw:"'neutral' | 'positive' | 'warning' | 'danger' | 'info'",elements:[{name:"literal",value:"'neutral'"},{name:"literal",value:"'positive'"},{name:"literal",value:"'warning'"},{name:"literal",value:"'danger'"},{name:"literal",value:"'info'"}]},description:"",defaultValue:{value:"'neutral'",computed:!1}},className:{required:!1,tsType:{name:"string"},description:""}}};const j={title:"UI/Badge",component:f,args:{children:"Status"}},e={args:{tone:"neutral"}},r={args:{tone:"positive",children:"Available"}},a={args:{tone:"warning",children:"Reserved"}},n={args:{tone:"danger",children:"Overdue"}};var t,s,o;e.parameters={...e.parameters,docs:{...(t=e.parameters)==null?void 0:t.docs,source:{originalSource:`{
  args: {
    tone: 'neutral'
  }
}`,...(o=(s=e.parameters)==null?void 0:s.docs)==null?void 0:o.source}}};var i,l,c;r.parameters={...r.parameters,docs:{...(i=r.parameters)==null?void 0:i.docs,source:{originalSource:`{
  args: {
    tone: 'positive',
    children: 'Available'
  }
}`,...(c=(l=r.parameters)==null?void 0:l.docs)==null?void 0:c.source}}};var d,u,m;a.parameters={...a.parameters,docs:{...(d=a.parameters)==null?void 0:d.docs,source:{originalSource:`{
  args: {
    tone: 'warning',
    children: 'Reserved'
  }
}`,...(m=(u=a.parameters)==null?void 0:u.docs)==null?void 0:m.source}}};var p,g,v;n.parameters={...n.parameters,docs:{...(p=n.parameters)==null?void 0:p.docs,source:{originalSource:`{
  args: {
    tone: 'danger',
    children: 'Overdue'
  }
}`,...(v=(g=n.parameters)==null?void 0:g.docs)==null?void 0:v.source}}};const B=["Neutral","Positive","Warning","Danger"];export{n as Danger,e as Neutral,r as Positive,a as Warning,B as __namedExportsOrder,j as default};
