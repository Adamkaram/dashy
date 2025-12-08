# 📖 شرح كامل لنظام إعداد الدومين (Domain Setup System)

## 🎯 نظرة عامة على المشروع

المشروع ده عبارة عن واجهة مستخدم (UI) لإضافة والتحقق من الدومينات، مبني باستخدام:
- **Next.js** - إطار العمل
- **React** - مكتبة بناء الواجهات
- **Framer Motion** - مكتبة الـ Animations
- **Tailwind CSS** - للتنسيقات
- **shadcn/ui** - مكونات جاهزة

---

## 📁 هيكل الملفات

\`\`\`
├── app/
│   ├── page.tsx           # الصفحة الرئيسية
│   └── globals.css        # التنسيقات العامة والمتغيرات
├── domains-page.tsx       # صفحة عرض الدومينات
├── domain-setup.tsx       # صفحة إضافة دومين جديد
├── domain-verification.tsx # صفحة التحقق من الدومين
└── tailwind.config.js     # إعدادات Tailwind
\`\`\`

---

## 🔄 تدفق التطبيق (Application Flow)

\`\`\`
┌─────────────────────────────────────────────────────────────────┐
│                         app/page.tsx                             │
│                    (نقطة البداية)                                │
│                           ↓                                      │
├─────────────────────────────────────────────────────────────────┤
│                       DomainsPage                                │
│           (صفحة عرض الدومينات - الحالة الفارغة)                   │
│                           ↓                                      │
│                  [زر "Add Domain"]                               │
│                           ↓                                      │
├─────────────────────────────────────────────────────────────────┤
│                       DomainSetup                                │
│               (صفحة إضافة دومين جديد)                            │
│                           ↓                                      │
│          الخطوة 1: إدخال اسم الدومين والمنطقة                    │
│                           ↓                                      │
│              [زر "Add Domain" ← Animation]                       │
│                           ↓                                      │
│          الخطوة 2: عرض سجلات DNS                                 │
│                           ↓                                      │
│            [زر "I've added the records"]                         │
│                           ↓                                      │
├─────────────────────────────────────────────────────────────────┤
│                   DomainVerification                             │
│               (صفحة التحقق من السجلات)                           │
│                           ↓                                      │
│              عرض حالة التحقق (Pending)                           │
└─────────────────────────────────────────────────────────────────┘
\`\`\`

---

## 📄 شرح كل ملف بالتفصيل

---

### 1️⃣ `app/page.tsx` - الصفحة الرئيسية

\`\`\`tsx
"use client"

import DomainsPage from "../domains-page"

export default function Page() {
  return (
    <div>
      <DomainsPage />
    </div>
  )
}
\`\`\`

**الشرح:**
- `"use client"` - بيخلي الملف ده Client Component (يشتغل على المتصفح)
- بيستورد `DomainsPage` ويعرضه
- دي نقطة البداية للتطبيق

---

### 2️⃣ `domains-page.tsx` - صفحة عرض الدومينات

#### الـ State (حالة المكون):

\`\`\`tsx
const [showAddDomain, setShowAddDomain] = useState(false)  // للتحكم في عرض صفحة الإضافة
const [searchQuery, setSearchQuery] = useState("")          // للبحث
\`\`\`

#### منطق العرض:

\`\`\`tsx
// لو showAddDomain = true → اعرض صفحة إضافة الدومين
if (showAddDomain) {
  return <DomainSetup />
}

// غير كده → اعرض الصفحة العادية
return (
  <div className="min-h-screen bg-black text-white">
    {/* Header مع زر Add Domain */}
    {/* Search Bar */}
    {/* Empty State - الحالة الفارغة */}
  </div>
)
\`\`\`

#### تحليل الـ UI:

\`\`\`
┌─────────────────────────────────────────────────────────────┐
│  Domains                          [+ Add Domain] [API]     │
├─────────────────────────────────────────────────────────────┤
│  🔍 Search...    [All Statuses ▼]    [All Regions ▼]       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│        ┌────────────────────────────────────────┐           │
│        │                                        │           │
│        │   Send emails from any email address   │           │
│        │                                        │           │
│        │          [+ Add Domain]                │           │
│        │                                        │           │
│        └────────────────────────────────────────┘           │
│                                                              │
└─────────────────────────────────────────────────────────────┘
\`\`\`

---

### 3️⃣ `domain-setup.tsx` - صفحة إضافة الدومين (الملف الأساسي)

ده أهم ملف في المشروع لأنه فيه كل الـ Animations والمنطق.

#### الـ State:

\`\`\`tsx
const [currentStep, setCurrentStep] = useState(1)           // الخطوة الحالية (1 أو 2)
const [domain, setDomain] = useState("")                    // اسم الدومين
const [region, setRegion] = useState("eu-west-1")           // المنطقة
const [isSubmitted, setIsSubmitted] = useState(false)       // هل تم الإرسال؟
const [showVerification, setShowVerification] = useState(false) // هل نعرض صفحة التحقق؟
const dnsRecordsRef = useRef<HTMLDivElement>(null)         // مرجع لقسم DNS
\`\`\`

#### الدالة الرئيسية:

\`\`\`tsx
const handleAddDomain = () => {
  if (domain) {
    setIsSubmitted(true)      // تغيير الحالة
    setCurrentStep(2)         // الانتقال للخطوة 2
    
    // Scroll تلقائي لقسم DNS بعد 800ms
    setTimeout(() => {
      dnsRecordsRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }, 800)
  }
}
\`\`\`

---

## 🎬 شرح نظام الـ Animations بالتفصيل

### 1. Animated Light Pulse (الخط العمودي المضيء)

\`\`\`tsx
{/* الخط العمودي الأساسي */}
<div className="steps-gradient absolute top-0 h-full w-px">
  
  {/* نبضة الضوء المتحركة - تظهر فقط بعد الإرسال */}
  {isSubmitted && (
    <motion.div
      className="absolute top-0 w-px h-32 bg-gradient-to-b from-green-400 via-green-500 to-transparent"
      initial={{ y: 0, opacity: 0 }}           // البداية: من الأعلى، شفاف
      animate={{ y: "100vh", opacity: [0, 1, 1, 0] }}  // النهاية: ينزل، يظهر ثم يختفي
      transition={{
        duration: 1.5,        // المدة: 1.5 ثانية
        ease: "easeInOut",    // نوع الحركة
        delay: 0.2,           // تأخير 0.2 ثانية
      }}
    />
  )}
</div>
\`\`\`

**تحليل الحركة:**
\`\`\`
الحالة الأولية (initial):
- y: 0 (في الأعلى)
- opacity: 0 (شفاف)

الحالة النهائية (animate):
- y: "100vh" (ينزل لآخر الشاشة)
- opacity: [0, 1, 1, 0] 
  └→ 0: يبدأ شفاف
  └→ 1: يظهر
  └→ 1: يظل ظاهر
  └→ 0: يختفي
\`\`\`

### 2. Step Indicator Glow (توهج مؤشر الخطوة)

\`\`\`tsx
<motion.div
  className="bg-black absolute -left-[10px] top-7 z-10 h-[21px] w-[21px] flex rounded-full"
  animate={
    isSubmitted
      ? {
          // Animation لما يكون مُرسَل
          boxShadow: [
            "0 0 0 0 rgba(34, 197, 94, 0)",      // بدون ظل
            "0 0 0 8px rgba(34, 197, 94, 0.3)",  // ظل أخضر كبير
            "0 0 0 0 rgba(34, 197, 94, 0)",      // يرجع صغير
          ],
        }
      : {}  // بدون animation لو مش مُرسَل
  }
  transition={{ duration: 1, delay: 0.1 }}
>
\`\`\`

**تحليل الـ Box Shadow:**
\`\`\`
rgba(34, 197, 94, 0.3) = اللون الأخضر
└→ R: 34
└→ G: 197
└→ B: 94
└→ Alpha: 0.3 (شفافية 30%)

التأثير:
0 0 0 0px   → بدون ظل
0 0 0 8px   → ظل بحجم 8 بيكسل (توهج)
0 0 0 0px   → يرجع بدون ظل
\`\`\`

### 3. Checkmark Icon Animation (أيقونة الصح)

\`\`\`tsx
{isSubmitted ? (
  <motion.svg
    className="lucide lucide-circle-dashed h-3.5 w-3.5 text-green-500"
    initial={{ scale: 0 }}        // يبدأ صغير (غير مرئي)
    animate={{ scale: 1 }}        // ينمو للحجم الطبيعي
    transition={{ 
      delay: 0.3,                 // تأخير 0.3 ثانية
      duration: 0.4               // مدة 0.4 ثانية
    }}
  >
    {/* مسارات الأيقونة */}
  </motion.svg>
) : (
  // الأيقونة الرمادية (الحالة الأولية)
  <svg className="text-gray-400">...</svg>
)}
\`\`\`

### 4. Domain Card Background Animation

\`\`\`tsx
<motion.div
  className={`rounded-[10px] p-6 ${
    isSubmitted
      ? "bg-gradient-to-r from-green-4 via-green-1 to-green-1"  // خلفية خضراء
      : "bg-gradient-to-r from-gray-900/50 via-gray-800/30 to-gray-900/50"  // خلفية رمادية
  }`}
  animate={
    isSubmitted
      ? {
          scale: [1, 1.02, 1],  // يكبر قليلاً ثم يرجع
          backgroundColor: [
            "rgba(17, 24, 39, 0.5)",      // رمادي غامق
            "rgba(34, 197, 94, 0.1)",      // أخضر فاتح
            "rgba(34, 197, 94, 0.05)",     // أخضر أفتح
          ],
        }
      : {}
  }
  transition={{
    duration: 0.6,
    ease: "easeInOut",
  }}
>
\`\`\`

### 5. CSS Keyframe Animations (للجداول)

\`\`\`css
/* Animation للظهور من الأسفل مع الشفافية */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Animation للانزلاق من الأسفل */
@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
\`\`\`

**استخدامها في الكود:**

\`\`\`tsx
{/* قسم DNS - ينزلق من الأسفل */}
<div className="animate-[slideInUp_0.8s_ease-out_0.3s_both]">

  {/* قسم DKIM - يظهر بتأخير */}
  <div className="opacity-0 animate-[fadeInUp_0.6s_ease-out_0.5s_both]">
  
    {/* الجدول - يظهر بتأخير أكبر */}
    <div className="opacity-0 animate-[fadeInUp_0.6s_ease-out_0.7s_both]">
    
      {/* كل صف في الجدول - يظهر بتأخير متزايد */}
      {records.map((record, index) => (
        <tr 
          className="opacity-0 animate-[fadeInUp_0.4s_ease-out_both]"
          style={{ animationDelay: `${0.9 + index * 0.1}s` }}
        >
\`\`\`

**تحليل Animation String:**

\`\`\`
animate-[fadeInUp_0.6s_ease-out_0.5s_both]
         │        │     │       │     │
         │        │     │       │     └→ fill-mode: both
         │        │     │       └→ delay: 0.5s
         │        │     └→ timing: ease-out
         │        └→ duration: 0.6s
         └→ animation-name: fadeInUp
\`\`\`

---

## 🎨 نظام الألوان (Color System)

### المتغيرات في `globals.css`:

\`\`\`css
:root {
  /* ألوان الـ Slate (الرمادي المائل للأزرق) */
  --slate-1: #fcfcfd;
  --slate-3: #ddeaf814;    /* للخلفيات الخفيفة */
  --slate-6: #d6ebfd30;    /* للحدود */
  --slate-11: #b1b5c3;     /* للنصوص الثانوية */
  --slate-12: #ffffff;     /* للنصوص الأساسية */

  /* ألوان الأخضر (للنجاح) */
  --green-1: #00de4505;
  --green-4: #11ff992d;
  --green-7: #50fdac5e;
  
  /* ألوان الأصفر (للتحذيرات) */
  --yellow-3: #fa820022;
  --yellow-4: #fc820032;
  --yellow-11: #ffca16;
}
\`\`\`

### استخدام الألوان:

\`\`\`tsx
// نص رمادي فاتح (ثانوي)
<span className="text-slate-11">...</span>

// نص أبيض (أساسي)
<h1 className="text-slate-12">...</h1>

// خلفية شفافة
<div className="bg-slate-3">...</div>

// حدود خفيفة
<div className="border-slate-6">...</div>
\`\`\`

---

## 🏗️ هيكل الـ Domain Setup Card

\`\`\`
┌──────────────────────────────────────────────────────────────────┐
│                                                                   │
│  ●─────────────────────────────────  ← الخط العمودي (steps-gradient)
│  │                                                               │
│  ◉ ← Step Indicator                                             │
│  │   ┌─────────────────────────────────────────────────────┐    │
│  │   │                                                     │    │
│  │   │   Domain  ✓                                         │    │
│  │   │   Domain name and region for your sending.          │    │
│  │   │                                                     │    │
│  │   │   Name: [________________]                          │    │
│  │   │   Region: [Ireland (eu-west-1) ▼]                   │    │
│  │   │                                                     │    │
│  │   │   [+ Add Domain]                                    │    │
│  │   │                                                     │    │
│  │   └─────────────────────────────────────────────────────┘    │
│  │                                                               │
│  ◯ ← Step Indicator 2                                           │
│  │   ┌─────────────────────────────────────────────────────┐    │
│  │   │                                                     │    │
│  │   │   DNS Records                                       │    │
│  │   │   ┌───────────────────────────────────────────┐    │    │
│  │   │   │ Name  │ Type │ TTL  │ Value              │    │    │
│  │   │   ├───────┼──────┼──────┼────────────────────┤    │    │
│  │   │   │ send  │ MX   │ Auto │ 10 feedback...     │    │    │
│  │   │   │ send  │ TXT  │ Auto │ v=spf1 include...  │    │    │
│  │   │   └───────────────────────────────────────────┘    │    │
│  │   │                                                     │    │
│  │   │   [✓ I've added the records]  [Forward instructions]│    │
│  │   │                                                     │    │
│  │   └─────────────────────────────────────────────────────┘    │
│  │                                                               │
│  ●─────────────────────────────────                              │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
\`\`\`

---

## 📊 سجلات DNS

### البيانات:

\`\`\`tsx
const dkimSpfRecords = [
  {
    name: "send",
    type: "MX",
    ttl: "Auto",
    value: "10 feedback-smtp.eu-west-1.amazonses.com",
  },
  {
    name: "send",
    type: "TXT",
    ttl: "Auto",
    value: "v=spf1 include:amazonses.com ~all",
  },
  {
    name: "resend._domainkey",
    type: "TXT",
    ttl: "Auto",
    value: "p=MIGfMA0GCSqGSIb3DQEBA...",
  },
]

const dmarcRecords = [
  {
    name: "_dmarc",
    type: "TXT",
    ttl: "Auto",
    value: "v=DMARC1; p=none;",
  },
]
\`\`\`

---

## 🔄 حالات الـ Read-Only Input

\`\`\`tsx
{/* حالة عادية - Input قابل للتعديل */}
<Input
  value={domain}
  onChange={(e) => setDomain(e.target.value)}
  className="border-gray-700 bg-black"
/>

{/* حالة Read-Only - بعد الإرسال */}
<input
  className="text-slate-11 border-slate-6 bg-slate-3 cursor-default"
  data-1p-ignore="true"        // يمنع 1Password من التدخل
  data-state="read-only"       // للتنسيقات
  readOnly                     // يمنع التعديل
  type="text"
  value="pa.com"
/>
\`\`\`

**تنسيقات Read-Only في CSS:**

\`\`\`css
input[data-state="read-only"] {
  cursor: default;
  border-color: var(--color-slate-4);
  background-color: var(--color-slate-5);
  color: var(--color-slate-10);
}

input[data-state="read-only"]:focus-visible {
  box-shadow: none;  /* إزالة الـ ring */
}
\`\`\`

---

## 4️⃣ `domain-verification.tsx` - صفحة التحقق

### الفكرة:
بعد ما المستخدم يضيف سجلات DNS، بيروح لصفحة التحقق اللي بتوضح حالة كل سجل.

### المكونات الرئيسية:

\`\`\`tsx
{/* Warning Box - صندوق التحذير */}
<div className="bg-gradient-fade from-yellow-4 border-yellow-5">
  <LoaderCircle 
    className="animate-spin" 
    style={{ animationDuration: "3s" }}  // دوران بطيء
  />
  <p>Looking for DNS records...</p>
</div>

{/* جدول السجلات مع حالة كل واحد */}
<tr>
  <td>MX</td>
  <td>send</td>
  <td>feedback-smtp...</td>
  <td>Auto</td>
  <td>10</td>
  <td><Badge className="badge-pending">Pending</Badge></td>
</tr>
\`\`\`

### هيكل الصفحة:

\`\`\`
┌────────────────────────────────────────────────────────────┐
│  🌐  Domain                                                │
│      ada.com                                               │
│                                    [Restart] [API] [...]   │
├────────────────────────────────────────────────────────────┤
│  Created: about 3 hours ago                                │
│  Status: [Pending]                                         │
│  Region: 🇮🇪 Ireland (eu-west-1)                           │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  ⟳ Looking for DNS records in your domain provider...     │
│    It may take a few minutes or hours...                   │
│                                                            │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  DNS Records                                               │
│  ┌───────────────────────────────────────────────────────┐│
│  │ DKIM and SPF [Required]                               ││
│  ├───────┬──────┬─────────────┬──────┬────────┬─────────┤│
│  │ Type  │ Name │ Content     │ TTL  │Priority│ Status  ││
│  ├───────┼──────┼─────────────┼──────┼────────┼─────────┤│
│  │ MX    │ send │ feedback... │ Auto │ 10     │ Pending ││
│  │ TXT   │ send │ v=spf1...   │ Auto │ -      │ Pending ││
│  │ TXT   │ res..│ p=MIGf...   │ Auto │ -      │ Pending ││
│  └───────┴──────┴─────────────┴──────┴────────┴─────────┘│
│                                                            │
│  ┌───────────────────────────────────────────────────────┐│
│  │ DMARC [Recommended]                                   ││
│  ├───────┬────────┬───────────────┬──────┐              ││
│  │ Type  │ Name   │ Content       │ TTL  │              ││
│  ├───────┼────────┼───────────────┼──────┤              ││
│  │ TXT   │ _dmarc │ v=DMARC1;...  │ Auto │              ││
│  └───────┴────────┴───────────────┴──────┘              ││
│                                                            │
└────────────────────────────────────────────────────────────┘
\`\`\`

---

## 🎨 الـ Badge Components

### أنواع الـ Badges:

\`\`\`tsx
// Badge عادي (Required)
<Badge 
  variant="outline"
  className="text-slate-9 border-slate-4 border bg-transparent"
>
  Required
</Badge>

// Badge حالة (Pending)
<Badge className="badge-pending">
  Pending
</Badge>
\`\`\`

### تنسيقات الـ Badges في CSS:

\`\`\`css
.badge-pending {
  color: rgba(255, 144, 102, 1);      /* برتقالي */
  background-color: rgba(42, 23, 17, 1); /* بني غامق */
}

.badge-success {
  color: var(--green-400);
  background-color: var(--green-900);
}

.badge-warning {
  color: var(--yellow-11);
  background-color: var(--yellow-3);
}

.badge-error {
  color: var(--red-400);
  background-color: var(--red-900);
}
\`\`\`

---

## 🔑 الـ SVG Icons المخصصة

### أيقونة الكرة الأرضية (Globe):

\`\`\`tsx
<svg viewBox="0 0 32 32" width="36" height="36">
  <path d="M16 1C7.729 1 1 7.72894 1 16C1 24.2711...">
  {/* الخطوط العرضية والطولية للكرة الأرضية */}
  </path>
  
  <defs>
    <linearGradient id="status-icon-fill-dark">
      <stop stopColor="white" />
      <stop offset="0.2" stopColor="white" />
      <stop offset="1" stopColor="white" stopOpacity="0" />
    </linearGradient>
  </defs>
</svg>
\`\`\`

### أيقونة الدائرة المتقطعة (Circle Dashed):

\`\`\`tsx
<svg className="lucide lucide-circle-dashed">
  <path d="M10.1 2.182a10 10 0 0 1 3.8 0" />
  <path d="M13.9 21.818a10 10 0 0 1-3.8 0" />
  <path d="M17.609 3.721a10 10 0 0 1 2.69 2.7" />
  {/* باقي أجزاء الدائرة */}
</svg>
\`\`\`

---

## 📐 الـ Steps Gradient (الخط العمودي)

\`\`\`css
.steps-gradient {
  background: linear-gradient(
    180deg,                              /* اتجاه من أعلى لأسفل */
    transparent 0%,                       /* شفاف في البداية */
    rgba(148, 163, 184, 0.3) 10%,        /* رمادي خفيف */
    rgba(148, 163, 184, 0.3) 90%,        /* رمادي خفيف */
    transparent 100%                      /* شفاف في النهاية */
  );
}
\`\`\`

**التأثير البصري:**
\`\`\`
     شفاف
       ↓
    ─────  ← بداية التدرج (10%)
    │   │
    │   │  ← رمادي خفيف
    │   │
    ─────  ← نهاية التدرج (90%)
       ↓
     شفاف
\`\`\`

---

## 🎯 ملخص نظام الـ Animations

| Animation | المكون | التأخير | المدة | الوصف |
|-----------|--------|---------|-------|-------|
| Light Pulse | الخط العمودي | 0.2s | 1.5s | نبضة ضوء تنزل |
| Step Glow | مؤشر الخطوة 1 | 0.1s | 1s | توهج أخضر |
| Checkmark Scale | أيقونة الصح | 0.3s | 0.4s | تكبير من 0 لـ 1 |
| Card Scale | الكارت | 0s | 0.6s | تكبير خفيف |
| DNS Slide | قسم DNS | 0.3s | 0.8s | انزلاق من الأسفل |
| Table Fade | جدول DKIM | 0.7s | 0.6s | ظهور تدريجي |
| Row Fade | صفوف الجدول | 0.9s+ | 0.4s | ظهور متتابع |

---

## ⚙️ ملف `tailwind.config.js` - الإعدادات المخصصة

ملف `tailwind.config.js` مش ملف افتراضي عادي - فيه إضافات كتير مؤثرة على شكل وحركة الموقع.

### 1. نظام الألوان المخصص (Custom Colors)

\`\`\`javascript
colors: {
  // ألوان Design System الأساسية
  "bg-primary": "var(--bg-primary)",
  "bg-surface": {
    default: "var(--bg-surface-default)",
    hover: "var(--bg-surface-hover)",
    selected: "var(--bg-surface-selected)",
  },
  "text-primary": "var(--text-primary)",
  "text-secondary": "var(--text-secondary)",
  "text-accent": "var(--text-accent)",
  "accent-primary": "var(--accent-primary)",
  "accent-surface": "var(--accent-surface)",
  "border-default": "var(--border-default)",
  "border-selected": "var(--border-selected)",
}
\`\`\`

**الاستخدام في الكود:**
\`\`\`tsx
// بدل ما تكتب
<div className="bg-[var(--bg-surface-default)]">

// تقدر تكتب
<div className="bg-bg-surface-default">
\`\`\`

### 2. سلالم الألوان الكاملة (Color Scales)

\`\`\`javascript
// Slate (12 درجة) - للخلفيات والنصوص
slate: {
  1: "var(--slate-1)",   // الأفتح
  2: "var(--slate-2)",
  // ... 
  11: "var(--slate-11)", // للنصوص الثانوية
  12: "var(--slate-12)", // الأغمق - للنصوص الأساسية
},

// Green (12 درجة + Tailwind scale) - للنجاح
green: {
  1: "var(--green-1)",
  // ...
  50: "var(--green-50)",   // Tailwind scale
  500: "var(--green-500)",
  900: "var(--green-900)",
},

// نفس الكلام لـ: yellow, red, blue, orange, violet, sand
\`\`\`

**الفايدة:**
\`\`\`tsx
// تقدر تستخدم أي درجة من السلم
<span className="text-slate-11">نص ثانوي</span>
<span className="text-green-9">نص نجاح</span>
<div className="bg-yellow-4">خلفية تحذير</div>
\`\`\`

### 3. الـ Keyframes المخصصة (Custom Animations)

دي أهم جزء - كل الـ animations معرفة هنا:

#### أ. Animations أساسية للظهور:

\`\`\`javascript
keyframes: {
  // انزلاق من الأسفل مع fade
  slideInUp: {
    from: { opacity: "0", transform: "translateY(30px)" },
    to: { opacity: "1", transform: "translateY(0)" },
  },
  
  // fade مع حركة أقل
  fadeInUp: {
    from: { opacity: "0", transform: "translateY(20px)" },
    to: { opacity: "1", transform: "translateY(0)" },
  },
  
  // انزلاق لأسفل (للارتفاع)
  slideDown: {
    from: { height: "0%", opacity: "0" },
    to: { height: "100%", opacity: "1" },
  },
}
\`\`\`

**الاستخدام:**
\`\`\`tsx
<div className="animate-slideInUp">ينزلق من الأسفل</div>
<div className="animate-fadeInUp">يظهر من الأسفل</div>
\`\`\`

#### ب. Animations للخط العمودي:

\`\`\`javascript
pulseLine: {
  "0%, 100%": {
    opacity: "0.3",
    transform: "translateX(-50%) scaleY(0.8)",
  },
  "50%": {
    opacity: "1",
    transform: "translateX(-50%) scaleY(1)",
  },
},
\`\`\`

#### ج. تأثير الـ Shine (للأزرار):

\`\`\`javascript
shine: {
  "0%": { transform: "translateX(-100%)" },
  "100%": { transform: "translateX(100%)" },
},
\`\`\`

**الاستخدام:**
\`\`\`tsx
<button className="overflow-hidden relative">
  Click me
  <span className="animate-shine absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
</button>
\`\`\`

#### د. Animations للـ Accordion و Collapsible:

\`\`\`javascript
// للفتح
"accordion-slide-down": {
  "0%": { height: "0", opacity: "0" },
  "100%": { height: "var(--radix-accordion-content-height)", opacity: "1" },
},

// للإغلاق
"accordion-slide-up": {
  "0%": { height: "var(--radix-accordion-content-height)", opacity: "1" },
  "100%": { height: "0", opacity: "0" },
},
\`\`\`

#### هـ. Animations للـ Navigation:

\`\`\`javascript
enterFromLeft: {
  "0%": { transform: "translateX(-100%)" },
  "100%": { transform: "translateX(0)" },
},
enterFromRight: {
  "0%": { transform: "translateX(100%)" },
  "100%": { transform: "translateX(0)" },
},
exitToLeft: {
  "0%": { transform: "translateX(0)" },
  "100%": { transform: "translateX(-100%)" },
},
exitToRight: {
  "0%": { transform: "translateX(0)" },
  "100%": { transform: "translateX(100%)" },
},
\`\`\`

#### و. Animations للـ Hero Section:

\`\`\`javascript
"hero-text-slide-up-fade": {
  "0%": { opacity: "0", transform: "translateY(20px)" },
  "100%": { opacity: "1", transform: "translateY(0)" },
},
"header-slide-down-fade": {
  "0%": { opacity: "0", transform: "translateY(-20px)" },
  "100%": { opacity: "1", transform: "translateY(0)" },
},
"webgl-scale-in-fade": {
  "0%": { opacity: "0", transform: "scale(0.8)" },
  "100%": { opacity: "1", transform: "scale(1)" },
},
\`\`\`

### 4. إعدادات الـ Animation Classes:

\`\`\`javascript
animation: {
  // Accordion
  "accordion-down": "accordion-down 0.2s ease-out",
  "accordion-up": "accordion-up 0.2s ease-out",
  
  // الرئيسية
  slideInUp: "slideInUp 0.8s ease-out 0.3s both",
  fadeInUp: "fadeInUp 0.6s ease-out both",
  slideDown: "slideDown 0.3s ease-in-out",
  pulseLine: "pulseLine 2s ease-in-out infinite",
  shine: "shine 1s ease 0.8s",
  
  // Scrolling (للـ marquee)
  "scroll-x": "scroll-x 180s linear infinite",
  "scroll-broadcast-x": "scroll-x 48s linear infinite",
  
  // تأثير الـ disco
  "disco-border": "disco 6s linear infinite",
  
  // Fade
  "fade-in": "fade-in 0.2s ease",
  "fade-out": "fade-out 0.2s ease",
  
  // Slide with fade (للـ dropdowns)
  "open-slide-up-fade": "open-slide-up-fade 0.2s",
  "close-slide-down-fade": "close-slide-down-fade 0.2s",
  
  // Scale effects
  "open-scale-in-fade": "open-scale-in-fade 0.2s ease-in-out",
  "open-scale-up-fade": "open-scale-up-fade 0.2s ease-in-out",
  
  // Plop effects (نبضات)
  plop: "plop 1s ease-in-out 0.1s infinite",
  plop2: "plop 1s ease-in-out 0.2s infinite",
  plop3: "plop 1s ease-in-out 0.4s infinite",
  
  // Hero
  "hero-text-slide-up-fade": "hero-text-slide-up-fade 1s ease-in-out",
  "webgl-scale-in-fade": "webgl-scale-in-fade 1s ease-in-out",
  "header-slide-down-fade": "header-slide-down-fade 1s ease-in-out",
  
  // Navigation
  enterFromLeft: "enterFromLeft 0.25s ease",
  enterFromRight: "enterFromRight 0.25s ease",
  exitToLeft: "exitToLeft 0.25s ease",
  exitToRight: "exitToRight 0.25s ease",
  scaleIn: "scaleIn 0.2s ease",
}
\`\`\`

### 5. الخطوط المخصصة (Font Families):

\`\`\`javascript
fontFamily: {
  sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
  mono: [
    "var(--font-mono)",
    "ui-monospace",
    "SFMono-Regular",
    "Menlo",
    "Monaco",
    "Consolas",
    "Liberation Mono",
    "Courier New",
    "monospace",
  ],
  display: ["var(--font-display)", "ui-sans-serif", "system-ui", "sans-serif"],
  domaine: ["var(--font-domaine)", "ui-sans-serif", "system-ui", "sans-serif"],
},
\`\`\`

**الاستخدام:**
\`\`\`tsx
<h1 className="font-display">عنوان بخط Display</h1>
<code className="font-mono">كود</code>
\`\`\`

### 6. أحجام الخطوط مع Line Heights:

\`\`\`javascript
fontSize: {
  xs: ["var(--text-xs)", { lineHeight: "var(--text-xs--line-height)" }],
  sm: ["var(--text-sm)", { lineHeight: "var(--text-sm--line-height)" }],
  base: ["var(--text-base)", { lineHeight: "var(--text-base--line-height)" }],
  // ... حتى 9xl
}
\`\`\`

### 7. الـ Background Gradients:

\`\`\`javascript
backgroundImage: {
  // Gradient للـ fade effect
  "gradient-fade": "linear-gradient(90deg, var(--yellow-4) 0%, transparent 40%)",
  
  // Gradient للخط العمودي (steps)
  "steps-gradient":
    "linear-gradient(180deg, transparent 0%, rgba(148, 163, 184, 0.3) 10%, rgba(148, 163, 184, 0.3) 90%, transparent 100%)",
},
\`\`\`

**الاستخدام:**
\`\`\`tsx
<div className="bg-gradient-fade">Warning box</div>
<div className="bg-steps-gradient">الخط العمودي</div>
\`\`\`

### 8. Transition Settings:

\`\`\`javascript
transitionDuration: {
  DEFAULT: "var(--default-transition-duration)",
},
transitionTimingFunction: {
  DEFAULT: "var(--default-transition-timing-function)",
  in: "var(--ease-in)",
  out: "var(--ease-out)",
  "in-out": "var(--ease-in-out)",
},
\`\`\`

### 9. الـ Plugin:

\`\`\`javascript
plugins: [require("tailwindcss-animate")],
\`\`\`

ده plugin بيضيف utilities إضافية للـ animations زي:
- `animate-in` / `animate-out`
- `fade-in` / `fade-out`
- `slide-in-from-top` / `slide-out-to-bottom`
- `zoom-in` / `zoom-out`

---

## 🔗 العلاقة بين الملفات

\`\`\`
tailwind.config.js
       │
       ├──→ يعرف الألوان ←── globals.css (CSS Variables)
       │
       ├──→ يعرف الـ keyframes ←── تُستخدم في Components
       │
       ├──→ يعرف الـ animation classes
       │         │
       │         └──→ animate-slideInUp (domain-setup.tsx)
       │         └──→ animate-fadeInUp (domain-setup.tsx)
       │         └──→ animate-shine (buttons)
       │
       └──→ يعرف bg-steps-gradient ←── الخط العمودي
\`\`\`

---

## 📋 جدول ملخص لتأثير tailwind.config.js

| الميزة | التأثير على المشروع | مثال الاستخدام |
|--------|---------------------|----------------|
| **Custom Colors** | ألوان موحدة عبر التطبيق | `text-slate-11`, `bg-green-4` |
| **Keyframes** | حركات مخصصة للعناصر | `animate-slideInUp` |
| **Animation Classes** | سهولة تطبيق الحركات | `animate-fadeInUp` |
| **Font Families** | خطوط مخصصة | `font-display`, `font-mono` |
| **Background Gradients** | تدرجات جاهزة | `bg-steps-gradient` |
| **Transitions** | حركات انتقال موحدة | `transition-all` |
| **tailwindcss-animate** | utilities إضافية | `animate-in fade-in` |

---

## 💡 نصائح للتطوير

### 1. إضافة Animation جديدة:

\`\`\`javascript
// في tailwind.config.js
keyframes: {
  myCustomAnimation: {
    "0%": { opacity: "0", transform: "scale(0.9)" },
    "100%": { opacity: "1", transform: "scale(1)" },
  },
},
animation: {
  "my-custom": "myCustomAnimation 0.5s ease-out",
},
\`\`\`

### 2. إضافة لون جديد:

\`\`\`javascript
// في tailwind.config.js
colors: {
  brand: {
    light: "var(--brand-light)",
    DEFAULT: "var(--brand)",
    dark: "var(--brand-dark)",
  },
}

// في globals.css
:root {
  --brand-light: #60a5fa;
  --brand: #3b82f6;
  --brand-dark: #1d4ed8;
}
\`\`\`

### 3. استخدام Animation مع تأخير مخصص:

\`\`\`tsx
// طريقة 1: باستخدام style
<div 
  className="animate-fadeInUp"
  style={{ animationDelay: "0.5s" }}
>

// طريقة 2: باستخدام arbitrary values
<div className="animate-[fadeInUp_0.6s_ease-out_0.5s_both]">
\`\`\`

---

## ⚠️ ملاحظات مهمة

1. **الـ CSS Variables لازم تكون معرفة في globals.css** - لو استخدمت `var(--slate-11)` في tailwind.config.js لازم تعرفها في CSS.

2. **الـ Plugin `tailwindcss-animate`** - مهم جداً لأنه بيضيف كتير من الـ utility classes للـ animations.

3. **الـ `both` في animation** - معناها إن العنصر هيحتفظ بالحالة الأولى قبل ما الـ animation يبدأ والحالة الأخيرة بعد ما يخلص.

4. **ترتيب التأخيرات** - لما تعمل animations متتابعة، حاسب التأخيرات كويس عشان تكون الحركة سلسة.

---

هذا التوثيق يوضح كيف أن ملف `tailwind.config.js` ليس مجرد ملف افتراضي، بل هو جزء أساسي من نظام التصميم والحركة في المشروع.