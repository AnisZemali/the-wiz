"use client";
import {useEffect} from 'react';
import {tr,type Locale} from '@/lib/locale';
export function ThemeToggle({locale}:{locale:Locale}){
 useEffect(()=>{const media=matchMedia('(prefers-color-scheme: dark)');const sync=()=>{try{if(!localStorage.getItem('wiz-theme'))document.documentElement.dataset.theme=media.matches?'dark':'light'}catch{}};media.addEventListener('change',sync);return()=>media.removeEventListener('change',sync)},[]);
 return <button type="button" className="theme-toggle grid h-10 w-10 shrink-0 place-items-center rounded-full border border-ink-12 hover:bg-ink-04" aria-label={tr(locale,'Toggle light / dark mode','Changer le mode clair / sombre','تبديل الوضع الفاتح / الداكن')} title={tr(locale,'Light / dark mode','Mode clair / sombre','الوضع الفاتح / الداكن')} onClick={()=>{const theme=document.documentElement.dataset.theme==='dark'?'light':'dark';document.documentElement.dataset.theme=theme;try{localStorage.setItem('wiz-theme',theme)}catch{}}}><span className="theme-moon" aria-hidden="true">☾</span><span className="theme-sun" aria-hidden="true">☀</span></button>
}
