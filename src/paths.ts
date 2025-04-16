

export const paths = {
  index: '/',
  checkout: '/checkout',
  contact: '/contact',
  pricing: '/pricing',
  auth: {


    firebase: {
      login: '/auth/firebase/login',
      register: '/auth/firebase/register',
      forgot: '/auth/firebase/forgot-password',
    },

  },
  authDemo: {
    forgotPassword: {
      classic: '/auth-demo/forgot-password/classic',
      modern: '/auth-demo/forgot-password/modern',
    },
    login: {
      classic: '/auth-demo/login/classic',
      modern: '/auth-demo/login/modern',
    },
    register: {
      classic: '/auth-demo/register/classic',
      modern: '/auth-demo/register/modern',
    },
    resetPassword: {
      classic: '/auth-demo/reset-password/classic',
      modern: '/auth-demo/reset-password/modern',
    },
    verifyCode: {
      classic: '/auth-demo/verify-code/classic',
      modern: '/auth-demo/verify-code/modern',
    },
  },
  dashboard: {
    index: '/dashboard',



    academy: {
      index: '/dashboard/academy',
      courseDetails: '/dashboard/academy/courses/:courseId',
    },
    account: '/dashboard/account',
    analytics: '/dashboard/analytics',
    blank: '/dashboard/blank',
    capsules: {
      index: '/capsules',
      postDetails: '/capsules/:postId',
      postCreate: '/capsules/create',
    },

    calendar: '/dashboard/calendar',
    chat: '/dashboard/chat',
    crypto: '/dashboard/crypto',
    contentManager: '/dashboard/content-manager',
    modules: '/dashboard/modules',
    categories: '/dashboard/categories',

lyricWriter: '/dashboard/lyric-writer',
    scriptWriter: '/dashboard/script-writer',
    recipeGen: '/dashboard/recipe-generator',
    dietPlanner: '/dashboard/diet-planner',
    poemGenerator: '/dashboard/poem-generator',
    speechWriter: '/dashboard/speech-writer',
    seoArticleWriter: '/dashboard/seo-article-writer',
    contentWriter: '/dashboard/content-writer',
    uniAnswers: '/dashboard/uni-answers',
    resumeMaker: '/dashboard/resume-maker',
    resumeBuilder: '/dashboard/resume-builder',
    imageGenerator: '/dashboard/image-generator',
    travelAgent: '/dashboard/travel-agent',
    images: '/dashboard/images',
      cocktailCrafter: '/dashboard/cocktail-crafter',
    magicMirror: '/dashboard/magic-mirror',
    philosophyWriter: '/dashboard/philosophy-writer',
    dessertGenerator: '/dashboard/dessert-generator',
    bookSummariser: '/dashboard/book-summariser',
    translator: '/dashboard/translator',
      storyGenerator: '/dashboard/story-generator',
      fruitsNVeges: '/dashboard/fruits-n-veges',
      stockSelector: '/dashboard/stock-selector',
        dreamInterpretation: '/dashboard/dream-interpretation',
    essayWriter: '/dashboard/essay-writer',
    financialAdvisor: '/dashboard/financial-advisor',
    careerDeveloper: '/dashboard/career-developer',
      interiorDesigner: '/dashboard/interior-designer',
    startABusiness: '/dashboard/start-a-business',
      investmentAdvisor: '/dashboard/investment-advisor',
    editor: '/dashboard/editor',
    templateReplicator: `/dashboard/template-replicator`,
    howToMake: '/dashboard/how-to-make',
    realEstate: '/dashboard/real-estate',
    health: '/dashboard/health',
    codeConverter: '/dashboard/code-converter',
     tweetGenerator: '/dashboard/tweet-generator',
    biblicalFigures: '/dashboard/biblical-figures',
    myContent: '/dashboard/my-content',
    myImages: '/dashboard/images',
    idiomTranslator: '/dashboard/idiom-translator',
    govPositions: '/dashboard/government-positions',
    articulate: '/dashboard/articulate',
    detector: '/dashboard/detector',
    azureTranslator: '/dashboard/live-translator',

    chatGPT: '/dashboard/chatgpt',
    customers: {
      index: '/dashboard/customers',
      details: '/dashboard/customers/:customerId',
      edit: '/dashboard/customers/:customerId/edit',
    },
    content: {
      index: '/dashboard/content',
      postDetails: '/dashboard/content/:postId',
      postCreate: '/dashboard/content/create',

    },

    overview: '/dashboard/overview',

    fileManager: '/dashboard/file-manager',
    invoices: {
      index: '/dashboard/invoices',
      details: '/dashboard/invoices/:orderId',
    },



    mail: '/dashboard/mail',
    orders: {
      index: '/dashboard/orders',
      details: '/dashboard/orders/:orderId',
    },


      authDemo: {
          forgotPassword: {
              classic: '/auth-demo/forgot-password/classic',
              modern: '/auth-demo/forgot-password/modern',
          },
          login: {
              classic: '/auth-demo/login/classic',
              modern: '/auth-demo/login/modern',
          },
          register: {
              classic: '/auth-demo/register/classic',
              modern: '/auth-demo/register/modern',
          },
          resetPassword: {
              classic: '/auth-demo/reset-password/classic',
              modern: '/auth-demo/reset-password/modern',
          },
          verifyCode: {
              classic: '/auth-demo/verify-code/classic',
              modern: '/auth-demo/verify-code/modern',
          },
      },



    products: {
      index: '/dashboard/products',
      create: '/dashboard/products/create',
    },
    social: {
      index: '/dashboard/social',
      profile: '/[UserUrl}.tsx',
        capsules: '/capsules/my-docs.tsx',
      feed: '/profile/feed',
    },
  },
  components: {
    index: '/components',
    dataDisplay: {
      detailLists: '/components/data-display/detail-lists',
      tables: '/components/data-display/tables',
      quickStats: '/components/data-display/quick-stats',
    },
    lists: {
      groupedLists: '/components/lists/grouped-lists',
      gridLists: '/components/lists/grid-lists',
    },
    forms: '/components/forms',
    modals: '/components/modals',

    charts: '/components/charts',
    buttons: '/components/buttons',
    typography: '/components/typography',
    colors: '/components/colors',
    inputs: '/components/inputs',
  },
  docs: 'https://material-kit-pro-react-docs.devias.io',
  notAuthorized: '/401',
  notFound: '/404',
  serverError: '/500',
};
