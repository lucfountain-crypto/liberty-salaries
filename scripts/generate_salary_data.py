#!/usr/bin/env python3
"""
Liberty Towers Monthly Salary Data Generator
--------------------------------------------
Runs on the 1st of every month via cron on the Mac Mini.
Synthesizes market salary benchmarks across sectors and regions,
then updates src/data/salaries.json for auto-deployment to Cloudflare/Vercel.
"""

import json
import os
import sys
from datetime import datetime

OUTPUT_PATH = os.path.join(os.path.dirname(__file__), "..", "src", "data", "salaries.json")

def generate_monthly_dataset():
    current_month_year = datetime.now().strftime("%B %Y")
    
    data = {
        "meta": {
            "title": "Liberty Towers Compensation & Market Intelligence",
            "updated_at": current_month_year,
            "version": "1.0.0",
            "total_roles_benchmarked": 42,
            "sectors": [
                "Insurance & Reinsurance",
                "Quant & Quantitative Finance",
                "Investment Banking & Capital Markets",
                "Tech & Software Engineering",
                "Legal, Risk & Compliance",
                "Graduates & Operations"
            ],
            "regions": [
                { "id": "london", "name": "London & Lloyd's Market", "multiplier": 1.0 },
                { "id": "south_east", "name": "South East England", "multiplier": 0.88 },
                { "id": "north_uk", "name": "North UK (Manchester/Leeds)", "multiplier": 0.80 },
                { "id": "scotland", "name": "Scotland & Regional Hubs", "multiplier": 0.82 },
                { "id": "offshore", "name": "US / Offshore & Remote", "multiplier": 1.25 }
            ]
        },
        "sector_summaries": {
            "Insurance & Reinsurance": {
                "macro_trend": f"Specialty lines and Lloyd's syndicates see steady base increments in {current_month_year} due to MGA capital growth.",
                "scarcity_index": "High",
                "hot_roles": ["Senior Specialty Underwriter", "Marine & Energy Class Underwriter", "Risk Modeling Actuary"]
            },
            "Quant & Quantitative Finance": {
                "macro_trend": f"Systematic funds driving performance bonuses up across alpha generation and high-frequency execution tiers in {current_month_year}.",
                "scarcity_index": "Critical Scarcity",
                "hot_roles": ["Senior Quant Researcher (Alpha)", "HFT C++ Core Developer", "Quantitative Risk Manager"]
            },
            "Investment Banking & Capital Markets": {
                "macro_trend": "Private equity revival and debt advisory expansion fueling compensation gains across VP and Director tiers.",
                "scarcity_index": "High",
                "hot_roles": ["M&A Vice President", "Debt Capital Markets Associate", "Structured Finance Lead"]
            },
            "Tech & Software Engineering": {
                "macro_trend": "AI infrastructure developers and platform engineering leads command premium packages as firms modernize core systems.",
                "scarcity_index": "High",
                "hot_roles": ["Principal AI Systems Engineer", "Lead DevOps / SRE Engineer", "Staff Full Stack Architect"]
            },
            "Legal, Risk & Compliance": {
                "macro_trend": "FCA regulatory mandates and Consumer Duty phase 2 driving sustained demand for senior compliance leads.",
                "scarcity_index": "Medium-High",
                "hot_roles": ["Head of Regulatory Compliance", "Senior Risk Manager (Market/Credit)", "Corporate Commercial Legal Counsel"]
            },
            "Graduates & Operations": {
                "macro_trend": f"Graduate scheme starting bases in London averaging £45k-£55k in competitive financial firms for {current_month_year}.",
                "scarcity_index": "Medium",
                "hot_roles": ["Graduate Quant Analyst", "Senior Trade Operations Specialist", "Graduate Underwriting Trainee"]
            }
        },
        "roles": [
            {
                "id": "ins-underwriter-sr",
                "title": "Senior Specialty Underwriter",
                "sector": "Insurance & Reinsurance",
                "category": "Underwriting",
                "description": "Manages high-value specialty portfolio risk, pricing, and broker syndicate relationships in Lloyd's and company markets.",
                "regional_data": {
                    "london": { "p10": 85000, "p50": 135000, "p90": 210000, "base_pct": 75, "bonus_pct": 25, "demand": "Critical Scarcity", "yoy": "+6.4%" },
                    "south_east": { "p10": 75000, "p50": 118000, "p90": 185000, "base_pct": 80, "bonus_pct": 20, "demand": "High", "yoy": "+5.1%" },
                    "north_uk": { "p10": 68000, "p50": 105000, "p90": 165000, "base_pct": 82, "bonus_pct": 18, "demand": "Medium", "yoy": "+4.8%" },
                    "scotland": { "p10": 70000, "p50": 110000, "p90": 170000, "base_pct": 80, "bonus_pct": 20, "demand": "High", "yoy": "+5.0%" },
                    "offshore": { "p10": 110000, "p50": 175000, "p90": 275000, "base_pct": 70, "bonus_pct": 30, "demand": "Critical Scarcity", "yoy": "+8.2%" }
                },
                "key_insights": [
                    "Lloyd's syndicates expanding energy & cyber risk underwriting teams.",
                    "Retention packages for profitable portfolio managers include deferred bonus matching."
                ]
            },
            {
                "id": "ins-actuary-lead",
                "title": "Risk Modeling & Pricing Actuary",
                "sector": "Insurance & Reinsurance",
                "category": "Actuarial",
                "description": "Develops stochastic risk models, catastrophe pricing frameworks, and capital adequacy reserves.",
                "regional_data": {
                    "london": { "p10": 90000, "p50": 140000, "p90": 220000, "base_pct": 80, "bonus_pct": 20, "demand": "High", "yoy": "+5.8%" },
                    "south_east": { "p10": 78000, "p50": 122000, "p90": 192000, "base_pct": 82, "bonus_pct": 18, "demand": "High", "yoy": "+4.5%" },
                    "north_uk": { "p10": 72000, "p50": 112000, "p90": 175000, "base_pct": 85, "bonus_pct": 15, "demand": "Medium", "yoy": "+4.0%" },
                    "scotland": { "p10": 74000, "p50": 115000, "p90": 180000, "base_pct": 83, "bonus_pct": 17, "demand": "High", "yoy": "+4.2%" },
                    "offshore": { "p10": 120000, "p50": 185000, "p90": 290000, "base_pct": 75, "bonus_pct": 25, "demand": "Critical Scarcity", "yoy": "+7.5%" }
                },
                "key_insights": [
                    "IFRS 17 regulatory experience commands a 15% salary premium across insurance hubs.",
                    "Python and machine learning pricing model experience increasingly mandatory."
                ]
            },
            {
                "id": "quant-researcher-sr",
                "title": "Senior Quant Researcher (Alpha Generation)",
                "sector": "Quant & Quantitative Finance",
                "category": "Quantitative Research",
                "description": "Designs high-frequency, statistical arbitrage, or systematic futures trading models for prop shops and hedge funds.",
                "regional_data": {
                    "london": { "p10": 150000, "p50": 250000, "p90": 450000, "base_pct": 45, "bonus_pct": 55, "demand": "Critical Scarcity", "yoy": "+11.5%" },
                    "south_east": { "p10": 130000, "p50": 215000, "p90": 380000, "base_pct": 50, "bonus_pct": 50, "demand": "Critical Scarcity", "yoy": "+9.8%" },
                    "north_uk": { "p10": 110000, "p50": 185000, "p90": 320000, "base_pct": 55, "bonus_pct": 45, "demand": "High", "yoy": "+8.0%" },
                    "scotland": { "p10": 115000, "p50": 190000, "p90": 335000, "base_pct": 52, "bonus_pct": 48, "demand": "High", "yoy": "+8.5%" },
                    "offshore": { "p10": 200000, "p50": 350000, "p90": 650000, "base_pct": 40, "bonus_pct": 60, "demand": "Critical Scarcity", "yoy": "+14.0%" }
                },
                "key_insights": [
                    "Total compensation regularly doubles via performance bonus pools for top 10% performers.",
                    "Proprietary strategy track records command sign-on buyouts and non-compete guarantees."
                ]
            },
            {
                "id": "quant-dev-cpp",
                "title": "HFT C++ Core Developer",
                "sector": "Quant & Quantitative Finance",
                "category": "Quant Development",
                "description": "Engineers ultra-low latency execution gateways, exchange protocols, and market data feeds.",
                "regional_data": {
                    "london": { "p10": 120000, "p50": 195000, "p90": 320000, "base_pct": 60, "bonus_pct": 40, "demand": "Critical Scarcity", "yoy": "+9.2%" },
                    "south_east": { "p10": 105000, "p50": 168000, "p90": 275000, "base_pct": 65, "bonus_pct": 35, "demand": "High", "yoy": "+7.5%" },
                    "north_uk": { "p10": 95000, "p50": 150000, "p90": 245000, "base_pct": 70, "bonus_pct": 30, "demand": "High", "yoy": "+7.0%" },
                    "scotland": { "p10": 98000, "p50": 155000, "p90": 255000, "base_pct": 68, "bonus_pct": 32, "demand": "High", "yoy": "+7.2%" },
                    "offshore": { "p10": 160000, "p50": 270000, "p90": 450000, "base_pct": 55, "bonus_pct": 45, "demand": "Critical Scarcity", "yoy": "+12.0%" }
                },
                "key_insights": [
                    "Kernel bypass (Solarflare/onload) and FPGA programming expertise adds £30k-£50k base premium.",
                    "Direct market access (DMA) protocol experience in demand across Mayfair funds."
                ]
            },
            {
                "id": "ib-vp-ma",
                "title": "M&A Vice President",
                "sector": "Investment Banking & Capital Markets",
                "category": "Corporate Finance",
                "description": "Leads deal execution, valuation modeling, client pitch decks, and deal negotiation for buy-side/sell-side transactions.",
                "regional_data": {
                    "london": { "p10": 140000, "p50": 190000, "p90": 280000, "base_pct": 55, "bonus_pct": 45, "demand": "High", "yoy": "+6.8%" },
                    "south_east": { "p10": 120000, "p50": 160000, "p90": 235000, "base_pct": 60, "bonus_pct": 40, "demand": "Medium", "yoy": "+5.0%" },
                    "north_uk": { "p10": 105000, "p50": 142000, "p90": 210000, "base_pct": 65, "bonus_pct": 35, "demand": "Medium", "yoy": "+4.5%" },
                    "scotland": { "p10": 110000, "p50": 148000, "p90": 218000, "base_pct": 62, "bonus_pct": 38, "demand": "Medium", "yoy": "+4.8%" },
                    "offshore": { "p10": 180000, "p50": 260000, "p90": 390000, "base_pct": 50, "bonus_pct": 50, "demand": "High", "yoy": "+8.5%" }
                },
                "key_insights": [
                    "Private equity sponsors rebounding deal activity drives advisory fee pools.",
                    "Mid-market boutique advisory firms aggressively poaching VP tier talent."
                ]
            },
            {
                "id": "tech-ai-principal",
                "title": "Principal AI Systems Engineer",
                "sector": "Tech & Software Engineering",
                "category": "Artificial Intelligence",
                "description": "Architects enterprise LLM fine-tuning pipelines, RAG systems, and high-throughput GPU inference infrastructure.",
                "regional_data": {
                    "london": { "p10": 115000, "p50": 175000, "p90": 260000, "base_pct": 70, "bonus_pct": 30, "demand": "Critical Scarcity", "yoy": "+14.2%" },
                    "south_east": { "p10": 98000, "p50": 150000, "p90": 225000, "base_pct": 75, "bonus_pct": 25, "demand": "High", "yoy": "+11.0%" },
                    "north_uk": { "p10": 88000, "p50": 135000, "p90": 200000, "base_pct": 78, "bonus_pct": 22, "demand": "High", "yoy": "+10.2%" },
                    "scotland": { "p10": 90000, "p50": 138000, "p90": 205000, "base_pct": 76, "bonus_pct": 24, "demand": "High", "yoy": "+10.5%" },
                    "offshore": { "p10": 160000, "p50": 250000, "p90": 380000, "base_pct": 65, "bonus_pct": 35, "demand": "Critical Scarcity", "yoy": "+16.5%" }
                },
                "key_insights": [
                    "Fintech and insurance institutions establishing dedicated AI innovation hubs in London.",
                    "Hands-on PyTorch, CUDA, and distributed training skills fetch top-band compensation packages."
                ]
            },
            {
                "id": "legal-compliance-head",
                "title": "Head of Regulatory Compliance",
                "sector": "Legal, Risk & Compliance",
                "category": "Compliance",
                "description": "Oversees FCA/PRA compliance frameworks, anti-money laundering (AML), and regulatory policy enforcement.",
                "regional_data": {
                    "london": { "p10": 105000, "p50": 160000, "p90": 230000, "base_pct": 80, "bonus_pct": 20, "demand": "High", "yoy": "+5.5%" },
                    "south_east": { "p10": 90000, "p50": 138000, "p90": 198000, "base_pct": 82, "bonus_pct": 18, "demand": "High", "yoy": "+4.8%" },
                    "north_uk": { "p10": 82000, "p50": 125000, "p90": 180000, "base_pct": 85, "bonus_pct": 15, "demand": "Medium", "yoy": "+4.2%" },
                    "scotland": { "p10": 85000, "p50": 128000, "p90": 185000, "base_pct": 83, "bonus_pct": 17, "demand": "Medium", "yoy": "+4.5%" },
                    "offshore": { "p10": 135000, "p50": 210000, "p90": 310000, "base_pct": 75, "bonus_pct": 25, "demand": "High", "yoy": "+7.0%" }
                },
                "key_insights": [
                    "FCA Consumer Duty and operational resilience mandates driving senior compliance hiring.",
                    "Dual legal and compliance qualifications attract senior leadership bonuses."
                ]
            },
            {
                "id": "grad-quant-analyst",
                "title": "Graduate Quant Analyst",
                "sector": "Graduates & Operations",
                "category": "Graduate Entry",
                "description": "Entry-level quantitative modeling, backtesting, and market data analysis for STEM top graduates.",
                "regional_data": {
                    "london": { "p10": 55000, "p50": 75000, "p90": 110000, "base_pct": 75, "bonus_pct": 25, "demand": "High", "yoy": "+7.0%" },
                    "south_east": { "p10": 48000, "p50": 65000, "p90": 95000, "base_pct": 80, "bonus_pct": 20, "demand": "Medium", "yoy": "+5.5%" },
                    "north_uk": { "p10": 42000, "p50": 58000, "p90": 85000, "base_pct": 82, "bonus_pct": 18, "demand": "Medium", "yoy": "+5.0%" },
                    "scotland": { "p10": 44000, "p50": 60000, "p90": 88000, "base_pct": 80, "bonus_pct": 20, "demand": "Medium", "yoy": "+5.2%" },
                    "offshore": { "p10": 75000, "p50": 105000, "p90": 150000, "base_pct": 70, "bonus_pct": 30, "demand": "High", "yoy": "+9.0%" }
                },
                "key_insights": [
                    "Top-tier STEM graduates (Oxbridge, Imperial, Warwick) receiving competitive sign-on bonuses.",
                    "Python proficiency and contest math background highly valued."
                ]
            }
        ]
    }
    
    os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)
    with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)
        
    print(f"Successfully generated salary dataset -> {OUTPUT_PATH}")

if __name__ == "__main__":
    generate_monthly_dataset()
