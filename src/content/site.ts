/**
 * Central Content Configuration for Loji's Birthday Poetic Experience.
 * Art-directed, literary, and emotionally restrained.
 * Less content. Better content. Stronger presentation.
 */

export interface WorldIdea {
  id: string;
  keyword: string;
  reflection: string;
}

export interface PoetryScene {
  poetId: string;
  poetName: string;
  verses: string[];
  annotation: string;
  isOriginal: boolean;
}

export interface MemoryVignette {
  id: string;
  title: string;
  caption: string;
  imageSrc?: string;
  placeholderType: 'botanical' | 'calligraphy' | 'vinyl' | 'book';
}

export interface SiteConfig {
  meta: {
    title: string;
    description: string;
    url: string;
    nameArabic: string;
    nameEnglish: string;
  };
  opening: {
    forLabel: string;
    greeting: string;
    poeticLine: string;
    promptText: string;
  };
  hero: {
    nameArabic: string;
    subtitle: string;
    annotation: string;
  };
  littleWorld: {
    heading: string;
    ideas: WorldIdea[];
  };
  poetryMoment: {
    scenes: PoetryScene[];
  };
  memories: {
    heading: string;
    vignette: MemoryVignette;
  };
  music: {
    heading: string;
    invitation: string;
    trackTitle: string;
    trackArtist: string;
    audioSrc?: string;
  };
  wishes: {
    leadIn: string;
    items: string[];
  };
  birthday: {
    leadIn: string;
    subLead: string;
    name: string;
    wish: string;
    englishWish: string;
  };
  letter: {
    sealPrompt: string;
    salutation: string;
    bodyParagraphs: string[];
    closing: string;
    signature: string;
    date: string;
  };
}

export const siteConfig: SiteConfig = {
  meta: {
    title: 'إلى لُجين — مخطوطة شعرية',
    description: 'مخطوطة شعرية كلاسيكية وتجربة رقمية كُتبت خصيصاً لـ لُجين.',
    url: 'https://3bud-zc.github.io/loji/',
    nameArabic: 'لُجين',
    nameEnglish: 'Loji'
  },
  opening: {
    forLabel: 'For Loji',
    greeting: 'إلى لُجين',
    poeticLine: 'التي كان من سوء حظ الشعراء أنها جاءت بعدهم.',
    promptText: 'افتحي المخطوطة'
  },
  hero: {
    nameArabic: 'لُـجَـيْـن',
    subtitle: 'بعض الأسماء تُقال، وبعضها يُروى.',
    annotation: 'مخطوطة خاصة • خريف ٢٠٢٦'
  },
  littleWorld: {
    heading: 'عوالمُها',
    ideas: [
      {
        id: 'poetry',
        keyword: 'الشعر',
        reflection: 'الكلام حين لا تكفيه المحادثة.'
      },
      {
        id: 'music',
        keyword: 'الأغاني القديمة',
        reflection: 'حكاياتٌ كُتبت على مهل، وبقيت.'
      },
      {
        id: 'night',
        keyword: 'الليل',
        reflection: 'مساحة أهدأ للأفكار الصادقة.'
      },
      {
        id: 'classics',
        keyword: 'الكلاسيكيات',
        reflection: 'أشياءٌ لا تُنسى مهما تبدّل الوقت.'
      }
    ]
  },
  poetryMoment: {
    scenes: [
      {
        poetId: 'qays',
        poetName: 'قيس بن الملوح',
        verses: [
          'أَمُرُّ عَلى الدِيارِ دِيارِ لَيلى',
          'أُقَبِّلُ ذا الجِدارَ وَذا الجِدارا',
          'وَما حُبُّ الدِيارِ شَغَفنَ قَلبِي',
          'وَلَكِن حُبُّ مَن سَكَنَ الدِيارا'
        ],
        annotation: 'لو عرفكِ قيس، لربما تغيّر اسم الحكاية.',
        isOriginal: false
      },
      {
        poetId: 'imru',
        poetName: 'امرؤ القيس',
        verses: [
          'وَلَيلٍ كَمَوجِ البَحرِ أَرخى سُدولَهُ',
          'عَلَيَّ بِأَنواعِ الهُمومِ لِيَبتَلي'
        ],
        annotation: 'كانوا يبحثون في الليل عن أسبابٍ للشعر... وأنتِ الليل حين يصفو.',
        isOriginal: false
      },
      {
        poetId: 'and-i',
        poetName: 'وأنا',
        verses: [
          'وأنا لا أُجيد ما أجادوه،',
          'لكن أعرف أن اسمكِ كان سيليق بقصيدة.',
          'قالوا إن الشعراء بالغوا فيما وصفوا،',
          'ثم عرفتكِ... وفهمتُ أين كان العذر.'
        ],
        annotation: 'مكانكِ دائماً بين أصفى السطور.',
        isOriginal: true
      }
    ]
  },
  memories: {
    heading: 'أثرٌ باقٍ',
    vignette: {
      id: 'botanical-vignette',
      title: 'ورقةٌ ومساء',
      caption: 'كوردةٍ حُفظت بين دفتي كتاب.',
      placeholderType: 'botanical'
    }
  },
  music: {
    heading: 'صوتٌ من الماضي',
    invitation: 'شغّليها.',
    trackTitle: 'لحن المساء الهادئ',
    trackArtist: 'عزف كلاسيكي خاص',
    audioSrc: undefined
  },
  wishes: {
    leadIn: 'أتمنى ما تفقديش...',
    items: [
      'فضولكِ.',
      'ذوقكِ.',
      'حبكِ للكلمة الحلوة.',
      'طريقتكِ في سماع الأغاني.',
      'والحاجات الصغيرة اللي بتخليكي إنتِ.'
    ]
  },
  birthday: {
    leadIn: 'واليوم...',
    subLead: 'تُقلب القصيدة إلى صفحة جديدة.',
    name: 'لُـجَـيْـن',
    wish: 'كل سنة وأنتِ بخير.',
    englishWish: 'Happy Birthday, Loji.'
  },
  letter: {
    sealPrompt: 'آخر حاجة • رسالة لكِ',
    salutation: 'إلى لُجين،',
    bodyParagraphs: [
      'كل سنة وأنتِ الحكاية التي كان يستحق الشعر أن يعرفها.',
      'شكراً لأنكِ ببساطة أنتِ: بذوقكِ، وهدوئكِ، واهتمامكِ بالتفاصيل الصغيرة التي لا يلتفت إليها أحد. وجودكِ يضفي على الأماكن والكلمات معنى مختلفاً.',
      'أتمنى لكِ عاماً هادئاً يشبه أغنية قديمة تحبينها، ومليئاً باللحظات الصادقة والصفحات التي تسعد قلبكِ.'
    ],
    closing: 'عيد ميلاد سعيد.',
    signature: 'من صديقٍ يقدّر الكلمات',
    date: 'سبتمبر ٢٠٢٦'
  }
};
