"use client";

import type { Reviewer } from "@/lib/profile-review";

interface ReviewerAvatarProps {
  reviewer: Reviewer;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  showBadge?: boolean;
}

export default function ReviewerAvatar({
  reviewer,
  size = "md",
  className = "",
  showBadge = true,
}: ReviewerAvatarProps) {
  const sizeMap = {
    sm: "size-9",
    md: "size-14",
    lg: "size-20",
    xl: "size-24",
  };

  const id = reviewer.id.toLowerCase();

  // Color schemes for skin, hair, and clothing
  const getAvatarArtwork = () => {
    switch (id) {
      // 1. Hannah (Auburn wavy hair, coral jacket)
      case "hannah":
        return (
          <>
            {/* Hair back */}
            <path d="M22 28 C18 38 16 54 20 64 L60 64 C64 54 62 38 58 28 Z" fill="#9C4124" />
            {/* Body / Blazer */}
            <path d="M12 76 C12 60 26 54 40 54 C54 54 68 60 68 76 Z" fill="#F43F5E" />
            <path d="M33 54 L40 68 L47 54 Z" fill="#FFF1F2" />
            {/* Neck & Head */}
            <rect x="35" y="44" width="10" height="12" rx="4" fill="#FBD3B6" />
            <ellipse cx="40" cy="34" rx="14" ry="17" fill="#FCD9BD" />
            {/* Hair front */}
            <path d="M25 28 C26 18 34 14 40 14 C48 14 55 18 55 28 C52 24 46 22 40 23 C34 24 28 26 25 28 Z" fill="#B44C28" />
            <path d="M24 30 C22 36 24 46 27 50 C26 42 27 34 30 30 Z" fill="#B44C28" />
            <path d="M56 30 C58 36 56 46 53 50 C54 42 53 34 50 30 Z" fill="#B44C28" />
            {/* Eyes & Smile */}
            <circle cx="35" cy="34" r="1.5" fill="#4A2810" />
            <circle cx="45" cy="34" r="1.5" fill="#4A2810" />
            <path d="M37 40 Q40 43 43 40" stroke="#8E4830" strokeWidth="1.2" strokeLinecap="round" fill="none" />
          </>
        );

      // 2. Emily (Sleek dark bob, purple blazer, pearls)
      case "emily":
        return (
          <>
            {/* Hair back */}
            <ellipse cx="40" cy="35" rx="17" ry="19" fill="#1E1B4B" />
            {/* Blazer */}
            <path d="M12 76 C12 60 26 54 40 54 C54 54 68 60 68 76 Z" fill="#7C3AED" />
            <path d="M32 54 L40 67 L48 54 Z" fill="#EDE9FE" />
            {/* Pearls */}
            <circle cx="36" cy="57" r="1.2" fill="#FFFFFF" />
            <circle cx="40" cy="58" r="1.2" fill="#FFFFFF" />
            <circle cx="44" cy="57" r="1.2" fill="#FFFFFF" />
            {/* Head */}
            <rect x="35" y="44" width="10" height="12" rx="4" fill="#FCE5D8" />
            <ellipse cx="40" cy="34" rx="13" ry="16" fill="#FCE5D8" />
            {/* Sleek bob front */}
            <path d="M25 28 C26 17 33 14 40 14 C48 14 55 17 55 28 C56 38 52 46 51 46 C49 38 50 26 40 24 C30 26 31 38 29 46 C28 46 24 38 25 28 Z" fill="#1E1B4B" />
            <circle cx="36" cy="33" r="1.5" fill="#1E1B4B" />
            <circle cx="44" cy="33" r="1.5" fill="#1E1B4B" />
            <path d="M38 39 Q40 41 42 39" stroke="#9A3412" strokeWidth="1.2" strokeLinecap="round" fill="none" />
          </>
        );

      // 3. Mark (Navy suit, crisp tie, spectacles)
      case "mark":
        return (
          <>
            <path d="M12 76 C12 60 26 52 40 52 C54 52 68 60 68 76 Z" fill="#1E3A8A" />
            <path d="M34 52 L40 66 L46 52 Z" fill="#FFFFFF" />
            {/* Red Tie */}
            <path d="M38 54 L42 54 L41 68 L40 70 L39 68 Z" fill="#DC2626" />
            {/* Head */}
            <rect x="35" y="42" width="10" height="12" rx="4" fill="#FCE7D6" />
            <ellipse cx="40" cy="33" rx="13" ry="16" fill="#FCE7D6" />
            {/* Hair */}
            <path d="M26 28 C28 17 36 15 42 15 C49 15 54 18 54 26 C50 22 43 20 37 22 C32 24 28 26 26 28 Z" fill="#3E2723" />
            {/* Glasses */}
            <rect x="31" y="30" width="7" height="5" rx="1.5" stroke="#1E293B" strokeWidth="1.2" fill="none" />
            <rect x="42" y="30" width="7" height="5" rx="1.5" stroke="#1E293B" strokeWidth="1.2" fill="none" />
            <line x1="38" y1="32" x2="42" y2="32" stroke="#1E293B" strokeWidth="1.2" />
            <circle cx="34.5" cy="32.5" r="1" fill="#1E293B" />
            <circle cx="45.5" cy="32.5" r="1" fill="#1E293B" />
            <path d="M38 39 Q40 41 42 39" stroke="#9A3412" strokeWidth="1.2" strokeLinecap="round" fill="none" />
          </>
        );

      // 4. Luke (Modern textured quiff, open collar shirt)
      case "luke":
        return (
          <>
            <path d="M12 76 C12 60 26 52 40 52 C54 52 68 60 68 76 Z" fill="#D97706" />
            <path d="M34 52 L40 64 L46 52 Z" fill="#FEF3C7" />
            <rect x="35" y="42" width="10" height="12" rx="4" fill="#FBD3B6" />
            <ellipse cx="40" cy="33" rx="13" ry="16" fill="#FCD9BD" />
            {/* Quiff hair */}
            <path d="M26 28 C26 18 35 12 44 13 C48 13 54 16 54 26 C48 21 40 21 34 23 C29 25 27 27 26 28 Z" fill="#451A03" />
            <circle cx="35" cy="33" r="1.5" fill="#451A03" />
            <circle cx="45" cy="33" r="1.5" fill="#451A03" />
            <path d="M38 39 Q40 42 42 39" stroke="#8E4830" strokeWidth="1.2" strokeLinecap="round" fill="none" />
          </>
        );

      // 5. Jon (Buzz crew cut, round modern designer glasses, dark teal sweater)
      case "jon":
        return (
          <>
            <path d="M12 76 C12 60 26 52 40 52 C54 52 68 60 68 76 Z" fill="#0F766E" />
            <rect x="35" y="42" width="10" height="12" rx="4" fill="#F5D0B5" />
            <ellipse cx="40" cy="33" rx="13" ry="16" fill="#F5D0B5" />
            {/* Buzz cut */}
            <path d="M26 27 C28 17 35 15 40 15 C46 15 52 17 54 27 Z" fill="#1C1917" />
            {/* Round glasses */}
            <circle cx="35" cy="32" r="3.8" stroke="#0F172A" strokeWidth="1.2" fill="none" />
            <circle cx="45" cy="32" r="3.8" stroke="#0F172A" strokeWidth="1.2" fill="none" />
            <line x1="38.8" y1="32" x2="41.2" y2="32" stroke="#0F172A" strokeWidth="1.2" />
            <circle cx="35" cy="32" r="1.2" fill="#0F172A" />
            <circle cx="45" cy="32" r="1.2" fill="#0F172A" />
            <path d="M38 39 Q40 41 42 39" stroke="#8E4830" strokeWidth="1.2" strokeLinecap="round" fill="none" />
          </>
        );

      // 6. Nita (High bun with gold accessory, fuchsia blazer)
      case "nita":
        return (
          <>
            {/* Top Bun */}
            <circle cx="40" cy="13" r="8" fill="#18181B" />
            <ellipse cx="40" cy="14" rx="4" ry="1.5" fill="#F59E0B" />
            {/* Blazer */}
            <path d="M12 76 C12 60 26 54 40 54 C54 54 68 60 68 76 Z" fill="#C026D3" />
            <path d="M33 54 L40 68 L47 54 Z" fill="#FAE8FF" />
            {/* Head */}
            <rect x="35" y="44" width="10" height="12" rx="4" fill="#D49B74" />
            <ellipse cx="40" cy="34" rx="13" ry="16" fill="#D49B74" />
            {/* Hair frame */}
            <path d="M26 28 C28 20 34 18 40 18 C46 18 52 20 54 28 C50 25 45 24 40 24 C35 24 30 25 26 28 Z" fill="#18181B" />
            <circle cx="35" cy="34" r="1.5" fill="#18181B" />
            <circle cx="45" cy="34" r="1.5" fill="#18181B" />
            <path d="M37 40 Q40 43 43 40" stroke="#78350F" strokeWidth="1.2" strokeLinecap="round" fill="none" />
          </>
        );

      // 7. Abdul (Neat beard, blue suit)
      case "abdul":
        return (
          <>
            <path d="M12 76 C12 60 26 52 40 52 C54 52 68 60 68 76 Z" fill="#0284C7" />
            <path d="M34 52 L40 66 L46 52 Z" fill="#FFFFFF" />
            <rect x="35" y="42" width="10" height="12" rx="4" fill="#E4A882" />
            <ellipse cx="40" cy="33" rx="13" ry="16" fill="#E4A882" />
            {/* Hair & Neat Beard */}
            <path d="M26 27 C28 17 35 15 40 15 C46 15 52 17 54 27 Z" fill="#1E293B" />
            <path d="M28 35 C28 47 33 50 40 50 C47 50 52 47 52 35 C52 44 46 47 40 47 C34 47 28 44 28 35 Z" fill="#1E293B" />
            <circle cx="35" cy="33" r="1.5" fill="#0F172A" />
            <circle cx="45" cy="33" r="1.5" fill="#0F172A" />
            <path d="M38 41 Q40 43 42 41" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" fill="none" />
          </>
        );

      // 8. Patrick (Distinguished silver temples, charcoal suit & tie)
      case "patrick":
        return (
          <>
            <path d="M12 76 C12 60 26 52 40 52 C54 52 68 60 68 76 Z" fill="#334155" />
            <path d="M34 52 L40 66 L46 52 Z" fill="#FFFFFF" />
            <path d="M38 54 L42 54 L41 68 L40 70 L39 68 Z" fill="#3B82F6" />
            <rect x="35" y="42" width="10" height="12" rx="4" fill="#FCE7D6" />
            <ellipse cx="40" cy="33" rx="13" ry="16" fill="#FCE7D6" />
            {/* Silver Hair */}
            <path d="M26 28 C28 17 36 15 42 15 C49 15 54 18 54 26 C50 22 43 20 37 22 C32 24 28 26 26 28 Z" fill="#94A3B8" />
            <circle cx="35" cy="33" r="1.5" fill="#1E293B" />
            <circle cx="45" cy="33" r="1.5" fill="#1E293B" />
            <path d="M38 39 Q40 41 42 39" stroke="#9A3412" strokeWidth="1.2" strokeLinecap="round" fill="none" />
          </>
        );

      // 9. Alex (Modern crop, cyan shirt)
      case "alex":
        return (
          <>
            <path d="M12 76 C12 60 26 52 40 52 C54 52 68 60 68 76 Z" fill="#0891B2" />
            <path d="M34 52 L40 62 L46 52 Z" fill="#E0F2FE" />
            <rect x="35" y="42" width="10" height="12" rx="4" fill="#FCD9BD" />
            <ellipse cx="40" cy="33" rx="13" ry="16" fill="#FCD9BD" />
            <path d="M26 26 C28 16 36 14 42 14 C49 14 54 17 54 25 C49 21 42 20 36 21 Z" fill="#4B382A" />
            <circle cx="35" cy="33" r="1.5" fill="#332115" />
            <circle cx="45" cy="33" r="1.5" fill="#332115" />
            <path d="M38 39 Q40 42 42 39" stroke="#8E4830" strokeWidth="1.2" strokeLinecap="round" fill="none" />
          </>
        );

      // 10. Simon (Spectacles, formal green blazer)
      case "simon":
        return (
          <>
            <path d="M12 76 C12 60 26 52 40 52 C54 52 68 60 68 76 Z" fill="#065F46" />
            <path d="M34 52 L40 66 L46 52 Z" fill="#FFFFFF" />
            <path d="M38 54 L42 54 L41 68 L40 70 L39 68 Z" fill="#D97706" />
            <rect x="35" y="42" width="10" height="12" rx="4" fill="#FCE5D8" />
            <ellipse cx="40" cy="33" rx="13" ry="16" fill="#FCE5D8" />
            <path d="M26 27 C28 17 36 15 41 15 C47 15 54 18 54 26 C49 22 43 21 37 22 Z" fill="#422006" />
            {/* Glasses */}
            <circle cx="35" cy="32" r="3.5" stroke="#78350F" strokeWidth="1.2" fill="none" />
            <circle cx="45" cy="32" r="3.5" stroke="#78350F" strokeWidth="1.2" fill="none" />
            <line x1="38.5" y1="32" x2="41.5" y2="32" stroke="#78350F" strokeWidth="1.2" />
            <circle cx="35" cy="32" r="1.2" fill="#1C1917" />
            <circle cx="45" cy="32" r="1.2" fill="#1C1917" />
            <path d="M38 39 Q40 41 42 39" stroke="#9A3412" strokeWidth="1.2" strokeLinecap="round" fill="none" />
          </>
        );

      // 11. Debbie (Layered shoulder-length hair, rose jacket)
      case "debbie":
        return (
          <>
            <path d="M22 28 C18 38 16 54 20 64 L60 64 C64 54 62 38 58 28 Z" fill="#B45309" />
            <path d="M12 76 C12 60 26 54 40 54 C54 54 68 60 68 76 Z" fill="#E11D48" />
            <path d="M33 54 L40 66 L47 54 Z" fill="#FFE4E6" />
            <rect x="35" y="44" width="10" height="12" rx="4" fill="#FCD9BD" />
            <ellipse cx="40" cy="34" rx="13" ry="16" fill="#FCD9BD" />
            <path d="M25 28 C26 17 34 14 40 14 C48 14 55 17 55 28 C52 24 45 22 40 23 C34 24 28 26 25 28 Z" fill="#D97706" />
            <circle cx="35" cy="34" r="1.5" fill="#451A03" />
            <circle cx="45" cy="34" r="1.5" fill="#451A03" />
            <path d="M37 40 Q40 43 43 40" stroke="#8E4830" strokeWidth="1.2" strokeLinecap="round" fill="none" />
          </>
        );

      // 12. Lili (Modern fringe, indigo top, cat-eye glasses)
      case "lili":
        return (
          <>
            <ellipse cx="40" cy="35" rx="17" ry="18" fill="#312E81" />
            <path d="M12 76 C12 60 26 54 40 54 C54 54 68 60 68 76 Z" fill="#4F46E5" />
            <path d="M33 54 L40 65 L47 54 Z" fill="#EEF2FF" />
            <rect x="35" y="44" width="10" height="12" rx="4" fill="#FCE5D8" />
            <ellipse cx="40" cy="34" rx="13" ry="16" fill="#FCE5D8" />
            <path d="M25 24 C30 20 40 20 55 24 C55 27 50 30 40 30 C30 30 25 27 25 24 Z" fill="#312E81" />
            <rect x="30" y="30" width="8" height="5" rx="2" stroke="#4338CA" strokeWidth="1.2" fill="none" />
            <rect x="42" y="30" width="8" height="5" rx="2" stroke="#4338CA" strokeWidth="1.2" fill="none" />
            <line x1="38" y1="32" x2="42" y2="32" stroke="#4338CA" strokeWidth="1.2" />
            <circle cx="34" cy="32.5" r="1.2" fill="#1E1B4B" />
            <circle cx="46" cy="32.5" r="1.2" fill="#1E1B4B" />
            <path d="M38 40 Q40 42 42 40" stroke="#9A3412" strokeWidth="1.2" strokeLinecap="round" fill="none" />
          </>
        );

      // 13. Marina (Global strategist, teal suit)
      case "marina":
        return (
          <>
            <path d="M22 28 C18 38 16 54 20 64 L60 64 C64 54 62 38 58 28 Z" fill="#2E1065" />
            <path d="M12 76 C12 60 26 54 40 54 C54 54 68 60 68 76 Z" fill="#0284C7" />
            <path d="M33 54 L40 66 L47 54 Z" fill="#E0F2FE" />
            <rect x="35" y="44" width="10" height="12" rx="4" fill="#FBD3B6" />
            <ellipse cx="40" cy="34" rx="13" ry="16" fill="#FBD3B6" />
            <path d="M25 28 C26 17 34 14 40 14 C48 14 55 17 55 28 Z" fill="#3B0764" />
            <circle cx="35" cy="34" r="1.5" fill="#1E1B4B" />
            <circle cx="45" cy="34" r="1.5" fill="#1E1B4B" />
            <path d="M37 40 Q40 43 43 40" stroke="#8E4830" strokeWidth="1.2" strokeLinecap="round" fill="none" />
          </>
        );

      // 14. Terri (Short textured curls, green blazer)
      case "terri":
        return (
          <>
            <circle cx="28" cy="22" r="5" fill="#451A03" />
            <circle cx="36" cy="18" r="5" fill="#451A03" />
            <circle cx="44" cy="18" r="5" fill="#451A03" />
            <circle cx="52" cy="22" r="5" fill="#451A03" />
            <path d="M12 76 C12 60 26 54 40 54 C54 54 68 60 68 76 Z" fill="#059669" />
            <path d="M33 54 L40 66 L47 54 Z" fill="#ECFDF5" />
            <rect x="35" y="44" width="10" height="12" rx="4" fill="#B45309" />
            <ellipse cx="40" cy="34" rx="13" ry="16" fill="#B45309" />
            <circle cx="35" cy="34" r="1.5" fill="#1C1917" />
            <circle cx="45" cy="34" r="1.5" fill="#1C1917" />
            <path d="M37 40 Q40 43 43 40" stroke="#78350F" strokeWidth="1.2" strokeLinecap="round" fill="none" />
          </>
        );

      // 15. Tanya (High ponytail, golden hoop, amber top)
      case "tanya":
        return (
          <>
            {/* High pony to the side */}
            <path d="M52 18 C58 18 64 26 62 38 C60 44 56 46 54 40 Z" fill="#18181B" />
            <circle cx="52" cy="18" r="3" fill="#D97706" />
            <path d="M12 76 C12 60 26 54 40 54 C54 54 68 60 68 76 Z" fill="#D97706" />
            <path d="M33 54 L40 66 L47 54 Z" fill="#FEF3C7" />
            <rect x="35" y="44" width="10" height="12" rx="4" fill="#E4A882" />
            <ellipse cx="40" cy="34" rx="13" ry="16" fill="#E4A882" />
            <path d="M26 28 C28 20 35 17 42 17 C48 17 53 20 54 28 Z" fill="#18181B" />
            {/* Gold hoop earring */}
            <circle cx="27" cy="38" r="3" stroke="#F59E0B" strokeWidth="1.2" fill="none" />
            <circle cx="35" cy="34" r="1.5" fill="#18181B" />
            <circle cx="45" cy="34" r="1.5" fill="#18181B" />
            <path d="M37 40 Q40 43 43 40" stroke="#78350F" strokeWidth="1.2" strokeLinecap="round" fill="none" />
          </>
        );

      // 16. Rosie (Warm wavy lob, pink collar)
      case "rosie":
        return (
          <>
            <path d="M22 28 C18 38 16 54 20 64 L60 64 C64 54 62 38 58 28 Z" fill="#92400E" />
            <path d="M12 76 C12 60 26 54 40 54 C54 54 68 60 68 76 Z" fill="#EC4899" />
            <path d="M33 54 L40 66 L47 54 Z" fill="#FDF2F8" />
            <rect x="35" y="44" width="10" height="12" rx="4" fill="#FCE5D8" />
            <ellipse cx="40" cy="34" rx="13" ry="16" fill="#FCE5D8" />
            <path d="M25 28 C26 17 34 14 40 14 C48 14 55 17 55 28 C51 23 44 22 40 23 Z" fill="#B45309" />
            <circle cx="35" cy="34" r="1.5" fill="#451A03" />
            <circle cx="45" cy="34" r="1.5" fill="#451A03" />
            <path d="M37 40 Q40 43 43 40" stroke="#8E4830" strokeWidth="1.2" strokeLinecap="round" fill="none" />
          </>
        );

      // 17. Penny (Classic bun, glasses, blue collar)
      case "penny":
        return (
          <>
            <circle cx="40" cy="14" r="7" fill="#52525B" />
            <path d="M12 76 C12 60 26 54 40 54 C54 54 68 60 68 76 Z" fill="#4F46E5" />
            <path d="M33 54 L40 66 L47 54 Z" fill="#EEF2FF" />
            <rect x="35" y="44" width="10" height="12" rx="4" fill="#FCE7D6" />
            <ellipse cx="40" cy="34" rx="13" ry="16" fill="#FCE7D6" />
            <path d="M26 28 C28 20 35 18 40 18 C46 18 52 20 54 28 Z" fill="#71717A" />
            {/* Glasses */}
            <circle cx="35" cy="33" r="3.2" stroke="#1E293B" strokeWidth="1.2" fill="none" />
            <circle cx="45" cy="33" r="3.2" stroke="#1E293B" strokeWidth="1.2" fill="none" />
            <line x1="38.2" y1="33" x2="41.8" y2="33" stroke="#1E293B" strokeWidth="1.2" />
            <circle cx="35" cy="33" r="1.2" fill="#1E293B" />
            <circle cx="45" cy="33" r="1.2" fill="#1E293B" />
            <path d="M38 40 Q40 42 42 40" stroke="#9A3412" strokeWidth="1.2" strokeLinecap="round" fill="none" />
          </>
        );

      // 18. Harry (Commercial director, dark blazer)
      case "harry":
        return (
          <>
            <path d="M12 76 C12 60 26 52 40 52 C54 52 68 60 68 76 Z" fill="#475569" />
            <path d="M34 52 L40 66 L46 52 Z" fill="#FFFFFF" />
            <rect x="35" y="42" width="10" height="12" rx="4" fill="#F5D0B5" />
            <ellipse cx="40" cy="33" rx="13" ry="16" fill="#F5D0B5" />
            <path d="M27 27 C29 18 36 16 41 16 C47 16 53 19 53 27 Z" fill="#292524" />
            <circle cx="35" cy="33" r="1.5" fill="#1C1917" />
            <circle cx="45" cy="33" r="1.5" fill="#1C1917" />
            <path d="M38 39 Q40 41 42 39" stroke="#8E4830" strokeWidth="1.2" strokeLinecap="round" fill="none" />
          </>
        );

      // 19. Nick (Strategic sourcing lead, textured quiff)
      case "nick":
        return (
          <>
            <path d="M12 76 C12 60 26 52 40 52 C54 52 68 60 68 76 Z" fill="#2563EB" />
            <path d="M34 52 L40 64 L46 52 Z" fill="#DBEAFE" />
            <rect x="35" y="42" width="10" height="12" rx="4" fill="#FCD9BD" />
            <ellipse cx="40" cy="33" rx="13" ry="16" fill="#FCD9BD" />
            <path d="M26 28 C26 17 35 13 43 14 C48 14 54 17 54 26 C48 22 41 22 35 24 Z" fill="#172554" />
            <circle cx="35" cy="33" r="1.5" fill="#0F172A" />
            <circle cx="45" cy="33" r="1.5" fill="#0F172A" />
            <path d="M38 39 Q40 42 42 39" stroke="#8E4830" strokeWidth="1.2" strokeLinecap="round" fill="none" />
          </>
        );

      // 20. Gosia (Straight blonde hair, purple blazer)
      case "gosia":
        return (
          <>
            <path d="M22 28 C18 38 16 54 20 64 L60 64 C64 54 62 38 58 28 Z" fill="#CA8A04" />
            <path d="M12 76 C12 60 26 54 40 54 C54 54 68 60 68 76 Z" fill="#7E22CE" />
            <path d="M33 54 L40 66 L47 54 Z" fill="#F3E8FF" />
            <rect x="35" y="44" width="10" height="12" rx="4" fill="#FCE5D8" />
            <ellipse cx="40" cy="34" rx="13" ry="16" fill="#FCE5D8" />
            <path d="M25 28 C26 17 34 14 40 14 C48 14 55 17 55 28 Z" fill="#EAB308" />
            <circle cx="35" cy="34" r="1.5" fill="#422006" />
            <circle cx="45" cy="34" r="1.5" fill="#422006" />
            <path d="M37 40 Q40 43 43 40" stroke="#8E4830" strokeWidth="1.2" strokeLinecap="round" fill="none" />
          </>
        );

      // 21. Luna (Pixie bob with bangs, violet top)
      case "luna":
        return (
          <>
            <ellipse cx="40" cy="34" rx="16" ry="17" fill="#18181B" />
            <path d="M12 76 C12 60 26 54 40 54 C54 54 68 60 68 76 Z" fill="#9333EA" />
            <path d="M33 54 L40 66 L47 54 Z" fill="#FAF5FF" />
            <rect x="35" y="44" width="10" height="12" rx="4" fill="#FBD3B6" />
            <ellipse cx="40" cy="34" rx="13" ry="16" fill="#FBD3B6" />
            <path d="M25 24 C30 20 40 20 55 24 C54 28 48 30 40 30 C32 30 26 28 25 24 Z" fill="#18181B" />
            <circle cx="35" cy="34" r="1.5" fill="#18181B" />
            <circle cx="45" cy="34" r="1.5" fill="#18181B" />
            <path d="M37 40 Q40 43 43 40" stroke="#8E4830" strokeWidth="1.2" strokeLinecap="round" fill="none" />
          </>
        );

      // 22. Peter (Executive silver hair, dark suit, burgundy tie)
      case "peter":
        return (
          <>
            <path d="M12 76 C12 60 26 52 40 52 C54 52 68 60 68 76 Z" fill="#27272A" />
            <path d="M34 52 L40 66 L46 52 Z" fill="#FFFFFF" />
            <path d="M38 54 L42 54 L41 68 L40 70 L39 68 Z" fill="#881337" />
            <rect x="35" y="42" width="10" height="12" rx="4" fill="#FCE5D8" />
            <ellipse cx="40" cy="33" rx="13" ry="16" fill="#FCE5D8" />
            <path d="M26 27 C28 16 36 14 42 14 C48 14 54 17 54 26 C49 22 43 20 37 21 Z" fill="#E2E8F0" />
            <circle cx="35" cy="33" r="1.5" fill="#1E293B" />
            <circle cx="45" cy="33" r="1.5" fill="#1E293B" />
            <path d="M38 39 Q40 41 42 39" stroke="#9A3412" strokeWidth="1.2" strokeLinecap="round" fill="none" />
          </>
        );

      // 23. Paul (Senior industry practice, side part)
      case "paul":
        return (
          <>
            <path d="M12 76 C12 60 26 52 40 52 C54 52 68 60 68 76 Z" fill="#0284C7" />
            <path d="M34 52 L40 65 L46 52 Z" fill="#FFFFFF" />
            <rect x="35" y="42" width="10" height="12" rx="4" fill="#FCD9BD" />
            <ellipse cx="40" cy="33" rx="13" ry="16" fill="#FCD9BD" />
            <path d="M26 27 C28 17 36 15 41 15 C47 15 54 18 54 26 Z" fill="#3F2E1E" />
            <circle cx="35" cy="33" r="1.5" fill="#1C1917" />
            <circle cx="45" cy="33" r="1.5" fill="#1C1917" />
            <path d="M38 39 Q40 42 42 39" stroke="#8E4830" strokeWidth="1.2" strokeLinecap="round" fill="none" />
          </>
        );

      // 24. Betsy (Curly auburn hair, teal top)
      case "betsy":
        return (
          <>
            <circle cx="26" cy="24" r="6" fill="#9A3412" />
            <circle cx="34" cy="18" r="6" fill="#9A3412" />
            <circle cx="46" cy="18" r="6" fill="#9A3412" />
            <circle cx="54" cy="24" r="6" fill="#9A3412" />
            <circle cx="24" cy="34" r="6" fill="#9A3412" />
            <circle cx="56" cy="34" r="6" fill="#9A3412" />
            <path d="M12 76 C12 60 26 54 40 54 C54 54 68 60 68 76 Z" fill="#0D9488" />
            <path d="M33 54 L40 66 L47 54 Z" fill="#CCFBF1" />
            <rect x="35" y="44" width="10" height="12" rx="4" fill="#FCE5D8" />
            <ellipse cx="40" cy="34" rx="13" ry="16" fill="#FCE5D8" />
            <circle cx="35" cy="34" r="1.5" fill="#451A03" />
            <circle cx="45" cy="34" r="1.5" fill="#451A03" />
            <path d="M37 40 Q40 43 43 40" stroke="#8E4830" strokeWidth="1.2" strokeLinecap="round" fill="none" />
          </>
        );

      // 25. Ronnie (Sharp buzz fade, crimson jacket)
      case "ronnie":
        return (
          <>
            <path d="M12 76 C12 60 26 52 40 52 C54 52 68 60 68 76 Z" fill="#BE123C" />
            <path d="M34 52 L40 64 L46 52 Z" fill="#18181B" />
            <rect x="35" y="42" width="10" height="12" rx="4" fill="#E4A882" />
            <ellipse cx="40" cy="33" rx="13" ry="16" fill="#E4A882" />
            <path d="M26 27 C28 17 35 15 40 15 C46 15 52 17 54 27 Z" fill="#09090B" />
            <circle cx="35" cy="33" r="1.5" fill="#09090B" />
            <circle cx="45" cy="33" r="1.5" fill="#09090B" />
            <path d="M38 39 Q40 41 42 39" stroke="#78350F" strokeWidth="1.2" strokeLinecap="round" fill="none" />
          </>
        );

      // 26. Wendy (Soft silver-blonde waves, amber blazer)
      case "wendy":
        return (
          <>
            <path d="M22 28 C18 38 16 54 20 64 L60 64 C64 54 62 38 58 28 Z" fill="#CBD5E1" />
            <path d="M12 76 C12 60 26 54 40 54 C54 54 68 60 68 76 Z" fill="#C2410C" />
            <path d="M33 54 L40 66 L47 54 Z" fill="#FFEDD5" />
            <rect x="35" y="44" width="10" height="12" rx="4" fill="#FCE5D8" />
            <ellipse cx="40" cy="34" rx="13" ry="16" fill="#FCE5D8" />
            <path d="M25 28 C26 17 34 14 40 14 C48 14 55 17 55 28 Z" fill="#E2E8F0" />
            <circle cx="35" cy="34" r="1.5" fill="#334155" />
            <circle cx="45" cy="34" r="1.5" fill="#334155" />
            <path d="M37 40 Q40 43 43 40" stroke="#8E4830" strokeWidth="1.2" strokeLinecap="round" fill="none" />
          </>
        );

      // 27. Graeme (Strategic workforce, wire glasses, slate blazer)
      case "graeme":
        return (
          <>
            <path d="M12 76 C12 60 26 52 40 52 C54 52 68 60 68 76 Z" fill="#1E293B" />
            <path d="M34 52 L40 66 L46 52 Z" fill="#FFFFFF" />
            <rect x="35" y="42" width="10" height="12" rx="4" fill="#FCD9BD" />
            <ellipse cx="40" cy="33" rx="13" ry="16" fill="#FCD9BD" />
            <path d="M26 27 C28 16 36 15 41 15 C47 15 54 18 54 26 Z" fill="#64748B" />
            <circle cx="35" cy="32" r="3.5" stroke="#94A3B8" strokeWidth="1.2" fill="none" />
            <circle cx="45" cy="32" r="3.5" stroke="#94A3B8" strokeWidth="1.2" fill="none" />
            <line x1="38.5" y1="32" x2="41.5" y2="32" stroke="#94A3B8" strokeWidth="1.2" />
            <circle cx="35" cy="32" r="1.2" fill="#1E293B" />
            <circle cx="45" cy="32" r="1.2" fill="#1E293B" />
            <path d="M38 39 Q40 41 42 39" stroke="#8E4830" strokeWidth="1.2" strokeLinecap="round" fill="none" />
          </>
        );

      // 28. Emma (Long dark waves, fuchsia scarf/blazer)
      case "emma":
      default:
        return (
          <>
            <path d="M22 28 C17 38 15 54 19 64 L61 64 C65 54 63 38 59 28 Z" fill="#292524" />
            <path d="M12 76 C12 60 26 54 40 54 C54 54 68 60 68 76 Z" fill="#DB2777" />
            <path d="M33 54 L40 66 L47 54 Z" fill="#FDF2F8" />
            <rect x="35" y="44" width="10" height="12" rx="4" fill="#FCD9BD" />
            <ellipse cx="40" cy="34" rx="13" ry="16" fill="#FCD9BD" />
            <path d="M25 28 C26 17 34 14 40 14 C48 14 55 17 55 28 C51 23 44 22 40 23 Z" fill="#1C1917" />
            <circle cx="35" cy="34" r="1.5" fill="#1C1917" />
            <circle cx="45" cy="34" r="1.5" fill="#1C1917" />
            <path d="M37 40 Q40 43 43 40" stroke="#8E4830" strokeWidth="1.2" strokeLinecap="round" fill="none" />
          </>
        );
    }
  };

  return (
    <div className={`relative shrink-0 ${sizeMap[size]} ${className}`}>
      {/* Avatar Container with Gradient Border & Shadow */}
      <div className={`w-full h-full rounded-full overflow-hidden bg-gradient-to-br ${reviewer.gradient} p-0.5 shadow-md ring-2 ring-white`}>
        <div className="w-full h-full rounded-full overflow-hidden bg-slate-900/10 backdrop-blur-2xs flex items-center justify-center">
          <svg
            viewBox="0 0 80 80"
            className="w-full h-full"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {getAvatarArtwork()}
          </svg>
        </div>
      </div>

      {/* Verified / Active Consultant Badge */}
      {showBadge && size !== "sm" && (
        <span
          className="absolute -bottom-0.5 -right-0.5 size-4 sm:size-5 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center shadow-xs"
          title="Verified Liberty Towers Advisor"
        >
          <svg className="w-2.5 h-2.5 text-white stroke-[3]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </span>
      )}
    </div>
  );
}
