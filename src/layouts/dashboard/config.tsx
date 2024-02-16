import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import SvgIcon from '@mui/material/SvgIcon';
import { useEffect, useMemo, useState } from 'react';

import HomeSmileIcon from 'src/icons/untitled-ui/duocolor/home-smile';
import Lock01Icon from 'src/icons/untitled-ui/duocolor/lock-01';
import CreditCard01Icon from 'src/icons/untitled-ui/duocolor/credit-card-01';

import Users03Icon from 'src/icons/untitled-ui/duocolor/users-03';
import XSquareIcon from 'src/icons/untitled-ui/duocolor/x-square';
import { tokens } from 'src/locales/tokens';
import { paths } from 'src/paths';
import { db, auth } from 'src/libs/firebase';
import { doc, getDoc } from 'firebase/firestore';
import {Image01, Pencil02, Atom01, File03, File05} from "@untitled-ui/icons-react";

import { AccountBox, Android, Work} from "@mui/icons-material";





export interface Item {
  disabled?: boolean;
  external?: boolean;
  icon?: ReactNode;
  items?: Item[];
  label?: ReactNode;
  path?: string;
  title: string;
}

export interface Section {
  items: Item[];
  subheader?: string;
}




export const useSections = () => {
  const { t } = useTranslation();

  const { currentUser } = auth;

  const [userUrl, setUserUrl] = useState(null);
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    if (currentUser) {
      const userDocRef = doc(db, 'users', currentUser.uid);
      getDoc(userDocRef)
          .then((docSnapshot) => {
            if (docSnapshot.exists()) {
              const userData = docSnapshot.data();
              setUserUrl(userData.userUrl);
              setUserRole(userData.role);
            }
          })
          .catch((error) => {
            console.error("Error fetching user data:", error);
          });
    }
  }, [currentUser]);





  return useMemo(() => {
      return [
        {
          subheader: t(tokens.nav.dashboard),
          items: [
            {
              title: t(tokens.nav.overview),
              path: paths.dashboard.index,
              icon: <SvgIcon fontSize="small"><HomeSmileIcon /></SvgIcon>,
            },
            {
              title: t(tokens.nav.account),
              path: paths.dashboard.account,
              icon: <SvgIcon fontSize="small"><AccountBox /></SvgIcon>,
            },
            ],
        },
        {
          subheader: t(tokens.nav.AIStudio),
          items: [
            {
              title: t(tokens.nav.modules),
              path: paths.dashboard.modules,
              icon: <SvgIcon fontSize="small"><Work /></SvgIcon>,
            },

            {
              title: t(tokens.nav.categories),
              path: paths.dashboard.categories,
              icon: <SvgIcon fontSize="small"><Atom01 /></SvgIcon>,
            },


            {
              title: t(tokens.nav.chatGPT),
              path: paths.dashboard.chatGPT,
              icon: <SvgIcon fontSize="small"><File03 /></SvgIcon>,
            },


            {
              title: t(tokens.nav.imageGenerator),
              path: paths.dashboard.imageGenerator,
              icon: <SvgIcon fontSize="small"><Image01 /></SvgIcon>,
            },
            {
              title: t(tokens.nav.contentWriter),
              path: paths.dashboard.contentWriter,
              icon: <SvgIcon fontSize="small"><Pencil02 /></SvgIcon>,
            },
            {
              title: t(tokens.nav.myTools),
              path: '', // empty or undefined since it's a parent menu item
              icon: <SvgIcon fontSize="small"><Atom01 /></SvgIcon>,
              items: [
                {
                  title: t(tokens.nav.contentGenerators),
                  path: '',
                  icon: <SvgIcon fontSize="small"><Pencil02 /></SvgIcon>,
                  items: [
                    { title: t(tokens.headings.lyricWriter), path: paths.dashboard.lyricWriter },
                    { title: t(tokens.headings.scriptWriter), path: paths.dashboard.scriptWriter },
                    { title: t(tokens.headings.recipeWriter), path: paths.dashboard.recipeGen },
                    { title: t(tokens.headings.poemGenerator), path: paths.dashboard.poemGenerator },
                    { title: t(tokens.headings.seoArticleWriter), path: paths.dashboard.seoArticleWriter },
                    { title: t(tokens.headings.essayWriter), path: paths.dashboard.essayWriter },
                    { title: t(tokens.headings.editor), path: paths.dashboard.editor },
                  ]
                },
                {
                  title: t(tokens.nav.plannersNOrganisers),
                  items: [
                    { title: t(tokens.headings.dietPlanner), path: paths.dashboard.dietPlanner },

                  ]
                },
                {
                  title: t(tokens.nav.creativeCorner),
                  items: [
                    { title: t(tokens.headings.storyGenerator), path: paths.dashboard.storyGenerator },
                    { title: t(tokens.headings.dreamInterpretation), path: paths.dashboard.dreamInterpretation },
                    { title: t(tokens.headings.magicMirror), path: paths.dashboard.magicMirror },
                    { title: t(tokens.headings.philosophyWriter), path: paths.dashboard.philosophyWriter },
                    { title: t(tokens.headings.interiorDesigner), path: paths.dashboard.interiorDesigner },
                    { title: t(tokens.headings.howToMake), path: paths.dashboard.howToMake },

                  ]
                },
                {
                  title: t(tokens.nav.proServices),
                  items: [
                    { title: t(tokens.headings.resumeBuilder), path: paths.dashboard.resumeBuilder },
                    { title: t(tokens.headings.speechWriter), path: paths.dashboard.speechWriter },
                    { title: t(tokens.headings.translator), path: paths.dashboard.translator },
                    { title: t(tokens.headings.careerDeveloper), path: paths.dashboard.careerDeveloper },
                    { title: t(tokens.headings.startABusiness), path: paths.dashboard.startABusiness },
                    { title: t(tokens.headings.investmentAdvisor), path: paths.dashboard.investmentAdvisor },
                    { title: t(tokens.headings.uniAnswers), path: paths.dashboard.uniAnswers },

                  ]
                },
                {
                  title: t(tokens.nav.lifestyleNLeisure),
                  items: [
                    { title: t(tokens.headings.travelAgent), path: paths.dashboard.travelAgent },
                    { title: t(tokens.headings.cocktailCrafter), path: paths.dashboard.cocktailCrafter },
                    { title: t(tokens.headings.dessertGenerator), path: paths.dashboard.dessertGenerator },
                    { title: t(tokens.headings.bookSummariser), path: paths.dashboard.bookSummariser },
                    { title: t(tokens.headings.fruitsNVeges), path: paths.dashboard.fruitsNVeges },
                    { title: t(tokens.headings.tweetGenerator), path: paths.dashboard.tweetGenerator },
                  ]
                }
              ]
            }
          ],
        },
      ...(userRole.includes('admin')
          ? [
            {
              subheader: t(tokens.nav.pages),
              items: [

                {
                  title: t(tokens.nav.myContent),
                  path: paths.dashboard.content.index,
                  icon: <SvgIcon fontSize="small"><File05 /></SvgIcon>,

                },

                {
                  title: t(tokens.nav.myImages),
                  path: paths.dashboard.myImages,
                  icon: <SvgIcon fontSize="small"><Image01 /></SvgIcon>,

                },
                {
                  title: t(tokens.nav.customers),
                  path: paths.dashboard.customers.index,
                  icon: <SvgIcon fontSize="small"><Users03Icon /></SvgIcon>,
                  items: [
                    { title: t(tokens.nav.list),
                      path: paths.dashboard.customers.index },
                  ],
                },


                {
                  title: t(tokens.nav.adminModules),
                  path: '',
                  icon: <SvgIcon fontSize="small"><Android /></SvgIcon>,
                  items: [
                    {title: t(tokens.headings.templateReplicator),  path: paths.dashboard.templateReplicator},
                    { title: t(tokens.headings.codeConverter), path: paths.dashboard.codeConverter },


                  ]
                },


                {
                  title: t(tokens.nav.health),
                  path: paths.dashboard.health,
                  icon: <SvgIcon fontSize="small"><Atom01 /></SvgIcon>,
                },


            {
              title: t(tokens.nav.auth),
              icon: (
                  <SvgIcon fontSize="small"><Lock01Icon /></SvgIcon>
              ),
              items: [
                {
                  title: t(tokens.nav.login),
                  items: [
                    { title: 'Classic',
                      path: paths.authDemo.login.classic },
                    { title: 'Modern',
                      path: paths.authDemo.login.modern },
                  ],
                },
                {
                  title: t(tokens.nav.register),
                  items: [
                    { title: 'Classic', path: paths.authDemo.register.classic },
                    { title: 'Modern', path: paths.authDemo.register.modern },
                  ],
                },


              {
                title: t(tokens.nav.forgotPassword),
                items: [
                  { title: 'Classic', path: paths.authDemo.forgotPassword.classic },
                  { title: 'Modern', path: paths.authDemo.forgotPassword.modern },
                ],
              },
              {
                title: t(tokens.nav.resetPassword),
                items: [
                  { title: 'Classic', path: paths.authDemo.resetPassword.classic },
                  { title: 'Modern', path: paths.authDemo.resetPassword.modern },
                ],
              },
              {
                title: t(tokens.nav.verifyCode),
                items: [
                  { title: 'Classic', path: paths.authDemo.verifyCode.classic },
                  { title: 'Modern', path: paths.authDemo.verifyCode.modern },
                ],
              },



          {
            title: t(tokens.nav.error),
            icon: <SvgIcon fontSize="small"><XSquareIcon /></SvgIcon>,
            items: [
              { title: '401', path: paths.notAuthorized },
              { title: '404', path: paths.notFound },
              { title: '500', path: paths.serverError },
            ],


            },

            ],
            },

                {
                  title: t(tokens.nav.pricing),
                  path: paths.pricing,
                  icon: (
                    <SvgIcon fontSize="small">
                      <CreditCard01Icon />
                    </SvgIcon>
                  ),
                },


                {
                  title: t(tokens.nav.components),
                  path: paths.components.index,
                  icon: <SvgIcon fontSize="small"><HomeSmileIcon /></SvgIcon>,
                },

            ],
            },
            ]
            : []),
    ];
    }
    , [t, userRole, userUrl]);
}



