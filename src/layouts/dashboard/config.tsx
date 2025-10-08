//src/layouts/dashboard/config.tsx
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


  const [userRole, setUserRole] = useState<string>('');
  const [userPlan, setUserPlan] = useState<string>('');

  useEffect(() => {
    if (currentUser) {
      const userDocRef = doc(db, 'users', currentUser.uid);
      getDoc(userDocRef)
        .then((docSnapshot) => {
          if (docSnapshot.exists()) {
            const userData = docSnapshot.data();

            setUserRole(userData.role || '');
            setUserPlan(userData.plan || ''); // Default to empty string if undefined
          }
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
        });
    }
  }, [currentUser]);

  return useMemo(() => {
    const hasPremiumOrBusiness = userPlan === 'Premium' || userPlan === 'Business';
    const isAdmin = userRole === 'admin';
    const isAffiliate = userRole === 'Affiliate';


    // 🚀 If Affiliate, give them their own sidebar
    if (isAffiliate) {
      return [
        {
          items: [
            {
              title: t(tokens.nav.dashboard),
              path: paths.dashboard.index,   // send them to /dashboard/affiliates/index.tsx
              icon: <SvgIcon fontSize="small"><HomeSmileIcon /></SvgIcon>,
            },
            {
              title: t(tokens.nav.account),
              path: paths.dashboard.account,
              icon: <SvgIcon fontSize="small"><AccountBox /></SvgIcon>,
            }
          ]
        }
      ];
    }

    return [
      {
        items: [
          {
            title: t(tokens.nav.dashboard),
            path: paths.dashboard.index,
            icon: <SvgIcon fontSize="small"><HomeSmileIcon /></SvgIcon>,
          },
          {
            title: t(tokens.nav.account),
            path: paths.dashboard.account,
            icon: <SvgIcon fontSize="small"><AccountBox /></SvgIcon>,
          },
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
        ],
      },
      {
        subheader: t(tokens.nav.AIStudio),
        items: [

          {
            title: t(tokens.nav.chatGPT),
            path: paths.dashboard.chatGPT,
            icon: <SvgIcon fontSize="small"><File03 /></SvgIcon>,
          },
          {
            title: t(tokens.nav.modules),
            path: paths.dashboard.modules,
            icon: <SvgIcon fontSize="small"><Atom01 /></SvgIcon>,
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

          // ...(hasPremiumOrBusiness
//   ? [{
//       title: t(tokens.headings.liveTranslator),
//       path: paths.dashboard.azureTranslator,
//       icon: <SvgIcon fontSize="small"><File03 /></SvgIcon>,
//     }]
//   : []),


        ],
      },
      ...(hasPremiumOrBusiness
        ? [
          {
            items: [
              // Add any additional items for Premium or Business users here
            ],
          },
        ]
        : []),
      ...(isAdmin
        ? [
          {
            subheader: t(tokens.nav.pages),
            items: [
              {
                title: t(tokens.form.videoGenerator),
                path: paths.dashboard.videoGenerator,
                icon: <SvgIcon fontSize="small"><Atom01 /></SvgIcon>,
              },



              {
                title: t(tokens.nav.adminModules),
                path: '',
                icon: <SvgIcon fontSize="small"><Android /></SvgIcon>,
                items: [

                  { title: t(tokens.headings.govPositions), path: paths.dashboard.govPositions },

                  { title: t(tokens.headings.codeConverter), path: paths.dashboard.codeConverter },
                  { title: t(tokens.headings.contentDetector), path: paths.dashboard.detector },
                  { title: t(tokens.headings.liveTranslator), path: paths.dashboard.azureTranslator },


                ],
              },

              {
                title: t(tokens.nav.customers),
                path: paths.dashboard.customers.index,
                icon: <SvgIcon fontSize="small"><Users03Icon /></SvgIcon>,
                items: [
                  { title: t(tokens.nav.list), path: paths.dashboard.customers.index },
                ],
              },
              {
                title: t(tokens.nav.health),
                path: paths.dashboard.health,
                icon: <SvgIcon fontSize="small"><Atom01 /></SvgIcon>,
              },
              {
                title: t(tokens.nav.auth),
                icon: <SvgIcon fontSize="small"><Lock01Icon /></SvgIcon>,
                items: [
                  {
                    title: t(tokens.nav.login),
                    items: [
                      { title: 'Classic', path: paths.authDemo.login.classic },
                      { title: 'Modern', path: paths.authDemo.login.modern },
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
              {
                title: t(tokens.nav.pricing),
                path: paths.pricing,
                icon: <SvgIcon fontSize="small"><CreditCard01Icon /></SvgIcon>,
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
  }, [t, userRole, userPlan]);
};
