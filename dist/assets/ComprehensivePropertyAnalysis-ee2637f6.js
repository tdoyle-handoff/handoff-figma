import{c as v,u as b,r as l,j as e,B as o,aM as N,aV as w,w as A,aW as P,x as C,m as k,C as p,H as R,aX as D}from"./index-06367dd5.js";import{D as S}from"./download-593282f1.js";import{S as I}from"./share-2-8181a5a2.js";/**
 * @license lucide-react v0.540.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const E=[["path",{d:"M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2",key:"143wyd"}],["path",{d:"M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6",key:"1itne7"}],["rect",{x:"6",y:"14",width:"12",height:"8",rx:"1",key:"1ue0tg"}]],L=v("printer",E);function B({onNavigate:d,initialAttomId:x,initialAddress:h}){const t=b(),[r,c]=l.useState(null),[n,u]=l.useState(!1);l.useEffect(()=>{try{const s=localStorage.getItem("handoff-comprehensive-property-data");if(s){const i=JSON.parse(s);c(i.data)}}catch(s){console.warn("Failed to load saved property data:",s)}},[]);const f=s=>{c(s),u(!0),t&&setTimeout(()=>{window.scrollTo({top:400,behavior:"smooth"})},500)},j=()=>{if(!r)return;const s={generatedAt:new Date().toISOString(),propertyData:r,reportType:"Comprehensive Property Analysis",source:"Handoff Real Estate Platform"},i=new Blob([JSON.stringify(s,null,2)],{type:"application/json"}),m=URL.createObjectURL(i),a=document.createElement("a");a.href=m,a.download=`property-analysis-${Date.now()}.json`,document.body.appendChild(a),a.click(),document.body.removeChild(a),URL.revokeObjectURL(m)},g=()=>{window.print()},y=async()=>{if(navigator.share&&r)try{await navigator.share({title:"Property Analysis Report",text:"Comprehensive property analysis from Handoff",url:window.location.href})}catch(s){console.log("Error sharing:",s)}else navigator.clipboard.writeText(window.location.href),alert("Report URL copied to clipboard!")};return e.jsxs("div",{className:`space-y-6 ${t?"page-content-mobile":"page-content"}`,children:[e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsxs("div",{className:"flex items-center gap-3",children:[d&&e.jsxs(o,{variant:"ghost",size:"sm",onClick:()=>d("property"),className:t?"mobile-button":"",children:[e.jsx(N,{className:"w-4 h-4 mr-2"}),"Back"]}),e.jsxs("div",{children:[e.jsxs("h1",{className:"text-2xl font-semibold flex items-center gap-2",children:[e.jsx(w,{className:"w-6 h-6 text-primary"}),"Property Analysis Report"]}),e.jsx("p",{className:"text-muted-foreground",children:"Comprehensive property data from multiple Attom API sources"})]})]}),n&&e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsxs(o,{variant:"outline",size:"sm",onClick:j,className:t?"mobile-button-sm":"",children:[e.jsx(S,{className:"w-4 h-4 mr-2"}),"Export"]}),e.jsxs(o,{variant:"outline",size:"sm",onClick:g,className:t?"mobile-button-sm":"",children:[e.jsx(L,{className:"w-4 h-4 mr-2"}),"Print"]}),e.jsxs(o,{variant:"outline",size:"sm",onClick:y,className:t?"mobile-button-sm":"",children:[e.jsx(I,{className:"w-4 h-4 mr-2"}),"Share"]})]})]}),n&&e.jsxs(A,{children:[e.jsx(P,{className:"h-4 w-4"}),e.jsx(C,{children:e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsxs("span",{children:["Comprehensive analysis report generated with data from ",Object.keys(r||{}).length," API sources."]}),e.jsx(k,{variant:"secondary",className:"ml-2",children:"Report Ready"})]})})]}),e.jsx(p,{className:"modern-card",children:e.jsx("div",{className:"p-6",children:e.jsxs("div",{className:"flex items-start gap-4",children:[e.jsx("div",{className:"p-3 bg-primary/10 rounded-lg",children:e.jsx(R,{className:"w-6 h-6 text-primary"})}),e.jsxs("div",{className:"flex-1",children:[e.jsx("h2",{className:"text-xl font-semibold mb-2",children:"Comprehensive Property Analysis"}),e.jsx("p",{className:"text-muted-foreground mb-4",children:"This analysis tool pulls data from multiple Attom API endpoints to provide a complete picture of any property. Enter an Attom ID or property address below to generate a detailed report including property characteristics, ownership information, financial data, market trends, and risk assessments."}),e.jsxs("div",{className:"grid grid-cols-2 md:grid-cols-4 gap-4 mt-4",children:[e.jsxs("div",{className:"text-center p-3 bg-muted/50 rounded-lg",children:[e.jsx("div",{className:"text-lg font-semibold text-primary",children:"10+"}),e.jsx("div",{className:"text-xs text-muted-foreground",children:"API Endpoints"})]}),e.jsxs("div",{className:"text-center p-3 bg-muted/50 rounded-lg",children:[e.jsx("div",{className:"text-lg font-semibold text-primary",children:"100+"}),e.jsx("div",{className:"text-xs text-muted-foreground",children:"Data Points"})]}),e.jsxs("div",{className:"text-center p-3 bg-muted/50 rounded-lg",children:[e.jsx("div",{className:"text-lg font-semibold text-primary",children:"8"}),e.jsx("div",{className:"text-xs text-muted-foreground",children:"Categories"})]}),e.jsxs("div",{className:"text-center p-3 bg-muted/50 rounded-lg",children:[e.jsx("div",{className:"text-lg font-semibold text-primary",children:"Real-time"}),e.jsx("div",{className:"text-xs text-muted-foreground",children:"Data"})]})]})]})]})})}),e.jsx(D,{defaultAttomId:x,defaultAddress:h,onPropertyFound:f}),n&&e.jsx(p,{className:"modern-card",children:e.jsxs("div",{className:"p-6 text-center",children:[e.jsx("h3",{className:"text-lg font-semibold mb-2",children:"Report Complete"}),e.jsx("p",{className:"text-muted-foreground mb-4",children:"Your comprehensive property analysis has been generated. You can export, print, or share this report using the buttons above."}),e.jsxs("div",{className:"flex items-center justify-center gap-4 text-sm text-muted-foreground",children:[e.jsxs("div",{className:"flex items-center gap-1",children:[e.jsx("div",{className:"w-2 h-2 bg-green-500 rounded-full"}),e.jsx("span",{children:"Data Source: Attom Data API"})]}),e.jsxs("div",{className:"flex items-center gap-1",children:[e.jsx("div",{className:"w-2 h-2 bg-blue-500 rounded-full"}),e.jsxs("span",{children:["Generated: ",new Date().toLocaleDateString()]})]}),e.jsxs("div",{className:"flex items-center gap-1",children:[e.jsx("div",{className:"w-2 h-2 bg-purple-500 rounded-full"}),e.jsx("span",{children:"Platform: Handoff"})]})]})]})}),e.jsx("style",{jsx:!0,children:`
        @media print {
          .no-print {
            display: none !important;
          }
          
          body {
            font-size: 12px;
            color: black;
            background: white;
          }
          
          .modern-card {
            border: 1px solid #ccc;
            box-shadow: none;
            margin-bottom: 1rem;
            page-break-inside: avoid;
          }
          
          h1, h2, h3 {
            color: black;
            page-break-after: avoid;
          }
          
          .page-content,
          .page-content-mobile {
            padding: 0;
            max-width: 100%;
          }
        }
      `})]})}export{B as ComprehensivePropertyAnalysis};
