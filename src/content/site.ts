/**
 * Central Content Configuration for Loji's Birthday Poetic Experience.
 * All texts, poetry excerpts, media references, and personalization options
 * are managed here for effortless customization.
 */

export interface WorldItem {
  id: string;
  title: string;
  tag: string;
  description: string;
  quote: string;
  symbol: string;
}

export interface PoetryScene {
  poetId: string;
  poetName: string;
  poetEra: string;
  verses: string[];
  commentary: string;
  isOriginal: boolean;
}

export interface MemoryItem {
  id: string;
  title: string;
  caption: string;
  tag: string;
  dateText?: string;
  imageSrc?: string; // Optional: Provide real photo URL/path here
  placeholderType: 'botanical' | 'calligraphy' | 'vinyl' | 'book';
}

export interface AudioTrack {
  id: string;
  title: string;
  artist: string;
  src?: string; // Optional: If provided, plays the local/remote MP3 file; otherwise uses procedural ambient vintage generator
  durationDisplay: string;
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
    buttonText: string;
  };
  hero: {
    titleArabic: string;
    tashkeelName: string;
    subtitle: string;
    manuscriptMetadata: {
      edition: string;
      paper: string;
      ink: string;
      occasion: string;
    };
  };
  littleWorld: {
    sectionTitle: string;
    sectionSubtitle: string;
    items: WorldItem[];
  };
  poetryMoment: {
    sectionTitle: string;
    sectionSubtitle: string;
    scenes: PoetryScene[];
  };
  memories: {
    sectionTitle: string;
    sectionSubtitle: string;
    items: MemoryItem[];
  };
  music: {
    sectionTitle: string;
    sectionSubtitle: string;
    recordLabel: string;
    vinylSub: string;
    note: string;
    tracks: AudioTrack[];
  };
  personalWishes: {
    sectionTitle: string;
    sectionSubtitle: string;
    wishes: string[];
  };
  birthdayReveal: {
    leadIn: string;
    transitionText: string;
    mainWishArabic: string;
    mainWishEnglish: string;
    subNote: string;
  };
  finalLetter: {
    sealTag: string;
    envelopeLabel: string;
    tapPrompt: string;
    letterHeader: string;
    bodyParagraphs: string[];
    signature: string;
    signatureDate: string;
  };
}

export const siteConfig: SiteConfig = {
  meta: {
    title: 'لُجين — إلى التي كُتب لها الشعر',
    description: 'تجربة شعرية وتوثيق كلاسيكي بمناسبة عيد ميلاد لُجين. مخطوطة عتيقة، موسيقى كلاسيكية، وحكاية لا تشبه غيرها.',
    url: 'https://3bud-zc.github.io/loji/',
    nameArabic: 'لُجين',
    nameEnglish: 'Loji'
  },
  opening: {
    forLabel: 'For Loji',
    greeting: 'إلى لُجين',
    poeticLine: 'التي كان من سوء حظ الشعراء أنها جاءت بعدهم.',
    buttonText: 'افتحي المخطوطة'
  },
  hero: {
    titleArabic: 'لُجين',
    tashkeelName: 'لُـجَـيْـن',
    subtitle: 'بعض الأسماء تُقال، وبعضها يُروى.',
    manuscriptMetadata: {
      edition: 'المخطوطة الأولى • نسخة فريدة',
      paper: 'ورق عاجيّ معتق',
      ink: 'حبر دافئ لا يبهت',
      occasion: 'في ليلة تزهو بذكرى ميلادها'
    }
  },
  littleWorld: {
    sectionTitle: 'عوالمُها الصغيرة',
    sectionSubtitle: 'تفاصيل تصنع سحر الحضور وتمنح الأشياء طعمها العتيق',
    items: [
      {
        id: 'poetry',
        title: 'الشعر',
        tag: 'ديوان الشعور',
        description: 'تلك الأبيات التي تلمس الروح دون استئذان، وتلتقط ما عجزت عنه الكلمات العادية.',
        quote: '«ولقد ذكرتُكِ والرماحُ نواهلٌ مني... وبِيضُ الهندِ تقطرُ من دمي»',
        symbol: 'feather'
      },
      {
        id: 'old-songs',
        title: 'الأغاني القديمة',
        tag: 'صوت الزمن الجميل',
        description: 'حيث الدقيقة في اللحن رواية كاملة، وصوت أم كلثوم وعبد الوهاب يداوي ضجيج العالم.',
        quote: '«يا مسافر وحدك وفايتني... ليه تبعد عني وتشغلني؟»',
        symbol: 'vinyl'
      },
      {
        id: 'night',
        title: 'الليل',
        tag: 'ملاذ السكينة',
        description: 'ساعات الصفاء الهادئة، حيث تنام المدينة ويبقى الشعر والموسيقى والأفكار الصادقة.',
        quote: '«والليلُ إن أقبلَ بالهدوءِ، أحيا فينا ما أماتهُ الصباح»',
        symbol: 'moon'
      },
      {
        id: 'classics',
        title: 'الكلاسيكيات',
        tag: 'أناقة لا تفنى',
        description: 'الأشياء التي تكتسب جمالها مع مرور الزمن: الروايات القديمة، الورق الأصفر، والقهوة الدافئة.',
        quote: '«الجمال الحقيقي لا يصرخ، بل يهمس بنبلٍ يدوم للأبد»',
        symbol: 'scroll'
      },
      {
        id: 'books',
        title: 'الكتب',
        tag: 'حياة أخرى',
        description: 'رائحة الصفحات القديمة والسفر بين العصور دون أن تغادري مقعدكِ المفضل.',
        quote: '«بين دفتي كتاب، نجد أجزاءً من أرواحنا لم نكن نعرف أنها ضاعت»',
        symbol: 'book'
      },
      {
        id: 'words',
        title: 'الكلمات التي تبقى',
        tag: 'صدق الأثر',
        description: 'العبارات التي لا تموت بمجرد قولها، بل تسكن القلب وتصنع فارقاً حقيقياً.',
        quote: '«ليست العبرة بكثرة الكلام، بل بالكلمة التي تبقى بعد أن يصمت الجميع»',
        symbol: 'inkwell'
      }
    ]
  },
  poetryMoment: {
    sectionTitle: 'في حضرة الشعراء',
    sectionSubtitle: 'حوار عبر القرون بين قصائد الماضي ومقام الحاضر',
    scenes: [
      {
        poetId: 'qays',
        poetName: 'قيس بن الملوح',
        poetEra: 'العصر الأموي • مجنون ليلى',
        verses: [
          'أَمُرُّ عَلى الدِيارِ دِيارِ لَيلى',
          'أُقَبِّلُ ذا الجِدارَ وَذا الجِدارا',
          'وَما حُبُّ الدِيارِ شَغَفنَ قَلبِي',
          'وَلَكِن حُبُّ مَن سَكَنَ الدِيارا'
        ],
        commentary: 'لو كان قيس قد عرفكِ يا لُجين، لربما تغيّر اسم الحكاية كلياً.',
        isOriginal: false
      },
      {
        poetId: 'imru',
        poetName: 'امرؤ القيس',
        poetEra: 'العصر الجاهلي • أمير شعراء المعلقات',
        verses: [
          'وَلَيلٍ كَمَوجِ البَحرِ أَرخى سُدولَهُ',
          'عَلَيَّ بِأَنواعِ الهُمومِ لِيَبتَلي',
          'فَقُلتُ لَهُ لَمّا تَمَطّى بِصُلبِهِ',
          'وَأَردَفَ أَعجازاً وَناءَ بِكَلْكَلِ'
        ],
        commentary: 'كانوا يبحثون في عتمة الليل عن أسبابٍ للشعر... وأنتِ ببهائكِ الشعرُ كله.',
        isOriginal: false
      },
      {
        poetId: 'and-i',
        poetName: 'وأنا',
        poetEra: 'هنا والآن • صوت الصفحة الحاضرة',
        verses: [
          'وأنا لا أُجيدُ ما أجادوه،',
          'لكنني أعرفُ أنكِ تستحقين صفحةً بين قصائدهم.',
          'قالوا إن الشعراء كانوا يبالغون في وصف من يقدّرون،',
          'ثم عرفتكِ، وفهمتُ أن المشكلة ربما لم تكن في الشعراء.'
        ],
        commentary: 'تستحقين مكاناً بين أرقّ السطور وأصفى الكلمات.',
        isOriginal: true
      }
    ]
  },
  memories: {
    sectionTitle: 'ألبوم الأيام والأثر',
    sectionSubtitle: 'محطات معلقة برقة، كصفحات وُضعت بين دفتي كتاب عتيق',
    items: [
      {
        id: 'memory-1',
        title: 'أوراق وظلال',
        caption: '«أثر الفراشة لا يزول... وأثر الروح الطيبة يبقى كعطرٍ قديم»',
        tag: 'أثر الورد المجفف',
        dateText: 'فصل من الهدوء',
        placeholderType: 'botanical'
      },
      {
        id: 'memory-2',
        title: 'حرفٌ وانسجام',
        caption: '«الخطوط العربية حين تلتقي برهافة المعنى تصنع خلوداً صامتاً»',
        tag: 'مخطوط عتيق',
        dateText: 'سطور منتقاة',
        placeholderType: 'calligraphy'
      },
      {
        id: 'memory-3',
        title: 'ألحان الزمن',
        caption: '«كل نغمة قديمة تحمل في طياتها صدى أيامٍ لا تتكرر»',
        tag: 'أسطوانة فينيل',
        dateText: 'طرب أصيل',
        placeholderType: 'vinyl'
      },
      {
        id: 'memory-4',
        title: 'بين الكتب والقهوة',
        caption: '«أجمل الأوقات تلك التي نقضيها برفقة كتابٍ يفهمنا وفنجان هادئ»',
        tag: 'ركن القراءة',
        dateText: 'سكينة المساء',
        placeholderType: 'book'
      }
    ]
  },
  music: {
    sectionTitle: 'جراموفون الذكريات',
    sectionSubtitle: 'أنصتي إلى نغمٍ هادئ ينبثق من دفء الماضي ليعيد للمساء رونقه',
    recordLabel: 'تسجيلات الزمن الجميل',
    vinylSub: 'أسطوانة مخصصة لـ لُجين • دورة ٣٣⅓',
    note: 'اضغطي على الأسطوانة لبدء العزف الكلاسيكي اللطيف',
    tracks: [
      {
        id: 'ambient-vintage',
        title: 'لحن المساء الكلاسيكي (Vintage Acoustic)',
        artist: 'عزف دافئ خاص بالموقع',
        durationDisplay: '∞'
      }
    ]
  },
  personalWishes: {
    sectionTitle: 'حاجات أتمنى تفضلي محتفظة بيها',
    sectionSubtitle: 'أشياء صغيرة تصنع فيكِ كل هذا الاختلاف',
    wishes: [
      'فضولكِ الصادق نحو اكتشاف المعاني والجمال الكامن في الأشياء.',
      'طريقتكِ الخاصة في سماع الأغاني وكأن كل لحن حكاية تُروى لكِ وحدكِ.',
      'حبكِ العميق للكلمات التي لا يلتفت إليها العابرون برغم ما تحمله من سحر.',
      'التفاصيل الصغيرة التي تلاحظينها بعين ذواقة وروح شاعرة.',
      'هدوءكِ وأناقة حضوركِ وبساطتكِ التي تجعل كل مجلس أفضل.'
    ]
  },
  birthdayReveal: {
    leadIn: 'واليوم...',
    transitionText: 'تُقلب القصيدة إلى صفحة جديدة.',
    mainWishArabic: 'كل سنة وأنتِ لُـجَـيْـن.',
    mainWishEnglish: 'Happy Birthday, Loji',
    subNote: 'سنة جديدة تتجدد فيها أيامكِ بالمسرات والقصائد والموسيقى الرائقة.'
  },
  finalLetter: {
    sealTag: 'آخر حاجة',
    envelopeLabel: 'رسالة مختومة بالشمع الأحمر',
    tapPrompt: 'انقري لكسر الختم وقراءة الرسالة',
    letterHeader: 'إلى لُجين العزيزة،',
    bodyParagraphs: [
      'كل سنة وأنتِ الحكاية التي كان يستحق الشعر أن يعرفها ويخلد تفاصيلها.',
      'دمتِ كما أنتِ دائماً: قارئة واعية للجمال، صاحبة ذوق كلاسيكي رفيع، وصديقة يندر أن يجود الزمان بمثل لطفها ونقائها.',
      'أتمنى لكِ في عامكِ الجديد أياماً هادئة كقصيدة خريفية، ملهمة كنغمة عود أصيلة، وممتلئة بكل ما يبهج روحكِ الجميلة.'
    ],
    signature: 'صديقٌ يقدّر حضوركِ وأثركِ',
    signatureDate: 'سبتمبر ٢٠٢٦'
  }
};
