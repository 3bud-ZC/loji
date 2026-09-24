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
    playlist: string[];
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
    annotation: 'إلى لُجين • ٢٠٢٦'
  },
  littleWorld: {
    heading: 'عوالمُها',
    ideas: [
      {
        id: 'poetry',
        keyword: 'الشعر',
        reflection: 'الكلام لما الكلام العادي ما يكفيش.'
      },
      {
        id: 'music',
        keyword: 'الأغاني القديمة',
        reflection: 'فيروز في الخلفية... والباقي يهدأ وحده.'
      },
      {
        id: 'night',
        keyword: 'الليل',
        reflection: 'وقت أهدأ للكلام اللي يستاهل يتقال.'
      },
      {
        id: 'classics',
        keyword: 'الكلاسيكيات',
        reflection: 'الحاجات اللي بتفضل حلوة حتى بعد ما يعدّي وقتها.'
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
        annotation: 'أما الليل، فله عند الشعراء شأن... وعندي صار له صوت.',
        isOriginal: false
      },
      {
        poetId: 'and-i',
        poetName: 'وأنا',
        verses: [
          'يا لُجينُ، وفي صوتِكِ ليلٌ يَلينْ',
          'وفي اسمِكِ سِحرٌ على القلبِ يَبينْ',
          'لو مرَّ قيسٌ بكِ، لنسيَ ليلاهُ',
          'وقال القصيدُ: هنا الحُسنُ يَقينْ'
        ],
        annotation: '',
        isOriginal: true
      }
    ]
  },
  memories: {
    heading: 'صورة واحدة تكفي',
    vignette: {
      id: 'loji-photo',
      title: 'لُجين',
      caption: 'وبعض الصور لا تحتاج شرحًا.',
      imageSrc: './images/loji.webp',
      placeholderType: 'botanical'
    }
  },
  music: {
    heading: 'ليلة من زمن أقدم',
    invitation: 'شغّلي اللحن.',
    trackTitle: 'لحن ليلي قديم',
    trackArtist: 'لحن أصلي للموقع • عود وناي وأسطوانة',
    audioSrc: undefined,
    playlist: [
      'في المزاج: فيروز — نسم علينا الهوى',
      'في المزاج: فيروز — سألوني الناس',
      'في المزاج: محمد عبد الوهاب — جفنه علّم الغزل'
    ]
  },
  wishes: {
    leadIn: 'أتمنى ما تفقديش...',
    items: [
      'فضولكِ.',
      'ذوقكِ.',
      'شغفكِ بالتقنية.',
      'صوتكِ وطريقتكِ في الكلام.',
      'والحاجات الصغيرة اللي بتخليكي إنتِ.'
    ]
  },
  birthday: {
    leadIn: 'واليوم...',
    subLead: 'صفحة جديدة... والباقي لسه بيتكتب.',
    name: 'لُـجَـيْـن',
    wish: 'كل سنة وأنتِ بخير.',
    englishWish: 'Happy Birthday, Loji.'
  },
  letter: {
    sealPrompt: 'آخر حاجة • رسالة لكِ',
    salutation: 'إلى لُجين،',
    bodyParagraphs: [
      'كل سنة وإنتِ بخير يا لجين.',
      'يمكن أكتر حاجة شدتني فيكِ إن في شخصيتك حاجات كتير مألوفة بالنسبالي؛ ذوقك، شغفك بالتقنية، وطريقتك في التفكير. يمكن عشان كده الماتشنج بيننا جاي طبيعي، وكأني قابلت حد فيه حاجات كتير من طريقتي بس بروحه هو.',
      'وبعيدًا عن الشعر كله، شكلك جميل، وصوتك من التفاصيل اللي بتفضل في البال. أتمنى سنتك الجديدة تبقى أخف، أهدى، وأحلى، وفيها ناس وحاجات وأغاني تليق بيكِ فعلًا.'
    ],
    closing: 'عيد ميلاد سعيد.',
    signature: 'عابد',
    date: 'سبتمبر ٢٠٢٦'
  }
};
