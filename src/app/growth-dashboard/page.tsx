'use client';

import React, { useEffect, useRef } from 'react';
import Script from 'next/script';

export default function GrowthDashboard() {
  const isInitialized = useRef(false);

  useEffect(() => {
    // Only run once and after the Script is loaded
    if (isInitialized.current) return;

    const initDashboard = () => {
      // @ts-ignore
      if (typeof Chart === 'undefined') {
        console.log('Waiting for Chart.js...');
        setTimeout(initDashboard, 100);
        return;
      }
      
      console.log('Initializing Dashboard logic...');
      // Re-run the script logic from the HTML
      // (The helper functions are defined in the globally-executed script below)
      if (window.dispatchEvent) {
        window.dispatchEvent(new Event('recalc-trigger'));
      }
      isInitialized.current = true;
    };

    initDashboard();
  }, []);

  return (
    <>
      <Script 
        src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js" 
        strategy="afterInteractive"
      />
      
      {/* 
        Injecting the CSS directly for exact visual reproduction 
      */}
      <style dangerouslySetInnerHTML={{ __html: `
        :root {
          --font-body:'Inter',sans-serif; --font-mono:'JetBrains Mono',monospace;
          --t-xs:.72rem; --t-sm:.85rem; --t-base:1rem; --t-lg:1.2rem; --t-xl:1.6rem; --t-2xl:2.2rem;
          --r-sm:.375rem; --r-md:.5rem; --r-lg:.75rem; --r-xl:1rem; --r-2xl:1.5rem;
          --sp1:.25rem;--sp2:.5rem;--sp3:.75rem;--sp4:1rem;--sp5:1.25rem;--sp6:1.5rem;--sp8:2rem;--sp10:2.5rem;
          --trans:160ms cubic-bezier(.16,1,.3,1);
        }
        .dashboard-container {
          --bg:#0b0b0b; --s1:#131313; --s2:#1a1a1a; --s3:#222; --s4:#2a2a2a;
          --bd:rgba(255,255,255,.06); --bds:rgba(255,255,255,.11);
          --tx:#ddd; --tm:#777; --tf:#3a3a3a;
          --green:#22c55e; --greend:rgba(34,197,94,.1); --greenb:rgba(34,197,94,.2);
          --blue:#3b82f6; --blued:rgba(59,130,246,.1);
          --yellow:#f59e0b; --yellowd:rgba(245,158,11,.1);
          --red:#ef4444; --redd:rgba(239,68,68,.1);
          --purple:#a855f7; --purpled:rgba(168,85,247,.1);
          --cyan:#06b6d4; --cyand:rgba(6,182,212,.1);
          
          min-height: 100vh;
          font-family: var(--font-body);
          font-size: var(--t-base);
          color: var(--tx);
          background: var(--bg);
          padding: var(--sp6) var(--sp4);
          -webkit-font-smoothing: antialiased;
        }

        /* Light theme overrides */
        .dashboard-container.light {
          --bg:#f2f1ed; --s1:#fff; --s2:#f7f6f2; --s3:#eeede8; --s4:#e5e4de;
          --bd:rgba(0,0,0,.06); --bds:rgba(0,0,0,.12);
          --tx:#111; --tm:#666; --tf:#ccc;
          --green:#16a34a; --greend:rgba(22,163,74,.08); --greenb:rgba(22,163,74,.18);
          --blue:#2563eb; --blued:rgba(37,99,235,.08);
          --yellow:#d97706; --yellowd:rgba(217,119,6,.08);
          --red:#dc2626; --redd:rgba(220,38,38,.08);
          --purple:#9333ea; --purpled:rgba(147,51,234,.08);
          --cyan:#0891b2; --cyand:rgba(8,145,178,.08);
        }

        .wrap{max-width:1200px;margin:0 auto;}
        .topbar{display:flex;align-items:center;justify-content:space-between;margin-bottom:var(--sp8);flex-wrap:wrap;gap:var(--sp4);}
        .brand{display:flex;align-items:center;gap:var(--sp3);}
        .brand-icon{width:36px;height:36px;background:var(--greend);border:1px solid var(--greenb);border-radius:var(--r-lg);display:flex;align-items:center;justify-content:center;font-size:1.1rem;}
        .brand-name{font-size:var(--t-lg);font-weight:800;letter-spacing:-.025em;}
        .brand-sub{font-size:var(--t-xs);color:var(--tm);}
        .topbar-right{display:flex;gap:var(--sp2);}
        .btn{background:var(--s2);border:1px solid var(--bd);border-radius:var(--r-md);padding:var(--sp2) var(--sp4);color:var(--tm);cursor:pointer;font-size:var(--t-xs);font-family:var(--font-body);font-weight:600;transition:all var(--trans);}
        .btn:hover{color:var(--tx);border-color:var(--bds);}
        .btn.primary{background:var(--green);color:#fff;border-color:transparent;}
        .btn.primary:hover{opacity:.9;}
        .inputs-panel{display:grid;grid-template-columns:repeat(4,1fr);gap:var(--sp4);margin-bottom:var(--sp6);}
        @media(max-width:900px){.inputs-panel{grid-template-columns:repeat(2,1fr);}}
        @media(max-width:500px){.inputs-panel{grid-template-columns:1fr;}}
        .input-group{background:var(--s1);border:1px solid var(--bd);border-radius:var(--r-xl);padding:var(--sp5);}
        .ig-title{font-size:var(--t-xs);font-weight:700;color:var(--tm);letter-spacing:.06em;text-transform:uppercase;margin-bottom:var(--sp4);}
        .field{margin-bottom:var(--sp3);}
        .field:last-child{margin-bottom:0;}
        label{display:block;font-size:var(--t-xs);color:var(--tm);margin-bottom:var(--sp1);}
        .iw{position:relative;}
        .pre{position:absolute;left:var(--sp3);top:50%;transform:translateY(-50%);color:var(--tf);font-size:var(--t-sm);pointer-events:none;font-family:var(--font-mono);}
        input[type=number]{width:100%;background:var(--s2);border:1px solid var(--bd);border-radius:var(--r-md);padding:var(--sp2) var(--sp3) var(--sp2) var(--sp8);color:var(--tx);font-family:var(--font-mono);font-size:var(--t-sm);transition:border-color var(--trans),box-shadow var(--trans);appearance:none;}
        input[type=number].np{padding-left:var(--sp3);}
        input[type=number]:focus{outline:none;border-color:var(--green);box-shadow:0 0 0 3px var(--greend);}
        .sl-row{display:flex;align-items:center;gap:var(--sp3);margin-bottom:var(--sp3);}
        .sl-lbl{font-size:var(--t-xs);color:var(--tm);flex:1;min-width:0;}
        input[type=range]{width:90px;appearance:none;height:3px;background:var(--s3);border-radius:2px;border:none;padding:0;cursor:pointer;flex-shrink:0;}
        input[type=range]::-webkit-slider-thumb{appearance:none;width:13px;height:13px;background:var(--green);border-radius:50%;}
        .sl-val{font-family:var(--font-mono);font-size:var(--t-xs);color:var(--green);font-weight:700;min-width:40px;text-align:right;}
        .scenario-bar{display:flex;gap:var(--sp2);margin-bottom:var(--sp6);flex-wrap:wrap;align-items:center;}
        .sc-tab{padding:var(--sp2) var(--sp4);border-radius:9999px;font-size:var(--t-xs);font-weight:700;cursor:pointer;border:1px solid var(--bd);background:var(--s2);color:var(--tm);transition:all var(--trans);}
        .sc-tab.active{color:#000;border-color:transparent;}
        .sc-tab.sc0.active{background:var(--green);}
        .sc-tab.sc1.active{background:var(--yellow);}
        .sc-tab.sc2.active{background:var(--blue);}
        .sc-sep{font-size:var(--t-xs);color:var(--tf);margin:0 var(--sp1);}
        .kpi-strip{display:grid;grid-template-columns:repeat(6,1fr);gap:var(--sp3);margin-bottom:var(--sp6);}
        @media(max-width:1000px){.kpi-strip{grid-template-columns:repeat(3,1fr);}}
        @media(max-width:500px){.kpi-strip{grid-template-columns:repeat(2,1fr);}}
        .kpi{background:var(--s1);border:1px solid var(--bd);border-radius:var(--r-lg);padding:var(--sp4) var(--sp5);}
        .kpi-l{font-size:var(--t-xs);color:var(--tm);margin-bottom:var(--sp1);}
        .kpi-v{font-family:var(--font-mono);font-size:var(--t-lg);font-weight:800;letter-spacing:-.03em;}
        .kpi-v.g{color:var(--green);}
        .kpi-v.b{color:var(--blue);}
        .kpi-v.y{color:var(--yellow);}
        .kpi-v.r{color:var(--red);}
        .kpi-v.p{color:var(--purple);}
        .kpi-sub{font-size:var(--t-xs);color:var(--tf);margin-top:2px;}
        .chart-grid{display:grid;grid-template-columns:2fr 1fr;gap:var(--sp4);margin-bottom:var(--sp4);}
        @media(max-width:800px){.chart-grid{grid-template-columns:1fr;}}
        .chart-grid-3{display:grid;grid-template-columns:repeat(3,1fr);gap:var(--sp4);margin-bottom:var(--sp4);}
        @media(max-width:800px){.chart-grid-3{grid-template-columns:1fr;}}
        .chart-card{background:var(--s1);border:1px solid var(--bd);border-radius:var(--r-xl);padding:var(--sp5);}
        .cc-head{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:var(--sp4);}
        .cc-title{font-size:var(--t-sm);font-weight:700;color:var(--tx);}
        .cc-sub{font-size:var(--t-xs);color:var(--tm);margin-top:2px;}
        .cc-badge{font-size:var(--t-xs);font-family:var(--font-mono);font-weight:700;padding:2px 8px;border-radius:9999px;}
        .cc-badge.g{background:var(--greend);color:var(--green);}
        .cc-badge.y{background:var(--yellowd);color:var(--yellow);}
        .cc-badge.b{background:var(--blued);color:var(--blue);}
        .chart-wrap{position:relative;width:100%;}
        .chart-wrap canvas{display:block;}
        .milestone-table{width:100%;border-collapse:collapse;font-size:var(--t-sm);}
        .milestone-table th{font-size:var(--t-xs);font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--tf);padding:var(--sp2) var(--sp3);border-bottom:1px solid var(--bd);text-align:right;}
        .milestone-table th:first-child{text-align:left;}
        .milestone-table td{padding:var(--sp3);border-bottom:1px solid var(--bd);font-family:var(--font-mono);font-size:var(--t-xs);text-align:right;color:var(--tm);}
        .milestone-table td:first-child{text-align:left;font-family:var(--font-body);color:var(--tx);font-weight:600;font-size:var(--t-xs);}
        .milestone-table tr:last-child td{border-bottom:none;}
        .milestone-table .pos{color:var(--green);} .milestone-table .neg{color:var(--red);}
        .milestone-table .hl{background:var(--greend);}
        .runway-bar{height:8px;background:var(--s3);border-radius:4px;overflow:hidden;margin-top:var(--sp2);}
        .runway-fill{height:100%;border-radius:4px;transition:width .5s var(--trans);}
        .phases{display:grid;grid-template-columns:repeat(3,1fr);gap:var(--sp4);margin-bottom:var(--sp4);}
        @media(max-width:700px){.phases{grid-template-columns:1fr;}}
        .phase-card{background:var(--s1);border:1px solid var(--bd);border-radius:var(--r-xl);padding:var(--sp5);position:relative;overflow:hidden;}
        .phase-card::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;}
        .phase-card.ph0::before{background:var(--yellow);}
        .phase-card.ph1::before{background:var(--blue);}
        .phase-card.ph2::before{background:var(--green);}
        .phase-label{font-size:var(--t-xs);font-weight:700;letter-spacing:.08em;text-transform:uppercase;margin-bottom:var(--sp2);}
        .ph0 .phase-label{color:var(--yellow);} .ph1 .phase-label{color:var(--blue);} .ph2 .phase-label{color:var(--green);}
        .phase-title{font-size:var(--t-base);font-weight:800;letter-spacing:-.02em;margin-bottom:var(--sp3);}
        .phase-metric{display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--sp2);}
        .phase-metric-l{font-size:var(--t-xs);color:var(--tm);}
        .phase-metric-v{font-family:var(--font-mono);font-size:var(--t-xs);font-weight:700;color:var(--tx);}
        .phase-goal{margin-top:var(--sp3);padding-top:var(--sp3);border-top:1px solid var(--bd);}
        .phase-goal-l{font-size:var(--t-xs);color:var(--tf);margin-bottom:var(--sp1);}
        .phase-goal-v{font-size:var(--t-sm);font-weight:700;}
        .ph0 .phase-goal-v{color:var(--yellow);} .ph1 .phase-goal-v{color:var(--blue);} .ph2 .phase-goal-v{color:var(--green);}
        .section-lbl{font-size:var(--t-xs);font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--tf);margin-bottom:var(--sp4);}
        .divider{border:none;border-top:1px solid var(--bd);margin:var(--sp6) 0;}
      ` }} />

      <div className="dashboard-container" id="dash_root">
        <div className="wrap">
          {/* Topbar */}
          <div className="topbar">
            <div className="brand">
              <div className="brand-icon">📈</div>
              <div>
                <div className="brand-name">Profitable Media</div>
                <div className="brand-sub">Growth & Scaling Dashboard</div>
              </div>
            </div>
            <div className="topbar-right">
              <button className="btn" id="theme_btn">☀ Light</button>
            </div>
          </div>

          {/* Input Panels */}
          <div className="section-lbl">Model Configuration</div>
          <div className="inputs-panel">
            <div className="input-group">
              <div className="ig-title">💰 Pricing</div>
              <div className="field"><label>Setup Fee (one-time)</label>
                <div className="iw"><span className="pre">$</span><input type="number" id="i_setup" defaultValue="997" /></div>
              </div>
              <div className="field"><label>Monthly Retainer</label>
                <div className="iw"><span className="pre">$</span><input type="number" id="i_monthly" defaultValue="297" /></div>
              </div>
              <div className="field"><label>Avg Client Lifetime (mo)</label>
                <div className="iw"><input type="number" id="i_life" defaultValue="9" className="np" /></div>
              </div>
            </div>
            <div className="input-group">
              <div className="ig-title">🔧 Costs</div>
              <div className="field"><label>Build Cost (per client)</label>
                <div className="iw"><span className="pre">$</span><input type="number" id="i_build" defaultValue="2500" /></div>
              </div>
              <div className="field"><label>Monthly Infra</label>
                <div className="iw"><span className="pre">$</span><input type="number" id="i_infra" defaultValue="35" /></div>
              </div>
              <div className="field"><label>Monthly Labor</label>
                <div className="iw"><span className="pre">$</span><input type="number" id="i_labor" defaultValue="50" /></div>
              </div>
            </div>
            <div className="input-group">
              <div className="ig-title">🚀 Growth</div>
              <div className="sl-row"><span className="sl-lbl">New Clients/Month</span>
                <input type="range" id="i_cpm" min="1" max="20" defaultValue="3" />
                <span className="sl-val" id="sv_cpm">3</span>
              </div>
              <div className="sl-row"><span className="sl-lbl">Monthly Churn</span>
                <input type="range" id="i_churn" min="0" max="25" defaultValue="8" />
                <span className="sl-val" id="sv_churn">8%</span>
              </div>
              <div className="sl-row"><span className="sl-lbl">Projection (months)</span>
                <input type="range" id="i_horizon" min="6" max="36" defaultValue="24" />
                <span className="sl-val" id="sv_horizon">24 mo</span>
              </div>
              <div className="sl-row"><span className="sl-lbl">Price Growth/Year</span>
                <input type="range" id="i_pgrowth" min="0" max="30" defaultValue="0" />
                <span className="sl-val" id="sv_pgrowth">0%</span>
              </div>
            </div>
            <div className="input-group">
              <div className="ig-title">🎯 Funnel</div>
              <div className="field"><label>Total Leads</label>
                <div className="iw"><input type="number" id="i_leads" defaultValue="242" className="np" /></div>
              </div>
              <div className="sl-row"><span className="sl-lbl">Open Rate</span>
                <input type="range" id="i_open" min="5" max="60" defaultValue="32" />
                <span className="sl-val" id="sv_open">32%</span>
              </div>
              <div className="sl-row"><span className="sl-lbl">Close Rate</span>
                <input type="range" id="i_close" min="2" max="40" defaultValue="10" />
                <span className="sl-val" id="sv_close">10%</span>
              </div>
            </div>
          </div>

          {/* Scenario Tabs */}
          <div className="scenario-bar">
            <span style={{ fontSize: 'var(--t-xs)', color: 'var(--tm)', fontWeight: 600 }}>Scenario:</span>
            <div className="sc-tab sc0 active" data-idx="0">📉 Conservative</div>
            <div className="sc-tab sc1" data-idx="1">⚡ Base Case</div>
            <div className="sc-tab sc2" data-idx="2">🚀 Aggressive</div>
            <span className="sc-sep">|</span>
            <span id="sc_desc" style={{ fontSize: 'var(--t-xs)', color: 'var(--tm)', fontStyle: 'italic' }}>1 client/mo, 12% churn</span>
          </div>

          {/* KPI Strip */}
          <div className="kpi-strip" id="kpi_strip"></div>

          {/* Charts Row 1 */}
          <div className="chart-grid">
            <div className="chart-card">
              <div className="cc-head">
                <div><div className="cc-title">MRR Growth Trajectory</div><div className="cc-sub">Monthly Recurring Revenue over projection period</div></div>
                <div className="cc-badge g" id="badge_mrr">—</div>
              </div>
              <div className="chart-wrap" style={{ height: '220px' }}><canvas id="chart_mrr"></canvas></div>
            </div>
            <div className="chart-card">
              <div className="cc-head">
                <div><div className="cc-title">Client Base</div><div className="cc-sub">Active clients over time</div></div>
                <div className="cc-badge b" id="badge_clients">—</div>
              </div>
              <div className="chart-wrap" style={{ height: '220px' }}><canvas id="chart_clients"></canvas></div>
            </div>
          </div>

          {/* Charts Row 2 */}
          <div className="chart-grid-3">
            <div className="chart-card">
              <div className="cc-head">
                <div><div className="cc-title">Cumulative Profit</div><div className="cc-sub">Running total after all costs</div></div>
                <div className="cc-badge g" id="badge_profit">—</div>
              </div>
              <div className="chart-wrap" style={{ height: '180px' }}><canvas id="chart_profit"></canvas></div>
            </div>
            <div className="chart-card">
              <div className="cc-head">
                <div><div className="cc-title">Monthly Cash Flow</div><div className="cc-sub">Revenue vs Costs per month</div></div>
                <div className="cc-badge b" id="badge_cf">—</div>
              </div>
              <div className="chart-wrap" style={{ height: '180px' }}><canvas id="chart_cf"></canvas></div>
            </div>
            <div className="chart-card">
              <div className="cc-head">
                <div><div className="cc-title">Revenue Mix</div><div className="cc-sub">Setup fees vs Retainer revenue</div></div>
                <div className="cc-badge y" id="badge_mix">—</div>
              </div>
              <div className="chart-wrap" style={{ height: '180px' }}><canvas id="chart_mix"></canvas></div>
            </div>
          </div>

          <div className="divider"></div>

          {/* Phase Roadmap */}
          <div className="section-lbl">Scaling Roadmap</div>
          <div className="phases" id="phases_row"></div>

          <div className="divider"></div>

          {/* Milestone Table */}
          <div className="section-lbl">Month-by-Month Projection</div>
          <div style={{ overflowX: 'auto', background: 'var(--s1)', border: '1px solid var(--bd)', borderRadius: 'var(--r-xl)', padding: 'var(--sp5)', marginBottom: 'var(--sp4)' }}>
            <table className="milestone-table" id="milestone_table"></table>
          </div>
        </div>
      </div>

      <Script id="dashboard-logic" strategy="afterInteractive">
        {`
          (function() {
            // Helpers
            function sv(el,id,suffix){document.getElementById(id).textContent=el.value+suffix;}
            function fmt(n,d=0){if(isNaN(n)||n===null)return'—';const abs=Math.abs(n);let s;if(abs>=1000000)s='$'+(n/1000000).toFixed(2)+'M';else if(abs>=1000)s='$'+(n/1000).toFixed(1)+'k';else s='$'+Math.round(n).toLocaleString();return n<0?'-'+s.replace('-',''):s;}
            function fmtN(n){if(isNaN(n))return'—';return Math.round(n).toLocaleString();}
            function fmtP(n){return Math.round(n)+'%';}
            
            function toggleTheme(){
              const root=document.getElementById('dash_root');
              const b=document.getElementById('theme_btn');
              const isDark=root.classList.toggle('light'); // Toggle 'light' class
              b.textContent=!root.classList.contains('light')?'☀ Light':'🌙 Dark';
              renderCharts();
            }

            const charts={};
            function destroyChart(id){if(charts[id]){charts[id].destroy();delete charts[id];}}

            function makeChart(id,type,labels,datasets,opts={}){
              destroyChart(id);
              const isDark=!document.getElementById('dash_root').classList.contains('light');
              const gridColor=isDark?'rgba(255,255,255,0.05)':'rgba(0,0,0,0.05)';
              const textColor=isDark?'#666':'#aaa';
              const ctx=document.getElementById(id).getContext('2d');
              charts[id]=new Chart(ctx,{
                type,
                data:{labels,datasets},
                options:{
                  responsive:true,maintainAspectRatio:false,
                  animation:{duration:400},
                  plugins:{
                    legend:{display:opts.legend||false,position:'bottom',labels:{color:textColor,font:{size:10},boxWidth:10,padding:12}},
                    tooltip:{backgroundColor:isDark?'#1e1e1e':'#fff',titleColor:isDark?'#ddd':'#111',bodyColor:isDark?'#888':'#666',borderColor:isDark?'rgba(255,255,255,0.1)':'rgba(0,0,0,0.1)',borderWidth:1,padding:10,callbacks:opts.tooltipCb||{}}
                  },
                  scales:type==='doughnut'?{}:{
                    x:{grid:{color:gridColor,drawBorder:false},ticks:{color:textColor,font:{size:10},maxTicksLimit:8}},
                    y:{grid:{color:gridColor,drawBorder:false},ticks:{color:textColor,font:{size:10},callback:opts.yFmt||(v=>fmt(v))}},
                    ...(opts.y2?{y2:{position:'right',grid:{display:false},ticks:{color:textColor,font:{size:10},callback:opts.y2Fmt||(v=>v)}}}:{}),
                  },
                  ...opts.extra||{}
                }
              });
            }

            const SCENARIOS=[
              {label:'Conservative',cpm:1,churn:12,desc:'1 client/mo, 12% churn'},
              {label:'Base Case',   cpm:3,churn:8, desc:'3 clients/mo, 8% churn'},
              {label:'Aggressive',  cpm:6,churn:5, desc:'6 clients/mo, 5% churn'},
            ];
            let currentScenario=0;
            function setScenario(i){
              currentScenario=i;
              document.querySelectorAll('.sc-tab').forEach((t,j)=>t.classList.toggle('active',j===i));
              const sc=SCENARIOS[i];
              document.getElementById('i_cpm').value=sc.cpm;
              document.getElementById('sv_cpm').textContent=sc.cpm;
              document.getElementById('i_churn').value=sc.churn;
              document.getElementById('sv_churn').textContent=sc.churn+'%';
              document.getElementById('sc_desc').textContent=sc.desc;
              recalc();
            }

            function getInputs(){
              return {
                setup:    +document.getElementById('i_setup').value||0,
                monthly:  +document.getElementById('i_monthly').value||0,
                life:     +document.getElementById('i_life').value||1,
                build:    +document.getElementById('i_build').value||0,
                infra:    +document.getElementById('i_infra').value||0,
                labor:    +document.getElementById('i_labor').value||0,
                cpm:      +document.getElementById('i_cpm').value||1,
                churn:    +document.getElementById('i_churn').value/100,
                horizon:  +document.getElementById('i_horizon').value||24,
                pgrowth:  +document.getElementById('i_pgrowth').value/100,
                leads:    +document.getElementById('i_leads').value||0,
                open:     +document.getElementById('i_open').value/100,
                close:    +document.getElementById('i_close').value/100,
              };
            }

            function simulate(v){
              const monthlyCost=v.infra+v.labor;
              const rows=[];
              let active=0, cumProfit=0, cumRevenue=0;
              for(let m=1;m<=v.horizon;m++){
                const yearFactor=Math.pow(1+v.pgrowth,Math.floor((m-1)/12));
                const effectiveMonthly=v.monthly*yearFactor;
                const churned=Math.round(active*v.churn);
                active=Math.max(0,active-churned)+v.cpm;
                const setupRev=v.cpm*v.setup;
                const retainerRev=active*effectiveMonthly;
                const totalRev=setupRev+retainerRev;
                const buildCost=v.cpm*v.build;
                const opsCost=active*monthlyCost;
                const totalCost=buildCost+opsCost;
                const netProfit=totalRev-totalCost;
                cumProfit+=netProfit;
                cumRevenue+=totalRev;
                const mrr=retainerRev;
                const marginPct=totalRev>0?(netProfit/totalRev)*100:0;
                rows.push({m,active,churned,setupRev,retainerRev,totalRev,buildCost,opsCost,totalCost,netProfit,cumProfit,cumRevenue,mrr,marginPct,effectiveMonthly});
              }
              return rows;
            }

            let lastRows=[];
            function recalc(){
              const v=getInputs();
              const rows=simulate(v);
              lastRows=rows;
              const monthlyCost=v.infra+v.labor;
              const netPerMonth=v.monthly-monthlyCost;
              let be=null;
              let cum=v.setup-v.build;
              for(let m=0;m<=60;m++){if(m>0)cum+=netPerMonth;if(cum>=0){be=m;break;}}
              const ltv=v.setup+v.monthly*v.life-v.build-monthlyCost*v.life;
              const closes=Math.round(v.leads*v.open*v.close);
              const finalRow=rows[rows.length-1];
              const peakMRR=Math.max(...rows.map(r=>r.mrr));
              const paybackMonths=be;
              const totalProfit=finalRow.cumProfit;
              const strip=document.getElementById('kpi_strip');
              strip.innerHTML=\`
                <div class="kpi"><div class="kpi-l">Peak MRR</div><div class="kpi-v g">\${fmt(peakMRR)}</div><div class="kpi-sub">Month \${rows.findIndex(r=>r.mrr===peakMRR)+1}</div></div>
                <div class="kpi"><div class="kpi-l">Active Clients M\${v.horizon}</div><div class="kpi-v b">\${finalRow.active}</div><div class="kpi-sub">\${fmt(finalRow.mrr)}/mo</div></div>
                <div class="kpi"><div class="kpi-l">Total Profit \${v.horizon}mo</div><div class="kpi-v \${totalProfit>=0?'g':'r'}">\${fmt(totalProfit)}</div><div class="kpi-sub">cumulative</div></div>
                <div class="kpi"><div class="kpi-l">Break-Even (1 client)</div><div class="kpi-v \${paybackMonths<=6?'g':paybackMonths<=10?'y':'r'}">\${paybackMonths!==null?'Mo. '+paybackMonths:'60+ mo'}</div><div class="kpi-sub">per client</div></div>
                <div class="kpi"><div class="kpi-l">LTV per Client</div><div class="kpi-v p">\${fmt(ltv)}</div><div class="kpi-sub">\${v.life} mo lifetime</div></div>
                <div class="kpi"><div class="kpi-l">Funnel Closes</div><div class="kpi-v y">\${closes}</div><div class="kpi-sub">from \${v.leads} leads</div></div>
              \`;
              renderCharts(rows,v);
              const phase1End=Math.min(3,rows.length-1);
              const phase2End=Math.min(9,rows.length-1);
              const p1=rows[phase1End],p2=rows[phase2End],p3=rows[rows.length-1];
              document.getElementById('phases_row').innerHTML=\`
                <div class="phase-card ph0">
                  <div class="phase-label">Phase 1 · Month 1–\${Math.min(3,v.horizon)}</div>
                  <div class="phase-title">Validation & Build</div>
                  <div className="phase-metric"><span class="phase-metric-l">Active Clients</span><span class="phase-metric-v">\${p1.active}</span></div>
                  <div className="phase-metric"><span class="phase-metric-l">MRR</span><span class="phase-metric-v">\${fmt(p1.mrr)}</span></div>
                  <div className="phase-goal"><div class="phase-goal-l">Goal</div><div class="phase-goal-v">Land first 3 clients. Validate system.</div></div>
                </div>
                <div class="phase-card ph1">
                  <div class="phase-label">Phase 2 · Month 4–\${Math.min(9,v.horizon)}</div>
                  <div class="phase-title">Systemize & Scale</div>
                  <div className="phase-metric"><span class="phase-metric-l">Active Clients</span><span class="phase-metric-v">\${p2.active}</span></div>
                  <div className="phase-metric"><span class="phase-metric-l">MRR</span><span class="phase-metric-v">\${fmt(p2.mrr)}</span></div>
                  <div className="phase-goal"><div class="phase-goal-l">Goal</div><div class="phase-goal-v">Automate onboarding. Target $5k MRR.</div></div>
                </div>
                <div class="phase-card ph2">
                  <div class="phase-label">Phase 3 · Month 10–\${v.horizon}</div>
                  <div class="phase-title">Compound Growth</div>
                  <div className="phase-metric"><span class="phase-metric-l">Active Clients</span><span class="phase-metric-v">\${p3.active}</span></div>
                  <div className="phase-metric"><span class="phase-metric-l">MRR</span><span class="phase-metric-v">\${fmt(p3.mrr)}</span></div>
                  <div className="phase-goal"><div class="phase-goal-l">Goal</div><div class="phase-goal-v">Hire CSM. Expand. $15k+ MRR.</div></div>
                </div>
              \`;
              const milestoneMonths=[1,2,3,6,9,12,18,24].filter(m=>m<=v.horizon);
              let html='<thead><tr><th>Milestone</th><th>Clients</th><th>MRR</th><th>Total Rev</th><th>Net Profit</th><th>Cum. Profit</th></tr></thead><tbody>';
              milestoneMonths.forEach(m=>{
                const r=rows[m-1];
                html+=\`<tr><td>Month \${m}</td><td>\${r.active}</td><td>\${fmt(r.mrr)}</td><td>\${fmt(r.totalRev)}</td><td>\${fmt(r.netProfit)}</td><td>\${fmt(r.cumProfit)}</td></tr>\`;
              });
              document.getElementById('milestone_table').innerHTML=html+'</tbody>';
            }

            function renderCharts(rows,v){
              if(!rows) rows=lastRows;
              if(!v) v=getInputs();
              const labels=rows.map(r=>'M'+r.m);
              makeChart('chart_mrr','line',labels,[{label:'MRR',data:rows.map(r=>r.mrr),borderColor:'#22c55e',backgroundColor:'rgba(34,197,94,0.08)',fill:true,tension:.35}]);
              makeChart('chart_clients','line',labels,[{label:'Active',data:rows.map(r=>r.active),borderColor:'#3b82f6',backgroundColor:'rgba(59,130,246,0.1)',fill:true,tension:.35}]);
              makeChart('chart_profit','line',labels,[{label:'Cum. Profit',data:rows.map(r=>r.cumProfit),borderColor:'#22c55e',backgroundColor:'rgba(34,197,94,0.1)',fill:true,tension:.35}]);
              makeChart('chart_cf','bar',labels,[{label:'Net Profit',data:rows.map(r=>r.netProfit),backgroundColor:'#3b82f6'}]);
              const setupShare=rows.reduce((s,r)=>s+r.setupRev,0);
              const retainerShare=rows.reduce((s,r)=>s+r.retainerRev,0);
              makeChart('chart_mix','doughnut',['Setup','Retainer'],[{data:[setupShare,retainerShare],backgroundColor:['#f59e0b','#22c55e']}]);
            }

            // Init listeners
            window.addEventListener('recalc-trigger', recalc);
            document.getElementById('theme_btn').onclick = toggleTheme;
            document.querySelectorAll('input').forEach(i => i.oninput = (e) => {
              if (e.target.type === 'range') sv(e.target, e.target.id.replace('i_','sv_'), e.target.id === 'i_churn' ? '%' : e.target.id === 'i_horizon' ? ' mo' : '');
              recalc();
            });
            document.querySelectorAll('.sc-tab').forEach(t => t.onclick = () => setScenario(+t.dataset.idx));
            
            // Initial call
            setTimeout(recalc, 500);
          })();
        `}
      </Script>
    </>
  );
}
